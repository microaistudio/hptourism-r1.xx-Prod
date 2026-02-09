var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
import { sql as sql2 } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var APPLICATION_KIND_VALUES, applicationKindEnum, serviceContextSchema, users, insertUserSchema, selectUserSchema, userProfiles, insertUserProfileSchema, userProfileFormSchema, selectUserProfileSchema, PROJECT_TYPE_VALUES, homestayApplications, insertHomestayApplicationSchema, draftHomestayApplicationSchema, selectHomestayApplicationSchema, documents, insertDocumentSchema, selectDocumentSchema, storageObjects, session, insertStorageObjectSchema, payments, insertPaymentSchema, selectPaymentSchema, notifications, insertNotificationSchema, selectNotificationSchema, applicationActions, insertApplicationActionSchema, selectApplicationActionSchema, reviews, insertReviewSchema, selectReviewSchema, supportTickets, insertSupportTicketSchema, selectSupportTicketSchema, ticketMessages, insertTicketMessageSchema, selectTicketMessageSchema, ticketActions, insertTicketActionSchema, selectTicketActionSchema, auditLogs, insertAuditLogSchema, selectAuditLogSchema, productionStats, insertProductionStatsSchema, selectProductionStatsSchema, himkoshTransactions, insertHimkoshTransactionSchema, selectHimkoshTransactionSchema, ccavenueTransactions, insertCcavenueTransactionSchema, selectCcavenueTransactionSchema, ddoCodes, insertDdoCodeSchema, selectDdoCodeSchema, inspectionOrders, insertInspectionOrderSchema, selectInspectionOrderSchema, inspectionReports, insertInspectionReportSchema, selectInspectionReportSchema, objections, insertObjectionSchema, selectObjectionSchema, clarifications, insertClarificationSchema, selectClarificationSchema, certificates, insertCertificateSchema, selectCertificateSchema, systemSettings, insertSystemSettingSchema, selectSystemSettingSchema, loginOtpChallenges, passwordResetChallenges, lgdDistricts, insertLgdDistrictSchema, selectLgdDistrictSchema, lgdTehsils, insertLgdTehsilSchema, selectLgdTehsilSchema, lgdBlocks, insertLgdBlockSchema, selectLgdBlockSchema, lgdGramPanchayats, insertLgdGramPanchayatSchema, selectLgdGramPanchayatSchema, lgdUrbanBodies, insertLgdUrbanBodySchema, selectLgdUrbanBodySchema, grievances, insertGrievanceSchema, selectGrievanceSchema, grievanceComments, insertGrievanceCommentSchema, grievanceAuditLog, sessions;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    APPLICATION_KIND_VALUES = ["new_registration", "renewal", "add_rooms", "delete_rooms", "cancel_certificate", "change_category", "change_ownership"];
    applicationKindEnum = z.enum(APPLICATION_KIND_VALUES);
    serviceContextSchema = z.object({
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
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
      enabledServices: jsonb("enabled_services").$type().default(sql2`'["homestay"]'::jsonb`),
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
    insertUserSchema = createInsertSchema(users, {
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
    selectUserSchema = createSelectSchema(users);
    userProfiles = pgTable("user_profiles", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertUserProfileSchema = createInsertSchema(userProfiles, {
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
    userProfileFormSchema = z.object({
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
    selectUserProfileSchema = createSelectSchema(userProfiles);
    PROJECT_TYPE_VALUES = [
      "new_property",
      "existing_property",
      "new_project",
      "new_rooms"
    ];
    homestayApplications = pgTable("homestay_applications", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertHomestayApplicationSchema = createInsertSchema(homestayApplications, {
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
    draftHomestayApplicationSchema = createInsertSchema(homestayApplications, {
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
    selectHomestayApplicationSchema = createSelectSchema(homestayApplications);
    documents = pgTable("documents", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadDate: true });
    selectDocumentSchema = createSelectSchema(documents);
    storageObjects = pgTable("storage_objects", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    session = pgTable("session", {
      sid: varchar("sid").primaryKey().notNull(),
      sess: jsonb("sess").notNull(),
      expire: timestamp("expire", { precision: 6 }).notNull()
    });
    insertStorageObjectSchema = createInsertSchema(storageObjects).omit({ id: true, createdAt: true });
    payments = pgTable("payments", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertPaymentSchema = createInsertSchema(payments).omit({ id: true, initiatedAt: true });
    selectPaymentSchema = createSelectSchema(payments);
    notifications = pgTable("notifications", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
    selectNotificationSchema = createSelectSchema(notifications);
    applicationActions = pgTable("application_actions", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertApplicationActionSchema = createInsertSchema(applicationActions, {
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
    selectApplicationActionSchema = createSelectSchema(applicationActions);
    reviews = pgTable("reviews", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertReviewSchema = createInsertSchema(reviews, {
      rating: z.number().int().min(1).max(5),
      reviewText: z.string().min(10, "Review must be at least 10 characters").optional()
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectReviewSchema = createSelectSchema(reviews);
    supportTickets = pgTable("support_tickets", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertSupportTicketSchema = createInsertSchema(supportTickets, {
      category: z.enum(["delay", "payment", "document", "inspection", "technical", "general", "escalation", "other"]),
      status: z.enum(["open", "assigned", "in_progress", "resolved", "closed"]),
      priority: z.enum(["low", "medium", "high", "urgent"]),
      subject: z.string().min(5, "Subject must be at least 5 characters").max(255),
      description: z.string().min(20, "Description must be at least 20 characters")
    }).omit({ id: true, ticketNumber: true, createdAt: true, updatedAt: true });
    selectSupportTicketSchema = createSelectSchema(supportTickets);
    ticketMessages = pgTable("ticket_messages", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertTicketMessageSchema = createInsertSchema(ticketMessages, {
      senderRole: z.enum(["applicant", "officer", "system"]),
      message: z.string().min(1, "Message cannot be empty")
    }).omit({ id: true, createdAt: true });
    selectTicketMessageSchema = createSelectSchema(ticketMessages);
    ticketActions = pgTable("ticket_actions", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertTicketActionSchema = createInsertSchema(ticketActions, {
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
    selectTicketActionSchema = createSelectSchema(ticketActions);
    auditLogs = pgTable("audit_logs", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id),
      action: varchar("action", { length: 100 }).notNull(),
      details: jsonb("details"),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
    selectAuditLogSchema = createSelectSchema(auditLogs);
    productionStats = pgTable("production_stats", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      totalApplications: integer("total_applications").notNull(),
      approvedApplications: integer("approved_applications").notNull(),
      rejectedApplications: integer("rejected_applications").notNull(),
      pendingApplications: integer("pending_applications").notNull(),
      scrapedAt: timestamp("scraped_at").defaultNow(),
      sourceUrl: text("source_url")
    });
    insertProductionStatsSchema = createInsertSchema(productionStats).omit({ id: true, scrapedAt: true });
    selectProductionStatsSchema = createSelectSchema(productionStats);
    himkoshTransactions = pgTable("himkosh_transactions", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertHimkoshTransactionSchema = createInsertSchema(himkoshTransactions, {
      deptRefNo: z.string().min(1),
      appRefNo: z.string().min(1),
      totalAmount: z.number().int().min(1),
      tenderBy: z.string().min(3)
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectHimkoshTransactionSchema = createSelectSchema(himkoshTransactions);
    ccavenueTransactions = pgTable("ccavenue_transactions", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertCcavenueTransactionSchema = createInsertSchema(ccavenueTransactions).omit({ id: true, createdAt: true, updatedAt: true });
    selectCcavenueTransactionSchema = createSelectSchema(ccavenueTransactions);
    ddoCodes = pgTable("ddo_codes", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertDdoCodeSchema = createInsertSchema(ddoCodes, {
      district: z.string().min(2),
      ddoCode: z.string().min(3),
      ddoDescription: z.string().min(3),
      treasuryCode: z.string().min(3)
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectDdoCodeSchema = createSelectSchema(ddoCodes);
    inspectionOrders = pgTable("inspection_orders", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertInspectionOrderSchema = createInsertSchema(inspectionOrders, {
      inspectionDate: z.date().or(z.string()),
      inspectionAddress: z.string().min(10, "Address must be at least 10 characters"),
      specialInstructions: z.string().optional().or(z.literal("")),
      dtdoNotes: z.string().optional().or(z.literal(""))
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectInspectionOrderSchema = createSelectSchema(inspectionOrders);
    inspectionReports = pgTable("inspection_reports", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertInspectionReportSchema = createInsertSchema(inspectionReports, {
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
    selectInspectionReportSchema = createSelectSchema(inspectionReports);
    objections = pgTable("objections", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertObjectionSchema = createInsertSchema(objections, {
      objectionType: z.enum(["document_incomplete", "category_mismatch", "safety_violation", "amenity_mismatch", "structural_issue", "other"]),
      objectionTitle: z.string().min(5, "Title must be at least 5 characters"),
      objectionDescription: z.string().min(20, "Description must be at least 20 characters"),
      severity: z.enum(["minor", "major", "critical"]),
      responseDeadline: z.date().or(z.string()).optional()
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectObjectionSchema = createSelectSchema(objections);
    clarifications = pgTable("clarifications", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertClarificationSchema = createInsertSchema(clarifications, {
      clarificationText: z.string().min(20, "Clarification must be at least 20 characters")
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectClarificationSchema = createSelectSchema(clarifications);
    certificates = pgTable("certificates", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertCertificateSchema = createInsertSchema(certificates, {
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
    selectCertificateSchema = createSelectSchema(certificates);
    systemSettings = pgTable("system_settings", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertSystemSettingSchema = createInsertSchema(systemSettings, {
      settingKey: z.string().min(1, "Setting key is required"),
      settingValue: z.any(),
      // Allow any JSON value
      description: z.string().optional().or(z.literal("")),
      category: z.enum(["general", "payment", "notification", "security"]).optional()
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectSystemSettingSchema = createSelectSchema(systemSettings);
    loginOtpChallenges = pgTable("login_otp_challenges", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      otpHash: varchar("otp_hash", { length: 255 }).notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      consumedAt: timestamp("consumed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    passwordResetChallenges = pgTable("password_reset_challenges", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      channel: varchar("channel", { length: 32 }).notNull(),
      recipient: varchar("recipient", { length: 255 }),
      otpHash: varchar("otp_hash", { length: 255 }).notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      consumedAt: timestamp("consumed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    lgdDistricts = pgTable("lgd_districts", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      lgdCode: varchar("lgd_code", { length: 20 }).unique(),
      // Official LGD code
      districtName: varchar("district_name", { length: 100 }).notNull().unique(),
      divisionName: varchar("division_name", { length: 100 }),
      // Shimla, Mandi, Kangra
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertLgdDistrictSchema = createInsertSchema(lgdDistricts, {
      districtName: z.string().min(2),
      lgdCode: z.string().optional(),
      divisionName: z.string().optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
    selectLgdDistrictSchema = createSelectSchema(lgdDistricts);
    lgdTehsils = pgTable("lgd_tehsils", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertLgdTehsilSchema = createInsertSchema(lgdTehsils, {
      tehsilName: z.string().min(2),
      districtId: z.string().uuid(),
      lgdCode: z.string().optional(),
      tehsilType: z.enum(["tehsil", "sub_division", "sub_tehsil"]).optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
    selectLgdTehsilSchema = createSelectSchema(lgdTehsils);
    lgdBlocks = pgTable("lgd_blocks", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertLgdBlockSchema = createInsertSchema(lgdBlocks, {
      blockName: z.string().min(2),
      districtId: z.string().uuid(),
      lgdCode: z.string().optional(),
      tehsilId: z.string().uuid().optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
    selectLgdBlockSchema = createSelectSchema(lgdBlocks);
    lgdGramPanchayats = pgTable("lgd_gram_panchayats", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      lgdCode: varchar("lgd_code", { length: 20 }).unique(),
      // Official LGD code
      gramPanchayatName: varchar("gram_panchayat_name", { length: 100 }).notNull(),
      districtId: varchar("district_id").notNull().references(() => lgdDistricts.id, { onDelete: "cascade" }),
      blockId: varchar("block_id").references(() => lgdBlocks.id, { onDelete: "cascade" }),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertLgdGramPanchayatSchema = createInsertSchema(lgdGramPanchayats, {
      gramPanchayatName: z.string().min(2),
      districtId: z.string().uuid(),
      blockId: z.string().uuid().optional(),
      lgdCode: z.string().optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
    selectLgdGramPanchayatSchema = createSelectSchema(lgdGramPanchayats);
    lgdUrbanBodies = pgTable("lgd_urban_bodies", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertLgdUrbanBodySchema = createInsertSchema(lgdUrbanBodies, {
      urbanBodyName: z.string().min(2),
      districtId: z.string().uuid(),
      bodyType: z.enum(["mc", "tcp", "np"]),
      lgdCode: z.string().optional(),
      numberOfWards: z.number().int().positive().optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });
    selectLgdUrbanBodySchema = createSelectSchema(lgdUrbanBodies);
    grievances = pgTable("grievances", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    insertGrievanceSchema = createInsertSchema(grievances, {
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
    selectGrievanceSchema = createSelectSchema(grievances);
    grievanceComments = pgTable("grievance_comments", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
      grievanceId: varchar("grievance_id").notNull().references(() => grievances.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id),
      comment: text("comment").notNull(),
      isInternal: boolean("is_internal").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertGrievanceCommentSchema = createInsertSchema(grievanceComments, {
      comment: z.string().min(1, "Comment cannot be empty"),
      isInternal: z.boolean().optional()
    }).omit({ id: true, createdAt: true, userId: true, grievanceId: true });
    grievanceAuditLog = pgTable("grievance_audit_log", {
      id: varchar("id").primaryKey().default(sql2`gen_random_uuid()`),
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
    sessions = pgTable("session", {
      sid: varchar("sid").primaryKey().notNull(),
      sess: jsonb("sess").notNull(),
      expire: timestamp("expire", { precision: 6 }).notNull()
    }, (table) => {
      return {
        expireIdx: index("IDX_session_expire").on(table.expire)
      };
    });
  }
});

// shared/config.ts
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { z as z2 } from "zod";
var envFile, preprocessBoolean, booleanFlag, optionalBoolean, defaultLocalStoragePath, defaultLogFilePath, rawEnv, aliasEnv, envSchema, parsed, env, config;
var init_config = __esm({
  "shared/config.ts"() {
    "use strict";
    envFile = process.env.HPT_ENV_FILE;
    if (envFile && fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
    } else {
      dotenv.config();
    }
    preprocessBoolean = (value) => {
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
    booleanFlag = (defaultValue) => z2.preprocess(preprocessBoolean, z2.boolean().optional()).default(defaultValue);
    optionalBoolean = () => z2.preprocess(preprocessBoolean, z2.boolean().optional());
    defaultLocalStoragePath = path.resolve(process.cwd(), "local-object-storage");
    defaultLogFilePath = path.resolve(process.cwd(), "logs", "app.log");
    rawEnv = { ...process.env };
    aliasEnv = (target, ...sourceKeys) => {
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
    envSchema = z2.object({
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
    parsed = envSchema.safeParse(rawEnv);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      throw new Error(`Invalid environment configuration:
${issues.join("\n")}`);
    }
    env = parsed.data;
    config = {
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
  }
});

// server/db.ts
import ws from "ws";
import { Pool as PgPool } from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
var url, driver, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_config();
    ({ url, driver } = config.database);
    if (!url) {
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
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
  }
});

// shared/userUtils.ts
var normalizeUsername;
var init_userUtils = __esm({
  "shared/userUtils.ts"() {
    "use strict";
    normalizeUsername = (value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      return trimmed.toLowerCase();
    };
  }
});

// shared/applicationNumber.ts
var DISTRICT_CODE_OVERRIDES, sanitizeDistrictLabel, getDistrictCode, formatApplicationNumber, ensureDistrictCodeOnApplicationNumber;
var init_applicationNumber = __esm({
  "shared/applicationNumber.ts"() {
    "use strict";
    DISTRICT_CODE_OVERRIDES = {
      shimla: "SML",
      "shimla division": "SML",
      "shimla hq": "SML",
      kullu: "KUL",
      "kullu dhalpur": "KUL",
      "kullu (bhuntar/manali)": "KUL",
      kangra: "KNG",
      dharamsala: "KNG",
      hamirpur: "HMP",
      una: "UNA",
      mandi: "MDI",
      chamba: "CHM",
      bharmour: "BRM",
      "lahaul": "LHL",
      "lahaul & spiti": "LHS",
      "lahaul and spiti": "LHS",
      kinnaur: "KNR",
      sirmaur: "SMR",
      solan: "SOL",
      bilaspur: "BIL",
      pangi: "PNG",
      kaza: "KZA"
    };
    sanitizeDistrictLabel = (value) => (value || "").trim().toLowerCase();
    getDistrictCode = (district) => {
      const normalized = sanitizeDistrictLabel(district);
      if (!normalized) {
        return "HPG";
      }
      if (DISTRICT_CODE_OVERRIDES[normalized]) {
        return DISTRICT_CODE_OVERRIDES[normalized];
      }
      const cleaned = normalized.replace(/[^a-z]/g, "");
      return cleaned.slice(0, 3).toUpperCase() || "HPG";
    };
    formatApplicationNumber = (sequence, district) => {
      const year = String((/* @__PURE__ */ new Date()).getFullYear());
      const districtCode = getDistrictCode(district);
      const serial = String(sequence).padStart(6, "0");
      return `HP-HS-${year}-${districtCode}-${serial}`;
    };
    ensureDistrictCodeOnApplicationNumber = (applicationNumber, district) => {
      if (/HP-HS-\d{4}-[A-Z]{3}-\d{6}/.test(applicationNumber)) {
        return applicationNumber;
      }
      const parts = applicationNumber.split("-");
      const yearCandidate = parts.length >= 3 && /^\d{4}$/.test(parts[2]) ? parts[2] : String((/* @__PURE__ */ new Date()).getFullYear());
      const serial = parts[parts.length - 1] || "000000";
      const districtCode = getDistrictCode(district);
      return `HP-HS-${yearCandidate}-${districtCode}-${serial.padStart(6, "0")}`;
    };
  }
});

// shared/districtRouting.ts
var districtRouting_exports = {};
__export(districtRouting_exports, {
  deriveDistrictRoutingLabel: () => deriveDistrictRoutingLabel,
  getDisplayDistrictLabel: () => getDisplayDistrictLabel,
  getDistrictsCoveredBy: () => getDistrictsCoveredBy,
  isPangiSubDivision: () => isPangiSubDivision
});
var normalizeValue, CHAMBA_PANGI_TEHSILS, LAHAUL_SPITI_KAZA_TEHSILS, canonicalLabels, resolveChambaRouting, resolveLahaulSpitiRouting, deriveDistrictRoutingLabel, isPangiSubDivision, getDistrictsCoveredBy, getDisplayDistrictLabel;
var init_districtRouting = __esm({
  "shared/districtRouting.ts"() {
    "use strict";
    normalizeValue = (value) => value?.trim().toLowerCase() ?? "";
    CHAMBA_PANGI_TEHSILS = /* @__PURE__ */ new Set(["pangi"]);
    LAHAUL_SPITI_KAZA_TEHSILS = /* @__PURE__ */ new Set(["kaza", "spiti"]);
    canonicalLabels = {
      // Group A - Single District Pipelines
      kangra: "Kangra",
      kinnaur: "Kinnaur",
      kullu: "Kullu",
      shimla: "Shimla",
      sirmaur: "Sirmaur",
      solan: "Solan",
      // Group B - Merged Pipelines
      hamirpur: "Hamirpur",
      // Receives: Hamirpur + Una
      bilaspur: "Bilaspur",
      // Receives: Bilaspur + Mandi
      // Group C - Split Pipelines (Chamba)
      chamba: "Chamba",
      // Receives: All Chamba tehsils except Pangi (including Bharmour)
      pangi: "Pangi",
      // Receives: Pangi tehsil only (ITDP, 50% fee waiver)
      // Group C - Split Pipelines (Lahaul-Spiti)
      lahaul: "Lahaul",
      // Receives: Lahaul + Udaipur tehsils
      kaza: "Lahaul-Spiti (Kaza)"
      // Receives: Spiti tehsil only (ITDP)
    };
    resolveChambaRouting = (tehsil) => {
      const normalizedTehsil = normalizeValue(tehsil);
      if (CHAMBA_PANGI_TEHSILS.has(normalizedTehsil)) {
        return canonicalLabels.pangi;
      }
      return canonicalLabels.chamba;
    };
    resolveLahaulSpitiRouting = (tehsil) => {
      const normalizedTehsil = normalizeValue(tehsil);
      if (LAHAUL_SPITI_KAZA_TEHSILS.has(normalizedTehsil)) {
        return canonicalLabels.kaza;
      }
      return canonicalLabels.lahaul;
    };
    deriveDistrictRoutingLabel = (district, tehsil) => {
      const normalizedDistrict = normalizeValue(district);
      if (!normalizedDistrict) {
        return district ?? void 0;
      }
      switch (normalizedDistrict) {
        // === Group B: Merged Districts ===
        // FIX (2025-02-01): Identity Preservation
        // Do NOT return the pipeline name here. Return undefined so the original district is stored.
        // The "Routing" happens purely in getDistrictsCoveredBy for dashboard visibility.
        case "una":
        case "bilaspur":
          return void 0;
        // Handled by bidirectional lookup in getDistrictsCoveredBy
        // === Group C: Split Districts ===
        // These MUST separate because "Pangi" is a distinct jurisdiction within Chamba for fees.
        case "chamba":
          return resolveChambaRouting(tehsil);
        case "lahaul and spiti":
        case "lahaul & spiti":
        case "lahaul-spiti":
        case "lahaul spiti":
          return resolveLahaulSpitiRouting(tehsil);
        // === Group A + B Primary: Direct routing ===
        default:
          return district ?? void 0;
      }
    };
    isPangiSubDivision = (district, tehsil) => {
      const normalizedDistrict = normalizeValue(district);
      const normalizedTehsil = normalizeValue(tehsil);
      return normalizedDistrict === "chamba" && CHAMBA_PANGI_TEHSILS.has(normalizedTehsil);
    };
    getDistrictsCoveredBy = (officerDistrict) => {
      const normalized = normalizeValue(officerDistrict);
      if (!normalized) return [];
      const covered = [officerDistrict];
      switch (normalized) {
        case "hamirpur":
          covered.push("Una");
          break;
        case "una":
          covered.push("Hamirpur");
          break;
        // FIX (2025-02-01): Mandi processes Bilaspur (Swapped from previous wrong implementation)
        case "mandi":
          covered.push("Bilaspur");
          break;
        case "bilaspur":
          covered.push("Mandi");
          break;
        case "chamba":
          break;
      }
      return covered;
    };
    getDisplayDistrictLabel = (district) => {
      const d = normalizeValue(district);
      if (d === "pangi") return "Chamba";
      if (d === "kaza" || d === "spiti" || d.includes("kaza") || d === "lahaul") return "Lahaul and Spiti";
      return district || "";
    };
  }
});

// shared/districtStaffManifest.ts
var normalizeStaffIdentifier, DISTRICT_STAFF_MANIFEST, STAFF_BY_USERNAME, STAFF_BY_MOBILE, lookupStaffAccountByIdentifier, lookupStaffAccountByMobile, getManifestDerivedUsername, lookupDtdoByDistrictLabel, getDistrictStaffManifest;
var init_districtStaffManifest = __esm({
  "shared/districtStaffManifest.ts"() {
    "use strict";
    normalizeStaffIdentifier = (value) => {
      if (typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim().toLowerCase();
      if (!trimmed) {
        return null;
      }
      return trimmed.replace(/[.\s-]+/g, "_");
    };
    DISTRICT_STAFF_MANIFEST = [
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
    STAFF_BY_USERNAME = /* @__PURE__ */ new Map();
    STAFF_BY_MOBILE = /* @__PURE__ */ new Map();
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
    lookupStaffAccountByIdentifier = (identifier) => {
      const normalized = normalizeStaffIdentifier(identifier);
      if (!normalized) return void 0;
      return STAFF_BY_USERNAME.get(normalized);
    };
    lookupStaffAccountByMobile = (mobile) => {
      if (!mobile) return void 0;
      return STAFF_BY_MOBILE.get(mobile);
    };
    getManifestDerivedUsername = (mobile, fallback) => {
      if (fallback && fallback.trim().length > 0) {
        return fallback;
      }
      const entry = lookupStaffAccountByMobile(mobile);
      return entry?.username ?? null;
    };
    lookupDtdoByDistrictLabel = (districtLabel) => {
      if (!districtLabel) return void 0;
      for (const entry of DISTRICT_STAFF_MANIFEST) {
        if (entry.districtLabel.toLowerCase() === districtLabel.toLowerCase()) {
          return {
            fullName: entry.dtdo.fullName,
            mobile: entry.dtdo.mobile,
            email: entry.dtdo.email,
            districtLabel: entry.districtLabel
          };
        }
      }
      const normalized = districtLabel.toLowerCase().replace(/[^a-z]/g, "");
      for (const entry of DISTRICT_STAFF_MANIFEST) {
        const entryNormalized = entry.districtLabel.toLowerCase().replace(/[^a-z]/g, "");
        if (entryNormalized.includes(normalized) || normalized.includes(entryNormalized.slice(0, 5))) {
          return {
            fullName: entry.dtdo.fullName,
            mobile: entry.dtdo.mobile,
            email: entry.dtdo.email,
            districtLabel: entry.districtLabel
          };
        }
      }
      return void 0;
    };
    getDistrictStaffManifest = () => DISTRICT_STAFF_MANIFEST;
  }
});

// server/db-storage.ts
import { eq, and, desc, asc, sql as sql3 } from "drizzle-orm";
var APPLICATION_NUMBER_UNIQUE_CONSTRAINT, APPLICATION_SERIAL_SEED_KEY, isApplicationNumberUniqueViolation, DbStorage;
var init_db_storage = __esm({
  "server/db-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_userUtils();
    init_applicationNumber();
    init_districtStaffManifest();
    init_districtRouting();
    APPLICATION_NUMBER_UNIQUE_CONSTRAINT = "homestay_applications_application_number_key";
    APPLICATION_SERIAL_SEED_KEY = "application_serial_seed";
    isApplicationNumberUniqueViolation = (error) => {
      if (!error || typeof error !== "object") {
        return false;
      }
      const err = error;
      return err.code === "23505" && err.constraint === APPLICATION_NUMBER_UNIQUE_CONSTRAINT;
    };
    DbStorage = class {
      // User methods
      async getUser(id) {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
      }
      async getUserByMobile(mobile) {
        const result = await db.select().from(users).where(eq(users.mobile, mobile)).limit(1);
        return result[0];
      }
      async getUserByUsername(username) {
        const normalized = normalizeUsername(username);
        if (!normalized) {
          return void 0;
        }
        const result = await db.select().from(users).where(eq(users.username, normalized)).limit(1);
        if (result[0]) {
          return result[0];
        }
        const manifestEntry = lookupStaffAccountByIdentifier(normalized);
        if (manifestEntry) {
          return this.getUserByMobile(manifestEntry.mobile);
        }
        return void 0;
      }
      async getUserByEmail(email) {
        const normalized = email?.trim().toLowerCase();
        if (!normalized) {
          return void 0;
        }
        const result = await db.select().from(users).where(sql3`LOWER(${users.email}) = ${normalized}`).limit(1);
        return result[0];
      }
      async getAllUsers() {
        return await db.select().from(users);
      }
      async createUser(insertUser) {
        const payload = {
          ...insertUser,
          username: normalizeUsername(insertUser.username)
        };
        const result = await db.insert(users).values(payload).returning();
        return result[0];
      }
      async updateUser(id, updates) {
        const payload = {
          ...updates
        };
        if (updates.username !== void 0) {
          payload.username = normalizeUsername(updates.username);
        }
        const result = await db.update(users).set({ ...payload, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return result[0];
      }
      // Homestay Application methods
      async getApplication(id) {
        const result = await db.select().from(homestayApplications).where(eq(homestayApplications.id, id)).limit(1);
        return result[0];
      }
      async getApplicationsByUser(userId) {
        return await db.select().from(homestayApplications).where(eq(homestayApplications.userId, userId)).orderBy(desc(homestayApplications.createdAt));
      }
      async getApplicationsByDistrict(district) {
        return await db.select().from(homestayApplications).where(
          and(
            eq(homestayApplications.district, district),
            eq(homestayApplications.status, "pending")
          )
        ).orderBy(desc(homestayApplications.createdAt));
      }
      async getApplicationsByStatus(status) {
        return await db.select().from(homestayApplications).where(eq(homestayApplications.status, status)).orderBy(desc(homestayApplications.createdAt));
      }
      async getAllApplications() {
        return await db.select().from(homestayApplications).orderBy(desc(homestayApplications.createdAt));
      }
      async createApplication(insertApp, options) {
        const routedDistrict = deriveDistrictRoutingLabel(insertApp.district, insertApp.tehsil);
        const normalizedInsert = {
          ...insertApp,
          district: routedDistrict ?? insertApp.district
        };
        const status = options?.trusted ? normalizedInsert.status || "draft" : "draft";
        const basePayload = {
          ...normalizedInsert,
          applicationKind: normalizedInsert.applicationKind ?? "new_registration",
          status
        };
        let sequence = await this.nextApplicationSequence();
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const applicationNumber = formatApplicationNumber(sequence, normalizedInsert.district);
          const appToInsert = {
            ...basePayload,
            applicationNumber
          };
          try {
            if (appToInsert.formCompletionTimeSeconds && Number(appToInsert.formCompletionTimeSeconds) > 2e9) {
              appToInsert.formCompletionTimeSeconds = 0;
            }
            const result = await db.insert(homestayApplications).values([appToInsert]).returning();
            return result[0];
          } catch (error) {
            if (isApplicationNumberUniqueViolation(error)) {
              sequence += 1;
              continue;
            }
            throw error;
          }
        }
        throw new Error("Unable to generate unique application number after multiple attempts");
      }
      async updateApplication(id, updates) {
        const result = await db.update(homestayApplications).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(homestayApplications.id, id)).returning();
        return result[0];
      }
      async deleteApplication(id) {
        await this.deleteApplicationActions(id);
        await db.delete(notifications).where(eq(notifications.applicationId, id));
        await db.delete(payments).where(eq(payments.applicationId, id));
        await this.deleteDocumentsByApplication(id);
        const { himkoshTransactions: himkoshTransactions3, reviews: reviews3, supportTickets: supportTickets2, certificates: certificates2, grievances: grievances2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        await db.delete(himkoshTransactions3).where(eq(himkoshTransactions3.applicationId, id));
        await db.delete(reviews3).where(eq(reviews3.applicationId, id));
        await db.delete(supportTickets2).where(eq(supportTickets2.applicationId, id));
        await db.delete(certificates2).where(eq(certificates2.applicationId, id));
        await db.delete(grievances2).where(eq(grievances2.applicationId, id));
        await db.delete(homestayApplications).where(eq(homestayApplications.id, id));
      }
      // Document methods
      async createDocument(doc) {
        const result = await db.insert(documents).values(doc).returning();
        return result[0];
      }
      async getDocumentsByApplication(applicationId) {
        const tableDocuments = await db.select().from(documents).where(eq(documents.applicationId, applicationId)).orderBy(asc(documents.uploadDate));
        if (tableDocuments.length > 0) {
          return tableDocuments;
        }
        const [application] = await db.select({ documents: homestayApplications.documents }).from(homestayApplications).where(eq(homestayApplications.id, applicationId)).limit(1);
        if (!application?.documents || !Array.isArray(application.documents)) {
          return [];
        }
        const jsonbDocs = application.documents;
        return jsonbDocs.map((doc, index2) => ({
          id: doc.id || `jsonb-${applicationId}-${index2}`,
          applicationId,
          documentType: doc.documentType || doc.type || "document",
          fileName: doc.fileName || doc.name || `Document ${index2 + 1}`,
          filePath: doc.filePath || doc.fileUrl || doc.url || "",
          fileSize: doc.fileSize || 0,
          mimeType: doc.mimeType || "application/octet-stream",
          uploadDate: /* @__PURE__ */ new Date(),
          isVerified: false,
          verifiedBy: null,
          verificationDate: null,
          verificationNotes: null,
          verificationStatus: "pending",
          aiVerificationStatus: null,
          aiConfidenceScore: null,
          aiNotes: null
        }));
      }
      async deleteDocumentsByApplication(applicationId) {
        await db.delete(documents).where(eq(documents.applicationId, applicationId));
      }
      /**
       * Sync documents from application's JSONB field to the documents table.
       * Called when an application is submitted to ensure documents are properly
       * linked for DA verification workflow.
       */
      async syncDocumentsFromJsonb(applicationId) {
        const existingDocs = await db.select({ id: documents.id }).from(documents).where(eq(documents.applicationId, applicationId)).limit(1);
        if (existingDocs.length > 0) {
          return 0;
        }
        const [application] = await db.select({ documents: homestayApplications.documents }).from(homestayApplications).where(eq(homestayApplications.id, applicationId)).limit(1);
        if (!application?.documents || !Array.isArray(application.documents)) {
          return 0;
        }
        const jsonbDocs = application.documents;
        if (jsonbDocs.length === 0) {
          return 0;
        }
        const docsToInsert = jsonbDocs.map((doc) => ({
          applicationId,
          documentType: doc.documentType || doc.type || "document",
          fileName: doc.fileName || doc.name || "Unnamed Document",
          filePath: doc.filePath || doc.fileUrl || doc.url || "",
          fileSize: doc.fileSize || 0,
          mimeType: doc.mimeType || "application/octet-stream",
          isVerified: false,
          verificationStatus: "pending"
        }));
        await db.insert(documents).values(docsToInsert);
        return docsToInsert.length;
      }
      // Payment methods
      async createPayment(payment) {
        const result = await db.insert(payments).values(payment).returning();
        return result[0];
      }
      async updatePayment(id, updates) {
        const result = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
        return result[0];
      }
      async getPaymentById(id) {
        const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
        return result[0];
      }
      async getPaymentsByApplication(applicationId) {
        return await db.select().from(payments).where(eq(payments.applicationId, applicationId)).orderBy(desc(payments.initiatedAt));
      }
      // Notification methods
      async createNotification(notification) {
        const rawChannels = notification.channels;
        const normalizedChannels = rawChannels ? {
          email: rawChannels.email,
          sms: rawChannels.sms,
          whatsapp: rawChannels.whatsapp,
          inapp: rawChannels.inapp
        } : void 0;
        const payload = {
          ...notification,
          channels: normalizedChannels
        };
        const result = await db.insert(notifications).values(payload).returning();
        return result[0];
      }
      async getNotificationsByUser(userId) {
        return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      }
      async markNotificationAsRead(id) {
        await db.update(notifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(eq(notifications.id, id));
      }
      // Application Action methods
      async createApplicationAction(action) {
        const payload = {
          ...action,
          issuesFound: Array.isArray(action.issuesFound) ? action.issuesFound.map((issue) => String(issue)) : void 0
        };
        const result = await db.insert(applicationActions).values(payload).returning();
        return result[0];
      }
      async getApplicationActions(applicationId) {
        return await db.select().from(applicationActions).where(eq(applicationActions.applicationId, applicationId)).orderBy(desc(applicationActions.createdAt));
      }
      async deleteApplicationActions(applicationId) {
        await db.delete(applicationActions).where(eq(applicationActions.applicationId, applicationId));
      }
      // Dev methods
      async getStats() {
        const { count: count2 } = await import("drizzle-orm");
        const [usersCountResult, appsCountResult, docsCountResult, paymentsCountResult] = await Promise.all([
          db.select({ count: count2() }).from(users),
          db.select({ count: count2() }).from(homestayApplications),
          db.select({ count: count2() }).from(documents),
          db.select({ count: count2() }).from(payments)
        ]);
        const usersCount = usersCountResult[0]?.count ?? 0;
        const appsCount = appsCountResult[0]?.count ?? 0;
        const docsCount = docsCountResult[0]?.count ?? 0;
        const paymentsCount = paymentsCountResult[0]?.count ?? 0;
        return {
          users: Number(usersCount),
          applications: Number(appsCount),
          documents: Number(docsCount),
          payments: Number(paymentsCount)
        };
      }
      async clearAll() {
        await db.delete(applicationActions);
        await db.delete(notifications);
        await db.delete(payments);
        await db.delete(documents);
        await db.delete(homestayApplications);
        await db.delete(users);
      }
      // Production Stats methods
      async saveProductionStats(stats) {
        await db.insert(productionStats).values(stats);
      }
      async getLatestProductionStats() {
        const result = await db.select().from(productionStats).orderBy(desc(productionStats.scrapedAt)).limit(1);
        if (!result[0]) return null;
        return {
          totalApplications: result[0].totalApplications,
          approvedApplications: result[0].approvedApplications,
          rejectedApplications: result[0].rejectedApplications,
          pendingApplications: result[0].pendingApplications,
          scrapedAt: result[0].scrapedAt || /* @__PURE__ */ new Date()
        };
      }
      async nextApplicationSequence() {
        const [row] = await db.select({
          maxSerial: sql3`COALESCE(MAX(CAST(substring(${homestayApplications.applicationNumber} from '([0-9]+)$') AS INTEGER)), 0)`
        }).from(homestayApplications);
        const seedRow = await db.select({ value: systemSettings.settingValue }).from(systemSettings).where(eq(systemSettings.settingKey, APPLICATION_SERIAL_SEED_KEY)).limit(1);
        const seedValue = seedRow?.[0]?.value ? parseInt(seedRow[0].value, 10) : 0;
        const seed = Number.isFinite(seedValue) && seedValue > 0 ? seedValue : 0;
        const maxSerial = row?.maxSerial ?? 0;
        const baseline = Math.max(maxSerial, seed - 1);
        return baseline + 1;
      }
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  MemStorage: () => MemStorage,
  storage: () => storage
});
import { randomUUID } from "crypto";
var MemStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_config();
    init_userUtils();
    init_applicationNumber();
    init_districtRouting();
    init_districtStaffManifest();
    init_db_storage();
    MemStorage = class _MemStorage {
      static normalizeNullable(input) {
        const normalized = { ...input };
        for (const key of Object.keys(normalized)) {
          if (normalized[key] === void 0) {
            normalized[key] = null;
          }
        }
        return normalized;
      }
      constructor() {
        this.users = /* @__PURE__ */ new Map();
        this.applications = /* @__PURE__ */ new Map();
        this.documents = /* @__PURE__ */ new Map();
        this.payments = /* @__PURE__ */ new Map();
        this.notifications = /* @__PURE__ */ new Map();
        this.applicationActions = /* @__PURE__ */ new Map();
      }
      // User methods
      async getUser(id) {
        return this.users.get(id);
      }
      async getUserByMobile(mobile) {
        return Array.from(this.users.values()).find(
          (user) => user.mobile === mobile
        );
      }
      async getUserByUsername(username) {
        const normalized = normalizeUsername(username);
        if (!normalized) {
          return void 0;
        }
        const match = Array.from(this.users.values()).find(
          (user) => user.username === normalized
        );
        if (match) {
          return match;
        }
        const manifestEntry = lookupStaffAccountByIdentifier(normalized);
        if (manifestEntry) {
          return this.getUserByMobile(manifestEntry.mobile);
        }
        return void 0;
      }
      async getUserByEmail(email) {
        const normalized = email?.trim().toLowerCase();
        if (!normalized) {
          return void 0;
        }
        return Array.from(this.users.values()).find(
          (user) => (user.email ?? "").toLowerCase() === normalized
        );
      }
      async getAllUsers() {
        return Array.from(this.users.values());
      }
      async createUser(insertUser) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const normalizedUsername = normalizeUsername(insertUser.username);
        const user = {
          ...insertUser,
          id,
          fullName: insertUser.fullName,
          firstName: insertUser.firstName ?? null,
          lastName: insertUser.lastName ?? null,
          username: normalizedUsername,
          email: insertUser.email ?? null,
          alternatePhone: insertUser.alternatePhone ?? null,
          designation: insertUser.designation ?? null,
          department: insertUser.department ?? null,
          employeeId: insertUser.employeeId ?? null,
          officeAddress: insertUser.officeAddress ?? null,
          officePhone: insertUser.officePhone ?? null,
          aadhaarNumber: insertUser.aadhaarNumber ?? null,
          district: insertUser.district ?? null,
          password: insertUser.password ?? null,
          isActive: true,
          createdAt: now,
          updatedAt: now
        };
        this.users.set(id, user);
        return user;
      }
      async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) return void 0;
        const processedUpdates = {
          ...updates
        };
        if (updates.username !== void 0) {
          processedUpdates.username = normalizeUsername(updates.username);
        }
        const updatedUser = {
          ...user,
          ...processedUpdates,
          id: user.id,
          // Prevent ID from being changed
          createdAt: user.createdAt,
          // Preserve creation date
          updatedAt: /* @__PURE__ */ new Date()
          // Update modification date
        };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
      // Homestay Application methods
      async getApplication(id) {
        return this.applications.get(id);
      }
      async getApplicationsByUser(userId) {
        return Array.from(this.applications.values()).filter((app2) => app2.userId === userId).sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
      }
      async getApplicationsByDistrict(district) {
        return Array.from(this.applications.values()).filter(
          (app2) => app2.district === district && app2.status === "pending"
        );
      }
      async getApplicationsByStatus(status) {
        return Array.from(this.applications.values()).filter((app2) => app2.status === status);
      }
      async getAllApplications() {
        return Array.from(this.applications.values());
      }
      async createApplication(insertApp, options) {
        const routedDistrict = deriveDistrictRoutingLabel(insertApp.district, insertApp.tehsil);
        const normalizedInsert = {
          ...insertApp,
          district: routedDistrict ?? insertApp.district
        };
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const applicationNumber = formatApplicationNumber(this.applications.size + 1, normalizedInsert.district);
        const isTrusted = options?.trusted === true;
        const status = isTrusted && normalizedInsert.status ? normalizedInsert.status : "draft";
        const submittedAt = isTrusted && normalizedInsert.submittedAt ? normalizedInsert.submittedAt : status === "pending" ? now : null;
        const currentStage = status === "pending" ? "district" : null;
        const applicationKind = insertApp.applicationKind ?? "new_registration";
        const app2 = {
          ..._MemStorage.normalizeNullable(normalizedInsert),
          id,
          applicationNumber,
          applicationKind,
          latitude: insertApp.latitude ?? null,
          longitude: insertApp.longitude ?? null,
          ownerEmail: insertApp.ownerEmail ?? null,
          amenities: insertApp.amenities ?? null,
          rooms: insertApp.rooms ?? null,
          status,
          currentStage,
          districtOfficerId: null,
          districtReviewDate: null,
          districtNotes: null,
          stateOfficerId: null,
          stateReviewDate: null,
          stateNotes: null,
          rejectionReason: null,
          clarificationRequested: null,
          certificateNumber: null,
          certificateIssuedDate: null,
          certificateExpiryDate: null,
          submittedAt,
          approvedAt: null,
          createdAt: now,
          updatedAt: now
        };
        this.applications.set(id, app2);
        return app2;
      }
      async updateApplication(id, update) {
        const existing = this.applications.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...update,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.applications.set(id, updated);
        return updated;
      }
      async deleteApplication(id) {
        this.applications.delete(id);
        await this.deleteDocumentsByApplication(id);
        await this.deleteApplicationActions(id);
      }
      // Document methods
      async createDocument(insertDoc) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const doc = {
          ..._MemStorage.normalizeNullable(insertDoc),
          id,
          uploadDate: now,
          aiVerificationStatus: insertDoc.aiVerificationStatus ?? null,
          aiConfidenceScore: insertDoc.aiConfidenceScore ?? null,
          aiNotes: insertDoc.aiNotes ?? null,
          isVerified: insertDoc.isVerified ?? false,
          verifiedBy: insertDoc.verifiedBy ?? null,
          verificationDate: insertDoc.verificationDate ?? null,
          verificationNotes: insertDoc.verificationNotes ?? null,
          verificationStatus: insertDoc.verificationStatus ?? "pending"
        };
        this.documents.set(id, doc);
        return doc;
      }
      async getDocumentsByApplication(applicationId) {
        return Array.from(this.documents.values()).filter((doc) => doc.applicationId === applicationId);
      }
      async deleteDocumentsByApplication(applicationId) {
        for (const [id, doc] of Array.from(this.documents.entries())) {
          if (doc.applicationId === applicationId) {
            this.documents.delete(id);
          }
        }
      }
      async syncDocumentsFromJsonb(_applicationId) {
        return 0;
      }
      // Payment methods
      async createPayment(insertPayment) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const receiptNumber = `REC-2025-${String(this.payments.size + 1).padStart(6, "0")}`;
        const payment = {
          ..._MemStorage.normalizeNullable(insertPayment),
          id,
          paymentGateway: insertPayment.paymentGateway ?? null,
          gatewayTransactionId: insertPayment.gatewayTransactionId ?? null,
          paymentMethod: insertPayment.paymentMethod ?? null,
          paymentStatus: insertPayment.paymentStatus ?? "pending",
          initiatedAt: now,
          completedAt: insertPayment.completedAt ?? null,
          receiptNumber,
          receiptUrl: insertPayment.receiptUrl ?? null,
          paymentLink: insertPayment.paymentLink ?? null,
          qrCodeUrl: insertPayment.qrCodeUrl ?? null,
          paymentLinkExpiryDate: insertPayment.paymentLinkExpiryDate ?? null
        };
        this.payments.set(id, payment);
        return payment;
      }
      async updatePayment(id, update) {
        const existing = this.payments.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...update
        };
        this.payments.set(id, updated);
        return updated;
      }
      async getPaymentById(id) {
        return this.payments.get(id);
      }
      async getPaymentsByApplication(applicationId) {
        return Array.from(this.payments.values()).filter((payment) => payment.applicationId === applicationId);
      }
      // Notification methods
      async createNotification(insertNotification) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const rawChannels = insertNotification.channels;
        const normalizedChannels = rawChannels ? {
          email: rawChannels.email,
          sms: rawChannels.sms,
          whatsapp: rawChannels.whatsapp,
          inapp: rawChannels.inapp
        } : { inapp: true, email: false, sms: false, whatsapp: false };
        const notification = {
          ...insertNotification,
          id,
          applicationId: insertNotification.applicationId || null,
          channels: normalizedChannels,
          isRead: false,
          readAt: null,
          createdAt: now
        };
        this.notifications.set(id, notification);
        return notification;
      }
      async getNotificationsByUser(userId) {
        return Array.from(this.notifications.values()).filter((notif) => notif.userId === userId).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      }
      async markNotificationAsRead(id) {
        const notification = this.notifications.get(id);
        if (notification) {
          notification.isRead = true;
          notification.readAt = /* @__PURE__ */ new Date();
          this.notifications.set(id, notification);
        }
      }
      // Application Action methods
      async createApplicationAction(insertAction) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const action = {
          ...insertAction,
          id,
          previousStatus: insertAction.previousStatus || null,
          newStatus: insertAction.newStatus || null,
          feedback: insertAction.feedback || null,
          issuesFound: Array.isArray(insertAction.issuesFound) ? insertAction.issuesFound.map((issue) => String(issue)) : null,
          createdAt: now
        };
        this.applicationActions.set(id, action);
        return action;
      }
      async getApplicationActions(applicationId) {
        return Array.from(this.applicationActions.values()).filter((action) => action.applicationId === applicationId).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      }
      async deleteApplicationActions(applicationId) {
        for (const [key, action] of this.applicationActions.entries()) {
          if (action.applicationId === applicationId) {
            this.applicationActions.delete(key);
          }
        }
      }
      // Production Stats methods (stub for MemStorage - not used in production)
      async saveProductionStats(stats) {
      }
      async getLatestProductionStats() {
        return null;
      }
      // Dev methods
      async getStats() {
        return {
          users: this.users.size,
          applications: this.applications.size,
          documents: this.documents.size,
          payments: this.payments.size
        };
      }
      async clearAll() {
        this.users.clear();
        this.applications.clear();
        this.documents.clear();
        this.payments.clear();
        this.notifications.clear();
        this.applicationActions.clear();
      }
    };
    storage = config.storage.useMemory ? new MemStorage() : new DbStorage();
  }
});

// server/logger.ts
import fs2 from "fs";
import path2 from "path";
import pino, { multistream } from "pino";
import pinoHttp from "pino-http";
import { randomUUID as randomUUID2 } from "crypto";
import { createStream } from "rotating-file-stream";
var buildConsoleStream, buildFileStream, streamEntries, consoleStream, fileStream, destination, logger, createLogger, paymentTraceLogger, smsTraceLogger, httpTraceLogger, logPaymentTrace, logSmsTrace, logHttpTrace, httpLogger;
var init_logger = __esm({
  "server/logger.ts"() {
    "use strict";
    init_config();
    buildConsoleStream = () => {
      if (config.logging.pretty) {
        return pino.transport({
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            singleLine: false
          }
        });
      }
      return process.stdout;
    };
    buildFileStream = () => {
      if (!config.logging.file.enabled) {
        return null;
      }
      const filePath = config.logging.file.path;
      const directory = path2.dirname(filePath);
      fs2.mkdirSync(directory, { recursive: true });
      const baseName = path2.basename(filePath);
      const rotationStream = createStream(baseName, {
        path: directory,
        size: `${config.logging.file.maxSizeMB}M`,
        interval: config.logging.file.interval,
        maxFiles: config.logging.file.maxFiles,
        compress: "gzip"
      });
      rotationStream.on("error", (error) => {
        console.error("[logging] rotating stream error", error);
      });
      rotationStream.on("open", () => {
        console.info("[logging] file stream opened", filePath);
      });
      return rotationStream;
    };
    streamEntries = [];
    consoleStream = buildConsoleStream();
    if (consoleStream) {
      streamEntries.push({ level: config.logging.level, stream: consoleStream });
    }
    fileStream = buildFileStream();
    if (fileStream) {
      console.info("[logging] file logging enabled", config.logging.file.path);
      streamEntries.push({ level: config.logging.level, stream: fileStream });
    } else if (config.logging.file.enabled) {
      console.warn("[logging] file logging was enabled but stream could not be created", {
        path: config.logging.file.path
      });
    }
    destination = streamEntries.length > 1 ? multistream(streamEntries) : streamEntries[0]?.stream ?? process.stdout;
    logger = pino(
      {
        level: config.logging.level
      },
      destination
    );
    createLogger = (module, bindings) => logger.child({
      module,
      ...bindings
    });
    paymentTraceLogger = createLogger("payments");
    smsTraceLogger = createLogger("sms");
    httpTraceLogger = createLogger("http-trace");
    logPaymentTrace = (message, bindings) => {
      if (!config.logging.trace.payments) {
        return;
      }
      if (bindings) {
        paymentTraceLogger.info(bindings, message);
      } else {
        paymentTraceLogger.info(message);
      }
    };
    logSmsTrace = (message, bindings) => {
      if (!config.logging.trace.sms) {
        return;
      }
      if (bindings) {
        smsTraceLogger.info(bindings, message);
      } else {
        smsTraceLogger.info(message);
      }
    };
    logHttpTrace = (message, bindings) => {
      if (!config.logging.trace.http) {
        return;
      }
      if (bindings) {
        httpTraceLogger.info(bindings, message);
      } else {
        httpTraceLogger.info(message);
      }
    };
    httpLogger = pinoHttp({
      logger,
      genReqId: (req, res) => {
        const headerName = "x-request-id";
        const existingId = req.headers[headerName] || req.headers[headerName.toUpperCase()];
        const id = existingId || randomUUID2();
        res.setHeader(headerName, id);
        return id;
      },
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) {
          return "error";
        }
        if (res.statusCode >= 400) {
          return "warn";
        }
        return "info";
      }
    });
  }
});

// server/himkosh/config.ts
var config_exports = {};
__export(config_exports, {
  getHimKoshConfig: () => getHimKoshConfig,
  himkoshConfig: () => himkoshConfig,
  resolveKeyFilePath: () => resolveKeyFilePath,
  validateHimKoshConfig: () => validateHimKoshConfig
});
import fs3 from "fs";
import path3 from "path";
import { fileURLToPath } from "url";
function resolveKeyFilePath(explicitPath) {
  const candidates = [
    explicitPath,
    config.himkosh.keyFilePath,
    path3.resolve(process.cwd(), "server/himkosh/echallan.key"),
    path3.resolve(process.cwd(), "dist/himkosh/echallan.key"),
    path3.resolve(process.cwd(), "dist/echallan.key"),
    path3.join(__dirname, "echallan.key")
  ].filter((candidate) => Boolean(candidate));
  for (const candidate of candidates) {
    try {
      if (fs3.existsSync(candidate)) {
        return candidate;
      }
    } catch {
    }
  }
  return path3.join(__dirname, "echallan.key");
}
function validateHimKoshConfig() {
  const requiredFields = [
    "merchantCode",
    "deptId",
    "serviceCode",
    "ddo"
  ];
  const missingFields = [];
  for (const field of requiredFields) {
    if (!himkoshConfig[field]) {
      missingFields.push(field);
    }
  }
  if (!himkoshConfig.heads.registrationFee) {
    missingFields.push("heads.registrationFee");
  }
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}
function getHimKoshConfig() {
  const config2 = validateHimKoshConfig();
  himkoshLog.info("Validation result", {
    valid: config2.valid,
    missingFields: config2.missingFields,
    merchantCode: !!himkoshConfig.merchantCode,
    deptId: !!himkoshConfig.deptId,
    serviceCode: !!himkoshConfig.serviceCode,
    ddo: !!himkoshConfig.ddo,
    head: !!himkoshConfig.heads.registrationFee,
    secondaryHead: !!himkoshConfig.heads.secondaryHead
  });
  if (!config2.valid) {
    himkoshLog.warn("HimKosh configuration incomplete", { missingFields: config2.missingFields });
    himkoshLog.warn("Using placeholder values for development/testing");
    return {
      ...himkoshConfig,
      merchantCode: himkoshConfig.merchantCode || "HIMKOSH228",
      deptId: himkoshConfig.deptId || "228",
      serviceCode: himkoshConfig.serviceCode || "TSM",
      ddo: himkoshConfig.ddo || "SML10-001",
      heads: {
        head1: himkoshConfig.heads.registrationFee || "0230-00-104-01",
        registrationFee: himkoshConfig.heads.registrationFee || "0230-00-104-01",
        secondaryHead: himkoshConfig.heads.secondaryHead,
        secondaryHeadAmount: himkoshConfig.heads.secondaryHeadAmount
      },
      testAmount: himkoshConfig.testAmount,
      isConfigured: true,
      configStatus: "placeholder"
    };
  }
  himkoshLog.info("All credentials configured - production mode enabled");
  return {
    ...himkoshConfig,
    heads: {
      ...himkoshConfig.heads,
      head1: himkoshConfig.heads.registrationFee
    },
    isConfigured: true,
    configStatus: "production"
  };
}
var __filename, __dirname, defaultEndpoints, himkoshLog, himkoshConfig;
var init_config2 = __esm({
  "server/himkosh/config.ts"() {
    "use strict";
    init_config();
    init_logger();
    __filename = fileURLToPath(import.meta.url);
    __dirname = path3.dirname(__filename);
    defaultEndpoints = {
      paymentUrl: "https://himkosh.hp.nic.in/echallan/WebPages/wrfApplicationRequest.aspx",
      verificationUrl: "https://himkosh.hp.nic.in/eChallan/webpages/AppVerification.aspx",
      challanPrintUrl: "https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx",
      searchUrl: "https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx"
    };
    himkoshLog = logger.child({ module: "himkosh-config" });
    himkoshConfig = {
      // CTP API Endpoints
      paymentUrl: config.himkosh.paymentUrl || defaultEndpoints.paymentUrl,
      verificationUrl: config.himkosh.verificationUrl || defaultEndpoints.verificationUrl,
      challanPrintUrl: config.himkosh.challanPrintUrl || defaultEndpoints.challanPrintUrl,
      searchChallanUrl: config.himkosh.searchUrl || defaultEndpoints.searchUrl,
      // Merchant Configuration (from CTP team)
      merchantCode: config.himkosh.merchantCode || "",
      deptId: config.himkosh.deptId || "",
      serviceCode: config.himkosh.serviceCode || "",
      ddo: config.himkosh.ddo || "",
      // Head of Account Codes (Budget heads)
      heads: {
        registrationFee: config.himkosh.head || "",
        secondaryHead: config.himkosh.secondaryHead,
        secondaryHeadAmount: config.himkosh.secondaryHeadAmount
      },
      // Return URL for payment callback
      returnUrl: config.himkosh.returnUrl || "https://hptourism.osipl.dev/api/himkosh/callback",
      // Key file path (will be provided by CTP team)
      keyFilePath: resolveKeyFilePath(config.himkosh.keyFilePath),
      // Test amount configuration
      testAmount: config.himkosh.testAmount || 1
    };
  }
});

// server/routes/core/middleware.ts
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    routeLog.warn(`[auth] ${req.method} ${req.path} missing session`, {
      sid: req.sessionID,
      cookie: req.headers.cookie
    });
    return res.status(401).json({ message: "Authentication required" });
  }
  routeLog.info(`[auth] ${req.method} ${req.path} user=${req.session.userId}`);
  next();
}
function requireRole(...roles) {
  const allowedRoles = roles.includes("super_admin") ? roles : [...roles, "super_admin"];
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const user = await storage.getUser(req.session.userId);
    const normalizedRole = user?.role?.trim();
    const hasRole = !!normalizedRole && allowedRoles.includes(normalizedRole);
    routeLog.info(
      `[auth] ${req.method} ${req.path} user=${user?.id ?? "unknown"} role=${normalizedRole ?? "none"} allowed=${allowedRoles.join(",")}`
    );
    if (!user || !hasRole) {
      routeLog.warn(
        `[auth] Role check failed for user=${user?.id ?? "unknown"} role=${user?.role ?? "none"} required=${allowedRoles.join(",")}`
      );
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
var routeLog;
var init_middleware = __esm({
  "server/routes/core/middleware.ts"() {
    "use strict";
    init_storage();
    init_logger();
    routeLog = logger.child({ module: "routes" });
  }
});

// server/himkosh/ddo.ts
var ddo_exports = {};
__export(ddo_exports, {
  fetchAllDdoCodes: () => fetchAllDdoCodes,
  resolveDistrictDdo: () => resolveDistrictDdo
});
import { eq as eq6 } from "drizzle-orm";
var normalizeDistrictForMatch2, resolveDistrictDdo, fetchAllDdoCodes;
var init_ddo = __esm({
  "server/himkosh/ddo.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_districtRouting();
    normalizeDistrictForMatch2 = (value) => {
      if (!value) {
        return [];
      }
      const cleaned = value.toLowerCase().replace(/&/g, " and ").replace(
        /\b(division|sub-division|subdivision|hq|office|district|development|tourism|ddo|dto|dt|section|unit|range|circle|zone|serving|for|the|at|and)\b/g,
        " "
      ).replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
      if (!cleaned) {
        return [];
      }
      const tokens = cleaned.split(" ").map((token) => token.trim()).filter((token) => token.length > 2);
      return Array.from(new Set(tokens));
    };
    resolveDistrictDdo = async (district, tehsil) => {
      if (!district) {
        return void 0;
      }
      const routedDistrict = deriveDistrictRoutingLabel(district, tehsil) || district;
      const [exact] = await db.select().from(ddoCodes).where(eq6(ddoCodes.district, routedDistrict)).limit(1);
      if (exact) {
        return exact;
      }
      const allCodes = await db.select().from(ddoCodes);
      const districtTokens = normalizeDistrictForMatch2(routedDistrict);
      if (!districtTokens.length) {
        return void 0;
      }
      return allCodes.find((code) => {
        const codeTokens = normalizeDistrictForMatch2(code.district);
        return codeTokens.some((token) => districtTokens.includes(token));
      });
    };
    fetchAllDdoCodes = async () => {
      const codes = await db.select({
        id: ddoCodes.id,
        district: ddoCodes.district,
        ddoCode: ddoCodes.ddoCode,
        ddoDescription: ddoCodes.ddoDescription,
        treasuryCode: ddoCodes.treasuryCode,
        isActive: ddoCodes.isActive,
        updatedAt: ddoCodes.updatedAt
      }).from(ddoCodes).orderBy(ddoCodes.district);
      return codes;
    };
  }
});

// server/services/systemSettings.ts
var systemSettings_exports = {};
__export(systemSettings_exports, {
  getPaymentWorkflow: () => getPaymentWorkflow,
  getPaymentWorkflowConfig: () => getPaymentWorkflowConfig,
  getSystemSettingRecord: () => getSystemSettingRecord,
  getUpfrontSubmitMode: () => getUpfrontSubmitMode,
  isPaymentAlreadyCompleted: () => isPaymentAlreadyCompleted
});
import { eq as eq7 } from "drizzle-orm";
async function getSystemSettingRecord(key) {
  const [record] = await db.select().from(systemSettings).where(eq7(systemSettings.settingKey, key)).limit(1);
  return record ?? null;
}
async function getPaymentWorkflow() {
  const record = await getSystemSettingRecord(PAYMENT_WORKFLOW_SETTING_KEY);
  const workflow = record?.settingValue?.workflow;
  return workflow === "upfront" ? "upfront" : "on_approval";
}
async function getUpfrontSubmitMode() {
  const record = await getSystemSettingRecord(PAYMENT_WORKFLOW_SETTING_KEY);
  const submitMode = record?.settingValue?.upfrontSubmitMode;
  return submitMode === "manual" ? "manual" : "auto";
}
async function getPaymentWorkflowConfig() {
  const record = await getSystemSettingRecord(PAYMENT_WORKFLOW_SETTING_KEY);
  const settingValue = record?.settingValue;
  return {
    workflow: settingValue?.workflow === "upfront" ? "upfront" : "on_approval",
    upfrontSubmitMode: settingValue?.upfrontSubmitMode === "manual" ? "manual" : "auto"
  };
}
function isPaymentAlreadyCompleted(paymentStatus) {
  return paymentStatus === "paid" || paymentStatus === "completed";
}
var PAYMENT_WORKFLOW_SETTING_KEY;
var init_systemSettings = __esm({
  "server/services/systemSettings.ts"() {
    "use strict";
    init_db();
    init_schema();
    PAYMENT_WORKFLOW_SETTING_KEY = "payment_workflow";
  }
});

// server/services/communications.ts
import net from "node:net";
import { Buffer as Buffer2 } from "node:buffer";
import crypto4 from "node:crypto";
var DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_BODY, DEFAULT_SMS_BODY, CRLF, normalizeLineEndings, readSmtpResponse, sendSmtpCommand, sendTestEmail, sendTestSms, sendNicV2Sms, sendTwilioSms;
var init_communications = __esm({
  "server/services/communications.ts"() {
    "use strict";
    init_logger();
    DEFAULT_EMAIL_SUBJECT = "HP Tourism eServices \u2013 Test Email";
    DEFAULT_EMAIL_BODY = "This is a test email from the HP Tourism eServices Super Admin console.";
    DEFAULT_SMS_BODY = "{{OTP}} is your OTP for Himachal Tourism e-services portal login. - HP Tourism E-services";
    CRLF = "\r\n";
    normalizeLineEndings = (text2) => text2.replace(/\r?\n/g, CRLF).replace(/\n\./g, "\n..");
    readSmtpResponse = (socket, timeoutMs = 15e3) => {
      return new Promise((resolve, reject) => {
        let buffer = "";
        const lines = [];
        const cleanup = () => {
          socket.off("data", onData);
          socket.off("error", onError);
          socket.off("timeout", onTimeout);
        };
        const onError = (err) => {
          cleanup();
          reject(err);
        };
        const onTimeout = () => {
          cleanup();
          reject(new Error("SMTP connection timed out"));
        };
        const onData = (chunk) => {
          buffer += chunk.toString();
          while (true) {
            const idx = buffer.indexOf(CRLF);
            if (idx === -1) break;
            const line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + CRLF.length);
            lines.push(line);
            if (/^\d{3} /.test(line)) {
              cleanup();
              const code = parseInt(line.slice(0, 3), 10);
              resolve({ code, message: lines.join("\n") });
              return;
            }
          }
        };
        socket.once("error", onError);
        socket.once("timeout", onTimeout);
        socket.on("data", onData);
        socket.setTimeout(timeoutMs);
      });
    };
    sendSmtpCommand = async (socket, command, expectedCodes, log21) => {
      log21.push(`> ${command}`);
      socket.write(`${command}${CRLF}`);
      const response = await readSmtpResponse(socket);
      log21.push(`< ${response.message}`);
      if (!expectedCodes.includes(response.code)) {
        throw new Error(`SMTP command "${command}" failed with ${response.code}`);
      }
    };
    sendTestEmail = async (config2, payload) => {
      if (!config2.host || !config2.port || !config2.fromEmail) {
        throw new Error("SMTP configuration incomplete");
      }
      const log21 = [];
      const socket = net.createConnection({
        host: config2.host,
        port: Number(config2.port) || 25
      });
      try {
        log21.push(`Connecting to ${config2.host}:${config2.port}`);
        const greeting = await readSmtpResponse(socket);
        log21.push(`< ${greeting.message}`);
        if (greeting.code !== 220) {
          throw new Error(`SMTP greeting failed with ${greeting.code}`);
        }
        await sendSmtpCommand(socket, `EHLO hp-tourism-portal`, [250], log21);
        if (config2.username && config2.password) {
          await sendSmtpCommand(socket, "AUTH LOGIN", [334], log21);
          await sendSmtpCommand(
            socket,
            Buffer2.from(config2.username).toString("base64"),
            [334],
            log21
          );
          await sendSmtpCommand(
            socket,
            Buffer2.from(config2.password).toString("base64"),
            [235],
            log21
          );
        }
        const fromAddress = config2.fromEmail;
        await sendSmtpCommand(socket, `MAIL FROM:<${fromAddress}>`, [250], log21);
        await sendSmtpCommand(socket, `RCPT TO:<${payload.to}>`, [250, 251], log21);
        await sendSmtpCommand(socket, "DATA", [354], log21);
        const subject = payload.subject || DEFAULT_EMAIL_SUBJECT;
        const body = normalizeLineEndings(payload.body || DEFAULT_EMAIL_BODY);
        const message = [
          `From: ${fromAddress}`,
          `To: ${payload.to}`,
          `Subject: ${subject}`,
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=UTF-8",
          "",
          body,
          "."
        ].join(CRLF);
        socket.write(`${message}${CRLF}`);
        const dataResponse = await readSmtpResponse(socket);
        log21.push(`< ${dataResponse.message}`);
        if (dataResponse.code !== 250) {
          throw new Error(`SMTP DATA failed with ${dataResponse.code}`);
        }
        await sendSmtpCommand(socket, "QUIT", [221], log21);
        return { log: log21 };
      } finally {
        socket.end();
      }
    };
    sendTestSms = async (config2, payload) => {
      const debugParams = {
        username: config2.username,
        senderId: config2.senderId,
        departmentKeyPreview: config2.departmentKey ? `${config2.departmentKey.slice(0, 4)}\u2026` : null,
        templateId: config2.templateId,
        postUrl: config2.postUrl,
        hasPassword: Boolean(config2.password)
      };
      if (!config2.username || !config2.password || !config2.senderId || !config2.departmentKey || !config2.templateId || !config2.postUrl) {
        throw new Error("SMS configuration incomplete");
      }
      const params = new URLSearchParams();
      params.set("username", config2.username);
      const hashedPassword = crypto4.createHash("sha1").update(config2.password).digest("hex");
      const hashKey = crypto4.createHash("sha512").update(`${config2.username}${config2.senderId}${payload.message.trim()}${config2.departmentKey}`).digest("hex");
      params.set("password", hashedPassword);
      params.set("senderid", config2.senderId);
      params.set("key", hashKey);
      params.set("templateid", config2.templateId);
      params.set("TemplateId", config2.templateId);
      params.set("tempid", config2.templateId);
      params.set("dlttemplateid", config2.templateId);
      params.set("dlt_template_id", config2.templateId);
      params.set("DLTTemplateId", config2.templateId);
      params.set("content", payload.message);
      params.set("mobileno", payload.mobile);
      params.set("smsservicetype", "singlemsg");
      const previewParams = new URLSearchParams(params.toString());
      previewParams.set("password", "***");
      logSmsTrace("[nic-sms] request", {
        ...debugParams,
        payload: previewParams.toString()
      });
      const response = await fetch(config2.postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      const text2 = await response.text();
      logSmsTrace("[nic-sms] response", {
        status: response.status,
        ok: response.ok,
        bodyPreview: text2?.slice(0, 200)
      });
      return {
        status: response.status,
        ok: response.ok,
        body: text2
      };
    };
    sendNicV2Sms = async (config2, payload) => {
      if (!config2.username || !config2.password || !config2.senderId || !config2.key || !config2.templateId || !config2.postUrl) {
        throw new Error("NIC V2 configuration incomplete");
      }
      const params = new URLSearchParams();
      params.set("mobileno", payload.mobile);
      params.set("senderid", config2.senderId);
      params.set("content", payload.message);
      params.set("smsservicetype", "singlemsg");
      const hashedPassword = crypto4.createHash("sha1").update(config2.password).digest("hex");
      const hashKey = crypto4.createHash("sha512").update(`${config2.username}${config2.senderId}${payload.message.trim()}${config2.key}`).digest("hex");
      params.set("username", config2.username);
      params.set("password", hashedPassword);
      params.set("key", hashKey);
      params.set("templateid", config2.templateId);
      logSmsTrace("[nic-sms-v2] request", {
        senderId: config2.senderId,
        templateId: config2.templateId,
        postUrl: config2.postUrl
      });
      const response = await fetch(config2.postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      const text2 = await response.text();
      logSmsTrace("[nic-sms-v2] response", {
        status: response.status,
        ok: response.ok,
        bodyPreview: text2?.slice(0, 200)
      });
      return {
        status: response.status,
        ok: response.ok,
        body: text2
      };
    };
    sendTwilioSms = async (config2, payload) => {
      if (!config2.accountSid || !config2.authToken) {
        throw new Error("Twilio configuration incomplete");
      }
      if (!config2.fromNumber && !config2.messagingServiceSid) {
        throw new Error("Provide a Twilio From Number or Messaging Service SID");
      }
      const params = new URLSearchParams();
      const normalizedMobile = (() => {
        const digits = payload.mobile.replace(/\s+/g, "");
        if (digits.startsWith("+")) {
          return digits;
        }
        if (/^[0-9]{10}$/.test(digits)) {
          return `+91${digits}`;
        }
        return digits;
      })();
      params.set("To", normalizedMobile);
      params.set("Body", payload.message);
      if (config2.messagingServiceSid) {
        params.set("MessagingServiceSid", config2.messagingServiceSid);
      } else if (config2.fromNumber) {
        params.set("From", config2.fromNumber);
      }
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${config2.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer2.from(`${config2.accountSid}:${config2.authToken}`).toString("base64")}`
          },
          body: params
        }
      );
      const text2 = await response.text();
      return {
        status: response.status,
        ok: response.ok,
        body: text2 || (response.ok ? "Message queued via Twilio" : "")
      };
    };
  }
});

// server/services/notifications.ts
import { format } from "date-fns";
async function createInAppNotification({
  userId,
  applicationId,
  type,
  title,
  message
}) {
  try {
    await db.insert(notifications).values({
      userId,
      applicationId: applicationId ?? null,
      type,
      title,
      message,
      channels: { inapp: true }
    });
  } catch (error) {
    notificationLog.error("[notifications] Failed to create notification", {
      userId,
      applicationId,
      type,
      error
    });
  }
}
var notificationLog, EMAIL_GATEWAY_SETTING_KEY, SMS_GATEWAY_SETTING_KEY, NOTIFICATION_RULES_SETTING_KEY, emailProviders, notificationEventDefinitions, notificationDefinitionMap, extractLegacyEmailProfile, getEmailProfileFromValue, sanitizeEmailGateway, sanitizeSmsGateway, formatGatewaySetting, buildTemplateVariables, renderTemplate, deliverNotificationSms, deliverNotificationEmail, triggerNotification, queueNotification, resolveNotificationChannelState;
var init_notifications = __esm({
  "server/services/notifications.ts"() {
    "use strict";
    init_schema();
    init_communications();
    init_systemSettings();
    init_storage();
    init_db();
    init_logger();
    notificationLog = logger.child({ module: "notifications" });
    EMAIL_GATEWAY_SETTING_KEY = "comm_email_gateway";
    SMS_GATEWAY_SETTING_KEY = "comm_sms_gateway";
    NOTIFICATION_RULES_SETTING_KEY = "comm_notification_rules";
    emailProviders = ["custom", "nic", "sendgrid"];
    notificationEventDefinitions = [
      {
        id: "otp",
        label: "OTP verification",
        description: "Sent when an owner requests an OTP to access or confirm submissions.",
        defaultSmsTemplate: "{{OTP}} is your OTP for Himachal Tourism e-services portal login. - HP Tourism E-services",
        defaultEmailSubject: "Himachal Tourism OTP",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\n{{OTP}} is your one-time password for Himachal Tourism eServices. It expires in 10 minutes.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "OTP"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "password_reset",
        label: "Password reset",
        description: "Delivers the one-time code owners need to reset their account password.",
        defaultSmsTemplate: "{{OTP}} is your password reset code for Himachal Tourism eServices. Enter it in the portal within 10 minutes to set a new password.",
        defaultEmailSubject: "Password reset code",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nUse the code {{OTP}} to reset your Himachal Tourism eServices password. This code expires in 10 minutes. If you did not request a reset, you can ignore this email.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "OTP"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "application_submitted",
        label: "Application submitted",
        description: "Confirms that an owner successfully submitted a homestay application.",
        defaultSmsTemplate: "Your Himachal Tourism application {{APPLICATION_ID}} was submitted successfully. We will update you on the next steps.",
        defaultEmailSubject: "Application {{APPLICATION_ID}} submitted",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nWe received your homestay application {{APPLICATION_ID}}. We will notify you as it moves through scrutiny and inspection.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID"]
      },
      {
        id: "forwarded_to_dtdo",
        label: "Forwarded to DTDO",
        description: "Notifies the owner that scrutiny is complete and the case moved to DTDO.",
        defaultSmsTemplate: "Application {{APPLICATION_ID}} has moved to DTDO review for site inspection. Keep your documents handy.",
        defaultEmailSubject: "Application {{APPLICATION_ID}} forwarded for DTDO review",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nYour application {{APPLICATION_ID}} cleared scrutiny and has been forwarded to the DTDO for field inspection. Please stay available for coordination.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID"]
      },
      {
        id: "inspection_scheduled",
        label: "Inspection scheduled",
        description: "Alerts the owner about the scheduled inspection date.",
        defaultSmsTemplate: "DTDO scheduled a site inspection for application {{APPLICATION_ID}} on {{INSPECTION_DATE}}. Please ensure availability.",
        defaultEmailSubject: "Site inspection scheduled \u2013 Application {{APPLICATION_ID}}",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nA site inspection for application {{APPLICATION_ID}} is scheduled on {{INSPECTION_DATE}}. Kindly keep the property accessible and documents ready for verification.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "INSPECTION_DATE"]
      },
      {
        id: "verified_for_payment",
        label: "Verified for payment",
        description: "Informs the owner that the application is cleared for payment and certificate issue.",
        defaultSmsTemplate: "Application {{APPLICATION_ID}} is verified for payment. Log in to complete the fee and download your certificate after approval.",
        defaultEmailSubject: "Application {{APPLICATION_ID}} verified for payment",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nYour application {{APPLICATION_ID}} has been verified for payment. Please sign in to complete the fee so we can issue the certificate.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID"]
      },
      {
        id: "da_send_back",
        label: "DA send-back",
        description: "Alerts the owner that the Dealing Assistant sent the application back for corrections.",
        defaultSmsTemplate: "Application {{APPLICATION_ID}} needs corrections. DA remarks: {{REMARKS}}. Please update and resubmit.",
        defaultEmailSubject: "Corrections requested \u2013 Application {{APPLICATION_ID}}",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nOur Dealing Assistant reviewed application {{APPLICATION_ID}} and requested corrections.\n\nRemarks:\n{{REMARKS}}\n\nPlease sign in, update the form, and resubmit at the earliest.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "REMARKS"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "dtdo_revert",
        label: "DTDO revert",
        description: "Notifies the owner that DTDO returned the application for additional corrections after inspection.",
        defaultSmsTemplate: "DTDO returned application {{APPLICATION_ID}} for updates. Remarks: {{REMARKS}}. Please review and resubmit.",
        defaultEmailSubject: "DTDO corrections \u2013 Application {{APPLICATION_ID}}",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nDuring district review we found items that need attention for application {{APPLICATION_ID}}.\n\nRemarks:\n{{REMARKS}}\n\nPlease update the application and resubmit so we can continue processing.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "REMARKS"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "dtdo_objection",
        label: "DTDO objection raised",
        description: "Informs the owner that DTDO raised objections after the inspection report.",
        defaultSmsTemplate: "Inspection objections raised for application {{APPLICATION_ID}}. Remarks: {{REMARKS}}. Update the application to continue.",
        defaultEmailSubject: "Inspection objections \u2013 Application {{APPLICATION_ID}}",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nAfter reviewing the inspection report for application {{APPLICATION_ID}}, the DTDO raised the following objections:\n\n{{REMARKS}}\n\nPlease sign in, address the feedback, and resubmit. Ignoring objections may lead to rejection.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "REMARKS"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "application_approved",
        label: "Application Approved",
        description: "Sent when an application is finally approved and certificate (or cancellation) is issued.",
        defaultSmsTemplate: "Application {{APPLICATION_ID}} has been APPROVED. {{REMARKS}} - HP Tourism",
        defaultEmailSubject: "Application {{APPLICATION_ID}} Approved",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nYour application {{APPLICATION_ID}} has been APPROVED.\n\n{{REMARKS}}\n\nYou can now download your certificate (if applicable) from the portal.\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "REMARKS"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      },
      {
        id: "application_rejected",
        label: "Application Rejected",
        description: "Sent when an application is rejected.",
        defaultSmsTemplate: "Application {{APPLICATION_ID}} has been REJECTED. Reason: {{REMARKS}} - HP Tourism",
        defaultEmailSubject: "Application {{APPLICATION_ID}} Rejected",
        defaultEmailBody: "Hello {{OWNER_NAME}},\n\nYour application {{APPLICATION_ID}} has been REJECTED.\n\nReason:\n{{REMARKS}}\n\n- Tourism Department",
        placeholders: ["OWNER_NAME", "APPLICATION_ID", "REMARKS"],
        defaultSmsEnabled: true,
        defaultEmailEnabled: true
      }
    ];
    notificationDefinitionMap = new Map(
      notificationEventDefinitions.map((definition) => [definition.id, definition])
    );
    extractLegacyEmailProfile = (value) => {
      if (!value) return void 0;
      if (value.custom || value.nic || value.sendgrid) {
        return void 0;
      }
      if (!value.host && !value.fromEmail && !value.username && !value.password) {
        return void 0;
      }
      return {
        host: value.host,
        port: value.port,
        username: value.username,
        password: value.password,
        fromEmail: value.fromEmail
      };
    };
    getEmailProfileFromValue = (value, provider) => {
      const legacy = extractLegacyEmailProfile(value);
      if (provider === "custom") {
        return value.custom ?? legacy;
      }
      if (provider === "nic") {
        return value.nic ?? (legacy && value.provider === "nic" ? legacy : void 0);
      }
      if (provider === "sendgrid") {
        return value.sendgrid ?? (legacy && value.provider === "sendgrid" ? legacy : void 0);
      }
      return legacy;
    };
    sanitizeEmailGateway = (value) => {
      if (!value) return null;
      const provider = value.provider ?? "custom";
      const legacy = extractLegacyEmailProfile(value);
      const mapProfile = (profile) => {
        if (!profile) return void 0;
        return {
          host: profile.host ?? "",
          port: Number(profile.port) || 25,
          username: profile.username ?? "",
          fromEmail: profile.fromEmail ?? "",
          passwordSet: Boolean(profile.password)
        };
      };
      return {
        provider,
        custom: mapProfile(value.custom ?? (provider === "custom" ? legacy : void 0) ?? legacy),
        nic: mapProfile(value.nic),
        sendgrid: mapProfile(value.sendgrid)
      };
    };
    sanitizeSmsGateway = (value) => {
      if (!value) return null;
      const provider = value.provider ?? "nic";
      const nic = value.nic ? {
        username: value.nic.username,
        senderId: value.nic.senderId,
        departmentKey: value.nic.departmentKey,
        templateId: value.nic.templateId,
        postUrl: value.nic.postUrl,
        passwordSet: Boolean(value.nic.password)
      } : void 0;
      const nicV2 = value.nicV2 ? {
        username: value.nicV2.username,
        senderId: value.nicV2.senderId,
        templateId: value.nicV2.templateId,
        key: value.nicV2.key,
        postUrl: value.nicV2.postUrl,
        passwordSet: Boolean(value.nicV2.password)
      } : void 0;
      const twilio = value.twilio ? {
        accountSid: value.twilio.accountSid,
        fromNumber: value.twilio.fromNumber,
        messagingServiceSid: value.twilio.messagingServiceSid,
        authTokenSet: Boolean(value.twilio.authToken)
      } : void 0;
      return {
        provider,
        nic,
        nicV2,
        twilio
      };
    };
    formatGatewaySetting = (record, sanitizer) => {
      if (!record) {
        return null;
      }
      const sanitized = sanitizer(record.settingValue);
      if (!sanitized) {
        return null;
      }
      return {
        ...sanitized,
        updatedAt: record.updatedAt,
        updatedBy: record.updatedBy
      };
    };
    buildTemplateVariables = ({
      application,
      owner,
      recipientName,
      otp,
      extras
    }) => {
      const inspectionDate = extras?.INSPECTION_DATE ?? (application?.siteInspectionScheduledDate ? format(new Date(application.siteInspectionScheduledDate), "dd MMM yyyy") : "");
      return {
        APPLICATION_ID: application?.applicationNumber ?? application?.id ?? "",
        OWNER_NAME: recipientName ?? owner?.fullName ?? "",
        OWNER_MOBILE: owner?.mobile ?? "",
        OWNER_EMAIL: owner?.email ?? "",
        STATUS: application?.status ?? "",
        OTP: otp ?? "",
        INSPECTION_DATE: inspectionDate,
        REMARKS: extras?.REMARKS ?? ""
      };
    };
    renderTemplate = (template, variables) => template.replace(/{{\s*([^}]+)\s*}}/g, (_, token) => {
      const key = token.trim().toUpperCase();
      return variables[key] ?? "";
    });
    deliverNotificationSms = async (mobile, message) => {
      try {
        const record = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
        if (!record) {
          notificationLog.warn("[notifications] SMS gateway not configured");
          return;
        }
        const config2 = record.settingValue ?? {};
        const provider = config2.provider ?? "nic";
        if (provider === "twilio") {
          const twilioConfig = config2.twilio;
          if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber && !twilioConfig.messagingServiceSid) {
            notificationLog.warn("[notifications] Twilio SMS settings incomplete");
            return;
          }
          await sendTwilioSms(
            {
              accountSid: twilioConfig.accountSid,
              authToken: twilioConfig.authToken,
              fromNumber: twilioConfig.fromNumber,
              messagingServiceSid: twilioConfig.messagingServiceSid
            },
            { mobile, message }
          );
          return;
        }
        if (provider === "nic_v2") {
          const nicV2Config = config2.nicV2;
          if (!nicV2Config || !nicV2Config.username || !nicV2Config.password || !nicV2Config.senderId || !nicV2Config.key || !nicV2Config.templateId || !nicV2Config.postUrl) {
            notificationLog.warn("[notifications] NIC V2 SMS settings incomplete");
            return;
          }
          await sendNicV2Sms(
            {
              username: nicV2Config.username,
              password: nicV2Config.password,
              senderId: nicV2Config.senderId,
              templateId: nicV2Config.templateId,
              key: nicV2Config.key,
              postUrl: nicV2Config.postUrl
            },
            { mobile, message }
          );
          return;
        }
        const nicConfig = config2.nic;
        if (!nicConfig || !nicConfig.username || !nicConfig.password || !nicConfig.senderId || !nicConfig.departmentKey || !nicConfig.templateId || !nicConfig.postUrl) {
          notificationLog.warn("[notifications] NIC SMS settings incomplete");
          return;
        }
        await sendTestSms(
          {
            username: nicConfig.username,
            password: nicConfig.password,
            senderId: nicConfig.senderId,
            departmentKey: nicConfig.departmentKey,
            templateId: nicConfig.templateId,
            postUrl: nicConfig.postUrl
          },
          { mobile, message }
        );
      } catch (error) {
        notificationLog.error("[notifications] Failed to send SMS", error);
      }
    };
    deliverNotificationEmail = async (to, subject, body) => {
      try {
        const record = await getSystemSettingRecord(EMAIL_GATEWAY_SETTING_KEY);
        if (!record) {
          notificationLog.warn("[notifications] SMTP gateway not configured");
          return;
        }
        const value = record.settingValue ?? {};
        const provider = value.provider ?? "custom";
        const profile = getEmailProfileFromValue(value, provider) ?? extractLegacyEmailProfile(value);
        if (!profile?.host || !profile?.fromEmail || !profile?.password) {
          notificationLog.warn("[notifications] SMTP settings incomplete");
          return;
        }
        await sendTestEmail(
          {
            host: profile.host,
            port: Number(profile.port) || 25,
            username: profile.username,
            password: profile.password,
            fromEmail: profile.fromEmail
          },
          {
            to,
            subject,
            body
          }
        );
      } catch (error) {
        notificationLog.error("[notifications] Failed to send email", error);
      }
    };
    triggerNotification = async (eventId, options = {}) => {
      const definition = notificationDefinitionMap.get(eventId);
      if (!definition) {
        return;
      }
      const record = await getSystemSettingRecord(NOTIFICATION_RULES_SETTING_KEY);
      const value = record?.settingValue ?? void 0;
      const stored = value?.rules?.find((rule) => rule.id === eventId);
      const smsEnabled = stored?.smsEnabled ?? definition.defaultSmsEnabled ?? false;
      const emailEnabled = stored?.emailEnabled ?? definition.defaultEmailEnabled ?? false;
      if (!smsEnabled && !emailEnabled) {
        return;
      }
      let application = options.application ?? null;
      if (!application && options.applicationId) {
        const loadedApplication = await storage.getApplication(options.applicationId);
        application = loadedApplication ?? null;
      }
      let owner = options.owner ?? null;
      if (!owner && application?.userId) {
        const loadedOwner = await storage.getUser(application.userId);
        owner = loadedOwner ?? null;
      }
      const variables = buildTemplateVariables({
        application,
        owner,
        recipientName: options.recipientName,
        otp: options.otp,
        extras: options.extras
      });
      const targetMobile = options.recipientMobile !== void 0 ? options.recipientMobile : owner?.mobile ?? null;
      const targetEmail = options.recipientEmail !== void 0 ? options.recipientEmail : owner?.email ?? null;
      if (smsEnabled && targetMobile) {
        const smsTemplate = stored?.smsTemplate ?? definition.defaultSmsTemplate;
        const smsMessage = renderTemplate(smsTemplate, variables);
        await deliverNotificationSms(targetMobile, smsMessage);
      }
      if (emailEnabled && targetEmail) {
        const emailSubjectTemplate = stored?.emailSubject ?? definition.defaultEmailSubject;
        const emailBodyTemplate = stored?.emailBody ?? definition.defaultEmailBody;
        const emailSubject = renderTemplate(emailSubjectTemplate, variables);
        const emailBody = renderTemplate(emailBodyTemplate, variables);
        await deliverNotificationEmail(targetEmail, emailSubject, emailBody);
      }
    };
    queueNotification = (eventId, options = {}) => {
      triggerNotification(eventId, options).catch((error) => {
        notificationLog.error(`[notifications] Failed to send ${eventId} notification`, error);
      });
    };
    resolveNotificationChannelState = async (eventId) => {
      const definition = notificationDefinitionMap.get(eventId);
      if (!definition) {
        return { smsEnabled: false, emailEnabled: false };
      }
      const record = await getSystemSettingRecord(NOTIFICATION_RULES_SETTING_KEY);
      const value = record?.settingValue ?? void 0;
      const stored = value?.rules?.find((rule) => rule.id === eventId);
      return {
        smsEnabled: stored?.smsEnabled ?? definition.defaultSmsEnabled ?? false,
        emailEnabled: stored?.emailEnabled ?? definition.defaultEmailEnabled ?? false
      };
    };
  }
});

// server/routes/core/multi-service.ts
var multi_service_exports = {};
__export(multi_service_exports, {
  MULTI_SERVICE_HUB_KEY: () => MULTI_SERVICE_HUB_KEY,
  getMultiServiceHubEnabled: () => getMultiServiceHubEnabled,
  setMultiServiceHubEnabled: () => setMultiServiceHubEnabled,
  updateMultiServiceCache: () => updateMultiServiceCache
});
import { eq as eq13 } from "drizzle-orm";
var MULTI_SERVICE_HUB_KEY, SETTING_CACHE_TTL, multiServiceLog, settingCache, updateMultiServiceCache, getMultiServiceHubEnabled, setMultiServiceHubEnabled;
var init_multi_service = __esm({
  "server/routes/core/multi-service.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_logger();
    MULTI_SERVICE_HUB_KEY = "multi_service_hub_enabled";
    SETTING_CACHE_TTL = 5 * 60 * 1e3;
    multiServiceLog = logger.child({ module: "multi-service-settings" });
    settingCache = {
      fetchedAt: 0,
      enabled: false
      // default disabled (homestay-only mode)
    };
    updateMultiServiceCache = (enabled) => {
      settingCache.enabled = enabled;
      settingCache.fetchedAt = Date.now();
    };
    getMultiServiceHubEnabled = async () => {
      const now = Date.now();
      if (now - settingCache.fetchedAt < SETTING_CACHE_TTL) {
        return settingCache.enabled;
      }
      try {
        const [setting] = await db.select().from(systemSettings).where(eq13(systemSettings.settingKey, MULTI_SERVICE_HUB_KEY)).limit(1);
        let enabled = false;
        if (setting?.settingValue !== void 0 && setting?.settingValue !== null) {
          const value = setting.settingValue;
          if (typeof value === "boolean") {
            enabled = value;
          } else if (typeof value === "object" && "enabled" in value) {
            enabled = Boolean(value.enabled);
          }
        }
        updateMultiServiceCache(enabled);
        return enabled;
      } catch (error) {
        multiServiceLog.error("[multi-service] Failed to fetch setting", error);
        return settingCache.enabled;
      }
    };
    setMultiServiceHubEnabled = async (enabled, updatedBy) => {
      try {
        const [existing] = await db.select().from(systemSettings).where(eq13(systemSettings.settingKey, MULTI_SERVICE_HUB_KEY)).limit(1);
        if (existing) {
          await db.update(systemSettings).set({
            settingValue: { enabled },
            updatedAt: /* @__PURE__ */ new Date(),
            updatedBy: updatedBy || null
          }).where(eq13(systemSettings.settingKey, MULTI_SERVICE_HUB_KEY));
        } else {
          await db.insert(systemSettings).values({
            settingKey: MULTI_SERVICE_HUB_KEY,
            settingValue: { enabled },
            updatedBy: updatedBy || null
          });
        }
        updateMultiServiceCache(enabled);
        multiServiceLog.info("[multi-service] Setting updated", { enabled, updatedBy });
      } catch (error) {
        multiServiceLog.error("[multi-service] Failed to update setting", error);
        throw error;
      }
    };
  }
});

// shared/activityTypes.ts
function getAdventureActivityById(id) {
  return ADVENTURE_SPORTS_ACTIVITIES.find((a) => a.id === id);
}
function calculateAdventureSportsFee(activityIds) {
  return activityIds.reduce((total, id) => {
    const activity = getAdventureActivityById(id);
    return total + (activity?.baseFee || 0);
  }, 0);
}
function getMaxInsuranceRequired(activityIds) {
  return Math.max(...activityIds.map((id) => {
    const activity = getAdventureActivityById(id);
    return activity?.insuranceRequired || 0;
  }));
}
var ADVENTURE_SPORTS_ACTIVITIES;
var init_activityTypes = __esm({
  "shared/activityTypes.ts"() {
    "use strict";
    ADVENTURE_SPORTS_ACTIVITIES = [
      {
        id: "trekking_hiking",
        name: "Trekking & Hiking",
        category: "trekking",
        baseFee: 25e3,
        insuranceRequired: 5e6,
        // ₹50 lakh
        requiresCertification: true,
        certificationTypes: ["Basic Mountaineering", "Wilderness First Aid"],
        requiresRescueTeam: true
      },
      {
        id: "river_rafting",
        name: "River Rafting",
        category: "water_adventure",
        baseFee: 5e4,
        insuranceRequired: 1e7,
        // ₹1 crore
        requiresCertification: true,
        certificationTypes: ["River Rafting Guide", "Swift Water Rescue"],
        minAge: 18,
        requiresRescueTeam: true
      },
      {
        id: "paragliding",
        name: "Paragliding",
        category: "air_sports",
        baseFee: 75e3,
        insuranceRequired: 2e7,
        // ₹2 crore
        requiresCertification: true,
        certificationTypes: ["APPI/BHPA Pilot License", "Tandem Pilot Rating"],
        minAge: 18,
        requiresRescueTeam: true
      },
      {
        id: "rock_climbing",
        name: "Rock Climbing & Rappelling",
        category: "mountain_sports",
        baseFee: 3e4,
        insuranceRequired: 75e5,
        // ₹75 lakh
        requiresCertification: true,
        certificationTypes: ["Rock Climbing Instructor", "Rope Access Technician"],
        requiresRescueTeam: true
      },
      {
        id: "skiing_snowboarding",
        name: "Skiing & Snowboarding",
        category: "winter_sports",
        baseFee: 4e4,
        insuranceRequired: 1e7,
        // ₹1 crore
        requiresCertification: true,
        certificationTypes: ["Ski Instructor", "Avalanche Safety"],
        requiresRescueTeam: true
      },
      {
        id: "mountain_biking",
        name: "Mountain Biking",
        category: "cycling",
        baseFee: 2e4,
        insuranceRequired: 5e6,
        // ₹50 lakh
        requiresCertification: true,
        certificationTypes: ["Mountain Bike Guide", "First Aid"],
        requiresRescueTeam: false
      }
    ];
  }
});

// server/routes/adventure-sports.ts
var adventure_sports_exports = {};
__export(adventure_sports_exports, {
  default: () => adventure_sports_default
});
import { Router as Router5 } from "express";
import { eq as eq37 } from "drizzle-orm";
import { z as z11 } from "zod";
var router3, calculateFeeSchema, createApplicationSchema, adventure_sports_default;
var init_adventure_sports = __esm({
  "server/routes/adventure-sports.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_activityTypes();
    init_storage();
    router3 = Router5();
    router3.get("/activities", async (req, res) => {
      try {
        res.json({
          success: true,
          activities: ADVENTURE_SPORTS_ACTIVITIES,
          total: ADVENTURE_SPORTS_ACTIVITIES.length
        });
      } catch (error) {
        console.error("Error fetching adventure activities:", error);
        res.status(500).json({ success: false, error: "Failed to fetch activities" });
      }
    });
    calculateFeeSchema = z11.object({
      activityIds: z11.array(z11.string()).min(1, "At least one activity must be selected")
    });
    router3.post("/calculate-fee", async (req, res) => {
      try {
        const { activityIds } = calculateFeeSchema.parse(req.body);
        const invalidIds = activityIds.filter((id) => !getAdventureActivityById(id));
        if (invalidIds.length > 0) {
          return res.status(400).json({
            success: false,
            error: `Invalid activity IDs: ${invalidIds.join(", ")}`
          });
        }
        const totalFee = calculateAdventureSportsFee(activityIds);
        const minimumInsurance = getMaxInsuranceRequired(activityIds);
        const selectedActivities = activityIds.map((id) => {
          const activity = getAdventureActivityById(id);
          return {
            id: activity.id,
            name: activity.name,
            baseFee: activity.baseFee,
            insuranceRequired: activity.insuranceRequired
          };
        });
        res.json({
          success: true,
          data: {
            selectedActivities,
            totalAnnualFee: totalFee,
            minimumInsuranceRequired: minimumInsurance
          }
        });
      } catch (error) {
        if (error instanceof z11.ZodError) {
          return res.status(400).json({ success: false, error: error.errors });
        }
        console.error("Error calculating fee:", error);
        res.status(500).json({ success: false, error: "Failed to calculate fee" });
      }
    });
    createApplicationSchema = z11.object({
      operatorName: z11.string().optional(),
      adventureSportsData: z11.any().optional(),
      // Allow raw data from frontend for drafts
      activities: z11.array(z11.object({
        activityId: z11.string(),
        activityName: z11.string(),
        category: z11.string(),
        baseFee: z11.number(),
        insuranceRequired: z11.number()
      })).optional(),
      totalAnnualFee: z11.number().optional(),
      minimumInsuranceRequired: z11.number().optional()
    });
    router3.post("/applications", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(401).json({ success: false, error: "User not found" });
        }
        const validData = createApplicationSchema.parse(req.body);
        const operatorName = validData.operatorName || validData.adventureSportsData?.operatorName || "New Application";
        const activities = validData.activities || validData.adventureSportsData?.activities || [];
        const totalAnnualFee = validData.totalAnnualFee || validData.adventureSportsData?.totalAnnualFee || 0;
        const minimumInsuranceRequired = validData.minimumInsuranceRequired || validData.adventureSportsData?.minimumInsuranceRequired || 0;
        const rawData = validData.adventureSportsData || {};
        const appNumber = `ADV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const [application] = await db.insert(homestayApplications).values({
          userId: user.id,
          applicationNumber: appNumber,
          applicationType: "adventure_sports",
          propertyName: operatorName,
          category: "gold",
          // Default category for adventure sports
          locationType: "gp",
          // Will be updated with actual location
          totalRooms: 0,
          // Not applicable for adventure sports
          district: rawData.district || "",
          tehsil: "",
          address: rawData.localOfficeAddress || "",
          pincode: "",
          ownerName: user.fullName,
          ownerGender: "male",
          ownerMobile: user.mobile,
          ownerEmail: user.email || "",
          ownerAadhaar: user.aadhaarNumber || "",
          projectType: "new_property",
          propertyArea: 0,
          // Not applicable
          attachedWashrooms: 0,
          // Not applicable
          adventureSportsData: {
            ...rawData,
            // Store all frontend data
            activities,
            insurancePolicy: {
              policyNumber: "",
              provider: "",
              coverageAmount: minimumInsuranceRequired,
              validFrom: "",
              validUpto: ""
            },
            safetyEquipment: [],
            trainedStaff: [],
            emergencyProtocols: {
              evacuationPlanUploaded: false,
              medicalFacilityTieup: "",
              medicalFacilityDistance: 0,
              rescueTeamAvailable: false,
              emergencyContactNumber: "",
              weatherMonitoringSystem: false
            },
            operatingLocations: [],
            totalAnnualFee,
            minimumInsuranceRequired
          },
          status: "draft",
          currentPage: 1
        }).returning();
        res.json({
          success: true,
          application: {
            id: application.id,
            applicationNumber: application.applicationNumber,
            status: application.status
          }
        });
      } catch (error) {
        if (error instanceof z11.ZodError) {
          return res.status(400).json({ success: false, error: error.errors });
        }
        console.error("Error creating application:", error);
        res.status(500).json({ success: false, error: "Failed to create application" });
      }
    });
    router3.get("/applications/:id", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(401).json({ success: false, error: "User not found" });
        }
        const [application] = await db.select().from(homestayApplications).where(eq37(homestayApplications.id, req.params.id)).limit(1);
        if (!application) {
          return res.status(404).json({ success: false, error: "Application not found" });
        }
        if (application.userId !== user.id && user.role === "property_owner") {
          return res.status(403).json({ success: false, error: "Access denied" });
        }
        res.json({ success: true, application });
      } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ success: false, error: "Failed to fetch application" });
      }
    });
    router3.put("/applications/:id", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(401).json({ success: false, error: "User not found" });
        }
        const [existing] = await db.select().from(homestayApplications).where(eq37(homestayApplications.id, req.params.id)).limit(1);
        if (!existing) {
          return res.status(404).json({ success: false, error: "Application not found" });
        }
        if (existing.userId !== user.id) {
          return res.status(403).json({ success: false, error: "Access denied" });
        }
        if (existing.status !== "draft") {
          return res.status(400).json({ success: false, error: "Can only update draft applications" });
        }
        const [updated] = await db.update(homestayApplications).set({
          ...req.body,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq37(homestayApplications.id, req.params.id)).returning();
        res.json({ success: true, application: updated });
      } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ success: false, error: "Failed to update application" });
      }
    });
    router3.post("/applications/:id/submit", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(401).json({ success: false, error: "User not found" });
        }
        const [existing] = await db.select().from(homestayApplications).where(eq37(homestayApplications.id, req.params.id)).limit(1);
        if (!existing) {
          return res.status(404).json({ success: false, error: "Application not found" });
        }
        if (existing.userId !== user.id) {
          return res.status(403).json({ success: false, error: "Access denied" });
        }
        const [updated] = await db.update(homestayApplications).set({
          status: "submitted",
          updatedAt: /* @__PURE__ */ new Date(),
          submissionDate: /* @__PURE__ */ new Date()
        }).where(eq37(homestayApplications.id, req.params.id)).returning();
        res.json({ success: true, application: updated });
      } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ success: false, error: "Failed to submit application" });
      }
    });
    adventure_sports_default = router3;
  }
});

// server/services/grievanceNotifications.ts
function renderTemplate2(template, variables) {
  return template.replace(/{{\\s*([^}]+)\\s*}}/g, (_, token) => {
    const key = token.trim();
    return variables[key] ?? "";
  });
}
async function sendEmail(to, subject, body) {
  try {
    const record = await getSystemSettingRecord(EMAIL_GATEWAY_SETTING_KEY);
    if (!record) {
      log17.warn("SMTP gateway not configured, skipping email");
      return false;
    }
    const value = record.settingValue ?? {};
    const provider = value.provider ?? "custom";
    const profile = getEmailProfileFromValue(value, provider) ?? extractLegacyEmailProfile(value);
    if (!profile?.host || !profile?.fromEmail || !profile?.password) {
      log17.warn("SMTP settings incomplete, skipping email");
      return false;
    }
    await sendTestEmail(
      {
        host: profile.host,
        port: Number(profile.port) || 25,
        username: profile.username,
        password: profile.password,
        fromEmail: profile.fromEmail
      },
      { to, subject, body }
    );
    log17.info({ to: to.substring(0, 10) + "..." }, "Grievance email sent successfully");
    return true;
  } catch (error) {
    log17.error({ err: error }, "Failed to send grievance email");
    return false;
  }
}
async function sendSmsNotification(mobile, message) {
  try {
    const normalizedMobile = mobile.replace(/^\+91|^91/, "").trim();
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      log17.warn({ mobile: normalizedMobile.slice(-4) }, "Invalid mobile number format");
      return false;
    }
    const record = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
    if (!record) {
      log17.warn("SMS gateway not configured, skipping SMS");
      return false;
    }
    const config2 = record.settingValue ?? {};
    const provider = config2.provider ?? "nic";
    if (provider === "twilio") {
      const twilioConfig = config2.twilio;
      if (!twilioConfig?.accountSid || !twilioConfig?.authToken || !twilioConfig?.fromNumber && !twilioConfig?.messagingServiceSid) {
        log17.warn("Twilio settings incomplete");
        return false;
      }
      await sendTwilioSms(
        {
          accountSid: twilioConfig.accountSid,
          authToken: twilioConfig.authToken,
          fromNumber: twilioConfig.fromNumber,
          messagingServiceSid: twilioConfig.messagingServiceSid
        },
        { mobile: normalizedMobile, message }
      );
    } else if (provider === "nic_v2") {
      const nicV2Config = config2.nicV2;
      if (!nicV2Config?.username || !nicV2Config?.password || !nicV2Config?.senderId || !nicV2Config?.key || !nicV2Config?.templateId || !nicV2Config?.postUrl) {
        log17.warn("NIC V2 settings incomplete");
        return false;
      }
      await sendNicV2Sms(
        {
          username: nicV2Config.username,
          password: nicV2Config.password,
          senderId: nicV2Config.senderId,
          templateId: nicV2Config.templateId,
          key: nicV2Config.key,
          postUrl: nicV2Config.postUrl
        },
        { mobile: normalizedMobile, message }
      );
    } else {
      const nicConfig = config2.nic;
      if (!nicConfig?.username || !nicConfig?.password || !nicConfig?.senderId || !nicConfig?.departmentKey || !nicConfig?.templateId || !nicConfig?.postUrl) {
        log17.warn("NIC settings incomplete");
        return false;
      }
      await sendTestSms(
        {
          username: nicConfig.username,
          password: nicConfig.password,
          senderId: nicConfig.senderId,
          departmentKey: nicConfig.departmentKey,
          templateId: nicConfig.templateId,
          postUrl: nicConfig.postUrl
        },
        { mobile: normalizedMobile, message }
      );
    }
    log17.info({ mobile: normalizedMobile.slice(-4), provider }, "Grievance SMS sent successfully");
    return true;
  } catch (error) {
    log17.error({ err: error }, "Failed to send grievance SMS");
    return false;
  }
}
async function notifyGrievanceCreated(params) {
  const variables = {
    TICKET_NUMBER: params.ticketNumber,
    SUBJECT: params.subject,
    CATEGORY: params.category,
    OWNER_NAME: params.ownerName || "Property Owner"
  };
  const template = TEMPLATES.grievance_created;
  if (params.ownerMobile) {
    const smsMessage = renderTemplate2(template.sms, variables);
    sendSmsNotification(params.ownerMobile, smsMessage).catch(() => {
    });
  }
  if (params.ownerEmail) {
    const emailSubject = renderTemplate2(template.emailSubject, variables);
    const emailBody = renderTemplate2(template.emailBody, variables);
    sendEmail(params.ownerEmail, emailSubject, emailBody).catch(() => {
    });
  }
}
async function notifyGrievanceOfficerReply(params) {
  const variables = {
    TICKET_NUMBER: params.ticketNumber,
    SUBJECT: params.subject,
    OWNER_NAME: params.ownerName || "Property Owner"
  };
  const template = TEMPLATES.grievance_officer_reply;
  if (params.ownerMobile) {
    const smsMessage = renderTemplate2(template.sms, variables);
    sendSmsNotification(params.ownerMobile, smsMessage).catch(() => {
    });
  }
  if (params.ownerEmail) {
    const emailSubject = renderTemplate2(template.emailSubject, variables);
    const emailBody = renderTemplate2(template.emailBody, variables);
    sendEmail(params.ownerEmail, emailSubject, emailBody).catch(() => {
    });
  }
}
async function notifyGrievanceStatusChanged(params) {
  const variables = {
    TICKET_NUMBER: params.ticketNumber,
    SUBJECT: params.subject,
    OWNER_NAME: params.ownerName || "Property Owner",
    STATUS: (params.status || "updated").replace("_", " ").toUpperCase(),
    RESOLUTION_NOTES: params.resolutionNotes || "No additional notes.",
    RESOLUTION_SECTION: params.resolutionNotes ? `
Resolution Notes:
${params.resolutionNotes}` : ""
  };
  const template = params.status === "resolved" ? TEMPLATES.grievance_resolved : TEMPLATES.grievance_status_changed;
  if (params.ownerMobile) {
    const smsMessage = renderTemplate2(template.sms, variables);
    sendSmsNotification(params.ownerMobile, smsMessage).catch(() => {
    });
  }
  if (params.ownerEmail) {
    const emailSubject = renderTemplate2(template.emailSubject, variables);
    const emailBody = renderTemplate2(template.emailBody, variables);
    sendEmail(params.ownerEmail, emailSubject, emailBody).catch(() => {
    });
  }
}
var log17, TEMPLATES;
var init_grievanceNotifications = __esm({
  "server/services/grievanceNotifications.ts"() {
    "use strict";
    init_logger();
    init_notifications();
    init_systemSettings();
    init_communications();
    log17 = logger.child({ module: "grievance-notifications" });
    TEMPLATES = {
      // Template for owner when a grievance is created
      grievance_created: {
        sms: "Your grievance ({{TICKET_NUMBER}}) has been submitted successfully. We will review and respond soon. - HP Tourism",
        emailSubject: "Grievance Submitted - {{TICKET_NUMBER}}",
        emailBody: `Dear {{OWNER_NAME}},

Your grievance has been successfully submitted.

Ticket Number: {{TICKET_NUMBER}}
Subject: {{SUBJECT}}
Category: {{CATEGORY}}

We will review your grievance and respond shortly. You can track the status by logging into the HP Tourism portal.

Best regards,
HP Tourism Department`
      },
      // Template for owner when officer replies
      grievance_officer_reply: {
        sms: "HP Tourism: New response on your grievance {{TICKET_NUMBER}}. Please log in to view the reply.",
        emailSubject: "New Response on Grievance {{TICKET_NUMBER}}",
        emailBody: `Dear {{OWNER_NAME}},

There is a new response on your grievance ticket.

Ticket Number: {{TICKET_NUMBER}}
Subject: {{SUBJECT}}

Please log in to the HP Tourism portal to view the response and reply if needed.

Best regards,
HP Tourism Department`
      },
      // Template for officer when owner replies
      grievance_owner_reply: {
        // Note: Usually we don't SMS officers, but we can
        sms: "Grievance {{TICKET_NUMBER}} has a new reply from the property owner. Please review.",
        emailSubject: "New Owner Reply - Grievance {{TICKET_NUMBER}}",
        emailBody: `A property owner has replied to grievance {{TICKET_NUMBER}}.

Subject: {{SUBJECT}}

Please log in to review and respond.

- HP Tourism System`
      },
      // Template for owner when status changes
      grievance_status_changed: {
        sms: "HP Tourism: Your grievance {{TICKET_NUMBER}} status changed to {{STATUS}}. {{RESOLUTION_NOTES}}",
        emailSubject: "Grievance Status Update - {{TICKET_NUMBER}}",
        emailBody: `Dear {{OWNER_NAME}},

The status of your grievance has been updated.

Ticket Number: {{TICKET_NUMBER}}
Subject: {{SUBJECT}}
New Status: {{STATUS}}
{{RESOLUTION_SECTION}}

Please log in to the HP Tourism portal for details.

Best regards,
HP Tourism Department`
      },
      // Template for owner when grievance is resolved
      grievance_resolved: {
        sms: "HP Tourism: Good news! Your grievance {{TICKET_NUMBER}} has been resolved. Login to view details.",
        emailSubject: "Grievance Resolved - {{TICKET_NUMBER}}",
        emailBody: `Dear {{OWNER_NAME}},

We are pleased to inform you that your grievance has been resolved.

Ticket Number: {{TICKET_NUMBER}}
Subject: {{SUBJECT}}

Resolution Notes:
{{RESOLUTION_NOTES}}

If you have any further concerns, you may submit a new grievance through the portal.

Best regards,
HP Tourism Department`
      }
    };
  }
});

// server/routes/grievances.ts
var grievances_exports = {};
__export(grievances_exports, {
  default: () => grievances_default
});
import { Router as Router6 } from "express";
import { eq as eq38, desc as desc11, and as and11, gt, or as or4, isNull, sql as sql10 } from "drizzle-orm";
import { nanoid as nanoid3 } from "nanoid";
async function logAuditEntry(grievanceId, action, performedBy, oldValue, newValue, req) {
  try {
    await db.insert(grievanceAuditLog).values({
      grievanceId,
      action,
      oldValue: oldValue || null,
      newValue: newValue || null,
      performedBy,
      ipAddress: req?.headers?.["x-real-ip"] || req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null
    });
  } catch (error) {
    console.error("Failed to log audit entry:", error);
  }
}
var router4, grievances_default;
var init_grievances = __esm({
  "server/routes/grievances.ts"() {
    "use strict";
    init_db();
    init_storage();
    init_schema();
    init_grievanceNotifications();
    router4 = Router6();
    router4.get("/unread-count", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      try {
        const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
        let count2 = 0;
        if (isOfficer2) {
          const result = await db.select({ count: sql10`count(*)` }).from(grievances).where(
            or4(
              // Never read by officer but has comments
              and11(isNull(grievances.lastReadByOfficer), gt(grievances.lastCommentAt, grievances.createdAt)),
              // Has new comments since last read
              and11(gt(grievances.lastCommentAt, grievances.lastReadByOfficer))
            )
          );
          count2 = Number(result[0]?.count || 0);
        } else {
          const result = await db.select({ count: sql10`count(*)` }).from(grievances).where(
            and11(
              eq38(grievances.userId, user.id),
              or4(
                // Never read but has comments
                and11(isNull(grievances.lastReadByOwner), gt(grievances.lastCommentAt, grievances.createdAt)),
                // Has new comments since last read
                gt(grievances.lastCommentAt, grievances.lastReadByOwner)
              )
            )
          );
          count2 = Number(result[0]?.count || 0);
        }
        res.json({ unreadCount: count2 });
      } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({ message: "Failed to fetch unread count" });
      }
    });
    router4.patch("/:id/mark-read", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      try {
        const grievance = await db.query.grievances.findFirst({
          where: eq38(grievances.id, req.params.id)
        });
        if (!grievance) return res.sendStatus(404);
        const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
        const isOwner = grievance.userId === user.id;
        if (!isOwner && !isOfficer2) return res.sendStatus(403);
        const now = /* @__PURE__ */ new Date();
        if (isOfficer2) {
          await db.update(grievances).set({ lastReadByOfficer: now }).where(eq38(grievances.id, req.params.id));
        } else {
          await db.update(grievances).set({ lastReadByOwner: now }).where(eq38(grievances.id, req.params.id));
        }
        res.json({ success: true });
      } catch (error) {
        console.error("Error marking grievance as read:", error);
        res.status(500).json({ message: "Failed to mark grievance as read" });
      }
    });
    router4.get("/:id/audit-log", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
      if (!isOfficer2) return res.sendStatus(403);
      try {
        const logs = await db.query.grievanceAuditLog.findMany({
          where: eq38(grievanceAuditLog.grievanceId, req.params.id),
          orderBy: [desc11(grievanceAuditLog.performedAt)]
        });
        res.json(logs);
      } catch (error) {
        console.error("Error fetching audit log:", error);
        res.status(500).json({ message: "Failed to fetch audit log" });
      }
    });
    router4.get("/", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
      const requestedType = req.query.type;
      try {
        if (isOfficer2) {
          let whereClause = void 0;
          if (requestedType === "owner_grievance" || requestedType === "internal_ticket") {
            whereClause = eq38(grievances.ticketType, requestedType);
          }
          const allGrievances = await db.query.grievances.findMany({
            where: whereClause,
            orderBy: [desc11(grievances.createdAt)]
          });
          return res.json(allGrievances);
        } else {
          const userGrievances = await db.query.grievances.findMany({
            where: and11(
              eq38(grievances.userId, user.id),
              eq38(grievances.ticketType, "owner_grievance")
            ),
            orderBy: [desc11(grievances.createdAt)]
          });
          return res.json(userGrievances);
        }
      } catch (error) {
        console.error("Error fetching grievances:", error);
        res.status(500).json({ message: "Failed to fetch grievances" });
      }
    });
    router4.get("/:id", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      try {
        const grievance = await db.query.grievances.findFirst({
          where: eq38(grievances.id, req.params.id)
        });
        if (!grievance) return res.sendStatus(404);
        const isOwner = grievance.userId === user.id;
        const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
        if (!isOwner && !isOfficer2) return res.sendStatus(403);
        const comments = await db.query.grievanceComments.findMany({
          where: eq38(grievanceComments.grievanceId, grievance.id),
          orderBy: [desc11(grievanceComments.createdAt)]
        });
        const now = /* @__PURE__ */ new Date();
        if (isOfficer2) {
          await db.update(grievances).set({ lastReadByOfficer: now }).where(eq38(grievances.id, req.params.id));
        } else {
          await db.update(grievances).set({ lastReadByOwner: now }).where(eq38(grievances.id, req.params.id));
        }
        res.json({ ...grievance, comments });
      } catch (error) {
        console.error("Error fetching grievance:", error);
        res.status(500).json({ message: "Failed to fetch grievance details" });
      }
    });
    router4.post("/", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      const validation = insertGrievanceSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(validation.error);
      }
      const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
      let ticketType = validation.data.ticketType || "owner_grievance";
      if (!isOfficer2 && ticketType === "internal_ticket") {
        ticketType = "owner_grievance";
      }
      try {
        const prefix = ticketType === "internal_ticket" ? "INT" : "GRV";
        const ticketNumber = `${prefix}-${(/* @__PURE__ */ new Date()).getFullYear()}-${nanoid3(6).toUpperCase()}`;
        const [newGrievance] = await db.insert(grievances).values({
          ...validation.data,
          ticketType,
          ticketNumber,
          userId: user.id,
          status: "open",
          lastReadByOwner: ticketType === "owner_grievance" ? /* @__PURE__ */ new Date() : null,
          lastReadByOfficer: ticketType === "internal_ticket" ? /* @__PURE__ */ new Date() : null
        }).returning();
        await logAuditEntry(newGrievance.id, "created", user.id, null, `Ticket ${ticketNumber} created (${ticketType})`, req);
        if (ticketType === "owner_grievance") {
          notifyGrievanceCreated({
            ticketNumber,
            subject: validation.data.subject,
            category: validation.data.category,
            ownerName: user.fullName || user.username,
            ownerEmail: user.email || void 0,
            ownerMobile: user.mobile || void 0
          }).catch((err) => console.error("Failed to send grievance created notification:", err));
        }
        res.status(201).json(newGrievance);
      } catch (error) {
        console.error("Error creating grievance:", error);
        res.status(500).json({ message: "Failed to create grievance" });
      }
    });
    router4.post("/:id/comments", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      const validation = insertGrievanceCommentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(validation.error);
      }
      try {
        const grievance = await db.query.grievances.findFirst({
          where: eq38(grievances.id, req.params.id)
        });
        if (!grievance) return res.sendStatus(404);
        const isOwner = grievance.userId === user.id;
        const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
        if (!isOwner && !isOfficer2) return res.sendStatus(403);
        const [comment] = await db.insert(grievanceComments).values({
          grievanceId: grievance.id,
          userId: user.id,
          comment: validation.data.comment,
          isInternal: validation.data.isInternal && isOfficer2 ? true : false
        }).returning();
        const now = /* @__PURE__ */ new Date();
        if (isOfficer2) {
          await db.update(grievances).set({
            lastCommentAt: now,
            lastReadByOfficer: now,
            // Officer just commented, so it's read for them
            updatedAt: now
          }).where(eq38(grievances.id, grievance.id));
        } else {
          await db.update(grievances).set({
            lastCommentAt: now,
            lastReadByOwner: now,
            // Owner just commented, so it's read for them
            updatedAt: now
          }).where(eq38(grievances.id, grievance.id));
        }
        await logAuditEntry(grievance.id, "comment_added", user.id, null, `Comment added by ${user.fullName || user.username}`, req);
        if (isOfficer2 && !validation.data.isInternal) {
          const owner = await storage.getUser(grievance.userId);
          if (owner) {
            notifyGrievanceOfficerReply({
              ticketNumber: grievance.ticketNumber,
              subject: grievance.subject,
              category: grievance.category,
              ownerName: owner.fullName || owner.username,
              ownerEmail: owner.email || void 0,
              ownerMobile: owner.mobile || void 0
            }).catch((err) => console.error("Failed to send officer reply notification:", err));
          }
        }
        res.status(201).json(comment);
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
      }
    });
    router4.patch("/:id/status", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.sendStatus(401);
      const isOfficer2 = ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(user.role);
      if (!isOfficer2) return res.sendStatus(403);
      const { status, priority, assignedTo, resolutionNotes } = req.body;
      try {
        const grievance = await db.query.grievances.findFirst({
          where: eq38(grievances.id, req.params.id)
        });
        if (!grievance) return res.sendStatus(404);
        const [updated] = await db.update(grievances).set({
          status,
          priority,
          assignedTo,
          resolutionNotes,
          updatedAt: /* @__PURE__ */ new Date(),
          lastReadByOfficer: /* @__PURE__ */ new Date(),
          // Officer just updated, so it's read
          resolvedAt: status === "resolved" ? /* @__PURE__ */ new Date() : void 0
        }).where(eq38(grievances.id, req.params.id)).returning();
        if (status && status !== grievance.status) {
          await logAuditEntry(grievance.id, "status_changed", user.id, grievance.status, status, req);
        }
        if (priority && priority !== grievance.priority) {
          await logAuditEntry(grievance.id, "priority_changed", user.id, grievance.priority, priority, req);
        }
        if (assignedTo && assignedTo !== grievance.assignedTo) {
          await logAuditEntry(grievance.id, "assigned", user.id, grievance.assignedTo, assignedTo, req);
        }
        if (resolutionNotes && resolutionNotes !== grievance.resolutionNotes) {
          await logAuditEntry(grievance.id, "resolution_notes_updated", user.id, null, "Resolution notes updated", req);
        }
        if (status && status !== grievance.status) {
          const owner = await storage.getUser(grievance.userId);
          if (owner) {
            notifyGrievanceStatusChanged({
              ticketNumber: grievance.ticketNumber,
              subject: grievance.subject,
              category: grievance.category,
              status,
              resolutionNotes: resolutionNotes || void 0,
              ownerName: owner.fullName || owner.username,
              ownerEmail: owner.email || void 0,
              ownerMobile: owner.mobile || void 0
            }).catch((err) => console.error("Failed to send status change notification:", err));
          }
        }
        res.json(updated);
      } catch (error) {
        console.error("Error updating grievance:", error);
        res.status(500).json({ message: "Failed to update grievance" });
      }
    });
    grievances_default = router4;
  }
});

// server/routes/grievances/reports.ts
var reports_exports = {};
__export(reports_exports, {
  default: () => reports_default
});
import { Router as Router7 } from "express";
import { sql as sql11, desc as desc12, gte as gte4, count } from "drizzle-orm";
function isOfficer(role) {
  return ["dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"].includes(role);
}
var router5, reports_default;
var init_reports = __esm({
  "server/routes/grievances/reports.ts"() {
    "use strict";
    init_db();
    init_storage();
    init_schema();
    router5 = Router7();
    router5.get("/dashboard-stats", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const [totals] = await db.select({
          total: count(),
          open: sql11`count(*) filter (where status = 'open')`,
          inProgress: sql11`count(*) filter (where status = 'in_progress')`,
          resolved: sql11`count(*) filter (where status = 'resolved')`,
          closed: sql11`count(*) filter (where status = 'closed')`
        }).from(grievances);
        const [avgResolution] = await db.select({
          avgDays: sql11`
                avg(extract(epoch from (resolved_at - created_at)) / 86400)
                filter (where resolved_at is not null)
            `
        }).from(grievances);
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [recent] = await db.select({
          newTickets: count(),
          resolvedTickets: sql11`count(*) filter (where resolved_at is not null)`
        }).from(grievances).where(gte4(grievances.createdAt, thirtyDaysAgo));
        const byCategory = await db.select({
          category: grievances.category,
          count: count()
        }).from(grievances).groupBy(grievances.category);
        const byStatus = await db.select({
          status: grievances.status,
          count: count()
        }).from(grievances).groupBy(grievances.status);
        const byPriority = await db.select({
          priority: grievances.priority,
          count: count()
        }).from(grievances).groupBy(grievances.priority);
        const monthlyTrend = await db.select({
          month: sql11`to_char(created_at, 'YYYY-MM')`,
          count: count()
        }).from(grievances).where(gte4(grievances.createdAt, sql11`now() - interval '6 months'`)).groupBy(sql11`to_char(created_at, 'YYYY-MM')`).orderBy(sql11`to_char(created_at, 'YYYY-MM')`);
        res.json({
          summary: {
            totals: {
              total: Number(totals.total) || 0,
              open: Number(totals.open) || 0,
              inProgress: Number(totals.inProgress) || 0,
              resolved: Number(totals.resolved) || 0,
              closed: Number(totals.closed) || 0
            },
            averageResolutionDays: Math.round((Number(avgResolution.avgDays) || 0) * 10) / 10,
            last30Days: {
              newTickets: Number(recent.newTickets) || 0,
              resolvedTickets: Number(recent.resolvedTickets) || 0
            }
          },
          byCategory: byCategory.map((r) => ({ category: r.category, count: Number(r.count) })),
          byStatus: byStatus.map((r) => ({ status: r.status || "open", count: Number(r.count) })),
          byPriority: byPriority.map((r) => ({ priority: r.priority || "medium", count: Number(r.count) })),
          monthlyTrend: monthlyTrend.map((r) => ({ month: r.month, count: Number(r.count) }))
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
      }
    });
    router5.get("/dashboard-stats", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const [totals] = await db.select({
          total: count(),
          open: sql11`count(*) filter (where status = 'open')`,
          inProgress: sql11`count(*) filter (where status = 'in_progress')`,
          resolved: sql11`count(*) filter (where status = 'resolved')`,
          closed: sql11`count(*) filter (where status = 'closed')`
        }).from(grievances);
        const [avgResolution] = await db.select({
          avgDays: sql11`
                avg(extract(epoch from (resolved_at - created_at)) / 86400)
                filter (where resolved_at is not null)
            `
        }).from(grievances);
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [recent] = await db.select({
          newTickets: count(),
          resolvedTickets: sql11`count(*) filter (where resolved_at is not null)`
        }).from(grievances).where(gte4(grievances.createdAt, thirtyDaysAgo));
        const byCategory = await db.select({
          category: grievances.category,
          count: count()
        }).from(grievances).groupBy(grievances.category);
        const byStatus = await db.select({
          status: grievances.status,
          count: count()
        }).from(grievances).groupBy(grievances.status);
        const byPriority = await db.select({
          priority: grievances.priority,
          count: count()
        }).from(grievances).groupBy(grievances.priority);
        const monthlyTrend = await db.select({
          month: sql11`to_char(created_at, 'YYYY-MM')`,
          count: count()
        }).from(grievances).where(gte4(grievances.createdAt, sql11`now() - interval '6 months'`)).groupBy(sql11`to_char(created_at, 'YYYY-MM')`).orderBy(sql11`to_char(created_at, 'YYYY-MM')`);
        res.json({
          summary: {
            totals: {
              total: Number(totals.total) || 0,
              open: Number(totals.open) || 0,
              inProgress: Number(totals.inProgress) || 0,
              resolved: Number(totals.resolved) || 0,
              closed: Number(totals.closed) || 0
            },
            averageResolutionDays: Math.round((Number(avgResolution.avgDays) || 0) * 10) / 10,
            last30Days: {
              newTickets: Number(recent.newTickets) || 0,
              resolvedTickets: Number(recent.resolvedTickets) || 0
            }
          },
          byCategory: byCategory.map((r) => ({ category: r.category, count: Number(r.count) })),
          byStatus: byStatus.map((r) => ({ status: r.status || "open", count: Number(r.count) })),
          byPriority: byPriority.map((r) => ({ priority: r.priority || "medium", count: Number(r.count) })),
          monthlyTrend: monthlyTrend.map((r) => ({ month: r.month, count: Number(r.count) }))
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
      }
    });
    router5.get("/dashboard-stats", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const [totals] = await db.select({
          total: count(),
          open: sql11`count(*) filter (where status = 'open')`,
          inProgress: sql11`count(*) filter (where status = 'in_progress')`,
          resolved: sql11`count(*) filter (where status = 'resolved')`,
          closed: sql11`count(*) filter (where status = 'closed')`
        }).from(grievances);
        const [avgResolution] = await db.select({
          avgDays: sql11`
                avg(extract(epoch from (resolved_at - created_at)) / 86400)
                filter (where resolved_at is not null)
            `
        }).from(grievances);
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [recent] = await db.select({
          newTickets: count(),
          resolvedTickets: sql11`count(*) filter (where resolved_at is not null)`
        }).from(grievances).where(gte4(grievances.createdAt, thirtyDaysAgo));
        const byCategory = await db.select({
          category: grievances.category,
          count: count()
        }).from(grievances).groupBy(grievances.category);
        const byStatus = await db.select({
          status: grievances.status,
          count: count()
        }).from(grievances).groupBy(grievances.status);
        const byPriority = await db.select({
          priority: grievances.priority,
          count: count()
        }).from(grievances).groupBy(grievances.priority);
        const monthlyTrend = await db.select({
          month: sql11`to_char(created_at, 'YYYY-MM')`,
          count: count()
        }).from(grievances).where(gte4(grievances.createdAt, sql11`now() - interval '6 months'`)).groupBy(sql11`to_char(created_at, 'YYYY-MM')`).orderBy(sql11`to_char(created_at, 'YYYY-MM')`);
        res.json({
          summary: {
            totals: {
              total: Number(totals.total) || 0,
              open: Number(totals.open) || 0,
              inProgress: Number(totals.inProgress) || 0,
              resolved: Number(totals.resolved) || 0,
              closed: Number(totals.closed) || 0
            },
            averageResolutionDays: Math.round((Number(avgResolution.avgDays) || 0) * 10) / 10,
            last30Days: {
              newTickets: Number(recent.newTickets) || 0,
              resolvedTickets: Number(recent.resolvedTickets) || 0
            }
          },
          byCategory: byCategory.map((r) => ({ category: r.category, count: Number(r.count) })),
          byStatus: byStatus.map((r) => ({ status: r.status || "open", count: Number(r.count) })),
          byPriority: byPriority.map((r) => ({ priority: r.priority || "medium", count: Number(r.count) })),
          monthlyTrend: monthlyTrend.map((r) => ({ month: r.month, count: Number(r.count) }))
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
      }
    });
    router5.get("/summary", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const [totals] = await db.select({
          total: count(),
          open: sql11`count(*) filter (where status = 'open')`,
          inProgress: sql11`count(*) filter (where status = 'in_progress')`,
          resolved: sql11`count(*) filter (where status = 'resolved')`,
          closed: sql11`count(*) filter (where status = 'closed')`
        }).from(grievances);
        const [avgResolution] = await db.select({
          avgDays: sql11`
                avg(extract(epoch from (resolved_at - created_at)) / 86400)
                filter (where resolved_at is not null)
            `
        }).from(grievances);
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [recent] = await db.select({
          newTickets: count(),
          resolvedTickets: sql11`count(*) filter (where resolved_at is not null)`
        }).from(grievances).where(gte4(grievances.createdAt, thirtyDaysAgo));
        res.json({
          totals: {
            total: Number(totals.total) || 0,
            open: Number(totals.open) || 0,
            inProgress: Number(totals.inProgress) || 0,
            resolved: Number(totals.resolved) || 0,
            closed: Number(totals.closed) || 0
          },
          averageResolutionDays: Math.round((Number(avgResolution.avgDays) || 0) * 10) / 10,
          last30Days: {
            newTickets: Number(recent.newTickets) || 0,
            resolvedTickets: Number(recent.resolvedTickets) || 0
          }
        });
      } catch (error) {
        console.error("Error fetching grievance summary:", error);
        res.status(500).json({ message: "Failed to fetch summary" });
      }
    });
    router5.get("/by-category", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const result = await db.select({
          category: grievances.category,
          count: count()
        }).from(grievances).groupBy(grievances.category);
        res.json(result.map((r) => ({
          category: r.category,
          count: Number(r.count)
        })));
      } catch (error) {
        console.error("Error fetching by category:", error);
        res.status(500).json({ message: "Failed to fetch data" });
      }
    });
    router5.get("/by-status", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const result = await db.select({
          status: grievances.status,
          count: count()
        }).from(grievances).groupBy(grievances.status);
        res.json(result.map((r) => ({
          status: r.status || "open",
          count: Number(r.count)
        })));
      } catch (error) {
        console.error("Error fetching by status:", error);
        res.status(500).json({ message: "Failed to fetch data" });
      }
    });
    router5.get("/by-priority", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const result = await db.select({
          priority: grievances.priority,
          count: count()
        }).from(grievances).groupBy(grievances.priority);
        res.json(result.map((r) => ({
          priority: r.priority || "medium",
          count: Number(r.count)
        })));
      } catch (error) {
        console.error("Error fetching by priority:", error);
        res.status(500).json({ message: "Failed to fetch data" });
      }
    });
    router5.get("/monthly-trend", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const result = await db.select({
          month: sql11`to_char(created_at, 'YYYY-MM')`,
          count: count()
        }).from(grievances).where(gte4(grievances.createdAt, sql11`now() - interval '6 months'`)).groupBy(sql11`to_char(created_at, 'YYYY-MM')`).orderBy(sql11`to_char(created_at, 'YYYY-MM')`);
        res.json(result.map((r) => ({
          month: r.month,
          count: Number(r.count)
        })));
      } catch (error) {
        console.error("Error fetching monthly trend:", error);
        res.status(500).json({ message: "Failed to fetch data" });
      }
    });
    router5.get("/export", async (req, res) => {
      if (!req.session.userId) return res.sendStatus(401);
      const user = await storage.getUser(req.session.userId);
      if (!user || !isOfficer(user.role)) return res.sendStatus(403);
      try {
        const allGrievances = await db.select({
          ticketNumber: grievances.ticketNumber,
          subject: grievances.subject,
          category: grievances.category,
          priority: grievances.priority,
          status: grievances.status,
          description: grievances.description,
          resolutionNotes: grievances.resolutionNotes,
          createdAt: grievances.createdAt,
          resolvedAt: grievances.resolvedAt
        }).from(grievances).orderBy(desc12(grievances.createdAt));
        const headers = ["Ticket Number", "Subject", "Category", "Priority", "Status", "Description", "Resolution Notes", "Created At", "Resolved At"];
        const csvRows = [headers.join(",")];
        for (const g of allGrievances) {
          const row = [
            g.ticketNumber,
            `"${(g.subject || "").replace(/"/g, '""')}"`,
            g.category,
            g.priority || "medium",
            g.status || "open",
            `"${(g.description || "").replace(/"/g, '""').substring(0, 200)}"`,
            `"${(g.resolutionNotes || "").replace(/"/g, '""')}"`,
            g.createdAt ? new Date(g.createdAt).toISOString() : "",
            g.resolvedAt ? new Date(g.resolvedAt).toISOString() : ""
          ];
          csvRows.push(row.join(","));
        }
        const csv = csvRows.join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="grievances-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
        res.send(csv);
      } catch (error) {
        console.error("Error exporting grievances:", error);
        res.status(500).json({ message: "Failed to export" });
      }
    });
    reports_default = router5;
  }
});

// server/routes/stats.ts
var stats_exports = {};
__export(stats_exports, {
  default: () => stats_default
});
import { Router as Router8 } from "express";
import { sql as sql12, eq as eq40, and as and13, isNotNull } from "drizzle-orm";
var router6, stats_default;
var init_stats = __esm({
  "server/routes/stats.ts"() {
    "use strict";
    init_db();
    init_schema();
    router6 = Router8();
    router6.get("/state", async (req, res) => {
      try {
        const [heroData] = await db.select({
          totalApplications: sql12`count(*)`,
          totalRevenue: sql12`sum(CASE WHEN ${homestayApplications.status} = 'approved' OR ${homestayApplications.paymentStatus} = 'paid' THEN ${homestayApplications.totalFee} ELSE 0 END)`,
          pendingScrutiny: sql12`count(*) filter (where ${homestayApplications.status} in ('submitted', 'document_verification', 'clarification_requested', 'site_inspection_scheduled', 'site_inspection_complete', 'payment_pending'))`,
          avgClearanceDays: sql12`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400)`
        }).from(homestayApplications);
        const funnelRaw = await db.select({
          status: homestayApplications.status,
          count: sql12`count(*)`
        }).from(homestayApplications).groupBy(homestayApplications.status);
        const funnelMap = new Map(funnelRaw.map((f) => [f.status, Number(f.count)]));
        const funnelData = [
          { name: "Draft", value: funnelMap.get("draft") || 0, fill: "#94a3b8" },
          { name: "Submitted", value: funnelMap.get("submitted") || 0, fill: "#3b82f6" },
          { name: "Under Scrutiny", value: (funnelMap.get("document_verification") || 0) + (funnelMap.get("clarification_requested") || 0), fill: "#f59e0b" },
          { name: "Inspection", value: (funnelMap.get("site_inspection_scheduled") || 0) + (funnelMap.get("site_inspection_complete") || 0), fill: "#8b5cf6" },
          { name: "Approved", value: funnelMap.get("approved") || 0, fill: "#22c55e" },
          { name: "Rejected", value: funnelMap.get("rejected") || 0, fill: "#ef4444" }
        ];
        const pipelineExpr = sql12`
      CASE 
        -- Group B: Merged Districts
        WHEN lower(${homestayApplications.district}) = 'una' THEN 'Hamirpur (incl. Una)'
        WHEN lower(${homestayApplications.district}) = 'mandi' THEN 'Bilaspur (incl. Mandi)'
        WHEN lower(${homestayApplications.district}) = 'hamirpur' THEN 'Hamirpur (incl. Una)'
        WHEN lower(${homestayApplications.district}) = 'bilaspur' THEN 'Bilaspur (incl. Mandi)'

        -- Group C: Split Districts (Chamba)
        WHEN lower(${homestayApplications.district}) = 'chamba' AND lower(${homestayApplications.tehsil}) = 'pangi' THEN 'Pangi (Special)'
        WHEN lower(${homestayApplications.district}) = 'chamba' THEN 'Chamba (Main)'

        -- Group C: Split Districts (Lahaul-Spiti)
        WHEN (lower(${homestayApplications.district}) LIKE 'lahaul%') AND (lower(${homestayApplications.tehsil}) IN ('spiti', 'kaza')) THEN 'Spiti (Kaza)'
        WHEN (lower(${homestayApplications.district}) LIKE 'lahaul%') THEN 'Lahaul (Main)'

        -- Group A: Standard Districts
        ELSE ${homestayApplications.district} 
      END
    `;
        const districtRaw = await db.select({
          pipeline: pipelineExpr,
          count: sql12`count(*)`
        }).from(homestayApplications).groupBy(pipelineExpr);
        const districtData = districtRaw.map((d) => ({
          district: d.pipeline,
          // Mapped to "pipeline" name for UI
          applications: Number(d.count),
          status: Number(d.count) > 50 ? "high" : Number(d.count) > 20 ? "medium" : "low"
        })).sort((a, b) => b.applications - a.applications);
        const leaderboardRaw = await db.select({
          pipeline: pipelineExpr,
          processedCount: sql12`count(*)`,
          avgDays: sql12`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400)`
        }).from(homestayApplications).where(isNotNull(homestayApplications.approvedAt)).groupBy(pipelineExpr).orderBy(sql12`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) asc`);
        const leaderboard = leaderboardRaw.map((l) => ({
          district: l.pipeline,
          avgDays: Number(l.avgDays || 0).toFixed(1),
          processed: Number(l.processedCount)
        }));
        const [economicData] = await db.select({
          totalBeds: sql12`sum(
                    COALESCE(${homestayApplications.singleBedBeds}, 0) + 
                    COALESCE(${homestayApplications.doubleBedBeds}, 0) + 
                    COALESCE(${homestayApplications.familySuiteBeds}, 0)
                )`,
          // Generic Revenue Projection: Avg Rate * Rooms * 365 days * 40% Occupancy
          projectedRevenue: sql12`sum(
                    COALESCE(${homestayApplications.averageRoomRate}, 2000) * 
                    ${homestayApplications.totalRooms} * 
                    365 * 0.40
                )`
        }).from(homestayApplications).where(eq40(homestayApplications.status, "approved"));
        const categoryRaw = await db.select({
          category: homestayApplications.category,
          count: sql12`count(*)`
        }).from(homestayApplications).where(eq40(homestayApplications.status, "approved")).groupBy(homestayApplications.category);
        const categoryData = categoryRaw.map((c) => ({
          name: c.category || "Uncategorized",
          value: Number(c.count)
        }));
        const revenueTrendRaw = await db.select({
          date: sql12`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD')`,
          amount: sql12`sum(${himkoshTransactions.totalAmount})`
        }).from(himkoshTransactions).where(
          and13(
            eq40(himkoshTransactions.transactionStatus, "success"),
            sql12`${himkoshTransactions.createdAt} > NOW() - INTERVAL '30 days'`
          )
        ).groupBy(sql12`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD')`).orderBy(sql12`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD') asc`);
        const appTrendRaw = await db.select({
          date: sql12`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD')`,
          count: sql12`count(*)`
        }).from(homestayApplications).where(
          and13(
            isNotNull(homestayApplications.submittedAt),
            sql12`${homestayApplications.submittedAt} > NOW() - INTERVAL '30 days'`
          )
        ).groupBy(sql12`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD')`).orderBy(sql12`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD') asc`);
        res.json({
          hero: {
            totalApplications: Number(heroData.totalApplications),
            totalRevenue: Number(heroData.totalRevenue || 0),
            pendingScrutiny: Number(heroData.pendingScrutiny),
            avgClearanceDays: Number(heroData.avgClearanceDays || 0).toFixed(1)
          },
          trends: {
            revenue: revenueTrendRaw.map((r) => ({ date: r.date, value: Number(r.amount) })),
            applications: appTrendRaw.map((r) => ({ date: r.date, value: Number(r.count) }))
          },
          pipeline_counts: {
            draft: funnelMap.get("draft") || 0,
            submitted: funnelMap.get("submitted") || 0,
            scrutiny: (funnelMap.get("document_verification") || 0) + (funnelMap.get("clarification_requested") || 0),
            district: funnelMap.get("forwarded_to_dtdo") || 0,
            // Assuming 'forwarded_to_dtdo' is the status for district review
            inspection: (funnelMap.get("site_inspection_scheduled") || 0) + (funnelMap.get("site_inspection_complete") || 0),
            payment: funnelMap.get("payment_pending") || 0,
            approved: funnelMap.get("approved") || 0
          },
          funnel: funnelData,
          heatmap: districtData,
          leaderboard,
          economic: {
            totalBeds: Number(economicData?.totalBeds || 0),
            projectedRevenue: Number(economicData?.projectedRevenue || 0),
            categorySplit: categoryData
          }
        });
      } catch (error) {
        console.error("[Stats API] Error fetching state stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
      }
    });
    router6.get("/locations", async (req, res) => {
      try {
        const locations = await db.select({
          id: homestayApplications.id,
          name: homestayApplications.propertyName,
          lat: homestayApplications.latitude,
          lng: homestayApplications.longitude,
          status: homestayApplications.status,
          category: homestayApplications.category,
          district: homestayApplications.district
        }).from(homestayApplications).where(
          and13(
            isNotNull(homestayApplications.latitude),
            isNotNull(homestayApplications.longitude)
          )
        );
        res.json(locations);
      } catch (error) {
        console.error("[Stats API] Error fetching locations:", error);
        res.status(500).json({ message: "Failed to fetch locations" });
      }
    });
    router6.get("/activity", async (req, res) => {
      try {
        const recentActivity = await db.select({
          id: homestayApplications.id,
          applicationNumber: homestayApplications.applicationNumber,
          propertyName: homestayApplications.propertyName,
          status: homestayApplications.status,
          district: homestayApplications.district,
          ownerName: homestayApplications.ownerName,
          updatedAt: homestayApplications.updatedAt,
          submittedAt: homestayApplications.submittedAt,
          approvedAt: homestayApplications.approvedAt
        }).from(homestayApplications).orderBy(sql12`${homestayApplications.updatedAt} DESC NULLS LAST`).limit(15);
        const activities = recentActivity.map((app2) => {
          let action = "Updated";
          let timestamp2 = app2.updatedAt;
          if (app2.status === "approved" && app2.approvedAt) {
            action = "Approved";
            timestamp2 = app2.approvedAt;
          } else if (app2.status === "rejected") {
            action = "Rejected";
          } else if (app2.status === "submitted" && app2.submittedAt) {
            action = "Submitted";
            timestamp2 = app2.submittedAt;
          } else if (app2.status === "draft") {
            action = "Draft Created";
          } else if (app2.status?.includes("inspection")) {
            action = "Inspection Scheduled";
          } else if (app2.status?.includes("verification")) {
            action = "Under Review";
          }
          return {
            id: app2.id,
            applicationNumber: app2.applicationNumber,
            propertyName: app2.propertyName,
            action,
            district: app2.district,
            ownerName: app2.ownerName,
            timestamp: timestamp2
          };
        });
        res.json(activities);
      } catch (error) {
        console.error("[Stats API] Error fetching activity:", error);
        res.status(500).json({ message: "Failed to fetch activity" });
      }
    });
    router6.get("/trends", async (req, res) => {
      try {
        const now = /* @__PURE__ */ new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1e3);
        const [currentPeriod] = await db.select({
          count: sql12`count(*)`,
          revenue: sql12`sum(${homestayApplications.totalFee})`
        }).from(homestayApplications).where(sql12`${homestayApplications.submittedAt} >= ${thirtyDaysAgo}`);
        const [previousPeriod] = await db.select({
          count: sql12`count(*)`,
          revenue: sql12`sum(${homestayApplications.totalFee})`
        }).from(homestayApplications).where(sql12`${homestayApplications.submittedAt} >= ${sixtyDaysAgo} AND ${homestayApplications.submittedAt} < ${thirtyDaysAgo}`);
        const currentCount = Number(currentPeriod?.count || 0);
        const previousCount = Number(previousPeriod?.count || 0);
        const currentRevenue = Number(currentPeriod?.revenue || 0);
        const previousRevenue = Number(previousPeriod?.revenue || 0);
        const countChange = previousCount > 0 ? Math.round((currentCount - previousCount) / previousCount * 100) : currentCount > 0 ? 100 : 0;
        const revenueChange = previousRevenue > 0 ? Math.round((currentRevenue - previousRevenue) / previousRevenue * 100) : currentRevenue > 0 ? 100 : 0;
        res.json({
          applications: {
            current: currentCount,
            previous: previousCount,
            change: countChange,
            trend: countChange >= 0 ? "up" : "down"
          },
          revenue: {
            current: currentRevenue,
            previous: previousRevenue,
            change: revenueChange,
            trend: revenueChange >= 0 ? "up" : "down"
          }
        });
      } catch (error) {
        console.error("[Stats API] Error fetching trends:", error);
        res.status(500).json({ message: "Failed to fetch trends" });
      }
    });
    stats_default = router6;
  }
});

// server/services/sms.ts
async function sendSms(mobile, message) {
  try {
    const normalizedMobile = mobile.replace(/^\+91|^91/, "").trim();
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      log18.warn({ mobile }, "Invalid mobile number format");
      return false;
    }
    const record = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
    if (!record) {
      log18.warn({ mobile: normalizedMobile.slice(-4) }, "SMS gateway not configured - Falling back to DEV log");
      logDevSms(normalizedMobile, message);
      return true;
    }
    const config2 = record.settingValue ?? {};
    const provider = config2.provider ?? "nic";
    if (provider === "twilio") {
      const twilioConfig = config2.twilio;
      if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber && !twilioConfig.messagingServiceSid) {
        log18.warn("Twilio settings incomplete - using DEV log");
        logDevSms(normalizedMobile, message);
        return true;
      }
      await sendTwilioSms(
        {
          accountSid: twilioConfig.accountSid,
          authToken: twilioConfig.authToken,
          fromNumber: twilioConfig.fromNumber,
          messagingServiceSid: twilioConfig.messagingServiceSid
        },
        { mobile, message }
      );
    } else if (provider === "nic_v2") {
      const nicV2Config = config2.nicV2;
      if (!nicV2Config || !nicV2Config.username || !nicV2Config.password || !nicV2Config.senderId || !nicV2Config.key || !nicV2Config.templateId || !nicV2Config.postUrl) {
        log18.warn("NIC V2 settings incomplete - using DEV log");
        logDevSms(normalizedMobile, message);
        return true;
      }
      await sendNicV2Sms(
        {
          username: nicV2Config.username,
          password: nicV2Config.password,
          senderId: nicV2Config.senderId,
          templateId: nicV2Config.templateId,
          key: nicV2Config.key,
          postUrl: nicV2Config.postUrl
        },
        { mobile, message }
      );
    } else {
      const nicConfig = config2.nic;
      if (!nicConfig || !nicConfig.username || !nicConfig.password || !nicConfig.senderId || !nicConfig.departmentKey || !nicConfig.templateId || !nicConfig.postUrl) {
        log18.warn("NIC settings incomplete - using DEV log");
        logDevSms(normalizedMobile, message);
        return true;
      }
      await sendTestSms(
        {
          username: nicConfig.username,
          password: nicConfig.password,
          senderId: nicConfig.senderId,
          departmentKey: nicConfig.departmentKey,
          templateId: nicConfig.templateId,
          postUrl: nicConfig.postUrl
        },
        { mobile, message }
      );
    }
    log18.info({ mobile: normalizedMobile.slice(-4), provider }, "SMS sent successfully via gateway");
    const otpMatch = message.match(/OTP:\s*(\d{6})/);
    if (otpMatch) {
      log18.info({ otp: otpMatch[1], mobile: normalizedMobile.slice(-4) }, "DEV OTP (Backup Log)");
    }
    return true;
  } catch (error) {
    log18.error({ err: error, mobile: mobile.slice(-4) }, "Failed to send SMS via gateway");
    logDevSms(mobile, message);
    return false;
  }
}
function logDevSms(mobile, message) {
  const normalizedMobile = mobile.replace(/^\+91|^91/, "").trim();
  log18.info({
    mobile: normalizedMobile.slice(-4),
    message: message.substring(0, 100)
  }, "SMS would be sent (DEV MODE)");
  const otpMatch = message.match(/OTP:\s*(\d{6})/);
  if (otpMatch) {
    log18.warn({ otp: otpMatch[1], mobile: normalizedMobile.slice(-4) }, "DEV OTP for testing");
  }
}
var log18;
var init_sms = __esm({
  "server/services/sms.ts"() {
    "use strict";
    init_logger();
    init_systemSettings();
    init_notifications();
    init_communications();
    log18 = createLogger("sms-service");
  }
});

// server/routes/sendback-otp.ts
var sendback_otp_exports = {};
__export(sendback_otp_exports, {
  createSendbackOtpRouter: () => createSendbackOtpRouter
});
import express22 from "express";
import { z as z12 } from "zod";
import { eq as eq41, and as and14, ilike as ilike3, desc as desc14 } from "drizzle-orm";
function generateOtp() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function createSendbackOtpRouter() {
  const router8 = express22.Router();
  router8.post("/request", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { applicationId, reason } = requestOtpSchema.parse(req.body);
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if ((application.revertCount ?? 0) >= 1) {
        return res.status(400).json({
          message: "Application has already been sent back once. A second send-back will result in automatic rejection.",
          willAutoReject: true,
          revertCount: application.revertCount
        });
      }
      const [dtdoUser] = await db.select().from(users).where(and14(
        eq41(users.role, "district_tourism_officer"),
        ilike3(users.district, `%${application.district}%`),
        eq41(users.isActive, true)
      )).orderBy(desc14(users.updatedAt)).limit(1);
      let dtdoMobile = dtdoUser?.mobile;
      if (!dtdoMobile) {
        const manifestDtdo = lookupDtdoByDistrictLabel(application.district);
        if (manifestDtdo) {
          dtdoMobile = manifestDtdo.mobile;
          log19.info({ district: application.district, manifestMobile: dtdoMobile }, "DTDO not found in DB, using manifest fallback");
        }
      }
      if (!dtdoMobile) {
        return res.status(400).json({ message: `No DTDO found for district: ${application.district}` });
      }
      const otp = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1e3;
      otpStore.set(applicationId, {
        otp,
        dtdoPhone: dtdoMobile,
        expiresAt,
        applicationId
      });
      const smsMessage = `${otp} is your OTP for Himachal Tourism e-services portal login. - HP Tourism E-services`;
      try {
        await sendSms(dtdoMobile, smsMessage);
        log19.info({ applicationId, dtdoPhone: dtdoMobile.slice(-4) }, "OTP sent to DTDO");
      } catch (smsError) {
        log19.error({ err: smsError }, "Failed to send OTP SMS");
        log19.warn({ otp }, "DEV: OTP for testing");
      }
      res.json({
        message: "OTP sent to DTDO's registered mobile",
        expiresIn: 300,
        // seconds
        dtdoPhoneLast4: dtdoMobile.slice(-4),
        maskedMobile: dtdoMobile.length > 4 ? "xxxxxx" + dtdoMobile.slice(-4) : dtdoMobile
      });
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      log19.error({ err: error }, "Failed to request OTP");
      res.status(500).json({ message: "Failed to request OTP" });
    }
  });
  router8.post("/verify", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { applicationId, otp } = verifyOtpSchema.parse(req.body);
      const stored = otpStore.get(applicationId);
      if (!stored) {
        return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
      }
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(applicationId);
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
      if (stored.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
      }
      otpStore.delete(applicationId);
      res.json({
        verified: true,
        message: "OTP verified successfully. You can now proceed with send-back."
      });
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      log19.error({ err: error }, "Failed to verify OTP");
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
  router8.get("/check/:applicationId", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const revertCount = application.revertCount ?? 0;
      const willAutoReject = revertCount >= 1;
      res.json({
        revertCount,
        willAutoReject,
        message: willAutoReject ? "This application has already been sent back once. Another send-back will automatically REJECT the application." : "This is the first send-back. OTP verification from DTDO is required."
      });
    } catch (error) {
      log19.error({ err: error }, "Failed to check revert status");
      res.status(500).json({ message: "Failed to check revert status" });
    }
  });
  return router8;
}
var log19, otpStore, requestOtpSchema, verifyOtpSchema;
var init_sendback_otp = __esm({
  "server/routes/sendback-otp.ts"() {
    "use strict";
    init_storage();
    init_middleware();
    init_sms();
    init_logger();
    init_db();
    init_schema();
    init_districtStaffManifest();
    log19 = createLogger("sendback-otp");
    otpStore = /* @__PURE__ */ new Map();
    requestOtpSchema = z12.object({
      applicationId: z12.string().uuid(),
      reason: z12.string().min(10, "Reason must be at least 10 characters")
    });
    verifyOtpSchema = z12.object({
      applicationId: z12.string().uuid(),
      otp: z12.string().length(6, "OTP must be 6 digits")
    });
  }
});

// server/routes/dev-tools.ts
var dev_tools_exports = {};
__export(dev_tools_exports, {
  createDevToolsRouter: () => createDevToolsRouter
});
import express23 from "express";
import { eq as eq42, desc as desc15, like as like3, or as or5 } from "drizzle-orm";
import { randomUUID as randomUUID6 } from "crypto";
function createDevToolsRouter() {
  const router8 = express23.Router();
  router8.use((req, res, next) => {
    const environment = process.env.NODE_ENV || "development";
    const rawHost = req.get("x-forwarded-host") || req.get("host") || "";
    const isDevHost = /dev|localhost|test|staging/i.test(rawHost);
    if (environment === "production" && !isDevHost) {
      console.log(`[DevTools] Blocked access. Env: ${environment}, Host: ${rawHost}, IsDev: ${isDevHost}`);
      return res.status(404).send("Not Found");
    }
    next();
  });
  router8.post("/seed", async (req, res) => {
    try {
      const { count: count2 = 5, type = "new_registration", district = "Shimla", projectType = "new_property" } = req.body;
      const createdIds = [];
      const validAppKind = type;
      for (let i = 0; i < count2; i++) {
        const ownerId = await createRandomOwner(district);
        const appId = randomUUID6();
        const timestamp2 = Date.now();
        const ownerName = `Test Owner ${timestamp2}`;
        const ownerMobile = "9812345678";
        await db.insert(homestayApplications).values({
          id: appId,
          userId: ownerId,
          district,
          tehsil: "Shimla Urban",
          applicationNumber: `HP-TEST-${timestamp2}-${i}`,
          propertyName: `Test Homestay ${timestamp2}-${i}`,
          address: "123 Test Street, Shimla (Simulator Data)",
          pincode: "171001",
          locationType: "mc",
          applicationKind: validAppKind,
          category: "silver",
          status: "submitted",
          totalRooms: 3,
          // Owner Details required
          ownerName,
          ownerGender: "male",
          ownerMobile,
          ownerAadhaar: "123456789012",
          ownerEmail: `test.owner.${timestamp2}@example.com`,
          propertyOwnership: "owned",
          projectType,
          propertyArea: "150",
          propertyAreaUnit: "sqm",
          attachedWashrooms: 3,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          submittedAt: /* @__PURE__ */ new Date()
        });
        await createDummyDocs(appId);
        await db.insert(payments).values({
          id: randomUUID6(),
          applicationId: appId,
          amount: "1000",
          paymentStatus: "success",
          paymentGateway: "himkosh",
          gatewayTransactionId: `TXN-${timestamp2}`,
          initiatedAt: /* @__PURE__ */ new Date(),
          completedAt: /* @__PURE__ */ new Date(),
          receiptNumber: `REC-${timestamp2}`,
          paymentType: "registration"
        });
        await db.insert(applicationActions).values({
          id: randomUUID6(),
          applicationId: appId,
          officerId: ownerId,
          // Using owner ID as actor for submission
          action: "submitted",
          createdAt: /* @__PURE__ */ new Date(),
          feedback: "Auto-generated test application via Console"
        });
        createdIds.push(appId);
      }
      res.json({ message: `Successfully seeded ${count2} applications`, ids: createdIds });
    } catch (error) {
      console.error("Seeding failed:", error);
      res.status(500).json({ message: "Seeding failed", error });
    }
  });
  router8.get("/applications", async (req, res) => {
    try {
      const apps = await db.select().from(homestayApplications).where(like3(homestayApplications.applicationNumber, "HP-TEST-%")).orderBy(desc15(homestayApplications.createdAt)).limit(50);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test applications" });
    }
  });
  router8.get("/reports", (req, res) => {
    res.json(globalTestReports);
  });
  router8.post("/reports", (req, res) => {
    const report = {
      id: randomUUID6(),
      createdAt: /* @__PURE__ */ new Date(),
      ...req.body
    };
    globalTestReports.unshift(report);
    if (globalTestReports.length > 50) globalTestReports.pop();
    res.json(report);
  });
  router8.post("/action", async (req, res) => {
    try {
      const { applicationId, action } = req.body;
      const systemUserId = await getSystemUserId();
      let newStatus = "";
      let logAction = "";
      let logFeedback = "";
      const [app2] = await db.select().from(homestayApplications).where(eq42(homestayApplications.id, applicationId));
      if (!app2) throw new Error("App not found");
      switch (action) {
        case "forward_to_dtdo":
          newStatus = "forwarded_to_dtdo";
          logAction = "document_verified";
          logFeedback = "Documents OK. Forwarding to DTDO (Console Action)";
          break;
        case "revert_by_da":
          newStatus = "reverted_by_da";
          logAction = "sent_back_for_corrections";
          logFeedback = "Please fix documents (Console Action)";
          break;
        case "revert_by_dtdo":
          newStatus = "reverted_by_dtdo";
          logAction = "sent_back_for_corrections";
          logFeedback = "Please fix issues found by DTDO (Console Action)";
          break;
        case "reject_application":
          newStatus = "rejected";
          logAction = "rejected";
          logFeedback = "Application Rejected (Console Action)";
          break;
        case "schedule_inspection":
          newStatus = "inspection_scheduled";
          logAction = "site_inspection_scheduled";
          logFeedback = "Inspection scheduled (Console Action)";
          await db.insert(inspectionOrders).values({
            id: randomUUID6(),
            applicationId,
            scheduledBy: systemUserId,
            assignedTo: systemUserId,
            // Self-assign for simplicity
            scheduledDate: new Date(Date.now() + 864e5),
            // Date object!
            assignedDate: /* @__PURE__ */ new Date(),
            inspectionDate: new Date(Date.now() + 864e5),
            // Date object!
            inspectionAddress: app2.address,
            status: "scheduled",
            createdAt: /* @__PURE__ */ new Date()
          });
          break;
        case "submit_inspection_report":
          newStatus = "inspection_completed";
          const [order] = await db.select().from(inspectionOrders).where(eq42(inspectionOrders.applicationId, applicationId)).orderBy(desc15(inspectionOrders.createdAt)).limit(1);
          if (order) {
            await db.update(inspectionOrders).set({ status: "completed", updatedAt: /* @__PURE__ */ new Date() }).where(eq42(inspectionOrders.id, order.id));
            await db.insert(inspectionReports).values({
              id: randomUUID6(),
              inspectionOrderId: order.id,
              applicationId,
              submittedBy: systemUserId,
              submittedDate: /* @__PURE__ */ new Date(),
              actualInspectionDate: /* @__PURE__ */ new Date(),
              roomCountVerified: true,
              categoryMeetsStandards: true,
              overallSatisfactory: true,
              recommendation: "approve",
              // 'approve' or 'raise_objections'
              detailedFindings: "Console generated report: All clear.",
              createdAt: /* @__PURE__ */ new Date()
            });
          }
          logAction = "inspection_acknowledged";
          logFeedback = "Inspection Completed";
          break;
        case "approve_application":
          newStatus = "approved";
          logAction = "approved";
          logFeedback = "Approved via Console";
          await db.insert(certificates).values({
            id: randomUUID6(),
            applicationId,
            certificateNumber: `HP-RC-${Date.now()}`,
            issuedDate: /* @__PURE__ */ new Date(),
            validFrom: /* @__PURE__ */ new Date(),
            validUpto: new Date(Date.now() + 31536e6),
            // 1 year
            propertyName: app2.propertyName,
            category: app2.category,
            address: app2.address,
            district: app2.district,
            ownerName: app2.ownerName,
            ownerMobile: app2.ownerMobile
          });
          await db.update(homestayApplications).set({
            certificateIssuedDate: /* @__PURE__ */ new Date(),
            certificateNumber: `HP-RC-${Date.now()}`
          }).where(eq42(homestayApplications.id, applicationId));
          break;
        case "resubmit_owner":
          newStatus = "submitted";
          logAction = "correction_resubmitted";
          logFeedback = "Fixed issues (Console Action)";
          break;
        case "resubmit_to_dtdo":
          newStatus = "forwarded_to_dtdo";
          logAction = "correction_resubmitted";
          logFeedback = "Fixed issues & Forwarded to DTDO (Console Action)";
          break;
        default:
          throw new Error("Invalid action: " + action);
      }
      if (newStatus) {
        await db.update(homestayApplications).set({ status: newStatus, updatedAt: /* @__PURE__ */ new Date() }).where(eq42(homestayApplications.id, applicationId));
        await db.insert(applicationActions).values({
          id: randomUUID6(),
          applicationId,
          officerId: systemUserId,
          action: logAction,
          feedback: logFeedback,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      res.json({ success: true, newStatus });
    } catch (error) {
      console.error("Action failed:", error);
      res.status(500).json({ message: "Action failed", error: error.message });
    }
  });
  return router8;
}
var globalTestReports, getSystemUserId, createRandomOwner, createDummyDocs;
var init_dev_tools = __esm({
  "server/routes/dev-tools.ts"() {
    "use strict";
    init_db();
    init_schema();
    globalTestReports = [];
    getSystemUserId = async () => {
      const email = "simulator.system@hp.gov.in";
      const mobile = "9999999999";
      const existing = await db.select().from(users).where(or5(eq42(users.email, email), eq42(users.mobile, mobile))).limit(1);
      if (existing.length > 0) return existing[0].id;
      const id = randomUUID6();
      await db.insert(users).values({
        id,
        email,
        password: "hashed_system_password",
        fullName: "System Simulator",
        mobile,
        role: "district_tourism_officer",
        // Use DTO role to be safe
        district: "Shimla",
        isEmailVerified: true,
        isMobileVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      return id;
    };
    createRandomOwner = async (district) => {
      const id = randomUUID6();
      const timestamp2 = Date.now().toString().slice(-4);
      const user = {
        id,
        email: `test.owner.${Date.now()}@example.com`,
        password: "hashed_password_placeholder",
        fullName: `Test Owner ${timestamp2}`,
        mobile: `98${Math.floor(Math.random() * 1e8).toString().padStart(8, "0")}`,
        role: "property_owner",
        district,
        isEmailVerified: true,
        isMobileVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      await db.insert(users).values(user);
      return id;
    };
    createDummyDocs = async (appId) => {
      const docTypes = ["identity_proof", "property_proof", "revenue_papers"];
      for (const type of docTypes) {
        await db.insert(documents).values({
          id: randomUUID6(),
          applicationId: appId,
          documentType: type,
          filePath: "/uploads/dummy.pdf",
          fileName: `${type}_dummy.pdf`,
          fileSize: 1024,
          mimeType: "application/pdf",
          uploadDate: /* @__PURE__ */ new Date(),
          isVerified: true
        });
      }
    };
  }
});

// server/utils/ccavenue.ts
import crypto7 from "crypto";
var CCAvenueUtil;
var init_ccavenue = __esm({
  "server/utils/ccavenue.ts"() {
    "use strict";
    CCAvenueUtil = class _CCAvenueUtil {
      static {
        // CCAvenue standard IV
        this.IV = Buffer.from("\0\x07\b	\n\v\f\r", "binary");
      }
      static encrypt(plainText, workingKey) {
        try {
          const key = crypto7.createHash("md5").update(workingKey).digest();
          const cipher = crypto7.createCipheriv("aes-128-cbc", key, _CCAvenueUtil.IV);
          let encoded = cipher.update(plainText, "utf8", "hex");
          encoded += cipher.final("hex");
          return encoded;
        } catch (error) {
          console.error("CCAvenue Encryption Error:", error);
          throw new Error("Encryption failed");
        }
      }
      static decrypt(encryptedText, workingKey) {
        try {
          const key = crypto7.createHash("md5").update(workingKey).digest();
          const decipher = crypto7.createDecipheriv("aes-128-cbc", key, _CCAvenueUtil.IV);
          let decoded = decipher.update(encryptedText, "hex", "utf8");
          decoded += decipher.final("utf8");
          return decoded;
        } catch (error) {
          console.error("CCAvenue Decryption Error:", error);
          throw new Error("Decryption failed");
        }
      }
      // Helper to format query string for CCAvenue
      static jsonToQueryString(json) {
        return Object.keys(json).map((key) => `${key}=${json[key]}`).join("&");
      }
      // Helper to parse response string (k=v&k2=v2)
      static queryStringToJson(qs) {
        const result = {};
        const pairs = qs.split("&");
        for (const pair of pairs) {
          const [key, value] = pair.split("=");
          if (key) {
            result[key] = value || "";
          }
        }
        return result;
      }
    };
  }
});

// server/routes/ccavenue-test.ts
var ccavenue_test_exports = {};
__export(ccavenue_test_exports, {
  createCCAvenueTestRouter: () => createCCAvenueTestRouter
});
import express24 from "express";
function createCCAvenueTestRouter() {
  const router8 = express24.Router();
  const testLog = logger.child({ module: "ccavenue-test" });
  router8.get("/config", (req, res) => {
    res.json({
      merchantId: process.env.CCAVENUE_MERCHANT_ID || "",
      accessCode: process.env.CCAVENUE_ACCESS_CODE || "",
      workingKey: process.env.CCAVENUE_WORKING_KEY || "",
      gatewayUrl: process.env.CCAVENUE_URL || "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
      environment: process.env.CCAVENUE_ENV || "test"
    });
  });
  router8.post("/encrypt", (req, res) => {
    try {
      const { workingKey, data } = req.body;
      if (!workingKey || !data) {
        return res.status(400).json({ error: "Missing workingKey or data" });
      }
      let plainText = data;
      if (typeof data === "object") {
        plainText = CCAvenueUtil.jsonToQueryString(data);
      }
      const encRequest = CCAvenueUtil.encrypt(plainText, workingKey);
      res.json({ encRequest });
    } catch (error) {
      testLog.error("Encryption failed", error);
      res.status(500).json({ error: error.message });
    }
  });
  router8.post("/decrypt", (req, res) => {
    try {
      const { workingKey, encResponse } = req.body;
      if (!workingKey || !encResponse) {
        return res.status(400).json({ error: "Missing workingKey or encResponse" });
      }
      const decrypted = CCAvenueUtil.decrypt(encResponse, workingKey);
      let parsed2 = decrypted;
      try {
        if (decrypted.trim().startsWith("{") || decrypted.trim().startsWith("[")) {
          parsed2 = JSON.parse(decrypted);
        } else if (decrypted.includes("=")) {
          parsed2 = CCAvenueUtil.queryStringToJson(decrypted);
        }
      } catch (e) {
      }
      res.json({ decrypted, parsed: parsed2 });
    } catch (error) {
      testLog.error("Decryption failed", error);
      res.status(500).json({ error: error.message });
    }
  });
  router8.post("/callback", (req, res) => {
    try {
      const { encResp, orderNo } = req.body;
      const { workingKey, frontendUrl } = req.query;
      testLog.info({ body: req.body, query: req.query }, "Received CCAvenue Callback");
      if (!encResp || !workingKey) {
        return res.status(400).send("Missing encResp or workingKey");
      }
      const decrypted = CCAvenueUtil.decrypt(encResp, String(workingKey));
      const resultBase64 = Buffer.from(decrypted).toString("base64");
      const targetUrl = frontendUrl || "/payment/ccavenue-test";
      res.redirect(`${targetUrl}?response=${resultBase64}`);
    } catch (error) {
      testLog.error("Callback processing failed", error);
      res.status(500).send("Callback Error: " + error.message);
    }
  });
  return router8;
}
var init_ccavenue_test = __esm({
  "server/routes/ccavenue-test.ts"() {
    "use strict";
    init_ccavenue();
    init_logger();
  }
});

// server/routes/ccavenue.ts
var ccavenue_exports = {};
__export(ccavenue_exports, {
  default: () => ccavenue_default
});
import { Router as Router9 } from "express";
import { eq as eq43, sql as sql13 } from "drizzle-orm";
import { nanoid as nanoid4 } from "nanoid";
var router7, ccavenueLogger, buildCallbackPage2, ccavenue_default;
var init_ccavenue2 = __esm({
  "server/routes/ccavenue.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_ccavenue();
    init_logger();
    init_systemSettings();
    router7 = Router9();
    ccavenueLogger = logger.child({ module: "ccavenue" });
    buildCallbackPage2 = (options) => {
      const toneColor = options.tone === "success" ? "#0f766e" : options.tone === "pending" ? "#ca8a04" : "#b91c1c";
      const toneBg = options.tone === "success" ? "#ecfdf5" : options.tone === "pending" ? "#fef9c3" : "#fee2e2";
      const metaRefresh = options.redirectUrl ? `<meta http-equiv="refresh" content="4;url=${options.redirectUrl}" />` : "";
      return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${options.heading}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${metaRefresh}
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(160deg, #f6faff 0%, #f1f5f9 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        color: #0f172a;
      }
      .card {
        width: min(560px, 100%);
        background: #ffffff;
        border-radius: 20px;
        padding: 32px 36px;
        box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.25);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: ${toneBg};
        color: ${toneColor};
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 0.85rem;
        width: fit-content;
      }
      h1 {
        font-size: clamp(1.5rem, 2vw, 1.9rem);
        margin: 0;
      }
      p {
        margin: 0;
        line-height: 1.55;
        color: #334155;
      }
      .summary {
        margin-top: 8px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }
      .summary-item span:first-child {
        color: #475569;
      }
      .cta {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cta a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 999px;
        text-decoration: none;
        background: #0f172a;
        color: #fff;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .cta small {
        color: #64748b;
        font-size: 0.8rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">${options.heading}</span>
      <div>
        <p>${options.description}</p>
        <p>${options.followUp}</p>
      </div>
      <div class="summary">
        ${options.orderId ? `<div class="summary-item"><span>Order ID</span><span>${options.orderId}</span></div>` : ""}
        ${options.trackingId ? `<div class="summary-item"><span>Transaction Ref</span><span>${options.trackingId}</span></div>` : ""}
        ${options.amount !== void 0 && options.amount !== null ? `<div class="summary-item"><span>Amount</span><span>\u20B9${Number(options.amount).toLocaleString("en-IN")}</span></div>` : ""}
      </div>
      ${options.redirectUrl ? `<div class="cta">
        <a href="${options.redirectUrl}">Return to HP Tourism Portal</a>
        <small>You will be redirected automatically in a few seconds.</small>
      </div>` : ""}
    </div>
  </body>
</html>`;
    };
    router7.get("/application/:id/transactions", async (req, res) => {
      try {
        const { id } = req.params;
        const transactions = await db.select().from(ccavenueTransactions).where(eq43(ccavenueTransactions.applicationId, id)).orderBy(sql13`${ccavenueTransactions.createdAt} DESC`);
        res.json({ transactions });
      } catch (error) {
        ccavenueLogger.error({ err: error }, "Failed to fetch CCAvenue transactions");
        res.status(500).json({ error: "Failed to fetch transactions" });
      }
    });
    router7.post("/initiate", async (req, res) => {
      try {
        const { applicationId } = req.body;
        if (!applicationId) {
          return res.status(400).json({ error: "Application ID is required" });
        }
        const [application] = await db.select().from(homestayApplications).where(eq43(homestayApplications.id, applicationId)).limit(1);
        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }
        const paymentWorkflow = await getPaymentWorkflow();
        const isStandardPaymentStatus = application.status === "payment_pending" || application.status === "verified_for_payment";
        const isDraftPaymentAllowed = paymentWorkflow === "upfront" && application.status === "draft";
        if (!isStandardPaymentStatus && !isDraftPaymentAllowed) {
          return res.status(400).json({
            error: "Application is not ready for payment",
            currentStatus: application.status
          });
        }
        if (isDraftPaymentAllowed) {
          const documentsArray = application.documents;
          const hasDocuments = Array.isArray(documentsArray) && documentsArray.length > 0;
          if (!hasDocuments) {
            return res.status(400).json({
              error: "Please upload required documents before submitting payment"
            });
          }
        }
        if (!application.totalFee) {
          return res.status(400).json({ error: "Total fee calculation missing" });
        }
        let amount = parseFloat(application.totalFee.toString());
        const [testModeSetting] = await db.select().from(systemSettings).where(eq43(systemSettings.settingKey, "payment_test_mode")).limit(1);
        const isTestMode = testModeSetting ? testModeSetting.settingValue.enabled : false;
        if (isTestMode) {
          amount = 1;
        }
        const {
          CCAVENUE_MERCHANT_ID,
          CCAVENUE_ACCESS_CODE,
          CCAVENUE_WORKING_KEY,
          CCAVENUE_URL
        } = process.env;
        const accessCode = CCAVENUE_ACCESS_CODE || "";
        const workingKey = CCAVENUE_WORKING_KEY || "";
        const merchantId = CCAVENUE_MERCHANT_ID || "";
        const paymentUrl = CCAVENUE_URL || "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
        if (!accessCode || !workingKey || !merchantId) {
          throw new Error("CCAvenue credentials not configured");
        }
        const orderId = `HPT-${Date.now()}-${nanoid4(6)}`;
        const cleanStr = (str) => (str || "").replace(/[^a-zA-Z0-9\s]/g, "").trim();
        const billingName = cleanStr(application.ownerName);
        const billingAddress = cleanStr(application.address).substring(0, 100);
        const billingCity = cleanStr(application.district);
        const billingZip = cleanStr(application.pincode);
        const billingTel = cleanStr(application.ownerMobile);
        const billingEmail = application.ownerEmail || "noreply@hp.gov.in";
        const host = req.get("host");
        const protocol = req.protocol === "http" && host?.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;
        const redirectUrl = `${baseUrl}/api/ccavenue/callback`;
        const cancelUrl = `${baseUrl}/api/ccavenue/callback`;
        const paymentData = {
          merchant_id: merchantId,
          order_id: orderId,
          currency: "INR",
          amount: amount.toFixed(2),
          redirect_url: redirectUrl,
          cancel_url: cancelUrl,
          language: "EN",
          billing_name: billingName,
          billing_address: billingAddress,
          billing_city: billingCity,
          billing_zip: billingZip,
          billing_country: "India",
          billing_tel: billingTel,
          billing_email: billingEmail,
          // Optional custom fields to track application ID
          merchant_param1: applicationId,
          merchant_param2: "hptourism",
          merchant_param3: isTestMode ? "test_mode" : "production"
        };
        const encRequest = CCAvenueUtil.encrypt(CCAvenueUtil.jsonToQueryString(paymentData), workingKey);
        await db.insert(ccavenueTransactions).values({
          applicationId,
          orderId,
          amount: amount.toString(),
          billingName,
          billingAddress,
          billingCity,
          billingZip,
          billingTel,
          billingEmail,
          paymentMode: "CCAvenue",
          orderStatus: "Initiated",
          transDate: /* @__PURE__ */ new Date()
        });
        ccavenueLogger.info({ orderId, applicationId, amount }, "Initiated CCAvenue payment");
        res.json({
          success: true,
          paymentUrl,
          // This is the URL the form action points to
          accessCode,
          encRequest,
          orderId,
          isTestMode
        });
      } catch (error) {
        ccavenueLogger.error({ err: error }, "CCAvenue initiation failed");
        res.status(500).json({ error: "Failed to initiate payment" });
      }
    });
    router7.post("/callback", async (req, res) => {
      try {
        const { encResp } = req.body;
        const workingKey = process.env.CCAVENUE_WORKING_KEY || "";
        if (!encResp) {
          return res.status(400).send("Missing encrypted response");
        }
        const decryptedResp = CCAvenueUtil.decrypt(encResp, workingKey);
        const data = CCAvenueUtil.queryStringToJson(decryptedResp);
        ccavenueLogger.info({ orderId: data.order_id, status: data.order_status }, "Received CCAvenue callback");
        const orderId = data.order_id;
        const trackingId = data.tracking_id;
        const bankRefNo = data.bank_ref_no;
        const orderStatus = data.order_status;
        const failureMessage = data.failure_message;
        const paymentMode = data.payment_mode;
        const cardName = data.card_name;
        const statusCode = data.status_code;
        const statusMessage = data.status_message;
        const applicationId = data.merchant_param1;
        await db.update(ccavenueTransactions).set({
          trackingId,
          bankRefNo,
          orderStatus,
          failureMessage,
          paymentMode,
          cardName,
          statusCode,
          statusMessage,
          transDate: /* @__PURE__ */ new Date(),
          // Update timestamp
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq43(ccavenueTransactions.orderId, orderId));
        let redirectUrl = "/applications";
        if (orderStatus === "Success") {
          const [transaction] = await db.select().from(ccavenueTransactions).where(eq43(ccavenueTransactions.orderId, orderId)).limit(1);
          if (transaction && transaction.applicationId) {
            redirectUrl = `/applications/${transaction.applicationId}`;
            const [currentApp] = await db.select().from(homestayApplications).where(eq43(homestayApplications.id, transaction.applicationId)).limit(1);
            if (currentApp) {
              if (currentApp.status === "draft") {
                const submitMode = await getUpfrontSubmitMode();
                const targetStatus = submitMode === "auto" ? "submitted" : "paid_pending_submit";
                await db.update(homestayApplications).set({
                  status: targetStatus,
                  paymentStatus: "paid",
                  paymentId: trackingId,
                  // Use CCAvenue tracking ID
                  paymentAmount: transaction.amount,
                  paymentDate: /* @__PURE__ */ new Date(),
                  submittedAt: submitMode === "auto" ? /* @__PURE__ */ new Date() : void 0
                }).where(eq43(homestayApplications.id, currentApp.id));
              } else {
                await db.update(homestayApplications).set({
                  paymentStatus: "paid",
                  paymentId: trackingId,
                  paymentAmount: transaction.amount,
                  paymentDate: /* @__PURE__ */ new Date(),
                  // Only change status if it was payment_pending, to avoid reverting other states
                  ...currentApp.status === "payment_pending" ? { status: "payment_verified" } : {}
                  // 'payment_verified' isn't a standard enum in schema?
                  // Schema says: 'payment_pending', 'approved', 'rejected'
                  // Usually after payment, it goes to 'approved' or 'processing_certificate'.
                  // Let's stick to updating paymentStatus to 'paid'. The Admin/Officer workflow will take it from there or auto-approve jobs will pick it up.
                }).where(eq43(homestayApplications.id, currentApp.id));
              }
            }
          }
        }
        const isSuccess = orderStatus === "Success";
        const pageHtml = buildCallbackPage2({
          heading: isSuccess ? "Payment Successful" : "Payment Failed",
          description: isSuccess ? "Your payment via Kotak Mahindra Gateway was successful." : `Payment failed. Status: ${orderStatus}`,
          followUp: isSuccess ? "You will be redirected to your application shortly." : "Please try again or contact support if the issue persists.",
          tone: isSuccess ? "success" : "error",
          orderId,
          trackingId,
          amount: parseFloat(data.amount || "0"),
          redirectUrl
        });
        res.send(pageHtml);
      } catch (error) {
        ccavenueLogger.error({ err: error }, "CCAvenue callback handling failed");
        res.status(500).send("An error occurred while processing the payment response.");
      }
    });
    ccavenue_default = router7;
  }
});

// server/index.ts
import express26 from "express";

// server/routes.ts
init_db();
init_storage();
import { createServer } from "http";
import session2 from "express-session";
import connectPgSimple from "connect-pg-simple";

// server/audit.ts
init_db();
init_schema();
init_logger();
async function logApplicationAction({
  applicationId,
  actorId,
  action,
  previousStatus,
  newStatus,
  feedback
}) {
  if (!actorId) {
    logger.warn("[timeline] Skipping log due to missing actor", {
      applicationId,
      action
    });
    return;
  }
  try {
    await db.insert(applicationActions).values({
      applicationId,
      officerId: actorId,
      action,
      previousStatus: previousStatus ?? null,
      newStatus: newStatus ?? null,
      feedback: feedback ?? null
    });
  } catch (error) {
    logger.error({ err: error, applicationId, action }, "[timeline] Failed to log application action");
  }
}

// server/routes.ts
init_logger();

// server/himkosh/crypto.ts
init_config2();
init_logger();
import crypto2 from "crypto";
import { promises as fs4 } from "fs";
var HimKoshCrypto = class {
  constructor(keyFilePath) {
    this.key = null;
    this.iv = null;
    this.log = logger.child({ module: "himkosh-crypto" });
    this.keyFilePath = resolveKeyFilePath(keyFilePath);
  }
  /**
   * Load encryption key and IV from file
   * CRITICAL FIX #3: DLL uses IV = key (first 16 bytes), NOT separate IV
   * Key file format from CTP:
   * - Must be exactly 16 bytes for the key
   * - IV is set equal to the key (actual DLL behavior)
   */
  async loadKey() {
    if (this.key && this.iv) {
      this.log.debug("Using cached key/IV");
      return { key: this.key, iv: this.iv };
    }
    try {
      this.log.debug("Loading key from file", { path: this.keyFilePath });
      const keyData = await fs4.readFile(this.keyFilePath);
      this.log.debug("Read key file", { bytes: keyData.length });
      const keyBytes = Buffer.alloc(16);
      keyData.copy(keyBytes, 0, 0, Math.min(16, keyData.length));
      this.key = keyBytes;
      this.log.debug("Key loaded", { bytes: 16 });
      this.iv = keyBytes;
      this.log.debug("IV aligned with key (DLL behavior)");
      return { key: this.key, iv: this.iv };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Key file not found at: ${this.keyFilePath}. Please obtain echallan.key from CTP team or set HIMKOSH_KEY_FILE_PATH.`);
    }
  }
  /**
   * Encrypt data string using AES-128-CBC
   * .NET backend expects ASCII encoding (NOT UTF-8)
   * @param textToEncrypt - Plain text string to encrypt
   * @returns Base64 encoded encrypted string
   */
  async encrypt(textToEncrypt) {
    try {
      const { key, iv } = await this.loadKey();
      const cipher = crypto2.createCipheriv("aes-128-cbc", key, iv);
      let encrypted = cipher.update(textToEncrypt, "ascii", "base64");
      encrypted += cipher.final("base64");
      return encrypted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Encryption failed: ${error.message}`);
      }
      throw error;
    }
  }
  /**
   * Decrypt data string using AES-128-CBC
   * .NET backend uses ASCII encoding (NOT UTF-8)
   * @param textToDecrypt - Base64 encoded encrypted string
   * @returns Decrypted plain text string
   */
  async decrypt(textToDecrypt) {
    try {
      const { key, iv } = await this.loadKey();
      const decipher = crypto2.createDecipheriv("aes-128-cbc", key, iv);
      let decrypted = decipher.update(textToDecrypt, "base64", "ascii");
      decrypted += decipher.final("ascii");
      return decrypted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Decryption failed: ${error.message}`);
      }
      throw error;
    }
  }
  /**
   * Generate MD5 checksum for data string.
   * HimKosh reference DLL emits lowercase hexadecimal using UTF-8 bytes.
   * @param dataString - String to generate checksum for
   * @returns MD5 checksum in lowercase hexadecimal
   */
  static generateChecksum(dataString) {
    const hash2 = crypto2.createHash("md5");
    hash2.update(dataString, "utf8");
    return hash2.digest("hex");
  }
  /**
   * Verify checksum of received data
   * @param dataString - Data string without checksum
   * @param receivedChecksum - Checksum to verify against
   * @returns true if checksums match (case-insensitive comparison)
   */
  static verifyChecksum(dataString, receivedChecksum) {
    const calculatedChecksum = this.generateChecksum(dataString);
    return calculatedChecksum.toUpperCase() === receivedChecksum.toUpperCase();
  }
};
function buildRequestString(params) {
  const coreParts = [
    `DeptID=${params.deptId}`,
    `DeptRefNo=${params.deptRefNo}`,
    `TotalAmount=${Math.round(params.totalAmount)}`,
    // Ensure integer
    `TenderBy=${params.tenderBy}`,
    `AppRefNo=${params.appRefNo}`,
    `Head1=${params.head1}`,
    `Amount1=${Math.round(params.amount1)}`
    // Ensure integer
  ];
  if (params.head2 && params.amount2 !== void 0 && Math.round(params.amount2) > 0) {
    coreParts.push(`Head2=${params.head2}`);
    coreParts.push(`Amount2=${Math.round(params.amount2)}`);
  }
  coreParts.push(`Ddo=${params.ddo}`);
  coreParts.push(`PeriodFrom=${params.periodFrom}`);
  coreParts.push(`PeriodTo=${params.periodTo}`);
  if (params.head3 && params.amount3 && params.amount3 > 0) {
    coreParts.push(`Head3=${params.head3}`);
    coreParts.push(`Amount3=${Math.round(params.amount3)}`);
  }
  if (params.head4 && params.amount4 && params.amount4 > 0) {
    coreParts.push(`Head4=${params.head4}`);
    coreParts.push(`Amount4=${Math.round(params.amount4)}`);
  }
  if (params.head10 && params.amount10 && params.amount10 > 0) {
    coreParts.push(`Head10=${params.head10}`);
    coreParts.push(`Amount10=${Math.round(params.amount10)}`);
  }
  if (params.head10 && params.amount10 && params.amount10 > 0) {
    coreParts.push(`Head10=${params.head10}`);
    coreParts.push(`Amount10=${Math.round(params.amount10)}`);
  }
  if (params.serviceCode) {
    coreParts.push(`Service_code=${params.serviceCode}`);
  }
  if (params.returnUrl) {
    coreParts.push(`return_url=${params.returnUrl}`);
  }
  const dataString = coreParts.join("|");
  return { coreString: dataString, fullString: dataString };
}
function parseResponseString(responseString) {
  const parts = responseString.split("|");
  const data = {};
  for (const part of parts) {
    const [rawKey, value] = part.split("=");
    if (rawKey && value !== void 0) {
      const key = rawKey.trim().toLowerCase();
      data[key] = value;
    }
  }
  return {
    echTxnId: data.echtxnid || "",
    bankCIN: data.bankcin || "",
    bank: data.bank || "",
    status: data.status || "",
    statusCd: data.statuscd || "",
    appRefNo: data.apprefno || "",
    amount: data.amount || "",
    paymentDate: data.payment_date || "",
    deptRefNo: data.deptrefno || "",
    bankName: data.bankname || "",
    checksum: data.checksum || ""
  };
}
function buildVerificationString(params) {
  const dataString = `AppRefNo=${params.appRefNo}|Service_code=${params.serviceCode}|merchant_code=${params.merchantCode}`;
  const checksum = HimKoshCrypto.generateChecksum(dataString);
  return `${dataString}|checkSum=${checksum}`;
}

// server/routes.ts
init_schema();

// shared/uploadPolicy.ts
var UPLOAD_POLICY_SETTING_KEY = "upload_policy";
var DEFAULT_UPLOAD_POLICY = {
  documents: {
    // Allow PDF and images for supporting documents (including Additional Documents)
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxFileSizeMB: 25
  },
  photos: {
    // Extended to also allow PDF for mixed uploads (e.g., supporting documents)
    allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
    maxFileSizeMB: 25
  },
  totalPerApplicationMB: 100
};
var normalizeUploadPolicy = (value) => {
  const toArray = (input) => {
    if (!Array.isArray(input)) return [];
    return input.map((item) => typeof item === "string" ? item.trim().toLowerCase() : "").filter((item) => item.length > 0);
  };
  const toNumber = (input, fallback) => {
    if (typeof input === "number" && Number.isFinite(input) && input > 0) {
      return input;
    }
    if (typeof input === "string") {
      const parsed2 = Number(input);
      if (Number.isFinite(parsed2) && parsed2 > 0) {
        return parsed2;
      }
    }
    return fallback;
  };
  const asCategoryPolicy = (input, defaults) => ({
    allowedMimeTypes: toArray(input?.allowedMimeTypes).length ? toArray(input?.allowedMimeTypes) : defaults.allowedMimeTypes,
    allowedExtensions: toArray(input?.allowedExtensions).length ? toArray(input?.allowedExtensions) : defaults.allowedExtensions,
    maxFileSizeMB: toNumber(input?.maxFileSizeMB, defaults.maxFileSizeMB)
  });
  if (typeof value !== "object" || !value) {
    return DEFAULT_UPLOAD_POLICY;
  }
  return {
    documents: asCategoryPolicy(
      value.documents,
      DEFAULT_UPLOAD_POLICY.documents
    ),
    photos: asCategoryPolicy(
      value.photos,
      DEFAULT_UPLOAD_POLICY.photos
    ),
    totalPerApplicationMB: toNumber(
      value.totalPerApplicationMB,
      DEFAULT_UPLOAD_POLICY.totalPerApplicationMB
    )
  };
};

// shared/appSettings.ts
var ENFORCE_CATEGORY_SETTING_KEY = "enforce_property_category";
var DA_SEND_BACK_SETTING_KEY = "da_send_back_enabled";
var LOGIN_OTP_SETTING_KEY = "login_otp_required";
var SINGLE_SESSION_SETTING_KEY = "enforce_single_session";
var ROOM_RATE_BANDS_SETTING_KEY = "category_rate_bands";
var ROOM_CALC_MODE_SETTING_KEY = "room_calc_mode";
var EXISTING_RC_MIN_ISSUE_DATE_SETTING_KEY = "existing_owner_min_issue_date";
var ENABLE_LEGACY_REGISTRATION_SETTING_KEY = "enable_legacy_registrations";
var DEFAULT_CATEGORY_ENFORCEMENT = {
  enforce: false,
  lockToRecommended: false
};
var DEFAULT_CATEGORY_RATE_BANDS = {
  silver: { min: 1, max: 2999 },
  gold: { min: 3e3, max: 1e4 },
  diamond: { min: 1e4, max: null }
};
var DEFAULT_ROOM_CALC_MODE = { mode: "direct" };
var normalizeBooleanSetting = (value, defaultValue = false) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  if (value && typeof value === "object") {
    const candidate = value.enabled;
    if (typeof candidate === "boolean") {
      return candidate;
    }
    if (typeof candidate === "string") {
      const normalized = candidate.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
  }
  return defaultValue;
};
var normalizeCategoryEnforcementSetting = (value) => {
  const normalizeObject = (obj) => ({
    enforce: typeof obj.enforce === "boolean" ? obj.enforce : false,
    lockToRecommended: typeof obj.lockToRecommended === "boolean" ? obj.lockToRecommended : false
  });
  if (typeof value === "boolean") {
    return { enforce: value, lockToRecommended: false };
  }
  if (value && typeof value === "object") {
    return normalizeObject(value);
  }
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return { enforce: true, lockToRecommended: false };
    }
    if (value.toLowerCase() === "false") {
      return { enforce: false, lockToRecommended: false };
    }
  }
  return DEFAULT_CATEGORY_ENFORCEMENT;
};
var normalizeCategoryRateBands = (value) => {
  const normalizeBand = (band, fallback) => {
    const min = typeof band?.min === "number" && Number.isFinite(band.min) ? Math.max(0, Math.floor(band.min)) : fallback.min;
    if (fallback.max === null) {
      return {
        min,
        max: null
      };
    }
    const rawMax = typeof band?.max === "number" && Number.isFinite(band.max) ? Math.max(min, Math.floor(band.max)) : band?.max === null ? null : fallback.max;
    return {
      min,
      max: rawMax === null ? null : rawMax
    };
  };
  if (value && typeof value === "object") {
    const obj = value;
    return {
      silver: normalizeBand(obj.silver, DEFAULT_CATEGORY_RATE_BANDS.silver),
      gold: normalizeBand(obj.gold, DEFAULT_CATEGORY_RATE_BANDS.gold),
      diamond: normalizeBand(obj.diamond, DEFAULT_CATEGORY_RATE_BANDS.diamond)
    };
  }
  return DEFAULT_CATEGORY_RATE_BANDS;
};
var DEFAULT_EXISTING_RC_MIN_ISSUE_DATE = "2022-01-01";
var normalizeIsoDateSetting = (value, fallback) => {
  if (typeof value === "string" && value.trim().length >= 4) {
    return value.trim();
  }
  if (value && typeof value === "object" && typeof value.date === "string") {
    return String(value.date);
  }
  return fallback;
};
var normalizeRoomCalcModeSetting = (value) => {
  const normalizeMode = (mode) => {
    if (mode === "buckets" || mode === "direct") {
      return mode;
    }
    return DEFAULT_ROOM_CALC_MODE.mode;
  };
  if (typeof value === "string") {
    return { mode: normalizeMode(value.trim().toLowerCase()) };
  }
  if (value && typeof value === "object") {
    const candidate = value.mode;
    return { mode: normalizeMode(typeof candidate === "string" ? candidate.trim().toLowerCase() : void 0) };
  }
  return DEFAULT_ROOM_CALC_MODE;
};
var WOMAN_DISCOUNT_MODE_SETTING_KEY = "woman_discount_mode";
var DEFAULT_WOMAN_DISCOUNT_MODE = "SEQUENTIAL";
var normalizeWomanDiscountMode = (value) => {
  if (typeof value === "string") {
    const v = value.trim().toUpperCase();
    if (v === "ADDITIVE" || v === "SEQUENTIAL") return v;
  }
  if (value && typeof value === "object") {
    const v = String(value.mode || "").trim().toUpperCase();
    if (v === "ADDITIVE" || v === "SEQUENTIAL") return v;
  }
  return DEFAULT_WOMAN_DISCOUNT_MODE;
};
var MAINTENANCE_MODE_SETTING_KEY = "maintenance_mode_config";
var MAINTENANCE_MESSAGE_PRESETS = [
  "System Upgrade in Progress",
  "Scheduled Maintenance",
  "Technical Issue - We are investigating",
  "Portal is temporarily offline"
];
var DEFAULT_MAINTENANCE_MODE = {
  enabled: false,
  accessKey: "launch2026",
  messageType: "System Upgrade in Progress",
  customMessage: ""
};
var normalizeMaintenanceModeSetting = (value) => {
  const defaults = DEFAULT_MAINTENANCE_MODE;
  if (!value || typeof value !== "object") return defaults;
  const obj = value;
  let messageType = defaults.messageType;
  if (typeof obj.messageType === "string") {
    if (MAINTENANCE_MESSAGE_PRESETS.includes(obj.messageType)) {
      messageType = obj.messageType;
    } else if (obj.messageType === "custom") {
      messageType = "custom";
    }
  }
  return {
    enabled: typeof obj.enabled === "boolean" ? obj.enabled : typeof obj.enabled === "string" ? obj.enabled === "true" : defaults.enabled,
    accessKey: typeof obj.accessKey === "string" && obj.accessKey.trim().length > 0 ? obj.accessKey.trim() : defaults.accessKey,
    messageType,
    customMessage: typeof obj.customMessage === "string" ? obj.customMessage.trim() : defaults.customMessage
  };
};
var PAYMENT_PIPELINE_PAUSE_SETTING_KEY = "payment_pipeline_pause";
var PAYMENT_PAUSE_PRESET_MESSAGES = [
  "Payment process is being updated",
  "Payment services are temporarily unavailable",
  "Payment gateway under maintenance",
  "Online payment is currently paused"
];
var DEFAULT_PAYMENT_PIPELINE_PAUSE = {
  enabled: false,
  messageType: "Payment process is being updated",
  customMessage: "",
  pausedAt: null,
  pausedBy: null
};
var normalizePaymentPipelinePauseSetting = (value) => {
  const defaults = DEFAULT_PAYMENT_PIPELINE_PAUSE;
  if (!value || typeof value !== "object") return defaults;
  const obj = value;
  let messageType = defaults.messageType;
  if (typeof obj.messageType === "string") {
    if (PAYMENT_PAUSE_PRESET_MESSAGES.includes(obj.messageType)) {
      messageType = obj.messageType;
    } else if (obj.messageType === "custom") {
      messageType = "custom";
    }
  }
  return {
    enabled: typeof obj.enabled === "boolean" ? obj.enabled : defaults.enabled,
    messageType,
    customMessage: typeof obj.customMessage === "string" ? obj.customMessage.trim() : defaults.customMessage,
    pausedAt: typeof obj.pausedAt === "string" ? obj.pausedAt : null,
    pausedBy: typeof obj.pausedBy === "string" ? obj.pausedBy : null
  };
};
var getPaymentPauseMessage = (setting) => {
  if (setting.messageType === "custom" && setting.customMessage.trim().length > 0) {
    return setting.customMessage.trim();
  }
  if (PAYMENT_PAUSE_PRESET_MESSAGES.includes(setting.messageType)) {
    return setting.messageType;
  }
  return DEFAULT_PAYMENT_PIPELINE_PAUSE.messageType;
};

// server/routes.ts
import { z as z13 } from "zod";
import bcrypt8 from "bcrypt";
import { eq as eq44, desc as desc16, and as and16, or as or6, sql as sql14, inArray as inArray8 } from "drizzle-orm";

// server/routes/settings.ts
init_db();
init_schema();
import { Router } from "express";
import { eq as eq2 } from "drizzle-orm";
init_middleware();
function createSettingsRouter() {
  const router8 = Router();
  router8.get("/api/settings/woman-discount-mode", async (req, res) => {
    try {
      const setting = await db.query.systemSettings.findFirst({
        where: eq2(systemSettings.settingKey, WOMAN_DISCOUNT_MODE_SETTING_KEY)
      });
      const mode = normalizeWomanDiscountMode(setting?.settingValue);
      res.json({ mode });
    } catch (error) {
      console.error("Failed to fetch woman discount setting:", error);
      res.json({ mode: DEFAULT_WOMAN_DISCOUNT_MODE });
    }
  });
  router8.post("/api/settings/woman-discount-mode", requireRole("admin"), async (req, res) => {
    try {
      const { mode } = req.body;
      const validMode = normalizeWomanDiscountMode(mode);
      await db.insert(systemSettings).values({
        settingKey: WOMAN_DISCOUNT_MODE_SETTING_KEY,
        settingValue: { mode: validMode },
        description: "Configuration for woman owner discount calculation (Additive vs Sequential)",
        updatedBy: req.user?.id
      }).onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: { mode: validMode },
          updatedBy: req.user?.id,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      res.json({ success: true, mode: validMode });
    } catch (error) {
      console.error("Failed to update woman discount setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  router8.get("/api/settings/enforce-single-session", async (req, res) => {
    try {
      const setting = await db.query.systemSettings.findFirst({
        where: eq2(systemSettings.settingKey, SINGLE_SESSION_SETTING_KEY)
      });
      const enabled = normalizeBooleanSetting(setting?.settingValue, false);
      res.json({ enabled });
    } catch (error) {
      console.error("Failed to fetch single session setting:", error);
      res.json({ enabled: false });
    }
  });
  router8.post("/api/settings/enforce-single-session", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      const boolValue = enabled === true || enabled === "true";
      await db.insert(systemSettings).values({
        settingKey: SINGLE_SESSION_SETTING_KEY,
        settingValue: boolValue,
        description: "Enforce single concurrent session per user (kicks old sessions on new login)",
        updatedBy: req.user?.id
      }).onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: boolValue,
          updatedBy: req.user?.id,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      res.json({ success: true, enabled: boolValue });
    } catch (error) {
      console.error("Failed to update single session setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  router8.get("/api/settings/maintenance-mode", async (req, res) => {
    try {
      const setting = await db.query.systemSettings.findFirst({
        where: eq2(systemSettings.settingKey, MAINTENANCE_MODE_SETTING_KEY)
      });
      const config2 = normalizeMaintenanceModeSetting(setting?.settingValue);
      res.json(config2);
    } catch (error) {
      console.error("Failed to fetch maintenance mode setting:", error);
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });
  router8.post("/api/settings/maintenance-mode", requireRole("admin", "super_admin"), async (req, res) => {
    try {
      const { enabled, accessKey, messageType, customMessage } = req.body;
      const validConfig = normalizeMaintenanceModeSetting({ enabled, accessKey, messageType, customMessage });
      await db.insert(systemSettings).values({
        settingKey: MAINTENANCE_MODE_SETTING_KEY,
        settingValue: validConfig,
        description: "Global Maintenance Mode Configuration",
        updatedBy: req.user?.id
      }).onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: validConfig,
          updatedBy: req.user?.id,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      res.json({ success: true, config: validConfig });
    } catch (error) {
      console.error("Failed to update maintenance mode setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  router8.get("/api/settings/enable-legacy-registrations", async (req, res) => {
    try {
      const setting = await db.query.systemSettings.findFirst({
        where: eq2(systemSettings.settingKey, ENABLE_LEGACY_REGISTRATION_SETTING_KEY)
      });
      const enabled = normalizeBooleanSetting(setting?.settingValue, true);
      res.json({ enabled });
    } catch (error) {
      console.error("Failed to fetch legacy registration setting:", error);
      res.json({ enabled: true });
    }
  });
  router8.post("/api/settings/enable-legacy-registrations", requireRole("admin", "super_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      const boolValue = enabled === true || enabled === "true";
      await db.insert(systemSettings).values({
        settingKey: ENABLE_LEGACY_REGISTRATION_SETTING_KEY,
        settingValue: boolValue,
        description: "Allow existing owners to register (Legacy/RC flow)",
        updatedBy: req.user?.id
      }).onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: boolValue,
          updatedBy: req.user?.id,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      res.json({ success: true, enabled: boolValue });
    } catch (error) {
      console.error("Failed to update legacy registration setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  router8.get("/api/settings/payment-pipeline-pause", async (req, res) => {
    try {
      const setting = await db.query.systemSettings.findFirst({
        where: eq2(systemSettings.settingKey, PAYMENT_PIPELINE_PAUSE_SETTING_KEY)
      });
      const config2 = normalizePaymentPipelinePauseSetting(setting?.settingValue);
      res.json(config2);
    } catch (error) {
      console.error("Failed to fetch payment pipeline pause setting:", error);
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });
  router8.post("/api/settings/payment-pipeline-pause", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled, messageType, customMessage } = req.body;
      const userId = req.user?.id || null;
      const validConfig = normalizePaymentPipelinePauseSetting({
        enabled,
        messageType,
        customMessage,
        pausedAt: enabled ? (/* @__PURE__ */ new Date()).toISOString() : null,
        pausedBy: enabled ? userId : null
      });
      await db.insert(systemSettings).values({
        settingKey: PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
        settingValue: validConfig,
        description: "Payment Pipeline Pause Configuration",
        updatedBy: userId
      }).onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: validConfig,
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      console.log(`[CRITICAL] Payment Pipeline Pause updated: enabled=${enabled} by user=${userId}`);
      res.json({ success: true, config: validConfig });
    } catch (error) {
      console.error("Failed to update payment pipeline pause setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  return router8;
}

// server/routes/public.ts
init_db();
init_schema();
init_logger();
import express from "express";
import { eq as eq3 } from "drizzle-orm";
var log = logger.child({ module: "public-router" });
function createPublicRouter() {
  const router8 = express.Router();
  router8.get("/stats", async (_req, res) => {
    try {
      const allApplications = await db.select().from(homestayApplications);
      const realtime = allApplications.reduce(
        (acc, app2) => {
          acc.total++;
          if (app2.status === "approved") acc.approved++;
          else if (app2.status === "rejected") acc.rejected++;
          else if (app2.status === "submitted" || app2.status === "under_review" || app2.status === "payment_pending") acc.pending++;
          return acc;
        },
        { total: 0, approved: 0, rejected: 0, pending: 0 }
      );
      const [legacySetting] = await db.select().from(systemSettings).where(eq3(systemSettings.settingKey, "admin_legacy_stats")).limit(1);
      const legacy = legacySetting?.settingValue || {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
      const combined = {
        total: realtime.total + (parseInt(legacy.total) || 0),
        approved: realtime.approved + (parseInt(legacy.approved) || 0),
        rejected: realtime.rejected + (parseInt(legacy.rejected) || 0),
        pending: realtime.pending + (parseInt(legacy.pending) || 0),
        realtime,
        legacy
      };
      res.json(combined);
    } catch (error) {
      log.error("[public] Failed to fetch public stats:", error);
      res.json({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        error: "Failed to fetch stats"
      });
    }
  });
  return router8;
}

// server/scraper.ts
init_storage();
init_logger();
import https from "https";
var PRODUCTION_PORTAL_URL = "https://eservices.himachaltourism.gov.in/";
var scraperLog = logger.child({ module: "scraper" });
async function fetchWithCustomAgent(url2) {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    https.get(url2, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}
async function scrapeProductionStats() {
  try {
    scraperLog.info(`Fetching stats from ${PRODUCTION_PORTAL_URL}`);
    const html = await fetchWithCustomAgent(PRODUCTION_PORTAL_URL);
    const stats = extractStatsFromHTML(html);
    if (stats) {
      await storage.saveProductionStats({
        ...stats,
        sourceUrl: PRODUCTION_PORTAL_URL
      });
      scraperLog.info("Successfully scraped and saved stats", stats);
    }
    return stats;
  } catch (error) {
    scraperLog.error({ err: error }, "Error scraping production stats");
    return null;
  }
}
function extractStatsFromHTML(html) {
  try {
    const totalMatch = html.match(/Total Applications[\s\S]*?([\d,]+)/i);
    const approvedMatch = html.match(/Approved Applications[\s\S]*?([\d,]+)/i);
    const rejectedMatch = html.match(/Rejected Applications[\s\S]*?([\d,]+)/i);
    const pendingMatch = html.match(/Pending Applications[\s\S]*?([\d,]+)/i);
    if (totalMatch && approvedMatch && rejectedMatch && pendingMatch) {
      const stats = {
        totalApplications: parseInt(totalMatch[1].replace(/,/g, "")),
        approvedApplications: parseInt(approvedMatch[1].replace(/,/g, "")),
        rejectedApplications: parseInt(rejectedMatch[1].replace(/,/g, "")),
        pendingApplications: parseInt(pendingMatch[1].replace(/,/g, ""))
      };
      if (isNaN(stats.totalApplications) || isNaN(stats.approvedApplications) || isNaN(stats.rejectedApplications) || isNaN(stats.pendingApplications)) {
        scraperLog.error("Failed to parse numbers from HTML");
        return null;
      }
      scraperLog.info("Parsed stats", stats);
      return stats;
    }
    scraperLog.error("Failed to match all required statistics in HTML");
    return null;
  } catch (error) {
    scraperLog.error({ err: error }, "Error extracting stats from HTML");
    return null;
  }
}
var scraperInterval = null;
function startScraperScheduler() {
  scrapeProductionStats();
  scraperInterval = setInterval(() => {
    scrapeProductionStats();
  }, 60 * 60 * 1e3);
  scraperLog.info("Scheduler started - will scrape every hour");
}

// server/routes.ts
import { differenceInCalendarDays as differenceInCalendarDays2, format as format4, subDays } from "date-fns";

// server/routes/helpers/district.ts
import { eq as eq4, ilike, or } from "drizzle-orm";
var normalizeDistrictForMatch = (value) => {
  if (!value) return [];
  const cleaned = value.toLowerCase().replace(/&/g, " and ").replace(/\b(division|sub-division|subdivision|hq|office|district|development|tourism|ddo|dto|dt|section|unit|range|circle|zone|serving|for|the|at|and)\b/g, " ").replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return [];
  }
  const tokens = cleaned.split(" ").map((token) => token.trim()).filter((token) => token.length > 2);
  return Array.from(new Set(tokens));
};
var districtsMatch = (officerDistrict, targetDistrict) => {
  const normalize = (val) => (val ?? "").trim().toLowerCase();
  if (!officerDistrict || !targetDistrict) {
    return normalize(officerDistrict) === normalize(targetDistrict);
  }
  if (normalize(officerDistrict) === normalize(targetDistrict)) {
    return true;
  }
  const officerTokens = normalizeDistrictForMatch(officerDistrict);
  const targetTokens = normalizeDistrictForMatch(targetDistrict);
  if (officerTokens.length === 0 || targetTokens.length === 0) {
    return false;
  }
  return officerTokens.some((token) => targetTokens.includes(token));
};
var buildDistrictWhereClause = (column, officerDistrict) => {
  const tokens = normalizeDistrictForMatch(officerDistrict);
  if (tokens.length === 0) {
    return eq4(column, officerDistrict);
  }
  return or(eq4(column, officerDistrict), ...tokens.map((token) => ilike(column, `%${token}%`)));
};
var buildCoveredDistrictsWhereClause = (column, coveredDistricts) => {
  if (coveredDistricts.length === 0) {
    return eq4(column, "___NO_MATCH___");
  }
  const conditions = coveredDistricts.map((district) => {
    const tokens = normalizeDistrictForMatch(district);
    if (tokens.length === 0) {
      return eq4(column, district);
    }
    return or(eq4(column, district), ...tokens.map((token) => ilike(column, `%${token}%`)));
  });
  return or(...conditions);
};

// server/himkosh/routes.ts
init_db();
init_schema();
import { Router as Router2 } from "express";

// server/himkosh/gatewayConfig.ts
init_schema();
init_db();
init_config2();
import { eq as eq5 } from "drizzle-orm";
var HIMKOSH_GATEWAY_SETTING_KEY = "himkosh_gateway";
var trimMaybe = (value) => {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : void 0;
};
var parseOptionalNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed2 = Number(value);
    if (Number.isFinite(parsed2)) {
      return parsed2;
    }
  }
  return void 0;
};
async function getHimkoshGatewaySettingRecord() {
  const [record] = await db.select().from(systemSettings).where(eq5(systemSettings.settingKey, HIMKOSH_GATEWAY_SETTING_KEY)).limit(1);
  return record ?? null;
}
var mergeHimkoshConfig = (baseConfig, overrides) => {
  if (!overrides) {
    return baseConfig;
  }
  const heads = {
    registrationFee: trimMaybe(overrides.head1) || baseConfig.heads.registrationFee,
    secondaryHead: overrides.head2 !== void 0 ? trimMaybe(overrides.head2) || void 0 : baseConfig.heads.secondaryHead,
    secondaryHeadAmount: overrides.head2Amount !== void 0 ? overrides.head2Amount : baseConfig.heads.secondaryHeadAmount
  };
  return {
    ...baseConfig,
    merchantCode: trimMaybe(overrides.merchantCode) || baseConfig.merchantCode,
    deptId: trimMaybe(overrides.deptId) || baseConfig.deptId,
    serviceCode: trimMaybe(overrides.serviceCode) || baseConfig.serviceCode,
    ddo: trimMaybe(overrides.ddo) || baseConfig.ddo,
    heads,
    returnUrl: trimMaybe(overrides.returnUrl) || baseConfig.returnUrl,
    configStatus: overrides ? "database_override" : baseConfig.configStatus
  };
};
var sanitizeHimkoshGatewaySetting = (value) => {
  if (!value) return null;
  return {
    merchantCode: trimMaybe(value.merchantCode) ?? "",
    deptId: trimMaybe(value.deptId) ?? "",
    serviceCode: trimMaybe(value.serviceCode) ?? "",
    ddo: trimMaybe(value.ddo) ?? "",
    head1: trimMaybe(value.head1) ?? "",
    head2: trimMaybe(value.head2) ?? "",
    head2Amount: parseOptionalNumber(value.head2Amount) ?? void 0,
    returnUrl: trimMaybe(value.returnUrl) ?? "",
    allowFallback: Boolean(value.allowFallback)
  };
};
async function resolveHimkoshGatewayConfig() {
  const base = getHimKoshConfig();
  const record = await getHimkoshGatewaySettingRecord();
  const overrides = record?.settingValue ?? null;
  const config2 = mergeHimkoshConfig(base, overrides);
  return { config: config2, overrides, record };
}

// server/himkosh/routes.ts
init_config();
init_applicationNumber();
import { and as and2, desc as desc2, eq as eq8, sql as sql4 } from "drizzle-orm";
import { nanoid } from "nanoid";
init_districtRouting();
init_logger();
init_ddo();
init_systemSettings();
var router = Router2();
var himkoshLogger = logger.child({ module: "himkosh" });
var portalBaseColumnEnsured = false;
var ensurePortalBaseUrlColumn = async () => {
  if (portalBaseColumnEnsured) {
    return;
  }
  try {
    await db.execute(
      sql4`ALTER TABLE "himkosh_transactions" ADD COLUMN IF NOT EXISTS "portal_base_url" text`
    );
    portalBaseColumnEnsured = true;
    himkoshLogger.info("Ensured portal_base_url column exists on himkosh_transactions");
  } catch (error) {
    himkoshLogger.error({ err: error }, "Failed to ensure portal_base_url column");
  }
};
void ensurePortalBaseUrlColumn();
var crypto3 = new HimKoshCrypto();
var stripTrailingSlash = (value) => value.replace(/\/+$/, "");
var sanitizeBaseUrl = (value) => {
  if (!value) {
    return void 0;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return void 0;
  }
  try {
    const parsed2 = new URL(trimmed);
    return stripTrailingSlash(parsed2.origin);
  } catch {
    try {
      const parsed2 = new URL(`https://${trimmed}`);
      return stripTrailingSlash(parsed2.origin);
    } catch {
      return void 0;
    }
  }
};
var looksLocalHost = (host) => {
  if (!host) return false;
  return /localhost|127\.|0\.0\.0\.0/i.test(host);
};
var deriveHostFromRequest = (req) => {
  const hostHeader = req.get("x-forwarded-host") ?? req.get("host");
  if (!hostHeader) {
    return void 0;
  }
  const host = hostHeader.split(",")[0]?.trim();
  if (!host) {
    return void 0;
  }
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  const rawProtocol = forwardedProto || req.protocol?.toLowerCase();
  const isLocal = looksLocalHost(host);
  let protocol;
  if (rawProtocol === "https") {
    protocol = "https";
  } else if (rawProtocol === "http") {
    protocol = isLocal ? "http" : "https";
  } else {
    protocol = isLocal ? "http" : "https";
  }
  return `${protocol}://${host}`;
};
var resolvePortalBaseUrl = (req) => {
  const bodyCandidate = typeof req.body === "object" && req.body !== null && typeof req.body.portalBaseUrl === "string" ? req.body.portalBaseUrl : void 0;
  const candidates = [
    bodyCandidate,
    req.get("origin"),
    deriveHostFromRequest(req),
    req.get("referer"),
    config.frontend.baseUrl
  ];
  for (const candidate of candidates) {
    const sanitized = sanitizeBaseUrl(candidate);
    if (sanitized) {
      return sanitized;
    }
  }
  return void 0;
};
var STATUS_META = {
  "1": {
    title: "Payment Confirmed",
    description: "HimKosh has confirmed your payment. The HP Tourism portal will unlock your certificate momentarily.",
    tone: "success",
    followUp: "You may close this tab once the main window updates.",
    redirectState: "success"
  },
  "0": {
    title: "Payment Failed",
    description: "HimKosh reported a failure while processing the payment.",
    tone: "error",
    followUp: "If funds were deducted, note the GRN and contact support for reconciliation.",
    redirectState: "failed"
  },
  "2": {
    title: "Payment Pending",
    description: "The transaction is still being processed by HimKosh.",
    tone: "pending",
    followUp: "Keep this page open or refresh the HP Tourism portal shortly to view the latest status.",
    redirectState: "pending"
  }
};
var buildCallbackPage = (options) => {
  const toneColor = options.tone === "success" ? "#0f766e" : options.tone === "pending" ? "#ca8a04" : "#b91c1c";
  const toneBg = options.tone === "success" ? "#ecfdf5" : options.tone === "pending" ? "#fef9c3" : "#fee2e2";
  const metaRefresh = options.redirectUrl ? `<meta http-equiv="refresh" content="4;url=${options.redirectUrl}" />` : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${options.heading}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${metaRefresh}
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(160deg, #f6faff 0%, #f1f5f9 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        color: #0f172a;
      }
      .card {
        width: min(560px, 100%);
        background: #ffffff;
        border-radius: 20px;
        padding: 32px 36px;
        box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.25);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: ${toneBg};
        color: ${toneColor};
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 0.85rem;
        width: fit-content;
      }
      h1 {
        font-size: clamp(1.5rem, 2vw, 1.9rem);
        margin: 0;
      }
      p {
        margin: 0;
        line-height: 1.55;
        color: #334155;
      }
      .summary {
        margin-top: 8px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }
      .summary-item span:first-child {
        color: #475569;
      }
      .cta {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cta a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 999px;
        text-decoration: none;
        background: #0f172a;
        color: #fff;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .cta small {
        color: #64748b;
        font-size: 0.8rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">${options.heading}</span>
      <div>
        <p>${options.description}</p>
        <p>${options.followUp}</p>
      </div>
      <div class="summary">
        ${options.applicationNumber ? `<div class="summary-item"><span>Application #</span><span>${options.applicationNumber}</span></div>` : ""}
        ${options.reference ? `<div class="summary-item"><span>HimKosh Reference</span><span>${options.reference}</span></div>` : ""}
        ${options.amount !== void 0 && options.amount !== null ? `<div class="summary-item"><span>Amount</span><span>\u20B9${Number(options.amount).toLocaleString("en-IN")}</span></div>` : ""}
      </div>
      ${options.redirectUrl ? `<div class="cta">
        <a href="${options.redirectUrl}">Return to HP Tourism Portal</a>
        <small>You will be redirected automatically in a few seconds.</small>
      </div>` : ""}
    </div>
  </body>
</html>`;
};
router.post("/initiate", async (req, res) => {
  try {
    const { applicationId } = req.body;
    const [pauseSetting] = await db.select().from(systemSettings).where(eq8(systemSettings.settingKey, PAYMENT_PIPELINE_PAUSE_SETTING_KEY)).limit(1);
    const pauseConfig = normalizePaymentPipelinePauseSetting(pauseSetting?.settingValue);
    if (pauseConfig.enabled) {
      const message = getPaymentPauseMessage(pauseConfig);
      himkoshLogger.warn({ applicationId, message }, "[himkosh] Payment blocked by pipeline pause");
      return res.status(503).json({
        error: "Payment Service Unavailable",
        message,
        isPaused: true
      });
    }
    if (!applicationId) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    const [application] = await db.select().from(homestayApplications).where(eq8(homestayApplications.id, applicationId)).limit(1);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    const paymentWorkflow = await getPaymentWorkflow();
    const isStandardPaymentStatus = application.status === "payment_pending" || application.status === "verified_for_payment";
    const isDraftPaymentAllowed = paymentWorkflow === "upfront" && application.status === "draft";
    if (!isStandardPaymentStatus && !isDraftPaymentAllowed) {
      return res.status(400).json({
        error: "Application is not ready for payment",
        currentStatus: application.status,
        workflow: paymentWorkflow
      });
    }
    if (isDraftPaymentAllowed) {
      const documentsArray = application.documents;
      const hasDocuments = Array.isArray(documentsArray) && documentsArray.length > 0;
      if (!hasDocuments) {
        return res.status(400).json({
          error: "Please upload required documents before submitting payment",
          hint: "Go to the Documents step in your application and upload the required files.",
          currentStatus: application.status
        });
      }
    }
    const { config: config2 } = await resolveHimkoshGatewayConfig();
    let ddoCode = config2.ddo;
    let head1 = config2.heads.head1;
    const routedDistrict = deriveDistrictRoutingLabel(application.district, application.tehsil) ?? application.district;
    if (routedDistrict) {
      const ddoMapping = await resolveDistrictDdo(routedDistrict, application.tehsil);
      if (ddoMapping) {
        ddoCode = ddoMapping.ddoCode;
        if (ddoMapping.head1) {
          head1 = ddoMapping.head1;
        }
        himkoshLogger.info(
          {
            ddoCode,
            head1,
            routedDistrict,
            originalDistrict: application.district,
            applicationId: application.id
          },
          "[himkosh] Using district-specific DDO and Head"
        );
      } else {
        himkoshLogger.info(
          { routedDistrict, fallbackDdo: config2.ddo, applicationId: application.id },
          "[himkosh] No DDO mapping found; using fallback"
        );
      }
    }
    const appRefNo = `HPT${Date.now()}${nanoid(6)}`.substring(0, 20);
    if (!application.totalFee) {
      return res.status(400).json({ error: "Total fee not calculated for this application" });
    }
    let actualAmount = Math.round(parseFloat(application.totalFee.toString()));
    const [testModeSetting] = await db.select().from(systemSettings).where(eq8(systemSettings.settingKey, "payment_test_mode")).limit(1);
    const envTestOverride = typeof config.himkosh.forceTestMode === "boolean" ? config.himkosh.forceTestMode : config.himkosh.testMode;
    const isTestMode = envTestOverride !== void 0 ? envTestOverride : testModeSetting ? testModeSetting.settingValue.enabled : false;
    if (isTestMode) {
      actualAmount = config.himkosh.testAmount;
      himkoshLogger.info({ actualAmount, isTestMode }, "[himkosh] Test mode active: Overriding amount");
    }
    actualAmount = Math.round(actualAmount);
    if (actualAmount <= 0) {
      himkoshLogger.warn({ actualAmount }, "[himkosh] Warning: Amount is 0 or negative");
      if (isTestMode && actualAmount === 0) actualAmount = 1;
    }
    const gatewayAmount = isTestMode ? 1 : actualAmount;
    if (isTestMode) {
      himkoshLogger.info(
        { applicationId: application.id, actualAmount },
        "[himkosh] Test payment mode active - overriding amount to \u20B91"
      );
    }
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const formatDDMMYYYY = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
    const periodFrom = formatDDMMYYYY(now);
    const validityYears = application.certificateValidityYears || 1;
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + validityYears);
    endDate.setDate(endDate.getDate() - 1);
    const periodTo = formatDDMMYYYY(endDate);
    himkoshLogger.info(
      {
        applicationId: application.id,
        validityYears,
        periodFrom,
        periodTo
      },
      "[himkosh] Calculated payment period"
    );
    const resolvedPortalBase = resolvePortalBaseUrl(req);
    const trimmedPortalBase = resolvedPortalBase ? stripTrailingSlash(resolvedPortalBase) : void 0;
    const fallbackPortalBase = sanitizeBaseUrl(config.frontend.baseUrl) || sanitizeBaseUrl(config2.returnUrl) || sanitizeBaseUrl(deriveHostFromRequest(req));
    const portalBaseForStorage = trimmedPortalBase || fallbackPortalBase;
    let callbackUrl = config2.returnUrl;
    if (trimmedPortalBase) {
      callbackUrl = `${trimmedPortalBase}/api/himkosh/callback`;
    } else if (!callbackUrl && portalBaseForStorage) {
      callbackUrl = `${portalBaseForStorage}/api/himkosh/callback`;
    }
    if (trimmedPortalBase) {
      himkoshLogger.info({ callbackUrl }, "[himkosh] Using dynamic callback URL derived from request");
    } else if (callbackUrl) {
      himkoshLogger.info({ callbackUrl }, "[himkosh] Using configured callback URL");
    } else {
      himkoshLogger.warn(
        { applicationId: application.id },
        "[himkosh] No callback URL resolved; HimKosh response redirects may fail"
      );
    }
    const deptRefNo = ensureDistrictCodeOnApplicationNumber(
      application.applicationNumber,
      application.district
    );
    const requestParams = {
      deptId: config2.deptId,
      deptRefNo,
      totalAmount: gatewayAmount,
      // Use gateway amount (₹1 in test mode)
      tenderBy: application.ownerName,
      appRefNo,
      head1: config2.heads.registrationFee,
      amount1: gatewayAmount,
      // Use gateway amount (₹1 in test mode)
      ddo: ddoCode,
      periodFrom,
      periodTo,
      serviceCode: config2.serviceCode,
      returnUrl: callbackUrl
    };
    const secondaryHead = config2.heads.secondaryHead;
    const secondaryAmountRaw = Number(config2.heads.secondaryHeadAmount ?? 0);
    if (secondaryHead && secondaryAmountRaw > 0) {
      requestParams.head2 = secondaryHead;
      requestParams.amount2 = Math.round(secondaryAmountRaw);
      requestParams.totalAmount += requestParams.amount2;
    }
    const { coreString, fullString } = buildRequestString(requestParams);
    const checksum = HimKoshCrypto.generateChecksum(coreString);
    const requestStringWithChecksum = `${fullString}|checkSum=${checksum}`;
    const encryptedData = await crypto3.encrypt(requestStringWithChecksum);
    logPaymentTrace("[himkosh] Transaction values", {
      merchantCode: config2.merchantCode,
      merchantCodeLen: config2.merchantCode?.length,
      deptId: config2.deptId,
      deptIdLen: config2.deptId?.length,
      serviceCode: config2.serviceCode,
      serviceCodeLen: config2.serviceCode?.length,
      ddo: ddoCode,
      ddoLen: ddoCode?.length,
      head1: config2.heads.registrationFee,
      head1Len: config2.heads.registrationFee?.length
    });
    logPaymentTrace("[himkosh-encryption] Payload preview", {
      coreString,
      fullString,
      checksum,
      requestStringWithChecksum,
      requestStringLength: requestStringWithChecksum.length,
      encryptedLength: encryptedData.length
    });
    await ensurePortalBaseUrlColumn();
    await db.insert(himkoshTransactions).values({
      applicationId,
      deptRefNo,
      appRefNo,
      totalAmount: gatewayAmount,
      // Store what was sent to gateway
      tenderBy: application.ownerName,
      merchantCode: config2.merchantCode,
      deptId: config2.deptId,
      serviceCode: config2.serviceCode,
      ddo: ddoCode,
      head1: config2.heads.registrationFee,
      amount1: gatewayAmount,
      // Store what was sent to gateway
      head2: requestParams.head2,
      amount2: requestParams.amount2,
      periodFrom,
      periodTo,
      encryptedRequest: encryptedData,
      requestChecksum: checksum,
      portalBaseUrl: portalBaseForStorage ?? null,
      transactionStatus: "initiated"
    });
    const response = {
      success: true,
      paymentUrl: config2.paymentUrl,
      merchantCode: config2.merchantCode,
      encdata: encryptedData,
      checksum,
      // CRITICAL: Send checksum separately (NOT encrypted)
      appRefNo,
      totalAmount: gatewayAmount,
      // Gateway amount (₹1 in test mode)
      actualAmount,
      // Actual calculated fee (for display purposes)
      isTestMode,
      // Flag to indicate test mode
      isConfigured: config2.isConfigured,
      configStatus: config2.configStatus || "production",
      message: isTestMode ? `\u{1F9EA} Test mode active: Gateway receives \u20B9${gatewayAmount.toLocaleString("en-IN")}` : "Payment initiated successfully."
    };
    logPaymentTrace("[himkosh] Response metadata", {
      isConfigured: config2.isConfigured,
      isTestMode,
      appRefNo
    });
    res.json(response);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "HimKosh initiation error");
    res.status(500).json({
      error: "Failed to initiate payment",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.get("/callback", (_req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>HimKosh Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f5f7fb; margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; color:#0f172a; }
          .card { background:#fff; border-radius:16px; padding:32px; box-shadow:0 20px 45px rgba(15,23,42,0.12); max-width:420px; text-align:center; }
          h1 { font-size:1.5rem; margin-bottom:0.5rem; }
          p { margin:0.25rem 0; color:#334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Processing Payment</h1>
          <p>HimKosh is completing your transaction and will return you to the HP Tourism portal automatically.</p>
          <p>You can safely close this tab once the confirmation appears in the main window.</p>
        </div>
      </body>
    </html>
  `);
});
router.post("/callback", async (req, res) => {
  try {
    const { config: config2 } = await resolveHimkoshGatewayConfig();
    const { encdata } = req.body;
    if (!encdata) {
      return res.status(400).send("Missing payment response data");
    }
    const decryptedData = await crypto3.decrypt(encdata);
    const checksumMatch = decryptedData.match(/\|checksum=([0-9a-fA-F]+)/i);
    if (!checksumMatch || checksumMatch.index === void 0) {
      himkoshLogger.error(
        { decryptedData },
        "HimKosh callback: checksum token missing"
      );
      return res.status(400).send("Invalid checksum payload");
    }
    const dataWithoutChecksum = decryptedData.slice(0, checksumMatch.index);
    const receivedChecksum = checksumMatch[1];
    const isValid = HimKoshCrypto.verifyChecksum(dataWithoutChecksum, receivedChecksum);
    const parsedResponse = parseResponseString(decryptedData);
    if (!isValid) {
      himkoshLogger.error(
        { dataWithoutChecksum, receivedChecksum, parsedResponse },
        "HimKosh callback: Checksum verification failed"
      );
      return res.status(400).send("Invalid checksum");
    }
    const [transaction] = await db.select().from(himkoshTransactions).where(eq8(himkoshTransactions.appRefNo, parsedResponse.appRefNo)).limit(1);
    if (!transaction) {
      himkoshLogger.error(
        { appRefNo: parsedResponse.appRefNo },
        "HimKosh callback: Transaction not found"
      );
      return res.status(404).send("Transaction not found");
    }
    await db.update(himkoshTransactions).set({
      echTxnId: parsedResponse.echTxnId,
      bankCIN: parsedResponse.bankCIN,
      bankName: parsedResponse.bankName,
      paymentDate: parsedResponse.paymentDate || null,
      // varchar(14) - store raw string
      status: parsedResponse.status,
      statusCd: parsedResponse.statusCd,
      responseChecksum: parsedResponse.checksum,
      transactionStatus: parsedResponse.statusCd === "1" ? "success" : "failed",
      respondedAt: /* @__PURE__ */ new Date(),
      challanPrintUrl: parsedResponse.statusCd === "1" ? `${config2.challanPrintUrl}?reportName=PaidChallan&TransId=${parsedResponse.echTxnId}` : void 0
    }).where(eq8(himkoshTransactions.id, transaction.id));
    if (parsedResponse.statusCd === "1") {
      const [currentApplication] = await db.select().from(homestayApplications).where(eq8(homestayApplications.id, transaction.applicationId)).limit(1);
      const parsePaymentDate = (dateStr) => {
        if (!dateStr) return /* @__PURE__ */ new Date();
        const cleaned = dateStr.trim();
        if (/^\d{14}$/.test(cleaned)) {
          const day = parseInt(cleaned.substring(0, 2), 10);
          const month = parseInt(cleaned.substring(2, 4), 10) - 1;
          const year = parseInt(cleaned.substring(4, 8), 10);
          const dt = new Date(year, month, day);
          return isNaN(dt.getTime()) ? /* @__PURE__ */ new Date() : dt;
        }
        const parts = cleaned.split(/[-/]/);
        if (parts.length >= 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2].substring(0, 4), 10);
          const dt = new Date(year, month, day);
          return isNaN(dt.getTime()) ? /* @__PURE__ */ new Date() : dt;
        }
        return /* @__PURE__ */ new Date();
      };
      if (currentApplication?.status === "draft") {
        const submitMode = await getUpfrontSubmitMode();
        const now = /* @__PURE__ */ new Date();
        const targetStatus = submitMode === "auto" ? "submitted" : "paid_pending_submit";
        const feedbackMessage = submitMode === "auto" ? `Registration fee paid via HimKosh (CIN: ${parsedResponse.echTxnId ?? "N/A"}). Application submitted.` : `Registration fee paid via HimKosh (CIN: ${parsedResponse.echTxnId ?? "N/A"}). Awaiting manual submission.`;
        await db.update(homestayApplications).set({
          status: targetStatus,
          paymentStatus: "paid",
          paymentId: parsedResponse.echTxnId,
          paymentAmount: transaction.totalAmount?.toString(),
          paymentDate: parsePaymentDate(parsedResponse.paymentDate),
          submittedAt: submitMode === "auto" ? now : null,
          updatedAt: now
        }).where(eq8(homestayApplications.id, transaction.applicationId));
        await logApplicationAction({
          applicationId: transaction.applicationId,
          actorId: currentApplication.userId,
          // User paid
          action: "payment_verified",
          previousStatus: "draft",
          newStatus: targetStatus,
          feedback: feedbackMessage
        });
        if (targetStatus === "submitted") {
          try {
            const { storage: storage3 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
            if (storage3.syncDocumentsFromJsonb) {
              const syncCount = await storage3.syncDocumentsFromJsonb(transaction.applicationId);
              himkoshLogger.info(
                { applicationId: transaction.applicationId, syncCount },
                "Synced documents from JSONB to table on submission"
              );
            }
          } catch (syncError) {
            himkoshLogger.error(
              { err: syncError, applicationId: transaction.applicationId },
              "Failed to sync documents from JSONB"
            );
          }
        }
      } else {
        const year = (/* @__PURE__ */ new Date()).getFullYear();
        const randomSuffix = Math.floor(1e4 + Math.random() * 9e4);
        const certificateNumber = `HP-HST-${year}-${randomSuffix}`;
        const issueDate = /* @__PURE__ */ new Date();
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const formatTimelineDate = (value) => value.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        await db.update(homestayApplications).set({
          status: "approved",
          certificateNumber,
          certificateIssuedDate: issueDate,
          certificateExpiryDate: expiryDate,
          approvedAt: issueDate
        }).where(eq8(homestayApplications.id, transaction.applicationId));
        if (currentApplication.parentApplicationId) {
          await db.update(homestayApplications).set({
            status: "superseded",
            districtNotes: `Superseded by application ${currentApplication.applicationNumber}`
          }).where(eq8(homestayApplications.id, currentApplication.parentApplicationId));
        }
        const actorId = currentApplication?.dtdoId ?? currentApplication?.daId ?? currentApplication?.userId ?? null;
        if (actorId) {
          await logApplicationAction({
            applicationId: transaction.applicationId,
            actorId,
            action: "payment_verified",
            previousStatus: currentApplication?.status ?? null,
            newStatus: "approved",
            feedback: `HimKosh payment confirmed (CIN: ${parsedResponse.echTxnId ?? "N/A"})`
          });
          await logApplicationAction({
            applicationId: transaction.applicationId,
            actorId,
            action: "certificate_issued",
            previousStatus: "approved",
            newStatus: "approved",
            feedback: `Certificate ${certificateNumber} issued on ${formatTimelineDate(issueDate)} (valid till ${formatTimelineDate(
              expiryDate
            )})`
          });
        }
      }
    }
    const statusCode = parsedResponse.statusCd ?? parsedResponse.status ?? "";
    const meta = STATUS_META[statusCode] ?? {
      title: "Payment Status Received",
      description: parsedResponse.status ? `Gateway reported status: ${parsedResponse.status} ` : "The payment response was received from HimKosh.",
      tone: statusCode === "1" ? "success" : statusCode === "2" ? "pending" : "error",
      followUp: "Review the details below and return to the portal.",
      redirectState: statusCode === "1" ? "success" : statusCode === "2" ? "pending" : "failed"
    };
    const portalBase = sanitizeBaseUrl(transaction.portalBaseUrl) || resolvePortalBaseUrl(req) || sanitizeBaseUrl(config.frontend.baseUrl) || sanitizeBaseUrl(config2.returnUrl) || sanitizeBaseUrl(`${req.protocol}://${req.get("host") ?? ""}`);
    const trimmedBase = portalBase ? stripTrailingSlash(portalBase) : void 0;
    const redirectPath = meta.redirectState === "success" ? `/dashboard?payment=${meta.redirectState}&application=${transaction.applicationId}&appNo=${transaction.deptRefNo ?? ""}&flow=himkosh_callback` : `/applications/${transaction.applicationId}?payment=${meta.redirectState}&himgrn=${parsedResponse.echTxnId ?? ""}`;
    const redirectUrl = trimmedBase ? `${trimmedBase}${redirectPath}` : void 0;
    const html = buildCallbackPage({
      heading: meta.title,
      description: meta.description,
      followUp: meta.followUp,
      tone: meta.tone,
      applicationNumber: transaction.deptRefNo,
      amount: transaction.totalAmount,
      reference: parsedResponse.echTxnId,
      redirectUrl
    });
    res.status(200).send(html);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "HimKosh callback error");
    res.status(500).send(`Payment processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
});
router.post("/verify/:appRefNo", async (req, res) => {
  try {
    const { appRefNo } = req.params;
    const { config: config2 } = await resolveHimkoshGatewayConfig();
    const verificationString = buildVerificationString({
      appRefNo,
      serviceCode: config2.serviceCode,
      merchantCode: config2.merchantCode
    });
    const encryptedData = await crypto3.encrypt(verificationString);
    const response = await fetch(config2.verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `encdata=${encodeURIComponent(encryptedData)}`
    });
    const responseData = await response.text();
    const parts = responseData.split("|");
    const verificationData = {};
    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key && value !== void 0) {
        verificationData[key] = value;
      }
    }
    const [transaction] = await db.select().from(himkoshTransactions).where(eq8(himkoshTransactions.appRefNo, appRefNo)).limit(1);
    if (transaction) {
      await db.update(himkoshTransactions).set({
        isDoubleVerified: true,
        doubleVerificationDate: /* @__PURE__ */ new Date(),
        doubleVerificationData: verificationData,
        verifiedAt: /* @__PURE__ */ new Date()
      }).where(eq8(himkoshTransactions.id, transaction.id));
      if (verificationData.TXN_STAT === "1") {
        const [app2] = await db.select().from(homestayApplications).where(eq8(homestayApplications.id, transaction.applicationId)).limit(1);
        if (app2) {
          if (app2.status === "draft") {
            const now = /* @__PURE__ */ new Date();
            await db.update(homestayApplications).set({
              status: "submitted",
              paymentStatus: "paid",
              paymentId: transaction.echTxnId ?? verificationData.himgrn,
              // Use verification data if available
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: now,
              submittedAt: now,
              updatedAt: now
            }).where(eq8(homestayApplications.id, app2.id));
            await logApplicationAction({
              applicationId: app2.id,
              actorId: app2.userId,
              action: "payment_verified",
              previousStatus: "draft",
              newStatus: "submitted",
              feedback: `Payment verified manually (Bridge). App submitted.`
            });
            try {
              const { storage: storage3 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
              if (storage3.syncDocumentsFromJsonb) {
                await storage3.syncDocumentsFromJsonb(app2.id);
                himkoshLogger.info({ applicationId: app2.id }, "Synced documents on bridge submission");
              }
            } catch (syncError) {
              himkoshLogger.error({ err: syncError, applicationId: app2.id }, "Failed to sync documents on bridge");
            }
          } else if (app2.status === "payment_pending") {
          }
        }
      }
    }
    res.json({
      success: true,
      verified: verificationData.TXN_STAT === "1",
      data: verificationData
    });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, appRefNo: req.params?.appRefNo }, "HimKosh verification error");
    res.status(500).json({
      error: "Verification failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.get("/transactions", async (req, res) => {
  try {
    const limitParam = parseInt(String(req.query?.limit ?? ""), 10);
    const offsetParam = parseInt(String(req.query?.offset ?? ""), 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;
    const excludeTestParam = String(req.query?.excludeTest ?? "true").toLowerCase();
    const excludeTest = excludeTestParam !== "false";
    const ddoFilter = req.query?.ddo;
    const conditions = [eq8(himkoshTransactions.isArchived, false)];
    if (excludeTest) {
      conditions.push(sql4`(${homestayApplications.applicationNumber} IS NULL OR ${homestayApplications.applicationNumber} NOT LIKE 'TEST-%')`);
    }
    if (ddoFilter && ddoFilter !== "all") {
      conditions.push(eq8(himkoshTransactions.ddo, ddoFilter));
    }
    const whereClause = and2(...conditions);
    const [countResult] = await db.select({ count: sql4`count(*)` }).from(himkoshTransactions).leftJoin(
      homestayApplications,
      eq8(himkoshTransactions.applicationId, homestayApplications.id)
    ).where(whereClause);
    const rawTransactions = await db.select().from(himkoshTransactions).leftJoin(
      homestayApplications,
      eq8(himkoshTransactions.applicationId, homestayApplications.id)
    ).where(whereClause).orderBy(desc2(himkoshTransactions.createdAt)).limit(limit).offset(offset);
    const transactions = rawTransactions.map((row) => ({
      ...row.himkosh_transactions,
      applicationDistrict: row.homestay_applications?.district ?? null
    }));
    res.json({
      transactions,
      total: Number(countResult?.count ?? 0),
      limit,
      offset,
      excludeTest
    });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, errorDetails: String(error) }, "Error fetching transactions");
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});
router.post("/transactions/clear", async (req, res) => {
  try {
    const sessionUserId = req.session?.userId;
    if (!sessionUserId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { hardDelete } = req.body;
    const user = await db.select({ role: users.role }).from(users).where(eq8(users.id, sessionUserId)).limit(1);
    if (user[0]?.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can clear logs" });
    }
    if (hardDelete) {
      await db.delete(himkoshTransactions);
      himkoshLogger.warn({ userId: sessionUserId }, "HimKosh logs HARD deleted by Super Admin");
      res.json({ message: "All HimKosh transaction logs permanently deleted." });
    } else {
      await db.update(himkoshTransactions).set({ isArchived: true }).where(eq8(himkoshTransactions.isArchived, false));
      himkoshLogger.info({ userId: sessionUserId }, "HimKosh logs archived (soft cleared) by Super Admin");
      res.json({ message: "Transaction list cleared (archived)." });
    }
  } catch (error) {
    himkoshLogger.error({ err: error }, "Failed to clear transactions");
    res.status(500).json({ error: "Failed to clear transactions" });
  }
});
router.get("/transaction/:appRefNo", async (req, res) => {
  try {
    const { appRefNo } = req.params;
    const [transaction] = await db.select().from(himkoshTransactions).where(eq8(himkoshTransactions.appRefNo, appRefNo)).limit(1);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, appRefNo: req.params?.appRefNo }, "Error fetching transaction");
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});
router.get("/application/:applicationId/transactions", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const sessionUserId = req.session?.userId;
    if (!sessionUserId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const [application] = await db.select({
      id: homestayApplications.id,
      ownerId: homestayApplications.userId
    }).from(homestayApplications).where(eq8(homestayApplications.id, applicationId)).limit(1);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    if (application.ownerId !== sessionUserId) {
      const [actor] = await db.select({ role: users.role }).from(users).where(eq8(users.id, sessionUserId)).limit(1);
      const allowedOfficerRoles = /* @__PURE__ */ new Set([
        "district_officer",
        "state_officer",
        "dealing_assistant",
        "district_tourism_officer",
        "super_admin",
        "admin"
      ]);
      if (!actor || !allowedOfficerRoles.has(actor.role)) {
        return res.status(403).json({ error: "Access denied for this application" });
      }
    }
    const transactions = await db.select().from(himkoshTransactions).where(eq8(himkoshTransactions.applicationId, applicationId)).orderBy(desc2(himkoshTransactions.createdAt));
    res.json({ transactions });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, applicationId: req.params?.applicationId }, "Error fetching application transactions");
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});
router.post("/application/:applicationId/reset", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const sessionUserId = req.session?.userId;
    if (!sessionUserId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const [application] = await db.select({
      id: homestayApplications.id,
      ownerId: homestayApplications.userId
    }).from(homestayApplications).where(eq8(homestayApplications.id, applicationId)).limit(1);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    if (application.ownerId !== sessionUserId) {
      const [actor] = await db.select({ role: users.role }).from(users).where(eq8(users.id, sessionUserId)).limit(1);
      const allowedOfficerRoles = /* @__PURE__ */ new Set([
        "district_officer",
        "state_officer",
        "dealing_assistant",
        "district_tourism_officer",
        "super_admin",
        "admin"
      ]);
      if (!actor || !allowedOfficerRoles.has(actor.role)) {
        return res.status(403).json({ error: "Access denied for this application" });
      }
    }
    const [latestTransaction] = await db.select().from(himkoshTransactions).where(eq8(himkoshTransactions.applicationId, applicationId)).orderBy(desc2(himkoshTransactions.createdAt)).limit(1);
    if (!latestTransaction) {
      return res.status(404).json({ error: "No transactions found for this application" });
    }
    const finalStates = /* @__PURE__ */ new Set(["success", "failed", "verified"]);
    if (finalStates.has(latestTransaction.transactionStatus ?? "")) {
      return res.status(400).json({ error: "Latest transaction is already complete" });
    }
    await db.update(himkoshTransactions).set({
      transactionStatus: "failed",
      status: "Cancelled by applicant",
      statusCd: "0",
      respondedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq8(himkoshTransactions.id, latestTransaction.id));
    res.json({ success: true });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, applicationId: req.params?.applicationId }, "Error resetting HimKosh transaction");
    res.status(500).json({ error: "Failed to reset transaction" });
  }
});
router.get("/config/status", async (req, res) => {
  const { config: config2 } = await resolveHimkoshGatewayConfig();
  res.json({
    configured: config2.isConfigured,
    merchantCode: config2.merchantCode,
    deptId: config2.deptId,
    serviceCode: config2.serviceCode,
    returnUrl: config2.returnUrl
  });
});
router.post("/test-callback-url", async (req, res) => {
  try {
    const { callbackUrl, applicationId } = req.body;
    if (!callbackUrl || !applicationId) {
      return res.status(400).json({ error: "callbackUrl and applicationId are required" });
    }
    const [application] = await db.select().from(homestayApplications).where(eq8(homestayApplications.id, applicationId)).limit(1);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    const { config: config2 } = await resolveHimkoshGatewayConfig();
    let ddoCode = config2.ddo;
    let head1 = config2.heads.registrationFee;
    if (application.district) {
      const routedDistrict = deriveDistrictRoutingLabel(application.district, application.tehsil) ?? application.district;
      const ddoMapping = await resolveDistrictDdo(routedDistrict);
      if (ddoMapping) {
        ddoCode = ddoMapping.ddoCode;
        if (ddoMapping.head1) {
          head1 = ddoMapping.head1;
        }
      }
    }
    const appRefNo = `HPT${Date.now()}${nanoid(6)}`.substring(0, 20);
    if (!application.totalFee) {
      return res.status(400).json({ error: "Total fee not calculated for this application" });
    }
    const totalAmount = Math.round(parseFloat(application.totalFee.toString()));
    const now = /* @__PURE__ */ new Date();
    const periodDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
    const deptRefNo = ensureDistrictCodeOnApplicationNumber(
      application.applicationNumber,
      application.district
    );
    const requestParams = {
      deptId: config2.deptId,
      deptRefNo,
      totalAmount,
      tenderBy: application.ownerName,
      appRefNo,
      head1,
      amount1: totalAmount,
      head2: config2.heads.registrationFee,
      amount2: 0,
      ddo: ddoCode,
      periodFrom: periodDate,
      periodTo: periodDate,
      serviceCode: config2.serviceCode,
      returnUrl: callbackUrl
      // Use the test callback URL
    };
    const { coreString, fullString } = buildRequestString(requestParams);
    const checksumCalc = HimKoshCrypto.generateChecksum(coreString);
    const fullStringWithChecksum = `${fullString}|checkSum=${checksumCalc}`;
    const encrypted = await crypto3.encrypt(fullStringWithChecksum);
    logPaymentTrace("[himkosh-test] Callback dry-run", {
      callbackUrl,
      coreString,
      fullString,
      checksum: checksumCalc
    });
    res.json({
      success: true,
      testUrl: callbackUrl,
      checksum: checksumCalc,
      coreString,
      fullString,
      fullStringWithChecksum,
      encrypted,
      paymentUrl: `${config2.paymentUrl}?encdata=${encodeURIComponent(encrypted)}&merchant_code=${config2.merchantCode}`,
      message: "FIXED: Checksum now calculated on CORE string only (excluding Service_code/return_url)"
    });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "[himkosh-test] Error generating payload");
    res.status(500).json({ error: "Failed to generate test data" });
  }
});
var routes_default = router;

// server/routes/admin/communications.ts
init_communications();
init_notifications();
init_systemSettings();
import express2 from "express";
import { eq as eq9 } from "drizzle-orm";

// server/routes/helpers/format.ts
var trimOptionalString = (value) => {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};
var trimRequiredString = (value) => {
  const trimmed = value.trim();
  return trimmed;
};
var parseIsoDateOrNull = (value) => {
  if (!value) {
    return null;
  }
  const parsed2 = new Date(value);
  return Number.isNaN(parsed2.getTime()) ? null : parsed2;
};

// server/routes/admin/communications.ts
init_middleware();
init_schema();
init_db();
init_logger();
var log2 = logger.child({ module: "admin-comm-router" });
function createAdminCommunicationsRouter() {
  const router8 = express2.Router();
  router8.get("/communications", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const emailRecord = await getSystemSettingRecord(EMAIL_GATEWAY_SETTING_KEY);
      const smsRecord = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
      const emailSettings = formatGatewaySetting(emailRecord, sanitizeEmailGateway);
      const smsSettings = formatGatewaySetting(smsRecord, sanitizeSmsGateway);
      log2.info("[comm-settings] sms provider:", smsSettings?.provider, {
        nic: smsSettings?.nic ? { passwordSet: smsSettings.nic.passwordSet } : null,
        twilio: smsSettings?.twilio ? { authTokenSet: smsSettings.twilio.authTokenSet } : null
      });
      res.json({
        email: emailSettings,
        sms: smsSettings
      });
    } catch (error) {
      log2.error("[admin] Failed to fetch communications settings:", error);
      res.status(500).json({ message: "Failed to fetch communications settings" });
    }
  });
  router8.put("/communications/email", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const providerInput = emailProviders.includes(req.body?.provider) ? req.body.provider : "custom";
      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(EMAIL_GATEWAY_SETTING_KEY);
      const existingValue = existing?.settingValue ?? {};
      const legacyProfile = extractLegacyEmailProfile(existingValue);
      const buildProfile = (payload, fallback) => {
        if (!payload) {
          return fallback;
        }
        const host = trimOptionalString(payload.host) ?? fallback?.host ?? void 0;
        const fromEmail = trimOptionalString(payload.fromEmail) ?? fallback?.fromEmail ?? void 0;
        const username = trimOptionalString(payload.username) ?? fallback?.username ?? void 0;
        const passwordInput = trimOptionalString(payload.password);
        const port = payload.port !== void 0 && payload.port !== null ? Number(payload.port) || 25 : fallback?.port ?? 25;
        const next = {
          host,
          port,
          username,
          fromEmail,
          password: passwordInput ? passwordInput : fallback?.password
        };
        if (!next.host && !next.fromEmail && !next.username && !next.password) {
          return void 0;
        }
        return next;
      };
      const nextValue = {
        provider: providerInput,
        custom: buildProfile(req.body?.custom ?? req.body, existingValue.custom ?? legacyProfile),
        nic: buildProfile(req.body?.nic, existingValue.nic),
        sendgrid: buildProfile(req.body?.sendgrid, existingValue.sendgrid)
      };
      const activeProfile = getEmailProfileFromValue(
        { ...existingValue, ...nextValue },
        providerInput
      );
      if (!activeProfile?.host || !activeProfile?.fromEmail) {
        return res.status(400).json({ message: "SMTP host and from email are required" });
      }
      if (!activeProfile.password) {
        return res.status(400).json({ message: "SMTP password is required" });
      }
      if (existing) {
        await db.update(systemSettings).set({
          settingValue: nextValue,
          updatedAt: /* @__PURE__ */ new Date(),
          updatedBy: userId,
          description: "Email gateway configuration",
          category: "communications"
        }).where(eq9(systemSettings.settingKey, EMAIL_GATEWAY_SETTING_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: EMAIL_GATEWAY_SETTING_KEY,
          settingValue: nextValue,
          description: "Email gateway configuration",
          category: "communications",
          updatedBy: userId
        });
      }
      log2.info("[admin] Updated email gateway settings");
      res.json({ success: true });
    } catch (error) {
      log2.error("[admin] Failed to update email config:", error);
      res.status(500).json({ message: "Failed to update email settings" });
    }
  });
  router8.put("/communications/sms", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const providerInput = req.body?.provider === "twilio" ? "twilio" : req.body?.provider === "nic_v2" ? "nic_v2" : "nic";
      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
      const existingValue = existing?.settingValue ?? {};
      const nicPayload = req.body?.nic ?? req.body;
      const nicV2Payload = req.body?.nicV2 ?? req.body;
      const twilioPayload = req.body?.twilio ?? req.body;
      const nextValue = {
        provider: providerInput,
        nic: existingValue.nic,
        nicV2: existingValue.nicV2,
        twilio: existingValue.twilio
      };
      if (providerInput === "nic") {
        const username = trimOptionalString(nicPayload?.username) ?? void 0;
        const senderId = trimOptionalString(nicPayload?.senderId) ?? void 0;
        const departmentKey = trimOptionalString(nicPayload?.departmentKey) ?? void 0;
        const templateId = trimOptionalString(nicPayload?.templateId) ?? void 0;
        const postUrl = trimOptionalString(nicPayload?.postUrl) ?? void 0;
        const passwordInput = trimOptionalString(nicPayload?.password) ?? void 0;
        if (!username || !senderId || !departmentKey || !templateId || !postUrl) {
          return res.status(400).json({ message: "All NIC SMS fields are required" });
        }
        const resolvedNicPassword = passwordInput || existingValue.nic?.password;
        if (!resolvedNicPassword) {
          return res.status(400).json({ message: "SMS password is required" });
        }
        const nicConfig = {
          username,
          senderId,
          departmentKey,
          templateId,
          postUrl,
          password: resolvedNicPassword
        };
        nextValue.nic = nicConfig;
      } else if (providerInput === "nic_v2") {
        const username = trimOptionalString(nicV2Payload?.username) ?? void 0;
        const senderId = trimOptionalString(nicV2Payload?.senderId) ?? void 0;
        const templateId = trimOptionalString(nicV2Payload?.templateId) ?? void 0;
        const key = trimOptionalString(nicV2Payload?.key) ?? void 0;
        const postUrl = trimOptionalString(nicV2Payload?.postUrl) ?? void 0;
        const passwordInput = trimOptionalString(nicV2Payload?.password) ?? void 0;
        if (!username || !senderId || !templateId || !key) {
          return res.status(400).json({ message: "All NIC V2 fields are required" });
        }
        const resolvedPassword = passwordInput || existingValue.nicV2?.password;
        if (!resolvedPassword) {
          return res.status(400).json({ message: "NIC V2 password is required" });
        }
        const nicV2Config = {
          username,
          senderId,
          templateId,
          key,
          postUrl: postUrl || existingValue.nicV2?.postUrl || "https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT",
          password: resolvedPassword
        };
        nextValue.nicV2 = nicV2Config;
      } else {
        const accountSid = trimOptionalString(twilioPayload?.accountSid) ?? void 0;
        const fromNumber = trimOptionalString(twilioPayload?.fromNumber) ?? void 0;
        const messagingServiceSid = trimOptionalString(twilioPayload?.messagingServiceSid) ?? void 0;
        const authTokenInput = trimOptionalString(twilioPayload?.authToken) ?? void 0;
        if (!accountSid) {
          return res.status(400).json({ message: "Twilio Account SID is required" });
        }
        if (!fromNumber && !messagingServiceSid) {
          return res.status(400).json({ message: "Provide a From Number or Messaging Service SID" });
        }
        const resolvedAuthToken = authTokenInput || existingValue.twilio?.authToken;
        if (!resolvedAuthToken) {
          return res.status(400).json({ message: "Twilio auth token is required" });
        }
        const twilioConfig = {
          accountSid,
          fromNumber: fromNumber || void 0,
          messagingServiceSid: messagingServiceSid || void 0,
          authToken: resolvedAuthToken
        };
        nextValue.twilio = twilioConfig;
      }
      if (existing) {
        await db.update(systemSettings).set({
          settingValue: nextValue,
          updatedAt: /* @__PURE__ */ new Date(),
          updatedBy: userId,
          description: "SMS gateway configuration",
          category: "communications"
        }).where(eq9(systemSettings.settingKey, SMS_GATEWAY_SETTING_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: SMS_GATEWAY_SETTING_KEY,
          settingValue: nextValue,
          description: "SMS gateway configuration",
          category: "communications",
          updatedBy: userId
        });
      }
      log2.info("[admin] Updated SMS gateway settings");
      res.json({ success: true });
    } catch (error) {
      log2.error("[admin] Failed to update SMS config:", error);
      res.status(500).json({ message: "Failed to update SMS settings" });
    }
  });
  router8.post("/communications/email/test", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const record = await getSystemSettingRecord(EMAIL_GATEWAY_SETTING_KEY);
      if (!record) {
        return res.status(400).json({ message: "SMTP settings not configured" });
      }
      const config2 = record.settingValue ?? {};
      const provider = config2.provider ?? "custom";
      const profile = getEmailProfileFromValue(config2, provider) ?? extractLegacyEmailProfile(config2);
      if (!profile?.host || !profile?.fromEmail || !profile?.password) {
        return res.status(400).json({ message: "SMTP settings incomplete" });
      }
      const to = trimOptionalString(req.body?.to) ?? profile.fromEmail;
      const subject = trimOptionalString(req.body?.subject) ?? DEFAULT_EMAIL_SUBJECT;
      const body = trimOptionalString(req.body?.body) ?? DEFAULT_EMAIL_BODY;
      const result = await sendTestEmail(
        {
          host: profile.host,
          port: Number(profile.port) || 25,
          username: profile.username,
          password: profile.password,
          fromEmail: profile.fromEmail
        },
        {
          to,
          subject,
          body
        }
      );
      res.json({ success: true, log: result.log });
    } catch (error) {
      log2.error("[admin] SMTP test failed:", error);
      res.status(500).json({ message: error?.message || "Failed to send test email" });
    }
  });
  router8.post("/communications/sms/test", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const record = await getSystemSettingRecord(SMS_GATEWAY_SETTING_KEY);
      if (!record) {
        return res.status(400).json({ message: "SMS settings not configured" });
      }
      const config2 = record.settingValue;
      const provider = config2.provider ?? "nic";
      log2.info("[sms-test] provider:", provider);
      const mobile = trimOptionalString(req.body?.mobile);
      const message = trimOptionalString(req.body?.message) ?? DEFAULT_SMS_BODY.replace("{{OTP}}", "123456");
      if (!mobile) {
        return res.status(400).json({ message: "Mobile number is required" });
      }
      if (provider === "twilio") {
        const twilioConfig = config2.twilio ?? {
          accountSid: config2.accountSid,
          authToken: config2.authToken,
          fromNumber: config2.fromNumber,
          messagingServiceSid: config2.messagingServiceSid
        };
        if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber && !twilioConfig.messagingServiceSid) {
          return res.status(400).json({ message: "Twilio settings incomplete" });
        }
        const result2 = await sendTwilioSms(
          {
            accountSid: twilioConfig.accountSid,
            authToken: twilioConfig.authToken,
            fromNumber: twilioConfig.fromNumber,
            messagingServiceSid: twilioConfig.messagingServiceSid
          },
          { mobile, message }
        );
        return res.json({ success: result2.ok, response: result2.body, status: result2.status });
      }
      if (provider === "nic_v2") {
        const nicV2Config = config2.nicV2 ?? {
          username: config2.username,
          password: config2.password,
          senderId: config2.senderId,
          templateId: config2.templateId,
          key: config2.key,
          postUrl: config2.postUrl
        };
        if (!nicV2Config || !nicV2Config.password) {
          return res.status(400).json({ message: "NIC V2 password missing in settings" });
        }
        const result2 = await sendNicV2Sms(
          {
            username: nicV2Config.username,
            password: nicV2Config.password,
            senderId: nicV2Config.senderId,
            templateId: nicV2Config.templateId,
            key: nicV2Config.key,
            postUrl: nicV2Config.postUrl
          },
          { mobile, message }
        );
        return res.json({ success: result2.ok, response: result2.body, status: result2.status });
      }
      const nicConfig = config2.nic ?? {
        username: config2.username,
        password: config2.password,
        senderId: config2.senderId,
        departmentKey: config2.departmentKey,
        templateId: config2.templateId,
        postUrl: config2.postUrl
      };
      if (!nicConfig || !nicConfig.password) {
        return res.status(400).json({ message: "SMS password missing in settings" });
      }
      const result = await sendTestSms(
        {
          username: nicConfig.username,
          password: nicConfig.password,
          senderId: nicConfig.senderId,
          departmentKey: nicConfig.departmentKey,
          templateId: nicConfig.templateId,
          postUrl: nicConfig.postUrl
        },
        { mobile, message }
      );
      res.json({ success: result.ok, response: result.body, status: result.status });
    } catch (error) {
      log2.error("[admin] SMS test failed:", error);
      res.status(500).json({ message: error?.message || "Failed to send test SMS" });
    }
  });
  return router8;
}

// server/routes/admin/himkosh.ts
init_middleware();
import express3 from "express";
import { eq as eq10 } from "drizzle-orm";
init_ddo();
init_districtRouting();
init_schema();
init_db();
init_logger();
init_systemSettings();
init_ddo();
var log3 = logger.child({ module: "admin-himkosh-router" });
var adminHimkoshCrypto = new HimKoshCrypto();
function createAdminHimkoshRouter() {
  const router8 = express3.Router();
  router8.get("/payments/himkosh", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { config: effectiveConfig, overrides, record } = await resolveHimkoshGatewayConfig();
      res.json({
        effective: effectiveConfig,
        overrides: sanitizeHimkoshGatewaySetting(overrides),
        source: record ? "database" : "env",
        updatedAt: record?.updatedAt,
        updatedBy: record?.updatedBy
      });
    } catch (error) {
      log3.error({ err: error, route: req.path }, "[admin] Failed to fetch HimKosh config");
      res.status(500).json({ message: "Failed to fetch HimKosh config" });
    }
  });
  router8.put("/payments/himkosh", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const userId = req.session?.userId ?? null;
      const payload = {
        merchantCode: trimMaybe(req.body?.merchantCode),
        deptId: trimMaybe(req.body?.deptId),
        serviceCode: trimMaybe(req.body?.serviceCode),
        ddo: trimMaybe(req.body?.ddo),
        head1: trimMaybe(req.body?.head1),
        head2: trimMaybe(req.body?.head2),
        head2Amount: parseOptionalNumber(req.body?.head2Amount),
        returnUrl: trimMaybe(req.body?.returnUrl),
        allowFallback: req.body?.allowFallback !== false
      };
      if (!payload.merchantCode || !payload.deptId || !payload.serviceCode || !payload.ddo || !payload.head1) {
        return res.status(400).json({
          message: "Merchant code, Dept ID, Service code, DDO, and Head of Account are required"
        });
      }
      const existing = await getSystemSettingRecord(HIMKOSH_GATEWAY_SETTING_KEY);
      if (existing) {
        await db.update(systemSettings).set({
          settingValue: payload,
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date(),
          description: "HimKosh gateway configuration",
          category: "payment"
        }).where(eq10(systemSettings.settingKey, HIMKOSH_GATEWAY_SETTING_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: HIMKOSH_GATEWAY_SETTING_KEY,
          settingValue: payload,
          description: "HimKosh gateway configuration",
          category: "payment",
          updatedBy: userId
        });
      }
      log3.info({ userId }, "[admin] Updated HimKosh gateway config");
      res.json({ success: true });
    } catch (error) {
      log3.error({ err: error, route: req.path }, "[admin] Failed to update HimKosh config");
      res.status(500).json({ message: "Failed to update HimKosh config" });
    }
  });
  router8.delete("/payments/himkosh", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const existing = await getSystemSettingRecord(HIMKOSH_GATEWAY_SETTING_KEY);
      if (!existing) {
        return res.status(404).json({ message: "No HimKosh override found" });
      }
      await db.delete(systemSettings).where(eq10(systemSettings.settingKey, HIMKOSH_GATEWAY_SETTING_KEY));
      log3.info({ settingKey: HIMKOSH_GATEWAY_SETTING_KEY, userId: req.session?.userId ?? null }, "[admin] Cleared HimKosh gateway config override");
      res.json({ success: true });
    } catch (error) {
      log3.error({ err: error, route: req.path }, "[admin] Failed to clear HimKosh config");
      res.status(500).json({ message: "Failed to clear HimKosh config" });
    }
  });
  router8.get("/payments/himkosh/ddo-codes", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const codes = await fetchAllDdoCodes();
      res.json({ codes });
    } catch (error) {
      log3.error({ err: error }, "[admin] Failed to load DDO codes");
      res.status(500).json({ message: "Failed to load DDO codes" });
    }
  });
  router8.post("/payments/himkosh/transactions/clear", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const rawConfirm = typeof req.body?.confirmationText === "string" ? req.body.confirmationText : "";
      const normalized = rawConfirm.trim().toUpperCase();
      if (normalized !== "CLEAR HIMKOSH LOG") {
        return res.status(400).json({ message: "Type CLEAR HIMKOSH LOG to confirm" });
      }
      const deleted = await db.delete(himkoshTransactions).returning({ id: himkoshTransactions.id });
      log3.warn(
        { userId: req.session?.userId ?? null, deleted: deleted.length },
        "[admin] Cleared HimKosh transaction log"
      );
      res.json({ success: true, deleted: deleted.length });
    } catch (error) {
      log3.error({ err: error }, "[admin] Failed to clear HimKosh transactions");
      res.status(500).json({ message: "Failed to clear HimKosh transactions" });
    }
  });
  router8.post("/payments/himkosh/ddo-test", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const rawDistrict = typeof req.body?.district === "string" ? req.body.district.trim() : "";
      const rawTehsil = typeof req.body?.tehsil === "string" ? req.body.tehsil.trim() : "";
      const manualDdo = trimMaybe(req.body?.manualDdo);
      const tenderBy = typeof req.body?.tenderBy === "string" && req.body.tenderBy.trim().length ? req.body.tenderBy.trim() : "Test Applicant";
      const requestedAmount = Number(req.body?.amount ?? 1);
      const totalAmount = Number.isFinite(requestedAmount) && requestedAmount > 0 ? Math.round(requestedAmount) : 1;
      const { config: config2 } = await resolveHimkoshGatewayConfig();
      const head1 = config2.heads?.registrationFee;
      if (!config2.merchantCode || !config2.deptId || !config2.serviceCode || !head1) {
        return res.status(400).json({ message: "HimKosh gateway is not fully configured" });
      }
      const routedDistrict = deriveDistrictRoutingLabel(rawDistrict || void 0, rawTehsil || void 0) ?? (rawDistrict || null);
      const mapped = routedDistrict ? await resolveDistrictDdo(routedDistrict) : void 0;
      const fallbackDdo = config2.ddo;
      const ddoToUse = manualDdo || mapped?.ddoCode || fallbackDdo;
      if (!ddoToUse) {
        return res.status(400).json({ message: "No DDO code available. Provide a manual override to test." });
      }
      const now = /* @__PURE__ */ new Date();
      const periodDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
      const deptRefNo = `TEST-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate()
      ).padStart(2, "0")}-${now.getTime().toString().slice(-4)}`;
      const appRefNo = `HPT${now.getTime()}`.slice(0, 20);
      const payloadParams = {
        deptId: config2.deptId,
        deptRefNo,
        totalAmount,
        tenderBy,
        appRefNo,
        head1,
        amount1: totalAmount,
        head2: config2.heads?.secondaryHead || void 0,
        amount2: config2.heads?.secondaryHeadAmount ?? void 0,
        ddo: ddoToUse,
        periodFrom: periodDate,
        periodTo: periodDate,
        serviceCode: config2.serviceCode,
        returnUrl: config2.returnUrl
      };
      const { coreString, fullString } = buildRequestString(payloadParams);
      const checksum = HimKoshCrypto.generateChecksum(coreString);
      const payloadWithChecksum = `${fullString}|checkSum=${checksum}`;
      const encrypted = await adminHimkoshCrypto.encrypt(payloadWithChecksum);
      res.json({
        success: true,
        requestedDistrict: rawDistrict || null,
        requestedTehsil: rawTehsil || null,
        routedDistrict,
        mapping: mapped ? {
          district: mapped.district,
          ddoCode: mapped.ddoCode,
          treasuryCode: mapped.treasuryCode
        } : null,
        ddoUsed: ddoToUse,
        ddoSource: manualDdo ? "manual_override" : mapped ? "district_mapping" : "default_config",
        payload: {
          params: payloadParams,
          coreString,
          fullString,
          checksum,
          encrypted,
          paymentUrl: `${config2.paymentUrl}?encdata=${encodeURIComponent(encrypted)}&merchant_code=${config2.merchantCode}`
        }
      });
    } catch (error) {
      log3.error({ err: error }, "[admin] Failed to run HimKosh DDO test");
      res.status(500).json({ message: "Failed to run HimKosh DDO test" });
    }
  });
  return router8;
}

// server/routes/admin/users.ts
init_middleware();
init_storage();
init_logger();
init_schema();
init_db();
import express4 from "express";
import bcrypt from "bcrypt";
import { eq as eq11 } from "drizzle-orm";
var log4 = logger.child({ module: "admin-users-router" });
var ALLOWED_ROLES = [
  "property_owner",
  "dealing_assistant",
  "district_tourism_officer",
  "district_officer",
  "state_officer",
  "admin",
  "admin_rc",
  "system_admin",
  "super_admin"
];
function createAdminUsersRouter() {
  const router8 = express4.Router();
  router8.get("/users", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const users4 = await storage.getAllUsers();
      res.json({ users: users4 });
    } catch (error) {
      log4.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  router8.patch("/users/:id", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const {
        role,
        isActive,
        fullName,
        email,
        district,
        password,
        firstName,
        lastName,
        username,
        alternatePhone,
        designation,
        department,
        employeeId,
        officeAddress,
        officePhone
      } = req.body;
      const currentUser = await storage.getUser(req.session.userId);
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const updates = {};
      if (fullName?.trim()) updates.fullName = fullName.trim();
      if (firstName !== void 0 && firstName !== null) updates.firstName = firstName.trim() || null;
      if (lastName !== void 0 && lastName !== null) updates.lastName = lastName.trim() || null;
      if (username !== void 0 && username !== null) updates.username = username.trim() || null;
      if (email !== void 0 && email !== null) updates.email = email.trim() || null;
      if (alternatePhone !== void 0 && alternatePhone !== null) updates.alternatePhone = alternatePhone.trim() || null;
      if (designation !== void 0 && designation !== null) updates.designation = designation.trim() || null;
      if (department !== void 0 && department !== null) updates.department = department.trim() || null;
      if (employeeId !== void 0 && employeeId !== null) updates.employeeId = employeeId.trim() || null;
      if (district !== void 0 && district !== null) updates.district = district.trim() || null;
      if (officeAddress !== void 0 && officeAddress !== null) updates.officeAddress = officeAddress.trim() || null;
      if (officePhone !== void 0 && officePhone !== null) updates.officePhone = officePhone.trim() || null;
      if (password?.trim()) {
        updates.password = await bcrypt.hash(password.trim(), 10);
      }
      if (role !== void 0) {
        if (!ALLOWED_ROLES.includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        updates.role = role;
      }
      if (isActive !== void 0) {
        updates.isActive = isActive;
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      if (currentUser && id === currentUser.id) {
        if (role && role !== currentUser.role) {
          return res.status(400).json({ message: "Cannot change your own role" });
        }
        if (isActive === false) {
          return res.status(400).json({ message: "Cannot deactivate your own account" });
        }
      }
      if (targetUser.role === "admin" && (!currentUser || id !== currentUser.id)) {
        if (role && role !== targetUser.role) {
          return res.status(403).json({ message: "Cannot change another admin's role" });
        }
        if (isActive === false) {
          return res.status(403).json({ message: "Cannot deactivate another admin" });
        }
      }
      const updatedUser = await storage.updateUser(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: updatedUser });
    } catch (error) {
      log4.error("Failed to update user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  router8.patch("/users/:id/status", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser && id === currentUser.id && isActive === false) {
        return res.status(400).json({ message: "Cannot deactivate your own account" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "admin" && !isActive && (!currentUser || user.id !== currentUser.id)) {
        return res.status(400).json({ message: "Cannot deactivate other admin users" });
      }
      const updatedUser = await storage.updateUser(id, { isActive });
      res.json({ user: updatedUser });
    } catch (error) {
      log4.error("Failed to update user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });
  router8.post("/users", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const {
        mobile,
        fullName,
        role,
        district,
        password,
        firstName,
        lastName,
        username,
        email,
        alternatePhone,
        designation,
        department,
        employeeId,
        officeAddress,
        officePhone
      } = req.body;
      if (role !== "property_owner") {
        if (!mobile || !firstName || !lastName || !password) {
          return res.status(400).json({ message: "Mobile, first name, last name, and password are required for staff users" });
        }
      } else {
        if (!mobile || !fullName || !password) {
          return res.status(400).json({ message: "Mobile, full name, and password are required" });
        }
      }
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format" });
      }
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const existingUser = await db.select().from(users).where(eq11(users.mobile, mobile)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "A user with this mobile number already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        mobile,
        fullName: fullName || `${firstName} ${lastName}`,
        role,
        district: district?.trim() || null,
        password: hashedPassword,
        isActive: true
      };
      if (role !== "property_owner") {
        userData.firstName = firstName?.trim() || null;
        userData.lastName = lastName?.trim() || null;
        userData.username = username?.trim() || null;
        userData.email = email?.trim() || null;
        userData.alternatePhone = alternatePhone?.trim() || null;
        userData.designation = designation?.trim() || null;
        userData.department = department?.trim() || null;
        userData.employeeId = employeeId?.trim() || null;
        userData.officeAddress = officeAddress?.trim() || null;
        userData.officePhone = officePhone?.trim() || null;
      }
      const [newUser] = await db.insert(users).values(userData).returning();
      log4.info(`[admin] Created new user: ${userData.fullName} (${role}) - ${mobile}`);
      res.json({ user: newUser, message: "User created successfully" });
    } catch (error) {
      log4.error("Failed to create user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  return router8;
}

// server/routes/admin/settings.ts
init_middleware();
init_logger();
init_db();
init_schema();
init_systemSettings();
import express5 from "express";
import { eq as eq14 } from "drizzle-orm";

// server/routes/core/captcha.ts
init_db();
init_schema();
init_logger();
import { eq as eq12 } from "drizzle-orm";
var CAPTCHA_SETTING_KEY = "auth_captcha_enabled";
var LEGACY_CAPTCHA_SETTING_KEY = "captcha_enabled";
var CAPTCHA_CACHE_TTL = 5 * 60 * 1e3;
var CAPTCHA_FORCE_DISABLE = (() => {
  const raw = typeof process.env.CAPTCHA_FORCE_DISABLE === "string" ? process.env.CAPTCHA_FORCE_DISABLE.trim().toLowerCase() : null;
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }
  return process.env.PORT === "4000";
})();
var captchaLog = logger.child({ module: "captcha-settings" });
captchaLog.info("[captcha] configuration", {
  port: process.env.PORT,
  forcedFlag: process.env.CAPTCHA_FORCE_DISABLE,
  computedForceDisable: CAPTCHA_FORCE_DISABLE
});
var captchaSettingCache = {
  fetchedAt: 0,
  enabled: true
};
var shouldBypassCaptcha = (hostHeader) => {
  const normalizedHost = (hostHeader || "").toLowerCase();
  captchaLog.info(`[captcha-debug] shouldBypassCaptcha called with host: '${hostHeader}', normalized: '${normalizedHost}'`);
  return true;
  if (CAPTCHA_FORCE_DISABLE) {
    return true;
  }
  return normalizedHost.includes("hptourism.osipl.dev") || normalizedHost.includes("dev1.osipl.dev");
};
var updateCaptchaSettingCache = (enabled) => {
  captchaSettingCache.enabled = enabled;
  captchaSettingCache.fetchedAt = Date.now();
};
var getCaptchaSetting = async () => {
  if (CAPTCHA_FORCE_DISABLE) {
    const wasEnabled = captchaSettingCache.enabled !== false;
    updateCaptchaSettingCache(false);
    if (wasEnabled) {
      captchaLog.info("[captcha] Force-disabled via configuration/port override");
    }
    return false;
  }
  const now = Date.now();
  if (now - captchaSettingCache.fetchedAt < CAPTCHA_CACHE_TTL) {
    return captchaSettingCache.enabled;
  }
  const [primarySetting] = await db.select().from(systemSettings).where(eq12(systemSettings.settingKey, CAPTCHA_SETTING_KEY)).limit(1);
  let setting = primarySetting;
  if (!setting) {
    const [legacySetting] = await db.select().from(systemSettings).where(eq12(systemSettings.settingKey, LEGACY_CAPTCHA_SETTING_KEY)).limit(1);
    if (legacySetting) {
      captchaLog.warn("[captcha] Using legacy captcha setting key 'captcha_enabled'; consider migrating to 'auth_captcha_enabled'");
      setting = legacySetting;
    }
  }
  let enabled = true;
  if (setting?.settingValue !== void 0 && setting?.settingValue !== null) {
    const value = setting.settingValue;
    if (typeof value === "boolean") {
      enabled = value;
    } else if (typeof value === "object") {
      enabled = "enabled" in value ? Boolean(value.enabled) : "value" in value ? Boolean(value.value) : enabled;
    }
  }
  updateCaptchaSettingCache(enabled);
  return enabled;
};

// server/routes/admin/settings.ts
init_multi_service();
var log5 = logger.child({ module: "admin-settings-router" });
function createAdminSettingsRouter() {
  const router8 = express5.Router();
  router8.get("/settings/payment/test-mode", async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord("payment_test_mode");
      const enabled = Boolean(existing?.settingValue?.enabled);
      res.json({ enabled, source: existing ? "database" : "default" });
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to fetch payment test mode");
      res.status(500).json({ message: "Failed to fetch payment test mode" });
    }
  });
  router8.post("/settings/payment/test-mode/toggle", async (req, res) => {
    try {
      const enabled = Boolean(req.body?.enabled);
      const userId = req.session?.userId ?? null;
      const [existing] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, "payment_test_mode")).limit(1);
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: { enabled },
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, "payment_test_mode")).returning();
        log5.info({ userId, enabled }, "[admin] Test payment mode updated");
        res.json(updated);
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: "payment_test_mode",
          settingValue: { enabled },
          description: "When enabled, payment requests send \u20B91 to gateway instead of actual amount (for testing)",
          category: "payment",
          updatedBy: userId
        }).returning();
        log5.info({ userId, enabled }, "[admin] Test payment mode created");
        res.json(created);
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to toggle test payment mode");
      res.status(500).json({ message: "Failed to toggle test payment mode" });
    }
  });
  router8.get("/settings/auth/captcha", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const enabled = await getCaptchaSetting();
      res.json({ enabled });
    } catch (error) {
      log5.error("[admin] Failed to fetch captcha setting:", error);
      res.status(500).json({ message: "Failed to fetch captcha setting" });
    }
  });
  router8.post("/settings/auth/captcha/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }
      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(CAPTCHA_SETTING_KEY);
      if (existing) {
        await db.update(systemSettings).set({
          settingValue: { enabled },
          description: "Toggle captcha requirement",
          category: "auth",
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, CAPTCHA_SETTING_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: CAPTCHA_SETTING_KEY,
          settingValue: { enabled },
          description: "Toggle captcha requirement",
          category: "auth",
          updatedBy: userId
        });
      }
      await updateCaptchaSettingCache(enabled);
      res.json({ enabled });
    } catch (error) {
      log5.error("[admin] Failed to toggle captcha:", error);
      res.status(500).json({ message: "Failed to toggle captcha" });
    }
  });
  router8.get("/settings/portal/multi-service", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const enabled = await getMultiServiceHubEnabled();
      res.json({ enabled });
    } catch (error) {
      log5.error("[admin] Failed to fetch multi-service hub setting:", error);
      res.status(500).json({ message: "Failed to fetch multi-service hub setting" });
    }
  });
  router8.post("/settings/portal/multi-service/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }
      const userId = req.session.userId || void 0;
      await setMultiServiceHubEnabled(enabled, userId);
      res.json({ enabled });
    } catch (error) {
      log5.error("[admin] Failed to toggle multi-service hub:", error);
      res.status(500).json({ message: "Failed to toggle multi-service hub" });
    }
  });
  router8.get("/settings/super-console", requireRole("super_admin"), async (_req, res) => {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, "admin_super_console_enabled")).limit(1);
      let enabled = false;
      if (setting) {
        const value = setting.settingValue;
        if (typeof value === "boolean") {
          enabled = value;
        } else if (value && typeof value === "object" && "enabled" in value) {
          enabled = Boolean(value.enabled);
        } else if (typeof value === "string") {
          enabled = value === "true";
        }
      }
      res.json({ enabled, environment: process.env.NODE_ENV || "development" });
    } catch (error) {
      log5.error("[admin] Failed to fetch super console setting:", error);
      res.status(500).json({ message: "Failed to fetch super console setting" });
    }
  });
  router8.post("/settings/super-console/toggle", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      const userId = req.session.userId || null;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }
      const [existingSetting] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, "admin_super_console_enabled")).limit(1);
      if (existingSetting) {
        await db.update(systemSettings).set({
          settingValue: { enabled },
          description: "Enable/disable super console",
          category: "admin",
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, "admin_super_console_enabled"));
      } else {
        await db.insert(systemSettings).values({
          settingKey: "admin_super_console_enabled",
          settingValue: { enabled },
          description: "Enable/disable super console",
          category: "admin",
          updatedBy: userId
        });
      }
      res.json({ success: true, enabled });
    } catch (error) {
      log5.error("[admin] Failed to toggle super console:", error);
      res.status(500).json({ message: "Failed to toggle super console" });
    }
  });
  router8.get("/settings/:key", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const key = trimOptionalString(req.params.key);
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      const record = await getSystemSettingRecord(key);
      res.json(record ?? null);
    } catch (error) {
      log5.error("[admin] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  router8.put("/settings/:key", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const key = trimOptionalString(req.params.key);
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(key);
      const value = req.body?.value ?? req.body;
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: value,
          updatedAt: /* @__PURE__ */ new Date(),
          updatedBy: userId
        }).where(eq14(systemSettings.settingKey, key)).returning();
        res.json(updated);
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: key,
          settingValue: value,
          updatedBy: userId
        }).returning();
        res.json(created);
      }
    } catch (error) {
      log5.error("[admin] Failed to update setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  const PAYMENT_WORKFLOW_SETTING_KEY2 = "payment_workflow";
  router8.get("/settings/payment/workflow", requireRole("super_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(PAYMENT_WORKFLOW_SETTING_KEY2);
      const settingValue = existing?.settingValue;
      const workflow = settingValue?.workflow ?? "on_approval";
      const upfrontSubmitMode = settingValue?.upfrontSubmitMode ?? "auto";
      res.json({ workflow, upfrontSubmitMode, source: existing ? "database" : "default" });
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to fetch payment workflow setting");
      res.status(500).json({ message: "Failed to fetch payment workflow setting" });
    }
  });
  router8.post("/settings/payment/workflow/toggle", requireRole("super_admin"), async (req, res) => {
    try {
      const workflow = req.body?.workflow;
      if (!workflow || !["upfront", "on_approval"].includes(workflow)) {
        return res.status(400).json({ message: "workflow must be 'upfront' or 'on_approval'" });
      }
      const userId = req.session?.userId ?? null;
      const [existing] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY2)).limit(1);
      const currentValue = existing?.settingValue;
      const upfrontSubmitMode = currentValue?.upfrontSubmitMode ?? "auto";
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: { workflow, upfrontSubmitMode },
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY2)).returning();
        log5.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment workflow updated");
        res.json(updated);
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: PAYMENT_WORKFLOW_SETTING_KEY2,
          settingValue: { workflow, upfrontSubmitMode },
          description: "Payment workflow: 'upfront' = pay before submission, 'on_approval' = pay after approval",
          category: "payment",
          updatedBy: userId
        }).returning();
        log5.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment workflow created");
        res.json(created);
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to toggle payment workflow");
      res.status(500).json({ message: "Failed to toggle payment workflow" });
    }
  });
  router8.post("/settings/payment/workflow/submit-mode", requireRole("super_admin"), async (req, res) => {
    try {
      const upfrontSubmitMode = req.body?.upfrontSubmitMode;
      if (!upfrontSubmitMode || !["auto", "manual"].includes(upfrontSubmitMode)) {
        return res.status(400).json({ message: "upfrontSubmitMode must be 'auto' or 'manual'" });
      }
      const userId = req.session?.userId ?? null;
      const [existing] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY2)).limit(1);
      const currentValue = existing?.settingValue;
      const workflow = currentValue?.workflow ?? "on_approval";
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: { workflow, upfrontSubmitMode },
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY2)).returning();
        log5.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment submit mode updated");
        res.json(updated);
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: PAYMENT_WORKFLOW_SETTING_KEY2,
          settingValue: { workflow, upfrontSubmitMode },
          description: "Payment workflow: 'upfront' = pay before submission, 'on_approval' = pay after approval",
          category: "payment",
          updatedBy: userId
        }).returning();
        log5.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment submit mode created");
        res.json(created);
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to toggle payment submit mode");
      res.status(500).json({ message: "Failed to toggle payment submit mode" });
    }
  });
  const SERVICE_VISIBILITY_KEY = "service_visibility_config";
  const INSPECTION_CONFIG_KEY = "inspection_config";
  router8.get("/settings/portal/services", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const [visibilitySetting, inspectionSetting] = await Promise.all([
        getSystemSettingRecord(SERVICE_VISIBILITY_KEY),
        getSystemSettingRecord(INSPECTION_CONFIG_KEY)
      ]);
      res.json({
        visibility: visibilitySetting?.settingValue ?? {
          homestay: true,
          // Always active
          hotels: false,
          guest_houses: false,
          travel_agencies: false,
          adventure_tourism: true,
          // Currently active in code
          transport: false,
          restaurants: false,
          winter_sports: false
        },
        inspection: inspectionSetting?.settingValue ?? {
          optionalKinds: []
          // e.g. ['delete_rooms', 'cancel_certificate']
        }
      });
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to fetch service settings");
      res.status(500).json({ message: "Failed to fetch service settings" });
    }
  });
  router8.post("/settings/portal/services/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { serviceId, enabled } = req.body;
      const userId = req.session?.userId ?? null;
      if (!serviceId) return res.status(400).json({ message: "Service ID required" });
      const setting = await getSystemSettingRecord(SERVICE_VISIBILITY_KEY);
      const currentConfig = setting?.settingValue ?? {
        homestay: true,
        hotels: false,
        guest_houses: false,
        travel_agencies: false,
        adventure_tourism: true,
        transport: false,
        restaurants: false,
        winter_sports: false
      };
      const newConfig = { ...currentConfig, [serviceId]: enabled };
      if (setting) {
        await db.update(systemSettings).set({ settingValue: newConfig, updatedBy: userId, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(systemSettings.settingKey, SERVICE_VISIBILITY_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: SERVICE_VISIBILITY_KEY,
          settingValue: newConfig,
          description: "Controls which services are visible on the portal",
          category: "portal",
          updatedBy: userId
        });
      }
      res.json(newConfig);
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to toggle service visibility");
      res.status(500).json({ message: "Failed to update service visibility" });
    }
  });
  router8.post("/settings/inspection/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { applicationKind, optional } = req.body;
      const userId = req.session?.userId ?? null;
      if (!applicationKind) return res.status(400).json({ message: "Application Kind required" });
      const setting = await getSystemSettingRecord(INSPECTION_CONFIG_KEY);
      const currentConfig = setting?.settingValue ?? { optionalKinds: [] };
      const currentSet = new Set(currentConfig.optionalKinds || []);
      if (optional) {
        currentSet.add(applicationKind);
      } else {
        currentSet.delete(applicationKind);
      }
      const newConfig = { optionalKinds: Array.from(currentSet) };
      if (setting) {
        await db.update(systemSettings).set({ settingValue: newConfig, updatedBy: userId, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(systemSettings.settingKey, INSPECTION_CONFIG_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: INSPECTION_CONFIG_KEY,
          settingValue: newConfig,
          description: "Configuration for inspection workflows (e.g. optional inspections)",
          category: "workflow",
          updatedBy: userId
        });
      }
      res.json(newConfig);
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to toggle inspection config");
      res.status(500).json({ message: "Failed to update inspection config" });
    }
  });
  const DEFAULT_PAYMENT_GATEWAY_KEY = "default_payment_gateway";
  router8.get("/settings/payment/gateway", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(DEFAULT_PAYMENT_GATEWAY_KEY);
      const gateway = existing?.settingValue?.gateway ?? "himkosh";
      res.json({
        gateway,
        source: existing ? "database" : "default",
        available: ["himkosh", "ccavenue"]
      });
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to fetch default payment gateway");
      res.status(500).json({ message: "Failed to fetch default payment gateway" });
    }
  });
  router8.post("/settings/payment/gateway", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const gateway = req.body?.gateway;
      if (!gateway || !["himkosh", "ccavenue"].includes(gateway)) {
        return res.status(400).json({ message: "gateway must be 'himkosh' or 'ccavenue'" });
      }
      const userId = req.session?.userId ?? null;
      const [existing] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, DEFAULT_PAYMENT_GATEWAY_KEY)).limit(1);
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: { gateway },
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, DEFAULT_PAYMENT_GATEWAY_KEY)).returning();
        log5.info({ userId, gateway }, "[admin] Default payment gateway updated");
        res.json(updated);
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: DEFAULT_PAYMENT_GATEWAY_KEY,
          settingValue: { gateway },
          description: "Default payment gateway: 'himkosh' or 'ccavenue' (Kotak Mahindra)",
          category: "payment",
          updatedBy: userId
        }).returning();
        log5.info({ userId, gateway }, "[admin] Default payment gateway created");
        res.json(created);
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to update default payment gateway");
      res.status(500).json({ message: "Failed to update default payment gateway" });
    }
  });
  const RATE_LIMIT_SETTING_KEY2 = "rate_limit_configuration";
  const DEFAULT_RATE_LIMIT_CONFIG = {
    enabled: true,
    global: { maxRequests: 1e3, windowMinutes: 15 },
    auth: { maxRequests: 20, windowMinutes: 10 },
    upload: { maxRequests: 100, windowMinutes: 10 }
  };
  router8.get("/settings/security/rate-limits", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(RATE_LIMIT_SETTING_KEY2);
      if (existing?.settingValue) {
        res.json({
          ...DEFAULT_RATE_LIMIT_CONFIG,
          ...existing.settingValue,
          source: "database"
        });
      } else {
        res.json({ ...DEFAULT_RATE_LIMIT_CONFIG, source: "default" });
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to fetch rate limit settings");
      res.status(500).json({ message: "Failed to fetch rate limit settings" });
    }
  });
  router8.post("/settings/security/rate-limits", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled, global, auth, upload: upload2 } = req.body;
      const userId = req.session?.userId ?? null;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }
      const newConfig = {
        enabled,
        global: {
          maxRequests: Math.max(1, Math.min(1e4, parseInt(global?.maxRequests) || 1e3)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(global?.windowMinutes) || 15))
        },
        auth: {
          maxRequests: Math.max(1, Math.min(100, parseInt(auth?.maxRequests) || 20)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(auth?.windowMinutes) || 10))
        },
        upload: {
          maxRequests: Math.max(1, Math.min(500, parseInt(upload2?.maxRequests) || 100)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(upload2?.windowMinutes) || 10))
        }
      };
      const [existing] = await db.select().from(systemSettings).where(eq14(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY2)).limit(1);
      if (existing) {
        const [updated] = await db.update(systemSettings).set({
          settingValue: newConfig,
          updatedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq14(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY2)).returning();
        log5.info({ userId, config: newConfig }, "[admin] Rate limit configuration updated");
        res.json({ ...newConfig, source: "database" });
      } else {
        const [created] = await db.insert(systemSettings).values({
          settingKey: RATE_LIMIT_SETTING_KEY2,
          settingValue: newConfig,
          description: "Rate limit configuration for API endpoints",
          category: "security",
          updatedBy: userId
        }).returning();
        log5.info({ userId, config: newConfig }, "[admin] Rate limit configuration created");
        res.json({ ...newConfig, source: "database" });
      }
    } catch (error) {
      log5.error({ err: error }, "[admin] Failed to update rate limit settings");
      res.status(500).json({ message: "Failed to update rate limit settings" });
    }
  });
  return router8;
}

// server/routes/admin/legacy-rc.ts
init_db();
init_middleware();
init_logger();
import express6 from "express";
import { and as and3, desc as desc3, eq as eq16, like, sql as sql6 } from "drizzle-orm";
import { z as z3 } from "zod";

// server/routes/helpers/legacy.ts
init_applicationNumber();
init_db();
init_schema();
init_systemSettings();
import { eq as eq15, sql as sql5 } from "drizzle-orm";
var LEGACY_RC_PREFIX = "LEGACY-";
var ADMIN_RC_ALLOWED_ROLES = ["admin_rc", "admin", "super_admin", "system_admin"];
var LEGACY_CATEGORY_OPTIONS = ["diamond", "gold", "silver"];
var LEGACY_LOCATION_TYPES = ["mc", "tcp", "gp"];
var LEGACY_PROPERTY_OWNERSHIP = ["owned", "leased"];
var LEGACY_OWNER_GENDERS = ["male", "female", "other"];
var LEGACY_STATUS_OPTIONS = [
  "draft",
  "legacy_rc_review",
  "submitted",
  "under_scrutiny",
  "forwarded_to_dtdo",
  "dtdo_review",
  "inspection_scheduled",
  "inspection_under_review",
  "verified_for_payment",
  "payment_pending",
  "approved",
  "rejected"
];
var LEGACY_DTD0_FORWARD_SETTING_KEY = "legacy_dtdo_forward_enabled";
var LEGACY_SERIAL_SEED_KEY = "legacy_application_serial_seed";
var getLegacySerialSeed = async () => {
  const seedRow = await db.select({ value: systemSettings.settingValue }).from(systemSettings).where(eq15(systemSettings.settingKey, LEGACY_SERIAL_SEED_KEY)).limit(1);
  const seedValue = seedRow?.[0]?.value ? parseInt(seedRow[0].value, 10) : 0;
  return Number.isFinite(seedValue) && seedValue > 0 ? seedValue : 0;
};
var generateLegacyApplicationNumber = async (district) => {
  const year = String((/* @__PURE__ */ new Date()).getFullYear());
  const districtCode = getDistrictCode(district);
  const [row] = await db.select({
    maxSerial: sql5`COALESCE(MAX(CAST(substring(${homestayApplications.applicationNumber} from '([0-9]+)$') AS INTEGER)), 0)`
  }).from(homestayApplications).where(sql5`substring(${homestayApplications.applicationNumber} from '^LG-HS') IS NOT NULL`);
  const maxSerial = row?.maxSerial ?? 0;
  const seed = await getLegacySerialSeed();
  const baseline = Math.max(maxSerial, seed - 1);
  const serial = String(baseline + 1).padStart(6, "0");
  return `LG-HS-${year}-${districtCode}-${serial}`;
};
var getLegacyForwardEnabled = async () => {
  const record = await getSystemSettingRecord(LEGACY_DTD0_FORWARD_SETTING_KEY);
  return normalizeBooleanSetting(record?.settingValue, true);
};

// server/routes/admin/legacy-rc.ts
init_schema();
var log6 = logger.child({ module: "admin-legacy-rc" });
var numberOrNull = (value) => {
  if (value === void 0) return void 0;
  if (value === null) return null;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value;
};
var toNumberFromUnknown = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed2 = Number(value);
    return Number.isFinite(parsed2) ? parsed2 : null;
  }
  return null;
};
function createAdminLegacyRcRouter() {
  const router8 = express6.Router();
  const legacySelection = {
    application: homestayApplications,
    owner: {
      id: users.id,
      fullName: users.fullName,
      mobile: users.mobile,
      email: users.email,
      district: users.district
    }
  };
  const legacyApplicationUpdateSchema = z3.object({
    propertyName: z3.string().min(3),
    category: z3.enum(LEGACY_CATEGORY_OPTIONS),
    locationType: z3.enum(LEGACY_LOCATION_TYPES),
    status: z3.enum(LEGACY_STATUS_OPTIONS),
    projectType: z3.string().min(2),
    propertyOwnership: z3.enum(LEGACY_PROPERTY_OWNERSHIP),
    address: z3.string().min(3),
    district: z3.string().min(3),
    tehsil: z3.string().min(3),
    block: z3.string().nullable().optional(),
    gramPanchayat: z3.string().nullable().optional(),
    pincode: z3.string().min(4),
    ownerName: z3.string().min(3),
    ownerMobile: z3.string().min(6),
    ownerEmail: z3.string().email().nullable().optional(),
    ownerAadhaar: z3.string().min(6),
    ownerGender: z3.enum(LEGACY_OWNER_GENDERS),
    propertyArea: z3.number().positive(),
    singleBedRooms: z3.number().int().min(0).nullable().optional(),
    singleBedRoomRate: z3.number().min(0).nullable().optional(),
    doubleBedRooms: z3.number().int().min(0).nullable().optional(),
    doubleBedRoomRate: z3.number().min(0).nullable().optional(),
    familySuites: z3.number().int().min(0).nullable().optional(),
    familySuiteRate: z3.number().min(0).nullable().optional(),
    attachedWashrooms: z3.number().int().min(0).nullable().optional(),
    distanceAirport: z3.number().min(0).nullable().optional(),
    distanceRailway: z3.number().min(0).nullable().optional(),
    distanceCityCenter: z3.number().min(0).nullable().optional(),
    distanceShopping: z3.number().min(0).nullable().optional(),
    distanceBusStand: z3.number().min(0).nullable().optional(),
    certificateNumber: z3.string().max(100).nullable().optional(),
    certificateIssuedDate: z3.string().datetime().nullable().optional(),
    certificateExpiryDate: z3.string().datetime().nullable().optional(),
    serviceNotes: z3.string().nullable().optional(),
    guardianName: z3.string().nullable().optional()
  });
  const legacyOrderBy = sql6`COALESCE(${homestayApplications.updatedAt}, ${homestayApplications.createdAt}, NOW())`;
  router8.get("/admin-rc/applications", requireRole(...ADMIN_RC_ALLOWED_ROLES), async (_req, res) => {
    try {
      const rows = await db.select(legacySelection).from(homestayApplications).leftJoin(users, eq16(users.id, homestayApplications.userId)).where(like(homestayApplications.applicationNumber, `${LEGACY_RC_PREFIX}%`)).orderBy(desc3(legacyOrderBy));
      const applications = rows.map((row) => ({
        application: row.application,
        owner: row.owner?.id ? row.owner : null
      }));
      res.json({ applications });
    } catch (error) {
      log6.error("[admin-rc] Failed to fetch legacy applications:", error);
      res.status(500).json({ message: "Failed to load legacy applications" });
    }
  });
  router8.get("/admin-rc/applications/:id", requireRole(...ADMIN_RC_ALLOWED_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const [record] = await db.select(legacySelection).from(homestayApplications).leftJoin(users, eq16(users.id, homestayApplications.userId)).where(and3(eq16(homestayApplications.id, id), like(homestayApplications.applicationNumber, `${LEGACY_RC_PREFIX}%`))).limit(1);
      if (!record) {
        return res.status(404).json({ message: "Legacy application not found" });
      }
      const docList = await db.select().from(documents).where(eq16(documents.applicationId, id));
      res.json({
        application: record.application,
        owner: record.owner?.id ? record.owner : null,
        documents: docList
      });
    } catch (error) {
      log6.error("[admin-rc] Failed to fetch application:", error);
      res.status(500).json({ message: "Failed to load application" });
    }
  });
  router8.patch("/admin-rc/applications/:id", requireRole(...ADMIN_RC_ALLOWED_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const [existing] = await db.select(legacySelection).from(homestayApplications).leftJoin(users, eq16(users.id, homestayApplications.userId)).where(and3(eq16(homestayApplications.id, id), like(homestayApplications.applicationNumber, `${LEGACY_RC_PREFIX}%`))).limit(1);
      if (!existing) {
        return res.status(404).json({ message: "Legacy application not found" });
      }
      const payload = legacyApplicationUpdateSchema.parse(req.body ?? {});
      const resolveNumeric = (incoming, fallback, { allowNull = true } = {}) => {
        const normalized = numberOrNull(incoming);
        if (normalized !== void 0) {
          if (normalized === null && !allowNull) {
            return typeof fallback === "number" ? fallback : toNumberFromUnknown(fallback) ?? null;
          }
          return normalized;
        }
        if (typeof fallback === "number") return fallback;
        return toNumberFromUnknown(fallback);
      };
      const resolvedPropertyArea = resolveNumeric(payload.propertyArea, toNumberFromUnknown(existing.application.propertyArea), { allowNull: false }) ?? 0;
      const resolvedSingleRooms = resolveNumeric(payload.singleBedRooms, existing.application.singleBedRooms);
      const resolvedDoubleRooms = resolveNumeric(payload.doubleBedRooms, existing.application.doubleBedRooms);
      const resolvedFamilySuites = resolveNumeric(payload.familySuites, existing.application.familySuites);
      const totalRooms = (resolvedSingleRooms ?? 0) + (resolvedDoubleRooms ?? 0) + (resolvedFamilySuites ?? 0);
      const updatePayload = {
        propertyName: trimRequiredString(payload.propertyName),
        category: payload.category,
        locationType: payload.locationType,
        status: payload.status,
        projectType: payload.projectType,
        propertyOwnership: payload.propertyOwnership,
        address: trimRequiredString(payload.address),
        district: trimRequiredString(payload.district),
        tehsil: trimRequiredString(payload.tehsil),
        block: trimOptionalString(payload.block) ?? null,
        gramPanchayat: trimOptionalString(payload.gramPanchayat) ?? null,
        pincode: trimRequiredString(payload.pincode),
        ownerName: trimRequiredString(payload.ownerName),
        ownerMobile: trimRequiredString(payload.ownerMobile),
        ownerEmail: trimOptionalString(payload.ownerEmail) ?? null,
        guardianName: trimOptionalString(payload.guardianName) ?? null,
        ownerAadhaar: trimRequiredString(payload.ownerAadhaar),
        ownerGender: payload.ownerGender,
        propertyArea: resolvedPropertyArea,
        singleBedRooms: resolvedSingleRooms ?? 0,
        doubleBedRooms: resolvedDoubleRooms ?? 0,
        familySuites: resolvedFamilySuites ?? 0,
        singleBedRoomRate: resolveNumeric(payload.singleBedRoomRate, toNumberFromUnknown(existing.application.singleBedRoomRate)),
        doubleBedRoomRate: resolveNumeric(payload.doubleBedRoomRate, toNumberFromUnknown(existing.application.doubleBedRoomRate)),
        familySuiteRate: resolveNumeric(payload.familySuiteRate, toNumberFromUnknown(existing.application.familySuiteRate)),
        attachedWashrooms: resolveNumeric(payload.attachedWashrooms, existing.application.attachedWashrooms),
        distanceAirport: resolveNumeric(payload.distanceAirport, toNumberFromUnknown(existing.application.distanceAirport)),
        distanceRailway: resolveNumeric(payload.distanceRailway, toNumberFromUnknown(existing.application.distanceRailway)),
        distanceCityCenter: resolveNumeric(payload.distanceCityCenter, toNumberFromUnknown(existing.application.distanceCityCenter)),
        distanceShopping: resolveNumeric(payload.distanceShopping, toNumberFromUnknown(existing.application.distanceShopping)),
        distanceBusStand: resolveNumeric(payload.distanceBusStand, toNumberFromUnknown(existing.application.distanceBusStand)),
        certificateNumber: trimOptionalString(payload.certificateNumber) ?? null,
        certificateIssuedDate: parseIsoDateOrNull(payload.certificateIssuedDate),
        certificateExpiryDate: parseIsoDateOrNull(payload.certificateExpiryDate),
        serviceNotes: trimOptionalString(payload.serviceNotes) ?? null,
        totalRooms,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const currentServiceContext = existing.application.serviceContext && typeof existing.application.serviceContext === "object" ? { ...existing.application.serviceContext } : {};
      if (payload.guardianName !== void 0) {
        currentServiceContext.legacyGuardianName = trimOptionalString(payload.guardianName) ?? null;
      }
      updatePayload.serviceContext = currentServiceContext;
      await db.update(homestayApplications).set(updatePayload).where(eq16(homestayApplications.id, id));
      if (existing.owner?.id) {
        const ownerUpdates = {};
        if (payload.ownerName) ownerUpdates.fullName = trimRequiredString(payload.ownerName);
        if (payload.ownerMobile) ownerUpdates.mobile = trimRequiredString(payload.ownerMobile);
        if (payload.ownerEmail !== void 0) ownerUpdates.email = trimOptionalString(payload.ownerEmail) ?? null;
        if (payload.district) ownerUpdates.district = trimRequiredString(payload.district);
        if (Object.keys(ownerUpdates).length > 0) {
          ownerUpdates.updatedAt = /* @__PURE__ */ new Date();
          await db.update(users).set(ownerUpdates).where(eq16(users.id, existing.owner.id));
        }
      }
      const [updated] = await db.select(legacySelection).from(homestayApplications).leftJoin(users, eq16(users.id, homestayApplications.userId)).where(eq16(homestayApplications.id, id)).limit(1);
      const docList = await db.select().from(documents).where(eq16(documents.applicationId, id));
      res.json({
        application: updated?.application,
        owner: updated?.owner?.id ? updated.owner : null,
        documents: docList
      });
    } catch (error) {
      log6.error("[admin-rc] Failed to update legacy application:", error);
      res.status(500).json({ message: "Failed to update legacy application" });
    }
  });
  router8.patch("/admin-rc/applications/:id/status", requireRole(...ADMIN_RC_ALLOWED_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      const validStatuses = [
        "legacy_rc_review",
        "dtdo_review",
        "under_scrutiny",
        "forwarded_to_dtdo",
        "approved",
        "rejected",
        "reverted_by_dtdo",
        "sent_back_for_corrections"
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Valid: ${validStatuses.join(", ")}` });
      }
      const [existing] = await db.select({ id: homestayApplications.id, applicationNumber: homestayApplications.applicationNumber }).from(homestayApplications).where(eq16(homestayApplications.id, id)).limit(1);
      if (!existing) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (!existing.applicationNumber?.startsWith("LG-HS-") && !existing.applicationNumber?.startsWith("LEGACY-")) {
        return res.status(400).json({ message: "Not a legacy RC application" });
      }
      await db.update(homestayApplications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq16(homestayApplications.id, id));
      log6.info(`[admin-rc] Status updated for ${existing.applicationNumber}: ${status}`);
      res.json({ message: "Status updated", applicationNumber: existing.applicationNumber, status });
    } catch (error) {
      log6.error("[admin-rc] Failed to update status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });
  return router8;
}

// server/routes/admin/stats.ts
init_db();
init_schema();
init_middleware();
init_logger();
import express7 from "express";
import { eq as eq17 } from "drizzle-orm";
var log7 = logger.child({ module: "admin-stats-router" });
function createAdminStatsRouter() {
  const router8 = express7.Router();
  router8.get("/dashboard/stats", requireRole("super_admin", "admin", "system_admin"), async (_req, res) => {
    try {
      const allApplications = await db.select().from(homestayApplications);
      const statusCounts = allApplications.reduce((acc, app2) => {
        const statusKey = app2.status ?? "unknown";
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      }, {});
      const allUsers = await db.select().from(users);
      const propertyOwners = allUsers.filter((u) => u.role === "property_owner").length;
      const officers = allUsers.filter((u) => ["dealing_assistant", "district_tourism_officer", "state_officer"].includes(u.role)).length;
      const admins = allUsers.filter((u) => ["admin", "super_admin"].includes(u.role)).length;
      const [allInspectionOrders, allInspectionReports] = await Promise.all([
        db.select().from(inspectionOrders),
        db.select().from(inspectionReports)
      ]);
      const allPayments = await db.select().from(payments);
      const completedPayments = allPayments.filter((p) => p.paymentStatus === "completed");
      const totalAmount = completedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      res.json({
        applications: {
          total: allApplications.length,
          pending: statusCounts["submitted"] || 0,
          underReview: statusCounts["under_review"] || 0,
          approved: statusCounts["approved"] || 0,
          rejected: statusCounts["rejected"] || 0,
          draft: statusCounts["draft"] || 0
        },
        users: {
          total: allUsers.length,
          propertyOwners,
          officers,
          admins
        },
        inspections: {
          scheduled: allInspectionOrders.length,
          completed: allInspectionReports.length,
          pending: allInspectionOrders.length - allInspectionReports.length
        },
        payments: {
          total: allPayments.length,
          completed: completedPayments.length,
          pending: allPayments.length - completedPayments.length,
          totalAmount
        }
      });
    } catch (error) {
      log7.error("[admin] Failed to fetch dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
  router8.get("/stats", requireRole("super_admin", "admin", "system_admin"), async (_req, res) => {
    try {
      const [applicationsCount, usersCount, documentsCount, paymentsCount] = await Promise.all([
        db.select().from(homestayApplications).then((r) => r.length),
        db.select().from(users).then((r) => r.length),
        db.select().from(documents).then((r) => r.length),
        db.select().from(payments).then((r) => r.length)
      ]);
      const applications = await db.select().from(homestayApplications);
      const byStatus = applications.reduce((acc, app2) => {
        const statusKey = app2.status ?? "unknown";
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      }, {});
      const allUsers = await db.select().from(users);
      const byRole = allUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      const environment = process.env.NODE_ENV || "development";
      const [superConsoleSetting] = await db.select().from(systemSettings).where(eq17(systemSettings.settingKey, "admin_super_console_enabled")).limit(1);
      let superConsoleOverride = false;
      if (superConsoleSetting) {
        const value = superConsoleSetting.settingValue;
        if (typeof value === "boolean") superConsoleOverride = value;
        else if (value && typeof value === "object" && "enabled" in value) {
          superConsoleOverride = Boolean(value.enabled);
        } else if (typeof value === "string") superConsoleOverride = value === "true";
      }
      const resetEnabled = superConsoleOverride || environment === "development" || environment === "test";
      res.json({
        database: { size: "N/A", tables: 10 },
        applications: { total: applicationsCount, byStatus },
        users: { total: usersCount, byRole },
        files: { total: documentsCount, totalSize: "N/A" },
        environment,
        resetEnabled,
        superConsoleOverride
      });
    } catch (error) {
      log7.error("[admin] Failed to fetch stats:", error);
      res.status(500).json({ message: "Failed to fetch system statistics" });
    }
  });
  return router8;
}

// server/routes/admin/devops.ts
init_middleware();
init_db();
init_storage();
init_schema();
init_logger();
import express8 from "express";
import { exec } from "node:child_process";
import { ne, eq as eq18 } from "drizzle-orm";
var log8 = logger.child({ module: "admin-devops-router" });
function createAdminDevopsRouter() {
  const router8 = express8.Router();
  router8.post("/reset/granular", requireRole("super_admin"), async (req, res) => {
    try {
      const {
        confirmationText,
        reason,
        deleteApplications = true,
        deleteDocuments = true,
        deletePayments = true,
        deleteInspections = true,
        deleteCertificates = true,
        deleteNotifications = true,
        deletePropertyOwners = false
      } = req.body;
      const environment = process.env.NODE_ENV || "development";
      const allowReset = process.env.ALLOW_RESET_OPERATIONS === "true";
      const rawHost = req.get("x-forwarded-host") || req.get("host") || "";
      const isDevHost = /dev|localhost|test|staging/i.test(rawHost);
      if (environment === "production" && !allowReset && !isDevHost) {
        console.log(`[SuperAdmin] Granular Reset blocked. Env: ${environment}, Host: ${rawHost}, IsDev: ${isDevHost}`);
        return res.status(403).json({ message: "Reset operations are disabled in production" });
      }
      if (confirmationText !== "RESET") {
        return res.status(400).json({ message: 'Confirmation text must be "RESET"' });
      }
      if (!reason || reason.length < 10) {
        return res.status(400).json({ message: "Reason must be at least 10 characters" });
      }
      log8.info(`[super-admin] Granular reset - applications: ${deleteApplications}, documents: ${deleteDocuments}, payments: ${deletePayments}, inspections: ${deleteInspections}, certificates: ${deleteCertificates}, notifications: ${deleteNotifications}, propertyOwners: ${deletePropertyOwners}, reason: ${reason}`);
      const deletedCounts = {};
      if (deleteCertificates) {
        await db.delete(certificates);
        deletedCounts.certificates = "all";
      }
      if (deleteApplications) {
        await db.delete(clarifications);
        deletedCounts.clarifications = "all";
      }
      if (deleteInspections) {
        await db.delete(inspectionReports);
        await db.delete(inspectionOrders);
        deletedCounts.inspections = "all orders and reports";
      }
      if (deleteDocuments) {
        await db.delete(documents);
        deletedCounts.documents = "all";
      }
      if (deleteApplications) {
        await db.delete(applicationActions);
        deletedCounts.applicationActions = "all";
      }
      if (deleteApplications) {
        await db.delete(reviews);
        deletedCounts.reviews = "all";
      }
      if (deleteNotifications) {
        await db.delete(notifications);
        deletedCounts.notifications = "all";
      }
      if (deletePayments || deleteApplications) {
        await db.delete(himkoshTransactions);
        await db.delete(ccavenueTransactions);
        deletedCounts.himkoshTransactions = "all";
      }
      if (deletePayments) {
        await db.delete(payments);
        deletedCounts.payments = "all";
      }
      if (deleteApplications) {
        await db.delete(homestayApplications);
        deletedCounts.applications = "all";
      }
      if (deletePropertyOwners) {
        await db.delete(grievanceAuditLog);
        await db.delete(grievanceComments);
        await db.delete(grievances);
        deletedCounts.grievances = "all";
        await db.delete(storageObjects);
        deletedCounts.storageObjects = "all";
        await db.delete(users).where(eq18(users.role, "property_owner"));
        deletedCounts.propertyOwners = "all property owner accounts";
      }
      res.json({
        success: true,
        message: "Granular reset completed successfully",
        deletedCounts,
        preserved: ["Staff users (DA, DTDO, Admin)", "LGD data", "DDO codes"]
      });
    } catch (error) {
      log8.error("[super-admin] Granular reset failed:", error);
      res.status(500).json({ message: "Granular reset failed", error: String(error) });
    }
  });
  router8.post("/reset/:operation", requireRole("super_admin"), async (req, res) => {
    try {
      const { operation } = req.params;
      const { confirmationText, reason } = req.body;
      const environment = process.env.NODE_ENV || "development";
      const allowReset = process.env.ALLOW_RESET_OPERATIONS === "true";
      const rawHost = req.get("x-forwarded-host") || req.get("host") || "";
      const isDevHost = /dev|localhost|test|staging/i.test(rawHost);
      if (environment === "production" && !allowReset && !isDevHost) {
        console.log(`[SuperAdmin] Reset blocked. Env: ${environment}, Host: ${rawHost}, IsDev: ${isDevHost}`);
        return res.status(403).json({ message: "Reset operations are disabled in production" });
      }
      const requiredText = operation === "full" ? "RESET" : "DELETE";
      if (confirmationText !== requiredText) {
        return res.status(400).json({ message: `Confirmation text must be "${requiredText}"` });
      }
      if (!reason || reason.length < 10) {
        return res.status(400).json({ message: "Reason must be at least 10 characters" });
      }
      log8.info(`[super-admin] Reset operation: ${operation}, reason: ${reason}`);
      let deletedCounts = {};
      switch (operation) {
        case "full":
          await db.delete(certificates);
          await db.delete(clarifications);
          await db.delete(inspectionReports);
          await db.delete(inspectionOrders);
          await db.delete(documents);
          await db.delete(applicationActions);
          await db.delete(reviews);
          await db.delete(notifications);
          await db.delete(himkoshTransactions);
          await db.delete(payments);
          await db.delete(homestayApplications);
          await db.delete(productionStats);
          await db.delete(storageObjects);
          await db.delete(users).where(ne(users.role, "super_admin"));
          deletedCounts = { all: "All data except super_admin accounts" };
          break;
        case "applications":
          await db.delete(certificates);
          await db.delete(clarifications);
          await db.delete(inspectionReports);
          await db.delete(inspectionOrders);
          await db.delete(documents);
          await db.delete(applicationActions);
          await db.delete(reviews);
          await db.delete(notifications);
          await db.delete(himkoshTransactions);
          await db.delete(payments);
          await db.delete(homestayApplications);
          deletedCounts = { applications: "all" };
          break;
        case "users":
          await db.delete(users).where(ne(users.role, "super_admin"));
          deletedCounts = { users: "All non-super_admin users" };
          break;
        case "files":
          await db.delete(documents);
          deletedCounts = { documents: "all" };
          break;
        case "inspections":
          await db.delete(inspectionReports);
          await db.delete(inspectionOrders);
          deletedCounts = { inspections: "all orders and reports" };
          break;
        case "objections":
          await db.delete(clarifications);
          deletedCounts = { objections: "all objections and clarifications" };
          break;
        case "payments":
          await db.delete(payments);
          deletedCounts = { payments: "all" };
          break;
        default:
          return res.status(400).json({ message: "Invalid operation" });
      }
      res.json({ success: true, message: `Reset operation '${operation}' completed successfully`, deletedCounts });
    } catch (error) {
      log8.error("[super-admin] Reset failed:", error);
      res.status(500).json({ message: "Reset operation failed" });
    }
  });
  router8.post("/seed/:type", requireRole("super_admin"), async (req, res) => {
    try {
      const { type } = req.params;
      const { count: count2 = 10, scenario } = req.body;
      log8.info(`[super-admin] Seeding data: ${type}, count: ${count2}, scenario: ${scenario}`);
      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }
      switch (type) {
        case "applications": {
          const createdApps = [];
          for (let i = 0; i < count2; i++) {
            const nightlyRate = 2e3 + i * 150;
            const app2 = await storage.createApplication({
              userId: currentUser.id,
              propertyName: `Test Property ${i + 1}`,
              category: ["diamond", "gold", "silver"][i % 3],
              totalRooms: 4,
              address: `Test Address ${i + 1}, Shimla`,
              district: "Shimla",
              pincode: "171001",
              locationType: "mc",
              ownerName: `Test Owner ${i + 1}`,
              ownerMobile: `98${String(765e6 + i)}`,
              ownerEmail: `test${i + 1}@example.com`,
              ownerAadhaar: `${(1e11 + i).toString().slice(-12)}`,
              proposedRoomRate: nightlyRate,
              projectType: "new_project",
              propertyArea: 1200,
              singleBedRooms: 2,
              doubleBedRooms: 1,
              familySuites: 1,
              attachedWashrooms: 4,
              amenities: { wifi: true, parking: i % 2 === 0, restaurant: i % 3 === 0 },
              baseFee: (4e3 + i * 250).toString(),
              totalFee: (6e3 + i * 300).toString(),
              status: "draft",
              currentPage: 1,
              maxStepReached: 1
            });
            createdApps.push(app2);
          }
          return res.json({ success: true, message: `Created ${createdApps.length} test applications` });
        }
        case "users": {
          const testUsers = [];
          const roles = ["property_owner", "dealing_assistant", "district_tourism_officer", "state_officer"];
          for (const role of roles) {
            const user = await storage.createUser({
              fullName: `Test ${role.replace(/_/g, " ")}`,
              mobile: `9${role.length}${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`,
              email: `test.${role}@example.com`,
              password: "Test@123",
              role,
              district: role.includes("district") ? "shimla" : void 0
            });
            testUsers.push(user);
          }
          return res.json({ success: true, message: `Created ${testUsers.length} test users (all roles)` });
        }
        case "scenario":
          return res.json({ success: true, message: `Scenario '${scenario}' loaded (not yet implemented)` });
        default:
          return res.status(400).json({ message: "Invalid seed type" });
      }
    } catch (error) {
      log8.error("[super-admin] Seed failed:", error);
      res.status(500).json({ message: "Failed to generate test data" });
    }
  });
  router8.post("/lgd/import", requireRole("admin", "super_admin"), async (req, res) => {
    try {
      const { csvData, dataType } = req.body;
      if (!csvData || !dataType) {
        return res.status(400).json({ message: "Missing csvData or dataType" });
      }
      const lines = csvData.trim().split("\n");
      const inserted = { districts: 0, tehsils: 0, blocks: 0, gramPanchayats: 0, urbanBodies: 0 };
      if (dataType === "villages") {
        const districtMap = /* @__PURE__ */ new Map();
        const tehsilMap = /* @__PURE__ */ new Map();
        const villages = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          if (values.length < 9 || values[0] !== "2") continue;
          const districtCode = values[2];
          const districtName = values[3];
          const tehsilCode = values[4];
          const tehsilName = values[5];
          const villageCode = values[6];
          const villageName = values[7];
          const pincode = values[8];
          districtMap.set(districtCode, { lgdCode: districtCode, districtName });
          const tehsilKey = `${districtCode}-${tehsilCode}`;
          tehsilMap.set(tehsilKey, { lgdCode: tehsilCode, tehsilName, districtCode });
          villages.push({ lgdCode: villageCode, gramPanchayatName: villageName, tehsilCode, districtCode, pincode: pincode || null });
        }
        const resolvedBlocks = /* @__PURE__ */ new Map();
        for (const [, data] of tehsilMap.entries()) {
          const key = `${data.districtCode}-${data.lgdCode}`;
          resolvedBlocks.set(key, null);
        }
        for (const [, data] of districtMap.entries()) {
          await db.insert(lgdDistricts).values({ lgdCode: data.lgdCode, districtName: data.districtName, isActive: true }).onConflictDoNothing();
          inserted.districts++;
        }
        const existingDistricts = await db.select().from(lgdDistricts);
        const districtIdMap = /* @__PURE__ */ new Map();
        existingDistricts.forEach((district) => {
          if (district.lgdCode) districtIdMap.set(district.lgdCode, district.id);
          districtIdMap.set(district.districtName, district.id);
        });
        for (const [, data] of tehsilMap.entries()) {
          const districtId = districtIdMap.get(data.districtCode);
          if (districtId) {
            await db.insert(lgdTehsils).values({ lgdCode: data.lgdCode, tehsilName: data.tehsilName, districtId, isActive: true }).onConflictDoNothing();
            inserted.tehsils++;
          }
        }
        for (const village of villages) {
          const districtId = districtIdMap.get(village.districtCode);
          if (!districtId) continue;
          await db.insert(lgdGramPanchayats).values({
            lgdCode: village.lgdCode,
            gramPanchayatName: village.gramPanchayatName,
            districtId,
            blockId: resolvedBlocks.get(`${village.districtCode}-${village.tehsilCode}`) ?? null,
            isActive: true
          }).onConflictDoNothing();
          inserted.gramPanchayats++;
        }
      } else if (dataType === "urbanBodies") {
        const [defaultDistrict] = await db.select().from(lgdDistricts).limit(1);
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          if (values.length < 6 || values[0] !== "2") continue;
          const bodyCode = values[2];
          const bodyName = values[3];
          const bodyType = values[4];
          if (!defaultDistrict) {
            log8.warn("[LGD] No districts available; skipping urban body import");
            break;
          }
          const normalizedType = (() => {
            const value = bodyType?.toLowerCase() || "";
            if (value.includes("corporation")) return "mc";
            if (value.includes("council") || value.includes("tcp")) return "tcp";
            return "np";
          })();
          await db.insert(lgdUrbanBodies).values({
            lgdCode: bodyCode,
            urbanBodyName: bodyName,
            bodyType: normalizedType,
            districtId: defaultDistrict.id,
            numberOfWards: null,
            isActive: true
          }).onConflictDoNothing();
          inserted.urbanBodies++;
        }
      } else {
        return res.status(400).json({ message: "Invalid dataType. Must be 'villages' or 'urbanBodies'" });
      }
      res.json({ success: true, message: `Successfully imported LGD data (${dataType})`, inserted });
    } catch (error) {
      log8.error("[admin] LGD import failed:", error);
      res.status(500).json({ message: "Failed to import LGD data", error: String(error) });
    }
  });
  const PM2_APP_NAME = process.env.name || "hptourism-prod";
  router8.get("/system/status", requireRole("super_admin"), async (req, res) => {
    exec("pm2 jlist", (error, stdout, stderr) => {
      if (error) {
        log8.error({ err: error, stderr }, "Failed to get PM2 status");
        return res.status(500).json({ error: "Failed to get system status" });
      }
      try {
        const processes = JSON.parse(stdout);
        const appProcesses = processes.filter(
          (p) => p.name === PM2_APP_NAME
        );
        const instances = appProcesses.length;
        res.json({
          instances,
          processes: appProcesses.map((p) => ({
            pm_id: p.pm_id,
            status: p.pm2_env.status,
            memory: p.monit.memory,
            cpu: p.monit.cpu,
            uptime: p.pm2_env.pm_uptime,
            mode: p.pm2_env.exec_mode
          }))
        });
      } catch (parseError) {
        log8.error({ err: parseError }, "Failed to parse PM2 output");
        res.status(500).json({ error: "Invalid system status output" });
      }
    });
  });
  router8.post("/system/scale", requireRole("super_admin"), async (req, res) => {
    const { instances } = req.body;
    const count2 = parseInt(instances);
    if (isNaN(count2) || count2 < 1 || count2 > 8) {
      return res.status(400).json({ error: "Instances must be between 1 and 8" });
    }
    const command = `pm2 scale ${PM2_APP_NAME} ${count2}`;
    log8.info({ command, userId: req.session.userId }, "Scaling system instances");
    exec(command, (scaleError, scaleStdout, scaleStderr) => {
      if (scaleError) {
        log8.error({ err: scaleError, stderr: scaleStderr }, "Failed to scale instances");
        return res.status(500).json({ error: "Scaling operation failed" });
      }
      res.json({ success: true, message: `System scaled to ${count2} instances`, output: scaleStdout });
    });
  });
  return router8;
}

// server/routes/admin/backup.ts
init_middleware();
init_logger();
import express9 from "express";
import path5 from "path";
import { z as z4 } from "zod";

// server/services/backup-service.ts
init_config();
init_logger();
init_db();
init_schema();
import { exec as exec2 } from "child_process";
import { promisify } from "util";
import path4 from "path";
import fs5 from "fs";
import fsPromises from "fs/promises";
import { eq as eq19 } from "drizzle-orm";
var execAsync = promisify(exec2);
var backupLog = logger.child({ module: "backup-service" });
var BACKUP_SETTINGS_KEY = "backup_configuration";
var DEFAULT_BACKUP_SETTINGS = {
  enabled: true,
  schedule: "0 2 * * *",
  // Daily at 2 AM
  backupDirectory: path4.resolve(process.cwd(), "backups"),
  retentionDays: 30,
  includeDatabase: true,
  includeFiles: true,
  includeEnv: true,
  // Failover Defaults
  enableFailover: false,
  fallbackDirectory: path4.resolve(process.cwd(), "backups_fallback")
};
async function getBackupSettings() {
  try {
    const [record] = await db.select().from(systemSettings).where(eq19(systemSettings.settingKey, BACKUP_SETTINGS_KEY)).limit(1);
    if (!record || !record.settingValue) {
      return DEFAULT_BACKUP_SETTINGS;
    }
    return {
      ...DEFAULT_BACKUP_SETTINGS,
      ...record.settingValue
    };
  } catch (error) {
    backupLog.error("Failed to get backup settings, using defaults", error);
    return DEFAULT_BACKUP_SETTINGS;
  }
}
async function saveBackupSettings(settings) {
  const current = await getBackupSettings();
  const updated = { ...current, ...settings };
  const [existing] = await db.select().from(systemSettings).where(eq19(systemSettings.settingKey, BACKUP_SETTINGS_KEY)).limit(1);
  if (existing) {
    await db.update(systemSettings).set({ settingValue: updated, updatedAt: /* @__PURE__ */ new Date() }).where(eq19(systemSettings.settingKey, BACKUP_SETTINGS_KEY));
  } else {
    await db.insert(systemSettings).values({
      settingKey: BACKUP_SETTINGS_KEY,
      settingValue: updated
    });
  }
  return updated;
}
async function ensureBackupDirectory(backupDir) {
  await fsPromises.mkdir(backupDir, { recursive: true });
  await fsPromises.mkdir(path4.join(backupDir, "db"), { recursive: true });
  await fsPromises.mkdir(path4.join(backupDir, "files"), { recursive: true });
  await fsPromises.mkdir(path4.join(backupDir, "config"), { recursive: true });
}
function generateBackupId() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `backup_${year}${month}${day}_${hour}${minute}${second}`;
}
async function backupDatabase(backupDir, backupId) {
  const databaseUrl = config.database.url;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not configured");
  }
  const dbDir = path4.join(backupDir, "db");
  const outputFile = path4.join(dbDir, `${backupId}_database.sql`);
  const compressedFile = `${outputFile}.gz`;
  backupLog.info({ backupId, outputFile }, "Starting database backup");
  try {
    const command = `pg_dump "${databaseUrl}" | gzip > "${compressedFile}"`;
    await execAsync(command, { timeout: 15 * 60 * 1e3 });
    const stats = await fsPromises.stat(compressedFile);
    backupLog.info(
      { backupId, file: compressedFile, sizeBytes: stats.size },
      "Database backup completed"
    );
    return compressedFile;
  } catch (error) {
    backupLog.error({ backupId, error }, "Database backup failed");
    throw error;
  }
}
async function backupFilesRsync(backupDir) {
  const sourceDir = config.objectStorage.localDirectory;
  const destDir = path4.join(backupDir, "files");
  if (!sourceDir || !fs5.existsSync(sourceDir)) {
    backupLog.warn({ sourceDir }, "File storage directory not found, skipping file backup");
    return false;
  }
  backupLog.info({ sourceDir, destDir }, "Starting incremental file sync (rsync)");
  try {
    const command = `rsync -av --delete "${sourceDir}/" "${destDir}/"`;
    await execAsync(command, { timeout: 4 * 60 * 60 * 1e3 });
    backupLog.info("File sync completed successfully");
    return true;
  } catch (error) {
    backupLog.error({ error }, "File sync failed");
    throw error;
  }
}
async function backupConfig(backupDir, backupId) {
  const sourceEnv = path4.resolve(process.cwd(), ".env");
  const configDir = path4.join(backupDir, "config");
  const destEnv = path4.join(configDir, `${backupId}.env`);
  if (!fs5.existsSync(sourceEnv)) {
    backupLog.warn("No .env file found to backup");
    return false;
  }
  try {
    await fsPromises.copyFile(sourceEnv, destEnv);
    const latestEnv = path4.join(configDir, "latest.env");
    await fsPromises.copyFile(sourceEnv, latestEnv);
    backupLog.info({ destEnv }, "Configuration backup completed");
    return true;
  } catch (error) {
    backupLog.error({ error }, "Configuration backup failed");
    throw error;
  }
}
async function runFullBackup() {
  const startTime = Date.now();
  const settings = await getBackupSettings();
  const backupId = generateBackupId();
  let backupDir = settings.backupDirectory;
  let usingFallback = false;
  backupLog.info({ backupId, backupDir }, "Starting hybrid backup");
  try {
    await ensureBackupDirectory(backupDir);
  } catch (dirError) {
    if (settings.enableFailover && settings.fallbackDirectory) {
      backupLog.warn(
        { primary: backupDir, fallback: settings.fallbackDirectory, error: dirError },
        "Primary backup directory inaccessible. Attempting failover..."
      );
      try {
        backupDir = settings.fallbackDirectory;
        await ensureBackupDirectory(backupDir);
        usingFallback = true;
        backupLog.info("Access to fallback directory confirmed. Proceeding with backup.");
      } catch (fallbackError) {
        const msg = `Backup failed: Primary and Fallback directories are inaccessible.`;
        backupLog.error({ primaryError: dirError, fallbackError }, msg);
        await saveBackupSettings({
          lastBackupAt: (/* @__PURE__ */ new Date()).toISOString(),
          lastBackupStatus: "failed",
          lastBackupError: msg
        });
        throw new Error(msg);
      }
    } else {
      const msg = `Backup directory inaccessible: ${dirError.message}`;
      await saveBackupSettings({
        lastBackupAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastBackupStatus: "failed",
        lastBackupError: msg
      });
      throw dirError;
    }
  }
  const metadata = {
    id: backupId,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    type: "hybrid",
    status: "success"
  };
  if (usingFallback) {
    metadata.error = "NOTE: Primary backup location failed. Used fallback location.";
  }
  try {
    if (settings.includeDatabase) {
      try {
        metadata.databaseFile = await backupDatabase(backupDir, backupId);
      } catch (dbError) {
        metadata.status = "failed";
        metadata.error = `Database backup failed: ${dbError.message}`;
      }
    }
    if (settings.includeEnv) {
      try {
        metadata.envBackedUp = await backupConfig(backupDir, backupId);
      } catch (envError) {
        backupLog.error({ error: envError }, "Config backup failed");
      }
    }
    if (settings.includeFiles) {
      try {
        metadata.filesSynced = await backupFilesRsync(backupDir);
      } catch (fileError) {
        metadata.status = "failed";
        const msg = `File sync failed: ${fileError.message}`;
        metadata.error = metadata.error ? `${metadata.error}; ${msg}` : msg;
      }
    }
    metadata.duration = Date.now() - startTime;
    const metadataFile = path4.join(backupDir, "db", `${backupId}_metadata.json`);
    await fsPromises.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
    await saveBackupSettings({
      lastBackupAt: metadata.createdAt,
      lastBackupStatus: metadata.status,
      lastBackupError: metadata.error
    });
    backupLog.info(
      { backupId, duration: metadata.duration, status: metadata.status },
      "Hybrid backup completed"
    );
    await cleanupOldSnapshots(backupDir, settings.retentionDays);
    return metadata;
  } catch (error) {
    metadata.status = "failed";
    metadata.error = error.message;
    metadata.duration = Date.now() - startTime;
    await saveBackupSettings({
      lastBackupAt: metadata.createdAt,
      lastBackupStatus: "failed",
      lastBackupError: metadata.error
    });
    throw error;
  }
}
async function cleanupOldSnapshots(backupDir, retentionDays) {
  const cutoffDate = /* @__PURE__ */ new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  let deletedCount = 0;
  const dbDir = path4.join(backupDir, "db");
  const configDir = path4.join(backupDir, "config");
  try {
    if (fs5.existsSync(dbDir)) {
      const files = await fsPromises.readdir(dbDir);
      for (const file of files) {
        const filePath = path4.join(dbDir, file);
        const stats = await fsPromises.stat(filePath);
        if (stats.mtime < cutoffDate) {
          await fsPromises.unlink(filePath);
          deletedCount++;
        }
      }
    }
    if (fs5.existsSync(configDir)) {
      const files = await fsPromises.readdir(configDir);
      for (const file of files) {
        if (file === "latest.env") continue;
        const filePath = path4.join(configDir, file);
        const stats = await fsPromises.stat(filePath);
        if (stats.mtime < cutoffDate) {
          await fsPromises.unlink(filePath);
          deletedCount++;
        }
      }
    }
    if (deletedCount > 0) {
      backupLog.info({ deletedCount, retentionDays }, "Cleanup of old snapshots completed");
    }
  } catch (error) {
    backupLog.error({ error }, "Backup cleanup failed");
  }
  return deletedCount;
}
async function listBackups() {
  try {
    const settings = await getBackupSettings();
    const dbDir = path4.join(settings.backupDirectory, "db");
    if (!fs5.existsSync(dbDir)) return [];
    const files = await fsPromises.readdir(dbDir);
    const metadataFiles = files.filter((f) => f.endsWith("_metadata.json"));
    const backups = [];
    for (const file of metadataFiles) {
      try {
        const content = await fsPromises.readFile(path4.join(dbDir, file), "utf-8");
        const metadata = JSON.parse(content);
        if (!metadata.createdAt) metadata.createdAt = (/* @__PURE__ */ new Date()).toISOString();
        if (metadata.sizeBytes === void 0 && metadata.id) {
          try {
            const dbFile = path4.join(dbDir, `${metadata.id}_database.sql.gz`);
            if (fs5.existsSync(dbFile)) {
              const stats = await fsPromises.stat(dbFile);
              metadata.sizeBytes = stats.size;
            } else {
              metadata.sizeBytes = 0;
            }
          } catch {
            metadata.sizeBytes = 0;
          }
        }
        backups.push(metadata);
      } catch (err) {
        backupLog.warn({ file, err }, "Failed to read backup metadata");
      }
    }
    return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    backupLog.error({ error }, "Failed to list backups");
    return [];
  }
}
async function deleteBackup(backupId) {
  try {
    const settings = await getBackupSettings();
    const dbDir = path4.join(settings.backupDirectory, "db");
    const configDir = path4.join(settings.backupDirectory, "config");
    const filesToDelete = [
      path4.join(dbDir, `${backupId}_database.sql.gz`),
      path4.join(dbDir, `${backupId}_metadata.json`),
      path4.join(configDir, `${backupId}.env`)
    ];
    let success = false;
    for (const file of filesToDelete) {
      if (fs5.existsSync(file)) {
        await fsPromises.unlink(file);
        success = true;
      }
    }
    backupLog.info({ backupId, success }, "Backup deleted");
    return success;
  } catch (error) {
    backupLog.error({ backupId, error }, "Failed to delete backup");
    return false;
  }
}
async function getBackupFilePath(backupId, type) {
  try {
    const settings = await getBackupSettings();
    if (type === "database") {
      const dbDir = path4.join(settings.backupDirectory, "db");
      const file = path4.join(dbDir, `${backupId}_database.sql.gz`);
      return fs5.existsSync(file) ? file : null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// server/services/backup-scheduler.ts
init_logger();
import cron from "node-cron";
var schedulerLog = logger.child({ module: "backup-scheduler" });
var scheduledTask = null;
var currentSchedule = null;
function isValidCronExpression(expression) {
  return cron.validate(expression);
}
function describeCronSchedule(expression) {
  const patterns = {
    "0 2 * * *": "Daily at 2:00 AM",
    "0 0 * * *": "Daily at midnight",
    "0 3 * * *": "Daily at 3:00 AM",
    "0 0 * * 0": "Weekly on Sunday at midnight",
    "0 0 * * 1": "Weekly on Monday at midnight",
    "0 0 1 * *": "Monthly on the 1st at midnight",
    "*/30 * * * *": "Every 30 minutes",
    "0 */6 * * *": "Every 6 hours",
    "0 */12 * * *": "Every 12 hours"
  };
  return patterns[expression] || `Custom schedule: ${expression}`;
}
async function executeScheduledBackup() {
  schedulerLog.info("Starting scheduled backup");
  try {
    const result = await runFullBackup();
    schedulerLog.info(
      { backupId: result.id, status: result.status, duration: result.duration },
      "Scheduled backup completed"
    );
  } catch (error) {
    schedulerLog.error({ error }, "Scheduled backup failed");
  }
}
async function startBackupScheduler() {
  const settings = await getBackupSettings();
  if (!settings.enabled) {
    schedulerLog.info("Backup scheduler is disabled");
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask = null;
      currentSchedule = null;
    }
    return;
  }
  const schedule = settings.schedule;
  if (!isValidCronExpression(schedule)) {
    schedulerLog.error({ schedule }, "Invalid cron expression, scheduler not started");
    return;
  }
  if (scheduledTask && currentSchedule === schedule) {
    schedulerLog.debug("Backup scheduler already running with same schedule");
    return;
  }
  if (scheduledTask) {
    scheduledTask.stop();
    schedulerLog.info({ oldSchedule: currentSchedule }, "Stopped previous backup schedule");
  }
  scheduledTask = cron.schedule(schedule, executeScheduledBackup, {
    scheduled: true,
    timezone: "Asia/Kolkata"
    // IST timezone for HP
  });
  currentSchedule = schedule;
  schedulerLog.info(
    { schedule, description: describeCronSchedule(schedule) },
    "Backup scheduler started"
  );
}
function stopBackupScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    currentSchedule = null;
    schedulerLog.info("Backup scheduler stopped");
  }
}
function getSchedulerStatus() {
  return {
    running: scheduledTask !== null,
    schedule: currentSchedule,
    description: currentSchedule ? describeCronSchedule(currentSchedule) : null
  };
}
var COMMON_SCHEDULES = [
  { value: "0 2 * * *", label: "Daily at 2:00 AM" },
  { value: "0 3 * * *", label: "Daily at 3:00 AM" },
  { value: "0 0 * * *", label: "Daily at midnight" },
  { value: "0 */12 * * *", label: "Every 12 hours" },
  { value: "0 */6 * * *", label: "Every 6 hours" },
  { value: "0 0 * * 0", label: "Weekly on Sunday" },
  { value: "0 0 * * 1", label: "Weekly on Monday" },
  { value: "0 0 1 * *", label: "Monthly on the 1st" }
];

// server/routes/admin/backup.ts
var backupLog2 = logger.child({ module: "backup-routes" });
var backupSettingsSchema = z4.object({
  enabled: z4.boolean().optional(),
  schedule: z4.string().optional(),
  backupDirectory: z4.string().optional(),
  retentionDays: z4.number().int().min(1).max(365).optional(),
  includeDatabase: z4.boolean().optional(),
  includeFiles: z4.boolean().optional()
});
function createBackupRouter() {
  const router8 = express9.Router();
  router8.use(requireRole("super_admin"));
  router8.get("/settings", async (_req, res) => {
    try {
      const settings = await getBackupSettings();
      const schedulerStatus = getSchedulerStatus();
      res.json({
        settings,
        scheduler: schedulerStatus,
        scheduleOptions: COMMON_SCHEDULES,
        defaults: DEFAULT_BACKUP_SETTINGS
      });
    } catch (error) {
      backupLog2.error({ error }, "Failed to get backup settings");
      res.status(500).json({ message: "Failed to get backup settings" });
    }
  });
  router8.post("/settings", async (req, res) => {
    try {
      const updates = backupSettingsSchema.parse(req.body);
      if (updates.schedule && !isValidCronExpression(updates.schedule)) {
        return res.status(400).json({ message: "Invalid schedule format" });
      }
      const settings = await saveBackupSettings(updates);
      if (settings.enabled) {
        await startBackupScheduler();
      } else {
        stopBackupScheduler();
      }
      const schedulerStatus = getSchedulerStatus();
      res.json({
        settings,
        scheduler: schedulerStatus,
        message: "Backup settings updated successfully"
      });
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Invalid settings",
          errors: error.errors
        });
      }
      backupLog2.error({ error }, "Failed to update backup settings");
      res.status(500).json({ message: "Failed to update backup settings" });
    }
  });
  router8.post("/run", async (req, res) => {
    try {
      backupLog2.info({ userId: req.session.userId }, "Manual backup triggered");
      const result = await runFullBackup();
      res.json({
        backup: result,
        message: result.status === "success" ? "Backup completed successfully" : "Backup completed with errors"
      });
    } catch (error) {
      backupLog2.error({ error }, "Manual backup failed");
      res.status(500).json({ message: "Backup failed" });
    }
  });
  router8.get("/list", async (_req, res) => {
    try {
      const backups = await listBackups();
      res.json({ backups });
    } catch (error) {
      backupLog2.error({ error }, "Failed to list backups");
      res.status(500).json({ message: "Failed to list backups" });
    }
  });
  router8.get("/:id/download/:type", async (req, res) => {
    try {
      const { id, type } = req.params;
      if (type !== "database" && type !== "files") {
        return res.status(400).json({ message: "Invalid download type" });
      }
      const filePath = await getBackupFilePath(id, type);
      if (!filePath) {
        return res.status(404).json({ message: "Backup file not found" });
      }
      const filename = path5.basename(filePath);
      res.download(filePath, filename);
    } catch (error) {
      backupLog2.error({ error }, "Failed to download backup");
      res.status(500).json({ message: "Failed to download backup" });
    }
  });
  router8.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteBackup(id);
      if (!deleted) {
        return res.status(404).json({ message: "Backup not found" });
      }
      res.json({ message: "Backup deleted successfully" });
    } catch (error) {
      backupLog2.error({ error }, "Failed to delete backup");
      res.status(500).json({ message: "Failed to delete backup" });
    }
  });
  router8.get("/scheduler/status", (_req, res) => {
    const status = getSchedulerStatus();
    res.json(status);
  });
  router8.post("/scheduler/start", async (_req, res) => {
    try {
      await startBackupScheduler();
      res.json({
        status: getSchedulerStatus(),
        message: "Backup scheduler started"
      });
    } catch (error) {
      backupLog2.error({ error }, "Failed to start scheduler");
      res.status(500).json({ message: "Failed to start scheduler" });
    }
  });
  router8.post("/scheduler/stop", (_req, res) => {
    stopBackupScheduler();
    res.json({
      status: getSchedulerStatus(),
      message: "Backup scheduler stopped"
    });
  });
  return router8;
}

// server/routes/admin/migration.ts
init_middleware();
init_db();
init_schema();
init_logger();
import express10 from "express";
import path8 from "path";
import fs8 from "fs";
import bcrypt2 from "bcrypt";
import { eq as eq20 } from "drizzle-orm";
import multer from "multer";

// server/services/migration-service.ts
init_config();
init_logger();
import { exec as exec3 } from "child_process";
import { promisify as promisify2 } from "util";
import path6 from "path";
import fs6 from "fs";
import fsPromises2 from "fs/promises";
import archiver from "archiver";
import unzipper from "unzipper";
import crypto5 from "crypto";
var execAsync2 = promisify2(exec3);
var migrationLog = logger.child({ module: "migration-service" });
var DEFAULT_MIGRATIONS_DIR = path6.resolve(process.cwd(), "migrations");
function getMigrationsDirectory() {
  return DEFAULT_MIGRATIONS_DIR;
}
async function ensureMigrationsDirectory() {
  const dir = getMigrationsDirectory();
  await fsPromises2.mkdir(dir, { recursive: true });
  return dir;
}
function generateMigrationId() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `migration_${year}${month}${day}_${hour}${minute}${second}`;
}
async function calculateChecksum(filePath) {
  return new Promise((resolve, reject) => {
    const hash2 = crypto5.createHash("sha256");
    const stream = fs6.createReadStream(filePath);
    stream.on("data", (data) => hash2.update(data));
    stream.on("end", () => resolve(hash2.digest("hex")));
    stream.on("error", reject);
  });
}
async function exportDatabase(outputDir, migrationId) {
  const databaseUrl = config.database.url;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not configured");
  }
  const outputFile = path6.join(outputDir, "database.sql");
  const compressedFile = `${outputFile}.gz`;
  migrationLog.info({ migrationId }, "Exporting database...");
  try {
    const command = `pg_dump "${databaseUrl}" | gzip > "${compressedFile}"`;
    await execAsync2(command, { timeout: 10 * 60 * 1e3 });
    const stats = await fsPromises2.stat(compressedFile);
    migrationLog.info(
      { migrationId, file: compressedFile, sizeBytes: stats.size },
      "Database export completed"
    );
    return { filePath: compressedFile, sizeBytes: stats.size };
  } catch (error) {
    migrationLog.error({ migrationId, error }, "Database export failed");
    throw error;
  }
}
async function exportFiles(outputDir, migrationId) {
  const sourceDir = config.objectStorage.localDirectory;
  if (!sourceDir || !fs6.existsSync(sourceDir)) {
    migrationLog.warn({ sourceDir }, "File storage directory not found, skipping file export");
    return { dirPath: "", filesCount: 0, sizeBytes: 0 };
  }
  const filesOutputDir = path6.join(outputDir, "files");
  await fsPromises2.mkdir(filesOutputDir, { recursive: true });
  migrationLog.info({ migrationId, sourceDir }, "Copying files...");
  let filesCount = 0;
  let totalSize = 0;
  async function copyDir(src, dest) {
    await fsPromises2.mkdir(dest, { recursive: true });
    const entries = await fsPromises2.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path6.join(src, entry.name);
      const destPath = path6.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fsPromises2.copyFile(srcPath, destPath);
        const stats = await fsPromises2.stat(destPath);
        filesCount++;
        totalSize += stats.size;
      }
    }
  }
  await copyDir(sourceDir, filesOutputDir);
  migrationLog.info(
    { migrationId, filesCount, sizeBytes: totalSize },
    "Files export completed"
  );
  return { dirPath: filesOutputDir, filesCount, sizeBytes: totalSize };
}
async function createExportPackage(options = {}) {
  const { includeDatabase = true, includeFiles = true } = options;
  const startTime = Date.now();
  const migrationId = generateMigrationId();
  const migrationsDir = await ensureMigrationsDirectory();
  const workDir = path6.join(migrationsDir, `${migrationId}_temp`);
  const packagePath = path6.join(migrationsDir, `${migrationId}.zip`);
  migrationLog.info({ migrationId }, "Starting export package creation...");
  const exportPackage = {
    id: migrationId,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    filePath: packagePath,
    metadata: {},
    sizeBytes: 0,
    status: "pending"
  };
  try {
    await fsPromises2.mkdir(workDir, { recursive: true });
    const checksums = {};
    let dbResult = { filePath: "", sizeBytes: 0 };
    let filesResult = { dirPath: "", filesCount: 0, sizeBytes: 0 };
    if (includeDatabase) {
      dbResult = await exportDatabase(workDir, migrationId);
      checksums["database.sql.gz"] = await calculateChecksum(dbResult.filePath);
    }
    if (includeFiles) {
      filesResult = await exportFiles(workDir, migrationId);
    }
    const metadata = {
      id: migrationId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      sourceSystem: process.env.HOSTNAME || "unknown",
      appVersion: process.env.npm_package_version || "1.0.0",
      databaseName: new URL(config.database.url || "").pathname.replace("/", "") || "unknown",
      includesDatabase: includeDatabase && dbResult.sizeBytes > 0,
      includesFiles: includeFiles && filesResult.filesCount > 0,
      filesCount: filesResult.filesCount,
      totalSizeBytes: dbResult.sizeBytes + filesResult.sizeBytes,
      checksums
    };
    const metadataPath = path6.join(workDir, "metadata.json");
    await fsPromises2.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    migrationLog.info({ migrationId }, "Creating ZIP package...");
    await new Promise((resolve, reject) => {
      const output = fs6.createWriteStream(packagePath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", () => resolve());
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(workDir, false);
      archive.finalize();
    });
    const packageStats = await fsPromises2.stat(packagePath);
    exportPackage.sizeBytes = packageStats.size;
    exportPackage.metadata = metadata;
    exportPackage.status = "completed";
    exportPackage.duration = Date.now() - startTime;
    await fsPromises2.rm(workDir, { recursive: true, force: true });
    migrationLog.info(
      { migrationId, sizeBytes: exportPackage.sizeBytes, duration: exportPackage.duration },
      "Export package created successfully"
    );
    return exportPackage;
  } catch (error) {
    exportPackage.status = "failed";
    exportPackage.error = error.message;
    exportPackage.duration = Date.now() - startTime;
    await fsPromises2.rm(workDir, { recursive: true, force: true }).catch(() => {
    });
    await fsPromises2.unlink(packagePath).catch(() => {
    });
    migrationLog.error({ migrationId, error }, "Export package creation failed");
    throw error;
  }
}
async function validateImportPackage(packagePath) {
  const errors = [];
  const warnings = [];
  let metadata = null;
  try {
    if (!fs6.existsSync(packagePath)) {
      errors.push("Package file not found");
      return { valid: false, metadata: null, errors, warnings };
    }
    const tempDir = path6.join(getMigrationsDirectory(), `validate_${Date.now()}`);
    await fsPromises2.mkdir(tempDir, { recursive: true });
    try {
      await new Promise((resolve, reject) => {
        fs6.createReadStream(packagePath).pipe(unzipper.Extract({ path: tempDir })).on("close", resolve).on("error", reject);
      });
      const metadataPath = path6.join(tempDir, "metadata.json");
      if (!fs6.existsSync(metadataPath)) {
        errors.push("Package does not contain metadata.json");
        return { valid: false, metadata: null, errors, warnings };
      }
      const metadataContent = await fsPromises2.readFile(metadataPath, "utf-8");
      metadata = JSON.parse(metadataContent);
      if (metadata?.checksums) {
        for (const [filename, expectedChecksum] of Object.entries(metadata.checksums)) {
          const filePath = path6.join(tempDir, filename);
          if (fs6.existsSync(filePath)) {
            const actualChecksum = await calculateChecksum(filePath);
            if (actualChecksum !== expectedChecksum) {
              errors.push(`Checksum mismatch for ${filename}`);
            }
          } else {
            errors.push(`Missing file: ${filename}`);
          }
        }
      }
      const currentVersion = process.env.npm_package_version || "1.0.0";
      if (metadata?.appVersion && metadata.appVersion !== currentVersion) {
        warnings.push(`Package version (${metadata.appVersion}) differs from current (${currentVersion})`);
      }
      return {
        valid: errors.length === 0,
        metadata,
        errors,
        warnings
      };
    } finally {
      await fsPromises2.rm(tempDir, { recursive: true, force: true }).catch(() => {
      });
    }
  } catch (error) {
    errors.push(`Validation failed: ${error.message}`);
    return { valid: false, metadata: null, errors, warnings };
  }
}
async function importMigrationPackage(packagePath) {
  const startTime = Date.now();
  const result = {
    success: false,
    databaseRestored: false,
    filesRestored: false,
    filesCount: 0,
    errors: [],
    warnings: [],
    duration: 0
  };
  const tempDir = path6.join(getMigrationsDirectory(), `import_${Date.now()}`);
  try {
    migrationLog.info({ packagePath }, "Starting import...");
    const validation = await validateImportPackage(packagePath);
    if (!validation.valid) {
      result.errors = validation.errors;
      result.warnings = validation.warnings;
      result.duration = Date.now() - startTime;
      return result;
    }
    result.warnings = validation.warnings;
    const metadata = validation.metadata;
    await fsPromises2.mkdir(tempDir, { recursive: true });
    await new Promise((resolve, reject) => {
      fs6.createReadStream(packagePath).pipe(unzipper.Extract({ path: tempDir })).on("close", resolve).on("error", reject);
    });
    if (metadata.includesDatabase) {
      const dbFile = path6.join(tempDir, "database.sql.gz");
      if (fs6.existsSync(dbFile)) {
        try {
          migrationLog.info("Restoring database...");
          const databaseUrl = config.database.url;
          if (!databaseUrl) {
            throw new Error("DATABASE_URL not configured");
          }
          const dbUrl = new URL(databaseUrl);
          const dbName = dbUrl.pathname.replace("/", "");
          migrationLog.info("Dropping existing tables before restore...");
          const dropTablesCommand = `psql "${databaseUrl}" -c "
                        DO \\$\\$ DECLARE
                            r RECORD;
                        BEGIN
                            -- Drop all tables in public schema
                            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                                EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
                            END LOOP;
                            -- Drop all sequences
                            FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
                                EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequencename) || ' CASCADE';
                            END LOOP;
                            -- Drop all types (enums)
                            FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typtype = 'e') LOOP
                                EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
                            END LOOP;
                        END \\$\\$;"`;
          try {
            await execAsync2(dropTablesCommand, { timeout: 5 * 60 * 1e3 });
            migrationLog.info("Existing tables dropped successfully");
          } catch (dropError) {
            migrationLog.warn({ error: dropError }, "Warning during table drop (may be normal for fresh DB)");
          }
          migrationLog.info("Restoring from SQL dump...");
          const restoreCommand = `gunzip -c "${dbFile}" | psql "${databaseUrl}"`;
          await execAsync2(restoreCommand, { timeout: 30 * 60 * 1e3 });
          result.databaseRestored = true;
          migrationLog.info("Database restored successfully");
        } catch (error) {
          result.errors.push(`Database restore failed: ${error.message}`);
          migrationLog.error({ error }, "Database restore failed");
        }
      }
    }
    if (metadata.includesFiles) {
      const filesDir = path6.join(tempDir, "files");
      if (fs6.existsSync(filesDir)) {
        try {
          migrationLog.info("Restoring files...");
          const targetDir = config.objectStorage.localDirectory;
          if (!targetDir) {
            throw new Error("Object storage directory not configured");
          }
          await fsPromises2.mkdir(targetDir, { recursive: true });
          async function copyDir(src, dest) {
            let count2 = 0;
            await fsPromises2.mkdir(dest, { recursive: true });
            const entries = await fsPromises2.readdir(src, { withFileTypes: true });
            for (const entry of entries) {
              const srcPath = path6.join(src, entry.name);
              const destPath = path6.join(dest, entry.name);
              if (entry.isDirectory()) {
                count2 += await copyDir(srcPath, destPath);
              } else {
                await fsPromises2.copyFile(srcPath, destPath);
                count2++;
              }
            }
            return count2;
          }
          result.filesCount = await copyDir(filesDir, targetDir);
          result.filesRestored = true;
          migrationLog.info({ filesCount: result.filesCount }, "Files restored successfully");
        } catch (error) {
          result.errors.push(`Files restore failed: ${error.message}`);
          migrationLog.error({ error }, "Files restore failed");
        }
      }
    }
    result.success = result.errors.length === 0;
    result.duration = Date.now() - startTime;
    migrationLog.info(
      { success: result.success, duration: result.duration },
      "Import completed"
    );
    return result;
  } catch (error) {
    result.errors.push(`Import failed: ${error.message}`);
    result.duration = Date.now() - startTime;
    migrationLog.error({ error }, "Import failed");
    return result;
  } finally {
    await fsPromises2.rm(tempDir, { recursive: true, force: true }).catch(() => {
    });
  }
}
async function listExportPackages() {
  const migrationsDir = getMigrationsDirectory();
  if (!fs6.existsSync(migrationsDir)) {
    return [];
  }
  const files = await fsPromises2.readdir(migrationsDir);
  const packages = [];
  for (const file of files) {
    if (file.endsWith(".zip") && file.startsWith("migration_")) {
      const filePath = path6.join(migrationsDir, file);
      const stats = await fsPromises2.stat(filePath);
      try {
        const validation = await validateImportPackage(filePath);
        if (validation.metadata) {
          packages.push({
            id: validation.metadata.id,
            createdAt: validation.metadata.createdAt,
            filePath,
            metadata: validation.metadata,
            sizeBytes: stats.size,
            status: "completed"
          });
        }
      } catch {
      }
    }
  }
  return packages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
async function deleteExportPackage(packageId) {
  const migrationsDir = getMigrationsDirectory();
  const packagePath = path6.join(migrationsDir, `${packageId}.zip`);
  if (!fs6.existsSync(packagePath)) {
    return false;
  }
  await fsPromises2.unlink(packagePath);
  migrationLog.info({ packageId }, "Export package deleted");
  return true;
}
function getExportPackagePath(packageId) {
  const migrationsDir = getMigrationsDirectory();
  const packagePath = path6.join(migrationsDir, `${packageId}.zip`);
  if (!fs6.existsSync(packagePath)) {
    return null;
  }
  return packagePath;
}

// server/services/migration/categories.ts
var DATA_CATEGORIES = [
  {
    id: "lgd",
    name: "LGD Data",
    description: "Location data - Districts, Tehsils, Blocks, Gram Panchayats, Urban Bodies",
    tables: ["lgd_districts", "lgd_tehsils", "lgd_blocks", "lgd_gram_panchayats", "lgd_urban_bodies"],
    dependencies: []
  },
  {
    id: "ddo",
    name: "DDO Codes",
    description: "Department Drawing Officer codes for treasury",
    tables: ["ddo_codes"],
    dependencies: []
  },
  {
    id: "users",
    name: "Users",
    description: "All user accounts, profiles, and authentication data",
    tables: ["users", "user_profiles", "login_otp_challenges", "password_reset_challenges"],
    dependencies: []
  },
  {
    id: "applications",
    name: "Applications",
    description: "Homestay registration applications",
    tables: ["homestay_applications"],
    dependencies: ["users"]
  },
  {
    id: "documents",
    name: "Documents",
    description: "Uploaded documents and storage objects",
    tables: ["documents", "storage_objects"],
    dependencies: ["applications", "users"],
    fileCategories: ["all"]
    // All file storage
  },
  {
    id: "inspections",
    name: "Inspections",
    description: "Inspection orders and reports",
    tables: ["inspection_orders", "inspection_reports"],
    dependencies: ["applications", "users"]
  },
  {
    id: "certificates",
    name: "Certificates",
    description: "Issued certificates",
    tables: ["certificates"],
    dependencies: ["applications"]
  },
  {
    id: "payments",
    name: "Payments",
    description: "Payment records and HimKosh transactions",
    tables: ["payments", "himkosh_transactions"],
    dependencies: ["applications"]
  },
  {
    id: "reviews",
    name: "Reviews & Actions",
    description: "Application reviews, actions, objections, clarifications",
    tables: ["reviews", "application_actions", "objections", "clarifications"],
    dependencies: ["applications", "users"]
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "User notifications",
    tables: ["notifications"],
    dependencies: ["applications", "users"]
  },
  {
    id: "system",
    name: "System Settings",
    description: "System configuration, stats, and audit logs",
    tables: ["system_settings", "production_stats", "audit_logs"],
    dependencies: ["users"]
  }
];

// server/services/migration/schema-registry.ts
init_db();
init_logger();
import { sql as sql7 } from "drizzle-orm";
var log9 = logger.child({ module: "schema-registry" });
async function getTableNames() {
  const result = await db.execute(sql7`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  return result.rows.map((row) => row.table_name);
}
async function getTableRowCount(tableName) {
  try {
    const result = await db.execute(sql7.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
    return parseInt(result.rows[0]?.count || "0", 10);
  } catch {
    return 0;
  }
}
async function getTableColumns(tableName) {
  const result = await db.execute(sql7`
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    ORDER BY ordinal_position
  `);
  return result.rows.map((row) => ({
    name: row.column_name,
    dataType: row.data_type,
    isNullable: row.is_nullable === "YES",
    defaultValue: row.column_default
  }));
}
async function getTablePrimaryKey(tableName) {
  const result = await db.execute(sql7`
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = ${tableName}
      AND tc.constraint_type = 'PRIMARY KEY'
    LIMIT 1
  `);
  return result.rows[0]?.column_name || null;
}
async function getTableForeignKeys(tableName) {
  const result = await db.execute(sql7`
    SELECT
      kcu.column_name,
      ccu.table_name AS referenced_table,
      ccu.column_name AS referenced_column,
      rc.delete_rule
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.constraint_column_usage ccu
      ON kcu.constraint_name = ccu.constraint_name
    JOIN information_schema.referential_constraints rc
      ON kcu.constraint_name = rc.constraint_name
    WHERE kcu.table_schema = 'public'
      AND kcu.table_name = ${tableName}
  `);
  return result.rows.map((row) => ({
    column: row.column_name,
    referencedTable: row.referenced_table,
    referencedColumn: row.referenced_column,
    onDelete: row.delete_rule
  }));
}
async function getTableInfo(tableName) {
  const [columns, rowCount, primaryKey2, foreignKeys] = await Promise.all([
    getTableColumns(tableName),
    getTableRowCount(tableName),
    getTablePrimaryKey(tableName),
    getTableForeignKeys(tableName)
  ]);
  let category = null;
  for (const cat of DATA_CATEGORIES) {
    if (cat.tables.includes(tableName)) {
      category = cat.id;
      break;
    }
  }
  return {
    name: tableName,
    columns,
    rowCount,
    primaryKey: primaryKey2,
    foreignKeys,
    category
  };
}
async function generateSchemaSnapshot() {
  log9.info("Generating schema snapshot...");
  const tableNames = await getTableNames();
  const tables = [];
  let totalRows = 0;
  for (const name of tableNames) {
    const info = await getTableInfo(name);
    tables.push(info);
    totalRows += info.rowCount;
  }
  const categories = DATA_CATEGORIES.map((cat) => {
    const catTables = tables.filter((t) => cat.tables.includes(t.name));
    const catRows = catTables.reduce((sum, t) => sum + t.rowCount, 0);
    return {
      id: cat.id,
      name: cat.name,
      tables: catTables.map((t) => t.name),
      totalRows: catRows,
      hasData: catRows > 0
    };
  });
  const snapshot = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    databaseName: process.env.DATABASE_URL?.split("/").pop()?.split("?")[0] || "unknown",
    tables,
    totalRows,
    categories
  };
  log9.info({ tableCount: tables.length, totalRows }, "Schema snapshot generated");
  return snapshot;
}
async function getSchemaSummary() {
  const snapshot = await generateSchemaSnapshot();
  return {
    totalTables: snapshot.tables.length,
    totalRows: snapshot.totalRows,
    categories: snapshot.categories.map((c) => ({
      id: c.id,
      name: c.name,
      rows: c.totalRows,
      hasData: c.hasData
    }))
  };
}
var SYSTEM_TABLES = ["session", "drizzle_migrations"];
async function validateSchemaCoverage() {
  log9.info("Validating schema coverage...");
  const allDbTables = await getTableNames();
  const allCategoryTables = /* @__PURE__ */ new Set();
  for (const cat of DATA_CATEGORIES) {
    for (const table of cat.tables) {
      allCategoryTables.add(table);
    }
  }
  const coveredTables = [];
  const uncoveredTables = [];
  const systemTables = [];
  const warnings = [];
  for (const table of allDbTables) {
    if (SYSTEM_TABLES.includes(table)) {
      systemTables.push(table);
    } else if (allCategoryTables.has(table)) {
      coveredTables.push(table);
    } else {
      uncoveredTables.push(table);
      warnings.push(`Table "${table}" exists in database but is NOT covered by any backup category!`);
    }
  }
  for (const catTable of allCategoryTables) {
    if (!allDbTables.includes(catTable)) {
      warnings.push(`Table "${catTable}" is in category definitions but does NOT exist in database`);
    }
  }
  const isComplete = uncoveredTables.length === 0;
  if (!isComplete) {
    log9.warn({ uncoveredTables }, "Schema coverage incomplete - some tables not backed up!");
  } else {
    log9.info({ coveredCount: coveredTables.length }, "Schema coverage complete - all tables covered");
  }
  return {
    isComplete,
    totalDbTables: allDbTables.length,
    coveredTables,
    uncoveredTables,
    systemTables,
    warnings
  };
}

// server/services/migration/import-analyzer.ts
init_logger();
import fs7 from "fs";
import path7 from "path";
import unzipper2 from "unzipper";
import { promisify as promisify3 } from "util";
import { exec as exec4 } from "child_process";
var execAsync3 = promisify3(exec4);
var log10 = logger.child({ module: "import-analyzer" });
async function analyzePackage(packagePath) {
  const warnings = [];
  const errors = [];
  log10.info({ packagePath }, "Analyzing import package...");
  const currentState = await generateSchemaSnapshot();
  const tempDir = path7.join(path7.dirname(packagePath), `analysis_${Date.now()}`);
  try {
    await fs7.promises.mkdir(tempDir, { recursive: true });
    await new Promise((resolve, reject) => {
      fs7.createReadStream(packagePath).pipe(unzipper2.Extract({ path: tempDir })).on("close", resolve).on("error", reject);
    });
    const metadataPath = path7.join(tempDir, "metadata.json");
    let metadata = {};
    if (fs7.existsSync(metadataPath)) {
      metadata = JSON.parse(await fs7.promises.readFile(metadataPath, "utf-8"));
    }
    const packageTables = await analyzeDbDump(tempDir);
    const filesDir = path7.join(tempDir, "files");
    const filesCount = fs7.existsSync(filesDir) ? await countFiles(filesDir) : 0;
    const packageInfo = {
      id: metadata.id || path7.basename(packagePath, ".zip"),
      createdAt: metadata.createdAt || "unknown",
      includesDatabase: fs7.existsSync(path7.join(tempDir, "database.sql.gz")),
      includesFiles: filesCount > 0,
      filesCount,
      sizeBytes: (await fs7.promises.stat(packagePath)).size,
      tables: packageTables,
      categories: DATA_CATEGORIES.map((cat) => ({
        id: cat.id,
        name: cat.name,
        hasData: cat.tables.some(
          (t) => packageTables.find((pt) => pt.name === t)?.hasData
        )
      }))
    };
    const comparison = compareSchemas(packageTables, currentState);
    const recommendations = generateRecommendations(packageInfo, currentState, comparison);
    if (comparison.tablesOnlyInPackage.length > 0) {
      warnings.push(`Package contains ${comparison.tablesOnlyInPackage.length} tables not in current database`);
    }
    if (comparison.dataConflicts.some((c) => c.conflictType === "overwrite")) {
      warnings.push("Some tables have existing data that will be overwritten");
    }
    return {
      valid: errors.length === 0,
      packageInfo,
      currentState,
      comparison,
      recommendations,
      warnings,
      errors
    };
  } finally {
    await fs7.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {
    });
  }
}
async function analyzeDbDump(tempDir) {
  const dbFile = path7.join(tempDir, "database.sql.gz");
  if (!fs7.existsSync(dbFile)) {
    return [];
  }
  const tables = [];
  try {
    const { stdout } = await execAsync3(
      `gunzip -c "${dbFile}" | grep -E "^(COPY public\\.|^\\\\\\.$)" | head -200`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    let currentTable = null;
    let currentRows = 0;
    const lines = stdout.split("\n");
    for (const line of lines) {
      if (line.startsWith("COPY public.")) {
        if (currentTable) {
          tables.push({
            name: currentTable,
            rowCount: currentRows,
            hasData: currentRows > 0
          });
        }
        const match = line.match(/COPY public\.(\w+)/);
        currentTable = match ? match[1] : null;
        currentRows = 0;
      } else if (line === "\\.") {
        if (currentTable) {
          tables.push({
            name: currentTable,
            rowCount: currentRows,
            hasData: currentRows > 0
          });
          currentTable = null;
          currentRows = 0;
        }
      } else if (currentTable && line.trim()) {
        currentRows++;
      }
    }
  } catch (error) {
    log10.error({ error }, "Failed to analyze database dump");
  }
  return tables;
}
async function countFiles(dir) {
  let count2 = 0;
  const entries = await fs7.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count2 += await countFiles(path7.join(dir, entry.name));
    } else {
      count2++;
    }
  }
  return count2;
}
function compareSchemas(packageTables, currentState) {
  const packageTableNames = new Set(packageTables.map((t) => t.name));
  const dbTableNames = new Set(currentState.tables.map((t) => t.name));
  const tablesOnlyInPackage = [...packageTableNames].filter((t) => !dbTableNames.has(t));
  const tablesOnlyInDatabase = [...dbTableNames].filter((t) => !packageTableNames.has(t));
  const tablesInBoth = [...packageTableNames].filter((t) => dbTableNames.has(t));
  const dataConflicts = [];
  for (const tableName of tablesInBoth) {
    const pkgTable = packageTables.find((t) => t.name === tableName);
    const dbTable = currentState.tables.find((t) => t.name === tableName);
    if (pkgTable && dbTable && pkgTable.rowCount > 0 && dbTable.rowCount > 0) {
      dataConflicts.push({
        table: tableName,
        packageRows: pkgTable.rowCount,
        databaseRows: dbTable.rowCount,
        conflictType: "overwrite"
      });
    }
  }
  return {
    tablesOnlyInPackage,
    tablesOnlyInDatabase,
    tablesInBoth,
    dataConflicts
  };
}
function generateRecommendations(packageInfo, currentState, comparison) {
  const recommendations = [];
  if (currentState.totalRows === 0) {
    recommendations.push({
      strategy: "full_replace",
      reason: "Database is empty - full import recommended",
      affectedTables: packageInfo.tables.map((t) => t.name),
      estimatedRecords: packageInfo.tables.reduce((sum, t) => sum + t.rowCount, 0)
    });
    return recommendations;
  }
  if (comparison.tablesOnlyInPackage.length === 0) {
    recommendations.push({
      strategy: "data_only",
      reason: "All tables exist - data-only import possible",
      affectedTables: comparison.tablesInBoth,
      estimatedRecords: packageInfo.tables.reduce((sum, t) => sum + t.rowCount, 0)
    });
  } else {
    recommendations.push({
      strategy: "schema_and_data",
      reason: `${comparison.tablesOnlyInPackage.length} tables need to be created`,
      affectedTables: comparison.tablesOnlyInPackage,
      estimatedRecords: packageInfo.tables.reduce((sum, t) => sum + t.rowCount, 0)
    });
  }
  if (comparison.dataConflicts.length > 0) {
    recommendations.push({
      strategy: "selective",
      reason: `${comparison.dataConflicts.length} tables have existing data - consider selective import`,
      affectedTables: comparison.dataConflicts.map((c) => c.table),
      estimatedRecords: comparison.dataConflicts.reduce((sum, c) => sum + c.packageRows, 0)
    });
  }
  return recommendations;
}

// server/routes/admin/migration.ts
var log11 = logger.child({ module: "migration-router" });
var storage2 = multer.diskStorage({
  destination: async (req, file, cb) => {
    const migrationsDir = getMigrationsDirectory();
    await fs8.promises.mkdir(migrationsDir, { recursive: true });
    cb(null, migrationsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `import_${Date.now()}_${file.originalname}`);
  }
});
var upload = multer({
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024
    // 5GB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/zip" || file.originalname.endsWith(".zip")) {
      cb(null, true);
    } else {
      cb(new Error("Only ZIP files are allowed"));
    }
  }
});
function createMigrationRouter() {
  const router8 = express10.Router();
  router8.get("/schema/summary", requireRole("super_admin"), async (req, res) => {
    try {
      const summary = await getSchemaSummary();
      res.json(summary);
    } catch (error) {
      log11.error({ error }, "Failed to get schema summary");
      res.status(500).json({ message: "Failed to get schema summary" });
    }
  });
  router8.get("/categories", requireRole("super_admin"), async (req, res) => {
    try {
      res.json({ categories: DATA_CATEGORIES });
    } catch (error) {
      log11.error({ error }, "Failed to get categories");
      res.status(500).json({ message: "Failed to get categories" });
    }
  });
  router8.get("/schema/validate", requireRole("super_admin"), async (req, res) => {
    try {
      const result = await validateSchemaCoverage();
      res.json(result);
    } catch (error) {
      log11.error({ error }, "Failed to validate schema coverage");
      res.status(500).json({ message: "Failed to validate schema coverage" });
    }
  });
  router8.post(
    "/import/analyze",
    requireRole("super_admin"),
    upload.single("package"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        log11.info({ file: req.file.originalname }, "Analyzing import package...");
        const analysis = await analyzePackage(req.file.path);
        res.json({
          message: "Package analyzed successfully",
          analysis,
          packagePath: req.file.path
        });
      } catch (error) {
        log11.error({ error }, "Package analysis failed");
        if (req.file) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
        }
        res.status(500).json({
          message: "Analysis failed",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );
  router8.get("/exports", requireRole("super_admin"), async (req, res) => {
    try {
      const packages = await listExportPackages();
      res.json({ packages });
    } catch (error) {
      log11.error({ error }, "Failed to list export packages");
      res.status(500).json({ message: "Failed to list export packages" });
    }
  });
  router8.post("/export", requireRole("super_admin"), async (req, res) => {
    try {
      const { includeDatabase = true, includeFiles = true } = req.body;
      log11.info({ includeDatabase, includeFiles }, "Starting export...");
      const exportPackage = await createExportPackage({
        includeDatabase,
        includeFiles
      });
      res.json({
        message: "Export package created successfully",
        package: exportPackage
      });
    } catch (error) {
      log11.error({ error }, "Export failed");
      res.status(500).json({
        message: "Failed to create export package",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  router8.get("/export/:id/download", requireRole("super_admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const packagePath = getExportPackagePath(id);
      if (!packagePath) {
        return res.status(404).json({ message: "Export package not found" });
      }
      const filename = path8.basename(packagePath);
      res.download(packagePath, filename);
    } catch (error) {
      log11.error({ error }, "Failed to download export package");
      res.status(500).json({ message: "Failed to download export package" });
    }
  });
  router8.delete("/export/:id", requireRole("super_admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteExportPackage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Export package not found" });
      }
      res.json({ message: "Export package deleted" });
    } catch (error) {
      log11.error({ error }, "Failed to delete export package");
      res.status(500).json({ message: "Failed to delete export package" });
    }
  });
  router8.post(
    "/import/validate",
    requireRole("super_admin"),
    upload.single("package"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const validation = await validateImportPackage(req.file.path);
        await fs8.promises.unlink(req.file.path).catch(() => {
        });
        res.json(validation);
      } catch (error) {
        log11.error({ error }, "Validation failed");
        res.status(500).json({
          message: "Validation failed",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );
  router8.post(
    "/import",
    requireRole("super_admin"),
    upload.single("package"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const { password } = req.body;
        if (!password || typeof password !== "string") {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
          return res.status(400).json({
            message: "Password required for import operations"
          });
        }
        const userId = req.session.userId;
        if (!userId) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
          return res.status(401).json({ message: "Not authenticated" });
        }
        const [currentUser] = await db.select({ password: users.password }).from(users).where(eq20(users.id, userId)).limit(1);
        if (!currentUser?.password) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
          return res.status(401).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt2.compare(password, currentUser.password);
        if (!isPasswordValid) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
          log11.warn(`[migration] Invalid password attempt for import by user ${userId}`);
          return res.status(401).json({ message: "Invalid password" });
        }
        log11.info(`[migration] Password verified for import by user ${userId}`);
        const validation = await validateImportPackage(req.file.path);
        if (!validation.valid) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
          return res.status(400).json({
            message: "Invalid import package",
            errors: validation.errors,
            warnings: validation.warnings
          });
        }
        const result = await importMigrationPackage(req.file.path);
        await fs8.promises.unlink(req.file.path).catch(() => {
        });
        if (result.success) {
          res.json({
            message: "Import completed successfully",
            result
          });
        } else {
          res.status(500).json({
            message: "Import completed with errors",
            result
          });
        }
      } catch (error) {
        log11.error({ error }, "Import failed");
        if (req.file) {
          await fs8.promises.unlink(req.file.path).catch(() => {
          });
        }
        res.status(500).json({
          message: "Import failed",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );
  return router8;
}

// server/routes/admin/seed.ts
init_middleware();
init_db();
init_schema();
init_logger();
import express11 from "express";
import { eq as eq21, and as and4 } from "drizzle-orm";
import bcrypt3 from "bcrypt";
var log12 = logger.child({ module: "admin-seed-router" });
var DEFAULT_PASSWORD = "Welcome@123";
var DA_TEMPLATE = [
  { username: "da_shimla", fullName: "DA Shimla", district: "Shimla" },
  { username: "da_kullu", fullName: "DA Kullu", district: "Kullu" },
  { username: "da_kangra", fullName: "DA Kangra", district: "Kangra" },
  { username: "da_mandi", fullName: "DA Mandi", district: "Mandi" },
  { username: "da_solan", fullName: "DA Solan", district: "Solan" },
  { username: "da_una", fullName: "DA Una", district: "Una" },
  { username: "da_hamirpur", fullName: "DA Hamirpur", district: "Hamirpur" },
  { username: "da_bilaspur", fullName: "DA Bilaspur", district: "Bilaspur" },
  { username: "da_chamba", fullName: "DA Chamba", district: "Chamba" },
  { username: "da_sirmaur", fullName: "DA Sirmaur", district: "Sirmaur" },
  { username: "da_kinnaur", fullName: "DA Kinnaur", district: "Kinnaur" },
  { username: "da_lahaul_spiti", fullName: "DA Lahaul & Spiti", district: "Lahaul & Spiti" }
];
var DTDO_TEMPLATE = [
  { username: "dtdo_shimla", fullName: "DTDO Shimla", district: "Shimla" },
  { username: "dtdo_kullu", fullName: "DTDO Kullu", district: "Kullu" },
  { username: "dtdo_kangra", fullName: "DTDO Kangra", district: "Kangra" },
  { username: "dtdo_mandi", fullName: "DTDO Mandi", district: "Mandi" },
  { username: "dtdo_solan", fullName: "DTDO Solan", district: "Solan" },
  { username: "dtdo_una", fullName: "DTDO Una", district: "Una" },
  { username: "dtdo_hamirpur", fullName: "DTDO Hamirpur", district: "Hamirpur" },
  { username: "dtdo_bilaspur", fullName: "DTDO Bilaspur", district: "Bilaspur" },
  { username: "dtdo_chamba", fullName: "DTDO Chamba", district: "Chamba" },
  { username: "dtdo_sirmaur", fullName: "DTDO Sirmaur", district: "Sirmaur" },
  { username: "dtdo_kinnaur", fullName: "DTDO Kinnaur", district: "Kinnaur" },
  { username: "dtdo_lahaul_spiti", fullName: "DTDO Lahaul & Spiti", district: "Lahaul & Spiti" }
];
function createAdminSeedRouter() {
  const router8 = express11.Router();
  router8.post("/seed/da-accounts", requireRole("super_admin"), async (req, res) => {
    try {
      const hashedPassword = await bcrypt3.hash(DEFAULT_PASSWORD, 10);
      const results = [];
      for (const da of DA_TEMPLATE) {
        try {
          const [existing] = await db.select().from(users).where(eq21(users.username, da.username)).limit(1);
          if (existing) {
            results.push({ username: da.username, status: "exists" });
            continue;
          }
          await db.insert(users).values({
            username: da.username,
            fullName: da.fullName,
            firstName: "DA",
            lastName: da.district,
            mobile: `78000010${DA_TEMPLATE.indexOf(da) + 10}`,
            // Generate unique mobile
            email: `${da.username}@himachaltourism.gov.in`,
            role: "dealing_assistant",
            district: da.district,
            password: hashedPassword,
            isActive: true
          });
          results.push({ username: da.username, status: "created" });
        } catch (err) {
          results.push({ username: da.username, status: "error", message: err.message });
        }
      }
      const created = results.filter((r) => r.status === "created").length;
      const exists = results.filter((r) => r.status === "exists").length;
      const errors = results.filter((r) => r.status === "error").length;
      log12.info({ userId: req.session?.userId, created, exists, errors }, "[seed] DA accounts seeded");
      res.json({
        success: true,
        created,
        exists,
        errors,
        results,
        defaultPassword: DEFAULT_PASSWORD
      });
    } catch (error) {
      log12.error({ err: error }, "[seed] Failed to seed DA accounts");
      res.status(500).json({ message: "Failed to seed DA accounts" });
    }
  });
  router8.post("/seed/dtdo-accounts", requireRole("super_admin"), async (req, res) => {
    try {
      const hashedPassword = await bcrypt3.hash(DEFAULT_PASSWORD, 10);
      const results = [];
      for (const dtdo of DTDO_TEMPLATE) {
        try {
          const [existing] = await db.select().from(users).where(eq21(users.username, dtdo.username)).limit(1);
          if (existing) {
            results.push({ username: dtdo.username, status: "exists" });
            continue;
          }
          await db.insert(users).values({
            username: dtdo.username,
            fullName: dtdo.fullName,
            firstName: "DTDO",
            lastName: dtdo.district,
            mobile: `78000020${DTDO_TEMPLATE.indexOf(dtdo) + 10}`,
            // Generate unique mobile
            email: `${dtdo.username}@himachaltourism.gov.in`,
            role: "district_tourism_officer",
            district: dtdo.district,
            password: hashedPassword,
            isActive: true
          });
          results.push({ username: dtdo.username, status: "created" });
        } catch (err) {
          results.push({ username: dtdo.username, status: "error", message: err.message });
        }
      }
      const created = results.filter((r) => r.status === "created").length;
      const exists = results.filter((r) => r.status === "exists").length;
      const errors = results.filter((r) => r.status === "error").length;
      log12.info({ userId: req.session?.userId, created, exists, errors }, "[seed] DTDO accounts seeded");
      res.json({
        success: true,
        created,
        exists,
        errors,
        results,
        defaultPassword: DEFAULT_PASSWORD
      });
    } catch (error) {
      log12.error({ err: error }, "[seed] Failed to seed DTDO accounts");
      res.status(500).json({ message: "Failed to seed DTDO accounts" });
    }
  });
  router8.post("/seed/system-accounts", requireRole("super_admin"), async (req, res) => {
    try {
      const hashedPassword = await bcrypt3.hash(DEFAULT_PASSWORD, 10);
      const systemAccounts = [
        { username: "superadmin", fullName: "Super Admin", role: "super_admin" },
        { username: "system_admin", fullName: "System Admin", role: "system_admin" },
        { username: "supervisor_hq", fullName: "Supervisor HQ", role: "state_officer" }
      ];
      const results = [];
      for (const account of systemAccounts) {
        try {
          const [existing] = await db.select().from(users).where(eq21(users.username, account.username)).limit(1);
          if (existing) {
            results.push({ username: account.username, status: "exists" });
            continue;
          }
          await db.insert(users).values({
            username: account.username,
            fullName: account.fullName,
            firstName: account.fullName.split(" ")[0],
            lastName: account.fullName.split(" ").slice(1).join(" ") || "Admin",
            mobile: `78000000${systemAccounts.indexOf(account) + 1}1`,
            email: `${account.username}@himachaltourism.gov.in`,
            role: account.role,
            password: hashedPassword,
            isActive: true
          });
          results.push({ username: account.username, status: "created" });
        } catch (err) {
          results.push({ username: account.username, status: "error", message: err.message });
        }
      }
      const created = results.filter((r) => r.status === "created").length;
      const exists = results.filter((r) => r.status === "exists").length;
      const errors = results.filter((r) => r.status === "error").length;
      log12.info({ userId: req.session?.userId, created, exists, errors }, "[seed] System accounts seeded");
      res.json({
        success: true,
        created,
        exists,
        errors,
        results,
        defaultPassword: DEFAULT_PASSWORD
      });
    } catch (error) {
      log12.error({ err: error }, "[seed] Failed to seed system accounts");
      res.status(500).json({ message: "Failed to seed system accounts" });
    }
  });
  router8.get("/seed/status", requireRole("super_admin"), async (_req, res) => {
    try {
      const daUsers = await db.select({ username: users.username, district: users.district }).from(users).where(eq21(users.role, "dealing_assistant"));
      const dtdoUsers = await db.select({ username: users.username, district: users.district }).from(users).where(eq21(users.role, "district_tourism_officer"));
      const systemUsers = await db.select({ username: users.username, role: users.role }).from(users).where(
        and4(
          eq21(users.role, "super_admin")
        )
      );
      res.json({
        da: {
          total: DA_TEMPLATE.length,
          seeded: daUsers.length,
          accounts: daUsers
        },
        dtdo: {
          total: DTDO_TEMPLATE.length,
          seeded: dtdoUsers.length,
          accounts: dtdoUsers
        },
        systemAccounts: systemUsers
      });
    } catch (error) {
      log12.error({ err: error }, "[seed] Failed to get seed status");
      res.status(500).json({ message: "Failed to get seed status" });
    }
  });
  return router8;
}

// server/routes/admin/reports.ts
init_db();
init_schema();
init_middleware();
init_logger();
import express12 from "express";
import { eq as eq22, desc as desc4, and as and5, sql as sql8, gte as gte2, lte } from "drizzle-orm";
var log13 = logger.child({ module: "admin-reports-router" });
var getDistrictFilter = async (userId) => {
  const [user] = await db.select({ role: users.role, district: users.district }).from(users).where(eq22(users.id, userId)).limit(1);
  if (!user) return null;
  if (user.role === "district_tourism_officer" || user.role === "district_officer" || user.role === "dealing_assistant") {
    return user.district || null;
  }
  return null;
};
var buildTransactionTypeCondition = (transactionType) => {
  if (transactionType === "test") {
    return sql8`${homestayApplications.applicationNumber} LIKE 'TEST-%'`;
  } else if (transactionType === "real") {
    return sql8`${homestayApplications.applicationNumber} NOT LIKE 'TEST-%'`;
  }
  return null;
};
function createAdminReportsRouter() {
  const router8 = express12.Router();
  router8.get(
    "/reports/collections",
    requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
    async (req, res) => {
      try {
        const userId = req.session.userId;
        const roleFilter = await getDistrictFilter(userId);
        const districtFilter = roleFilter || req.query.district || null;
        log13.info({
          userId,
          queryDistrict: req.query.district,
          roleFilter,
          finalFilter: districtFilter
        }, "Reports filter debug");
        const fromDate = req.query.from ? new Date(req.query.from) : null;
        const toDate = req.query.to ? new Date(req.query.to) : null;
        const transactionType = req.query.transactionType;
        const ddoFilter = req.query.ddo;
        let query = db.select({
          ddo: himkoshTransactions.ddo,
          district: homestayApplications.district,
          // Use Application District
          ddoDescription: ddoCodes.ddoDescription,
          treasuryCode: ddoCodes.treasuryCode,
          totalTransactions: sql8`count(*)::int`,
          successfulTransactions: sql8`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'success')::int`,
          totalAmount: sql8`coalesce(sum(${himkoshTransactions.totalAmount}) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'success'), 0)::int`
        }).from(himkoshTransactions).innerJoin(
          homestayApplications,
          eq22(himkoshTransactions.applicationId, homestayApplications.id)
        ).leftJoin(
          ddoCodes,
          and5(
            eq22(himkoshTransactions.ddo, ddoCodes.ddoCode),
            eq22(homestayApplications.district, ddoCodes.district)
          )
        ).groupBy(
          himkoshTransactions.ddo,
          homestayApplications.district,
          ddoCodes.ddoDescription,
          ddoCodes.treasuryCode
        ).orderBy(desc4(sql8`sum(${himkoshTransactions.totalAmount})`));
        const conditions = [];
        if (districtFilter) {
          conditions.push(eq22(homestayApplications.district, districtFilter));
        }
        if (fromDate) {
          conditions.push(gte2(himkoshTransactions.createdAt, fromDate));
        }
        if (toDate) {
          conditions.push(lte(himkoshTransactions.createdAt, toDate));
        }
        const txnTypeCondition = buildTransactionTypeCondition(transactionType);
        if (txnTypeCondition) {
          conditions.push(txnTypeCondition);
        }
        if (ddoFilter && ddoFilter !== "all") {
          conditions.push(eq22(himkoshTransactions.ddo, ddoFilter));
        }
        if (conditions.length > 0) {
          query = query.where(and5(...conditions));
        }
        const collections = await query;
        const totals = collections.reduce(
          (acc, row) => ({
            totalTransactions: acc.totalTransactions + (row.totalTransactions || 0),
            successfulTransactions: acc.successfulTransactions + (row.successfulTransactions || 0),
            totalAmount: acc.totalAmount + (row.totalAmount || 0)
          }),
          { totalTransactions: 0, successfulTransactions: 0, totalAmount: 0 }
        );
        res.json({
          collections,
          totals,
          filters: {
            district: districtFilter,
            from: fromDate?.toISOString() || null,
            to: toDate?.toISOString() || null
          }
        });
      } catch (error) {
        log13.error({ err: error }, "[reports] Failed to fetch collection report");
        res.status(500).json({ message: "Failed to fetch collection report" });
      }
    }
  );
  router8.get(
    "/reports/payments",
    requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "system_admin"),
    async (req, res) => {
      try {
        const userId = req.session.userId;
        const roleFilter = await getDistrictFilter(userId);
        const districtFilter = roleFilter || req.query.district || null;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;
        const fromDate = req.query.from ? new Date(req.query.from) : null;
        const toDate = req.query.to ? new Date(req.query.to) : null;
        const transactionType = req.query.transactionType;
        const ddoFilter = req.query.ddo;
        const statusFilter = req.query.status;
        const conditions = [];
        if (statusFilter !== "all") {
          conditions.push(eq22(himkoshTransactions.transactionStatus, "success"));
        }
        if (districtFilter) {
        }
        if (fromDate) {
          conditions.push(gte2(himkoshTransactions.createdAt, fromDate));
        }
        if (toDate) {
          conditions.push(lte(himkoshTransactions.createdAt, toDate));
        }
        const txnTypeCondition = buildTransactionTypeCondition(transactionType);
        if (txnTypeCondition) {
          conditions.push(txnTypeCondition);
        }
        if (ddoFilter && ddoFilter !== "all") {
          conditions.push(eq22(himkoshTransactions.ddo, ddoFilter));
        }
        const whereConditions = [...conditions];
        if (districtFilter) {
          whereConditions.push(eq22(homestayApplications.district, districtFilter));
        }
        const whereClause = and5(...whereConditions);
        const [payments4, countResult] = await Promise.all([
          db.select({
            id: himkoshTransactions.id,
            appRefNo: himkoshTransactions.appRefNo,
            deptRefNo: himkoshTransactions.deptRefNo,
            ddo: himkoshTransactions.ddo,
            head1: himkoshTransactions.head1,
            totalAmount: himkoshTransactions.totalAmount,
            transactionStatus: himkoshTransactions.transactionStatus,
            echTxnId: himkoshTransactions.echTxnId,
            bankCIN: himkoshTransactions.bankCIN,
            bankName: himkoshTransactions.bankName,
            tenderBy: himkoshTransactions.tenderBy,
            createdAt: himkoshTransactions.createdAt,
            applicationId: himkoshTransactions.applicationId,
            applicationDistrict: homestayApplications.district
          }).from(himkoshTransactions).innerJoin(
            homestayApplications,
            eq22(himkoshTransactions.applicationId, homestayApplications.id)
          ).where(whereClause).orderBy(desc4(himkoshTransactions.createdAt)).limit(limit).offset(offset),
          db.select({ count: sql8`count(*)::int` }).from(himkoshTransactions).innerJoin(
            homestayApplications,
            eq22(himkoshTransactions.applicationId, homestayApplications.id)
          ).where(whereClause)
        ]);
        const totalCount = countResult[0]?.count || 0;
        res.json({
          payments: payments4,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
          },
          filters: {
            district: districtFilter,
            from: fromDate?.toISOString() || null,
            to: toDate?.toISOString() || null
          }
        });
      } catch (error) {
        log13.error({ err: error }, "[reports] Failed to fetch payments report");
        res.status(500).json({ message: "Failed to fetch payments report" });
      }
    }
  );
  router8.get(
    "/reports/refundable",
    requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
    async (req, res) => {
      try {
        const userId = req.session.userId;
        const roleFilter = await getDistrictFilter(userId);
        const districtFilter = roleFilter || req.query.district || null;
        const transactionType = req.query.transactionType;
        const refundableQuery = db.select({
          transactionId: himkoshTransactions.id,
          appRefNo: himkoshTransactions.appRefNo,
          deptRefNo: himkoshTransactions.deptRefNo,
          ddo: himkoshTransactions.ddo,
          totalAmount: himkoshTransactions.totalAmount,
          echTxnId: himkoshTransactions.echTxnId,
          bankCIN: himkoshTransactions.bankCIN,
          tenderBy: himkoshTransactions.tenderBy,
          paymentDate: himkoshTransactions.createdAt,
          applicationId: homestayApplications.id,
          applicationNumber: homestayApplications.applicationNumber,
          applicationStatus: homestayApplications.status,
          propertyName: homestayApplications.propertyName,
          ownerName: homestayApplications.ownerName,
          district: homestayApplications.district
        }).from(himkoshTransactions).innerJoin(
          homestayApplications,
          eq22(himkoshTransactions.applicationId, homestayApplications.id)
        ).where(
          and5(
            eq22(himkoshTransactions.transactionStatus, "success"),
            eq22(homestayApplications.status, "rejected"),
            ...buildTransactionTypeCondition(transactionType) ? [buildTransactionTypeCondition(transactionType)] : []
          )
        ).orderBy(desc4(himkoshTransactions.createdAt));
        let refundable = await refundableQuery;
        if (districtFilter) {
          refundable = refundable.filter(
            (r) => r.district?.toLowerCase() === districtFilter.toLowerCase()
          );
        }
        const totalRefundAmount = refundable.reduce(
          (sum, r) => sum + (r.totalAmount || 0),
          0
        );
        res.json({
          refundable,
          summary: {
            count: refundable.length,
            totalAmount: totalRefundAmount
          },
          filters: {
            district: districtFilter
          }
        });
      } catch (error) {
        log13.error({ err: error }, "[reports] Failed to fetch refundable report");
        res.status(500).json({ message: "Failed to fetch refundable report" });
      }
    }
  );
  router8.get(
    "/reports/summary",
    requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
    async (req, res) => {
      try {
        const userId = req.session.userId;
        const roleFilter = await getDistrictFilter(userId);
        const districtFilter = roleFilter || req.query.district || null;
        const transactionType = req.query.transactionType;
        const ddoFilter = req.query.ddo;
        const conditions = [];
        const whereConditions = [...conditions];
        if (districtFilter) {
          whereConditions.push(eq22(homestayApplications.district, districtFilter));
        }
        const txnTypeCondition = buildTransactionTypeCondition(transactionType);
        if (txnTypeCondition) {
          whereConditions.push(txnTypeCondition);
        }
        if (ddoFilter && ddoFilter !== "all") {
          whereConditions.push(eq22(himkoshTransactions.ddo, ddoFilter));
        }
        const whereClause = whereConditions.length > 0 ? and5(...whereConditions) : void 0;
        const [stats] = await db.select({
          totalTransactions: sql8`count(*)::int`,
          successfulTransactions: sql8`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'success')::int`,
          failedTransactions: sql8`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'failed')::int`,
          totalCollected: sql8`coalesce(sum(${himkoshTransactions.totalAmount}) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'success'), 0)::int`
        }).from(himkoshTransactions).innerJoin(
          homestayApplications,
          eq22(himkoshTransactions.applicationId, homestayApplications.id)
        ).where(whereClause);
        res.json({
          ...stats,
          district: districtFilter
        });
      } catch (error) {
        log13.error({ err: error }, "[reports] Failed to fetch summary");
        res.status(500).json({ message: "Failed to fetch summary" });
      }
    }
  );
  router8.get(
    "/reports/ddo-codes",
    requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "system_admin"),
    async (req, res) => {
      try {
        const codes = await db.select({
          ddoCode: ddoCodes.ddoCode,
          district: ddoCodes.district,
          ddoDescription: ddoCodes.ddoDescription
        }).from(ddoCodes).orderBy(ddoCodes.district);
        res.json({ ddoCodes: codes });
      } catch (error) {
        log13.error({ err: error }, "[reports] Failed to fetch DDO codes");
        res.status(500).json({ message: "Failed to fetch DDO codes" });
      }
    }
  );
  return router8;
}

// server/routes/da.ts
init_db();
init_storage();
init_logger();
init_notifications();
init_middleware();

// server/routes/helpers/application.ts
init_db();
init_schema();
import { eq as eq23 } from "drizzle-orm";
var fetchApplicationWithOwner = async (applicationId) => {
  const [row] = await db.select({
    application: homestayApplications,
    ownerName: users.fullName,
    ownerMobile: users.mobile,
    ownerEmail: users.email
  }).from(homestayApplications).leftJoin(users, eq23(users.id, homestayApplications.userId)).where(eq23(homestayApplications.id, applicationId)).limit(1);
  if (!row?.application) {
    return null;
  }
  const owner = row.ownerName || row.ownerMobile || row.ownerEmail ? {
    fullName: row.ownerName,
    mobile: row.ownerMobile,
    email: row.ownerEmail
  } : null;
  return {
    application: row.application,
    owner
  };
};

// server/routes/da.ts
init_schema();

// shared/legacy.ts
var LEGACY_STATUS = /* @__PURE__ */ new Set(["legacy_rc_review"]);
var isLegacyContext = (context) => {
  if (!context) {
    return false;
  }
  if (typeof context.legacyOnboarding === "boolean") {
    return context.legacyOnboarding;
  }
  if (typeof context.legacyGuardianName === "string" && context.legacyGuardianName.trim().length > 0) {
    return true;
  }
  return false;
};
var isLegacyApplication = (application) => {
  if (!application) {
    return false;
  }
  if (LEGACY_STATUS.has(application.status ?? "")) {
    return true;
  }
  if (LEGACY_STATUS.has(application.currentStage ?? "")) {
    return true;
  }
  const context = application.serviceContext;
  if (isLegacyContext(context)) {
    return true;
  }
  if (application.applicationKind === "renewal" && application.projectType === "existing_property") {
    return true;
  }
  return false;
};

// server/routes/da.ts
import { desc as desc5, eq as eq24, and as and6, inArray as inArray2, or as or2, ne as ne2, ilike as ilike2 } from "drizzle-orm";
var routeLog2 = logger.child({ module: "routes/da" });
function registerDaRoutes(router8) {
  router8.get("/api/da/applications/incomplete", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DA must be assigned to a district" });
      }
      let districtCondition;
      const districtLower = user.district.toLowerCase();
      if (districtLower.includes("pangi")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%chamba%"),
          ilike2(homestayApplications.tehsil, "%pangi%")
        );
      } else if (districtLower.includes("kaza") || districtLower.includes("spiti")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%lahaul%"),
          ilike2(homestayApplications.tehsil, "%spiti%")
        );
      } else if (districtLower.includes("chamba")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%chamba%"),
          ne2(homestayApplications.tehsil, "Pangi")
          // Exclude Pangi
        );
      } else if (districtLower.includes("lahaul")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%lahaul%"),
          ne2(homestayApplications.tehsil, "Spiti")
          // Exclude Spiti
        );
      } else if (districtLower.includes("hamirpur")) {
        districtCondition = or2(
          ilike2(homestayApplications.district, "%hamirpur%"),
          ilike2(homestayApplications.district, "%una%")
        );
      } else if (districtLower.includes("bilaspur") || districtLower.includes("mandi")) {
        districtCondition = or2(
          ilike2(homestayApplications.district, "%bilaspur%"),
          ilike2(homestayApplications.district, "%mandi%")
        );
      } else {
        districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
      }
      const incompleteApplications = await db.select().from(homestayApplications).where(
        and6(
          districtCondition,
          or2(
            eq24(homestayApplications.status, "draft"),
            eq24(homestayApplications.status, "legacy_rc_draft")
          )
        )
      ).orderBy(desc5(homestayApplications.updatedAt));
      const applicationsWithOwner = await Promise.all(
        incompleteApplications.map(async (app2) => {
          const owner = await storage.getUser(app2.userId);
          return {
            ...app2,
            ownerName: owner?.fullName || "Unknown",
            ownerMobile: owner?.mobile || "N/A",
            ownerEmail: owner?.email || "N/A"
          };
        })
      );
      res.json(applicationsWithOwner);
    } catch (error) {
      routeLog2.error("[da] Failed to fetch incomplete applications:", error);
      res.status(500).json({ message: "Failed to fetch incomplete applications" });
    }
  });
  router8.get("/api/da/applications", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DA must be assigned to a district" });
      }
      let districtCondition;
      const districtLower = user.district.toLowerCase();
      if (districtLower.includes("pangi")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%chamba%"),
          ilike2(homestayApplications.tehsil, "%pangi%")
        );
      } else if (districtLower.includes("kaza") || districtLower.includes("spiti")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%lahaul%"),
          ilike2(homestayApplications.tehsil, "%spiti%")
        );
      } else if (districtLower.includes("chamba")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%chamba%"),
          ne2(homestayApplications.tehsil, "Pangi")
        );
      } else if (districtLower.includes("lahaul")) {
        districtCondition = and6(
          ilike2(homestayApplications.district, "%lahaul%"),
          ne2(homestayApplications.tehsil, "Spiti")
        );
      } else if (districtLower.includes("hamirpur")) {
        districtCondition = or2(
          ilike2(homestayApplications.district, "%hamirpur%"),
          ilike2(homestayApplications.district, "%una%")
        );
      } else if (districtLower.includes("bilaspur") || districtLower.includes("mandi")) {
        districtCondition = or2(
          ilike2(homestayApplications.district, "%bilaspur%"),
          ilike2(homestayApplications.district, "%mandi%")
        );
      } else {
        districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
      }
      const allApplications = await db.select().from(homestayApplications).where(districtCondition).orderBy(desc5(homestayApplications.createdAt));
      const applicationsWithOwner = await Promise.all(
        allApplications.map(async (app2) => {
          const owner = await storage.getUser(app2.userId);
          const [latestCorrection] = await db.select({
            createdAt: applicationActions.createdAt,
            feedback: applicationActions.feedback
          }).from(applicationActions).where(
            and6(
              eq24(applicationActions.applicationId, app2.id),
              eq24(applicationActions.action, "correction_resubmitted")
            )
          ).orderBy(desc5(applicationActions.createdAt)).limit(1);
          return {
            ...app2,
            ownerName: owner?.fullName || "Unknown",
            ownerMobile: owner?.mobile || "N/A",
            latestCorrection
          };
        })
      );
      res.json(applicationsWithOwner);
    } catch (error) {
      routeLog2.error("[da] Failed to fetch applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  router8.get("/api/da/applications/:id", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const detail = await fetchApplicationWithOwner(req.params.id);
      if (!detail?.application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (storage.syncDocumentsFromJsonb) {
        try {
          await storage.syncDocumentsFromJsonb(req.params.id);
        } catch (syncErr) {
          routeLog2.warn({ err: syncErr, applicationId: req.params.id }, "[da] Document sync failed");
        }
      }
      const documents4 = await storage.getDocumentsByApplication(req.params.id);
      const [sendBackSetting] = await db.select().from(systemSettings).where(eq24(systemSettings.settingKey, DA_SEND_BACK_SETTING_KEY)).limit(1);
      const sendBackEnabled = normalizeBooleanSetting(
        sendBackSetting?.settingValue,
        false
      );
      const legacyForwardEnabled = await getLegacyForwardEnabled();
      const correctionHistory = await db.select({
        id: applicationActions.id,
        createdAt: applicationActions.createdAt,
        feedback: applicationActions.feedback
      }).from(applicationActions).where(
        and6(
          eq24(applicationActions.applicationId, req.params.id),
          eq24(applicationActions.action, "correction_resubmitted")
        )
      ).orderBy(desc5(applicationActions.createdAt));
      res.json({
        application: detail.application,
        owner: detail.owner,
        documents: documents4,
        sendBackEnabled,
        legacyForwardEnabled,
        correctionHistory
      });
    } catch (error) {
      routeLog2.error("[da] Failed to fetch application details:", error);
      res.status(500).json({ message: "Failed to fetch application details" });
    }
  });
  router8.post("/api/da/applications/:id/start-scrutiny", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.status !== "submitted") {
        return res.status(400).json({ message: "Only submitted applications can be put under scrutiny" });
      }
      await storage.updateApplication(req.params.id, { status: "under_scrutiny" });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "start_scrutiny",
        previousStatus: application.status,
        newStatus: "under_scrutiny"
      });
      res.json({ message: "Application is now under scrutiny" });
    } catch (error) {
      routeLog2.error("[da] Failed to start scrutiny:", error);
      res.status(500).json({ message: "Failed to start scrutiny" });
    }
  });
  router8.post("/api/da/applications/:id/save-scrutiny", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { verifications } = req.body;
      const userId = req.session.userId;
      if (!verifications || !Array.isArray(verifications)) {
        return res.status(400).json({ message: "Invalid verification data" });
      }
      const targetApplication = await storage.getApplication(req.params.id);
      if (!targetApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (targetApplication.status !== "under_scrutiny" && targetApplication.status !== "legacy_rc_review") {
        return res.status(400).json({ message: "Document updates are locked once the application leaves scrutiny" });
      }
      for (const verification of verifications) {
        await db.update(documents).set({
          verificationStatus: verification.status,
          verificationNotes: verification.notes || null,
          isVerified: verification.status === "verified",
          verifiedBy: verification.status !== "pending" ? userId : null,
          verificationDate: verification.status !== "pending" ? /* @__PURE__ */ new Date() : null
        }).where(eq24(documents.id, verification.documentId));
      }
      res.json({ message: "Scrutiny progress saved successfully" });
    } catch (error) {
      routeLog2.error("[da] Failed to save scrutiny progress:", error);
      res.status(500).json({ message: "Failed to save scrutiny progress" });
    }
  });
  router8.post("/api/da/applications/:id/forward-to-dtdo", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { remarks } = req.body;
      const userId = req.session.userId;
      const trimmedRemarks = typeof remarks === "string" ? remarks.trim() : "";
      if (!trimmedRemarks) {
        return res.status(400).json({ message: "Scrutiny remarks are required before forwarding." });
      }
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.status !== "under_scrutiny" && application.status !== "legacy_rc_review") {
        return res.status(400).json({ message: "Only applications under scrutiny can be forwarded" });
      }
      const legacyForwardEnabled = await getLegacyForwardEnabled();
      if (isLegacyApplication(application) && !legacyForwardEnabled) {
        return res.status(400).json({
          message: "Legacy RC onboarding cases must be completed by the DA. DTDO escalation is currently disabled."
        });
      }
      if (application.applicationKind !== "cancel_certificate" && application.applicationKind !== "delete_rooms") {
        const docs = await storage.getDocumentsByApplication(req.params.id);
        if (docs.length === 0) {
          return res.status(400).json({ message: "Upload and verify required documents before forwarding" });
        }
        const pendingDoc = docs.find((doc) => !doc.verificationStatus || doc.verificationStatus === "pending");
        if (pendingDoc) {
          return res.status(400).json({ message: "Verify every document (mark Verified / Needs correction / Rejected) before forwarding" });
        }
      }
      await storage.updateApplication(req.params.id, {
        status: "forwarded_to_dtdo",
        daId: userId,
        daReviewDate: /* @__PURE__ */ new Date(),
        daForwardedDate: /* @__PURE__ */ new Date(),
        daRemarks: trimmedRemarks || null
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "forwarded_to_dtdo",
        previousStatus: application.status,
        newStatus: "forwarded_to_dtdo",
        feedback: trimmedRemarks || null
      });
      const daOwner = await storage.getUser(application.userId);
      const forwardedApplication = {
        ...application,
        status: "forwarded_to_dtdo"
      };
      queueNotification("forwarded_to_dtdo", {
        application: forwardedApplication,
        owner: daOwner ?? null
      });
      res.json({ message: "Application forwarded to DTDO successfully" });
    } catch (error) {
      routeLog2.error("[da] Failed to forward to DTDO:", error);
      res.status(500).json({ message: "Failed to forward application" });
    }
  });
  router8.post("/api/da/applications/:id/send-back", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const { reason, otpVerified } = req.body;
      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({ message: "Reason for sending back is required" });
      }
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.status !== "under_scrutiny" && application.status !== "legacy_rc_review") {
        return res.status(400).json({ message: "Only applications under scrutiny can be sent back" });
      }
      const currentRevertCount = application.revertCount ?? 0;
      const sanitizedReason = reason.trim();
      if (currentRevertCount >= 1) {
        routeLog2.info(
          { applicationId: req.params.id, revertCount: currentRevertCount },
          "Auto-rejecting application on second send-back attempt"
        );
        await storage.updateApplication(req.params.id, {
          status: "rejected",
          rejectionReason: `APPLICATION AUTO-REJECTED: Application was sent back twice. Original reason: ${sanitizedReason}`,
          revertCount: currentRevertCount + 1
        });
        await logApplicationAction({
          applicationId: req.params.id,
          actorId: req.session.userId,
          action: "auto_rejected",
          previousStatus: application.status,
          newStatus: "rejected",
          feedback: `Auto-rejected on 2nd send-back. Reason: ${sanitizedReason}`
        });
        const owner2 = await storage.getUser(application.userId);
        queueNotification("application_rejected", {
          application: { ...application, status: "rejected" },
          owner: owner2 ?? null,
          extras: { REMARKS: `Application was automatically rejected after multiple correction attempts. Reason: ${sanitizedReason}` }
        });
        return res.json({
          message: "Application has been automatically REJECTED due to multiple send-backs",
          autoRejected: true,
          newStatus: "rejected"
        });
      }
      if (!otpVerified) {
        return res.status(400).json({
          message: "OTP verification from DTDO is required before sending back",
          requireOtp: true,
          revertCount: currentRevertCount
        });
      }
      const updatedByDa = await storage.updateApplication(req.params.id, {
        status: "reverted_to_applicant",
        revertCount: currentRevertCount + 1
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: req.session.userId,
        action: "reverted_by_da",
        previousStatus: application.status,
        newStatus: "reverted_to_applicant",
        feedback: sanitizedReason
      });
      const owner = await storage.getUser(application.userId);
      queueNotification("da_send_back", {
        application: updatedByDa ?? { ...application, status: "reverted_to_applicant" },
        owner: owner ?? null,
        extras: { REMARKS: sanitizedReason }
      });
      res.json({
        message: "Application sent back to applicant successfully",
        newRevertCount: currentRevertCount + 1,
        warning: "This application can only be sent back once more before automatic rejection."
      });
    } catch (error) {
      routeLog2.error("[da] Failed to send back application:", error);
      res.status(500).json({ message: "Failed to send back application" });
    }
  });
  router8.get("/api/da/stats", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const now = /* @__PURE__ */ new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const [processedToday] = await db.select({ count: sql`count(*)::int` }).from(applicationActions).where(
        and6(
          eq24(applicationActions.actorId, userId),
          gte(applicationActions.createdAt, startOfDay),
          inArray2(applicationActions.action, ["forwarded_to_dtdo", "reverted_by_da"])
        )
      );
      res.json({
        processedToday: processedToday.count,
        pendingScrutiny: 0,
        // Placeholder
        avgTime: "0 mins"
        // Placeholder
      });
    } catch (error) {
      routeLog2.error("[da] Failed to fetch stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
}

// server/staffManifestSync.ts
init_db();
init_schema();
init_districtStaffManifest();
init_logger();
import { eq as eq25 } from "drizzle-orm";
import bcrypt4 from "bcrypt";
var manifest = getDistrictStaffManifest();
var staffSyncLog = logger.child({ module: "staff-sync" });
var capitalize = (value) => value.length === 0 ? value : value[0].toUpperCase() + value.slice(1).toLowerCase();
var formatStaffNames = (username) => {
  const tokens = username.split("_").filter(Boolean);
  if (tokens.length === 0) {
    const fallback = username.trim() || "Officer";
    return {
      firstName: fallback.toUpperCase(),
      lastName: "",
      fullName: fallback.toUpperCase()
    };
  }
  const [firstToken, ...rest] = tokens;
  const firstName = firstToken.toUpperCase();
  const lastName = rest.length > 0 ? rest.map(capitalize).join(" ") : "Officer";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return { firstName, lastName, fullName };
};
var syncStaffAccountsFromManifest = async () => {
  for (const entry of manifest) {
    for (const role of ["da", "dtdo"]) {
      const manifestAccount = entry[role];
      const targetRole = role === "da" ? "dealing_assistant" : "district_tourism_officer";
      try {
        const [existing] = await db.select().from(users).where(eq25(users.mobile, manifestAccount.mobile)).limit(1);
        if (!existing) {
          continue;
        }
        const updates = {};
        const normalizedExistingUsername = (existing.username || "").trim().toLowerCase();
        const normalizedManifestUsername = manifestAccount.username.trim().toLowerCase();
        if (normalizedExistingUsername !== normalizedManifestUsername) {
          updates.username = manifestAccount.username;
        }
        if ((existing.district || "").trim() !== entry.districtLabel.trim()) {
          updates.district = entry.districtLabel;
        }
        if ((existing.email || "").trim() !== manifestAccount.email.trim()) {
          updates.email = manifestAccount.email;
        }
        const derivedNames = formatStaffNames(manifestAccount.username);
        if ((existing.fullName || "").trim() !== derivedNames.fullName) {
          updates.fullName = derivedNames.fullName;
        }
        if ((existing.firstName || "").trim() !== derivedNames.firstName) {
          updates.firstName = derivedNames.firstName;
        }
        if ((existing.lastName || "").trim() !== derivedNames.lastName) {
          updates.lastName = derivedNames.lastName;
        }
        if (manifestAccount.password) {
          const passwordMatches = typeof existing.password === "string" && existing.password.length > 0 ? await bcrypt4.compare(manifestAccount.password, existing.password) : false;
          if (!passwordMatches) {
            updates.password = await bcrypt4.hash(manifestAccount.password, 10);
          }
        }
        if (existing.role !== targetRole) {
          updates.role = targetRole;
        }
        if (existing.isActive === false) {
          updates.isActive = true;
        }
        if (Object.keys(updates).length > 0) {
          await db.update(users).set(updates).where(eq25(users.id, existing.id));
        }
      } catch (error) {
        staffSyncLog.error(
          { err: error, username: manifestAccount.username, district: entry.districtLabel },
          "Failed to sync staff account"
        );
      }
    }
  }
};
void syncStaffAccountsFromManifest().catch((error) => {
  staffSyncLog.error({ err: error }, "Failed to run staff manifest sync");
});

// server/routes.ts
init_middleware();

// server/routes/auth/index.ts
init_schema();
init_storage();
init_db();
import express13 from "express";
import bcrypt6 from "bcrypt";
import { z as z5 } from "zod";
import { eq as eq28 } from "drizzle-orm";

// server/security/rateLimit.ts
init_config();
init_logger();
init_db();
init_schema();
import rateLimit from "express-rate-limit";
import { eq as eq26 } from "drizzle-orm";
var RATE_LIMIT_SETTING_KEY = "rate_limit_configuration";
var cachedConfig = null;
var cacheTimestamp = 0;
var CACHE_TTL_MS = 60 * 1e3;
var DEFAULT_CONFIG = {
  enabled: config.security.enableRateLimit,
  global: {
    maxRequests: config.security.rateLimit.maxRequests,
    windowMinutes: Math.round(config.security.rateLimit.windowMs / 6e4)
  },
  auth: {
    maxRequests: config.security.rateLimit.authMaxRequests,
    windowMinutes: Math.round(config.security.rateLimit.authWindowMs / 6e4)
  },
  upload: {
    maxRequests: config.security.rateLimit.uploadMaxRequests,
    windowMinutes: Math.round(config.security.rateLimit.uploadWindowMs / 6e4)
  }
};
async function getRateLimitConfig() {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedConfig;
  }
  try {
    const [setting] = await db.select().from(systemSettings).where(eq26(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY)).limit(1);
    if (setting?.settingValue) {
      cachedConfig = { ...DEFAULT_CONFIG, ...setting.settingValue };
    } else {
      cachedConfig = DEFAULT_CONFIG;
    }
    cacheTimestamp = now;
    return cachedConfig;
  } catch (error) {
    logger.warn({ err: error }, "[rate-limit] Failed to fetch config from DB, using defaults");
    return DEFAULT_CONFIG;
  }
}
function createDynamicLimiter(type, message) {
  return async (req, res, next) => {
    try {
      const rateLimitConfig = await getRateLimitConfig();
      if (!rateLimitConfig.enabled) {
        return next();
      }
      const limiterConfig = rateLimitConfig[type];
      const windowMs = limiterConfig.windowMinutes * 60 * 1e3;
      const max = limiterConfig.maxRequests;
      const limiter = rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req2) => req2.ip || "unknown",
        handler: (req2, res2, _next, options) => {
          logger.warn(
            {
              ip: req2.ip,
              path: req2.originalUrl,
              userId: req2?.session?.userId ?? null,
              limiter: type
            },
            "Rate limit exceeded"
          );
          res2.status(options.statusCode).json({ message });
        }
      });
      limiter(req, res, next);
    } catch (error) {
      logger.warn({ err: error }, "[rate-limit] Error in rate limiter, allowing request");
      next();
    }
  };
}
var globalRateLimiter = createDynamicLimiter(
  "global",
  "Too many requests from this IP. Please try again soon."
);
var authRateLimiter = createDynamicLimiter(
  "auth",
  "Too many authentication attempts. Please wait a few minutes and try again."
);
var uploadRateLimiter = createDynamicLimiter(
  "upload",
  "Upload rate exceeded. Please retry after a short pause."
);

// server/routes/auth/utils.ts
init_db();
init_schema();
init_districtStaffManifest();
init_storage();
init_notifications();
import { randomInt } from "crypto";
import bcrypt5 from "bcrypt";
import { eq as eq27, sql as sql9 } from "drizzle-orm";
init_systemSettings();
init_logger();
var authLog = logger.child({ module: "auth-utils" });
var LOGIN_OTP_CODE_LENGTH = 6;
var LOGIN_OTP_EXPIRY_MINUTES = 10;
var PASSWORD_RESET_EXPIRY_MINUTES = 10;
var maskMobileNumber = (mobile) => {
  if (!mobile) {
    return "";
  }
  const digits = mobile.replace(/\s+/g, "");
  if (digits.length <= 4) {
    return digits;
  }
  const visible = digits.slice(-4);
  return `${"\u2022".repeat(Math.max(0, digits.length - 4))}${visible}`;
};
var maskEmailAddress = (email) => {
  if (!email) {
    return "";
  }
  const [local, domain] = email.split("@");
  if (!domain) {
    return email;
  }
  if (!local || local.length <= 2) {
    return `${local?.[0] ?? ""}***@${domain}`;
  }
  return `${local.slice(0, 1)}***${local.slice(-1)}@${domain}`;
};
var generateLoginOtpCode = () => randomInt(0, 10 ** LOGIN_OTP_CODE_LENGTH).toString().padStart(LOGIN_OTP_CODE_LENGTH, "0");
var getLoginOtpSetting = async () => {
  const record = await getSystemSettingRecord(LOGIN_OTP_SETTING_KEY);
  return normalizeBooleanSetting(record?.settingValue, false);
};
var getSingleSessionSetting = async () => {
  const record = await getSystemSettingRecord(SINGLE_SESSION_SETTING_KEY);
  return normalizeBooleanSetting(record?.settingValue, false);
};
var clearExistingLoginChallenges = async (userId) => {
  await db.delete(loginOtpChallenges).where(eq27(loginOtpChallenges.userId, userId));
};
var createLoginOtpChallenge = async (user, channel) => {
  const otp = generateLoginOtpCode();
  const otpHash = await bcrypt5.hash(otp, 10);
  const expiresAt = new Date(Date.now() + LOGIN_OTP_EXPIRY_MINUTES * 60 * 1e3);
  await clearExistingLoginChallenges(user.id);
  const [challenge] = await db.insert(loginOtpChallenges).values({
    userId: user.id,
    otpHash,
    expiresAt
  }).returning();
  queueNotification("otp", {
    owner: user,
    otp,
    recipientMobile: channel === "sms" ? user.mobile ?? null : null,
    recipientEmail: channel === "email" ? user.email ?? null : null
  });
  return {
    id: challenge.id,
    expiresAt,
    channel
  };
};
var passwordResetTableReady = false;
var ensurePasswordResetTable = async () => {
  if (passwordResetTableReady) {
    return;
  }
  try {
    await db.execute(sql9`
      CREATE TABLE IF NOT EXISTS password_reset_challenges (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        channel VARCHAR(32) NOT NULL,
        recipient VARCHAR(255),
        otp_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        consumed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT now()
      )
    `);
    await db.execute(sql9`
      CREATE INDEX IF NOT EXISTS idx_password_reset_challenges_user_id
        ON password_reset_challenges(user_id)
    `);
    await db.execute(sql9`
      CREATE INDEX IF NOT EXISTS idx_password_reset_challenges_expires_at
        ON password_reset_challenges(expires_at)
    `);
    passwordResetTableReady = true;
  } catch (error) {
    authLog.error("[auth] Failed to ensure password_reset_challenges table", error);
    throw error;
  }
};
var createPasswordResetChallenge = async (user, channel) => {
  await ensurePasswordResetTable();
  const otp = generateLoginOtpCode();
  const otpHash = await bcrypt5.hash(otp, 10);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1e3);
  await db.delete(passwordResetChallenges).where(eq27(passwordResetChallenges.userId, user.id));
  const recipient = channel === "sms" ? user.mobile ?? null : user.email ?? null;
  const [challenge] = await db.insert(passwordResetChallenges).values({
    userId: user.id,
    channel,
    recipient,
    otpHash,
    expiresAt
  }).returning();
  queueNotification("password_reset", {
    owner: user,
    otp,
    recipientMobile: channel === "sms" ? recipient : void 0,
    recipientEmail: channel === "email" ? recipient : void 0
  });
  return {
    id: challenge.id,
    expiresAt
  };
};
var findUserByIdentifier = async (rawIdentifier) => {
  const identifier = rawIdentifier.trim();
  if (!identifier) {
    return null;
  }
  const normalizedMobile = identifier.replace(/\s+/g, "");
  const looksLikeMobile = /^[0-9]{8,15}$/.test(normalizedMobile);
  const normalizedEmail = identifier.toLowerCase();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const manifestFromIdentifier = lookupStaffAccountByIdentifier(identifier);
  const manifestFromMobile = looksLikeMobile ? lookupStaffAccountByMobile(normalizedMobile) : void 0;
  let user = looksLikeMobile ? await storage.getUserByMobile(normalizedMobile) : looksLikeEmail ? await storage.getUserByEmail(normalizedEmail) : void 0;
  if (!user && manifestFromMobile && manifestFromMobile.mobile !== normalizedMobile) {
    user = await storage.getUserByMobile(manifestFromMobile.mobile);
  }
  if (!user) {
    user = await storage.getUserByUsername(identifier);
  }
  if (!user && manifestFromIdentifier) {
    user = await storage.getUserByMobile(manifestFromIdentifier.mobile);
  }
  if (!user && looksLikeEmail) {
    user = await storage.getUserByEmail(normalizedEmail);
  }
  return user ?? null;
};
var invalidateExistingSessions = async (userId, exceptSessionId) => {
  try {
    const enforced = await getSingleSessionSetting();
    if (!enforced) {
      authLog.debug({ userId }, "[SingleSession] Multiple sessions allowed (setting disabled)");
      return;
    }
    authLog.info({ userId, exceptSessionId }, `[SingleSession] Attempting to invalidate sessions...`);
    let result;
    if (exceptSessionId) {
      result = await db.execute(sql9`
          DELETE FROM "session"
          WHERE sess ->> 'userId' = ${userId}
          AND sid != ${exceptSessionId}
        `);
    } else {
      result = await db.execute(sql9`
          DELETE FROM "session"
          WHERE sess ->> 'userId' = ${userId}
        `);
    }
    authLog.info({ userId, exceptSessionId, result }, `[SingleSession] Invalidated existing sessions for user`);
  } catch (error) {
    authLog.error({ err: error, userId, exceptSessionId }, "[SingleSession] FAILED to invalidate existing sessions");
  }
  ;
};

// server/routes/core/users.ts
init_districtStaffManifest();
var formatUserForResponse = (user) => {
  const { password, ...userWithoutPassword } = user;
  const derivedUsername = getManifestDerivedUsername(
    userWithoutPassword.mobile,
    userWithoutPassword.username ?? void 0
  );
  return {
    ...userWithoutPassword,
    username: derivedUsername ?? userWithoutPassword.username ?? null
  };
};

// server/routes/auth/index.ts
init_middleware();
init_logger();
init_notifications();
init_districtStaffManifest();
var authLog2 = logger.child({ module: "auth-routes" });
var generateCaptcha = () => {
  const first = Math.floor(Math.random() * 9) + 1;
  const second = Math.floor(Math.random() * 9) + 1;
  const operations = [
    { symbol: "+", apply: (a, b) => a + b },
    { symbol: "-", apply: (a, b) => a - b },
    { symbol: "\xD7", apply: (a, b) => a * b }
  ];
  const op = operations[Math.floor(Math.random() * operations.length)];
  return {
    question: `${first} ${op.symbol} ${second}`,
    answer: String(op.apply(first, second))
  };
};
var getOtpChannelState = async () => {
  const otpChannels = await resolveNotificationChannelState("otp");
  const smsEnabled = Boolean(otpChannels.smsEnabled);
  const emailEnabled = Boolean(otpChannels.emailEnabled);
  return {
    smsEnabled,
    emailEnabled,
    anyEnabled: smsEnabled || emailEnabled
  };
};
var getOtpLoginAvailabilityForUser = async (user) => {
  const channelState = await getOtpChannelState();
  const allowed = channelState.anyEnabled;
  return {
    ...channelState,
    allowed
  };
};
function createAuthRouter() {
  const router8 = express13.Router();
  router8.post("/register", authRateLimiter, async (req, res) => {
    try {
      const rawData = {
        ...req.body,
        role: "property_owner",
        email: req.body.email || void 0,
        aadhaarNumber: req.body.aadhaarNumber || void 0,
        district: req.body.district || void 0
      };
      const data = insertUserSchema.parse(rawData);
      const existing = await storage.getUserByMobile(data.mobile);
      if (existing) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }
      const hashedPassword = await bcrypt6.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword
      });
      req.session.regenerate((err) => {
        if (err) {
          authLog2.error("[auth] Failed to regenerate session", err);
          return res.status(500).json({ message: "Registration failed (session error)" });
        }
        req.session.userId = user.id;
        const { password, ...userWithoutPassword } = user;
        req.session.save(async (saveErr) => {
          if (saveErr) {
            authLog2.error("[auth] Failed to save session during registration", saveErr);
            return res.status(500).json({ message: "Registration failed (save error)" });
          }
          await invalidateExistingSessions(user.id, req.session.id);
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      authLog2.error("[registration] Error during registration:", error);
      if (error instanceof z5.ZodError) {
        return res.status(400).json({ message: error.errors[0].message, errors: error.errors });
      }
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        if ("constraint" in error && error.constraint === "users_aadhaar_number_unique") {
          return res.status(400).json({
            message: "This Aadhaar number is already registered. Please login or use a different Aadhaar number."
          });
        }
      }
      res.status(500).json({ message: "Registration failed", error: error instanceof Error ? error.message : String(error) });
    }
  });
  router8.get("/captcha", async (req, res) => {
    try {
      if (shouldBypassCaptcha(req.get("host"))) {
        updateCaptchaSettingCache(false);
        req.session.captchaAnswer = null;
        req.session.captchaIssuedAt = null;
        return res.json({ enabled: false });
      }
      const enabled = await getCaptchaSetting();
      if (!enabled) {
        req.session.captchaAnswer = null;
        req.session.captchaIssuedAt = null;
        return res.json({ enabled: false });
      }
      const { question, answer } = generateCaptcha();
      req.session.captchaAnswer = answer;
      req.session.captchaIssuedAt = Date.now();
      res.json({ enabled: true, question, expiresInSeconds: 300 });
    } catch (error) {
      authLog2.error("[auth] Failed to load captcha:", error);
      res.status(500).json({ message: "Captcha unavailable" });
    }
  });
  router8.get("/login/options", async (_req, res) => {
    try {
      const otpChannels = await getOtpChannelState();
      const otpRequired = otpChannels.anyEnabled ? await getLoginOtpSetting() : false;
      const payload = {
        otpEnabled: otpChannels.anyEnabled,
        smsOtpEnabled: otpChannels.smsEnabled,
        emailOtpEnabled: otpChannels.emailEnabled,
        otpRequired
      };
      authLog2.info("[auth] login options", payload);
      res.json(payload);
    } catch (error) {
      authLog2.error("[auth] Failed to load login options", error);
      res.status(500).json({ message: "Unable to load login options" });
    }
  });
  router8.post("/login", authRateLimiter, async (req, res) => {
    try {
      const authModeRaw = typeof req.body?.authMode === "string" ? req.body.authMode.trim().toLowerCase() : "password";
      const authMode = authModeRaw === "otp" ? "otp" : "password";
      const otpChannelRaw = typeof req.body?.otpChannel === "string" ? req.body.otpChannel.trim().toLowerCase() : "sms";
      const otpChannel = otpChannelRaw === "email" ? "email" : "sms";
      const password = typeof req.body?.password === "string" ? req.body.password : "";
      const captchaAnswer = typeof req.body?.captchaAnswer === "string" ? req.body.captchaAnswer.trim() : "";
      const rawIdentifier = typeof req.body?.identifier === "string" && req.body.identifier.trim().length > 0 ? req.body.identifier.trim() : typeof req.body?.mobile === "string" ? req.body.mobile.trim() : "";
      if (!rawIdentifier) {
        return res.status(400).json({ message: "Identifier required" });
      }
      if (authMode === "password" && !password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const captchaRequired = shouldBypassCaptcha(req.get("host")) ? false : await getCaptchaSetting();
      if (captchaRequired) {
        if (!captchaAnswer) {
          return res.status(400).json({ message: "Captcha answer required" });
        }
        const expectedCaptchaAnswer = req.session.captchaAnswer;
        const captchaIssuedAt = req.session.captchaIssuedAt ?? 0;
        const captchaExpired = !captchaIssuedAt || Date.now() - captchaIssuedAt > 5 * 60 * 1e3;
        if (!expectedCaptchaAnswer || captchaExpired || captchaAnswer !== expectedCaptchaAnswer) {
          req.session.captchaAnswer = null;
          req.session.captchaIssuedAt = null;
          const message = captchaExpired ? "Captcha expired. Please refresh and try again." : "Invalid captcha answer";
          return res.status(400).json({ message });
        }
      }
      const normalizedMobile = rawIdentifier.replace(/\s+/g, "");
      const looksLikeMobile = /^[0-9]{8,15}$/.test(normalizedMobile);
      const normalizedEmail = rawIdentifier.toLowerCase();
      const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
      const manifestFromIdentifier = lookupStaffAccountByIdentifier(rawIdentifier);
      const manifestFromMobile = looksLikeMobile ? lookupStaffAccountByMobile(normalizedMobile) : void 0;
      let user = looksLikeMobile ? await storage.getUserByMobile(normalizedMobile) : looksLikeEmail ? await storage.getUserByEmail(normalizedEmail) : void 0;
      if (!user && manifestFromMobile && manifestFromMobile.mobile !== normalizedMobile) {
        user = await storage.getUserByMobile(manifestFromMobile.mobile);
      }
      if (!user) {
        user = await storage.getUserByUsername(rawIdentifier);
      }
      if (!user && manifestFromIdentifier) {
        user = await storage.getUserByMobile(manifestFromIdentifier.mobile);
      }
      if (!user && looksLikeEmail) {
        user = await storage.getUserByEmail(normalizedEmail);
      }
      if (!user && typeof req.body?.mobile === "string") {
        user = await storage.getUserByMobile(req.body.mobile.trim());
      }
      if (!user || authMode === "password" && !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: "Account deactivated" });
      }
      if (authMode === "otp") {
        const otpAvailability = await getOtpLoginAvailabilityForUser(user);
        if (!otpAvailability.allowed) {
          return res.status(400).json({ message: "OTP login is disabled" });
        }
        if (otpChannel === "sms") {
          if (!otpAvailability.smsEnabled) {
            return res.status(400).json({ message: "SMS OTP is disabled. Switch to email OTP." });
          }
          if (!user.mobile || user.mobile.trim().length < 6) {
            return res.status(400).json({ message: "OTP login unavailable (missing mobile)" });
          }
        } else if (otpChannel === "email") {
          if (!otpAvailability.emailEnabled) {
            return res.status(400).json({ message: "Email OTP is disabled. Switch to SMS OTP." });
          }
          if (!user.email) {
            return res.status(400).json({ message: "OTP login unavailable (missing email)" });
          }
        }
        const challenge = await createLoginOtpChallenge(user, otpChannel);
        req.session.captchaAnswer = null;
        req.session.captchaIssuedAt = null;
        return res.json({
          otpRequired: true,
          challengeId: challenge.id,
          expiresAt: challenge.expiresAt.toISOString(),
          maskedMobile: otpChannel === "sms" ? maskMobileNumber(user.mobile) : void 0,
          maskedEmail: otpChannel === "email" ? maskEmailAddress(user.email) : void 0,
          channel: otpChannel
        });
      }
      const comparePassword = async (candidate) => {
        if (!candidate || !candidate.password) {
          return false;
        }
        try {
          return await bcrypt6.compare(password, candidate.password);
        } catch (error) {
          authLog2.warn("[auth] Failed to compare password hash", {
            userId: candidate.id,
            identifier: rawIdentifier,
            error
          });
          return false;
        }
      };
      let passwordMatch = await comparePassword(user);
      if (!passwordMatch && manifestFromIdentifier) {
        try {
          const manifestUser = await storage.getUserByMobile(manifestFromIdentifier.mobile);
          if (manifestUser && manifestUser.id !== user.id && manifestUser.password && await comparePassword(manifestUser)) {
            user = manifestUser;
            passwordMatch = true;
            authLog2.info("[auth] Resolved staff login via manifest fallback", {
              identifier: rawIdentifier,
              mobile: manifestFromIdentifier.mobile
            });
          }
        } catch (fallbackError) {
          authLog2.error("[auth] Manifest fallback failed", fallbackError);
        }
      }
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const manifestAccount = manifestFromIdentifier ?? manifestFromMobile ?? lookupStaffAccountByMobile(user.mobile);
      if (manifestAccount && manifestAccount.username && (!user.username || user.username.toLowerCase() !== manifestAccount.username.toLowerCase())) {
        try {
          const updated = await storage.updateUser(user.id, {
            username: manifestAccount.username
          });
          if (updated) {
            user = updated;
          }
        } catch (updateError) {
          authLog2.warn("[auth] Failed to backfill staff username", updateError);
        }
      }
      req.session.regenerate((err) => {
        if (err) {
          authLog2.error("[auth] Failed to regenerate session", err);
          return res.status(500).json({ message: "Login failed (session error)" });
        }
        req.session.userId = user.id;
        req.session.captchaAnswer = null;
        req.session.captchaIssuedAt = null;
        const userResponse = formatUserForResponse(user);
        req.session.save(async (saveErr) => {
          if (saveErr) {
            authLog2.error("[auth] Failed to save session during login", saveErr);
            return res.status(500).json({ message: "Login failed (save error)" });
          }
          await invalidateExistingSessions(user.id, req.session.id);
          res.json({ user: userResponse });
        });
      });
    } catch (error) {
      authLog2.error("[auth] Login error", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  router8.post("/login/verify-otp", authRateLimiter, async (req, res) => {
    try {
      const challengeId = typeof req.body?.challengeId === "string" ? req.body.challengeId.trim() : "";
      const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
      if (!challengeId || !otp) {
        return res.status(400).json({ message: "OTP verification failed" });
      }
      const [challenge] = await db.select().from(loginOtpChallenges).where(eq28(loginOtpChallenges.id, challengeId)).limit(1);
      if (!challenge) {
        return res.status(400).json({ message: "OTP expired. Please sign in again." });
      }
      if (challenge.consumedAt) {
        return res.status(400).json({ message: "OTP already used. Please sign in again." });
      }
      const now = /* @__PURE__ */ new Date();
      if (challenge.expiresAt < now) {
        await db.delete(loginOtpChallenges).where(eq28(loginOtpChallenges.id, challengeId));
        return res.status(400).json({ message: "OTP expired. Please sign in again." });
      }
      const user = await storage.getUser(challenge.userId);
      if (!user || !user.isActive) {
        return res.status(400).json({ message: "Account unavailable" });
      }
      const otpMatch = await bcrypt6.compare(otp, challenge.otpHash);
      if (!otpMatch) {
        return res.status(400).json({ message: "Incorrect OTP" });
      }
      await db.update(loginOtpChallenges).set({ consumedAt: /* @__PURE__ */ new Date() }).where(eq28(loginOtpChallenges.id, challengeId));
      req.session.regenerate((err) => {
        if (err) {
          authLog2.error("[auth] Failed to regenerate session", err);
          return res.status(500).json({ message: "Login failed (session error)" });
        }
        req.session.userId = user.id;
        req.session.captchaAnswer = null;
        req.session.captchaIssuedAt = null;
        const userResponse = formatUserForResponse(user);
        req.session.save(async (saveErr) => {
          if (saveErr) {
            authLog2.error("[auth] Failed to save session during OTP login", saveErr);
            return res.status(500).json({ message: "Login failed (save error)" });
          }
          await invalidateExistingSessions(user.id, req.session.id);
          res.json({ user: userResponse });
        });
      });
    } catch (error) {
      authLog2.error("[auth] OTP verification failed", error);
      res.status(500).json({ message: "OTP verification failed" });
    }
  });
  const passwordResetRequestSchema = z5.object({
    identifier: z5.string().min(3, "Enter your registered mobile number, email, or username"),
    channel: z5.enum(["sms", "email"]).optional()
  });
  const passwordResetVerifySchema = z5.object({
    challengeId: z5.string().min(1, "Challenge id missing"),
    otp: z5.string().min(4, "Enter the code sent to you"),
    newPassword: z5.string().min(6, "New password must be at least 6 characters")
  });
  router8.post("/password-reset/request", authRateLimiter, async (req, res) => {
    try {
      const { identifier, channel: rawChannel } = passwordResetRequestSchema.parse(req.body ?? {});
      const channel = rawChannel === "email" ? "email" : "sms";
      const user = await findUserByIdentifier(identifier);
      if (!user) {
        return res.status(404).json({ message: "Account not found" });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: "Account disabled" });
      }
      if (channel === "sms") {
        if (!user.mobile || user.mobile.trim().length < 6) {
          return res.status(400).json({ message: "No mobile number linked to this account" });
        }
      } else if (channel === "email") {
        if (!user.email) {
          return res.status(400).json({ message: "No email linked to this account" });
        }
      }
      const challenge = await createPasswordResetChallenge(user, channel);
      res.json({
        challengeId: challenge.id,
        expiresAt: challenge.expiresAt.toISOString(),
        channel,
        maskedMobile: channel === "sms" ? maskMobileNumber(user.mobile) : void 0,
        maskedEmail: channel === "email" ? maskEmailAddress(user.email) : void 0
      });
    } catch (error) {
      if (error instanceof z5.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid request" });
      }
      authLog2.error("[auth] Password reset request failed", error);
      res.status(500).json({ message: "Failed to issue reset code" });
    }
  });
  router8.post("/password-reset/verify", authRateLimiter, async (req, res) => {
    try {
      const { challengeId, otp, newPassword } = passwordResetVerifySchema.parse(req.body ?? {});
      await ensurePasswordResetTable();
      const [challenge] = await db.select().from(passwordResetChallenges).where(eq28(passwordResetChallenges.id, challengeId)).limit(1);
      if (!challenge) {
        return res.status(400).json({ message: "Reset code expired. Please start again." });
      }
      if (challenge.consumedAt) {
        return res.status(400).json({ message: "Reset code already used. Please request a new one." });
      }
      const now = /* @__PURE__ */ new Date();
      if (challenge.expiresAt < now) {
        await db.delete(passwordResetChallenges).where(eq28(passwordResetChallenges.id, challengeId));
        return res.status(400).json({ message: "Reset code expired. Please request a new one." });
      }
      const user = await storage.getUser(challenge.userId);
      if (!user || !user.isActive) {
        return res.status(404).json({ message: "Account unavailable" });
      }
      const otpMatch = await bcrypt6.compare(otp, challenge.otpHash);
      if (!otpMatch) {
        return res.status(400).json({ message: "Incorrect reset code" });
      }
      const hashedPassword = await bcrypt6.hash(newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword });
      await db.update(passwordResetChallenges).set({ consumedAt: /* @__PURE__ */ new Date() }).where(eq28(passwordResetChallenges.id, challengeId));
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z5.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid reset request" });
      }
      authLog2.error("[auth] Password reset verify failed", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });
  router8.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
  router8.get("/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userResponse = formatUserForResponse(user);
    res.json({ user: userResponse });
  });
  router8.patch("/users/me/services", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { enabledServices } = req.body;
      if (!Array.isArray(enabledServices) || !enabledServices.every((s) => typeof s === "string")) {
        return res.status(400).json({ message: "enabledServices must be an array of strings" });
      }
      if (enabledServices.length === 0) {
        return res.status(400).json({ message: "At least one service must be enabled" });
      }
      const validServices = ["homestay", "adventure_sports", "rafting", "camping", "paragliding", "hotel", "tour_operator", "trekking"];
      const invalidServices = enabledServices.filter((s) => !validServices.includes(s));
      if (invalidServices.length > 0) {
        return res.status(400).json({ message: `Invalid services: ${invalidServices.join(", ")}` });
      }
      await db.update(users).set({ enabledServices, updatedAt: /* @__PURE__ */ new Date() }).where(eq28(users.id, userId));
      res.json({ message: "Service preferences updated", enabledServices });
    } catch (error) {
      authLog2.error("[auth] Failed to update service preferences:", error);
      res.status(500).json({ message: "Failed to update service preferences" });
    }
  });
  return router8;
}
function createProfileRouter() {
  const router8 = express13.Router();
  router8.get("/", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const [profile] = await db.select().from(userProfiles).where(eq28(userProfiles.userId, userId)).limit(1);
      if (!profile) {
        return res.json(null);
      }
      res.json(profile);
    } catch (error) {
      authLog2.error("[profile] Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  router8.post("/", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const profileData = insertUserProfileSchema.parse(req.body);
      const [existingProfile] = await db.select().from(userProfiles).where(eq28(userProfiles.userId, userId)).limit(1);
      let profile;
      if (existingProfile) {
        [profile] = await db.update(userProfiles).set({
          ...profileData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq28(userProfiles.userId, userId)).returning();
      } else {
        [profile] = await db.insert(userProfiles).values({
          ...profileData,
          userId
        }).returning();
      }
      const normalizedEmail = typeof profileData.email === "string" && profileData.email.trim().length > 0 ? profileData.email.trim() : null;
      const normalizedAadhaar = typeof profileData.aadhaarNumber === "string" && profileData.aadhaarNumber.trim().length > 0 ? profileData.aadhaarNumber.trim() : null;
      await db.update(users).set({
        fullName: profileData.fullName,
        mobile: profileData.mobile,
        email: normalizedEmail,
        aadhaarNumber: normalizedAadhaar ?? null,
        district: profileData.district || null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq28(users.id, userId));
      res.json({
        profile,
        message: existingProfile ? "Profile updated successfully" : "Profile created successfully"
      });
    } catch (error) {
      authLog2.error("[profile] Error saving profile:", error);
      if (error instanceof z5.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to save profile" });
    }
  });
  return router8;
}

// server/routes/auth/hpsso.ts
init_db();
init_schema();
import { Router as Router3 } from "express";
import { z as z6 } from "zod";
import { eq as eq29 } from "drizzle-orm";

// server/services/hpsso.ts
init_logger();
import crypto6 from "crypto";
var log14 = logger.child({ module: "hpsso" });
function getHPSSOConfig() {
  return {
    enabled: process.env.HPSSO_ENABLED === "true",
    preProductionUrl: process.env.HPSSO_PREPROD_URL || "",
    productionUrl: process.env.HPSSO_PROD_URL || "",
    serviceId: process.env.HPSSO_SERVICE_ID || "",
    secretKey: process.env.HPSSO_SECRET_KEY || "",
    environment: process.env.HPSSO_ENVIRONMENT || "pre-production",
    staffServiceId: process.env.HPSSO_STAFF_SERVICE_ID || "",
    staffSecretKey: process.env.HPSSO_STAFF_SECRET_KEY || ""
  };
}
function getHPSSOBaseUrl() {
  const config2 = getHPSSOConfig();
  return config2.environment === "production" ? config2.productionUrl : config2.preProductionUrl;
}
function encryptForHPSSO(data, passphrase) {
  try {
    const salt = crypto6.randomBytes(8);
    const { key, iv } = deriveKeyAndIV(passphrase, salt, 32, 16);
    const cipher = crypto6.createCipheriv("aes-256-cbc", key, iv);
    const jsonData = JSON.stringify(data);
    const encrypted = Buffer.concat([cipher.update(jsonData, "utf8"), cipher.final()]);
    const saltedBuffer = Buffer.concat([
      Buffer.from("Salted__", "utf8"),
      salt,
      encrypted
    ]);
    return saltedBuffer.toString("base64");
  } catch (error) {
    log14.error({ err: error }, "Failed to encrypt data for HP SSO");
    throw new Error("Encryption failed");
  }
}
function decryptFromHPSSO(encryptedData, key) {
  try {
    if (encryptedData.startsWith("U2FsdGVk")) {
      return decryptOpenSSLFormat(encryptedData, key);
    }
    const [ivBase64, encrypted] = encryptedData.split(":");
    if (!ivBase64 || !encrypted) {
      throw new Error("Invalid encrypted data format");
    }
    const iv = Buffer.from(ivBase64, "base64");
    const derivedKey = crypto6.createHash("sha256").update(key).digest();
    const decipher = crypto6.createDecipheriv("aes-256-cbc", derivedKey, iv);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    log14.error({ err: error }, "Failed to decrypt data from HP SSO");
    throw new Error("Decryption failed");
  }
}
function decryptOpenSSLFormat(encryptedData, passphrase) {
  try {
    const data = Buffer.from(encryptedData, "base64");
    const saltedPrefix = data.subarray(0, 8).toString("utf8");
    if (saltedPrefix !== "Salted__") {
      throw new Error("Invalid OpenSSL format - missing Salted__ prefix");
    }
    const salt = data.subarray(8, 16);
    const encrypted = data.subarray(16);
    const { key, iv } = deriveKeyAndIV(passphrase, salt, 32, 16);
    const decipher = crypto6.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString("utf8"));
  } catch (error) {
    log14.error({ err: error }, "Failed to decrypt OpenSSL format");
    throw error;
  }
}
function deriveKeyAndIV(passphrase, salt, keyLength, ivLength) {
  const totalLength = keyLength + ivLength;
  const derivedBytes = [];
  let derivedLength = 0;
  let previousHash = Buffer.alloc(0);
  while (derivedLength < totalLength) {
    const hash2 = crypto6.createHash("md5");
    hash2.update(previousHash);
    hash2.update(passphrase);
    hash2.update(salt);
    previousHash = hash2.digest();
    derivedBytes.push(previousHash);
    derivedLength += previousHash.length;
  }
  const derived = Buffer.concat(derivedBytes);
  return {
    key: derived.subarray(0, keyLength),
    iv: derived.subarray(keyLength, keyLength + ivLength)
  };
}
async function validateHPSSOToken(token) {
  const config2 = getHPSSOConfig();
  if (!config2.enabled) {
    throw new Error("HP SSO is not enabled");
  }
  if (!config2.serviceId || !config2.secretKey) {
    throw new Error("HP SSO credentials not configured");
  }
  const baseUrl = getHPSSOBaseUrl();
  if (!baseUrl) {
    throw new Error("HP SSO URL not configured");
  }
  try {
    const encryptedData = encryptForHPSSO(
      { token, secret_key: config2.secretKey },
      config2.secretKey
    );
    const response = await fetch(`${baseUrl}/nodeapi/validateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: encryptedData,
        service_id: config2.serviceId
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      log14.error({ status: response.status, body: errorBody }, "HP SSO token validation failed");
      throw new Error(`HP SSO validation failed: ${response.status}`);
    }
    const result = await response.json();
    if (result.data) {
      const userData = decryptFromHPSSO(result.data, config2.secretKey);
      log14.info({ sso_id: userData.sso_id }, "HP SSO token validated successfully");
      return userData;
    }
    throw new Error("Invalid response from HP SSO");
  } catch (error) {
    log14.error({ err: error }, "HP SSO token validation error");
    throw error;
  }
}
async function validateStaffToken(token) {
  const config2 = getHPSSOConfig();
  if (!config2.enabled) {
    throw new Error("HP SSO is not enabled");
  }
  if (!config2.staffServiceId || !config2.staffSecretKey) {
    throw new Error("HP SSO Staff credentials not configured");
  }
  const baseUrl = getHPSSOBaseUrl();
  if (!baseUrl) {
    throw new Error("HP SSO URL not configured");
  }
  try {
    log14.info({ token: token.substring(0, 10) + "..." }, "Validating Staff Token via Node API");
    const encryptedData = encryptForHPSSO(
      { token, secret_key: config2.staffSecretKey },
      // Use Staff Secret Key
      config2.staffSecretKey
    );
    const response = await fetch(`${baseUrl}/nodeapi/validateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: encryptedData,
        service_id: config2.staffServiceId
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      log14.error({ status: response.status, body: errorBody }, "HP SSO Staff validation failed");
      throw new Error(`HP SSO Staff validation failed: ${response.status}`);
    }
    const result = await response.json();
    if (!result.data) {
      throw new Error(result.message || "Invalid response from HP SSO Staff API");
    }
    const decryptedRaw = decryptFromHPSSO(result.data, config2.staffSecretKey);
    let assignments;
    try {
      const parsed2 = JSON.parse(decryptedRaw);
      if (Array.isArray(parsed2)) {
        assignments = parsed2;
      } else {
        assignments = [parsed2];
      }
    } catch (e) {
      throw new Error("Failed to parse decrypted staff data");
    }
    if (!assignments || assignments.length === 0) {
      throw new Error("No staff assignments found in SSO response");
    }
    log14.info({
      empId: assignments[0].empId,
      desig: assignments[0].desigName,
      office: assignments[0].officeName
    }, "HP SSO Staff verified successfully");
    return assignments[0];
  } catch (error) {
    log14.error({ err: error }, "HP SSO Staff token validation error");
    throw error;
  }
}
async function checkHPSSOHealth() {
  const config2 = getHPSSOConfig();
  if (!config2.enabled) {
    return { configured: false, reachable: false, environment: "disabled" };
  }
  const hasCredentials = !!(config2.serviceId && config2.secretKey);
  const hasUrl = !!getHPSSOBaseUrl();
  let reachable = false;
  if (hasUrl) {
    try {
      const baseUrl = getHPSSOBaseUrl();
      const response = await fetch(baseUrl, { method: "HEAD" });
      reachable = response.ok || response.status === 405;
    } catch {
      reachable = false;
    }
  }
  return {
    configured: hasCredentials && hasUrl,
    reachable,
    environment: config2.environment
  };
}

// server/routes/auth/hpsso.ts
init_logger();
var log15 = logger.child({ module: "hpsso-routes" });
var hpssoRouter = Router3();
var validateTokenSchema = z6.object({
  token: z6.string().min(1, "Token is required"),
  type: z6.enum(["citizen", "staff"]).optional().default("citizen")
});
var linkAccountSchema = z6.object({
  sso_id: z6.number(),
  existing_user_id: z6.string().uuid().optional()
});
hpssoRouter.get("/config", (req, res) => {
  const config2 = getHPSSOConfig();
  res.json({
    enabled: config2.enabled,
    environment: config2.environment,
    loginScriptUrl: config2.enabled ? `${getHPSSOBaseUrl()}/nodeapi/iframe/iframe.js` : null,
    serviceId: config2.enabled ? config2.serviceId : null,
    staffServiceId: config2.enabled ? config2.staffServiceId : null
  });
});
hpssoRouter.get("/health", async (req, res) => {
  try {
    const health = await checkHPSSOHealth();
    res.json(health);
  } catch (error) {
    log15.error({ err: error }, "HP SSO health check failed");
    res.status(500).json({ error: "Health check failed" });
  }
});
hpssoRouter.get("/validate-json", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: "Token required" });
    const ssoUserData = await validateHPSSOToken(token);
    log15.info({ sso_id: ssoUserData.sso_id }, "Manual token validation success");
    let existingUser = null;
    if (ssoUserData.mobile) {
      const usersFound = await db.select().from(users).where(eq29(users.mobile, ssoUserData.mobile)).limit(1);
      if (usersFound.length > 0) existingUser = usersFound[0];
    }
    res.json({
      success: true,
      sso_data: {
        sso_id: ssoUserData.sso_id,
        name: ssoUserData.name,
        mobile: ssoUserData.mobile,
        email: ssoUserData.email,
        district: ssoUserData.dist,
        state: ssoUserData.state,
        address: ssoUserData.loc
      },
      existing_user: existingUser ? { id: existingUser.id, username: existingUser.username } : null,
      action: existingUser ? "link_required" : "register"
    });
  } catch (error) {
    log15.error({ err: error }, "Token validation failed");
    res.status(500).json({ error: error instanceof Error ? error.message : "Validation failed" });
  }
});
hpssoRouter.all("/callback", async (req, res) => {
  try {
    const isFormPost = req.is("application/x-www-form-urlencoded");
    const rawToken = req.body.token || req.query.token;
    const rawType = req.body.type || req.query.type || "citizen";
    const validation = validateTokenSchema.safeParse({ token: rawToken, type: rawType });
    if (!validation.success) {
      const errorMsg = "Invalid request: " + validation.error.errors.map((e) => e.message).join(", ");
      return res.status(400).send(`<html><body><h3>SSO Error: ${errorMsg}</h3></body></html>`);
    }
    const { token, type } = validation.data;
    let ssoUserData;
    let isStaff = false;
    if (type === "staff") {
      isStaff = true;
      const staffData = await validateStaffToken(token);
      ssoUserData = {
        sso_id: 0,
        vault_id: 0,
        username: staffData.emailId || staffData.employeeName,
        name: staffData.employeeName,
        mobile: "",
        email: staffData.emailId,
        gender: "Other",
        dob: "",
        co: "",
        street: "",
        lm: "",
        loc: staffData.officeName,
        vtc: staffData.officeTypeName,
        dist: "",
        state: "Himachal Pradesh",
        pc: "",
        aadhaarNumber: "",
        UsersArray: [],
        education: [],
        WorkExperience: [],
        Skills: []
      };
      ssoUserData.sso_id = staffData.empId;
      log15.info({
        empId: staffData.empId,
        role: staffData.desigName
      }, "HP SSO Staff login verified");
    } else {
      ssoUserData = await validateHPSSOToken(token);
      log15.info({
        sso_id: ssoUserData.sso_id,
        mobile: ssoUserData.mobile?.slice(-4)
      }, "HP SSO callback received");
    }
    const existingUserBySSOId = await db.select().from(users).where(eq29(users.ssoId, ssoUserData.sso_id.toString())).limit(1);
    if (existingUserBySSOId.length > 0) {
      const user = existingUserBySSOId[0];
      if (isStaff) {
        if (!user.mobile) {
          const errorMsg = "Staff account has no mobile number for OTP.";
          if (isFormPost) {
            return res.send(`<html><body><h3>Login Failed: ${errorMsg}</h3></body></html>`);
          }
          return res.status(400).json({ error: errorMsg });
        }
        const challenge = await createLoginOtpChallenge(user, "sms");
        const otpPayload = {
          success: true,
          action: "otp_required",
          challengeId: challenge.id,
          maskedMobile: maskMobileNumber(user.mobile),
          expiresAt: challenge.expiresAt,
          message: "Please enter the OTP sent to your registered mobile number."
        };
        if (isFormPost) {
          return res.send(`
                        <html>
                        <body>
                        <script>
                            if (window.parent) {
                                window.parent.postMessage(${JSON.stringify(otpPayload)}, '*');
                            }
                        </script>
                        <h3>Verification Required. Sending OTP...</h3>
                        </body>
                        </html>
                    `);
        }
        return res.json(otpPayload);
      }
      await invalidateExistingSessions(user.id);
      req.session.userId = user.id;
      req.session.role = user.role;
      const responsePayload = {
        success: true,
        action: "login",
        token,
        // Pass token back for consistency if needed by frontend handler
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      };
      return res.send(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                    <h3>Login Successful</h3>
                    <p>Redirecting you to the dashboard...</p>
                    <p><a href="/dashboard">Click here if not redirected automatically</a></p>
                </div>
                <script>
                    try {
                        // Send success message to parent window if in iframe
                        // Accessing window.parent property can throw cross-origin error, so we try-catch
                        var inIframe = false;
                        try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                        if (inIframe) {
                            window.parent.postMessage(${JSON.stringify(responsePayload)}, '*');
                        } else {
                            // Mobile/Direct: Redirect to dashboard
                            // Use replace to avoid back-button loops
                            window.location.replace('/dashboard');
                        }
                    } catch(e) {
                         window.location.replace('/dashboard');
                    }
                </script>
                </body>
                </html>
            `);
      return res.redirect("/dashboard");
    }
    let existingUserToLink;
    if (ssoUserData.mobile) {
      const existing = await db.select().from(users).where(eq29(users.mobile, ssoUserData.mobile)).limit(1);
      if (existing.length > 0) existingUserToLink = existing[0];
    } else if (ssoUserData.email && isStaff) {
      const existing = await db.select().from(users).where(eq29(users.email, ssoUserData.email)).limit(1);
      if (existing.length > 0) existingUserToLink = existing[0];
    }
    const linkPayload = {
      success: true,
      action: "link_required",
      sso_data: {
        sso_id: ssoUserData.sso_id,
        name: ssoUserData.name,
        mobile: ssoUserData.mobile,
        email: ssoUserData.email,
        district: ssoUserData.dist
      },
      existing_user: existingUserToLink ? {
        id: existingUserToLink.id,
        username: existingUserToLink.username,
        fullName: existingUserToLink.fullName
      } : null,
      message: existingUserToLink ? `An account with this ${ssoUserData.mobile ? "mobile number" : "email"} already exists. Would you like to link it?` : "Account linking required",
      // One-time token for secure public linking (encoded SSO data)
      link_token: Buffer.from(JSON.stringify({
        sso_id: ssoUserData.sso_id,
        user_id: existingUserToLink?.id,
        exp: Date.now() + 10 * 60 * 1e3
        // 10 minute expiry
      })).toString("base64")
    };
    const encodedData = encodeURIComponent(JSON.stringify(linkPayload));
    return res.send(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                    <h3>Account Found</h3>
                    <p>Redirecting you to start account linking...</p>
                    <p><a href="/sso-link?data=${encodedData}">Click here if not redirected automatically</a></p>
                </div>
                <script>
                    try {
                        var inIframe = false;
                        try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                        if (inIframe) {
                            window.parent.postMessage(${JSON.stringify(linkPayload)}, '*');
                        } else {
                            // Mobile/Direct: Redirect to link page
                            window.location.replace('/sso-link?data=${encodedData}');
                        }
                    } catch(e) {
                         window.location.replace('/sso-link?data=${encodedData}');
                    }
                </script>
                </body>
                </html>
            `);
    if (existingUserToLink) {
      const encodedData2 = encodeURIComponent(JSON.stringify(linkPayload));
      return res.redirect(`/sso-link?data=${encodedData2}`);
    }
    log15.info({ sso_id: ssoUserData.sso_id }, "VERSION v6: Redirecting new user to registration with DATA");
    const registerPayload = {
      success: true,
      action: "register",
      token,
      sso_data: {
        sso_id: ssoUserData.sso_id,
        name: ssoUserData.name,
        mobile: ssoUserData.mobile,
        email: ssoUserData.email,
        gender: ssoUserData.gender,
        dob: ssoUserData.dob,
        guardian_name: ssoUserData.co,
        address: formatAddress(ssoUserData),
        district: ssoUserData.dist,
        state: ssoUserData.state,
        pincode: ssoUserData.pc,
        aadhaar_verified: true
      },
      message: "Please complete your registration"
    };
    const encodedRegisterData = encodeURIComponent(JSON.stringify(registerPayload));
    return res.send(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body>
            <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                <h3>Registration Required</h3>
                <p>Redirecting you to registration form...</p>
                <p><a href="/auth/hpsso-register-v2?data=${encodedRegisterData}">Click here if not redirected automatically</a></p>
            </div>
            <script>
                try {
                    var inIframe = false;
                    try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                    if (inIframe) {
                        window.parent.postMessage(${JSON.stringify(registerPayload)}, '*');
                    } else {
                        // Mobile/Direct: Redirect to registration with DATA
                        window.location.replace('/auth/hpsso-register-v2?data=${encodedRegisterData}');
                    }
                } catch(e) {
                     window.location.replace('/auth/hpsso-register-v2?data=${encodedRegisterData}');
                }
            </script>
            </body>
            </html>
        `);
    if (req.method === "GET") {
      const encodedRegisterData2 = encodeURIComponent(JSON.stringify(registerPayload));
      return res.redirect(`/auth/hpsso-register-v2?data=${encodedRegisterData2}`);
    }
    return res.json(registerPayload);
  } catch (error) {
    log15.error({ err: error }, "HP SSO callback error");
    const errorPayload = {
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error"
    };
    return res.status(500).send(`
            <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                    <h3>Authentication Failed</h3>
                    <p>${errorPayload.message}</p>
                    <p><a href="/auth/login">Back to Login</a></p>
                </body>
            </html>
        `);
  }
});
hpssoRouter.post("/link", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const validation = linkAccountSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: validation.error.errors
      });
    }
    const { sso_id } = validation.data;
    await db.update(users).set({
      ssoId: sso_id.toString(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq29(users.id, req.session.userId));
    log15.info({
      userId: req.session.userId,
      sso_id
    }, "Account linked to HP SSO");
    res.json({
      success: true,
      message: "Account linked successfully"
    });
  } catch (error) {
    log15.error({ err: error }, "HP SSO link error");
    res.status(500).json({ error: "Failed to link account" });
  }
});
hpssoRouter.post("/link-public", async (req, res) => {
  try {
    const { sso_id, existing_user_id, link_token } = req.body;
    if (!link_token || !sso_id || !existing_user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let tokenData;
    try {
      tokenData = JSON.parse(Buffer.from(link_token, "base64").toString("utf8"));
    } catch {
      return res.status(401).json({ error: "Invalid link token" });
    }
    if (Date.now() > tokenData.exp) {
      return res.status(401).json({ error: "Link token expired. Please try logging in again." });
    }
    if (tokenData.sso_id !== sso_id || tokenData.user_id !== existing_user_id) {
      return res.status(401).json({ error: "Token mismatch" });
    }
    await db.update(users).set({
      ssoId: sso_id.toString(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq29(users.id, existing_user_id));
    await invalidateExistingSessions(existing_user_id);
    req.session.userId = existing_user_id;
    const user = await db.select().from(users).where(eq29(users.id, existing_user_id)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    req.session.role = user[0].role;
    log15.info({
      userId: existing_user_id,
      sso_id
    }, "Account linked via public endpoint");
    res.json({
      success: true,
      message: "Account linked successfully",
      user: {
        id: user[0].id,
        username: user[0].username,
        fullName: user[0].fullName,
        role: user[0].role
      }
    });
  } catch (error) {
    log15.error({ err: error }, "HP SSO public link error");
    res.status(500).json({ error: "Failed to link account" });
  }
});
hpssoRouter.get("/status", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.json({ linked: false, authenticated: false });
    }
    const user = await db.select({ ssoId: users.ssoId }).from(users).where(eq29(users.id, req.session.userId)).limit(1);
    const linked = user.length > 0 && !!user[0].ssoId;
    res.json({
      linked,
      authenticated: true
    });
  } catch (error) {
    log15.error({ err: error }, "HP SSO status check error");
    res.status(500).json({ error: "Status check failed" });
  }
});
function formatAddress(data) {
  const parts = [
    data.street,
    data.lm,
    data.loc,
    data.vtc,
    data.dist,
    data.state,
    data.pc ? `PIN: ${data.pc}` : null
  ].filter(Boolean);
  return parts.join(", ");
}

// server/routes/test-runner.ts
init_db();
init_schema();
import { Router as Router4 } from "express";
import { eq as eq30 } from "drizzle-orm";

// shared/constants.ts
var APP_CONSTANTS = {
  // Application Rules
  MAX_ROOMS_PER_UNIT: 6,
  // 2025 Rules: Homestay unit max capacity (verified with schema)
  MAX_BEDS_TOTAL: 12,
  // 2025 Rules: Max beds across all rooms
  // File Uploads
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
  // Rate Limiting
  RATE_LIMIT_GLOBAL: 1e3
  // requests per 15 min
};
var APPLICATION_STATUSES = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  DOCUMENT_VERIFICATION: "document_verification",
  CLARIFICATION_REQUESTED: "clarification_requested",
  SITE_INSPECTION_SCHEDULED: "site_inspection_scheduled",
  SITE_INSPECTION_COMPLETE: "site_inspection_complete",
  PAYMENT_PENDING: "payment_pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVERTED: "reverted"
};

// server/routes/test-runner.ts
import { nanoid as nanoid2 } from "nanoid";
import fs9 from "fs/promises";
import path9 from "path";
import { hash } from "bcrypt";
import { randomUUID as randomUUID3 } from "crypto";
var router2 = Router4();
router2.use((req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const isEnabled = process.env.ENABLE_TEST_RUNNER === "true";
  if (isProd && !isEnabled) {
    console.warn("\u26D4\uFE0F Blocked Test Runner access in Production");
    return res.status(403).json({ error: "Test Runner is DISABLED in Production environment." });
  }
  next();
});
function generateDummyApplication(district, tehsil, ownerId, index2) {
  const timestamp2 = Date.now();
  const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
  const appNumber = `TEST-${district.substring(0, 3).toUpperCase()}-${timestamp2}-${randomSuffix}`;
  return {
    userId: ownerId,
    applicationNumber: appNumber,
    applicationKind: "new_registration",
    propertyName: `TEST Homestay ${district} ${index2 + 1}`,
    category: "gold",
    locationType: "gm",
    // gram panchayat
    totalRooms: 3,
    // Address
    district,
    tehsil: tehsil || "Test Tehsil",
    // Use provided or default
    address: "Test Address Line 1",
    pincode: "171001",
    // Owner
    ownerName: "Test Owner",
    ownerGender: "male",
    ownerMobile: "9999999999",
    ownerAadhaar: "999999999999",
    // Status
    status: APPLICATION_STATUSES.DRAFT,
    currentStage: "document_upload",
    // Fee
    baseFee: "500.00",
    totalFee: "500.00",
    // Meta
    formCompletionTimeSeconds: 0,
    projectType: "homestay",
    propertyArea: "250.00",
    attachedWashrooms: 3
  };
}
router2.post("/seed-applications", async (req, res) => {
  try {
    const { district, tehsil, count: count2 = 1, status = "draft", bypassPayment = false } = req.body;
    if (!district) return res.status(400).json({ error: "District is required" });
    if (count2 > 10) return res.status(400).json({ error: "Max 10 applications per batch" });
    let ownerDistrict = district;
    let ownerTehsil = tehsil || district;
    let appDistrict = district;
    if (district === "Pangi") {
      ownerDistrict = "Chamba";
      appDistrict = "Pangi";
      ownerTehsil = "Pangi";
    } else if (district === "Spiti" || district === "Kaza" || district.includes("Kaza")) {
      ownerDistrict = "Lahaul and Spiti";
      appDistrict = "Lahaul-Spiti (Kaza)";
      ownerTehsil = "Spiti";
    } else if (district === "Lahaul") {
      ownerDistrict = "Lahaul and Spiti";
      appDistrict = "Lahaul";
      ownerTehsil = "Lahaul";
    } else if (district === "Chamba" && tehsil?.toLowerCase() === "pangi") {
      ownerDistrict = "Chamba";
      appDistrict = "Pangi";
      ownerTehsil = "Pangi";
    }
    let owner = await db.query.users.findFirst({
      where: eq30(users.role, "property_owner")
    });
    if (!owner) {
      const dummyId = randomUUID3();
      const dummyPasswordHash = await hash("password123", 10);
      [owner] = await db.insert(users).values({
        id: dummyId,
        username: "test_owner",
        password: dummyPasswordHash,
        fullName: "Test Property Owner",
        email: "test_owner_unique@example.com",
        mobile: "9999999000",
        /* Changed to avoid conflict */
        role: "property_owner",
        district: ownerDistrict,
        // Assign to the requested district (Normalized)
        isActive: true,
        isVerified: true
      }).returning();
    }
    const createdApps = [];
    for (let i = 0; i < count2; i++) {
      const dummyData = generateDummyApplication(appDistrict, ownerTehsil, owner.id, i);
      if (status === "submitted") {
        dummyData.status = APPLICATION_STATUSES.SUBMITTED;
        dummyData.submittedAt = /* @__PURE__ */ new Date();
        dummyData.currentStage = "document_verification";
        if (bypassPayment) {
          dummyData.paymentStatus = "paid";
          dummyData.paymentAmount = "500.00";
          dummyData.paymentDate = /* @__PURE__ */ new Date();
          dummyData.paymentId = `TEST-PAY-${nanoid2(8)}`;
        }
      }
      await db.insert(homestayApplications).values(dummyData);
      createdApps.push(dummyData.applicationNumber);
    }
    res.json({
      success: true,
      message: `Created ${count2} applications for ${district}`,
      applications: createdApps
    });
  } catch (error) {
    console.error("Test Runner Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router2.get("/routing-stats", async (req, res) => {
  try {
    const stats = await db.select({
      district: homestayApplications.district,
      status: homestayApplications.status
    }).from(homestayApplications);
    const aggregation = {};
    stats.forEach((s) => {
      if (!aggregation[s.district]) aggregation[s.district] = {};
      if (!aggregation[s.district][s.status || "unknown"]) aggregation[s.district][s.status || "unknown"] = 0;
      aggregation[s.district][s.status || "unknown"]++;
    });
    res.json(aggregation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/preview-integration", async (req, res) => {
  try {
    const district = req.query.district || "Shimla";
    const { deriveDistrictRoutingLabel: deriveDistrictRoutingLabel2 } = await Promise.resolve().then(() => (init_districtRouting(), districtRouting_exports));
    const { resolveDistrictDdo: resolveDistrictDdo2 } = await Promise.resolve().then(() => (init_ddo(), ddo_exports));
    const { getHimKoshConfig: getHimKoshConfig2 } = await Promise.resolve().then(() => (init_config2(), config_exports));
    const config2 = getHimKoshConfig2();
    let dbDistrict = district;
    let dbTehsil = district;
    if (district.toLowerCase() === "pangi") {
      dbDistrict = "Chamba";
      dbTehsil = "Pangi";
    } else if (district.includes("Kaza") || district.toLowerCase() === "spiti") {
      dbDistrict = "Lahaul and Spiti";
      dbTehsil = "Spiti";
    } else if (district.toLowerCase() === "lahaul") {
      dbDistrict = "Lahaul and Spiti";
      dbTehsil = "Lahaul";
    }
    const routingLabel = deriveDistrictRoutingLabel2(dbDistrict, dbTehsil) || dbDistrict;
    const ddoMapping = await resolveDistrictDdo2(routingLabel, dbTehsil);
    res.json({
      district: dbDistrict,
      tehsil: dbTehsil,
      routingLabel,
      ddoCode: ddoMapping?.ddoCode || config2.ddo,
      head1: ddoMapping?.head1 || config2.heads.registrationFee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.post("/setup-integration-payment", async (req, res) => {
  try {
    const { district = "Shimla" } = req.body;
    let dbDistrict = district;
    let dbTehsil = district;
    if (district.toLowerCase() === "pangi") {
      dbDistrict = "Chamba";
      dbTehsil = "Pangi";
    } else if (district.includes("Kaza") || district.toLowerCase() === "spiti") {
      dbDistrict = "Lahaul and Spiti";
      dbTehsil = "Spiti";
    } else if (district.toLowerCase() === "lahaul") {
      dbDistrict = "Lahaul and Spiti";
      dbTehsil = "Lahaul";
    }
    let owner = await db.query.users.findFirst({
      where: eq30(users.role, "property_owner")
    });
    if (!owner) {
      const dummyId = randomUUID3();
      const dummyPasswordHash = await hash("password123", 10);
      [owner] = await db.insert(users).values({
        id: dummyId,
        username: "test_owner",
        password: dummyPasswordHash,
        fullName: "Test Property Owner",
        email: "test_owner_unique@example.com",
        mobile: "9999999000",
        role: "property_owner",
        district: dbDistrict,
        isActive: true,
        isVerified: true
      }).returning();
    }
    const timestamp2 = Date.now();
    const appNumber = `TEST-${dbDistrict.substring(0, 3).toUpperCase()}-${timestamp2}`;
    const dummyData = {
      userId: owner.id,
      applicationNumber: appNumber,
      applicationKind: "new_registration",
      propertyName: `Payment Integration Test (${district})`,
      category: "gold",
      locationType: "gm",
      totalRooms: 3,
      district: dbDistrict,
      tehsil: dbTehsil,
      // Critical for routing
      address: "Test Address Line 1",
      pincode: "171001",
      ownerName: "Test Owner",
      ownerGender: "male",
      ownerMobile: "9999999999",
      ownerAadhaar: "999999999999",
      status: APPLICATION_STATUSES.PAYMENT_PENDING,
      currentStage: "payment",
      baseFee: "500.00",
      totalFee: "500.00",
      formCompletionTimeSeconds: 0,
      projectType: "homestay",
      // REQUIRED FIELDS FOR SCHEMA VALIDATION:
      propertyArea: "100.00",
      // sq meters (Decimal)
      attachedWashrooms: 3,
      confirmed: true
    };
    const [created] = await db.insert(homestayApplications).values(dummyData).returning();
    res.json({
      success: true,
      applicationId: created.id,
      applicationNumber: created.applicationNumber,
      mapped: {
        district: dbDistrict,
        tehsil: dbTehsil
      }
    });
  } catch (error) {
    console.error("Integration Setup Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router2.get("/reports", async (req, res) => {
  try {
    const results = {
      playwright: null,
      vitest: null
    };
    const readReport = async (filename) => {
      try {
        const filePath = path9.join(process.cwd(), "test-results", filename);
        const data = await fs9.readFile(filePath, "utf-8");
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    };
    results.playwright = await readReport("playwright-report.json");
    results.vitest = await readReport("vitest-report.json");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var test_runner_default = router2;

// server/routes/payments.ts
init_middleware();
init_storage();
init_logger();
import express14 from "express";
var paymentsLog = logger.child({ module: "payments-router" });
function createPaymentsRouter() {
  const router8 = express14.Router();
  router8.post("/", requireAuth, async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.json({ payment });
    } catch (error) {
      paymentsLog.error({ err: error, route: "/" }, "Failed to create payment");
      res.status(500).json({ message: "Failed to create payment" });
    }
  });
  router8.patch("/:id", async (req, res) => {
    try {
      const payment = await storage.updatePayment(req.params.id, req.body);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json({ payment });
    } catch (error) {
      paymentsLog.error({ err: error, route: "/:id" }, "Failed to update payment");
      res.status(500).json({ message: "Failed to update payment" });
    }
  });
  router8.post("/:id/confirm", requireRole("district_officer", "state_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const payment = await storage.getPaymentById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      await storage.updatePayment(req.params.id, {
        paymentStatus: "success",
        completedAt: /* @__PURE__ */ new Date()
      });
      const application = await storage.getApplication(payment.applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const certificateNumber = `HP-HST-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Math.floor(Math.random() * 1e5)).padStart(5, "0")}`;
      const issueDate = /* @__PURE__ */ new Date();
      const expiryDate = new Date(issueDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const formatTimelineDate = (value) => value.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      await storage.updateApplication(payment.applicationId, {
        status: "approved",
        certificateNumber,
        certificateIssuedDate: issueDate,
        certificateExpiryDate: expiryDate,
        approvedAt: issueDate
      });
      if (application.parentApplicationId) {
        await storage.updateApplication(application.parentApplicationId, {
          status: "superseded",
          districtNotes: `Superseded by application ${application.applicationNumber}`
        });
      }
      await logApplicationAction({
        applicationId: payment.applicationId,
        actorId: userId,
        action: "payment_confirmed",
        previousStatus: application.status,
        newStatus: "approved",
        feedback: "Payment confirmed manually by officer."
      });
      await logApplicationAction({
        applicationId: payment.applicationId,
        actorId: userId,
        action: "certificate_issued",
        previousStatus: "approved",
        newStatus: "approved",
        feedback: `Certificate ${certificateNumber} issued on ${formatTimelineDate(issueDate)} (valid till ${formatTimelineDate(
          expiryDate
        )})`
      });
      res.json({ message: "Payment confirmed and certificate issued" });
    } catch (error) {
      paymentsLog.error({ err: error, route: "/:id/confirm" }, "Failed to confirm payment");
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });
  return router8;
}

// server/routes/dtdo.ts
init_middleware();
init_storage();
init_logger();
init_db();
init_schema();
import express15 from "express";
import { desc as desc7, and as and7, inArray as inArray3, eq as eq31, or as or3 } from "drizzle-orm";

// server/routes/core/user-handlers.ts
init_storage();
init_logger();
import { z as z7 } from "zod";
import bcrypt7 from "bcrypt";
var routeLog3 = logger.child({ module: "user-handlers" });
var staffProfileSchema = z7.object({
  fullName: z7.string().min(1, "Full name is required"),
  firstName: z7.string().optional(),
  lastName: z7.string().optional(),
  mobile: z7.string().min(10, "Mobile number is required"),
  email: z7.string().email().optional().or(z7.literal("")),
  alternatePhone: z7.string().optional(),
  designation: z7.string().optional(),
  department: z7.string().optional(),
  employeeId: z7.string().optional(),
  officeAddress: z7.string().optional(),
  officePhone: z7.string().optional(),
  signatureUrl: z7.string().optional()
});
function normalizeStringField(value, defaultValue = "", maxLength) {
  if (typeof value !== "string") return defaultValue;
  const trimmed = value.trim();
  if (maxLength && trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }
  return trimmed;
}
function toNullableString(value, maxLength) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (maxLength && trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }
  return trimmed;
}
var handleStaffProfileUpdate = async (req, res) => {
  try {
    const userId = req.session.userId;
    const payload = staffProfileSchema.parse(req.body);
    const userRecord = await storage.getUser(userId);
    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }
    const normalizedMobile = normalizeStringField(payload.mobile, "", 15);
    if (!normalizedMobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }
    if (normalizedMobile !== userRecord.mobile) {
      const existingUser = await storage.getUserByMobile(normalizedMobile);
      if (existingUser && existingUser.id !== userRecord.id) {
        return res.status(400).json({ message: "Another account already uses this mobile number" });
      }
    }
    const updates = {
      fullName: normalizeStringField(payload.fullName, userRecord.fullName, 255),
      firstName: toNullableString(payload.firstName, 100),
      lastName: toNullableString(payload.lastName, 100),
      mobile: normalizedMobile,
      email: toNullableString(payload.email, 255),
      alternatePhone: toNullableString(payload.alternatePhone, 15),
      designation: toNullableString(payload.designation, 120),
      department: toNullableString(payload.department, 120),
      employeeId: toNullableString(payload.employeeId, 50),
      officeAddress: toNullableString(payload.officeAddress, 500),
      officePhone: toNullableString(payload.officePhone, 20),
      signatureUrl: toNullableString(payload.signatureUrl)
    };
    const updatedUser = await storage.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: formatUserForResponse(updatedUser),
      message: "Profile updated successfully"
    });
  } catch (error) {
    if (error instanceof z7.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
        errors: error.errors
      });
    }
    routeLog3.error("[staff-profile] Failed to update profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
var handleStaffPasswordChange = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const userRecord = await storage.getUser(userId);
    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt7.hash(newPassword, 10);
    await storage.updateUser(userId, { password: hashedPassword });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    routeLog3.error("[staff-profile] Failed to change password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// server/routes/dtdo.ts
init_districtStaffManifest();
init_districtRouting();

// server/routes/helpers/timeline.ts
var canViewApplicationTimeline = (user, application) => {
  if (!user || !application) {
    return false;
  }
  if (user.role === "property_owner") {
    return user.id === application.userId;
  }
  return true;
};
var summarizeTimelineActor = (user) => {
  if (!user) {
    return null;
  }
  const displayName = user.fullName || user.username || user.mobile || "Officer";
  return {
    id: user.id,
    name: displayName,
    role: user.role,
    designation: user.designation ?? null,
    district: user.district ?? null
  };
};

// server/routes/dtdo.ts
init_notifications();
import { format as format2 } from "date-fns";
var routeLog4 = logger.child({ module: "dtdo-router" });
function createDtdoRouter() {
  const router8 = express15.Router();
  router8.get("/applications", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      routeLog4.info({ userId, officerDistrict: user.district, coveredDistricts }, "Fetching DTDO applications");
      const districtCondition = buildCoveredDistrictsWhereClause(homestayApplications.district, coveredDistricts);
      const allApplications = await db.select().from(homestayApplications).where(districtCondition).orderBy(desc7(homestayApplications.createdAt));
      let latestCorrectionMap = null;
      if (allApplications.length > 0) {
        const applicationIds = allApplications.map((app2) => app2.id);
        const correctionRows = await db.select({
          applicationId: applicationActions.applicationId,
          createdAt: applicationActions.createdAt,
          feedback: applicationActions.feedback
        }).from(applicationActions).where(
          and7(
            inArray3(applicationActions.applicationId, applicationIds),
            eq31(applicationActions.action, "correction_resubmitted")
          )
        ).orderBy(desc7(applicationActions.createdAt));
        latestCorrectionMap = /* @__PURE__ */ new Map();
        for (const row of correctionRows) {
          if (!latestCorrectionMap.has(row.applicationId)) {
            latestCorrectionMap.set(row.applicationId, {
              createdAt: row.createdAt ?? null,
              feedback: row.feedback ?? null
            });
          }
        }
      }
      const applicationsWithDetails = await Promise.all(
        allApplications.map(async (app2) => {
          const owner = await storage.getUser(app2.userId);
          let daName = void 0;
          const daRemarks = app2.daRemarks;
          if (daRemarks || app2.daId) {
            const da = app2.daId ? await storage.getUser(app2.daId) : null;
            daName = da?.fullName || "Unknown DA";
          }
          return {
            ...app2,
            ownerName: owner?.fullName || "Unknown",
            ownerMobile: owner?.mobile || "N/A",
            daName,
            latestCorrection: latestCorrectionMap?.get(app2.id) ?? null
          };
        })
      );
      res.json(applicationsWithDetails);
    } catch (error) {
      routeLog4.error("[dtdo] Failed to fetch applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  router8.get("/applications/incomplete", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      const districtCondition = buildCoveredDistrictsWhereClause(homestayApplications.district, coveredDistricts);
      const incompleteApplications = await db.select().from(homestayApplications).where(
        and7(
          districtCondition,
          or3(
            eq31(homestayApplications.status, "draft"),
            eq31(homestayApplications.status, "legacy_rc_draft")
          )
        )
      ).orderBy(desc7(homestayApplications.updatedAt));
      const applicationsWithOwner = await Promise.all(
        incompleteApplications.map(async (app2) => {
          const owner = await storage.getUser(app2.userId);
          return {
            ...app2,
            ownerName: owner?.fullName || "Unknown",
            ownerMobile: owner?.mobile || "N/A",
            ownerEmail: owner?.email || "N/A"
          };
        })
      );
      res.json(applicationsWithOwner);
    } catch (error) {
      routeLog4.error("[dtdo] Failed to fetch incomplete applications:", error);
      res.status(500).json({ message: "Failed to fetch incomplete applications" });
    }
  });
  router8.get("/applications/:id", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      const districtCondition = buildCoveredDistrictsWhereClause(homestayApplications.district, coveredDistricts);
      const isCovered = coveredDistricts.some((d) => districtsMatch(d, application.district));
      if (user?.district && !isCovered) {
        return res.status(403).json({ message: "You can only access applications from your district coverage area" });
      }
      const owner = await storage.getUser(application.userId);
      const documents4 = await storage.getDocumentsByApplication(req.params.id);
      let daInfo = null;
      if (application.daId) {
        const da = await storage.getUser(application.daId);
        daInfo = da ? { fullName: da.fullName, mobile: da.mobile } : null;
      }
      const correctionHistory = await db.select({
        id: applicationActions.id,
        createdAt: applicationActions.createdAt,
        feedback: applicationActions.feedback
      }).from(applicationActions).where(
        and7(
          eq31(applicationActions.applicationId, req.params.id),
          eq31(applicationActions.action, "correction_resubmitted")
        )
      ).orderBy(desc7(applicationActions.createdAt));
      res.json({
        application,
        owner: owner ? {
          fullName: owner.fullName,
          mobile: owner.mobile,
          email: owner.email
        } : null,
        documents: documents4,
        daInfo,
        correctionHistory
      });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to fetch application details:", error);
      res.status(500).json({ message: "Failed to fetch application details" });
    }
  });
  router8.post("/applications/:id/accept", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { remarks, inspectionDate, assignedTo } = req.body;
      const trimmedRemarks = typeof remarks === "string" ? remarks.trim() : "";
      if (!trimmedRemarks) {
        return res.status(400).json({ message: "Remarks are required when scheduling an inspection." });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      if (application.status !== "forwarded_to_dtdo" && application.status !== "dtdo_review") {
        return res.status(400).json({ message: "Application is not in the correct status for DTDO review" });
      }
      const isServiceRequest = application.applicationKind === "delete_rooms" || application.applicationKind === "cancel_certificate" || application.serviceContext?.requestedDeletions && application.serviceContext.requestedDeletions.length > 0 || application.serviceContext?.legacyOnboarding === true;
      if (isServiceRequest) {
        const year = (/* @__PURE__ */ new Date()).getFullYear();
        const randomSuffix = Math.floor(1e4 + Math.random() * 9e4);
        const certificateNumber = `HP-HST-${year}-${randomSuffix}`;
        const issueDate = /* @__PURE__ */ new Date();
        let expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        if (application.inheritedCertificateValidUpto) {
          expiryDate = new Date(application.inheritedCertificateValidUpto);
        }
        await storage.updateApplication(req.params.id, {
          status: "approved",
          certificateNumber,
          certificateIssuedDate: issueDate,
          certificateExpiryDate: expiryDate,
          approvedAt: issueDate,
          dtdoId: userId,
          districtNotes: trimmedRemarks || "Request accepted and approved directly (No inspection required).",
          districtOfficerId: userId,
          districtReviewDate: /* @__PURE__ */ new Date()
        });
        if (application.applicationKind === "cancel_certificate" && application.parentApplicationId) {
          await storage.updateApplication(application.parentApplicationId, {
            status: "revoked",
            districtNotes: `Certificate cancelled by request ${application.applicationNumber}`
          });
        }
        if (application.applicationKind === "delete_rooms" && application.parentApplicationId) {
          await storage.updateApplication(application.parentApplicationId, {
            status: "superseded",
            districtNotes: `Superseded by application ${application.applicationNumber}`
          });
        }
        await logApplicationAction({
          applicationId: req.params.id,
          actorId: userId,
          action: "approved",
          previousStatus: application.status,
          newStatus: "approved",
          feedback: trimmedRemarks || "Direct approval (no inspection)"
        });
        const owner = await storage.getUser(application.userId);
        queueNotification("application_approved", {
          application: { ...application, status: "approved", certificateNumber },
          owner: owner ?? null
        });
        return res.json({ message: "Request approved and processed directly (inspection skipped).", applicationId: req.params.id });
      }
      if (inspectionDate && assignedTo) {
        const parsedDate = new Date(inspectionDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ message: "Invalid inspection date format" });
        }
        const assignedUser = await storage.getUser(assignedTo);
        if (!assignedUser || assignedUser.role !== "dealing_assistant") {
          return res.status(400).json({ message: "Invalid Dealing Assistant selected" });
        }
        if (user?.district && !districtsMatch(user.district, assignedUser.district ?? "")) {
          return res.status(400).json({ message: "Selected DA is not from your district" });
        }
        await storage.updateApplication(req.params.id, {
          status: "inspection_scheduled",
          dtdoRemarks: trimmedRemarks,
          dtdoId: userId,
          dtdoReviewDate: /* @__PURE__ */ new Date(),
          inspectionDate: parsedDate,
          assignedDealingAssistantId: assignedTo,
          inspectionStatus: "pending"
        });
        await db.insert(inspectionOrders).values({
          applicationId: req.params.id,
          scheduledBy: userId,
          scheduledDate: /* @__PURE__ */ new Date(),
          assignedTo,
          assignedDate: /* @__PURE__ */ new Date(),
          inspectionDate: parsedDate,
          inspectionAddress: application.address,
          specialInstructions: trimmedRemarks,
          status: "scheduled"
        });
        await logApplicationAction({
          applicationId: req.params.id,
          actorId: userId,
          action: "inspection_scheduled",
          previousStatus: application.status,
          newStatus: "inspection_scheduled",
          feedback: `Inspection scheduled for ${parsedDate.toLocaleDateString()}. Instructions: ${trimmedRemarks}`
        });
        const owner = await storage.getUser(application.userId);
        queueNotification("inspection_scheduled", {
          application: { ...application, status: "inspection_scheduled", inspectionDate: parsedDate },
          owner: owner ?? null,
          inspectionDate: parsedDate.toISOString()
        });
        queueNotification("inspection_assigned", {
          application: { ...application, status: "inspection_scheduled", inspectionDate: parsedDate },
          assignedDA: assignedUser,
          inspectionDate: parsedDate.toISOString(),
          instructions: trimmedRemarks
        });
        return res.json({
          message: "Application accepted and inspection scheduled successfully.",
          applicationId: req.params.id,
          inspectionDate: parsedDate.toISOString()
        });
      }
      await storage.updateApplication(req.params.id, {
        status: "dtdo_review",
        dtdoRemarks: trimmedRemarks,
        dtdoId: userId,
        dtdoReviewDate: /* @__PURE__ */ new Date()
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "dtdo_accept",
        previousStatus: application.status,
        newStatus: "dtdo_review",
        feedback: trimmedRemarks
      });
      res.json({ message: "Application accepted. Proceed to schedule inspection.", applicationId: req.params.id });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to accept application:", error);
      res.status(500).json({ message: "Failed to accept application" });
    }
  });
  router8.post("/applications/:id/reject", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { remarks } = req.body;
      if (!remarks || remarks.trim().length === 0) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      await storage.updateApplication(req.params.id, {
        status: "rejected",
        dtdoRemarks: remarks,
        dtdoId: userId,
        dtdoReviewDate: /* @__PURE__ */ new Date(),
        rejectionReason: remarks
      });
      res.json({ message: "Application rejected successfully" });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to reject application:", error);
      res.status(500).json({ message: "Failed to reject application" });
    }
  });
  router8.post("/applications/:id/revert", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { remarks } = req.body;
      if (!remarks || remarks.trim().length === 0) {
        return res.status(400).json({ message: "Please specify what corrections are needed" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      const trimmedRemarks = remarks.trim();
      const currentRevertCount = application.revertCount ?? 0;
      if (currentRevertCount >= 1) {
        routeLog4.info(
          { applicationId: req.params.id, revertCount: currentRevertCount },
          "Auto-rejecting application on second DTDO revert attempt"
        );
        await storage.updateApplication(req.params.id, {
          status: "rejected",
          rejectionReason: `APPLICATION AUTO-REJECTED: Application was sent back twice. Original reason: ${trimmedRemarks}`,
          dtdoRemarks: trimmedRemarks,
          dtdoId: userId,
          dtdoReviewDate: /* @__PURE__ */ new Date(),
          revertCount: currentRevertCount + 1
        });
        await logApplicationAction({
          applicationId: req.params.id,
          actorId: userId,
          action: "auto_rejected",
          previousStatus: application.status,
          newStatus: "rejected",
          feedback: `Auto-rejected on 2nd revert. Reason: ${trimmedRemarks}`
        });
        const owner2 = await storage.getUser(application.userId);
        queueNotification("application_rejected", {
          application: { ...application, status: "rejected" },
          owner: owner2 ?? null,
          extras: { REMARKS: `Application was automatically rejected after multiple correction attempts. Reason: ${trimmedRemarks}` }
        });
        return res.json({
          message: "Application has been automatically REJECTED due to multiple send-backs",
          autoRejected: true,
          newStatus: "rejected"
        });
      }
      const revertedApplication = await storage.updateApplication(req.params.id, {
        status: "reverted_by_dtdo",
        dtdoRemarks: trimmedRemarks,
        dtdoId: userId,
        dtdoReviewDate: /* @__PURE__ */ new Date(),
        clarificationRequested: trimmedRemarks,
        revertCount: currentRevertCount + 1
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "dtdo_revert",
        previousStatus: application.status,
        newStatus: "reverted_by_dtdo",
        feedback: trimmedRemarks
      });
      const owner = await storage.getUser(application.userId);
      queueNotification("dtdo_revert", {
        application: revertedApplication ?? { ...application, status: "reverted_by_dtdo" },
        owner: owner ?? null,
        extras: { REMARKS: trimmedRemarks }
      });
      res.json({
        message: "Application reverted to applicant successfully",
        newRevertCount: currentRevertCount + 1,
        warning: "This application can only be sent back once more before automatic rejection."
      });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to revert application:", error);
      res.status(500).json({ message: "Failed to revert application" });
    }
  });
  router8.get("/applications/:id/timeline", requireAuth, async (req, res) => {
    const viewer = await storage.getUser(req.session.userId);
    if (!viewer || viewer.role !== "district_tourism_officer" && viewer.role !== "district_officer") {
      return res.status(403).json({ message: "You are not allowed to view this timeline" });
    }
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const actions = await storage.getApplicationActions(req.params.id);
      const actorIds = Array.from(
        new Set(
          actions.map((action) => action.officerId).filter((value) => Boolean(value))
        )
      );
      const actorMap = /* @__PURE__ */ new Map();
      await Promise.all(
        actorIds.map(async (actorId) => {
          const actor = await storage.getUser(actorId);
          if (actor) {
            actorMap.set(actorId, summarizeTimelineActor(actor));
          }
        })
      );
      const timeline = actions.map((action) => ({
        id: action.id,
        action: action.action,
        previousStatus: action.previousStatus ?? null,
        newStatus: action.newStatus ?? null,
        feedback: action.feedback ?? null,
        createdAt: action.createdAt,
        actor: action.officerId ? actorMap.get(action.officerId) ?? null : null
      }));
      res.json({ timeline });
    } catch (error) {
      routeLog4.error("[dtdo timeline] Failed to fetch timeline:", error);
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });
  router8.get("/available-das", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const districtCondition = buildDistrictWhereClause(users.district, user.district);
      const potentialUsers = await db.select().from(users).where(districtCondition);
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      const manifestEntries = getDistrictStaffManifest().filter((entry) => {
        return coveredDistricts.some((d) => districtsMatch(entry.districtLabel, d));
      });
      const canonicalUsernameTokens = new Set(
        manifestEntries.map((entry) => entry.da.username.trim().toLowerCase())
      );
      const canonicalMobiles = new Set(manifestEntries.map((entry) => entry.da.mobile.trim()));
      let filteredUsers = potentialUsers.filter(
        (u) => u.role === "dealing_assistant" && u.isActive !== false && // user covers the DA's district
        coveredDistricts.some((d) => districtsMatch(d, u.district ?? user.district))
      );
      if (manifestEntries.length > 0) {
        const manifestOnly = filteredUsers.filter((u) => {
          const normalizedUsername = (u.username || "").trim().toLowerCase();
          const normalizedMobile = (u.mobile || "").trim();
          return normalizedUsername && canonicalUsernameTokens.has(normalizedUsername) || normalizedMobile && canonicalMobiles.has(normalizedMobile);
        });
        if (manifestOnly.length > 0) {
          filteredUsers = manifestOnly;
        }
      }
      const das = filteredUsers.map((da) => ({
        id: da.id,
        fullName: da.fullName,
        mobile: da.mobile
      }));
      routeLog4.info("[dtdo] available-das", {
        officer: user.username,
        district: user.district,
        manifestMatches: manifestEntries.map((entry) => entry.da.username),
        options: das.map((da) => ({ id: da.id, fullName: da.fullName, mobile: da.mobile }))
      });
      res.json({ das });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to fetch DAs:", error);
      res.status(500).json({ message: "Failed to fetch available DAs" });
    }
  });
  router8.post("/schedule-inspection", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { applicationId, inspectionDate, assignedTo, specialInstructions } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!applicationId || !inspectionDate || !assignedTo) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      const isCovered = coveredDistricts.some((d) => districtsMatch(d, application.district));
      if (!isCovered) {
        return res.status(403).json({ message: "You can only process applications from your district coverage area" });
      }
      if (application.status !== "dtdo_review") {
        return res.status(400).json({ message: "Application must be accepted by DTDO before scheduling inspection" });
      }
      const assignedDaUser = await storage.getUser(assignedTo);
      const isDaCovered = assignedDaUser && assignedDaUser.district ? coveredDistricts.some((d) => districtsMatch(d, assignedDaUser.district)) : false;
      if (!assignedDaUser || assignedDaUser.role !== "dealing_assistant" || !isDaCovered) {
        return res.status(400).json({ message: "Selected DA is not available for your district coverage area" });
      }
      const newInspectionOrder = await db.insert(inspectionOrders).values({
        applicationId,
        scheduledBy: userId,
        scheduledDate: /* @__PURE__ */ new Date(),
        assignedTo,
        assignedDate: /* @__PURE__ */ new Date(),
        inspectionDate: new Date(inspectionDate),
        inspectionAddress: application.address,
        specialInstructions: specialInstructions || null,
        status: "scheduled"
      }).returning();
      routeLog4.info("[dtdo] inspection scheduled", {
        applicationId,
        applicationNumber: application.applicationNumber,
        assignedDa: assignedDaUser.username
      });
      await storage.updateApplication(applicationId, {
        status: "inspection_scheduled",
        siteInspectionScheduledDate: new Date(inspectionDate),
        siteInspectionOfficerId: assignedTo
        // DA is the officer visiting
      });
      await logApplicationAction({
        applicationId,
        actorId: userId,
        action: "inspection_scheduled",
        previousStatus: "dtdo_review",
        newStatus: "inspection_scheduled",
        feedback: `Inspection scheduled for ${inspectionDate} by ${assignedDaUser.fullName}`
      });
      const owner = await storage.getUser(application.userId);
      const notificationsToSend = [];
      notificationsToSend.push(queueNotification("inspection_scheduled", {
        application: { ...application, status: "inspection_scheduled" },
        owner: owner ?? null,
        extras: {
          INSPECTION_DATE: format2(new Date(inspectionDate), "dd MMM yyyy"),
          INSPECTION_OFFICER: assignedDaUser.fullName,
          INSPECTION_OFFICER_MOBILE: assignedDaUser.mobile
        }
      }));
      notificationsToSend.push(createInAppNotification({
        userId: assignedTo,
        title: "New Inspection Assigned",
        message: `You have been assigned an inspection for application ${application.applicationNumber} on ${format2(new Date(inspectionDate), "dd MMM yyyy")}`,
        type: "inspection_assigned",
        entityId: applicationId,
        entityType: "application",
        metadata: {
          inspectionDate,
          applicationNumber: application.applicationNumber
        }
      }));
      if (notificationsToSend.length > 0) {
        await Promise.allSettled(notificationsToSend);
      }
      res.json({ message: "Inspection scheduled successfully", inspectionOrder: newInspectionOrder[0] });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to schedule inspection:", error);
      res.status(500).json({ message: "Failed to schedule inspection" });
    }
  });
  router8.get("/inspection-report/:applicationId", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const coveredDistricts = getDistrictsCoveredBy(user.district);
      const isCovered = coveredDistricts.some((d) => districtsMatch(d, application.district));
      if (user?.district && !isCovered) {
        return res.status(403).json({ message: "You can only review applications from your district coverage area" });
      }
      const inspectionOrder = await db.select().from(inspectionOrders).where(eq31(inspectionOrders.applicationId, applicationId)).orderBy(desc7(inspectionOrders.createdAt)).limit(1);
      if (inspectionOrder.length === 0) {
        return res.status(404).json({ message: "No inspection order found" });
      }
      const report = await db.select().from(inspectionReports).where(eq31(inspectionReports.inspectionOrderId, inspectionOrder[0].id)).limit(1);
      if (report.length === 0) {
        return res.status(404).json({ message: "Inspection report not found" });
      }
      const da = await storage.getUser(report[0].submittedBy);
      const owner = await storage.getUser(application.userId);
      res.json({
        report: report[0],
        application,
        inspectionOrder: inspectionOrder[0],
        owner: owner ? {
          fullName: owner.fullName,
          mobile: owner.mobile,
          email: owner.email
        } : null,
        da: da ? {
          fullName: da.fullName,
          mobile: da.mobile
        } : null
      });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to fetch inspection report:", error);
      res.status(500).json({ message: "Failed to fetch inspection report" });
    }
  });
  router8.post("/inspection-report/:applicationId/approve", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { remarks } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      if (application.status !== "inspection_under_review") {
        return res.status(400).json({
          message: `Cannot approve inspection report. Application must be in inspection_under_review status (current: ${application.status})`
        });
      }
      const isUpfrontPaid = application.paymentStatus === "paid" || application.paymentStatus === "completed";
      if (isUpfrontPaid) {
        const year = (/* @__PURE__ */ new Date()).getFullYear();
        const randomSuffix = Math.floor(1e4 + Math.random() * 9e4);
        const certificateNumber = `HP-HST-${year}-${randomSuffix}`;
        const issueDate = /* @__PURE__ */ new Date();
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const approvedApplication = await storage.updateApplication(applicationId, {
          status: "approved",
          certificateNumber,
          certificateIssuedDate: issueDate,
          certificateExpiryDate: expiryDate,
          approvedAt: issueDate,
          dtdoId: userId,
          districtNotes: remarks || "Inspection approved. Certificate issued (payment was already completed).",
          districtOfficerId: userId,
          districtReviewDate: /* @__PURE__ */ new Date()
        });
        if (application.parentApplicationId) {
          await storage.updateApplication(application.parentApplicationId, {
            status: "superseded",
            districtNotes: `Superseded by application ${application.applicationNumber}`
          });
        }
        await logApplicationAction({
          applicationId,
          actorId: userId,
          action: "approved",
          previousStatus: application.status,
          newStatus: "approved",
          feedback: `Certificate ${certificateNumber} issued. Payment was already completed upfront.`
        });
        const paymentOwner2 = await storage.getUser(application.userId);
        queueNotification("application_approved", {
          application: approvedApplication ?? {
            ...application,
            status: "approved",
            certificateNumber
          },
          owner: paymentOwner2 ?? null
        });
        return res.json({
          message: "Application approved and certificate issued",
          certificateNumber,
          upfrontPayment: true
        });
      }
      const isLegacyRC = application.applicationNumber?.startsWith("LG-HS-");
      if (isLegacyRC) {
        const approvedApplication = await storage.updateApplication(applicationId, {
          status: "approved",
          approvedAt: /* @__PURE__ */ new Date(),
          dtdoId: userId,
          districtNotes: remarks || "Existing RC verified. Certificate issued based on existing RC details.",
          districtOfficerId: userId,
          districtReviewDate: /* @__PURE__ */ new Date()
        });
        await logApplicationAction({
          applicationId,
          actorId: userId,
          action: "approved",
          previousStatus: application.status,
          newStatus: "approved",
          feedback: `Existing RC verified. No payment required.`
        });
        const rcOwner = await storage.getUser(application.userId);
        queueNotification("application_approved", {
          application: approvedApplication ?? {
            ...application,
            status: "approved"
          },
          owner: rcOwner ?? null
        });
        return res.json({
          message: "Existing RC verification approved. Certificate issued.",
          isLegacyRC: true
        });
      }
      const verifiedApplication = await storage.updateApplication(applicationId, {
        status: "verified_for_payment",
        districtNotes: remarks || "Inspection report approved. Property meets all requirements.",
        districtOfficerId: userId,
        districtReviewDate: /* @__PURE__ */ new Date()
      });
      await logApplicationAction({
        applicationId,
        actorId: userId,
        action: "verified_for_payment",
        previousStatus: application.status,
        newStatus: "verified_for_payment",
        feedback: remarks || "Inspection report approved. Property meets all requirements."
      });
      const paymentOwner = await storage.getUser(application.userId);
      queueNotification("verified_for_payment", {
        application: verifiedApplication ?? {
          ...application,
          status: "verified_for_payment"
        },
        owner: paymentOwner ?? null
      });
      res.json({ message: "Inspection report approved successfully" });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to approve inspection report:", error);
      res.status(500).json({ message: "Failed to approve inspection report" });
    }
  });
  router8.post("/inspection-report/:applicationId/reject", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { remarks } = req.body;
      if (!remarks || remarks.trim().length === 0) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      if (application.status !== "inspection_under_review") {
        return res.status(400).json({
          message: `Cannot reject application. Application must be in inspection_under_review status (current: ${application.status})`
        });
      }
      await storage.updateApplication(applicationId, {
        status: "rejected",
        rejectionReason: remarks,
        districtNotes: remarks,
        districtOfficerId: userId,
        districtReviewDate: /* @__PURE__ */ new Date()
      });
      await logApplicationAction({
        applicationId,
        actorId: userId,
        action: "dtdo_reject",
        previousStatus: application.status,
        newStatus: "rejected",
        feedback: remarks
      });
      res.json({ message: "Application rejected successfully" });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to reject inspection report:", error);
      res.status(500).json({ message: "Failed to reject inspection report" });
    }
  });
  router8.post("/inspection-report/:applicationId/raise-objections", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { remarks } = req.body;
      if (!remarks || remarks.trim().length === 0) {
        return res.status(400).json({ message: "Please specify the objections" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      if (application.status !== "inspection_under_review") {
        return res.status(400).json({
          message: `Cannot raise objections. Application must be in inspection_under_review status (current: ${application.status})`
        });
      }
      await storage.updateApplication(applicationId, {
        status: "objection_raised",
        districtNotes: remarks,
        districtOfficerId: userId,
        districtReviewDate: /* @__PURE__ */ new Date(),
        clarificationRequested: remarks
      });
      await logApplicationAction({
        applicationId,
        actorId: userId,
        action: "objection_raised",
        previousStatus: application.status,
        newStatus: "objection_raised",
        feedback: remarks
      });
      const owner = await storage.getUser(application.userId);
      queueNotification("dtdo_objection", {
        application: { ...application, status: "objection_raised" },
        owner: owner ?? null,
        extras: { REMARKS: remarks }
      });
      res.json({ message: "Objections raised successfully" });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to raise objections:", error);
      res.status(500).json({ message: "Failed to raise objections" });
    }
  });
  router8.post("/applications/:id/approve-cancellation", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { remarks } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      if (application.applicationKind !== "cancel_certificate") {
        return res.status(400).json({ message: "This action is only for cancellation requests" });
      }
      await storage.updateApplication(req.params.id, {
        status: "certificate_cancelled",
        districtNotes: remarks || "Cancellation approved. Certificate revoked.",
        districtOfficerId: userId,
        districtReviewDate: /* @__PURE__ */ new Date(),
        approvedAt: /* @__PURE__ */ new Date(),
        certificateExpiryDate: /* @__PURE__ */ new Date()
        // Expire immediately
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "cancellation_approved",
        previousStatus: application.status,
        newStatus: "certificate_cancelled",
        feedback: remarks || "Cancellation approved"
      });
      if (application.parentApplicationId) {
        await storage.updateApplication(application.parentApplicationId, {
          status: "certificate_cancelled",
          // Revoked
          districtNotes: `Certificate revoked via cancellation request #${application.applicationNumber}. Remarks: ${remarks || "N/A"}`,
          certificateExpiryDate: /* @__PURE__ */ new Date()
          // Expire immediately
        });
        await logApplicationAction({
          applicationId: application.parentApplicationId,
          actorId: userId,
          action: "certificate_revoked",
          previousStatus: "approved",
          // Assuming it was approved
          newStatus: "certificate_cancelled",
          feedback: `Revoked via request #${application.applicationNumber}`
        });
      }
      const owner = await storage.getUser(application.userId);
      queueNotification("application_approved", {
        application: { ...application, status: "certificate_cancelled" },
        owner: owner ?? null,
        extras: { REMARKS: "Your request to cancel the Homestay Certificate has been approved. The certificate is now revoked." }
      });
      res.json({ message: "Cancellation request approved. Certificate revoked." });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to approve cancellation:", error);
      res.status(500).json({ message: "Failed to approve cancellation" });
    }
  });
  router8.patch("/profile", requireRole("district_tourism_officer", "district_officer"), handleStaffProfileUpdate);
  router8.post("/change-password", requireRole("district_tourism_officer", "district_officer"), handleStaffPasswordChange);
  router8.post("/applications/:id/approve-bypass", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { remarks } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user?.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only process applications from your district" });
      }
      const isLegacyRC = application.applicationNumber?.startsWith("LG-HS-");
      const { getSystemSettingRecord: getSystemSettingRecord2 } = await Promise.resolve().then(() => (init_systemSettings(), systemSettings_exports));
      const inspectionSetting = await getSystemSettingRecord2("inspection_config");
      const optionalKinds = inspectionSetting?.settingValue?.optionalKinds || [];
      if (!isLegacyRC && !optionalKinds.includes(application.applicationKind)) {
        return res.status(400).json({
          message: `Inspection bypass is not enabled for '${application.applicationKind}'. Please schedule an inspection.`
        });
      }
      if (application.status !== "forwarded_to_dtdo" && application.status !== "dtdo_review") {
        return res.status(400).json({ message: "Application is not in a reviewable status" });
      }
      if (application.applicationKind === "cancel_certificate") {
        await storage.updateApplication(req.params.id, {
          status: "certificate_cancelled",
          districtNotes: remarks || "Cancellation approved (Inspection Skipped). Certificate revoked.",
          districtOfficerId: userId,
          districtReviewDate: /* @__PURE__ */ new Date(),
          approvedAt: /* @__PURE__ */ new Date(),
          certificateExpiryDate: /* @__PURE__ */ new Date()
        });
        if (application.parentApplicationId) {
          await storage.updateApplication(application.parentApplicationId, {
            status: "certificate_cancelled",
            districtNotes: `Certificate revoked via cancellation request #${application.applicationNumber}. Remarks: ${remarks || "Skipped Inspection"}`,
            certificateExpiryDate: /* @__PURE__ */ new Date()
          });
          await logApplicationAction({
            applicationId: application.parentApplicationId,
            actorId: userId,
            action: "certificate_revoked",
            previousStatus: "approved",
            newStatus: "certificate_cancelled",
            feedback: `Revoked via request #${application.applicationNumber} (Inspection Skipped)`
          });
        }
        await logApplicationAction({
          applicationId: req.params.id,
          actorId: userId,
          action: "cancellation_approved_bypass",
          previousStatus: application.status,
          newStatus: "certificate_cancelled",
          feedback: remarks || "Cancellation approved without inspection"
        });
        return res.json({ message: "Cancellation approved without inspection." });
      }
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const randomSuffix = Math.floor(1e4 + Math.random() * 9e4);
      const certificateNumber = `HP-HST-${year}-${randomSuffix}`;
      const issueDate = /* @__PURE__ */ new Date();
      const expiryDate = new Date(issueDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const approvedApplication = await storage.updateApplication(req.params.id, {
        status: "approved",
        certificateNumber,
        certificateIssuedDate: issueDate,
        certificateExpiryDate: expiryDate,
        approvedAt: issueDate,
        dtdoId: userId,
        districtNotes: remarks || "Approved without inspection (Administrative Approval).",
        districtOfficerId: userId,
        districtReviewDate: /* @__PURE__ */ new Date()
      });
      if (application.parentApplicationId) {
        await storage.updateApplication(application.parentApplicationId, {
          status: "superseded",
          districtNotes: `Superseded by application ${application.applicationNumber}`
        });
      }
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "approved_bypass_inspection",
        previousStatus: application.status,
        newStatus: "approved",
        feedback: remarks || `Approved without inspection (Configurable Bypass). Certificate ${certificateNumber} issued.`
      });
      const owner = await storage.getUser(application.userId);
      queueNotification("application_approved", {
        application: approvedApplication ?? {
          ...application,
          status: "approved",
          certificateNumber
        },
        owner: owner ?? null,
        extras: { REMARKS: "Your application has been approved directly." }
      });
      res.json({ message: "Application approved without inspection", certificateNumber });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to bypass approve application:", error);
      res.status(500).json({ message: "Failed to process approval" });
    }
  });
  const ALLOWED_CORRECTION_FIELDS = [
    "propertyName",
    "guardianName",
    "address",
    "ownerGender",
    "tehsil",
    "gramPanchayat",
    "urbanBody",
    "pincode",
    "alternatePhone"
  ];
  router8.patch("/applications/:id/correct", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const { corrections, reason } = req.body;
      if (!reason || reason.trim().length < 10) {
        return res.status(400).json({
          message: "Correction reason is required (minimum 10 characters)",
          code: "REASON_REQUIRED"
        });
      }
      if (!corrections || typeof corrections !== "object" || Object.keys(corrections).length === 0) {
        return res.status(400).json({
          message: "No corrections provided",
          code: "NO_CORRECTIONS"
        });
      }
      const invalidFields = Object.keys(corrections).filter(
        (field) => !ALLOWED_CORRECTION_FIELDS.includes(field)
      );
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: `The following fields cannot be corrected by DTDO: ${invalidFields.join(", ")}`,
          code: "INVALID_FIELDS",
          invalidFields
        });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user.district && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({
          message: "You can only correct applications from your district",
          code: "DISTRICT_MISMATCH"
        });
      }
      const correctableStatuses = ["approved", "certificate_issued", "active", "completed"];
      if (!correctableStatuses.some((s) => application.status?.includes(s))) {
        return res.status(400).json({
          message: `Corrections can only be made to approved/active applications. Current status: ${application.status}`,
          code: "INVALID_STATUS"
        });
      }
      const changeLog = [];
      const sanitizedCorrections = {};
      for (const [field, newValue] of Object.entries(corrections)) {
        const fieldKey = field;
        const oldValue = application[fieldKey];
        const newValueStr = String(newValue ?? "").trim();
        if (oldValue !== newValueStr && newValueStr.length > 0) {
          changeLog.push({
            field: fieldKey,
            oldValue: oldValue ?? null,
            newValue: newValueStr
          });
          sanitizedCorrections[fieldKey] = newValueStr;
        }
      }
      if (changeLog.length === 0) {
        return res.status(400).json({
          message: "No actual changes detected",
          code: "NO_CHANGES"
        });
      }
      await storage.updateApplication(req.params.id, sanitizedCorrections);
      const auditFeedback = JSON.stringify({
        type: "dtdo_correction",
        reason: reason.trim(),
        correctedBy: {
          id: userId,
          name: user.fullName,
          role: user.role
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        changes: changeLog
      });
      await logApplicationAction({
        applicationId: req.params.id,
        actorId: userId,
        action: "dtdo_correction",
        previousStatus: application.status,
        newStatus: application.status,
        // Status doesn't change
        feedback: auditFeedback
      });
      routeLog4.info("[dtdo] Application corrected", {
        applicationId: req.params.id,
        correctedBy: userId,
        changesCount: changeLog.length
      });
      res.json({
        message: `Successfully corrected ${changeLog.length} field(s)`,
        changes: changeLog
      });
    } catch (error) {
      routeLog4.error("[dtdo] Failed to correct application:", error);
      res.status(500).json({ message: "Failed to apply corrections" });
    }
  });
  return router8;
}

// server/routes/applications/index.ts
init_middleware();
init_storage();
init_logger();
init_db();
init_schema();
init_notifications();
import express16 from "express";
import { desc as desc8, and as and8, inArray as inArray4, eq as eq32, gte as gte3, lte as lte2 } from "drizzle-orm";
import { format as format3 } from "date-fns";
var applicationsLog = logger.child({ module: "applications-router" });
function createApplicationsRouter() {
  const router8 = express16.Router();
  router8.get("/primary", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (user.role !== "property_owner") {
        return res.json({ application: null });
      }
      const applications = await storage.getApplicationsByUser(userId);
      const activeApplications = applications.filter((app2) => app2.status !== "superseded");
      res.json({ application: activeApplications[0] ?? null });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/primary" }, "Failed to fetch primary application");
      res.status(500).json({ message: "Unable to load application overview" });
    }
  });
  router8.get("/", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      let applications = [];
      if (user.role === "property_owner") {
        applications = await storage.getApplicationsByUser(userId);
        applications = applications.filter((app2) => app2.status !== "superseded");
      } else if (user.role === "district_officer" && user.district) {
        applications = await storage.getApplicationsByDistrict(user.district);
      } else if (["state_officer", "admin"].includes(user.role)) {
        applications = await storage.getAllApplications();
      }
      let latestCorrectionMap = null;
      if (applications.length > 0) {
        const applicationIds = applications.map((app2) => app2.id);
        const correctionRows = await db.select({
          applicationId: applicationActions.applicationId,
          createdAt: applicationActions.createdAt,
          feedback: applicationActions.feedback
        }).from(applicationActions).where(
          and8(
            inArray4(applicationActions.applicationId, applicationIds),
            eq32(applicationActions.action, "correction_resubmitted")
          )
        ).orderBy(desc8(applicationActions.createdAt));
        latestCorrectionMap = /* @__PURE__ */ new Map();
        for (const row of correctionRows) {
          if (!latestCorrectionMap.has(row.applicationId)) {
            latestCorrectionMap.set(row.applicationId, {
              createdAt: row.createdAt ?? null,
              feedback: row.feedback ?? null
            });
          }
        }
      }
      const enrichedApplications = latestCorrectionMap && latestCorrectionMap.size > 0 ? applications.map((application) => ({
        ...application,
        latestCorrection: latestCorrectionMap?.get(application.id) ?? null
      })) : applications;
      res.json({ applications: enrichedApplications });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/" }, "Failed to fetch applications");
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  router8.get(
    "/all",
    requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"),
    async (req, res) => {
      try {
        const userId = req.session.userId;
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
        let applications = [];
        if (["district_officer", "dealing_assistant", "district_tourism_officer"].includes(user.role)) {
          if (!user.district) {
            return res.status(400).json({ message: "District role must have an assigned district" });
          }
          applications = await db.select().from(homestayApplications).where(eq32(homestayApplications.district, user.district)).orderBy(desc8(homestayApplications.createdAt));
        } else if (["state_officer", "admin"].includes(user.role)) {
          applications = await storage.getAllApplications();
        }
        res.json(applications);
      } catch (error) {
        applicationsLog.error({ err: error, route: "/all" }, "Failed to fetch workflow applications");
        res.status(500).json({ message: "Failed to fetch applications for monitoring" });
      }
    }
  );
  router8.post(
    "/search",
    requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"),
    async (req, res) => {
      try {
        const {
          applicationNumber,
          ownerMobile,
          ownerAadhaar,
          month,
          year,
          fromDate,
          toDate,
          status,
          recentLimit
        } = req.body ?? {};
        const userId = req.session.userId;
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
        const QUICK_VIEW_LIMITS = /* @__PURE__ */ new Set([10, 20, 50]);
        let recentLimitValue;
        if (typeof recentLimit === "string" && recentLimit.trim()) {
          const parsed2 = Number(recentLimit);
          if (Number.isFinite(parsed2) && QUICK_VIEW_LIMITS.has(parsed2)) {
            recentLimitValue = parsed2;
          }
        }
        const searchConditions = [];
        if (typeof applicationNumber === "string" && applicationNumber.trim()) {
          searchConditions.push(eq32(homestayApplications.applicationNumber, applicationNumber.trim()));
        }
        if (typeof ownerMobile === "string" && ownerMobile.trim()) {
          searchConditions.push(eq32(homestayApplications.ownerMobile, ownerMobile.trim()));
        }
        if (typeof ownerAadhaar === "string" && ownerAadhaar.trim()) {
          searchConditions.push(eq32(homestayApplications.ownerAadhaar, ownerAadhaar.trim()));
        }
        if (typeof status === "string" && status.trim() && status.trim().toLowerCase() !== "all") {
          searchConditions.push(eq32(homestayApplications.status, status.trim()));
        }
        let rangeStart;
        let rangeEnd;
        if (fromDate || toDate) {
          if (fromDate) {
            const parsed2 = new Date(fromDate);
            if (!Number.isNaN(parsed2.getTime())) {
              rangeStart = parsed2;
            }
          }
          if (toDate) {
            const parsed2 = new Date(toDate);
            if (!Number.isNaN(parsed2.getTime())) {
              parsed2.setHours(23, 59, 59, 999);
              rangeEnd = parsed2;
            }
          }
        } else if (month && year) {
          const monthNum = Number(month);
          const yearNum = Number(year);
          if (Number.isInteger(monthNum) && Number.isInteger(yearNum) && monthNum >= 1 && monthNum <= 12) {
            rangeStart = new Date(yearNum, monthNum - 1, 1);
            rangeEnd = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
          }
        }
        if (rangeStart) {
          searchConditions.push(gte3(homestayApplications.createdAt, rangeStart));
        }
        if (rangeEnd) {
          searchConditions.push(lte2(homestayApplications.createdAt, rangeEnd));
        }
        if (searchConditions.length === 0 && !recentLimitValue) {
          return res.status(400).json({
            message: "Provide at least one search filter (application number, phone, Aadhaar, date range, or quick view limit)."
          });
        }
        const filters = [...searchConditions];
        if (["district_officer", "district_tourism_officer", "dealing_assistant"].includes(user.role)) {
          if (!user.district) {
            return res.status(400).json({ message: "Your profile is missing district information." });
          }
          const districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
          filters.push(districtCondition);
        }
        const whereClause = filters.length === 1 ? filters[0] : and8(...filters);
        const results = await db.select().from(homestayApplications).where(whereClause).orderBy(desc8(homestayApplications.createdAt)).limit(recentLimitValue ?? 200);
        res.json({ results });
      } catch (error) {
        applicationsLog.error({ err: error, route: "/search" }, "Failed to search applications via workflow monitor");
        res.status(500).json({ message: "Failed to search applications" });
      }
    }
  );
  router8.get("/:id", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const userId = req.session.userId;
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }
      if (currentUser.role === "property_owner" && application.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json({ application });
    } catch {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  router8.post("/:id/review", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { action, comments } = req.body;
      if (!action || !["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (user.role !== "district_officer" && user.role !== "state_officer") {
        return res.status(403).json({ message: "Only officers can review applications" });
      }
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (user.role === "district_officer" && !districtsMatch(user.district, application.district)) {
        return res.status(403).json({ message: "You can only review applications in your district" });
      }
      if (user.role === "district_officer" && application.status !== "pending") {
        return res.status(400).json({ message: "This application is not in pending status and cannot be reviewed by district officer" });
      }
      if (user.role === "state_officer" && application.status !== "state_review") {
        return res.status(400).json({ message: "This application is not in state review status and cannot be reviewed by state officer" });
      }
      const updateData = {};
      if (user.role === "district_officer") {
        updateData.districtOfficerId = user.id;
        updateData.districtReviewDate = /* @__PURE__ */ new Date();
        updateData.districtNotes = comments || null;
        if (action === "approve") {
          updateData.status = "state_review";
          updateData.currentStage = "state";
        } else {
          updateData.status = "rejected";
          updateData.rejectionReason = comments || "Rejected at district level";
        }
      } else {
        updateData.stateOfficerId = user.id;
        updateData.stateReviewDate = /* @__PURE__ */ new Date();
        updateData.stateNotes = comments || null;
        if (action === "approve") {
          updateData.status = "approved";
          updateData.approvedAt = /* @__PURE__ */ new Date();
          updateData.currentStage = "final";
        } else {
          updateData.status = "rejected";
          updateData.rejectionReason = comments || "Rejected at state level";
        }
      }
      const updated = await storage.updateApplication(id, updateData);
      res.json({ application: updated });
    } catch {
      res.status(500).json({ message: "Failed to review application" });
    }
  });
  router8.post(
    "/:id/send-back",
    requireRole("district_officer", "state_officer"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { feedback } = req.body;
        if (!feedback || feedback.trim().length < 10) {
          return res.status(400).json({ message: "Feedback is required (minimum 10 characters)" });
        }
        const user = await storage.getUser(req.session.userId);
        if (!user || user.role !== "district_officer" && user.role !== "state_officer") {
          return res.status(403).json({ message: "Only officers can send back applications" });
        }
        const application = await storage.getApplication(id);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        const updated = await storage.updateApplication(id, {
          status: "sent_back_for_corrections",
          clarificationRequested: feedback
        });
        res.json({ application: updated, message: "Application sent back to applicant" });
      } catch (error) {
        applicationsLog.error({ err: error, route: "/:id/send-back" }, "Send back error");
        res.status(500).json({ message: "Failed to send back application" });
      }
    }
  );
  router8.post(
    "/:id/move-to-inspection",
    requireRole("district_officer", "state_officer"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { scheduledDate, notes } = req.body;
        const user = await storage.getUser(req.session.userId);
        if (!user || user.role !== "district_officer" && user.role !== "state_officer") {
          return res.status(403).json({ message: "Only officers can schedule inspections" });
        }
        const application = await storage.getApplication(id);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        const updated = await storage.updateApplication(id, {
          status: "site_inspection_scheduled",
          currentStage: "site_inspection",
          siteInspectionScheduledDate: scheduledDate ? new Date(scheduledDate) : /* @__PURE__ */ new Date(),
          siteInspectionOfficerId: user.id,
          siteInspectionNotes: notes
        });
        await logApplicationAction({
          applicationId: id,
          actorId: user.id,
          action: "inspection_scheduled",
          previousStatus: application.status,
          newStatus: "site_inspection_scheduled",
          feedback: notes || void 0
        });
        const inspectionOwner = await storage.getUser(application.userId);
        const inspectionDate = scheduledDate ? format3(new Date(scheduledDate), "dd MMM yyyy") : updated?.siteInspectionScheduledDate ? format3(new Date(updated.siteInspectionScheduledDate), "dd MMM yyyy") : "";
        queueNotification("inspection_scheduled", {
          application: updated,
          owner: inspectionOwner ?? null,
          extras: {
            INSPECTION_DATE: inspectionDate
          }
        });
        res.json({ application: updated, message: "Site inspection scheduled" });
      } catch (error) {
        applicationsLog.error({ err: error, route: "/:id/move-to-inspection" }, "Move to inspection error");
        res.status(500).json({ message: "Failed to schedule inspection" });
      }
    }
  );
  router8.post(
    "/:id/complete-inspection",
    requireRole("district_officer", "state_officer"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { outcome, findings, notes } = req.body;
        const user = await storage.getUser(req.session.userId);
        if (!user || user.role !== "district_officer" && user.role !== "state_officer") {
          return res.status(403).json({ message: "Only officers can complete inspections" });
        }
        const application = await storage.getApplication(id);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        if (!["approved", "corrections_needed", "rejected"].includes(outcome)) {
          return res.status(400).json({ message: "Invalid inspection outcome" });
        }
        if ((outcome === "corrections_needed" || outcome === "rejected") && !findings?.issuesFound && !notes) {
          return res.status(400).json({
            message: "Issues description is required when sending back for corrections or rejecting an application"
          });
        }
        let newStatus;
        let clarificationRequested = null;
        const isLegacyRC = application.applicationNumber?.startsWith("LG-HS-");
        switch (outcome) {
          case "approved":
            newStatus = isLegacyRC ? "approved" : "payment_pending";
            break;
          case "corrections_needed":
            newStatus = "sent_back_for_corrections";
            clarificationRequested = findings?.issuesFound || notes || "Site inspection found issues that need correction";
            break;
          case "rejected":
            newStatus = "rejected";
            break;
          default:
            newStatus = "inspection_completed";
        }
        const updateData = {
          status: newStatus,
          siteInspectionCompletedDate: /* @__PURE__ */ new Date(),
          siteInspectionOutcome: outcome,
          siteInspectionFindings: findings || {},
          siteInspectionNotes: notes
        };
        if (outcome === "rejected") {
          updateData.rejectionReason = findings?.issuesFound || notes || "Application rejected after site inspection";
        } else if (outcome === "corrections_needed") {
          updateData.clarificationRequested = clarificationRequested;
        } else if (outcome === "approved" && isLegacyRC) {
          updateData.approvedAt = /* @__PURE__ */ new Date();
        }
        const updated = await storage.updateApplication(id, updateData);
        await logApplicationAction({
          applicationId: id,
          actorId: user.id,
          action: "inspection_completed",
          previousStatus: application.status,
          newStatus,
          feedback: notes || clarificationRequested || null
        });
        res.json({ application: updated, message: "Inspection completed successfully" });
      } catch (error) {
        applicationsLog.error({ err: error, route: "/:id/complete-inspection" }, "Complete inspection error");
        res.status(500).json({ message: "Failed to complete inspection" });
      }
    }
  );
  router8.delete("/:id", requireAuth, async (req, res) => {
    try {
      const applicationId = req.params.id;
      const userId = req.session.userId;
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const user = await storage.getUser(userId);
      if (application.userId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to delete this application" });
      }
      if (application.status !== "draft") {
        return res.status(400).json({ message: "Only draft applications can be discarded" });
      }
      await storage.deleteApplication(applicationId);
      applicationsLog.info({ applicationId, userId }, "Draft application discarded by user");
      res.json({ message: "Draft discarded successfully" });
    } catch (error) {
      applicationsLog.error({ err: error, route: "DELETE /:id" }, "Failed to discard draft");
      res.status(500).json({ message: "Failed to discard draft" });
    }
  });
  router8.get("/:id/timeline", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const viewer = await storage.getUser(req.session.userId);
      if (!canViewApplicationTimeline(viewer ?? null, application)) {
        return res.status(403).json({ message: "You are not allowed to view this timeline" });
      }
      const actions = await storage.getApplicationActions(req.params.id);
      const actorIds = Array.from(
        new Set(actions.map((action) => action.officerId).filter((value) => Boolean(value)))
      );
      const actorMap = /* @__PURE__ */ new Map();
      await Promise.all(
        actorIds.map(async (actorId) => {
          const actor = await storage.getUser(actorId);
          if (actor) {
            actorMap.set(actorId, summarizeTimelineActor(actor));
          }
        })
      );
      const timeline = actions.map((action) => ({
        id: action.id,
        action: action.action,
        previousStatus: action.previousStatus ?? null,
        newStatus: action.newStatus ?? null,
        feedback: action.feedback ?? null,
        createdAt: action.createdAt,
        actor: action.officerId ? actorMap.get(action.officerId) ?? null : null
      }));
      res.json({ timeline });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/:id/timeline" }, "Failed to fetch timeline");
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });
  router8.get("/:id/inspection-schedule", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const userId = req.session.userId;
      const requester = await storage.getUser(userId);
      const isOwner = application.userId === userId;
      const officerRoles = /* @__PURE__ */ new Set([
        "district_tourism_officer",
        "district_officer",
        "dealing_assistant",
        "state_officer",
        "admin",
        "super_admin"
      ]);
      if (!isOwner && (!requester || !officerRoles.has(requester.role))) {
        return res.status(403).json({ message: "You are not authorized to view this inspection schedule" });
      }
      const orderResult = await db.select().from(inspectionOrders).where(eq32(inspectionOrders.applicationId, id)).orderBy(desc8(inspectionOrders.createdAt)).limit(1);
      if (orderResult.length === 0) {
        return res.status(404).json({ message: "Inspection order not found" });
      }
      const order = orderResult[0];
      const assignedDa = await storage.getUser(order.assignedTo);
      const ackAction = await db.select().from(applicationActions).where(
        and8(
          eq32(applicationActions.applicationId, id),
          eq32(applicationActions.action, "inspection_acknowledged")
        )
      ).orderBy(desc8(applicationActions.createdAt)).limit(1);
      res.json({
        order: {
          id: order.id,
          status: order.status,
          inspectionDate: order.inspectionDate,
          specialInstructions: order.specialInstructions,
          assignedTo: assignedDa ? { id: assignedDa.id, fullName: assignedDa.fullName, mobile: assignedDa.mobile } : null
        },
        acknowledgedAt: ackAction.length ? ackAction[0].createdAt : null
      });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/:id/inspection-schedule" }, "Failed to fetch inspection schedule");
      res.status(500).json({ message: "Failed to fetch inspection schedule" });
    }
  });
  router8.post("/:id/inspection-schedule/acknowledge", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.userId !== userId) {
        return res.status(403).json({ message: "Only the application owner can acknowledge the inspection schedule" });
      }
      const orderResult = await db.select().from(inspectionOrders).where(eq32(inspectionOrders.applicationId, id)).orderBy(desc8(inspectionOrders.createdAt)).limit(1);
      if (orderResult.length === 0) {
        return res.status(400).json({ message: "Inspection has not been scheduled yet" });
      }
      const order = orderResult[0];
      if (order.status === "completed") {
        return res.status(400).json({ message: "Inspection already completed" });
      }
      const existingAck = await db.select().from(applicationActions).where(
        and8(
          eq32(applicationActions.applicationId, id),
          eq32(applicationActions.action, "inspection_acknowledged")
        )
      ).limit(1);
      if (existingAck.length > 0) {
        return res.status(400).json({ message: "Inspection already acknowledged" });
      }
      await logApplicationAction({
        applicationId: id,
        actorId: userId,
        action: "inspection_acknowledged",
        previousStatus: application.status,
        newStatus: application.status,
        feedback: "Inspection schedule acknowledged by applicant"
      });
      res.json({ message: "Inspection schedule acknowledged" });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/:id/inspection-schedule/acknowledge" }, "Failed to acknowledge inspection");
      res.status(500).json({ message: "Failed to acknowledge inspection" });
    }
  });
  router8.get("/:id/inspection-report", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const viewer = await storage.getUser(req.session.userId);
      const canView = viewer && (viewer.role !== "property_owner" || viewer.id === application.userId);
      if (!canView) {
        return res.status(403).json({ message: "You are not allowed to view this inspection report" });
      }
      const [report] = await db.select().from(inspectionReports).where(eq32(inspectionReports.applicationId, application.id)).orderBy(desc8(inspectionReports.submittedDate)).limit(1);
      const [order] = await db.select().from(inspectionOrders).where(eq32(inspectionOrders.applicationId, application.id)).orderBy(desc8(inspectionOrders.createdAt)).limit(1);
      if (!report && !order) {
        return res.status(404).json({ message: "Inspection not scheduled yet" });
      }
      const owner = await storage.getUser(application.userId);
      let da = null;
      let dtdo = null;
      if (order?.assignedTo) {
        da = await storage.getUser(order.assignedTo);
      }
      if (order?.scheduledBy) {
        dtdo = await storage.getUser(order.scheduledBy);
      }
      res.json({
        report: report ?? null,
        inspectionOrder: order ?? null,
        application: {
          id: application.id,
          applicationNumber: application.applicationNumber,
          propertyName: application.propertyName,
          district: application.district,
          tehsil: application.tehsil,
          address: application.address,
          category: application.category,
          status: application.status,
          siteInspectionOutcome: application.siteInspectionOutcome ?? null,
          siteInspectionNotes: application.siteInspectionNotes ?? null,
          siteInspectionCompletedDate: application.siteInspectionCompletedDate ?? null
        },
        owner: owner ? {
          id: owner.id,
          fullName: owner.fullName,
          email: owner.email,
          mobile: owner.mobile
        } : null,
        da: da ? {
          id: da.id,
          fullName: da.fullName,
          mobile: da.mobile,
          district: da.district
        } : null,
        dtdo: dtdo ? {
          id: dtdo.id,
          fullName: dtdo.fullName,
          mobile: dtdo.mobile,
          district: dtdo.district
        } : null
      });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/:id/inspection-report" }, "Failed to fetch inspection report");
      res.status(500).json({ message: "Failed to fetch inspection report" });
    }
  });
  router8.get("/:id/documents", requireAuth, async (req, res) => {
    try {
      const documents4 = await storage.getDocumentsByApplication(req.params.id);
      res.json({ documents: documents4 });
    } catch (error) {
      applicationsLog.error({ err: error, route: "/:id/documents" }, "Failed to fetch documents");
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  return router8;
}

// server/routes/applications/owner.ts
init_middleware();
init_storage();
init_logger();
import express17 from "express";
import { z as z8 } from "zod";
import { randomUUID as randomUUID5 } from "crypto";

// server/services/uploadPolicy.ts
init_db();
init_schema();
import { eq as eq33 } from "drizzle-orm";
init_logger();
var uploadPolicyLog = logger.child({ module: "upload-policy" });
async function getUploadPolicy() {
  try {
    const [setting] = await db.select().from(systemSettings).where(eq33(systemSettings.settingKey, UPLOAD_POLICY_SETTING_KEY)).limit(1);
    if (!setting) {
      return DEFAULT_UPLOAD_POLICY;
    }
    return normalizeUploadPolicy(setting.settingValue);
  } catch (error) {
    uploadPolicyLog.error("Failed to fetch upload policy, falling back to defaults", error);
    return DEFAULT_UPLOAD_POLICY;
  }
}

// server/services/documentValidation.ts
var BYTES_PER_MB = 1024 * 1024;
var normalizeMime = (mime) => {
  if (!mime || typeof mime !== "string") return "";
  return mime.split(";")[0].trim().toLowerCase();
};
var getExtension = (input) => {
  if (!input || typeof input !== "string") return "";
  const lastDot = input.lastIndexOf(".");
  if (lastDot === -1 || lastDot === input.length - 1) {
    return "";
  }
  return input.slice(lastDot).toLowerCase();
};
var formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[idx]}`;
};
var resolveDocumentCategory = (doc) => {
  const anyDoc = doc;
  const type = anyDoc.documentType?.toLowerCase?.() || anyDoc.type?.toLowerCase?.() || "";
  if (type.includes("photo") || type.includes("image")) {
    return "photos";
  }
  const mime = anyDoc.mimeType?.toLowerCase?.() || "";
  if (mime.startsWith("image/")) {
    return "photos";
  }
  return "documents";
};
var validateDocumentsAgainstPolicy = (docs, policy) => {
  if (!docs || docs.length === 0) {
    return null;
  }
  let totalBytes = 0;
  for (const doc of docs) {
    const category = resolveDocumentCategory(doc);
    const categoryPolicy = policy[category];
    const maxBytes = categoryPolicy.maxFileSizeMB * BYTES_PER_MB;
    const sizeBytes = typeof doc.fileSize === "number" && Number.isFinite(doc.fileSize) ? doc.fileSize : 0;
    if (sizeBytes > maxBytes) {
      return `${doc.fileName} exceeds the ${categoryPolicy.maxFileSizeMB} MB limit`;
    }
    const normalizedMime = normalizeMime(doc.mimeType);
    const mimeAllowed = categoryPolicy.allowedMimeTypes.length === 0 || !normalizedMime || normalizedMime === "application/octet-stream" || normalizedMime === "binary/octet-stream" || categoryPolicy.allowedMimeTypes.includes(normalizedMime) || normalizedMime === "image/jpg" && categoryPolicy.allowedMimeTypes.includes("image/jpeg");
    if (!mimeAllowed) {
      return `${doc.fileName} has an unsupported file type (${normalizedMime}). Allowed types: ${categoryPolicy.allowedMimeTypes.join(", ")}`;
    }
    const extension = getExtension(doc.fileName) || getExtension(doc.filePath) || getExtension(doc.url);
    if (categoryPolicy.allowedExtensions.length > 0 && (!extension || !categoryPolicy.allowedExtensions.includes(extension))) {
      return `${doc.fileName} must use one of the following extensions: ${categoryPolicy.allowedExtensions.join(", ")}`;
    }
    totalBytes += sizeBytes;
  }
  const maxTotalBytes = policy.totalPerApplicationMB * BYTES_PER_MB;
  if (totalBytes > maxTotalBytes) {
    return `Total document size ${formatBytes(totalBytes)} exceeds ${policy.totalPerApplicationMB} MB limit per application`;
  }
  return null;
};

// server/routes/applications/owner.ts
init_districtRouting();

// shared/fee-calculator.ts
var MAX_ROOMS_ALLOWED = 6;
var MAX_BEDS_ALLOWED = 12;
var CATEGORY_PRIORITY = {
  silver: 1,
  gold: 2,
  diamond: 3
};
var capitalizeCategory = (value) => value.charAt(0).toUpperCase() + value.slice(1);
function validateCategorySelection(selectedCategory, totalRooms, highestRoomRate, bands = DEFAULT_CATEGORY_RATE_BANDS) {
  const errors = [];
  const warnings = [];
  let suggestedCategory;
  const categoryLabel = capitalizeCategory(selectedCategory);
  if (totalRooms < 1) {
    errors.push("At least one room must be configured to determine the category.");
  }
  if (totalRooms > MAX_ROOMS_ALLOWED) {
    errors.push(`HP Homestay Rules 2025 permit a maximum of ${MAX_ROOMS_ALLOWED} rooms. You currently have ${totalRooms}.`);
  }
  if (highestRoomRate <= 0) {
    errors.push("Please provide nightly rates for at least one room type.");
  } else {
    const recommendedCategory = suggestCategory(totalRooms, highestRoomRate, bands);
    suggestedCategory = recommendedCategory;
    const selectedRank = CATEGORY_PRIORITY[selectedCategory];
    const recommendedRank = CATEGORY_PRIORITY[recommendedCategory];
    const formattedRate = Math.round(highestRoomRate).toLocaleString("en-IN");
    if (selectedRank < recommendedRank) {
      errors.push(
        `Your highest tariff of \u20B9${formattedRate} falls under the ${capitalizeCategory(
          recommendedCategory
        )} bracket. Please switch to ${capitalizeCategory(recommendedCategory)} or higher to remain compliant.`
      );
    } else if (selectedRank > recommendedRank) {
      warnings.push(
        `Your highest tariff of \u20B9${formattedRate} fits within the ${capitalizeCategory(
          recommendedCategory
        )} bracket. ${categoryLabel} is optional\u2014consider selecting ${capitalizeCategory(
          recommendedCategory
        )} to lower the registration fee.`
      );
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestedCategory
  };
}
function suggestCategory(totalRooms, highestRoomRate, bands = DEFAULT_CATEGORY_RATE_BANDS) {
  if (highestRoomRate <= 0) {
    return "silver";
  }
  const ordered = ["silver", "gold", "diamond"];
  for (const category of ordered) {
    const band = bands[category];
    const min = Math.max(0, Math.floor(band.min));
    const max = band.max === null ? Number.POSITIVE_INFINITY : Math.floor(band.max);
    if (highestRoomRate >= min && highestRoomRate <= max) {
      return category;
    }
  }
  return "diamond";
}

// server/routes/applications/owner.ts
init_notifications();

// server/storageManifest.ts
init_db();
init_schema();
import { eq as eq34 } from "drizzle-orm";

// server/objectStorage.ts
init_config();
import { Storage } from "@google-cloud/storage";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID as randomUUID4 } from "crypto";
import path10 from "path";
import fs10 from "fs";
import fsPromises3 from "fs/promises";
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var OBJECT_STORAGE_MODE = config.objectStorage.mode;
var LOCAL_OBJECT_DIR = path10.resolve(config.objectStorage.localDirectory);
var LOCAL_MAX_UPLOAD_BYTES = config.objectStorage.maxUploadBytes;
if (OBJECT_STORAGE_MODE === "local") {
  fs10.mkdirSync(LOCAL_OBJECT_DIR, { recursive: true });
}
var objectStorageClient = OBJECT_STORAGE_MODE === "replit" ? new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
}) : void 0;
var s3Config = config.objectStorage.s3;
var s3Client = OBJECT_STORAGE_MODE === "s3" && s3Config ? new S3Client({
  region: s3Config.region,
  endpoint: s3Config.endpoint,
  forcePathStyle: s3Config.forcePathStyle,
  credentials: s3Config.credentials
}) : void 0;
var ObjectStorageService = class {
  async prepareUpload(fileType = "document") {
    if (OBJECT_STORAGE_MODE === "local") {
      const objectId2 = randomUUID4();
      await this.ensureLocalDirectory(fileType);
      const uploadUrl2 = `/api/local-object/upload/${objectId2}?type=${encodeURIComponent(fileType)}`;
      const filePath = `/api/local-object/download/${objectId2}?type=${encodeURIComponent(fileType)}`;
      return { uploadUrl: uploadUrl2, filePath };
    }
    if (OBJECT_STORAGE_MODE === "s3") {
      if (!s3Client || !s3Config) {
        throw new Error("S3 object storage is not configured");
      }
      const objectId2 = randomUUID4();
      const objectName2 = `${fileType}s/${objectId2}`;
      const command = new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: objectName2
      });
      const uploadUrl2 = await getSignedUrl(s3Client, command, {
        expiresIn: config.objectStorage.signedUrlTtlSeconds
      });
      const filePath = `/${s3Config.bucket}/${objectName2}`;
      return { uploadUrl: uploadUrl2, filePath };
    }
    const privateObjectDir = this.getPrivateObjectDir();
    const objectId = randomUUID4();
    const fullPath = `${privateObjectDir}/${fileType}s/${objectId}`;
    const { bucketName, objectName } = this.parseObjectPath(fullPath);
    const uploadUrl = await this.signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: config.objectStorage.signedUrlTtlSeconds
    });
    return {
      uploadUrl,
      filePath: `/${bucketName}/${objectName}`
    };
  }
  async getViewURL(filePath, options = {}) {
    if (OBJECT_STORAGE_MODE === "local") {
      return filePath;
    }
    if (OBJECT_STORAGE_MODE === "s3") {
      if (!s3Client || !s3Config) {
        throw new Error("S3 object storage is not configured");
      }
      const { bucketName: bucketName2, objectName: objectName2 } = this.parseObjectPath(filePath);
      const command = new GetObjectCommand({
        Bucket: bucketName2,
        Key: objectName2,
        ResponseContentType: options.mimeType,
        ResponseContentDisposition: options.forceInline ? options.fileName ? `inline; filename="${options.fileName}"` : "inline" : options.fileName ? `attachment; filename="${options.fileName}"` : void 0
      });
      return getSignedUrl(s3Client, command, {
        expiresIn: config.objectStorage.signedUrlTtlSeconds
      });
    }
    const { bucketName, objectName } = this.parseObjectPath(filePath);
    const responseContentDisposition = options.forceInline ? options.fileName ? `inline; filename="${options.fileName}"` : "inline" : void 0;
    return this.signObjectURL({
      bucketName,
      objectName,
      method: "GET",
      ttlSec: config.objectStorage.signedUrlTtlSeconds,
      responseContentType: options.mimeType,
      responseContentDisposition
    });
  }
  async healthCheck() {
    try {
      if (OBJECT_STORAGE_MODE === "local") {
        await fsPromises3.access(LOCAL_OBJECT_DIR, fs10.constants.R_OK | fs10.constants.W_OK);
        return { ok: true, mode: "local" };
      }
      if (OBJECT_STORAGE_MODE === "s3") {
        if (!s3Client || !s3Config) {
          return { ok: false, mode: "s3", message: "S3 client not configured" };
        }
        await s3Client.send(
          new HeadBucketCommand({
            Bucket: s3Config.bucket
          })
        );
        return { ok: true, mode: "s3" };
      }
      if (OBJECT_STORAGE_MODE === "replit") {
        if (!objectStorageClient) {
          return { ok: false, mode: "replit", message: "Replit sidecar unavailable" };
        }
        return { ok: true, mode: "replit" };
      }
      return { ok: false, mode: OBJECT_STORAGE_MODE, message: "Unknown storage mode" };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, mode: OBJECT_STORAGE_MODE, message };
    }
  }
  getPrivateObjectDir() {
    const dir = config.objectStorage.replitPrivateDir;
    if (!dir) {
      throw new Error("PRIVATE_OBJECT_DIR not set");
    }
    return dir;
  }
  parseObjectPath(pathValue) {
    let normalizedPath = pathValue;
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }
    const pathParts = normalizedPath.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error("Invalid object path");
    }
    return {
      bucketName: pathParts[0],
      objectName: pathParts.slice(1).join("/")
    };
  }
  async signObjectURL({
    bucketName,
    objectName,
    method,
    ttlSec,
    responseContentType,
    responseContentDisposition
  }) {
    if (!objectStorageClient) {
      throw new Error("Object storage client not configured");
    }
    const request = {
      bucket_name: bucketName,
      object_name: objectName,
      method,
      expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
    };
    if (responseContentType) {
      request.response_content_type = responseContentType;
    }
    if (responseContentDisposition) {
      request.response_content_disposition = responseContentDisposition;
    }
    const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      throw new Error(`Failed to sign object URL: ${response.status}`);
    }
    const { signed_url } = await response.json();
    return signed_url;
  }
  async ensureLocalDirectory(fileType) {
    const dirPath = path10.join(LOCAL_OBJECT_DIR, `${fileType}s`);
    await fsPromises3.mkdir(dirPath, { recursive: true });
  }
  async readObjectAsBuffer(filePath) {
    if (OBJECT_STORAGE_MODE === "local") {
      const localUrl = new URL(`http://placeholder${filePath}`);
      const objectId = localUrl.pathname.split("/").pop();
      if (!objectId) {
        throw new Error("Invalid local object path");
      }
      const fileTypeParam = localUrl.searchParams.get("type") || "document";
      const safeType = fileTypeParam.replace(/[^a-zA-Z0-9_-]/g, "");
      const diskPath = path10.join(LOCAL_OBJECT_DIR, `${safeType}s`, objectId);
      return fsPromises3.readFile(diskPath);
    }
    if (OBJECT_STORAGE_MODE === "s3") {
      if (!s3Client || !s3Config) {
        throw new Error("S3 client not configured");
      }
      const { bucketName, objectName } = this.parseObjectPath(filePath);
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName
      });
      const response = await s3Client.send(command);
      if (!response.Body) {
        throw new Error("Empty S3 object body");
      }
      const stream = response.Body;
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    }
    if (OBJECT_STORAGE_MODE === "replit") {
      const viewUrl = await this.getViewURL(filePath);
      const response = await fetch(viewUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch object: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    throw new Error(`readObjectAsBuffer not implemented for mode "${OBJECT_STORAGE_MODE}"`);
  }
};

// server/storageManifest.ts
var LOCAL_DOWNLOAD_PREFIX = "/api/local-object/download/";
var sanitizeType = (value) => {
  if (!value) {
    return "document";
  }
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned.length > 0 ? cleaned : "document";
};
var buildLocalObjectKey = (fileType, objectId) => {
  const safeType = sanitizeType(fileType);
  return `${safeType}s/${objectId}`;
};
var normalizedSize = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return void 0;
  }
  const rounded = Math.max(0, Math.round(value));
  return Number.isFinite(rounded) ? rounded : void 0;
};
var compact = (payload) => {
  const result = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
};
var upsertStorageMetadata = async (meta) => {
  if (!meta.objectKey) {
    return;
  }
  const sizeValue = normalizedSize(meta.sizeBytes);
  const insertPayload = {
    objectKey: meta.objectKey,
    storageProvider: meta.storageProvider ?? OBJECT_STORAGE_MODE ?? "local",
    fileType: meta.fileType ?? "document",
    category: meta.category ?? "general",
    mimeType: meta.mimeType ?? "application/octet-stream",
    sizeBytes: sizeValue ?? 0,
    checksumSha256: meta.checksumSha256 ?? null,
    uploadedBy: meta.uploadedBy ?? null,
    applicationId: meta.applicationId ?? null,
    documentId: meta.documentId ?? null
  };
  const updatePayload = compact({
    storageProvider: meta.storageProvider ?? insertPayload.storageProvider,
    fileType: meta.fileType,
    category: meta.category,
    mimeType: meta.mimeType,
    sizeBytes: sizeValue,
    checksumSha256: meta.checksumSha256 ?? null,
    uploadedBy: meta.uploadedBy ?? null,
    applicationId: meta.applicationId ?? null,
    documentId: meta.documentId ?? null
  });
  await db.insert(storageObjects).values(insertPayload).onConflictDoUpdate({
    target: storageObjects.objectKey,
    set: updatePayload
  });
};
var deriveStorageDescriptorFromFilePath = (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    return null;
  }
  try {
    const url2 = new URL(filePath, "http://localhost");
    if (url2.pathname.startsWith(LOCAL_DOWNLOAD_PREFIX)) {
      const segments = url2.pathname.split("/").filter(Boolean);
      const objectId = segments[segments.length - 1];
      if (!objectId) {
        return null;
      }
      const safeType = sanitizeType(url2.searchParams.get("type"));
      return {
        objectKey: buildLocalObjectKey(safeType, objectId),
        storageProvider: "local",
        fileType: safeType
      };
    }
    const normalizedPath = url2.pathname.replace(/^\/+/, "");
    if (!normalizedPath) {
      return null;
    }
    const [bucket, ...objectParts] = normalizedPath.split("/");
    if (!bucket || objectParts.length === 0) {
      return {
        objectKey: normalizedPath,
        storageProvider: OBJECT_STORAGE_MODE ?? "local"
      };
    }
    const objectName = objectParts.join("/");
    const firstSegment = objectParts[0] || "";
    const inferredType = firstSegment.endsWith("s") && firstSegment.length > 1 ? firstSegment.slice(0, -1) : firstSegment;
    return {
      objectKey: `${bucket}/${objectName}`,
      storageProvider: OBJECT_STORAGE_MODE ?? "local",
      fileType: inferredType || void 0
    };
  } catch {
    return null;
  }
};
var linkDocumentToStorage = async (doc) => {
  const descriptor = deriveStorageDescriptorFromFilePath(doc.filePath);
  if (!descriptor) {
    return;
  }
  await upsertStorageMetadata({
    objectKey: descriptor.objectKey,
    storageProvider: descriptor.storageProvider,
    fileType: descriptor.fileType ?? doc.documentType ?? "document",
    category: doc.documentType ?? "general",
    mimeType: doc.mimeType,
    sizeBytes: doc.fileSize,
    applicationId: doc.applicationId,
    documentId: doc.id
  });
};
var markStorageObjectAccessed = async (objectKey) => {
  if (!objectKey) {
    return;
  }
  await db.update(storageObjects).set({ lastAccessedAt: /* @__PURE__ */ new Date() }).where(eq34(storageObjects.objectKey, objectKey));
};

// server/routes/helpers/object.ts
var removeUndefined = (obj) => Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== void 0));

// server/routes/constants.ts
var CORRECTION_CONSENT_TEXT = "I confirm that every issue highlighted by DA/DTDO has been fully addressed. I understand that my application may be rejected if the corrections remain unsatisfactory.";

// server/routes/applications/owner.ts
var CORRECTION_RESUBMIT_TARGET = "dtdo";
var ownerLog = logger.child({ module: "applications-owner" });
var preprocessNumericInput = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const parsed2 = Number(val);
    return Number.isFinite(parsed2) ? parsed2 : void 0;
  }
  return void 0;
};
var coerceNumberField = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed2 = Number(value);
    if (Number.isFinite(parsed2)) {
      return parsed2;
    }
  }
  return fallback;
};
var normalizeStringField2 = (value, fallback = "", maxLength) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  if (typeof maxLength === "number" && maxLength > 0) {
    return trimmed.slice(0, maxLength);
  }
  return trimmed;
};
var normalizeDocumentsForPersistence = (docs) => {
  if (!Array.isArray(docs)) {
    return void 0;
  }
  const normalized = docs.map((doc, index2) => {
    const documentType = doc.documentType || doc.type || "supporting_document";
    const fileName = doc.fileName || doc.name || `Document ${index2 + 1}`;
    const filePath = doc.filePath || doc.fileUrl || doc.url;
    if (!filePath || typeof filePath !== "string") {
      return null;
    }
    let fileSize = doc.fileSize;
    if (typeof fileSize === "string") {
      const parsed2 = Number(fileSize);
      fileSize = Number.isFinite(parsed2) ? parsed2 : void 0;
    }
    const resolvedSize = typeof fileSize === "number" && Number.isFinite(fileSize) ? fileSize : 0;
    return {
      id: doc.id && typeof doc.id === "string" ? doc.id : randomUUID5(),
      documentType,
      fileName,
      filePath,
      fileSize: resolvedSize,
      mimeType: doc.mimeType && typeof doc.mimeType === "string" && doc.mimeType.length > 0 ? doc.mimeType : "application/octet-stream",
      name: fileName,
      type: documentType,
      url: filePath,
      uploadedAt: doc.uploadedAt,
      required: typeof doc.required === "boolean" ? doc.required : void 0
    };
  }).filter((doc) => Boolean(doc));
  return normalized;
};
var resolveTehsilFields = (rawTehsil, rawTehsilOther) => {
  const tehsilString = typeof rawTehsil === "string" ? rawTehsil.trim() : "";
  const tehsilOtherString = typeof rawTehsilOther === "string" ? rawTehsilOther.trim() : "";
  const isPlaceholder = tehsilString.length === 0 || tehsilString.toLowerCase() === "not provided" || tehsilString === "__other" || tehsilString === "__manual";
  const resolvedTehsil = !isPlaceholder && tehsilString.length > 0 ? tehsilString : tehsilOtherString.length > 0 ? tehsilOtherString : "Not Provided";
  const resolvedTehsilOther = tehsilOtherString.length > 0 ? tehsilOtherString : null;
  return {
    tehsil: resolvedTehsil,
    tehsilOther: resolvedTehsilOther
  };
};
var removeUndefinedKeys = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === void 0 && delete obj[key]);
  return obj;
};
var sanitizeDraftForPersistence = (validatedData, draftOwner, isPartial = false) => {
  const normalizedDocuments = normalizeDocumentsForPersistence(validatedData.documents);
  const sStr = (val, fallback = "", max) => isPartial && val === void 0 ? void 0 : normalizeStringField2(val, fallback, max);
  const sNum = (val, fallback) => isPartial && val === void 0 ? void 0 : coerceNumberField(val, fallback);
  let resolvedTehsil = void 0;
  let resolvedTehsilOther = void 0;
  if (!isPartial || validatedData.tehsil !== void 0 || validatedData.tehsilOther !== void 0) {
    const { tehsil, tehsilOther } = resolveTehsilFields(
      validatedData.tehsil,
      validatedData.tehsilOther
    );
    resolvedTehsil = tehsil;
    resolvedTehsilOther = tehsilOther;
  }
  const fallbackOwnerName = normalizeStringField2(draftOwner?.fullName, "Draft Owner");
  const fallbackOwnerMobile = normalizeStringField2(draftOwner?.mobile, "0000000000");
  const fallbackOwnerEmail = normalizeStringField2(draftOwner?.email, "");
  const result = {
    ...validatedData,
    propertyName: sStr(validatedData.propertyName, ""),
    category: validatedData.category || (isPartial ? void 0 : "silver"),
    locationType: validatedData.locationType || (isPartial ? void 0 : "gp"),
    district: sStr(validatedData.district),
    // Only update tehsil if we resolved it
    ...resolvedTehsil !== void 0 ? { tehsil: resolvedTehsil } : {},
    ...resolvedTehsilOther !== void 0 ? { tehsilOther: resolvedTehsilOther } : {},
    block: sStr(validatedData.block),
    blockOther: sStr(validatedData.blockOther),
    gramPanchayat: sStr(validatedData.gramPanchayat),
    gramPanchayatOther: sStr(validatedData.gramPanchayatOther),
    urbanBody: sStr(validatedData.urbanBody),
    urbanBodyOther: sStr(validatedData.urbanBodyOther),
    ward: sStr(validatedData.ward),
    address: sStr(validatedData.address),
    pincode: sStr(validatedData.pincode, "", 10),
    telephone: sStr(validatedData.telephone, "", 20),
    ownerName: sStr(validatedData.ownerName, fallbackOwnerName),
    ownerGender: validatedData.ownerGender || (isPartial ? void 0 : "other"),
    ownerMobile: sStr(validatedData.ownerMobile, fallbackOwnerMobile, 15),
    ownerEmail: sStr(validatedData.ownerEmail, fallbackOwnerEmail),
    ownerAadhaar: sStr(validatedData.ownerAadhaar, "000000000000", 12),
    guardianName: sStr(validatedData.guardianName),
    guardianRelation: sStr(validatedData.guardianRelation),
    propertyOwnership: validatedData.propertyOwnership === "leased" ? "leased" : "owned",
    projectType: validatedData.projectType || (isPartial ? void 0 : "new_project"),
    propertyArea: sNum(validatedData.propertyArea),
    // DEBUG: Log propertyAreaUnit to trace persistence issue
    propertyAreaUnit: (() => {
      const val = validatedData.propertyAreaUnit || (isPartial ? void 0 : "sqft");
      return val;
    })(),
    singleBedRooms: sNum(validatedData.singleBedRooms),
    singleBedBeds: sNum(validatedData.singleBedBeds, 1),
    singleBedRoomSize: sNum(validatedData.singleBedRoomSize),
    singleBedRoomRate: sNum(validatedData.singleBedRoomRate),
    doubleBedRooms: sNum(validatedData.doubleBedRooms),
    doubleBedBeds: sNum(validatedData.doubleBedBeds, 2),
    doubleBedRoomSize: sNum(validatedData.doubleBedRoomSize),
    doubleBedRoomRate: sNum(validatedData.doubleBedRoomRate),
    familySuites: sNum(validatedData.familySuites),
    familySuiteBeds: sNum(validatedData.familySuiteBeds, 4),
    familySuiteSize: sNum(validatedData.familySuiteSize),
    familySuiteRate: sNum(validatedData.familySuiteRate),
    attachedWashrooms: sNum(validatedData.attachedWashrooms),
    gstin: sStr(validatedData.gstin, "", 15),
    selectedCategory: validatedData.selectedCategory || validatedData.category || (isPartial ? void 0 : "silver"),
    averageRoomRate: sNum(validatedData.averageRoomRate),
    highestRoomRate: sNum(validatedData.highestRoomRate),
    lowestRoomRate: sNum(validatedData.lowestRoomRate),
    certificateValidityYears: validatedData.certificateValidityYears ?? (isPartial ? void 0 : 1),
    // Auto-derive Pangi flag from district/tehsil if not explicitly set (or always enforce it to be safe)
    isPangiSubDivision: isPangiSubDivision(sStr(validatedData.district), resolvedTehsil || sStr(validatedData.tehsil)),
    distanceAirport: sNum(validatedData.distanceAirport),
    distanceRailway: sNum(validatedData.distanceRailway),
    distanceCityCenter: sNum(validatedData.distanceCityCenter),
    distanceShopping: sNum(validatedData.distanceShopping),
    distanceBusStand: sNum(validatedData.distanceBusStand),
    lobbyArea: sNum(validatedData.lobbyArea),
    diningArea: sNum(validatedData.diningArea),
    parkingArea: sStr(validatedData.parkingArea),
    ecoFriendlyFacilities: sStr(validatedData.ecoFriendlyFacilities),
    differentlyAbledFacilities: sStr(validatedData.differentlyAbledFacilities),
    fireEquipmentDetails: sStr(validatedData.fireEquipmentDetails),
    nearestHospital: sStr(validatedData.nearestHospital),
    keyLocationHighlight1: sStr(validatedData.keyLocationHighlight1),
    keyLocationHighlight2: sStr(validatedData.keyLocationHighlight2),
    amenities: validatedData.amenities,
    // Ensure amenities are passed through
    nearbyAttractions: validatedData.nearbyAttractions,
    // Ensure nearbyAttractions are passed through
    // For documents: if not present in partial update, leave undefined. Default to [] only for full updates.
    documents: isPartial && normalizedDocuments === void 0 ? void 0 : normalizedDocuments ?? [],
    baseFee: sNum(validatedData.baseFee),
    totalBeforeDiscounts: sNum(validatedData.totalBeforeDiscounts),
    validityDiscount: sNum(validatedData.validityDiscount),
    femaleOwnerDiscount: sNum(validatedData.femaleOwnerDiscount),
    pangiDiscount: sNum(validatedData.pangiDiscount),
    totalDiscount: sNum(validatedData.totalDiscount),
    totalFee: sNum(validatedData.totalFee),
    perRoomFee: sNum(validatedData.perRoomFee),
    gstAmount: sNum(validatedData.gstAmount),
    formCompletionTimeSeconds: (() => {
      const val = sNum(validatedData.formCompletionTimeSeconds);
      if (val && val > 2e9) {
        return 0;
      }
      return val;
    })()
  };
  return removeUndefinedKeys(result);
};
var toNumberFromUnknown2 = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed2 = Number(value);
    return Number.isFinite(parsed2) ? parsed2 : null;
  }
  return null;
};
var draftSchema = z8.object({
  propertyName: z8.string().optional(),
  category: z8.enum(["diamond", "gold", "silver"]).optional(),
  address: z8.string().optional(),
  district: z8.string().optional(),
  tehsil: z8.string().optional(),
  tehsilOther: z8.string().optional(),
  block: z8.string().optional(),
  blockOther: z8.string().optional(),
  gramPanchayat: z8.string().optional(),
  gramPanchayatOther: z8.string().optional(),
  urbanBody: z8.string().optional(),
  urbanBodyOther: z8.string().optional(),
  ward: z8.string().optional(),
  pincode: z8.string().optional(),
  locationType: z8.enum(["mc", "tcp", "gp"]).optional(),
  telephone: z8.string().optional(),
  ownerName: z8.string().optional(),
  ownerMobile: z8.string().optional(),
  ownerEmail: z8.string().optional(),
  ownerAadhaar: z8.string().optional(),
  guardianName: z8.string().optional(),
  guardianRelation: z8.enum(["s_o", "d_o", "w_o", "c_o", "father", "husband", "guardian"]).optional(),
  proposedRoomRate: z8.coerce.number().optional(),
  singleBedRoomRate: z8.coerce.number().optional(),
  doubleBedRoomRate: z8.coerce.number().optional(),
  familySuiteRate: z8.coerce.number().optional(),
  projectType: z8.enum(["new_property", "existing_property", "new_project", "new_rooms"]).optional(),
  propertyArea: z8.coerce.number().optional(),
  propertyAreaUnit: z8.enum(["sqm", "sqft", "kanal", "marla", "bigha", "biswa"]).optional(),
  singleBedRooms: z8.coerce.number().optional(),
  singleBedBeds: z8.coerce.number().optional(),
  singleBedRoomSize: z8.coerce.number().optional(),
  doubleBedRooms: z8.coerce.number().optional(),
  doubleBedBeds: z8.coerce.number().optional(),
  doubleBedRoomSize: z8.coerce.number().optional(),
  familySuites: z8.coerce.number().optional(),
  familySuiteBeds: z8.coerce.number().optional(),
  familySuiteSize: z8.coerce.number().optional(),
  attachedWashrooms: z8.coerce.number().optional(),
  gstin: z8.string().optional(),
  distanceAirport: z8.coerce.number().optional(),
  distanceRailway: z8.coerce.number().optional(),
  distanceCityCenter: z8.coerce.number().optional(),
  distanceShopping: z8.coerce.number().optional(),
  distanceBusStand: z8.coerce.number().optional(),
  lobbyArea: z8.coerce.number().optional(),
  diningArea: z8.coerce.number().optional(),
  parkingArea: z8.string().optional(),
  ecoFriendlyFacilities: z8.string().optional(),
  differentlyAbledFacilities: z8.string().optional(),
  fireEquipmentDetails: z8.string().optional(),
  nearestHospital: z8.string().optional(),
  keyLocationHighlight1: z8.string().optional(),
  keyLocationHighlight2: z8.string().optional(),
  amenities: z8.any().optional(),
  baseFee: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  totalBeforeDiscounts: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  validityDiscount: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  femaleOwnerDiscount: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  pangiDiscount: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  totalDiscount: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  totalFee: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  perRoomFee: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  gstAmount: z8.preprocess(preprocessNumericInput, z8.coerce.number().optional()),
  certificateValidityYears: z8.coerce.number().optional(),
  isPangiSubDivision: z8.boolean().optional(),
  ownerGender: z8.enum(["male", "female", "other"]).optional(),
  documents: z8.array(z8.any()).optional()
}).passthrough();
var serviceRequestDraftSchema = draftSchema.extend({
  applicationKind: z8.enum(["new_registration", "add_rooms", "delete_rooms", "cancel_certificate", "change_category", "change_ownership"]).optional(),
  parentApplicationId: z8.string().uuid().optional(),
  serviceContext: z8.object({
    requestedRooms: z8.any().optional(),
    requestedDeletions: z8.any().optional(),
    note: z8.string().optional()
  }).optional()
});
var ownerSubmittableSchema = z8.object({
  propertyName: z8.string(),
  category: z8.enum(["diamond", "gold", "silver"]),
  address: z8.string(),
  district: z8.string(),
  pincode: z8.string(),
  locationType: z8.enum(["mc", "tcp", "gp"]),
  telephone: z8.string().optional(),
  block: z8.string().optional(),
  blockOther: z8.string().optional(),
  gramPanchayat: z8.string().optional(),
  gramPanchayatOther: z8.string().optional(),
  urbanBody: z8.string().optional(),
  urbanBodyOther: z8.string().optional(),
  ward: z8.string().optional(),
  ownerName: z8.string(),
  ownerMobile: z8.string(),
  ownerEmail: z8.string().optional(),
  ownerAadhaar: z8.string(),
  guardianName: z8.string().optional(),
  guardianRelation: z8.enum(["s_o", "d_o", "w_o", "c_o", "father", "husband", "guardian"]).optional(),
  propertyOwnership: z8.enum(["owned", "leased"]).optional(),
  proposedRoomRate: z8.coerce.number().min(0),
  singleBedRoomRate: z8.coerce.number().min(0).optional(),
  doubleBedRoomRate: z8.coerce.number().min(0).optional(),
  familySuiteRate: z8.coerce.number().min(0).optional(),
  projectType: z8.enum(["new_property", "existing_property", "new_project", "new_rooms"]),
  propertyArea: z8.coerce.number().min(0),
  singleBedRooms: z8.coerce.number().min(0).optional(),
  singleBedBeds: z8.coerce.number().min(0).optional(),
  singleBedRoomSize: z8.coerce.number().min(0).optional(),
  doubleBedRooms: z8.coerce.number().min(0).optional(),
  doubleBedBeds: z8.coerce.number().min(0).optional(),
  doubleBedRoomSize: z8.coerce.number().min(0).optional(),
  familySuites: z8.coerce.number().min(0).optional(),
  familySuiteBeds: z8.coerce.number().min(0).optional(),
  familySuiteSize: z8.coerce.number().min(0).optional(),
  attachedWashrooms: z8.coerce.number().min(0),
  gstin: z8.string().refine((val) => val === "" || /^[0-9A-Z]{15}$/.test(val), {
    message: "GSTIN must be 15 uppercase alphanumeric characters"
  }).optional(),
  distanceAirport: z8.coerce.number().optional(),
  distanceRailway: z8.coerce.number().optional(),
  distanceCityCenter: z8.coerce.number().optional(),
  distanceShopping: z8.coerce.number().optional(),
  distanceBusStand: z8.coerce.number().optional(),
  lobbyArea: z8.coerce.number().optional(),
  diningArea: z8.coerce.number().optional(),
  parkingArea: z8.string().optional(),
  ecoFriendlyFacilities: z8.string().optional(),
  differentlyAbledFacilities: z8.string().optional(),
  fireEquipmentDetails: z8.string().optional(),
  nearestHospital: z8.string().optional(),
  amenities: z8.any().optional(),
  baseFee: z8.coerce.number(),
  totalBeforeDiscounts: z8.coerce.number().optional(),
  validityDiscount: z8.coerce.number().optional(),
  femaleOwnerDiscount: z8.coerce.number().optional(),
  pangiDiscount: z8.coerce.number().optional(),
  totalDiscount: z8.coerce.number().optional(),
  totalFee: z8.coerce.number(),
  perRoomFee: z8.coerce.number().optional(),
  gstAmount: z8.coerce.number().optional(),
  certificateValidityYears: z8.coerce.number().optional(),
  isPangiSubDivision: z8.boolean().optional(),
  ownerGender: z8.enum(["male", "female", "other"]).optional(),
  tehsil: z8.string().optional().nullable(),
  tehsilOther: z8.string().optional(),
  latitude: z8.string().optional(),
  longitude: z8.string().optional(),
  documents: z8.array(
    z8.preprocess(
      (value) => {
        if (!value || typeof value !== "object") {
          return value;
        }
        const doc = { ...value };
        doc.filePath = typeof doc.filePath === "string" && doc.filePath.length > 0 ? doc.filePath : typeof doc.fileUrl === "string" && doc.fileUrl.length > 0 ? doc.fileUrl : typeof doc.url === "string" && doc.url.length > 0 ? doc.url : `missing://${randomUUID5()}`;
        doc.documentType = typeof doc.documentType === "string" && doc.documentType.length > 0 ? doc.documentType : typeof doc.type === "string" && doc.type.length > 0 ? doc.type : "supporting_document";
        doc.fileName = typeof doc.fileName === "string" && doc.fileName.length > 0 ? doc.fileName : typeof doc.name === "string" && doc.name.length > 0 ? doc.name : `${doc.documentType}.pdf`;
        if (doc.fileSize === void 0 && typeof doc.size !== "undefined") {
          doc.fileSize = doc.size;
        }
        if (typeof doc.fileSize !== "number" || !Number.isFinite(doc.fileSize)) {
          doc.fileSize = 0;
        }
        doc.mimeType = typeof doc.mimeType === "string" && doc.mimeType.length > 0 ? doc.mimeType : typeof doc.type === "string" && doc.type.length > 0 ? doc.type : "application/octet-stream";
        return doc;
      },
      z8.object({
        filePath: z8.string().min(1, "Document file path is required"),
        fileName: z8.string().min(1, "Document file name is required"),
        fileSize: z8.coerce.number().nonnegative().optional(),
        mimeType: z8.string().optional(),
        documentType: z8.string()
      })
    )
  ).optional(),
  // Analytics: Time spent filling the form (seconds)
  formCompletionTimeSeconds: z8.coerce.number().int().nonnegative().optional()
});
var correctionUpdateSchema = z8.object({
  propertyName: z8.string().optional(),
  category: z8.enum(["diamond", "gold", "silver"]).optional(),
  locationType: z8.enum(["mc", "tcp", "gp"]).optional(),
  district: z8.string().optional(),
  districtOther: z8.string().optional(),
  tehsil: z8.string().optional(),
  tehsilOther: z8.string().optional(),
  block: z8.string().optional(),
  blockOther: z8.string().optional(),
  gramPanchayat: z8.string().optional(),
  gramPanchayatOther: z8.string().optional(),
  urbanBody: z8.string().optional(),
  urbanBodyOther: z8.string().optional(),
  ward: z8.string().optional(),
  address: z8.string().optional(),
  pincode: z8.string().optional(),
  telephone: z8.string().optional(),
  latitude: z8.string().optional(),
  longitude: z8.string().optional(),
  ownerName: z8.string().optional(),
  ownerFirstName: z8.string().optional(),
  ownerLastName: z8.string().optional(),
  ownerGender: z8.enum(["male", "female", "other"]).optional(),
  ownerMobile: z8.string().optional(),
  ownerEmail: z8.string().optional(),
  ownerAadhaar: z8.string().optional(),
  guardianName: z8.string().optional(),
  guardianRelation: z8.enum(["s_o", "d_o", "w_o", "c_o", "father", "husband", "guardian"]).optional(),
  propertyOwnership: z8.enum(["owned", "leased"]).optional(),
  projectType: z8.enum(["new_property", "existing_property", "new_project", "new_rooms"]).optional(),
  propertyArea: z8.coerce.number().min(0).optional(),
  singleBedRooms: z8.coerce.number().int().min(0).optional(),
  singleBedBeds: z8.coerce.number().int().min(0).optional(),
  singleBedRoomSize: z8.coerce.number().min(0).optional(),
  singleBedRoomRate: z8.coerce.number().min(0).optional(),
  doubleBedRooms: z8.coerce.number().int().min(0).optional(),
  doubleBedBeds: z8.coerce.number().int().min(0).optional(),
  doubleBedRoomSize: z8.coerce.number().min(0).optional(),
  doubleBedRoomRate: z8.coerce.number().min(0).optional(),
  familySuites: z8.coerce.number().int().min(0).max(3).optional(),
  familySuiteBeds: z8.coerce.number().int().min(0).optional(),
  familySuiteSize: z8.coerce.number().min(0).optional(),
  familySuiteRate: z8.coerce.number().min(0).optional(),
  attachedWashrooms: z8.coerce.number().int().min(0).optional(),
  gstin: z8.string().optional().or(z8.literal("")),
  certificateValidityYears: z8.coerce.number().int().min(1).max(3).optional(),
  isPangiSubDivision: z8.boolean().optional(),
  distanceAirport: z8.coerce.number().min(0).optional(),
  distanceRailway: z8.coerce.number().min(0).optional(),
  distanceCityCenter: z8.coerce.number().min(0).optional(),
  distanceShopping: z8.coerce.number().min(0).optional(),
  distanceBusStand: z8.coerce.number().min(0).optional(),
  lobbyArea: z8.coerce.number().min(0).optional(),
  diningArea: z8.coerce.number().min(0).optional(),
  parkingArea: z8.string().optional().or(z8.literal("")),
  ecoFriendlyFacilities: z8.string().optional().or(z8.literal("")),
  differentlyAbledFacilities: z8.string().optional().or(z8.literal("")),
  fireEquipmentDetails: z8.string().optional().or(z8.literal("")),
  nearestHospital: z8.string().optional().or(z8.literal("")),
  amenities: z8.object({
    ac: z8.boolean().optional(),
    wifi: z8.boolean().optional(),
    parking: z8.boolean().optional(),
    restaurant: z8.boolean().optional(),
    hotWater: z8.boolean().optional(),
    tv: z8.boolean().optional(),
    laundry: z8.boolean().optional(),
    roomService: z8.boolean().optional(),
    garden: z8.boolean().optional(),
    mountainView: z8.boolean().optional(),
    petFriendly: z8.boolean().optional()
  }).optional(),
  rooms: z8.array(
    z8.object({
      roomType: z8.string(),
      size: z8.coerce.number(),
      count: z8.coerce.number()
    })
  ).optional(),
  baseFee: z8.coerce.number().optional(),
  totalBeforeDiscounts: z8.coerce.number().optional(),
  validityDiscount: z8.coerce.number().optional(),
  femaleOwnerDiscount: z8.coerce.number().optional(),
  pangiDiscount: z8.coerce.number().optional(),
  totalDiscount: z8.coerce.number().optional(),
  totalFee: z8.coerce.number().optional(),
  perRoomFee: z8.coerce.number().optional(),
  gstAmount: z8.coerce.number().optional(),
  documents: z8.array(
    z8.object({
      id: z8.string().optional(),
      name: z8.string().optional(),
      type: z8.string().optional(),
      url: z8.string().optional(),
      fileName: z8.string().optional(),
      filePath: z8.string().optional(),
      fileUrl: z8.string().optional(),
      documentType: z8.string().optional(),
      fileSize: z8.preprocess((value) => {
        if (typeof value === "string" && value.trim() !== "") {
          const parsed2 = Number(value);
          return Number.isNaN(parsed2) ? value : parsed2;
        }
        return value;
      }, z8.number().optional()),
      mimeType: z8.string().optional(),
      uploadedAt: z8.string().optional(),
      required: z8.boolean().optional()
    })
  ).optional(),
  ownershipProofUrl: z8.string().optional(),
  aadhaarCardUrl: z8.string().optional(),
  panCardUrl: z8.string().optional(),
  gstCertificateUrl: z8.string().optional(),
  propertyPhotosUrls: z8.array(z8.string()).optional()
});
function createOwnerApplicationsRouter({ getRoomRateBandsSetting }) {
  const router8 = express17.Router();
  router8.post("/draft", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const body = serviceRequestDraftSchema.parse(req.body);
      const applicationKind = body.applicationKind || "new_registration";
      const existingApps = await storage.getApplicationsByUser(userId);
      let parentApp;
      let draftData = { ...body };
      if (applicationKind === "new_registration") {
        if (existingApps.length > 0) {
          const existing = existingApps[0];
          if (existing.status === "draft") {
            return res.json({ application: existing, message: "Existing draft loaded" });
          }
          return res.status(409).json({
            message: "Only one homestay application is permitted per owner account. Please maintain your existing property.",
            existingApplicationId: existing.id,
            status: existing.status
          });
        }
      } else {
        const explicitParentId = body.parentApplicationId;
        if (explicitParentId) {
          parentApp = existingApps.find((app2) => app2.id === explicitParentId && app2.status === "approved");
        } else {
          parentApp = existingApps.find((app2) => app2.status === "approved");
        }
        if (!parentApp) {
          return res.status(400).json({
            message: "You must have an approved Homestay Registration before applying for amendments or cancellation."
          });
        }
        const closedStatuses = ["approved", "rejected", "superseded", "certificate_cancelled"];
        const openServiceRequest = existingApps.find(
          (app2) => !closedStatuses.includes(app2.status || "") && app2.applicationKind !== "new_registration"
        );
        if (openServiceRequest) {
          return res.status(409).json({
            message: `You already have a pending service request (${openServiceRequest.applicationKind.replace("_", " ")}). Please complete it first.`,
            existingApplicationId: openServiceRequest.id
          });
        }
        draftData = {
          ...draftData,
          // Core Identity
          propertyName: parentApp.propertyName ?? void 0,
          ownerName: parentApp.ownerName ?? void 0,
          ownerGender: parentApp.ownerGender ?? "male",
          // Default to 'male' if not set
          ownerMobile: parentApp.ownerMobile ?? void 0,
          ownerEmail: parentApp.ownerEmail ?? void 0,
          ownerAadhaar: parentApp.ownerAadhaar ?? void 0,
          guardianName: parentApp.guardianName ?? void 0,
          // Address (Usually invariant)
          district: parentApp.district ?? void 0,
          tehsil: parentApp.tehsil ?? void 0,
          tehsilOther: parentApp.tehsilOther ?? void 0,
          block: parentApp.block ?? void 0,
          blockOther: parentApp.blockOther ?? void 0,
          gramPanchayat: parentApp.gramPanchayat ?? void 0,
          gramPanchayatOther: parentApp.gramPanchayatOther ?? void 0,
          urbanBody: parentApp.urbanBody ?? void 0,
          urbanBodyOther: parentApp.urbanBodyOther ?? void 0,
          ward: parentApp.ward ?? void 0,
          address: parentApp.address ?? void 0,
          pincode: parentApp.pincode ?? void 0,
          locationType: parentApp.locationType ?? void 0,
          // Property Specs (Current State)
          category: parentApp.category ?? void 0,
          selectedCategory: parentApp.category ?? void 0,
          // Start with current
          totalRooms: parentApp.totalRooms ?? void 0,
          propertyArea: parentApp.propertyArea ? Number(parentApp.propertyArea) : void 0,
          propertyAreaUnit: parentApp.propertyAreaUnit ?? "sqft",
          projectType: "existing_property",
          // Service requests are always for existing properties
          propertyOwnership: parentApp.propertyOwnership ?? "owned",
          // Default if not set
          // Room Configs
          singleBedRooms: parentApp.singleBedRooms ?? 0,
          singleBedBeds: parentApp.singleBedBeds ?? 1,
          singleBedRoomRate: parentApp.singleBedRoomRate ? Number(parentApp.singleBedRoomRate) : void 0,
          doubleBedRooms: parentApp.doubleBedRooms ?? 0,
          doubleBedBeds: parentApp.doubleBedBeds ?? 2,
          doubleBedRoomRate: parentApp.doubleBedRoomRate ? Number(parentApp.doubleBedRoomRate) : void 0,
          familySuites: parentApp.familySuites ?? 0,
          familySuiteBeds: parentApp.familySuiteBeds ?? 4,
          familySuiteRate: parentApp.familySuiteRate ? Number(parentApp.familySuiteRate) : void 0,
          attachedWashrooms: parentApp.attachedWashrooms ?? void 0,
          // Linkage
          applicationKind,
          parentApplicationId: parentApp.id,
          parentApplicationNumber: parentApp.applicationNumber ?? void 0,
          parentCertificateNumber: parentApp.certificateNumber ?? void 0
        };
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const validatedData = serviceRequestDraftSchema.parse(draftData);
      const sanitizedDraft = sanitizeDraftForPersistence(validatedData, user, true);
      if (applicationKind !== "new_registration") {
        sanitizedDraft.applicationKind = applicationKind;
        sanitizedDraft.parentApplicationId = parentApp?.id;
        sanitizedDraft.parentApplicationNumber = parentApp?.applicationNumber;
        sanitizedDraft.parentCertificateNumber = parentApp?.certificateNumber;
      }
      const policy = await getUploadPolicy();
      const draftDocsError = validateDocumentsAgainstPolicy(
        sanitizedDraft.documents,
        policy
      );
      if (draftDocsError) {
        return res.status(400).json({ message: draftDocsError });
      }
      const application = await storage.createApplication({
        ...sanitizedDraft,
        userId,
        status: "draft"
      });
      res.json({
        application,
        message: applicationKind === "new_registration" ? "Draft saved successfully." : `${applicationKind.replace("_", " ")} request initiated.`
      });
    } catch (error) {
      console.error("[draft:create] DETAILS:", error);
      ownerLog.error({ err: error }, "[draft:create] Failed to save draft");
      res.status(500).json({ message: `Failed to save draft: ${error.message || error}` });
    }
  });
  router8.patch("/:id/draft", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const existing = await storage.getApplication(id);
      if (!existing) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (existing.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this application" });
      }
      if (existing.status !== "draft") {
        return res.status(400).json({ message: "Can only update draft applications" });
      }
      const validatedData = draftSchema.parse(req.body);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const sanitizedDraft = sanitizeDraftForPersistence(validatedData, user, true);
      const policy = await getUploadPolicy();
      const draftDocsError = validateDocumentsAgainstPolicy(
        sanitizedDraft.documents,
        policy
      );
      if (draftDocsError) {
        return res.status(400).json({ message: draftDocsError });
      }
      const totalRooms = (sanitizedDraft.singleBedRooms || 0) + (sanitizedDraft.doubleBedRooms || 0) + (sanitizedDraft.familySuites || 0);
      const updated = await storage.updateApplication(id, {
        ...sanitizedDraft,
        totalRooms: totalRooms || existing.totalRooms
      });
      res.json({ application: updated, message: "Draft updated successfully" });
    } catch (error) {
      console.error("[draft:update] CRITIAL ERROR:", error);
      if (error instanceof Error) {
        console.error(error.stack);
      }
      if (error instanceof z8.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      ownerLog.error({ err: error }, "[draft:update] Failed to update draft");
      res.status(500).json({ message: `Failed to update draft: ${error.message || error}` });
    }
  });
  router8.post("/", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = ownerSubmittableSchema.parse(req.body);
      const totalRooms = (validatedData.singleBedRooms || 0) + (validatedData.doubleBedRooms || 0) + (validatedData.familySuites || 0);
      if (totalRooms <= 0) {
        return res.status(400).json({
          message: "Please configure at least one room before submitting the application."
        });
      }
      const singleBedsPerRoom = validatedData.singleBedBeds ?? ((validatedData.singleBedRooms || 0) > 0 ? 1 : 0);
      const doubleBedsPerRoom = validatedData.doubleBedBeds ?? ((validatedData.doubleBedRooms || 0) > 0 ? 2 : 0);
      const suiteBedsPerRoom = validatedData.familySuiteBeds ?? ((validatedData.familySuites || 0) > 0 ? 4 : 0);
      const totalBeds = (validatedData.singleBedRooms || 0) * singleBedsPerRoom + (validatedData.doubleBedRooms || 0) * doubleBedsPerRoom + (validatedData.familySuites || 0) * suiteBedsPerRoom;
      if (totalRooms > MAX_ROOMS_ALLOWED) {
        return res.status(400).json({
          message: `HP Homestay Rules 2025 permit a maximum of ${MAX_ROOMS_ALLOWED} rooms.`
        });
      }
      if (totalBeds > MAX_BEDS_ALLOWED) {
        return res.status(400).json({
          message: `Total beds cannot exceed ${MAX_BEDS_ALLOWED} across all room types. Please adjust the bed counts.`
        });
      }
      if (totalRooms > 0 && (validatedData.attachedWashrooms || 0) < totalRooms) {
        return res.status(400).json({
          message: "Every room must have its own washroom. Increase attached washrooms to at least the total number of rooms."
        });
      }
      if ((validatedData.singleBedRooms || 0) > 0 && !validatedData.singleBedRoomRate) {
        return res.status(400).json({
          message: "Per-room-type rates are mandatory. Single bed room rate is required (HP Homestay Rules 2025 - ANNEXURE-I Form-A Certificate Requirement)"
        });
      }
      if ((validatedData.doubleBedRooms || 0) > 0 && !validatedData.doubleBedRoomRate) {
        return res.status(400).json({
          message: "Per-room-type rates are mandatory. Double bed room rate is required (HP Homestay Rules 2025 - ANNEXURE-I Form-A Certificate Requirement)"
        });
      }
      if ((validatedData.familySuites || 0) > 0 && !validatedData.familySuiteRate) {
        return res.status(400).json({
          message: "Per-room-type rates are mandatory. Family suite rate is required (HP Homestay Rules 2025 - ANNEXURE-I Form-A Certificate Requirement)"
        });
      }
      const roomRateBands = await getRoomRateBandsSetting();
      const highestRoomRate = Math.max(
        validatedData.singleBedRoomRate || 0,
        validatedData.doubleBedRoomRate || 0,
        validatedData.familySuiteRate || 0,
        validatedData.proposedRoomRate || 0
      );
      const categoryValidation = validateCategorySelection(
        validatedData.category,
        totalRooms,
        highestRoomRate,
        roomRateBands
      );
      if (!categoryValidation.isValid) {
        return res.status(400).json({
          message: categoryValidation.errors[0] || "The selected category does not match the nightly tariffs. Update the rates or choose a higher category."
        });
      }
      const existingApps = await storage.getApplicationsByUser(userId);
      const existingApp = existingApps[0];
      if (existingApp && existingApp.status !== "draft") {
        return res.status(409).json({
          message: `You already have an application (${existingApp.applicationNumber}) in status "${existingApp.status}". Amendments are required instead of creating a new application.`,
          existingApplicationId: existingApp.id,
          status: existingApp.status
        });
      }
      const { tehsil: resolvedTehsilValue, tehsilOther: resolvedTehsilOther } = resolveTehsilFields(
        validatedData.tehsil,
        validatedData.tehsilOther
      );
      const routedDistrictLabel = deriveDistrictRoutingLabel(validatedData.district, resolvedTehsilValue) ?? validatedData.district;
      const applicationPayload = removeUndefined({
        propertyName: validatedData.propertyName,
        category: validatedData.category,
        totalRooms,
        address: validatedData.address,
        district: routedDistrictLabel,
        block: validatedData.block || null,
        blockOther: validatedData.blockOther || null,
        gramPanchayat: validatedData.gramPanchayat || null,
        gramPanchayatOther: validatedData.gramPanchayatOther || null,
        urbanBody: validatedData.urbanBody || null,
        urbanBodyOther: validatedData.urbanBodyOther || null,
        ward: validatedData.ward || null,
        pincode: validatedData.pincode,
        locationType: validatedData.locationType,
        telephone: validatedData.telephone || null,
        tehsil: resolvedTehsilValue,
        tehsilOther: resolvedTehsilOther || null,
        ownerName: validatedData.ownerName,
        propertyOwnership: validatedData.propertyOwnership || null,
        ownerMobile: validatedData.ownerMobile,
        ownerEmail: validatedData.ownerEmail || null,
        ownerAadhaar: validatedData.ownerAadhaar,
        guardianName: validatedData.guardianName || null,
        guardianRelation: validatedData.guardianRelation || null,
        proposedRoomRate: validatedData.proposedRoomRate,
        singleBedRoomRate: validatedData.singleBedRoomRate,
        doubleBedRoomRate: validatedData.doubleBedRoomRate,
        familySuiteRate: validatedData.familySuiteRate,
        projectType: validatedData.projectType,
        propertyArea: validatedData.propertyArea,
        singleBedRooms: validatedData.singleBedRooms,
        singleBedBeds: validatedData.singleBedBeds,
        singleBedRoomSize: validatedData.singleBedRoomSize,
        doubleBedRooms: validatedData.doubleBedRooms,
        doubleBedBeds: validatedData.doubleBedBeds,
        doubleBedRoomSize: validatedData.doubleBedRoomSize,
        familySuites: validatedData.familySuites,
        familySuiteBeds: validatedData.familySuiteBeds,
        familySuiteSize: validatedData.familySuiteSize,
        attachedWashrooms: validatedData.attachedWashrooms,
        gstin: validatedData.gstin || null,
        distanceAirport: validatedData.distanceAirport,
        distanceRailway: validatedData.distanceRailway,
        distanceCityCenter: validatedData.distanceCityCenter,
        distanceShopping: validatedData.distanceShopping,
        distanceBusStand: validatedData.distanceBusStand,
        lobbyArea: validatedData.lobbyArea,
        diningArea: validatedData.diningArea,
        parkingArea: validatedData.parkingArea || null,
        ecoFriendlyFacilities: validatedData.ecoFriendlyFacilities || null,
        differentlyAbledFacilities: validatedData.differentlyAbledFacilities || null,
        fireEquipmentDetails: validatedData.fireEquipmentDetails || null,
        nearestHospital: validatedData.nearestHospital || null,
        amenities: validatedData.amenities,
        baseFee: typeof validatedData.baseFee === "string" ? Number(validatedData.baseFee) : validatedData.baseFee,
        totalBeforeDiscounts: typeof validatedData.totalBeforeDiscounts === "string" ? Number(validatedData.totalBeforeDiscounts) : validatedData.totalBeforeDiscounts ?? null,
        validityDiscount: typeof validatedData.validityDiscount === "string" ? Number(validatedData.validityDiscount) : validatedData.validityDiscount ?? null,
        femaleOwnerDiscount: typeof validatedData.femaleOwnerDiscount === "string" ? Number(validatedData.femaleOwnerDiscount) : validatedData.femaleOwnerDiscount ?? null,
        pangiDiscount: typeof validatedData.pangiDiscount === "string" ? Number(validatedData.pangiDiscount) : validatedData.pangiDiscount ?? null,
        totalDiscount: typeof validatedData.totalDiscount === "string" ? Number(validatedData.totalDiscount) : validatedData.totalDiscount ?? null,
        totalFee: typeof validatedData.totalFee === "string" ? Number(validatedData.totalFee) : validatedData.totalFee,
        perRoomFee: typeof validatedData.perRoomFee === "string" ? Number(validatedData.perRoomFee) : validatedData.perRoomFee ?? null,
        gstAmount: typeof validatedData.gstAmount === "string" ? Number(validatedData.gstAmount) : validatedData.gstAmount ?? null,
        certificateValidityYears: validatedData.certificateValidityYears,
        isPangiSubDivision: validatedData.isPangiSubDivision ?? false,
        ownerGender: validatedData.ownerGender || null,
        latitude: validatedData.latitude || null,
        longitude: validatedData.longitude || null,
        userId
      });
      const normalizedDocuments = normalizeDocumentsForPersistence(validatedData.documents);
      const submissionPolicy = await getUploadPolicy();
      const submissionDocsError = validateDocumentsAgainstPolicy(
        normalizedDocuments,
        submissionPolicy
      );
      if (submissionDocsError) {
        return res.status(400).json({ message: submissionDocsError });
      }
      if (normalizedDocuments) {
        applicationPayload.documents = normalizedDocuments;
      }
      let application;
      const submissionMeta = {
        status: "submitted",
        submittedAt: /* @__PURE__ */ new Date(),
        // Analytics: Time spent filling the form (from client-side timer)
        formCompletionTimeSeconds: (() => {
          const val = validatedData.formCompletionTimeSeconds;
          if (typeof val !== "number") return void 0;
          if (val > 2e9) return 0;
          return val;
        })()
      };
      if (existingApp) {
        application = await storage.updateApplication(
          existingApp.id,
          removeUndefined({
            ...applicationPayload,
            ...submissionMeta
          })
        );
        if (!application) {
          throw new Error("Failed to update existing application");
        }
      } else {
        application = await storage.createApplication(
          {
            ...applicationPayload,
            ...submissionMeta
          },
          { trusted: true }
        );
      }
      if (normalizedDocuments && normalizedDocuments.length > 0) {
        await storage.deleteDocumentsByApplication(application.id);
        for (const doc of normalizedDocuments) {
          const createdDoc = await storage.createDocument({
            applicationId: application.id,
            documentType: doc.documentType,
            fileName: doc.fileName,
            filePath: doc.filePath,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType
          });
          await linkDocumentToStorage(createdDoc);
        }
      }
      const ownerForNotification = await storage.getUser(application.userId);
      queueNotification("application_submitted", {
        application,
        owner: ownerForNotification ?? null
      });
      await logApplicationAction({
        applicationId: application.id,
        actorId: userId,
        action: "owner_submitted",
        previousStatus: existingApp?.status ?? null,
        newStatus: "submitted",
        feedback: existingApp ? "Existing application finalized and submitted." : "New application submitted."
      });
      res.json({ application });
    } catch (error) {
      if (error instanceof z8.ZodError) {
        ownerLog.error({ errors: error.errors }, "[applications:create] Validation error");
        return res.status(400).json({ message: error.errors[0].message });
      }
      ownerLog.error({ err: error }, "[applications:create] Failed to create application");
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  router8.patch("/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (application.status !== "sent_back_for_corrections" && application.status !== "reverted_to_applicant" && application.status !== "reverted_by_dtdo" && application.status !== "objection_raised" && application.status !== "legacy_rc_reverted") {
        return res.status(400).json({
          message: "Application can only be updated when sent back for corrections"
        });
      }
      const validatedData = correctionUpdateSchema.parse(req.body);
      const normalizedUpdate = { ...validatedData };
      const isLegacyRC = application.applicationNumber?.startsWith("LG-HS-");
      if (isLegacyRC) {
        const normalizedDocuments2 = normalizeDocumentsForPersistence(validatedData.documents);
        const nextCorrectionCount2 = (application.correctionSubmissionCount ?? 0) + 1;
        const targetStatus2 = CORRECTION_RESUBMIT_TARGET === "dtdo" ? "dtdo_review" : "legacy_rc_review";
        const updatedApplication2 = await storage.updateApplication(id, {
          documents: normalizedDocuments2,
          status: targetStatus2,
          submittedAt: /* @__PURE__ */ new Date(),
          clarificationRequested: null,
          dtdoRemarks: null,
          districtNotes: null,
          correctionSubmissionCount: nextCorrectionCount2
        });
        await logApplicationAction({
          applicationId: id,
          actorId: userId,
          action: "correction_resubmitted",
          previousStatus: application.status,
          newStatus: targetStatus2,
          feedback: `Legacy RC correction resubmitted (cycle ${nextCorrectionCount2})`
        });
        if (normalizedDocuments2) {
          await storage.deleteDocumentsByApplication(id);
          for (const doc of normalizedDocuments2) {
            const createdDoc = await storage.createDocument({
              applicationId: id,
              documentType: doc.documentType,
              fileName: doc.fileName,
              filePath: doc.filePath,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType
            });
            await linkDocumentToStorage(createdDoc);
          }
        }
        return res.json({ message: "Legacy RC resubmitted for verification", application: updatedApplication2 });
      }
      if (normalizedUpdate.pincode !== void 0) {
        normalizedUpdate.pincode = normalizeStringField2(
          normalizedUpdate.pincode,
          application.pincode ?? "",
          10
        );
      }
      if (normalizedUpdate.telephone !== void 0) {
        normalizedUpdate.telephone = normalizeStringField2(
          normalizedUpdate.telephone,
          application.telephone ?? "",
          20
        );
      }
      if (normalizedUpdate.ownerMobile !== void 0) {
        normalizedUpdate.ownerMobile = normalizeStringField2(
          normalizedUpdate.ownerMobile,
          application.ownerMobile ?? "",
          15
        );
      }
      if (normalizedUpdate.ownerAadhaar !== void 0) {
        normalizedUpdate.ownerAadhaar = normalizeStringField2(
          normalizedUpdate.ownerAadhaar,
          application.ownerAadhaar ?? "000000000000",
          12
        );
      }
      if (normalizedUpdate.gstin !== void 0) {
        normalizedUpdate.gstin = normalizeStringField2(
          normalizedUpdate.gstin,
          application.gstin ?? "",
          15
        );
      }
      const resolveFinalNumber = (incoming, fallback) => {
        if (incoming === void 0) {
          const fallbackNumber = toNumberFromUnknown2(fallback);
          return typeof fallbackNumber === "number" ? fallbackNumber : 0;
        }
        if (typeof incoming === "number") {
          return incoming;
        }
        const coerced = toNumberFromUnknown2(incoming);
        return typeof coerced === "number" ? coerced : 0;
      };
      const finalSingleRooms = resolveFinalNumber(
        normalizedUpdate.singleBedRooms,
        application.singleBedRooms
      );
      const finalDoubleRooms = resolveFinalNumber(
        normalizedUpdate.doubleBedRooms,
        application.doubleBedRooms
      );
      const finalSuiteRooms = resolveFinalNumber(
        normalizedUpdate.familySuites,
        application.familySuites
      );
      const finalSingleRate = resolveFinalNumber(
        normalizedUpdate.singleBedRoomRate,
        application.singleBedRoomRate
      );
      const finalDoubleRate = resolveFinalNumber(
        normalizedUpdate.doubleBedRoomRate,
        application.doubleBedRoomRate
      );
      const finalSuiteRate = resolveFinalNumber(
        normalizedUpdate.familySuiteRate,
        application.familySuiteRate
      );
      if (finalSingleRooms > 0 && finalSingleRate < 100) {
        return res.status(400).json({
          message: "Single bed room rate must be at least \u20B9100 when single rooms are configured."
        });
      }
      if (finalDoubleRooms > 0 && finalDoubleRate < 100) {
        return res.status(400).json({
          message: "Double bed room rate must be at least \u20B9100 when double rooms are configured."
        });
      }
      if (finalSuiteRooms > 0 && finalSuiteRate < 100) {
        return res.status(400).json({
          message: "Family suite rate must be at least \u20B9100 when suites are configured."
        });
      }
      const normalizedDocuments = normalizeDocumentsForPersistence(validatedData.documents);
      const updatePolicy = await getUploadPolicy();
      const updateDocsError = validateDocumentsAgainstPolicy(
        normalizedDocuments,
        updatePolicy
      );
      if (updateDocsError) {
        return res.status(400).json({ message: updateDocsError });
      }
      if (normalizedDocuments) {
        normalizedUpdate.documents = normalizedDocuments;
      }
      if (Object.prototype.hasOwnProperty.call(normalizedUpdate, "tehsil") || Object.prototype.hasOwnProperty.call(normalizedUpdate, "tehsilOther")) {
        const { tehsil, tehsilOther } = resolveTehsilFields(
          normalizedUpdate.tehsil,
          normalizedUpdate.tehsilOther
        );
        normalizedUpdate.tehsil = tehsil;
        if (Object.prototype.hasOwnProperty.call(normalizedUpdate, "tehsilOther")) {
          normalizedUpdate.tehsilOther = tehsilOther;
        }
      }
      const routedDistrictForUpdate = deriveDistrictRoutingLabel(
        typeof normalizedUpdate.district === "string" ? normalizedUpdate.district : application.district,
        typeof normalizedUpdate.tehsil === "string" ? normalizedUpdate.tehsil : application.tehsil
      );
      if (routedDistrictForUpdate) {
        normalizedUpdate.district = routedDistrictForUpdate;
      }
      const decimalFields = [
        "propertyArea",
        "singleBedRoomSize",
        "singleBedRoomRate",
        "doubleBedRoomSize",
        "doubleBedRoomRate",
        "familySuiteSize",
        "familySuiteRate",
        "distanceAirport",
        "distanceRailway",
        "distanceCityCenter",
        "distanceShopping",
        "distanceBusStand",
        "lobbyArea",
        "diningArea",
        "averageRoomRate",
        "highestRoomRate",
        "lowestRoomRate",
        "totalBeforeDiscounts",
        "validityDiscount",
        "femaleOwnerDiscount",
        "pangiDiscount",
        "totalDiscount",
        "totalFee",
        "perRoomFee",
        "gstAmount"
      ];
      for (const field of decimalFields) {
        const value = normalizedUpdate[field];
        if (typeof value === "number") {
          normalizedUpdate[field] = value.toString();
        }
      }
      const singleRooms = typeof normalizedUpdate.singleBedRooms === "number" ? normalizedUpdate.singleBedRooms : application.singleBedRooms ?? 0;
      const doubleRooms = typeof normalizedUpdate.doubleBedRooms === "number" ? normalizedUpdate.doubleBedRooms : application.doubleBedRooms ?? 0;
      const familySuites = typeof normalizedUpdate.familySuites === "number" ? normalizedUpdate.familySuites : application.familySuites ?? 0;
      const singleBeds = typeof normalizedUpdate.singleBedBeds === "number" ? normalizedUpdate.singleBedBeds : application.singleBedBeds ?? ((singleRooms || 0) > 0 ? 1 : 0);
      const doubleBeds = typeof normalizedUpdate.doubleBedBeds === "number" ? normalizedUpdate.doubleBedBeds : application.doubleBedBeds ?? ((doubleRooms || 0) > 0 ? 2 : 0);
      const suiteBeds = typeof normalizedUpdate.familySuiteBeds === "number" ? normalizedUpdate.familySuiteBeds : application.familySuiteBeds ?? ((familySuites || 0) > 0 ? 4 : 0);
      const totalRooms = Number(singleRooms || 0) + Number(doubleRooms || 0) + Number(familySuites || 0);
      const totalBeds = Number(singleRooms || 0) * Number(singleBeds || 0) + Number(doubleRooms || 0) * Number(doubleBeds || 0) + Number(familySuites || 0) * Number(suiteBeds || 0);
      if (totalRooms > MAX_ROOMS_ALLOWED) {
        return res.status(400).json({
          message: `HP Homestay Rules 2025 permit a maximum of ${MAX_ROOMS_ALLOWED} rooms.`
        });
      }
      if (totalBeds > MAX_BEDS_ALLOWED) {
        return res.status(400).json({
          message: `Total beds cannot exceed ${MAX_BEDS_ALLOWED} across all room types.`
        });
      }
      const updatedAttachedWashrooms = typeof normalizedUpdate.attachedWashrooms === "number" ? normalizedUpdate.attachedWashrooms : application.attachedWashrooms ?? 0;
      if (totalRooms > 0 && Number(updatedAttachedWashrooms || 0) < totalRooms) {
        return res.status(400).json({
          message: "Every room must have its own washroom. Increase attached washrooms to at least the total number of rooms."
        });
      }
      normalizedUpdate.totalRooms = totalRooms;
      const nextCorrectionCount = (application.correctionSubmissionCount ?? 0) + 1;
      const targetStatus = CORRECTION_RESUBMIT_TARGET === "dtdo" ? "dtdo_review" : "under_scrutiny";
      const updatedApplication = await storage.updateApplication(id, {
        ...normalizedUpdate,
        status: targetStatus,
        submittedAt: /* @__PURE__ */ new Date(),
        clarificationRequested: null,
        dtdoRemarks: null,
        districtNotes: null,
        correctionSubmissionCount: nextCorrectionCount
      });
      await logApplicationAction({
        applicationId: id,
        actorId: userId,
        action: "correction_resubmitted",
        previousStatus: application.status,
        newStatus: targetStatus,
        feedback: `${CORRECTION_CONSENT_TEXT} (cycle ${nextCorrectionCount})`
      });
      if (normalizedDocuments) {
        await storage.deleteDocumentsByApplication(id);
        for (const doc of normalizedDocuments) {
          const createdDoc = await storage.createDocument({
            applicationId: id,
            documentType: doc.documentType,
            fileName: doc.fileName,
            filePath: doc.filePath,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType
          });
          await linkDocumentToStorage(createdDoc);
        }
      }
      res.json({ application: updatedApplication });
    } catch (error) {
      if (error instanceof z8.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      ownerLog.error({ err: error }, "[applications:update] Failed to update application");
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  router8.delete("/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to access this application" });
      }
      if (application.status !== "draft") {
        console.log("[DEBUG DELETE] Application status is not draft:", application.status, "id:", id);
        return res.status(400).json({
          message: "Only draft applications can be deleted. Please contact support if you need to withdraw a submitted application."
        });
      }
      await storage.deleteApplication(id);
      ownerLog.info(
        { applicationId: id, userId },
        "[applications:delete] Draft application deleted by owner"
      );
      res.json({
        success: true,
        message: "Draft deleted successfully"
      });
    } catch (error) {
      ownerLog.error(
        { err: error, applicationId: req.params.id },
        "[applications:delete] Failed to delete draft"
      );
      res.status(500).json({ message: "Failed to delete draft" });
    }
  });
  router8.post("/:id/submit", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to access this application" });
      }
      if (application.status !== "paid_pending_submit") {
        return res.status(400).json({
          message: "Application is not in a state that requires manual submission.",
          currentStatus: application.status
        });
      }
      const isServiceRequest = application.applicationKind === "delete_rooms" || application.applicationKind === "cancel_certificate" || application.serviceContext?.requestedDeletions && application.serviceContext.requestedDeletions.length > 0;
      const newStatus = isServiceRequest ? "forwarded_to_dtdo" : "submitted";
      const updatedApplication = await storage.updateApplication(id, {
        status: newStatus,
        submittedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      await logApplicationAction({
        applicationId: id,
        actorId: userId,
        action: "submitted",
        previousStatus: "paid_pending_submit",
        newStatus,
        feedback: "Manual submission confirmed by applicant after upfront payment."
      });
      res.json({
        success: true,
        message: "Application submitted successfully",
        application: updatedApplication
      });
    } catch (error) {
      ownerLog.error(
        { err: error, applicationId: req.params.id },
        "[applications:submit] Failed to manually submit application"
      );
      res.status(500).json({ message: "Failed to submit application" });
    }
  });
  return router8;
}

// server/routes/applications/service-center.ts
init_middleware();
init_storage();
init_schema();
import express18 from "express";
import { z as z9 } from "zod";
import { and as and9, desc as desc9, eq as eq35, notInArray as notInArray2 } from "drizzle-orm";
init_logger();
init_db();
var serviceCenterLog = logger.child({ module: "service-center" });
var NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1e3;
var MIN_ROOMS_AFTER_DELETE = 1;
var CLOSED_SERVICE_STATUS_LIST = ["rejected", "approved", "cancelled", "service_completed"];
var roomDeltaSchema = z9.object({
  single: z9.number().int().min(0).max(MAX_ROOMS_ALLOWED).optional(),
  double: z9.number().int().min(0).max(MAX_ROOMS_ALLOWED).optional(),
  family: z9.number().int().min(0).max(MAX_ROOMS_ALLOWED).optional()
}).partial();
var serviceRequestSchema = z9.object({
  baseApplicationId: z9.string().uuid(),
  serviceType: z9.enum(["renewal", "add_rooms", "delete_rooms", "cancel_certificate", "change_category"]),
  note: z9.string().max(1e3).optional(),
  roomDelta: roomDeltaSchema.optional()
});
var toRoomCount = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
};
var extractRoomBreakdown = (application) => {
  const single = toRoomCount(application.singleBedRooms);
  const double = toRoomCount(application.doubleBedRooms);
  const family = toRoomCount(application.familySuites);
  return {
    single,
    double,
    family,
    total: single + double + family
  };
};
var computeRoomAdjustment = (application, mode, delta) => {
  if (!delta) {
    throw new Error("Room adjustments are required for this service.");
  }
  const base = extractRoomBreakdown(application);
  const deltaSingle = toRoomCount(delta.single);
  const deltaDouble = toRoomCount(delta.double);
  const deltaFamily = toRoomCount(delta.family);
  const totalDelta = deltaSingle + deltaDouble + deltaFamily;
  if (totalDelta === 0) {
    throw new Error("Specify at least one room to add or delete.");
  }
  if (mode === "add_rooms") {
    const targetSingle2 = base.single + deltaSingle;
    const targetDouble2 = base.double + deltaDouble;
    const targetFamily2 = base.family + deltaFamily;
    const targetTotal2 = targetSingle2 + targetDouble2 + targetFamily2;
    if (targetTotal2 > MAX_ROOMS_ALLOWED) {
      throw new Error(
        `HP Homestay Rules permit a maximum of ${MAX_ROOMS_ALLOWED} rooms. This request would result in ${targetTotal2} rooms.`
      );
    }
    return {
      single: targetSingle2,
      double: targetDouble2,
      family: targetFamily2,
      total: targetTotal2,
      requestedRoomDelta: totalDelta
    };
  }
  if (deltaSingle > base.single || deltaDouble > base.double || deltaFamily > base.family) {
    throw new Error("Cannot delete more rooms than currently exist in that category.");
  }
  const targetSingle = base.single - deltaSingle;
  const targetDouble = base.double - deltaDouble;
  const targetFamily = base.family - deltaFamily;
  const targetTotal = targetSingle + targetDouble + targetFamily;
  if (targetTotal < MIN_ROOMS_AFTER_DELETE) {
    throw new Error(`At least ${MIN_ROOMS_AFTER_DELETE} room must remain after deletion.`);
  }
  const requestedDeletions = [];
  if (deltaSingle) requestedDeletions.push({ roomType: "single", count: deltaSingle });
  if (deltaDouble) requestedDeletions.push({ roomType: "double", count: deltaDouble });
  if (deltaFamily) requestedDeletions.push({ roomType: "family", count: deltaFamily });
  return {
    single: targetSingle,
    double: targetDouble,
    family: targetFamily,
    total: targetTotal,
    requestedRoomDelta: -totalDelta,
    requestedDeletions
  };
};
var buildRenewalWindow = (expiry) => {
  if (!expiry) {
    return null;
  }
  const windowStart = new Date(expiry.getTime() - NINETY_DAYS_MS);
  const now = Date.now();
  return {
    windowStart,
    windowEnd: expiry,
    inWindow: now >= windowStart.getTime() && now <= expiry.getTime()
  };
};
async function getActiveServiceRequest(parentApplicationId) {
  if (!parentApplicationId) {
    return null;
  }
  const [active] = await db.select({
    id: homestayApplications.id,
    applicationNumber: homestayApplications.applicationNumber,
    applicationKind: homestayApplications.applicationKind,
    status: homestayApplications.status,
    totalRooms: homestayApplications.totalRooms,
    createdAt: homestayApplications.createdAt,
    updatedAt: homestayApplications.updatedAt
  }).from(homestayApplications).where(
    and9(
      eq35(homestayApplications.parentApplicationId, parentApplicationId),
      notInArray2(homestayApplications.status, CLOSED_SERVICE_STATUS_LIST)
    )
  ).orderBy(desc9(homestayApplications.createdAt)).limit(1);
  return active ?? null;
}
async function buildServiceSummary(application) {
  const breakdown = extractRoomBreakdown(application);
  const expiry = application.certificateExpiryDate ? new Date(application.certificateExpiryDate) : null;
  const window = buildRenewalWindow(expiry);
  const activeRequest = await getActiveServiceRequest(application.id);
  return {
    id: application.id,
    applicationNumber: application.applicationNumber,
    propertyName: application.propertyName,
    totalRooms: breakdown.total,
    maxRoomsAllowed: MAX_ROOMS_ALLOWED,
    certificateExpiryDate: expiry ? expiry.toISOString() : null,
    renewalWindowStart: window ? window.windowStart.toISOString() : null,
    renewalWindowEnd: window ? window.windowEnd.toISOString() : null,
    canRenew: window ? window.inWindow : false,
    canAddRooms: breakdown.total < MAX_ROOMS_ALLOWED,
    canDeleteRooms: breakdown.total > MIN_ROOMS_AFTER_DELETE,
    rooms: {
      single: breakdown.single,
      double: breakdown.double,
      family: breakdown.family
    },
    activeServiceRequest: activeRequest ? {
      id: activeRequest.id,
      applicationNumber: activeRequest.applicationNumber,
      applicationKind: activeRequest.applicationKind,
      status: activeRequest.status,
      totalRooms: activeRequest.totalRooms,
      createdAt: activeRequest.createdAt
    } : null
  };
}
function createServiceCenterRouter() {
  const router8 = express18.Router();
  router8.get("/", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (!["property_owner", "admin", "super_admin"].includes(user.role)) {
        return res.status(403).json({ message: "Service Center is currently available for property owners." });
      }
      const baseApplications = user.role === "property_owner" ? (await storage.getApplicationsByUser(userId)).filter((app2) => app2.status === "approved") : (await storage.getAllApplications()).filter((app2) => app2.status === "approved");
      const summaries = await Promise.all(baseApplications.map((app2) => buildServiceSummary(app2)));
      res.json({ applications: summaries });
    } catch (error) {
      serviceCenterLog.error({ err: error, route: "GET /api/service-center" }, "Failed to fetch eligibility list");
      res.status(500).json({ message: "Failed to load service center data" });
    }
  });
  router8.post("/", requireAuth, async (req, res) => {
    try {
      const parsed2 = serviceRequestSchema.safeParse(req.body);
      if (!parsed2.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed2.error.flatten() });
      }
      const { baseApplicationId, serviceType, note, roomDelta } = parsed2.data;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.role !== "property_owner") {
        return res.status(403).json({ message: "Only property owners can initiate service requests." });
      }
      const baseApplication = await storage.getApplication(baseApplicationId);
      if (!baseApplication || baseApplication.userId !== userId) {
        return res.status(404).json({ message: "Application not found." });
      }
      if (baseApplication.status !== "approved") {
        return res.status(400).json({ message: "Only approved applications can be renewed or amended." });
      }
      const activeService = await getActiveServiceRequest(baseApplication.id);
      if (activeService) {
        return res.status(409).json({
          message: "Another service request is already in progress for this application.",
          activeRequest: activeService
        });
      }
      const expiryDate = baseApplication.certificateExpiryDate ? new Date(baseApplication.certificateExpiryDate) : null;
      const renewalWindow = buildRenewalWindow(expiryDate);
      if (serviceType === "renewal") {
        if (!expiryDate) {
          return res.status(400).json({ message: "This application does not have an active certificate yet." });
        }
        if (!renewalWindow?.inWindow) {
          return res.status(400).json({
            message: "Renewal is allowed only within 90 days of certificate expiry.",
            windowStart: renewalWindow?.windowStart.toISOString(),
            windowEnd: renewalWindow?.windowEnd.toISOString()
          });
        }
      }
      let targetRooms = extractRoomBreakdown(baseApplication);
      if (serviceType === "add_rooms" || serviceType === "delete_rooms") {
        targetRooms = computeRoomAdjustment(baseApplication, serviceType, roomDelta);
      }
      const trimmedNote = typeof note === "string" ? note.trim() : void 0;
      const serviceNotes = trimmedNote && trimmedNote.length > 0 ? trimmedNote : null;
      const serviceContextRaw = {
        requestedRooms: {
          single: targetRooms.single,
          double: targetRooms.double,
          family: targetRooms.family,
          total: targetRooms.total
        },
        requestedRoomDelta: targetRooms.requestedRoomDelta,
        requestedDeletions: targetRooms.requestedDeletions,
        renewalWindow: renewalWindow ? {
          start: renewalWindow.windowStart.toISOString(),
          end: renewalWindow.windowEnd.toISOString()
        } : void 0,
        requiresPayment: !["delete_rooms", "cancel_certificate"].includes(serviceType),
        inheritsCertificateExpiry: expiryDate ? expiryDate.toISOString() : void 0,
        note: serviceNotes ?? void 0
      };
      const serviceContext = Object.keys(serviceContextRaw).length > 0 ? serviceContextRaw : null;
      const {
        id: _ignoreId,
        applicationNumber: _ignoreNumber,
        createdAt: _ignoreCreated,
        updatedAt: _ignoreUpdated,
        parentApplicationId: _parentId,
        parentApplicationNumber: _parentNumber,
        parentCertificateNumber: _parentCert,
        inheritedCertificateValidUpto: _inheritValid,
        serviceContext: _previousContext,
        serviceNotes: _previousNotes,
        serviceRequestedAt: _previousRequested,
        certificateNumber: _certificateNumber,
        certificateIssuedDate: _certificateIssued,
        certificateExpiryDate: _certificateExpiry,
        submittedAt: _submitted,
        approvedAt: _approved,
        ...cloneSeed
      } = baseApplication;
      const baseClone = cloneSeed;
      const servicePayload = {
        ...baseClone,
        userId: baseApplication.userId,
        status: "draft",
        currentStage: null,
        currentPage: 1,
        districtOfficerId: null,
        districtReviewDate: null,
        districtNotes: null,
        daId: null,
        daReviewDate: null,
        daForwardedDate: null,
        stateOfficerId: null,
        stateReviewDate: null,
        stateNotes: null,
        dtdoId: null,
        dtdoReviewDate: null,
        dtdoRemarks: null,
        rejectionReason: null,
        clarificationRequested: null,
        siteInspectionScheduledDate: null,
        siteInspectionCompletedDate: null,
        siteInspectionOfficerId: null,
        siteInspectionNotes: null,
        siteInspectionOutcome: null,
        siteInspectionFindings: null,
        certificateNumber: null,
        certificateIssuedDate: null,
        certificateExpiryDate: null,
        submittedAt: null,
        approvedAt: null,
        applicationKind: serviceType,
        parentApplicationId: baseApplication.id,
        parentApplicationNumber: baseApplication.applicationNumber ?? void 0,
        parentCertificateNumber: baseApplication.certificateNumber ?? void 0,
        inheritedCertificateValidUpto: baseApplication.certificateExpiryDate ?? void 0,
        serviceRequestedAt: /* @__PURE__ */ new Date(),
        serviceNotes: serviceNotes ?? void 0,
        serviceContext: serviceContext ?? void 0,
        totalRooms: targetRooms.total,
        singleBedRooms: targetRooms.single,
        doubleBedRooms: targetRooms.double,
        familySuites: targetRooms.family,
        attachedWashrooms: Math.max(targetRooms.total, toRoomCount(baseApplication.attachedWashrooms))
      };
      const created = await storage.createApplication(servicePayload);
      const summary = await buildServiceSummary(baseApplication);
      res.status(201).json({
        message: "Service request created.",
        serviceRequest: {
          id: created.id,
          applicationNumber: created.applicationNumber,
          applicationKind: created.applicationKind,
          status: created.status
        },
        nextUrl: `/applications/new?draft=${created.id}`,
        summary
      });
    } catch (error) {
      if (error instanceof z9.ZodError) {
        return res.status(400).json({ message: "Invalid request", errors: error.flatten() });
      }
      if (error instanceof Error && error.message.toLowerCase().includes("room")) {
        return res.status(400).json({ message: error.message });
      }
      serviceCenterLog.error({ err: error, route: "POST /api/service-center" }, "Failed to create service request");
      res.status(500).json({ message: "Failed to create service request" });
    }
  });
  return router8;
}

// server/routes/applications/existing-owners.ts
init_middleware();
init_storage();
init_db();
init_schema();
init_districtRouting();
import express19 from "express";
import { z as z10 } from "zod";
import { and as and10, desc as desc10, eq as eq36, ne as ne3 } from "drizzle-orm";
init_systemSettings();

// server/routes/helpers/db.ts
var isPgUniqueViolation = (error, constraint) => {
  if (!error || typeof error !== "object") {
    return false;
  }
  const pgErr = error;
  if (pgErr.code !== "23505") {
    return false;
  }
  if (constraint && pgErr.constraint !== constraint) {
    return false;
  }
  return true;
};

// server/routes/applications/existing-owners.ts
init_logger();
var existingOwnersLog = logger.child({ module: "existing-owners-router" });
var uploadedFileSchema = z10.object({
  fileName: z10.string().min(1),
  filePath: z10.string().min(1),
  fileSize: z10.number().int().nonnegative().optional(),
  mimeType: z10.string().min(3).optional()
});
var existingOwnerIntakeSchema = z10.object({
  ownerName: z10.string().min(3),
  ownerMobile: z10.string().min(6),
  ownerEmail: z10.string().email().optional().or(z10.literal("")),
  propertyName: z10.string().min(3),
  district: z10.string().min(2),
  tehsil: z10.string().min(2),
  address: z10.string().min(5),
  pincode: z10.string().min(4),
  locationType: z10.enum(LEGACY_LOCATION_TYPES),
  totalRooms: z10.coerce.number().int().min(1).max(MAX_ROOMS_ALLOWED),
  guardianName: z10.string().min(3),
  rcNumber: z10.string().min(3),
  rcIssueDate: z10.string().min(4),
  rcExpiryDate: z10.string().min(4),
  notes: z10.string().optional(),
  certificateDocuments: z10.array(uploadedFileSchema).min(1),
  identityProofDocuments: z10.array(uploadedFileSchema).min(1)
});
var existingOwnerDraftSchema = z10.object({
  ownerName: z10.string().optional(),
  ownerMobile: z10.string().optional(),
  ownerEmail: z10.string().optional(),
  propertyName: z10.string().optional(),
  district: z10.string().optional(),
  tehsil: z10.string().optional(),
  address: z10.string().optional(),
  pincode: z10.string().optional(),
  locationType: z10.enum(LEGACY_LOCATION_TYPES).optional(),
  totalRooms: z10.coerce.number().int().min(1).max(MAX_ROOMS_ALLOWED).optional(),
  guardianName: z10.string().optional(),
  rcNumber: z10.string().optional(),
  rcIssueDate: z10.string().optional(),
  rcExpiryDate: z10.string().optional(),
  notes: z10.string().optional(),
  certificateDocuments: z10.array(uploadedFileSchema).optional(),
  identityProofDocuments: z10.array(uploadedFileSchema).optional()
});
var LEGACY_RC_DRAFT_STATUS = "legacy_rc_draft";
var getExistingOwnerIntakeCutoff = async () => {
  const record = await getSystemSettingRecord(EXISTING_RC_MIN_ISSUE_DATE_SETTING_KEY);
  const iso = normalizeIsoDateSetting(record?.settingValue, DEFAULT_EXISTING_RC_MIN_ISSUE_DATE);
  return parseIsoDateOrNull(iso) ?? parseIsoDateOrNull(DEFAULT_EXISTING_RC_MIN_ISSUE_DATE) ?? /* @__PURE__ */ new Date("2022-01-01");
};
var findActiveExistingOwnerRequest = async (userId) => {
  const [application] = await db.select({
    id: homestayApplications.id,
    applicationNumber: homestayApplications.applicationNumber,
    status: homestayApplications.status,
    createdAt: homestayApplications.createdAt
  }).from(homestayApplications).where(
    and10(
      eq36(homestayApplications.userId, userId),
      // Treat any renewal/legacy onboarding request as active, EXCEPT drafts
      eq36(homestayApplications.applicationKind, "renewal"),
      ne3(homestayApplications.status, LEGACY_RC_DRAFT_STATUS)
    )
  ).orderBy(desc10(homestayApplications.createdAt)).limit(1);
  return application ?? null;
};
var findDraftExistingOwnerRequest = async (userId) => {
  const [application] = await db.select().from(homestayApplications).where(
    and10(
      eq36(homestayApplications.userId, userId),
      eq36(homestayApplications.applicationKind, "renewal"),
      eq36(homestayApplications.status, LEGACY_RC_DRAFT_STATUS)
    )
  ).orderBy(desc10(homestayApplications.createdAt)).limit(1);
  return application ?? null;
};
var findApplicationByCertificateNumber = async (certificateNumber) => {
  const normalized = certificateNumber?.trim();
  if (!normalized) {
    return null;
  }
  const [application] = await db.select({
    id: homestayApplications.id,
    applicationNumber: homestayApplications.applicationNumber,
    status: homestayApplications.status,
    userId: homestayApplications.userId
  }).from(homestayApplications).where(eq36(homestayApplications.certificateNumber, normalized)).limit(1);
  return application ?? null;
};
function createExistingOwnersRouter() {
  const router8 = express19.Router();
  router8.get("/settings", requireAuth, async (_req, res) => {
    try {
      const cutoff = await getExistingOwnerIntakeCutoff();
      res.json({ minIssueDate: cutoff.toISOString() });
    } catch (error) {
      existingOwnersLog.error({ err: error, route: "GET /settings" }, "Failed to load intake settings");
      res.status(500).json({ message: "Unable to load onboarding settings" });
    }
  });
  router8.get("/active", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const application = await findActiveExistingOwnerRequest(userId);
      res.json({ application });
    } catch (error) {
      existingOwnersLog.error({ err: error, route: "GET /active" }, "Failed to load active onboarding request");
      res.status(500).json({ message: "Unable to load active onboarding request" });
    }
  });
  router8.get("/draft", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const draft = await findDraftExistingOwnerRequest(userId);
      if (!draft) {
        return res.json({ draft: null });
      }
      const draftDocs = await db.select().from(documents).where(eq36(documents.applicationId, draft.id));
      const certificateDocuments = draftDocs.filter((d) => d.documentType === "legacy_certificate").map((d) => ({
        fileName: d.fileName,
        filePath: d.filePath,
        fileSize: d.fileSize,
        mimeType: d.mimeType
      }));
      const identityProofDocuments = draftDocs.filter((d) => d.documentType === "owner_identity_proof").map((d) => ({
        fileName: d.fileName,
        filePath: d.filePath,
        fileSize: d.fileSize,
        mimeType: d.mimeType
      }));
      res.json({
        draft: {
          id: draft.id,
          values: {
            ownerName: draft.ownerName || "",
            ownerMobile: draft.ownerMobile || "",
            ownerEmail: draft.ownerEmail || "",
            propertyName: draft.propertyName || "",
            district: draft.district || "",
            tehsil: draft.tehsil || "",
            address: draft.address || "",
            pincode: draft.pincode || "",
            locationType: draft.locationType || "gp",
            totalRooms: draft.totalRooms || 1,
            guardianName: draft.guardianName || "",
            rcNumber: draft.certificateNumber || "",
            rcIssueDate: draft.certificateIssuedDate?.toISOString().slice(0, 10) || "",
            rcExpiryDate: draft.certificateExpiryDate?.toISOString().slice(0, 10) || "",
            notes: draft.serviceNotes || ""
          },
          certificateDocuments,
          identityProofDocuments,
          savedAt: draft.updatedAt?.toISOString()
        }
      });
    } catch (error) {
      existingOwnersLog.error({ err: error, route: "GET /draft" }, "Failed to load draft");
      res.status(500).json({ message: "Unable to load draft" });
    }
  });
  router8.post("/draft", requireAuth, async (req, res) => {
    try {
      const payload = existingOwnerDraftSchema.parse(req.body ?? {});
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const regSetting = await db.query.systemSettings.findFirst({
        where: eq36(systemSettings.settingKey, ENABLE_LEGACY_REGISTRATION_SETTING_KEY)
      });
      const registrationsEnabled = normalizeBooleanSetting(regSetting?.settingValue, true);
      if (!registrationsEnabled) {
        return res.status(503).json({
          message: "Existing Owner registration is currently paused. Please check back later."
        });
      }
      const now = /* @__PURE__ */ new Date();
      const existingDraft = await findDraftExistingOwnerRequest(userId);
      if (payload.rcNumber) {
        const existingCertificate = await findApplicationByCertificateNumber(payload.rcNumber);
        if (existingCertificate && (!existingDraft || existingCertificate.id !== existingDraft.id)) {
          return res.status(409).json({
            message: `This RC Number (${payload.rcNumber}) is already registered in the system.`
          });
        }
      }
      const routedDistrict = payload.district ? deriveDistrictRoutingLabel(payload.district, payload.tehsil || "") ?? payload.district : null;
      const certificateIssuedDate = payload.rcIssueDate ? parseIsoDateOrNull(payload.rcIssueDate) : null;
      const certificateExpiryDate = payload.rcExpiryDate ? parseIsoDateOrNull(payload.rcExpiryDate) : null;
      const draftValues = {
        propertyName: payload.propertyName ? trimRequiredString(payload.propertyName) : null,
        locationType: payload.locationType || "gp",
        totalRooms: payload.totalRooms || 1,
        singleBedRooms: payload.totalRooms || 1,
        doubleBedRooms: 0,
        district: routedDistrict ? trimRequiredString(routedDistrict) : null,
        tehsil: payload.tehsil ? trimRequiredString(payload.tehsil) : void 0,
        address: payload.address ? trimRequiredString(payload.address) : void 0,
        pincode: payload.pincode ? trimRequiredString(payload.pincode) : void 0,
        ownerName: payload.ownerName ? trimRequiredString(payload.ownerName) : void 0,
        ownerMobile: payload.ownerMobile ? trimRequiredString(payload.ownerMobile) : void 0,
        ownerEmail: payload.ownerEmail ? trimOptionalString(payload.ownerEmail) : void 0,
        guardianName: payload.guardianName ? trimOptionalString(payload.guardianName) : void 0,
        certificateNumber: payload.rcNumber ? trimRequiredString(payload.rcNumber) : void 0,
        certificateIssuedDate,
        certificateExpiryDate,
        serviceNotes: payload.notes ? trimOptionalString(payload.notes) : void 0,
        updatedAt: now
      };
      let draftId;
      if (existingDraft) {
        await db.update(homestayApplications).set(draftValues).where(eq36(homestayApplications.id, existingDraft.id));
        draftId = existingDraft.id;
      } else {
        const applicationNumber = await generateLegacyApplicationNumber(routedDistrict || "DRAFT");
        const [newDraft] = await db.insert(homestayApplications).values({
          userId,
          applicationNumber,
          applicationKind: "renewal",
          status: LEGACY_RC_DRAFT_STATUS,
          currentStage: LEGACY_RC_DRAFT_STATUS,
          category: "silver",
          ownerAadhaar: user.aadhaarNumber,
          ownerGender: "other",
          propertyOwnership: "owned",
          projectType: "existing_property",
          propertyArea: "50",
          familySuites: 0,
          attachedWashrooms: 1,
          createdAt: now,
          updatedAt: now,
          // Required fields with defaults for draft
          propertyName: draftValues.propertyName || "Draft Property",
          ownerName: draftValues.ownerName || user.fullName || "Draft Owner",
          ownerMobile: draftValues.ownerMobile || user.mobile || "",
          locationType: draftValues.locationType || "gp",
          totalRooms: draftValues.totalRooms || 1,
          singleBedRooms: draftValues.singleBedRooms || 1,
          doubleBedRooms: 0,
          district: draftValues.district,
          tehsil: draftValues.tehsil,
          address: draftValues.address,
          pincode: draftValues.pincode,
          ownerEmail: draftValues.ownerEmail,
          guardianName: draftValues.guardianName,
          certificateNumber: draftValues.certificateNumber,
          certificateIssuedDate: draftValues.certificateIssuedDate,
          certificateExpiryDate: draftValues.certificateExpiryDate,
          serviceNotes: draftValues.serviceNotes
        }).returning({ id: homestayApplications.id });
        draftId = newDraft.id;
      }
      await db.delete(documents).where(eq36(documents.applicationId, draftId));
      if (payload.certificateDocuments && payload.certificateDocuments.length > 0) {
        const certDocs = payload.certificateDocuments.map((file) => ({
          applicationId: draftId,
          documentType: "legacy_certificate",
          fileName: file.fileName,
          filePath: file.filePath,
          fileSize: Math.max(1, Math.round(file.fileSize ?? 0)),
          mimeType: file.mimeType || "application/pdf"
        }));
        const insertedCertDocs = await db.insert(documents).values(certDocs).returning();
        for (const doc of insertedCertDocs) {
          await linkDocumentToStorage(doc);
        }
      }
      if (payload.identityProofDocuments && payload.identityProofDocuments.length > 0) {
        const idDocs = payload.identityProofDocuments.map((file) => ({
          applicationId: draftId,
          documentType: "owner_identity_proof",
          fileName: file.fileName,
          filePath: file.filePath,
          fileSize: Math.max(1, Math.round(file.fileSize ?? 0)),
          mimeType: file.mimeType || "application/pdf"
        }));
        const insertedIdDocs = await db.insert(documents).values(idDocs).returning();
        for (const doc of insertedIdDocs) {
          await linkDocumentToStorage(doc);
        }
      }
      res.json({
        message: "Draft saved",
        draftId
      });
    } catch (error) {
      existingOwnersLog.error({ err: error, route: "POST /draft" }, "Failed to save draft");
      if (error instanceof z10.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.flatten() });
      }
      console.error("[DEBUG] POST /draft error:", error);
      res.status(500).json({ message: "Failed to save draft: " + (error instanceof Error ? error.message : String(error)) });
    }
  });
  router8.post("/", requireAuth, async (req, res) => {
    try {
      const payload = existingOwnerIntakeSchema.parse(req.body ?? {});
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const regSetting = await db.query.systemSettings.findFirst({
        where: eq36(systemSettings.settingKey, ENABLE_LEGACY_REGISTRATION_SETTING_KEY)
      });
      const registrationsEnabled = normalizeBooleanSetting(regSetting?.settingValue, true);
      if (!registrationsEnabled) {
        return res.status(503).json({
          message: "Existing Owner registration is currently paused. Please check back later."
        });
      }
      if (!user.aadhaarNumber) {
        return res.status(400).json({
          message: "Please add your Aadhaar number in profile before submitting existing owner intake."
        });
      }
      const existingDraft = await findDraftExistingOwnerRequest(userId);
      const existingActive = await findActiveExistingOwnerRequest(userId);
      if (existingActive) {
        return res.status(409).json({
          message: "We already captured your existing license request. Please wait for the Admin-RC desk to verify.",
          applicationId: existingActive.id
        });
      }
      const existingCertificate = await findApplicationByCertificateNumber(payload.rcNumber);
      if (existingCertificate && (!existingDraft || existingCertificate.id !== existingDraft.id)) {
        return res.status(409).json({
          message: `This RC Number (${payload.rcNumber}) is already registered in the system. Please contact support if this is an error.`
        });
      }
      const certificateIssuedDate = parseIsoDateOrNull(payload.rcIssueDate);
      const certificateExpiryDate = parseIsoDateOrNull(payload.rcExpiryDate);
      if (!certificateIssuedDate || !certificateExpiryDate) {
        return res.status(400).json({ message: "Invalid certificate dates provided" });
      }
      const cutoffDate = await getExistingOwnerIntakeCutoff();
      if (certificateIssuedDate < cutoffDate) {
        return res.status(400).json({
          message: `Certificates issued before ${cutoffDate.toISOString().slice(0, 10)} are not eligible for onboarding.`
        });
      }
      if (certificateExpiryDate <= certificateIssuedDate) {
        return res.status(400).json({ message: "Certificate expiry must be after the issue date" });
      }
      const now = /* @__PURE__ */ new Date();
      const routedLegacyDistrict = deriveDistrictRoutingLabel(payload.district, payload.tehsil) ?? payload.district;
      const sanitizedGuardian = trimOptionalString(payload.guardianName);
      const sanitizedNotes = trimOptionalString(payload.notes);
      const derivedAreaSqm = Math.max(50, payload.totalRooms * 30);
      let application;
      if (existingDraft) {
        const [updated] = await db.update(homestayApplications).set({
          propertyName: trimRequiredString(payload.propertyName),
          locationType: payload.locationType,
          totalRooms: payload.totalRooms,
          singleBedRooms: payload.totalRooms,
          doubleBedRooms: 0,
          familySuites: 0,
          attachedWashrooms: payload.totalRooms,
          district: trimRequiredString(routedLegacyDistrict),
          tehsil: trimRequiredString(payload.tehsil),
          address: trimRequiredString(payload.address),
          pincode: trimRequiredString(payload.pincode),
          ownerName: trimRequiredString(payload.ownerName),
          ownerMobile: trimRequiredString(payload.ownerMobile || user.mobile || ""),
          ownerEmail: trimOptionalString(payload.ownerEmail) ?? user.email ?? null,
          ownerAadhaar: user.aadhaarNumber,
          propertyArea: derivedAreaSqm.toString(),
          guardianName: sanitizedGuardian ?? null,
          rooms: [
            {
              roomType: "Declared Rooms",
              size: 0,
              count: payload.totalRooms
            }
          ],
          status: "legacy_rc_review",
          currentStage: "legacy_rc_review",
          submittedAt: now,
          updatedAt: now,
          certificateNumber: trimRequiredString(payload.rcNumber),
          certificateIssuedDate,
          certificateExpiryDate,
          parentCertificateNumber: trimRequiredString(payload.rcNumber),
          parentApplicationNumber: trimRequiredString(payload.rcNumber),
          serviceNotes: sanitizedNotes ?? `Existing owner onboarding request captured on ${now.toLocaleDateString()} with RC #${payload.rcNumber}.`,
          serviceContext: removeUndefined({
            requestedRooms: {
              total: payload.totalRooms
            },
            legacyGuardianName: sanitizedGuardian ?? void 0,
            inheritsCertificateExpiry: certificateExpiryDate.toISOString(),
            requiresPayment: false,
            note: sanitizedNotes ?? void 0,
            legacyOnboarding: true
          })
        }).where(eq36(homestayApplications.id, existingDraft.id)).returning();
        application = updated;
      } else {
        const applicationNumber = await generateLegacyApplicationNumber(routedLegacyDistrict);
        const [created] = await db.insert(homestayApplications).values({
          userId,
          applicationNumber,
          applicationKind: "renewal",
          propertyName: trimRequiredString(payload.propertyName),
          category: "silver",
          locationType: payload.locationType,
          totalRooms: payload.totalRooms,
          singleBedRooms: payload.totalRooms,
          doubleBedRooms: 0,
          familySuites: 0,
          attachedWashrooms: payload.totalRooms,
          district: trimRequiredString(routedLegacyDistrict),
          tehsil: trimRequiredString(payload.tehsil),
          block: null,
          gramPanchayat: null,
          address: trimRequiredString(payload.address),
          pincode: trimRequiredString(payload.pincode),
          ownerName: trimRequiredString(payload.ownerName),
          ownerMobile: trimRequiredString(payload.ownerMobile || user.mobile || ""),
          ownerEmail: trimOptionalString(payload.ownerEmail) ?? user.email ?? null,
          ownerAadhaar: user.aadhaarNumber,
          ownerGender: "other",
          propertyOwnership: "owned",
          projectType: "existing_property",
          propertyArea: derivedAreaSqm.toString(),
          guardianName: sanitizedGuardian ?? null,
          rooms: [
            {
              roomType: "Declared Rooms",
              size: 0,
              count: payload.totalRooms
            }
          ],
          status: "legacy_rc_review",
          currentStage: "legacy_rc_review",
          submittedAt: now,
          createdAt: now,
          updatedAt: now,
          certificateNumber: trimRequiredString(payload.rcNumber),
          certificateIssuedDate,
          certificateExpiryDate,
          parentCertificateNumber: trimRequiredString(payload.rcNumber),
          parentApplicationNumber: trimRequiredString(payload.rcNumber),
          serviceNotes: sanitizedNotes ?? `Existing owner onboarding request captured on ${now.toLocaleDateString()} with RC #${payload.rcNumber}.`,
          serviceContext: removeUndefined({
            requestedRooms: {
              total: payload.totalRooms
            },
            legacyGuardianName: sanitizedGuardian ?? void 0,
            inheritsCertificateExpiry: certificateExpiryDate.toISOString(),
            requiresPayment: false,
            note: sanitizedNotes ?? void 0,
            legacyOnboarding: true
          })
        }).returning();
        application = created;
      }
      if (!application) {
        throw new Error("Failed to create/update legacy onboarding record");
      }
      const certificateDocuments = payload.certificateDocuments.map((file) => ({
        applicationId: application.id,
        documentType: "legacy_certificate",
        fileName: file.fileName,
        filePath: file.filePath,
        fileSize: Math.max(1, Math.round(file.fileSize ?? 0)),
        mimeType: file.mimeType || "application/pdf"
      }));
      const identityProofDocuments = payload.identityProofDocuments.map((file) => ({
        applicationId: application.id,
        documentType: "owner_identity_proof",
        fileName: file.fileName,
        filePath: file.filePath,
        fileSize: Math.max(1, Math.round(file.fileSize ?? 0)),
        mimeType: file.mimeType || "application/pdf"
      }));
      if (certificateDocuments.length > 0) {
        const insertedCertificateDocs = await db.insert(documents).values(certificateDocuments).returning();
        for (const doc of insertedCertificateDocs) {
          await linkDocumentToStorage(doc);
        }
      }
      if (identityProofDocuments.length > 0) {
        const insertedIdentityDocs = await db.insert(documents).values(identityProofDocuments).returning();
        for (const doc of insertedIdentityDocs) {
          await linkDocumentToStorage(doc);
        }
      }
      res.status(201).json({
        message: "Existing owner submission received. An Admin-RC editor will verify the certificate shortly.",
        application: {
          id: application.id,
          applicationNumber: application.applicationNumber,
          status: application.status
        }
      });
    } catch (error) {
      existingOwnersLog.error({ err: error, route: "POST /" }, "Failed to capture onboarding request");
      if (isPgUniqueViolation(error, "homestay_applications_certificate_number_key")) {
        const certificateNumber = typeof req.body?.rcNumber === "string" ? req.body.rcNumber : void 0;
        if (certificateNumber) {
          const existing = await findApplicationByCertificateNumber(certificateNumber);
          if (existing) {
            return res.status(409).json({
              message: "This RC / certificate number is already registered in the system. Please open the captured request instead of submitting a new one.",
              applicationId: existing.id
            });
          }
        }
        return res.status(409).json({
          message: "This RC / certificate number already exists in the system."
        });
      }
      if (error instanceof z10.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.flatten() });
      }
      console.error("[DEBUG] POST / submit error:", error);
      res.status(500).json({ message: "Failed to submit onboarding request: " + (error instanceof Error ? error.message : String(error)) });
    }
  });
  return router8;
}

// server/routes/uploads.ts
init_middleware();
import express20 from "express";
import path11 from "path";
import fs11 from "fs";
import fsPromises4 from "fs/promises";
import { createHash } from "crypto";
init_logger();

// server/routes/helpers/uploads.ts
var resolveUploadCategory = (rawCategory, fileTypeHint, mimeTypeHint) => {
  if (typeof rawCategory === "string" && rawCategory.length > 0) {
    const normalized = rawCategory.toLowerCase();
    if (normalized.includes("photo") || normalized === "images" || normalized === "image") {
      return "photos";
    }
    if (normalized.includes("doc") || normalized === "documents" || normalized === "document") {
      return "documents";
    }
  }
  if (typeof fileTypeHint === "string" && fileTypeHint.toLowerCase().includes("photo")) {
    return "photos";
  }
  if (typeof mimeTypeHint === "string" && mimeTypeHint.toLowerCase().startsWith("image/")) {
    return "photos";
  }
  return "documents";
};
var isValidMimeType = (candidate) => /^[a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+$/.test(candidate);
var sanitizeDownloadFilename = (name) => name.replace(/[^a-zA-Z0-9.\-_\s]/g, "_");

// server/routes/uploads.ts
var uploadLog = logger.child({ module: "uploads-router" });
function createUploadRouter({ getUploadPolicy: getUploadPolicy2 }) {
  const router8 = express20.Router();
  router8.use((req, _res, next) => {
    uploadLog.info(`[upload-router] ${req.method} ${req.path} user=${req.session?.userId ?? "none"}`);
    next();
  });
  if (OBJECT_STORAGE_MODE === "local") {
    const uploadLimitMb = Math.max(1, Math.ceil(LOCAL_MAX_UPLOAD_BYTES / (1024 * 1024)));
    const rawUploadMiddleware = express20.raw({ type: "*/*", limit: `${uploadLimitMb}mb` });
    router8.put(
      "/local-object/upload/:objectId",
      uploadRateLimiter,
      requireAuth,
      rawUploadMiddleware,
      async (req, res) => {
        try {
          if (!Buffer.isBuffer(req.body)) {
            return res.status(400).json({ message: "Upload payload missing" });
          }
          const policy = await getUploadPolicy2();
          const objectId = req.params.objectId;
          const fileType = req.query.type || "document";
          const categoryHint = req.query.category;
          const providedMime = req.query.mime || req.get("Content-Type") || void 0;
          const providedName = req.query.name;
          const category = resolveUploadCategory(categoryHint, fileType, providedMime || null);
          const categoryPolicy = policy[category];
          const fileBuffer = req.body;
          const sizeBytes = fileBuffer.length;
          const maxBytes = categoryPolicy.maxFileSizeMB * 1024 * 1024;
          if (sizeBytes > maxBytes) {
            return res.status(400).json({ message: `File exceeds the ${categoryPolicy.maxFileSizeMB} MB limit` });
          }
          const normalizedMime = normalizeMime(providedMime);
          if (categoryPolicy.allowedMimeTypes.length > 0 && normalizedMime && !categoryPolicy.allowedMimeTypes.includes(normalizedMime)) {
            return res.status(400).json({
              message: `Unsupported file type "${normalizedMime}". Allowed types: ${categoryPolicy.allowedMimeTypes.join(", ")}`
            });
          }
          const extension = getExtension(providedName) || getExtension(req.query.extension) || "";
          if (categoryPolicy.allowedExtensions.length > 0 && (!extension || !categoryPolicy.allowedExtensions.includes(extension.toLowerCase()))) {
            return res.status(400).json({
              message: `Unsupported file extension. Allowed extensions: ${categoryPolicy.allowedExtensions.join(", ")}`
            });
          }
          const safeType = fileType.replace(/[^a-zA-Z0-9_-]/g, "");
          const targetDir = path11.join(LOCAL_OBJECT_DIR, `${safeType}s`);
          await fsPromises4.mkdir(targetDir, { recursive: true });
          const targetPath = path11.join(targetDir, objectId);
          await fsPromises4.writeFile(targetPath, fileBuffer);
          const objectKey = buildLocalObjectKey(safeType, objectId);
          const checksumSha256 = createHash("sha256").update(fileBuffer).digest("hex");
          await upsertStorageMetadata({
            objectKey,
            storageProvider: "local",
            fileType: safeType,
            category,
            mimeType: normalizedMime ?? "application/octet-stream",
            sizeBytes,
            checksumSha256,
            uploadedBy: req.session.userId ?? null
          });
          res.status(200).json({ success: true });
        } catch (error) {
          uploadLog.error("Local upload error", error);
          res.status(500).json({ message: "Failed to store uploaded file" });
        }
      }
    );
    router8.get("/local-object/download/:objectId", requireAuth, async (req, res) => {
      try {
        const objectId = req.params.objectId;
        const fileType = req.query.type || "document";
        const safeType = fileType.replace(/[^a-zA-Z0-9_-]/g, "");
        const filePath = path11.join(LOCAL_OBJECT_DIR, `${safeType}s`, objectId);
        await fsPromises4.access(filePath, fs11.constants.R_OK);
        void markStorageObjectAccessed(buildLocalObjectKey(safeType, objectId)).catch(
          (err) => uploadLog.error("[storage-manifest] Failed to update access timestamp:", err)
        );
        const mimeOverride = typeof req.query.mime === "string" && isValidMimeType(req.query.mime) ? req.query.mime : void 0;
        const filenameOverride = typeof req.query.filename === "string" && req.query.filename.trim().length > 0 ? sanitizeDownloadFilename(req.query.filename.trim()) : void 0;
        res.setHeader("Content-Type", mimeOverride || "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${filenameOverride || objectId}"`
        );
        const stream = fs11.createReadStream(filePath);
        stream.on("error", (err) => {
          uploadLog.error("Stream error", err);
          res.destroy(err);
        });
        stream.pipe(res);
      } catch (error) {
        uploadLog.error("Local download error", error);
        res.status(404).json({ message: "File not found" });
      }
    });
  }
  router8.get("/upload-url", requireAuth, async (req, res) => {
    try {
      const fileType = req.query.fileType || "document";
      const fileName = req.query.fileName || "";
      const fileSizeRaw = req.query.fileSize;
      const mimeType = req.query.mimeType || void 0;
      const categoryHint = req.query.category;
      const policy = await getUploadPolicy2();
      const category = resolveUploadCategory(categoryHint, fileType, mimeType || null);
      const categoryPolicy = policy[category];
      const sizeBytes = Number(fileSizeRaw);
      if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
        return res.status(400).json({ message: "File size is required for validation" });
      }
      const maxBytes = categoryPolicy.maxFileSizeMB * 1024 * 1024;
      if (sizeBytes > maxBytes) {
        return res.status(400).json({
          message: `File exceeds the ${categoryPolicy.maxFileSizeMB} MB limit`
        });
      }
      const normalizedMime = normalizeMime(mimeType);
      if (categoryPolicy.allowedMimeTypes.length > 0 && normalizedMime && !categoryPolicy.allowedMimeTypes.includes(normalizedMime)) {
        return res.status(400).json({
          message: `Unsupported file type "${normalizedMime}". Allowed types: ${categoryPolicy.allowedMimeTypes.join(", ")}`
        });
      }
      const extension = getExtension(fileName);
      if (categoryPolicy.allowedExtensions.length > 0 && (!extension || !categoryPolicy.allowedExtensions.includes(extension))) {
        return res.status(400).json({
          message: `Unsupported file extension. Allowed extensions: ${categoryPolicy.allowedExtensions.join(", ")}`
        });
      }
      const objectStorageService = new ObjectStorageService();
      const { uploadUrl, filePath } = await objectStorageService.prepareUpload(fileType);
      res.json({ uploadUrl, filePath });
    } catch (error) {
      uploadLog.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });
  router8.get("/object-storage/view", requireAuth, async (req, res) => {
    try {
      const filePath = req.query.path;
      if (!filePath) {
        return res.status(400).json({ message: "File path is required" });
      }
      const mimeOverride = typeof req.query.mime === "string" && isValidMimeType(req.query.mime) ? req.query.mime : void 0;
      const filenameOverride = typeof req.query.filename === "string" && req.query.filename.trim().length > 0 ? sanitizeDownloadFilename(req.query.filename.trim()) : void 0;
      if (OBJECT_STORAGE_MODE === "local") {
        const localUrl = new URL(`http://placeholder${filePath}`);
        const objectId = localUrl.pathname.split("/").pop();
        if (!objectId) {
          return res.status(400).json({ message: "Invalid file path" });
        }
        const fileTypeParam = localUrl.searchParams.get("type") || "document";
        const safeType = fileTypeParam.replace(/[^a-zA-Z0-9_-]/g, "");
        const diskPath = path11.join(LOCAL_OBJECT_DIR, `${safeType}s`, objectId);
        try {
          await fsPromises4.access(diskPath, fs11.constants.R_OK);
        } catch {
          return res.status(404).json({ message: "File not found" });
        }
        const stream = fs11.createReadStream(diskPath);
        stream.on("error", (err) => {
          uploadLog.error("[object-storage:view] stream error", err);
          res.destroy(err);
        });
        res.setHeader("Content-Type", mimeOverride || "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${filenameOverride || objectId}"`
        );
        stream.pipe(res);
        return;
      }
      const objectStorageService = new ObjectStorageService();
      const viewURL = await objectStorageService.getViewURL(filePath, {
        mimeType: mimeOverride,
        fileName: filenameOverride,
        forceInline: true
      });
      res.redirect(viewURL);
    } catch (error) {
      uploadLog.error("Error getting view URL:", error);
      res.status(500).json({ message: "Failed to get view URL" });
    }
  });
  return router8;
}

// server/routes/public-settings.ts
init_systemSettings();
import express21 from "express";
init_logger();
var log16 = logger.child({ module: "public-settings-router" });
function createPublicSettingsRouter() {
  const router8 = express21.Router();
  router8.get("/public", async (req, res) => {
    try {
      const [visibilitySetting, inspectionSetting, maintenanceSetting, registrationSetting, paymentPauseSetting] = await Promise.all([
        getSystemSettingRecord("service_visibility_config"),
        getSystemSettingRecord("inspection_config"),
        getSystemSettingRecord("maintenance_mode_config"),
        // MAINTENANCE_MODE_SETTING_KEY
        getSystemSettingRecord(ENABLE_LEGACY_REGISTRATION_SETTING_KEY),
        getSystemSettingRecord(PAYMENT_PIPELINE_PAUSE_SETTING_KEY)
      ]);
      const visibility = visibilitySetting?.settingValue ?? {
        homestay: true,
        hotels: false,
        guest_houses: false,
        travel_agencies: false,
        adventure_tourism: true,
        transport: false,
        restaurants: false,
        winter_sports: false
      };
      const inspection = inspectionSetting?.settingValue ?? {
        optionalKinds: []
      };
      const maintenance = maintenanceSetting?.settingValue ?? {
        enabled: false,
        accessKey: "launch2026"
      };
      const paymentPause = normalizePaymentPipelinePauseSetting(paymentPauseSetting?.settingValue);
      const bypassKey = req.query.access_key;
      const isBypassed = maintenance.enabled && bypassKey && bypassKey === maintenance.accessKey;
      res.json({
        serviceVisibility: visibility,
        inspectionConfig: inspection,
        maintenanceMode: {
          enabled: isBypassed ? false : !!maintenance.enabled
        },
        enableLegacyRegistrations: registrationSetting?.settingValue !== false,
        // Default true if null/undefined
        paymentPipelinePause: {
          enabled: paymentPause.enabled,
          message: paymentPause.enabled ? getPaymentPauseMessage(paymentPause) : null
        }
      });
    } catch (error) {
      log16.error({ err: error }, "Failed to fetch public settings");
      res.status(500).json({ message: "Failed to fetch public settings" });
    }
  });
  return router8;
}

// server/routes.ts
var routeLog5 = logger.child({ module: "routes" });
var adminHimkoshCrypto2 = new HimKoshCrypto();
var toDateOnly = (value) => {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};
var EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS = 7;
var STAFF_PROFILE_ROLES = ["dealing_assistant", "district_tourism_officer", "district_officer"];
var staffProfileSchema2 = z13.object({
  fullName: z13.string().min(3, "Full name must be at least 3 characters"),
  firstName: z13.string().min(1).optional().or(z13.literal("")),
  lastName: z13.string().min(1).optional().or(z13.literal("")),
  mobile: z13.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z13.string().email("Enter a valid email address").optional().or(z13.literal("")),
  alternatePhone: z13.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit alternate number").optional().or(z13.literal("")),
  officePhone: z13.string().regex(/^[0-9+\-()\s]{5,20}$/, "Enter a valid office contact number").optional().or(z13.literal("")),
  designation: z13.string().max(120, "Designation must be 120 characters or fewer").optional().or(z13.literal("")),
  department: z13.string().max(120, "Department must be 120 characters or fewer").optional().or(z13.literal("")),
  employeeId: z13.string().max(50, "Employee ID must be 50 characters or fewer").optional().or(z13.literal("")),
  officeAddress: z13.string().max(500, "Office address must be 500 characters or fewer").optional().or(z13.literal(""))
});
var isServiceApplicationKind = (kind) => Boolean(kind && kind !== "new_registration");
async function registerRoutes(app2) {
  app2.get("/api/auth/hpsso/validate-json", async (req, res) => {
    try {
      const token = req.query.token;
      if (!token) return res.status(400).json({ error: "Token required" });
      const ssoUserData = await validateHPSSOToken(token);
      routeLog5.info({ sso_id: ssoUserData.sso_id }, "v9: Manual token validation success in routes.ts");
      let existingUser = null;
      if (ssoUserData.mobile) {
        const usersFound = await db.select().from(users).where(eq44(users.mobile, ssoUserData.mobile)).limit(1);
        if (usersFound.length > 0) existingUser = usersFound[0];
      }
      res.json({
        success: true,
        sso_data: {
          sso_id: ssoUserData.sso_id,
          name: ssoUserData.name,
          mobile: ssoUserData.mobile,
          email: ssoUserData.email,
          district: ssoUserData.dist,
          state: ssoUserData.state,
          address: ssoUserData.loc
        },
        existing_user: existingUser ? { id: existingUser.id, username: existingUser.username } : null,
        action: existingUser ? "link_required" : "register"
      });
    } catch (error) {
      routeLog5.error({ err: error }, "Token validation failed");
      res.status(500).json({ error: error instanceof Error ? error.message : "Validation failed" });
    }
  });
  app2.use("/api/settings", createPublicSettingsRouter());
  const PgSession = connectPgSimple(session2);
  const sessionStore = new PgSession({
    pool,
    tableName: "session",
    createTableIfMissing: true,
    pruneSessionInterval: 600
    // 10 minutes (reduce DB load)
  });
  const envCookieName = process.env.SESSION_COOKIE_NAME || "hp-tourism.sid";
  const isProduction = process.env.NODE_ENV === "production";
  const envCookieSecure = isProduction || (process.env.SESSION_COOKIE_SECURE || "true").toLowerCase() === "true";
  const envCookieSameSite = (process.env.SESSION_COOKIE_SAMESITE || "lax").toLowerCase();
  const rawDomain = process.env.SESSION_COOKIE_DOMAIN;
  const envCookieDomain = rawDomain === "dev.osipl.dev" ? void 0 : rawDomain || void 0;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET environment variable must be set with at least 32 characters");
  }
  app2.use(
    session2({
      name: envCookieName,
      store: sessionStore,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      // Force cookie refresh on every response
      proxy: true,
      // Trust the reverse proxy when setting secure cookies
      cookie: {
        secure: envCookieSecure,
        sameSite: envCookieSameSite,
        httpOnly: true,
        domain: envCookieDomain,
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 7 days
      }
    })
  );
  app2.use((req, _res, next) => {
    if (req.path.startsWith("/api/admin/settings")) {
      logHttpTrace("request", {
        method: req.method,
        path: req.path,
        userId: req.session.userId ?? "none"
      });
    }
    next();
  });
  app2.get("/api/verify-session-status", (req, res) => {
    res.json({
      pid: process.pid,
      port: process.env.PORT,
      userId: req.session?.userId,
      hasSession: !!req.session,
      cookie: req.headers.cookie ? "present" : "missing",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app2.post("/api/verify-critical-password", async (req, res) => {
    try {
      const { password, username } = req.body;
      if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Password is required" });
      }
      let user;
      if (req.session?.userId) {
        user = await db.query.users.findFirst({
          where: eq44(users.id, req.session.userId)
        });
      } else if (username && typeof username === "string") {
        user = await db.query.users.findFirst({
          where: eq44(users.username, username)
        });
      }
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const isValid = await bcrypt8.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.json({ verified: true });
    } catch (error) {
      logger.error(error, "Password verification failed");
      res.status(500).json({ message: "Verification failed" });
    }
  });
  app2.get("/api/applications/track", async (req, res) => {
    try {
      const { app: appNumber, aadhaar, phone } = req.query;
      let application = null;
      if (appNumber && typeof appNumber === "string") {
        [application] = await db.select({
          id: homestayApplications.id,
          applicationNumber: homestayApplications.applicationNumber,
          propertyName: homestayApplications.propertyName,
          ownerName: homestayApplications.ownerName,
          category: homestayApplications.category,
          district: homestayApplications.district,
          totalRooms: homestayApplications.totalRooms,
          status: homestayApplications.status,
          submittedAt: homestayApplications.submittedAt,
          remarks: homestayApplications.daRemarks
        }).from(homestayApplications).where(eq44(homestayApplications.applicationNumber, appNumber)).limit(1);
      } else if (aadhaar && typeof aadhaar === "string") {
        const aadhaarLast4 = aadhaar.slice(-4);
        [application] = await db.select({
          id: homestayApplications.id,
          applicationNumber: homestayApplications.applicationNumber,
          propertyName: homestayApplications.propertyName,
          ownerName: homestayApplications.ownerName,
          category: homestayApplications.category,
          district: homestayApplications.district,
          totalRooms: homestayApplications.totalRooms,
          status: homestayApplications.status,
          submittedAt: homestayApplications.submittedAt,
          remarks: homestayApplications.daRemarks
        }).from(homestayApplications).where(sql14`${homestayApplications.ownerAadhaar} LIKE ${"%" + aadhaarLast4}`).limit(1);
      } else if (phone && typeof phone === "string") {
        [application] = await db.select({
          id: homestayApplications.id,
          applicationNumber: homestayApplications.applicationNumber,
          propertyName: homestayApplications.propertyName,
          ownerName: homestayApplications.ownerName,
          category: homestayApplications.category,
          district: homestayApplications.district,
          totalRooms: homestayApplications.totalRooms,
          status: homestayApplications.status,
          submittedAt: homestayApplications.submittedAt,
          remarks: homestayApplications.daRemarks
        }).from(homestayApplications).where(eq44(homestayApplications.ownerMobile, phone)).limit(1);
      } else {
        return res.status(400).json({ message: "Please provide app, aadhaar, or phone query parameter" });
      }
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      routeLog5.error({ err: error, stack: error?.stack }, "[track] Error tracking application");
      res.status(500).json({ message: "Failed to track application", error: error?.message });
    }
  });
  app2.get("/api/certificates/verify", async (req, res) => {
    try {
      const { cert } = req.query;
      if (!cert || typeof cert !== "string") {
        return res.status(400).json({ message: "Please provide cert query parameter" });
      }
      const [certificate] = await db.select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        propertyName: homestayApplications.propertyName,
        ownerName: homestayApplications.ownerName,
        category: homestayApplications.category,
        district: homestayApplications.district,
        issuedAt: certificates.issuedDate
      }).from(certificates).innerJoin(homestayApplications, eq44(certificates.applicationId, homestayApplications.id)).where(eq44(certificates.certificateNumber, cert)).limit(1);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      routeLog5.error("[verify] Error verifying certificate:", error);
      res.status(500).json({ message: "Failed to verify certificate" });
    }
  });
  app2.use("/api/auth/hpsso", hpssoRouter);
  app2.use("/api/auth", createAuthRouter());
  app2.use("/api/profile", createProfileRouter());
  app2.use("/api/test", test_runner_default);
  app2.use("/api/applications", createApplicationsRouter());
  app2.use("/api/payments", createPaymentsRouter());
  app2.use("/api/dtdo", createDtdoRouter());
  app2.use(
    "/api/applications",
    createOwnerApplicationsRouter({
      getRoomRateBandsSetting
    })
  );
  app2.use("/api/service-center", createServiceCenterRouter());
  app2.use("/api/existing-owners", createExistingOwnersRouter());
  const adventureSportsRoutes = (await Promise.resolve().then(() => (init_adventure_sports(), adventure_sports_exports))).default;
  app2.use("/api/adventure-sports", adventureSportsRoutes);
  const grievanceRouter = (await Promise.resolve().then(() => (init_grievances(), grievances_exports))).default;
  app2.use("/api/grievances", grievanceRouter);
  const grievanceReportsRouter = (await Promise.resolve().then(() => (init_reports(), reports_exports))).default;
  app2.use("/api/grievances/reports", grievanceReportsRouter);
  const { getMultiServiceHubEnabled: getMultiServiceHubEnabled2 } = await Promise.resolve().then(() => (init_multi_service(), multi_service_exports));
  app2.get("/api/portal/multi-service-enabled", async (_req, res) => {
    try {
      const enabled = await getMultiServiceHubEnabled2();
      res.json({ enabled });
    } catch (error) {
      routeLog5.error("[portal] Failed to check multi-service setting:", error);
      res.json({ enabled: false });
    }
  });
  app2.use("/api/admin", createAdminCommunicationsRouter());
  const adminStatsRouter = createAdminStatsRouter();
  app2.use("/api/admin", adminStatsRouter);
  const adminHimkoshRouter = createAdminHimkoshRouter();
  app2.use("/api/admin", adminHimkoshRouter);
  app2.use("/api/admin", createAdminUsersRouter());
  const adminSettingsRouter = createAdminSettingsRouter();
  app2.use("/api/admin", adminSettingsRouter);
  const publicRouter = createPublicRouter();
  app2.use("/api/public", publicRouter);
  app2.use("/api/admin", createAdminDevopsRouter());
  app2.use("/api/admin/backup", createBackupRouter());
  app2.use("/api/admin/migration", createMigrationRouter());
  app2.use("/api/admin", createAdminSeedRouter());
  app2.use("/api/admin", createAdminReportsRouter());
  app2.use("/api", createAdminLegacyRcRouter());
  const statsRouter = (await Promise.resolve().then(() => (init_stats(), stats_exports))).default;
  app2.use("/api/stats", requireAuth, statsRouter);
  const { createSendbackOtpRouter: createSendbackOtpRouter2 } = await Promise.resolve().then(() => (init_sendback_otp(), sendback_otp_exports));
  app2.use("/api/sendback-otp", createSendbackOtpRouter2());
  const { createDevToolsRouter: createDevToolsRouter2 } = await Promise.resolve().then(() => (init_dev_tools(), dev_tools_exports));
  app2.use("/api/dev", createDevToolsRouter2());
  const { createCCAvenueTestRouter: createCCAvenueTestRouter2 } = await Promise.resolve().then(() => (init_ccavenue_test(), ccavenue_test_exports));
  app2.use("/api/ccavenue/test", createCCAvenueTestRouter2());
  registerDaRoutes(app2);
  const getUploadPolicy2 = async () => {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, UPLOAD_POLICY_SETTING_KEY)).limit(1);
      if (!setting) {
        return DEFAULT_UPLOAD_POLICY;
      }
      return normalizeUploadPolicy(setting.settingValue);
    } catch (error) {
      routeLog5.error("[upload-policy] Failed to fetch policy, falling back to defaults:", error);
      return DEFAULT_UPLOAD_POLICY;
    }
  };
  app2.use("/api", createUploadRouter({ getUploadPolicy: getUploadPolicy2 }));
  const getCategoryEnforcementSetting = async () => {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, ENFORCE_CATEGORY_SETTING_KEY)).limit(1);
      if (!setting) {
        return DEFAULT_CATEGORY_ENFORCEMENT;
      }
      return normalizeCategoryEnforcementSetting(setting.settingValue);
    } catch (error) {
      routeLog5.error("[category-enforcement] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_CATEGORY_ENFORCEMENT;
    }
  };
  async function getRoomRateBandsSetting() {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, ROOM_RATE_BANDS_SETTING_KEY)).limit(1);
      if (!setting) {
        return DEFAULT_CATEGORY_RATE_BANDS;
      }
      return normalizeCategoryRateBands(setting.settingValue);
    } catch (error) {
      routeLog5.error("[room-rate-bands] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_CATEGORY_RATE_BANDS;
    }
  }
  const getRoomCalcModeSetting = async () => {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, ROOM_CALC_MODE_SETTING_KEY)).limit(1);
      if (!setting) {
        return DEFAULT_ROOM_CALC_MODE;
      }
      return normalizeRoomCalcModeSetting(setting.settingValue);
    } catch (error) {
      routeLog5.error("[room-calc-mode] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_ROOM_CALC_MODE;
    }
  };
  app2.get("/api/settings/upload-policy", requireAuth, async (_req, res) => {
    try {
      const policy = await getUploadPolicy2();
      res.json(policy);
    } catch (error) {
      routeLog5.error("[upload-policy] Failed to fetch policy:", error);
      res.status(500).json({ message: "Failed to fetch upload policy" });
    }
  });
  app2.get("/api/settings/category-enforcement", requireAuth, async (_req, res) => {
    try {
      const setting = await getCategoryEnforcementSetting();
      res.json(setting);
    } catch (error) {
      routeLog5.error("[category-enforcement] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch category enforcement setting" });
    }
  });
  app2.get("/api/settings/room-rate-bands", requireAuth, async (_req, res) => {
    try {
      const setting = await getRoomRateBandsSetting();
      res.json(setting);
    } catch (error) {
      routeLog5.error("[room-rate-bands] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch rate band setting" });
    }
  });
  app2.get("/api/settings/room-calc-mode", requireAuth, async (_req, res) => {
    try {
      const setting = await getRoomCalcModeSetting();
      res.json(setting);
    } catch (error) {
      routeLog5.error("[room-calc-mode] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch room configuration mode" });
    }
  });
  app2.patch("/api/staff/profile", requireRole(...STAFF_PROFILE_ROLES), handleStaffProfileUpdate);
  app2.patch("/api/da/profile", requireRole("dealing_assistant"), handleStaffProfileUpdate);
  app2.patch("/api/dtdo/profile", requireRole("district_tourism_officer", "district_officer"), handleStaffProfileUpdate);
  app2.post("/api/staff/change-password", requireRole(...STAFF_PROFILE_ROLES), handleStaffPasswordChange);
  app2.post("/api/da/change-password", requireRole("dealing_assistant"), handleStaffPasswordChange);
  app2.post("/api/dtdo/change-password", requireRole("district_tourism_officer", "district_officer"), handleStaffPasswordChange);
  app2.post("/api/owner/change-password", requireRole("property_owner"), handleStaffPasswordChange);
  const LEGACY_VERIFY_ALLOWED_STATUSES = /* @__PURE__ */ new Set([
    "legacy_rc_review",
    "submitted",
    "under_scrutiny",
    "forwarded_to_dtdo",
    "dtdo_review"
  ]);
  app2.post(
    "/api/applications/:id/legacy-verify",
    requireRole("dealing_assistant", "district_tourism_officer", "district_officer"),
    async (req, res) => {
      try {
        const { remarks } = req.body ?? {};
        const trimmedRemarks = typeof remarks === "string" ? remarks.trim() : "";
        const actorId = req.session.userId;
        const actor = await storage.getUser(actorId);
        const application = await storage.getApplication(req.params.id);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        if (!isServiceApplicationKind(application.applicationKind)) {
          return res.status(400).json({ message: "Legacy verification is only available for service requests." });
        }
        if (!application.status || !LEGACY_VERIFY_ALLOWED_STATUSES.has(application.status)) {
          return res.status(400).json({
            message: "Application is not in a state that allows legacy verification."
          });
        }
        if (actor?.district && !districtsMatch(actor.district, application.district)) {
          return res.status(403).json({ message: "You can only process applications from your district." });
        }
        const now = /* @__PURE__ */ new Date();
        const updates = {
          status: "approved",
          currentStage: "final",
          approvedAt: now
        };
        if (!application.certificateIssuedDate) {
          updates.certificateIssuedDate = now;
        }
        if (actor?.role === "district_tourism_officer" || actor?.role === "district_officer") {
          updates.dtdoId = actorId;
          updates.dtdoReviewDate = now;
          updates.dtdoRemarks = trimmedRemarks || application.dtdoRemarks || null;
        } else if (actor?.role === "dealing_assistant") {
          updates.daId = actorId;
          updates.daReviewDate = now;
          updates.daRemarks = trimmedRemarks || application.daRemarks || null;
        }
        const updated = await storage.updateApplication(req.params.id, updates);
        await logApplicationAction({
          applicationId: req.params.id,
          actorId,
          action: "legacy_rc_verified",
          previousStatus: application.status,
          newStatus: "approved",
          feedback: trimmedRemarks || void 0
        });
        res.json({
          message: "Legacy RC verified successfully.",
          application: updated ?? { ...application, ...updates }
        });
      } catch (error) {
        routeLog5.error("[legacy] Failed to verify application:", error);
        res.status(500).json({ message: "Failed to verify legacy request" });
      }
    }
  );
  app2.get(
    "/api/legacy/settings",
    requireRole(
      "dealing_assistant",
      "district_tourism_officer",
      "district_officer",
      "admin",
      "super_admin",
      "admin_rc"
    ),
    async (_req, res) => {
      try {
        const forwardEnabled = await getLegacyForwardEnabled();
        res.json({ forwardEnabled });
      } catch (error) {
        routeLog5.error("[legacy] Failed to load settings", error);
        res.status(500).json({ message: "Failed to load legacy settings" });
      }
    }
  );
  app2.get("/api/dtdo/applications", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
      const allApplications = await db.select().from(homestayApplications).where(districtCondition).orderBy(desc16(homestayApplications.createdAt));
      let latestCorrectionMap = null;
      if (allApplications.length > 0) {
        const applicationIds = allApplications.map((app3) => app3.id);
        const correctionRows = await db.select({
          applicationId: applicationActions.applicationId,
          createdAt: applicationActions.createdAt,
          feedback: applicationActions.feedback
        }).from(applicationActions).where(
          and16(
            inArray8(applicationActions.applicationId, applicationIds),
            eq44(applicationActions.action, "correction_resubmitted")
          )
        ).orderBy(desc16(applicationActions.createdAt));
        latestCorrectionMap = /* @__PURE__ */ new Map();
        for (const row of correctionRows) {
          if (!latestCorrectionMap.has(row.applicationId)) {
            latestCorrectionMap.set(row.applicationId, {
              createdAt: row.createdAt ?? null,
              feedback: row.feedback ?? null
            });
          }
        }
      }
      const applicationsWithDetails = await Promise.all(
        allApplications.map(async (app3) => {
          const owner = await storage.getUser(app3.userId);
          let daName = void 0;
          const daRemarks = app3.daRemarks;
          if (daRemarks || app3.daId) {
            const da = app3.daId ? await storage.getUser(app3.daId) : null;
            daName = da?.fullName || "Unknown DA";
          }
          return {
            ...app3,
            ownerName: owner?.fullName || "Unknown",
            ownerMobile: owner?.mobile || "N/A",
            daName,
            latestCorrection: latestCorrectionMap?.get(app3.id) ?? null
          };
        })
      );
      res.json(applicationsWithDetails);
    } catch (error) {
      routeLog5.error("[dtdo] Failed to fetch applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.patch("/api/dtdo/applications/:id", requireRole("district_tourism_officer", "district_officer"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.district?.toLowerCase() !== user.district?.toLowerCase()) {
        return res.status(403).json({ message: "You can only update applications in your district" });
      }
      const allowedFields = [
        "ownerName",
        "ownerGender",
        "guardianName",
        "ownerAadhaar",
        "propertyName",
        "address",
        "pincode",
        "latitude",
        "longitude",
        "singleBedRooms",
        "doubleBedRooms",
        "familySuites",
        "singleBedRoomRate",
        "doubleBedRoomRate",
        "familySuiteRate",
        "nearestHospital",
        "distanceAirport",
        "distanceRailway",
        "distanceCityCenter",
        "distanceBusStand"
      ];
      const updates = {};
      for (const field of allowedFields) {
        if (field in req.body) {
          updates[field] = req.body[field];
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      const updated = await db.update(homestayApplications).set({
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq44(homestayApplications.id, req.params.id)).returning();
      await db.insert(applicationActions).values({
        id: crypto.randomUUID(),
        applicationId: req.params.id,
        userId,
        action: "dtdo_edit",
        feedback: `DTDO updated fields: ${Object.keys(updates).join(", ")}`,
        createdAt: /* @__PURE__ */ new Date()
      });
      routeLog5.info("[dtdo] Application updated", {
        applicationId: req.params.id,
        updatedBy: user.username,
        fields: Object.keys(updates)
      });
      res.json({ success: true, application: updated[0] });
    } catch (error) {
      routeLog5.error("[dtdo] Failed to update application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  app2.get("/api/da/inspections", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (!user.district) {
        return res.status(400).json({ message: "Dealing Assistant must be assigned to a district" });
      }
      const districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
      const rows = await db.select({
        order: inspectionOrders
      }).from(inspectionOrders).innerJoin(homestayApplications, eq44(inspectionOrders.applicationId, homestayApplications.id)).where(or6(districtCondition, eq44(inspectionOrders.assignedTo, userId))).orderBy(desc16(inspectionOrders.createdAt));
      if (process.env.NODE_ENV !== "production") {
      }
      const inspectionOrdersData = rows.map((r) => r.order);
      routeLog5.info("[da] inspections query", {
        userId,
        username: user?.username,
        district: user.district,
        count: inspectionOrdersData.length,
        orderIds: inspectionOrdersData.map((order) => order.id)
      });
      const enrichedOrders = await Promise.all(
        inspectionOrdersData.map(async (order) => {
          try {
            const application = await storage.getApplication(order.applicationId);
            if (!application) {
            } else {
            }
            const owner = application ? await storage.getUser(application.userId) : null;
            const existingReport = await db.select().from(inspectionReports).where(eq44(inspectionReports.inspectionOrderId, order.id)).limit(1);
            return {
              ...order,
              application: application ? {
                id: application.id,
                applicationNumber: application.applicationNumber,
                propertyName: application.propertyName,
                category: application.category,
                status: application.status,
                dtdoRemarks: application.dtdoRemarks ?? null
              } : null,
              owner: owner ? {
                fullName: owner.fullName,
                mobile: owner.mobile
              } : null,
              reportSubmitted: existingReport.length > 0
            };
          } catch (e) {
            console.error(`[InspectionList] Error enriching order ${order.id}:`, e);
            return {
              ...order,
              application: null,
              owner: null,
              reportSubmitted: false
            };
          }
        })
      );
      res.json(enrichedOrders);
    } catch (error) {
      routeLog5.error("[da] Failed to fetch inspections:", error);
      res.status(500).json({ message: "Failed to fetch inspections" });
    }
  });
  app2.get("/api/da/inspections/:id", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const order = await db.select().from(inspectionOrders).where(eq44(inspectionOrders.id, req.params.id)).limit(1);
      if (order.length === 0) {
        return res.status(404).json({ message: "Inspection order not found" });
      }
      const application = await storage.getApplication(order[0].applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const isAssigned = order[0].assignedTo === userId;
      const isSameDistrict = user.district && districtsMatch(user.district, application.district);
      if (!isAssigned && !isSameDistrict) {
        return res.status(403).json({ message: "You can only access inspections assigned to you or within your district" });
      }
      const owner = await storage.getUser(application.userId);
      const documents4 = await storage.getDocumentsByApplication(application.id);
      const existingReport = await db.select().from(inspectionReports).where(eq44(inspectionReports.inspectionOrderId, req.params.id)).limit(1);
      res.json({
        order: order[0],
        application,
        owner: owner ? {
          fullName: owner.fullName,
          mobile: owner.mobile,
          email: owner.email
        } : null,
        documents: documents4,
        reportSubmitted: existingReport.length > 0,
        existingReport: existingReport.length > 0 ? existingReport[0] : null
      });
    } catch (error) {
      routeLog5.error("[da] Failed to fetch inspection details:", error);
      res.status(500).json({ message: "Failed to fetch inspection details" });
    }
  });
  app2.post("/api/da/inspections/:id/submit-report", requireRole("dealing_assistant"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const orderId = req.params.id;
      const order = await db.select().from(inspectionOrders).where(eq44(inspectionOrders.id, orderId)).limit(1);
      if (order.length === 0) {
        return res.status(404).json({ message: "Inspection order not found" });
      }
      if (order[0].assignedTo !== userId) {
        return res.status(403).json({ message: "You can only submit reports for inspections assigned to you" });
      }
      const existingReport = await db.select().from(inspectionReports).where(eq44(inspectionReports.inspectionOrderId, orderId)).limit(1);
      if (existingReport.length > 0) {
        return res.status(400).json({ message: "Inspection report already submitted for this order" });
      }
      const scheduledDate = new Date(order[0].inspectionDate);
      const actualInspectionDateInput = req.body.actualInspectionDate ? new Date(req.body.actualInspectionDate) : null;
      if (!actualInspectionDateInput || Number.isNaN(actualInspectionDateInput.getTime())) {
        return res.status(400).json({ message: "Actual inspection date is required" });
      }
      const normalizedScheduledDate = toDateOnly(scheduledDate);
      const normalizedActualDate = toDateOnly(actualInspectionDateInput);
      const normalizedToday = toDateOnly(/* @__PURE__ */ new Date());
      const earliestOverrideDate = toDateOnly(subDays(normalizedScheduledDate, EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS));
      const earlyOverrideEnabled = Boolean(req.body.earlyInspectionOverride);
      const earlyOverrideReason = typeof req.body.earlyInspectionReason === "string" ? req.body.earlyInspectionReason.trim() : "";
      const actualBeforeSchedule = normalizedActualDate < normalizedScheduledDate;
      if (actualBeforeSchedule) {
        if (!earlyOverrideEnabled) {
          return res.status(400).json({
            message: `Actual inspection date cannot be before the scheduled date (${format4(normalizedScheduledDate, "PPP")}). Enable the early inspection override and record a justification.`
          });
        }
        if (normalizedActualDate < earliestOverrideDate) {
          return res.status(400).json({
            message: `Early inspections can only be logged up to ${EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS} days before the scheduled date.`
          });
        }
        if (!earlyOverrideReason || earlyOverrideReason.length < 15) {
          return res.status(400).json({
            message: "Please provide a justification of at least 15 characters for the early inspection."
          });
        }
      }
      if (normalizedActualDate > normalizedToday) {
        return res.status(400).json({ message: "Actual inspection date cannot be in the future" });
      }
      const daysEarly = actualBeforeSchedule ? differenceInCalendarDays2(normalizedScheduledDate, normalizedActualDate) : 0;
      const earlyOverrideNote = actualBeforeSchedule && earlyOverrideEnabled ? `Early inspection override: Conducted ${daysEarly} day${daysEarly === 1 ? "" : "s"} before the scheduled date (${format4(normalizedScheduledDate, "PPP")}). Reason: ${earlyOverrideReason}` : null;
      const mergedMandatoryRemarks = (() => {
        const baseRemarks = req.body.mandatoryRemarks?.trim();
        if (!earlyOverrideNote) {
          return baseRemarks || null;
        }
        return baseRemarks ? `${baseRemarks}

${earlyOverrideNote}` : earlyOverrideNote;
      })();
      const reportData = {
        inspectionOrderId: orderId,
        applicationId: order[0].applicationId,
        submittedBy: userId,
        submittedDate: /* @__PURE__ */ new Date(),
        actualInspectionDate: normalizedActualDate,
        // Basic verification fields
        roomCountVerified: req.body.roomCountVerified ?? false,
        actualRoomCount: req.body.actualRoomCount || null,
        categoryMeetsStandards: req.body.categoryMeetsStandards ?? false,
        recommendedCategory: req.body.recommendedCategory || null,
        // ANNEXURE-III Checklists
        mandatoryChecklist: req.body.mandatoryChecklist || null,
        mandatoryRemarks: mergedMandatoryRemarks,
        desirableChecklist: req.body.desirableChecklist || null,
        desirableRemarks: req.body.desirableRemarks || null,
        // Legacy compatibility fields
        amenitiesVerified: req.body.amenitiesVerified || null,
        amenitiesIssues: req.body.amenitiesIssues || null,
        fireSafetyCompliant: req.body.fireSafetyCompliant ?? false,
        fireSafetyIssues: req.body.fireSafetyIssues || null,
        structuralSafety: req.body.structuralSafety ?? false,
        structuralIssues: req.body.structuralIssues || null,
        // Overall assessment
        overallSatisfactory: req.body.overallSatisfactory ?? false,
        recommendation: req.body.recommendation || "approve",
        detailedFindings: req.body.detailedFindings || "",
        // Additional fields
        inspectionPhotos: req.body.inspectionPhotos || null,
        reportDocumentUrl: req.body.reportDocumentUrl || null
      };
      const currentApplication = await storage.getApplication(order[0].applicationId);
      const [newReport] = await db.insert(inspectionReports).values(reportData).returning();
      await db.update(inspectionOrders).set({ status: "completed", updatedAt: /* @__PURE__ */ new Date() }).where(eq44(inspectionOrders.id, orderId));
      const normalizedRecommendation = (reportData.recommendation || "").toLowerCase();
      const siteInspectionOutcome = normalizedRecommendation === "raise_objections" ? "objection" : normalizedRecommendation === "approve" ? "recommended" : "completed";
      const applicationId = order[0].applicationId;
      if (!applicationId) {
        return res.status(400).json({ message: "Inspection order is missing an application reference" });
      }
      const applicationIdSafe = applicationId;
      const ackExists = await db.select({ id: applicationActions.id }).from(applicationActions).where(
        and16(
          eq44(applicationActions.applicationId, applicationIdSafe),
          eq44(applicationActions.action, "inspection_acknowledged")
        )
      ).limit(1);
      if (ackExists.length === 0) {
        await db.insert(applicationActions).values({
          applicationId: applicationIdSafe,
          officerId: userId,
          action: "inspection_acknowledged",
          previousStatus: currentApplication?.status ?? null,
          newStatus: currentApplication?.status ?? null,
          feedback: "Auto-acknowledged after inspection completion."
        });
      }
      await storage.updateApplication(applicationIdSafe, {
        status: "inspection_under_review",
        currentStage: "inspection_completed",
        siteInspectionNotes: reportData.detailedFindings || null,
        siteInspectionOutcome,
        siteInspectionCompletedDate: /* @__PURE__ */ new Date(),
        inspectionReportId: newReport.id,
        clarificationRequested: null,
        rejectionReason: null
      });
      await logApplicationAction({
        applicationId: applicationIdSafe,
        actorId: userId,
        action: "inspection_completed",
        previousStatus: currentApplication?.status ?? null,
        newStatus: "inspection_under_review",
        feedback: reportData.detailedFindings || null
      });
      res.json({
        report: newReport,
        message: "Inspection report submitted successfully"
      });
    } catch (error) {
      routeLog5.error("[da] Failed to submit inspection report:", error);
      res.status(500).json({ message: "Failed to submit inspection report" });
    }
  });
  app2.get("/api/public/properties", async (req, res) => {
    try {
      const properties = await storage.getApplicationsByStatus("approved");
      res.json({ properties });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("/api/public/settings/payment-workflow", async (_req, res) => {
    try {
      const { getPaymentWorkflow: getPaymentWorkflow2 } = await Promise.resolve().then(() => (init_systemSettings(), systemSettings_exports));
      const workflow = await getPaymentWorkflow2();
      res.json({ workflow });
    } catch (error) {
      routeLog5.error("Failed to fetch payment workflow setting:", error);
      res.json({ workflow: "on_approval" });
    }
  });
  app2.get("/api/public/settings/payment-gateway", async (_req, res) => {
    try {
      const [setting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, "default_payment_gateway")).limit(1);
      const gateway = setting?.settingValue?.gateway ?? "himkosh";
      res.json({ gateway });
    } catch (error) {
      routeLog5.error("Failed to fetch payment gateway setting:", error);
      res.json({ gateway: "himkosh" });
    }
  });
  app2.get("/api/analytics/production-stats", requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"), async (req, res) => {
    try {
      const allApplications = await db.select().from(homestayApplications);
      const realtime = allApplications.reduce(
        (acc, app3) => {
          acc.total++;
          if (app3.status === "approved") acc.approved++;
          else if (app3.status === "rejected") acc.rejected++;
          else if (app3.status === "submitted" || app3.status === "under_review" || app3.status === "payment_pending") acc.pending++;
          return acc;
        },
        { total: 0, approved: 0, rejected: 0, pending: 0 }
      );
      const [legacySetting] = await db.select().from(systemSettings).where(eq44(systemSettings.settingKey, "admin_legacy_stats")).limit(1);
      const legacy = legacySetting?.settingValue || {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
      const stats = {
        totalApplications: realtime.total + (parseInt(legacy.total) || 0),
        approvedApplications: realtime.approved + (parseInt(legacy.approved) || 0),
        rejectedApplications: realtime.rejected + (parseInt(legacy.rejected) || 0),
        pendingApplications: realtime.pending + (parseInt(legacy.pending) || 0),
        scrapedAt: /* @__PURE__ */ new Date()
        // No longer actually scraped, but keeping interface consistent
      };
      res.json({ stats });
    } catch (error) {
      routeLog5.error("Production stats error:", error);
      res.status(500).json({ message: "Failed to fetch production stats" });
    }
  });
  app2.get("/api/analytics/dashboard", requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"), async (req, res) => {
    try {
      const userId = req.session.userId;
      const currentUser = await storage.getUser(userId);
      const allApplications = await storage.getAllApplications();
      const allUsers = await storage.getAllUsers();
      const normalizeStatus = (status) => (status ?? "").trim().toLowerCase();
      const shouldScopeByDistrict = currentUser && ["dealing_assistant", "district_tourism_officer", "district_officer"].includes(currentUser.role) && typeof currentUser.district === "string" && currentUser.district.length > 0;
      const scopedApplications = shouldScopeByDistrict ? allApplications.filter((app3) => app3.district === currentUser.district) : allApplications;
      const scopedOwners = shouldScopeByDistrict ? allUsers.filter((user) => user.role === "property_owner" && user.district === currentUser.district) : allUsers.filter((user) => user.role === "property_owner");
      const byStatusNew = {
        submitted: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "submitted").length,
        under_scrutiny: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "under_scrutiny").length,
        forwarded_to_dtdo: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "forwarded_to_dtdo").length,
        dtdo_review: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "dtdo_review").length,
        inspection_scheduled: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "inspection_scheduled").length,
        inspection_under_review: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "inspection_under_review").length,
        reverted_to_applicant: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "reverted_to_applicant").length,
        approved: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "approved").length,
        rejected: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "rejected").length,
        draft: scopedApplications.filter((app3) => normalizeStatus(app3.status) === "draft").length
      };
      const byStatusLegacy = {
        pending: byStatusNew.submitted,
        district_review: byStatusNew.under_scrutiny,
        state_review: byStatusNew.dtdo_review,
        approved: byStatusNew.approved,
        rejected: byStatusNew.rejected
      };
      const byStatus = { ...byStatusNew, ...byStatusLegacy };
      const total = scopedApplications.length;
      const newApplications = byStatus.submitted;
      const byCategory = {
        diamond: scopedApplications.filter((a) => a.category === "diamond").length,
        gold: scopedApplications.filter((a) => a.category === "gold").length,
        silver: scopedApplications.filter((a) => a.category === "silver").length
      };
      const districtCounts = {};
      scopedApplications.forEach((app3) => {
        districtCounts[app3.district] = (districtCounts[app3.district] || 0) + 1;
      });
      const approvedApps = scopedApplications.filter((a) => a.status === "approved" && a.submittedAt && a.stateReviewDate);
      const processingTimes = approvedApps.map((app3) => {
        const submitted = new Date(app3.submittedAt).getTime();
        const approved = new Date(app3.stateReviewDate).getTime();
        return Math.floor((approved - submitted) / (1e3 * 60 * 60 * 24));
      });
      const avgProcessingTime = processingTimes.length > 0 ? Math.round(processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length) : 0;
      const recentApplications = [...scopedApplications].sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 10);
      res.json({
        overview: {
          total,
          newApplications,
          byStatus,
          byCategory,
          avgProcessingTime,
          totalOwners: scopedOwners.length
        },
        districts: districtCounts,
        recentApplications
      });
    } catch (error) {
      routeLog5.error("Analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });
  app2.post("/admin/seed-database", async (req, res) => {
    try {
      const existingUser = await storage.getUserByMobile("9999999991");
      if (existingUser) {
        return res.json({
          message: "Seed data already exists",
          users: 3,
          properties: 5,
          note: "Database already has test accounts. Use /api/dev/clear-all first if you want to re-seed."
        });
      }
      const owner = await storage.createUser({
        fullName: "Property Owner Demo",
        mobile: "9999999991",
        email: "owner@hptourism.com",
        password: "test123",
        role: "property_owner",
        district: "Shimla",
        aadhaarNumber: "123456789001"
      });
      const districtOfficer = await storage.createUser({
        fullName: "District Officer Shimla",
        mobile: "9999999992",
        email: "district@hptourism.gov.in",
        password: "test123",
        role: "district_officer",
        district: "Shimla",
        aadhaarNumber: "123456789002"
      });
      const stateOfficer = await storage.createUser({
        fullName: "State Tourism Officer",
        mobile: "9999999993",
        email: "state@hptourism.gov.in",
        password: "test123",
        role: "state_officer",
        district: "Shimla",
        aadhaarNumber: "123456789003"
      });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Mountain View Retreat",
        category: "diamond",
        totalRooms: 8,
        address: "Naldehra Road, Near Golf Course, Shimla",
        district: "Shimla",
        pincode: "171002",
        latitude: "31.0850",
        longitude: "77.1734",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true
        },
        rooms: [
          { roomType: "Deluxe", size: 300, count: 4 },
          { roomType: "Suite", size: 450, count: 4 }
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2340.00",
        totalFee: "15340.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: /* @__PURE__ */ new Date(),
        districtNotes: "Excellent property, meets all Diamond category standards",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: /* @__PURE__ */ new Date(),
        stateNotes: "Approved. Exemplary homestay facility",
        certificateNumber: `HP-CERT-2025-${Date.now()}`,
        certificateIssuedDate: /* @__PURE__ */ new Date(),
        certificateExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
        approvedAt: /* @__PURE__ */ new Date()
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Pine Valley Homestay",
        category: "gold",
        totalRooms: 5,
        address: "Kufri Road, Near Himalayan Nature Park, Shimla",
        district: "Shimla",
        pincode: "171012",
        latitude: "31.1048",
        longitude: "77.2659",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          mountainView: true,
          garden: true
        },
        rooms: [
          { roomType: "Standard", size: 200, count: 3 },
          { roomType: "Deluxe", size: 280, count: 2 }
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1260.00",
        totalFee: "8260.00",
        status: "state_review",
        currentStage: "state",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: /* @__PURE__ */ new Date(),
        districtNotes: "Good property, forwarded to state level",
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Cedar Wood Cottage",
        category: "silver",
        totalRooms: 3,
        address: "Mashobra Village, Near Reserve Forest, Shimla",
        district: "Shimla",
        pincode: "171007",
        latitude: "31.1207",
        longitude: "77.2291",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          garden: true
        },
        rooms: [
          { roomType: "Standard", size: 180, count: 3 }
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "720.00",
        totalFee: "4720.00",
        status: "district_review",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Himalayan Heritage Home",
        category: "gold",
        totalRooms: 6,
        address: "The Mall Road, Near Christ Church, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1048",
        longitude: "77.1734",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          laundry: true,
          roomService: true
        },
        rooms: [
          { roomType: "Standard", size: 220, count: 4 },
          { roomType: "Deluxe", size: 300, count: 2 }
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1440.00",
        totalFee: "9440.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
        districtNotes: "Heritage property, well maintained",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: /* @__PURE__ */ new Date(),
        stateNotes: "Approved for Gold category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 1}`,
        certificateIssuedDate: /* @__PURE__ */ new Date(),
        certificateExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
        approvedAt: /* @__PURE__ */ new Date()
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Snowfall Cottage",
        category: "silver",
        totalRooms: 4,
        address: "Chharabra Village, Near Wildflower Hall, Shimla",
        district: "Shimla",
        pincode: "171012",
        latitude: "31.1207",
        longitude: "77.2659",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          mountainView: true,
          petFriendly: true
        },
        rooms: [
          { roomType: "Standard", size: 190, count: 4 }
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "900.00",
        totalFee: "5900.00",
        status: "submitted",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Devdar Manor",
        category: "diamond",
        totalRooms: 10,
        address: "Near Ridge, Scandal Point, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1041",
        longitude: "77.1732",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true,
          ac: true
        },
        rooms: [
          { roomType: "Deluxe", size: 350, count: 6 },
          { roomType: "Suite", size: 500, count: 4 }
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2700.00",
        totalFee: "17700.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3),
        districtNotes: "Premium property with excellent facilities",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3),
        stateNotes: "Outstanding property. Highly recommended",
        certificateNumber: `HP-CERT-2025-${Date.now() + 2}`,
        certificateIssuedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3),
        certificateExpiryDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1e3),
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3),
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Maple Tree Homestay",
        category: "gold",
        totalRooms: 7,
        address: "Summer Hill, Near Himachal Pradesh University, Shimla",
        district: "Shimla",
        pincode: "171005",
        latitude: "31.0897",
        longitude: "77.1516",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          garden: true,
          mountainView: true
        },
        rooms: [
          { roomType: "Standard", size: 240, count: 4 },
          { roomType: "Deluxe", size: 320, count: 3 }
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1620.00",
        totalFee: "10620.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1e3),
        districtNotes: "Well-maintained property in scenic location",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
        stateNotes: "Approved for Gold category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 3}`,
        certificateIssuedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
        certificateExpiryDate: new Date(Date.now() + 358 * 24 * 60 * 60 * 1e3),
        submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1e3),
        approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Oak Ridge Villa",
        category: "silver",
        totalRooms: 5,
        address: "Sanjauli, Near State Museum, Shimla",
        district: "Shimla",
        pincode: "171006",
        latitude: "31.1125",
        longitude: "77.1914",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          garden: true
        },
        rooms: [
          { roomType: "Standard", size: 200, count: 5 }
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "900.00",
        totalFee: "5900.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
        districtNotes: "Clean and comfortable property",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3),
        stateNotes: "Approved for Silver category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 4}`,
        certificateIssuedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3),
        certificateExpiryDate: new Date(Date.now() + 359 * 24 * 60 * 60 * 1e3),
        submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3),
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Riverside Haven",
        category: "gold",
        totalRooms: 6,
        address: "Tara Devi, Near Temple Road, Shimla",
        district: "Shimla",
        pincode: "171009",
        latitude: "31.0383",
        longitude: "77.1291",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          restaurant: true,
          mountainView: true,
          tv: true
        },
        rooms: [
          { roomType: "Standard", size: 250, count: 4 },
          { roomType: "Deluxe", size: 320, count: 2 }
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1440.00",
        totalFee: "9440.00",
        status: "district_review",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Alpine Chalet",
        category: "diamond",
        totalRooms: 9,
        address: "Lakkar Bazaar, Near Ice Skating Rink, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1023",
        longitude: "77.1691",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true,
          ac: true
        },
        rooms: [
          { roomType: "Deluxe", size: 330, count: 5 },
          { roomType: "Suite", size: 480, count: 4 }
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2520.00",
        totalFee: "16520.00",
        status: "state_review",
        currentStage: "state",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
        districtNotes: "Luxury property with all modern amenities. Forwarded to state",
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3)
      }, { trusted: true });
      res.json({
        success: true,
        message: "\u2705 Database seeded successfully with 10 properties!",
        users: 3,
        properties: 10,
        approved: 5,
        inReview: 5,
        testAccounts: {
          propertyOwner: { mobile: "9999999991", password: "test123" },
          districtOfficer: { mobile: "9999999992", password: "test123" },
          stateOfficer: { mobile: "9999999993", password: "test123" }
        }
      });
    } catch (error) {
      routeLog5.error("Seed error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to seed database",
        error: error.message
      });
    }
  });
  if (process.env.NODE_ENV === "development") {
    app2.get("/api/dev/stats", async (req, res) => {
      const stats = await storage.getStats();
      res.json(stats);
    });
    app2.get("/api/dev/users", async (req, res) => {
      const users4 = await storage.getAllUsers();
      const usersWithoutPasswords = users4.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    });
    app2.post("/api/dev/clear-all", async (req, res) => {
      await storage.clearAll();
      res.json({ message: "All data cleared successfully" });
    });
    app2.post("/api/dev/seed", async (req, res) => {
      try {
        const owner = await storage.createUser({
          fullName: "Demo Property Owner",
          mobile: "9876543210",
          password: "test123",
          role: "property_owner",
          district: "Shimla"
        });
        const districtOfficer = await storage.createUser({
          fullName: "District Officer Shimla",
          mobile: "9876543211",
          password: "test123",
          role: "district_officer",
          district: "Shimla"
        });
        const stateOfficer = await storage.createUser({
          fullName: "State Tourism Officer",
          mobile: "9876543212",
          password: "test123",
          role: "state_officer"
        });
        const app1 = await storage.createApplication({
          userId: owner.id,
          propertyName: "Mountain View Homestay",
          address: "Near Mall Road, Shimla",
          district: "Shimla",
          pincode: "171001",
          ownerName: owner.fullName,
          ownerMobile: owner.mobile,
          ownerEmail: `demo${Date.now()}@example.com`,
          ownerAadhaar: "123456789012",
          totalRooms: 5,
          category: "gold",
          baseFee: "3000",
          perRoomFee: "300",
          gstAmount: "1080",
          totalFee: "7080",
          status: "approved",
          submittedAt: /* @__PURE__ */ new Date(),
          districtOfficerId: districtOfficer.id,
          districtReviewDate: /* @__PURE__ */ new Date(),
          districtNotes: "Excellent property. All criteria met.",
          stateOfficerId: stateOfficer.id,
          stateReviewDate: /* @__PURE__ */ new Date(),
          stateNotes: "Approved for tourism operations.",
          certificateNumber: "HP-HM-2025-001"
        }, { trusted: true });
        const app22 = await storage.createApplication({
          userId: owner.id,
          propertyName: "Valley Retreat",
          address: "Lower Bazaar, Shimla",
          district: "Shimla",
          pincode: "171003",
          ownerName: owner.fullName,
          ownerMobile: owner.mobile,
          ownerEmail: `demo${Date.now() + 1}@example.com`,
          ownerAadhaar: "123456789012",
          totalRooms: 3,
          category: "silver",
          baseFee: "2000",
          perRoomFee: "200",
          gstAmount: "792",
          totalFee: "3392",
          amenities: {
            wifi: true,
            parking: true,
            mountainView: true,
            hotWater: true
          },
          status: "approved",
          submittedAt: /* @__PURE__ */ new Date(),
          districtOfficerId: districtOfficer.id,
          districtReviewDate: /* @__PURE__ */ new Date(),
          districtNotes: "Good property. Meets all requirements.",
          stateOfficerId: stateOfficer.id,
          stateReviewDate: /* @__PURE__ */ new Date(),
          stateNotes: "Approved for tourism operations.",
          certificateNumber: "HP-HM-2025-002"
        }, { trusted: true });
        res.json({
          message: "Sample data created",
          users: 3,
          applications: 2
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to seed data" });
      }
    });
  }
  app2.use("/api/himkosh", routes_default);
  routeLog5.info("[himkosh] Payment gateway routes registered");
  const { default: ccavenueRouter } = await Promise.resolve().then(() => (init_ccavenue2(), ccavenue_exports));
  app2.use("/api/ccavenue", ccavenueRouter);
  routeLog5.info("[ccavenue] Payment gateway routes registered");
  startScraperScheduler();
  routeLog5.info("[scraper] Production stats scraper initialized");
  app2.use(createSettingsRouter());
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express25 from "express";
import fs12 from "fs";
import path13 from "path";
import { createServer as createViteServer, createLogger as createLogger2 } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path12 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// package.json
var package_default = {
  name: "hptourism-homestay",
  version: "1.0.6",
  private: true,
  type: "module",
  description: "HP Tourism Homestay Portal - RC8",
  license: "MIT",
  scripts: {
    dev: "PORT=${PORT:-5057} NODE_ENV=development tsx server/index.ts",
    build: "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist && esbuild server/seed.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/seed.js && cp server/himkosh/echallan.key dist/echallan.key 2>/dev/null || :",
    start: "NODE_ENV=production node dist/index.js",
    "pm2:start": "pm2 start ecosystem.config.cjs",
    "pm2:stop": "pm2 stop hptourism-rc7 || true",
    "pm2:delete": "pm2 delete hptourism-rc7 || true",
    "pm2:status": "pm2 status",
    "pm2:logs": "pm2 logs hptourism-rc7",
    check: "tsc",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx scripts/migrate.ts",
    smoke: "tsx scripts/smoke-test.ts",
    test: "vitest run",
    "test:watch": "vitest watch",
    "test:e2e": "playwright test",
    "test:quick": "playwright test tests/e2e/quick.spec.ts",
    "test:comprehensive": "E2E_COMPREHENSIVE=1 playwright test tests/e2e/comprehensive.spec.ts",
    "test:all": "npm run test && npm run test:quick",
    "security:check": "bash scripts/security-audit.sh"
  },
  dependencies: {
    "@aws-sdk/client-s3": "^3.926.0",
    "@aws-sdk/s3-request-presigner": "^3.926.0",
    "@google-cloud/storage": "^7.17.2",
    "@hookform/resolvers": "^3.10.0",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.60.5",
    "@types/archiver": "^7.0.0",
    "@types/bcrypt": "^6.0.0",
    "@types/leaflet": "^1.9.21",
    "@types/multer": "^2.0.0",
    "@types/node-cron": "^3.0.11",
    "@types/qrcode": "^1.5.6",
    "@types/react-leaflet": "^2.8.3",
    "@types/unzipper": "^0.10.11",
    archiver: "^7.0.1",
    axios: "^1.13.2",
    "axios-cookiejar-support": "^6.0.5",
    bcrypt: "^6.0.0",
    "browser-image-compression": "^2.0.2",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    cmdk: "^1.1.1",
    "connect-pg-simple": "^10.0.0",
    "connect-redis": "^9.0.0",
    csurf: "^1.11.0",
    "date-fns": "^3.6.0",
    dotenv: "^17.2.3",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "embla-carousel-react": "^8.6.0",
    express: "^4.21.2",
    "express-rate-limit": "^8.2.1",
    "express-session": "^1.18.1",
    "framer-motion": "^11.13.1",
    helmet: "^8.1.0",
    "input-otp": "^1.4.2",
    jspdf: "^3.0.3",
    "jspdf-autotable": "^5.0.2",
    leaflet: "^1.9.4",
    "lucide-react": "^0.453.0",
    memorystore: "^1.6.7",
    multer: "^2.0.2",
    nanoid: "^5.1.6",
    "next-themes": "^0.4.6",
    "node-cron": "^4.2.1",
    "node-fetch": "^3.3.2",
    passport: "^0.7.0",
    "passport-local": "^1.0.0",
    pg: "^8.16.3",
    pino: "^10.1.0",
    "pino-http": "^11.0.0",
    "pino-pretty": "^13.1.2",
    qrcode: "^1.5.4",
    react: "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-leaflet": "^4.2.1",
    "react-resizable-panels": "^2.1.7",
    recharts: "^2.15.2",
    redis: "^5.9.0",
    "rotating-file-stream": "^3.2.7",
    sharp: "^0.34.5",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "tough-cookie": "^6.0.0",
    "tw-animate-css": "^1.2.5",
    unzipper: "^0.12.3",
    vaul: "^1.1.2",
    wouter: "^3.3.5",
    ws: "^8.18.0",
    zod: "^3.24.2",
    "zod-validation-error": "^3.4.0"
  },
  devDependencies: {
    "@playwright/test": "^1.56.1",
    "@replit/vite-plugin-cartographer": "^0.3.1",
    "@replit/vite-plugin-dev-banner": "^0.1.1",
    "@replit/vite-plugin-runtime-error-modal": "^0.0.3",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.3",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/csurf": "^1.11.5",
    "@types/express": "4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/helmet": "^0.0.48",
    "@types/node": "20.16.11",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.7.0",
    autoprefixer: "^10.4.20",
    "drizzle-kit": "^0.31.8",
    esbuild: "^0.25.0",
    jsdom: "^27.2.0",
    postcss: "^8.4.47",
    supertest: "^7.1.4",
    tailwindcss: "^3.4.17",
    tsx: "^4.20.5",
    typescript: "5.6.3",
    vite: "^5.4.20",
    vitest: "^4.0.11",
    xlsx: "^0.18.5"
  },
  optionalDependencies: {
    bufferutil: "^4.0.8"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(package_default.version)
  },
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path12.resolve(import.meta.dirname, "client", "src"),
      "@shared": path12.resolve(import.meta.dirname, "shared"),
      "@assets": path12.resolve(import.meta.dirname, "client", "src", "assets")
    }
  },
  root: path12.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path12.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid5 } from "nanoid";
var viteLogger = createLogger2();
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url2 = req.originalUrl;
    try {
      const clientTemplate = path13.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs12.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid5()}"`
      );
      const page = await vite.transformIndexHtml(url2, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path13.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs12.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use((req, res, next) => {
    if (req.path === "/" || req.path.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-store");
    }
    next();
  });
  const assetsPath = path13.join(distPath, "assets");
  if (fs12.existsSync(assetsPath)) {
    app2.use(
      "/assets",
      express25.static(assetsPath, {
        fallthrough: false
      })
    );
  }
  app2.use(express25.static(distPath));
  app2.use("*", (req, res) => {
    if (req.originalUrl.match(/\.[a-zA-Z0-9]+$/)) {
      return res.status(404).send("Not Found");
    }
    res.sendFile(path13.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_config();
init_logger();
import helmet from "helmet";
var app = express26();
logger.info(
  {
    level: config.logging.level,
    pretty: config.logging.pretty,
    file: config.logging.file
  },
  "[logging] bootstrap configuration"
);
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => {
  if (app.get("env") === "development" || req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    return next();
  }
  if (!req.secure && req.headers["x-forwarded-proto"] !== "https") {
    if (req.method === "GET") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    return res.status(403).send("SSL Required");
  }
  next();
});
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://himaccess.hp.gov.in"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://himaccess.hp.gov.in"],
      imgSrc: ["'self'", "data:", "blob:", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      connectSrc: ["'self'", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      frameSrc: ["'self'", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      formAction: ["'self'", "https://himkosh.hp.nic.in", "https://himkosh.hp.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in", "https://test.ccavenue.com", "https://secure.ccavenue.com"]
    }
  },
  hsts: {
    maxAge: 31536e3,
    // 1 year (HPSDC Issue #7)
    includeSubDomains: true,
    preload: false
  },
  frameguard: {
    action: "sameorigin"
  }
}));
app.use((req, res, next) => {
  const blockedPaths = [
    "/readme.md",
    "/changelog.md",
    "/license",
    "/license.md",
    "/license.txt",
    "/authors.md",
    "/contributors.md",
    "/security.md"
  ];
  if (blockedPaths.includes(req.path.toLowerCase())) {
    return res.status(404).send("Not Found");
  }
  if (req.path.toLowerCase().startsWith("/docs/")) {
    return res.status(404).send("Not Found");
  }
  next();
});
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  next();
});
app.use(express26.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  limit: "50mb"
}));
app.use(express26.urlencoded({ extended: false, limit: "50mb" }));
app.use(globalRateLimiter);
app.use(httpLogger);
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (err.name === "ZodError" || err.errors && Array.isArray(err.errors)) {
      return res.status(400).json({
        message: "Validation Error",
        errors: err.errors
      });
    }
    if (status >= 500) {
      logger.error({ err }, "[server] Unhandled error");
    }
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = config.server.port;
  server.listen({
    port,
    host: config.server.host,
    reusePort: true
  }, () => {
    logger.info({ port, host: config.server.host }, "server started");
    startBackupScheduler().catch((err) => {
      logger.error({ err }, "Failed to start backup scheduler");
    });
  });
})();
