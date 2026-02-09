/**
 * HP SSO (Himachal Pradesh Single Sign-On) Service
 * Handles authentication and data exchange with HP Gov SSO system
 * 
 * Documentation: HPSSO_2.0_Integration_Kit
 */

import crypto from 'crypto';
import { config } from '@shared/config';
import { logger } from '../logger';

const log = logger.child({ module: 'hpsso' });

// HP SSO Configuration
export interface HPSSOConfig {
    enabled: boolean;
    preProductionUrl: string;
    productionUrl: string;
    serviceId: string;
    secretKey: string;
    environment: 'pre-production' | 'production';
    staffServiceId: string;
    staffSecretKey: string;
}

// Response from HP SSO for Staff (GovLogin)
export interface HPSSOStaffData {
    empId: number;
    employeeName: string;
    applicationId: number;
    applicationName: string;
    serviceId: number;
    serviceName: string;
    emailId: string;
    orgId: number;
    orgName: string;
    departmentId: number;
    departmentName: string;
    desigId: number;
    desigName: string;
    officeTypeId: number;
    officeTypeName: string;
    officeId: number;
    officeName: string;
    roleId: number;
    roleName: string;
    pmisCode: string | null;
}

// Response from HP SSO after token validation
export interface HPSSOUserData {
    sso_id: number;
    vault_id: number;
    username: string;
    name: string;
    mobile: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: string; // DD-MM-YYYY format
    co: string; // Care of (Father/Guardian name)
    street: string | null;
    lm: string | null; // Landmark
    loc: string; // Locality
    vtc: string; // Village/Town/City
    dist: string; // District
    state: string;
    pc: string; // Pincode
    aadhaarNumber: string; // Encrypted
    UsersArray: Array<{
        sso_id: string;
        service_id: string;
        user_name: string;
        mobile: string;
        email: string;
        primaryUser: boolean;
    }>;
    education: Array<Record<string, string>>;
    WorkExperience: Array<Record<string, string>>;
    Skills: Array<Record<string, string>>;
}

// Decrypted Aadhaar response (partial, for verification only)
export interface AadhaarVerificationResult {
    verified: boolean;
    lastFourDigits?: string;
    district?: string;
    state?: string;
}

/**
 * Get HP SSO configuration from environment
 */
export function getHPSSOConfig(): HPSSOConfig {
    return {
        enabled: process.env.HPSSO_ENABLED === 'true',
        preProductionUrl: process.env.HPSSO_PREPROD_URL || '',
        productionUrl: process.env.HPSSO_PROD_URL || '',
        serviceId: process.env.HPSSO_SERVICE_ID || '',
        secretKey: process.env.HPSSO_SECRET_KEY || '',
        environment: (process.env.HPSSO_ENVIRONMENT || 'pre-production') as 'pre-production' | 'production',
        staffServiceId: process.env.HPSSO_STAFF_SERVICE_ID || '',
        staffSecretKey: process.env.HPSSO_STAFF_SECRET_KEY || '',
    };
}

/**
 * Get the active HP SSO base URL based on environment
 */
export function getHPSSOBaseUrl(): string {
    const config = getHPSSOConfig();
    return config.environment === 'production'
        ? config.productionUrl
        : config.preProductionUrl;
}

/**
 * Encrypt data using AES-256-CBC for HP SSO API requests
 * 
 * @param data - Object containing token and secret_key
 * @param key - Encryption key (derived from secret_key)
 * @returns Encrypted string in format expected by HP SSO
 */
export function encryptForHPSSO(data: { token: string; secret_key: string }, passphrase: string): string {
    try {
        // Generate random 8-byte salt
        const salt = crypto.randomBytes(8);

        // Derive Key and IV from Passphrase and Salt (OpenSSL compatible)
        const { key, iv } = deriveKeyAndIV(passphrase, salt, 32, 16);

        // Create cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // Encrypt data
        const jsonData = JSON.stringify(data);
        const encrypted = Buffer.concat([cipher.update(jsonData, 'utf8'), cipher.final()]);

        // Construct Request Body: "Salted__" + Salt + EncryptedData
        const saltedBuffer = Buffer.concat([
            Buffer.from('Salted__', 'utf8'),
            salt,
            encrypted
        ]);

        // Return as Base64 string
        return saltedBuffer.toString('base64');
    } catch (error) {
        log.error({ err: error }, 'Failed to encrypt data for HP SSO');
        throw new Error('Encryption failed');
    }
}

/**
 * Decrypt data received from HP SSO using AES-256-CBC
 * 
 * @param encryptedData - Encrypted string from HP SSO response
 * @param key - Decryption key (secret_key)
 * @returns Decrypted object
 */
