# HP Tourism Homestay Portal - Release Notes

## Version: v1.3.2
**Date**: 2026-03-11

### Summary
Production normalization and security hardening release. Finalizes environment parity, standardizes deployment workflows, and introduces digital signature management.

### Key Features
- **Digital Signature Support**: Added ability for DTDOs and staff to upload digital signatures via Profile Page for inclusion in auto-generated certificates.
- **CMO Command Centre**: Renamed Quarterdeck to "Command Centre" and enhanced state-level data visualization hierarchy.
- **Payment Reconciliation**: Full implementation of 3-layer reconciliation (Cron, Page-load, Manual) for Himkosh integration.
- **Role Enhancements**: Introduced `inspector` and `payment_officer` roles for specialized audit and financial tasks.

### Infrastructure & Security
- **Production Stability**: Standardized application execution under `hptourism` user and resolved zombie process issues.
- **Security Hardening**: Fixed production `.env` vulnerabilities and updated session security policies.
- **Version Tracking**: Synchronized version numbering across `package.json`, release notes, and deployment archives.

---

## Version: v1.2.0
**Date**: 2026-02-25

### Changes
- **Multi-DA Support**: Enabled multiple District Assistant (DA) accounts per district for better workload distribution.
- **Dynamic Documents**: Conditional document requirements (e.g., MC NOC) based on property location (Urban/Rural).
- **Audit Logs**: Enhanced tracking for application status transitions.

---

## Version: v1.1.0
**Date**: 2026-02-12

### Changes
- **Reports & Insights Overhaul**: Complete redesign with Him-Darshan aesthetics.
- **Global Search**: Added search functionality to reports filters.
- **Performance Improvements**: Client-side optimized filtering.
- **Bug Fixes**: Resolved blank screen issue in Payment Reports.

---

## Version: v1.0.6
**Date**: 2026-02-07

### Summary
Current production version foundation. Includes critical security fixes, unified portal architecture foundation, and enhanced workflow stability.

### Key Features
- **Security Hardening**: HTTPS enforcement, Secure Cookies, Single Session policy.
- **Unified Portal**: Architecture for multi-service support (Homestay + Adventure Sports).
- **Workflows**: Complete lifecycles for New Registration, Amendments, and Cancellations.
- **Dashboards**: Enhanced DA and DTDO dashboards with better queues and monitoring.
