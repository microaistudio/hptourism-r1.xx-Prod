# Product Requirements Document (PRD)

## Module: Adventure Sports Registration
**Phase:** 1A (Initial Rollout)
**Portal:** HP Tourism eServices (2025 Revamp)
**Status:** New Module Addition

---

## 1. Background & Context

The legacy HP Tourism portal supported Adventure registrations under a generic **"Adventure"** category with flat, text-based activity inputs (e.g., rafting, paragliding, water sports). This design is no longer compliant with the **Himachal Pradesh Water Sports & Allied Activities Rules, 2021**, which mandate:

- Activity-specific compliance
- Differentiated safety, equipment, and manpower rules
- Technical Committee–driven approvals

With **HomeStay** now separated as an independent module, **Adventure Sports** must be introduced as a **dedicated, policy-aligned module**.

---

## 2. Objectives (Phase 1A)

1. Introduce **Adventure Sports** as a first-class registration category in the portal
2. Ensure **strict policy compliance** from Day 1
3. Start with the **lightest, lowest-risk activity** to validate workflows
4. Avoid partial or incorrect implementation of complex adventure activities

**Phase 1A Activity Scope:**
- ✅ *Non-Motorized Water Sports – Paddle Boat / Row Boat*

---

## 3. Why Paddle / Row Boat for Phase 1A

Based on the 2021 Rules, Paddle / Row Boats:
- Are **non-motorized** (no engine, fuel, or mechanical inspection)
- Have **minimal safety & equipment requirements**
- Require **simpler manpower validation** (Boatman only)
- Are already familiar to DTDOs and districts

This makes them ideal for:
- Fast development
- Low operational risk
- Smooth departmental adoption

---

## 4. High-Level User Journey

### Step 0 – Application Type Selection
- User selects **“Registration of Tourism Unit”**
- Chooses **“Adventure Sports”** (new category)

---

### Step 1 – Activity Selection

**Activity Category** (fixed in Phase 1A):
- Water Sports

**Activity Type**:
- Non-Motorized Water Sports

**Activity**:
- Paddle Boat / Row Boat

> Other adventure activities will be shown as *“Coming Soon (Phase-wise rollout)”*

---

### Step 2 – Operator & Area Details

- Operator type (Individual / Company / Society)
- Local office address
- District
- Water body (from notified list)
- Specific area of operation (text + map reference, if available)

---

### Step 3 – Equipment Details

Mandatory (as per policy):
- Minimum **3 paddle/row boats**
- Boat details:
  - Manufacturer
  - Identification number
  - Year of manufacture
- Safety equipment:
  - Life jackets
  - Lifebuoys
  - First-aid kit

---

### Step 4 – Manpower Details

Mandatory roles:
- Boatman(s)

For each Boatman:
- Name & DOB
- Registration / certificate upload
- First-aid certification

---

### Step 5 – Declarations & Uploads

- Indemnity bond (as per policy format)
- Operator affidavit
- Acceptance of safety & compliance conditions

---

### Step 6 – Review & Submit

- Application summary
- Submission
- Status moves to **“Under Review”**

---

## 5. Back-Office Workflow (DTDO / Admin)

1. Application appears in **Adventure Sports → Pending Queue**
2. DTDO verifies:
   - Area of operation
   - Equipment count & documents
   - Boatman credentials
3. Forward to **Technical Committee** (offline inspection as per rules)
4. Record inspection outcome
5. Approve / Reject / Seek Clarification
6. Issue **Digital Registration Certificate** upon approval

---

## 6. Data Model (Phase 1A – Minimal)

**Core Entities:**
- adventure_application
- operator
- activity (type = paddle_boat)
- water_body
- equipment
- manpower
- documents
- inspection_status

All models are designed to be **extensible** for future adventure types.

---

## 7. Non-Goals (Explicitly Out of Scope for Phase 1A)

- ❌ Motorized water sports (Jet Ski, Speed Boat)
- ❌ River rafting
- ❌ Paragliding / Air sports
- ❌ Fun rides (Banana, Ringo, Donut)
- ❌ Dynamic fee/rate calculation

These will be introduced **phase-wise** after Phase 1A stabilization.

---

## 8. Success Criteria

- Adventure Sports appears as a separate category in portal
- Paddle / Row Boat applications can be submitted end-to-end
- DTDOs can process and approve applications digitally
- Zero policy deviations or manual bypasses

---

## 9. Future Roadmap (Indicative)

- **Phase 1B:** Kayaking / Canoeing
- **Phase 1C:** Motor Boats
- **Phase 1D:** Jet Ski / Water Scooter
- **Phase 2:** Paragliding, Rafting, Snow Sports

---

## 10. Summary

Phase 1A introduces Adventure Sports into the HP Tourism Portal in a **controlled, compliant, and low-risk manner**. By starting with Paddle / Row Boats, the department ensures:

- Policy-aligned digitization
- Faster rollout
- Strong foundation for future adventure activities

This mirrors the successful **HomeStay-first, expand-later** strategy already adopted in the portal revamp.

