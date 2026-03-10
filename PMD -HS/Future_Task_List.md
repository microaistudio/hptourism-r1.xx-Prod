# Future Task List — HP Tourism Homestay Portal
*Last Updated: Feb 20, 2026*

---

## 🧪 1. Isolated Test Database for Test-Runner
**Priority:** High (do with 7-services expansion)
**Context:** The test-runner currently uses the PROD database. When a payment integration test was run on Solan (Feb 16), it created `TEST-SOL-1771261084971` with a timestamp ID that contaminated the sequence generator and caused all subsequent applications to get 9-digit broken IDs. V9 hotfix now excludes TEST apps from sequence, but the clean solution is a fully separate test DB.

**Plan:**
- Add `TEST_DATABASE_URL` to PROD `.env` pointing to `hptourism-test` DB
- Create `server/test-db.ts` with a separate Drizzle connection
- Update `server/routes/test-runner.ts` to use `testDb` instead of `db`
- Main DB stays 100% clean forever — test data can be wiped anytime

---

## 💳 2. Payment Reconciliation Module
**Priority:** Medium (do with next major release)
**Context:** When Himkosh payment succeeds but the webhook/callback isn't fully processed, two DB columns get out of sync: `himkosh_transactions.status` vs `transaction_status`. Super Admin and Supervisor HQ show different statuses. Currently requires manual psql to fix, which is risky and may miss updating all relevant fields.

**Plan:**
- Super Admin → Payments → new "Reconcile Pending" tab
- Auto-detects transactions where status ≠ transaction_status AND Challan/GRN exists (confirmed by Himkosh)
- One-click "Mark as Verified" that atomically updates:
  - `himkosh_transactions.status`
  - `himkosh_transactions.transaction_status`  
  - `homestay_applications.status` (if still `payment_pending`)
- Audit log: who reconciled, when, reason
- Optional: Re-query Himkosh API to auto-confirm status

---

## 📝 3. [TO BE FILLED]
**Priority:** TBD
**Context:** Discussed earlier in this session (Feb 19 session, ~8-9 PM IST) but could not be recalled. Please add details here.

---

## 📋 Notes
- V9 is currently live on PROD — `nextApplicationSequence` excludes `TEST-%` apps
- Next valid application number is `000248` onward
- Faulty records cleaned: `TEST-SOL-1771261084971`, `261084972`, `261084973` → fixed to `000245`, `000246`, `000247`
