# Test Case Scenarios – Homestay Portal Workflows

This document defines **reusable, end‑to‑end automated test scenarios** for the Homestay Portal. It is intended to be a **living reference**: whenever workflows change, only the relevant sections need to be updated.

---

## Scope & Principles

- Covers **functional, workflow, and system-level automation**
- Each scenario is **state-driven** (who owns the application at each step)
- Designed for **E2E automation + reporting**
- Supports **multiple applications per scenario** to catch edge cases
- Explicitly separates **New, Existing, Amendment, and Service flows**

---

## Actors

- **Applicant** – Property owner / license holder
- **DA (District Authority)** – Initial scrutiny & inspections
- **DTDO** – Final authority, scheduling, approval/rejection
- **System** – Payments, notifications, status transitions

---

# Test Case 1: New Registration (End-to-End)

### Purpose
Validate the complete lifecycle of a **new homestay registration**, including payment, scrutiny, inspection, corrections, approval, and rejection.

### Entry Point
Applicant → *New Registration*

### Workflow Steps
1. Applicant fills multi-step application form
2. Applicant makes **mandatory payment** (category-based)
3. System auto-submits application after successful payment
4. Application moves to **DA – Scrutiny Pending**

**DA Actions**
5. DA reviews application
6. DA may:
   - Send back for correction (**OTP confirmation from DTDO required**)
   - Forward to DTDO

**DTDO Actions (Pre‑Inspection)**
7. DTDO reviews DA remarks
8. DTDO may:
   - Send back for correction (Applicant resubmits directly to DTDO)
   - Reject application
   - Schedule inspection → assign DA

**Inspection Flow**
9. DA conducts inspection
10. DA submits inspection report (OK / With Remarks)

**DTDO Final Decision**
11. DTDO may:
    - Send back for correction
    - Approve application → RC issued
    - Reject application

### Automation Coverage
- Happy path (straight approval)
- DA correction loop
- DTDO correction loop
- Inspection + approval
- Rejection at DTDO

### Recommended Test Volume
- 10 applications
  - 4 straight approvals
  - 3 DA corrections
  - 2 DTDO corrections
  - 1 rejection

---

# Test Case 2: Existing RC Onboarding (NOT Renewal)

### Purpose
Onboard **already-valid RCs** into the new system without payment or inspection.

### Entry Point
Applicant → *Onboard Existing RC*

### Workflow Steps
1. Applicant selects **Existing RC** option
2. Applicant submits:
   - RC number
   - Proof of identity
   - Minimal property/owner details
3. No payment required
4. Application submitted to **DA**

**DA Actions**
5. DA verifies RC existence and applicant identity
6. DA may:
   - Send back for correction
   - Forward to DTDO

**DTDO Actions**
7. DTDO reviews DA report
8. DTDO may:
   - Approve → RC available for download
   - Send back for correction

### Notes
- No inspection (optional edge case only)
- No rejection unless RC invalid

### Automation Coverage
- Standard approval
- Correction loop
- Optional inspection (single test)

---

# Test Case 3: Renewal

### Purpose
Validate renewal of an **expiring RC** (same as new registration flow).

### Entry Point
System Notification (90 days prior) → Service Center → *Renewal*

### Workflow
- Same as **New Registration**
- Full application
- Full document submission
- **Full payment required**
- Inspection applicable

### Automation Focus
- Renewal trigger availability
- Category-based payment
- Renewal approval replaces old RC

### Recommended Test Volume
- 5–10 renewal applications across categories

---

# Test Case 4: Add Room

### Purpose
Validate increasing room count for an existing RC.

### Entry Point
Service Center → *Add Room*

### Workflow Steps
1. Applicant selects number of rooms to add
2. Full document submission
3. **Full payment required**
4. Validity = remaining validity of original RC
5. Workflow follows **New Registration path** (scrutiny + inspection)

### Automation Checks
- Correct fee calculation
- Validity alignment
- RC update after approval

---

# Test Case 5: Delete Room

### Purpose
Validate reduction of room count.

### Entry Point
Service Center → *Delete Room*

### Workflow Steps
1. Applicant submits room reduction request
2. No payment
3. No inspection
4. DA verifies
5. DTDO approves
6. RC updated

### Automation Coverage
- Simple approval
- Status change

---

# Test Case 6: Cancellation

### Purpose
Validate complete license cancellation.

### Entry Point
Service Center → *Cancel License*

### Workflow Steps
1. Applicant confirms cancellation (checkboxes)
2. Request submitted
3. DA verifies no pending issues
4. DTDO approves cancellation
5. RC marked cancelled

### Automation Focus
- Confirmation checks
- State transition correctness

---

# Test Case 7: Upgrade Category

### Purpose
Upgrade category (Silver → Gold → Diamond).

### Entry Point
Service Center → *Upgrade Category*

### Workflow Steps
1. Applicant selects new category
2. System warns about **cancellation of existing RC**
3. Applicant confirms
4. Full application under new category
5. Full payment
6. Old RC cancellation happens **in background**
7. Workflow continues like **New Registration**

### Automation Focus
- Embedded cancellation
- Category validation
- Correct RC replacement

---

# Test Case 8: Performance & Load Testing

### Purpose
Validate system stability under load.

### Scenario
- Batch of **20–30 applications** within fixed time window
- Mixed types:
  - New registrations
  - Existing RC onboarding
  - Renewals
  - Add/Delete room

### Metrics
- Submission success rate
- Payment latency
- API response time
- Workflow completion time
- Failure handling

### Example
- 30 applications in 10 minutes
- Target: ≥95% success

---

## Reporting Requirements

Each test run should output:
- Total applications created
- Breakdown by test case
- Count per outcome (approved / correction / rejected)
- Time taken per stage

---

## Status

✅ Functional workflows covered
⚠ Upgrade Category workflow to be finalized in implementation
📌 Document designed for reuse and future updates

