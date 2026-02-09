export const APP_CONSTANTS = {
    // Application Rules
    MAX_ROOMS_PER_UNIT: 6, // 2025 Rules: Homestay unit max capacity (verified with schema)
    MAX_BEDS_TOTAL: 12,    // 2025 Rules: Max beds across all rooms

    // File Uploads
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],

    // Rate Limiting
    RATE_LIMIT_GLOBAL: 1000, // requests per 15 min
};

export const APPLICATION_STATUSES = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    DOCUMENT_VERIFICATION: 'document_verification',
    CLARIFICATION_REQUESTED: 'clarification_requested',
    SITE_INSPECTION_SCHEDULED: 'site_inspection_scheduled',
    SITE_INSPECTION_COMPLETE: 'site_inspection_complete',
    PAYMENT_PENDING: 'payment_pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    REVERTED: 'reverted'
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];

export const USER_ROLES = {
    PROPERTY_OWNER: 'property_owner',
    DISTRICT_OFFICER: 'district_officer', // DO
    DEALING_ASSISTANT: 'dealing_assistant', // DA
    DTDO: 'district_tourism_officer', // DTDO
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
} as const;
