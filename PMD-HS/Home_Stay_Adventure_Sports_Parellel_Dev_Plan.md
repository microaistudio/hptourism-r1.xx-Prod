# HP Tourism: Parallel Development Strategy (Homestay & Adventure Sports)
**"The Context Saver"** - *If lost, read this to get back on track.*

**Date:** February 13, 2026
**Baseline Version:** v1.1.5 (Homestay Production R1)
**Target:** Adventure Sports (Phase I Expansion)

---

## 1. The Core Strategy: "Two Tracks, One Engine"

We are building **Adventure Sports** (Service #2) on top of the **Homestay** (Service #1) codebase.

*   **Architecture:** Monolithic "Single App" with Pipeline Switching.
*   **Challenge:** We must maintain/fix Homestay (v1.1.x) *while* continuously building Adventure (v1.6.x).
*   **Solution:** Parallel Git Branches with Upstream Merging.

Both services live in the **same repository**. We do NOT fork the repo. We fork the **branch**.

---

## 2. Git Workflow (The Lifeblood)

This workflow is designed to prevent "Merge Hell" and ensure that any fix made in Homestay automatically propagates to Adventure.

### The Branches

1.  **`main` (The Homestay Stable Track)**
    *   **Purpose:** Production code for Homestay.
    *   **Dev Activity:** Bug fixes, minor UI tweaks, critical patches (e.g., Payment Gateway fixes).
    *   **Versioning:** `v1.1.5` → `v1.1.6` → `v1.2.0`.
    *   **Rule:** NEVER commit Adventure Sports unfinished code here.

2.  **`feat/adventure-sports` (The Expansion Track)**
    *   **Purpose:** Development of the new Adventure Sports pipeline.
    *   **Dev Activity:** Heavy refactoring, new schemas, new pages, Service Registry implementation.
    *   **Versioning:** Starts at `v1.1.5` → Jumps to `v1.5.0` (Dev) → Targets `v1.6.0` (Release).
    *   **Rule:** This branch is "The Future". It contains everything in `main` PLUS Adventure.

### The Sync Protocol (CRITICAL)

**The Golden Rule:** Fix bugs in `main` (Homestay), then merge to `adventure`.

**Scenario:** *You fix a "Payment Pending" bug in Homestay (v1.1.6).*

1.  **Fix it in `main`:**
    ```bash
    git checkout main
    # ... fix bug ...
    git commit -m "fix(payment): resolve pending status issue"
    git push origin main
    ```

2.  **Sync `adventure` (The Magic Step):**
    *On the Adventure Development Machine:*
    ```bash
    git checkout feat/adventure-sports
    git pull origin feat/adventure-sports  # Ensure local is up to date
    git fetch origin main                  # Fetch the new fix from Homestay
    git merge origin/main                  # <--- MERGE FIX INTO ADVENTURE
    # Resolve conflicts (if any), usually in shared/schema or routes.ts
    git commit -m "chore: sync with main v1.1.6"
    git push origin feat/adventure-sports
    ```

**Result:** Adventure Sports now has the payment fix, *plus* all the new adventure features.

---

## 3. Architecture Rules to Avoid Conflicts

To make the merges painless, we adhere to **Strict Modularity**.

### A. The "Do Not Touch" Zone (Shared Core)
*Avoid modifying these files on the `adventure` branch unless absolutely necessary for universal logic.*
*   `server/db.ts` (Connection logic)
*   `server/auth.ts` (Login flow)
*   `client/src/lib/*` (Utility functions)
*   *Why?* Changes here cause complex conflicts. If you must change them, consider doing it in `main` first.

### B. The "Green Zone" (Service Modules)
*Safe to modify. These files are isolated by design.*
*   `server/routes/homestay/*` vs `server/routes/adventure/*`
*   `client/src/pages/homestay/*` vs `client/src/pages/adventure/*`
*   `shared/schema/homestay.ts` vs `shared/schema/adventure.ts`
*   *Why?* Since they are separate files, git can merge them automatically without issues.

### C. The "Danger Zone" (Routers & Schema)
*These files unify the app. Expect conflicts here; handle with care.*
*   `server/routes.ts`: **Action:** Refactor this ASAP. Split it into:
    ```typescript
    app.use('/api/homestay', homestayRoutes);
    app.use('/api/adventure', adventureRoutes);
    ```
*   `shared/schema.ts`: **Action:** Split this file! Do not keep adding to a 2000-line file.
    *   Create `shared/schema/index.ts` that exports from `homestay.ts` and `adventure.ts`.

---

## 4. Setup Guide for New VM (Adventure Dev)

If you are setting up the new machine, follow this **exact sequence** to minimize friction.

1.  **Clone & Branch:**
    ```bash
    git clone <repo_url> hptourism-adventure
    cd hptourism-adventure
    git checkout -b feat/adventure-sports
    ```

2.  **Refactor First (The Foundation):**
    Before writing a single line of *Adventure* code, **refactor the Homestay code** to be modular.
    *   Create `shared/services/registry.ts`.
    *   Move Homestay routes to `server/routes/homestay/index.ts`.
    *   *Commit this refactor immediately.* This proves module isolation works before adding complexity.

3.  **Build Adventure:**
    *   Now start building the Adventure specific screens and routes in their own folders.

---

## 5. Emergency Context Recovery

*Read this section if you return to the project after a break and feel lost.*

1.  **"Where is my code?"**
    *   Homestay Production is on `main`.
    *   Adventure Development is on `feat/adventure-sports`.

2.  **"Why is the version weird?"**
    *   Homestay might be `v1.2.0`.
    *   Adventure is `v1.6.0` because it includes "future" features. When Adventure launches, the whole platform moves to v1.6.0 (or v2.0.0).

3.  **"I found a bug in the Login screen!"**
    *   **STOP.** Do not fix it in `feat/adventure-sports` only.
    *   Switch to `main`. Fix it there.
    *   Merge `main` into `feat/adventure-sports`.
    *   *Reason:* If you fix it in Adventure, Homestay Production won't get the fix until Adventure launches (which might be months away).

---
**Signed:** Subhash & Antigravity
**Date:** Feb 13, 2026