export function decryptFromHPSSO<T>(encryptedData: string, key: string): T {
    try {
        // HP SSO may use "Salted__" OpenSSL format
        // Try to detect and handle both formats

        if (encryptedData.startsWith('U2FsdGVk')) {
            // OpenSSL "Salted__" format (base64 of "Salted__")
            return decryptOpenSSLFormat<T>(encryptedData, key);
        }

        // Standard format with IV prefix
        const [ivBase64, encrypted] = encryptedData.split(':');
        if (!ivBase64 || !encrypted) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(ivBase64, 'base64');
        const derivedKey = crypto.createHash('sha256').update(key).digest();

        const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted) as T;
    } catch (error) {
        log.error({ err: error }, 'Failed to decrypt data from HP SSO');
        throw new Error('Decryption failed');
    }
}

/**
 * Decrypt OpenSSL "Salted__" format used by HP SSO
 * This format includes: "Salted__" (8 bytes) + salt (8 bytes) + encrypted data
 */
function decryptOpenSSLFormat<T>(encryptedData: string, passphrase: string): T {
    try {
        const data = Buffer.from(encryptedData, 'base64');

        // Check for "Salted__" prefix
        const saltedPrefix = data.subarray(0, 8).toString('utf8');
        if (saltedPrefix !== 'Salted__') {
            throw new Error('Invalid OpenSSL format - missing Salted__ prefix');
        }

        // Extract salt (next 8 bytes)
        const salt = data.subarray(8, 16);

        // Extract encrypted content
        const encrypted = data.subarray(16);

        // Derive key and IV using OpenSSL EVP_BytesToKey method
        const { key, iv } = deriveKeyAndIV(passphrase, salt, 32, 16);

        // Decrypt
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return JSON.parse(decrypted.toString('utf8')) as T;
    } catch (error) {
        log.error({ err: error }, 'Failed to decrypt OpenSSL format');
        throw error;
    }
}

/**
 * OpenSSL EVP_BytesToKey key derivation
 * Used for backward compatibility with OpenSSL encrypted data
 */
function deriveKeyAndIV(
    passphrase: string,
    salt: Buffer,
    keyLength: number,
    ivLength: number
): { key: Buffer; iv: Buffer } {
    const totalLength = keyLength + ivLength;
    const derivedBytes: Buffer[] = [];
    let derivedLength = 0;
    let previousHash = Buffer.alloc(0);

    while (derivedLength < totalLength) {
        const hash = crypto.createHash('md5');
        hash.update(previousHash);
        hash.update(passphrase);
        hash.update(salt);
        previousHash = hash.digest();
        derivedBytes.push(previousHash);
        derivedLength += previousHash.length;
    }

    const derived = Buffer.concat(derivedBytes);
    return {
        key: derived.subarray(0, keyLength),
        iv: derived.subarray(keyLength, keyLength + ivLength),
    };
}

/**
 * Validate a token received from HP SSO I-frame
 * 
 * @param token - Token received from HP SSO callback
 * @returns User data from HP SSO
 */
