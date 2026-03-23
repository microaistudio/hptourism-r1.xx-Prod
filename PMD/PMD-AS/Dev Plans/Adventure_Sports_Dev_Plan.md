# Adventure Sports (Water Sports & Allied Activities) — Development Plan

*Module: Adventure Sports / Water Sports Registration*
*Portal: HP Tourism eServices Portal*
*Base Version: v1.4.0 (Homestay feature-complete)*
*Target Version: v2.0.0*
*Date: 24 March 2026*
*Author: Solution Architecture Team*

---

## 1. Architecture Decision

### 1.1 Approach: One Portal, Modular Code

Adventure Sports is built **inside the existing `hptourism/homestay/` codebase** as an isolated module — NOT as a separate folder or repository. This approach:

- **Protects Homestay**: Adventure dev never touches homestay files
- **Eliminates duplication**: Auth, payments, uploads, admin panel shared as platform services
- **Single deployment**: One PM2 process, one Nginx config, one release
- **Unified experience**: Officers see all services in one dashboard, citizens have one account

### 1.2 Isolation Rules (MANDATORY)

| Rule | Description |
|---|---|
| **Separate schema file** | All adventure DB tables defined in `shared/schema-adventure.ts` — NEVER modify `shared/schema.ts` |
| **Separate route files** | All adventure API routes in `server/routes/adventure/` folder — NEVER modify homestay route files |
| **Separate page folder** | All adventure frontend pages in `client/src/pages/adventure-sports/` — NEVER modify homestay pages |
| **Separate components** | Adventure-specific UI components in `client/src/components/adventure/` |
| **Shared components OK** | Reuse `ObjectUploader`, `ui/*`, layouts, auth hooks — these are platform-level |
| **Git branches** | Feature branch `feature/adventure-sports` — merge to main only after testing |

### 1.3 File Structure

```
hptourism/homestay/
├── shared/
│   ├── schema.ts                          ← Homestay tables (UNTOUCHED)
│   ├── schema-adventure.ts                ← NEW: Adventure tables
│   └── activityTypes.ts                   ← EXISTS: Activity configs (extend)
│
├── server/
│   ├── routes/
│   │   ├── applications/                  ← Homestay routes (UNTOUCHED)
│   │   ├── adventure/                     ← NEW: Adventure route folder
│   │   │   ├── index.ts                   ←   Main router (mounts sub-routers)
│   │   │   ├── operator.ts                ←   Operator application CRUD
│   │   │   ├── crew.ts                    ←   Crew/Boatman registration
│   │   │   ├── equipment.ts               ←   Equipment inventory management
│   │   │   ├── tc-workflow.ts             ←   Technical Committee workflow
│   │   │   ├── certificates.ts            ←   Certificate generation
│   │   │   └── admin.ts                   ←   Admin settings for adventure
│   │   └── adventure-sports.ts            ← EXISTS: Will be replaced by above
│   │
│   └── services/
│       └── adventure/                     ← NEW: Adventure business logic
│           ├── fee-calculator.ts          ←   Fee + deposit calculation
│           ├── season-manager.ts          ←   Seasonal window enforcement
│           └── tc-scheduling.ts           ←   TC meeting coordination
│
├── client/src/
│   ├── pages/
│   │   ├── applications/                  ← Homestay pages (UNTOUCHED)
│   │   └── adventure-sports/              ← NEW/EXTEND: Adventure pages
│   │       ├── index.tsx                  ←   Landing/dashboard
│   │       ├── new.tsx                    ←   Multi-step application form
│   │       ├── my-applications.tsx        ←   Applicant's application list
│   │       ├── crew-registration.tsx      ←   Boatman/Driver/Guard form
│   │       └── operator-dashboard.tsx     ←   Post-registration log book etc.
│   │
│   └── components/
│       └── adventure/                     ← NEW: Adventure-specific components
│           ├── ActivitySelector.tsx        ←   Activity category/type picker
│           ├── EquipmentForm.tsx           ←   Boat/equipment entry form
│           ├── CrewForm.tsx               ←   Crew member entry form
│           ├── WaterBodySelector.tsx       ←   Water body picker (with district filter)
│           ├── TCInspectionPanel.tsx       ←   TC inspection recording UI
│           └── SeasonalStatus.tsx          ←   Shows active/suspended status
```

