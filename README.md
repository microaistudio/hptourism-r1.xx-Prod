# HP Tourism — Homestay eServices Portal

> **Current Version: `v1.3.0`** | Last Deployed to PROD: March 8, 2026

Government portal for managing Homestay Registration Certificates under the Himachal Pradesh Department of Tourism. Handles new online applications and legacy (existing) RC onboarding through a multi-stage workflow involving Dealing Assistants (DA), District Tourism & Development Officers (DTDO), Inspectors, and applicants.

---

## Repository Structure

```
hptourism/
├── homestay/              ← Application source code (Node.js + React + PostgreSQL)
│   ├── client/            ← React frontend (Vite, TypeScript, shadcn/ui)
│   ├── server/            ← Express.js backend API
│   ├── shared/            ← Shared types, schemas, district routing logic
│   ├── scripts/           ← Build & deployment scripts
│   ├── migrations/        ← Drizzle ORM database migrations
│   ├── deploy/            ← PROD installer (install.sh)
│   ├── ecosystem.config.cjs  ← PM2 config (DEV1 only, never shipped to PROD)
│   ├── .env               ← Environment variables (DEV1 only, gitignored)
│   └── package.json       ← Version source of truth
│
├── PMD -HS/               ← Project Management Documentation & Knowledge Base
│   ├── PROD Profile & Instructions/  ← PROD server config, deployment SOPs
│   ├── Deployment/                   ← Deployment artifacts & scripts
│   ├── Enhancements_&_Updates/       ← Feature planning docs
│   ├── payment/                      ← Payment integration docs (HimKosh)
│   ├── workflow/                     ← Business workflow specs
│   └── Testing/                      ← Test plans
│
└── README.md              ← This file
```

---

## Environments

| Environment | URL | Port | DB Name | PM2 Process | User |
|:--|:--|:--|:--|:--|:--|
| **PROD** | `https://homestay.hp.gov.in` | `5055` | `hptourism` | `hptourism-prod` | `hptourism` |
| **DEV1** | `https://dev1.osipl.dev` | `5055` | `hptourism-dev` | `hptourism-dev1` | local user |

---

## Critical PROD Rules (Read Before Any Deployment)

1. **Never run PM2 as `root`** — Always use `sudo -u hptourism pm2 <cmd>` on PROD.
2. **Always `chown` after copying files** — Files copied as root get root ownership, causing PM2 crash loops.
3. **Never ship `.env` or `ecosystem.config.cjs` to PROD** — PROD has its own `.env` on the server. Use `scripts/build-prod-pack.sh` to create safe tarballs.
4. **Deployment SOP** — See `PMD -HS/PROD Profile & Instructions/` for the full step-by-step procedure.

---

## Version History

| Version | Date | Key Changes |
|:--|:--|:--|
| `v1.3.0` | Mar 8, 2026 | PROD stabilization (zombie fix, user standardization), admin UI math fix, secure build pipeline, payment reconciliation cron, deployment automation |
| `v1.2.5` | Feb 2026 | Legacy RC onboarding, DTDO split-district routing, inspection workflow |
| `v1.2.0` | Feb 2026 | Payment integration (HimKosh), document uploads, DA/DTDO workflows |
| `v1.1.0` | Jan 2026 | Initial production release |

---

## District Routing (Business Logic)

Applications are routed to DTDO offices using these rules:

- **Standard (6):** Kangra, Kullu, Shimla, Solan, Sirmaur, Kinnaur — each has its own DTDO.
- **Merged (2):** Mandi DTDO handles Mandi + Bilaspur. Hamirpur DTDO handles Hamirpur + Una.
- **Split by Tehsil (4):** Chamba splits into Chamba Main + Pangi. Lahaul-Spiti splits into Lahaul + Kaza.

Logic lives in: `homestay/shared/districtRouting.ts`

---

## Quick Commands

```bash
# DEV1: Start locally
cd homestay && npm run dev

# DEV1: Build for PROD
cd homestay && bash scripts/build-prod-pack.sh

# PROD: Check status
sudo -u hptourism pm2 status

# PROD: View logs
sudo -u hptourism pm2 logs hptourism-prod

# PROD: Deploy (from PROD server)
bash ~/setup/deploy-1.3.0.sh
```

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, shadcn/ui, TanStack Query
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL 16, Drizzle ORM
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **Payment Gateway:** HimKosh (HP Government Treasury)
- **Auth:** Session-based with HP SSO integration