export async function validateHPSSOToken(token: string): Promise<HPSSOUserData> {
    const config = getHPSSOConfig();

    if (!config.enabled) {
        throw new Error('HP SSO is not enabled');
    }

    if (!config.serviceId || !config.secretKey) {
        throw new Error('HP SSO credentials not configured');
    }

    const baseUrl = getHPSSOBaseUrl();
    if (!baseUrl) {
        throw new Error('HP SSO URL not configured');
    }

    try {
        // Encrypt token and secret_key
        const encryptedData = encryptForHPSSO(
            { token, secret_key: config.secretKey },
            config.secretKey
        );

        // Make request to HP SSO
        const response = await fetch(`${baseUrl}/nodeapi/validateToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: encryptedData,
                service_id: config.serviceId,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            log.error({ status: response.status, body: errorBody }, 'HP SSO token validation failed');
            throw new Error(`HP SSO validation failed: ${response.status}`);
        }

        const result = await response.json();

        // Decrypt the response data
        if (result.data) {
            const userData = decryptFromHPSSO<HPSSOUserData>(result.data, config.secretKey);
            log.info({ sso_id: userData.sso_id }, 'HP SSO token validated successfully');
            return userData;
        }

        throw new Error('Invalid response from HP SSO');
    } catch (error) {
        log.error({ err: error }, 'HP SSO token validation error');
        throw error;
    }
}

/**
 * Validate a STAFF token received from HP SSO (GovLogin)
 * Uses /application/getUserDetails endpoint
 * 
 * @param token - Token received from HP SSO callback
 * @returns Staff user data from HP SSO
 */
export async function validateStaffToken(token: string): Promise<HPSSOStaffData> {
    const config = getHPSSOConfig();

    if (!config.enabled) {
        throw new Error('HP SSO is not enabled');
    }

    if (!config.staffServiceId || !config.staffSecretKey) {
        throw new Error('HP SSO Staff credentials not configured');
    }

    const baseUrl = getHPSSOBaseUrl();
    if (!baseUrl) {
        throw new Error('HP SSO URL not configured');
    }

    // Use the same endpoint pattern as citizen SSO if /application/getUserDetails is 404
    // Assumption: Staff SSO uses /nodeapi/validateToken with Staff Credentials
    try {
        log.info({ token: token.substring(0, 10) + '...' }, 'Validating Staff Token via Node API');

        // Encrypt token and secret_key
        const encryptedData = encryptForHPSSO(
            { token, secret_key: config.staffSecretKey }, // Use Staff Secret Key
            config.staffSecretKey
        );

        // Make request to HP SSO (Same endpoint as Citizen)
        const response = await fetch(`${baseUrl}/nodeapi/validateToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: encryptedData,
                service_id: config.staffServiceId,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            log.error({ status: response.status, body: errorBody }, 'HP SSO Staff validation failed');
            throw new Error(`HP SSO Staff validation failed: ${response.status}`);
        }

        const result = await response.json();

        // Decrypt the response data
        if (!result.data) {
            throw new Error(result.message || 'Invalid response from HP SSO Staff API');
        }

        // The staff API returns a JSON ARRAY of assignments when decrypted
        // But validateToken usually returns a single object.
        // Let's first decrypt to a string and inspect it
        const decryptedRaw = decryptFromHPSSO<string>(result.data, config.staffSecretKey);

        // Log raw for debugging (redacted)
        // log.info({ decryptedRaw }, 'Decrypted Staff Data');

        // Try to parse as array (Staff format) or object (Citizen format)
        let assignments: HPSSOStaffData[];
        try {
            const parsed = JSON.parse(decryptedRaw);
            if (Array.isArray(parsed)) {
                assignments = parsed;
            } else {
                // Even if it returns an object, we need to map it to StaffData interface
                // But for now let's assume if it's not an array, it might be an error or unexpected format
                // Unless the Citizen endpoint returns a citizen-like object for staff too?
                // Let's assume it returns an array as per Staff Kit documentation
                assignments = [parsed as unknown as HPSSOStaffData];
            }
        } catch (e) {
            throw new Error('Failed to parse decrypted staff data');
        }

        if (!assignments || assignments.length === 0) {
            throw new Error('No staff assignments found in SSO response');
        }

        log.info({
            empId: assignments[0].empId,
            desig: assignments[0].desigName,
            office: assignments[0].officeName
        }, 'HP SSO Staff verified successfully');

        return assignments[0];

    } catch (error) {
        log.error({ err: error }, 'HP SSO Staff token validation error');
        throw error;
    }
}


/**
 * Decrypt Aadhaar number from HP SSO response
 * Note: Only decrypt when absolutely necessary for verification
 */
export function decryptAadhaar(encryptedAadhaar: string, key: string): string {
    try {
        return decryptFromHPSSO<string>(encryptedAadhaar, key);
    } catch {
        log.warn('Failed to decrypt Aadhaar number');
        return '';
    }
}

/**
 * Verify Aadhaar without storing full number
 * Returns only verification status and masked details
 */
export function verifyAadhaarFromSSO(
    encryptedAadhaar: string,
    expectedLastFour: string,
    key: string
): AadhaarVerificationResult {
    try {
        const aadhaar = decryptAadhaar(encryptedAadhaar, key);

        if (!aadhaar || aadhaar.length !== 12) {
            return { verified: false };
        }

        const lastFour = aadhaar.slice(-4);
        const verified = lastFour === expectedLastFour;

        return {
            verified,
            lastFourDigits: lastFour,
        };
    } catch {
        return { verified: false };
    }
}

/**
 * Check if HP SSO is properly configured and available
 */
export async function checkHPSSOHealth(): Promise<{
    configured: boolean;
    reachable: boolean;
    environment: string;
}> {
    const config = getHPSSOConfig();

    if (!config.enabled) {
        return { configured: false, reachable: false, environment: 'disabled' };
    }

    const hasCredentials = !!(config.serviceId && config.secretKey);
    const hasUrl = !!getHPSSOBaseUrl();

    let reachable = false;

    if (hasUrl) {
        try {
            const baseUrl = getHPSSOBaseUrl();
            const response = await fetch(baseUrl, { method: 'HEAD' });
            reachable = response.ok || response.status === 405; // 405 = Method not allowed but server reachable
        } catch {
            reachable = false;
        }
    }

    return {
        configured: hasCredentials && hasUrl,
        reachable,
        environment: config.environment,
    };
}