---

## 2. Database Schema

### 2.1 New Tables (in `shared/schema-adventure.ts`)

All tables are **independent** from homestay tables. They share only the `users` table for foreign keys.

#### `adventure_operators` — Operator Registration Applications

```sql
adventure_operators (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id),
  application_number    VARCHAR(50) UNIQUE NOT NULL,    -- ADV-WS-{DIST}-{YEAR}-{SEQ}

  -- Operator Info
  operator_type         VARCHAR(20) NOT NULL,           -- 'individual' | 'company' | 'society'
  operator_name         VARCHAR(200) NOT NULL,          -- Business/individual name
  local_office_address  TEXT NOT NULL,
  district              VARCHAR(50) NOT NULL,
  tehsil                VARCHAR(50),
  pincode               VARCHAR(10),

  -- Contact
  contact_name          VARCHAR(200),
  contact_mobile        VARCHAR(15) NOT NULL,
  contact_email         VARCHAR(200),
  contact_aadhaar       VARCHAR(20),

  -- Activity Info
  activity_category     VARCHAR(50) NOT NULL,           -- 'non_motorized' | 'motorized' | 'towed' | 'personal_watercraft'
  activity_types        JSONB NOT NULL DEFAULT '[]',    -- Array of activity IDs selected
  water_body_id         VARCHAR(50) NOT NULL,           -- FK to water bodies config
  area_of_operation     TEXT,                           -- Description of specific area/stretch
  embarkation_site      TEXT,                           -- Jetty/ramp location
  latitude              NUMERIC(10,8),
  longitude             NUMERIC(11,8),

  -- Season
  operating_season      JSONB,                          -- { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD', approvedByTC: true }

  -- Fees & Deposits
  registration_fee      INTEGER DEFAULT 2000,           -- ₹2,000 per Rule 4(1)
  registration_fee_status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'paid' | 'waived'
  registration_fee_txn_id VARCHAR(100),
  security_deposit      INTEGER DEFAULT 50000,          -- ₹50,000 per Rule 4(4)
  security_deposit_status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'paid' | 'refunded'
  security_deposit_txn_id VARCHAR(100),

  -- Insurance
  insurance_provider    VARCHAR(200),
  insurance_policy_no   VARCHAR(100),
  insurance_coverage    INTEGER,                        -- ₹ per participant (min ₹5,00,000)
  insurance_valid_from  DATE,
  insurance_valid_upto  DATE,

  -- Workflow Status
  status                VARCHAR(30) NOT NULL DEFAULT 'draft',
  current_stage         VARCHAR(30) DEFAULT 'applicant',
  
  -- DA Processing
  da_id                 UUID REFERENCES users(id),
  da_review_date        TIMESTAMP,
  da_remarks            TEXT,

  -- DTDO Processing
  dtdo_id               UUID REFERENCES users(id),
  dtdo_review_date      TIMESTAMP,
  dtdo_remarks          TEXT,

  -- Technical Committee
  tc_inspection_date    DATE,
  tc_inspection_venue   TEXT,
  tc_members_present    JSONB DEFAULT '[]',             -- Array of { name, designation, present: bool }
  tc_quorum_met         BOOLEAN DEFAULT FALSE,
  tc_inspection_report  JSONB,                          -- Structured findings
  tc_recommendation     VARCHAR(20),                    -- 'approve' | 'reject' | 'defer'
  tc_recommendation_date DATE,
  tc_remarks            TEXT,

  -- Certificate
  certificate_number    VARCHAR(50) UNIQUE,
  certificate_issued_date DATE,
  certificate_valid_from  DATE,
  certificate_valid_upto  DATE,                         -- 3 years from issue
  certificate_status    VARCHAR(20) DEFAULT 'none',     -- 'none' | 'active' | 'suspended' | 'cancelled' | 'expired'

  -- Metadata
  application_kind      VARCHAR(20) DEFAULT 'new',      -- 'new' | 'renewal'
  parent_registration   VARCHAR(50),                    -- For renewals: previous certificate number
  documents             JSONB DEFAULT '[]',
  correction_count      INTEGER DEFAULT 0,
  
  -- Timestamps
  submitted_at          TIMESTAMP,
  approved_at           TIMESTAMP,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
)
```

