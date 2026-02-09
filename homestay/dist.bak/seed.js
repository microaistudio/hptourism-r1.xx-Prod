var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/seed.ts
import bcrypt from "bcrypt";

// server/db.ts
import ws from "ws";
import { Pool as PgPool } from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  APPLICATION_KIND_VALUES: () => APPLICATION_KIND_VALUES,
  PROJECT_TYPE_VALUES: () => PROJECT_TYPE_VALUES,
  applicationActions: () => applicationActions,
  applicationKindEnum: () => applicationKindEnum,
  auditLogs: () => auditLogs,
  ccavenueTransactions: () => ccavenueTransactions,
  certificates: () => certificates,
  clarifications: () => clarifications,
  ddoCodes: () => ddoCodes,
  documents: () => documents,
  draftHomestayApplicationSchema: () => draftHomestayApplicationSchema,
  grievanceAuditLog: () => grievanceAuditLog,
  grievanceComments: () => grievanceComments,
  grievances: () => grievances,
  himkoshTransactions: () => himkoshTransactions,
  homestayApplications: () => homestayApplications,
  insertApplicationActionSchema: () => insertApplicationActionSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertCcavenueTransactionSchema: () => insertCcavenueTransactionSchema,
  insertCertificateSchema: () => insertCertificateSchema,
  insertClarificationSchema: () => insertClarificationSchema,
  insertDdoCodeSchema: () => insertDdoCodeSchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertGrievanceCommentSchema: () => insertGrievanceCommentSchema,
  insertGrievanceSchema: () => insertGrievanceSchema,
  insertHimkoshTransactionSchema: () => insertHimkoshTransactionSchema,
  insertHomestayApplicationSchema: () => insertHomestayApplicationSchema,
  insertInspectionOrderSchema: () => insertInspectionOrderSchema,
  insertInspectionReportSchema: () => insertInspectionReportSchema,
  insertLgdBlockSchema: () => insertLgdBlockSchema,
  insertLgdDistrictSchema: () => insertLgdDistrictSchema,
  insertLgdGramPanchayatSchema: () => insertLgdGramPanchayatSchema,
  insertLgdTehsilSchema: () => insertLgdTehsilSchema,
  insertLgdUrbanBodySchema: () => insertLgdUrbanBodySchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertObjectionSchema: () => insertObjectionSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertProductionStatsSchema: () => insertProductionStatsSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertStorageObjectSchema: () => insertStorageObjectSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertSystemSettingSchema: () => insertSystemSettingSchema,
  insertTicketActionSchema: () => insertTicketActionSchema,
  insertTicketMessageSchema: () => insertTicketMessageSchema,
  insertUserProfileSchema: () => insertUserProfileSchema,
  insertUserSchema: () => insertUserSchema,
  inspectionOrders: () => inspectionOrders,
  inspectionReports: () => inspectionReports,
  lgdBlocks: () => lgdBlocks,
  lgdDistricts: () => lgdDistricts,
  lgdGramPanchayats: () => lgdGramPanchayats,
  lgdTehsils: () => lgdTehsils,
  lgdUrbanBodies: () => lgdUrbanBodies,
  loginOtpChallenges: () => loginOtpChallenges,
  notifications: () => notifications,
  objections: () => objections,
  passwordResetChallenges: () => passwordResetChallenges,
  payments: () => payments,
  productionStats: () => productionStats,
  reviews: () => reviews,
  selectApplicationActionSchema: () => selectApplicationActionSchema,
  selectAuditLogSchema: () => selectAuditLogSchema,
  selectCcavenueTransactionSchema: () => selectCcavenueTransactionSchema,
  selectCertificateSchema: () => selectCertificateSchema,
  selectClarificationSchema: () => selectClarificationSchema,
  selectDdoCodeSchema: () => selectDdoCodeSchema,
  selectDocumentSchema: () => selectDocumentSchema,
  selectGrievanceSchema: () => selectGrievanceSchema,
  selectHimkoshTransactionSchema: () => selectHimkoshTransactionSchema,
  selectHomestayApplicationSchema: () => selectHomestayApplicationSchema,
  selectInspectionOrderSchema: () => selectInspectionOrderSchema,
  selectInspectionReportSchema: () => selectInspectionReportSchema,
  selectLgdBlockSchema: () => selectLgdBlockSchema,
  selectLgdDistrictSchema: () => selectLgdDistrictSchema,
  selectLgdGramPanchayatSchema: () => selectLgdGramPanchayatSchema,
  selectLgdTehsilSchema: () => selectLgdTehsilSchema,
  selectLgdUrbanBodySchema: () => selectLgdUrbanBodySchema,
  selectNotificationSchema: () => selectNotificationSchema,
  selectObjectionSchema: () => selectObjectionSchema,
  selectPaymentSchema: () => selectPaymentSchema,
  selectProductionStatsSchema: () => selectProductionStatsSchema,
  selectReviewSchema: () => selectReviewSchema,
  selectSupportTicketSchema: () => selectSupportTicketSchema,
  selectSystemSettingSchema: () => selectSystemSettingSchema,
  selectTicketActionSchema: () => selectTicketActionSchema,
  selectTicketMessageSchema: () => selectTicketMessageSchema,
  selectUserProfileSchema: () => selectUserProfileSchema,
  selectUserSchema: () => selectUserSchema,
  session: () => session,
  sessions: () => sessions,
  storageObjects: () => storageObjects,
  supportTickets: () => supportTickets,
  systemSettings: () => systemSettings,
  ticketActions: () => ticketActions,
  ticketMessages: () => ticketMessages,
  userProfileFormSchema: () => userProfileFormSchema,
  userProfiles: () => userProfiles,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var APPLICATION_KIND_VALUES = ["new_registration", "renewal", "add_rooms", "delete_rooms", "cancel_certificate", "change_category", "change_ownership"];
