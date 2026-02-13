import crypto from 'crypto';
import { promises as fs } from 'fs';
import { resolveKeyFilePath } from './config';
import { logger } from '../logger';

/**
 * HimKosh Encryption/Decryption Utilities
 * Based on CTP Technical Specification
 * 
 * Algorithm: AES-128 (Rijndael)
 * Mode: CBC
 * Padding: PKCS7
 * Key Size: 128 bits (16 bytes)
 * Block Size: 128 bits (16 bytes)
 */

export class HimKoshCrypto {
  private keyFilePath: string;
  private key: Buffer | null = null;
  private iv: Buffer | null = null;
  private log = logger.child({ module: "himkosh-crypto" });

  constructor(keyFilePath?: string) {
    this.keyFilePath = resolveKeyFilePath(keyFilePath);
  }

  /**
   * Load encryption key and IV from file
   * CRITICAL FIX #3: DLL uses IV = key (first 16 bytes), NOT separate IV
   * Key file format from CTP:
   * - Must be exactly 16 bytes for the key
   * - IV is set equal to the key (actual DLL behavior)
   */
  private async loadKey(): Promise<{ key: Buffer; iv: Buffer }> {
    if (this.key && this.iv) {
      this.log.debug('Using cached key/IV');
      return { key: this.key, iv: this.iv };
    }

    try {
      this.log.debug('Loading key from file', { path: this.keyFilePath });
      const keyData = await fs.readFile(this.keyFilePath);
      this.log.debug('Read key file', { bytes: keyData.length });

      // Extract first 16 bytes as key (even if file is longer)
      const keyBytes = Buffer.alloc(16);
      keyData.copy(keyBytes, 0, 0, Math.min(16, keyData.length));
      this.key = keyBytes;
      this.log.debug('Key loaded', { bytes: 16 });

      // CRITICAL FIX #3: Use key as IV (first 16 bytes of echallan.key)
      // This matches actual DLL behavior (doc/dummy code was misleading)
      this.iv = keyBytes; // IV = key (same buffer reference)
      this.log.debug('IV aligned with key (DLL behavior)');

      return { key: this.key, iv: this.iv };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Key file not found at: ${this.keyFilePath}. Please obtain echallan.key from CTP team or set HIMKOSH_KEY_FILE_PATH.`);
    }
  }

  /**
   * Encrypt data string using AES-128-CBC
   * .NET backend expects ASCII encoding (NOT UTF-8)
   * @param textToEncrypt - Plain text string to encrypt
   * @returns Base64 encoded encrypted string
   */
  async encrypt(textToEncrypt: string): Promise<string> {
    try {
      const { key, iv } = await this.loadKey();

      // Create cipher with separate key and IV
      const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

      // CRITICAL: Use 'ascii' encoding to match .NET's Encoding.ASCII (NOT UTF-8)
      let encrypted = cipher.update(textToEncrypt, 'ascii', 'base64');
      encrypted += cipher.final('base64');

      return encrypted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Encryption failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Decrypt data string using AES-128-CBC
   * .NET backend uses ASCII encoding (NOT UTF-8)
   * @param textToDecrypt - Base64 encoded encrypted string
   * @returns Decrypted plain text string
   */
  async decrypt(textToDecrypt: string): Promise<string> {
    try {
      const { key, iv } = await this.loadKey();

      // Create decipher with separate key and IV
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

      // CRITICAL: Use 'ascii' encoding to match .NET's Encoding.ASCII.GetString()
      let decrypted = decipher.update(textToDecrypt, 'base64', 'ascii');
      decrypted += decipher.final('ascii');

      return decrypted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Decryption failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generate MD5 checksum for data string.
   * HimKosh reference DLL emits lowercase hexadecimal using UTF-8 bytes.
   * @param dataString - String to generate checksum for
   * @returns MD5 checksum in lowercase hexadecimal
   */
  static generateChecksum(dataString: string): string {
    const hash = crypto.createHash('md5');
    hash.update(dataString, 'utf8');
    return hash.digest('hex');
  }

  /**
   * Verify checksum of received data
   * @param dataString - Data string without checksum
   * @param receivedChecksum - Checksum to verify against
   * @returns true if checksums match (case-insensitive comparison)
   */
  static verifyChecksum(dataString: string, receivedChecksum: string): boolean {
    const calculatedChecksum = this.generateChecksum(dataString);
    return calculatedChecksum.toUpperCase() === receivedChecksum.toUpperCase();
  }
}

/**
 * Build pipe-delimited request string for HimKosh
 * @param params - Request parameters
 * @returns Object with coreString (for checksum) and fullString (for encryption)
 */
export function buildRequestString(params: {
  deptId: string;
  deptRefNo: string;
  totalAmount: number;
  tenderBy: string;
  appRefNo: string;
  head1: string;
  amount1: number;
  ddo: string;
  periodFrom: string;
  periodTo: string;
  head2?: string;
  amount2?: number;
  head3?: string;
  amount3?: number;
  head4?: string;
  amount4?: number;
  head10?: string;
  amount10?: number;
  serviceCode?: string;
  returnUrl?: string;
}): { coreString: string; fullString: string } {
  // Build base string (mandatory fields)
  // CRITICAL: Field ORDER must match government code EXACTLY!
  // CRITICAL FIX #2: All amounts must be integers (no decimals)
  const coreParts = [
    `DeptID=${params.deptId}`,
    `DeptRefNo=${params.deptRefNo}`,
    `TotalAmount=${Math.round(params.totalAmount)}`, // Ensure integer
    `TenderBy=${params.tenderBy}`,
    `AppRefNo=${params.appRefNo}`,
    `Head1=${params.head1}`,
    `Amount1=${Math.round(params.amount1)}`, // Ensure integer
  ];

  // Add Head2/Amount2 BEFORE Ddo (government code order)
  // CRITICAL: Government code includes Head2/Amount2 ALWAYS (even if Amount2=0) if it's configured.
  // We'll follow the safe path: if provided, include it. If strict alignment is needed, this logic may need to be "Always include empty"
  // But for now, let's assume "Always" meant "Don't put it after DDO".
  if (
    params.head2 &&
    params.amount2 !== undefined &&
    Math.round(params.amount2) > 0
  ) {
    coreParts.push(`Head2=${params.head2}`);
    coreParts.push(`Amount2=${Math.round(params.amount2)}`); // Ensure integer
  }

  // Add Ddo AFTER Head2/Amount2
  coreParts.push(`Ddo=${params.ddo}`);
  coreParts.push(`PeriodFrom=${params.periodFrom}`);
  coreParts.push(`PeriodTo=${params.periodTo}`);

  if (params.head3 && params.amount3 && params.amount3 > 0) {
    coreParts.push(`Head3=${params.head3}`);
    coreParts.push(`Amount3=${Math.round(params.amount3)}`);
  }
  if (params.head4 && params.amount4 && params.amount4 > 0) {
    coreParts.push(`Head4=${params.head4}`);
    coreParts.push(`Amount4=${Math.round(params.amount4)}`);
  }
  if (params.head10 && params.amount10 && params.amount10 > 0) {
    coreParts.push(`Head10=${params.head10}`);
    coreParts.push(`Amount10=${Math.round(params.amount10)}`);
  }
  if (params.head10 && params.amount10 && params.amount10 > 0) {
    coreParts.push(`Head10=${params.head10}`);
    coreParts.push(`Amount10=${Math.round(params.amount10)}`);
  }

  if (params.serviceCode) {
    coreParts.push(`Service_code=${params.serviceCode}`);
  }
  if (params.returnUrl) {
    coreParts.push(`return_url=${params.returnUrl}`);
  }

  const dataString = coreParts.join('|');
  return { coreString: dataString, fullString: dataString };
}

/**
 * Parse pipe-delimited response string from HimKosh
 * @param responseString - Decrypted response string
 * @returns Parsed response object
 */
export function parseResponseString(responseString: string): {
  echTxnId: string;
  bankCIN: string;
  bank: string;
  status: string;
  statusCd: string;
  appRefNo: string;
  amount: string;
  paymentDate: string;
  deptRefNo: string;
  bankName: string;
  checksum: string;
} {
  const parts = responseString.split('|');
  const data: Record<string, string> = {};

  for (const part of parts) {
    const [rawKey, value] = part.split('=');
    if (rawKey && value !== undefined) {
      const key = rawKey.trim().toLowerCase();
      data[key] = value;
    }
  }

  return {
    echTxnId: data.echtxnid || '',
    bankCIN: data.bankcin || '',
    bank: data.bank || '',
    status: data.status || '',
    statusCd: data.statuscd || '',
    appRefNo: data.apprefno || '',
    amount: data.amount || '',
    paymentDate: data.payment_date || '',
    deptRefNo: data.deptrefno || '',
    bankName: data.bankname || '',
    checksum: data.checksum || '',
  };
}

/**
 * Build double verification request string (for AppVerification.aspx - currently non-functional)
 * NOTE: AppVerification.aspx returns "checksum mismatch" for ALL formats tested (45+ variations).
 * Use verifyChallanViaSearch() instead for reliable verification.
 * @param params - Verification parameters
 * @returns Pipe-delimited string with checksum
 */
export function buildVerificationString(params: {
  appRefNo: string;
  serviceCode: string;
  merchantCode: string;
}): string {
  const coreString = `AppRefNo=${params.appRefNo}|Service_code=${params.serviceCode}`;
  const checksum = HimKoshCrypto.generateChecksum(coreString);
  return `${coreString}|checkSum=${checksum}`;
}

/**
 * SearchChallan-based verification result
 */
export interface SearchChallanResult {
  found: boolean;
  transId: string;       // echTxnId / HIMGRN
  receiptNo: string;     // Bank receipt number
  status: string;        // e.g. "Completed successfully. DD-MM-YYYY HH:MM:SS"
  tenderBy: string;      // Depositor + bank info
  service: string;       // Service description + refs
  amount: string;        // Transaction amount
  receiptDate: string;   // Receipt date string
  isSuccess: boolean;    // Parsed: was the transaction successful?
  appRefNo: string;      // Extracted from service field
  deptRefNo: string;     // Extracted from service field
}

/**
 * Verify a transaction via the public SearchChallan.aspx page.
 * This is a reliable alternative to AppVerification.aspx which has undocumented
 * checksum requirements. SearchChallan allows searching by date range and depositor
 * name, then we match our transaction ID from the results.
 *
 * @param params.searchUrl   - URL to SearchChallan.aspx
 * @param params.tenderBy    - The TenderBy value used in the original transaction
 * @param params.fromDate    - Search from date (DD-MM-YYYY)
 * @param params.toDate      - Search to date (DD-MM-YYYY)
 * @param params.echTxnId    - Expected transaction ID to match in results
 * @param params.appRefNo    - Expected AppRefNo (for cross-validation in service field)
 * @returns Parsed verification result
 */
export async function verifyChallanViaSearch(params: {
  searchUrl: string;
  tenderBy: string;
  fromDate: string;
  toDate: string;
  echTxnId: string;
  appRefNo: string;
}): Promise<SearchChallanResult> {
  const emptyResult: SearchChallanResult = {
    found: false,
    transId: '',
    receiptNo: '',
    status: '',
    tenderBy: '',
    service: '',
    amount: '',
    receiptDate: '',
    isSuccess: false,
    appRefNo: params.appRefNo,
    deptRefNo: '',
  };

  // Step 1: GET the page to extract ASP.NET hidden fields + session cookie
  const getResp = await fetch(params.searchUrl);
  const html = await getResp.text();

  const vsMatch = html.match(/name="__VIEWSTATE"[^>]*value="([^"]*)"/);
  const vsgMatch = html.match(/name="__VIEWSTATEGENERATOR"[^>]*value="([^"]*)"/);
  const evMatch = html.match(/name="__EVENTVALIDATION"[^>]*value="([^"]*)"/);

  if (!vsMatch || !evMatch) {
    throw new Error('SearchChallan: Failed to extract ASP.NET form fields');
  }

  // Extract session cookie
  const setCookies = getResp.headers.getSetCookie?.() ?? [];
  const cookieHeader = setCookies.map((c: string) => c.split(';')[0]).join('; ');

  // Step 2: POST search query
  const searchBody = new URLSearchParams({
    '__VIEWSTATE': vsMatch[1],
    '__VIEWSTATEGENERATOR': vsgMatch?.[1] ?? '',
    '__VIEWSTATEENCRYPTED': '',
    '__EVENTVALIDATION': evMatch[1],
    'ctl00$ContentPlaceHolder1$txtFromDate': params.fromDate,
    'ctl00$ContentPlaceHolder1$txtToDate': params.toDate,
    'ctl00$ContentPlaceHolder1$txtTenderBy': params.tenderBy.substring(0, 30), // max 30 chars
    'ctl00$ContentPlaceHolder1$paymode': '1', // 1 = Online
    'ctl00$ContentPlaceHolder1$btnSubmitR': 'SEARCH CHALLAN',
  });

  const searchResp = await fetch(params.searchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader,
    },
    body: searchBody.toString(),
  });

  const resultHtml = await searchResp.text();

  // Step 3: Parse results
  // Extract label values using ASP.NET grid label IDs
  const extractLabel = (labelPrefix: string, index: number = 0): string => {
    const regex = new RegExp(
      `id="[^"]*${labelPrefix}_${index}"[^>]*>([^<]*)`,
      'i',
    );
    const match = resultHtml.match(regex);
    return match?.[1]?.trim() ?? '';
  };

  // Strategy: match by echTxnId if available, otherwise match by appRefNo in the service field
  let rowIndex = -1;
  for (let i = 0; i < 50; i++) {
    const transId = extractLabel('lblTransId', i);
    if (!transId) break;

    // Primary match: echTxnId
    if (params.echTxnId && transId === params.echTxnId) {
      rowIndex = i;
      break;
    }

    // Fallback match: appRefNo in the service/description field (case-insensitive)
    if (!params.echTxnId && params.appRefNo) {
      const svc = extractLabel('lblService', i);
      if (svc.toUpperCase().includes(params.appRefNo.toUpperCase())) {
        rowIndex = i;
        break;
      }
    }
  }

  if (rowIndex < 0) {
    return emptyResult;
  }

  const transId = extractLabel('lblTransId', rowIndex);
  const receiptNo = extractLabel('lblreceipt_no', rowIndex);
  const status = extractLabel('lblStatus', rowIndex);
  const tenderBy = extractLabel('lblTenderBy', rowIndex);
  const service = extractLabel('lblService', rowIndex);
  const amount = extractLabel('lblAmount', rowIndex);
  const receiptDate = extractLabel('lblReceiptDt', rowIndex);

  // Extract DeptRefNo and AppRefNo from service field
  // Format: ". REGISTRATION OF HOTEL... #HP-HS-2026-CHM-00830 *TSM:HPT1770742751438HCQS"
  const deptRefMatch = service.match(/#([A-Z0-9-]+)/);
  const appRefMatch = service.match(/\*[A-Z]+:([A-Z0-9]+)/i);

  const isSuccess = status.toLowerCase().includes('completed successfully');

  return {
    found: !!transId,
    transId,
    receiptNo,
    status,
    tenderBy,
    service,
    amount,
    receiptDate,
    isSuccess,
    appRefNo: appRefMatch?.[1] ?? params.appRefNo,
    deptRefNo: deptRefMatch?.[1] ?? '',
  };
}