#### `adventure_equipment` — Equipment Inventory per Operator

```sql
adventure_equipment (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id           UUID NOT NULL REFERENCES adventure_operators(id) ON DELETE CASCADE,
  
  equipment_type        VARCHAR(50) NOT NULL,           -- 'paddle_boat' | 'row_boat' | 'motor_boat' | 'jet_ski' | ...
  manufacturer          VARCHAR(200) NOT NULL,
  identification_number VARCHAR(100) NOT NULL,          -- Policy: displayed on boat
  year_of_manufacture   INTEGER NOT NULL,
  seating_capacity      INTEGER DEFAULT 1,
  engine_type           VARCHAR(20),                    -- 'inboard' | 'outboard' | NULL (non-motorized)
  engine_hp             INTEGER,                        -- NULL for non-motorized
  irs_certification     BOOLEAN DEFAULT FALSE,
  certification_doc_url VARCHAR(500),
  
  -- TC Inspection Result
  tc_inspected          BOOLEAN DEFAULT FALSE,
  tc_inspection_notes   TEXT,
  tc_approved           BOOLEAN,
  
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
)
```

#### `adventure_crew` — Crew/Boatman/Driver/Guard Registry

```sql
adventure_crew (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id           UUID REFERENCES adventure_operators(id),  -- NULL if independent registration
  user_id               UUID REFERENCES users(id),                -- If crew member has portal account
  
  -- Personal Info
  full_name             VARCHAR(200) NOT NULL,
  date_of_birth         DATE NOT NULL,                  -- Must be ≥21 years (Rule 6(1))
  gender                VARCHAR(10),
  aadhaar_number        VARCHAR(20),
  mobile                VARCHAR(15),
  address               TEXT,
  
  -- Role & Qualifications
  role                  VARCHAR(30) NOT NULL,            -- 'boatman' | 'motor_boat_driver' | 'life_guard' | 'crew_member'
  medical_fitness_cert  VARCHAR(500),                   -- URL: Govt Medical Officer certificate
  first_aid_cert        VARCHAR(500),                   -- URL: First Aid course certificate
  education_proof       VARCHAR(500),                   -- URL: Matriculation proof
  character_cert        VARCHAR(500),                   -- URL: Good moral character certificate
  experience_years      INTEGER DEFAULT 0,              -- Desired: 2 years
  
  -- Role-Specific Certifications
  boatman_cert          VARCHAR(500),                   -- URL: Basic + Advanced course (State/Central Inst)
  motor_boat_license    VARCHAR(500),                   -- URL: Valid HP motor boat license
  power_boat_cert       VARCHAR(500),                   -- URL: NIWS power boat handling certificate
  lifeguard_cert        VARCHAR(500),                   -- URL: Basic + Advanced water sports course
  
  -- Registration
  registration_number   VARCHAR(50) UNIQUE,             -- CREW-{ROLE}-{DIST}-{YEAR}-{SEQ}
  registration_status   VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'tc_recommended' | 'registered' | 'expired' | 'suspended'
  registration_fee      INTEGER DEFAULT 1000,           -- ₹1,000 per Rule 5(1)
  registration_fee_status VARCHAR(20) DEFAULT 'pending',
  valid_from            DATE,
  valid_upto            DATE,                           -- 3 years from issue
  
  -- TC Physical Test Results
  tc_trial_date         DATE,
  tc_trial_result       VARCHAR(20),                    -- 'pass' | 'fail' | 'deferred'
  tc_trial_notes        TEXT,
  
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
)
```

#### `adventure_documents` — Document Management

