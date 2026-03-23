# HP Tourism Homestay Portal Expansion - Phase I: Adventure Sports

## Document Information
- **Version**: 1.0
- **Date**: February 6, 2026
- **Baseline**: Homestay Portal v1.0.6
- **Author**: Development Team
- **Status**: Planning & Review

---

## Executive Summary

The Homestay Booking Portal is now complete and in production (v1.0.6). This document outlines the expansion strategy to add **Adventure Sports** as the second of 8 tourism licensing services. Adventure Sports will serve as the template for the remaining 6 services.

### Current State
- **Homestay Portal**: 90% complete, live in production
- **Architecture Foundation**: Multi-service support already built into schema
- **Remaining Services**: 7 additional services over next 2 months

### Key Insight
Building Adventure Sports as the second service will establish patterns that make the remaining 6 services largely **copy-and-paste** work.

---

## Service Overview

### All 8 Tourism Licensing Services

| # | Service | Applicant Type | Complexity | Priority |
|---|---------|----------------|------------|----------|
| 1 | **Homestay Registration** | Property Owners | High | ✅ Complete |
| 2 | **Adventure Tourism Operator** | Tour Operators | Medium | 🔄 Phase I |
| 3 | Water Sports Operator | Boat/Activity Operators | Medium | Phase II |
| 4 | River Rafting License | Rafting Companies | Medium | Phase II |
| 5 | Tour Operator License | Travel Agencies | Low | Phase III |
| 6 | Travel Agent License | Agents | Low | Phase III |
| 7 | Camping Site Registration | Site Operators | Low | Phase III |
| 8 | Caravan Park License | Park Operators | Low | Phase III |

---

## Current Architecture Assessment

### ✅ Already Built (100% Reusable)

| Component | Description |
|-----------|-------------|
| **User Management** | Roles, permissions, HP SSO integration |
| **Payment Gateway** | HimKosh, CCAvenue integration |
| **Document Uploads** | S3/Local storage abstraction |
| **Notification System** | Activity logs, email alerts |
| **Certificate Generation** | PDF generation, QR codes |
| **Admin Dashboards** | DA, DTDO queue views |

### ⚠️ Needs Service Abstraction

| Component | Current State | Required Change |
|-----------|---------------|-----------------|
| Application Schema | Tightly coupled to Homestay | Add service context |
| Fee Calculator | Room-based for Homestay | Strategy pattern per service |
| Form Pages | Property-specific fields | Wizard factory pattern |
| Routes | Monolithic routes.ts (84KB) | Split by service domain |
| Dashboard Cards | Homestay-specific metrics | Service-agnostic stats |

### ✅ Already Implemented for Multi-Service

The schema already supports multiple application types:

```typescript
// shared/schema.ts - Already exists!
applicationType: varchar("application_type", { length: 50 }).default('homestay')
// Values: 'homestay' | 'water_sports' | 'adventure_sports'

// JSONB fields for service-specific data
waterSportsData: jsonb("water_sports_data").$type<WaterSportsApplicationData>()
adventureSportsData: jsonb("adventure_sports_data").$type<AdventureSportsApplicationData>()
```

---

## Recommended Architecture

### Option B: Single App with Pipeline Switching (RECOMMENDED)

Given the 2-month timeline and shared backend officers, the pragmatic approach is to evolve the current codebase rather than create separate applications.

```
┌─────────────────────────────────────────────────────────────┐
│                  HP Tourism Main Website                     │
│              (eservices.himachaltourism.gov.in)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   HOMESTAY    │   │   ADVENTURE   │   │ WATER SPORTS  │
│   Landing     │   │   Landing     │   │   Landing     │
│   (Live)      │   │   (Phase I)   │   │   (Phase II)  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │     SHARED ADMIN PORTAL       │
            │     [Pipeline Selector ▼]     │
            │                               │
            │  ┌─────────┐    ┌─────────┐  │
            │  │Homestay │    │Adventure│  │
            │  │Pipeline │    │Pipeline │  │
            │  └─────────┘    └─────────┘  │
            │                               │
            │  DA → DTDO → Certificate      │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │    ENTERPRISE DASHBOARD       │
            │    (CMO Command Centre)       │
            │                               │
            │  Homestay | Adventure | Water │
            │  Pending  | Pending   | Pend. │
            │  SLA      | SLA       | SLA   │
            │  Revenue  | Revenue   | Rev.  │
            └───────────────────────────────┘
```

### Folder Structure

```
hptourism/homestay/
├── client/src/
│   ├── pages/
│   │   ├── admin/              # Shared admin pages
│   │   ├── homestay/           # Homestay applicant pages
│   │   ├── adventure-sports/   # Adventure applicant pages (NEW)
│   │   └── water-sports/       # Water Sports pages (Phase II)
│   ├── components/
│   │   ├── shared/             # Reusable components
│   │   └── services/           # Service-specific components
│   │       ├── homestay/
│   │       └── adventure/
│   └── contexts/
│       └── PipelineContext.tsx # Service switching state
├── server/
│   ├── routes/
│   │   ├── core/               # Auth, users, common APIs
│   │   ├── homestay/           # Homestay-specific APIs
│   │   └── adventure/          # Adventure-specific APIs (NEW)
│   └── services/
│       └── workflow/           # Service-agnostic workflow
└── shared/
    ├── schema/
    │   ├── base.ts             # Common tables
    │   ├── homestay.ts         # Homestay-specific
    │   └── adventure.ts        # Adventure-specific (NEW)
    └── services/
        └── registry.ts         # Service definitions (NEW)
```

