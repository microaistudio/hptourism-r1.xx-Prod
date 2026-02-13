# HimKosh Interface - Tested & Verified Configuration
**Version:** 1.0
**Last Verified:** 2026-01-31
**Environment:** PROD / DEV

This document serves as the master reference for the HimKosh Payment Gateway integration. It contains all technical details, configurations, and recovery procedures required to maintain the system.

---

## 1. Core Configuration

The integration relies on specific environment variables and database settings.

### 1.1 Environment Variables (.env)
These are the base configurations required in the environment file.

```bash
# HimKosh Configuration
HIMKOSH_PAYMENT_URL=https://himkosh.hp.nic.in/echallan/WebPages/wrfApplicationRequest.aspx
HIMKOSH_VERIFICATION_URL=https://himkosh.hp.nic.in/eChallan/webpages/AppVerification.aspx
HIMKOSH_CHALLAN_PRINT_URL=https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx
HIMKOSH_SEARCH_URL=https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx
HIMKOSH_MERCHANT_CODE=HIMKOSH230       # PROD Merchant Code
HIMKOSH_DEPT_ID=230                    # PROD Department ID
HIMKOSH_SERVICE_CODE=TSM               # Service Code (Tourism)
HIMKOSH_DDO=SML00-532                 # Default DDO (Shimla) - Overridden by dynamic logic
HIMKOSH_HEAD=1452-00-800-01           # Main Budget Head
HIMKOSH_KEY_FILE_PATH=server/himkosh/echallan.key  # Path to encryption key
```

### 1.2 Database Configuration Overrides
The system allows overriding hardcoded configs via the `system_settings` table (key: `himkosh_gateway`). This is checked first before falling back to env vars.

---

## 2. Encryption Logic (Critical)

The encryption logic is specific to the .NET implementation used by the HimKosh server.
**File:** `server/himkosh/crypto.ts`

### 2.1 Algorithm Details
- **Algorithm:** AES-128 (Rijndael)
- **Mode:** CBC (Cipher Block Chaining)
- **Padding:** PKCS7
- **Key Size:** 128 bits (16 bytes)
- **Block Size:** 128 bits (16 bytes)

### 2.2 Key & IV Handling (CRITICAL)
This is the most common point of failure. The implementation **deviates from standard security practices** to match the legacy DLL:
1.  **Key Source:** The first 16 bytes of the `echallan.key` file.
2.  **IV Source:** The **IV is identical to the Key** (first 16 bytes of the key file). It is NOT generated randomly.
    *   *Implementation Note:* `this.iv = keyBytes;`

### 2.3 Encoding (CRITICAL)
The .NET backend expects **ASCII** encoding, not UTF-8.
- **Input Text:** Must be treated as ASCII.
- **Encryption Output:** Base64.
- **Decryption Input:** Base64.
- **Decryption Output:** ASCII.

```typescript
// Example Implementation Reference
const cipher = crypto.createCipheriv('aes-128-cbc', key, key); // IV matches Key
let encrypted = cipher.update(text, 'ascii', 'base64');
encrypted += cipher.final('base64');
```

### 2.4 Checksum Generation
- **Algorithm:** MD5
- **Input:** UTF-8 string
- **Output:** Lowercase Hexadecimal
- **Format:** `data|checkSum={md5_hash}`

---

## 3. DDO Mapping & Routing

Payments must be routed to the correct district's DDO code. The system uses a dynamic routing logic based on the application's district.

**File:** `server/himkosh/ddo.ts` & `server/himkosh/routes.ts`

### 3.1 Verified DDO Map (As of Jan 31, 2026)
These codes are stored in the `ddo_codes` database table.