```sql
adventure_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id           UUID REFERENCES adventure_operators(id),
  crew_id               UUID REFERENCES adventure_crew(id),       -- For crew-specific documents
  
  document_type         VARCHAR(50) NOT NULL,           -- 'indemnity_bond' | 'insurance_policy' | 'operator_affidavit' | 'crew_certificate' | ...
  file_name             VARCHAR(500) NOT NULL,
  file_url              VARCHAR(1000) NOT NULL,
  file_size             INTEGER,
  mime_type             VARCHAR(100),
  description           TEXT,
  
  verification_status   VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'verified' | 'rejected'
  verification_notes    TEXT,
  verified_by           UUID REFERENCES users(id),
  verified_at           TIMESTAMP,
  
  created_at            TIMESTAMP DEFAULT NOW()
)
```

#### `adventure_actions` — Audit Trail

```sql
adventure_actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id           UUID REFERENCES adventure_operators(id),
  crew_id               UUID REFERENCES adventure_crew(id),
  actor_id              UUID REFERENCES users(id),
  
  action                VARCHAR(50) NOT NULL,           -- 'submitted' | 'da_reviewed' | 'tc_scheduled' | 'tc_inspected' | 'approved' | 'rejected' | 'suspended' | ...
  previous_status       VARCHAR(30),
  new_status            VARCHAR(30),
  feedback              TEXT,
  metadata              JSONB,
  
  created_at            TIMESTAMP DEFAULT NOW()
)
```

### 2.2 Status Flow

```
OPERATOR APPLICATION:
  draft
    → submitted                        (applicant pays ₹2,000 + submits)
    → under_scrutiny                   (DA picks up for document check)
    → da_approved | correction_needed  (DA verifies or sends back)
    → tc_scheduled                     (DTDO schedules TC inspection)
    → tc_inspected                     (TC conducts physical inspection)
    → tc_recommended | tc_rejected     (TC records recommendation)
    → deposit_pending                  (Awaiting ₹50,000 security deposit)
    → registered                       (DTDO issues certificate)
    → active                           (Operating in approved season)
    → suspended                        (Violation or off-season)
    → expired                          (3-year validity ended)
    → renewal_pending                  (Renewal application filed)

CREW REGISTRATION:
  pending
    → submitted
    → under_review
    → tc_trial_scheduled
    → tc_recommended | tc_rejected
    → registered
    → expired
    → renewal_pending
```

---

## 3. API Endpoints

### 3.1 Operator Application APIs (`/api/adventure-sports/`)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/activities` | List all activity types with fees | Public |
| `GET` | `/water-bodies` | List notified water bodies | Public |
| `GET` | `/water-bodies/:district` | Water bodies filtered by district | Public |
| `POST` | `/applications` | Create new operator application (draft) | Owner |
| `GET` | `/applications/:id` | Get application details | Owner/Staff |
| `PUT` | `/applications/:id` | Update draft application | Owner |
| `POST` | `/applications/:id/submit` | Submit application (triggers fee payment) | Owner |
| `GET` | `/my-applications` | List current user's applications | Owner |

### 3.2 Staff Workflow APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/staff/applications` | List applications for DA/DTDO (district-filtered) | DA/DTDO |
| `POST` | `/staff/applications/:id/review` | DA reviews (approve/send-back) | DA |
| `POST` | `/staff/applications/:id/schedule-tc` | DTDO schedules TC inspection | DTDO |
| `POST` | `/staff/applications/:id/tc-report` | Record TC inspection findings | DTDO |
| `POST` | `/staff/applications/:id/approve` | DTDO issues registration (after TC + deposit) | DTDO |
| `POST` | `/staff/applications/:id/reject` | Reject with 15-day notice (Rule 8) | DTDO |
| `POST` | `/staff/applications/:id/suspend` | Suspend registration | DTDO |

### 3.3 Crew APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/crew` | Register new crew member | Owner |
| `GET` | `/crew/:operatorId` | List crew for an operator | Owner/Staff |
| `PUT` | `/crew/:id` | Update crew details | Owner |
| `POST` | `/crew/:id/submit` | Submit crew for TC review | Owner |
| `POST` | `/staff/crew/:id/tc-trial` | Record TC physical test result | DTDO |
| `POST` | `/staff/crew/:id/register` | Issue crew registration certificate | DTDO |

