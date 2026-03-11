# DEV PLAN 01 — Search Engine + Payment Pipeline Fix
**Version**: 1.3.5  
**Date**: 11 Mar 2026  
**Build Window**: Tonight (11 Mar ~21:00 IST → 12 Mar ~02:00 IST)  
**Deploy Window**: 12 Mar ~02:00–03:00 IST (idle hours)  
**Status**: 🟡 Planned

---

## Scope

Two deliverables in this release:

| # | Deliverable | Priority |
|---|-------------|----------|
| A | **Payment Pipeline Atomicity Fix** — root cause fix for orphaned payments | 🔴 Critical |
| B | **Central Search Engine** — one backend, role-scoped frontend | 🟠 High |

---

## A. Payment Pipeline Fix

### Problem
HimKosh callback writes to `himkosh_transactions` then separately to `homestay_applications`. If server dies between the two writes, transaction shows "success" but application has no `paymentId` → payment invisible to applicant.

### What's Already Done (this session)
- [x] Wrapped callback in `db.transaction()` — both writes atomic
- [x] Fixed CASE 2 (payment_pending → approved) missing `paymentStatus`, `paymentId`, `paymentAmount`
- [x] Added CASE 3 — terminal-state apps still get payment linked
- [x] Fixed `isNull` import bug (Flash's code)
- [x] Fixed `propertyTitle` → `propertyName` (Flash's code)
- [x] Fixed `and()/or()` TypeScript errors
- [x] Added `missing_link` filter to Reconciliation Engine + Super Admin
- [x] Search placeholder improvements
- [x] Build verified clean ✅

### Remaining Work (Tonight)
- [ ] Review reconciliation cron — add `missing_link` detection to Layer 1
- [ ] End-to-end test on DEV
- [ ] Version bump to 1.3.5

### Files Changed
```
server/himkosh/routes.ts          — callback atomicity, missing_link filter, search fix
client/src/pages/admin/reconciliation-engine.tsx — UI filters, empty states
client/src/pages/admin/super-admin-console.tsx   — missing_link filter, search placeholder
```

---

## B. Central Search Engine

### Architecture

```
                    ┌──────────────────────────────┐
                    │   POST /api/search/apps       │
                    │   ─────────────────────────   │
                    │   • Smart text matching        │
                    │   • All filter combinations    │
                    │   • Role-based data scoping    │
                    │   • Paginated response         │
                    │   • Payment-aware              │
                    └──────────┬───────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                     │
    ┌─────▼─────┐      ┌──────▼──────┐       ┌─────▼─────┐
    │ SuperAdmin │      │ PaymentOps  │       │  DA/DTDO  │
    │  Full view │      │ Payment     │       │ District  │
    │  All cols  │      │ focused     │       │ scoped    │
    │  All filts │      │ filters     │       │ workflow  │
    └───────────┘      └─────────────┘       └───────────┘
```

### Design Principles

1. **Type anything, get results** — single search bar, smart matching
2. **Progressive disclosure** — filters hidden until needed
3. **Minimum input, maximum output** — auto-detect what you typed (app number? mobile? name?)
4. **Role shapes the lens** — same engine, different visibility
5. **Results show what matters** — columns adapt per role

### B1. Backend: `/api/search/apps`

**File**: `server/routes/search.ts` (new)

**Input** (POST body):
```typescript
{
  // Smart text — matches across app number, owner name, property, mobile, district
  q?: string;

  // Structured filters (all optional)
  district?: string;
  status?: string;              // any application status
  paymentStatus?: string;       // paid | pending | missing
  applicationKind?: string;     // new_registration | add_rooms | etc.
  fromDate?: string;            // ISO date
  toDate?: string;              // ISO date

  // Pagination
  page?: number;                // default 1
  pageSize?: number;            // default 20, max 100
}
```

**Output**:
```typescript
{
  results: Array<{
    id: string;
    applicationNumber: string;
    propertyName: string;
    ownerName: string;
    ownerMobile: string;
    district: string;
    tehsil: string;
    category: string;
    totalRooms: number;
    status: string;
    paymentStatus: string;
    paymentId: string | null;
    submittedAt: string | null;
    updatedAt: string | null;
    applicationKind: string;
  }>;
  totalCount: number;
  page: number;
  pageSize: number;
}
```

**Smart text matching logic** (`q` parameter):
```
Input: "HP-HS-2026"    → matches applicationNumber (ilike)
Input: "9876543210"    → matches ownerMobile (exact)
Input: "Sharma"        → matches ownerName OR propertyName (ilike)
Input: "Shimla"        → matches district (ilike)
Input: "CHM-000313"    → matches applicationNumber (ilike, partial)
```

**Role-based scoping** (automatic, not a filter):
```
super_admin, supervisor_hq  → all applications
payment_officer              → all applications (payment columns prominent)
state_officer                → all applications
DA                           → own district only
DTDO                         → own district only
```

**Allowed roles**: `super_admin`, `supervisor_hq`, `payment_officer`, `state_officer`,
`admin`, `district_tourism_officer`, `district_officer`, `dealing_assistant`

### B2. Frontend: `<SearchEngine>` Component

**File**: `client/src/components/search/SearchEngine.tsx` (new)

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 [_________Search by app no, name, mobile, property..._] 🔎 │
│                                                                  │
│  [⚙️ Filters]  ← collapsed by default                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ District [All ▼]  Status [All ▼]  Payment [All ▼]         │  │
│  │ Type [All ▼]      From [____]     To [____]               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Results ─────────────────────────────── 47 found ── p1/3 ─┐ │
│  │  HP-HS-2026-SML-042  Mountain View   Sharma   Shimla  ✅   │ │
│  │  HP-HS-2026-CHM-313  River Cottage   Kumar    Chamba  ⚠️   │ │
│  │  ...                                                        │ │
│  └────────────────────────────────── [← Prev] [Next →] ──────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Role-specific filter visibility

| Filter | super_admin | payment_officer | DA/DTDO | state_officer |
|--------|:-----------:|:---------------:|:-------:|:-------------:|
| Text search | ✅ | ✅ | ✅ | ✅ |
| District | ✅ | ✅ | Hidden (auto-scoped) | ✅ |
| Status | ✅ | ✅ | ✅ | ✅ |
| Payment | ✅ | ✅ (prominent) | Hidden | ✅ |
| App Type | ✅ | Hidden | ✅ | ✅ |
| Date Range | ✅ | ✅ | ✅ | ✅ |

#### Role-specific result columns

| Column | super_admin | payment_officer | DA/DTDO |
|--------|:-----------:|:---------------:|:-------:|
| App Number | ✅ | ✅ | ✅ |
| Property | ✅ | ✅ | ✅ |
| Owner | ✅ | ✅ | ✅ |
| District | ✅ | ✅ | Hidden (same district) |
| Status | ✅ | ✅ | ✅ |
| Payment | ✅ | ✅ (highlighted) | Hidden |
| Date | ✅ | ✅ | ✅ |
| Action | View All | Fix Payment | Review |

### B3. Page Integration

**New route**: `/search` — universal search page  
**File**: `client/src/pages/search.tsx` (new)

```
Navigation placement by role:
  super_admin     → Sidebar: "🔍 Search" (top of list)
  payment_officer → Sidebar: "🔍 Search Applications"
  supervisor_hq   → Sidebar: "🔍 Search"
  DA              → Sidebar: "🔍 Search" (replaces current basic one)
  DTDO            → Sidebar: "🔍 Search" (new entry)
  state_officer   → Sidebar: "🔍 Search" (new entry)
```

---

## Task Breakdown (Tonight)

### Phase 1: Backend (45 min)

| # | Task | File | Est |
|---|------|------|-----|
| 1.1 | Create search router with smart text matching | `server/routes/search.ts` | 20 min |
| 1.2 | Register route in main server | `server/routes.ts` | 2 min |
| 1.3 | Add role-based scoping + pagination | `server/routes/search.ts` | 15 min |
| 1.4 | Test API manually | curl/browser | 8 min |

### Phase 2: Frontend Component (60 min)

| # | Task | File | Est |
|---|------|------|-----|
| 2.1 | Create `<SearchEngine>` component | `client/src/components/search/SearchEngine.tsx` | 35 min |
| 2.2 | Create search page wrapper | `client/src/pages/search.tsx` | 10 min |
| 2.3 | Add route in App.tsx | `client/src/App.tsx` | 5 min |
| 2.4 | Add navigation links for all roles | `client/src/config/navigation.ts` | 10 min |

### Phase 3: Polish + Payment Fix Finalize (30 min)

| # | Task | File | Est |
|---|------|------|-----|
| 3.1 | Review reconciliation cron for missing_link | `server/himkosh/reconciliation.ts` | 10 min |
| 3.2 | Version bump to 1.3.5 | `package.json` etc. | 5 min |
| 3.3 | Build + smoke test | terminal | 10 min |
| 3.4 | Create deploy tarball | terminal | 5 min |

### Phase 4: Deploy (30 min)

| # | Task | Where | Est |
|---|------|-------|-----|
| 4.1 | Transfer tarball to PROD | scp/manual | 5 min |
| 4.2 | Backup current on PROD | PROD server | 5 min |
| 4.3 | Deploy + verify | PROD server | 15 min |
| 4.4 | Smoke test search + payment | PROD browser | 5 min |

**Total estimated: ~2.5 hours**

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| DB transaction adds latency to callback | Postgres transactions are fast (~2ms overhead). Acceptable. |
| Search query slow on large dataset | Indexed fields (applicationNumber, ownerMobile, district). LIKE on name is acceptable at current scale (~1000 apps). |
| Role misconfiguration exposes data | Backend enforces district scoping regardless of frontend. DA/DTDO always auto-scoped. |
| Breaking existing search pages | Not touching DA Queue or DTDO Queue internals. New route is additive. |

---

## Rollback Plan

If issues found post-deploy:
1. Search engine: Remove route from `navigation.ts` — feature disappears, nothing breaks
2. Payment fix: Revert `routes.ts` to previous version — goes back to non-atomic writes (existing behavior)

Both are isolated changes with clean rollback paths.

---

## Sign-off

| Role | Name | Status |
|------|------|--------|
| Dev Lead | Antigravity | ✅ Ready |
| Project Owner | | ⬜ Pending |
