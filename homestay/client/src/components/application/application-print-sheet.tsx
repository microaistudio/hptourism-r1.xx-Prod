/**
 * ApplicationPrintSheet - Print-friendly application summary for officers
 * Used by DA, DTDO, and other officer dashboards
 */
import { format } from "date-fns";
import type { HomestayApplication } from "@shared/schema";
import { formatDateIST, formatDateTimeIST } from "@/lib/dateUtils";
import himachalTourismLogo from "@/assets/logos_tr/HP_Touris_TR.png";

interface PrintSheetProps {
    application: HomestayApplication;
    owner: {
        fullName: string;
        mobile: string;
        email: string | null;
    } | null;
    documents?: Array<{
        id: string;
        documentType: string;
        fileName?: string | null;
        verificationStatus?: string | null;
    }>;
}

// Helper functions
const displayValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

const formatCurrency = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    return `₹${num.toLocaleString("en-IN")}`;
};

const formatDistance = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return "—";
    return `${num} km`;
};

const formatArea = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (!Number.isFinite(num) || num === 0) return "—";
    return `${num} sq ft`;
};

const formatDocumentType = (value?: string | null): string => {
    if (!value) return "Document";
    return value
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusLabel = (status?: string | null): string => {
    const labels: Record<string, string> = {
        draft: "Draft",
        submitted: "Submitted",
        under_scrutiny: "Under Scrutiny",
        forwarded_to_dtdo: "Forwarded to DTDO",
        dtdo_review: "DTDO Review",
        inspection_scheduled: "Inspection Scheduled",
        inspection_under_review: "Inspection Review",
        approved: "Approved",
        rejected: "Rejected",
        reverted_to_applicant: "Sent Back",
        legacy_rc_review: "Legacy RC Review",
    };
    return labels[status || ""] || status || "Unknown";
};

const getLocationTypeLabel = (type?: string | null): string => {
    const labels: Record<string, string> = {
        mc: "Municipal Corporation / Council",
        tcp: "Town & Country Planning / SADA",
        gp: "Gram Panchayat",
    };
    return labels[type || ""] || type || "—";
};

const getProjectTypeLabel = (type?: string | null): string => {
    if (type === "new_project") return "New Project";
    if (type === "new_rooms") return "Existing + New Rooms";
    return displayValue(type);
};

const getOwnershipLabel = (type?: string | null): string => {
    if (!type) return "—";
    return type.charAt(0).toUpperCase() + type.slice(1);
};

export function ApplicationPrintSheet({ application, owner, documents = [] }: PrintSheetProps) {
    const printGeneratedAt = new Date();
    const submissionDate = application.submittedAt ? new Date(application.submittedAt) : null;
    const lastUpdatedAt = application.updatedAt ? new Date(application.updatedAt) : null;

    // Parse amenities
    let amenities: Record<string, boolean> = {};
    if (application.amenities) {
        if (typeof application.amenities === "string") {
            try {
                amenities = JSON.parse(application.amenities);
            } catch {
                amenities = {};
            }
        } else if (typeof application.amenities === "object") {
            amenities = application.amenities as Record<string, boolean>;
        }
    }

    const amenityLabels: Record<string, string> = {
        ac: "Air Conditioning",
        wifi: "WiFi",
        parking: "Parking",
        restaurant: "Dining Area",
        hotWater: "Hot Water",
        tv: "Television",
        laundry: "Laundry Service",
        roomService: "Room Service",
        garden: "Garden",
        mountainView: "Mountain View",
        petFriendly: "Pet Friendly",
        cctv: "CCTV",
        fireSafety: "Fire Safety",
    };

    const selectedAmenities = Object.entries(amenities)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => amenityLabels[key] || key);

    return (
        <div
            id="application-print-sheet"
            className="print-only application-print-sheet text-black text-sm leading-relaxed"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="text-left">
                    <p className="uppercase tracking-[0.35em] text-[11px] text-gray-500">
                        Government of Himachal Pradesh
                    </p>
                    <h1 className="text-2xl font-semibold mt-1">HP Tourism eServices</h1>
                    <p className="text-sm text-gray-600">Homestay Registration Application</p>
                </div>
                <img src={himachalTourismLogo} alt="Himachal Tourism" className="h-14 w-auto" />
            </div>

            {/* Application Status Section */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-lg p-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Application Number</p>
                        <p className="font-semibold">{displayValue(application.applicationNumber)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Current Status</p>
                        <p className="font-semibold">{getStatusLabel(application.status)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Submitted On</p>
                        <p>
                            {submissionDate
                                ? formatDateIST(submissionDate)
                                : "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Last Updated</p>
                        <p>
                            {lastUpdatedAt
                                ? formatDateIST(lastUpdatedAt)
                                : "—"}
                        </p>
                    </div>
                </div>
            </section>

            {/* 1. Property Snapshot */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">1. Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Property Name</p>
                        <p>{displayValue(application.propertyName)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Category</p>
                        <p>{application.category?.toUpperCase() || "—"}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs uppercase text-gray-500">Address</p>
                        <p>{displayValue(application.address)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Location Type</p>
                        <p>{getLocationTypeLabel(application.locationType)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">District / Tehsil</p>
                        <p>
                            {displayValue(application.district)} · {displayValue(application.tehsil)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">
                            {application.locationType === "gp" ? "Gram Panchayat" : "Urban Body"}
                        </p>
                        <p>
                            {displayValue(application.gramPanchayat || application.urbanBody)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">PIN Code</p>
                        <p>{displayValue(application.pincode)}</p>
                    </div>
                </div>
            </section>

            {/* 2. Owner & Contact */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">2. Owner & Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Owner Name</p>
                        <p>{displayValue(application.ownerName || owner?.fullName)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Mobile Number</p>
                        <p>{displayValue(application.ownerMobile || owner?.mobile)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Email Address</p>
                        <p>{displayValue(application.ownerEmail || owner?.email)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Gender</p>
                        <p>{application.ownerGender ? getOwnershipLabel(application.ownerGender) : "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Aadhaar Number</p>
                        <p>
                            {application.ownerAadhaar
                                ? application.ownerAadhaar.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")
                                : "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Telephone</p>
                        <p>{displayValue(application.telephone)}</p>
                    </div>
                </div>
            </section>

            {/* 3. Accommodation & Tariffs */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">3. Accommodation & Tariffs</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Project Type</p>
                        <p>{getProjectTypeLabel(application.projectType)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Ownership Type</p>
                        <p>{getOwnershipLabel(application.propertyOwnership)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Total Rooms</p>
                        <p>{displayValue(application.totalRooms)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Attached Washrooms</p>
                        <p>{displayValue(application.attachedWashrooms)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Single Bed Rooms</p>
                        <p>
                            {displayValue(application.singleBedRooms)} @ {formatCurrency(application.singleBedRoomRate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Double Bed Rooms</p>
                        <p>
                            {displayValue(application.doubleBedRooms)} @ {formatCurrency(application.doubleBedRoomRate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Family Suites</p>
                        <p>
                            {displayValue(application.familySuites)} @ {formatCurrency(application.familySuiteRate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Proposed Tariff (Max)</p>
                        <p>{formatCurrency(application.proposedRoomRate || application.highestRoomRate)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">GSTIN</p>
                        <p>{displayValue(application.gstin)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Certificate Validity</p>
                        <p>
                            {application.certificateValidityYears
                                ? `${application.certificateValidityYears} year${application.certificateValidityYears > 1 ? "s" : ""}`
                                : "—"}
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Distances & Facilities */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">4. Distances & Facilities</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Airport</p>
                        <p>{formatDistance(application.distanceAirport)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Railway Station</p>
                        <p>{formatDistance(application.distanceRailway)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">City Center</p>
                        <p>{formatDistance(application.distanceCityCenter)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Bus Stand</p>
                        <p>{formatDistance(application.distanceBusStand)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Shopping Area</p>
                        <p>{formatDistance(application.distanceShopping)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Nearest Hospital</p>
                        <p>{displayValue(application.nearestHospital)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                        <p className="text-xs uppercase text-gray-500">Lobby Area</p>
                        <p>{formatArea(application.lobbyArea)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Dining Area</p>
                        <p>{formatArea(application.diningArea)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-gray-500">Parking Capacity</p>
                        <p>{displayValue(application.parkingArea)}</p>
                    </div>
                </div>
            </section>

            {/* 5. Amenities */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">5. Amenities</h2>
                {selectedAmenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedAmenities.map((label) => (
                            <span key={label} className="border border-gray-300 rounded-full px-3 py-1 text-sm">
                                {label}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No amenities declared.</p>
                )}
            </section>

            {/* 6. Fee Summary */}
            <section className="space-y-3 break-inside-avoid mb-6">
                <h2 className="text-lg font-semibold border-b pb-1">6. Fee Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                        <p className="text-xs uppercase text-gray-500">Base Fee</p>
                        <p className="text-lg font-semibold">{formatCurrency(application.baseFee)}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                        <p className="text-xs uppercase text-gray-500">Discounts</p>
                        <p className="text-lg font-semibold">{formatCurrency(application.totalDiscount)}</p>
                    </div>
                    <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                        <p className="text-xs uppercase text-emerald-700">Total Payable</p>
                        <p className="text-xl font-bold text-emerald-900">
                            {formatCurrency(application.totalFee || application.baseFee)}
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. Documents */}
            {documents.length > 0 && (
                <section className="space-y-3 break-inside-avoid mb-6">
                    <h2 className="text-lg font-semibold border-b pb-1">7. Attached Documents</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-1 text-xs uppercase text-gray-500">Document Type</th>
                                <th className="text-left py-1 text-xs uppercase text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} className="border-b border-gray-100">
                                    <td className="py-1">{formatDocumentType(doc.documentType)}</td>
                                    <td className="py-1">
                                        {doc.verificationStatus === "verified"
                                            ? "✓ Verified"
                                            : doc.verificationStatus === "rejected"
                                                ? "✗ Rejected"
                                                : doc.verificationStatus === "needs_correction"
                                                    ? "⚠ Needs Correction"
                                                    : "Pending"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* Footer */}
            <section className="text-xs text-gray-600 border-t border-gray-200 pt-4 mt-6">
                <p>
                    Generated on{" "}
                    {formatDateTimeIST(printGeneratedAt)}
                </p>
                <p className="text-gray-400 mt-1">
                    HP Tourism Homestay Portal • https://homestay.hp.gov.in
                </p>
            </section>
        </div>
    );
}