### 3.4 Equipment APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/equipment` | Add equipment to application | Owner |
| `GET` | `/equipment/:operatorId` | List equipment for an operator | Owner/Staff |
| `PUT` | `/equipment/:id` | Update equipment details | Owner |
| `DELETE` | `/equipment/:id` | Remove equipment from draft | Owner |

### 3.5 Certificate & Post-Registration APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/certificates/:operatorId` | Download operator certificate (FORM-2) | Owner/Staff |
| `GET` | `/certificates/crew/:crewId` | Download crew certificate (FORM-4) | Owner/Staff |
| `GET` | `/certificates/verify/:certNo` | Public certificate verification | Public |
| `GET` | `/info-board/:operatorId` | Generate FORM-5 display board PDF | Owner |

---

## 4. Frontend Pages

### 4.1 Applicant-Facing Pages

| Route | Page | Description |
|---|---|---|
| `/adventure-sports` | Landing | Service overview, "Apply Now" entry point |
| `/adventure-sports/new` | Multi-Step Form | 6-step application (Activity → Operator → Equipment → Crew → Documents → Review+Pay) |
| `/adventure-sports/my-applications` | My Applications | Status tracker, document uploads, certificate downloads |
| `/adventure-sports/crew/new` | Crew Registration | FORM-3 equivalent for boatman/driver/guard |
| `/adventure-sports/operator/:id` | Operator Dashboard | Post-registration: digital log book, seasonal status, renewal |

### 4.2 Staff-Facing Pages

| Route | Page | Description |
|---|---|---|
| DA/DTDO Dashboard → "Adventure Sports" tab | Queue | List of submitted applications for district |
| Application Detail → TC Panel | TC Workflow | Schedule inspection, record findings, capture recommendation |
| Application Detail → Crew Tab | Crew Review | Review crew qualifications, record TC trial results |

---

## 5. Phased Execution Plan

### Phase 0: Foundation (Week 1)
**Goal:** Database tables, API skeleton, route mounting. Zero UI.

| # | Task | Files | Est |
|---|---|---|---|
| 0.1 | Create `shared/schema-adventure.ts` with all 5 tables | New file | 3h |
| 0.2 | Run `drizzle-kit push` to create tables | Migration | 0.5h |
| 0.3 | Create `server/routes/adventure/` folder structure | 6 new files | 2h |
| 0.4 | Mount adventure router in `server/routes.ts` | 1 line change | 0.5h |
| 0.5 | Create `server/services/adventure/` business logic stubs | 3 new files | 1h |
| 0.6 | Make water bodies admin-configurable (move from hardcoded array to DB) | schema + admin API | 2h |
| 0.7 | Verify Homestay still builds + runs cleanly | Build + smoke test | 0.5h |

**Gate Check:** `npm run build` passes. Homestay fully functional. New tables visible in DB.

---

### Phase 1A: Paddle/Row Boat — Complete Pipeline (Weeks 2–3)
**Goal:** One activity, end-to-end, from application to certificate.