---

## Adventure Sports Service Details

### Activity Categories (from activityTypes.ts)

| Category | Activities | Base Fee | Insurance Required |
|----------|-----------|----------|-------------------|
| Trekking | Trekking & Hiking | ₹25,000 | ₹50 Lakh |
| Water Adventure | River Rafting | ₹50,000 | ₹1 Crore |
| Air Sports | Paragliding | ₹75,000 | ₹2 Crore |
| Mountain Sports | Rock Climbing, Rappelling | ₹30,000 | ₹75 Lakh |
| Winter Sports | Skiing, Snowboarding | ₹40,000 | ₹1 Crore |
| Cycling | Mountain Biking | ₹20,000 | ₹50 Lakh |

### Required Documents (Adventure Sports)

1. Business Registration Certificate
2. PAN Card of Firm/Proprietor
3. Insurance Policy (as per activity)
4. Staff Certifications (guides, instructors)
5. Equipment Certifications
6. Rescue Team Details
7. Safety Standard Compliance
8. Bank Guarantee / Security Deposit

### Workflow (Same as Homestay)

```
Applicant Submission
        ↓
DA Scrutiny (Document Verification)
        ↓
DTDO Review (Forward/Revert/Query)
        ↓
Inspection (if required)
        ↓
Approval/Rejection
        ↓
License Certificate Issued
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

| Task | Description | Effort |
|------|-------------|--------|
| Service Registry | Create service configuration pattern | 1 day |
| Pipeline Context | React context for service switching | 1 day |
| Route Refactoring | Split routes.ts into modules | 2 days |
| Dashboard Selector | Add pipeline dropdown to admin nav | 1 day |
| Database Migration | Verify adventure schema support | 0.5 day |

### Phase 2: Adventure Sports Frontend (Week 2-4)

| Task | Description | Effort |
|------|-------------|--------|
| Landing Page | `/adventure-sports` public page | 1 day |
| Registration Wizard | Multi-step application form | 3 days |
| Activity Selection | Category and activity picker | 2 days |
| Document Upload | Service-specific document types | 1 day |
| Fee Calculator | Activity-based fee computation | 1 day |
| Owner Dashboard | Adventure applications view | 1 day |

### Phase 3: Admin Integration (Week 4-5)

| Task | Description | Effort |
|------|-------------|--------|
| DA Queue | Filter by applicationType | 1 day |
| DTDO Dashboard | Filter by applicationType | 1 day |
| Certificate Template | Adventure license design | 1 day |
| Reports | Service-aware payment reports | 1 day |

### Phase 4: Testing & Polish (Week 5-6)

| Task | Description | Effort |
|------|-------------|--------|
| E2E Testing | Full workflow test | 2 days |
| UAT | User acceptance testing | 2 days |
| Bug Fixes | Address UAT feedback | 2 days |
| Documentation | User guides, admin guides | 1 day |

---

## Database Strategy

### Existing Support (No Migration Needed)

```sql
-- homestay_applications table already has:
application_type VARCHAR(50) DEFAULT 'homestay'
-- Supports: 'homestay', 'water_sports', 'adventure_sports'

adventure_sports_data JSONB
-- Stores: activity categories, equipment, staff, insurance details
```

### Recommended Additions

```sql
-- Service-specific documents tracking
CREATE TABLE application_documents (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES homestay_applications(id),
  document_type VARCHAR(50),  -- 'id_proof', 'insurance', 'certification'
  service_type VARCHAR(50),   -- 'homestay', 'adventure_sports'
  file_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  created_at TIMESTAMP
);

-- Runtime service configurations
CREATE TABLE service_configurations (
  service_type VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  fee_structure JSONB,
  required_documents JSONB,
  workflow_config JSONB,
  updated_at TIMESTAMP
);
```

---

## Service Registry Pattern

```typescript
// shared/services/registry.ts (NEW)

export const SERVICE_REGISTRY = {
  homestay: {
    id: 'homestay',
    name: 'Homestay Registration',
    prefix: 'HP-HS',
    icon: 'Home',
    workflow: 'standard',
    feeCalculator: 'homestay',
    formWizard: 'homestay',
    certificateTemplate: 'homestay',
    requiredDocuments: [
      'aadhaar', 'pan', 'ownership_proof', 'property_photos',
      'fire_safety', 'undertaking', 'affidavit'
    ],
  },
  
  adventure_sports: {
    id: 'adventure_sports',
    name: 'Adventure Tourism Operator License',
    prefix: 'HP-ATO',
    icon: 'Mountain',
    workflow: 'standard',
    feeCalculator: 'adventure',
    formWizard: 'adventure',
    certificateTemplate: 'adventure',
    requiredDocuments: [
      'business_registration', 'pan', 'insurance_policy',
      'staff_certifications', 'equipment_certifications',
      'rescue_team_details', 'safety_compliance', 'bank_guarantee'
    ],
  },
  
  // Future services...
  water_sports: { /* ... */ },
  river_rafting: { /* ... */ },
  // ...
};