| District | DDO Code | Description | Treasury Code |
|----------|----------|-------------|---------------|
| Bharmour | CHM01-001 | S.D.O.(CIVIL) BHARMOUR | CHM01 |
| **Bilaspur** | **MDI00-532** | DIV. TOURISM DEV. OFFICER MANDI (BILASPUR) | MDI00 |
| Chamba | CHM00-532 | D.T.D.O. CHAMBA | CHM00 |
| Hamirpur | HMR00-053 | DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA) | HMR00 |
| Kangra | KNG00-532 | DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA | KNG00 |
| Kinnaur | KNR00-031 | DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR RECKONG PEO | KNR00 |
| Kullu | KLU00-532 | DEPUTY DIRECTOR TOURISM KULLU DHALPUR | KLU00 |
| Lahaul | LHL00-017 | DISTRICT TOURISM DEVELOPMENT OFFICER | LHL00 |
| **Lahaul-Spiti (Kaza)** | **KZA00-011** | PO ITDP KAZA | KZA00 |
| Mandi | MDI00-532 | DIV. TOURISM DEV. OFFICER MANDI | MDI00 |
| **Pangi** | **PNG00-003** | PROJECT OFFICER ITDP PANGI | PNG00 |
| Shimla | SML00-532 | DIVISIONAL TOURISM OFFICER SHIMLA | SML00 |
| Shimla (Central) | CTO00-068 | A.C. (TOURISM) SHIMLA | CTO00 |
| **Sirmaur** | **SMR00-055** | DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN | SMR00 |
| Solan | SOL00-046 | DTDO SOLAN | SOL00 |
| Una | HMR00-053 | DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA) | HMR00 |

### 3.2 Routing Logic
1.  **Exact Match:** Checks `ddo_codes` table for exact district name match.
2.  **Fuzzy Match:** Tokenizes district name (e.g., "Kullu" matches "Kullu (Dhalpur)").
3.  **Fallback:** If no match found, defaults to `SML00-532` (Shimla).

---

## 4. Integration Data Flow

1.  **User Initiates Payment:**
    - Frontend calls `POST /api/himkosh/initiate`.
2.  **Backend Preparation:**
    - Server creates a `himkosh_transactions` record.
    - Resolves DDO code based on `homestay_applications.district`.
    - Constructs the pipe-delimited string (Order is strictly enforced):
        `DeptID|DeptRefNo|TotalAmount|TenderBy|AppRefNo|Head1|Amount1|Head2|Amount2|Ddo|PeriodFrom|PeriodTo|...`
    - Generates MD5 Checksum.
    - Encrypts Full String + Checksum.
3.  **Browser Redirection:**
    - Server returns HTML form with hidden field `encData`.
    - Browser auto-submits form to `HIMKOSH_PAYMENT_URL`.
4.  **HimKosh Processing:**
    - User completes payment on banking portal.
5.  **Callback / Response:**
    - HimKosh redirects to `returnUrl` (e.g., `/api/himkosh/callback`).
    - Payload contains one encrypted string parameter.
6.  **Verification:**
    - Server decrypts response.
    - Verifies checksum.
    - Updates `himkosh_transactions` status.
    - Redirects user to success/failure page.

---

## 5. Troubleshooting & Recovery

### 5.1 Common Errors
| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Decryption Failed` | Key file mismatch or IV incorrect | Ensure `echallan.key` is exactly 16 bytes. Verify IV=Key logic in `crypto.ts`.|
| `Checksum Mismatch` | Encoding issue | Ensure MD5 input is UTF-8 and output is lowercase hex. |
| `Invalid DDO` | Mapping missing in DB | Check `ddo_codes` table. Add missing district mapping. |
| `Connection Refused` | HimKosh Firewall | Ensure server IP is whitelisted by HimKosh team. |

### 5.2 Verification Steps
To verify the system is healthy:
1.  **Check Logs:** `pm2 logs hptourism-rc8`
2.  **Verify DB Connections:** Ensure `himkosh_transactions` table is populating.
3.  **Test Payment:** Run a dummy transaction (using `Test Runner` in Admin Console).

### 5.3 Emergency Contacts
- **Technical Support:** CTP Team (for Key/Firewall issues)
- **Database Admin:** Systems Admin (for DDO mapping updates)

---
*Document prepared by Antigravity Agent - 2026-01-31*
