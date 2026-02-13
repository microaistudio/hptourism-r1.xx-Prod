# HimKosh Payment Gateway Integration — Final Working Specification (R1)

**Version:** R1 — 11-Feb-2026  
**Status:** ✅ Fully Working (Payment + Verification)  
**Platform:** Node.js / TypeScript  
**Gateway:** HimKosh eChallan (https://himkosh.hp.nic.in)  
**Contact:** CTP Team, Dept of Treasuries & Accounts, HP  

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment Configuration](#2-environment-configuration)
3. [Encryption & Checksum](#3-encryption--checksum)
4. [Payment Initiation Flow](#4-payment-initiation-flow)
5. [Callback Handling](#5-callback-handling)
6. [Double Verification (SearchChallan)](#6-double-verification-searchchallan)
7. [Broken Transaction Recovery](#7-broken-transaction-recovery)
8. [Database Schema](#8-database-schema)
9. [File Structure](#9-file-structure)
10. [Setup Checklist](#10-setup-checklist)
11. [Troubleshooting & Lessons Learned](#11-troubleshooting--lessons-learned)

---

## 1. Architecture Overview

```
┌──────────────┐    ┌──────────────┐    ┌────────────────────────┐
│   Frontend   │───▶│   Backend    │───▶│  HimKosh Gateway       │
│  (React)     │    │  (Express)   │    │  wrfApplicationRequest │
│              │◀───│              │◀───│  .aspx                 │
└──────────────┘    └──────┬───────┘    └────────────────────────┘
                          │
                          │  Double Verification
                          ▼
                   ┌────────────────────────┐
                   │  SearchChallan.aspx    │
                   │  (Public search page)  │
                   └────────────────────────┘
```

### Three Flows

| Flow | Endpoint | Method |
|------|----------|--------|
| **Payment Initiation** | `wrfApplicationRequest.aspx` | POST form (browser redirect) |
| **Payment Callback** | Our `/api/himkosh/callback` | POST (server receives encrypted response) |
| **Double Verification** | `SearchChallan.aspx` | GET + POST (server-to-server scraping) |

> **⚠️ IMPORTANT:** `AppVerification.aspx` is **NOT functional** for our integration. After 45+ format variations tested, it always returns "checksum mismatch". Use `SearchChallan.aspx` instead.

---

## 2. Environment Configuration

### Required `.env` Variables

```bash
# === HimKosh Gateway Endpoints ===
HIMKOSH_PAYMENT_URL=https://himkosh.hp.nic.in/echallan/WebPages/wrfApplicationRequest.aspx
HIMKOSH_VERIFICATION_URL=https://himkosh.hp.nic.in/eChallan/webpages/AppVerification.aspx
HIMKOSH_CHALLAN_PRINT_URL=https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx
HIMKOSH_SEARCH_URL=https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx

# === Merchant/Department Configuration (from CTP team) ===
HIMKOSH_MERCHANT_CODE=HIMKOSH230       # Unique per department
HIMKOSH_DEPT_ID=230                    # Department ID
HIMKOSH_SERVICE_CODE=TSM               # Service code assigned by CTP
HIMKOSH_DDO_CODE=CTO00-068             # Default DDO (overridden per district)
HIMKOSH_HEAD=1452-00-800-01            # Budget head code
HIMKOSH_HEAD2=                         # Optional secondary head
HIMKOSH_HEAD2_AMOUNT=                  # Optional secondary head amount

# === Callback & Key ===
HIMKOSH_RETURN_URL=https://your-domain.com/api/himkosh/callback
HIMKOSH_KEY_FILE_PATH=server/himkosh/echallan.key

# === Development ===
HIMKOSH_ALLOW_DEV_FALLBACK=true        # Allow ₹1 test payments
```

### Key File (`echallan.key`)

- Provided by CTP team (binary file, 32 bytes)
- First 16 bytes = AES key
- IV = Key (first 16 bytes used for both — this is a critical finding)
- Must be placed at `server/himkosh/echallan.key` (or path in env)
- **NEVER commit to git** — add to `.gitignore`

---

## 3. Encryption & Checksum

### Algorithm: AES-128-CBC

| Parameter | Value |
|-----------|-------|
| Algorithm | AES-128 (Rijndael) |
| Mode | CBC |
| Padding | PKCS7 (Node default) |
| Key Size | 128 bits (16 bytes) |
| Block Size | 128 bits (16 bytes) |
| Input Encoding | ASCII (`'ascii'` in Node) |
| Output Format | Base64 |

### ⚠️ Critical: IV = Key

The .NET DLL (`eChallanED.dll`) sets **IV equal to the Key** (both are the first 16 bytes of the key file). This is non-standard but confirmed working.

```typescript
// Load key
const keyData = fs.readFileSync('echallan.key');
const key = keyData.subarray(0, 16);
const iv = key; // IV = Key (CRITICAL: DLL behavior)

// Encrypt
const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
let encrypted = cipher.update(plaintext, 'ascii', 'base64');
encrypted += cipher.final('base64');

// Decrypt
const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
let decrypted = decipher.update(ciphertext, 'base64', 'ascii');
decrypted += decipher.final('ascii');
```

### Checksum: MD5 (lowercase hex, UTF-8)

```typescript
const checksum = crypto.createHash('md5')
  .update(dataString, 'utf8')
  .digest('hex'); // lowercase hex
```

| Property | Value |
|----------|-------|
| Algorithm | MD5 |
| Input Encoding | UTF-8 |
| Output Format | **Lowercase** hexadecimal |
| Comparison | Case-insensitive |

---

## 4. Payment Initiation Flow

### Step 1: Build the Pipe-Delimited String

**Format:** `key=value|key=value|...|checkSum=<md5>`

**Field Order (CRITICAL — must match exactly):**

```
DeptID=230
DeptRefNo=HP-HS-2026-CHM-008306       # Application number
TotalAmount=1                          # Integer only (no decimals!)
TenderBy=John Doe                      # Applicant name
AppRefNo=HPT1770742751438hCQs          # Unique reference (generated)
Head1=1452-00-800-01                   # Budget head
Amount1=1                              # Integer only
[Head2=xxxx|Amount2=xx]                # Optional, BEFORE Ddo
Ddo=CHM00-532                          # District DDO code
PeriodFrom=10-02-2026                  # DD-MM-YYYY
PeriodTo=09-02-2027                    # DD-MM-YYYY
Service_code=TSM
return_url=https://your-domain.com/api/himkosh/callback
checkSum=<md5_of_entire_string_above>
```

### Step 2: Compute Checksum

Checksum is computed on the **FULL string** (including `Service_code` and `return_url`, but NOT `checkSum` itself):

```typescript
const fullStringWithoutChecksum = coreParts.join('|');
// fullStringWithoutChecksum = "DeptID=230|DeptRefNo=...|...|return_url=https://..."
const checksum = HimKoshCrypto.generateChecksum(fullStringWithoutChecksum);
const fullStringWithChecksum = `${fullStringWithoutChecksum}|checkSum=${checksum}`;
```

### Step 3: Encrypt

```typescript
const encryptedData = await hkCrypto.encrypt(fullStringWithChecksum);
```

### Step 4: Submit via Browser Form POST

The frontend renders a hidden form and auto-submits it:

```html
<form method="POST" action="https://himkosh.hp.nic.in/echallan/WebPages/wrfApplicationRequest.aspx">
  <input type="hidden" name="encdata" value="<base64_encrypted_string>" />
  <input type="hidden" name="merchant_code" value="HIMKOSH230" />
</form>
```

**Key Points:**
- `merchant_code` is a **separate POST field** (NOT inside `encdata`)
- The checksum IS inside `encdata` (as part of the encrypted pipe string)
- Form is auto-submitted via JavaScript on page load
- User is redirected to HimKosh payment page

### AppRefNo Generation

```typescript
const appRefNo = `HPT${Date.now()}${nanoid(4)}`;
// e.g. "HPT1770742751438hCQs"
```

---

## 5. Callback Handling

### Endpoint: `POST /api/himkosh/callback`

HimKosh redirects the user back with encrypted data in the POST body.

### Step 1: Receive & Decrypt

```typescript
const encData = req.body.encData || req.body.encdata;
const decryptedResponse = await hkCrypto.decrypt(encData);
```

### Step 2: Parse Response

Response is pipe-delimited: `key=value|key=value|...`

```
echTxnId=A26B199644          # HimKosh transaction ID (HIMGRN)
bankCIN=CPAGXXXXXX           # Bank reference
bank=SBI                     # Bank name
status=success               # Status text
statuscd=1                   # Status code (1=success, 0=failure)
apprefno=HPT17707427...      # Our AppRefNo (for matching)
amount=1                     # Amount paid
payment_date=10/02/2026      # Payment date
deptrefno=HP-HS-2026-...     # Our DeptRefNo
bankname=SBI                 # Bank name
checksum=<md5>               # Checksum for verification
```

### Step 3: Verify Response Checksum

```typescript
// Strip checksum from response, calculate on remaining string
const dataWithoutChecksum = decryptedResponse.replace(/\|checksum=[^|]+$/i, '');
const isValid = HimKoshCrypto.verifyChecksum(dataWithoutChecksum, parsedResponse.checksum);
```

### Step 4: Update Database

On success (`statuscd=1`):
- Set `transactionStatus = 'success'`
- Set `echTxnId`, `bankCIN`, etc.
- Update application: `draft → submitted` or `payment_pending → submitted`
- Sync documents from JSONB

On failure (`statuscd=0`):
- Set `transactionStatus = 'failed'`
- Show failure page to user

### Step 5: Render Result Page

A self-contained HTML page is returned (no framework dependency) showing payment status and redirecting to the portal.

---

## 6. Double Verification (SearchChallan)

### Why Not `AppVerification.aspx`?

After extensive testing (45+ format variations), `AppVerification.aspx` consistently returns `"checksum mismatch"`. The endpoint appears to use undocumented checksum/encryption requirements that differ from the payment initiation flow. Even sending the **original accepted encrypted request** back fails.

### Solution: SearchChallan.aspx Scraping

`SearchChallan.aspx` is a publicly accessible page on the HimKosh portal that allows searching for challans by date, depositor name, and payment mode. We leverage this for server-to-server verification.

### How It Works

```
1. GET SearchChallan.aspx
   → Extract __VIEWSTATE, __EVENTVALIDATION, session cookie

2. POST SearchChallan.aspx with:
   - __VIEWSTATE, __VIEWSTATEGENERATOR, __VIEWSTATEENCRYPTED, __EVENTVALIDATION
   - txtFromDate (DD-MM-YYYY)
   - txtToDate (DD-MM-YYYY)
   - txtTenderBy (applicant name, max 30 chars)
   - paymode = 1 (Online)
   - btnSubmitR = "SEARCH CHALLAN"
   - Cookie header with ASP.NET session ID

3. Parse HTML response:
   - Match transaction by echTxnId (primary) or AppRefNo in service field (fallback)
   - Extract: TransId, ReceiptNo, Status, Amount, ReceiptDate
```

### Data Extracted

| Label ID | Field | Example |
|----------|-------|---------|
| `lblTransId` | HIMGRN / echTxnId | `A26B199644` |
| `lblreceipt_no` | Bank Receipt | `CPAGHPSRD1` |
| `lblStatus` | Status | `Completed successfully. 10-02-2026 22:30:23` |
| `lblTenderBy` | Depositor + Bank | `Chamba Main[SBI]*IN FAVOUR OF: (CHM00-532)` |
| `lblService` | Service Description | `...#HP-HS-2026-CHM-00830 *TSM:HPT1770742751438HCQS` |
| `lblAmount` | Amount | `1` |
| `lblReceiptDt` | Receipt Date | `10-02-2026 22:29:29` |

### AppRefNo Extraction from Service Field

The service field contains embedded references:
```
. REGISTRATION OF HOTEL,TRAVEL AGENT AND GUIDES #HP-HS-2026-CHM-00830 *TSM:HPT1770742751438HCQS
                                                  ^^^^^^^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^^^^^
                                                  DeptRefNo (after #)           AppRefNo (after *TSM:)
```

Regex patterns:
```typescript
const deptRefNo = service.match(/#([A-Z0-9-]+)/)?.[1];
const appRefNo = service.match(/\*[A-Z]+:([A-Z0-9]+)/i)?.[1];
```

### API Route: `POST /api/himkosh/verify/:appRefNo`

- Accepts both transactions WITH and WITHOUT `echTxnId`
- For transactions with `echTxnId` → matches by transaction ID
- For transactions without `echTxnId` (broken) → matches by AppRefNo in service field
- On success: recovers `echTxnId`, updates transaction and application status

### Verified Test Results

```json
{
  "found": true,
  "transId": "A26B200468",
  "receiptNo": "CPAGHQBYR6",
  "status": "Completed Successfully. 11-02-2026 09:21:35",
  "amount": "1",
  "isSuccess": true,
  "appRefNo": "HPT1770781846794GBHG",
  "deptRefNo": "HP-HS-2026-SML-00830"
}
```

---

## 7. Broken Transaction Recovery

### Scenario

User initiates payment → completes payment on HimKosh → browser closes / callback fails → our DB has `status=initiated`, `echTxnId=null`.

### Recovery Flow

1. Admin clicks "Verify Payment Status" on the transaction
2. Backend searches HimKosh by `tenderBy` + date range
3. Matches via AppRefNo in the service description field
4. If found and successful:
   - **Recovers `echTxnId`** from HimKosh
   - Sets `transactionStatus = 'success'` then `'verified'`
   - Updates application status (draft → submitted)
   - Sets `isDoubleVerified = true`

### Key Recovery Fields Updated

```typescript
{
  echTxnId: result.transId,           // Recovered from SearchChallan
  respondedAt: new Date(),
  transactionStatus: 'success',
  statusCd: '1',
  isDoubleVerified: true,
  doubleVerificationData: { ... },    // Full verification record
}
```

---

## 8. Database Schema

### Table: `himkosh_transactions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `applicationId` | UUID | FK to homestay_applications |
| `deptRefNo` | VARCHAR | Application number (HP-HS-...) |
| `appRefNo` | VARCHAR | Unique payment reference (HPTxxx) |
| `totalAmount` | INTEGER | Payment amount |
| `tenderBy` | VARCHAR(70) | Applicant/depositor name |
| `merchantCode` | VARCHAR | HIMKOSH230 |
| `deptId` | VARCHAR | 230 |
| `serviceCode` | VARCHAR | TSM |
| `ddo` | VARCHAR | District DDO code |
| `head1` | VARCHAR | Budget head |
| `amount1` | INTEGER | Amount for head1 |
| `encryptedRequest` | TEXT | Base64 encrypted request (stored for reference) |
| `requestChecksum` | VARCHAR | MD5 checksum of request |
| `echTxnId` | VARCHAR | HimKosh HIMGRN (null until callback/recovery) |
| `bankCIN` | VARCHAR | Bank reference number |
| `bankName` | VARCHAR | Payment bank |
| `paymentDate` | TIMESTAMP | When payment was made |
| `status` | VARCHAR | Raw status text |
| `statusCd` | VARCHAR | 1=success, 0=failure |
| `transactionStatus` | VARCHAR | initiated/success/failed/verified |
| `isDoubleVerified` | BOOLEAN | SearchChallan verification done |
| `doubleVerificationDate` | TIMESTAMP | When verification occurred |
| `doubleVerificationData` | JSONB | Full SearchChallan result |
| `portalBaseUrl` | VARCHAR | Which portal instance |
| `initiatedAt` | TIMESTAMP | Payment initiated |
| `respondedAt` | TIMESTAMP | Callback received (or recovered) |
| `verifiedAt` | TIMESTAMP | Double verification timestamp |

---

## 9. File Structure

```
server/himkosh/
├── config.ts           # Configuration loading & validation
├── crypto.ts           # Encryption, checksums, request/response string builders,
│                       #   SearchChallan verification function
├── routes.ts           # All API routes (initiate, callback, verify, transactions)
├── gatewayConfig.ts    # DDO-to-district resolver
├── echallan.key        # Binary key file (16 bytes key, IV=key) — NOT in git
└── callbackPage.ts     # HTML template for callback result page
```

### Key Functions in `crypto.ts`

| Function | Purpose |
|----------|---------|
| `HimKoshCrypto.encrypt()` | AES-128-CBC encrypt (ASCII input, Base64 output) |
| `HimKoshCrypto.decrypt()` | AES-128-CBC decrypt (Base64 input, ASCII output) |
| `HimKoshCrypto.generateChecksum()` | MD5 hash (UTF-8 input, lowercase hex output) |
| `HimKoshCrypto.verifyChecksum()` | Compare checksums (case-insensitive) |
| `buildRequestString()` | Build pipe-delimited payment request |
| `parseResponseString()` | Parse pipe-delimited callback response |
| `verifyChallanViaSearch()` | SearchChallan.aspx scraping for verification |

### Key Routes in `routes.ts`

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/himkosh/initiate` | POST | Initiate payment (returns encdata for form) |
| `/api/himkosh/callback` | POST | Receive payment callback from HimKosh |
| `/api/himkosh/verify/:appRefNo` | POST | Double-verify via SearchChallan |
| `/api/himkosh/transactions` | GET | List all transactions (admin) |
| `/api/himkosh/test-encryption` | POST | Test encrypt/decrypt (dev only) |

---

## 10. Setup Checklist

### First-Time Setup

- [ ] **Obtain from CTP team:**
  - `echallan.key` (binary encryption key file)
  - Merchant Code (e.g., `HIMKOSH230`)
  - Department ID (e.g., `230`)
  - Service Code (e.g., `TSM`)
  - Budget Head codes (e.g., `1452-00-800-01`)
  - DDO codes per district
  - Callback URL whitelisted on their end

- [ ] **Place `echallan.key`** at `server/himkosh/echallan.key`

- [ ] **Configure `.env`** with all variables from Section 2

- [ ] **Run database migration** (schema includes `himkosh_transactions` table)

- [ ] **Test with ₹1 payment:**
  1. Set `HIMKOSH_ALLOW_DEV_FALLBACK=true`
  2. Create a test application
  3. Initiate payment → complete on HimKosh → verify callback
  4. Test double verification via SearchChallan

- [ ] **Verify all three flows work:**
  - ✅ Payment initiation (browser redirect to HimKosh)
  - ✅ Callback receipt (HimKosh redirects back with encrypted data)
  - ✅ Double verification (SearchChallan scraping confirms payment)

### Production Deployment

- [ ] Set `HIMKOSH_RETURN_URL` to production domain
- [ ] Ensure `echallan.key` is deployed (not in git, deploy manually)
- [ ] Set all DDO codes correctly per district
- [ ] Disable `HIMKOSH_ALLOW_DEV_FALLBACK`
- [ ] Test with a real ₹1 payment before going live

---

## 11. Troubleshooting & Lessons Learned

### ✅ Working Findings

1. **IV = Key:** The .NET DLL uses the SAME 16 bytes for both key and IV. This is the single most critical finding. Without this, nothing encrypts/decrypts correctly.

2. **Checksum on FULL string:** The checksum is computed on the entire pipe-delimited string INCLUDING `Service_code` and `return_url`, but EXCLUDING `checkSum` itself. This contradicts some documentation that says "checksum on CORE string only."

3. **Lowercase hex checksum:** Despite some docs saying uppercase, the working checksum is **lowercase hexadecimal** from MD5.

4. **`merchant_code` as separate POST field:** It is NOT included inside the encrypted `encdata`. It's a standalone form field.

5. **Integer amounts only:** All amount fields (`TotalAmount`, `Amount1`, etc.) must be integers. `1.00` will fail — use `1`.

6. **ASCII encoding for encryption:** Both encrypt and decrypt use `'ascii'` encoding (for standard ASCII strings, this is equivalent to UTF-8).

### ❌ Non-Working / Dead Ends

1. **`AppVerification.aspx`** — Returns "checksum mismatch" for ALL formats. Tested 45+ variations including:
   - Original encrypted request (that was accepted for payment)
   - Every field ordering combination
   - Separate checksum POST field
   - UTF-8 vs ASCII encoding
   - Different IV (second 16 bytes of key file)
   - VIEWSTATE fields
   - Different POST field names

2. **Checksum on "CORE string" (DeptID to PeriodTo only)** — This is what early documentation said, but it's WRONG. Checksum must be on the full string including Service_code and return_url.

3. **Uppercase checksums** — Some docs say `X2` format (uppercase hex). The working format is lowercase.

4. **IV from second 16 bytes of key file** — Does not work. IV must equal the key.

### ⚡ SearchChallan Caveats

- The `txtTenderBy` field has a `maxlength=30` — truncate longer names
- Radio button `paymode=1` is Online, `paymode=2` is Offline
- Results are paginated — our code checks up to 50 rows
- Session cookies `ASP.NET_SessionId` must be forwarded from GET to POST
- The page uses `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__VIEWSTATEENCRYPTED`, and `__EVENTVALIDATION` — all must be extracted and sent

---

## Appendix: Working Test Data

### Successful Payment (Verified)

```
AppRefNo:   HPT1770742751438hCQs
DeptRefNo:  HP-HS-2026-CHM-008306
echTxnId:   A26B199644
Amount:     ₹1
TenderBy:   Chamba Main
Bank:       SBI
Receipt:    CPAGHPSRD1
Status:     Completed successfully. 10-02-2026 22:30:23
Checksum:   463d20401553452b7a077944bd9210dd (lowercase)
```

### Broken Transaction (Recovered via SearchChallan)

```
AppRefNo:   HPT1770781846794gbHG
DeptRefNo:  HP-HS-2026-SML-008307
echTxnId:   A26B200468 (recovered!)
Amount:     ₹1
TenderBy:   Test Payment
Status:     Completed Successfully. 11-02-2026 09:21:35
Receipt:    CPAGHQBYR6
Note:       Callback never received; echTxnId recovered via SearchChallan
```

---

*Document created: 11-Feb-2026 | Based on extensive R&D and live testing against production HimKosh gateway*