export type ServiceType = keyof typeof SERVICE_REGISTRY;
```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Separate databases? | **NO** - Single DB | Officers need cross-service view |
| Separate apps? | **NO** - Single app | Simpler ops, shared auth |
| Separate landing pages? | **YES** - Per service | Different applicant journeys |
| Shared admin portal? | **YES** - Pipeline switching | Same officers handle all |
| Separate code modules? | **YES** - Service folders | Clear boundaries |

---

## Enterprise Dashboard Concept

```
┌─────────────────────────────────────────────────────────────┐
│  HP TOURISM - CMO COMMAND CENTRE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVICE OVERVIEW                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  HOMESTAY    │  │  ADVENTURE   │  │ WATER SPORTS │       │
│  │  ────────    │  │  ──────────  │  │ ──────────── │       │
│  │  Pending: 45 │  │  Pending: 12 │  │  Pending: 8  │       │
│  │  SLA Breach: │  │  SLA Breach: │  │  SLA Breach: │       │
│  │  3           │  │  0           │  │  1           │       │
│  │  Revenue:    │  │  Revenue:    │  │  Revenue:    │       │
│  │  ₹2.5 Lakh   │  │  ₹1.8 Lakh   │  │  ₹0.6 Lakh   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  DISTRICT-WISE BREAKDOWN                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Kullu    | ████████████████ 156 | ₹12.4L          │    │
│  │ Shimla   | ██████████████ 134   | ₹10.2L          │    │
│  │ Kangra   | ████████████ 98      | ₹8.1L           │    │
│  │ Mandi    | ████████ 67          | ₹5.3L           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [Export Report]  [Configure Alerts]  [View All Services]   │
└─────────────────────────────────────────────────────────────┘
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking Homestay production | High | Keep R1 backup, staged rollout, separate testing |
| Timeline slip | Medium | Start with core pipeline, add features iteratively |
| Code complexity increase | Medium | Strong service boundaries, documentation |
| Performance degradation | Low | Indexed applicationType queries, caching |
| Officer confusion | Low | Clear UI with pipeline selector, training |

---

## Success Criteria

### Phase I Complete When:
1. ✅ Adventure Sports landing page live
2. ✅ Applicants can submit Adventure applications
3. ✅ DA can view and scrutinize Adventure applications
4. ✅ DTDO can approve/reject Adventure applications
5. ✅ Adventure license certificate generated
6. ✅ Payment integration working for Adventure fees
7. ✅ Reports filter by service type
8. ✅ No regression in Homestay functionality

---

## Next Steps (Immediate Actions)

1. **Create Service Registry** (`shared/services/registry.ts`)
2. **Implement Pipeline Context** (`client/src/contexts/PipelineContext.tsx`)
3. **Add Pipeline Selector to Admin Nav** (DA/DTDO headers)
4. **Build Adventure Sports Registration Wizard** (multi-step form)
5. **Update Admin Queries** (filter by `applicationType`)

---

## Appendix A: File Changes Summary

### New Files to Create
```
shared/services/registry.ts
shared/services/types.ts
client/src/contexts/PipelineContext.tsx
client/src/pages/adventure-sports/landing.tsx
client/src/pages/adventure-sports/registration.tsx (enhance existing)
client/src/pages/adventure-sports/dashboard.tsx
client/src/components/services/adventure/ActivitySelector.tsx
client/src/components/services/adventure/StaffDetails.tsx
client/src/components/services/adventure/EquipmentDetails.tsx
server/routes/adventure/index.ts
server/routes/adventure/applications.ts
```

### Files to Modify
```
shared/schema.ts (split into modules)
server/routes.ts (split into service modules)
client/src/App.tsx (add adventure routes)
client/src/pages/da/queue.tsx (add pipeline filter)
client/src/pages/dtdo/dashboard.tsx (add pipeline filter)
client/src/components/layout/AdminNav.tsx (add selector)
```

---

## Appendix B: Environment Summary

| Environment | Domain | Port | Version | Purpose |
|-------------|--------|------|---------|---------|
| PROD | homestay.hp.gov.in | 5055 | v1.0.6 | Live Production |
| R1 Backup | dev.osipl.dev | 5060 | v1.0.6 | PROD Mirror/Staging |
| DEV1 | dev1.osipl.dev | 5040 | v1.0.6 | Active Development |

---

*Document created: February 6, 2026*
*Baseline version: Homestay Portal v1.0.6*
*Next review: After Phase I completion*
