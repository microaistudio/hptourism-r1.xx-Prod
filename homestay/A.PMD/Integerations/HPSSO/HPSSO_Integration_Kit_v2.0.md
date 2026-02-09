# HPDoIT – HP Single Sign-On (SSO) Integration Kit  
Himachal Pradesh – Single Sign On (Him Access Citizen)

---

## Document Control Information

| Field | Details |
|------|--------|
| Document Name | Himachal Pradesh Single Sign On (Him Access Citizen) |
| Project Name | Himachal Pradesh Single Sign On |
| Client | Department of Information Technology, Government of Himachal Pradesh |
| Document Version | 2.0 |
| Document Status | Final |
| Date Released | 31 December 2024 |
| File Name | HPSSO Integration KIT |

---

## Introduction

The Single Sign-On (SSO) application developed by the Department of Digital Technologies and Governance, Government of Himachal Pradesh, allows citizens to access multiple government services using a single login credential.

This simplifies user experience, improves security, and eliminates the need to remember multiple usernames and passwords.

---

## Integrating Using I-Frame

HPSSO supports I-Frame based integration for seamless embedding of authentication within departmental portals.

---

## End Points and Environments

| Environment | URL |
|------------|-----|
| Production | Shared after successful Pre-Production integration |
| Pre-Production | Shared after prior approval from the concerned authority |

---

## Status Codes

| Status Code | Message |
|------------|--------|
| 200 | Success |
| 201 | Inserted Successfully |
| 202 | Updated Successfully |
| 401 | Method Not Allowed |
| 403 | Unauthorized |

---

## Method Description

| Method | URL |
|------|-----|
| POST | https://preproduction_url/validateToken |

---

## Process Involved

### Script Integration

```html
<script src="https://pre-production-url:port/login.js" defer></script>
```

### HTML Elements

```html
<div class="backdrop"></div>
<div id="iframeContainer" class="iframe-container"></div>
```

### Button Trigger

```javascript
getIframeSSO("service_id");
```

---

## Token Validation API

### Parameters

| Mandatory | Parameter | Encrypted | Data Type |
|---------|----------|-----------|-----------|
| Yes | token, secret_key | Yes | Encrypted String |
| Yes | service_id | No | String |

### Success Response

```json
{
  "data": "U2FsdGVkX1/ujtExWwdDv8VXvPszoidM3ykg="
}
```

### Error Responses

| Status | Message |
|------|--------|
| 500 | Invalid Secret Key or service_id/token |
| 404 | Valid token required |

---

## Him Access – Link / Merge Confirmation

This feature enables users to merge multiple registered accounts into a single unified login, improving usability and reducing duplication.

---

**End of Document**
