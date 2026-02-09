# HP Tourism Multi-Service Architecture Review

## Executive Summary

After reviewing the current Homestay Portal codebase (v1.0.6), I've identified that the **foundation for multi-service support already exists**. The architecture supports:

- `applicationType` field in schema (`'homestay' | 'water_sports' | 'adventure_sports'`)
- JSONB fields for service-specific data (`waterSportsData`, `adventureSportsData`)
- Activity definitions in `shared/activityTypes.ts`
- Initial Adventure Sports registration page

Your assumption is **CORRECT**: Building Adventure Sports as the second service will establish patterns for the remaining 6 services.

---

## Current Architecture Assessment

### ✅ Well-Designed (Reusable)

| Component | Description | Reuse Potential |
|-----------|-------------|-----------------|
| **User Management** | Roles, permissions, SSO | 100% reusable |
| **Payment Gateway** | HimKosh, CCAvenue integration | 100% reusable |
| **Document Uploads** | S3/Local storage abstraction | 100% reusable |
| **Workflow Engine** | Application status, transitions | 90% reusable |
| **Admin Dashboards** | DA, DTDO queue views | 80% reusable with pipeline filter |
| **Certificate Generation** | PDF generation, QR codes | 70% reusable (template change) |
| **Notification System** | Activity logs, alerts | 100% reusable |

### ⚠️ Needs Refactoring

| Component | Current State | Required Change |
|-----------|---------------|-----------------|
| **Application Schema** | Tightly coupled to Homestay fields | Add service context abstraction |
| **Fee Calculator** | Room-based for Homestay | Create fee strategy per service |
| **Form Pages** | Hardcoded for property details | Wizard factory pattern |
| **Routes** | Monolithic `routes.ts` (84KB) | Split by service domain |
| **Dashboard Cards** | Homestay-specific metrics | Service-agnostic statistics |

---

## Recommended Architecture

### Option A: Monorepo with Service Modules (RECOMMENDED)

```
hptourism-portal/
├── apps/
│   ├── homestay/          # Current application (port 5055)
│   └── admin-portal/      # Shared admin interface
├── packages/
│   ├── @hptourism/core    # Shared utilities, types
│   ├── @hptourism/ui      # Design system components
│   ├── @hptourism/auth    # Authentication/Authorization
│   ├── @hptourism/payment # Payment gateway integrations
│   └── @hptourism/workflow# Application workflow engine
└── services/
    ├── homestay/          # Homestay-specific logic
    ├── adventure-sports/  # Adventure Sports logic
    ├── water-sports/      # Water Sports logic
    └── ...
```

**Pros:**
- Clean separation of concerns
- Independent deployments per service
- Shared codebase for common components
- Easy to onboard new developers per service

**Cons:**
- Migration effort required
- Build complexity increases
- Need package versioning strategy

### Option B: Single App with Pipeline Switching (PRAGMATIC)

```
hptourism/homestay/
├── client/src/
│   ├── pages/
│   │   ├── admin/         # Shared admin pages
│   │   ├── homestay/      # Homestay applicant pages
│   │   ├── adventure-sports/  # Adventure applicant pages
│   │   └── water-sports/  # Water Sports applicant pages
│   ├── components/
│   │   ├── shared/        # Reusable components
│   │   └── services/      # Service-specific components
│   │       ├── homestay/
│   │       ├── adventure/
│   │       └── water/
│   └── lib/
│       └── services/      # Service configuration registry
├── server/
│   ├── routes/
│   │   ├── core/          # Auth, users, common APIs
│   │   ├── homestay/      # Homestay-specific APIs
│   │   ├── adventure/     # Adventure-specific APIs
│   │   └── water/         # Water Sports APIs
│   └── services/
│       └── workflow/      # Service-agnostic workflow engine
└── shared/
    ├── schema/
    │   ├── base.ts        # Common tables (users, payments)
    │   ├── homestay.ts    # Homestay-specific
    │   ├── adventure.ts   # Adventure-specific
    │   └── water.ts       # Water Sports-specific
    └── config/
        └── services.ts    # Service registry
```

**Pros:**
- Minimal migration from current codebase
- Single deployment
- Shared session/auth context
- Faster to implement

**Cons:**
- Can become monolithic over time
- Need discipline in code organization
- Potential for cross-service coupling

---

## My Recommendation: Option B (Pragmatic Approach)

Given:
1. **Timeline**: 2 months for remaining services
2. **Team Size**: Appears to be small team
3. **Existing Foundation**: Already has multi-type support
4. **Backend Officers**: Same approval authority for all services

