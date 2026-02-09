--
-- PostgreSQL database dump
--

\restrict 6yg3E7ydTdGRbiplr0ViRL4TBVdzb8XNuEWLoX8wgOFHc1dr5NXjv0PhXuU1Sty

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: application_actions; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.application_actions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    officer_id character varying NOT NULL,
    action character varying(50) NOT NULL,
    previous_status character varying(50),
    new_status character varying(50),
    feedback text,
    issues_found jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.application_actions OWNER TO hptourism_user;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.audit_logs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    action character varying(100) NOT NULL,
    details jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO hptourism_user;

--
-- Name: ccavenue_transactions; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.ccavenue_transactions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    order_id character varying(50) NOT NULL,
    tracking_id character varying(50),
    currency character varying(10) DEFAULT 'INR'::character varying,
    amount numeric(10,2) NOT NULL,
    billing_name character varying(100),
    billing_address text,
    billing_city character varying(50),
    billing_zip character varying(20),
    billing_country character varying(50),
    billing_tel character varying(20),
    billing_email character varying(100),
    order_status character varying(50) DEFAULT 'Initiated'::character varying,
    failure_message text,
    payment_mode character varying(50),
    card_name character varying(50),
    status_code character varying(10),
    status_message text,
    bank_ref_no character varying(50),
    trans_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ccavenue_transactions OWNER TO hptourism_user;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.certificates (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    certificate_number character varying(50) NOT NULL,
    certificate_type character varying(50) DEFAULT 'homestay_registration'::character varying,
    issued_date timestamp without time zone NOT NULL,
    valid_from timestamp without time zone NOT NULL,
    valid_upto timestamp without time zone NOT NULL,
    property_name character varying(255) NOT NULL,
    category character varying(20) NOT NULL,
    address text NOT NULL,
    district character varying(100) NOT NULL,
    owner_name character varying(255) NOT NULL,
    owner_mobile character varying(15) NOT NULL,
    certificate_pdf_url text,
    qr_code_data text,
    digital_signature text,
    issued_by character varying,
    status character varying(50) DEFAULT 'active'::character varying,
    revocation_reason text,
    revoked_by character varying,
    revoked_date timestamp without time zone,
    renewal_reminder_sent boolean DEFAULT false,
    renewal_application_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.certificates OWNER TO hptourism_user;

--
-- Name: clarifications; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.clarifications (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    objection_id character varying NOT NULL,
    application_id character varying NOT NULL,
    submitted_by character varying NOT NULL,
    submitted_date timestamp without time zone NOT NULL,
    clarification_text text NOT NULL,
    supporting_documents jsonb,
    reviewed_by character varying,
    reviewed_date timestamp without time zone,
    review_status character varying(50),
    review_notes text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.clarifications OWNER TO hptourism_user;

--
-- Name: ddo_codes; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.ddo_codes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    district character varying(100) NOT NULL,
    ddo_code character varying(20) NOT NULL,
    ddo_description text NOT NULL,
    treasury_code character varying(10) NOT NULL,
    head1 character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ddo_codes OWNER TO hptourism_user;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.documents (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    document_type character varying(100) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    upload_date timestamp without time zone DEFAULT now(),
    ai_verification_status character varying(50),
    ai_confidence_score numeric(5,2),
    ai_notes text,
    is_verified boolean DEFAULT false,
    verification_status character varying(50) DEFAULT 'pending'::character varying,
    verified_by character varying,
    verification_date timestamp without time zone,
    verification_notes text
);


ALTER TABLE public.documents OWNER TO hptourism_user;

--
-- Name: grievance_audit_log; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.grievance_audit_log (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    grievance_id character varying NOT NULL,
    action character varying(50) NOT NULL,
    old_value text,
    new_value text,
    performed_by character varying NOT NULL,
    performed_at timestamp without time zone DEFAULT now(),
    ip_address character varying(50),
    user_agent text
);


ALTER TABLE public.grievance_audit_log OWNER TO hptourism_user;

--
-- Name: grievance_comments; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.grievance_comments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    grievance_id character varying NOT NULL,
    user_id character varying NOT NULL,
    comment text NOT NULL,
    is_internal boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grievance_comments OWNER TO hptourism_user;

--
-- Name: grievances; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.grievances (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    ticket_number character varying(50) NOT NULL,
    ticket_type character varying(20) DEFAULT 'owner_grievance'::character varying,
    user_id character varying,
    application_id character varying,
    category character varying(50) NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying,
    status character varying(20) DEFAULT 'open'::character varying,
    subject character varying(255) NOT NULL,
    description text NOT NULL,
    assigned_to character varying,
    resolution_notes text,
    attachments jsonb,
    last_comment_at timestamp without time zone,
    last_read_by_owner timestamp without time zone,
    last_read_by_officer timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone
);


ALTER TABLE public.grievances OWNER TO hptourism_user;

--
-- Name: himkosh_transactions; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.himkosh_transactions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    dept_ref_no character varying(45) NOT NULL,
    app_ref_no character varying(20) NOT NULL,
    total_amount integer NOT NULL,
    tender_by character varying(70) NOT NULL,
    merchant_code character varying(15),
    dept_id character varying(10),
    service_code character varying(5),
    ddo character varying(12),
    head1 character varying(14),
    amount1 integer,
    head2 character varying(14),
    amount2 integer,
    head3 character varying(14),
    amount3 integer,
    head4 character varying(14),
    amount4 integer,
    head10 character varying(50),
    amount10 integer,
    period_from character varying(10),
    period_to character varying(10),
    encrypted_request text,
    request_checksum character varying(32),
    ech_txn_id character varying(10),
    bank_cin character varying(20),
    bank_name character varying(10),
    payment_date character varying(14),
    status character varying(70),
    status_cd character varying(1),
    response_checksum character varying(32),
    is_double_verified boolean DEFAULT false,
    double_verification_date timestamp without time zone,
    double_verification_data jsonb,
    challan_print_url text,
    portal_base_url text,
    transaction_status character varying(50) DEFAULT 'initiated'::character varying,
    initiated_at timestamp without time zone DEFAULT now(),
    responded_at timestamp without time zone,
    verified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_archived boolean DEFAULT false
);


ALTER TABLE public.himkosh_transactions OWNER TO hptourism_user;

--
-- Name: homestay_applications; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.homestay_applications (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    application_number character varying(50) NOT NULL,
    application_kind character varying(30) DEFAULT 'new_registration'::character varying NOT NULL,
    parent_application_id character varying,
    parent_application_number character varying(50),
    parent_certificate_number character varying(50),
    inherited_certificate_valid_upto timestamp without time zone,
    service_context jsonb,
    service_notes text,
    service_requested_at timestamp without time zone,
    application_type character varying(50) DEFAULT 'homestay'::character varying,
    water_sports_data jsonb,
    adventure_sports_data jsonb,
    property_name character varying(255) NOT NULL,
    category character varying(20) NOT NULL,
    location_type character varying(10) NOT NULL,
    total_rooms integer NOT NULL,
    district character varying(100) NOT NULL,
    district_other character varying(100),
    tehsil character varying(100) NOT NULL,
    tehsil_other character varying(100),
    block character varying(100),
    block_other character varying(100),
    gram_panchayat character varying(100),
    gram_panchayat_other character varying(100),
    urban_body character varying(200),
    urban_body_other character varying(200),
    ward character varying(50),
    address text NOT NULL,
    pincode character varying(10) NOT NULL,
    telephone character varying(20),
    fax character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    owner_name character varying(255) NOT NULL,
    owner_gender character varying(10) NOT NULL,
    owner_mobile character varying(15) NOT NULL,
    owner_email character varying(255),
    guardian_name character varying(255),
    owner_aadhaar character varying(12) NOT NULL,
    guardian_relation character varying(20) DEFAULT 'father'::character varying,
    property_ownership character varying(10) DEFAULT 'owned'::character varying NOT NULL,
    proposed_room_rate numeric(10,2),
    project_type character varying(20) NOT NULL,
    property_area numeric(10,2) NOT NULL,
    property_area_unit character varying(10) DEFAULT 'sqm'::character varying,
    single_bed_rooms integer DEFAULT 0,
    single_bed_beds integer DEFAULT 1,
    single_bed_room_size numeric(10,2),
    single_bed_room_rate numeric(10,2),
    double_bed_rooms integer DEFAULT 0,
    double_bed_beds integer DEFAULT 2,
    double_bed_room_size numeric(10,2),
    double_bed_room_rate numeric(10,2),
    family_suites integer DEFAULT 0,
    family_suite_beds integer DEFAULT 4,
    family_suite_size numeric(10,2),
    family_suite_rate numeric(10,2),
    attached_washrooms integer NOT NULL,
    gstin character varying(15),
    selected_category character varying(20),
    average_room_rate numeric(10,2),
    highest_room_rate numeric(10,2),
    lowest_room_rate numeric(10,2),
    certificate_validity_years integer DEFAULT 1,
    is_pangi_sub_division boolean DEFAULT false,
    distance_airport numeric(10,2),
    distance_railway numeric(10,2),
    distance_city_center numeric(10,2),
    distance_shopping numeric(10,2),
    distance_bus_stand numeric(10,2),
    key_location_highlight1 text,
    key_location_highlight2 text,
    lobby_area numeric(10,2),
    dining_area numeric(10,2),
    parking_area text,
    eco_friendly_facilities text,
    differently_abled_facilities text,
    fire_equipment_details text,
    nearest_hospital character varying(255),
    amenities jsonb,
    nearby_attractions jsonb,
    mandatory_checklist jsonb,
    desirable_checklist jsonb,
    rooms jsonb,
    base_fee numeric(10,2),
    total_before_discounts numeric(10,2),
    validity_discount numeric(10,2) DEFAULT '0'::numeric,
    female_owner_discount numeric(10,2) DEFAULT '0'::numeric,
    pangi_discount numeric(10,2) DEFAULT '0'::numeric,
    total_discount numeric(10,2) DEFAULT '0'::numeric,
    total_fee numeric(10,2),
    per_room_fee numeric(10,2),
    gst_amount numeric(10,2),
    status character varying(50) DEFAULT 'draft'::character varying,
    current_stage character varying(50),
    current_page integer DEFAULT 1,
    district_officer_id character varying,
    district_review_date timestamp without time zone,
    district_notes text,
    da_id character varying,
    da_review_date timestamp without time zone,
    da_forwarded_date timestamp without time zone,
    da_remarks text,
    state_officer_id character varying,
    state_review_date timestamp without time zone,
    state_notes text,
    dtdo_id character varying,
    dtdo_review_date timestamp without time zone,
    correction_submission_count integer DEFAULT 0 NOT NULL,
    revert_count integer DEFAULT 0 NOT NULL,
    dtdo_remarks text,
    rejection_reason text,
    clarification_requested text,
    site_inspection_scheduled_date timestamp without time zone,
    site_inspection_completed_date timestamp without time zone,
    site_inspection_officer_id character varying,
    site_inspection_notes text,
    site_inspection_outcome character varying(50),
    site_inspection_findings jsonb,
    ownership_proof_url text,
    aadhaar_card_url text,
    pan_card_url text,
    gst_certificate_url text,
    fire_safety_noc_url text,
    pollution_clearance_url text,
    building_plan_url text,
    property_photos_urls jsonb,
    documents jsonb,
    certificate_number character varying(50),
    certificate_issued_date timestamp without time zone,
    certificate_expiry_date timestamp without time zone,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    payment_id character varying(100),
    payment_amount numeric(10,2),
    payment_date timestamp without time zone,
    refund_date timestamp without time zone,
    refund_reason text,
    submitted_at timestamp without time zone,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    form_completion_time_seconds integer
);


ALTER TABLE public.homestay_applications OWNER TO hptourism_user;

--
-- Name: inspection_orders; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.inspection_orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    scheduled_by character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    assigned_to character varying NOT NULL,
    assigned_date timestamp without time zone NOT NULL,
    inspection_date timestamp without time zone NOT NULL,
    inspection_address text NOT NULL,
    special_instructions text,
    status character varying(50) DEFAULT 'scheduled'::character varying,
    dtdo_notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inspection_orders OWNER TO hptourism_user;

--
-- Name: inspection_reports; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.inspection_reports (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    inspection_order_id character varying NOT NULL,
    application_id character varying NOT NULL,
    submitted_by character varying NOT NULL,
    submitted_date timestamp without time zone NOT NULL,
    actual_inspection_date timestamp without time zone NOT NULL,
    room_count_verified boolean NOT NULL,
    actual_room_count integer,
    category_meets_standards boolean NOT NULL,
    recommended_category character varying(20),
    mandatory_checklist jsonb,
    mandatory_remarks text,
    desirable_checklist jsonb,
    desirable_remarks text,
    amenities_verified jsonb,
    amenities_issues text,
    fire_safety_compliant boolean,
    fire_safety_issues text,
    structural_safety boolean,
    structural_issues text,
    overall_satisfactory boolean NOT NULL,
    recommendation character varying(50) NOT NULL,
    detailed_findings text NOT NULL,
    inspection_photos jsonb,
    report_document_url text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inspection_reports OWNER TO hptourism_user;

--
-- Name: lgd_blocks; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.lgd_blocks (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lgd_code character varying(20),
    block_name character varying(100) NOT NULL,
    district_id character varying NOT NULL,
    tehsil_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lgd_blocks OWNER TO hptourism_user;

--
-- Name: lgd_districts; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.lgd_districts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lgd_code character varying(20),
    district_name character varying(100) NOT NULL,
    division_name character varying(100),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lgd_districts OWNER TO hptourism_user;

--
-- Name: lgd_gram_panchayats; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.lgd_gram_panchayats (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lgd_code character varying(20),
    gram_panchayat_name character varying(100) NOT NULL,
    district_id character varying NOT NULL,
    block_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lgd_gram_panchayats OWNER TO hptourism_user;

--
-- Name: lgd_tehsils; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.lgd_tehsils (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lgd_code character varying(20),
    tehsil_name character varying(100) NOT NULL,
    district_id character varying NOT NULL,
    tehsil_type character varying(50) DEFAULT 'tehsil'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lgd_tehsils OWNER TO hptourism_user;

--
-- Name: lgd_urban_bodies; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.lgd_urban_bodies (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lgd_code character varying(20),
    urban_body_name character varying(200) NOT NULL,
    district_id character varying NOT NULL,
    body_type character varying(50) NOT NULL,
    number_of_wards integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lgd_urban_bodies OWNER TO hptourism_user;

--
-- Name: login_otp_challenges; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.login_otp_challenges (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    otp_hash character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    consumed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.login_otp_challenges OWNER TO hptourism_user;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.notifications (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    application_id character varying,
    type character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    channels jsonb,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO hptourism_user;

--
-- Name: objections; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.objections (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    inspection_report_id character varying,
    raised_by character varying NOT NULL,
    raised_date timestamp without time zone NOT NULL,
    objection_type character varying(50) NOT NULL,
    objection_title character varying(255) NOT NULL,
    objection_description text NOT NULL,
    severity character varying(20) NOT NULL,
    response_deadline timestamp without time zone,
    status character varying(50) DEFAULT 'pending'::character varying,
    resolution_notes text,
    resolved_by character varying,
    resolved_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.objections OWNER TO hptourism_user;

--
-- Name: password_reset_challenges; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.password_reset_challenges (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    channel character varying(32) NOT NULL,
    recipient character varying(255),
    otp_hash character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    consumed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_reset_challenges OWNER TO hptourism_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.payments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    payment_type character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_gateway character varying(50),
    gateway_transaction_id character varying(255),
    payment_method character varying(50),
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_link text,
    qr_code_url text,
    payment_link_expiry_date timestamp without time zone,
    initiated_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    receipt_number character varying(100),
    receipt_url text
);


ALTER TABLE public.payments OWNER TO hptourism_user;

--
-- Name: production_stats; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.production_stats (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    total_applications integer NOT NULL,
    approved_applications integer NOT NULL,
    rejected_applications integer NOT NULL,
    pending_applications integer NOT NULL,
    scraped_at timestamp without time zone DEFAULT now(),
    source_url text
);


ALTER TABLE public.production_stats OWNER TO hptourism_user;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.reviews (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    application_id character varying NOT NULL,
    user_id character varying NOT NULL,
    rating integer NOT NULL,
    review_text text,
    is_verified_stay boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO hptourism_user;

--
-- Name: session; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO hptourism_user;

--
-- Name: storage_objects; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.storage_objects (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    object_key text NOT NULL,
    storage_provider character varying(20) DEFAULT 'local'::character varying NOT NULL,
    file_type character varying(100) NOT NULL,
    category character varying(100) DEFAULT 'general'::character varying,
    mime_type character varying(100) DEFAULT 'application/octet-stream'::character varying,
    size_bytes integer DEFAULT 0 NOT NULL,
    checksum_sha256 character varying(128),
    uploaded_by character varying,
    application_id character varying,
    document_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    last_accessed_at timestamp without time zone
);


ALTER TABLE public.storage_objects OWNER TO hptourism_user;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.support_tickets (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    ticket_number character varying(50) NOT NULL,
    applicant_id character varying NOT NULL,
    application_id character varying,
    service_type character varying(50) DEFAULT 'homestay'::character varying,
    category character varying(50) NOT NULL,
    subject character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(30) DEFAULT 'open'::character varying NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
    assigned_to character varying,
    assigned_at timestamp without time zone,
    escalated_from character varying,
    escalated_at timestamp without time zone,
    escalation_level integer DEFAULT 0,
    sla_deadline timestamp without time zone,
    sla_breach boolean DEFAULT false,
    resolved_at timestamp without time zone,
    resolved_by character varying,
    resolution_notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.support_tickets OWNER TO hptourism_user;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.system_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value jsonb NOT NULL,
    description text,
    category character varying(50) DEFAULT 'general'::character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.system_settings OWNER TO hptourism_user;

--
-- Name: ticket_actions; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.ticket_actions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    ticket_id character varying NOT NULL,
    actor_id character varying,
    actor_role character varying(30),
    action character varying(50) NOT NULL,
    previous_status character varying(30),
    new_status character varying(30),
    previous_priority character varying(20),
    new_priority character varying(20),
    previous_assignee character varying,
    new_assignee character varying,
    notes text,
    metadata jsonb,
    ip_address character varying(45),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ticket_actions OWNER TO hptourism_user;

--
-- Name: ticket_messages; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.ticket_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    ticket_id character varying NOT NULL,
    sender_id character varying NOT NULL,
    sender_role character varying(30) NOT NULL,
    message text NOT NULL,
    attachments jsonb,
    is_internal boolean DEFAULT false,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ticket_messages OWNER TO hptourism_user;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.user_profiles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    full_name character varying(255) NOT NULL,
    gender character varying(10) NOT NULL,
    aadhaar_number character varying(12),
    mobile character varying(15) NOT NULL,
    email character varying(255),
    district character varying(100),
    tehsil character varying(100),
    block character varying(100),
    gram_panchayat character varying(100),
    urban_body character varying(200),
    ward character varying(50),
    address text,
    pincode character varying(10),
    telephone character varying(20),
    fax character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_profiles OWNER TO hptourism_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: hptourism_user
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    mobile character varying(15) NOT NULL,
    full_name text NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    username character varying(50),
    email character varying(255),
    alternate_phone character varying(15),
    designation character varying(100),
    department character varying(100),
    employee_id character varying(50),
    office_address text,
    office_phone character varying(15),
    role character varying(50) DEFAULT 'property_owner'::character varying NOT NULL,
    aadhaar_number character varying(12),
    sso_id character varying(50),
    district character varying(100),
    password text,
    enabled_services jsonb DEFAULT '["homestay"]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    signature_url text
);


ALTER TABLE public.users OWNER TO hptourism_user;

--
-- Data for Name: application_actions; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.application_actions (id, application_id, officer_id, action, previous_status, new_status, feedback, issues_found, created_at) FROM stdin;
9726c69a-103d-478b-80df-ad745c991b81	4356f133-c79d-44c9-930d-7e7db7e864d0	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B103651). Application submitted.	\N	2026-02-01 15:42:52.370252
c9ff2041-7e3d-47a0-90ef-42a764c25405	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	e97e2f28-6ee5-49ca-be86-419e85dd5700	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B103664). Application submitted.	\N	2026-02-01 15:47:58.546805
6d562228-b4d9-4af4-b9a8-0b31224e6e5a	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B103673). Application submitted.	\N	2026-02-01 15:51:36.457962
15ce6ac6-d4c2-483e-a8be-1eea1aefe441	2f152463-5a74-4dd6-9043-45578b983f6a	a1788232-8f83-4c3d-939d-5bce9c6a6a09	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B103686). Application submitted.	\N	2026-02-01 15:59:08.135449
8472e022-3168-416b-8ef2-32c7b6d0e40e	0e59202e-125c-4400-8dee-43737b4e17c1	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B103751). Application submitted.	\N	2026-02-01 16:27:30.219476
e3ba3b59-121b-429f-aca6-f63ee44060c4	74072eb5-03a8-4895-9908-07168c9b9399	432707b6-ac17-43b4-b021-695148c341f9	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B125247). Application submitted.	\N	2026-02-03 17:56:43.866641
0c7fc38c-2671-4c88-a595-f6cf79e8de2b	74072eb5-03a8-4895-9908-07168c9b9399	a9a95a58-c2be-4175-83ed-7352a709c3c8	start_scrutiny	submitted	under_scrutiny	\N	\N	2026-02-03 17:57:34.772644
61508094-f482-4e2c-9c73-9fe3ea9c3cac	74072eb5-03a8-4895-9908-07168c9b9399	a9a95a58-c2be-4175-83ed-7352a709c3c8	forwarded_to_dtdo	under_scrutiny	forwarded_to_dtdo	Add your overall scrutiny remarks before forwarding this application to the District Tourism Development Officer.	\N	2026-02-03 17:57:51.066105
b5050315-5c8d-4b22-9ffb-a68f8d716b98	990f469b-088f-4d7e-9166-97646d526b4e	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	payment_verified	draft	submitted	Registration fee paid via HimKosh (CIN: A26B125852). Application submitted.	\N	2026-02-04 03:49:49.422748
8dfbe037-021b-40bc-a30d-c96a3ad60f0e	990f469b-088f-4d7e-9166-97646d526b4e	a9a95a58-c2be-4175-83ed-7352a709c3c8	start_scrutiny	submitted	under_scrutiny	\N	\N	2026-02-04 03:50:16.900612
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.audit_logs (id, user_id, action, details, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: ccavenue_transactions; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.ccavenue_transactions (id, application_id, order_id, tracking_id, currency, amount, billing_name, billing_address, billing_city, billing_zip, billing_country, billing_tel, billing_email, order_status, failure_message, payment_mode, card_name, status_code, status_message, bank_ref_no, trans_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.certificates (id, application_id, certificate_number, certificate_type, issued_date, valid_from, valid_upto, property_name, category, address, district, owner_name, owner_mobile, certificate_pdf_url, qr_code_data, digital_signature, issued_by, status, revocation_reason, revoked_by, revoked_date, renewal_reminder_sent, renewal_application_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: clarifications; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.clarifications (id, objection_id, application_id, submitted_by, submitted_date, clarification_text, supporting_documents, reviewed_by, reviewed_date, review_status, review_notes, updated_at) FROM stdin;
\.


--
-- Data for Name: ddo_codes; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.ddo_codes (id, district, ddo_code, ddo_description, treasury_code, head1, is_active, created_at, updated_at) FROM stdin;
3e17fad9-a314-45c4-9011-62715b800447	Chamba	CHM00-532	D.T.D.O. CHAMBA	CHM00	\N	t	2026-01-08 00:45:19.964858	2026-01-08 00:45:19.964858
105c6a4c-2835-4bec-93ae-42f397d4ff65	Bharmour	CHM01-001	S.D.O.(CIVIL) BHARMOUR	CHM01	\N	t	2026-01-08 00:45:19.969389	2026-01-08 00:45:19.969389
20d73826-0cbe-4c2a-8ab7-65ad871f53eb	Shimla (Central)	CTO00-068	A.C. (TOURISM) SHIMLA	CTO00	\N	t	2026-01-08 00:45:19.973877	2026-01-08 00:45:19.973877
e649d099-d4ad-43b0-adc8-6c56a5948ba5	Hamirpur	HMR00-053	DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)	HMR00	\N	t	2026-01-08 00:45:19.978198	2026-01-08 00:45:19.978198
341b6fdb-90b6-4aef-8be1-e7aef76e1007	Una	HMR00-053	DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)	HMR00	\N	t	2026-01-08 00:45:19.981531	2026-01-08 00:45:19.981531
b6b13efb-7a04-4491-96ee-27780a158570	Kullu (Dhalpur)	KLU00-532	DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR	KLU00	\N	t	2026-01-08 00:45:19.984693	2026-01-08 00:45:19.984693
b68125ad-74dd-4823-98aa-f356fd207c0a	Kangra	KNG00-532	DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA	KNG00	\N	t	2026-01-08 00:45:19.988087	2026-01-08 00:45:19.988087
c22224d4-fd67-47a1-a052-b1f24714045d	Kinnaur	KNR00-031	DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO	KNR00	\N	t	2026-01-08 00:45:19.991257	2026-01-08 00:45:19.991257
653ac4fe-f953-403a-a24f-e3ebb706db53	Lahaul-Spiti (Kaza)	KZA00-011	PO ITDP KAZA	KZA00	\N	t	2026-01-08 00:45:19.994623	2026-01-08 00:45:19.994623
755d95b8-015b-4cff-8776-4a4a8d0dd739	Lahaul	LHL00-017	DISTRICT TOURISM DEVELOPMENT OFFICER	LHL00	\N	t	2026-01-08 00:45:19.997599	2026-01-08 00:45:19.997599
1cb81eb0-4d5d-49b4-a229-19e30b4e4503	Mandi	MDI00-532	DIV. TOURISM DEV. OFFICER MANDI	MDI00	\N	t	2026-01-08 00:45:20.009625	2026-01-08 00:45:20.009625
e02ef70f-a43f-4bcb-8e6f-bf3abe6e7dc0	Pangi	PNG00-003	PROJECT OFFICER ITDP PANGI	PNG00	\N	t	2026-01-08 00:45:20.012551	2026-01-08 00:45:20.012551
d029a110-a870-4763-b290-b924e32663a2	Shimla	SML00-532	DIVISIONAL TOURISM OFFICER SHIMLA	SML00	\N	t	2026-01-08 00:45:20.015202	2026-01-08 00:45:20.015202
4224a80f-800c-4ab0-a98f-61d0988b3120	Solan	SOL00-046	DTDO SOLAN	SOL00	\N	t	2026-01-08 00:45:20.019928	2026-01-08 00:45:20.019928
480e0042-0f5b-4f9f-99e6-639258ab3f68	Bilaspur	MDI00-532	DIV. TOURISM DEV. OFFICER MANDI (BILASPUR)	MDI00	\N	t	2026-01-31 20:29:02.025881	2026-01-31 20:29:02.025881
419c683c-b1a8-4be2-baa5-f0c20066b313	Sirmaur	SMR00-055	DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN	SMR00	\N	t	2026-01-08 00:45:20.017584	2026-01-08 00:45:20.017584
82868989-60f8-4da8-a52e-eb2931941f7a	Sirmour	SMR00-055	DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN	SMR00	\N	t	2026-02-01 17:34:27.839924	2026-02-01 17:34:27.839924
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.documents (id, application_id, document_type, file_name, file_path, file_size, mime_type, upload_date, ai_verification_status, ai_confidence_score, ai_notes, is_verified, verification_status, verified_by, verification_date, verification_notes) FROM stdin;
e505f4a1-7406-488b-8315-26e1f8aea543	1813ab2e-b874-4f62-a753-5cfb708299c7	legacy_certificate	Test_Doc01-Hindi.pdf	/api/local-object/download/f98695a6-c41f-40f2-968b-4c39d5ddc56b?type=document	61398	application/pdf	2026-02-05 23:11:17.971275	\N	\N	\N	t	verified	d244a912-8065-4604-9b58-ba9b69d93e11	2026-02-05 23:15:12.844	\N
caf83183-6480-4c91-aa03-dc99789fc480	1813ab2e-b874-4f62-a753-5cfb708299c7	owner_identity_proof	Test_Doc01-Hindi.pdf	/api/local-object/download/c80f600d-ff8e-42e6-893d-ae8284c70b5e?type=document	61398	application/pdf	2026-02-05 23:11:17.982362	\N	\N	\N	t	verified	d244a912-8065-4604-9b58-ba9b69d93e11	2026-02-05 23:15:12.847	\N
5645b9d0-c521-40f0-be20-f7920a2b9dbe	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/e6bd081b-b246-4059-bb51-6d0e966d59cf?type=revenue-papers	61398	application/pdf	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
63357cf9-2635-4a03-b907-0d51ad5a1090	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/d9d2e0ba-691d-4444-86d3-8c3ecb6b46e5?type=affidavit-section29	61398	application/pdf	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
8b6e5a64-b3c5-4db8-a502-42985d235e1e	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/11c3b8c5-19c5-44d5-8b29-a1a277d03ad9?type=undertaking-form-c	61398	application/pdf	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
1de0ffde-a528-4d00-b165-f94135c01225	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	property_photo	519109575.jpg	/api/local-object/download/bcf27d67-dde6-4af8-bdcd-093d6f9688b9?type=property-photo	96524	image/jpeg	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
dd9aa545-0e6f-4dd0-a7de-462c063cecbd	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	property_photo	529253340.jpg	/api/local-object/download/0bae4718-a187-4ba5-8270-77d453ff29e7?type=property-photo	13584	image/jpeg	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
a6117da6-2fdb-43d3-8713-28c1ada8d938	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	property_photo	529253372.jpg	/api/local-object/download/77a39c43-1a28-4093-bb68-5c58d3986803?type=property-photo	98782	image/jpeg	2026-02-01 15:47:58.552163	\N	\N	\N	f	pending	\N	\N	\N
e3c53fe1-88ab-47df-9bf0-75def27f9545	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/d42a9a3b-8cb2-4345-809e-62cb851a1c9f?type=revenue-papers	61398	application/pdf	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
9d902d90-695f-434f-bb05-917b477fa015	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/aa809c55-1681-4a91-9cee-6da72063e5d4?type=affidavit-section29	61398	application/pdf	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
3456ebaa-f77a-41aa-85df-fadc8cdce293	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/b0100074-c568-420e-a94c-065695cc923c?type=undertaking-form-c	61398	application/pdf	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
8a76574f-4b8f-43b8-b989-926db87b4715	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	property_photo	519109575.jpg	/api/local-object/download/95beba28-acc8-4be9-9596-88b7fb7085c6?type=property-photo	96524	image/jpeg	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
cd50d661-23f6-4743-a1c5-fca7713b71bd	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	property_photo	529253340.jpg	/api/local-object/download/7c812155-bb1d-4aac-9ba7-f64e0bc9db70?type=property-photo	13584	image/jpeg	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
ca627a35-acc5-425b-8435-e7c705ee1546	4356f133-c79d-44c9-930d-7e7db7e864d0	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/af5ac3e5-a3ee-4f8e-9ab1-6639fa490a70?type=revenue-papers	61398	application/pdf	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
bd065223-8fa7-441c-b8a0-91322e688183	4356f133-c79d-44c9-930d-7e7db7e864d0	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/2dbe6587-ac79-426b-a562-7f08e7e16deb?type=affidavit-section29	61398	application/pdf	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
77a7d7e4-0c4d-47c7-88c6-382973b8294d	4356f133-c79d-44c9-930d-7e7db7e864d0	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/779b2513-e3b5-498e-beea-b773850aa4c8?type=undertaking-form-c	61398	application/pdf	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
8f48cd72-e2b5-4a29-a985-f2836df2a448	4356f133-c79d-44c9-930d-7e7db7e864d0	property_photo	519109575.jpg	/api/local-object/download/a6b67ba1-de08-4945-8220-ac8fd28bb790?type=property-photo	96524	image/jpeg	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
c99b9dda-03a7-4ff3-a854-4d1653b896f1	4356f133-c79d-44c9-930d-7e7db7e864d0	property_photo	529253340.jpg	/api/local-object/download/72fb829d-8d5b-4806-b519-2e31985b75eb?type=property-photo	13584	image/jpeg	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
5b41ae78-95ff-4771-a202-9db3b72b77d9	4356f133-c79d-44c9-930d-7e7db7e864d0	property_photo	529253372.jpg	/api/local-object/download/0ec791c4-d5de-419d-b8a6-6ab1f11f7e32?type=property-photo	98782	image/jpeg	2026-02-01 15:42:52.37551	\N	\N	\N	f	pending	\N	\N	\N
a5fec825-2811-4f04-bbeb-d8ab2dc5ff25	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	property_photo	529253372.jpg	/api/local-object/download/b8a7c7d1-2be4-47ad-8ab7-7175d37a94e6?type=property-photo	98782	image/jpeg	2026-02-01 15:51:36.463971	\N	\N	\N	f	pending	\N	\N	\N
12060823-ecf1-4ab5-a0c4-92e38c523143	2f152463-5a74-4dd6-9043-45578b983f6a	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/c240a9ec-9345-4f66-87f5-f330389aa529?type=revenue-papers	61398	application/pdf	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
d44a9d9d-47b1-471b-a2ee-681d5a201741	2f152463-5a74-4dd6-9043-45578b983f6a	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/4a91733b-e7ac-41ec-87f9-d4618a83a184?type=affidavit-section29	61398	application/pdf	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
3863e56b-ace8-48a0-b725-ffcdf071c7db	2f152463-5a74-4dd6-9043-45578b983f6a	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/7d8464c9-d8ee-4d75-ae7b-a9b324f71ade?type=undertaking-form-c	61398	application/pdf	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
b474ee96-f3b2-4f6f-a34a-0fbf397cbfee	2f152463-5a74-4dd6-9043-45578b983f6a	property_photo	519109575.jpg	/api/local-object/download/be392380-9271-4252-ba6e-5ff39c2c3d0a?type=property-photo	96524	image/jpeg	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
1602b911-da1c-4d44-bbe0-515dc037733b	2f152463-5a74-4dd6-9043-45578b983f6a	property_photo	529253340.jpg	/api/local-object/download/92af2832-bc4a-448a-b1ee-a45d12292d90?type=property-photo	13584	image/jpeg	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
26a486cf-77b4-42b9-9f56-cfe045e7b841	2f152463-5a74-4dd6-9043-45578b983f6a	property_photo	529253372.jpg	/api/local-object/download/75dd4bda-478e-43e7-94e5-7c1d597c3ac8?type=property-photo	98782	image/jpeg	2026-02-01 15:59:08.139626	\N	\N	\N	f	pending	\N	\N	\N
89beb7c9-7bf2-4245-b573-7d23cb50c3cf	0e59202e-125c-4400-8dee-43737b4e17c1	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/a137efae-98fb-42cb-b4bc-18e7994b6b62?type=revenue-papers	61398	application/pdf	2026-02-01 16:27:30.224315	\N	\N	\N	f	pending	\N	\N	\N
c857630d-7704-4f67-8a23-3956d24b4644	0e59202e-125c-4400-8dee-43737b4e17c1	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/d1ea4c17-6fcf-456e-9157-c1120195a1a4?type=affidavit-section29	61398	application/pdf	2026-02-01 16:27:30.224315	\N	\N	\N	f	pending	\N	\N	\N
74193956-4c6a-4955-a15f-e7bed2619684	0e59202e-125c-4400-8dee-43737b4e17c1	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/1c1e7ea0-f735-4e17-8339-524d52f3b0c8?type=undertaking-form-c	61398	application/pdf	2026-02-01 16:27:30.224315	\N	\N	\N	f	pending	\N	\N	\N
f8c2667b-5c62-4ce3-95a5-f08b29bcfe66	0e59202e-125c-4400-8dee-43737b4e17c1	property_photo	519109575.jpg	/api/local-object/download/945ac071-e7b4-4e16-b704-730f711a15a5?type=property-photo	96524	image/jpeg	2026-02-01 16:27:30.224315	\N	\N	\N	f	pending	\N	\N	\N
d50d0d7b-cab0-4653-b3f1-6a5af46f43d9	0e59202e-125c-4400-8dee-43737b4e17c1	property_photo	529253340.jpg	/api/local-object/download/49c2774d-59a2-4679-8ac5-a62bb29a7af6?type=property-photo	13584	image/jpeg	2026-02-01 16:27:30.224315	\N	\N	\N	f	pending	\N	\N	\N
aa8e90a0-742d-4531-934a-e811ae4ba24a	74072eb5-03a8-4895-9908-07168c9b9399	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/763ac6f9-614b-4a46-b0dc-5f675268a178?type=revenue-papers	61398	application/pdf	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.733	\N
5310605b-5b8b-4c4f-a30d-c69bb97c67b2	74072eb5-03a8-4895-9908-07168c9b9399	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/8adc1e77-d961-43de-8b62-d6e6c875d7bf?type=affidavit-section29	61398	application/pdf	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.735	\N
0c1e9cc5-da94-4440-80c0-187c7b8643a6	74072eb5-03a8-4895-9908-07168c9b9399	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/df79225a-bb28-43f3-ad96-1c6b74a98dca?type=undertaking-form-c	61398	application/pdf	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.736	\N
c99e25f0-7216-46a5-ae53-8364849784ff	74072eb5-03a8-4895-9908-07168c9b9399	property_photo	519109575.jpg	/api/local-object/download/6c54ca76-3e29-4f91-946b-10f7732df4c4?type=property-photo	96524	image/jpeg	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.737	\N
dabc5e1e-8e2c-46be-89ca-76fd404ede58	74072eb5-03a8-4895-9908-07168c9b9399	property_photo	529253340.jpg	/api/local-object/download/ab3b0be2-9bc7-4b7d-82ff-955a134e8b23?type=property-photo	13584	image/jpeg	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.739	\N
c2a16669-59ba-4f98-9682-756fd1e47f4b	74072eb5-03a8-4895-9908-07168c9b9399	property_photo	529253372.jpg	/api/local-object/download/2da8a7b0-4c92-42bf-b78c-520fc9adf162?type=property-photo	98782	image/jpeg	2026-02-03 17:56:43.872031	\N	\N	\N	t	verified	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:39.741	\N
03a46c7a-6712-4a36-a667-fa1f49500d3d	990f469b-088f-4d7e-9166-97646d526b4e	revenue_papers	Test_Doc01-Hindi.pdf	/api/local-object/download/cfd6ee2b-8d4b-4953-8f8f-9b93d3b66af7?type=revenue-papers	61398	application/pdf	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
ab613f47-fb8f-4a30-a67b-bff79360ad7c	990f469b-088f-4d7e-9166-97646d526b4e	affidavit_section_29	Test_Doc01-Hindi.pdf	/api/local-object/download/71df8145-6d7b-4a50-b184-235c809b9779?type=affidavit-section29	61398	application/pdf	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
cb0dfae0-4524-4f7c-a650-38740e326189	990f469b-088f-4d7e-9166-97646d526b4e	undertaking_form_c	Test_Doc01-Hindi.pdf	/api/local-object/download/125bc0aa-c98e-4c69-b72b-cde4c9be555c?type=undertaking-form-c	61398	application/pdf	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
3dfa0ed1-aa48-471e-b3f3-23ec2062269d	990f469b-088f-4d7e-9166-97646d526b4e	property_photo	519109575.jpg	/api/local-object/download/2d35054d-4633-4fd6-ad4b-7bf9e11c1df4?type=property-photo	96524	image/jpeg	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
27ee5196-c048-4e15-8659-68c84cdc9ba3	990f469b-088f-4d7e-9166-97646d526b4e	property_photo	529253340.jpg	/api/local-object/download/18e0cd67-b285-4a8e-8dc4-af693267316a?type=property-photo	13584	image/jpeg	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
467dead9-f0e9-4718-a5f2-d0dad17c3d20	990f469b-088f-4d7e-9166-97646d526b4e	property_photo	529253372.jpg	/api/local-object/download/caf0627d-7574-40ad-a5cd-ae6ed9808164?type=property-photo	98782	image/jpeg	2026-02-04 03:49:49.429308	\N	\N	\N	f	pending	\N	\N	\N
\.


--
-- Data for Name: grievance_audit_log; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.grievance_audit_log (id, grievance_id, action, old_value, new_value, performed_by, performed_at, ip_address, user_agent) FROM stdin;
f1fe8b7f-f87b-4458-9bd6-0e466e0c2ac9	420a7c4c-61d2-4353-97a7-9473b875f162	comment_added	\N	Comment added by Demo Owner	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	2026-02-01 17:50:44.101565	223.178.211.76	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0
\.


--
-- Data for Name: grievance_comments; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.grievance_comments (id, grievance_id, user_id, comment, is_internal, created_at) FROM stdin;
4cbff286-8dfb-49c1-a6ec-f1f1c9817f3c	420a7c4c-61d2-4353-97a7-9473b875f162	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	Test	f	2026-02-01 17:50:44.096936
80391ffa-9bff-4388-8fd5-a635d868dc2b	420a7c4c-61d2-4353-97a7-9473b875f162	30d01ccb-a38d-44df-b1fe-f904926574b3	Dear Property Owner, we have received your inquiry. Subsidies are available under the HPTDC Home Stay Scheme 2025. Please visit the nearest tourism office for details.	f	2026-02-01 17:53:49.433504
\.


--
-- Data for Name: grievances; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.grievances (id, ticket_number, ticket_type, user_id, application_id, category, priority, status, subject, description, assigned_to, resolution_notes, attachments, last_comment_at, last_read_by_owner, last_read_by_officer, created_at, updated_at, resolved_at) FROM stdin;
420a7c4c-61d2-4353-97a7-9473b875f162	GRV-SML-2025-001	owner_grievance	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	\N	application	medium	in_progress	Demo Grievance: Inquiry about subsidy	This is a sample grievance ticket for demonstration purposes. I would like to know about available subsidies for homestay renovation.	\N	\N	\N	2026-02-01 17:53:49.435	2026-02-01 17:50:44.177	2026-02-01 17:53:49.435	2026-02-01 17:50:12.389944	2026-02-01 17:50:44.099	\N
\.


--
-- Data for Name: himkosh_transactions; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.himkosh_transactions (id, application_id, dept_ref_no, app_ref_no, total_amount, tender_by, merchant_code, dept_id, service_code, ddo, head1, amount1, head2, amount2, head3, amount3, head4, amount4, head10, amount10, period_from, period_to, encrypted_request, request_checksum, ech_txn_id, bank_cin, bank_name, payment_date, status, status_cd, response_checksum, is_double_verified, double_verification_date, double_verification_data, challan_print_url, portal_base_url, transaction_status, initiated_at, responded_at, verified_at, created_at, updated_at, is_archived) FROM stdin;
73cdd85b-27da-4946-ab30-21f2dd82a12e	4356f133-c79d-44c9-930d-7e7db7e864d0	HP-HS-2026-UNA-000001	HPT1769960396376NMwG	1	Test Five	HIMKOSH230	230	TSM	HMR00-053	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsmczJ+/GFHFgWp/f0+IG6uacvYXSSOxmjQbb4p91cC4aMmfbHXdubVW3X747hVwf14WTL9ZEDxcr9+g7hXFToj0RsJYHeQvms8Lca6My0eX6myT+1Xk05XmAwA7sXxNfRA+L4xSPGWXoyvCkEnYfgQ2ukBTU+B7tyBvskY2DdUOgKtpNsMQI5d/jMqVRMgra8nc/CCK3WiptTXLGl5qL5XYne6SaBLduVRPZeszS3/kaa8IINIe4UmwRg/EFHti8LvXp4MlNpWjXKF+Q5bWgPyR/pXLXWCj0omz/d0JX1lzZHEn0DEvzQWQ5N47Q6sc8VveBLM4sJicLv+UtqfbcDE0uc8iFmsXU3SxAMuSAqBZYB+4xUKiqAJxvL/J99t+dr0=	94b39eccdd925c6f9d77f7715711a883	\N	\N	\N	\N	Cancelled by applicant	0	\N	f	\N	\N	\N	https://dev1.osipl.dev	failed	2026-02-01 15:39:56.381662	2026-02-01 15:41:43.644	\N	2026-02-01 15:39:56.381662	2026-02-01 15:41:43.644	f
e20ad74a-9d43-4c26-9afe-6bad41b21a2d	9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	HP-HS-2026-HMP-000002	HPT1769960801328tSgs	1	Test Five	HIMKOSH230	230	TSM	HMR00-053	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2027	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevslVh2hu1yo1hdPFp8hVyh+SlSLsMTOhjoPSc99aU0ijZuYPR0em07V9gw6YCs2FegSa4ye2xH/tjdsEql/4pSm86APL8Rpiu97NvHdmB1K9Y6ArwMQjtGuPmp4pUlUo/0LRAJ3wUjnPYVQvwsTRTkREgCUet3xVv9iFsoqLgINYNa0zu+HK1oa3uhQdYI+WZ7xik7UZ6gRGCgPmNk7SoAOOawaP0jlSVakZQhoN132AOozMgbLkc2QYxH4rdv554CI2RUAcVr2a0MAXP2JWiFuzPt/FrA+CzP33wLiYhRiCXGPlsVgKRR00CnW6hJIeaYJPGt9DEu4cVi+DzhjDnWDdiswCZb/asCDtOiz0O9iCtf8g5TOs0jy0SijBsqjIoro=	f08b7436c77cada4475beadc2d4b96f2	A26B103664	CPAGGIHIM6	SBI	01022026211757	Completed successfully.	1	eb6c3909828e80a4b636e61b88b632c3	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B103664	https://dev1.osipl.dev	success	2026-02-01 15:46:41.331086	2026-02-01 15:47:58.534	\N	2026-02-01 15:46:41.331086	2026-02-01 15:46:41.331086	f
dcd347c7-7803-4283-b62b-9a994868cbb7	2f152463-5a74-4dd6-9043-45578b983f6a	HP-HS-2026-BIL-000004	HPT17699614029839vx1	1	Test Five	HIMKOSH230	230	TSM	MDI00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2027	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsmVqgLv248xhfHWlSGHMfwgywMfxvV1inPNxq8x65YUsCJrjlq2GF2G3q2vEdDQKtAafPWp0ULCpUaXjW1IICZvT4xOL85PM33LE0qdDcd4qyIXhpZbn/vLvBF+kuwE4H2r2mpwgTmMvSw6Ii3tA2PJyDhtNh2U9QK7uutQZRXWkmobA46pXqqGAmG2RvqqHvCH/Xx9F9Z+1N9WMepZV7c4jD/5A/Z3j65915ZVBHH4wzMSgNJCQQ4rlabO4Xgp7MQwCNqR2Qol/qTEzh7wxriMSsCOIK5IOyoWtyg+vAdIklMjyD8X8Ki7rSyrXdSyqt70d/0dyM8btOifUIWwKgOJiYcpvWpTvkDuufybwyYoJP00Cpyw6rF6FDqVeot3ID8=	e847f8b8b1ff92c28cc4a2a333708628	\N	\N	\N	\N	Cancelled by applicant	0	\N	f	\N	\N	\N	https://dev1.osipl.dev	failed	2026-02-01 15:56:42.985605	2026-02-01 15:57:36.269	\N	2026-02-01 15:56:42.985605	2026-02-01 15:57:36.269	f
de2f0afd-5069-4951-b6bc-e12ddc5ed98a	0e59202e-125c-4400-8dee-43737b4e17c1	HP-HS-2026-MDI-000005	HPT1769963142670n5pP	1	Test Five	HIMKOSH230	230	TSM	MDI00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2027	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevskNfQU6QdrSIloiiHE9v+Vz3oP+wwvPNRj331mI7XGdfvmlkP7pzDBrn1j+TGrtHLw0MVhCiam/mAav17ADL8NGJPZMFBVwxZ4O+zrHI6UtdmEg7mmNx1mO0JDrr/eUJBYjyTj5/tcQJY2YZjS3buS7ISyyFtGp2BbYbq0X+eFrrVKtRGrTndoyyOytxh2Gytbcel0jaaLU3PP611jNnpee/ZpEUcDlFGO2iczWxJBM2hT8XVlY5Y6GgLuZfrukM4Ld5+IyH+jSvkIp8pfhi2T4chsUf/adtCHN7bnUohG6epTp6lyDGKWa1cMtZCbr6Vg1Wr55jHi1hXyruonowqgEgeP9MIc8ZqdzKc3657gxJGiLbKwTAovwhvmo4ypcN4M=	7a0e9e42390ab008df95b23e4029ab37	A26B103751	CPAGGIJIC1	SBI	01022026215729	Completed successfully.	1	842abe0f0eb1c1026f6ea49947a72700	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B103751	https://dev1.osipl.dev	success	2026-02-01 16:25:42.672534	2026-02-01 16:27:30.209	\N	2026-02-01 16:25:42.672534	2026-02-01 16:25:42.672534	f
11af4235-7757-4cae-9cff-d68a020114be	990f469b-088f-4d7e-9166-97646d526b4e	HP-HS-2026-SML-000101	HPT17701769076409Xn7	1	Tests Test	HIMKOSH230	230	TSM	SML00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	04-02-2026	03-02-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevskGfm/FHfDvh0uXotxRks8Tnko8NtP+9cepmy0/5YqToeGROKA3zd+9rqQkVwwjVe5xkhIRp+8toI1b5XldkG9Q0HaCVjWag36kygkihKy1rFNpPcMNrw7WOl2qG22bcYnA/PdyaM/lPq4rVQnGy/Fb9Ve5kB6ODcnhNcWMKO8m2/9xq+NRe5V6hB9QLhy8IF5zTwdddiRL1tWZoFmUlpRxp2pUnrNmrS0nq5sJs1YbvZw1NTBw7Pt/sGQVuKZ4rP8TDR/6oLVUokga4Vj0Bxo9SPFCY+CiynIQe60MUXh/ycvIx+FpEDszpFtEpjO1y3HlFthhJxITEyjtY0l6cNGm+SdDFT+3hvc9eDGubZ/sd3/SdrR9S1i+ahjYJ1Mb5HU=	e0eb38099baa709cd3e7a4b3039ec13c	A26B125852	CPAGGRHAY3	SBI	04022026091949	Completed successfully.	1	18c839a4e19fbc8bf99c11e97733d032	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B125852	https://dev1.osipl.dev	success	2026-02-04 03:48:27.645862	2026-02-04 03:49:49.407	\N	2026-02-04 03:48:27.645862	2026-02-04 03:48:27.645862	f
fb3e11e0-d7f7-4644-bc97-26e7d0e0d167	74119275-1b44-4606-871a-7b2a8e2d163e	HP-HS-2026-SML-000102	HPT1770334068573sW9X	1	test test	HIMKOSH230	230	TSM	SML00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	05-02-2026	04-02-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsnpzDyx0SfuF5DxJ3PySQykMiTitFBeQ4Bo+RpwnhuUxiPUGm6ShFgF4Zm8RjoRxX3ykgU+47o0wH6dJgG+yVWwQGldkNsphZ6vxS2MmsYu1C4skhjFKu99UwBRmBg13h48C8pSOebat0CtLwdp3Jo+Ci4BqiW0YSLnyRbr3dC7cm0zBH/D1iu+92gYGehUPUahbgoyGyAlbucfiM/sR0MTONnKrFZ1HS6xDfPeSOvyBiwbzERbzTMXVlCEOFEds7AHtzY9tbLqOEJObarMnACgBEsk8nIVeRQNqsHoO35clXh8b9rbR4OPzj5MzS7BT5/lhzJQI/kO9Ds4Jmoj02k6iWn6uO1BMQ7pHAdDQK4qbR2ayp0WxFF6/koU6H3dHPs=	d35fa1edc5ac6f7c9842cbebf3935f02	\N	\N	\N	\N	Cancelled by applicant	0	\N	f	\N	\N	\N	https://dev1.osipl.dev	failed	2026-02-05 23:27:48.58099	2026-02-05 23:33:59.542	\N	2026-02-05 23:27:48.58099	2026-02-05 23:33:59.542	f
d69b8573-b02f-4211-a278-2169e25afa72	4356f133-c79d-44c9-930d-7e7db7e864d0	HP-HS-2026-UNA-000001	HPT1769960504950vkA0	1	Test Five	HIMKOSH230	230	TSM	HMR00-053	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsmczJ+/GFHFgWp/f0+IG6uacvYXSSOxmjQbb4p91cC4aMmfbHXdubVW3X747hVwf16I131roy4S/WY4a+ZBcAnu2EMs1XdrAcdVoafUw2XZjbpDCzoZF+ZLX9PRCYzo6Gelq+67FSYHQhjH7fFKcjOOtTZsJAKKeIaGLaGP1KyxGvjiRIPABTdAU+5iGEtppEin86/jVHzHj3G/1O4megEbfcnXnhjrqTeYFVJ+mRFjMTvxYcfA7rmV3icFkyZEUArvL05XYVkxuPMvQ/k0MrOWYFLB2NimwKvnBGdSg+00ZPZi271V7BbGgmjEQ7u5e1iuo/EnVRBrz5NgtNGR4X2W/ZK3NMJ0t/0Um/hZg3uJE4K1Ki1td5HCd4rDRaZbeQg=	8504b9875e701319cc2b4ee1ae51bc9a	A26B103651	CPAGGIHBH1	SBI	01022026211251	Completed successfully.	1	9984224bb6c99c2539719438ace29b0b	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B103651	https://dev1.osipl.dev	success	2026-02-01 15:41:44.953077	2026-02-01 15:42:52.358	\N	2026-02-01 15:41:44.953077	2026-02-01 15:41:44.953077	f
cac0b115-22a7-410e-9258-994dd5f8daf7	c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	HP-HS-2026-MDI-000003	HPT1769961018164L-CI	1	Test Five	HIMKOSH230	230	TSM	MDI00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2027	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevslwuA07kgIDnA+PZT57x5I0FDOpTWWje0hQP1gfA1TM1BQogMUkA+/i2dMqfxxPQasqYaeFeDk7zg2Rq0YF5sQyYzl3nIQ5+YkxHZzeV3bA2YOZiB1J4tq5htjKzgA75cif1FxvhhcVeLtvq7hHsOxnTivwoTdl/9hfQXP4In8h8kn5Hvse9+Of3f9gILTaxBll/QHBrktPWniS+Hkjc7HdT0RWmfJ+HfiKnq2067QqaNhXqCPRQwReqyt9keh+RVFZYuYLbCnoTL7ZGYiVXFTh2OYu4Pg08RnNcwtQUpOoVUrjIgSa2lIj9d3VAVpk19IGjfTa9WN+uGS2Hy3fmqoc9Iu6JbcIJ1aJ4v2DIwZ/Ts8r0UGWTDR5okYjURtnI6E=	84d998cec27c2acd02e62ad8e39d6413	A26B103673	CPAGGIHNW7	SBI	01022026212135	Completed successfully.	1	c4b15d6e04db79adb158efeaa2d3f85f	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B103673	https://dev1.osipl.dev	success	2026-02-01 15:50:18.166449	2026-02-01 15:51:36.446	\N	2026-02-01 15:50:18.166449	2026-02-01 15:50:18.166449	f
3389c9bc-6a11-40f7-bf87-25cddcfdc949	2f152463-5a74-4dd6-9043-45578b983f6a	HP-HS-2026-BIL-000004	HPT1769961458002MT6K	1	Test Five	HIMKOSH230	230	TSM	MDI00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	01-02-2026	31-01-2027	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsmVqgLv248xhfHWlSGHMfwgywMfxvV1inPNxq8x65YUsCJrjlq2GF2G3q2vEdDQKtAafPWp0ULCpUaXjW1IICZvY4QWNrTZFF/ZCDIh5CgDBJRoMNTJG622Z74XOJ7IVUZ8OZQDf4+ex3/u9MTnFDcAOuqVFIqFdWfi8KtX4DXZ6QBIhBCfs1lVMZfjdePsv3RRJm/GVq5mgjjT1jSfJH2k9TaRbeN64s+vcQRkRFACyGLgmyf6+8yI1xH8d2Qq+7/BtH0yLC7KIxTjm42LnwI88Zy+Lepb3Z/ZoVvm3H5X/H96O/gqZOFGO1EjJZDivrtbe0LmvKRMmeR+UfsNoSolGMI5yudsibNmywhUgqwBcXX98giZiJ5JVmzlNmvI/0U=	defe8479d7d3d193466ea8bc02b84ae7	A26B103686	CPAGGIHYR8	SBI	01022026212907	Completed successfully.	1	7f5e8897b8f9d3f2f775d26a4e9bb018	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B103686	https://dev1.osipl.dev	success	2026-02-01 15:57:38.004799	2026-02-01 15:59:08.124	\N	2026-02-01 15:57:38.004799	2026-02-01 15:57:38.004799	f
ecd7478f-0f2e-4784-9351-a92acca33aa6	74072eb5-03a8-4895-9908-07168c9b9399	HP-HS-2026-SML-000100	HPT1770141328991e4gv	1	Test Test	HIMKOSH230	230	TSM	SML00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	03-02-2026	02-02-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/Mqcevsl25waqmrWF/yEznZj1shAmDcrnxOG4Tqm0WyBuQw0KjfgmMRfPUidNFRB/XEtT3ssAFU8WWjvE+7t2AceQ5ud2HITAuLUCP7UDaYC0WTQOH07ek/P4Cl8QwvsAZkm0fvJBSTNAXvDpgeVBRwa1D8fxBa4x+1WEv31pzDXHUheS+2gkyQyemY6GDb/4smzqwSqV4o8is6ixZwL4zN19B83Dx8XReRo3zsgN8VFGz85IZYrU7WfaLPfgu0ywSw6+7eURdlfYrx4f4aIuzaPWJgI4sLJYAC4PsczvFQWKlfRIykSyQ2oDSr0+ZVUOdiVzgDAV75o3ITtIZRnw1qKlETYhJY5iJ4UHynoFDDNmf3SSLEgZ9MSs3XYp6VZ/q8Yu7gw=	1d61d2cbb30514064a9f22ae37208ebf	A26B125247	CPAGGQZTK2	SBI	03022026232643	Completed successfully.	1	895f0ca7139d7224f4707bf436c68817	f	\N	\N	https://himkosh.hp.nic.in/eChallan/challan_reports/reportViewer.aspx?reportName=PaidChallan&TransId=A26B125247	https://dev1.osipl.dev	success	2026-02-03 17:55:28.996717	2026-02-03 17:56:43.855	\N	2026-02-03 17:55:28.996717	2026-02-03 17:55:28.996717	f
72e96b73-28cb-4196-86c4-f71ebbc7da93	74119275-1b44-4606-871a-7b2a8e2d163e	HP-HS-2026-SML-000102	HPT1770334561164wVf_	1	test test	HIMKOSH230	230	TSM	SML00-532	1452-00-800-01	1	\N	\N	\N	\N	\N	\N	\N	\N	05-02-2026	04-02-2029	FdkGGiidekvpm0UUibJM5NLCoeGdXqcQsBV/MqcevsnpzDyx0SfuF5DxJ3PySQykMiTitFBeQ4Bo+RpwnhuUxiPUGm6ShFgF4Zm8RjoRxX3Sz7K+Y1YkkfycrHpAML7N/EVvxr8IbiA81SJjIE8gWx33uXiDqrxImQUPEy3DIggyY1sfHfpFlMof6C4/culZ4v2qafeyaendf6CUuAef7DLMKGfLmpSDEttFACqKdAW5LQiLFpjlxpSX5ICHaIQ3aQt6NIgilj9nutJ2hjjILGnhwRmLg1ewJuH1jpKYg/NwzIiDPn+l2o+5v2BJWQqyQgcLPF1VG0p7zRk+oNKYo0YsZvrTs0h/BBdiWgtUZuvVbv56+ajI3hNzHpBv1RRz7OD0UaMXGx6QGgx0DsYswMTLGOkz2Oa/5/YjTuBbIO8=	0a0cc91e831e7a32c6dbb8766b79b6c8	\N	\N	\N	\N	Cancelled by applicant	0	\N	f	\N	\N	\N	https://dev1.osipl.dev	failed	2026-02-05 23:36:01.16949	2026-02-05 23:36:43.313	\N	2026-02-05 23:36:01.16949	2026-02-05 23:36:43.313	f
\.


--
-- Data for Name: homestay_applications; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.homestay_applications (id, user_id, application_number, application_kind, parent_application_id, parent_application_number, parent_certificate_number, inherited_certificate_valid_upto, service_context, service_notes, service_requested_at, application_type, water_sports_data, adventure_sports_data, property_name, category, location_type, total_rooms, district, district_other, tehsil, tehsil_other, block, block_other, gram_panchayat, gram_panchayat_other, urban_body, urban_body_other, ward, address, pincode, telephone, fax, latitude, longitude, owner_name, owner_gender, owner_mobile, owner_email, guardian_name, owner_aadhaar, guardian_relation, property_ownership, proposed_room_rate, project_type, property_area, property_area_unit, single_bed_rooms, single_bed_beds, single_bed_room_size, single_bed_room_rate, double_bed_rooms, double_bed_beds, double_bed_room_size, double_bed_room_rate, family_suites, family_suite_beds, family_suite_size, family_suite_rate, attached_washrooms, gstin, selected_category, average_room_rate, highest_room_rate, lowest_room_rate, certificate_validity_years, is_pangi_sub_division, distance_airport, distance_railway, distance_city_center, distance_shopping, distance_bus_stand, key_location_highlight1, key_location_highlight2, lobby_area, dining_area, parking_area, eco_friendly_facilities, differently_abled_facilities, fire_equipment_details, nearest_hospital, amenities, nearby_attractions, mandatory_checklist, desirable_checklist, rooms, base_fee, total_before_discounts, validity_discount, female_owner_discount, pangi_discount, total_discount, total_fee, per_room_fee, gst_amount, status, current_stage, current_page, district_officer_id, district_review_date, district_notes, da_id, da_review_date, da_forwarded_date, da_remarks, state_officer_id, state_review_date, state_notes, dtdo_id, dtdo_review_date, correction_submission_count, revert_count, dtdo_remarks, rejection_reason, clarification_requested, site_inspection_scheduled_date, site_inspection_completed_date, site_inspection_officer_id, site_inspection_notes, site_inspection_outcome, site_inspection_findings, ownership_proof_url, aadhaar_card_url, pan_card_url, gst_certificate_url, fire_safety_noc_url, pollution_clearance_url, building_plan_url, property_photos_urls, documents, certificate_number, certificate_issued_date, certificate_expiry_date, payment_status, payment_id, payment_amount, payment_date, refund_date, refund_reason, submitted_at, approved_at, created_at, updated_at, form_completion_time_seconds) FROM stdin;
74119275-1b44-4606-871a-7b2a8e2d163e	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	HP-HS-2026-SML-000102	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	test Home sta	silver	gp	1	Shimla	\N	Chirgaon	\N	\N	\N	fdssd	\N		\N		afsfsdaf	171001		\N	\N	\N	test test	female	6666666642	demo@himachaltourism.gov.in	wrewrwe	666666666643	d_o	owned	0.00	new_project	1200.00	sqm	1	1	\N	2499.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	3	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	3000.00	9000.00	900.00	450.00	0.00	1350.00	7650.00	0.00	0.00	draft	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "d21a9ad7-495f-400d-9671-b0b3993af43b", "url": "/api/local-object/download/3b5e52b6-d936-4fac-ac08-b771e3262c31?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/3b5e52b6-d936-4fac-ac08-b771e3262c31?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "1f52ae99-15e3-45a1-a2b4-b6fa334cc535", "url": "/api/local-object/download/bd451dd0-0b72-42c3-a1d6-3a214ecb6e99?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/bd451dd0-0b72-42c3-a1d6-3a214ecb6e99?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "c872065e-43c4-4086-8f97-1ecf2849e3cc", "url": "/api/local-object/download/012246be-2a98-4972-a58a-aaf0d3b7f2c4?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/012246be-2a98-4972-a58a-aaf0d3b7f2c4?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "d82607ac-fdf3-4e01-b373-b39a4043eab4", "url": "/api/local-object/download/a61f7afb-c2f1-4cf3-96a3-87153c485801?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/a61f7afb-c2f1-4cf3-96a3-87153c485801?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "cd2d6cb7-2ec7-45af-876f-c791c2057d83", "url": "/api/local-object/download/9697aa01-b891-46d0-a324-b1633e29b9ae?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/9697aa01-b891-46d0-a324-b1633e29b9ae?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	pending	\N	\N	\N	\N	\N	\N	\N	2026-02-05 23:26:16.259937	2026-02-05 23:54:08.657	\N
4356f133-c79d-44c9-930d-7e7db7e864d0	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	HP-HS-2026-UNA-000001	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	dfsdfsd	silver	mc	1	Una	\N	Bangana	\N	\N	\N		\N	sdfsdfsd	\N		sdfsfsd	171003		\N	\N	\N	Test Five	female	6666666611	subhash.thakur2010@gmail.com	sdfsfsd	666666666611	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	1500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	3	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	8000.00	24000.00	2400.00	1200.00	0.00	3600.00	20400.00	0.00	0.00	submitted	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "5e8a8998-577b-4e2c-8127-89b8f16fff23", "url": "/api/local-object/download/af5ac3e5-a3ee-4f8e-9ab1-6639fa490a70?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/af5ac3e5-a3ee-4f8e-9ab1-6639fa490a70?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "89226b3d-066a-4b89-96c4-d95aaa2aa2af", "url": "/api/local-object/download/2dbe6587-ac79-426b-a562-7f08e7e16deb?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/2dbe6587-ac79-426b-a562-7f08e7e16deb?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "3fcd9aa8-154e-4e7f-8cc1-a6d31539446a", "url": "/api/local-object/download/779b2513-e3b5-498e-beea-b773850aa4c8?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/779b2513-e3b5-498e-beea-b773850aa4c8?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "5a2491a1-a81f-439d-8e8a-7c9b0e3df5cd", "url": "/api/local-object/download/a6b67ba1-de08-4945-8220-ac8fd28bb790?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/a6b67ba1-de08-4945-8220-ac8fd28bb790?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "cd3a1310-7b8e-40ce-9428-4e1670b48f70", "url": "/api/local-object/download/72fb829d-8d5b-4806-b519-2e31985b75eb?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/72fb829d-8d5b-4806-b519-2e31985b75eb?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "0aac263d-b062-4cf8-81e1-0cf9eea57a7e", "url": "/api/local-object/download/0ec791c4-d5de-419d-b8a6-6ab1f11f7e32?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/0ec791c4-d5de-419d-b8a6-6ab1f11f7e32?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B103651	1.00	2026-02-01 00:00:00	\N	\N	2026-02-01 15:42:52.366	\N	2026-02-01 15:38:42.574328	2026-02-01 15:42:52.366	\N
bdfe190e-8eb7-44db-9a89-67f61ccbf370	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	HP-SML-2025-00099	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	Demo Himalayan Heights	gold	mc	3	Shimla	\N	Shimla Urban	\N	\N	\N	\N	\N	\N	\N	\N	The Mall, Shimla	171001	\N	\N	\N	\N	Demo Owner	male	9876543210	\N	\N	123456789012	father	owned	\N	new_property	500.00	sqm	1	1	\N	\N	1	2	\N	\N	1	4	\N	\N	3	\N	\N	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	0.00	\N	\N	\N	approved	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	HP-SML-DEMO-001	2026-02-01 17:34:28.083	2027-02-01 17:34:28.083	paid	\N	5000.00	2026-02-01 17:34:28.083	\N	\N	\N	2026-02-01 17:34:28.083	2026-02-01 17:34:28.086187	2026-02-01 17:34:28.086187	\N
9cb1f2a5-c7cf-47ea-a4df-ac5a1d9459ba	e97e2f28-6ee5-49ca-be86-419e85dd5700	HP-HS-2026-HMP-000002	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	adfsfsf	silver	mc	1	Hamirpur	\N	Bhoranj	\N	\N	\N		\N	fsfsafs	\N		sfsafsaf	171004		\N	\N	\N	Test Five	female	6666666612	subhash.thakur2010@gmail.com	sadfsafs	666666666612	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	1500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	8000.00	8000.00	0.00	400.00	0.00	400.00	7600.00	0.00	0.00	submitted	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "6b536b2d-47df-43e0-b701-a4a2ac101c3d", "url": "/api/local-object/download/e6bd081b-b246-4059-bb51-6d0e966d59cf?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/e6bd081b-b246-4059-bb51-6d0e966d59cf?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "d927909c-376a-4019-9556-4599108be66e", "url": "/api/local-object/download/d9d2e0ba-691d-4444-86d3-8c3ecb6b46e5?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/d9d2e0ba-691d-4444-86d3-8c3ecb6b46e5?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "5bb2eb82-480c-4d24-9f1c-8ffbac82ddcb", "url": "/api/local-object/download/11c3b8c5-19c5-44d5-8b29-a1a277d03ad9?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/11c3b8c5-19c5-44d5-8b29-a1a277d03ad9?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "3ea04e97-4dc5-4976-b3e3-03b3994c1721", "url": "/api/local-object/download/bcf27d67-dde6-4af8-bdcd-093d6f9688b9?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/bcf27d67-dde6-4af8-bdcd-093d6f9688b9?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "c1fcdd1b-98b7-410c-904d-f152ec546dc6", "url": "/api/local-object/download/0bae4718-a187-4ba5-8270-77d453ff29e7?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/0bae4718-a187-4ba5-8270-77d453ff29e7?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "d0c83d0a-12c5-42c9-b3cc-657eadfa2999", "url": "/api/local-object/download/77a39c43-1a28-4093-bb68-5c58d3986803?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/77a39c43-1a28-4093-bb68-5c58d3986803?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B103664	1.00	2026-02-01 00:00:00	\N	\N	2026-02-01 15:47:58.543	\N	2026-02-01 15:45:29.29117	2026-02-01 15:47:58.543	\N
c8b0f6c2-40fc-4726-a65d-4e14233fbd2b	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	HP-HS-2026-MDI-000003	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	sdfsfs	silver	gp	6	Mandi	\N	Bagachnogi	\N	\N	\N	sdfsfd	\N		\N		sfdsaf	171005		\N	\N	\N	Test Five	female	6666666613	subhash.thakur2010@gmail.com	sfsf	666666666613	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	1500.00	5	2	\N	2500.00	0	4	\N	0.00	6		silver	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	3000.00	3000.00	0.00	150.00	0.00	150.00	2850.00	0.00	0.00	submitted	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "705a3296-28e4-4f26-a632-f0b360f86825", "url": "/api/local-object/download/d42a9a3b-8cb2-4345-809e-62cb851a1c9f?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/d42a9a3b-8cb2-4345-809e-62cb851a1c9f?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "c2f78101-fdcf-408e-b64f-268b1fb5673f", "url": "/api/local-object/download/aa809c55-1681-4a91-9cee-6da72063e5d4?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/aa809c55-1681-4a91-9cee-6da72063e5d4?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "3875e31f-60e2-4083-be90-ded3202bd0f9", "url": "/api/local-object/download/b0100074-c568-420e-a94c-065695cc923c?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/b0100074-c568-420e-a94c-065695cc923c?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "d91a53b2-7588-4bd7-98f5-a6eea83c4ffa", "url": "/api/local-object/download/95beba28-acc8-4be9-9596-88b7fb7085c6?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/95beba28-acc8-4be9-9596-88b7fb7085c6?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "555e700f-bf91-4371-9977-17a99a63423c", "url": "/api/local-object/download/7c812155-bb1d-4aac-9ba7-f64e0bc9db70?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/7c812155-bb1d-4aac-9ba7-f64e0bc9db70?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "0a09a821-9af0-4c84-9795-ae7d88fd04d5", "url": "/api/local-object/download/b8a7c7d1-2be4-47ad-8ab7-7175d37a94e6?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/b8a7c7d1-2be4-47ad-8ab7-7175d37a94e6?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B103673	1.00	2026-02-01 00:00:00	\N	\N	2026-02-01 15:51:36.455	\N	2026-02-01 15:49:00.715529	2026-02-01 15:51:36.455	\N
74072eb5-03a8-4895-9908-07168c9b9399	432707b6-ac17-43b4-b021-695148c341f9	HP-HS-2026-SML-000100	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	dsfsf	silver	mc	1	Shimla	\N	Chaupal	\N	\N	\N		\N	asfsaf	\N		dafsd	171002		\N	\N	\N	Test Test	male	6666666633	demo@himachaltourism.gov.in	adfa	666666666633	s_o	owned	0.00	new_project	1200.00	sqm	1	1	\N	2500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	3	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	8000.00	24000.00	2400.00	0.00	0.00	2400.00	21600.00	0.00	0.00	rejected	\N	6	\N	\N	\N	a9a95a58-c2be-4175-83ed-7352a709c3c8	2026-02-03 17:57:51.061	2026-02-03 17:57:51.061	Add your overall scrutiny remarks before forwarding this application to the District Tourism Development Officer.	\N	\N	\N	2803bd35-34f0-4751-86ae-6cc3918c7165	2026-02-03 17:58:23.593	0	0	Reject Application\nThis will permanently reject the application. Please provide rejection reason.\n\nRemarks (Required)	Reject Application\nThis will permanently reject the application. Please provide rejection reason.\n\nRemarks (Required)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "f4161445-2ec2-4d1d-a37b-e3defe647a8b", "url": "/api/local-object/download/763ac6f9-614b-4a46-b0dc-5f675268a178?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/763ac6f9-614b-4a46-b0dc-5f675268a178?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "ef3f0b8c-98b6-49ff-a89d-4cb66a6b9e03", "url": "/api/local-object/download/8adc1e77-d961-43de-8b62-d6e6c875d7bf?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/8adc1e77-d961-43de-8b62-d6e6c875d7bf?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "5786b682-d23f-4b41-bc2e-a0bacfa45a7e", "url": "/api/local-object/download/df79225a-bb28-43f3-ad96-1c6b74a98dca?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/df79225a-bb28-43f3-ad96-1c6b74a98dca?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "f30d3156-0601-4d36-9bb9-828d3eb9bb13", "url": "/api/local-object/download/6c54ca76-3e29-4f91-946b-10f7732df4c4?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/6c54ca76-3e29-4f91-946b-10f7732df4c4?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "082b17ea-ea0f-4025-be21-774cdd2afd1a", "url": "/api/local-object/download/ab3b0be2-9bc7-4b7d-82ff-955a134e8b23?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/ab3b0be2-9bc7-4b7d-82ff-955a134e8b23?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "7561e36b-936e-40a6-80c0-2ab7bcb904ca", "url": "/api/local-object/download/2da8a7b0-4c92-42bf-b78c-520fc9adf162?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/2da8a7b0-4c92-42bf-b78c-520fc9adf162?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B125247	1.00	2026-02-03 00:00:00	\N	\N	2026-02-03 17:56:43.863	\N	2026-02-03 17:53:58.797946	2026-02-03 17:58:23.593	\N
1813ab2e-b874-4f62-a753-5cfb708299c7	894ca19d-3f7e-4867-9b47-3c6198b73fa4	LG-HS-2026-KUL-000001	renewal	\N	HP-LEG-2023-000010	HP-LEG-2023-000010	\N	{"requestedRooms": {"total": 1}, "requiresPayment": false, "legacyOnboarding": true, "legacyGuardianName": "Test", "inheritsCertificateExpiry": "2029-02-01T00:00:00.000Z"}	Existing owner onboarding request captured on 2/5/2026 with RC #HP-LEG-2023-000010.	\N	homestay	\N	\N	test Home sta	silver	gp	1	Kullu	\N	Anni	\N	\N	\N	\N	\N	\N	\N	\N	1350/267-272,\nThairong Tower, Pattanakarn Road, Suanluang,	10250	\N	\N	\N	\N	test test	other	6666666641	demo@himachaltourism.gov.in	Test	666666666641	father	owned	\N	existing_property	50.00	sqm	1	1	\N	\N	0	2	\N	\N	0	4	\N	\N	1	\N	\N	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"size": 0, "count": 1, "roomType": "Declared Rooms"}]	\N	\N	0.00	0.00	0.00	0.00	\N	\N	\N	legacy_rc_review	legacy_rc_review	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	HP-LEG-2023-000010	2026-02-01 00:00:00	2029-02-01 00:00:00	pending	\N	\N	\N	\N	\N	2026-02-05 23:11:17.927	\N	2026-02-05 23:11:17.927	2026-02-05 23:11:17.927	\N
2f152463-5a74-4dd6-9043-45578b983f6a	a1788232-8f83-4c3d-939d-5bce9c6a6a09	HP-HS-2026-BIL-000004	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	dfsfsf	silver	mc	1	Bilaspur	\N	Bilaspur Sadar	\N	\N	\N		\N	dsfsfd	\N		fdsfds	171004		\N	\N	\N	Test Five	female	6666666614	subhash.thakur2010@gmail.com	dfsfds	666666666614	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	1500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	8000.00	8000.00	0.00	400.00	0.00	400.00	7600.00	0.00	0.00	submitted	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "4254a2d5-5d2f-4a07-b3a0-3cf9ec7ef1b0", "url": "/api/local-object/download/c240a9ec-9345-4f66-87f5-f330389aa529?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/c240a9ec-9345-4f66-87f5-f330389aa529?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "8e7b1dd4-a09a-4546-8b4f-548e4027fa8f", "url": "/api/local-object/download/4a91733b-e7ac-41ec-87f9-d4618a83a184?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/4a91733b-e7ac-41ec-87f9-d4618a83a184?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "8355f94a-0da4-482f-b500-07d2e992f84b", "url": "/api/local-object/download/7d8464c9-d8ee-4d75-ae7b-a9b324f71ade?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/7d8464c9-d8ee-4d75-ae7b-a9b324f71ade?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "f3621b1f-7d0f-4583-b3bd-f3f73ed847a9", "url": "/api/local-object/download/be392380-9271-4252-ba6e-5ff39c2c3d0a?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/be392380-9271-4252-ba6e-5ff39c2c3d0a?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "177f9da8-6327-4f22-81d4-df26f3d6a716", "url": "/api/local-object/download/92af2832-bc4a-448a-b1ee-a45d12292d90?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/92af2832-bc4a-448a-b1ee-a45d12292d90?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "a122e8e3-7eb6-48b8-91c6-123f58b21cee", "url": "/api/local-object/download/75dd4bda-478e-43e7-94e5-7c1d597c3ac8?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/75dd4bda-478e-43e7-94e5-7c1d597c3ac8?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B103686	1.00	2026-02-01 00:00:00	\N	\N	2026-02-01 15:59:08.132	\N	2026-02-01 15:55:32.099917	2026-02-01 15:59:08.132	\N
0e59202e-125c-4400-8dee-43737b4e17c1	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	HP-HS-2026-MDI-000005	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	sfsfs	silver	mc	1	Mandi	\N	Bagachnogi	\N	\N	\N		\N	sdfsdfsd	\N		fsfsfs	171002		\N	\N	\N	Test Five	female	6666666615	subhash.thakur2010@gmail.com	sdfsdf	666666666615	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	1500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	1	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	8000.00	8000.00	0.00	400.00	0.00	400.00	7600.00	0.00	0.00	submitted	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "a487a0ba-aba5-40b2-9e2c-47c8cfab468a", "url": "/api/local-object/download/a137efae-98fb-42cb-b4bc-18e7994b6b62?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/a137efae-98fb-42cb-b4bc-18e7994b6b62?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "40e2f036-78bd-4194-8de5-32e388d0ad34", "url": "/api/local-object/download/d1ea4c17-6fcf-456e-9157-c1120195a1a4?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/d1ea4c17-6fcf-456e-9157-c1120195a1a4?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "d9febbf2-2a89-4206-afb8-92e891dc7914", "url": "/api/local-object/download/1c1e7ea0-f735-4e17-8339-524d52f3b0c8?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/1c1e7ea0-f735-4e17-8339-524d52f3b0c8?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "75e34750-28a4-4947-a381-95673f939da1", "url": "/api/local-object/download/945ac071-e7b4-4e16-b704-730f711a15a5?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/945ac071-e7b4-4e16-b704-730f711a15a5?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "b6c2cd95-8e07-4e85-bd1b-f6f5505cf47f", "url": "/api/local-object/download/49c2774d-59a2-4679-8ac5-a62bb29a7af6?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/49c2774d-59a2-4679-8ac5-a62bb29a7af6?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B103751	1.00	2026-02-01 00:00:00	\N	\N	2026-02-01 16:27:30.216	\N	2026-02-01 16:23:55.278743	2026-02-01 16:27:30.216	\N
990f469b-088f-4d7e-9166-97646d526b4e	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	HP-HS-2026-SML-000101	new_registration	\N	\N	\N	\N	\N	\N	\N	homestay	\N	\N	dfdsfsdf	silver	gp	1	Shimla	\N	Kupvi	\N	\N	\N	dsfsfs	\N		\N		fsfsd	171002		\N	\N	\N	Tests Test	female	6666666632	test@test.com	dfsf	666666666632	d_o	owned	0.00	new_project	1000.00	sqm	1	1	\N	2500.00	0	2	\N	0.00	0	4	\N	0.00	1		silver	\N	\N	\N	3	f	\N	\N	\N	\N	\N	\N	\N	\N	\N				Fire Safety Equipment Details (Annexure-I #6g) *		{"cctv": true, "fireSafety": true}	{}	{"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true, "17": true, "18": true}	\N	\N	3000.00	9000.00	900.00	450.00	0.00	1350.00	7650.00	0.00	0.00	under_scrutiny	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[{"id": "c93cf142-4a28-4d3b-ba0a-5abdaae170c4", "url": "/api/local-object/download/cfd6ee2b-8d4b-4953-8f8f-9b93d3b66af7?type=revenue-papers", "name": "Test_Doc01-Hindi.pdf", "type": "revenue_papers", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/cfd6ee2b-8d4b-4953-8f8f-9b93d3b66af7?type=revenue-papers", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "revenue_papers"}, {"id": "53306d5c-f219-4c04-a0eb-bf9dcf00a240", "url": "/api/local-object/download/71df8145-6d7b-4a50-b184-235c809b9779?type=affidavit-section29", "name": "Test_Doc01-Hindi.pdf", "type": "affidavit_section_29", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/71df8145-6d7b-4a50-b184-235c809b9779?type=affidavit-section29", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "affidavit_section_29"}, {"id": "6ee9f6ac-7fd1-4943-bde2-6ab24e64db4c", "url": "/api/local-object/download/125bc0aa-c98e-4c69-b72b-cde4c9be555c?type=undertaking-form-c", "name": "Test_Doc01-Hindi.pdf", "type": "undertaking_form_c", "fileName": "Test_Doc01-Hindi.pdf", "filePath": "/api/local-object/download/125bc0aa-c98e-4c69-b72b-cde4c9be555c?type=undertaking-form-c", "fileSize": 61398, "mimeType": "application/pdf", "documentType": "undertaking_form_c"}, {"id": "4da19689-16e7-415e-987a-eab02663c341", "url": "/api/local-object/download/2d35054d-4633-4fd6-ad4b-7bf9e11c1df4?type=property-photo", "name": "519109575.jpg", "type": "property_photo", "fileName": "519109575.jpg", "filePath": "/api/local-object/download/2d35054d-4633-4fd6-ad4b-7bf9e11c1df4?type=property-photo", "fileSize": 96524, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "258685d7-9fab-4a45-9b08-d6b91b8a945a", "url": "/api/local-object/download/18e0cd67-b285-4a8e-8dc4-af693267316a?type=property-photo", "name": "529253340.jpg", "type": "property_photo", "fileName": "529253340.jpg", "filePath": "/api/local-object/download/18e0cd67-b285-4a8e-8dc4-af693267316a?type=property-photo", "fileSize": 13584, "mimeType": "image/jpeg", "documentType": "property_photo"}, {"id": "b452da5b-7e0c-49a4-b263-0afecc85bc68", "url": "/api/local-object/download/caf0627d-7574-40ad-a5cd-ae6ed9808164?type=property-photo", "name": "529253372.jpg", "type": "property_photo", "fileName": "529253372.jpg", "filePath": "/api/local-object/download/caf0627d-7574-40ad-a5cd-ae6ed9808164?type=property-photo", "fileSize": 98782, "mimeType": "image/jpeg", "documentType": "property_photo"}]	\N	\N	\N	paid	A26B125852	1.00	2026-02-04 00:00:00	\N	\N	2026-02-04 03:49:49.417	\N	2026-02-04 03:47:07.251578	2026-02-04 03:50:16.895	\N
\.


--
-- Data for Name: inspection_orders; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.inspection_orders (id, application_id, scheduled_by, scheduled_date, assigned_to, assigned_date, inspection_date, inspection_address, special_instructions, status, dtdo_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inspection_reports; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.inspection_reports (id, inspection_order_id, application_id, submitted_by, submitted_date, actual_inspection_date, room_count_verified, actual_room_count, category_meets_standards, recommended_category, mandatory_checklist, mandatory_remarks, desirable_checklist, desirable_remarks, amenities_verified, amenities_issues, fire_safety_compliant, fire_safety_issues, structural_safety, structural_issues, overall_satisfactory, recommendation, detailed_findings, inspection_photos, report_document_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lgd_blocks; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.lgd_blocks (id, lgd_code, block_name, district_id, tehsil_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lgd_districts; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.lgd_districts (id, lgd_code, district_name, division_name, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lgd_gram_panchayats; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.lgd_gram_panchayats (id, lgd_code, gram_panchayat_name, district_id, block_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lgd_tehsils; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.lgd_tehsils (id, lgd_code, tehsil_name, district_id, tehsil_type, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lgd_urban_bodies; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.lgd_urban_bodies (id, lgd_code, urban_body_name, district_id, body_type, number_of_wards, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: login_otp_challenges; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.login_otp_challenges (id, user_id, otp_hash, expires_at, consumed_at, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.notifications (id, user_id, application_id, type, title, message, channels, is_read, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: objections; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.objections (id, application_id, inspection_report_id, raised_by, raised_date, objection_type, objection_title, objection_description, severity, response_deadline, status, resolution_notes, resolved_by, resolved_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: password_reset_challenges; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.password_reset_challenges (id, user_id, channel, recipient, otp_hash, expires_at, consumed_at, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.payments (id, application_id, payment_type, amount, payment_gateway, gateway_transaction_id, payment_method, payment_status, payment_link, qr_code_url, payment_link_expiry_date, initiated_at, completed_at, receipt_number, receipt_url) FROM stdin;
\.


--
-- Data for Name: production_stats; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.production_stats (id, total_applications, approved_applications, rejected_applications, pending_applications, scraped_at, source_url) FROM stdin;
c136ea40-b254-4614-a276-da40e98950c0	4	4	4	4	2026-01-08 00:46:39.924033	https://eservices.himachaltourism.gov.in/
48fdc8d0-692e-4a37-993a-e54688142566	4	4	4	4	2026-01-08 00:46:39.942396	https://eservices.himachaltourism.gov.in/
802136d7-fc57-4009-a736-eedb97a56554	4	4	4	4	2026-01-08 00:48:31.414282	https://eservices.himachaltourism.gov.in/
1acd27ac-af25-46cf-bc73-80471dd96616	4	4	4	4	2026-01-08 00:48:31.514408	https://eservices.himachaltourism.gov.in/
76463abc-4c37-4429-8ce4-9b10ec387da7	4	4	4	4	2026-01-08 01:05:36.499225	https://eservices.himachaltourism.gov.in/
9c6b11f1-f571-480b-960d-2a4968029dc7	4	4	4	4	2026-01-08 01:06:52.657354	https://eservices.himachaltourism.gov.in/
dd300da0-236e-4ce9-9d41-8771def9a5ab	4	4	4	4	2026-01-08 01:17:47.686854	https://eservices.himachaltourism.gov.in/
b47ebbb2-136d-4c0c-b62a-f9cc8c935e95	4	4	4	4	2026-01-08 01:39:30.119468	https://eservices.himachaltourism.gov.in/
8b18c48a-a4e5-498d-8eeb-79aa97c48d09	4	4	4	4	2026-01-08 01:40:36.11727	https://eservices.himachaltourism.gov.in/
58695279-7d14-4e30-8ac6-06607529780a	4	4	4	4	2026-01-08 01:48:31.397839	https://eservices.himachaltourism.gov.in/
ef38131c-6a0f-4bd2-8ce8-a61dfd138778	4	4	4	4	2026-01-08 01:48:31.49186	https://eservices.himachaltourism.gov.in/
3a91ea49-2635-4724-8310-82ac067c769d	4	4	4	4	2026-01-08 02:40:35.749051	https://eservices.himachaltourism.gov.in/
d3dc6040-b0aa-445c-a090-12eec34f953e	4	4	4	4	2026-01-08 02:48:31.378308	https://eservices.himachaltourism.gov.in/
f377dc4c-3c5e-4f42-a19e-93d2436e7478	4	4	4	4	2026-01-08 02:48:31.495727	https://eservices.himachaltourism.gov.in/
a86f12a0-5a76-46a0-9bfd-03228379303b	4	4	4	4	2026-01-08 03:40:35.75908	https://eservices.himachaltourism.gov.in/
01ce343e-13fa-4f55-879e-6fdd46b7e370	4	4	4	4	2026-01-08 03:48:31.393771	https://eservices.himachaltourism.gov.in/
bbc6a72c-1956-4ce6-ac8e-1f5ce6833763	4	4	4	4	2026-01-08 03:48:31.508194	https://eservices.himachaltourism.gov.in/
36d2c9ce-f454-4671-b4d6-3ecc2da85d78	4	4	4	4	2026-01-08 04:40:35.737525	https://eservices.himachaltourism.gov.in/
e268d4ee-db7d-4185-b52e-3c128a157f2c	4	4	4	4	2026-01-08 04:48:31.412989	https://eservices.himachaltourism.gov.in/
a04c8e3b-eff7-416f-8786-20ff83c17dca	4	4	4	4	2026-01-08 04:48:31.482347	https://eservices.himachaltourism.gov.in/
c7c30e56-e690-4f79-b7c0-046074eabd01	4	4	4	4	2026-01-08 05:40:35.773548	https://eservices.himachaltourism.gov.in/
625f50ee-bac5-4579-8449-5b841e33a3ba	4	4	4	4	2026-01-08 05:48:31.414763	https://eservices.himachaltourism.gov.in/
d132813f-6306-426a-8cfd-cf2ea510ac22	4	4	4	4	2026-01-08 05:48:31.497109	https://eservices.himachaltourism.gov.in/
d714c17e-8846-44a6-a1d8-fb6c97c2219c	4	4	4	4	2026-01-08 06:40:35.79278	https://eservices.himachaltourism.gov.in/
3fd8d835-8738-4aee-ac9a-81c2c9821907	4	4	4	4	2026-01-08 06:48:31.406364	https://eservices.himachaltourism.gov.in/
d7989282-a463-4584-a0c6-ec66eb13c5bc	4	4	4	4	2026-01-08 06:48:31.521966	https://eservices.himachaltourism.gov.in/
21b9f1ec-2781-4875-96c0-7c9d6b5fc34c	4	4	4	4	2026-01-08 07:40:35.796874	https://eservices.himachaltourism.gov.in/
3ca6d223-8e7d-47b6-a95e-45150a3d5da7	4	4	4	4	2026-01-08 07:48:31.407771	https://eservices.himachaltourism.gov.in/
be2976e8-f4a5-40de-b828-18005a94324b	4	4	4	4	2026-01-08 07:48:31.514086	https://eservices.himachaltourism.gov.in/
2d72a890-7c0f-4aa0-9216-29129f9812d2	4	4	4	4	2026-01-08 08:40:35.79803	https://eservices.himachaltourism.gov.in/
804298f3-e631-49d7-8211-bd11de1f2b09	4	4	4	4	2026-01-08 08:48:31.40491	https://eservices.himachaltourism.gov.in/
01a9aee3-f922-49dc-a706-acbb72e0bd6d	4	4	4	4	2026-01-08 08:48:31.503526	https://eservices.himachaltourism.gov.in/
45467045-23e8-47e5-acb8-48aa398bd3df	4	4	4	4	2026-01-08 09:40:35.815218	https://eservices.himachaltourism.gov.in/
f874ff17-5586-4ed7-b0f8-3d13068fa41a	4	4	4	4	2026-01-08 09:48:31.409262	https://eservices.himachaltourism.gov.in/
dbdcf2d4-1669-4473-bb33-b2a1e5c83618	4	4	4	4	2026-01-08 09:48:31.498021	https://eservices.himachaltourism.gov.in/
fc7e1bb1-8fd3-4f80-8525-6f0c5936ff55	4	4	4	4	2026-01-10 08:34:31.090238	https://eservices.himachaltourism.gov.in/
1138c7cd-bc27-4396-a72f-cac27296de7a	4	4	4	4	2026-01-10 08:46:15.956129	https://eservices.himachaltourism.gov.in/
04bd6fbe-e8aa-48e9-bf75-3e796b7d30d5	4	4	4	4	2026-01-10 08:49:30.002659	https://eservices.himachaltourism.gov.in/
2c498be3-39db-4ab4-bda2-9c9908530eba	4	4	4	4	2026-01-10 08:54:40.007042	https://eservices.himachaltourism.gov.in/
2961722f-c641-4435-aa24-00518ff8d759	4	4	4	4	2026-01-10 09:02:34.894845	https://eservices.himachaltourism.gov.in/
0441e383-f951-4d6e-a0a9-730ab55062a6	4	4	4	4	2026-01-10 09:06:48.620387	https://eservices.himachaltourism.gov.in/
b638656a-a1f9-45f3-a1c6-1ebb74b85bff	4	4	4	4	2026-01-10 10:06:49.699648	https://eservices.himachaltourism.gov.in/
88a2e931-8939-4cc1-898f-781e1029331d	4	4	4	4	2026-01-10 11:06:48.66553	https://eservices.himachaltourism.gov.in/
b941ab94-d037-42e5-bc30-a07d65c0888f	4	4	4	4	2026-01-10 12:06:48.721491	https://eservices.himachaltourism.gov.in/
83f4f499-807e-4c82-9a23-6a891da352f6	4	4	4	4	2026-01-10 13:06:48.72717	https://eservices.himachaltourism.gov.in/
f16657a8-5ec5-4ac7-bfa1-c923a1d50e31	4	4	4	4	2026-01-10 14:06:48.715277	https://eservices.himachaltourism.gov.in/
2bf72372-d7a4-45d6-8f38-f59a78a271f9	4	4	4	4	2026-01-10 15:06:48.702035	https://eservices.himachaltourism.gov.in/
89cd05d4-874b-4799-bd47-9aeb3d00d160	4	4	4	4	2026-01-10 16:06:48.734989	https://eservices.himachaltourism.gov.in/
b2aeb2f1-ab59-4c8a-a01d-c2949ab730d3	4	4	4	4	2026-01-10 17:06:48.733301	https://eservices.himachaltourism.gov.in/
4b54412d-f4f1-4ddf-bb25-a0fa70948903	4	4	4	4	2026-01-10 18:06:48.766655	https://eservices.himachaltourism.gov.in/
ba7ae7d1-126d-4db4-8b63-b99a1dd99c79	4	4	4	4	2026-01-10 19:06:48.782261	https://eservices.himachaltourism.gov.in/
49e0d5f7-76e9-477f-a8bc-723165f387dc	4	4	4	4	2026-01-10 20:06:48.771268	https://eservices.himachaltourism.gov.in/
79405365-55a3-469f-bf1b-15fa9a8cee0c	4	4	4	4	2026-01-10 21:06:48.824673	https://eservices.himachaltourism.gov.in/
b2374ced-a9cb-4165-aa27-f2ed311005f9	4	4	4	4	2026-01-10 22:06:48.901048	https://eservices.himachaltourism.gov.in/
53c4e5e2-7879-4e17-85db-86c16843d5ab	4	4	4	4	2026-01-10 23:06:48.833165	https://eservices.himachaltourism.gov.in/
ad7e00f2-b127-447c-9ffb-38dc304c13ee	4	4	4	4	2026-01-11 00:06:48.87723	https://eservices.himachaltourism.gov.in/
d8fb6566-32f0-439e-930b-9da7f05e2cb2	4	4	4	4	2026-01-11 01:06:48.890802	https://eservices.himachaltourism.gov.in/
7dc6aece-12a4-4354-9ffc-d8c09673515c	4	4	4	4	2026-01-11 02:06:48.921295	https://eservices.himachaltourism.gov.in/
a22d6e20-3d36-4f40-ad45-e062e9f00b6f	4	4	4	4	2026-01-11 03:06:48.926607	https://eservices.himachaltourism.gov.in/
0606f5b0-f939-43e3-85d2-7e5eae73a567	4	4	4	4	2026-01-11 04:06:48.934022	https://eservices.himachaltourism.gov.in/
f7b69f19-e0a2-4e21-b94b-5ecf84ba5e6e	4	4	4	4	2026-01-11 05:06:48.985722	https://eservices.himachaltourism.gov.in/
01e4df65-6f42-4f7f-9df3-e0ff8d421637	4	4	4	4	2026-01-11 06:06:48.932377	https://eservices.himachaltourism.gov.in/
ef5abf76-a145-422f-96c7-128879a5e14c	4	4	4	4	2026-01-11 07:06:48.952972	https://eservices.himachaltourism.gov.in/
48ec7697-0048-4ca6-983f-e53d4bf6198e	4	4	4	4	2026-01-11 08:06:48.9596	https://eservices.himachaltourism.gov.in/
3629979b-4715-4109-8587-cb42be96ddd4	4	4	4	4	2026-01-11 09:06:48.970047	https://eservices.himachaltourism.gov.in/
02e6ca18-79db-40a2-9773-a8f8598f2f94	4	4	4	4	2026-01-11 10:06:49.009207	https://eservices.himachaltourism.gov.in/
a30a63d0-1d38-4107-989f-03d9c2b3a9aa	4	4	4	4	2026-01-11 11:06:49.018401	https://eservices.himachaltourism.gov.in/
7e95937d-9c7c-48ca-8e2b-208a68860930	4	4	4	4	2026-01-11 12:06:49.048236	https://eservices.himachaltourism.gov.in/
0c5745ff-abf3-4cfe-8a33-90edab754a5f	4	4	4	4	2026-01-12 07:47:55.812886	https://eservices.himachaltourism.gov.in/
85f823af-9c5a-43b7-b372-4f185c78ceda	4	4	4	4	2026-01-12 07:47:56.074414	https://eservices.himachaltourism.gov.in/
36ca24a8-99d3-47d9-8eca-391d6344760d	4	4	4	4	2026-01-12 08:47:55.792272	https://eservices.himachaltourism.gov.in/
5f72041f-4b45-4056-af13-2dbd3ed8a1a9	4	4	4	4	2026-01-12 08:47:55.794146	https://eservices.himachaltourism.gov.in/
49a07067-2d56-4312-9ba0-964de24d7436	4	4	4	4	2026-01-12 09:04:08.56653	https://eservices.himachaltourism.gov.in/
e25da85d-103a-4359-9e0b-b7db92b8dfa6	4	4	4	4	2026-01-12 09:04:08.786371	https://eservices.himachaltourism.gov.in/
1bda1b41-4176-4957-a4b3-70d052a3d310	4	4	4	4	2026-01-12 09:09:53.748893	https://eservices.himachaltourism.gov.in/
963de838-95fb-4501-a148-22f1f161bc8c	4	4	4	4	2026-01-12 09:09:53.862423	https://eservices.himachaltourism.gov.in/
3861da7f-edf6-4cc6-b102-32827b22d805	4	4	4	4	2026-01-12 09:14:20.706822	https://eservices.himachaltourism.gov.in/
f6d8c895-ffa7-4741-8c0e-91fdaa8bc28c	4	4	4	4	2026-01-12 09:14:20.876452	https://eservices.himachaltourism.gov.in/
2b473e7a-9895-4b0e-82b1-62a54ac2b022	4	4	4	4	2026-01-12 09:18:56.194821	https://eservices.himachaltourism.gov.in/
e8c09698-c94b-4666-b6ff-2dcfe5c6a413	4	4	4	4	2026-01-12 09:18:56.376183	https://eservices.himachaltourism.gov.in/
2e18a09f-7141-434d-a54c-17c2bef32027	4	4	4	4	2026-01-12 09:23:12.24457	https://eservices.himachaltourism.gov.in/
d0360ca6-bc11-4e3a-9a40-c33abba22e9f	4	4	4	4	2026-01-12 09:23:12.508276	https://eservices.himachaltourism.gov.in/
977bb75f-616f-4c69-bd91-4660e550319c	4	4	4	4	2026-01-12 09:27:48.831671	https://eservices.himachaltourism.gov.in/
db7e3425-c738-4637-a13f-51fb0b373aa9	4	4	4	4	2026-01-12 09:27:49.19247	https://eservices.himachaltourism.gov.in/
350bd9b0-dee1-412f-b256-946c6d4eac35	4	4	4	4	2026-01-12 09:31:33.473609	https://eservices.himachaltourism.gov.in/
6665d6ad-9eaa-4940-a91d-5d3485e64676	4	4	4	4	2026-01-12 09:31:33.660097	https://eservices.himachaltourism.gov.in/
2a1f186d-56e2-4ea8-9275-30655b373352	4	4	4	4	2026-01-12 09:36:32.417717	https://eservices.himachaltourism.gov.in/
c848f405-a2f7-4bef-87bc-179f3797f0f4	4	4	4	4	2026-01-12 09:36:32.685821	https://eservices.himachaltourism.gov.in/
62233edc-c047-4a41-8c2f-090148d4bdac	4	4	4	4	2026-01-12 09:40:59.342522	https://eservices.himachaltourism.gov.in/
f100d868-d378-4f7c-9548-319ba88d182f	4	4	4	4	2026-01-12 09:40:59.56545	https://eservices.himachaltourism.gov.in/
76cb2899-44cc-499c-96f4-94f96be5e9b1	4	4	4	4	2026-01-12 09:44:57.115008	https://eservices.himachaltourism.gov.in/
467093f8-0e50-4b47-b164-32bceef79362	4	4	4	4	2026-01-12 09:44:57.339264	https://eservices.himachaltourism.gov.in/
cdd5d957-bd78-4f9f-9a84-6fe46d988c74	4	4	4	4	2026-01-12 09:47:40.692468	https://eservices.himachaltourism.gov.in/
5b70d3d5-1f64-471b-bc8c-9419bda61fea	4	4	4	4	2026-01-12 09:47:40.957531	https://eservices.himachaltourism.gov.in/
6ed7d7c9-cbff-4486-80b8-43bcd82935c5	4	4	4	4	2026-01-12 09:52:56.18153	https://eservices.himachaltourism.gov.in/
bd99bebe-77e5-465f-8750-52d0fc684e5d	4	4	4	4	2026-01-12 09:52:56.390072	https://eservices.himachaltourism.gov.in/
a6f62c88-8785-49dd-9502-6d56c464f634	4	4	4	4	2026-01-12 09:55:08.862526	https://eservices.himachaltourism.gov.in/
29222c65-6b30-48cd-a7a8-7e41315b8aa6	4	4	4	4	2026-01-12 09:55:08.964439	https://eservices.himachaltourism.gov.in/
849d1d0f-1b32-4de6-bdd3-109c6bb57b9c	4	4	4	4	2026-01-12 10:00:15.067817	https://eservices.himachaltourism.gov.in/
6680b3dc-313f-40cf-8ef7-729f38387353	4	4	4	4	2026-01-12 10:00:15.172538	https://eservices.himachaltourism.gov.in/
5528e273-7588-490b-a758-56f643b08232	4	4	4	4	2026-01-12 10:04:15.36109	https://eservices.himachaltourism.gov.in/
93990a25-6745-435e-b493-552b603f2e54	4	4	4	4	2026-01-12 10:04:15.532528	https://eservices.himachaltourism.gov.in/
4309462d-932c-48d4-96c3-a3b9eb0fce6c	4	4	4	4	2026-01-12 10:09:22.583528	https://eservices.himachaltourism.gov.in/
2db58972-9562-4ee8-a2bd-868499f9b424	4	4	4	4	2026-01-12 10:09:22.75306	https://eservices.himachaltourism.gov.in/
83241200-932c-4b01-b96a-08467c5d50d7	4	4	4	4	2026-01-12 10:11:58.306899	https://eservices.himachaltourism.gov.in/
b1c8cabf-09e1-4e38-8a5c-69d94ae879f1	4	4	4	4	2026-01-12 10:11:58.595419	https://eservices.himachaltourism.gov.in/
f34e3714-38bf-4c9c-a803-0c98fa0cec1e	4	4	4	4	2026-01-12 10:16:50.351598	https://eservices.himachaltourism.gov.in/
4f44941e-d4b4-4521-98e6-1a94c55d3d1b	4	4	4	4	2026-01-12 10:16:50.548143	https://eservices.himachaltourism.gov.in/
9d8e8be7-e283-494c-9d02-66008a313f6a	4	4	4	4	2026-01-12 10:20:20.656174	https://eservices.himachaltourism.gov.in/
4037ebbd-1b9b-43e2-a858-c32aca26c793	4	4	4	4	2026-01-12 10:20:21.953533	https://eservices.himachaltourism.gov.in/
71034ef9-0f09-4b5a-8bdd-123be57a1c18	4	4	4	4	2026-01-12 10:22:57.056537	https://eservices.himachaltourism.gov.in/
5f6baddd-1c56-4ac3-b032-6595576d5451	4	4	4	4	2026-01-12 10:22:57.28478	https://eservices.himachaltourism.gov.in/
df2e2f99-4d7c-4a79-ad22-1cb1e0e0c3a9	4	4	4	4	2026-01-12 10:26:15.56827	https://eservices.himachaltourism.gov.in/
8dc2fbed-7539-4597-b4b3-97e41f7ca25d	4	4	4	4	2026-01-12 10:26:15.679855	https://eservices.himachaltourism.gov.in/
87aac52e-c6c6-4846-aa5a-65cbcb3d4d56	4	4	4	4	2026-01-12 10:29:49.17847	https://eservices.himachaltourism.gov.in/
570bfb6e-0dc1-4c58-b3b1-2617f8409ac8	4	4	4	4	2026-01-12 10:29:49.363525	https://eservices.himachaltourism.gov.in/
6d2e69d8-3127-4c38-998b-5b5ef86216e4	4	4	4	4	2026-01-12 10:33:38.413936	https://eservices.himachaltourism.gov.in/
59d392fd-fa8b-4ad1-8a34-000cbc546f10	4	4	4	4	2026-01-12 10:33:38.676524	https://eservices.himachaltourism.gov.in/
686703a1-2160-4307-ac2d-64df1adb3763	4	4	4	4	2026-01-12 10:40:09.398648	https://eservices.himachaltourism.gov.in/
3b3b4bf8-e313-4ce5-b8d0-4a29350f5aec	4	4	4	4	2026-01-12 10:40:09.557678	https://eservices.himachaltourism.gov.in/
aae90c0c-cb24-4a53-81da-8953a2e313f6	4	4	4	4	2026-01-12 10:47:30.304298	https://eservices.himachaltourism.gov.in/
492517d9-a71c-4be1-a737-6d2ccbb65da2	4	4	4	4	2026-01-12 10:47:30.410521	https://eservices.himachaltourism.gov.in/
d3acfa19-c551-4f18-a3de-2c9499162d42	4	4	4	4	2026-01-12 10:52:05.781415	https://eservices.himachaltourism.gov.in/
924b0591-a200-4545-ac9b-2db57ba5b3bf	4	4	4	4	2026-01-12 10:52:06.105525	https://eservices.himachaltourism.gov.in/
f7f1306b-fa10-4103-89c7-50919de495b6	4	4	4	4	2026-01-12 11:09:56.727055	https://eservices.himachaltourism.gov.in/
ce63dd17-0b68-4bfc-840f-f35e7f6337e1	4	4	4	4	2026-01-12 11:09:57.042319	https://eservices.himachaltourism.gov.in/
68e94361-1623-49b4-bfd6-d7aeeacd7f2a	4	4	4	4	2026-01-12 11:11:36.615518	https://eservices.himachaltourism.gov.in/
26878741-079e-410c-93d7-3c267d6dfcc5	4	4	4	4	2026-01-12 11:11:36.863397	https://eservices.himachaltourism.gov.in/
1333fe32-bfe0-4bf7-8497-648f8518a138	4	4	4	4	2026-01-12 11:19:53.180936	https://eservices.himachaltourism.gov.in/
f4e494f9-0024-4c62-ad2c-bc266bddb607	4	4	4	4	2026-01-12 11:19:53.310524	https://eservices.himachaltourism.gov.in/
091f0414-48a9-4188-bc79-26249475ab8e	4	4	4	4	2026-01-12 12:19:53.179353	https://eservices.himachaltourism.gov.in/
6045c998-71c4-4149-8e38-ce774ee93441	4	4	4	4	2026-01-12 12:19:53.264092	https://eservices.himachaltourism.gov.in/
b15f107a-380f-4870-be61-ef68a6c82f73	4	4	4	4	2026-01-12 13:19:53.199418	https://eservices.himachaltourism.gov.in/
36176f28-8bfc-42f0-97ca-93a1ec46890b	4	4	4	4	2026-01-12 13:19:53.24063	https://eservices.himachaltourism.gov.in/
212f8c7c-4d90-4c98-b569-c22126ce8103	4	4	4	4	2026-01-12 14:19:53.18719	https://eservices.himachaltourism.gov.in/
0b4d04e5-b116-4546-b3d1-e1f02e160979	4	4	4	4	2026-01-12 14:19:53.266184	https://eservices.himachaltourism.gov.in/
2c749c2e-a0a0-4143-8ce9-70745ba9fe4d	4	4	4	4	2026-01-12 15:19:53.17421	https://eservices.himachaltourism.gov.in/
5859b66f-b46d-4278-86c1-d38d5c9a3651	4	4	4	4	2026-01-12 15:19:53.255743	https://eservices.himachaltourism.gov.in/
fd13899e-7ed3-47d8-948f-3226e854371e	4	4	4	4	2026-01-12 16:19:53.231376	https://eservices.himachaltourism.gov.in/
ad6bcd41-500f-452b-994f-f8776e74c4e5	4	4	4	4	2026-01-12 16:19:53.258689	https://eservices.himachaltourism.gov.in/
b44872a8-5621-4ef6-b3f5-71d9dd5ee3e6	4	4	4	4	2026-01-12 16:23:39.689518	https://eservices.himachaltourism.gov.in/
5010f28f-1fd2-47b6-bfdf-2ab65a9d4c69	4	4	4	4	2026-01-12 16:23:39.711413	https://eservices.himachaltourism.gov.in/
d9f525ee-35bc-4a74-80da-5e6fb5e65940	4	4	4	4	2026-01-12 16:37:12.751031	https://eservices.himachaltourism.gov.in/
2ba00f78-725c-47d9-8cbe-213b87af1c88	4	4	4	4	2026-01-12 16:37:12.934196	https://eservices.himachaltourism.gov.in/
74cf0532-e289-4a9c-9171-3bbd2a26f940	4	4	4	4	2026-01-12 16:37:49.998256	https://eservices.himachaltourism.gov.in/
3e649ab8-e891-405a-a2d7-79ade92f0791	4	4	4	4	2026-01-12 16:37:50.133188	https://eservices.himachaltourism.gov.in/
a7fc87e0-2e2c-4ff7-aa3f-88bcd8ed177e	4	4	4	4	2026-01-12 17:37:50.025296	https://eservices.himachaltourism.gov.in/
d9e47b55-a48c-4841-a2aa-3e36df3ca71e	4	4	4	4	2026-01-12 17:37:50.090106	https://eservices.himachaltourism.gov.in/
7630a2cf-6214-45d2-a81d-0321e4dae86e	4	4	4	4	2026-01-12 17:53:59.987779	https://eservices.himachaltourism.gov.in/
4b12d1d8-fa8b-4120-ba42-a0ec52d1a229	4	4	4	4	2026-01-12 17:54:00.299766	https://eservices.himachaltourism.gov.in/
9bffce57-8e68-4b22-82d0-3dc29c31c987	4	4	4	4	2026-01-12 18:48:14.836253	https://eservices.himachaltourism.gov.in/
d9880a3a-7a4c-4cf4-bb66-678e718e1500	4	4	4	4	2026-01-12 18:48:14.956369	https://eservices.himachaltourism.gov.in/
0effccf2-c532-44e5-b0dd-ccf3455db039	4	4	4	4	2026-01-12 18:53:33.40719	https://eservices.himachaltourism.gov.in/
d6929139-264f-4680-b536-2718c73406a2	4	4	4	4	2026-01-12 18:53:58.949378	https://eservices.himachaltourism.gov.in/
e0c80e94-e60b-4969-8603-ef0a4ea4498b	4	4	4	4	2026-01-12 18:59:29.414425	https://eservices.himachaltourism.gov.in/
2c00c733-a7a7-418e-87c3-505e1479a991	4	4	4	4	2026-01-12 19:59:29.4264	https://eservices.himachaltourism.gov.in/
e4e5a813-a20e-4189-8eb8-939ddb65b244	4	4	4	4	2026-01-12 20:59:29.450214	https://eservices.himachaltourism.gov.in/
7d5c7f17-e972-46fc-afe2-6037f676e61c	4	4	4	4	2026-01-12 21:59:29.474445	https://eservices.himachaltourism.gov.in/
347d61aa-4806-45b1-8b93-d22b326d10dd	4	4	4	4	2026-01-12 22:59:29.477494	https://eservices.himachaltourism.gov.in/
577952bd-24fd-4001-af92-fe0b346501aa	4	4	4	4	2026-01-12 23:59:29.502989	https://eservices.himachaltourism.gov.in/
bad0ae84-e0e5-4c38-a8b4-9530751912f7	4	4	4	4	2026-01-13 00:59:29.51108	https://eservices.himachaltourism.gov.in/
96bdf6d2-b72f-4e2e-a86e-e7cbe764d6a1	4	4	4	4	2026-01-13 01:48:00.81707	https://eservices.himachaltourism.gov.in/
111ffe40-b0c5-4fa6-ab11-a2015f7875c1	4	4	4	4	2026-01-13 02:08:08.833549	https://eservices.himachaltourism.gov.in/
0450ca71-eb4f-49ba-a2d3-78238ad07642	4	4	4	4	2026-01-13 03:08:08.873143	https://eservices.himachaltourism.gov.in/
5b3cb9e8-d482-4670-b8b4-263096ed8c80	4	4	4	4	2026-01-13 04:08:08.896945	https://eservices.himachaltourism.gov.in/
9080e125-aa84-4d59-9200-27c109c444d6	4	4	4	4	2026-01-13 04:21:05.40365	https://eservices.himachaltourism.gov.in/
b1a5f409-5d00-4f2c-9510-6cabfe9e0d1f	4	4	4	4	2026-01-13 04:21:05.867399	https://eservices.himachaltourism.gov.in/
250eddc9-e333-4821-962e-d98f1e5428de	4	4	4	4	2026-01-13 05:21:05.849938	https://eservices.himachaltourism.gov.in/
03cfe51a-d8f5-45c7-ad72-78ebdaafe616	4	4	4	4	2026-01-13 05:21:06.499713	https://eservices.himachaltourism.gov.in/
2ee01c1f-7054-4313-9a0f-4ca2b2f1b7ce	4	4	4	4	2026-01-13 06:21:05.436147	https://eservices.himachaltourism.gov.in/
b4d738ad-96a8-4dea-a0c4-19f35dd5caea	4	4	4	4	2026-01-13 06:21:05.831556	https://eservices.himachaltourism.gov.in/
30dd3674-4fbb-42af-942e-211345c4819c	4	4	4	4	2026-01-13 07:21:05.455464	https://eservices.himachaltourism.gov.in/
71390735-24c6-4c7a-8cec-f5f97af68a7f	4	4	4	4	2026-01-13 07:21:06.071967	https://eservices.himachaltourism.gov.in/
9e1db3bb-852b-4813-adb2-e9647be83c79	4	4	4	4	2026-01-13 08:21:05.415091	https://eservices.himachaltourism.gov.in/
7f688a2f-38d5-4a03-805d-c70647caa4cc	4	4	4	4	2026-01-13 08:21:05.832194	https://eservices.himachaltourism.gov.in/
83670fbf-887d-4916-800b-c86d9b38084a	4	4	4	4	2026-01-13 09:21:05.427022	https://eservices.himachaltourism.gov.in/
d8ab7896-bf1f-41e9-b64a-c4effef0c7f8	4	4	4	4	2026-01-13 09:21:05.834342	https://eservices.himachaltourism.gov.in/
7fd63bb3-9614-44c6-a26a-f66126315ae6	4	4	4	4	2026-01-13 10:21:05.44423	https://eservices.himachaltourism.gov.in/
abeef943-fe8e-432e-a8e7-92c0b5232253	4	4	4	4	2026-01-13 10:21:05.841331	https://eservices.himachaltourism.gov.in/
db6f6433-86a0-402d-a312-b2211810c0e3	4	4	4	4	2026-01-13 11:21:05.428023	https://eservices.himachaltourism.gov.in/
8809fe27-b632-4bf9-905b-80e7942925de	4	4	4	4	2026-01-13 11:21:05.822311	https://eservices.himachaltourism.gov.in/
8d13cad3-6227-4b4e-916b-06c8b225629b	4	4	4	4	2026-01-13 12:21:05.416646	https://eservices.himachaltourism.gov.in/
9a93a6dc-3201-4737-b029-02c7d1ebdd17	4	4	4	4	2026-01-13 12:21:05.82558	https://eservices.himachaltourism.gov.in/
29323220-65e3-4cd6-b58b-16e48c9e86c7	4	4	4	4	2026-01-13 13:21:05.425168	https://eservices.himachaltourism.gov.in/
e48101ac-6743-4ab8-89fc-1b500a444a28	4	4	4	4	2026-01-13 13:21:05.835926	https://eservices.himachaltourism.gov.in/
800af94d-5728-4685-b629-33f5ff6ac2b0	4	4	4	4	2026-01-13 14:21:15.440091	https://eservices.himachaltourism.gov.in/
48f11630-8178-473b-93c7-86a16c16da89	4	4	4	4	2026-01-13 14:21:15.592982	https://eservices.himachaltourism.gov.in/
2d27a7c7-f2c4-4a6a-a480-9a01abc8bbd6	4	4	4	4	2026-01-13 15:21:05.416737	https://eservices.himachaltourism.gov.in/
e9799fd1-5eb8-45ed-a156-5c550bcd1971	4	4	4	4	2026-01-13 15:21:05.819084	https://eservices.himachaltourism.gov.in/
d026c531-24f4-46f5-9b96-a675a73c1165	4	4	4	4	2026-01-13 16:21:05.424046	https://eservices.himachaltourism.gov.in/
6a85ccb4-2069-4d4f-8d5a-530b23216296	4	4	4	4	2026-01-13 16:21:05.829177	https://eservices.himachaltourism.gov.in/
6465d96b-d7ab-4f0c-9887-b36bee691f49	4	4	4	4	2026-01-13 17:21:05.421919	https://eservices.himachaltourism.gov.in/
682b6846-db64-4d93-9e1c-4d750b109660	4	4	4	4	2026-01-13 17:21:05.818878	https://eservices.himachaltourism.gov.in/
d009611f-bdcf-4907-95a9-49172793fa8d	4	4	4	4	2026-01-13 18:21:05.425576	https://eservices.himachaltourism.gov.in/
1d656942-60d5-4e02-9e81-4e4d1e86465c	4	4	4	4	2026-01-13 18:21:05.836415	https://eservices.himachaltourism.gov.in/
4eb752b6-ef8b-4d79-9fcf-636463d24da9	4	4	4	4	2026-01-13 19:21:05.468971	https://eservices.himachaltourism.gov.in/
630910a9-e288-439b-9ded-a2a7995b1890	4	4	4	4	2026-01-13 19:21:05.850276	https://eservices.himachaltourism.gov.in/
6478ba2b-c7e6-441c-8257-ba7e383b63c9	4	4	4	4	2026-01-13 20:21:05.493654	https://eservices.himachaltourism.gov.in/
1e6cb5ee-cf97-4150-a41b-65d52b1e6244	4	4	4	4	2026-01-13 20:21:05.854896	https://eservices.himachaltourism.gov.in/
082c8ea2-f79f-4bbd-a329-743ccbc2e651	4	4	4	4	2026-01-13 21:21:05.462372	https://eservices.himachaltourism.gov.in/
72b0d1be-cd5d-4851-a9e2-a20d98207866	4	4	4	4	2026-01-13 21:21:05.84791	https://eservices.himachaltourism.gov.in/
d6456e39-96cb-4e6e-a401-2055ee37f6cf	4	4	4	4	2026-01-13 22:21:05.440693	https://eservices.himachaltourism.gov.in/
76e93cfc-a04f-4264-8f47-43518839d330	4	4	4	4	2026-01-13 22:21:05.829698	https://eservices.himachaltourism.gov.in/
2de633ac-9a81-4944-a33a-2349e3f81c6a	4	4	4	4	2026-01-13 23:21:05.458137	https://eservices.himachaltourism.gov.in/
66975060-bddc-4055-933a-46ae153c258e	4	4	4	4	2026-01-13 23:21:05.827022	https://eservices.himachaltourism.gov.in/
faeefb66-d1ef-4ef9-b3fa-1302b9eddd56	4	4	4	4	2026-01-14 00:21:05.460239	https://eservices.himachaltourism.gov.in/
bdaaea1e-6af9-4444-b673-87663f77e396	4	4	4	4	2026-01-14 00:21:05.831032	https://eservices.himachaltourism.gov.in/
27fbd3cd-ce19-465c-8a5f-f599302ead20	4	4	4	4	2026-01-14 01:21:05.448262	https://eservices.himachaltourism.gov.in/
843a6967-bd68-44d1-b078-0ea96e155c4b	4	4	4	4	2026-01-14 01:21:05.83283	https://eservices.himachaltourism.gov.in/
6cc918c2-71e3-4c39-989a-42eef5656e9d	4	4	4	4	2026-01-14 02:21:05.447788	https://eservices.himachaltourism.gov.in/
a07c5fa9-3339-4a5f-9e4b-35b5434a39e5	4	4	4	4	2026-01-14 02:21:05.825839	https://eservices.himachaltourism.gov.in/
e762f417-b85a-4b86-8229-aaccc9500c7e	4	4	4	4	2026-01-14 03:21:19.445292	https://eservices.himachaltourism.gov.in/
e441277c-267e-4cb0-92ec-6943a8be2913	4	4	4	4	2026-01-14 03:21:19.529888	https://eservices.himachaltourism.gov.in/
70f8863e-d3f7-426a-aab0-9b2c1614af1d	4	4	4	4	2026-01-14 04:21:05.502667	https://eservices.himachaltourism.gov.in/
69d0b6b3-15b4-4803-a5af-654c003cab93	4	4	4	4	2026-01-14 04:21:05.849731	https://eservices.himachaltourism.gov.in/
02c6693d-07e9-467d-a740-0ea5a73f3f5e	4	4	4	4	2026-01-14 04:51:18.102644	https://eservices.himachaltourism.gov.in/
feca7eaf-7cb0-4dc2-a0b8-b635783cee1f	4	4	4	4	2026-01-14 05:21:05.930912	https://eservices.himachaltourism.gov.in/
5af76032-409e-4906-a037-2dc599b00d2c	4	4	4	4	2026-01-14 05:32:07.409858	https://eservices.himachaltourism.gov.in/
baf2c976-1cab-4e56-aa6c-ad03db46533a	4	4	4	4	2026-01-14 06:21:05.944665	https://eservices.himachaltourism.gov.in/
dcfc590f-d763-46b7-b1e9-bbaaa3d1363c	4	4	4	4	2026-01-14 06:32:07.391455	https://eservices.himachaltourism.gov.in/
1095561f-d14a-4946-b267-3502b444f005	4	4	4	4	2026-01-14 07:21:05.933522	https://eservices.himachaltourism.gov.in/
e2941c4c-8b73-4ce8-8161-380b213c1391	4	4	4	4	2026-01-14 07:30:16.440628	https://eservices.himachaltourism.gov.in/
465347f2-82dc-454b-902b-15beb1b51b42	4	4	4	4	2026-01-14 07:32:07.363196	https://eservices.himachaltourism.gov.in/
ee25cd31-4fd0-424f-b075-0ad8ae836a3b	4	4	4	4	2026-01-14 08:21:05.935886	https://eservices.himachaltourism.gov.in/
be548eaa-58fa-40fe-9843-51ba067fe549	4	4	4	4	2026-01-14 08:27:46.608507	https://eservices.himachaltourism.gov.in/
7f000f15-9b23-4460-bfac-3d0d3d2ebfb5	4	4	4	4	2026-01-14 08:32:07.417809	https://eservices.himachaltourism.gov.in/
9222b908-7dab-4fc2-8ae3-95cf6facc295	4	4	4	4	2026-01-14 08:35:14.704594	https://eservices.himachaltourism.gov.in/
c8900f3f-e72c-4c34-9675-9357a5de4d6d	4	4	4	4	2026-01-14 08:59:02.207824	https://eservices.himachaltourism.gov.in/
dd2f84aa-74ef-40a6-849c-3a1a37a2a794	4	4	4	4	2026-01-14 09:21:05.850169	https://eservices.himachaltourism.gov.in/
e5c67470-7766-4611-abf4-42a347e59bf9	4	4	4	4	2026-01-14 09:32:07.381709	https://eservices.himachaltourism.gov.in/
baa970a7-1db9-42dc-bf59-3b63cd767546	4	4	4	4	2026-01-14 10:21:05.937755	https://eservices.himachaltourism.gov.in/
913b9f3c-bf1b-4952-b769-18f753eee8ce	4	4	4	4	2026-01-14 10:22:22.499372	https://eservices.himachaltourism.gov.in/
9cde6ce8-0844-43aa-b26b-b2ca26daa36d	4	4	4	4	2026-01-14 10:32:07.392769	https://eservices.himachaltourism.gov.in/
d6229fb5-dc36-4a58-8be2-36bf7ef4a21c	4	4	4	4	2026-01-14 11:21:05.94618	https://eservices.himachaltourism.gov.in/
6e97e24d-926a-4521-bfb5-7e04eb99ab68	4	4	4	4	2026-01-14 11:22:21.900243	https://eservices.himachaltourism.gov.in/
a66bbaa3-6a43-4626-9c91-dbeb175ec58f	4	4	4	4	2026-01-14 11:32:07.469456	https://eservices.himachaltourism.gov.in/
ce6c118d-a09b-4dfc-aac4-6eefd9b51633	4	4	4	4	2026-01-14 12:21:05.927307	https://eservices.himachaltourism.gov.in/
31f38d7f-0775-4144-9bd2-33fbb0121f4a	4	4	4	4	2026-01-14 12:22:21.886596	https://eservices.himachaltourism.gov.in/
c55b48da-ecd9-4c46-bafe-5800797a9f18	4	4	4	4	2026-01-14 12:32:07.371363	https://eservices.himachaltourism.gov.in/
4f0a5c90-85f7-40b6-88ea-f9929c5877ec	4	4	4	4	2026-01-14 13:21:05.918789	https://eservices.himachaltourism.gov.in/
0e4fcf0f-7a4d-4f50-aeda-572d5718e4d8	4	4	4	4	2026-01-14 13:22:21.92683	https://eservices.himachaltourism.gov.in/
a27cc3d4-34a0-4acd-ac3f-06ef0bf3de83	4	4	4	4	2026-01-14 13:32:07.377658	https://eservices.himachaltourism.gov.in/
ffc38e62-4da1-45ec-a778-c9fe3975a7b5	4	4	4	4	2026-01-14 14:21:05.940473	https://eservices.himachaltourism.gov.in/
311aae32-aeb8-4864-b1a4-774bff526ff1	4	4	4	4	2026-01-14 14:22:21.876746	https://eservices.himachaltourism.gov.in/
300d1503-b460-40b3-b7b7-d68c2bc3f494	4	4	4	4	2026-01-14 14:32:07.397519	https://eservices.himachaltourism.gov.in/
48380520-2bfa-48fa-bcf7-81ebb721bf81	4	4	4	4	2026-01-14 15:21:05.940365	https://eservices.himachaltourism.gov.in/
da7d5110-cf14-41a5-ba05-c20357283ca1	4	4	4	4	2026-01-14 15:22:21.902932	https://eservices.himachaltourism.gov.in/
fd13afdb-2071-4974-bf6d-1d954b25b452	4	4	4	4	2026-01-14 15:32:07.427224	https://eservices.himachaltourism.gov.in/
c80ce6ca-a7d8-4914-93a0-124078d4e9e5	4	4	4	4	2026-01-14 15:37:04.793033	https://eservices.himachaltourism.gov.in/
cdc96304-8a03-4580-bb3f-d56510dbcd9a	4	4	4	4	2026-01-14 15:37:04.804291	https://eservices.himachaltourism.gov.in/
898ea7fb-e305-4d0f-aa4d-9f916e7a03c5	4	4	4	4	2026-01-14 15:38:22.957458	https://eservices.himachaltourism.gov.in/
7703e94c-667f-47ec-a24e-411fca00e7e9	4	4	4	4	2026-01-14 15:54:04.217212	https://eservices.himachaltourism.gov.in/
09fcd60f-156c-4b8c-8564-13de8368dc00	4	4	4	4	2026-01-14 15:54:58.248164	https://eservices.himachaltourism.gov.in/
a1063146-5dbd-42df-bb8b-065662e050d9	4	4	4	4	2026-01-14 15:55:46.126826	https://eservices.himachaltourism.gov.in/
45261ffe-a65d-4f16-9461-75d543289670	4	4	4	4	2026-01-14 16:55:45.78684	https://eservices.himachaltourism.gov.in/
a9664b94-7c99-4875-bc42-6db033792b2f	4	4	4	4	2026-01-14 17:55:45.721954	https://eservices.himachaltourism.gov.in/
b3b200e1-e4e8-4764-82bc-6dd10e4ee4d6	4	4	4	4	2026-01-14 18:55:45.719269	https://eservices.himachaltourism.gov.in/
98204179-5a13-4b4b-93e8-3e1cb4fb9cfe	4	4	4	4	2026-01-14 19:55:45.723353	https://eservices.himachaltourism.gov.in/
17f4a8e2-a24c-48f0-8651-d6c62558969d	4	4	4	4	2026-01-14 20:55:45.857327	https://eservices.himachaltourism.gov.in/
3bea82a0-a35e-4e06-a5de-6def4252597f	4	4	4	4	2026-01-14 21:55:45.771994	https://eservices.himachaltourism.gov.in/
63668612-6e98-4489-8ce8-e71d02e30443	4	4	4	4	2026-01-14 22:55:45.762915	https://eservices.himachaltourism.gov.in/
8322b869-5463-41fd-9301-61549eef53e3	4	4	4	4	2026-01-14 23:55:45.804285	https://eservices.himachaltourism.gov.in/
61e9dedc-ae20-46b9-acdf-b51509dff497	4	4	4	4	2026-01-15 00:55:45.737174	https://eservices.himachaltourism.gov.in/
fca6476c-8e5e-4833-b6e0-c0f6cdc872d8	4	4	4	4	2026-01-15 02:39:39.318525	https://eservices.himachaltourism.gov.in/
e039a784-4aa7-4d2a-856c-4dff81b795a9	4	4	4	4	2026-01-15 02:41:44.408156	https://eservices.himachaltourism.gov.in/
7ee1ac96-b665-481b-8371-c089d1fd7fad	4	4	4	4	2026-01-15 03:24:57.972727	https://eservices.himachaltourism.gov.in/
8210ad54-e7cf-4c94-8e82-7c4d786f2717	4	4	4	4	2026-01-15 04:04:02.845074	https://eservices.himachaltourism.gov.in/
2dc62d83-501e-49f0-ba02-d3efbf251fe3	4	4	4	4	2026-01-15 04:10:49.940526	https://eservices.himachaltourism.gov.in/
661d164d-b48d-4f89-b415-583eecc2baed	4	4	4	4	2026-01-15 04:13:54.958717	https://eservices.himachaltourism.gov.in/
b33c1c4d-a143-469b-88e4-994c6fb54f77	4	4	4	4	2026-01-15 04:17:09.076323	https://eservices.himachaltourism.gov.in/
117dfdbe-ab5f-44da-b492-eb3968f4b62f	4	4	4	4	2026-01-15 04:21:19.232023	https://eservices.himachaltourism.gov.in/
7239ff62-dd9f-4cb5-92c3-6f666e435e83	4	4	4	4	2026-01-15 04:25:52.784184	https://eservices.himachaltourism.gov.in/
974d2739-81fc-4da3-ac06-38028e0dab02	4	4	4	4	2026-01-15 04:32:35.724294	https://eservices.himachaltourism.gov.in/
7935585a-61f4-4dcd-ab43-ccefbe771251	4	4	4	4	2026-01-15 04:45:20.558667	https://eservices.himachaltourism.gov.in/
e9ad1634-b876-4fdb-9aea-5d195389c6bb	4	4	4	4	2026-01-15 04:54:28.266567	https://eservices.himachaltourism.gov.in/
d2b90bf6-c23e-43cd-bb73-eb7e900eb071	4	4	4	4	2026-01-15 05:14:45.575352	https://eservices.himachaltourism.gov.in/
d5ffe390-95aa-4740-8732-080afeec866e	4	4	4	4	2026-01-15 05:18:10.515853	https://eservices.himachaltourism.gov.in/
ff6189e4-a4f4-4531-9b94-60e3006ed177	4	4	4	4	2026-01-15 05:23:12.988605	https://eservices.himachaltourism.gov.in/
6baf9869-985a-4f61-b237-c45316f8bde4	4	4	4	4	2026-01-15 05:27:45.975148	https://eservices.himachaltourism.gov.in/
7471630c-d7ba-48fa-9dcd-53d30ee7b92f	4	4	4	4	2026-01-15 05:31:57.680873	https://eservices.himachaltourism.gov.in/
f04549e4-9340-4b16-8200-ac983922d7be	4	4	4	4	2026-01-15 05:50:38.226791	https://eservices.himachaltourism.gov.in/
21f32687-ecab-4e95-b957-9e44cc2b1c48	4	4	4	4	2026-01-15 05:54:14.364905	https://eservices.himachaltourism.gov.in/
401719d8-3739-4c50-b10b-8168f2dfc76c	4	4	4	4	2026-01-15 06:08:02.099043	https://eservices.himachaltourism.gov.in/
2e1e6671-7a93-4a25-bc6e-d3b6331412b2	4	4	4	4	2026-01-15 06:16:22.525062	https://eservices.himachaltourism.gov.in/
e3562d6e-df74-4ebf-80f0-e19f9f98a39b	4	4	4	4	2026-01-15 06:25:51.459798	https://eservices.himachaltourism.gov.in/
136821d1-8994-4895-9f3e-574f0f68b902	4	4	4	4	2026-01-15 06:33:07.243364	https://eservices.himachaltourism.gov.in/
876b93dc-a99f-4452-b32e-cbd6182f7b49	4	4	4	4	2026-01-15 06:38:41.832749	https://eservices.himachaltourism.gov.in/
23fab5aa-1254-433a-bac0-6cf614e6deaa	4	4	4	4	2026-01-15 06:46:53.95878	https://eservices.himachaltourism.gov.in/
eb37de71-a194-4cbb-92ff-5e1ffb432b71	4	4	4	4	2026-01-15 07:01:24.672434	https://eservices.himachaltourism.gov.in/
de2057cc-1d18-4c89-b61f-0d97104bd7a6	4	4	4	4	2026-01-15 08:01:24.63123	https://eservices.himachaltourism.gov.in/
66e1e3f5-5d73-47fb-981e-4495f0839518	4	4	4	4	2026-01-15 09:01:24.611904	https://eservices.himachaltourism.gov.in/
35b882bc-c1b2-4720-b059-f204565318f7	4	4	4	4	2026-01-15 10:01:24.655867	https://eservices.himachaltourism.gov.in/
0dfcd4c3-834b-4e42-981e-c5af63919f8f	4	4	4	4	2026-01-15 11:01:24.61397	https://eservices.himachaltourism.gov.in/
3d7aed31-818f-42ea-a7fd-970ca22ef6b3	4	4	4	4	2026-01-15 12:01:08.18294	https://eservices.himachaltourism.gov.in/
d87a90ea-b21c-4791-8f3b-7f84cab4afca	4	4	4	4	2026-01-15 12:15:26.475721	https://eservices.himachaltourism.gov.in/
988309f7-9d24-43ca-b349-462bedffc310	4	4	4	4	2026-01-15 12:51:37.575472	https://eservices.himachaltourism.gov.in/
51c0c533-5169-4103-9f39-4fcec3b6b183	4	4	4	4	2026-01-15 12:53:35.367405	https://eservices.himachaltourism.gov.in/
df3913fb-7bc3-4d48-8abe-bfc0917c4645	4	4	4	4	2026-01-15 13:53:35.438521	https://eservices.himachaltourism.gov.in/
fc31bec5-c83a-41db-892c-a06991c75461	4	4	4	4	2026-01-15 14:53:35.38051	https://eservices.himachaltourism.gov.in/
84a6ab5d-e115-4adb-8ce6-c5d00747abe6	4	4	4	4	2026-01-15 15:20:06.056939	https://eservices.himachaltourism.gov.in/
b971f0ee-7b5b-4b83-8dc5-014ad969d9a2	4	4	4	4	2026-01-15 15:38:55.627034	https://eservices.himachaltourism.gov.in/
d2ff3063-70e8-44e7-a341-cc59ea75667d	4	4	4	4	2026-01-15 15:49:25.156454	https://eservices.himachaltourism.gov.in/
c7df69ca-7299-4123-8bbd-f9dbf8c14880	4	4	4	4	2026-01-15 16:24:04.649551	https://eservices.himachaltourism.gov.in/
5699dafb-046d-43e8-805d-b41ff02a9da6	4	4	4	4	2026-01-15 16:40:57.505327	https://eservices.himachaltourism.gov.in/
a892ae6c-64f3-4a51-a68c-0790221ce9c6	4	4	4	4	2026-01-15 16:49:10.297301	https://eservices.himachaltourism.gov.in/
258bdf74-652b-4cfe-804f-22e50ffae380	4	4	4	4	2026-01-15 16:57:13.798717	https://eservices.himachaltourism.gov.in/
000a2a18-0f40-46a8-b4c8-f2ae4f8d30e6	4	4	4	4	2026-01-15 17:22:10.64903	https://eservices.himachaltourism.gov.in/
3c28e7cf-03c3-4adc-b8ba-c85bb809e2fc	4	4	4	4	2026-01-15 18:22:10.654768	https://eservices.himachaltourism.gov.in/
86f12118-7dc2-4499-a6a2-c51ed65cfed0	4	4	4	4	2026-01-15 19:02:53.36513	https://eservices.himachaltourism.gov.in/
e24428df-35b6-4933-b9fe-51afe88febf6	4	4	4	4	2026-01-15 19:09:55.594408	https://eservices.himachaltourism.gov.in/
7bda7840-c489-4174-bdc1-220a27d7cef5	4	4	4	4	2026-01-15 19:28:45.259231	https://eservices.himachaltourism.gov.in/
cac4c787-d0de-409e-984d-e2146598417a	4	4	4	4	2026-01-15 19:35:14.903228	https://eservices.himachaltourism.gov.in/
3f865046-d3d4-4c54-a8de-180cd400b8c3	4	4	4	4	2026-01-15 19:39:14.005964	https://eservices.himachaltourism.gov.in/
bd6fe58b-7cce-4775-ac9b-56bdb4deb852	4	4	4	4	2026-01-15 19:42:45.237461	https://eservices.himachaltourism.gov.in/
62d853a0-7643-4d7e-8b44-f3b4920419d9	4	4	4	4	2026-01-15 19:46:40.797741	https://eservices.himachaltourism.gov.in/
ddcd6227-2985-403e-b7e8-da294c9afe65	4	4	4	4	2026-01-15 19:49:56.630632	https://eservices.himachaltourism.gov.in/
45934bc9-20b5-472d-a59c-b972f9100c69	4	4	4	4	2026-01-15 19:54:30.93252	https://eservices.himachaltourism.gov.in/
96c3f2b1-ec28-469a-ac84-579486574c14	4	4	4	4	2026-01-15 20:54:30.948717	https://eservices.himachaltourism.gov.in/
206d76eb-892c-482d-8e31-89a94fabab42	4	4	4	4	2026-01-15 21:39:31.70014	https://eservices.himachaltourism.gov.in/
8e50b5c1-0bd8-4b05-8b96-5bd75deb9284	4	4	4	4	2026-01-15 21:51:23.094966	https://eservices.himachaltourism.gov.in/
8a6409d0-e15b-40f8-87f9-af8c19ef3fee	4	4	4	4	2026-01-15 21:57:16.55177	https://eservices.himachaltourism.gov.in/
c71fee21-90f5-4355-9601-01a5cd9cc70e	4	4	4	4	2026-01-16 02:34:43.922544	https://eservices.himachaltourism.gov.in/
2a1949fc-4501-4993-b36d-5cf050eec950	4	4	4	4	2026-01-16 02:46:49.768125	https://eservices.himachaltourism.gov.in/
c7a35d5d-1831-4d0f-9e97-a1a73c19cd0a	4	4	4	4	2026-01-16 03:14:10.954733	https://eservices.himachaltourism.gov.in/
f0f5b7b0-0586-47ee-85b7-b997e6ca203d	4	4	4	4	2026-01-16 03:15:01.733545	https://eservices.himachaltourism.gov.in/
e115b6a1-6413-4b54-8435-7fdc9c90f5bd	4	4	4	4	2026-01-16 03:15:05.095304	https://eservices.himachaltourism.gov.in/
23f9443a-0739-4fb8-bd38-ef15fa5d6790	4	4	4	4	2026-01-16 03:15:09.619273	https://eservices.himachaltourism.gov.in/
88e1b529-78ce-4b94-bb16-2284985395a8	4	4	4	4	2026-01-16 03:15:12.089536	https://eservices.himachaltourism.gov.in/
fe0fa6b4-733b-47e3-b3c1-df6097cb87fb	4	4	4	4	2026-01-16 03:15:18.634247	https://eservices.himachaltourism.gov.in/
02a02df6-4ef5-4f85-b3b9-bbabcef99cf5	4	4	4	4	2026-01-16 03:15:22.114582	https://eservices.himachaltourism.gov.in/
b37c28e9-4bd7-4969-b71a-5a351228c5e8	4	4	4	4	2026-01-16 03:15:43.821936	https://eservices.himachaltourism.gov.in/
d8e73674-5bb0-4e60-a178-e47b9d6db389	4	4	4	4	2026-01-16 03:16:40.624804	https://eservices.himachaltourism.gov.in/
d41b4a55-7d5c-4017-aba9-aaf44bc2d8bc	4	4	4	4	2026-01-16 03:16:50.754283	https://eservices.himachaltourism.gov.in/
38f6a55c-df45-47d0-aec2-9b285ab362ce	4	4	4	4	2026-01-16 03:17:39.192423	https://eservices.himachaltourism.gov.in/
e8327388-e27f-40cd-ac0e-0678a221eff7	4	4	4	4	2026-01-16 03:17:46.915088	https://eservices.himachaltourism.gov.in/
7aa018fa-e1f3-41f0-8baf-b0dc3cf8948b	4	4	4	4	2026-01-16 03:17:49.381373	https://eservices.himachaltourism.gov.in/
2c6278dd-3cb7-4fa2-9411-50238be38ae6	4	4	4	4	2026-01-16 03:18:21.817682	https://eservices.himachaltourism.gov.in/
0fa57e71-9c11-4b09-ac5a-ee9b2a24dc7d	4	4	4	4	2026-01-16 03:19:32.704185	https://eservices.himachaltourism.gov.in/
b6587a8b-b5b3-4eb9-9e52-5cfd54f5c0e0	4	4	4	4	2026-01-16 03:21:12.700959	https://eservices.himachaltourism.gov.in/
8518dd38-854d-4e56-bc4c-aa767ce5530e	4	4	4	4	2026-01-16 03:36:52.398158	https://eservices.himachaltourism.gov.in/
1379dba2-f736-42ce-a142-b1d7b25cab95	4	4	4	4	2026-01-16 03:36:52.609691	https://eservices.himachaltourism.gov.in/
9c6cea51-678a-497e-9f62-c805bd387c9d	4	4	4	4	2026-01-16 04:05:32.113574	https://eservices.himachaltourism.gov.in/
19336d54-4328-4cd1-8f3e-8053b1aae6cc	4	4	4	4	2026-01-16 04:05:32.396526	https://eservices.himachaltourism.gov.in/
57072e31-80e6-4769-8ea8-f1e0a05bf2e3	4	4	4	4	2026-01-16 04:09:06.202789	https://eservices.himachaltourism.gov.in/
202b085c-3b02-4031-9141-c739b926cb36	4	4	4	4	2026-01-16 04:09:06.455363	https://eservices.himachaltourism.gov.in/
f100862c-85fc-4efd-b608-9acf2280add4	4	4	4	4	2026-01-16 04:20:30.491523	https://eservices.himachaltourism.gov.in/
32e5feb0-183c-46c1-895e-f1c6bcce0efa	4	4	4	4	2026-01-16 04:20:30.696756	https://eservices.himachaltourism.gov.in/
8452b658-1a86-4947-9d3e-ad2d4a1ce121	4	4	4	4	2026-01-16 04:30:15.777389	https://eservices.himachaltourism.gov.in/
f9b3d4fc-9d7a-472b-9cc6-571b9158376c	4	4	4	4	2026-01-16 04:30:15.80202	https://eservices.himachaltourism.gov.in/
7d6aa055-2629-45a4-8013-8c0099e23aa8	4	4	4	4	2026-01-16 04:35:01.770539	https://eservices.himachaltourism.gov.in/
7c1af9da-c567-4c37-ab7a-dcb2e2dcee99	4	4	4	4	2026-01-16 04:35:01.772518	https://eservices.himachaltourism.gov.in/
aeb27e6e-9a31-4125-a3b5-a2a3f77ff6d7	4	4	4	4	2026-01-16 04:49:53.073616	https://eservices.himachaltourism.gov.in/
f2c681bf-8ee1-4a2b-808c-628e2a1c6d34	4	4	4	4	2026-01-16 04:49:53.081232	https://eservices.himachaltourism.gov.in/
a100dceb-509b-42c7-b947-7196819ffd58	4	4	4	4	2026-01-16 05:22:41.401537	https://eservices.himachaltourism.gov.in/
e749f10e-d638-471f-b66e-7b85f8af18b2	4	4	4	4	2026-01-16 05:22:41.420778	https://eservices.himachaltourism.gov.in/
613724f5-6791-44aa-841b-76af18974cff	4	4	4	4	2026-01-16 06:22:41.331798	https://eservices.himachaltourism.gov.in/
0e88b88b-07e8-4a25-a340-2ebcaa4a633f	4	4	4	4	2026-01-16 06:22:41.596984	https://eservices.himachaltourism.gov.in/
a49b12dd-f277-42c2-88cb-bbcecbb11854	4	4	4	4	2026-01-16 07:22:41.347981	https://eservices.himachaltourism.gov.in/
d459817c-fb66-4ad3-a411-15044c60f265	4	4	4	4	2026-01-16 07:22:41.354718	https://eservices.himachaltourism.gov.in/
b3d67817-d9da-4f34-9798-f35d3a9fa20d	4	4	4	4	2026-01-16 08:22:41.331549	https://eservices.himachaltourism.gov.in/
37375426-464c-4b82-8e05-4be5699f85d6	4	4	4	4	2026-01-16 08:22:41.374256	https://eservices.himachaltourism.gov.in/
ad20e8a3-a960-4c2a-aa78-aadf40db9291	4	4	4	4	2026-01-16 09:22:41.36022	https://eservices.himachaltourism.gov.in/
71e843b8-f12b-41fa-8a1b-5cd7b3193f87	4	4	4	4	2026-01-16 09:22:41.360366	https://eservices.himachaltourism.gov.in/
4802d5af-b47d-4916-865e-5f9741dce2dc	4	4	4	4	2026-01-16 10:22:41.451369	https://eservices.himachaltourism.gov.in/
9a5dbc8c-7831-42ce-80ee-3613784f303f	4	4	4	4	2026-01-16 10:22:41.465803	https://eservices.himachaltourism.gov.in/
d501c0a6-2ab4-4bc4-8b19-b5ac72eca505	4	4	4	4	2026-01-16 11:23:08.91073	https://eservices.himachaltourism.gov.in/
0e2604b7-0207-4e55-814e-9f85be6fb5a3	4	4	4	4	2026-01-16 11:23:09.017824	https://eservices.himachaltourism.gov.in/
d032e04a-592b-419e-923c-770f35faacbd	4	4	4	4	2026-01-16 12:22:41.375167	https://eservices.himachaltourism.gov.in/
f8ff930e-2842-47ab-89ce-0c2fb38059d8	4	4	4	4	2026-01-16 12:22:41.408931	https://eservices.himachaltourism.gov.in/
067b7c4d-48cf-457e-a39e-1518970b6e6a	4	4	4	4	2026-01-16 13:22:41.351695	https://eservices.himachaltourism.gov.in/
e585e6a0-c676-4cb1-b77e-1fff62f8c86f	4	4	4	4	2026-01-16 13:22:41.358039	https://eservices.himachaltourism.gov.in/
fed822f7-12cf-42c6-bb30-1431d05ca000	4	4	4	4	2026-01-16 14:22:41.320198	https://eservices.himachaltourism.gov.in/
0e07b209-953c-46bb-ab37-152397c05d8b	4	4	4	4	2026-01-16 14:22:41.336328	https://eservices.himachaltourism.gov.in/
2ddb6676-eac4-4aba-9bb2-4606cde2b997	4	4	4	4	2026-01-16 15:22:41.352559	https://eservices.himachaltourism.gov.in/
95c18052-7d43-4f60-9aba-ba930e800615	4	4	4	4	2026-01-16 15:22:41.353511	https://eservices.himachaltourism.gov.in/
60772a93-bb93-4651-9ac0-42d3f1e48221	4	4	4	4	2026-01-16 16:22:41.348709	https://eservices.himachaltourism.gov.in/
5bfc4274-eff6-4988-bb3b-4b7330b37abb	4	4	4	4	2026-01-16 16:22:41.352854	https://eservices.himachaltourism.gov.in/
2c1e6193-ec70-4cec-80f0-08072b3aae54	4	4	4	4	2026-01-16 17:22:41.345464	https://eservices.himachaltourism.gov.in/
8428de84-0c95-4c51-89d0-b8d188633a69	4	4	4	4	2026-01-16 17:22:41.356741	https://eservices.himachaltourism.gov.in/
323c2a0f-555d-4fc5-a423-e5f4038c9e3e	4	4	4	4	2026-01-16 18:22:41.35797	https://eservices.himachaltourism.gov.in/
6e612567-678d-41a8-9034-916698fb8f40	4	4	4	4	2026-01-16 18:22:41.384877	https://eservices.himachaltourism.gov.in/
b55d5018-551f-427e-bf70-b9b1da034df9	4	4	4	4	2026-01-16 19:22:41.396197	https://eservices.himachaltourism.gov.in/
0265a8fa-81b7-424d-bf92-157486add573	4	4	4	4	2026-01-16 19:22:41.397798	https://eservices.himachaltourism.gov.in/
8d93a1fe-0b86-41e2-b312-810e2adcce13	4	4	4	4	2026-01-16 20:22:41.381727	https://eservices.himachaltourism.gov.in/
f6353d2b-ba1f-47ee-8708-ce31f91b9521	4	4	4	4	2026-01-16 20:22:41.389694	https://eservices.himachaltourism.gov.in/
88b64ecb-6a1c-464d-a386-5b50a5e329e1	4	4	4	4	2026-01-16 21:22:41.377618	https://eservices.himachaltourism.gov.in/
61dd3e37-fa15-41a4-ab74-70bb11b4e954	4	4	4	4	2026-01-16 21:22:41.378195	https://eservices.himachaltourism.gov.in/
bfc2e8f3-4e0b-4462-ae63-659832b36044	4	4	4	4	2026-01-16 22:22:41.370072	https://eservices.himachaltourism.gov.in/
68811cf2-066b-41e3-b6bc-04afac05f366	4	4	4	4	2026-01-16 22:22:41.420985	https://eservices.himachaltourism.gov.in/
b7906633-e933-48c5-8852-0df262828ff9	4	4	4	4	2026-01-16 23:22:41.375822	https://eservices.himachaltourism.gov.in/
7ea42283-db2c-4bcf-b432-df1994ccabac	4	4	4	4	2026-01-16 23:22:41.376774	https://eservices.himachaltourism.gov.in/
880c6c19-47ef-496c-a97b-97bac7f919af	4	4	4	4	2026-01-17 00:22:41.377436	https://eservices.himachaltourism.gov.in/
f3c70eeb-56c6-4239-a6dc-80d2ee3e3397	4	4	4	4	2026-01-17 00:22:41.393379	https://eservices.himachaltourism.gov.in/
ed6d217b-863d-4607-8edd-5ffe19388c5e	4	4	4	4	2026-01-17 01:22:41.373328	https://eservices.himachaltourism.gov.in/
f6e26ea6-4c69-4773-8e7c-0048d3137a75	4	4	4	4	2026-01-17 01:22:41.382612	https://eservices.himachaltourism.gov.in/
77176c67-dfa0-4186-bafa-58f5e6826e18	4	4	4	4	2026-01-17 02:22:41.387743	https://eservices.himachaltourism.gov.in/
49f08ef1-3882-4183-8281-a05c8a5fa925	4	4	4	4	2026-01-17 02:22:41.388206	https://eservices.himachaltourism.gov.in/
999d9395-68cb-4481-af5f-32f7cfb6a249	4	4	4	4	2026-01-17 03:22:41.377691	https://eservices.himachaltourism.gov.in/
9c788906-c5d2-4912-8485-4dca3659b1e9	4	4	4	4	2026-01-17 03:22:41.39126	https://eservices.himachaltourism.gov.in/
edb64a41-625b-4912-affb-3bee0329b1e5	4	4	4	4	2026-01-17 04:22:41.373531	https://eservices.himachaltourism.gov.in/
7d52f0a4-e458-45f6-9944-98b7298364da	4	4	4	4	2026-01-17 04:22:41.37729	https://eservices.himachaltourism.gov.in/
121aaea3-6470-4abe-b0de-d8f51645a26f	4	4	4	4	2026-01-17 05:22:41.41489	https://eservices.himachaltourism.gov.in/
1717081d-bc24-422e-8e21-682aced7f07d	4	4	4	4	2026-01-17 05:22:41.501532	https://eservices.himachaltourism.gov.in/
d86a5b34-6264-4f7e-88e6-4e2c9e0f2e74	4	4	4	4	2026-01-17 06:22:41.442821	https://eservices.himachaltourism.gov.in/
f2ab096b-4924-456c-9c2c-5a6fd6644e8d	4	4	4	4	2026-01-17 06:22:41.456834	https://eservices.himachaltourism.gov.in/
a78cf7f0-478e-4098-a7c9-1b989e4c7e13	4	4	4	4	2026-01-17 07:22:41.427438	https://eservices.himachaltourism.gov.in/
dbc2bcfb-1042-42ef-b528-c5e34640f8e9	4	4	4	4	2026-01-17 07:22:41.439049	https://eservices.himachaltourism.gov.in/
6b61bcaa-8c7c-45ac-b196-5fd2ccec01b6	4	4	4	4	2026-01-17 08:22:41.38754	https://eservices.himachaltourism.gov.in/
16807d78-68f0-49b7-b7e4-14f142361021	4	4	4	4	2026-01-17 08:22:41.389599	https://eservices.himachaltourism.gov.in/
1fc18341-ad51-4ba4-bb6d-f3fe00f0e2de	4	4	4	4	2026-01-17 09:22:41.3767	https://eservices.himachaltourism.gov.in/
90f26de6-42f7-45ab-9eec-f48af61646ed	4	4	4	4	2026-01-17 09:22:41.400937	https://eservices.himachaltourism.gov.in/
91373823-61c8-458d-9f4f-92fab4b144da	4	4	4	4	2026-01-17 10:22:41.378447	https://eservices.himachaltourism.gov.in/
e0275fc7-e4df-4a8b-a67b-3dcb4d65a7b8	4	4	4	4	2026-01-17 10:22:41.395361	https://eservices.himachaltourism.gov.in/
6015d9b8-2f5b-4b7c-bdd6-ac3911ea9883	4	4	4	4	2026-01-17 11:22:41.405538	https://eservices.himachaltourism.gov.in/
613860ba-2c1d-494f-8d6f-fb20b5417667	4	4	4	4	2026-01-17 11:22:41.422444	https://eservices.himachaltourism.gov.in/
aa4b8f91-116e-45de-8cb8-05c4b792ef6e	4	4	4	4	2026-01-17 12:22:41.400389	https://eservices.himachaltourism.gov.in/
a34fb49c-4dcc-494f-a50c-df1c9a82e858	4	4	4	4	2026-01-17 12:22:41.401201	https://eservices.himachaltourism.gov.in/
f1c87314-9203-44e2-bcd1-d2d289802df7	4	4	4	4	2026-01-17 13:22:41.422288	https://eservices.himachaltourism.gov.in/
c1147e8e-8b95-43fc-8dc2-24b58abe7ea1	4	4	4	4	2026-01-17 13:22:41.433705	https://eservices.himachaltourism.gov.in/
b349cef5-fd5a-4f95-ba9c-9a01d90211ba	4	4	4	4	2026-01-17 14:22:41.389792	https://eservices.himachaltourism.gov.in/
f4889c4b-7460-40d3-8f79-c421ab5aa39a	4	4	4	4	2026-01-17 14:22:41.406252	https://eservices.himachaltourism.gov.in/
7e9ec0f8-61ed-4a19-881b-536cae56981b	4	4	4	4	2026-01-17 15:22:41.392998	https://eservices.himachaltourism.gov.in/
4632e3c7-1561-4690-a6a8-c2d95667c632	4	4	4	4	2026-01-17 15:22:41.399655	https://eservices.himachaltourism.gov.in/
00e9168a-ee0d-4849-a545-7ca349a53482	4	4	4	4	2026-01-17 16:22:41.377083	https://eservices.himachaltourism.gov.in/
b6f457b9-3f73-459c-9a72-6aa068a986ff	4	4	4	4	2026-01-17 16:22:41.385146	https://eservices.himachaltourism.gov.in/
3be4e5aa-fcce-4257-b6d8-1c2873e29689	4	4	4	4	2026-01-17 17:22:41.372961	https://eservices.himachaltourism.gov.in/
c726dde6-f5d3-4be6-bf75-53ce49d1e5e2	4	4	4	4	2026-01-17 17:22:41.380332	https://eservices.himachaltourism.gov.in/
eaf86273-0374-47df-8431-f15a49266148	4	4	4	4	2026-01-17 18:22:41.386657	https://eservices.himachaltourism.gov.in/
7045011b-5ad7-48c3-b837-7b186bc59101	4	4	4	4	2026-01-17 18:22:41.39267	https://eservices.himachaltourism.gov.in/
3ed15663-f9a4-4c30-9556-cb63ade0765d	4	4	4	4	2026-01-17 19:22:41.377733	https://eservices.himachaltourism.gov.in/
43aec12c-05b9-4469-8078-d5ed60005b9c	4	4	4	4	2026-01-17 19:22:41.405354	https://eservices.himachaltourism.gov.in/
c36cf3db-9200-420d-9455-69fef334cd56	4	4	4	4	2026-01-17 20:22:41.364215	https://eservices.himachaltourism.gov.in/
5e1f25a8-e005-4c45-8589-6045ba6a74a4	4	4	4	4	2026-01-17 20:22:41.386012	https://eservices.himachaltourism.gov.in/
f7a1227f-5041-4539-a23c-ed6af1333e36	4	4	4	4	2026-01-17 21:22:41.370966	https://eservices.himachaltourism.gov.in/
887c2c83-5c6c-48dd-bf5c-3fc4f386e11b	4	4	4	4	2026-01-17 21:22:41.403211	https://eservices.himachaltourism.gov.in/
0dddd5a8-6a83-435f-a96a-deddd8c9ecb4	4	4	4	4	2026-01-17 22:22:41.365823	https://eservices.himachaltourism.gov.in/
6e3f2dbd-b3fb-40a4-80f1-c02bbe5e9bcb	4	4	4	4	2026-01-17 22:22:41.384603	https://eservices.himachaltourism.gov.in/
575350f9-14ca-47c6-9642-4a0208a351e8	4	4	4	4	2026-01-17 23:22:41.390955	https://eservices.himachaltourism.gov.in/
9cc006e5-9b89-4704-b6b1-5ae18e283df8	4	4	4	4	2026-01-17 23:22:41.392109	https://eservices.himachaltourism.gov.in/
95a26909-0fad-4567-b248-21d6b73c4166	4	4	4	4	2026-01-18 00:22:41.38814	https://eservices.himachaltourism.gov.in/
12a7bdc2-d0a9-40d3-b4a2-f38c8e5fae00	4	4	4	4	2026-01-18 00:22:41.39019	https://eservices.himachaltourism.gov.in/
ee3759ea-7587-4a68-8a8e-4484f8f77a39	4	4	4	4	2026-01-18 01:22:41.379842	https://eservices.himachaltourism.gov.in/
f5f5041b-c50e-46c4-a4fb-fcb495e73f2c	4	4	4	4	2026-01-18 01:22:41.411947	https://eservices.himachaltourism.gov.in/
bb8b0d8a-70b4-405d-9724-c2978c55cb19	4	4	4	4	2026-01-18 02:22:41.377559	https://eservices.himachaltourism.gov.in/
73f4cc2e-25f5-465e-a8aa-edd321fb3a48	4	4	4	4	2026-01-18 02:22:41.387071	https://eservices.himachaltourism.gov.in/
8d7236aa-1883-4e00-b77c-d1f834984353	4	4	4	4	2026-01-18 03:22:41.383453	https://eservices.himachaltourism.gov.in/
2861f344-a459-451d-b9e9-d81ada750bc0	4	4	4	4	2026-01-18 03:22:41.38561	https://eservices.himachaltourism.gov.in/
9b17778f-08a2-4ae1-a044-a0f8431bfb94	4	4	4	4	2026-01-18 04:22:41.372869	https://eservices.himachaltourism.gov.in/
0e81256b-b787-4a90-93d8-55c641fd8392	4	4	4	4	2026-01-18 04:22:41.380275	https://eservices.himachaltourism.gov.in/
d43bc7a8-ad91-4e00-b28f-217365cad3b8	4	4	4	4	2026-01-18 05:22:41.393957	https://eservices.himachaltourism.gov.in/
360da9f2-519d-43a9-87e9-ebc330437496	4	4	4	4	2026-01-18 05:22:41.394228	https://eservices.himachaltourism.gov.in/
13050b8a-50bd-4a19-bd0c-40efa948c4c1	4	4	4	4	2026-01-18 06:22:41.395741	https://eservices.himachaltourism.gov.in/
e53dd939-44d9-4570-975c-236c5fb20af7	4	4	4	4	2026-01-18 06:22:41.396397	https://eservices.himachaltourism.gov.in/
668dffdc-861b-4b79-8d5d-278ba8143b71	4	4	4	4	2026-01-18 07:22:41.384518	https://eservices.himachaltourism.gov.in/
10515319-7140-4a7e-978a-c9f0bdb90888	4	4	4	4	2026-01-18 07:22:41.394032	https://eservices.himachaltourism.gov.in/
8e5c2ee5-9a2e-4533-b558-6bc63fb5d321	4	4	4	4	2026-01-18 08:22:41.386408	https://eservices.himachaltourism.gov.in/
52ff94b5-00a6-4edd-b239-215dfea82a13	4	4	4	4	2026-01-18 08:22:41.390663	https://eservices.himachaltourism.gov.in/
227a5e2a-d86a-49d6-9331-464ed725eb03	4	4	4	4	2026-01-18 09:22:41.415951	https://eservices.himachaltourism.gov.in/
addf508d-3242-4a62-9577-c69eed841e61	4	4	4	4	2026-01-18 09:22:41.421671	https://eservices.himachaltourism.gov.in/
5b3e643c-9d43-4262-b838-8a2c3a4beaf1	4	4	4	4	2026-01-18 10:22:41.403166	https://eservices.himachaltourism.gov.in/
a2bbc3a3-1d18-4765-ba07-36f90c2cb4f0	4	4	4	4	2026-01-18 10:22:41.415262	https://eservices.himachaltourism.gov.in/
90aa5281-c538-48c5-a724-66a18f2f3c33	4	4	4	4	2026-01-18 11:22:41.406347	https://eservices.himachaltourism.gov.in/
4f3feca6-04f2-4684-ad56-7eb88075c5ca	4	4	4	4	2026-01-18 11:22:41.412666	https://eservices.himachaltourism.gov.in/
8bf5ad2c-63a9-47fb-8749-84fda274d799	4	4	4	4	2026-01-18 12:22:41.394323	https://eservices.himachaltourism.gov.in/
7b73c216-09d8-47ca-b916-3aec373cb274	4	4	4	4	2026-01-18 12:22:41.410804	https://eservices.himachaltourism.gov.in/
e83090e0-c4f6-4c64-bcea-612b70bddb27	4	4	4	4	2026-01-18 13:22:41.403503	https://eservices.himachaltourism.gov.in/
74d4bfd1-e84e-4908-92eb-6a351fc2df56	4	4	4	4	2026-01-18 13:22:41.412294	https://eservices.himachaltourism.gov.in/
48c50580-ee84-4d16-9f96-1fc09f53b510	4	4	4	4	2026-01-18 14:22:41.423357	https://eservices.himachaltourism.gov.in/
1720c07d-605a-4ed6-b122-b7c754cd1f6e	4	4	4	4	2026-01-18 14:22:41.529292	https://eservices.himachaltourism.gov.in/
dfe64811-ed2f-41e7-8670-069e7e137abe	4	4	4	4	2026-01-18 15:22:41.413398	https://eservices.himachaltourism.gov.in/
3ebe14bb-8c3b-4464-adbc-0a240faaee15	4	4	4	4	2026-01-18 15:22:41.420081	https://eservices.himachaltourism.gov.in/
6a2431e5-e198-462b-b038-bc1f2adb54e6	4	4	4	4	2026-01-18 16:22:41.40963	https://eservices.himachaltourism.gov.in/
9dec5d89-1cba-451b-8235-c01f321fbf39	4	4	4	4	2026-01-18 16:22:41.421118	https://eservices.himachaltourism.gov.in/
aa4b5834-1eaf-4e8b-9782-8150eb4e77d2	4	4	4	4	2026-01-18 17:22:41.441156	https://eservices.himachaltourism.gov.in/
143d04b4-3f07-413e-bb5d-d1ee59097449	4	4	4	4	2026-01-18 17:22:41.441294	https://eservices.himachaltourism.gov.in/
a6922f7e-91b7-443d-8fff-161768bdf109	4	4	4	4	2026-01-18 18:22:41.416891	https://eservices.himachaltourism.gov.in/
100c5aae-c77e-4a0a-b2af-feae77b59c93	4	4	4	4	2026-01-18 18:22:41.419662	https://eservices.himachaltourism.gov.in/
1dcd1d11-6567-46f9-9f3f-220aac32c4a5	4	4	4	4	2026-01-18 19:22:41.443281	https://eservices.himachaltourism.gov.in/
605f7cdc-347a-4ca5-9256-46f65eb20f6e	4	4	4	4	2026-01-18 19:22:41.477636	https://eservices.himachaltourism.gov.in/
0084ec73-b1f0-4fec-bd61-b1c25ce5d839	4	4	4	4	2026-01-18 20:22:41.495652	https://eservices.himachaltourism.gov.in/
bf4028b2-68a3-414f-bbcf-7a961323b83d	4	4	4	4	2026-01-18 20:22:41.501043	https://eservices.himachaltourism.gov.in/
5e4045e3-83b3-4c0f-99d1-bfd7b48d8755	4	4	4	4	2026-01-18 21:22:41.474444	https://eservices.himachaltourism.gov.in/
343491b0-6f31-4a59-b1ad-2a09178f5805	4	4	4	4	2026-01-18 21:22:41.477811	https://eservices.himachaltourism.gov.in/
6f5ad731-ffbe-4205-bea1-ccc231d73b3f	4	4	4	4	2026-01-18 22:22:41.418845	https://eservices.himachaltourism.gov.in/
226a046f-9112-4915-ac05-a16d694f5071	4	4	4	4	2026-01-18 22:22:41.421145	https://eservices.himachaltourism.gov.in/
c54b0ad4-a844-4033-8f10-f3da5dd0b471	4	4	4	4	2026-01-18 23:22:41.426811	https://eservices.himachaltourism.gov.in/
4d2edcca-02c7-430f-8ac5-110a9bf2c779	4	4	4	4	2026-01-18 23:22:41.428378	https://eservices.himachaltourism.gov.in/
452d8fc5-b76b-479b-84ba-6e839bfabe0d	4	4	4	4	2026-01-19 00:22:41.406792	https://eservices.himachaltourism.gov.in/
8a9f7636-2f2f-45ee-8743-6d171cc5aa88	4	4	4	4	2026-01-19 00:22:41.438997	https://eservices.himachaltourism.gov.in/
14b20ea1-7093-4e65-bcf7-cb7043bf3bc8	4	4	4	4	2026-01-19 01:22:41.438943	https://eservices.himachaltourism.gov.in/
13e70faf-da7f-4415-adf1-c6136d37d7ff	4	4	4	4	2026-01-19 01:22:41.44619	https://eservices.himachaltourism.gov.in/
8c37077d-7cb6-400e-aadd-ecdb3de92215	4	4	4	4	2026-01-19 02:22:41.428655	https://eservices.himachaltourism.gov.in/
737d2360-3e57-4465-9a7f-a7ddfff6d442	4	4	4	4	2026-01-19 02:22:41.430805	https://eservices.himachaltourism.gov.in/
3c91abfb-3d96-43c1-bf22-8223834209e1	4	4	4	4	2026-01-19 03:22:41.42115	https://eservices.himachaltourism.gov.in/
26ab2d55-b1ee-40c9-ae18-7a8691c6ddf8	4	4	4	4	2026-01-19 03:22:41.425389	https://eservices.himachaltourism.gov.in/
0dd8b0d0-816c-4d98-82d0-50c9392d913b	4	4	4	4	2026-01-19 04:22:41.387801	https://eservices.himachaltourism.gov.in/
d6c96dfd-01e8-4e65-9ceb-fd2c35b6ff13	4	4	4	4	2026-01-19 04:22:41.422882	https://eservices.himachaltourism.gov.in/
a13c16a3-25b3-49f6-98cb-2df519c9ad48	4	4	4	4	2026-01-19 04:35:33.525384	https://eservices.himachaltourism.gov.in/
ec3c722b-ed03-4d6c-9d02-1f088d8c7c9d	4	4	4	4	2026-01-19 04:38:02.271081	https://eservices.himachaltourism.gov.in/
ed49dd4e-aca1-41a3-9847-2ba2c0bc7488	4	4	4	4	2026-01-19 04:50:58.735963	https://eservices.himachaltourism.gov.in/
a9ba88cc-a30a-4a8e-bc2d-c6fac33bee5a	4	4	4	4	2026-01-19 04:52:42.499368	https://eservices.himachaltourism.gov.in/
ffccd376-a892-486a-b696-b5315e4f8cb2	4	4	4	4	2026-01-19 04:59:30.259198	https://eservices.himachaltourism.gov.in/
82363789-9849-4f5e-be11-6456c9368a0a	4	4	4	4	2026-01-19 05:02:54.719811	https://eservices.himachaltourism.gov.in/
b066243b-9fce-48cd-83b5-4d2904ef3873	4	4	4	4	2026-01-19 05:43:43.56132	https://eservices.himachaltourism.gov.in/
c365a437-471d-4522-96dd-a55f5f9ca23c	4	4	4	4	2026-01-19 05:44:16.652017	https://eservices.himachaltourism.gov.in/
89b9f91d-c45e-4fa3-b6f4-8dda4d07eb12	4	4	4	4	2026-01-19 05:44:29.136249	https://eservices.himachaltourism.gov.in/
79a5258a-918f-4ca5-bb47-cb0ed561261d	4	4	4	4	2026-01-19 05:57:06.567579	https://eservices.himachaltourism.gov.in/
debae1e8-6d5b-4709-b07e-361813d5690c	4	4	4	4	2026-01-19 06:12:18.743832	https://eservices.himachaltourism.gov.in/
b66f3b8f-487a-48f5-a5f4-e68655c16276	4	4	4	4	2026-01-19 06:15:29.494357	https://eservices.himachaltourism.gov.in/
0704e487-4971-4cae-b7a9-2a3e4cfecae9	4	4	4	4	2026-01-19 07:15:29.452598	https://eservices.himachaltourism.gov.in/
769e47f1-71ee-4f20-8144-5a8e486414d2	4	4	4	4	2026-01-19 07:41:30.515499	https://eservices.himachaltourism.gov.in/
2f3238c0-976f-4219-8ec4-d6849b9811ee	4	4	4	4	2026-01-19 07:56:44.979914	https://eservices.himachaltourism.gov.in/
b2787a4a-dc43-4ae2-90db-9dcc197b4140	4	4	4	4	2026-01-19 07:59:34.004694	https://eservices.himachaltourism.gov.in/
d204c5e2-8856-49fa-a6d3-c5d21d8eefe0	4	4	4	4	2026-01-19 08:03:33.166996	https://eservices.himachaltourism.gov.in/
d991fb2c-a94f-439a-bd03-558481088020	4	4	4	4	2026-01-19 09:32:18.40685	https://eservices.himachaltourism.gov.in/
29963568-28a4-492e-8d7a-0f4f9319b276	4	4	4	4	2026-01-19 10:32:18.417569	https://eservices.himachaltourism.gov.in/
84d4d2f3-dda9-4fb7-b3c7-61fb9aaf54ad	4	4	4	4	2026-01-19 11:32:18.411526	https://eservices.himachaltourism.gov.in/
53560ca5-a5d8-4073-a52c-26a52031f1f1	4	4	4	4	2026-01-19 12:32:18.409044	https://eservices.himachaltourism.gov.in/
758dd2f1-d8fc-496d-89c2-22249785124d	4	4	4	4	2026-01-19 13:32:18.417267	https://eservices.himachaltourism.gov.in/
eba0a73d-b9b3-4934-8fc3-b670e1219f34	4	4	4	4	2026-01-19 14:32:18.397224	https://eservices.himachaltourism.gov.in/
ee27aa98-1a93-46cf-989e-87d32a9d09bd	4	4	4	4	2026-01-19 15:32:18.407925	https://eservices.himachaltourism.gov.in/
6b860d09-4b0b-4132-a2dc-152930fa61ff	4	4	4	4	2026-01-19 16:32:18.425823	https://eservices.himachaltourism.gov.in/
a602915f-2e67-478a-a75a-0518c30e1e3f	4	4	4	4	2026-01-19 17:32:18.397497	https://eservices.himachaltourism.gov.in/
ffc32c7a-a623-467d-826c-3ef9fc41da68	4	4	4	4	2026-01-19 18:32:18.398959	https://eservices.himachaltourism.gov.in/
88683fa5-938c-4388-bcd6-b9ee3ae6412f	4	4	4	4	2026-01-19 19:32:18.454409	https://eservices.himachaltourism.gov.in/
6fee3cc4-d2b4-4f47-837b-e657bec3b1fc	4	4	4	4	2026-01-19 20:32:18.434854	https://eservices.himachaltourism.gov.in/
b882002d-17d2-48bc-b039-fa39bcb6750a	4	4	4	4	2026-01-19 21:32:18.464515	https://eservices.himachaltourism.gov.in/
d7cbda7e-6a99-4eda-83e0-334ede16f8a2	4	4	4	4	2026-01-19 22:32:18.491403	https://eservices.himachaltourism.gov.in/
62dd556e-02b8-4380-bbfd-d1a07c61ab2d	4	4	4	4	2026-01-19 23:32:18.465794	https://eservices.himachaltourism.gov.in/
af054860-ebc3-431c-ae83-9407810d85d1	4	4	4	4	2026-01-20 00:32:18.452526	https://eservices.himachaltourism.gov.in/
dfb2c27e-cd5e-490a-8f10-20584039edd0	4	4	4	4	2026-01-20 01:32:18.464437	https://eservices.himachaltourism.gov.in/
fc5ae5c4-f5af-4745-a6b5-de3194dfbff3	4	4	4	4	2026-01-20 02:32:18.464051	https://eservices.himachaltourism.gov.in/
8f22d417-3d26-40b5-a8e3-66eb92fbb706	4	4	4	4	2026-01-20 03:32:18.482162	https://eservices.himachaltourism.gov.in/
b0b048a2-1cdc-4e43-8b5a-5d02b3a3e2d2	4	4	4	4	2026-01-20 04:32:18.525879	https://eservices.himachaltourism.gov.in/
dc4ab7fb-1300-409a-9c28-1865fae7ba5b	4	4	4	4	2026-01-20 05:32:18.444683	https://eservices.himachaltourism.gov.in/
3787aadc-9b3f-4a91-aab3-2891521b7ed0	4	4	4	4	2026-01-20 06:32:18.470845	https://eservices.himachaltourism.gov.in/
28955db7-887a-4fd2-948c-ef4d8035059a	4	4	4	4	2026-01-20 07:32:18.464773	https://eservices.himachaltourism.gov.in/
2f939a98-0c14-4952-bfbc-9d76018a3266	4	4	4	4	2026-01-20 08:32:18.392205	https://eservices.himachaltourism.gov.in/
2b26647b-64e9-4eac-8ad9-33ba692d02fd	4	4	4	4	2026-01-20 09:32:32.168889	https://eservices.himachaltourism.gov.in/
556b436b-15ab-42b3-9703-5100fd3c44f0	4	4	4	4	2026-01-20 10:32:18.436217	https://eservices.himachaltourism.gov.in/
5c145f8e-f6a9-4d4b-80e1-4e0e18d02423	4	4	4	4	2026-01-20 11:32:18.433832	https://eservices.himachaltourism.gov.in/
6c570f82-f21a-41a0-b63f-e7d4a903b49e	4	4	4	4	2026-01-20 12:32:18.427267	https://eservices.himachaltourism.gov.in/
ddbc482c-10d2-488f-b3af-b9045cccea5f	4	4	4	4	2026-01-20 13:32:18.431415	https://eservices.himachaltourism.gov.in/
6373a39c-daee-47a9-9962-0364a386d306	4	4	4	4	2026-01-20 14:32:18.436801	https://eservices.himachaltourism.gov.in/
4592f240-c5bf-4397-aef5-6110cae47461	4	4	4	4	2026-01-20 15:32:18.486266	https://eservices.himachaltourism.gov.in/
c3a6fca3-5759-48cd-b0d1-df00ae0a2bf4	4	4	4	4	2026-01-20 16:32:18.441551	https://eservices.himachaltourism.gov.in/
50b69da5-f084-46ff-b262-970924ec53a3	4	4	4	4	2026-01-20 17:32:18.416997	https://eservices.himachaltourism.gov.in/
bbd77869-1b0d-43a0-bf55-037a6b2a93ad	4	4	4	4	2026-01-20 18:32:18.423176	https://eservices.himachaltourism.gov.in/
9ea77f5b-f7eb-43ed-a31b-baf025249719	4	4	4	4	2026-01-20 19:32:18.435849	https://eservices.himachaltourism.gov.in/
14402d93-be09-463c-ace1-b81a27f41870	4	4	4	4	2026-01-20 20:32:18.466656	https://eservices.himachaltourism.gov.in/
42fa1fd1-f26b-465a-b520-f9487845b681	4	4	4	4	2026-01-20 21:32:18.474596	https://eservices.himachaltourism.gov.in/
fc1d91be-6918-420b-a8a8-2abc0796a587	4	4	4	4	2026-01-20 22:32:18.459615	https://eservices.himachaltourism.gov.in/
1a8b4ac6-30f2-477a-bce3-37a93bcc2391	4	4	4	4	2026-01-20 23:32:18.523875	https://eservices.himachaltourism.gov.in/
e31d947f-7739-4b82-b4ce-ec84239358b9	4	4	4	4	2026-01-21 00:32:18.458893	https://eservices.himachaltourism.gov.in/
6a2a1d5d-8e9a-4549-8e6f-95ebe06488b3	4	4	4	4	2026-01-21 01:32:18.451209	https://eservices.himachaltourism.gov.in/
93eeb11e-0fdf-4e88-875e-6a310931fff1	4	4	4	4	2026-01-21 02:32:18.466094	https://eservices.himachaltourism.gov.in/
a3ff47e2-9588-41d5-8d43-65701c35fde0	4	4	4	4	2026-01-21 03:32:18.461789	https://eservices.himachaltourism.gov.in/
d6f249a2-53b5-4e47-9f2c-17530bc7d3ec	4	4	4	4	2026-01-21 04:32:18.474092	https://eservices.himachaltourism.gov.in/
f64fed3c-7047-47ae-9081-ff8bb383c324	4	4	4	4	2026-01-21 05:32:18.451686	https://eservices.himachaltourism.gov.in/
fab918c7-3606-41c0-a65a-494ae39ece2f	4	4	4	4	2026-01-21 06:32:18.469216	https://eservices.himachaltourism.gov.in/
be0453bb-91e2-4a50-bf96-a8a33a3aa5eb	4	4	4	4	2026-01-21 07:32:18.520403	https://eservices.himachaltourism.gov.in/
0e1f19af-8df1-4e82-8c3e-2b115696faa1	4	4	4	4	2026-01-21 08:32:18.457778	https://eservices.himachaltourism.gov.in/
72c5bf21-3f30-4b24-94a0-cbd21891d135	4	4	4	4	2026-01-21 09:32:18.49445	https://eservices.himachaltourism.gov.in/
b1c3f6eb-7466-4b2a-88a0-1776f46a8f73	4	4	4	4	2026-01-21 10:32:18.526086	https://eservices.himachaltourism.gov.in/
1fe51e70-49f2-4da0-879f-3fbdc52f28cb	4	4	4	4	2026-01-21 11:32:18.436071	https://eservices.himachaltourism.gov.in/
837fce9d-0b15-430c-88b1-c0de7cfc2695	4	4	4	4	2026-01-21 12:32:18.472612	https://eservices.himachaltourism.gov.in/
7bb60e7e-5a74-4182-8af1-3e8c7d4f8aa3	4	4	4	4	2026-01-21 13:32:18.457619	https://eservices.himachaltourism.gov.in/
ba4cf07a-6023-4259-a3a2-84779c3d397a	4	4	4	4	2026-01-21 14:32:18.493014	https://eservices.himachaltourism.gov.in/
918652bd-82ce-4334-9729-47a8179dd237	4	4	4	4	2026-01-21 15:32:18.465173	https://eservices.himachaltourism.gov.in/
da232f55-09b5-4872-9527-01a4ead8202a	4	4	4	4	2026-01-21 16:32:18.463925	https://eservices.himachaltourism.gov.in/
0c5f25d2-f680-4668-988f-520696634c8a	4	4	4	4	2026-01-21 16:46:48.510432	https://eservices.himachaltourism.gov.in/
5616a35a-2758-4f51-83a6-84fc434e25cd	4	4	4	4	2026-01-21 16:57:30.318088	https://eservices.himachaltourism.gov.in/
1cbb2068-b780-44c6-bd7d-9e2ad7c100c4	4	4	4	4	2026-01-21 17:48:11.913517	https://eservices.himachaltourism.gov.in/
94d3c70b-d188-431c-90f7-1cd7248f0151	4	4	4	4	2026-01-21 17:51:16.044687	https://eservices.himachaltourism.gov.in/
f3c75c67-b8ed-4cf3-8bd4-2a683c8ce497	4	4	4	4	2026-01-21 17:55:13.744585	https://eservices.himachaltourism.gov.in/
418d7095-d71f-462c-98ba-55b829c70a4f	4	4	4	4	2026-01-21 18:46:45.826425	https://eservices.himachaltourism.gov.in/
a4d3ba83-b062-47c4-b4b5-168f42fdce55	4	4	4	4	2026-01-21 19:46:45.790722	https://eservices.himachaltourism.gov.in/
b8d4ebb3-ec0a-46c4-9bbb-eef23d6d3dc0	4	4	4	4	2026-01-21 20:46:45.833352	https://eservices.himachaltourism.gov.in/
4ad63d32-806e-4363-8736-bb356680a357	4	4	4	4	2026-01-21 21:46:45.796322	https://eservices.himachaltourism.gov.in/
8bdefc2b-5c2d-4977-8d34-829eecad4308	4	4	4	4	2026-01-21 22:46:45.823973	https://eservices.himachaltourism.gov.in/
4fa4a358-4732-4a57-b2d6-7c0a8d2519e6	4	4	4	4	2026-01-21 22:55:33.957876	https://eservices.himachaltourism.gov.in/
a54da8a1-27ab-41a8-8d1f-4c27e24ddf87	4	4	4	4	2026-01-21 23:55:34.047468	https://eservices.himachaltourism.gov.in/
0ea63ba3-d38f-4e6e-ab54-c72b3d1f5050	4	4	4	4	2026-01-22 00:55:34.01843	https://eservices.himachaltourism.gov.in/
d07c1534-4975-49ec-89cf-08ca11a7479e	4	4	4	4	2026-01-22 01:55:34.00898	https://eservices.himachaltourism.gov.in/
861068bd-c62b-4289-895b-9c663dd4297f	4	4	4	4	2026-01-22 02:55:34.035031	https://eservices.himachaltourism.gov.in/
77c071b5-4185-4d6b-93ba-4a7e8f2d9509	4	4	4	4	2026-01-22 05:18:15.316137	https://eservices.himachaltourism.gov.in/
0dd64cc7-e75b-4809-bd48-e18092320a96	4	4	4	4	2026-01-22 06:02:23.450673	https://eservices.himachaltourism.gov.in/
beff875b-8e05-4982-b2da-6976edc7a166	4	4	4	4	2026-01-22 06:02:26.392117	https://eservices.himachaltourism.gov.in/
3e18fe48-ee49-4388-96cf-f21bb3b197bf	4	4	4	4	2026-01-22 07:02:26.448938	https://eservices.himachaltourism.gov.in/
28f65cb4-f82c-41bd-a82e-611986a8cf78	4	4	4	4	2026-01-22 08:02:26.434758	https://eservices.himachaltourism.gov.in/
5afc231b-ef29-45dd-8820-a2c555456663	4	4	4	4	2026-01-22 09:02:26.40962	https://eservices.himachaltourism.gov.in/
e1d6a2a5-6961-4bbf-990e-9cb757cc5996	4	4	4	4	2026-01-22 10:02:26.393563	https://eservices.himachaltourism.gov.in/
211e2d63-3c45-4f64-877b-c20e8b4f69c6	4	4	4	4	2026-01-22 11:02:26.424602	https://eservices.himachaltourism.gov.in/
db6c64e0-406e-4988-9f0e-4aaca8eb7d90	4	4	4	4	2026-01-22 12:02:26.40975	https://eservices.himachaltourism.gov.in/
6191a13d-f2c7-4660-b711-c1e09206f08e	4	4	4	4	2026-01-22 13:02:26.401457	https://eservices.himachaltourism.gov.in/
9b444d93-ddf8-46ed-b8d6-cb89d4751573	4	4	4	4	2026-01-22 14:02:26.422225	https://eservices.himachaltourism.gov.in/
f56184e5-cd85-4832-b5c2-ec3360a1fe01	4	4	4	4	2026-01-23 02:48:51.730339	https://eservices.himachaltourism.gov.in/
798c1778-49e0-4a07-b110-693b168c2737	4	4	4	4	2026-01-23 03:48:51.797933	https://eservices.himachaltourism.gov.in/
4c89ec86-0d26-4894-94db-367baf579af4	4	4	4	4	2026-01-23 16:26:44.73923	https://eservices.himachaltourism.gov.in/
af12f5bb-47a1-43f3-ac3b-aa1bcba418ec	4	4	4	4	2026-01-23 17:24:11.430137	https://eservices.himachaltourism.gov.in/
8707c360-5990-4f1b-a3b1-df666a0846b0	4	4	4	4	2026-01-24 05:08:01.09529	https://eservices.himachaltourism.gov.in/
3da553db-9591-4aeb-8a26-410a755eaedd	4	4	4	4	2026-01-24 06:08:00.961382	https://eservices.himachaltourism.gov.in/
d9926dc7-22f9-49ad-aa63-904debd8ba0e	4	4	4	4	2026-01-24 07:08:00.897981	https://eservices.himachaltourism.gov.in/
626055fb-df43-4383-97c9-d6cb0348df41	4	4	4	4	2026-01-24 08:08:00.909009	https://eservices.himachaltourism.gov.in/
b327a902-f153-42a4-9c6e-eb557939537c	4	4	4	4	2026-01-24 09:08:00.99981	https://eservices.himachaltourism.gov.in/
c73c92ce-cc88-44b6-9b93-2e3b406beba8	4	4	4	4	2026-01-24 10:08:00.937265	https://eservices.himachaltourism.gov.in/
01e991c3-6e83-4702-8080-c38964dcc235	4	4	4	4	2026-01-24 11:08:00.892746	https://eservices.himachaltourism.gov.in/
80603591-b4dc-4789-a0fc-56adc577144d	4	4	4	4	2026-01-24 12:08:00.842677	https://eservices.himachaltourism.gov.in/
3ae75cd6-15c7-4fe9-8b6a-2f7019a5007f	4	4	4	4	2026-01-24 13:08:00.844784	https://eservices.himachaltourism.gov.in/
380c187a-8818-44d4-8a68-bc5dfd8a489f	4	4	4	4	2026-01-24 14:08:00.814183	https://eservices.himachaltourism.gov.in/
35382daf-a4ef-48ee-8769-31b76c0b330a	4	4	4	4	2026-01-24 15:08:00.818436	https://eservices.himachaltourism.gov.in/
e4236b6e-5de1-4668-8285-a12000bc8c87	4	4	4	4	2026-01-24 16:08:00.828946	https://eservices.himachaltourism.gov.in/
6f33f25f-cc06-44af-aadb-2d00d5651b54	4	4	4	4	2026-01-24 17:16:57.49272	https://eservices.himachaltourism.gov.in/
ea7e5d4c-3672-45dc-bb60-c9dd37d5dcf2	4	4	4	4	2026-01-25 03:30:59.471406	https://eservices.himachaltourism.gov.in/
a35d075b-03c8-4136-aa66-0f8c541d6c9c	4	4	4	4	2026-01-25 04:30:59.43358	https://eservices.himachaltourism.gov.in/
f10f25c0-2eb7-48dd-bebb-cfc54235701a	4	4	4	4	2026-01-25 05:30:59.393871	https://eservices.himachaltourism.gov.in/
69dc1cfe-3503-447d-8656-00ed0826cddf	4	4	4	4	2026-01-25 06:50:55.412873	https://eservices.himachaltourism.gov.in/
8ffbdef4-b090-4262-8259-6b783caf00c4	4	4	4	4	2026-01-25 06:51:19.229527	https://eservices.himachaltourism.gov.in/
7b3d9561-6c61-4070-bcf9-2d92e35b5610	4	4	4	4	2026-01-25 06:51:27.250409	https://eservices.himachaltourism.gov.in/
e7f4c324-0108-4dc9-b7d9-c078b6375b77	4	4	4	4	2026-01-25 06:51:56.216003	https://eservices.himachaltourism.gov.in/
f860c868-7338-43b1-9020-d81b4a9a214c	4	4	4	4	2026-01-25 06:53:56.373745	https://eservices.himachaltourism.gov.in/
75bbdbd6-d98b-43b1-bda2-a8b28370694e	4	4	4	4	2026-01-25 06:54:02.345206	https://eservices.himachaltourism.gov.in/
1bc8c560-8f11-4edc-9a7a-96eb4acf32e5	4	4	4	4	2026-01-25 06:54:04.469117	https://eservices.himachaltourism.gov.in/
49e1b7b9-b2b4-42c8-9d16-2aefed193a44	4	4	4	4	2026-01-25 06:54:57.685935	https://eservices.himachaltourism.gov.in/
f783d1eb-dbd1-4f74-8532-e8d2ab4c4ca5	4	4	4	4	2026-01-25 06:55:05.558722	https://eservices.himachaltourism.gov.in/
51d62ccf-e5ab-453d-b157-ebaccbadffe7	4	4	4	4	2026-01-25 06:58:33.849407	https://eservices.himachaltourism.gov.in/
9ba50444-c622-4873-ab3d-68b0bab50ab5	4	4	4	4	2026-01-25 06:58:37.83296	https://eservices.himachaltourism.gov.in/
ff8520fd-2e35-4351-a484-7998737fac88	4	4	4	4	2026-01-25 07:01:10.452114	https://eservices.himachaltourism.gov.in/
05229b9a-8c80-4df4-9798-0f4927141987	4	4	4	4	2026-01-25 07:01:27.433545	https://eservices.himachaltourism.gov.in/
7a5391c7-048d-4df2-8d53-d848f9c18b09	4	4	4	4	2026-01-25 07:04:37.523147	https://eservices.himachaltourism.gov.in/
2fb68ec9-3813-4b4b-9e58-a09521a755c6	4	4	4	4	2026-01-25 07:04:49.277958	https://eservices.himachaltourism.gov.in/
30dce496-af84-40ca-b3b9-296394c570c8	4	4	4	4	2026-01-25 07:04:51.122008	https://eservices.himachaltourism.gov.in/
aa4f3fb3-fabe-4db7-aa77-0d759a3dc753	4	4	4	4	2026-01-25 07:08:52.123444	https://eservices.himachaltourism.gov.in/
4fa1708b-4604-4197-a767-6a315bf5640e	4	4	4	4	2026-01-25 07:09:06.090252	https://eservices.himachaltourism.gov.in/
ec1803d7-5348-4b2d-817f-bf768bf95d47	4	4	4	4	2026-01-25 07:09:08.769628	https://eservices.himachaltourism.gov.in/
fef3bc28-0cdb-4f8d-a2af-0e0dd3954a66	4	4	4	4	2026-01-25 07:09:20.992247	https://eservices.himachaltourism.gov.in/
55447d16-6eb0-4f62-85be-97ce0eed5a50	4	4	4	4	2026-01-25 07:09:41.002459	https://eservices.himachaltourism.gov.in/
b04683ec-1785-408f-a072-1ce45fe2c20e	4	4	4	4	2026-01-25 07:11:28.160723	https://eservices.himachaltourism.gov.in/
1135aa83-b4a3-422a-9377-03107bbea6ae	4	4	4	4	2026-01-25 07:11:39.125989	https://eservices.himachaltourism.gov.in/
76e4fce2-c7cc-4744-96c0-f5699cf50976	4	4	4	4	2026-01-25 07:11:56.962839	https://eservices.himachaltourism.gov.in/
2d09f946-1d0a-4934-b81b-840d3184c6f4	4	4	4	4	2026-01-25 07:12:01.827827	https://eservices.himachaltourism.gov.in/
e170d4c5-7d7d-4273-a163-132042328949	4	4	4	4	2026-01-25 07:12:10.791018	https://eservices.himachaltourism.gov.in/
de5da338-084f-4f70-8fab-ed8bcdab8717	4	4	4	4	2026-01-25 07:12:13.510587	https://eservices.himachaltourism.gov.in/
ee8dadad-d80c-41fe-876a-d31dfc0bb8a8	4	4	4	4	2026-01-25 07:14:22.466634	https://eservices.himachaltourism.gov.in/
cf38022b-123c-4d4b-9fdb-9504a2a2b1e2	4	4	4	4	2026-01-25 07:14:27.446001	https://eservices.himachaltourism.gov.in/
0be7d61b-cba0-4195-bcce-3fb7425f54c5	4	4	4	4	2026-01-25 07:15:23.427902	https://eservices.himachaltourism.gov.in/
e3036018-cf1f-4fba-a608-b4066060308c	4	4	4	4	2026-01-25 07:19:54.706738	https://eservices.himachaltourism.gov.in/
1e6ca707-b04f-45c5-97ed-2bc8821c951a	4	4	4	4	2026-01-25 07:20:16.621678	https://eservices.himachaltourism.gov.in/
6d81e819-9fbe-4abc-8517-be1c187011c1	4	4	4	4	2026-01-25 07:20:25.435379	https://eservices.himachaltourism.gov.in/
110b29b6-0bb5-4f6f-8ca7-53ba6528e8f3	4	4	4	4	2026-01-25 07:20:36.186457	https://eservices.himachaltourism.gov.in/
40d494bb-a720-4a23-9b1e-8765d7bcd6c7	4	4	4	4	2026-01-25 07:21:59.701231	https://eservices.himachaltourism.gov.in/
00a89374-708e-4a10-833b-afacff7ed6b7	4	4	4	4	2026-01-25 07:24:21.838808	https://eservices.himachaltourism.gov.in/
d421fe85-da0a-4036-843d-a871762fe7f7	4	4	4	4	2026-01-25 08:24:21.864676	https://eservices.himachaltourism.gov.in/
6aacf6f5-57f1-4164-9c8e-f4c00d49c791	4	4	4	4	2026-01-25 09:24:21.825025	https://eservices.himachaltourism.gov.in/
f9760853-c0e2-4aad-af23-861b5d687c71	4	4	4	4	2026-01-25 10:24:21.827073	https://eservices.himachaltourism.gov.in/
aa5250f1-ba1b-43fe-9004-86d8f44c547b	4	4	4	4	2026-01-25 11:24:21.861035	https://eservices.himachaltourism.gov.in/
f4a77c77-be13-4791-9907-1f1b042d808b	4	4	4	4	2026-01-25 12:24:21.85203	https://eservices.himachaltourism.gov.in/
b881fbd8-de09-45e8-9585-2f0f125fa291	4	4	4	4	2026-01-25 13:24:21.852833	https://eservices.himachaltourism.gov.in/
8808aca5-131f-4291-9470-aab58be298a5	4	4	4	4	2026-01-25 14:24:21.879569	https://eservices.himachaltourism.gov.in/
7ee0b342-9ab8-4f9b-9d05-71b494298ae0	4	4	4	4	2026-01-25 15:24:21.877297	https://eservices.himachaltourism.gov.in/
9eca8b74-db88-448d-a0eb-689aee20bcc4	4	4	4	4	2026-01-25 16:24:21.874908	https://eservices.himachaltourism.gov.in/
440e5614-0087-4828-9296-c8246bbe8120	4	4	4	4	2026-01-25 17:24:21.945486	https://eservices.himachaltourism.gov.in/
b5ca24b8-ae2a-4494-8f71-a107ca6b7a2c	4	4	4	4	2026-01-25 18:24:21.934937	https://eservices.himachaltourism.gov.in/
5dc17147-5dce-47e2-86de-1c908eaf1e4f	4	4	4	4	2026-01-25 19:24:21.927943	https://eservices.himachaltourism.gov.in/
ae6aab63-9c60-4de5-9b51-2741e7ed33d6	4	4	4	4	2026-01-25 20:24:21.92385	https://eservices.himachaltourism.gov.in/
a330823c-8c0d-4f1f-8f78-08abb4a597f1	4	4	4	4	2026-01-25 21:24:21.926188	https://eservices.himachaltourism.gov.in/
f0b775f8-d35d-4676-88e2-59f718a77774	4	4	4	4	2026-01-25 21:40:56.451307	https://eservices.himachaltourism.gov.in/
0b0b73c6-3c59-49ea-8297-7e55c36c180b	4	4	4	4	2026-01-25 21:46:43.03133	https://eservices.himachaltourism.gov.in/
883dd9c6-9249-495a-a310-9f5e9b1d550f	4	4	4	4	2026-01-25 22:06:42.975483	https://eservices.himachaltourism.gov.in/
d4e6df71-355c-411a-8272-a6374fa42ce1	4	4	4	4	2026-01-25 22:27:00.469392	https://eservices.himachaltourism.gov.in/
15a249e2-6b59-4f9c-938f-380fe944870a	4	4	4	4	2026-01-25 22:31:26.020548	https://eservices.himachaltourism.gov.in/
6049ad9a-bab6-4428-89bf-591cf1346808	4	4	4	4	2026-01-25 22:45:42.775816	https://eservices.himachaltourism.gov.in/
fb8e5a3d-e6f1-4f0c-9f62-997a3e0df89f	4	4	4	4	2026-01-25 22:49:00.196107	https://eservices.himachaltourism.gov.in/
a6fda3b5-72d7-4f1f-a1b8-feba2e37de1a	4	4	4	4	2026-01-25 23:49:00.23898	https://eservices.himachaltourism.gov.in/
094d9fc6-39b8-4680-a04b-e663b5b7a701	4	4	4	4	2026-01-26 00:49:00.275229	https://eservices.himachaltourism.gov.in/
8c65c0a4-e7ae-446a-b5bf-86599db43072	4	4	4	4	2026-01-26 01:49:00.189405	https://eservices.himachaltourism.gov.in/
6b544a2d-92ae-4742-89af-aa83bc6aa1a4	4	4	4	4	2026-01-26 02:49:00.194253	https://eservices.himachaltourism.gov.in/
2a125305-e708-42cc-90d1-3ab58cc65840	4	4	4	4	2026-01-26 03:49:00.183706	https://eservices.himachaltourism.gov.in/
4bc8efbb-79d2-4162-b2b5-1ced431e6401	4	4	4	4	2026-01-26 04:49:00.176208	https://eservices.himachaltourism.gov.in/
a5b79bda-9916-4127-a6ad-d873b7f06b21	4	4	4	4	2026-01-26 05:49:00.186927	https://eservices.himachaltourism.gov.in/
821b9d7f-7b1c-416c-82c5-d84505b1a04d	4	4	4	4	2026-01-26 06:49:00.205707	https://eservices.himachaltourism.gov.in/
5af1644a-0088-41e0-873f-eb478b1be22b	4	4	4	4	2026-01-26 07:49:00.209647	https://eservices.himachaltourism.gov.in/
7c3d1317-ea2f-4610-947e-6569c0a8ce3c	4	4	4	4	2026-01-26 08:49:00.263055	https://eservices.himachaltourism.gov.in/
ec6c3e6b-46f8-4540-a2e7-6490360222a1	4	4	4	4	2026-01-26 09:49:00.280214	https://eservices.himachaltourism.gov.in/
f747e076-193c-4b41-a3ff-da24f5522d7c	4	4	4	4	2026-01-26 10:49:00.292446	https://eservices.himachaltourism.gov.in/
6af94277-517f-4437-818f-ab8babd94725	4	4	4	4	2026-01-26 11:49:00.268927	https://eservices.himachaltourism.gov.in/
812d9b6d-05c2-4f07-a979-05eacaeb272a	4	4	4	4	2026-01-26 12:49:00.218676	https://eservices.himachaltourism.gov.in/
629e8cfb-7332-4e80-a0a3-df5f7bca8b8b	4	4	4	4	2026-01-26 13:49:00.212696	https://eservices.himachaltourism.gov.in/
03285e7c-efbe-4768-91e9-c296640e138f	4	4	4	4	2026-01-26 14:49:00.219279	https://eservices.himachaltourism.gov.in/
bd9a7f8f-5b45-44ac-9ff7-fb52d07bce2d	4	4	4	4	2026-01-26 15:49:00.185425	https://eservices.himachaltourism.gov.in/
2ae796e4-5c6c-4e44-a8f9-9c7ce1dae5fa	4	4	4	4	2026-01-26 16:49:00.259399	https://eservices.himachaltourism.gov.in/
52cff72c-b6e0-4c85-a108-73973a87f0ac	4	4	4	4	2026-01-26 17:49:00.210047	https://eservices.himachaltourism.gov.in/
a5270e4e-f9df-4bd4-a436-2aef606a6b0b	4	4	4	4	2026-01-26 18:49:00.211397	https://eservices.himachaltourism.gov.in/
eafc93ae-1c6d-496a-98f0-748bcb6f2f44	4	4	4	4	2026-01-26 19:49:00.239887	https://eservices.himachaltourism.gov.in/
9083c4e9-16e3-4aed-85c6-8bc896a86b4c	4	4	4	4	2026-01-26 20:49:00.198791	https://eservices.himachaltourism.gov.in/
32032e27-de41-4197-b9f5-f62b29b6c1c8	4	4	4	4	2026-01-26 21:49:00.204837	https://eservices.himachaltourism.gov.in/
cf40411c-e972-47bc-91d3-790435b1c4f6	4	4	4	4	2026-01-26 22:49:00.220062	https://eservices.himachaltourism.gov.in/
cb2044fb-38e7-430d-89d7-492250485e45	4	4	4	4	2026-01-26 23:49:00.206222	https://eservices.himachaltourism.gov.in/
0c02c920-aa31-4e33-9ad9-421349c434d5	4	4	4	4	2026-01-27 00:49:00.202588	https://eservices.himachaltourism.gov.in/
d7ca679e-5309-4f83-84b3-13bd6cfdb231	4	4	4	4	2026-01-27 01:49:00.21431	https://eservices.himachaltourism.gov.in/
0d5bc41a-72b1-41a4-b881-3094d6d7adb2	4	4	4	4	2026-01-27 02:49:00.200542	https://eservices.himachaltourism.gov.in/
73240a72-9170-4813-89b1-42a2bda2c1ab	4	4	4	4	2026-01-27 03:49:00.199038	https://eservices.himachaltourism.gov.in/
8e766a32-6f1f-4739-a695-6b1fe07f5d41	4	4	4	4	2026-01-27 04:49:00.241705	https://eservices.himachaltourism.gov.in/
6f3992fe-ac1c-4f8d-bfb9-fea1e4769229	4	4	4	4	2026-01-27 05:49:00.188022	https://eservices.himachaltourism.gov.in/
baaae603-f31c-401c-b92a-e66dc25b56e3	4	4	4	4	2026-01-27 06:49:00.847461	https://eservices.himachaltourism.gov.in/
fdd3769c-dbd9-44b5-ad62-7caa3741f9b3	4	4	4	4	2026-01-27 07:49:00.300036	https://eservices.himachaltourism.gov.in/
db2ebdd2-5315-4d5e-9cbb-c72502fc86b9	4	4	4	4	2026-01-27 08:49:00.232516	https://eservices.himachaltourism.gov.in/
fc21ab1e-2d2c-4cc0-bebe-ed97c53b8284	4	4	4	4	2026-01-27 09:49:00.250131	https://eservices.himachaltourism.gov.in/
91b7f991-c453-4ddc-9bf7-f956b9b7812f	4	4	4	4	2026-01-27 10:49:00.221315	https://eservices.himachaltourism.gov.in/
e1d3fa73-5078-4b11-acaf-c3dd955d66d3	4	4	4	4	2026-01-27 11:49:00.203181	https://eservices.himachaltourism.gov.in/
221e5ffa-841f-4e50-84d3-13eacced073c	4	4	4	4	2026-01-27 12:49:00.229319	https://eservices.himachaltourism.gov.in/
2fb143b9-9583-4564-8c6c-e2bda1ccd278	4	4	4	4	2026-01-27 13:49:00.213083	https://eservices.himachaltourism.gov.in/
44c7676f-6ea5-42e5-af69-beb2e1d7e215	4	4	4	4	2026-01-27 14:49:00.223193	https://eservices.himachaltourism.gov.in/
b2417c49-8a75-4c44-8d8c-ac1ee6d97bcb	4	4	4	4	2026-01-27 15:49:00.222695	https://eservices.himachaltourism.gov.in/
7b5db7f9-ff47-4d26-b3fb-9ad53f75f301	4	4	4	4	2026-01-27 16:49:00.199728	https://eservices.himachaltourism.gov.in/
dd016dfb-c9f9-4ad3-8719-9400b5b521e8	4	4	4	4	2026-01-27 17:49:00.207109	https://eservices.himachaltourism.gov.in/
e4737b47-64e8-467c-a936-5c1c1ae788b2	4	4	4	4	2026-01-27 18:49:00.234314	https://eservices.himachaltourism.gov.in/
0654b1f2-b8a0-4858-9d67-fd5dcfc5b215	4	4	4	4	2026-01-27 19:49:00.221847	https://eservices.himachaltourism.gov.in/
a49b73ee-d6f4-4b7e-88a8-a34712f81081	4	4	4	4	2026-01-27 20:49:00.215113	https://eservices.himachaltourism.gov.in/
7c9691fd-22f7-470a-85f1-72162dd83912	4	4	4	4	2026-01-27 21:49:00.213132	https://eservices.himachaltourism.gov.in/
43a44311-891b-4d91-b222-e1fa6cd14a2d	4	4	4	4	2026-01-27 22:49:00.220634	https://eservices.himachaltourism.gov.in/
66999709-5522-4eae-be5c-bb26ca6d912b	4	4	4	4	2026-01-27 23:49:00.21455	https://eservices.himachaltourism.gov.in/
719a7cbb-c980-4932-a4cf-3179f679cb22	4	4	4	4	2026-01-28 00:49:00.229747	https://eservices.himachaltourism.gov.in/
7628d44d-4c5d-4e09-8699-ac265d4a0876	4	4	4	4	2026-01-28 01:49:00.234386	https://eservices.himachaltourism.gov.in/
3cca4ef3-e151-4e05-ae9e-b55ec34fe574	4	4	4	4	2026-01-28 02:49:00.25284	https://eservices.himachaltourism.gov.in/
02157185-ea99-4d29-ae0b-6f5192b67b87	4	4	4	4	2026-01-28 03:49:00.217354	https://eservices.himachaltourism.gov.in/
0a31beb7-f80f-4134-b4f2-015026329a85	4	4	4	4	2026-01-28 04:49:00.302003	https://eservices.himachaltourism.gov.in/
200f742f-502c-420c-b4cd-02bf96fdec79	4	4	4	4	2026-01-28 05:49:00.210878	https://eservices.himachaltourism.gov.in/
c571214e-7d6d-4944-b5ba-cc16de584acb	4	4	4	4	2026-01-28 06:49:00.468634	https://eservices.himachaltourism.gov.in/
9960c3b2-b179-4108-a9a4-997ada2aeef2	4	4	4	4	2026-01-28 07:49:18.338412	https://eservices.himachaltourism.gov.in/
a77ffe48-7b4c-4fa7-b7c9-f906996b290b	4	4	4	4	2026-01-28 08:49:00.270127	https://eservices.himachaltourism.gov.in/
b0a4d3d2-ad66-4f4d-9503-88d470b3668f	4	4	4	4	2026-01-28 09:49:00.328437	https://eservices.himachaltourism.gov.in/
ee85b094-916c-4044-8df3-3e45278b7d80	4	4	4	4	2026-01-28 10:49:00.235581	https://eservices.himachaltourism.gov.in/
1ff5e3be-b97b-4b56-b20a-16931d8cb766	4	4	4	4	2026-01-28 11:49:00.267639	https://eservices.himachaltourism.gov.in/
ba42c438-cc47-4da7-9904-edcc6794aea7	4	4	4	4	2026-01-28 12:49:00.244684	https://eservices.himachaltourism.gov.in/
53696ed9-b841-4888-affa-718fb218b865	4	4	4	4	2026-01-28 13:49:00.270226	https://eservices.himachaltourism.gov.in/
088303d3-6951-4034-98e0-30a29c68cddb	4	4	4	4	2026-01-28 14:49:00.231558	https://eservices.himachaltourism.gov.in/
b164cf69-522f-4833-bb54-58af1609e9ea	4	4	4	4	2026-01-28 15:49:00.237354	https://eservices.himachaltourism.gov.in/
1b2c104c-e6ec-41c3-8d93-3a9e0d65d3ea	4	4	4	4	2026-01-28 16:49:00.228781	https://eservices.himachaltourism.gov.in/
bc4f04f4-4fa8-4b63-a8ac-ee0f32bcc4cb	4	4	4	4	2026-01-28 17:49:00.232853	https://eservices.himachaltourism.gov.in/
ac4bf1f7-0e7b-4ef5-a718-1d3fb8299a91	4	4	4	4	2026-01-28 18:49:00.240246	https://eservices.himachaltourism.gov.in/
d856ff0e-c1a3-4c51-a21b-c558d495dc2c	4	4	4	4	2026-01-28 19:49:00.236273	https://eservices.himachaltourism.gov.in/
0d57b559-f8df-4cf4-9d53-c454b172f63a	4	4	4	4	2026-01-28 20:49:00.212885	https://eservices.himachaltourism.gov.in/
c855773f-b136-4af8-9836-0a5368f0c3c2	4	4	4	4	2026-01-28 21:49:00.262732	https://eservices.himachaltourism.gov.in/
098aa13c-26a6-42f9-bd69-2c00c33427e7	4	4	4	4	2026-01-28 22:49:00.270928	https://eservices.himachaltourism.gov.in/
19428575-5439-4c44-bb3d-a3529b0abcfb	4	4	4	4	2026-01-28 23:49:00.259648	https://eservices.himachaltourism.gov.in/
5927eee1-5a96-4924-9704-ce4bc9d8ea95	4	4	4	4	2026-01-29 00:49:00.257524	https://eservices.himachaltourism.gov.in/
5fa75997-f2fd-4242-88fe-5175508219a7	4	4	4	4	2026-01-29 01:49:00.253997	https://eservices.himachaltourism.gov.in/
7851a2c4-5f67-4d39-acd9-e0bcfa8cd8d0	4	4	4	4	2026-01-29 02:49:00.267895	https://eservices.himachaltourism.gov.in/
f14fe9d2-42fe-4dda-948d-12b77c1d5d71	4	4	4	4	2026-01-29 03:49:00.247535	https://eservices.himachaltourism.gov.in/
739351fb-131c-4165-a9fa-1c75a91e8597	4	4	4	4	2026-01-29 04:49:00.282584	https://eservices.himachaltourism.gov.in/
ee236426-05a3-464c-9830-2a65eccfe453	4	4	4	4	2026-01-29 05:49:00.227227	https://eservices.himachaltourism.gov.in/
011001a0-d2a4-4844-89c5-108d44e52ac7	4	4	4	4	2026-01-29 06:49:00.264744	https://eservices.himachaltourism.gov.in/
1b71216f-0bed-4591-abc4-363bf5645a8c	4	4	4	4	2026-01-29 07:49:00.27168	https://eservices.himachaltourism.gov.in/
fcc9910c-6868-4742-93b0-47d797749594	4	4	4	4	2026-01-29 08:49:00.240394	https://eservices.himachaltourism.gov.in/
77eec7a6-3377-4fe5-8c22-2c9efc8137af	4	4	4	4	2026-01-29 09:49:00.261228	https://eservices.himachaltourism.gov.in/
4aff6ac2-aa59-499f-8286-7699baadcc21	4	4	4	4	2026-01-29 10:49:00.245887	https://eservices.himachaltourism.gov.in/
5adc90c3-fc4d-49dc-b718-2f5c5597f7df	4	4	4	4	2026-01-29 11:49:00.251769	https://eservices.himachaltourism.gov.in/
719e1483-48c5-43a8-9bb7-e6fbe65fef4e	4	4	4	4	2026-01-29 12:49:00.274009	https://eservices.himachaltourism.gov.in/
105b86d1-ef3b-4831-aa5b-bdf3950e7c14	4	4	4	4	2026-01-29 13:49:00.250981	https://eservices.himachaltourism.gov.in/
08998f9c-4dda-4376-96f7-15cdbc3e4697	4	4	4	4	2026-01-29 14:49:00.253543	https://eservices.himachaltourism.gov.in/
28fd96c1-d3d0-4807-b186-b16873b6234f	4	4	4	4	2026-01-29 15:49:00.269328	https://eservices.himachaltourism.gov.in/
a1d8954e-f6df-4543-9382-f01096376495	4	4	4	4	2026-01-29 16:49:00.331904	https://eservices.himachaltourism.gov.in/
7b0fe0e5-2cfe-41df-9e39-04a0da0db9b4	4	4	4	4	2026-01-29 17:49:00.268253	https://eservices.himachaltourism.gov.in/
bb062ba8-316c-4781-afc6-fbb21c72b89d	4	4	4	4	2026-01-29 18:49:00.331042	https://eservices.himachaltourism.gov.in/
d8d85e22-8280-4218-a1dc-5dd978501988	4	4	4	4	2026-01-29 19:49:00.23488	https://eservices.himachaltourism.gov.in/
50d24f24-0018-4ee5-85e9-1c129472d36d	4	4	4	4	2026-01-29 20:49:00.272823	https://eservices.himachaltourism.gov.in/
2d5c2966-08c1-4cd9-b40d-5df19553600e	4	4	4	4	2026-01-29 21:49:00.237578	https://eservices.himachaltourism.gov.in/
6789fa7a-43e9-4dee-85a4-da5923db8c90	4	4	4	4	2026-01-29 22:49:00.247437	https://eservices.himachaltourism.gov.in/
c353fe34-dbf0-450c-be01-cf7c6ae06d6e	4	4	4	4	2026-01-29 23:49:00.252148	https://eservices.himachaltourism.gov.in/
92a82c4b-ff9b-409f-897c-8ecb2c5a5be5	4	4	4	4	2026-01-30 00:49:00.279981	https://eservices.himachaltourism.gov.in/
a6bc0fed-fccc-4d31-a1a6-3c50ebde7db0	4	4	4	4	2026-01-30 01:49:00.273159	https://eservices.himachaltourism.gov.in/
1f5f61cb-1256-4f7d-b316-f9343d29ca8e	4	4	4	4	2026-01-31 02:07:10.639178	https://eservices.himachaltourism.gov.in/
3c305c82-c2b3-4286-a07a-1add5ab7b6b9	4	4	4	4	2026-01-31 02:18:11.741733	https://eservices.himachaltourism.gov.in/
7e6ee210-ea64-4811-8626-c587d925270b	4	4	4	4	2026-01-31 02:22:37.564551	https://eservices.himachaltourism.gov.in/
f3a09ae9-9ff4-42d2-bdcc-1b3a6c87abe3	4	4	4	4	2026-01-31 03:22:37.303166	https://eservices.himachaltourism.gov.in/
593e192f-dd7a-472a-b22a-a87df610d22e	4	4	4	4	2026-01-31 04:22:37.312488	https://eservices.himachaltourism.gov.in/
ede439ba-f772-4a83-81d9-8dad7fc27deb	4	4	4	4	2026-01-31 04:25:57.327233	https://eservices.himachaltourism.gov.in/
147e4412-c37f-4ea2-8921-8f0015d740c1	4	4	4	4	2026-01-31 04:43:49.458168	https://eservices.himachaltourism.gov.in/
32971da2-3949-468e-a9be-82036ba4a97e	4	4	4	4	2026-01-31 04:44:52.503262	https://eservices.himachaltourism.gov.in/
fe0f4a0f-2005-477d-a5e9-1248566ed5fc	4	4	4	4	2026-01-31 04:45:18.767164	https://eservices.himachaltourism.gov.in/
0be1d8c8-8f5d-490d-af5f-2da6e7eb050d	4	4	4	4	2026-01-31 05:45:18.700556	https://eservices.himachaltourism.gov.in/
cfbb491f-d164-43b7-847a-c823badea468	4	4	4	4	2026-01-31 06:43:41.984457	https://eservices.himachaltourism.gov.in/
e2e2df80-0a9c-4f8a-936d-d7abf60b3083	4	4	4	4	2026-01-31 06:44:27.558164	https://eservices.himachaltourism.gov.in/
0ddc47c0-6464-4e41-92a5-53b229376e54	4	4	4	4	2026-01-31 06:45:49.475851	https://eservices.himachaltourism.gov.in/
a50d6077-b2ea-4249-ae92-a35f8dcaeb41	4	4	4	4	2026-01-31 06:46:05.567505	https://eservices.himachaltourism.gov.in/
f7ac89ad-313c-46fa-82c3-c477e5cdb240	4	4	4	4	2026-01-31 06:49:36.400158	https://eservices.himachaltourism.gov.in/
6eebeb3b-93c5-41b4-927a-93038108b933	4	4	4	4	2026-01-31 06:50:55.24736	https://eservices.himachaltourism.gov.in/
80a8e15a-d752-4457-8f8c-27571aae95a9	4	4	4	4	2026-01-31 06:52:29.909166	https://eservices.himachaltourism.gov.in/
7499d3ab-d236-4998-9945-b19e597caa76	4	4	4	4	2026-01-31 06:59:44.817718	https://eservices.himachaltourism.gov.in/
0a78def7-4636-43a2-908d-ab69aab103e1	4	4	4	4	2026-01-31 07:08:22.865458	https://eservices.himachaltourism.gov.in/
0a4916c1-bb07-4bcb-80ac-db2d5d6b8a61	4	4	4	4	2026-01-31 07:32:51.01616	https://eservices.himachaltourism.gov.in/
39a9b681-2806-413a-a14a-8f056e321417	4	4	4	4	2026-01-31 07:40:53.64619	https://eservices.himachaltourism.gov.in/
ace01669-7e67-4b5b-8b56-1644d0923ee2	4	4	4	4	2026-01-31 07:48:06.154799	https://eservices.himachaltourism.gov.in/
7ebf26ec-fb4c-4e95-a0ae-a8b8ef00e27a	4	4	4	4	2026-01-31 08:48:06.159167	https://eservices.himachaltourism.gov.in/
6b58aa5f-846e-4b6c-a05a-708c44554296	4	4	4	4	2026-01-31 09:48:06.152497	https://eservices.himachaltourism.gov.in/
f6922527-4c1a-4af5-a9ca-c782a89beaab	4	4	4	4	2026-01-31 10:48:06.184842	https://eservices.himachaltourism.gov.in/
b5de5fe5-2b66-4029-9948-66a16bf67f1b	4	4	4	4	2026-01-31 11:01:52.700159	https://eservices.himachaltourism.gov.in/
87886a1c-aad3-4649-b804-d5a57c3cc88b	4	4	4	4	2026-01-31 11:02:02.190545	https://eservices.himachaltourism.gov.in/
4023b8da-b4e6-4196-a5e1-e152dddae16c	4	4	4	4	2026-01-31 11:04:20.544082	https://eservices.himachaltourism.gov.in/
d7667c0a-7f7f-4c18-b2c4-4206d3600be5	4	4	4	4	2026-01-31 11:06:13.718064	https://eservices.himachaltourism.gov.in/
dcd5d5c2-2cbf-4dc2-9e83-38e95d3c9083	4	4	4	4	2026-01-31 12:06:13.712813	https://eservices.himachaltourism.gov.in/
f463ca7b-33de-4d30-8564-87bf049fab24	4	4	4	4	2026-01-31 13:06:13.714864	https://eservices.himachaltourism.gov.in/
f39531e5-edbd-404f-9a44-bcb14680b9d8	4	4	4	4	2026-01-31 14:06:13.724143	https://eservices.himachaltourism.gov.in/
4b5877a9-c45e-47e2-9c76-2c797b71f394	4	4	4	4	2026-01-31 15:06:13.755185	https://eservices.himachaltourism.gov.in/
4c517119-1430-4022-b36a-df2cae02f80e	4	4	4	4	2026-01-31 15:45:31.186165	https://eservices.himachaltourism.gov.in/
6ee1572e-25c3-4408-ae36-70d6487e6687	4	4	4	4	2026-01-31 16:06:32.934166	https://eservices.himachaltourism.gov.in/
5a994092-275f-48d2-a38c-f533a1410a5e	4	4	4	4	2026-01-31 16:15:04.395563	https://eservices.himachaltourism.gov.in/
d7009678-3649-436c-a080-d3da27df1ec9	4	4	4	4	2026-01-31 16:20:49.84718	https://eservices.himachaltourism.gov.in/
0da4e613-3c0f-41c2-9a06-422ff8ebf9f3	4	4	4	4	2026-01-31 16:24:24.77329	https://eservices.himachaltourism.gov.in/
50ccc05c-ed42-4fbe-a894-03e32a25023a	4	4	4	4	2026-01-31 16:26:53.988164	https://eservices.himachaltourism.gov.in/
27eaf506-459d-49b4-aae4-d5283cced26f	4	4	4	4	2026-01-31 16:54:30.63517	https://eservices.himachaltourism.gov.in/
0359de9f-cff1-4bc1-8c2d-eac27b57dd6c	4	4	4	4	2026-01-31 16:58:56.930944	https://eservices.himachaltourism.gov.in/
ac0de335-a91f-40bb-b256-864d21a90e3a	4	4	4	4	2026-01-31 17:05:00.889758	https://eservices.himachaltourism.gov.in/
97c5ea48-bfa9-4fa4-b36d-081fe8f53e62	4	4	4	4	2026-01-31 17:10:27.158184	https://eservices.himachaltourism.gov.in/
1141e7b4-49ec-4380-a31c-1a5e36fdd702	4	4	4	4	2026-01-31 17:13:21.849228	https://eservices.himachaltourism.gov.in/
103152c8-4297-45ad-87a1-82dccf59c242	4	4	4	4	2026-01-31 17:35:35.920548	https://eservices.himachaltourism.gov.in/
89931e36-fb58-448e-be10-97efa6315a6d	4	4	4	4	2026-01-31 17:42:14.250682	https://eservices.himachaltourism.gov.in/
3540e6e9-e53c-4d46-9f27-262b1a00bad8	4	4	4	4	2026-01-31 17:44:24.342296	https://eservices.himachaltourism.gov.in/
7805e66d-6fef-47db-a4b4-a2e6440cd338	4	4	4	4	2026-01-31 17:53:30.714171	https://eservices.himachaltourism.gov.in/
d9fb36e5-edee-4064-8dcf-7629d76a531c	4	4	4	4	2026-01-31 18:01:53.393481	https://eservices.himachaltourism.gov.in/
f441e7f5-283b-4128-b850-7b8f647263d5	4	4	4	4	2026-01-31 18:08:55.602168	https://eservices.himachaltourism.gov.in/
29b0f822-3327-43dd-8680-35b0a37cbff0	4	4	4	4	2026-01-31 18:11:29.83205	https://eservices.himachaltourism.gov.in/
bbac406d-61e8-482c-9097-f1dfd792c330	4	4	4	4	2026-01-31 18:16:11.604886	https://eservices.himachaltourism.gov.in/
9e9ab10f-ead8-4760-b3da-4edccd94f9e2	4	4	4	4	2026-01-31 18:33:51.414206	https://eservices.himachaltourism.gov.in/
2dc60a0a-b7a4-4a18-b0dd-48a6e845d262	4	4	4	4	2026-01-31 18:40:53.645311	https://eservices.himachaltourism.gov.in/
235ac4f0-f6f5-4be2-ac94-0e985fb6ae79	4	4	4	4	2026-01-31 18:44:07.445423	https://eservices.himachaltourism.gov.in/
69756a84-ed1d-4791-bd15-eb9a205588fa	4	4	4	4	2026-01-31 18:49:34.903162	https://eservices.himachaltourism.gov.in/
be3a25ad-e3f4-43f1-bd3f-82424fddf3b7	4	4	4	4	2026-01-31 19:03:48.931261	https://eservices.himachaltourism.gov.in/
6641d953-a662-4034-bd18-a9c168e22152	4	4	4	4	2026-01-31 19:10:35.29922	https://eservices.himachaltourism.gov.in/
1ad2bf0f-37f1-44a8-9176-fc9a801e4fd4	4	4	4	4	2026-01-31 19:19:40.526579	https://eservices.himachaltourism.gov.in/
bc2045bd-1688-43ce-9037-425503519ead	4	4	4	4	2026-01-31 19:30:40.459442	https://eservices.himachaltourism.gov.in/
8f87ae82-85e9-4694-8a64-8deb74015bc3	4	4	4	4	2026-01-31 19:37:17.064675	https://eservices.himachaltourism.gov.in/
5ce3ebdd-214c-44a9-8908-1184b37a08a8	4	4	4	4	2026-01-31 19:43:35.048788	https://eservices.himachaltourism.gov.in/
a5a08fb9-4e21-493f-ba6b-611173c0ae9d	4	4	4	4	2026-01-31 19:53:16.159937	https://eservices.himachaltourism.gov.in/
4ea84e23-a24a-4fd8-8af1-80cec3e03ddb	4	4	4	4	2026-01-31 19:57:20.908043	https://eservices.himachaltourism.gov.in/
4c6f97b7-6a11-409f-b53f-5be2435356fb	4	4	4	4	2026-01-31 20:07:03.025882	https://eservices.himachaltourism.gov.in/
cfd4ca4b-2413-4ee5-a150-c81f66bd0d9a	4	4	4	4	2026-01-31 20:09:17.581455	https://eservices.himachaltourism.gov.in/
d13e4181-8301-4241-9fa6-8ae4f9bb4b4a	4	4	4	4	2026-01-31 20:11:33.673287	https://eservices.himachaltourism.gov.in/
745c4873-95dd-480c-88f7-e6396faae359	4	4	4	4	2026-01-31 20:13:09.868488	https://eservices.himachaltourism.gov.in/
f4c4548e-ff7f-4067-99d6-3cbaac1d701d	4	4	4	4	2026-01-31 21:13:09.845645	https://eservices.himachaltourism.gov.in/
34d4530f-12b6-481b-9374-0a29315dee14	4	4	4	4	2026-01-31 21:17:32.458475	https://eservices.himachaltourism.gov.in/
5dfefcef-a3a7-47fb-9c51-17ed92b3151d	4	4	4	4	2026-01-31 21:21:11.329078	https://eservices.himachaltourism.gov.in/
08987220-8d04-46dd-ae76-3ca521be113f	4	4	4	4	2026-01-31 22:21:11.353498	https://eservices.himachaltourism.gov.in/
70059ad8-4f4e-47cf-82ee-904f0e9f9965	4	4	4	4	2026-01-31 23:21:11.373977	https://eservices.himachaltourism.gov.in/
712d21cc-c80a-45f0-9b81-2452038b8e7b	4	4	4	4	2026-02-01 00:21:11.368365	https://eservices.himachaltourism.gov.in/
77d0c90c-0b45-4719-9993-5ef22ff55833	4	4	4	4	2026-02-01 01:21:11.371236	https://eservices.himachaltourism.gov.in/
8c7dc371-efb3-4519-b2c4-b6745b3c35fa	4	4	4	4	2026-02-01 01:38:22.072701	https://eservices.himachaltourism.gov.in/
f98ad444-b576-41a8-ae9f-c1ad05e3c8b9	4	4	4	4	2026-02-01 02:38:21.961316	https://eservices.himachaltourism.gov.in/
0bdc7cc3-bfaf-442f-8dc2-746c1cf404d4	4	4	4	4	2026-02-01 02:49:34.308669	https://eservices.himachaltourism.gov.in/
f188b68d-d366-45fa-86dc-1aaba411840a	4	4	4	4	2026-02-01 02:57:37.028557	https://eservices.himachaltourism.gov.in/
d863c49c-dc0d-43ae-8938-bb76fa8a1b69	4	4	4	4	2026-02-01 03:04:30.085129	https://eservices.himachaltourism.gov.in/
16f5eed4-27c8-466c-afed-64f327fab385	4	4	4	4	2026-02-01 03:13:28.151757	https://eservices.himachaltourism.gov.in/
738cf8c4-48e6-4b8d-ab4a-6117740d5ae4	4	4	4	4	2026-02-01 03:32:32.273638	https://eservices.himachaltourism.gov.in/
fe19dceb-21de-42ca-b4a8-5512bacd6d3e	4	4	4	4	2026-02-01 03:40:39.50717	https://eservices.himachaltourism.gov.in/
5f6b15f6-45a1-4a81-80e0-4ae9ea81d250	4	4	4	4	2026-02-01 03:49:19.504579	https://eservices.himachaltourism.gov.in/
a02fbe70-13d4-45b4-88e9-91f8f75cf124	4	4	4	4	2026-02-01 04:02:48.780322	https://eservices.himachaltourism.gov.in/
1a9f6472-c8e6-4242-97b2-75f92122b926	4	4	4	4	2026-02-01 05:56:21.833026	https://eservices.himachaltourism.gov.in/
79413816-12d0-4413-a9a6-4d1185da4379	4	4	4	4	2026-02-01 06:32:57.336411	https://eservices.himachaltourism.gov.in/
cdfc0f80-e3fc-469f-90aa-5beb0bfeb7b4	4	4	4	4	2026-02-01 06:42:00.719356	https://eservices.himachaltourism.gov.in/
3f6efd4f-f658-4476-94fd-a69825eb8de6	4	4	4	4	2026-02-01 06:45:43.365502	https://eservices.himachaltourism.gov.in/
3e4c7c4a-5128-4e49-99ef-95bb77754e97	4	4	4	4	2026-02-01 06:57:16.673382	https://eservices.himachaltourism.gov.in/
cb7f720d-85dd-4d56-81ff-5b2435791631	4	4	4	4	2026-02-01 07:07:45.11303	https://eservices.himachaltourism.gov.in/
f1234ae8-fb3e-4cf4-9b94-b4aa4bbda98c	4	4	4	4	2026-02-01 07:11:04.523855	https://eservices.himachaltourism.gov.in/
acceeb56-a412-41aa-9ade-70194f135914	4	4	4	4	2026-02-01 07:26:07.614326	https://eservices.himachaltourism.gov.in/
a00fe50c-320c-443c-ab85-41c8d44ed7eb	4	4	4	4	2026-02-01 07:34:06.265969	https://eservices.himachaltourism.gov.in/
5beb8ff2-d0a6-41f2-8723-c23e7a08e4c4	4	4	4	4	2026-02-01 07:37:47.681758	https://eservices.himachaltourism.gov.in/
b05ee421-d858-47a1-a36a-64ce1a4ad5f5	4	4	4	4	2026-02-01 07:44:09.238792	https://eservices.himachaltourism.gov.in/
549f3488-bc50-4bee-9140-69eddc168589	4	4	4	4	2026-02-01 08:44:09.113839	https://eservices.himachaltourism.gov.in/
c8d8b5dc-ff8d-443d-9c51-bf550f2c112e	4	4	4	4	2026-02-01 09:44:09.123531	https://eservices.himachaltourism.gov.in/
062103fa-8cac-4957-99d5-b4b53953dfe8	4	4	4	4	2026-02-01 10:31:16.045999	https://eservices.himachaltourism.gov.in/
4766c8e5-4540-456b-b21f-fe72c6b2c990	4	4	4	4	2026-02-01 10:37:01.829925	https://eservices.himachaltourism.gov.in/
6c3b91b8-5ace-49c8-94b9-ae8893027707	4	4	4	4	2026-02-01 11:37:01.901324	https://eservices.himachaltourism.gov.in/
602ac4f8-081e-47dd-9686-c57f223565b9	4	4	4	4	2026-02-01 12:37:01.856818	https://eservices.himachaltourism.gov.in/
c6142928-16e2-429f-b513-82cba52ad1bf	4	4	4	4	2026-02-01 12:44:10.84879	https://eservices.himachaltourism.gov.in/
90e79388-866c-4e46-bc11-1a021799a215	4	4	4	4	2026-02-01 13:09:46.294044	https://eservices.himachaltourism.gov.in/
b7b34c1c-ae80-48c3-8675-c1db89dd1ccf	4	4	4	4	2026-02-01 13:09:53.580941	https://eservices.himachaltourism.gov.in/
1cc7f95e-12cf-4b1d-b187-ce5ff6e53bce	4	4	4	4	2026-02-01 13:20:30.304778	https://eservices.himachaltourism.gov.in/
83316668-4525-407e-9b6d-1bb40e604744	4	4	4	4	2026-02-01 13:23:15.673164	https://eservices.himachaltourism.gov.in/
9f478a00-dc4d-45cc-ae2c-a0fae05bd4fd	4	4	4	4	2026-02-01 13:29:37.792268	https://eservices.himachaltourism.gov.in/
71639c8d-f1b0-47fa-8af3-2f9371395378	4	4	4	4	2026-02-01 13:31:48.335377	https://eservices.himachaltourism.gov.in/
a2a7942e-652e-4142-a627-80019e38f0f3	4	4	4	4	2026-02-01 14:03:52.431752	https://eservices.himachaltourism.gov.in/
46de6937-72a8-49f0-9f83-083de9b25f9b	4	4	4	4	2026-02-01 14:50:37.280456	https://eservices.himachaltourism.gov.in/
7fa33e31-31a6-4c15-a88c-e4c286b254e8	4	4	4	4	2026-02-01 15:33:27.395604	https://eservices.himachaltourism.gov.in/
6aba1e21-6beb-465c-9c2f-12d0853cd8ec	4	4	4	4	2026-02-01 16:33:27.406106	https://eservices.himachaltourism.gov.in/
65fb0468-697c-4443-9edc-32e420ecfeb1	4	4	4	4	2026-02-01 17:33:27.429566	https://eservices.himachaltourism.gov.in/
855ff679-3cf3-4f86-8961-efd8b841af37	4	4	4	4	2026-02-01 17:35:16.281341	https://eservices.himachaltourism.gov.in/
2d55193f-0abc-46c7-8e6a-7a52cb1d867e	4	4	4	4	2026-02-01 17:42:09.613526	https://eservices.himachaltourism.gov.in/
03622322-1517-4bac-b418-ff4485ac3834	4	4	4	4	2026-02-01 18:09:37.366969	https://eservices.himachaltourism.gov.in/
1e500f28-62ff-491a-a180-752aced5f46f	4	4	4	4	2026-02-01 19:09:37.333961	https://eservices.himachaltourism.gov.in/
24291227-14a8-4ea5-825e-72dfc4d4a148	4	4	4	4	2026-02-01 19:37:37.45328	https://eservices.himachaltourism.gov.in/
71ddc1d4-dd4f-4109-a9f7-5580ef11debe	4	4	4	4	2026-02-01 20:09:37.3618	https://eservices.himachaltourism.gov.in/
49e8c73c-83db-4f67-bcd3-6d253751e28c	4	4	4	4	2026-02-01 20:37:37.441904	https://eservices.himachaltourism.gov.in/
b40f1bfd-a2c1-4963-8569-c6ddeaa0b6cd	4	4	4	4	2026-02-01 21:09:37.395649	https://eservices.himachaltourism.gov.in/
90fb78f1-ba54-485b-bcc2-dafa7c4646dc	4	4	4	4	2026-02-01 21:37:37.562399	https://eservices.himachaltourism.gov.in/
e2ece8fd-305b-4d84-bf61-1b4a4b290b93	4	4	4	4	2026-02-01 22:09:37.312057	https://eservices.himachaltourism.gov.in/
f2ea13e5-d51b-4337-a5c3-f4896d471287	4	4	4	4	2026-02-01 22:37:37.473337	https://eservices.himachaltourism.gov.in/
d9c4158f-aa81-4a9a-a1cd-29dc6c764234	4	4	4	4	2026-02-01 23:09:37.392679	https://eservices.himachaltourism.gov.in/
895a51cd-4997-48dc-b040-134f6efbc8a3	4	4	4	4	2026-02-01 23:37:37.488913	https://eservices.himachaltourism.gov.in/
928a0149-9b52-49ca-9612-29e3c87b2e73	4	4	4	4	2026-02-02 00:09:40.378308	https://eservices.himachaltourism.gov.in/
5b39057e-01ac-43ca-9c53-02c2f0f62849	4	4	4	4	2026-02-02 00:37:37.555841	https://eservices.himachaltourism.gov.in/
e2d37924-f30e-4098-8fc1-b9ee6208a5bd	4	4	4	4	2026-02-02 01:09:37.343133	https://eservices.himachaltourism.gov.in/
73c9d0da-0ed6-47d7-ad4b-1626a3de884e	4	4	4	4	2026-02-02 01:37:37.469053	https://eservices.himachaltourism.gov.in/
7428a980-ee42-4635-bd96-9c002e751f60	4	4	4	4	2026-02-02 02:09:37.331649	https://eservices.himachaltourism.gov.in/
15a8a088-a23d-43f0-9727-b8a71f150639	4	4	4	4	2026-02-02 02:37:37.43301	https://eservices.himachaltourism.gov.in/
82188548-642d-462e-8323-f6078c108130	4	4	4	4	2026-02-02 03:09:37.348482	https://eservices.himachaltourism.gov.in/
4c49db1b-779d-4c60-b018-5a97c4e60d8c	4	4	4	4	2026-02-02 03:37:37.471855	https://eservices.himachaltourism.gov.in/
0a9f36c6-981e-49eb-876b-9709d92c1c01	4	4	4	4	2026-02-02 04:09:37.342364	https://eservices.himachaltourism.gov.in/
1a22a2dd-ae9f-40ec-b654-9021ac6b0595	4	4	4	4	2026-02-02 04:37:37.476346	https://eservices.himachaltourism.gov.in/
5740de91-5bc3-4f31-928d-4e084668ff84	4	4	4	4	2026-02-02 05:09:37.36889	https://eservices.himachaltourism.gov.in/
42233182-695a-4d76-a75e-cfbcaa4d01dd	4	4	4	4	2026-02-02 05:37:37.502768	https://eservices.himachaltourism.gov.in/
ec279aea-8dc5-4af8-a70c-84e35e0c3607	4	4	4	4	2026-02-02 06:09:37.311857	https://eservices.himachaltourism.gov.in/
cd6c16db-3d47-49af-b8ed-ba043912ff1e	4	4	4	4	2026-02-02 06:37:37.498011	https://eservices.himachaltourism.gov.in/
c9047133-2418-4127-a56e-bace6e3e0184	4	4	4	4	2026-02-02 07:09:37.298195	https://eservices.himachaltourism.gov.in/
ec848abb-b4d2-48db-a60f-03af32a4a99f	4	4	4	4	2026-02-02 07:37:37.530892	https://eservices.himachaltourism.gov.in/
c27dc720-a8ee-4944-bff7-15c6371692bc	4	4	4	4	2026-02-02 08:09:37.411059	https://eservices.himachaltourism.gov.in/
5625b294-ec8e-488c-914f-e0528f14440b	4	4	4	4	2026-02-02 08:37:37.49341	https://eservices.himachaltourism.gov.in/
0b8ee309-70b2-48c3-a176-ea7b5e94a07d	4	4	4	4	2026-02-02 09:09:37.322513	https://eservices.himachaltourism.gov.in/
1f2b84d4-a9dc-4492-bba1-60dcdd788893	4	4	4	4	2026-02-02 09:37:38.037936	https://eservices.himachaltourism.gov.in/
eddcb0d8-d01d-40b1-840c-fb1402732434	4	4	4	4	2026-02-02 10:09:43.788384	https://eservices.himachaltourism.gov.in/
7a302ae9-8d81-4a17-9ac4-169f1c527bba	4	4	4	4	2026-02-02 10:37:37.540978	https://eservices.himachaltourism.gov.in/
ec6b4d76-38ab-4fce-b3e7-137525ddc672	4	4	4	4	2026-02-02 11:09:37.426556	https://eservices.himachaltourism.gov.in/
d93b348b-aac4-4d75-81f3-d671cdc3f810	4	4	4	4	2026-02-02 11:37:37.492001	https://eservices.himachaltourism.gov.in/
a7f9e886-8589-4c90-b39c-47f6d00763d7	4	4	4	4	2026-02-02 12:09:37.328727	https://eservices.himachaltourism.gov.in/
a8925e6e-e64c-4789-8d11-66ec39114777	4	4	4	4	2026-02-02 12:37:37.496351	https://eservices.himachaltourism.gov.in/
b0263f55-c437-4331-bf52-32c91cce5cc3	4	4	4	4	2026-02-02 13:09:37.386859	https://eservices.himachaltourism.gov.in/
129a97eb-b8c8-4922-a239-fc7f3c1fb81a	4	4	4	4	2026-02-02 13:37:40.540905	https://eservices.himachaltourism.gov.in/
83c71276-e7fb-49d9-9bc4-dae818c2cad6	4	4	4	4	2026-02-02 14:09:37.335417	https://eservices.himachaltourism.gov.in/
ec0322a2-44a9-4678-ac9e-a46b4b082d03	4	4	4	4	2026-02-02 14:37:37.512469	https://eservices.himachaltourism.gov.in/
088869d8-3777-4baa-bfe4-5d161254b3ab	4	4	4	4	2026-02-02 15:09:37.433795	https://eservices.himachaltourism.gov.in/
995925c2-f596-4d02-8b22-dcadbafbee62	4	4	4	4	2026-02-02 15:37:37.585363	https://eservices.himachaltourism.gov.in/
31cf64d4-a2b0-467c-8b52-d3aa5a2978d5	4	4	4	4	2026-02-02 16:09:37.368964	https://eservices.himachaltourism.gov.in/
d923e5b5-41e6-4236-85cb-46c178ee8aad	4	4	4	4	2026-02-02 16:37:37.507267	https://eservices.himachaltourism.gov.in/
17fff650-6229-4683-ae63-1eee28a4b750	4	4	4	4	2026-02-02 17:09:37.327902	https://eservices.himachaltourism.gov.in/
f980ef80-68af-4871-a797-639696aba6c4	4	4	4	4	2026-02-02 17:37:37.490467	https://eservices.himachaltourism.gov.in/
2c8b2d0d-6263-4845-bbb9-4c410bf99e81	4	4	4	4	2026-02-02 18:09:40.380062	https://eservices.himachaltourism.gov.in/
6290b255-ae80-4816-bf50-12eba4cbe166	4	4	4	4	2026-02-02 18:37:37.49348	https://eservices.himachaltourism.gov.in/
de43ad5b-6992-4d6b-9152-b5e071464afe	4	4	4	4	2026-02-02 19:09:37.386789	https://eservices.himachaltourism.gov.in/
ad616dc1-a67f-4af6-9572-06238b2f2c49	4	4	4	4	2026-02-02 19:37:37.491876	https://eservices.himachaltourism.gov.in/
d43fd4d9-a90d-445d-a7f6-f254ccd8ee0b	4	4	4	4	2026-02-02 20:09:37.394665	https://eservices.himachaltourism.gov.in/
1b340786-af4c-4543-b30e-dc09881c15c4	4	4	4	4	2026-02-02 20:37:37.492959	https://eservices.himachaltourism.gov.in/
262b5639-e7f2-49d7-aa31-a450f7e9faf5	4	4	4	4	2026-02-02 21:09:37.417214	https://eservices.himachaltourism.gov.in/
67e53a19-ee3c-4412-ba0a-71155acc0ab9	4	4	4	4	2026-02-02 21:37:37.513348	https://eservices.himachaltourism.gov.in/
b7704785-098f-4f2d-abcd-55edc833024a	4	4	4	4	2026-02-02 22:09:37.377678	https://eservices.himachaltourism.gov.in/
074097e7-9b47-4f65-bcca-54d64b6c45c4	4	4	4	4	2026-02-02 22:37:37.506159	https://eservices.himachaltourism.gov.in/
7590a85f-878b-40c3-81fe-421f8fca133c	4	4	4	4	2026-02-02 23:09:37.385358	https://eservices.himachaltourism.gov.in/
3de511c8-cbac-4ca5-9342-1b137fb0d223	4	4	4	4	2026-02-02 23:37:37.504675	https://eservices.himachaltourism.gov.in/
772100c4-1532-4fe8-8fc7-aa2b5d23ecbb	4	4	4	4	2026-02-03 00:09:37.388891	https://eservices.himachaltourism.gov.in/
6fc07058-e37a-4c9a-bf18-03a1cd84309e	4	4	4	4	2026-02-03 00:37:37.543954	https://eservices.himachaltourism.gov.in/
c6577892-9cda-43e0-b22a-ada14c42496f	4	4	4	4	2026-02-03 01:09:37.328873	https://eservices.himachaltourism.gov.in/
ebd6988e-3c78-4f7b-86f8-d892cd60eb68	4	4	4	4	2026-02-03 01:37:37.512858	https://eservices.himachaltourism.gov.in/
76cedc6a-4ccb-457c-9769-effe150b213f	4	4	4	4	2026-02-03 02:09:37.37738	https://eservices.himachaltourism.gov.in/
275dd558-a3ad-4f9c-b85d-2891d661e33f	4	4	4	4	2026-02-03 02:37:37.54952	https://eservices.himachaltourism.gov.in/
c3be7f70-e1ec-48d1-9346-eefb96e3b144	4	4	4	4	2026-02-03 03:09:37.495863	https://eservices.himachaltourism.gov.in/
716ff34c-c7ac-46f7-827a-3fc46d1bc1af	4	4	4	4	2026-02-03 03:37:37.505291	https://eservices.himachaltourism.gov.in/
ffbac07d-c391-4f83-970f-88eb60523332	4	4	4	4	2026-02-03 04:09:37.468675	https://eservices.himachaltourism.gov.in/
b372763f-67ba-495d-af0b-08307a31b29b	4	4	4	4	2026-02-03 04:37:37.526572	https://eservices.himachaltourism.gov.in/
40c1c57f-b116-427f-848b-f485bead7ced	4	4	4	4	2026-02-03 05:09:37.392969	https://eservices.himachaltourism.gov.in/
036e971e-7866-4689-a0fe-6eb8cdd0e588	4	4	4	4	2026-02-03 05:37:37.563375	https://eservices.himachaltourism.gov.in/
0d198a03-d224-494c-bcc6-7afd3f4e0241	4	4	4	4	2026-02-03 06:09:37.409536	https://eservices.himachaltourism.gov.in/
ecbb74cc-9afc-4c49-821c-50667381e2ba	4	4	4	4	2026-02-03 06:37:37.499375	https://eservices.himachaltourism.gov.in/
f81a055c-37db-4b15-8a8d-81d88a55ef65	4	4	4	4	2026-02-03 07:09:37.450421	https://eservices.himachaltourism.gov.in/
eb3b9272-bf1f-415d-85a6-36f043b3fb10	4	4	4	4	2026-02-03 07:37:37.534002	https://eservices.himachaltourism.gov.in/
afd37257-00fb-4205-8401-1b4d151c1c4a	4	4	4	4	2026-02-03 08:09:37.436857	https://eservices.himachaltourism.gov.in/
bd179e7b-b362-4237-9420-7ebfc0adf1b1	4	4	4	4	2026-02-03 08:37:37.649774	https://eservices.himachaltourism.gov.in/
ee041e40-eab0-4ac4-a1c3-aa8185cec009	4	4	4	4	2026-02-03 09:09:37.41276	https://eservices.himachaltourism.gov.in/
5e23f7b8-c7a8-4add-8a82-86bd19c26aa1	4	4	4	4	2026-02-03 09:12:26.825301	https://eservices.himachaltourism.gov.in/
260b946e-91c7-41b8-b702-1dd3f6a774de	4	4	4	4	2026-02-03 09:27:32.74658	https://eservices.himachaltourism.gov.in/
ccd3a316-64ff-4554-b876-0739aa3e4989	4	4	4	4	2026-02-03 09:28:35.687167	https://eservices.himachaltourism.gov.in/
c0bba7fa-69fd-40b0-9d25-1a5c1e053b90	4	4	4	4	2026-02-03 09:37:37.532037	https://eservices.himachaltourism.gov.in/
5d67f349-7fae-42e3-bd33-92313020a4ac	4	4	4	4	2026-02-03 10:02:27.079081	https://eservices.himachaltourism.gov.in/
42d57ebb-d314-43af-897f-9abbd27954c0	4	4	4	4	2026-02-03 10:03:10.057552	https://eservices.himachaltourism.gov.in/
93241a0e-f09e-447d-9935-b82a7ea74515	4	4	4	4	2026-02-03 10:12:25.201571	https://eservices.himachaltourism.gov.in/
65651d34-be92-48c6-8a87-cc59c3a71574	4	4	4	4	2026-02-03 10:37:37.495663	https://eservices.himachaltourism.gov.in/
785b9219-2f2d-4b2b-b323-f692b5acb9e2	4	4	4	4	2026-02-03 11:12:25.183792	https://eservices.himachaltourism.gov.in/
333218a6-62fa-419d-9178-8aa128b246c2	4	4	4	4	2026-02-03 11:37:37.502759	https://eservices.himachaltourism.gov.in/
56319aca-14f8-4283-83a8-5eec366fa097	4	4	4	4	2026-02-03 12:12:25.225232	https://eservices.himachaltourism.gov.in/
967442ea-5c89-4e4b-b3ba-8c76d2cdb807	4	4	4	4	2026-02-03 12:37:37.55399	https://eservices.himachaltourism.gov.in/
13a0551c-d509-47cb-8519-329295519713	4	4	4	4	2026-02-03 13:12:25.165132	https://eservices.himachaltourism.gov.in/
73c512d5-888d-4332-ac75-13e43d15fcfb	4	4	4	4	2026-02-03 13:37:37.499626	https://eservices.himachaltourism.gov.in/
b0b93c5a-a393-43ba-8542-8c2552a2654a	4	4	4	4	2026-02-03 14:12:25.173531	https://eservices.himachaltourism.gov.in/
f81df715-810f-4759-9986-3c4ee78a0d67	4	4	4	4	2026-02-03 14:37:37.560932	https://eservices.himachaltourism.gov.in/
a7d7dce8-7e00-4330-8494-17c62493e4c7	4	4	4	4	2026-02-03 15:12:25.20208	https://eservices.himachaltourism.gov.in/
799a9bb2-947a-4244-ac6a-33bdfd346977	4	4	4	4	2026-02-03 15:37:37.535272	https://eservices.himachaltourism.gov.in/
df7214f5-4546-486d-8aac-36cda6289d41	4	4	4	4	2026-02-03 16:12:25.159644	https://eservices.himachaltourism.gov.in/
f9a31924-7be9-4b4d-a691-51b64c1a6538	4	4	4	4	2026-02-03 16:37:37.644411	https://eservices.himachaltourism.gov.in/
94441eec-56e9-4e2e-893e-ce96f11dc0b0	4	4	4	4	2026-02-03 17:12:25.168034	https://eservices.himachaltourism.gov.in/
cfa68525-d331-404d-9752-4646647565b5	4	4	4	4	2026-02-03 17:37:37.503698	https://eservices.himachaltourism.gov.in/
29c74d63-7d2b-4dca-9a41-e39d1ff84e50	4	4	4	4	2026-02-03 18:04:32.136621	https://eservices.himachaltourism.gov.in/
c02195c7-c78c-49f1-add6-13564f18b32e	4	4	4	4	2026-02-03 18:04:56.53429	https://eservices.himachaltourism.gov.in/
4db3f869-93fa-45d9-bc4a-8004a6cd0d1c	4	4	4	4	2026-02-03 18:04:59.538897	https://eservices.himachaltourism.gov.in/
0c00ddbb-23ef-43c8-a6cf-ab345a9295e0	4	4	4	4	2026-02-03 18:37:37.454446	https://eservices.himachaltourism.gov.in/
6d382bd1-3a6f-402a-b19f-4f3a5e651998	4	4	4	4	2026-02-03 19:04:56.531171	https://eservices.himachaltourism.gov.in/
668db9ef-4b9f-470e-9617-a423c76c9190	4	4	4	4	2026-02-03 19:37:37.558866	https://eservices.himachaltourism.gov.in/
afb1d05b-9159-4340-b4cb-748fa4109b66	4	4	4	4	2026-02-03 20:04:56.479549	https://eservices.himachaltourism.gov.in/
1caabafd-1494-4080-9c72-4cf56f7017b8	4	4	4	4	2026-02-03 20:37:37.564322	https://eservices.himachaltourism.gov.in/
96286269-2446-4949-9dfc-e87736602541	4	4	4	4	2026-02-03 21:04:56.510931	https://eservices.himachaltourism.gov.in/
2262c222-1aa2-43ef-89c8-64b0e64831ac	4	4	4	4	2026-02-03 21:07:16.081853	https://eservices.himachaltourism.gov.in/
7ce33860-93df-4cf9-96b2-27a24a112f0c	4	4	4	4	2026-02-03 21:07:18.835936	https://eservices.himachaltourism.gov.in/
0ba0a399-e661-4216-897b-c0d826734777	4	4	4	4	2026-02-03 21:37:37.590396	https://eservices.himachaltourism.gov.in/
c11faf30-37c0-40f1-9cb8-a08b7855bd74	4	4	4	4	2026-02-03 22:07:16.128923	https://eservices.himachaltourism.gov.in/
91451aee-018e-4d00-b1a8-cc7ffb6d862b	4	4	4	4	2026-02-03 22:07:18.125579	https://eservices.himachaltourism.gov.in/
0b526b65-a0ca-4b33-9599-b4ea05e52658	4	4	4	4	2026-02-03 22:37:37.61965	https://eservices.himachaltourism.gov.in/
3b1ff201-6962-4c6f-826a-9924e7b942e3	4	4	4	4	2026-02-03 23:07:16.12167	https://eservices.himachaltourism.gov.in/
64ae7192-3f7a-4f1b-9f9e-a7b65ff9d301	4	4	4	4	2026-02-03 23:07:18.119895	https://eservices.himachaltourism.gov.in/
ed950fea-8cdc-44b3-8a79-e52f0aec8d38	4	4	4	4	2026-02-03 23:37:37.564651	https://eservices.himachaltourism.gov.in/
af48d4d5-95cf-4ed6-ba46-2b43c72649aa	4	4	4	4	2026-02-04 00:07:16.026249	https://eservices.himachaltourism.gov.in/
724980f9-cf37-4e51-8819-62a736cd0b89	4	4	4	4	2026-02-04 00:07:18.145048	https://eservices.himachaltourism.gov.in/
d786515f-a750-41f7-b5e3-b00b9f344ea1	4	4	4	4	2026-02-04 00:37:37.483291	https://eservices.himachaltourism.gov.in/
5bdb3f40-d87f-4ed3-84d5-b3dc1b08163b	4	4	4	4	2026-02-04 01:07:16.056522	https://eservices.himachaltourism.gov.in/
dc0a7c33-27c8-47d4-bd83-0de4a2a4e2f4	4	4	4	4	2026-02-04 01:37:37.555203	https://eservices.himachaltourism.gov.in/
a90f81e3-0cf9-4d9c-a8de-4c95fe75c744	4	4	4	4	2026-02-04 02:07:16.053845	https://eservices.himachaltourism.gov.in/
fd98c106-6d9f-4eed-98c1-b6d5ed221426	4	4	4	4	2026-02-04 02:37:37.542222	https://eservices.himachaltourism.gov.in/
33792ea3-7f59-4a81-a3eb-88a6d425185f	4	4	4	4	2026-02-04 03:07:16.052038	https://eservices.himachaltourism.gov.in/
de72b4c4-24d8-4547-9be6-2ee555d0588f	4	4	4	4	2026-02-04 03:29:55.880075	https://eservices.himachaltourism.gov.in/
74c88abd-b41c-4fa1-955e-17614cd05bc2	4	4	4	4	2026-02-04 03:30:12.142164	https://eservices.himachaltourism.gov.in/
da7808a8-6ebc-4ec4-98de-f8c08c1cf614	4	4	4	4	2026-02-04 03:32:13.30644	https://eservices.himachaltourism.gov.in/
a4317404-b328-40a2-9fd4-b70e11abe842	4	4	4	4	2026-02-04 03:37:37.511311	https://eservices.himachaltourism.gov.in/
59569bde-c1a4-43bb-b5b8-ce62a0695fc1	4	4	4	4	2026-02-04 03:41:06.669891	https://eservices.himachaltourism.gov.in/
b49cce9b-1a68-4dcc-b281-6772841911e0	4	4	4	4	2026-02-04 03:53:31.921774	https://eservices.himachaltourism.gov.in/
e40bb11d-9b56-4129-b331-46a59dd37a55	4	4	4	4	2026-02-04 04:08:34.867538	https://eservices.himachaltourism.gov.in/
b89c31eb-07e6-4242-9a79-30ab1537cbcd	4	4	4	4	2026-02-04 04:17:31.947718	https://eservices.himachaltourism.gov.in/
68b6132d-74a8-4812-9f73-7d86b37c3729	4	4	4	4	2026-02-04 04:37:37.499306	https://eservices.himachaltourism.gov.in/
be6f3363-8b14-452f-acc6-1eb2b4a2b241	4	4	4	4	2026-02-04 04:53:31.925764	https://eservices.himachaltourism.gov.in/
3f2cf64d-9078-47c5-8dd2-e32d1512c607	4	4	4	4	2026-02-04 05:37:37.480151	https://eservices.himachaltourism.gov.in/
12dbdb6a-1592-4296-8488-876f55f6bc9e	4	4	4	4	2026-02-04 05:53:31.847478	https://eservices.himachaltourism.gov.in/
44e790d5-a088-4288-97bc-79e5e1553362	4	4	4	4	2026-02-04 06:37:37.541089	https://eservices.himachaltourism.gov.in/
8a098597-6fc6-4cf5-99ba-a97c90dcb51d	4	4	4	4	2026-02-04 07:28:46.909843	https://eservices.himachaltourism.gov.in/
be8c4ab2-5afb-4791-8474-48a52663e07a	4	4	4	4	2026-02-04 07:39:56.195737	https://eservices.himachaltourism.gov.in/
bed41815-b691-4054-9b1f-3800e4ac1830	4	4	4	4	2026-02-04 07:43:44.057074	https://eservices.himachaltourism.gov.in/
3f230d8f-2752-46a3-b834-5ec650c8c67c	4	4	4	4	2026-02-04 07:48:49.980918	https://eservices.himachaltourism.gov.in/
454f04ce-bc5d-428e-a6f9-5c95a525cb85	4	4	4	4	2026-02-04 07:58:56.341262	https://eservices.himachaltourism.gov.in/
eae9d570-ca5f-4bd9-a0df-37a6e5ba2afa	4	4	4	4	2026-02-04 08:00:35.007284	https://eservices.himachaltourism.gov.in/
01280cb4-e6fe-4943-9b15-0a046ae0cbc8	4	4	4	4	2026-02-04 08:24:39.463451	https://eservices.himachaltourism.gov.in/
46ab6cc2-4407-4e70-bf21-87663bd6b323	4	4	4	4	2026-02-04 08:35:07.291515	https://eservices.himachaltourism.gov.in/
633625b9-343c-4355-8dfc-efbebd146f59	4	4	4	4	2026-02-04 08:58:56.273462	https://eservices.himachaltourism.gov.in/
ff77e68a-af03-43a4-94ce-3346a9d0689e	4	4	4	4	2026-02-04 09:35:07.26302	https://eservices.himachaltourism.gov.in/
5e6b136a-fcf0-49a6-b784-9a8f98a323b2	4	4	4	4	2026-02-04 09:58:56.209055	https://eservices.himachaltourism.gov.in/
754bc8d1-f1ef-42a3-8eff-12372e832f32	4	4	4	4	2026-02-04 10:35:07.328813	https://eservices.himachaltourism.gov.in/
5879173f-b1e3-4abd-9561-a71a30b5b2d4	4	4	4	4	2026-02-04 10:58:56.24586	https://eservices.himachaltourism.gov.in/
d66d73ff-fe12-4cab-baf0-5304b78abc1c	4	4	4	4	2026-02-04 11:35:48.231221	https://eservices.himachaltourism.gov.in/
ddb1ccbb-84ef-4f7e-8905-515516d8e6e5	4	4	4	4	2026-02-04 11:58:56.241109	https://eservices.himachaltourism.gov.in/
6843e70f-baf4-4c33-9d47-75d1055a1a1c	4	4	4	4	2026-02-04 12:35:07.301285	https://eservices.himachaltourism.gov.in/
c8ea7ff4-b5d4-4db4-8759-dbbf2e10ee54	4	4	4	4	2026-02-04 12:58:56.254258	https://eservices.himachaltourism.gov.in/
20a789e6-7f51-4211-86f9-d034b5f09479	4	4	4	4	2026-02-04 13:35:07.250801	https://eservices.himachaltourism.gov.in/
0b230940-ff19-43e2-84de-32464b82f245	4	4	4	4	2026-02-04 13:58:56.295212	https://eservices.himachaltourism.gov.in/
83176197-5cca-4473-8097-5ffa3db31f9c	4	4	4	4	2026-02-04 14:35:07.32056	https://eservices.himachaltourism.gov.in/
34d7e0e2-f4cd-4287-a771-c3e3941d09c5	4	4	4	4	2026-02-04 14:58:56.243281	https://eservices.himachaltourism.gov.in/
87d7141d-6736-46e6-805e-423e921730be	4	4	4	4	2026-02-04 15:35:07.324628	https://eservices.himachaltourism.gov.in/
c592d551-c196-4145-b361-75121cfd5561	4	4	4	4	2026-02-04 15:58:56.258035	https://eservices.himachaltourism.gov.in/
5b569bf8-7ba5-4033-b66f-0e7286d0bc90	4	4	4	4	2026-02-04 16:35:07.302212	https://eservices.himachaltourism.gov.in/
c87e7a92-4145-45ad-a209-18d419b995e8	4	4	4	4	2026-02-04 16:58:56.250718	https://eservices.himachaltourism.gov.in/
01d33c28-05dc-454d-ab1a-3026066b8c6c	4	4	4	4	2026-02-04 17:35:07.27432	https://eservices.himachaltourism.gov.in/
9ea83313-f936-44c8-8d28-60f99598aeb6	4	4	4	4	2026-02-04 17:58:56.269566	https://eservices.himachaltourism.gov.in/
4a3b3a55-c150-49df-ad0a-9fc73bd7f741	4	4	4	4	2026-02-04 18:35:07.301643	https://eservices.himachaltourism.gov.in/
38df8eff-1f3f-432a-9127-17923986d949	4	4	4	4	2026-02-04 18:58:56.293015	https://eservices.himachaltourism.gov.in/
21a09d26-782c-4684-8130-942c468fddeb	4	4	4	4	2026-02-04 19:35:07.282828	https://eservices.himachaltourism.gov.in/
0bc3415f-0e0b-4c66-847f-45b2e4dfbddd	4	4	4	4	2026-02-04 19:58:56.237614	https://eservices.himachaltourism.gov.in/
5dd61e22-61ff-424b-bfec-25e6c556d957	4	4	4	4	2026-02-04 20:35:07.321456	https://eservices.himachaltourism.gov.in/
ad870727-d17c-417e-8fe4-a7bf72dcc4c4	4	4	4	4	2026-02-04 20:58:56.306418	https://eservices.himachaltourism.gov.in/
310401dc-cd34-4fb0-a539-ed6a475d1462	4	4	4	4	2026-02-04 21:35:07.300802	https://eservices.himachaltourism.gov.in/
267a2795-1663-482e-9f75-cb2d2987bf5d	4	4	4	4	2026-02-04 21:58:56.26246	https://eservices.himachaltourism.gov.in/
42508817-1e12-4a9f-8674-fa0741c6e17b	4	4	4	4	2026-02-04 22:35:07.293963	https://eservices.himachaltourism.gov.in/
d6868651-eb12-4e6c-9648-3eb2bf277733	4	4	4	4	2026-02-04 22:58:56.285385	https://eservices.himachaltourism.gov.in/
3470d617-1ff5-4279-8ba6-c27cb49dc0d8	4	4	4	4	2026-02-04 23:35:07.276287	https://eservices.himachaltourism.gov.in/
9e548f26-38c6-4f5d-b986-075892c90c9a	4	4	4	4	2026-02-04 23:58:56.268624	https://eservices.himachaltourism.gov.in/
96d4912d-77af-4fae-8ed6-818016b22a68	4	4	4	4	2026-02-05 00:35:07.275929	https://eservices.himachaltourism.gov.in/
8c352aad-ec06-46f1-afd6-fb207cfb12ff	4	4	4	4	2026-02-05 00:58:56.294012	https://eservices.himachaltourism.gov.in/
e02cb5c7-cac1-4d07-8eb5-8405dbe9a214	4	4	4	4	2026-02-05 01:35:07.291517	https://eservices.himachaltourism.gov.in/
ae97f266-2452-4481-b0ac-9c60051d9ce5	4	4	4	4	2026-02-05 01:58:56.293691	https://eservices.himachaltourism.gov.in/
2ce438ae-ae94-4d7f-b2c0-b5052ea80d07	4	4	4	4	2026-02-05 02:35:07.293198	https://eservices.himachaltourism.gov.in/
243fa101-2907-416e-9ad9-bb620b3d2059	4	4	4	4	2026-02-05 02:58:56.26741	https://eservices.himachaltourism.gov.in/
0147ec10-c999-49b5-b08c-a38911cbdeac	4	4	4	4	2026-02-05 03:35:07.307176	https://eservices.himachaltourism.gov.in/
857a38e6-b423-415c-b9c6-b77399bb3306	4	4	4	4	2026-02-05 03:58:56.274855	https://eservices.himachaltourism.gov.in/
6f340c47-1d56-4a54-8314-e707d5614d8d	4	4	4	4	2026-02-05 04:35:07.321209	https://eservices.himachaltourism.gov.in/
9db89b22-7f95-432f-8354-549817e2d510	4	4	4	4	2026-02-05 04:58:56.26162	https://eservices.himachaltourism.gov.in/
7e28dea7-d2df-4398-8cb8-c12200136b2f	4	4	4	4	2026-02-05 05:35:08.317762	https://eservices.himachaltourism.gov.in/
f38f89a9-e1bf-4f61-a5b6-e4b423eb4363	4	4	4	4	2026-02-05 05:58:56.26884	https://eservices.himachaltourism.gov.in/
38b8ce4d-0759-48e8-919f-9e4866de8a56	4	4	4	4	2026-02-05 06:35:07.264109	https://eservices.himachaltourism.gov.in/
683045bd-cd09-4aac-9762-c408aeb51483	4	4	4	4	2026-02-05 06:58:56.250579	https://eservices.himachaltourism.gov.in/
e9aaf966-b797-43c4-bf68-1e11fa4f68b1	4	4	4	4	2026-02-05 07:35:07.266781	https://eservices.himachaltourism.gov.in/
d04797b9-8375-48cd-86c4-7aef12c5725a	4	4	4	4	2026-02-05 07:58:56.263227	https://eservices.himachaltourism.gov.in/
780cbddb-265a-4c8f-85ab-69e458fc7629	4	4	4	4	2026-02-05 08:35:07.261997	https://eservices.himachaltourism.gov.in/
f4c0ad3e-5731-49a6-9604-7c6e1339dadd	4	4	4	4	2026-02-05 08:58:56.270496	https://eservices.himachaltourism.gov.in/
63a8e991-2fbb-4004-b156-54b316110e76	4	4	4	4	2026-02-05 09:35:07.265126	https://eservices.himachaltourism.gov.in/
12bc50ad-ba69-4b38-aec4-d3052b3efcce	4	4	4	4	2026-02-05 09:58:56.342555	https://eservices.himachaltourism.gov.in/
e5cdb536-86c3-4d12-a8b7-4c3d2457f7fc	4	4	4	4	2026-02-05 10:35:07.290638	https://eservices.himachaltourism.gov.in/
fdbb7912-1cc3-4544-925c-1ec210fb8359	4	4	4	4	2026-02-05 10:58:56.340292	https://eservices.himachaltourism.gov.in/
08df6c59-4231-423c-9a42-4663262205e0	4	4	4	4	2026-02-05 11:35:07.267939	https://eservices.himachaltourism.gov.in/
e32ff620-c749-4da2-a153-64c54975870a	4	4	4	4	2026-02-05 11:58:56.297123	https://eservices.himachaltourism.gov.in/
be2346f4-ead5-444e-bf4d-7203537ceaf2	4	4	4	4	2026-02-05 12:35:07.25819	https://eservices.himachaltourism.gov.in/
7964ac04-7f72-4c93-a1ae-d0fbbbff0f61	4	4	4	4	2026-02-05 12:58:56.285571	https://eservices.himachaltourism.gov.in/
a4c6e92e-b54f-43ff-91ae-01f38a787c1a	4	4	4	4	2026-02-05 13:35:07.270832	https://eservices.himachaltourism.gov.in/
e4fa1439-64d6-4095-b896-5ec04015a483	4	4	4	4	2026-02-05 13:58:56.258776	https://eservices.himachaltourism.gov.in/
cc2b397e-d417-4581-a24a-2d325ec4c6b4	4	4	4	4	2026-02-05 14:35:07.255074	https://eservices.himachaltourism.gov.in/
3f5dcf1f-c07a-4a60-9ff2-c323b6063078	4	4	4	4	2026-02-05 14:58:56.313455	https://eservices.himachaltourism.gov.in/
5c98e8d8-9872-4f59-afd8-be6ea8ef5e35	4	4	4	4	2026-02-05 15:35:07.25739	https://eservices.himachaltourism.gov.in/
63ebebd5-09af-4933-a134-2961839fc98b	4	4	4	4	2026-02-05 15:58:56.285962	https://eservices.himachaltourism.gov.in/
681c67c7-2ff7-446b-9453-d57981963f83	4	4	4	4	2026-02-05 16:35:07.267907	https://eservices.himachaltourism.gov.in/
bf58412d-6c11-4c4d-af56-0d7976fd98b5	4	4	4	4	2026-02-05 16:58:56.261863	https://eservices.himachaltourism.gov.in/
bbceaf10-9b4b-42aa-8e8e-79d4a8bdfb0d	4	4	4	4	2026-02-05 17:35:07.299165	https://eservices.himachaltourism.gov.in/
639ba4c9-440e-423a-96d7-89c49ead3f36	4	4	4	4	2026-02-05 17:58:56.254166	https://eservices.himachaltourism.gov.in/
28293dec-af65-4e7a-9012-0f9c68a1abd1	4	4	4	4	2026-02-05 18:35:07.291009	https://eservices.himachaltourism.gov.in/
191c3da7-2beb-4690-85bd-0a53d5a25972	4	4	4	4	2026-02-05 18:58:56.306973	https://eservices.himachaltourism.gov.in/
56730ec7-6f93-4424-9cdf-4eae8c4d9663	4	4	4	4	2026-02-05 19:35:07.313002	https://eservices.himachaltourism.gov.in/
841f666a-8df9-4352-84ea-8e660fd68bc5	4	4	4	4	2026-02-05 19:58:56.285386	https://eservices.himachaltourism.gov.in/
ce195578-81de-47f2-b309-b22f8219d5ff	4	4	4	4	2026-02-05 20:29:52.601876	https://eservices.himachaltourism.gov.in/
2bc46d2f-9355-4173-a642-a72a6fc4d874	4	4	4	4	2026-02-05 20:33:03.239021	https://eservices.himachaltourism.gov.in/
55f69d9a-bd1a-431c-8a7d-7225b42df92f	4	4	4	4	2026-02-05 20:49:50.632677	https://eservices.himachaltourism.gov.in/
5e567bf6-ef51-44f1-ad4f-006472494ea4	4	4	4	4	2026-02-05 20:58:14.457376	https://eservices.himachaltourism.gov.in/
6cbbef3d-642d-450c-889c-606536a72c84	4	4	4	4	2026-02-05 20:58:56.265	https://eservices.himachaltourism.gov.in/
83aec277-bfd4-4d8a-838d-960faa538a43	4	4	4	4	2026-02-05 21:07:31.572242	https://eservices.himachaltourism.gov.in/
222b1984-5f36-4ea6-92e1-78bc1719ba12	4	4	4	4	2026-02-05 21:58:56.390221	https://eservices.himachaltourism.gov.in/
3efdbeab-ead3-4f8a-a940-ab9ae21784ae	4	4	4	4	2026-02-05 22:00:55.712074	https://eservices.himachaltourism.gov.in/
6130f89e-56ea-48d1-a8ce-6aff1013339e	4	4	4	4	2026-02-05 22:07:36.489707	https://eservices.himachaltourism.gov.in/
829020b2-3b11-4452-86af-2862a85d95b4	4	4	4	4	2026-02-05 22:10:15.235501	https://eservices.himachaltourism.gov.in/
313959e6-05ba-4f8d-bdf2-0cf0eb163cd7	4	4	4	4	2026-02-05 22:13:18.255174	https://eservices.himachaltourism.gov.in/
044325cd-b36e-4bcf-98d8-efff54f09b7b	4	4	4	4	2026-02-05 22:14:43.853626	https://eservices.himachaltourism.gov.in/
c4ea84bb-55c6-441a-9d73-3757b725670c	4	4	4	4	2026-02-05 22:16:38.984502	https://eservices.himachaltourism.gov.in/
51fa5c12-347e-4404-b5d9-1b2c3835d38a	4	4	4	4	2026-02-05 22:18:16.073674	https://eservices.himachaltourism.gov.in/
48e7b6a8-21e3-46e0-946a-b2764220668a	4	4	4	4	2026-02-05 22:20:13.796968	https://eservices.himachaltourism.gov.in/
8eb8f242-681a-4e09-8043-9146d8beee6d	4	4	4	4	2026-02-05 22:23:25.229293	https://eservices.himachaltourism.gov.in/
8fdc0101-fc37-4490-b30a-310afa3959d7	4	4	4	4	2026-02-05 22:30:56.463942	https://eservices.himachaltourism.gov.in/
df748d79-d1db-42e4-8e27-6820c5d8722a	4	4	4	4	2026-02-05 22:46:46.453161	https://eservices.himachaltourism.gov.in/
f10adc9f-4085-4b4d-bb01-7a3cc8d0570e	4	4	4	4	2026-02-05 22:56:24.49385	https://eservices.himachaltourism.gov.in/
97f4500b-8269-4578-875c-c44c854de085	4	4	4	4	2026-02-05 22:58:12.224262	https://eservices.himachaltourism.gov.in/
1a793c33-c371-43e8-9617-d7285152f77f	4	4	4	4	2026-02-05 22:58:56.255398	https://eservices.himachaltourism.gov.in/
e1a55d8e-ef98-4907-b89f-406ceeb1a93a	4	4	4	4	2026-02-05 23:14:46.165651	https://eservices.himachaltourism.gov.in/
9a5aac6e-b0fa-424e-804f-2478b4869995	4	4	4	4	2026-02-05 23:25:39.874721	https://eservices.himachaltourism.gov.in/
d1e78a12-f602-4b7a-968c-5e6d2e09ae79	4	4	4	4	2026-02-05 23:30:13.019451	https://eservices.himachaltourism.gov.in/
a2c045d6-fae6-4cb9-8228-ffe8e23d342c	4	4	4	4	2026-02-05 23:45:11.064553	https://eservices.himachaltourism.gov.in/
b0676692-9222-4d14-97ab-ce96a2fc5867	4	4	4	4	2026-02-05 23:49:38.408142	https://eservices.himachaltourism.gov.in/
d8fe47ca-0879-4bed-86dc-2f7937cb3840	4	4	4	4	2026-02-05 23:53:36.419033	https://eservices.himachaltourism.gov.in/
97efd4fc-1c0d-4258-bf9c-afddb6e8c23f	4	4	4	4	2026-02-05 23:58:56.269924	https://eservices.himachaltourism.gov.in/
8d87710e-14d2-4416-bfab-fc4c0fd1985d	4	4	4	4	2026-02-06 00:33:59.705443	https://eservices.himachaltourism.gov.in/
92861425-ee0f-4e85-9c19-8ca50070d6bc	4	4	4	4	2026-02-06 00:58:56.24832	https://eservices.himachaltourism.gov.in/
f3ed0e45-9879-4aed-b94c-6507a6424951	4	4	4	4	2026-02-06 01:30:41.911755	https://eservices.himachaltourism.gov.in/
940242ad-fa5f-4c4a-926b-f799299a6c36	4	4	4	4	2026-02-06 01:58:56.348977	https://eservices.himachaltourism.gov.in/
f4f24376-6c5f-47db-a045-3d0fd6efc560	4	4	4	4	2026-02-06 02:30:41.891979	https://eservices.himachaltourism.gov.in/
bcc6d2e6-3f91-45d0-9d9e-4d647c97ef3c	4	4	4	4	2026-02-06 02:58:56.266109	https://eservices.himachaltourism.gov.in/
f63b58f8-1b0b-43d8-92d5-d6724c1860ad	4	4	4	4	2026-02-06 03:30:41.913039	https://eservices.himachaltourism.gov.in/
6690e550-e3b1-4121-b1d3-d35859352ffc	4	4	4	4	2026-02-06 03:58:56.225889	https://eservices.himachaltourism.gov.in/
70e4b42d-9d1d-4c71-ac81-52790e4cd766	4	4	4	4	2026-02-06 04:30:41.889881	https://eservices.himachaltourism.gov.in/
cf872842-0fcf-4cea-92ab-314d14f5d64e	4	4	4	4	2026-02-06 04:58:56.366035	https://eservices.himachaltourism.gov.in/
6db55140-8b67-40de-81a2-e7dfb1a7dd18	4	4	4	4	2026-02-06 05:30:41.89453	https://eservices.himachaltourism.gov.in/
ea35b93f-ac83-48ef-838f-105f2560faa4	4	4	4	4	2026-02-06 05:58:56.253445	https://eservices.himachaltourism.gov.in/
ad15847d-8278-4c6a-b8ca-aaaf01ffddd9	4	4	4	4	2026-02-06 06:30:41.936736	https://eservices.himachaltourism.gov.in/
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.reviews (id, application_id, user_id, rating, review_text, is_verified_stay, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.session (sid, sess, expire) FROM stdin;
01totXOVq-9MPeIO-Z4ghwgXT7lPtItR	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:13:29.645Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:13:30
IZmGmAeUxRZKDG_ksLObZOV2zm7jy2WR	{"cookie": {"path": "/", "secure": true, "expires": "2026-02-07T10:18:18.447Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-07 10:18:29
7GZpZmLaJMctU6zDQj4CxbGw06dL0s-Q	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-08T04:18:30.337Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "422d1de0-8342-42b3-9767-d71d3297cd57", "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-08 04:20:13
fuxVPwuc52wDbxE4jRbsEMwSEAn0b1Z7	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:45:14.545Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:45:15
Flw84gVA1UHnWFG0uj6g_--GZnU1NhQ2	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T08:45:10.659Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 08:45:11
NYhoHT2cbCqoCoePt8KWhRnAQF68ZlL7	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:29:24.553Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:29:25
D_24j8N-aHOj79CvP1VfJ7VrFQIO7ceC	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:35:34.930Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:35:35
vTcNi9hNRlIXCUEb1tQBhDAhpXP7pDhQ	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:39:57.417Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:39:58
thq-rOwfisnUixwynpRBkXm2rPyuKwP1	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:40:13.692Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:40:14
39f8lGia4IeejPgfN9jNGkvf-N_J2-UL	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-08T04:36:27.151Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-08 04:37:12
U3QehJ1OFPVLqxDRMo5EmbCgQZXn0udv	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T11:18:06.845Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:18:07
5DLKJq9R_GKHwBL5ProzQJqQb-hjBXCi	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:52:15.514Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:52:16
CJUfHQai6r_ZtpvlAQ25RYjyxB6-ehRx	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:55:49.461Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:55:50
3ZZ_GbgPKOZx_8_ep11MLbyujtfTOZgc	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:37:07.074Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:37:08
7anz1xwNyAyhjvx2Q3wcuCCkrHY3949P	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T06:36:45.520Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 06:36:46
JlaaZSLVyXtYF-pxFNVGZMHjOe4vmn9D	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T06:37:08.713Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 06:37:09
0aJ1jCme2V70U36qoyCCystEicIuteaP	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T10:07:27.359Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:35:26
WUfByEsr4QI-metx3KWVZqRx8I4mmGgP	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T11:45:54.157Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:45:55
wVFnHPM2jI3CzXfMUoPOlcI1eW3Yux0s	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T17:47:06.699Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 17:47:07
nDUC-3LSPW8ZgLuddma3GSA4pKMjv7hB	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:29:10.567Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:29:11
vMB7eayJu_jCoYM1Uv12C-pRT75SSEuQ	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:36:03.448Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:36:04
3_ZH_jfW2c0a-y6revm4c49hK42Ty44O	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:29:21.233Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:29:22
_tLT_-L2zsLcq84qaLOi6KxPYboIIY_o	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:31:05.458Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:31:06
P4x8IUXHuipn_wQJ-9Tfuichs3vhFBBJ	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:44:59.316Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:45:00
ZcvRgfiGcmuAMgvKisPPV1bQKPhs5PBL	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:49:28.885Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:49:29
Emi7CwkO-KGNETA_NTKxh0kJgGuNsXp-	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T10:08:58.443Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 10:11:04
YNapcJ_gxH8VDGLc8VDgQlC7bsONdra0	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T11:25:24.374Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:25:25
Ok5x-qojGc5lyayhcIULHWxTbd6ja4ZP	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T12:08:42.618Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 12:08:43
FKufTRfJi4KxfOOyCN8IyJ4C3MRLbMCu	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T08:46:03.629Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 08:46:04
t8QF2Cm2i6q2nAuIsrsnpdNirRvGYc9_	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:56:19.863Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:56:20
jfE3yCDy374_9CCLxtBrK_sUXv5vQazH	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:13:25.675Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:13:26
zb2JqvFDcOClICUFnBUZo9fjiX-DxObs	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:31:13.037Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:31:14
grep27lqOPkX5kbmKqt--fVnRbEYMqnf	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:31:30.687Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:31:31
DHthVCrO1WumyN0Hp6SiYZknlANkCQTY	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:20:16.193Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:20:17
-wtVWsCIzdqbziB0g76McDuBeOMwpXhs	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:13:45.876Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:13:46
gVheWLBGdrV3VkNbt_ri3GHuUsQFPde0	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-13T01:52:08.397Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "2803bd35-34f0-4751-86ae-6cc3918c7165", "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-13 01:53:05
2Wc_xvtw0b9ivhoG2Ci1e0-RSIWYFN_c	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:29:36.510Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:29:37
LW4kznjLBD7v2f0mGAtQ_OYnpMWAY394	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:35:39.282Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:35:40
KX6PhiCSCTK_iEWvZLT8kcb9gmsdQBSD	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:55:36.492Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:55:37
TQmiT7L9-hAG4R9O2RV7cdnVfZwpaDsN	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:38:57.439Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:38:58
11r3G0dpgJ0LiLiN7r17ivW0DKVtMiQr	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:47:38.001Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:47:39
M2NKa7GkI-fqMzehNt1o_i4fIUDB8RtA	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:40:00.558Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:40:01
LAtyAw1_n3EdtmAnlzLj9lYtj4XsGVYP	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:32:21.010Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:32:22
0uoom2IwQDrm1kNTpU1tfl0bpAmrmXut	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:40:19.177Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:40:20
ydlHmrtTxDPmNW4yfAepDUxpxTxZ780h	{"cookie": {"path": "/", "secure": true, "expires": "2026-02-07T02:46:10.556Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "8f8ea77b-c498-44be-ae0b-2b16205f2a81"}	2026-02-07 07:32:11
2KeIyPRHnJ_4QqiFZCVF98376H04RnS-	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:45:29.134Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:45:30
nIOzNCNMRU1XirWdK22phWri94h2ZL-5	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:49:33.652Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:49:34
GTeYVWO6E1akwz3Lx8_a9LDSDPVEJu7V	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:13:12.300Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:13:13
aVgLw5PSOcoP8n5KqtD3alpVIM_Zytqc	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:03:29.387Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:03:30
wFkrJQB5F1aRP-rrPIegD8MrTldDlrHG	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T10:14:08.248Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 10:14:09
7dD47cbzoMJSVuv8xBdbpXlZmoCT3yXg	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T11:25:27.902Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:25:28
qaThKAf90B9qRJ8ko89oB6ndFeqIYUxQ	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:14:02.751Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:14:03
ph_15idgimEMo4AorAO3h1WXcKRDERVv	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:13:31.886Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:13:32
tnuzYJWmTMPUl7AFrC6yi93O5dBdVnEk	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:31:15.073Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:31:16
C91486DiMsG8NZMP7Cf0u18KxzHG6TEn	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T08:49:28.701Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 08:49:29
eTF5Tu0J0YzwwG-x4C_bAxPBWpiqjMYs	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:14:41.000Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:14:41
XxbEKuUurBAgwK6-tkpXxixIlxWpMsPi	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T08:50:25.500Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 08:50:26
aLl8Cpn61DYhfiTp8u4ENAD8uzN2qfFh	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:41:11.432Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:41:12
Fib8SqMQE-YqyzntGR_2xnGPAVLfM3E1	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:15:08.051Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:15:09
PCbj1IaYFA-m4ZsOzoNR6CIwh62293AI	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:33:37.539Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:33:38
OoDUYkyWjMs41GnAHnbDK1XeQPNKbluG	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T06:25:35.844Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 06:25:36
4iHW7N00TGyMPbQ28PSCBETboNN6OXXH	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:35:49.254Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:35:50
xO5LLUpIli-qp0k5n8mcDChP3qbMXAJu	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:18:10.932Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:18:11
2XdZ1pk6EkG468-o7PrEiQeLQWC5IK50	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:30:09.440Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:30:10
0FVhfmWbMSzcpj17ns86W-y-I7IEfthL	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:51:48.808Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:51:49
-Oys5T8voSpqHX9WFVNnf1KgivzVwzJA	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:52:29.636Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:52:30
JaqDdEAlIX1OjQSKiPaHTEaVt0rCyORs	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:51:22.579Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:51:23
mt-9EIPni6Kk5_tITotJxgeD2N7nUM-V	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:34:44.172Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:34:45
ISk0j6XKZpgleg5ftKzMZBVHXlINBZhS	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:40:29.155Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:40:30
4x_4Xo_iQBToznPi4eSntu1b59EpGZSl	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:45:38.558Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:45:39
AL0t5MniyZOSNu2W-YarmRgQGSJuWnZD	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-08T04:29:27.915Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-08 04:36:02
WGmm96fEOd9XI6Wj5ZPyQK8iRxqiTing	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:45:11.147Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:45:12
61EIGBp1K3D4lNbqgnMau0ZRbnGDJAw3	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:29:18.176Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:29:19
mC69jS-AC-IiWGOXCx23r9kHBkCOSuG5	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T06:33:29.074Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 06:33:30
TMNK2lrDuDid0sSTBWoCvNGxGIA-Cu6F	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:33:51.768Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:33:52
FOkAodeRi0HVqgaCNyPNwvNz1YvLBnOQ	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:18:01.606Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:18:02
a0cSfjNWdrkt2zBSye-N__eaNR9Oj2c9	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T03:33:02.842Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 03:33:03
cuFaFJPVRiueUcLjXFtb2Sn4RGnyKUjj	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T10:28:55.690Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 10:29:07
8nmH2oby14M_Tfz_zFUYg6HZvks54jAE	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T11:43:21.195Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 11:43:22
GO22aYdCMbIXKtluIOxDruJgnGvNWb-w	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-10T17:46:47.568Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-10 17:46:48
NdQefFhdnqvX97BVKvDnCA98wRphXDJD	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T06:33:52.159Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 06:33:53
ajT73pXGsBmxSZjj6DYoHL0EQ-UkPQeX	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:39:44.362Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:39:45
NVY-xF9Vt5C4paS6EGhy5LY-me4SwqHY	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:40:01.646Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:40:02
s3Wtq4edlJMhQTjOjD1Mr645-e6YLuPk	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:52:11.289Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:52:12
0OA7OcOfUpBABI6SRmk6yGPOWHnerJxo	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:13:45.849Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:13:46
OBrr8zHzN1L9cx8bXfU2GSEKN3fge-ZC	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T03:33:19.392Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 03:33:20
wirz63k0ENFziO93V8LZPWP9BcTI5bRq	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T04:55:46.688Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 04:55:47
QfP30gJyOv3S-_WuuTS2wjWVXZg1ohS8	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:03:31.234Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:03:32
eEq3WniYgWcMqRMxGce5vwmCi2tkqBjm	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:03:41.667Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:03:42
dXP0jU5Diku5cf5hVMen-H0AFOv8kJFM	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T05:31:26.796Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 05:31:27
n0hRXjxCbx5QmxJSQ0bYYsrvC0I8eCle	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:42:28.393Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:42:29
bBbtejEGF_DMfN4D3xlqP2FoyOzc7dGj	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:30:19.556Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:30:20
lthLh3DTmV3Zh3LvJYtcJh-Nd_Nv13C0	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T08:20:14.998Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "a9a95a58-c2be-4175-83ed-7352a709c3c8", "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 08:20:15
gqd9IoBp7TM7gUxbNaCkGQKgYg9NapLy	{"cookie": {"path": "/", "domain": ".osipl.dev", "secure": true, "expires": "2026-02-11T07:36:00.082Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:36:01
8WZuIkbSYZAi3e2mT5hZkbOQvd7iCFL8	{"cookie": {"path": "/", "domain": "dev1.osipl.dev", "secure": true, "expires": "2026-02-11T07:49:45.712Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "captchaAnswer": null, "captchaIssuedAt": null}	2026-02-11 07:49:46
\.


--
-- Data for Name: storage_objects; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.storage_objects (id, object_key, storage_provider, file_type, category, mime_type, size_bytes, checksum_sha256, uploaded_by, application_id, document_id, created_at, last_accessed_at) FROM stdin;
1c1dcc62-d896-43bd-8d7d-b19949e913ae	revenue-paperss/af5ac3e5-a3ee-4f8e-9ab1-6639fa490a70	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:28.680215	\N
e2a9e443-a74e-49d8-89b3-378843f3e5e6	affidavit-section29s/2dbe6587-ac79-426b-a562-7f08e7e16deb	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:33.860452	\N
82c6ae80-a044-42f1-8cf4-059c52763c81	undertaking-form-cs/779b2513-e3b5-498e-beea-b773850aa4c8	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:38.761147	\N
03e16984-ccca-45f6-8692-0f9a5bc8a443	property-photos/a6b67ba1-de08-4945-8220-ac8fd28bb790	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:45.110249	\N
40a0ca74-8e89-44e5-a12a-bb2cdaa2f6e9	property-photos/72fb829d-8d5b-4806-b519-2e31985b75eb	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:45.208084	\N
546eb781-9593-4f34-8e8a-ba3293d98a60	property-photos/0ec791c4-d5de-419d-b8a6-6ab1f11f7e32	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	37d10b03-efcf-4ab0-86f2-c8fdea537b9b	\N	\N	2026-02-01 15:39:45.285243	\N
72c7909a-116c-454c-8dcc-c8a820d4bed5	revenue-paperss/e6bd081b-b246-4059-bb51-6d0e966d59cf	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:08.221016	\N
a36a5cb8-8ad0-46e5-ab5a-a896cef3a646	affidavit-section29s/d9d2e0ba-691d-4444-86d3-8c3ecb6b46e5	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:13.398013	\N
7cb0be48-f77e-4434-9e1f-bbf76dc80695	undertaking-form-cs/11c3b8c5-19c5-44d5-8b29-a1a277d03ad9	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:20.693188	\N
9e3fcee1-a392-42ea-b220-00d16c017d0d	property-photos/bcf27d67-dde6-4af8-bdcd-093d6f9688b9	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:28.688973	\N
f33030ea-ff57-44a2-a701-7d3fde6a326b	property-photos/0bae4718-a187-4ba5-8270-77d453ff29e7	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:28.778456	\N
3f6276ed-436c-4230-99db-d70c30ce353f	property-photos/77a39c43-1a28-4093-bb68-5c58d3986803	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	e97e2f28-6ee5-49ca-be86-419e85dd5700	\N	\N	2026-02-01 15:46:28.872785	\N
11a690c1-bb44-4f27-b81f-b356465bcb95	revenue-paperss/d42a9a3b-8cb2-4345-809e-62cb851a1c9f	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:49:54.483327	\N
41c570ed-8916-4bdb-9c11-3fd960f3fd0b	affidavit-section29s/aa809c55-1681-4a91-9cee-6da72063e5d4	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:49:58.663573	\N
81b7c65b-c1a7-408b-afc2-7bffe1855c7c	undertaking-form-cs/b0100074-c568-420e-a94c-065695cc923c	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:50:03.437858	\N
7d40055d-6786-4773-ab73-ef66b93ecd73	property-photos/95beba28-acc8-4be9-9596-88b7fb7085c6	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:50:10.74131	\N
8ef499b1-2689-4c9d-92c6-c2216122fbe2	property-photos/7c812155-bb1d-4aac-9ba7-f64e0bc9db70	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:50:10.820108	\N
0b4b5d4b-16ce-4ed4-9cc0-b041d88a9329	property-photos/b8a7c7d1-2be4-47ad-8ab7-7175d37a94e6	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	\N	\N	2026-02-01 15:50:10.901192	\N
45c6857a-93b2-4f12-81a8-82466fa6a97c	revenue-paperss/c240a9ec-9345-4f66-87f5-f330389aa529	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:05.612356	\N
4294e378-45e8-4058-aadc-05f6ce3f117a	affidavit-section29s/4a91733b-e7ac-41ec-87f9-d4618a83a184	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:10.919805	\N
38e4e90b-25ca-4653-9977-e63d0048f079	undertaking-form-cs/7d8464c9-d8ee-4d75-ae7b-a9b324f71ade	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:16.266265	\N
36e0afa5-e66d-422e-8e3a-babf848ccbed	property-photos/be392380-9271-4252-ba6e-5ff39c2c3d0a	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:26.063043	\N
641a368c-6456-4101-ae72-7e75dd3c058f	property-photos/92af2832-bc4a-448a-b1ee-a45d12292d90	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:26.138619	\N
170207e5-dcfa-473b-9cc8-40c980e00da4	property-photos/75dd4bda-478e-43e7-94e5-7c1d597c3ac8	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	a1788232-8f83-4c3d-939d-5bce9c6a6a09	\N	\N	2026-02-01 15:56:26.223722	\N
648f0b93-0136-4511-8d4e-807a0e7ac299	revenue-paperss/a137efae-98fb-42cb-b4bc-18e7994b6b62	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	\N	\N	2026-02-01 16:24:54.384829	\N
383fae45-59a1-4187-aa2f-8b22882441b7	affidavit-section29s/d1ea4c17-6fcf-456e-9157-c1120195a1a4	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	\N	\N	2026-02-01 16:25:00.17268	\N
9837cef0-892c-4c98-a740-aaf330b0cbbd	undertaking-form-cs/1c1e7ea0-f735-4e17-8339-524d52f3b0c8	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	\N	\N	2026-02-01 16:25:04.78055	\N
e1014e59-13ea-4d6f-8dfd-42849705cfb6	property-photos/945ac071-e7b4-4e16-b704-730f711a15a5	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	\N	\N	2026-02-01 16:25:12.686946	\N
336a8231-70ac-4c07-96d3-5e45c7f789d9	property-photos/49c2774d-59a2-4679-8ac5-a62bb29a7af6	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	\N	\N	2026-02-01 16:25:12.784654	\N
70c140d6-5dd9-40b3-9773-5e439aa67b0a	revenue-paperss/763ac6f9-614b-4a46-b0dc-5f675268a178	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:54:48.679517	\N
da5b163e-d3bc-4a07-8275-51c8027bed44	affidavit-section29s/8adc1e77-d961-43de-8b62-d6e6c875d7bf	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:54:52.94469	\N
4129727c-8632-4f45-9203-981944c6ca6e	undertaking-form-cs/df79225a-bb28-43f3-ad96-1c6b74a98dca	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:54:57.987914	\N
a923aa2c-9286-4506-a70a-d1b575860707	property-photos/6c54ca76-3e29-4f91-946b-10f7732df4c4	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:55:03.793586	\N
b0b3dfdd-6546-4c80-b1a2-5f6513e60ed5	property-photos/ab3b0be2-9bc7-4b7d-82ff-955a134e8b23	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:55:03.855663	\N
793cdc2b-2cb9-48a4-a4f3-b5ef969ec93e	property-photos/2da8a7b0-4c92-42bf-b78c-520fc9adf162	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	432707b6-ac17-43b4-b021-695148c341f9	\N	\N	2026-02-03 17:55:03.955496	\N
cb843f24-7eb7-4707-bc04-9e34f5818203	revenue-paperss/cfd6ee2b-8d4b-4953-8f8f-9b93d3b66af7	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:47:57.005166	\N
37aeaaef-c78f-449c-8287-6cb3b4cc3dc1	affidavit-section29s/71df8145-6d7b-4a50-b184-235c809b9779	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:48:01.80526	\N
4e14be05-134a-49fe-b801-a7bb2be11180	undertaking-form-cs/125bc0aa-c98e-4c69-b72b-cde4c9be555c	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:48:05.861897	\N
3fa088ba-e484-428d-9c0b-47f34b85c812	property-photos/2d35054d-4633-4fd6-ad4b-7bf9e11c1df4	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:48:11.662224	\N
d490fed2-dfba-4f93-b42f-cf311bd2e075	property-photos/18e0cd67-b285-4a8e-8dc4-af693267316a	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:48:11.735785	\N
7ea2432f-7307-463f-b16c-0daec149b0fb	property-photos/caf0627d-7574-40ad-a5cd-ae6ed9808164	local	property-photo	photos	image/jpeg	98782	52f471ee0bc0cc8de607df7bab4787266c5b4ead1cf339e7a0316bae2f1a4cee	e95c9cba-8e19-46fb-9ca0-f95d5332bb82	\N	\N	2026-02-04 03:48:11.811823	\N
033a6c55-15fc-410b-a815-fcf11c895eb3	documents/f98695a6-c41f-40f2-968b-4c39d5ddc56b	local	document	legacy_certificate	application/pdf	61398	\N	\N	1813ab2e-b874-4f62-a753-5cfb708299c7	e505f4a1-7406-488b-8315-26e1f8aea543	2026-02-05 23:10:22.316027	\N
de01f096-f87e-4e8a-848d-0a7ce91d7e34	documents/c80f600d-ff8e-42e6-893d-ae8284c70b5e	local	document	owner_identity_proof	application/pdf	61398	\N	\N	1813ab2e-b874-4f62-a753-5cfb708299c7	caf83183-6480-4c91-aa03-dc99789fc480	2026-02-05 23:10:16.333099	\N
0f917020-7d57-4ed0-bc45-bd73cd308c10	revenue-paperss/3b5e52b6-d936-4fac-ac08-b771e3262c31	local	revenue-papers	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	\N	\N	2026-02-05 23:27:14.765359	\N
600e02b1-b4a8-43c6-8400-cd1e7f9868d9	affidavit-section29s/bd451dd0-0b72-42c3-a1d6-3a214ecb6e99	local	affidavit-section29	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	\N	\N	2026-02-05 23:27:22.840377	\N
a3ccacc9-6f9d-47be-9b7f-0720354afa77	undertaking-form-cs/012246be-2a98-4972-a58a-aaf0d3b7f2c4	local	undertaking-form-c	documents	application/pdf	61398	f24b77cf89cfbf9bd0ff84929c0f12e3575b4cef18561eb1f18cb735ec63c58b	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	\N	\N	2026-02-05 23:27:29.353207	\N
56d143bb-fab3-4494-a855-3834fa2fc60e	property-photos/a61f7afb-c2f1-4cf3-96a3-87153c485801	local	property-photo	photos	image/jpeg	96524	02f226a52cfa9b5054adcfe008a6b8885b9a5f56adc2d53ad3382d9502cbd6dd	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	\N	\N	2026-02-05 23:27:37.98787	\N
d1bed458-e57e-48c8-815b-4d1952084772	property-photos/9697aa01-b891-46d0-a324-b1633e29b9ae	local	property-photo	photos	image/jpeg	13584	12434b6deb0704e02e9f467b990ca3498923894c9c205a1ab3acff0f3eb8a846	4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	\N	\N	2026-02-05 23:27:38.06664	\N
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.support_tickets (id, ticket_number, applicant_id, application_id, service_type, category, subject, description, status, priority, assigned_to, assigned_at, escalated_from, escalated_at, escalation_level, sla_deadline, sla_breach, resolved_at, resolved_by, resolution_notes, created_at, updated_at) FROM stdin;
cf5d9d0a-0f5c-4cf8-9fa2-a6b4e6720330	GRV-SML-2025-001	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	\N	homestay	general	Demo Grievance: Inquiry about subsidy	This is a sample grievance ticket for demonstration purposes. I would like to know about available subsidies for homestay renovation.	open	medium	\N	\N	\N	\N	0	\N	f	\N	\N	\N	2026-02-01 17:41:28.684165	2026-02-01 17:41:28.684165
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.system_settings (id, setting_key, setting_value, description, category, updated_by, created_at, updated_at) FROM stdin;
498dbd8d-4322-416e-a72e-4002e6c06158	enforce_single_session	true	Enforce single concurrent session per user (kicks old sessions on new login)	general	\N	2026-01-08 03:01:48.867166	2026-01-08 03:01:48.867166
3c29b1ac-6a6f-41c7-89f2-d26c34d6d43a	comm_email_gateway	{"custom": {"host": "mail.smtp2go.com", "port": 2525, "password": "osipl@2025", "username": "osipl.dev", "fromEmail": "Mail2Smtp"}, "provider": "custom"}	Email gateway configuration	communications	5e2c291b-e9f0-4ead-a6ed-3fe8098a7760	2026-01-14 06:39:24.099995	2026-01-14 06:48:24.932
1dd1247e-d747-4051-9521-81e47e51569f	comm_sms_gateway	{"nic": {"postUrl": "https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT", "password": "Tour@sml352", "senderId": "hpgovt", "username": "hpgovt-TACA", "templateId": "1007739248479536901", "departmentKey": "a63f7853-6297-44c7-820b-392541a47fc1"}, "provider": "nic"}	SMS gateway configuration	communications	5e2c291b-e9f0-4ead-a6ed-3fe8098a7760	2026-01-14 06:36:24.36111	2026-01-14 06:49:51.578
12f14921-55e4-458a-8d13-4f2a81f20f7d	rate_limit_configuration	{"auth": {"maxRequests": 100, "windowMinutes": 10}, "global": {"maxRequests": 5000, "windowMinutes": 15}, "upload": {"maxRequests": 200, "windowMinutes": 10}, "enabled": true}	Rate limit configuration for API endpoints	security	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-21 17:28:25.918265	2026-01-21 17:30:49.309
3d961532-2862-4c73-a0f4-d0b4b2c0d89f	default_payment_gateway	{"gateway": "himkosh"}	Default payment gateway: 'himkosh' or 'ccavenue' (Kotak Mahindra)	payment	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-19 07:25:34.126958	2026-01-22 18:52:15.331
92818204-de11-4045-8ed0-1bdca9e1d651	maintenance_mode_config	{"enabled": true, "accessKey": "launch2026"}	Test Maintenance Mode	general	30d01ccb-a38d-44df-b1fe-f904926574b3	2026-01-14 07:25:23.431063	2026-02-05 23:33:01.171
581aad64-4af9-4801-9e3c-1529c44b4d99	woman_discount_mode	{"mode": "ADDITIVE"}	Configuration for woman owner discount calculation (Additive vs Sequential)	general	\N	2026-01-14 07:36:55.921742	2026-01-25 21:11:03.887
ce8107fa-22c2-4d1e-8916-f8744e724cb5	upload_policy	{"photos": {"maxFileSizeMB": 25, "allowedMimeTypes": ["image/jpeg", "image/png", "image/jpg", "application/pdf"], "allowedExtensions": [".jpg", ".jpeg", ".png", ".pdf"]}, "documents": {"maxFileSizeMB": 25, "allowedMimeTypes": ["application/pdf", "image/jpeg", "image/png", "image/jpg"], "allowedExtensions": [".pdf", ".jpg", ".jpeg", ".png"]}, "totalPerApplicationMB": 100}	\N	general	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-21 23:05:03.200516	2026-01-21 23:05:03.200516
0c489058-71d4-4415-9e0a-b38096d0816b	payment_test_mode	{"enabled": true}	When enabled, payment requests send ₹1 to gateway instead of actual amount (for testing)	payment	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-14 07:35:35.822385	2026-02-01 03:10:48.12
7fe6bd33-e975-4c46-8b88-14edfc9f9783	admin_legacy_stats	{"total": 1980, "pending": 50, "approved": 1850, "rejected": 1500}	\N	general	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-02-01 06:48:11.210908	2026-02-01 06:48:11.210908
e77eae49-4987-4132-8eb2-3bd830f85929	payment_workflow	{"workflow": "upfront", "upfrontSubmitMode": "auto"}	Payment workflow: 'upfront' = pay before submission, 'on_approval' = pay after approval	payment	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-15 09:46:27.312966	2026-02-05 20:49:58.888
e6141603-69bb-449e-9fb4-d6832f992d95	admin_super_console_enabled	{"enabled": true}	Enable/disable super console	admin	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-01-14 06:34:47.665642	2026-02-05 22:25:01.819
8aee9bfc-1790-406e-a4b0-61305e9ada3a	enable_legacy_registrations	true	Allow existing owners to register (Legacy/RC flow)	general	\N	2026-01-25 22:29:01.758763	2026-02-05 23:07:37.463
33a5cbe0-fab5-4db9-a8a2-f9772cb22978	da_send_back_enabled	{"enabled": true}	\N	general	b99be423-a255-42a4-9d87-31e4aab2a3d1	2026-02-04 03:45:24.107258	2026-02-04 03:45:24.107258
2d4bfeb6-2acb-478b-a5d3-ce16f183e5a9	backup_configuration	{"enabled": true, "schedule": "0 2 * * *", "includeEnv": true, "includeFiles": true, "lastBackupAt": "2026-02-05T20:30:00.015Z", "retentionDays": 30, "enableFailover": false, "backupDirectory": "/home/subhash.thakur.india/Projects/hptourism-rc7/backups", "includeDatabase": true, "lastBackupError": "EACCES: permission denied, open '/home/subhash.thakur.india/Projects/hptourism-rc7/backups/db/backup_20260205_203000_metadata.json'", "lastBackupStatus": "failed", "fallbackDirectory": "/home/subhash.thakur.india/Projects/hptourism-rc8/backups_fallback"}	\N	general	\N	2026-01-10 20:30:00.481759	2026-02-05 20:30:00.514
9ffe72ad-9416-430e-8455-efccb7d5dd82	payment_pipeline_pause	{"enabled": true, "pausedAt": "2026-02-05T23:36:18.968Z", "pausedBy": null, "messageType": "Payment process is being updated", "customMessage": ""}	Payment Pipeline Pause Configuration	general	\N	2026-02-04 08:26:19.607602	2026-02-05 23:36:18.968
\.


--
-- Data for Name: ticket_actions; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.ticket_actions (id, ticket_id, actor_id, actor_role, action, previous_status, new_status, previous_priority, new_priority, previous_assignee, new_assignee, notes, metadata, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: ticket_messages; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.ticket_messages (id, ticket_id, sender_id, sender_role, message, attachments, is_internal, is_read, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.user_profiles (id, user_id, full_name, gender, aadhaar_number, mobile, email, district, tehsil, block, gram_panchayat, urban_body, ward, address, pincode, telephone, fax, created_at, updated_at) FROM stdin;
95e6cebf-c8b8-4619-bb77-c77ad000b52f	7adb8748-2a9d-4622-b7dc-f8dca5b34b90	Demo Owner	male		8091444005	demo@himachaltourism.gov.in			\N							\N	2026-02-03 10:06:59.147379	2026-02-03 10:06:59.147379
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hptourism_user
--

COPY public.users (id, mobile, full_name, first_name, last_name, username, email, alternate_phone, designation, department, employee_id, office_address, office_phone, role, aadhaar_number, sso_id, district, password, enabled_services, is_active, created_at, updated_at, signature_url) FROM stdin;
432707b6-ac17-43b4-b021-695148c341f9	6666666633	Test Test	Test	Test	\N	demo@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	property_owner	666666666633	\N	\N	$2b$10$H3aqEqcR/i2R2IPWWobfWOuJv6wTtLiBVv8BYeBJ42xK0m2oMWHDO	["homestay"]	t	2026-02-03 17:53:37.160682	2026-02-03 17:53:37.160682	\N
894ca19d-3f7e-4867-9b47-3c6198b73fa4	6666666641	test test	test	test	\N	demo@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	property_owner	666666666641	\N	\N	$2b$10$.PyRf.lq0Ee59Y71M/.qZuuEP9bsY9pUf5ESYNhZFgMim.QVlAZbW	["homestay"]	t	2026-02-05 23:08:28.055948	2026-02-05 23:08:28.055948	\N
94a33229-2eec-4bfe-a5ce-d01b06625974	7800001003	DA Shimla Hq	DA	Shimla Hq	da_shimla_hq	da.shimla-hq@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Shimla HQ (AC Tourism)	$2b$10$v9zOltOtsfYrLPM.n0TnaOVTxJ6q2ANjG/YkvTLmj3O7VSc8DXbLK	["homestay"]	t	2026-01-08 00:45:20.481319	2026-01-08 00:45:20.481319	\N
4a415c0e-67e4-4cb9-90ba-159a7877aaef	7900001003	DTDO Shimla Hq	DTDO	Shimla Hq	dtdo_shimla_hq	dtdo.shimla-hq@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Shimla HQ (AC Tourism)	$2b$10$0BfEb6/ak19z5U5AueaTIueRfcKCvPgHMsXzuQyLtEhQkaqFJikuW	["homestay"]	t	2026-01-08 00:45:20.56027	2026-01-08 00:45:20.56027	\N
adfed2b7-282f-4aa3-8ee3-8285c108d51c	7800001006	DA Kullu Dhalpur	DA	Kullu Dhalpur	da_kullu_dhalpur	da.kullu-dhalpur@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Kullu Dhalpur	$2b$10$kOWCFRbHViZCy6HU4BKqTenX5QxgXWzbLhZAk90BeIS8H8LFtaHza	["homestay"]	t	2026-01-08 00:45:21.061375	2026-01-08 00:45:21.061375	\N
379057ec-a3f3-4e88-9950-fc96ecc97bdc	7900001006	DTDO Kullu Dhalpur	DTDO	Kullu Dhalpur	dtdo_kullu_dhalpur	dtdo.kullu-dhalpur@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Kullu Dhalpur	$2b$10$RSlggXSjgUYZPxArMNPt8eso9GP7Yw1tFYSzeRNcEaP6u2v.mMCWW	["homestay"]	t	2026-01-08 00:45:21.24217	2026-01-08 00:45:21.24217	\N
a7aea641-74c2-451f-8c5b-c3d01dd2d5fd	7900001010	DTDO Lahaul	DTDO	Lahaul	dtdo_lahaul	dtdo.lahaul@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Lahaul	$2b$10$kHUWxF1A61wLCynq3fxhRu0c33CxREvVqVjDsp39FBW95aoLMmTvy	["homestay"]	t	2026-01-08 00:45:21.974547	2026-01-08 00:45:21.974547	\N
c33ccea0-6e69-4ca5-b5f6-da9a456c5cc9	6666666615	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666615	\N	\N	$2b$10$HIUG8manaRDIx/aF8kAQ.OvXFie5QxdfwOG8aCBB5pM.tUVJ1mPs2	["homestay"]	t	2026-02-01 16:23:37.55417	2026-02-01 16:23:37.55417	\N
e058334e-e9c3-47e3-938b-5a9a273ff1a0	7900001011	DTDO Mandi	DTDO	Mandi	dtdo_mandi	dtdo.mandi@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Mandi	$2b$10$cpSgN8f1bVn0qX.ENM0Fnu4OowpN1/EIcvlRz0H278oGxHOO9DK/S	["homestay"]	t	2026-01-08 00:45:22.137953	2026-01-08 00:45:22.137953	\N
b7987533-e127-4cad-8233-de0fdde7bbc7	7800001007	DA Dharamsala	DA	Dharamsala	da_dharamsala	da.dharamsala@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Kangra	$2b$10$KQjCOEJaFU3YXYGcC56ITO3YzOEGjsKzJT7b6uA5DiZyl7Urue50u	["homestay"]	t	2026-01-08 00:45:21.328771	2026-01-08 00:45:21.328771	\N
6181fa83-d0af-492e-9fca-840005f2600e	7900001007	DTDO Dharamsala	DTDO	Dharamsala	dtdo_dharamsala	dtdo.dharamsala@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Kangra	$2b$10$CnsCk7a3DN3QlhlAl5XyEea8Ai4CqRiTuTopxQ7AcohAFFqXz.CfG	["homestay"]	t	2026-01-08 00:45:21.429953	2026-02-01 04:35:23.82	\N
6d27a721-acb4-4dab-95d9-0b2c91645234	7800001008	DA Kinnaur	DA	Kinnaur	da_kinnaur	da.kinnaur@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Kinnaur	$2b$10$OIPUbUQILgE9JQ7Fk5l4k.TN6tVIqJ1/j4tKQMtTkuAEsaNbzcgwS	["homestay"]	t	2026-01-08 00:45:21.531155	2026-01-08 00:45:21.531155	\N
1562faf8-b959-43ec-b3ef-936d901e3131	7900001008	DTDO Kinnaur	DTDO	Kinnaur	dtdo_kinnaur	dtdo.kinnaur@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Kinnaur	$2b$10$7yP.YIElHx7i7JdhpaShreRPxw2guiEZkA5tvA0vi0boswCKSspqe	["homestay"]	t	2026-01-08 00:45:21.646263	2026-01-08 00:45:21.646263	\N
5da8ac27-6650-4982-b51a-a7e7c5257075	7800001009	DA Kaza	DA	Kaza	da_kaza	da.kaza@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Lahaul-Spiti (Kaza)	$2b$10$CAX6LmKCA28WNYlDn6cWo.WjX6Yf1jojKWx3QvD0RyNdNZK5C8XcG	["homestay"]	t	2026-01-08 00:45:21.743951	2026-01-08 00:45:21.743951	\N
422d1de0-8342-42b3-9767-d71d3297cd57	7900001009	DTDO Kaza	DTDO	Kaza	dtdo_kaza	dtdo.kaza@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Lahaul-Spiti (Kaza)	$2b$10$HFnLu4hRi8hnABt6OhYSiult.4iOXOLzNCrOZjWyUqA8n/tTiLQTC	["homestay"]	t	2026-01-08 00:45:21.82239	2026-01-08 00:45:21.82239	\N
249b7155-1f20-404f-b377-b0202b66a8a8	7800001010	DA Lahaul	DA	Lahaul	da_lahaul	da.lahaul@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Lahaul	$2b$10$pDdmyt1ixmnQqbB3zqsTE.IIt3Vl7Ow5.aFdosHYKYVv2RZ7IFwGW	["homestay"]	t	2026-01-08 00:45:21.898119	2026-01-08 00:45:21.898119	\N
38b25f9c-a43e-47c9-a74c-ee74519eadb8	7800001011	DA Mandi	DA	Mandi	da_mandi	da.mandi@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Mandi	$2b$10$xEAaK05XwN5ygXqQNSNyjeoVzpPLrcPUtg7yi65abM/xp7joSaK5O	["homestay"]	t	2026-01-08 00:45:22.053293	2026-01-08 00:45:22.053293	\N
30d01ccb-a38d-44df-b1fe-f904926574b3	9999999999	Admin Admin	Admin	Admin	admin	\N	\N	\N	\N	\N	\N	\N	admin	\N	\N	\N	$2b$10$wGd7UFwze0k0wK7SrtceK.FhpYVMK40dGQFDz.5aB0ClGjUs.9Xhq	["homestay"]	t	2026-01-08 00:45:19.959719	2026-02-03 08:56:17.758	\N
29e9c380-3b7d-49aa-882e-94d37ec3e59d	7900001001	DTDO Chamba	DTDO	Chamba	dtdo_chamba	dtdo.chamba@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Chamba	$2b$10$TcrP5j6blgK5tVCTyMNCRuAFs4todlSuxZneqp4nwIQsnNcfBrttK	["homestay"]	t	2026-01-08 00:45:20.252529	2026-01-08 00:45:20.252529	\N
f284ccb8-33fc-42d0-a45a-eb231e6cac9a	7800001002	DA Bharmour	DA	Bharmour	da_bharmour	da.bharmour@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Bharmour Sub-Division	$2b$10$PoGPWqx63W2XCLiMo0j03uSonRp/6qWgqBC4M1XqfN1xVAKLuQnX.	["homestay"]	t	2026-01-08 00:45:20.328813	2026-01-08 00:45:20.328813	\N
ae0f4a20-aaad-4c76-8b3d-b914dfa561db	7900001002	DTDO Bharmour	DTDO	Bharmour	dtdo_bharmour	dtdo.bharmour@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Bharmour Sub-Division	$2b$10$eE/PR2ZGNXq3y5AKBBWc8OGQ8r71tkuTIuHlEzwFswQkW6UsiL1wO	["homestay"]	t	2026-01-08 00:45:20.40481	2026-01-08 00:45:20.40481	\N
6536d907-78d1-419a-b023-8a6f141fdcf5	7900001004	DTDO Hamirpur	DTDO	Hamirpur	dtdo_hamirpur	dtdo.hamirpur@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Hamirpur	$2b$10$W8Ljd4WyFma45eaWDNJc2ej7NhwH7ERYw5N6PJ5FskR34ArNgihCa	["homestay"]	t	2026-01-08 00:45:20.733503	2026-01-08 00:45:20.733503	\N
6affed07-7898-4fc9-b86d-af1d610ad3ea	7800001004	DA Hamirpur	DA	Hamirpur	da_hamirpur	da.hamirpur@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Hamirpur	$2b$10$lwW5e.CkUO5uhW0wJrUfpuw4aNScouG2Io86mAI5iweIYMR/LwLKi	["homestay"]	t	2026-01-08 00:45:20.638833	2026-01-08 00:45:20.638833	\N
4d890d65-0a0f-49f1-92cc-34d046586531	7900001005	DTDO Kullu Manali	DTDO	Kullu Manali	dtdo_kullu_manali	dtdo.kullu-manali@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Kullu	$2b$10$ENUYk.7OE.Y3NJPKzYwQoOcpqPmRaRcLvju4X66.kn99O1zbOMJx.	["homestay"]	t	2026-01-08 00:45:20.975105	2026-01-08 00:45:20.975105	\N
d244a912-8065-4604-9b58-ba9b69d93e11	7800001005	DA Kullu Manali	DA	Kullu Manali	da_kullu_manali	da.kullu-manali@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Kullu	$2b$10$cVCc.LoJLlp/8SLXH2t3l.8FW9grKKbFzOGLbRtKE34zrsIBS5tyC	["homestay"]	t	2026-01-08 00:45:20.821971	2026-01-08 00:45:20.821971	\N
e95c9cba-8e19-46fb-9ca0-f95d5332bb82	6666666632	Tests Test	Tests	Test	\N	test@test.com	\N	\N	\N	\N	\N	\N	property_owner	666666666632	\N	\N	$2b$10$0rlPS8nbzijO3yXkDVfGyuo6TFd7SCd7hBJFCzkiTCvz8RLaL9.0m	["homestay"]	t	2026-02-04 03:46:43.303252	2026-02-04 03:46:43.303252	\N
4aa02ff0-114d-4c4d-9e3e-247c52ad02f5	6666666642	test test	test	test	\N	demo@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	property_owner	666666666643	\N	\N	$2b$10$JdVAAvlq/ejOQBs9J0YCNOyTArC7id/owtXhmrOS44VyHaUciKV7W	["homestay"]	t	2026-02-05 23:25:48.037167	2026-02-05 23:25:48.037167	\N
c9f0b40a-3742-4830-aa12-b558794c47c7	6666666616	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666616	\N	\N	$2b$10$mDLuAEMAuZq6RzjLrlLmfOH.jawXKSlacEp6TGdkqcX0yrSM/qjF6	["homestay"]	t	2026-02-01 16:28:20.035317	2026-02-01 16:28:20.035317	\N
32d7d290-8270-4aa9-977b-6b67743b953a	7900001014	DTDO Sirmaur	DTDO	Sirmaur	dtdo_sirmaur	dtdo.sirmaur@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Sirmaur	$2b$10$PNFhYlK.Vr.NMpMNFWl0e.42XQi4Je3LwL0kDVhXSVyn.DeWuxhFm	["homestay"]	t	2026-01-08 00:45:22.62149	2026-01-08 00:45:22.62149	\N
cdb880ee-4ba6-4441-b5b1-0852c2cb4b55	7800001015	DA Solan	DA	Solan	da_solan	da.solan@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Solan	$2b$10$FnXItEeMepp8PS4owW9rsu/xrFX7iZqAiEnv5qVJLi9kXFl4MWl3G	["homestay"]	t	2026-01-08 00:45:22.698356	2026-01-08 00:45:22.698356	\N
683e4272-6948-451a-bffe-2aeac46f9137	7900001015	DTDO Solan	DTDO	Solan	dtdo_solan	dtdo.solan@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Solan	$2b$10$eysap30w4EIbkL6KgrICYua9iy6KfEs63kwAlvjdeCa.QfVv.pjZ6	["homestay"]	t	2026-01-08 00:45:22.776118	2026-01-08 00:45:22.776118	\N
34db6a0f-a3a8-4860-8bc5-fc03291de0d3	7800001016	DA Bilaspur	DA	Bilaspur	da_bilaspur	da.bilaspur@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Bilaspur	$2b$10$EEoY6VnP8vw6iIZ9CUJbwOykmXy8b4o7A9hzAJdIcUW7tBuvAtmn6	["homestay"]	t	2026-01-15 13:17:23.75	2026-01-15 13:17:23.75	\N
efde4df9-1dcf-4d85-a9d3-151d17c8011d	7800001001	DA Chamba	DA	Chamba	da_chamba	da.chamba@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Chamba	$2b$10$axjfLj8pVuYiPhoFb7feduUL9fTSNc9FPwXe2K774rMqdWKmqz3mW	["homestay"]	t	2026-01-08 00:45:20.176033	2026-01-08 00:45:20.176033	\N
1a8bab46-2d4c-4694-9009-12d50f644ec8	7800001012	DA Pangi	DA	Pangi	da_pangi	da.pangi@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Pangi	$2b$10$TQWjQYo2pas9dLa9MYA.Mum/0XMfl6x1RSiKnthcQwaa/wNCy8hSe	["homestay"]	t	2026-01-08 00:45:22.237459	2026-01-08 00:45:22.237459	\N
01e17065-3ce4-46af-8a36-97cf24502482	7900001012	DTDO Pangi	DTDO	Pangi	dtdo_pangi	dtdo.pangi@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Pangi	$2b$10$sz22hiipiSsaH2vqgmq24OyH/078CgmR4ZAxOeU9/y7ltm4hJeHYS	["homestay"]	t	2026-01-08 00:45:22.313669	2026-01-08 00:45:22.313669	\N
a9a95a58-c2be-4175-83ed-7352a709c3c8	7800001013	DA Shimla	DA	Shimla	da_shimla	da.shimla@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Shimla	$2b$10$SdvR0KLPuDH29XqUla.KHuuzMJaDuunBm.nxUFWlrRhqCJYZIe3JS	["homestay"]	t	2026-01-08 00:45:22.390449	2026-01-08 00:45:22.390449	\N
2803bd35-34f0-4751-86ae-6cc3918c7165	7900001013	DTDO Shimla	DTDO	Shimla	dtdo_shimla	dtdo.shimla@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Shimla	$2b$10$exQqurqMKuK5KUpDK4g0ke8OGmm1vqrOISOTEjWTPleRdhSs1pHiO	["homestay"]	t	2026-01-08 00:45:22.466632	2026-01-08 00:45:22.466632	\N
5ff8dbe4-2fe2-44a2-82ab-0588baab4da6	7800001014	DA Sirmaur	DA	Sirmaur	da_sirmaur	da.sirmaur@himachaltourism.gov.in	\N	Dealing Assistant	\N	\N	\N	\N	dealing_assistant	\N	\N	Sirmaur	$2b$10$XkrBYbLUDSCRfMMSWzdelurVXTGVEyyoUcJ.NZBBRoDncd0u4FcDq	["homestay"]	t	2026-01-08 00:45:22.544892	2026-01-08 00:45:22.544892	\N
7adb8748-2a9d-4622-b7dc-f8dca5b34b90	8091444005	Demo Owner	\N	\N	demo_owner	demo@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	property_owner	\N	\N	\N	$2b$10$UcM4dwIRcoXP9g.n9ut6beuXt.fcmTLp5YFmb0h.BTFpRs16x7uOK	["homestay"]	t	2026-02-01 17:34:28.072466	2026-02-03 10:06:59.15	\N
4902eca4-271f-427e-ba24-25824e92c69e	9999999900	System Tester	\N	\N	tester	tester@hptourism.gov.in	\N	\N	\N	\N	\N	\N	system_admin	\N	\N	\N	$2b$10$aLho6Rne6vVthA2pKYnntO7.aup3U7JHEheM0vG0yLhOCebOUPPUi	["homestay"]	t	2026-02-01 17:34:27.99497	2026-02-01 17:34:27.99497	\N
9ae7b91c-700e-4b6b-823d-fc51ca25ad8f	7900001016	DTDO Bilaspur	DTDO	Bilaspur	dtdo_bilaspur	dtdo.bilaspur@himachaltourism.gov.in	\N	District Tourism Development Officer	\N	\N	\N	\N	district_tourism_officer	\N	\N	Bilaspur	$2b$10$boiYf.EuvmnmXx9FKQaeKecVvd8OtMFVAj3ukhHsPCtfujuC4IgEK	["homestay"]	t	2026-01-15 13:17:23.831	2026-01-15 13:17:23.831	\N
1e39037f-f7ad-4646-8f65-79990178185f	0000000001	DA Kangra	\N	\N	da_kangra	da_kangra@hptourism.gov.in	\N	\N	\N	\N	\N	\N	dealing_assistant	\N	\N	Kangra	$2b$10$KuAiQtAdJMrm2pLqgCU1AepQ527Pu9hP3k.ddfoMfFyBEAJT9qR0u	["homestay"]	t	2026-02-01 04:31:39.776663	2026-02-01 04:31:39.776663	\N
980536c8-89a0-4671-80c9-28e8397d909b	0000000002	DA Kullu	\N	\N	da_kullu	da_kullu@hptourism.gov.in	\N	\N	\N	\N	\N	\N	dealing_assistant	\N	\N	Kullu	$2b$10$k713KDOY6okmsi8WT5Ctq.EUk8YTbxvKAHDAQeeGRID2tykGDXrHi	["homestay"]	t	2026-02-01 04:31:39.779268	2026-02-01 04:31:39.779268	\N
f6cb4b30-6ee5-4e8a-a9bb-4d64fdb9429e	9999999997	Admin RC Console	Admin	RC	adminrc	admin.rc@hp.gov.in	\N	\N	\N	\N	\N	\N	admin_rc	\N	\N	Shimla	$2a$06$Ia/KKHp5.ljcGVlEUIvI9OjUZEqdNOHL0EwraLrV6QA.KynJCHLHi	["homestay"]	t	2026-01-22 07:04:19.191861	2026-01-22 07:04:19.191861	\N
37d10b03-efcf-4ab0-86f2-c8fdea537b9b	6666666611	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666611	\N	\N	$2b$10$xQa7U7BbKnYuOT3HS9Kqze8tZgwt3hBvHA.ou9cLIWVGWp02k4gUW	["homestay"]	t	2026-02-01 15:37:45.751611	2026-02-01 15:37:45.751611	\N
e97e2f28-6ee5-49ca-be86-419e85dd5700	6666666612	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666612	\N	\N	$2b$10$ce/WY5JZVEHaM8bYEjpZ1.1Asjh7pe8gXFMGAYG/wiz.1qptj/Fy2	["homestay"]	t	2026-02-01 15:44:50.275059	2026-02-01 15:44:50.275059	\N
b99be423-a255-42a4-9d87-31e4aab2a3d1	7800000011	Super Admin	Super	Admin	superadmin	superadmin@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	super_admin	\N	\N	\N	$2b$10$lK.d2Xz5rVKjW2nBjiHyeePYRBKiHoXKOasL9b2GhQiBE5Ts3Tz0S	["homestay"]	t	2026-01-21 17:24:45.42656	2026-02-03 08:54:58.599	\N
ec76a2eb-6757-4a6a-888f-4dfbf6255dc7	6666666613	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666613	\N	\N	$2b$10$hSg.T4fwsGaVZcYAcDREreSe6qQHXb8c.T.shTif5pySNY7khSuoC	["homestay"]	t	2026-02-01 15:48:35.238237	2026-02-01 15:48:35.238237	\N
5e2c291b-e9f0-4ead-a6ed-3fe8098a7760	9999999998	Super Admin	Super	Admin	superadmin	superadmin@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	super_admin	\N	\N	\N	$2b$10$GO4tm09Q7bAIqBOaddwi7.e0bwLvH4E08XuMK4MUoSF7n8wBrKA8W	["homestay"]	t	2026-01-08 00:45:20.096523	2026-02-03 08:55:34.661	\N
c20cf37c-f697-4bb4-8974-8c13fb5384c0	7800000021	System Admin	System	Admin	admin	system_admin@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	admin	\N	\N	\N	$2b$10$AUf1mtnowMtDg3wm/sRMOObgWC6vTxTTIfHvAeiSHybZrBXQws93K	["homestay"]	t	2026-01-21 17:38:48.362627	2026-01-31 15:54:08.506	\N
a1788232-8f83-4c3d-939d-5bce9c6a6a09	6666666614	Test Five	Test	Five	\N	subhash.thakur2010@gmail.com	\N	\N	\N	\N	\N	\N	property_owner	666666666614	\N	\N	$2b$10$UNl6GtgozSdIT/blObtsf.5vOKHsp.6YnMKwz16OJEzeogo5l.C2i	["homestay"]	t	2026-02-01 15:53:21.06003	2026-02-01 15:53:21.06003	\N
b8f573d3-9eee-48f7-a2a4-ea670ce192d1	9800000001	Supervisor HQ	Supervisor	HQ	supervisor_hq	supervisor.hq@himachaltourism.gov.in	\N	\N	\N	\N	\N	\N	state_officer	\N	\N	Shimla	$2b$10$lfwfV.i8AmrcmDxCrUheLOpdQK049OMoaZmXlDE7GPodZviEpdE42	["homestay"]	t	2026-01-12 18:20:44.944366	2026-02-03 08:55:52.659	\N
\.


--
-- Name: application_actions application_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.application_actions
    ADD CONSTRAINT application_actions_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: ccavenue_transactions ccavenue_transactions_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ccavenue_transactions
    ADD CONSTRAINT ccavenue_transactions_order_id_unique UNIQUE (order_id);


--
-- Name: ccavenue_transactions ccavenue_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ccavenue_transactions
    ADD CONSTRAINT ccavenue_transactions_pkey PRIMARY KEY (id);


--
-- Name: ccavenue_transactions ccavenue_transactions_tracking_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ccavenue_transactions
    ADD CONSTRAINT ccavenue_transactions_tracking_id_unique UNIQUE (tracking_id);


--
-- Name: certificates certificates_application_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_application_id_unique UNIQUE (application_id);


--
-- Name: certificates certificates_certificate_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_number_unique UNIQUE (certificate_number);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: clarifications clarifications_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.clarifications
    ADD CONSTRAINT clarifications_pkey PRIMARY KEY (id);


--
-- Name: ddo_codes ddo_codes_district_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ddo_codes
    ADD CONSTRAINT ddo_codes_district_unique UNIQUE (district);


--
-- Name: ddo_codes ddo_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ddo_codes
    ADD CONSTRAINT ddo_codes_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: grievance_audit_log grievance_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_audit_log
    ADD CONSTRAINT grievance_audit_log_pkey PRIMARY KEY (id);


--
-- Name: grievance_comments grievance_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_comments
    ADD CONSTRAINT grievance_comments_pkey PRIMARY KEY (id);


--
-- Name: grievances grievances_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_pkey PRIMARY KEY (id);


--
-- Name: grievances grievances_ticket_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_ticket_number_unique UNIQUE (ticket_number);


--
-- Name: himkosh_transactions himkosh_transactions_app_ref_no_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.himkosh_transactions
    ADD CONSTRAINT himkosh_transactions_app_ref_no_unique UNIQUE (app_ref_no);


--
-- Name: himkosh_transactions himkosh_transactions_ech_txn_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.himkosh_transactions
    ADD CONSTRAINT himkosh_transactions_ech_txn_id_unique UNIQUE (ech_txn_id);


--
-- Name: himkosh_transactions himkosh_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.himkosh_transactions
    ADD CONSTRAINT himkosh_transactions_pkey PRIMARY KEY (id);


--
-- Name: homestay_applications homestay_applications_application_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_application_number_unique UNIQUE (application_number);


--
-- Name: homestay_applications homestay_applications_certificate_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_certificate_number_unique UNIQUE (certificate_number);


--
-- Name: homestay_applications homestay_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_pkey PRIMARY KEY (id);


--
-- Name: inspection_orders inspection_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_orders
    ADD CONSTRAINT inspection_orders_pkey PRIMARY KEY (id);


--
-- Name: inspection_reports inspection_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_reports
    ADD CONSTRAINT inspection_reports_pkey PRIMARY KEY (id);


--
-- Name: lgd_blocks lgd_blocks_lgd_code_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_blocks
    ADD CONSTRAINT lgd_blocks_lgd_code_unique UNIQUE (lgd_code);


--
-- Name: lgd_blocks lgd_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_blocks
    ADD CONSTRAINT lgd_blocks_pkey PRIMARY KEY (id);


--
-- Name: lgd_districts lgd_districts_district_name_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_districts
    ADD CONSTRAINT lgd_districts_district_name_unique UNIQUE (district_name);


--
-- Name: lgd_districts lgd_districts_lgd_code_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_districts
    ADD CONSTRAINT lgd_districts_lgd_code_unique UNIQUE (lgd_code);


--
-- Name: lgd_districts lgd_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_districts
    ADD CONSTRAINT lgd_districts_pkey PRIMARY KEY (id);


--
-- Name: lgd_gram_panchayats lgd_gram_panchayats_lgd_code_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_gram_panchayats
    ADD CONSTRAINT lgd_gram_panchayats_lgd_code_unique UNIQUE (lgd_code);


--
-- Name: lgd_gram_panchayats lgd_gram_panchayats_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_gram_panchayats
    ADD CONSTRAINT lgd_gram_panchayats_pkey PRIMARY KEY (id);


--
-- Name: lgd_tehsils lgd_tehsils_lgd_code_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_tehsils
    ADD CONSTRAINT lgd_tehsils_lgd_code_unique UNIQUE (lgd_code);


--
-- Name: lgd_tehsils lgd_tehsils_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_tehsils
    ADD CONSTRAINT lgd_tehsils_pkey PRIMARY KEY (id);


--
-- Name: lgd_urban_bodies lgd_urban_bodies_lgd_code_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_urban_bodies
    ADD CONSTRAINT lgd_urban_bodies_lgd_code_unique UNIQUE (lgd_code);


--
-- Name: lgd_urban_bodies lgd_urban_bodies_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_urban_bodies
    ADD CONSTRAINT lgd_urban_bodies_pkey PRIMARY KEY (id);


--
-- Name: login_otp_challenges login_otp_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.login_otp_challenges
    ADD CONSTRAINT login_otp_challenges_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: objections objections_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.objections
    ADD CONSTRAINT objections_pkey PRIMARY KEY (id);


--
-- Name: password_reset_challenges password_reset_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.password_reset_challenges
    ADD CONSTRAINT password_reset_challenges_pkey PRIMARY KEY (id);


--
-- Name: payments payments_gateway_transaction_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_gateway_transaction_id_unique UNIQUE (gateway_transaction_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_receipt_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_receipt_number_unique UNIQUE (receipt_number);


--
-- Name: production_stats production_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.production_stats
    ADD CONSTRAINT production_stats_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: storage_objects storage_objects_object_key_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.storage_objects
    ADD CONSTRAINT storage_objects_object_key_unique UNIQUE (object_key);


--
-- Name: storage_objects storage_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.storage_objects
    ADD CONSTRAINT storage_objects_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_ticket_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_ticket_number_unique UNIQUE (ticket_number);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_setting_key_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_setting_key_unique UNIQUE (setting_key);


--
-- Name: ticket_actions ticket_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_actions
    ADD CONSTRAINT ticket_actions_pkey PRIMARY KEY (id);


--
-- Name: ticket_messages ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);


--
-- Name: users users_aadhaar_number_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_aadhaar_number_unique UNIQUE (aadhaar_number);


--
-- Name: users users_mobile_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_mobile_unique UNIQUE (mobile);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_sso_id_unique; Type: CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_sso_id_unique UNIQUE (sso_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: app_dashboard_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX app_dashboard_idx ON public.homestay_applications USING btree (district, status);


--
-- Name: app_district_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX app_district_idx ON public.homestay_applications USING btree (district);


--
-- Name: app_kind_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX app_kind_idx ON public.homestay_applications USING btree (application_kind);


--
-- Name: app_status_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX app_status_idx ON public.homestay_applications USING btree (status);


--
-- Name: app_user_id_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX app_user_id_idx ON public.homestay_applications USING btree (user_id);


--
-- Name: users_district_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX users_district_idx ON public.users USING btree (district);


--
-- Name: users_mobile_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX users_mobile_idx ON public.users USING btree (mobile);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: hptourism_user
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: application_actions application_actions_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.application_actions
    ADD CONSTRAINT application_actions_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: application_actions application_actions_officer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.application_actions
    ADD CONSTRAINT application_actions_officer_id_users_id_fk FOREIGN KEY (officer_id) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ccavenue_transactions ccavenue_transactions_application_id_homestay_applications_id_f; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ccavenue_transactions
    ADD CONSTRAINT ccavenue_transactions_application_id_homestay_applications_id_f FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: certificates certificates_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_issued_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_issued_by_users_id_fk FOREIGN KEY (issued_by) REFERENCES public.users(id);


--
-- Name: certificates certificates_renewal_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_renewal_application_id_homestay_applications_id_fk FOREIGN KEY (renewal_application_id) REFERENCES public.homestay_applications(id);


--
-- Name: certificates certificates_revoked_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_revoked_by_users_id_fk FOREIGN KEY (revoked_by) REFERENCES public.users(id);


--
-- Name: clarifications clarifications_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.clarifications
    ADD CONSTRAINT clarifications_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: clarifications clarifications_objection_id_objections_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.clarifications
    ADD CONSTRAINT clarifications_objection_id_objections_id_fk FOREIGN KEY (objection_id) REFERENCES public.objections(id) ON DELETE CASCADE;


--
-- Name: clarifications clarifications_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.clarifications
    ADD CONSTRAINT clarifications_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: clarifications clarifications_submitted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.clarifications
    ADD CONSTRAINT clarifications_submitted_by_users_id_fk FOREIGN KEY (submitted_by) REFERENCES public.users(id);


--
-- Name: documents documents_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: documents documents_verified_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_verified_by_users_id_fk FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: grievance_audit_log grievance_audit_log_grievance_id_grievances_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_audit_log
    ADD CONSTRAINT grievance_audit_log_grievance_id_grievances_id_fk FOREIGN KEY (grievance_id) REFERENCES public.grievances(id) ON DELETE CASCADE;


--
-- Name: grievance_audit_log grievance_audit_log_performed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_audit_log
    ADD CONSTRAINT grievance_audit_log_performed_by_users_id_fk FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- Name: grievance_comments grievance_comments_grievance_id_grievances_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_comments
    ADD CONSTRAINT grievance_comments_grievance_id_grievances_id_fk FOREIGN KEY (grievance_id) REFERENCES public.grievances(id) ON DELETE CASCADE;


--
-- Name: grievance_comments grievance_comments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievance_comments
    ADD CONSTRAINT grievance_comments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: grievances grievances_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: grievances grievances_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: grievances grievances_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: himkosh_transactions himkosh_transactions_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.himkosh_transactions
    ADD CONSTRAINT himkosh_transactions_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: homestay_applications homestay_applications_da_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_da_id_users_id_fk FOREIGN KEY (da_id) REFERENCES public.users(id);


--
-- Name: homestay_applications homestay_applications_district_officer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_district_officer_id_users_id_fk FOREIGN KEY (district_officer_id) REFERENCES public.users(id);


--
-- Name: homestay_applications homestay_applications_dtdo_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_dtdo_id_users_id_fk FOREIGN KEY (dtdo_id) REFERENCES public.users(id);


--
-- Name: homestay_applications homestay_applications_site_inspection_officer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_site_inspection_officer_id_users_id_fk FOREIGN KEY (site_inspection_officer_id) REFERENCES public.users(id);


--
-- Name: homestay_applications homestay_applications_state_officer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_state_officer_id_users_id_fk FOREIGN KEY (state_officer_id) REFERENCES public.users(id);


--
-- Name: homestay_applications homestay_applications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.homestay_applications
    ADD CONSTRAINT homestay_applications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: inspection_orders inspection_orders_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_orders
    ADD CONSTRAINT inspection_orders_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: inspection_orders inspection_orders_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_orders
    ADD CONSTRAINT inspection_orders_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: inspection_orders inspection_orders_scheduled_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_orders
    ADD CONSTRAINT inspection_orders_scheduled_by_users_id_fk FOREIGN KEY (scheduled_by) REFERENCES public.users(id);


--
-- Name: inspection_reports inspection_reports_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_reports
    ADD CONSTRAINT inspection_reports_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: inspection_reports inspection_reports_inspection_order_id_inspection_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_reports
    ADD CONSTRAINT inspection_reports_inspection_order_id_inspection_orders_id_fk FOREIGN KEY (inspection_order_id) REFERENCES public.inspection_orders(id) ON DELETE CASCADE;


--
-- Name: inspection_reports inspection_reports_submitted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.inspection_reports
    ADD CONSTRAINT inspection_reports_submitted_by_users_id_fk FOREIGN KEY (submitted_by) REFERENCES public.users(id);


--
-- Name: lgd_blocks lgd_blocks_district_id_lgd_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_blocks
    ADD CONSTRAINT lgd_blocks_district_id_lgd_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.lgd_districts(id) ON DELETE CASCADE;


--
-- Name: lgd_blocks lgd_blocks_tehsil_id_lgd_tehsils_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_blocks
    ADD CONSTRAINT lgd_blocks_tehsil_id_lgd_tehsils_id_fk FOREIGN KEY (tehsil_id) REFERENCES public.lgd_tehsils(id) ON DELETE SET NULL;


--
-- Name: lgd_gram_panchayats lgd_gram_panchayats_block_id_lgd_blocks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_gram_panchayats
    ADD CONSTRAINT lgd_gram_panchayats_block_id_lgd_blocks_id_fk FOREIGN KEY (block_id) REFERENCES public.lgd_blocks(id) ON DELETE CASCADE;


--
-- Name: lgd_gram_panchayats lgd_gram_panchayats_district_id_lgd_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_gram_panchayats
    ADD CONSTRAINT lgd_gram_panchayats_district_id_lgd_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.lgd_districts(id) ON DELETE CASCADE;


--
-- Name: lgd_tehsils lgd_tehsils_district_id_lgd_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_tehsils
    ADD CONSTRAINT lgd_tehsils_district_id_lgd_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.lgd_districts(id) ON DELETE CASCADE;


--
-- Name: lgd_urban_bodies lgd_urban_bodies_district_id_lgd_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.lgd_urban_bodies
    ADD CONSTRAINT lgd_urban_bodies_district_id_lgd_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.lgd_districts(id) ON DELETE CASCADE;


--
-- Name: login_otp_challenges login_otp_challenges_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.login_otp_challenges
    ADD CONSTRAINT login_otp_challenges_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: notifications notifications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: objections objections_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.objections
    ADD CONSTRAINT objections_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE CASCADE;


--
-- Name: objections objections_inspection_report_id_inspection_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.objections
    ADD CONSTRAINT objections_inspection_report_id_inspection_reports_id_fk FOREIGN KEY (inspection_report_id) REFERENCES public.inspection_reports(id);


--
-- Name: objections objections_raised_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.objections
    ADD CONSTRAINT objections_raised_by_users_id_fk FOREIGN KEY (raised_by) REFERENCES public.users(id);


--
-- Name: objections objections_resolved_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.objections
    ADD CONSTRAINT objections_resolved_by_users_id_fk FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: password_reset_challenges password_reset_challenges_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.password_reset_challenges
    ADD CONSTRAINT password_reset_challenges_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: reviews reviews_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: reviews reviews_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: storage_objects storage_objects_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.storage_objects
    ADD CONSTRAINT storage_objects_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id) ON DELETE SET NULL;


--
-- Name: storage_objects storage_objects_document_id_documents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.storage_objects
    ADD CONSTRAINT storage_objects_document_id_documents_id_fk FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE SET NULL;


--
-- Name: storage_objects storage_objects_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.storage_objects
    ADD CONSTRAINT storage_objects_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_applicant_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_applicant_id_users_id_fk FOREIGN KEY (applicant_id) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_application_id_homestay_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_application_id_homestay_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.homestay_applications(id);


--
-- Name: support_tickets support_tickets_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_escalated_from_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_escalated_from_users_id_fk FOREIGN KEY (escalated_from) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_resolved_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_resolved_by_users_id_fk FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: system_settings system_settings_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: ticket_actions ticket_actions_actor_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_actions
    ADD CONSTRAINT ticket_actions_actor_id_users_id_fk FOREIGN KEY (actor_id) REFERENCES public.users(id);


--
-- Name: ticket_actions ticket_actions_new_assignee_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_actions
    ADD CONSTRAINT ticket_actions_new_assignee_users_id_fk FOREIGN KEY (new_assignee) REFERENCES public.users(id);


--
-- Name: ticket_actions ticket_actions_previous_assignee_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_actions
    ADD CONSTRAINT ticket_actions_previous_assignee_users_id_fk FOREIGN KEY (previous_assignee) REFERENCES public.users(id);


--
-- Name: ticket_actions ticket_actions_ticket_id_support_tickets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_actions
    ADD CONSTRAINT ticket_actions_ticket_id_support_tickets_id_fk FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;


--
-- Name: ticket_messages ticket_messages_sender_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_sender_id_users_id_fk FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: ticket_messages ticket_messages_ticket_id_support_tickets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_ticket_id_support_tickets_id_fk FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: hptourism_user
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6yg3E7ydTdGRbiplr0ViRL4TBVdzb8XNuEWLoX8wgOFHc1dr5NXjv0PhXuU1Sty