var applicationKindEnum = z.enum(APPLICATION_KIND_VALUES);
var serviceContextSchema = z.object({
  requestedRooms: z.object({
    single: z.number().int().min(0).optional(),
    double: z.number().int().min(0).optional(),
    family: z.number().int().min(0).optional(),
    total: z.number().int().min(0).optional()
  }).partial().optional(),
  requestedRoomDelta: z.number().int().optional(),
  requestedDeletions: z.array(
    z.object({
      roomType: z.string().min(1),
      count: z.number().int().min(1)
    })
  ).optional(),
  renewalWindow: z.object({
    start: z.string().min(4),
    end: z.string().min(4)
  }).partial().optional(),
  requiresPayment: z.boolean().optional(),
  inheritsCertificateExpiry: z.string().optional(),
  note: z.string().optional(),
  legacyGuardianName: z.union([z.string(), z.null()]).optional(),
  legacyOnboarding: z.boolean().optional()
}).partial();
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobile: varchar("mobile", { length: 15 }).notNull().unique(),
  // Name fields (fullName kept for backward compatibility, firstName/lastName for staff)
  fullName: text("full_name").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  username: varchar("username", { length: 50 }),
  // Contact Information
  email: varchar("email", { length: 255 }),
  alternatePhone: varchar("alternate_phone", { length: 15 }),
  // Official Information (for staff users)
  designation: varchar("designation", { length: 100 }),
  // Job title/position
  department: varchar("department", { length: 100 }),
  employeeId: varchar("employee_id", { length: 50 }),
  officeAddress: text("office_address"),
  officePhone: varchar("office_phone", { length: 15 }),
  // System fields
  role: varchar("role", { length: 50 }).notNull().default("property_owner"),
  // 'property_owner', 'district_officer', 'state_officer', 'admin', 'dealing_assistant', 'district_tourism_officer', 'super_admin', 'admin_rc', 'system_admin'
  aadhaarNumber: varchar("aadhaar_number", { length: 12 }).unique(),
  ssoId: varchar("sso_id", { length: 50 }).unique(),
  // HP SSO integration ID
  district: varchar("district", { length: 100 }),
  signatureUrl: text("signature_url"),
  password: text("password"),
  // For demo/testing, in production would use proper auth
  // Owner service preferences - which services they offer
  enabledServices: jsonb("enabled_services").$type().default(sql`'["homestay"]'::jsonb`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => {
  return {
    mobileIdx: index("users_mobile_idx").on(table.mobile),
    roleIdx: index("users_role_idx").on(table.role),
    districtIdx: index("users_district_idx").on(table.district)
  };
});
var insertUserSchema = createInsertSchema(users, {
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  firstName: z.string().min(1).optional().or(z.literal("")),
  lastName: z.string().min(1).optional().or(z.literal("")),
  username: z.string().min(3).optional().or(z.literal("")),
  alternatePhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  employeeId: z.string().optional().or(z.literal("")),
  officeAddress: z.string().optional().or(z.literal("")),
  officePhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional().or(z.literal("")),
  role: z.enum(["property_owner", "district_officer", "state_officer", "admin", "dealing_assistant", "district_tourism_officer", "super_admin", "admin_rc", "system_admin"]),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhaar number").optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  signatureUrl: z.string().optional().or(z.literal("")),
  password: z.string().min(1, "Password is required")
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectUserSchema = createSelectSchema(users);
var userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  // Personal Details
  fullName: varchar("full_name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  // 'male', 'female', 'other'
  aadhaarNumber: varchar("aadhaar_number", { length: 12 }),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 255 }),
  // Address Details (LGD Hierarchical)
  district: varchar("district", { length: 100 }),
  tehsil: varchar("tehsil", { length: 100 }),
  block: varchar("block", { length: 100 }),
  // For rural (GP) areas
  gramPanchayat: varchar("gram_panchayat", { length: 100 }),
  // Village/locality (GP for rural, locality for urban)
  urbanBody: varchar("urban_body", { length: 200 }),
  // For urban (MC/TCP) areas
  ward: varchar("ward", { length: 50 }),
  // For urban (MC/TCP) areas
  address: text("address"),
  pincode: varchar("pincode", { length: 10 }),
  telephone: varchar("telephone", { length: 20 }),
  fax: varchar("fax", { length: 20 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserProfileSchema = createInsertSchema(userProfiles, {
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  gender: z.enum(["male", "female"]),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhaar number").optional().or(z.literal("")),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  tehsil: z.string().optional().or(z.literal("")),
  block: z.string().optional().or(z.literal("")),
  gramPanchayat: z.string().optional().or(z.literal("")),
  urbanBody: z.string().optional().or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Invalid pincode").optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal("")),
  fax: z.string().optional().or(z.literal(""))
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true });
var userProfileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female"]),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhaar number").optional().or(z.literal("")),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  tehsil: z.string().optional().or(z.literal("")),
  block: z.string().optional().or(z.literal("")),
  gramPanchayat: z.string().optional().or(z.literal("")),
  urbanBody: z.string().optional().or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Invalid pincode").optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal(""))
});
var selectUserProfileSchema = createSelectSchema(userProfiles);
var PROJECT_TYPE_VALUES = [
  "new_property",
  "existing_property",
  "new_project",
  "new_rooms"
];
var homestayApplications = pgTable("homestay_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  applicationNumber: varchar("application_number", { length: 50 }).notNull().unique(),
  applicationKind: varchar("application_kind", { length: 30 }).$type().notNull().default("new_registration"),
  parentApplicationId: varchar("parent_application_id"),
  parentApplicationNumber: varchar("parent_application_number", { length: 50 }),
  parentCertificateNumber: varchar("parent_certificate_number", { length: 50 }),
  inheritedCertificateValidUpto: timestamp("inherited_certificate_valid_upto"),
  serviceContext: jsonb("service_context").$type(),
  serviceNotes: text("service_notes"),
  serviceRequestedAt: timestamp("service_requested_at"),
  // Multi-Activity Support (v0.7+)
  applicationType: varchar("application_type", { length: 50 }).default("homestay"),
  // 'homestay' | 'water_sports' | 'adventure_sports'
  // Water Sports Specific Data (when applicationType = 'water_sports')
  waterSportsData: jsonb("water_sports_data").$type(),
  // Adventure Sports Specific Data (when applicationType = 'adventure_sports')
  adventureSportsData: jsonb("adventure_sports_data").$type(),
  // Property Details (ANNEXURE-I)
  propertyName: varchar("property_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 20 }).notNull(),
  // 'diamond', 'gold', 'silver'
  locationType: varchar("location_type", { length: 10 }).notNull(),
  // 'mc', 'tcp', 'gp' - CRITICAL for fee calculation
  totalRooms: integer("total_rooms").notNull(),
  // LGD Hierarchical Address Fields
  district: varchar("district", { length: 100 }).notNull(),
  districtOther: varchar("district_other", { length: 100 }),
  // Custom district if not in LGD
  tehsil: varchar("tehsil", { length: 100 }).notNull(),
  tehsilOther: varchar("tehsil_other", { length: 100 }),
  // Custom tehsil if not in LGD
  // Rural Address (for GP - Gram Panchayat)
  block: varchar("block", { length: 100 }),
  // Mandatory for rural (gp)
  blockOther: varchar("block_other", { length: 100 }),
  // Custom block if not in LGD
  gramPanchayat: varchar("gram_panchayat", { length: 100 }),
  // Village/locality (GP for rural, locality for urban)
  gramPanchayatOther: varchar("gram_panchayat_other", { length: 100 }),
  // Custom entry if not in LGD
  // Urban Address (for MC/TCP)
  urbanBody: varchar("urban_body", { length: 200 }),
  // Name of MC/TCP/Nagar Panchayat - Mandatory for urban
  urbanBodyOther: varchar("urban_body_other", { length: 200 }),
  // Custom urban body if not in LGD
  ward: varchar("ward", { length: 50 }),
  // Ward/Zone number - Mandatory for urban
  // Additional address details
  address: text("address").notNull(),
  // House/building number, street, locality
  pincode: varchar("pincode", { length: 10 }).notNull(),
  telephone: varchar("telephone", { length: 20 }),
  fax: varchar("fax", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  // Owner Details (ANNEXURE-I)
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  ownerGender: varchar("owner_gender", { length: 10 }).notNull(),
  // 'male', 'female', 'other' - affects fee (female gets 10% discount for 3 years)
  ownerMobile: varchar("owner_mobile", { length: 15 }).notNull(),
  ownerEmail: varchar("owner_email", { length: 255 }),
  guardianName: varchar("guardian_name", { length: 255 }),
  ownerAadhaar: varchar("owner_aadhaar", { length: 12 }).notNull(),
  guardianRelation: varchar("guardian_relation", { length: 20 }).default("father"),
  propertyOwnership: varchar("property_ownership", { length: 10 }).$type().notNull().default("owned"),
  // Room & Category Details (ANNEXURE-I)
  proposedRoomRate: decimal("proposed_room_rate", { precision: 10, scale: 2 }),
  // DEPRECATED: Use per-room-type rates below
  projectType: varchar("project_type", { length: 20 }).$type().notNull(),
  propertyArea: decimal("property_area", { precision: 10, scale: 2 }).notNull(),
  // in sq meters
  propertyAreaUnit: varchar("property_area_unit", { length: 10 }).$type().default("sqm"),
  // User's input unit
  // 2025 Rules - Per Room Type Rates (Required for Form-A certificate)
  singleBedRooms: integer("single_bed_rooms").default(0),
  singleBedBeds: integer("single_bed_beds").default(1),
  singleBedRoomSize: decimal("single_bed_room_size", { precision: 10, scale: 2 }),
  // in sq ft
  singleBedRoomRate: decimal("single_bed_room_rate", { precision: 10, scale: 2 }),
  // per night rate for single bed rooms
  doubleBedRooms: integer("double_bed_rooms").default(0),
  doubleBedBeds: integer("double_bed_beds").default(2),
  doubleBedRoomSize: decimal("double_bed_room_size", { precision: 10, scale: 2 }),
  // in sq ft
  doubleBedRoomRate: decimal("double_bed_room_rate", { precision: 10, scale: 2 }),
  // per night rate for double bed rooms
  familySuites: integer("family_suites").default(0),
  familySuiteBeds: integer("family_suite_beds").default(4),
  familySuiteSize: decimal("family_suite_size", { precision: 10, scale: 2 }),
  // in sq ft
  familySuiteRate: decimal("family_suite_rate", { precision: 10, scale: 2 }),
  // per night rate for family suites
  attachedWashrooms: integer("attached_washrooms").notNull(),
  gstin: varchar("gstin", { length: 15 }),
  // Mandatory for Diamond/Gold, optional for Silver
  // 2025 Rules - Category Selection & Room Rate Analysis
  selectedCategory: varchar("selected_category", { length: 20 }),
  // User-selected category (may differ from final approved category)
  averageRoomRate: decimal("average_room_rate", { precision: 10, scale: 2 }),
  // Auto-calculated from room rates
  highestRoomRate: decimal("highest_room_rate", { precision: 10, scale: 2 }),
  // For category validation
  lowestRoomRate: decimal("lowest_room_rate", { precision: 10, scale: 2 }),
  // For consistency check
  // 2025 Rules - Certificate Validity & Location-based Discounts
  certificateValidityYears: integer("certificate_validity_years").default(1),
  // 1 or 3 years
  isPangiSubDivision: boolean("is_pangi_sub_division").default(false),
  // Pangi (Chamba) gets 50% discount
  // Distances from key locations (ANNEXURE-I) - in km
  distanceAirport: decimal("distance_airport", { precision: 10, scale: 2 }),
  distanceRailway: decimal("distance_railway", { precision: 10, scale: 2 }),
  distanceCityCenter: decimal("distance_city_center", { precision: 10, scale: 2 }),
  distanceShopping: decimal("distance_shopping", { precision: 10, scale: 2 }),
  distanceBusStand: decimal("distance_bus_stand", { precision: 10, scale: 2 }),
  // Key Location Highlights (text description)
  keyLocationHighlight1: text("key_location_highlight1"),
  keyLocationHighlight2: text("key_location_highlight2"),
  // Public Areas (ANNEXURE-I) - in sq ft
  lobbyArea: decimal("lobby_area", { precision: 10, scale: 2 }),
  diningArea: decimal("dining_area", { precision: 10, scale: 2 }),
  parkingArea: text("parking_area"),
  // Description of parking facilities
  // Additional Facilities (ANNEXURE-I)
  ecoFriendlyFacilities: text("eco_friendly_facilities"),
  differentlyAbledFacilities: text("differently_abled_facilities"),
  fireEquipmentDetails: text("fire_equipment_details"),
  nearestHospital: varchar("nearest_hospital", { length: 255 }),
  // Amenities and Room Details (JSONB for flexibility)
  amenities: jsonb("amenities").$type(),
  // Nearby Attractions (within 5-20 km of property)
  nearbyAttractions: jsonb("nearby_attractions").$type(),
  // Annexure-III Checklist (2025 Policy Compliance)
  mandatoryChecklist: jsonb("mandatory_checklist").$type(),
  // 18 mandatory items
  desirableChecklist: jsonb("desirable_checklist").$type(),
  // 18 desirable items
  rooms: jsonb("rooms").$type(),
  // Fee Calculation (2025 Rules - Flat fees, GST included)
  baseFee: decimal("base_fee", { precision: 10, scale: 2 }),
  // Annual base fee from category + location matrix
  totalBeforeDiscounts: decimal("total_before_discounts", { precision: 10, scale: 2 }),
  // baseFee × validityYears
  validityDiscount: decimal("validity_discount", { precision: 10, scale: 2 }).default("0"),
  // 10% for 3-year lump sum
  femaleOwnerDiscount: decimal("female_owner_discount", { precision: 10, scale: 2 }).default("0"),
  // 5% for female owners
  pangiDiscount: decimal("pangi_discount", { precision: 10, scale: 2 }).default("0"),
  // 50% for Pangi sub-division
  totalDiscount: decimal("total_discount", { precision: 10, scale: 2 }).default("0"),
  // Sum of all discounts
  totalFee: decimal("total_fee", { precision: 10, scale: 2 }),
  // Final payable amount
  // Legacy fields (keeping for backward compatibility - can be removed in future migration)
  perRoomFee: decimal("per_room_fee", { precision: 10, scale: 2 }),
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }),
  // Workflow
  status: varchar("status", { length: 50 }).default("draft"),
  // 'draft', 'submitted', 'document_verification', 'clarification_requested', 'site_inspection_scheduled', 'site_inspection_complete', 'payment_pending', 'approved', 'rejected'
  currentStage: varchar("current_stage", { length: 50 }),
  // 'document_upload', 'document_verification', 'site_inspection', 'payment', 'approved'
  currentPage: integer("current_page").default(1),
  // Track which page of the form user is on (1-6) for draft resume
  // Approval Details
  districtOfficerId: varchar("district_officer_id").references(() => users.id),
  districtReviewDate: timestamp("district_review_date"),
  districtNotes: text("district_notes"),
  // DA (Dealing Assistant) Details
  daId: varchar("da_id").references(() => users.id),
  daReviewDate: timestamp("da_review_date"),
  daForwardedDate: timestamp("da_forwarded_date"),
  daRemarks: text("da_remarks"),
  stateOfficerId: varchar("state_officer_id").references(() => users.id),
  stateReviewDate: timestamp("state_review_date"),
  stateNotes: text("state_notes"),
  // DTDO (District Tourism Development Officer) Details
  dtdoId: varchar("dtdo_id").references(() => users.id),
  dtdoReviewDate: timestamp("dtdo_review_date"),
  correctionSubmissionCount: integer("correction_submission_count").notNull().default(0),
  revertCount: integer("revert_count").notNull().default(0),
  // Tracks how many times app was sent back
  dtdoRemarks: text("dtdo_remarks"),
  rejectionReason: text("rejection_reason"),
  clarificationRequested: text("clarification_requested"),
  // Site Inspection (2025 Rules)
  siteInspectionScheduledDate: timestamp("site_inspection_scheduled_date"),
  siteInspectionCompletedDate: timestamp("site_inspection_completed_date"),
  siteInspectionOfficerId: varchar("site_inspection_officer_id").references(() => users.id),
  siteInspectionNotes: text("site_inspection_notes"),
  siteInspectionOutcome: varchar("site_inspection_outcome", { length: 50 }),
  // 'approved', 'corrections_needed', 'rejected'
  siteInspectionFindings: jsonb("site_inspection_findings").$type(),
  // Legacy document columns (keeping for backward compatibility)
  ownershipProofUrl: text("ownership_proof_url"),
  aadhaarCardUrl: text("aadhaar_card_url"),
  panCardUrl: text("pan_card_url"),
  gstCertificateUrl: text("gst_certificate_url"),
  fireSafetyNocUrl: text("fire_safety_noc_url"),
  pollutionClearanceUrl: text("pollution_clearance_url"),
  buildingPlanUrl: text("building_plan_url"),
  propertyPhotosUrls: jsonb("property_photos_urls").$type(),
  // New JSONB documents column for ANNEXURE-II documents
  documents: jsonb("documents").$type(),
  // Certificate
  certificateNumber: varchar("certificate_number", { length: 50 }).unique(),
  certificateIssuedDate: timestamp("certificate_issued_date"),
  certificateExpiryDate: timestamp("certificate_expiry_date"),
  // Payment Tracking (2025 Rules - Payment before submission)
  paymentStatus: varchar("payment_status", { length: 20 }).$type().default("pending"),
  paymentId: varchar("payment_id", { length: 100 }),
  // Transaction ID from gateway
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  paymentDate: timestamp("payment_date"),
  refundDate: timestamp("refund_date"),
  refundReason: text("refund_reason"),
  // Timestamps
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Analytics: Time spent filling the form (seconds) - for internal use only
  formCompletionTimeSeconds: integer("form_completion_time_seconds")
}, (table) => {
  return {
    // Indexes for high-performance dashboards (Scalability for 10k+ records)
    statusIdx: index("app_status_idx").on(table.status),
    districtIdx: index("app_district_idx").on(table.district),
    userIdIdx: index("app_user_id_idx").on(table.userId),
    appKindIdx: index("app_kind_idx").on(table.applicationKind),
    combinedDashboardIdx: index("app_dashboard_idx").on(table.district, table.status)
  };
});
var insertHomestayApplicationSchema = createInsertSchema(homestayApplications, {
  applicationKind: applicationKindEnum.default("new_registration"),
  parentApplicationId: z.string().uuid().optional(),
  parentApplicationNumber: z.string().optional().or(z.literal("")),
  parentCertificateNumber: z.string().optional().or(z.literal("")),
  inheritedCertificateValidUpto: z.union([z.date(), z.string()]).optional(),
  serviceContext: serviceContextSchema.optional(),
  serviceNotes: z.string().optional().or(z.literal("")),
  serviceRequestedAt: z.union([z.date(), z.string()]).optional(),
  propertyName: z.string().min(3, "Property name must be at least 3 characters"),
  category: z.enum(["diamond", "gold", "silver"]),
  locationType: z.enum(["mc", "tcp", "gp"]),
  totalRooms: z.number().int().min(0).max(6),
  // LGD Hierarchical Address
  district: z.string().min(2, "District is required"),
  tehsil: z.string().min(2, "Tehsil is required"),
  block: z.string().optional().or(z.literal("")),
  // Required for GP, handled in form validation
  gramPanchayat: z.string().optional().or(z.literal("")),
  // Required for GP, handled in form validation
  urbanBody: z.string().optional().or(z.literal("")),
  // Required for MC/TCP, handled in form validation
  ward: z.string().optional().or(z.literal("")),
  // Required for MC/TCP, handled in form validation
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Invalid pincode"),
  telephone: z.string().optional(),
  fax: z.string().optional(),
  ownerName: z.string().min(3),
  ownerGender: z.enum(["male", "female", "other"]),
  ownerMobile: z.string().regex(/^[6-9]\d{9}$/),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  guardianName: z.string().min(3).optional().or(z.literal("")),
  guardianRelation: z.enum(["s_o", "d_o", "w_o", "c_o", "father", "husband", "guardian"]).optional().default("s_o"),
  ownerAadhaar: z.string().regex(/^\d{12}$/),
  proposedRoomRate: z.number().min(100, "Room rate must be at least \u20B9100").optional(),
  // DEPRECATED: Use per-room-type rates
  projectType: z.enum(PROJECT_TYPE_VALUES),
  propertyArea: z.number().min(1, "Property area required"),
  propertyAreaUnit: z.enum(["sqm", "sqft", "kanal", "marla", "bigha", "biswa"]).default("sqm"),
  // 2025 Rules - Per Room Type Rates
  singleBedRooms: z.number().int().min(0).default(0),
  singleBedBeds: z.number().int().min(0).default(1),
  singleBedRoomSize: z.number().min(0).optional(),
  singleBedRoomRate: z.number().min(100, "Single bed room rate must be at least \u20B9100").optional(),
  doubleBedRooms: z.number().int().min(0).default(0),
  doubleBedBeds: z.number().int().min(0).default(2),
  doubleBedRoomSize: z.number().min(0).optional(),
  doubleBedRoomRate: z.number().min(100, "Double bed room rate must be at least \u20B9100").optional(),
  familySuites: z.number().int().min(0).max(3).default(0),
  familySuiteBeds: z.number().int().min(0).default(4),
  familySuiteSize: z.number().min(0).optional(),
  familySuiteRate: z.number().min(100, "Family suite rate must be at least \u20B9100").optional(),
  attachedWashrooms: z.number().int().min(0),
  gstin: z.string().optional().or(z.literal("")),
  // 2025 Rules - New fields
  selectedCategory: z.enum(["diamond", "gold", "silver"]).optional(),
  averageRoomRate: z.number().min(0).optional(),
  highestRoomRate: z.number().min(0).optional(),
  lowestRoomRate: z.number().min(0).optional(),
  certificateValidityYears: z.number().int().min(1).max(3).default(1),
  isPangiSubDivision: z.boolean().default(false),
  distanceAirport: z.number().min(0).optional(),
  distanceRailway: z.number().min(0).optional(),
  distanceCityCenter: z.number().min(0).optional(),
  distanceShopping: z.number().min(0).optional(),
  distanceBusStand: z.number().min(0).optional(),
  lobbyArea: z.number().min(0).optional(),
  diningArea: z.number().min(0).optional(),
  parkingArea: z.string().optional().or(z.literal("")),
  ecoFriendlyFacilities: z.string().optional().or(z.literal("")),
  differentlyAbledFacilities: z.string().optional().or(z.literal("")),
  fireEquipmentDetails: z.string().optional().or(z.literal("")),
  nearestHospital: z.string().optional().or(z.literal("")),
  // Checklists
  mandatoryChecklist: z.record(z.string(), z.boolean()).optional(),
  desirableChecklist: z.record(z.string(), z.boolean()).optional()
}).omit({ id: true, applicationNumber: true, createdAt: true, updatedAt: true }).superRefine((data, ctx) => {
  const singleRooms = data.singleBedRooms ?? 0;
  const doubleRooms = data.doubleBedRooms ?? 0;
  const suiteRooms = data.familySuites ?? 0;
  const totalRooms = singleRooms + doubleRooms + suiteRooms;
  const totalBeds = singleRooms * (data.singleBedBeds ?? 0) + doubleRooms * (data.doubleBedBeds ?? 0) + suiteRooms * (data.familySuiteBeds ?? 0);
  if (totalBeds > 12) {
    ctx.addIssue({
      path: ["singleBedBeds"],
      code: z.ZodIssueCode.custom,
      message: "Total beds cannot exceed 12 across all room types"
    });
  }
  if (totalRooms > 0 && (data.attachedWashrooms ?? 0) < totalRooms) {
    ctx.addIssue({
      path: ["attachedWashrooms"],
      code: z.ZodIssueCode.custom,
      message: "Every room must have its own washroom. Increase attached washrooms to at least the total rooms."
    });
  }
});
var draftHomestayApplicationSchema = createInsertSchema(homestayApplications, {
  applicationKind: applicationKindEnum.optional(),
  parentApplicationId: z.string().uuid().optional(),
  parentApplicationNumber: z.string().optional().or(z.literal("")),
  parentCertificateNumber: z.string().optional().or(z.literal("")),
  inheritedCertificateValidUpto: z.union([z.date(), z.string()]).optional(),
  serviceContext: serviceContextSchema.optional(),
  serviceNotes: z.string().optional().or(z.literal("")),
  serviceRequestedAt: z.union([z.date(), z.string()]).optional(),
  propertyName: z.string().min(1).optional().or(z.literal("")),
  category: z.enum(["diamond", "gold", "silver"]).optional(),
  locationType: z.enum(["mc", "tcp", "gp"]).optional(),
  totalRooms: z.number().int().min(0).optional(),
  // LGD Hierarchical Address - All optional for drafts
  district: z.string().optional().or(z.literal("")),
  tehsil: z.string().optional().or(z.literal("")),
  block: z.string().optional().or(z.literal("")),
  gramPanchayat: z.string().optional().or(z.literal("")),
  urbanBody: z.string().optional().or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal("")),
  fax: z.string().optional().or(z.literal("")),
  ownerName: z.string().optional().or(z.literal("")),
  ownerGender: z.enum(["male", "female", "other"]).optional(),
  ownerMobile: z.string().optional().or(z.literal("")),
  ownerEmail: z.string().optional().or(z.literal("")),
  guardianName: z.string().optional().or(z.literal("")),
  guardianRelation: z.enum(["s_o", "d_o", "w_o", "c_o"]).optional(),
  ownerAadhaar: z.string().optional().or(z.literal("")),
  proposedRoomRate: z.number().optional(),
  // DEPRECATED: Use per-room-type rates
  projectType: z.enum(PROJECT_TYPE_VALUES).optional(),
  propertyArea: z.number().optional(),
  // 2025 Rules - Per Room Type Rates (optional for drafts)
  singleBedRooms: z.number().int().min(0).optional(),
  singleBedBeds: z.number().int().min(0).optional(),
  singleBedRoomSize: z.number().optional(),
  singleBedRoomRate: z.number().optional(),
  doubleBedRooms: z.number().int().min(0).optional(),
  doubleBedBeds: z.number().int().min(0).optional(),
  doubleBedRoomSize: z.number().optional(),
  doubleBedRoomRate: z.number().optional(),
  familySuites: z.number().int().optional(),
  familySuiteBeds: z.number().int().min(0).optional(),
  familySuiteSize: z.number().optional(),
  familySuiteRate: z.number().optional(),
  attachedWashrooms: z.number().int().optional(),
  gstin: z.string().optional().or(z.literal("")),
  // 2025 Rules - New fields (all optional for drafts)
  selectedCategory: z.enum(["diamond", "gold", "silver"]).optional(),
  averageRoomRate: z.number().optional(),
  highestRoomRate: z.number().optional(),
  lowestRoomRate: z.number().optional(),
  certificateValidityYears: z.number().int().optional(),
  isPangiSubDivision: z.boolean().optional(),
  distanceAirport: z.number().optional(),
  distanceRailway: z.number().optional(),
  distanceCityCenter: z.number().optional(),
  distanceShopping: z.number().optional(),
  distanceBusStand: z.number().optional(),
  lobbyArea: z.number().optional(),
  diningArea: z.number().optional(),
  parkingArea: z.string().optional().or(z.literal("")),
  ecoFriendlyFacilities: z.string().optional().or(z.literal("")),
  differentlyAbledFacilities: z.string().optional().or(z.literal("")),
  fireEquipmentDetails: z.string().optional().or(z.literal("")),
  nearestHospital: z.string().optional().or(z.literal("")),
  // Checklists (2025 Rules)
  mandatoryChecklist: z.record(z.string(), z.boolean()).optional(),
  desirableChecklist: z.record(z.string(), z.boolean()).optional(),
  // Fee fields (all optional for drafts)
  baseFee: z.number().optional(),
  totalBeforeDiscounts: z.number().optional(),
  validityDiscount: z.number().optional(),
  femaleOwnerDiscount: z.number().optional(),
  pangiDiscount: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalFee: z.number().optional(),
  perRoomFee: z.number().optional(),
  // Legacy
  gstAmount: z.number().optional()
  // Legacy
}).omit({ id: true, applicationNumber: true, createdAt: true, updatedAt: true });
var selectHomestayApplicationSchema = createSelectSchema(homestayApplications);
var documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  // 'property_photo', 'ownership_proof', 'fire_noc', etc.
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  // AI Verification (for future)
  aiVerificationStatus: varchar("ai_verification_status", { length: 50 }),
  // 'pending', 'verified', 'flagged'
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 5, scale: 2 }),
  aiNotes: text("ai_notes"),
  // Officer Verification
  isVerified: boolean("is_verified").default(false),
  verificationStatus: varchar("verification_status", { length: 50 }).default("pending"),
  // 'pending', 'verified', 'rejected', 'needs_correction'
  verifiedBy: varchar("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes")
});
var insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadDate: true });
var selectDocumentSchema = createSelectSchema(documents);
var storageObjects = pgTable("storage_objects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  objectKey: text("object_key").notNull().unique(),
  storageProvider: varchar("storage_provider", { length: 20 }).notNull().default("local"),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).default("general"),
  mimeType: varchar("mime_type", { length: 100 }).default("application/octet-stream"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  checksumSha256: varchar("checksum_sha256", { length: 128 }),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  applicationId: varchar("application_id").references(() => homestayApplications.id, { onDelete: "set null" }),
  documentId: varchar("document_id").references(() => documents.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at")
});
var session = pgTable("session", {
  sid: varchar("sid").primaryKey().notNull(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull()
});
var insertStorageObjectSchema = createInsertSchema(storageObjects).omit({ id: true, createdAt: true });
var payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id),
  paymentType: varchar("payment_type", { length: 50 }).notNull(),
  // 'registration', 'renewal', 'late_fee'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  // Payment Gateway
  paymentGateway: varchar("payment_gateway", { length: 50 }),
  // 'himkosh', 'razorpay', 'ccavenue', 'payu', 'upi_qr'
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }).unique(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  // 'upi', 'netbanking', 'card', 'wallet'
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  // 'pending', 'success', 'failed', 'refunded'
  // Payment Link & QR Code (2025 Rules - payment after approval)
  paymentLink: text("payment_link"),
  qrCodeUrl: text("qr_code_url"),
  paymentLinkExpiryDate: timestamp("payment_link_expiry_date"),
  // Timestamps
  initiatedAt: timestamp("initiated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  // Receipt
  receiptNumber: varchar("receipt_number", { length: 100 }).unique(),
  receiptUrl: text("receipt_url")
});
var insertPaymentSchema = createInsertSchema(payments).omit({ id: true, initiatedAt: true });
var selectPaymentSchema = createSelectSchema(payments);
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  applicationId: varchar("application_id").references(() => homestayApplications.id),
  type: varchar("type", { length: 100 }).notNull(),
  // 'status_change', 'sla_breach', 'renewal_reminder', etc.
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  // Delivery Channels
  channels: jsonb("channels").$type(),
  // Status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