| # | Task | Files | Est |
|---|---|---|---|
| 1.1 | **Applicant Form — Step 1: Activity Selection** | `pages/adventure-sports/new.tsx`, `components/adventure/ActivitySelector.tsx` | 3h |
| 1.2 | **Step 2: Operator Details** | Same form file + `WaterBodySelector.tsx` | 3h |
| 1.3 | **Step 3: Equipment Inventory** | `EquipmentForm.tsx` — min 3 boats, manufacturer, ID, year, capacity | 3h |
| 1.4 | **Step 4: Crew/Boatman Details** | `CrewForm.tsx` — name, DOB, certifications, uploads | 3h |
| 1.5 | **Step 5: Documents** | Reuse `ObjectUploader` — indemnity bond, insurance, affidavit | 2h |
| 1.6 | **Step 6: Review + Pay ₹2,000** | Summary page, reuse HimKosh/CCAvenue payment flow | 3h |
| 1.7 | **Backend: Application CRUD + Submit** | `routes/adventure/operator.ts` | 3h |
| 1.8 | **Backend: Equipment + Crew CRUD** | `routes/adventure/equipment.ts`, `crew.ts` | 2h |
| 1.9 | **DA Queue — Adventure Tab** | Extend DA dashboard with adventure applications tab | 3h |
| 1.10 | **DA Review: Document verification + send-back** | Reuse send-back pattern from Homestay | 2h |
| 1.11 | **DTDO Queue — Adventure Tab** | Extend DTDO dashboard | 2h |
| 1.12 | **TC Workflow — Schedule, Inspect, Recommend** | `TCInspectionPanel.tsx` + `routes/adventure/tc-workflow.ts` | 5h |
| 1.13 | **Security Deposit Collection (₹50,000)** | Deposit tracking + payment integration | 2h |
| 1.14 | **Certificate Generation (FORM-2)** | PDF generation, certificate number, 3-year validity | 3h |
| 1.15 | **My Applications — Status Tracker** | `pages/adventure-sports/my-applications.tsx` | 2h |
| 1.16 | **Information Board (FORM-5) PDF** | Auto-generated printable display board | 2h |
| 1.17 | **Testing & Polish** | End-to-end flow validation, edge cases | 3h |

**Gate Check:** A paddle boat operator can apply, pay, get TC inspected, and receive a digital certificate.

---

### Phase 1B: Non-Motorized Activities Expansion (Week 4)
**Goal:** Kayaking, Canoeing, Rowing — same pipeline, additional requirements.

| # | Task | Est |
|---|---|---|
| 1B.1 | Unlock kayaking, canoeing, rowing in ActivitySelector | 1h |
| 1B.2 | Add IRS certification validation for kayak/canoe equipment | 2h |
| 1B.3 | Add rescue boat requirement (mandatory for kayaking/canoeing/rowing) | 2h |
| 1B.4 | Familiarization training checklist recording | 2h |
| 1B.5 | Independent tourist kayak registration (₹1,000, 3-month validity) — mini flow | 4h |
| 1B.6 | Testing all 6 non-motorized activities | 2h |

---

### Phase 1C: Motorized Activities (Week 5)
**Goal:** Motor Boat, Speed Boat, Power Boat, Cruise/House Boat.

| # | Task | Est |
|---|---|---|
| 1C.1 | Motorized equipment form (engine type, HP, IRS cert, fire safety) | 3h |
| 1C.2 | Motor Boat Driver registration (HP license + NIWS cert) | 3h |
| 1C.3 | Life Guard registration (basic + advanced water sports course) | 2h |
| 1C.4 | Cruise/House Boat: HP Ferries Act registration compliance | 2h |
| 1C.5 | HP vs. capacity validation rule | 1h |
| 1C.6 | Testing motorized activities | 2h |

---

### Phase 1D: Towed & Personal Watercraft (Week 6)
**Goal:** Jet Ski, Water Scooter, Fun Rides, Water Skiing, Wakeboarding.

| # | Task | Est |
|---|---|---|
| 1D.1 | Towed activity: min 40 HP power boat validation | 1h |
| 1D.2 | Jet Ski: NIWS familiarization checklist, keel cord enforcement | 3h |
| 1D.3 | Age restriction enforcement (≥18 for Jet Ski, Water Scooter, Water Skiing) | 1h |
| 1D.4 | Auto engine cut-out verification for outboard jet skis | 1h |
| 1D.5 | Testing all 19 water sport activities | 3h |

---

### Phase 2: Independent Crew Registration Pipeline (Week 7)
**Goal:** Boatman, Motor Boat Driver, Life Guard — separate registration workflow.

| # | Task | Est |
|---|---|---|
| 2.1 | Crew application form (FORM-3): personal info, qualifications, certifications | 4h |
| 2.2 | DA/DTDO crew review queue | 2h |
| 2.3 | TC physical test/trial recording | 2h |
| 2.4 | Crew certificate generation (FORM-4), 3-year validity | 2h |
| 2.5 | Crew renewal pipeline (same rules as operator) | 2h |
| 2.6 | Testing | 2h |

---

### Phase 3: Regulatory & Compliance Layer (Week 8)
**Goal:** Seasonal controls, log books, receipts, regulatory dashboard.