**Option B is the right choice** - evolve the current codebase rather than rewrite.

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. **Service Registry Pattern**
   ```typescript
   // shared/services/registry.ts
   export const SERVICE_REGISTRY = {
     homestay: {
       id: 'homestay',
       name: 'Homestay Registration',
       prefix: 'HS',
       workflow: 'standard', // DA → DTDO → Certificate
       feeCalculator: 'homestay',
       formWizard: 'homestay',
     },
     adventure_sports: {
       id: 'adventure_sports',
       name: 'Adventure Tourism Operator',
       prefix: 'ATO',
       workflow: 'standard',
       feeCalculator: 'adventure',
       formWizard: 'adventure',
     },
   };
   ```

2. **Pipeline Context Provider**
   ```typescript
   // client/src/contexts/PipelineContext.tsx
   export const PipelineProvider = ({ children }) => {
     const [activePipeline, setActivePipeline] = useState<ServiceType>('homestay');
     // Provides service-specific config to all components
   };
   ```

3. **Dashboard Pipeline Selector**
   - Add dropdown in DA/DTDO dashboard header
   - Filter all queries by `applicationType`

### Phase 2: Adventure Sports Frontend (Week 2-4)
1. **Landing Page** - `/adventure-sports`
2. **Registration Wizard** - Multi-step form
3. **Application Dashboard** - Owner's submitted applications
4. **Document Upload** - Service-specific requirements

### Phase 3: Admin Dashboard Integration (Week 4-5)
1. **Pipeline Switcher** - Universal dropdown in admin nav
2. **Application Queue** - Filter by `applicationType`
3. **Reports** - Service-aware aggregations
4. **Enterprise Dashboard** - Cross-service summary

### Phase 4: Remaining Services (Week 5-8)
- Water Sports (similar to Adventure)
- Rafting Operators
- Tour Operators
- etc.

---

## Database Strategy

### Already Implemented ✅
```sql
-- homestay_applications table
applicationType VARCHAR(50) DEFAULT 'homestay'
waterSportsData JSONB
adventureSportsData JSONB
```

### Recommended Addition
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

-- Service configurations (runtime adjustable)
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

## Enterprise Dashboard Concept

```
┌─────────────────────────────────────────────────────────────┐
│  HP TOURISM - CMO COMMAND CENTRE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  HOMESTAY    │  │  ADVENTURE   │  │ WATER SPORTS │       │
│  │  ────────    │  │  ──────────  │  │ ──────────── │       │
│  │  Pending: 45 │  │  Pending: 12 │  │  Pending: 8  │       │
│  │  SLA Breach: │  │  SLA Breach: │  │  SLA Breach: │       │
│  │  3           │  │  0           │  │  1           │       │
│  │  Revenue:    │  │  Revenue:    │  │  Revenue:    │       │
│  │  ₹2.5L       │  │  ₹1.8L       │  │  ₹0.6L       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  [View All Districts]  [Export Report]  [Configure]         │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Separate databases? | **NO** - Single DB | Officers need cross-service view |
| Separate deployments? | **NO** - Single app | Simpler ops, shared auth |
| Separate landing pages? | **YES** - Per service | Different applicant journeys |
| Shared admin portal? | **YES** - Pipeline switching | Same officers handle all |
| Code organization? | **Service modules** | Clear boundaries, easy navigation |

---

## Next Steps

1. **Create Service Registry** - Define all 8 services with their configurations
2. **Refactor Routes** - Split `routes.ts` into service modules
3. **Add Pipeline Context** - React context for service switching
4. **Build Adventure Sports Forms** - Using existing activity definitions
5. **Update Admin Views** - Add pipeline filter
6. **Create Enterprise Dashboard** - CMO-level overview

---

## Files to Create/Modify

### New Files:
- `shared/services/registry.ts` - Service definitions
- `shared/services/types.ts` - Service type interfaces
- `client/src/contexts/PipelineContext.tsx` - Pipeline state
- `client/src/pages/adventure-sports/*` - Applicant pages
- `server/routes/adventure/` - API routes

### Files to Refactor:
- `shared/schema.ts` - Split into modules
- `server/routes.ts` - Split by service domain
- `client/src/pages/da/*` - Add pipeline filter
- `client/src/pages/dtdo/*` - Add pipeline filter

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking Homestay | Keep R1 backup, staged rollout |
| Timeline slip | Start with core pipeline, add features iteratively |
| Code complexity | Strong service boundaries, documentation |
| Performance | Indexed `applicationType` queries |

---

*Document prepared: February 6, 2026*
*Version: 1.0.6 baseline*
