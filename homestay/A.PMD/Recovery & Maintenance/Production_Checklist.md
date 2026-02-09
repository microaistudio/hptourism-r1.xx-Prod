# Kotak Mahindra (CCAvenue) Payment Gateway - Production Go-Live Checklist

## 1. Credentials Required from Kotak
You need to obtain the **Production** keys. These are different from the Test keys.
Request these from the Kotak/CCAvenue team:
- [ ] **Merchant ID** (Production)
- [ ] **Access Code** (Production)
- [ ] **Working Key** (Production)

## 2. Whitelisting Request to Kotak
Send an email to Kotak support to whitelist your Production environment.
**Provide these details:**

| Parameter | Value |
| :--- | :--- |
| **Production Domain** | `https://homestay.hp.gov.in` |
| **Production Server IP** | `164.100.138.21` (Verify this is the correct public IP of the NIC server) |
| **Return URL** | `https://homestay.hp.gov.in/api/ccavenue/callback` |
| **Cancel URL** | `https://homestay.hp.gov.in/api/ccavenue/callback` |

> **Note:** The "Return URL" and "Cancel URL" are the endpoints on *your* server where Kotak sends the payment result.

## 3. Firewall/Network Request to DIT (NIC)
The HimKosh server (on `164.100.138.21`) needs to communicate *outbound* to Kotak's server.
**Request for DIT Network Team:**
*   "Please allow **outgoing HTTPS (Port 443)** connections from our server (`164.100.138.21`) to the following domains:"
    *   `secure.ccavenue.com`
    *   `test.ccavenue.com` (Optional, if you want to test on prod server)

## 4. Final Server Configuration
Once you have the Production credentials, update the `.env` file on the `homestay.hp.gov.in` server:

```bash
# Edit the .env file
nano /path/to/project/.env
```

**Change these values:**
```ini
CCAVENUE_ENV=production
CCAVENUE_MERCHANT_ID=<Your_Production_Merchant_ID>
CCAVENUE_ACCESS_CODE=<Your_Production_Access_Code>
CCAVENUE_WORKING_KEY=<Your_Production_Working_Key>
CCAVENUE_URL=https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction
```

**Restart the Service:**
```bash
pm2 restart hptourism-rc8
```