| # | Task | Est |
|---|---|---|
| 3.1 | Seasonal window enforcement (auto-suspend operations 15 Jul–15 Sep) | 3h |
| 3.2 | TC-defined season per water body (admin configurable) | 2h |
| 3.3 | Digital Log Book (Annexure-C): tourist details, boat assignment, dates | 4h |
| 3.4 | Digital Receipt Book (Annexure-D): service details, approved rates | 2h |
| 3.5 | Regulatory Committee dashboard (DC-level) | 3h |
| 3.6 | Violation & suspension workflow (Rules 16–19) | 3h |

---

### Phase 4: Renewal, Analytics & Production Polish (Week 9)
**Goal:** Complete lifecycle management, state-level reporting, public verification.

| # | Task | Est |
|---|---|---|
| 4.1 | Renewal pipeline (configurable window, TC re-inspection) | 4h |
| 4.2 | Late renewal fine calculation (₹100/day per Rule 4(7)) | 1h |
| 4.3 | State-level analytics dashboard (operators/district, revenue, seasonal compliance) | 4h |
| 4.4 | Public certificate verification (QR code based, reuse Homestay infra) | 2h |
| 4.5 | Bulk TC operations (process multiple applications per TC sitting) | 2h |
| 4.6 | Final testing + deployment preparation | 3h |

---

## 6. Shared Infrastructure Reuse Map

| Homestay Component | Reuse in Adventure | Changes Needed |
|---|---|---|
| `ObjectUploader` | ✅ Direct reuse | None |
| HimKosh / CCAvenue Payment | ✅ Direct reuse | Different fee amounts, same flow |
| User Authentication + HimAccess SSO | ✅ Direct reuse | None |
| Session Management | ✅ Direct reuse | None |
| DA Dashboard | ⚠️ Extend | Add "Adventure Sports" tab |
| DTDO Dashboard | ⚠️ Extend | Add "Adventure Sports" tab + TC workflow |
| Admin Settings | ⚠️ Extend | Add water body management + seasonal config |
| Certificate PDF Generator | ⚠️ Template change | New FORM-2 / FORM-4 templates |
| SMS/Email Notifications | ✅ Direct reuse | Different message templates |
| Application Action Logger | ⚠️ New table | `adventure_actions` (same pattern, separate table) |

---

## 7. Risk Mitigation

| Risk | Mitigation |
|---|---|
| Adventure dev breaks Homestay | Strict file isolation rules (Section 1.2). Build verification after every phase. |
| TC workflow complexity | Start with simple TC recording (Phase 1A), expand to scheduling/coordination later |
| Payment integration issues | Reuse proven HimKosh/CCAvenue flow, only change fee amounts |
| Large schema migration | Non-destructive: all NEW tables, zero changes to existing tables |
| Officer dashboard confusion | Clear tab separation: "Homestay" vs "Adventure Sports" |

---

## 8. Success Criteria

| Milestone | Criteria |
|---|---|
| **Phase 0 Complete** | All tables created. Homestay unaffected. `npm run build` passes. |
| **Phase 1A Complete** | Paddle boat operator can apply → pay → get TC inspected → receive certificate. |
| **Phase 1D Complete** | All 19 water sport activities operational. |
| **Phase 2 Complete** | Independent crew registration pipeline working. |
| **Phase 4 Complete** | Renewal pipeline + state dashboard + public verification. Production-ready. |

---

## 9. Dependencies & Prerequisites

| Dependency | Status | Notes |
|---|---|---|
| Homestay v1.4.0 deployed | ✅ Ready | Tonight's deployment |
| PostgreSQL schema changes | 🔲 Phase 0 | Non-destructive, additive only |
| HimKosh fee codes for Water Sports | 🔲 Needed from Dept | May need new service codes for adventure registration |
| TC member directory | 🔲 Needed from Dept | Names and designations of TC members per district |
| Notified water bodies list | ✅ In activityTypes.ts | Schedule-I already captured for 16 water bodies |

---

*End of Development Plan*
*Ready for Phase 0 execution on your signal.*