var selectNotificationSchema = createSelectSchema(notifications);
var applicationActions = pgTable("application_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  officerId: varchar("officer_id").notNull().references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(),
  // 'approved', 'rejected', 'sent_back_for_corrections', 'clarification_requested', 'site_inspection_scheduled', etc.
  previousStatus: varchar("previous_status", { length: 50 }),
  newStatus: varchar("new_status", { length: 50 }),
  // Feedback and Comments
  feedback: text("feedback"),
  // Officer's comments explaining the action
  issuesFound: jsonb("issues_found").$type(),
  // List of issues if sending back for corrections
  createdAt: timestamp("created_at").defaultNow()
});
var insertApplicationActionSchema = createInsertSchema(applicationActions, {
  action: z.enum([
    "submitted",
    "approved",
    "rejected",
    "sent_back_for_corrections",
    "clarification_requested",
    "site_inspection_scheduled",
    "document_verified",
    "payment_verified",
    "inspection_acknowledged",
    "correction_resubmitted"
  ]),
  feedback: z.string().min(10, "Feedback must be at least 10 characters")
}).omit({ id: true, createdAt: true });
var selectApplicationActionSchema = createSelectSchema(applicationActions);
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  // 1-5
  reviewText: text("review_text"),
  // Verification
  isVerifiedStay: boolean("is_verified_stay").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters").optional()
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectReviewSchema = createSelectSchema(reviews);
var supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  // GRV-2025-000123
  // Who raised the ticket
  applicantId: varchar("applicant_id").notNull().references(() => users.id),
  // Optional link to application
  applicationId: varchar("application_id").references(() => homestayApplications.id),
  // Service context
  serviceType: varchar("service_type", { length: 50 }).default("homestay"),
  // homestay, adventure_sports, etc.
  // Ticket details
  category: varchar("category", { length: 50 }).notNull(),
  // delay, payment, document, inspection, technical, general, escalation
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  // Status and workflow
  status: varchar("status", { length: 30 }).notNull().default("open"),
  // open, assigned, in_progress, resolved, closed
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  // low, medium, high, urgent
  // Assignment
  assignedTo: varchar("assigned_to").references(() => users.id),
  // DA/DTDO/Admin
  assignedAt: timestamp("assigned_at"),
  // Escalation tracking
  escalatedFrom: varchar("escalated_from").references(() => users.id),
  // If escalated, who escalated
  escalatedAt: timestamp("escalated_at"),
  escalationLevel: integer("escalation_level").default(0),
  // 0=initial, 1=DA, 2=DTDO, 3=Admin
  // SLA tracking
  slaDeadline: timestamp("sla_deadline"),
  // Auto-calculated based on priority
  slaBreach: boolean("sla_breach").default(false),
  // Resolution
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolutionNotes: text("resolution_notes"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSupportTicketSchema = createInsertSchema(supportTickets, {
  category: z.enum(["delay", "payment", "document", "inspection", "technical", "general", "escalation", "other"]),
  status: z.enum(["open", "assigned", "in_progress", "resolved", "closed"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(255),
  description: z.string().min(20, "Description must be at least 20 characters")
}).omit({ id: true, ticketNumber: true, createdAt: true, updatedAt: true });
var selectSupportTicketSchema = createSelectSchema(supportTickets);
var ticketMessages = pgTable("ticket_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  // Sender info
  senderId: varchar("sender_id").notNull().references(() => users.id),
  senderRole: varchar("sender_role", { length: 30 }).notNull(),
  // applicant, officer, system
  // Message content
  message: text("message").notNull(),
  // Attachments (array of file URLs/metadata)
  attachments: jsonb("attachments").$type(),
  // Internal notes (visible only to officers)
  isInternal: boolean("is_internal").default(false),
  // Read status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTicketMessageSchema = createInsertSchema(ticketMessages, {
  senderRole: z.enum(["applicant", "officer", "system"]),
  message: z.string().min(1, "Message cannot be empty")
}).omit({ id: true, createdAt: true });
var selectTicketMessageSchema = createSelectSchema(ticketMessages);
var ticketActions = pgTable("ticket_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  // Who performed the action
  actorId: varchar("actor_id").references(() => users.id),
  // null for system actions
  actorRole: varchar("actor_role", { length: 30 }),
  // applicant, officer, system
  // Action type
  action: varchar("action", { length: 50 }).notNull(),
  // Actions: created, assigned, status_changed, priority_changed, escalated, 
  //          message_sent, attachment_added, sla_breached, resolved, closed, reopened
  // State tracking
  previousStatus: varchar("previous_status", { length: 30 }),
  newStatus: varchar("new_status", { length: 30 }),
  previousPriority: varchar("previous_priority", { length: 20 }),
  newPriority: varchar("new_priority", { length: 20 }),
  // Assignment tracking
  previousAssignee: varchar("previous_assignee").references(() => users.id),
  newAssignee: varchar("new_assignee").references(() => users.id),
  // Additional context
  notes: text("notes"),
  // Reason for action, comments
  metadata: jsonb("metadata").$type(),
  // Flexible additional data
  // IP tracking for security
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTicketActionSchema = createInsertSchema(ticketActions, {
  action: z.enum([
    "created",
    "assigned",
    "status_changed",
    "priority_changed",
    "escalated",
    "message_sent",
    "attachment_added",
    "sla_breached",
    "resolved",
    "closed",
    "reopened"
  ]),
  actorRole: z.enum(["applicant", "officer", "system"]).optional()
}).omit({ id: true, createdAt: true });
var selectTicketActionSchema = createSelectSchema(ticketActions);
var auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
var selectAuditLogSchema = createSelectSchema(auditLogs);
var productionStats = pgTable("production_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalApplications: integer("total_applications").notNull(),
  approvedApplications: integer("approved_applications").notNull(),
  rejectedApplications: integer("rejected_applications").notNull(),
  pendingApplications: integer("pending_applications").notNull(),
  scrapedAt: timestamp("scraped_at").defaultNow(),
  sourceUrl: text("source_url")
});
var insertProductionStatsSchema = createInsertSchema(productionStats).omit({ id: true, scrapedAt: true });
var selectProductionStatsSchema = createSelectSchema(productionStats);
var himkoshTransactions = pgTable("himkosh_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id),
  // Departmental Reference (our side)
  deptRefNo: varchar("dept_ref_no", { length: 45 }).notNull(),
  // Application number
  appRefNo: varchar("app_ref_no", { length: 20 }).notNull().unique(),
  // Our unique transaction ID
  // Payment Details
  totalAmount: integer("total_amount").notNull(),
  // In rupees (no decimals as per CTP spec)
  tenderBy: varchar("tender_by", { length: 70 }).notNull(),
  // Applicant name
  // CTP Configuration (from environment/config)
  merchantCode: varchar("merchant_code", { length: 15 }),
  // e.g., HIMKOSH230
  deptId: varchar("dept_id", { length: 10 }),
  // Department code (e.g., CTO00-068)
  serviceCode: varchar("service_code", { length: 5 }),
  // Service code (e.g., TSM)
  ddo: varchar("ddo", { length: 12 }),
  // DDO code (e.g., SML00-532)
  // Head of Account Details
  head1: varchar("head1", { length: 14 }),
  // Mandatory head
  amount1: integer("amount1"),
  // Amount for head1
  head2: varchar("head2", { length: 14 }),
  amount2: integer("amount2"),
  head3: varchar("head3", { length: 14 }),
  amount3: integer("amount3"),
  head4: varchar("head4", { length: 14 }),
  amount4: integer("amount4"),
  head10: varchar("head10", { length: 50 }),
  // Bank account for non-govt charges (IFSC-AccountNo)
  amount10: integer("amount10"),
  // Non-govt charges amount
  // Period
  periodFrom: varchar("period_from", { length: 10 }),
  // MM-DD-YYYY
  periodTo: varchar("period_to", { length: 10 }),
  // MM-DD-YYYY
  // Request/Response Tracking
  encryptedRequest: text("encrypted_request"),
  // Stored for audit
  requestChecksum: varchar("request_checksum", { length: 32 }),
  // MD5 checksum
  // Response from CTP (after payment)
  echTxnId: varchar("ech_txn_id", { length: 10 }).unique(),
  // HIMGRN number from CTP
  bankCIN: varchar("bank_cin", { length: 20 }),
  // Bank transaction number
  bankName: varchar("bank_name", { length: 10 }),
  // SBI, PNB, SBP
  paymentDate: varchar("payment_date", { length: 14 }),
  // DDMMYYYYHHMMSS
  status: varchar("status", { length: 70 }),
  // Status message from bank
  statusCd: varchar("status_cd", { length: 1 }),
  // 1=Success, 0=Failure
  responseChecksum: varchar("response_checksum", { length: 32 }),
  // MD5 checksum of response
  // Double Verification
  isDoubleVerified: boolean("is_double_verified").default(false),
  doubleVerificationDate: timestamp("double_verification_date"),
  doubleVerificationData: jsonb("double_verification_data"),
  // Challan Details
  challanPrintUrl: text("challan_print_url"),
  // URL to print challan from CTP
  portalBaseUrl: text("portal_base_url"),
  // Transaction Status
  transactionStatus: varchar("transaction_status", { length: 50 }).default("initiated"),
  // 'initiated', 'redirected', 'success', 'failed', 'verified'
  // Timestamps
  initiatedAt: timestamp("initiated_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Archival Flag (for soft deletes in Admin Console)
  isArchived: boolean("is_archived").default(false)
});
var insertHimkoshTransactionSchema = createInsertSchema(himkoshTransactions, {
  deptRefNo: z.string().min(1),
  appRefNo: z.string().min(1),
  totalAmount: z.number().int().min(1),
  tenderBy: z.string().min(3)
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectHimkoshTransactionSchema = createSelectSchema(himkoshTransactions);
var ccavenueTransactions = pgTable("ccavenue_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id),
  // Transaction identifiers
  orderId: varchar("order_id", { length: 50 }).notNull().unique(),
  // Our unique reference (starts with HPT...)
  trackingId: varchar("tracking_id", { length: 50 }).unique(),
  // CCAvenue Reference ID
  // Payment Details
  currency: varchar("currency", { length: 10 }).default("INR"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  // Payer Details
  billingName: varchar("billing_name", { length: 100 }),
  billingAddress: text("billing_address"),
  billingCity: varchar("billing_city", { length: 50 }),
  billingZip: varchar("billing_zip", { length: 20 }),
  billingCountry: varchar("billing_country", { length: 50 }),
  billingTel: varchar("billing_tel", { length: 20 }),
  billingEmail: varchar("billing_email", { length: 100 }),
  // Response Fields
  orderStatus: varchar("order_status", { length: 50 }).default("Initiated"),
  // Initiated, Success, Failure, Aborted, Invalid
  failureMessage: text("failure_message"),
  paymentMode: varchar("payment_mode", { length: 50 }),
  cardName: varchar("card_name", { length: 50 }),
  statusCode: varchar("status_code", { length: 10 }),
  // API status code
  statusMessage: text("status_message"),
  bankRefNo: varchar("bank_ref_no", { length: 50 }),
  // Bank reference number
  // Timestamps
  transDate: timestamp("trans_date"),
  // Timestamp from CCAvenue
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertCcavenueTransactionSchema = createInsertSchema(ccavenueTransactions).omit({ id: true, createdAt: true, updatedAt: true });
var selectCcavenueTransactionSchema = createSelectSchema(ccavenueTransactions);
var ddoCodes = pgTable("ddo_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  district: varchar("district", { length: 100 }).notNull().unique(),
  ddoCode: varchar("ddo_code", { length: 20 }).notNull(),
  ddoDescription: text("ddo_description").notNull(),
  treasuryCode: varchar("treasury_code", { length: 10 }).notNull(),
  // e.g., CHM00, KLU00, SML00
  head1: varchar("head1", { length: 50 }),
  // Optional Override for Head1 (e.g. 0230-00-104-01)
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertDdoCodeSchema = createInsertSchema(ddoCodes, {
  district: z.string().min(2),
  ddoCode: z.string().min(3),
  ddoDescription: z.string().min(3),
  treasuryCode: z.string().min(3)
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectDdoCodeSchema = createSelectSchema(ddoCodes);
var inspectionOrders = pgTable("inspection_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  // Scheduled by DTDO
  scheduledBy: varchar("scheduled_by").notNull().references(() => users.id),
  // DTDO user ID
  scheduledDate: timestamp("scheduled_date").notNull(),
  // Assigned to DA
  assignedTo: varchar("assigned_to").notNull().references(() => users.id),
  // DA user ID
  assignedDate: timestamp("assigned_date").notNull(),
  // Inspection Details
  inspectionDate: timestamp("inspection_date").notNull(),
  // Scheduled date for inspection
  inspectionAddress: text("inspection_address").notNull(),
  specialInstructions: text("special_instructions"),
  // DTDO's instructions to DA
  // Status
  status: varchar("status", { length: 50 }).default("scheduled"),
  // 'scheduled', 'in_progress', 'completed', 'cancelled'
  // DTDO Notes
  dtdoNotes: text("dtdo_notes"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertInspectionOrderSchema = createInsertSchema(inspectionOrders, {
  inspectionDate: z.date().or(z.string()),
  inspectionAddress: z.string().min(10, "Address must be at least 10 characters"),
  specialInstructions: z.string().optional().or(z.literal("")),
  dtdoNotes: z.string().optional().or(z.literal(""))
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectInspectionOrderSchema = createSelectSchema(inspectionOrders);
var inspectionReports = pgTable("inspection_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inspectionOrderId: varchar("inspection_order_id").notNull().references(() => inspectionOrders.id, { onDelete: "cascade" }),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  // Submitted by DA
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  // DA user ID
  submittedDate: timestamp("submitted_date").notNull(),
  // Inspection Findings
  actualInspectionDate: timestamp("actual_inspection_date").notNull(),
  roomCountVerified: boolean("room_count_verified").notNull(),
  actualRoomCount: integer("actual_room_count"),
  // Category Verification
  categoryMeetsStandards: boolean("category_meets_standards").notNull(),
  recommendedCategory: varchar("recommended_category", { length: 20 }),
  // 'diamond', 'gold', 'silver'
  // ANNEXURE-III Compliance Checklist (HP Homestay Rules 2025)
  // Section A: Mandatory Requirements (18 points)
  mandatoryChecklist: jsonb("mandatory_checklist").$type(),
  mandatoryRemarks: text("mandatory_remarks"),
  // Section B: Desirable Requirements (18 points)
  desirableChecklist: jsonb("desirable_checklist").$type(),
  desirableRemarks: text("desirable_remarks"),
  // Legacy fields (kept for backward compatibility)
  amenitiesVerified: jsonb("amenities_verified").$type(),
  amenitiesIssues: text("amenities_issues"),
  fireSafetyCompliant: boolean("fire_safety_compliant"),
  fireSafetyIssues: text("fire_safety_issues"),
  structuralSafety: boolean("structural_safety"),
  structuralIssues: text("structural_issues"),
  // Overall Assessment
  overallSatisfactory: boolean("overall_satisfactory").notNull(),
  recommendation: varchar("recommendation", { length: 50 }).notNull(),
  // 'approve' or 'raise_objections'
  detailedFindings: text("detailed_findings").notNull(),
  // Supporting Documents (Photos from inspection)
  inspectionPhotos: jsonb("inspection_photos").$type(),
  // Report Document (PDF uploaded by DA)
  reportDocumentUrl: text("report_document_url"),
  // PDF of official inspection report
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertInspectionReportSchema = createInsertSchema(inspectionReports, {
  actualInspectionDate: z.date().or(z.string()),
  roomCountVerified: z.boolean(),
  actualRoomCount: z.number().int().min(0).optional(),
  categoryMeetsStandards: z.boolean(),
  recommendedCategory: z.enum(["diamond", "gold", "silver"]).optional().or(z.literal("")),
  mandatoryChecklist: z.object({
    applicationForm: z.boolean(),
    documents: z.boolean(),
    onlinePayment: z.boolean(),
    wellMaintained: z.boolean(),
    cleanRooms: z.boolean(),
    comfortableBedding: z.boolean(),
    roomSize: z.boolean(),
    cleanKitchen: z.boolean(),
    cutleryCrockery: z.boolean(),
    waterFacility: z.boolean(),
    wasteDisposal: z.boolean(),
    energySavingLights: z.boolean(),
    visitorBook: z.boolean(),
    doctorDetails: z.boolean(),
    luggageAssistance: z.boolean(),
    fireEquipment: z.boolean(),
    guestRegister: z.boolean(),
    cctvCameras: z.boolean()
  }).optional(),
  desirableChecklist: z.object({
    parking: z.boolean(),
    attachedBathroom: z.boolean(),
    toiletAmenities: z.boolean(),
    hotColdWater: z.boolean(),
    waterConservation: z.boolean(),
    diningArea: z.boolean(),
    wardrobe: z.boolean(),
    storage: z.boolean(),
    furniture: z.boolean(),
    laundry: z.boolean(),
    refrigerator: z.boolean(),
    lounge: z.boolean(),
    heatingCooling: z.boolean(),
    luggageHelp: z.boolean(),
    safeStorage: z.boolean(),
    securityGuard: z.boolean(),
    himachaliCrafts: z.boolean(),
    rainwaterHarvesting: z.boolean()
  }).optional(),
  fireSafetyCompliant: z.boolean().optional(),
  structuralSafety: z.boolean().optional(),
  overallSatisfactory: z.boolean(),
  recommendation: z.enum(["approve", "raise_objections"]),
  detailedFindings: z.string().min(20, "Detailed findings must be at least 20 characters")
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectInspectionReportSchema = createSelectSchema(inspectionReports);
var objections = pgTable("objections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  inspectionReportId: varchar("inspection_report_id").references(() => inspectionReports.id),
  // Raised by DTDO
  raisedBy: varchar("raised_by").notNull().references(() => users.id),
  // DTDO user ID
  raisedDate: timestamp("raised_date").notNull(),
  // Objection Details
  objectionType: varchar("objection_type", { length: 50 }).notNull(),
  // 'document_incomplete', 'category_mismatch', 'safety_violation', 'amenity_mismatch', 'structural_issue', 'other'
  objectionTitle: varchar("objection_title", { length: 255 }).notNull(),
  objectionDescription: text("objection_description").notNull(),
  // Severity
  severity: varchar("severity", { length: 20 }).notNull(),
  // 'minor', 'major', 'critical'
  // Resolution Timeline
  responseDeadline: timestamp("response_deadline"),
  // Deadline for applicant to respond
  // Status
  status: varchar("status", { length: 50 }).default("pending"),
  // 'pending', 'responded', 'resolved', 'escalated'
  // Resolution
  resolutionNotes: text("resolution_notes"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  // DTDO user ID
  resolvedDate: timestamp("resolved_date"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertObjectionSchema = createInsertSchema(objections, {
  objectionType: z.enum(["document_incomplete", "category_mismatch", "safety_violation", "amenity_mismatch", "structural_issue", "other"]),
  objectionTitle: z.string().min(5, "Title must be at least 5 characters"),
  objectionDescription: z.string().min(20, "Description must be at least 20 characters"),
  severity: z.enum(["minor", "major", "critical"]),
  responseDeadline: z.date().or(z.string()).optional()
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectObjectionSchema = createSelectSchema(objections);
var clarifications = pgTable("clarifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  objectionId: varchar("objection_id").notNull().references(() => objections.id, { onDelete: "cascade" }),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }),
  // Submitted by Property Owner
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  // Property owner user ID
  submittedDate: timestamp("submitted_date").notNull(),
  // Clarification Details
  clarificationText: text("clarification_text").notNull(),
  // Supporting Documents
  supportingDocuments: jsonb("supporting_documents").$type(),
  // Review by DTDO
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  // DTDO user ID
  reviewedDate: timestamp("reviewed_date"),
  reviewStatus: varchar("review_status", { length: 50 }),
  // 'accepted', 'rejected', 'needs_revision'
  reviewNotes: text("review_notes"),
  // Timestamps
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertClarificationSchema = createInsertSchema(clarifications, {
  clarificationText: z.string().min(20, "Clarification must be at least 20 characters")
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectClarificationSchema = createSelectSchema(clarifications);
var certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => homestayApplications.id, { onDelete: "cascade" }).unique(),
  // Certificate Details
  certificateNumber: varchar("certificate_number", { length: 50 }).notNull().unique(),
  // e.g., HP/HST/2025/KLU/001
  certificateType: varchar("certificate_type", { length: 50 }).default("homestay_registration"),
  // Future: renewal, amendment
  // Validity
  issuedDate: timestamp("issued_date").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUpto: timestamp("valid_upto").notNull(),
  // 3 years from issue date
  // Property Details (snapshot at time of issue)
  propertyName: varchar("property_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 20 }).notNull(),
  // 'diamond', 'gold', 'silver'
  address: text("address").notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  // Owner Details (snapshot)
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  ownerMobile: varchar("owner_mobile", { length: 15 }).notNull(),
  // Certificate Document
  certificatePdfUrl: text("certificate_pdf_url"),
  // URL to generated PDF
  qrCodeData: text("qr_code_data"),
  // QR code for verification (contains certificate number + validation URL)
  // Digital Signature
  digitalSignature: text("digital_signature"),
  // Future: Digital signature of issuing officer
  issuedBy: varchar("issued_by").references(() => users.id),
  // System admin or auto-generated
  // Status
  status: varchar("status", { length: 50 }).default("active"),
  // 'active', 'expired', 'revoked', 'suspended'
  revocationReason: text("revocation_reason"),
  revokedBy: varchar("revoked_by").references(() => users.id),
  revokedDate: timestamp("revoked_date"),
  // Renewal Tracking
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  renewalApplicationId: varchar("renewal_application_id").references(() => homestayApplications.id),
  // Link to renewal application
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertCertificateSchema = createInsertSchema(certificates, {
  certificateNumber: z.string().min(5),
  issuedDate: z.date().or(z.string()),
  validFrom: z.date().or(z.string()),
  validUpto: z.date().or(z.string()),
  propertyName: z.string().min(3),
  category: z.enum(["diamond", "gold", "silver"]),
  address: z.string().min(10),
  district: z.string().min(2),
  ownerName: z.string().min(3),
  ownerMobile: z.string().regex(/^[6-9]\d{9}$/)
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectCertificateSchema = createSelectSchema(certificates);
var systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Setting Key (unique identifier for the setting)
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  // e.g., 'test_payment_mode'
  // Setting Value (stored as JSON for flexibility)
  settingValue: jsonb("setting_value").notNull(),
  // e.g., { enabled: true }
  // Metadata
  description: text("description"),
  // Human-readable description
  category: varchar("category", { length: 50 }).default("general"),
  // e.g., 'payment', 'general', 'notification'
  // Audit fields
  updatedBy: varchar("updated_by").references(() => users.id),
  // Admin who last updated
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSystemSettingSchema = createInsertSchema(systemSettings, {
  settingKey: z.string().min(1, "Setting key is required"),
  settingValue: z.any(),
  // Allow any JSON value
  description: z.string().optional().or(z.literal("")),
  category: z.enum(["general", "payment", "notification", "security"]).optional()
}).omit({ id: true, createdAt: true, updatedAt: true });
var selectSystemSettingSchema = createSelectSchema(systemSettings);
var loginOtpChallenges = pgTable("login_otp_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  otpHash: varchar("otp_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  consumedAt: timestamp("consumed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var passwordResetChallenges = pgTable("password_reset_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 32 }).notNull(),
  recipient: varchar("recipient", { length: 255 }),
  otpHash: varchar("otp_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  consumedAt: timestamp("consumed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var lgdDistricts = pgTable("lgd_districts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lgdCode: varchar("lgd_code", { length: 20 }).unique(),
  // Official LGD code
  districtName: varchar("district_name", { length: 100 }).notNull().unique(),
  divisionName: varchar("division_name", { length: 100 }),
  // Shimla, Mandi, Kangra
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertLgdDistrictSchema = createInsertSchema(lgdDistricts, {
  districtName: z.string().min(2),
  lgdCode: z.string().optional(),
  divisionName: z.string().optional()
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectLgdDistrictSchema = createSelectSchema(lgdDistricts);
var lgdTehsils = pgTable("lgd_tehsils", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lgdCode: varchar("lgd_code", { length: 20 }).unique(),
  // Official LGD code
  tehsilName: varchar("tehsil_name", { length: 100 }).notNull(),
  districtId: varchar("district_id").notNull().references(() => lgdDistricts.id, { onDelete: "cascade" }),
  tehsilType: varchar("tehsil_type", { length: 50 }).default("tehsil"),
  // 'tehsil', 'sub_division', 'sub_tehsil'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertLgdTehsilSchema = createInsertSchema(lgdTehsils, {
  tehsilName: z.string().min(2),
  districtId: z.string().uuid(),
  lgdCode: z.string().optional(),
  tehsilType: z.enum(["tehsil", "sub_division", "sub_tehsil"]).optional()
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectLgdTehsilSchema = createSelectSchema(lgdTehsils);
var lgdBlocks = pgTable("lgd_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lgdCode: varchar("lgd_code", { length: 20 }).unique(),
  // Official LGD code
  blockName: varchar("block_name", { length: 100 }).notNull(),
  districtId: varchar("district_id").notNull().references(() => lgdDistricts.id, { onDelete: "cascade" }),
  tehsilId: varchar("tehsil_id").references(() => lgdTehsils.id, { onDelete: "set null" }),
  // Optional linkage
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertLgdBlockSchema = createInsertSchema(lgdBlocks, {
  blockName: z.string().min(2),
  districtId: z.string().uuid(),
  lgdCode: z.string().optional(),
  tehsilId: z.string().uuid().optional()
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectLgdBlockSchema = createSelectSchema(lgdBlocks);
var lgdGramPanchayats = pgTable("lgd_gram_panchayats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lgdCode: varchar("lgd_code", { length: 20 }).unique(),
  // Official LGD code
  gramPanchayatName: varchar("gram_panchayat_name", { length: 100 }).notNull(),
  districtId: varchar("district_id").notNull().references(() => lgdDistricts.id, { onDelete: "cascade" }),
  blockId: varchar("block_id").references(() => lgdBlocks.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertLgdGramPanchayatSchema = createInsertSchema(lgdGramPanchayats, {
  gramPanchayatName: z.string().min(2),
  districtId: z.string().uuid(),
  blockId: z.string().uuid().optional(),
  lgdCode: z.string().optional()
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectLgdGramPanchayatSchema = createSelectSchema(lgdGramPanchayats);
var lgdUrbanBodies = pgTable("lgd_urban_bodies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lgdCode: varchar("lgd_code", { length: 20 }).unique(),
  // Official LGD code
  urbanBodyName: varchar("urban_body_name", { length: 200 }).notNull(),
  districtId: varchar("district_id").notNull().references(() => lgdDistricts.id, { onDelete: "cascade" }),
  bodyType: varchar("body_type", { length: 50 }).notNull(),
  // 'mc' (Municipal Corporation), 'tcp' (Town & Country Planning), 'np' (Nagar Panchayat)
  numberOfWards: integer("number_of_wards"),
  // Total wards in this urban body
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertLgdUrbanBodySchema = createInsertSchema(lgdUrbanBodies, {
  urbanBodyName: z.string().min(2),
  districtId: z.string().uuid(),
  bodyType: z.enum(["mc", "tcp", "np"]),
  lgdCode: z.string().optional(),
  numberOfWards: z.number().int().positive().optional()
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
var selectLgdUrbanBodySchema = createSelectSchema(lgdUrbanBodies);
var grievances = pgTable("grievances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  // e.g. GRV-2025-001
  ticketType: varchar("ticket_type", { length: 20 }).default("owner_grievance"),
  // 'owner_grievance' | 'internal_ticket'
  userId: varchar("user_id").references(() => users.id),
  applicationId: varchar("application_id").references(() => homestayApplications.id),
  category: varchar("category", { length: 50 }).notNull(),
  // payment, application, portal, other
  priority: varchar("priority", { length: 20 }).default("medium"),
  // low, medium, high, critical
  status: varchar("status", { length: 20 }).default("open"),
  // open, in_progress, resolved, closed
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolutionNotes: text("resolution_notes"),
  attachments: jsonb("attachments").$type(),
  // Read tracking for notifications
  lastCommentAt: timestamp("last_comment_at"),
  lastReadByOwner: timestamp("last_read_by_owner"),
  lastReadByOfficer: timestamp("last_read_by_officer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});
var insertGrievanceSchema = createInsertSchema(grievances, {
  ticketType: z.enum(["owner_grievance", "internal_ticket"]).optional().default("owner_grievance"),
  category: z.enum(["payment", "application", "portal", "policy_query", "system_issue", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachments: z.array(z.string()).optional()
}).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
  resolutionNotes: true,
  userId: true,
  assignedTo: true
});
var selectGrievanceSchema = createSelectSchema(grievances);
var grievanceComments = pgTable("grievance_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  grievanceId: varchar("grievance_id").notNull().references(() => grievances.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  comment: text("comment").notNull(),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertGrievanceCommentSchema = createInsertSchema(grievanceComments, {
  comment: z.string().min(1, "Comment cannot be empty"),
  isInternal: z.boolean().optional()
}).omit({ id: true, createdAt: true, userId: true, grievanceId: true });
var grievanceAuditLog = pgTable("grievance_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  grievanceId: varchar("grievance_id").notNull().references(() => grievances.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(),
  // 'created', 'status_changed', 'priority_changed', 'comment_added', 'assigned', 'resolved', 'closed', 'marked_read'
  oldValue: text("old_value"),
  newValue: text("new_value"),
  performedBy: varchar("performed_by").notNull().references(() => users.id),
  performedAt: timestamp("performed_at").defaultNow(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent")
});
var sessions = pgTable("session", {
  sid: varchar("sid").primaryKey().notNull(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull()
}, (table) => {
  return {
    expireIdx: index("IDX_session_expire").on(table.expire)
  };
});

// shared/config.ts
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { z as z2 } from "zod";
var envFile = process.env.HPT_ENV_FILE;
if (envFile && fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}
var preprocessBoolean = (value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return void 0;
    }
    if (["1", "true", "yes", "y", "on"].includes(normalized)) {
      return true;
    }
    if (["0", "false", "no", "n", "off"].includes(normalized)) {
      return false;
    }
  }
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return void 0;
    }
    return value !== 0;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return void 0;
};
var booleanFlag = (defaultValue) => z2.preprocess(preprocessBoolean, z2.boolean().optional()).default(defaultValue);
var optionalBoolean = () => z2.preprocess(preprocessBoolean, z2.boolean().optional());
var defaultLocalStoragePath = path.resolve(process.cwd(), "local-object-storage");
var defaultLogFilePath = path.resolve(process.cwd(), "logs", "app.log");
var rawEnv = { ...process.env };
var aliasEnv = (target, ...sourceKeys) => {
  if (rawEnv[target]) {
    return;
  }
  for (const key of sourceKeys) {
    const value = process.env[key];
    if (value && value.trim().length > 0) {
      rawEnv[target] = value;
      break;
    }
  }
};
aliasEnv("FRONTEND_BASE_URL", "VITE_FRONTEND_URL");
aliasEnv("HIMKOSH_PAYMENT_URL", "HIMKOSH_POST_URL");
aliasEnv("HIMKOSH_VERIFICATION_URL", "HIMKOSH_VERIFY_URL");
aliasEnv("HIMKOSH_MERCHANT_CODE", "HIMKOSH_MERCHANTCODE", "HIMKOSH_MERCHANT_ID");
aliasEnv("HIMKOSH_DEPT_ID", "HIMKOSH_DEPT_CODE");
aliasEnv("HIMKOSH_SERVICE_CODE", "HIMKOSH_SERVICECODE");
aliasEnv("HIMKOSH_DDO_CODE", "HIMKOSH_DDO");
aliasEnv("HIMKOSH_HEAD", "HIMKOSH_HEAD_OF_ACCOUNT", "HIMKOSH_HEAD1");
aliasEnv("HIMKOSH_HEAD2", "HIMKOSH_SECONDARY_HEAD", "HIMKOSH_HEAD_OF_ACCOUNT_2");
aliasEnv("HIMKOSH_HEAD2_AMOUNT", "HIMKOSH_SECONDARY_HEAD_AMOUNT");
var envSchema = z2.object({
  NODE_ENV: z2.enum(["development", "test", "production"]).default("development"),
  PORT: z2.coerce.number().int().positive().default(5e3),
  HOST: z2.string().default("0.0.0.0"),
  DATABASE_URL: z2.string().min(1, "DATABASE_URL is required"),
  DATABASE_DRIVER: z2.enum(["pg", "neon"]).default("pg"),
  DATABASE_AUTH_TOKEN: z2.string().optional(),
  SESSION_SECRET: z2.string().min(32, "SESSION_SECRET must be at least 32 characters").default("staging-session-secret-1234567890-default-key"),
  SESSION_COOKIE_NAME: z2.string().default("hp-tourism.sid"),
  SESSION_COOKIE_DOMAIN: z2.string().optional(),
  SESSION_COOKIE_SECURE: booleanFlag(false),
  SESSION_COOKIE_SAMESITE: z2.enum(["lax", "strict", "none"]).default("lax"),
  SESSION_IDLE_TIMEOUT_MINUTES: z2.coerce.number().int().positive().default(60 * 24),
  SESSION_STORE: z2.enum(["postgres", "redis"]).default("postgres"),
  REDIS_URL: z2.string().optional(),
  REDIS_TLS: booleanFlag(false),
  USE_MEM_STORAGE: booleanFlag(false),
  OBJECT_STORAGE_MODE: z2.enum(["local", "s3", "replit"]).default("local"),
  LOCAL_OBJECT_DIR: z2.string().default(defaultLocalStoragePath),
  LOCAL_MAX_UPLOAD_BYTES: z2.coerce.number().int().positive().default(20 * 1024 * 1024),
  PRIVATE_OBJECT_DIR: z2.string().optional(),
  OBJECT_STORAGE_S3_BUCKET: z2.string().optional(),
  OBJECT_STORAGE_S3_REGION: z2.string().optional(),
  OBJECT_STORAGE_S3_ENDPOINT: z2.string().optional(),
  OBJECT_STORAGE_S3_FORCE_PATH_STYLE: booleanFlag(true),
  OBJECT_STORAGE_S3_ACCESS_KEY_ID: z2.string().optional(),
  OBJECT_STORAGE_S3_SECRET_ACCESS_KEY: z2.string().optional(),
  OBJECT_STORAGE_S3_SIGNED_URL_TTL: z2.coerce.number().int().positive().default(15 * 60),
  FRONTEND_BASE_URL: z2.string().optional(),
  HIMKOSH_PAYMENT_URL: z2.string().optional(),
  HIMKOSH_VERIFICATION_URL: z2.string().optional(),
  HIMKOSH_CHALLAN_PRINT_URL: z2.string().optional(),
  HIMKOSH_SEARCH_URL: z2.string().optional(),
  HIMKOSH_MERCHANT_CODE: z2.string().optional(),
  HIMKOSH_DEPT_ID: z2.string().optional(),
  HIMKOSH_SERVICE_CODE: z2.string().optional(),
  HIMKOSH_DDO_CODE: z2.string().optional(),
  HIMKOSH_HEAD: z2.string().optional(),
  HIMKOSH_HEAD2: z2.string().optional(),
  HIMKOSH_HEAD2_AMOUNT: z2.coerce.number().optional(),
  HIMKOSH_RETURN_URL: z2.string().optional(),
  HIMKOSH_KEY_FILE_PATH: z2.string().optional(),
  HIMKOSH_ALLOW_DEV_FALLBACK: booleanFlag(false),
  HIMKOSH_TEST_MODE: optionalBoolean(),
  HIMKOSH_FORCE_TEST_MODE: optionalBoolean(),
  HIMKOSH_TEST_AMOUNT: z2.coerce.number().optional(),
  SECURITY_ENABLE_RATE_LIMIT: booleanFlag(true),
  SECURITY_ENABLE_CSRF: booleanFlag(false),
  SECURITY_CSRF_HEADER: z2.string().default("x-csrf-token"),
  RATE_LIMIT_WINDOW_MS: z2.coerce.number().int().positive().default(15 * 60 * 1e3),
  RATE_LIMIT_MAX_REQUESTS: z2.coerce.number().int().positive().default(1e3),
  // Increased from 500 for better UX default
  RATE_LIMIT_AUTH_WINDOW_MS: z2.coerce.number().int().positive().default(10 * 60 * 1e3),
  RATE_LIMIT_AUTH_MAX_REQUESTS: z2.coerce.number().int().positive().default(20),
  RATE_LIMIT_UPLOAD_WINDOW_MS: z2.coerce.number().int().positive().default(10 * 60 * 1e3),
  RATE_LIMIT_UPLOAD_MAX_REQUESTS: z2.coerce.number().int().positive().default(100),
  // Increased to 100 for reliable bulk document uploads
  LOG_LEVEL: z2.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  LOG_PRETTY: booleanFlag(false),
  LOG_FILE_ENABLED: booleanFlag(false),
  LOG_FILE_PATH: z2.string().default(defaultLogFilePath),
  LOG_FILE_MAX_SIZE_MB: z2.coerce.number().int().positive().default(10),
  LOG_FILE_MAX_FILES: z2.coerce.number().int().positive().default(7),
  LOG_FILE_ROTATE_INTERVAL: z2.string().default("1d"),
  LOG_TRACE_PAYMENTS: booleanFlag(false),
  LOG_TRACE_SMS: booleanFlag(false),
  LOG_TRACE_HTTP: booleanFlag(false),
  CLAMAV_ENABLED: booleanFlag(false),
  CLAMAV_HOST: z2.string().default("127.0.0.1"),
  CLAMAV_PORT: z2.coerce.number().int().positive().default(3310),
  CLAMAV_TIMEOUT_MS: z2.coerce.number().int().positive().default(1e4)
}).superRefine((value, ctx) => {
  if (value.SESSION_STORE === "redis" && !value.REDIS_URL) {
    ctx.addIssue({
      code: z2.ZodIssueCode.custom,
      path: ["REDIS_URL"],
      message: "REDIS_URL is required when SESSION_STORE=redis"
    });
  }
  if (value.OBJECT_STORAGE_MODE === "s3") {
    const missingKeys = [];
    if (!value.OBJECT_STORAGE_S3_BUCKET) missingKeys.push("OBJECT_STORAGE_S3_BUCKET");
    if (!value.OBJECT_STORAGE_S3_REGION) missingKeys.push("OBJECT_STORAGE_S3_REGION");
    if (!value.OBJECT_STORAGE_S3_ACCESS_KEY_ID)
      missingKeys.push("OBJECT_STORAGE_S3_ACCESS_KEY_ID");
    if (!value.OBJECT_STORAGE_S3_SECRET_ACCESS_KEY)
      missingKeys.push("OBJECT_STORAGE_S3_SECRET_ACCESS_KEY");
    if (missingKeys.length > 0) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["OBJECT_STORAGE_MODE"],
        message: `Missing required S3 config: ${missingKeys.join(", ")}`
      });
    }
  }
});
var parsed = envSchema.safeParse(rawEnv);
if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment configuration:
${issues.join("\n")}`);
}
var env = parsed.data;
var config = {
  nodeEnv: env.NODE_ENV,
  server: {
    port: env.PORT,
    host: env.HOST
  },
  database: {
    url: env.DATABASE_URL,
    driver: env.DATABASE_DRIVER,
    authToken: env.DATABASE_AUTH_TOKEN
  },
  session: {
    secret: env.SESSION_SECRET,
    cookieName: env.SESSION_COOKIE_NAME,
    cookieDomain: env.SESSION_COOKIE_DOMAIN,
    secureCookies: env.SESSION_COOKIE_SECURE,
    sameSite: env.SESSION_COOKIE_SAMESITE,
    idleTimeoutMinutes: env.SESSION_IDLE_TIMEOUT_MINUTES,
    store: env.SESSION_STORE
  },
  redis: {
    url: env.REDIS_URL,
    tls: env.REDIS_TLS
  },
  storage: {
    useMemory: env.USE_MEM_STORAGE
  },
  objectStorage: {
    mode: env.OBJECT_STORAGE_MODE,
    localDirectory: env.LOCAL_OBJECT_DIR,
    maxUploadBytes: env.LOCAL_MAX_UPLOAD_BYTES,
    signedUrlTtlSeconds: env.OBJECT_STORAGE_S3_SIGNED_URL_TTL,
    replitPrivateDir: env.PRIVATE_OBJECT_DIR,
    s3: env.OBJECT_STORAGE_MODE === "s3" ? {
      bucket: env.OBJECT_STORAGE_S3_BUCKET,
      region: env.OBJECT_STORAGE_S3_REGION,
      endpoint: env.OBJECT_STORAGE_S3_ENDPOINT,
      forcePathStyle: env.OBJECT_STORAGE_S3_FORCE_PATH_STYLE,
      credentials: {
        accessKeyId: env.OBJECT_STORAGE_S3_ACCESS_KEY_ID,
        secretAccessKey: env.OBJECT_STORAGE_S3_SECRET_ACCESS_KEY
      }
    } : void 0
  },
  frontend: {
    baseUrl: env.FRONTEND_BASE_URL
  },
  himkosh: {
    paymentUrl: env.HIMKOSH_PAYMENT_URL,
    verificationUrl: env.HIMKOSH_VERIFICATION_URL,
    challanPrintUrl: env.HIMKOSH_CHALLAN_PRINT_URL,
    searchUrl: env.HIMKOSH_SEARCH_URL,
    merchantCode: env.HIMKOSH_MERCHANT_CODE,
    deptId: env.HIMKOSH_DEPT_ID,
    serviceCode: env.HIMKOSH_SERVICE_CODE,
    ddo: env.HIMKOSH_DDO_CODE,
    head: env.HIMKOSH_HEAD,
    secondaryHead: env.HIMKOSH_HEAD2,
    secondaryHeadAmount: env.HIMKOSH_HEAD2_AMOUNT,
    returnUrl: env.HIMKOSH_RETURN_URL,
    keyFilePath: env.HIMKOSH_KEY_FILE_PATH,
    allowDevFallback: env.HIMKOSH_ALLOW_DEV_FALLBACK,
    testMode: env.HIMKOSH_TEST_MODE,
    forceTestMode: env.HIMKOSH_FORCE_TEST_MODE,
    testAmount: env.HIMKOSH_TEST_AMOUNT
  },
  security: {
    enableRateLimit: env.SECURITY_ENABLE_RATE_LIMIT,
    enableCsrf: env.SECURITY_ENABLE_CSRF,
    csrfHeader: env.SECURITY_CSRF_HEADER,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
      authWindowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
      authMaxRequests: env.RATE_LIMIT_AUTH_MAX_REQUESTS,
      uploadWindowMs: env.RATE_LIMIT_UPLOAD_WINDOW_MS,
      uploadMaxRequests: env.RATE_LIMIT_UPLOAD_MAX_REQUESTS
    }
  },
  logging: {
    level: env.LOG_LEVEL,
    pretty: env.LOG_PRETTY,
    trace: {
      payments: env.LOG_TRACE_PAYMENTS,
      sms: env.LOG_TRACE_SMS,
      http: env.LOG_TRACE_HTTP
    },
    file: {
      enabled: env.LOG_FILE_ENABLED,
      path: env.LOG_FILE_PATH,
      maxSizeMB: env.LOG_FILE_MAX_SIZE_MB,
      maxFiles: env.LOG_FILE_MAX_FILES,
      interval: env.LOG_FILE_ROTATE_INTERVAL
    }
  },
  clamav: {
    enabled: env.CLAMAV_ENABLED,
    host: env.CLAMAV_HOST,
    port: env.CLAMAV_PORT,
    timeoutMs: env.CLAMAV_TIMEOUT_MS
  }
};

// server/db.ts
var { url, driver } = config.database;
if (!url) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
var pool;
var db;
if (driver === "pg") {
  const localPool = new PgPool({
    connectionString: url,
    max: 20,
    // Max connections in pool
    idleTimeoutMillis: 3e4,
    // Close idle connections after 30s
    connectionTimeoutMillis: 2e3
    // Return an error after 2s if connection could not be established
  });
  pool = localPool;
  db = drizzlePg(localPool, { schema: schema_exports });
} else {
  neonConfig.webSocketConstructor = ws;
  const neonPool = new NeonPool({
    connectionString: url
  });
  pool = neonPool;
  db = drizzleNeon(neonPool, { schema: schema_exports });
}

// server/seed.ts
import { eq, and, ne } from "drizzle-orm";

// shared/districtStaffManifest.ts
var normalizeStaffIdentifier = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }
  return trimmed.replace(/[.\s-]+/g, "_");
};
var DISTRICT_STAFF_MANIFEST = [
  // === Group C: Chamba District (Split Pipelines) ===
  {
    districtLabel: "Chamba",
    ddoCode: "CHM00-532",
    isActive: true,
    // Receives: Chamba + Bharmour (all tehsils except Pangi)
    da: {
      username: "da_chamba",
      password: "dacha@2025",
      fullName: "Dealing Assistant Chamba HQ",
      mobile: "7800001001",
      email: "da.chamba@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_chamba",
      password: "dtdocha@2025",
      fullName: "DTDO Chamba HQ",
      mobile: "7900001001",
      email: "dtdo.chamba@himachaltourism.gov.in"
    }
  },
  // DORMANT: Bharmour merged with Chamba HQ per 2025 workflow
  {
    districtLabel: "Bharmour Sub-Division",
    ddoCode: "CHM01-001",
    isActive: false,
    // DORMANT - Bharmour routes to Chamba HQ
    da: {
      username: "da_bharmour",
      password: "dabha@2025",
      fullName: "Dealing Assistant Bharmour",
      mobile: "7800001002",
      email: "da.bharmour@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_bharmour",
      password: "dtdobha@2025",
      fullName: "DTDO Bharmour",
      mobile: "7900001002",
      email: "dtdo.bharmour@himachaltourism.gov.in"
    }
  },
  // === Group B: Hamirpur + Una (Merged Pipeline) ===
  {
    districtLabel: "Hamirpur",
    ddoCode: "HMR00-053",
    isActive: true,
    // Receives: Hamirpur + Una applications
    da: {
      username: "da_hamirpur",
      password: "daham@2025",
      fullName: "Dealing Assistant Hamirpur",
      mobile: "7800001004",
      email: "da.hamirpur@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_hamirpur",
      password: "dtdoham@2025",
      fullName: "DTDO Hamirpur",
      mobile: "7900001004",
      email: "dtdo.hamirpur@himachaltourism.gov.in"
    }
  },
  // === Group A: Kullu (Single Pipeline) ===
  {
    districtLabel: "Kullu",
    ddoCode: "KLU00-532",
    isActive: true,
    da: {
      username: "da_kullu_manali",
      password: "dakul@2025",
      fullName: "Dealing Assistant Kullu",
      mobile: "7800001005",
      email: "da.kullu-manali@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_kullu_manali",
      password: "dtdokul@2025",
      fullName: "DTDO Kullu",
      mobile: "7900001005",
      email: "dtdo.kullu-manali@himachaltourism.gov.in"
    }
  },
  // === Group A: Kangra (Single Pipeline) ===
  {
    districtLabel: "Kangra",
    ddoCode: "KNG00-532",
    isActive: true,
    da: {
      username: "da_dharamsala",
      password: "dadha@2025",
      fullName: "Dealing Assistant Dharamsala",
      mobile: "7800001007",
      email: "da.dharamsala@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_dharamsala",
      password: "dtdodha@2025",
      fullName: "DTDO Dharamsala",
      mobile: "7900001007",
      email: "dtdo.dharamsala@himachaltourism.gov.in"
    }
  },
  // === Group A: Kinnaur (Single Pipeline) ===
  {
    districtLabel: "Kinnaur",
    ddoCode: "KNR00-031",
    isActive: true,
    da: {
      username: "da_kinnaur",
      password: "dakin@2025",
      fullName: "Dealing Assistant Kinnaur",
      mobile: "7800001008",
      email: "da.kinnaur@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_kinnaur",
      password: "dtdokin@2025",
      fullName: "DTDO Kinnaur",
      mobile: "7900001008",
      email: "dtdo.kinnaur@himachaltourism.gov.in"
    }
  },
  // === Group C: Lahaul-Spiti District (Kaza Pipeline) ===
  {
    districtLabel: "Lahaul-Spiti (Kaza)",
    ddoCode: "KZA00-011",
    isActive: true,
    // Receives: Spiti tehsil only (ITDP)
    da: {
      username: "da_kaza",
      password: "dakaz@2025",
      fullName: "Dealing Assistant Kaza",
      mobile: "7800001009",
      email: "da.kaza@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_kaza",
      password: "dtdokaz@2025",
      fullName: "DTDO Kaza",
      mobile: "7900001009",
      email: "dtdo.kaza@himachaltourism.gov.in"
    }
  },
  // === Group C: Lahaul-Spiti District (Lahaul Pipeline) ===
  {
    districtLabel: "Lahaul",
    ddoCode: "LHL00-017",
    isActive: true,
    // Receives: Lahaul + Udaipur tehsils
    da: {
      username: "da_lahaul",
      password: "dalah@2025",
      fullName: "Dealing Assistant Lahaul",
      mobile: "7800001010",
      email: "da.lahaul@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_lahaul",
      password: "dtdolah@2025",
      fullName: "DTDO Lahaul",
      mobile: "7900001010",
      email: "dtdo.lahaul@himachaltourism.gov.in"
    }
  },
  // DORMANT: Mandi merged with Bilaspur per 2025 workflow
  {
    districtLabel: "Mandi",
    ddoCode: "MDI00-532",
    isActive: false,
    // DORMANT - Mandi routes to Bilaspur
    da: {
      username: "da_mandi",
      password: "daman@2025",
      fullName: "Dealing Assistant Mandi",
      mobile: "7800001011",
      email: "da.mandi@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_mandi",
      password: "dtdoman@2025",
      fullName: "DTDO Mandi",
      mobile: "7900001011",
      email: "dtdo.mandi@himachaltourism.gov.in"
    }
  },
  // === Group C: Chamba District (Pangi Pipeline - ITDP) ===
  {
    districtLabel: "Pangi",
    ddoCode: "PNG00-003",
    isActive: true,
    // Receives: Pangi tehsil only (50% fee waiver)
    da: {
      username: "da_pangi",
      password: "dapan@2025",
      fullName: "Dealing Assistant Pangi",
      mobile: "7800001012",
      email: "da.pangi@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_pangi",
      password: "dtdopan@2025",
      fullName: "DTDO Pangi",
      mobile: "7900001012",
      email: "dtdo.pangi@himachaltourism.gov.in"
    }
  },
  // === Group A: Shimla (Single Pipeline) ===
  {
    districtLabel: "Shimla",
    ddoCode: "SML00-532",
    isActive: true,
    da: {
      username: "da_shimla",
      password: "dashi@2025",
      fullName: "Dealing Assistant Shimla",
      mobile: "7800001013",
      email: "da.shimla@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_shimla",
      password: "dtdoshi@2025",
      fullName: "DTDO Shimla",
      mobile: "7900001013",
      email: "dtdo.shimla@himachaltourism.gov.in"
    }
  },
  // === Group A: Sirmaur (Single Pipeline) ===
  {
    districtLabel: "Sirmaur",
    ddoCode: "SMR00-055",
    isActive: true,
    da: {
      username: "da_sirmaur",
      password: "dasir@2025",
      fullName: "Dealing Assistant Sirmaur",
      mobile: "7800001014",
      email: "da.sirmaur@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_sirmaur",
      password: "dtdosir@2025",
      fullName: "DTDO Sirmaur",
      mobile: "7900001014",
      email: "dtdo.sirmaur@himachaltourism.gov.in"
    }
  },
  // === Group A: Solan (Single Pipeline) ===
  {
    districtLabel: "Solan",
    ddoCode: "SOL00-046",
    isActive: true,
    da: {
      username: "da_solan",
      password: "dasol@2025",
      fullName: "Dealing Assistant Solan",
      mobile: "7800001015",
      email: "da.solan@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_solan",
      password: "dtdosol@2025",
      fullName: "DTDO Solan",
      mobile: "7900001015",
      email: "dtdo.solan@himachaltourism.gov.in"
    }
  },
  // === Group B: Bilaspur + Mandi (Merged Pipeline) ===
  {
    districtLabel: "Bilaspur",
    ddoCode: "BLS00-047",
    isActive: true,
    // Receives: Bilaspur + Mandi applications
    da: {
      username: "da_bilaspur",
      password: "dabil@2025",
      fullName: "Dealing Assistant Bilaspur",
      mobile: "7800001016",
      email: "da.bilaspur@himachaltourism.gov.in"
    },
    dtdo: {
      username: "dtdo_bilaspur",
      password: "dtdobil@2025",
      fullName: "DTDO Bilaspur",
      mobile: "7900001016",
      email: "dtdo.bilaspur@himachaltourism.gov.in"
    }
  }
];
var STAFF_BY_USERNAME = /* @__PURE__ */ new Map();
var STAFF_BY_MOBILE = /* @__PURE__ */ new Map();
for (const entry of DISTRICT_STAFF_MANIFEST) {
  for (const role of ["da", "dtdo"]) {
    const record = entry[role];
    const normalizedUsername = normalizeStaffIdentifier(record.username);
    if (normalizedUsername) {
      STAFF_BY_USERNAME.set(normalizedUsername, {
        districtLabel: entry.districtLabel,
        ddoCode: entry.ddoCode,
        role: role === "da" ? "dealing_assistant" : "district_tourism_officer",
        username: record.username,
        password: record.password,
        fullName: record.fullName,
        mobile: record.mobile,
        email: record.email
      });
    }
    STAFF_BY_MOBILE.set(record.mobile, {
      districtLabel: entry.districtLabel,
      ddoCode: entry.ddoCode,
      role: role === "da" ? "dealing_assistant" : "district_tourism_officer",
      username: record.username,
      password: record.password,
      fullName: record.fullName,
      mobile: record.mobile,
      email: record.email
    });
  }
}
var getDistrictStaffManifest = () => DISTRICT_STAFF_MANIFEST;

// server/seed.ts
async function seed() {
  console.log("\u{1F331} Starting database seed...");
  try {
    const adminMobile = "9999999999";
    const adminPassword = "admin123";
    const adminFirstName = "Admin";
    const adminLastName = "Admin";
    const adminUsername = "admin";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await db.select().from(users).where(eq(users.mobile, adminMobile)).limit(1);
    if (existingAdmin.length > 0) {
      console.log(`\u2705 Admin user already exists (mobile: ${adminMobile})`);
      await db.update(users).set({
        role: "admin",
        isActive: true,
        password: hashedAdminPassword,
        fullName: "Admin Admin",
        firstName: adminFirstName,
        lastName: adminLastName,
        username: adminUsername
      }).where(eq(users.mobile, adminMobile));
      console.log("\u2705 Admin credentials verified/updated");
    } else {
      await db.insert(users).values({
        mobile: adminMobile,
        password: hashedAdminPassword,
        fullName: "Admin Admin",
        firstName: adminFirstName,
        lastName: adminLastName,
        username: adminUsername,
        role: "admin",
        isActive: true
      });
      console.log("\u2705 Admin user created successfully");
      console.log(`   Mobile: ${adminMobile}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   \u26A0\uFE0F  IMPORTANT: Change this password in production!");
    }
    console.log("\u{1F3DB}\uFE0F  Seeding DDO codes for all districts...");
    const ddoData = [
      { district: "Chamba", ddoCode: "CHM00-532", ddoDescription: "D.T.D.O. CHAMBA", treasuryCode: "CHM00" },
      { district: "Bharmour", ddoCode: "CHM01-001", ddoDescription: "S.D.O.(CIVIL) BHARMOUR", treasuryCode: "CHM01" },
      { district: "Shimla (Central)", ddoCode: "CTO00-068", ddoDescription: "A.C. (TOURISM) SHIMLA", treasuryCode: "CTO00" },
      { district: "Hamirpur", ddoCode: "HMR00-053", ddoDescription: "DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)", treasuryCode: "HMR00" },
      { district: "Una", ddoCode: "HMR00-053", ddoDescription: "DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)", treasuryCode: "HMR00" },
      { district: "Kullu (Dhalpur)", ddoCode: "KLU00-532", ddoDescription: "DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR", treasuryCode: "KLU00" },
      { district: "Kangra", ddoCode: "KNG00-532", ddoDescription: "DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA", treasuryCode: "KNG00" },
      { district: "Kinnaur", ddoCode: "KNR00-031", ddoDescription: "DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO", treasuryCode: "KNR00" },
      { district: "Lahaul-Spiti (Kaza)", ddoCode: "KZA00-011", ddoDescription: "PO ITDP KAZA", treasuryCode: "KZA00" },
      { district: "Lahaul", ddoCode: "LHL00-017", ddoDescription: "DISTRICT TOURISM DEVELOPMENT OFFICER", treasuryCode: "LHL00" },
      { district: "Mandi", ddoCode: "MDI00-532", ddoDescription: "DIV. TOURISM DEV. OFFICER MANDI", treasuryCode: "MDI00" },
      { district: "Pangi", ddoCode: "PNG00-003", ddoDescription: "PROJECT OFFICER ITDP PANGI", treasuryCode: "PNG00" },
      { district: "Shimla", ddoCode: "SML00-532", ddoDescription: "DIVISIONAL TOURISM OFFICER SHIMLA", treasuryCode: "SML00" },
      { district: "Sirmour", ddoCode: "SMR00-055", ddoDescription: "DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN", treasuryCode: "SMR00" },
      { district: "Solan", ddoCode: "SOL00-046", ddoDescription: "DTDO SOLAN", treasuryCode: "SOL00" }
    ];
    for (const ddo of ddoData) {
      const existing = await db.select().from(ddoCodes).where(eq(ddoCodes.district, ddo.district)).limit(1);
      if (existing.length === 0) {
        await db.insert(ddoCodes).values(ddo);
      }
    }
    console.log(`\u2705 DDO codes seeded successfully (${ddoData.length} districts)`);
    console.log("\u{1F451} Creating super admin account...");
    const superAdminMobile = "9999999998";
    const superAdminPassword = "ulan@2025";
    const superAdminFirstName = "Super";
    const superAdminLastName = "Admin";
    const superAdminUsername = "superadmin";
    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);
    const existingSuperAdmin = await db.select().from(users).where(eq(users.mobile, superAdminMobile)).limit(1);
    if (existingSuperAdmin.length > 0) {
      console.log(`\u2705 Super admin user already exists (mobile: ${superAdminMobile})`);
      await db.update(users).set({
        role: "super_admin",
        isActive: true,
        password: hashedSuperAdminPassword,
        fullName: "Super Admin",
        firstName: superAdminFirstName,
        lastName: superAdminLastName,
        username: superAdminUsername
      }).where(eq(users.mobile, superAdminMobile));
      console.log("\u2705 Super admin credentials verified/updated");
    } else {
      await db.insert(users).values({
        mobile: superAdminMobile,
        email: "superadmin@himachaltourism.gov.in",
        password: hashedSuperAdminPassword,
        fullName: "Super Admin",
        firstName: superAdminFirstName,
        lastName: superAdminLastName,
        username: superAdminUsername,
        role: "super_admin",
        isActive: true
      });
      console.log("\u2705 Super admin user created successfully");
      console.log(`   Mobile: ${superAdminMobile}`);
      console.log("   Email: superadmin@himachaltourism.gov.in");
      console.log(`   Password: ${superAdminPassword}`);
      console.log("   \u26A0\uFE0F  IMPORTANT: This account has full system access including reset operations!");
      console.log("   \u26A0\uFE0F  Change this password immediately after first login!");
    }
    if (process.env.NODE_ENV !== "production" || process.env.ENABLE_DEMO_DATA === "true") {
      console.log("\u{1F6A7} Non-production environment detected, seeding demo data...");
      const testerMobile = "9999999900";
      const testerPassword = "welcome@2025";
      const hashedTesterPassword = await bcrypt.hash(testerPassword, 10);
      const existingTester = await db.select().from(users).where(eq(users.username, "tester")).limit(1);
      if (existingTester.length === 0) {
        await db.insert(users).values({
          mobile: testerMobile,
          email: "tester@hptourism.gov.in",
          password: hashedTesterPassword,
          fullName: "System Tester",
          username: "tester",
          role: "system_admin",
          // Giving high-level access
          isActive: true
        });
        console.log("\u2705 Tester account created: tester / welcome@2025");
      } else {
        await db.update(users).set({ password: hashedTesterPassword, role: "system_admin" }).where(eq(users.username, "tester"));
        console.log("\u2705 Tester account verified: tester / welcome@2025");
      }
      const demoMobile = "9876543210";
      const demoPassword = "Demo@123";
      const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);
      const existingDemo = await db.select().from(users).where(eq(users.mobile, demoMobile)).limit(1);
      let demoUserId = "";
      if (existingDemo.length === 0) {
        const inserted = await db.insert(users).values({
          mobile: demoMobile,
          email: "demo@himachaltourism.gov.in",
          password: hashedDemoPassword,
          fullName: "Demo Owner",
          username: "demo_owner",
          role: "property_owner",
          isActive: true
        }).returning({ id: users.id });
        demoUserId = inserted[0].id;
        console.log("\u2705 Demo Owner account created: 9876543210 / Demo@123");
      } else {
        demoUserId = existingDemo[0].id;
        await db.update(users).set({ password: hashedDemoPassword }).where(eq(users.mobile, demoMobile));
        console.log("\u2705 Demo Owner account verified: 9876543210 / Demo@123");
      }
      const demoApps = await db.select().from(homestayApplications).where(eq(homestayApplications.userId, demoUserId)).limit(1);
      if (demoApps.length === 0) {
        console.log("\u{1F4DD} Creating sample Approved application for Demo Owner...");
        await db.insert(homestayApplications).values({
          userId: demoUserId,
          applicationNumber: "HP-SML-2025-00099",
          certificateNumber: "HP-SML-DEMO-001",
          status: "approved",
          projectType: "new_property",
          applicationKind: "new_registration",
          propertyName: "Demo Himalayan Heights",
          category: "gold",
          locationType: "mc",
          totalRooms: 3,
          district: "Shimla",
          tehsil: "Shimla Urban",
          address: "The Mall, Shimla",
          pincode: "171001",
          ownerName: "Demo Owner",
          ownerMobile: demoMobile,
          ownerGender: "male",
          ownerAadhaar: "123456789012",
          propertyOwnership: "owned",
          propertyArea: "500",
          propertyAreaUnit: "sqm",
          attachedWashrooms: 3,
          singleBedRooms: 1,
          singleBedBeds: 1,
          doubleBedRooms: 1,
          doubleBedBeds: 2,
          familySuites: 1,
          familySuiteBeds: 4,
          certificateIssuedDate: /* @__PURE__ */ new Date(),
          certificateExpiryDate: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)),
          approvedAt: /* @__PURE__ */ new Date(),
          paymentStatus: "paid",
          paymentAmount: "5000",
          paymentDate: /* @__PURE__ */ new Date()
        });
        console.log("\u2705 Sample Approved application created.");
      }
      const demoGrievances = await db.select().from(grievances).where(eq(grievances.userId, demoUserId)).limit(1);
      if (demoGrievances.length === 0) {
        console.log("\u{1F4DD} Creating sample Grievance for Demo Owner...");
        await db.insert(grievances).values({
          ticketNumber: "GRV-SML-2025-001",
          ticketType: "owner_grievance",
          userId: demoUserId,
          category: "application",
          subject: "Demo Grievance: Inquiry about subsidy",
          description: "This is a sample grievance ticket for demonstration purposes. I would like to know about available subsidies for homestay renovation.",
          status: "open",
          priority: "medium",
          lastReadByOwner: /* @__PURE__ */ new Date()
        });
        console.log("\u2705 Sample Grievance created.");
      }
      const demoGrievance = (await db.select().from(grievances).where(eq(grievances.userId, demoUserId)).limit(1))[0];
      if (demoGrievance) {
        const adminReplies = await db.select().from(grievanceComments).where(
          and(
            eq(grievanceComments.grievanceId, demoGrievance.id),
            ne(grievanceComments.userId, demoUserId)
          )
        );
        if (adminReplies.length === 0) {
          const adminUser = await db.select().from(users).where(eq(users.mobile, "9999999999")).limit(1);
          if (adminUser.length > 0) {
            console.log("\u{1F4AC} Adding Admin reply to Demo Grievance...");
            await db.insert(grievanceComments).values({
              grievanceId: demoGrievance.id,
              userId: adminUser[0].id,
              comment: "Dear Property Owner, we have received your inquiry. Subsidies are available under the HPTDC Home Stay Scheme 2025. Please visit the nearest tourism office for details.",
              isInternal: false
            });
            await db.update(grievances).set({
              status: "in_progress",
              lastCommentAt: /* @__PURE__ */ new Date(),
              lastReadByOfficer: /* @__PURE__ */ new Date()
              // Admin read it
            }).where(eq(grievances.id, demoGrievance.id));
            console.log("\u2705 Admin reply added & Ticket updated to In Progress.");
          }
        }
      }
    } else {
      console.log("\u{1F3ED} Production environment detected - skipping demo data seeding.");
    }
    console.log("\u{1F465} Seeding district staff accounts (DA & DTDO)\u2026");
    const staffManifest = getDistrictStaffManifest();
    let daUpserts = 0;
    let dtdoUpserts = 0;
    for (const entry of staffManifest) {
      for (const roleKey of ["da", "dtdo"]) {
        const staffRecord = entry[roleKey];
        const role = roleKey === "da" ? "dealing_assistant" : "district_tourism_officer";
        const designation = roleKey === "da" ? "Dealing Assistant" : "District Tourism Development Officer";
        const fullNameSuffix = roleKey === "da" ? "DA" : "DTDO";
        const hashedPassword = await bcrypt.hash(staffRecord.password, 10);
        const existing = await db.select().from(users).where(eq(users.mobile, staffRecord.mobile)).limit(1);
        if (existing.length > 0) {
          await db.update(users).set({
            role,
            district: entry.districtLabel,
            username: staffRecord.username,
            email: staffRecord.email,
            fullName: `${staffRecord.fullName} (${fullNameSuffix} ${entry.districtLabel})`,
            designation,
            password: hashedPassword,
            isActive: true
          }).where(eq(users.mobile, staffRecord.mobile));
        } else {
          await db.insert(users).values({
            mobile: staffRecord.mobile,
            email: staffRecord.email,
            password: hashedPassword,
            fullName: `${staffRecord.fullName} (${fullNameSuffix} ${entry.districtLabel})`,
            role,
            district: entry.districtLabel,
            username: staffRecord.username,
            designation,
            isActive: true
          });
        }
        if (roleKey === "da") {
          daUpserts += 1;
        } else {
          dtdoUpserts += 1;
        }
      }
    }
    console.log(
      `\u2705 District staff accounts ensured (${daUpserts} DA, ${dtdoUpserts} DTDO)`
    );
    console.log(
      "   \u279C Reference credentials: seed_data/district-staff-accounts.csv"
    );
    const sampleEntry = staffManifest.find(
      (entry) => entry.districtLabel.toLowerCase().includes("shimla") || entry.da.username === "da_shimla"
    ) ?? staffManifest[0];
    console.log("\n\u{1F4CB} Summary of Default Accounts:");
    console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    console.log("\u2502 Role               \u2502 Mobile       \u2502 Password         \u2502 Access Level         \u2502");
    console.log("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524");
    console.log("\u2502 Admin              \u2502 9999999999   \u2502 admin123         \u2502 User Management      \u2502");
    console.log("\u2502 Super Admin        \u2502 9999999998   \u2502 SuperAdmin@2025  \u2502 Full System + Reset  \u2502");
    console.log(`\u2502 Dealing Assistants \u2502 ${daUpserts.toString().padEnd(12)} \u2502 refer manifest   \u2502 District Queues      \u2502`);
    console.log(`\u2502 DTDOs              \u2502 ${dtdoUpserts.toString().padEnd(12)} \u2502 refer manifest   \u2502 District Escalations \u2502`);
    if (sampleEntry) {
      console.log("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524");
      console.log(
        `\u2502 Sample DA (${sampleEntry.districtLabel.slice(0, 12).padEnd(12)}) \u2502 ${sampleEntry.da.mobile.padEnd(12)} \u2502 ${sampleEntry.da.password.padEnd(
          16
        )} \u2502 ${sampleEntry.districtLabel.padEnd(20).slice(0, 20)} \u2502`
      );
      console.log(
        `\u2502 Sample DTDO (${sampleEntry.districtLabel.slice(0, 12).padEnd(12)}) \u2502 ${sampleEntry.dtdo.mobile.padEnd(12)} \u2502 ${sampleEntry.dtdo.password.padEnd(
          16
        )} \u2502 ${sampleEntry.districtLabel.padEnd(20).slice(0, 20)} \u2502`
      );
    }
    console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    console.log("\n\u{1F389} Database seed completed successfully!");
    console.log("   Run this script anytime to ensure default accounts and DDO codes exist.");
    process.exit(0);
  } catch (error) {
    console.error("\u274C Database seed failed:", error);
    process.exit(1);
  }
}
seed();
