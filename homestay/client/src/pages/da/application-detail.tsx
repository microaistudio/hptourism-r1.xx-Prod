import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { formatDateTimeIST, formatTimeIST } from "@/lib/dateUtils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildObjectViewUrl, cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  Save,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { HomestayApplication, Document } from "@shared/schema";
import { isLegacyApplication } from "@shared/legacy";
import { LOCATION_TYPE_OPTIONS } from "@shared/regions";
import type { LocationType } from "@shared/fee-calculator";

import { ApplicationTimelineCard } from "@/components/application/application-timeline-card";
import { InspectionReportCard } from "@/components/application/inspection-report-card";
import { ApplicationPrintSheet } from "@/components/application/application-print-sheet";

interface ApplicationData {
  application: HomestayApplication;
  owner: {
    fullName: string;
    mobile: string;
    email: string | null;
  } | null;
  documents: Document[];
  sendBackEnabled?: boolean;
  legacyForwardEnabled?: boolean;
  correctionHistory?: Array<{
    id: string;
    createdAt: string;
    feedback?: string | null;
  }>;
}

interface DocumentVerification {
  documentId: string;
  status: 'pending' | 'verified' | 'rejected' | 'needs_correction';
  notes: string;
}

const formatCorrectionTimestamp = (value?: string | null) => {
  if (!value) return "No resubmission yet";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "No resubmission yet" : formatDateTimeIST(parsed);
};

// Sort documents by upload timestamp (oldest first = original upload order)
const DOCUMENT_PRIORITY: Record<string, number> = {
  "revenue-papers": 1,
  "affidavit-section29": 2,
  "undertaking-form-c": 3,
  "commercial-electricity-bill": 4,
  "commercial-water-bill": 5,
  "property-photo": 6,
  "additional-document": 7,
};

// Sort documents by Document Type Priority first, then by upload timestamp
const sortDocumentsByUploadOrder = (docs: Document[]): Document[] => {
  return [...docs].sort((a, b) => {
    // 1. Priority Sort
    const typeA = a.documentType.replace(/_/g, "-").toLowerCase();
    const typeB = b.documentType.replace(/_/g, "-").toLowerCase();

    const priorityA = DOCUMENT_PRIORITY[typeA] ?? 99;
    const priorityB = DOCUMENT_PRIORITY[typeB] ?? 99;
    if (priorityA !== priorityB) return priorityA - priorityB;

    // 2. Timestamp Sort (Oldest first)
    const timeA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
    const timeB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
    if (timeA !== timeB) return timeA - timeB;

    // 3. ID Sort (Consistency)
    return a.id.localeCompare(b.id);
  });
};

export default function DAApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Parse queue from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const queueParam = searchParams.get('queue');
  const applicationQueue = queueParam ? queueParam.split(',') : [];
  const currentIndex = applicationQueue.indexOf(id || '');
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < applicationQueue.length - 1;

  // All state hooks MUST come before any conditional returns
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [sendBackDialogOpen, setSendBackDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [legacyVerifyDialogOpen, setLegacyVerifyDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [reason, setReason] = useState("");
  const [legacyRemarks, setLegacyRemarks] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    requestAnimationFrame(() => {
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        return;
      }
      const card = cardRefs.current[doc.id];
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    });
  };

  // Document verification state
  const [verifications, setVerifications] = useState<Record<string, DocumentVerification>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const verificationsRef = useRef<Record<string, DocumentVerification>>({});
  useEffect(() => {
    verificationsRef.current = verifications;
  }, [verifications]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep preview in view when jumping to documents lower in the list
  useEffect(() => {
    if (selectedDocument) {
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }
  }, [selectedDocument]);

  // Navigation functions
  const navigateToApplication = (targetId: string) => {
    const queue = applicationQueue.join(',');
    setLocation(`/da/applications/${targetId}?queue=${encodeURIComponent(queue)}`);
  };

  const goToPrevious = () => {
    if (hasPrevious) {
      navigateToApplication(applicationQueue[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      navigateToApplication(applicationQueue[currentIndex + 1]);
    }
  };

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft' && hasPrevious) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasPrevious, hasNext, currentIndex]);

  const { data, isLoading } = useQuery<ApplicationData>({
    queryKey: ["/api/da/applications", id],
    enabled: !!id, // Only run query if id exists
  });
  const applicationStatus = data?.application?.status;
  const sendBackEnabled = data?.sendBackEnabled ?? false;
  const editableStatuses = new Set(["under_scrutiny", "legacy_rc_review"]);
  const documentActionsDisabled = !editableStatuses.has(applicationStatus || "");
  const correctionHistory = data?.correctionHistory ?? [];

  // Start Scrutiny Mutation
  const startScrutinyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/da/applications/${id}/start-scrutiny`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications", id, "timeline"] });
      toast({
        title: "Scrutiny Started",
        description: "Application is now under your review",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start scrutiny",
        variant: "destructive",
      });
    },
  });

  const legacyVerifyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/applications/${id}/legacy-verify`, {
        remarks: legacyRemarks.trim() || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications"] });
      toast({
        title: "Legacy RC verified",
        description: "Application marked complete without forwarding to DTDO.",
      });
      setLegacyVerifyDialogOpen(false);
      setLegacyRemarks("");
      setLocation("/da/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to verify",
        description: error.message || "Unable to verify this legacy request.",
        variant: "destructive",
      });
    },
  });

  const saveVerifications = useCallback(async () => {
    return await apiRequest("POST", `/api/da/applications/${id}/save-scrutiny`, {
      verifications: Object.values(verificationsRef.current),
    });
  }, [id]);

  const clearAutoSaveTimer = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  };

  // Save Scrutiny Progress Mutation
  const saveProgressMutation = useMutation({
    mutationFn: async () => {
      if (documentActionsDisabled) {
        toast({
          title: "Read-only",
          description: "This application has already been forwarded to DTDO.",
        });
        return;
      }
      return await saveVerifications();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications"] });
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      toast({
        title: "Progress Saved",
        description: "Your verification progress has been saved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    },
  });
  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async () => {
      if (documentActionsDisabled) return;
      await saveVerifications();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications", id] });
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    },
    onError: () => {
      toast({
        title: "Auto-save failed",
        description: "Could not save the latest verification updates. Click Save Progress to retry.",
        variant: "destructive",
      });
    },
  });

  const statusMessage = useMemo(() => {
    if (saveProgressMutation.isPending || autoSaveMutation.isPending) {
      return "Saving...";
    }
    if (hasUnsavedChanges) {
      return "Unsaved changes";
    }
    if (lastSavedAt) {
      return `Saved at ${formatTimeIST(lastSavedAt)}`;
    }
    return "";
  }, [
    saveProgressMutation.isPending,
    autoSaveMutation.isPending,
    hasUnsavedChanges,
    lastSavedAt,
  ]);

  const scheduleAutoSave = useCallback(() => {
    if (documentActionsDisabled) {
      return;
    }
    setHasUnsavedChanges(true);
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSaveMutation.mutate();
      autoSaveTimeoutRef.current = null;
    }, 1200);
  }, [autoSaveMutation, documentActionsDisabled]);

  useEffect(() => {
    return () => {
      clearAutoSaveTimer();
    };
  }, []);


  // Forward to DTDO Mutation
  const forwardMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/da/applications/${id}/forward-to-dtdo`, { remarks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications", id, "timeline"] });
      setForwardDialogOpen(false);
      setRemarks("");
      toast({
        title: "Application Forwarded",
        description: "Application has been sent to DTDO successfully",
      });
      setLocation("/da/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to forward application",
        variant: "destructive",
      });
    },
  });

  // OTP States
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMobile, setOtpMobile] = useState<string>("");

  // Revert Count Logic
  // data might be undefined initially, handle safely
  const revertCount = data?.application?.revertCount ?? 0;
  const isSecondRevert = revertCount >= 1; // 0 = first time, 1 = second time (will reject)

  // OTP Request Mutation
  const requestOtpMutation = useMutation({
    mutationFn: async () => {
      // Use "reason" state which is defined in the component scope
      const res = await apiRequest("POST", "/api/sendback-otp/request", {
        applicationId: id,
        reason: reason
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setOtpSent(true);
      setShowOtpInput(true);
      const mobile = data.maskedMobile || "";
      setOtpMobile(mobile);
      toast({
        title: "OTP Sent",
        description: `OTP has been sent to DTDO's registered mobile number (xxxxxx${data.dtdoPhoneLast4 || mobile.slice(-4)})`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // OTP Verify Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sendback-otp/verify", {
        applicationId: id,
        otp: otp
      });
    },
    onSuccess: () => {
      setOtpVerified(true);
      toast({
        title: "OTP Verified",
        description: "DTDO authorization confirmed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid OTP",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Send Back Mutation
  const sendBackMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/da/applications/${id}/send-back`, {
        reason,
        otpVerified: isSecondRevert ? true : otpVerified
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/da/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications", id, "timeline"] });
      setSendBackDialogOpen(false);
      setReason("");
      setOtp("");
      setShowOtpInput(false);
      setOtpSent(false);
      setOtpVerified(false);

      if (data.autoRejected) {
        toast({
          title: "Application Rejected",
          description: data.message || "Application has been automatically rejected due to repeated corrections.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Application Sent Back",
          description: "Application has been returned to the applicant",
        });
      }
      setLocation("/da/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send back application",
        variant: "destructive",
      });
    },
  });

  // Reset OTP state when dialog closes
  useEffect(() => {
    if (!sendBackDialogOpen) {
      setOtp("");
      setShowOtpInput(false);
      setOtpSent(false);
      setOtpVerified(false);
    }
  }, [sendBackDialogOpen]);

  // Initialize verification states for documents (in useEffect to avoid render-time state updates)
  // Re-hydrate ONLY when application ID changes or first load, to avoid overwriting local changes with stale server data during auto-save
  const [initializedId, setInitializedId] = useState<string | null>(null);
  // Stable document array - only set once per application to prevent reordering during refetches
  const [stableDocuments, setStableDocuments] = useState<Document[]>([]);

  // Document navigation within preview (must be after stableDocuments is defined)
  const currentDocIndex = useMemo(() => {
    if (!selectedDocument || !stableDocuments.length) return -1;
    return stableDocuments.findIndex(doc => doc.id === selectedDocument.id);
  }, [selectedDocument, stableDocuments]);

  const hasPreviousDocument = currentDocIndex > 0;
  const hasNextDocument = currentDocIndex >= 0 && currentDocIndex < stableDocuments.length - 1;

  const goToPreviousDocument = useCallback(() => {
    if (hasPreviousDocument) {
      handleSelectDocument(stableDocuments[currentDocIndex - 1]);
    }
  }, [currentDocIndex, hasPreviousDocument, stableDocuments]);

  const goToNextDocument = useCallback(() => {
    if (hasNextDocument) {
      handleSelectDocument(stableDocuments[currentDocIndex + 1]);
    }
  }, [currentDocIndex, hasNextDocument, stableDocuments]);

  useEffect(() => {
    if (!id || !data?.documents) return;

    // Only initialize if we haven't done so for this ID yet
    if (initializedId === id) return;

    if (data.documents.length > 0) {
      // Store stable document order on first load only - sorted by document type
      setStableDocuments(sortDocumentsByUploadOrder(data.documents));

      const initialVerifications: Record<string, DocumentVerification> = {};
      data.documents.forEach(doc => {
        initialVerifications[doc.id] = {
          documentId: doc.id,
          status: doc.verificationStatus as any || 'pending',
          notes: doc.verificationNotes || '',
        };
      });
      setVerifications(initialVerifications);

      // Auto-select first document if no document currently selected
      // OR if the selected document's ID doesn't exist in new documents (stale after navigation)
      setSelectedDocument(prevSelected => {
        const documentIds = data.documents.map(d => d.id);
        if (!prevSelected || !documentIds.includes(prevSelected.id)) {
          return data.documents[0];
        }
        return prevSelected;
      });
    } else {
      // Clear state when navigating to application with no documents
      setStableDocuments([]);
      setVerifications({});
      setSelectedDocument(null);
    }

    setInitializedId(id);
  }, [data?.documents, id, initializedId]);

  // Check for missing id AFTER all hooks are called
  if (!id) {
    setLocation("/da/dashboard");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Application not found</p>
        </div>
      </div>
    );
  }

  const { application, owner, documents: _ } = data;
  // Use stable documents that don't change order during refetches
  const documents = stableDocuments.length > 0 ? stableDocuments : data.documents;
  const isLegacyRequest = isLegacyApplication(application);
  const legacyForwardAllowed = !isLegacyRequest || data.legacyForwardEnabled !== false;
  const canStartScrutiny = application.status === 'submitted';
  const canEditDuringScrutiny = editableStatuses.has(application.status || "");
  const showReadOnlyNotice = !canStartScrutiny && !canEditDuringScrutiny;
  const canLegacyVerify =
    isLegacyRequest &&
    ["legacy_rc_review", "submitted", "under_scrutiny"].includes(application.status ?? "");

  const locationTypeLabel = formatLocationTypeLabel(application.locationType as LocationType | undefined);
  const projectTypeLabel = formatProjectTypeLabel(application.projectType);
  const ownershipLabel = formatOwnershipLabel(application.propertyOwnership);
  const propertyAreaLabel = formatArea(application.propertyArea);
  const certificateValidityLabel = formatCertificateValidity(application.certificateValidityYears);
  const formattedAddress = formatMultilineAddress(application.address);
  const tehsilLabel = application.tehsilOther || application.tehsil;
  const gramPanchayatLabel = application.gramPanchayatOther || application.gramPanchayat;
  const urbanBodyLabel = application.urbanBodyOther || application.urbanBody;
  const wardLabel = application.ward;
  const telephoneValue = application.telephone || owner?.mobile || undefined;

  const singleRooms = application.singleBedRooms ?? 0;
  const doubleRooms = application.doubleBedRooms ?? 0;
  const familySuites = application.familySuites ?? 0;
  const singleBedsPerRoom = application.singleBedBeds ?? (singleRooms > 0 ? 1 : 0);
  const doubleBedsPerRoom = application.doubleBedBeds ?? (doubleRooms > 0 ? 2 : 0);
  const suiteBedsPerRoom = application.familySuiteBeds ?? (familySuites > 0 ? 4 : 0);
  const calculatedTotalRooms = application.totalRooms ?? singleRooms + doubleRooms + familySuites;
  const totalBeds =
    singleRooms * singleBedsPerRoom +
    doubleRooms * doubleBedsPerRoom +
    familySuites * suiteBedsPerRoom;
  const attachedWashrooms = application.attachedWashrooms ?? 0;
  const attachedWashroomsDisplay = calculatedTotalRooms
    ? `${attachedWashrooms} of ${calculatedTotalRooms}`
    : formatCount(attachedWashrooms);

  const amenities = normalizeAmenities(application.amenities as unknown);
  const amenitiesSelected = Object.values(amenities).filter(Boolean).length;
  const amenitiesTotal = Object.keys(amenities).length || 0;
  const safetyStatus =
    amenities.cctv && amenities.fireSafety ? "CCTV & Fire Safety confirmed" : "Pending owner confirmation";

  const distanceSummary = buildDistanceSummary({
    airport: application.distanceAirport,
    railway: application.distanceRailway,
    city: application.distanceCityCenter,
    bus: application.distanceBusStand,
    shopping: application.distanceShopping,
  });

  const baseFeeValue = formatCurrency(application.baseFee ?? 0);
  const totalFeeValue = formatCurrency(application.totalFee ?? application.baseFee);
  const femaleDiscountValue = formatCurrency(application.femaleOwnerDiscount);
  const pangiDiscountValue = formatCurrency(application.pangiDiscount);
  const validityDiscountValue = formatCurrency(application.validityDiscount);
  const totalDiscountValue = formatCurrency(application.totalDiscount);
  const highestRateValue = formatCurrency(application.highestRoomRate ?? application.proposedRoomRate);
  const singleRoomRateValue = formatCurrency(application.singleBedRoomRate);
  const doubleRoomRateValue = formatCurrency(application.doubleBedRoomRate);
  const suiteRateValue = formatCurrency(application.familySuiteRate);

  // Calculate verification progress - count any non-pending status as complete (verified, rejected, needs_correction)
  const totalDocs = documents.length;
  const completedDocs = Object.values(verifications).filter(v => v.status !== 'pending').length;
  const progress = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  const isServiceRequestWithoutDocs = ['cancel_certificate', 'delete_rooms'].includes(application.applicationKind || '');

  const requireAllDocumentsReviewed = () => {
    if (!legacyForwardAllowed) {
      toast({
        title: "DTDO escalation disabled",
        description: "Legacy RC onboarding must be verified and closed by the DA.",
        variant: "destructive",
      });
      return false;
    }

    // Bypass document checks for service requests that don't require them
    if (isServiceRequestWithoutDocs) {
      return true;
    }

    if (totalDocs === 0) {
      toast({
        title: "Documents required",
        description: "Required documents must be uploaded and reviewed before forwarding to DTDO.",
        variant: "destructive",
      });
      return false;
    }
    if (completedDocs < totalDocs) {
      toast({
        title: "Complete document verification",
        description: "Mark every document as Verified / Needs correction / Rejected before forwarding.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  const canForward = legacyForwardAllowed && (isServiceRequestWithoutDocs || (totalDocs > 0 && completedDocs === totalDocs));
  const requireRemarks = () => {
    if (remarks.trim().length === 0) {
      toast({
        title: "Add your remarks",
        description: "Summarize your scrutiny observations before forwarding to DTDO.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const updateVerification = (docId: string, updates: Partial<DocumentVerification>) => {
    if (documentActionsDisabled) {
      toast({
        title: "Read-only",
        description: "This application has already been forwarded to DTDO.",
      });
      return;
    }
    setVerifications(prev => ({
      ...prev,
      [docId]: { ...prev[docId], ...updates }
    }));
    scheduleAutoSave();
  };

  const toggleNotes = (docId: string) => {
    setExpandedNotes(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-300 dark:border-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-300 dark:border-red-700">
            <XCircle className="w-3 h-3 mr-1" />Rejected
          </span>
        );
      case 'needs_correction':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <AlertCircle className="w-3 h-3 mr-1" />Needs Correction
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
            Pending Review
          </span>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 dark:text-green-400';
      case 'rejected': return 'text-red-600 dark:text-red-400';
      case 'needs_correction': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
      {/* Print-only Application Summary */}
      <ApplicationPrintSheet
        application={application}
        owner={owner}
        documents={documents.map(d => ({
          id: d.id,
          documentType: d.documentType,
          fileName: d.fileName,
          verificationStatus: verifications[d.id]?.status || d.verificationStatus,
        }))}
      />

      {/* Screen-only Content */}
      <div className="print:hidden container mx-auto p-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/da/dashboard")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-2">{application.propertyName}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <span>Application #{application.applicationNumber}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{owner?.fullName} • {owner?.mobile}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline">{application.category?.toUpperCase() ?? 'SILVER'}</Badge>
                {applicationQueue.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-xs font-medium">
                      {currentIndex + 1} of {applicationQueue.length}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            {applicationQueue.length > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={!hasPrevious}
                  data-testid="button-previous"
                  title="Previous application (←)"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={!hasNext}
                  data-testid="button-next"
                  title="Next application (→)"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              {/* Print Button - Always visible */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                data-testid="button-print-application"
                title="Print application summary"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {canLegacyVerify && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLegacyVerifyDialogOpen(true)}
                    disabled={legacyVerifyMutation.isPending}
                    data-testid="button-legacy-verify-da"
                  >
                    {legacyVerifyMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Verify Legacy RC
                  </Button>
                </>
              )}
              {canStartScrutiny && (
                <Button
                  onClick={() => startScrutinyMutation.mutate()}
                  disabled={startScrutinyMutation.isPending}
                  data-testid="button-start-scrutiny"
                >
                  {startScrutinyMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Start Scrutiny
                </Button>
              )}

              {canEditDuringScrutiny && (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          clearAutoSaveTimer();
                          saveProgressMutation.mutate();
                        }}
                        disabled={saveProgressMutation.isPending}
                        data-testid="button-save-progress"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Progress
                      </Button>
                    </div>
                  </div>
                  {sendBackEnabled && (
                    <Button
                      variant="warning"
                      onClick={() => setSendBackDialogOpen(true)}
                      data-testid="button-send-back"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Send Back
                    </Button>
                  )}
                  {legacyForwardAllowed ? (
                    <Button
                      onClick={() => {
                        if (requireAllDocumentsReviewed()) {
                          setForwardDialogOpen(true);
                        }
                      }}
                      data-testid="button-forward"
                      disabled={!canForward}
                      title={!canForward ? "Verify every document before forwarding" : undefined}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Forward to DTDO
                    </Button>
                  ) : (
                    isLegacyRequest && (
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Legacy RC onboarding must be completed by the DA. DTDO escalation is currently disabled by admin settings.
                      </p>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {showReadOnlyNotice && (
          <div className="mb-6 rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            This application is currently {application.status?.replace(/_/g, " ") || "processed"}. Document verification is read-only.
          </div>
        )}

        {/* Progress Bar */}
        {canEditDuringScrutiny && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Label>Document Verification Progress</Label>
                <span className="text-sm font-medium">{completedDocs} / {totalDocs} documents reviewed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Main Content - Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents" data-testid="tab-documents">
              <FileText className="w-4 h-4 mr-2" />
              Document Verification ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="details" data-testid="tab-details">
              Property & Owner Details
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab - Split Screen */}
          <TabsContent value="documents" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Document Preview */}
              <div ref={previewRef} className="lg:sticky lg:top-24 self-start">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">Document Preview</CardTitle>
                        <CardDescription className="truncate">
                          {selectedDocument ? selectedDocument.fileName : "Select a document to preview"}
                        </CardDescription>
                      </div>
                      {/* Navigation & Action Buttons */}
                      {selectedDocument && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousDocument}
                            disabled={!hasPreviousDocument}
                            title="Previous document"
                            data-testid="button-prev-document"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">
                            {currentDocIndex + 1} of {stableDocuments.length}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextDocument}
                            disabled={!hasNextDocument}
                            title="Next document"
                            data-testid="button-next-document"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="Open in new tab"
                            data-testid="button-open-new-tab"
                          >
                            <a
                              href={buildObjectViewUrl(selectedDocument.filePath, {
                                mimeType: selectedDocument.mimeType,
                                fileName: selectedDocument.fileName,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedDocument ? (
                      <div className="space-y-4">
                        {/* Document Info */}
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-medium truncate">{selectedDocument.documentType}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(selectedDocument.fileSize / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          {getStatusBadge(verifications[selectedDocument.id]?.status || 'pending')}
                        </div>

                        {/* Document Viewer */}
                        <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-[400px] flex items-center justify-center">
                          {selectedDocument.mimeType.startsWith('image/') ? (
                            <img
                              src={buildObjectViewUrl(selectedDocument.filePath, {
                                mimeType: selectedDocument.mimeType,
                                fileName: selectedDocument.fileName,
                              })}
                              alt={selectedDocument.fileName}
                              className="w-full h-auto max-h-[600px] object-contain"
                              data-testid="img-document-preview"
                              onError={(e) => {
                                console.error('Image failed to load:', selectedDocument.filePath);
                                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" fill="gray">Image failed to load</text></svg>';
                              }}
                              onLoad={() => console.log('Image loaded successfully:', selectedDocument.fileName)}
                            />
                          ) : selectedDocument.mimeType === 'application/pdf' ? (
                            <iframe
                              src={buildObjectViewUrl(selectedDocument.filePath, {
                                mimeType: selectedDocument.mimeType,
                                fileName: selectedDocument.fileName,
                              })}
                              className="w-full h-[600px]"
                              title={selectedDocument.fileName}
                              data-testid="iframe-document-preview"
                            />
                          ) : (
                            <div className="p-8 text-center">
                              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-sm text-muted-foreground mb-4">
                                Preview not available for this file type
                              </p>
                              <Button variant="outline" size="sm" asChild data-testid="button-download-document">
                                <a
                                  href={buildObjectViewUrl(selectedDocument.filePath, {
                                    mimeType: selectedDocument.mimeType,
                                    fileName: selectedDocument.fileName,
                                  })}
                                  download
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download File
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Eye className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a document from the list to preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Document Checklist & Verification */}
              <Card className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle>Document Checklist</CardTitle>
                      <CardDescription>Review and verify each document</CardDescription>
                    </div>
                    {documents.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            documents.forEach(doc => {
                              updateVerification(doc.id, { status: 'verified' });
                            });
                            toast({
                              title: "All Verified",
                              description: `${documents.length} documents marked as verified`,
                            });
                          }}
                          disabled={documentActionsDisabled}
                          data-testid="button-verify-all"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setClearAllDialogOpen(true)}
                          disabled={documentActionsDisabled}
                          data-testid="button-clear-all"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Progress Meter */}
                  {documents.length > 0 && (
                    <div className="space-y-2" data-testid="progress-meter">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Overall Progress</span>
                        <span
                          className={`font-semibold ${progress === 100
                            ? 'text-green-600 dark:text-green-400'
                            : progress >= 50
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                            }`}
                          data-testid="text-progress-percentage"
                        >
                          {completedDocs} of {totalDocs} ({progress}%)
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" data-testid="progress-bar-container">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-300 ${progress === 100
                            ? 'bg-green-500'
                            : progress >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                          style={{ width: `${progress}%` }}
                          data-testid="progress-bar-fill"
                        />
                      </div>
                      {statusMessage && (
                        <div className="text-xs text-muted-foreground text-right">
                          {statusMessage}
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Handle empty state directly inside
                    if (documents.length === 0) {
                      return (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No documents uploaded</p>
                        </div>
                      );
                    }

                    // Categorize Documents
                    const mainDocTypes = [
                      "revenue-papers", "revenue_papers",
                      "affidavit-section29", "affidavit-section-29", "affidavit_section_29",
                      "undertaking-form-c", "undertaking-form-c", "undertaking_form_c",
                      "commercial-electricity-bill", "commercial_electricity_bill",
                      "commercial-water-bill", "commercial_water_bill",
                      // Added based on feedback
                      "legacy-certificate", "legacy_certificate",
                      "owner-identity-proof", "owner_identity_proof",
                      "id-proof", "id_proof",
                      "aadhaar-card", "aadhaar_card"
                    ];

                    const normalizeDocType = (type: string) => type.replace(/_/g, "-").toLowerCase();

                    const mainDocs = documents.filter(d => mainDocTypes.includes(normalizeDocType(d.documentType)));
                    const photoDocs = documents.filter(d => normalizeDocType(d.documentType) === "property-photo");
                    const additionalDocs = documents.filter(d =>
                      !mainDocTypes.includes(normalizeDocType(d.documentType)) &&
                      normalizeDocType(d.documentType) !== "property-photo"
                    );

                    // Render list helper
                    const renderDocList = (docs: Document[], emptyMsg: string) => {
                      if (docs.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                            <p className="text-sm">{emptyMsg}</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {docs.map((doc, index) => (
                            <Collapsible
                              key={doc.id}
                              open={expandedNotes[doc.id]}
                              onOpenChange={() => toggleNotes(doc.id)}
                            >
                              <Card className={cn("transition-all", {
                                "border-green-200 bg-green-50": verifications[doc.id]?.status === 'verified',
                                "border-red-200 bg-red-50": verifications[doc.id]?.status === 'needs_correction',
                              })}>
                                <CardHeader className="p-3">
                                  <div className="flex items-start gap-3">
                                    {/* Status Icon */}
                                    <div className="mt-1">
                                      {verifications[doc.id]?.status === 'verified' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                      {verifications[doc.id]?.status === 'needs_correction' && <AlertCircle className="w-5 h-5 text-red-600" />}
                                      {(!verifications[doc.id]?.status || verifications[doc.id]?.status === 'pending') && (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                      )}
                                    </div>

                                    {/* Document Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1 space-y-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm truncate capitalize">
                                              {doc.documentType.replace(/-/g, " ")}
                                            </h4>
                                          </div>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {doc.fileName}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleSelectDocument(doc)}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </div>

                                      {/* Simplified Actions */}
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          size="sm"
                                          variant={verifications[doc.id]?.status === 'verified' ? 'default' : 'outline'}
                                          className={cn(
                                            "flex-1 h-8",
                                            verifications[doc.id]?.status === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'hover:border-green-500 hover:text-green-600'
                                          )}
                                          onClick={() => {
                                            updateVerification(doc.id, { status: 'verified', notes: '' });
                                          }}
                                          disabled={documentActionsDisabled}
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1.5" />
                                          Accept
                                        </Button>

                                        <Button
                                          size="sm"
                                          variant={verifications[doc.id]?.status === 'needs_correction' ? 'destructive' : 'outline'}
                                          className={cn(
                                            "flex-1 h-8",
                                            verifications[doc.id]?.status === 'needs_correction' ? '' : 'hover:border-red-500 hover:text-red-600'
                                          )}
                                          onClick={() => {
                                            updateVerification(doc.id, { status: 'needs_correction' });
                                          }}
                                          disabled={documentActionsDisabled}
                                        >
                                          <RotateCcw className="w-3 h-3 mr-1.5" />
                                          Return
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>

                                {/* Smart Comment Box */}
                                {verifications[doc.id]?.status === 'needs_correction' && (
                                  <CardContent className="pt-0 px-3 pb-3 pl-11">
                                    <div className="relative">
                                      <div className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                                      <Textarea
                                        placeholder="Explain what needs to be corrected..."
                                        value={verifications[doc.id]?.notes || ''}
                                        onChange={(e) => updateVerification(doc.id, { notes: e.target.value })}
                                        rows={2}
                                        className="text-sm bg-white pl-3 ml-3 w-[calc(100%-0.75rem)]"
                                        readOnly={documentActionsDisabled}
                                      />
                                    </div>
                                  </CardContent>
                                )}
                              </Card>
                            </Collapsible>
                          ))}
                        </div>
                      );
                    };

                    return (
                      <Tabs defaultValue="main" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 mb-4">
                          <TabsTrigger value="main" className="text-xs">
                            Main Docs
                            <Badge variant="secondary" className="ml-1.5 px-1 py-0 h-4 min-w-[16px]">{mainDocs.length}</Badge>
                          </TabsTrigger>
                          <TabsTrigger value="photos" className="text-xs">
                            Photos
                            <Badge variant="secondary" className="ml-1.5 px-1 py-0 h-4 min-w-[16px]">{photoDocs.length}</Badge>
                          </TabsTrigger>
                          <TabsTrigger value="other" className="text-xs">
                            Other
                            <Badge variant="secondary" className="ml-1.5 px-1 py-0 h-4 min-w-[16px]">{additionalDocs.length}</Badge>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="main" className="mt-0">
                          {renderDocList(mainDocs, "No main documents found")}
                        </TabsContent>

                        <TabsContent value="photos" className="mt-0">
                          {renderDocList(photoDocs, "No property photos uploaded")}
                        </TabsContent>

                        <TabsContent value="other" className="mt-0">
                          {renderDocList(additionalDocs, "No additional documents")}
                        </TabsContent>
                      </Tabs>
                    );

                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab - Property & Owner Information */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Property Name" value={application.propertyName} />
                  <DetailRow label="Category" value={application.category?.toUpperCase()} />
                  <DetailRow label="Location Type" value={locationTypeLabel} />
                  <DetailRow label="Project Type" value={projectTypeLabel} />
                  <DetailRow label="Property Ownership" value={ownershipLabel} />
                  <DetailRow label="Property Area" value={propertyAreaLabel} />
                  <DetailRow label="Certificate Validity" value={certificateValidityLabel} />
                </CardContent>
              </Card>

              {/* Corrections & Owner Confirmation */}
              <Card>
                <CardHeader>
                  <CardTitle>Correction Window</CardTitle>
                  <CardDescription>Applicants can submit limited corrections.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow
                    label="Corrections Used"
                    value={`${application.correctionSubmissionCount ?? 0}`}
                  />
                  <DetailRow
                    label="Owner Confirmation"
                    value={formatCorrectionTimestamp(correctionHistory[0]?.createdAt)}
                  />
                  {correctionHistory[0]?.feedback && (
                    <p className="text-xs text-muted-foreground rounded-lg border bg-muted/30 p-3">
                      {correctionHistory[0].feedback}
                    </p>
                  )}
                  {correctionHistory.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Previous confirmations:{" "}
                      {correctionHistory
                        .slice(1)
                        .map((entry) => formatCorrectionTimestamp(entry.createdAt))
                        .join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Owner Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Full Name" value={owner?.fullName || application.ownerName} />
                  <DetailRow label="Mobile" value={owner?.mobile || application.ownerMobile} />
                  <DetailRow label="Email" value={owner?.email || application.ownerEmail || undefined} />
                  <DetailRow label="Gender" value={formatTitleCase(application.ownerGender)} />
                  <DetailRow label="Aadhaar" value={application.ownerAadhaar} />
                </CardContent>
              </Card>

              {/* Address & LGD Hierarchy */}
              <Card>
                <CardHeader>
                  <CardTitle>Address & LGD Hierarchy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Address" value={formattedAddress} />
                  <DetailRow label="District" value={application.district} />
                  <DetailRow label="Tehsil" value={tehsilLabel} />
                  <DetailRow label="Village / Locality" value={gramPanchayatLabel} />
                  <DetailRow label="Urban Body" value={urbanBodyLabel} />
                  <DetailRow label="Ward" value={wardLabel} />
                  <DetailRow label="Pincode" value={application.pincode} />
                  <DetailRow label="Telephone" value={telephoneValue} />
                </CardContent>
              </Card>

              {/* Room Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Room & Capacity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Single Rooms (beds)" value={`${singleRooms} rooms / ${singleBedsPerRoom} beds`} />
                  <DetailRow label="Double Rooms (beds)" value={`${doubleRooms} rooms / ${doubleBedsPerRoom} beds`} />
                  <DetailRow label="Family Suites (beds)" value={`${familySuites} suites / ${suiteBedsPerRoom} beds`} />
                  <DetailRow label="Total Rooms" value={calculatedTotalRooms.toString()} />
                  <DetailRow label="Total Beds" value={totalBeds.toString()} />
                  <DetailRow label="Attached Washrooms" value={attachedWashroomsDisplay} />
                  <DetailRow label="Single Room Rate" value={singleRoomRateValue} />
                  <DetailRow label="Double Room Rate" value={doubleRoomRateValue} />
                  <DetailRow label="Suite Rate" value={suiteRateValue} />
                  <DetailRow label="Highest Proposed Rate" value={highestRateValue} />
                  <DetailRow label="GSTIN" value={application.gstin} />
                </CardContent>
              </Card>

              {/* Fees */}
              <Card>
                <CardHeader>
                  <CardTitle>Fees & Discounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Annual Registration Fee" value={baseFeeValue} />
                  <DetailRow label="Female Owner Discount" value={femaleDiscountValue} />
                  <DetailRow label="Pangi Sub-division Discount" value={pangiDiscountValue} />
                  <DetailRow label="Validity Discount" value={validityDiscountValue} />
                  <DetailRow label="Total Discount" value={totalDiscountValue} />
                  <DetailRow label="Total Payable" value={totalFeeValue} />
                </CardContent>
              </Card>

              {/* Facilities & Safety */}
              <Card>
                <CardHeader>
                  <CardTitle>Facilities & Safety</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Mandatory Safety" value={safetyStatus} />
                  <DetailRow
                    label="Amenities Submitted"
                    value={
                      amenitiesTotal
                        ? `${amenitiesSelected} of ${amenitiesTotal} selected`
                        : amenitiesSelected
                          ? `${amenitiesSelected} selected`
                          : undefined
                    }
                  />
                  <DetailRow label="Parking Facilities" value={application.parkingArea || undefined} />
                  <DetailRow label="Eco-friendly Facilities" value={application.ecoFriendlyFacilities || undefined} />
                  <DetailRow label="Differently Abled Facilities" value={application.differentlyAbledFacilities || undefined} />
                  <DetailRow label="Fire Safety Notes" value={application.fireEquipmentDetails || undefined} />
                  <DetailRow label="Nearest Hospital" value={application.nearestHospital || undefined} />
                  <DetailRow label="Distance Summary" value={distanceSummary} />
                </CardContent>
              </Card>

              {(application.districtNotes || application.stateNotes) && (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Officer Remarks
                    </CardTitle>
                    <CardDescription>DTDO / State remarks are visible only to staff users.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {application.districtNotes && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Badge variant="outline">DTDO</Badge>
                          District Remarks
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {application.districtNotes}
                        </p>
                      </div>
                    )}
                    {application.districtNotes && application.stateNotes && <Separator />}
                    {application.stateNotes && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Badge variant="outline">State</Badge>
                          State Remarks
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {application.stateNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              <InspectionReportCard applicationId={id} className="md:col-span-2 xl:col-span-3" />

              <ApplicationTimelineCard
                applicationId={id}
                className="md:col-span-2 xl:col-span-3"
                description="Every action taken as the application moves between DA, DTDO, and the applicant."
              />
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={legacyVerifyDialogOpen}
          onOpenChange={(open) => {
            setLegacyVerifyDialogOpen(open);
            if (!open) {
              setLegacyRemarks("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Legacy RC</DialogTitle>
              <DialogDescription>
                Confirm that this existing license has been verified and can be closed without DTDO
                review.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Label htmlFor="legacy-remarks-da">Remarks (optional)</Label>
              <Textarea
                id="legacy-remarks-da"
                placeholder="Notes for audit trail"
                value={legacyRemarks}
                onChange={(e) => setLegacyRemarks(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setLegacyVerifyDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => legacyVerifyMutation.mutate()}
                disabled={legacyVerifyMutation.isPending}
              >
                {legacyVerifyMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Verify & Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Forward to DTDO Dialog */}
        <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Forward to DTDO</DialogTitle>
              <DialogDescription>
                Add your overall scrutiny remarks before forwarding this application to the District Tourism Development Officer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="remarks">Overall Scrutiny Remarks <span className="text-red-500">*</span></Label>
                <Textarea
                  id="remarks"
                  placeholder="Summary of your scrutiny, any observations or recommendations..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  data-testid="textarea-remarks"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setForwardDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!requireAllDocumentsReviewed()) {
                    return;
                  }
                  if (!requireRemarks()) {
                    return;
                  }
                  forwardMutation.mutate();
                }}
                disabled={forwardMutation.isPending || !canForward}
                data-testid="button-confirm-forward"
              >
                {forwardMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Forward to DTDO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {sendBackEnabled && (
          <>
            {/* Send Back Dialog */}
            <Dialog open={sendBackDialogOpen} onOpenChange={setSendBackDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={isSecondRevert ? "text-destructive" : ""}>
                    {isSecondRevert ? "⚠️ Final Rejection Warning" : "Send Back to Applicant"}
                  </DialogTitle>
                  <DialogDescription>
                    {isSecondRevert
                      ? "This application has already been sent back once. Sending it back again will AUTOMATICALLY REJECT the application. This action cannot be undone."
                      : "Specify corrections required. DTDO authorization (OTP) is required to proceed."
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Reason for {isSecondRevert ? "Rejection" : "Sending Back"} *</Label>
                    <Textarea
                      id="reason"
                      placeholder={isSecondRevert ? "Enter reason for rejection..." : "Please specify the corrections needed..."}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      data-testid="textarea-reason"
                      className={isSecondRevert ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                  </div>

                  {/* OTP Section - Only for First Revert */}
                  {!isSecondRevert && reason.trim().length > 5 && (
                    <div className="p-4 bg-muted rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">
                          DTDO Authorization
                        </Label>
                        {otpVerified && <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>}
                      </div>

                      {!otpSent && !otpVerified && (
                        <Button
                          size="sm"
                          onClick={() => requestOtpMutation.mutate()}
                          disabled={requestOtpMutation.isPending}
                          className="w-full"
                        >
                          {requestOtpMutation.isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                          Request OTP from DTDO
                        </Button>
                      )}

                      {otpSent && !otpVerified && (
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP sent to DTDO{otpMobile ? ` (${otpMobile})` : ''}</Label>
                          <div className="flex gap-2">
                            <input
                              id="otp"
                              type="text"
                              maxLength={6}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="6-digit OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                            <Button
                              onClick={() => verifyOtpMutation.mutate()}
                              disabled={verifyOtpMutation.isPending || otp.length !== 6}
                            >
                              {verifyOtpMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            OTP sent to DTDO's mobile.
                            <button onClick={() => requestOtpMutation.mutate()} className="ml-1 text-primary hover:underline">Resend?</button>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSendBackDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant={isSecondRevert ? "destructive" : "warning"}
                    onClick={() => sendBackMutation.mutate()}
                    disabled={
                      sendBackMutation.isPending ||
                      !reason.trim() ||
                      (!isSecondRevert && !otpVerified) // First revert needs OTP
                    }
                    data-testid="button-confirm-send-back"
                  >
                    {sendBackMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isSecondRevert ? "Reject Application" : "Send Back"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Clear All Confirmation Dialog */}
        <Dialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear All Verifications?</DialogTitle>
              <DialogDescription>
                This will reset all {documents.length} documents to pending status and clear all notes. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setClearAllDialogOpen(false)} data-testid="button-cancel-clear-all">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  documents.forEach(doc => {
                    updateVerification(doc.id, { status: 'pending', notes: '' });
                  });
                  setClearAllDialogOpen(false);
                  toast({
                    title: "All Cleared",
                    description: `${documents.length} documents reset to pending`,
                  });
                }}
                data-testid="button-confirm-clear-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-muted-foreground shrink-0 w-1/3 max-w-[180px]">{label}:</span>
      <span className="font-medium text-right flex-1 break-words whitespace-pre-wrap min-w-0">
        {value || "N/A"}
      </span>
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const LOCATION_LABEL_MAP = LOCATION_TYPE_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<string, string>,
);

function toNumber(value?: string | number | null): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numeric) ? numeric : undefined;
}

function formatCurrency(value?: string | number | null): string | undefined {
  const numeric = toNumber(value);
  return numeric !== undefined ? currencyFormatter.format(numeric) : undefined;
}

function formatCount(value?: string | number | null): string | undefined {
  const numeric = toNumber(value);
  return numeric !== undefined ? numeric.toString() : undefined;
}

function formatLocationTypeLabel(value?: LocationType | string): string | undefined {
  if (!value) return undefined;
  const label = LOCATION_LABEL_MAP[value as LocationType];
  if (label) {
    return label;
  }
  return typeof value === "string" ? value.toUpperCase() : undefined;
}

function formatProjectTypeLabel(value?: string | null): string | undefined {
  switch (value) {
    case "new_rooms":
      return "Adding rooms to existing property";
    case "new_project":
      return "New homestay property";
    default:
      return value || undefined;
  }
}

function formatOwnershipLabel(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value === "leased") return "Lease Deed";
  if (value === "owned") return "Owned";
  return value;
}

function formatArea(value?: string | number | null): string | undefined {
  const numeric = toNumber(value);
  return numeric !== undefined ? `${numeric.toLocaleString()} sq ft` : undefined;
}

function formatCertificateValidity(value?: number | null): string | undefined {
  if (!value) return undefined;
  return `${value} year${value > 1 ? "s" : ""}`;
}

function formatMultilineAddress(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;
  return normalized.replace(/\n+/g, ", ");
}

function formatTitleCase(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeAmenities(raw: unknown): Record<string, boolean> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, boolean>;
      }
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw as Record<string, boolean>;
  }
  return {};
}

function buildDistanceSummary(distances: {
  airport?: number | string | null;
  railway?: number | string | null;
  city?: number | string | null;
  bus?: number | string | null;
  shopping?: number | string | null;
}): string | undefined {
  const parts: string[] = [];

  const airport = formatDistance(distances.airport);
  if (airport) parts.push(`Airport ${airport}`);

  const railway = formatDistance(distances.railway);
  if (railway) parts.push(`Railway ${railway}`);

  const city = formatDistance(distances.city);
  if (city) parts.push(`City Center ${city}`);

  const shopping = formatDistance(distances.shopping);
  if (shopping) parts.push(`Shopping ${shopping}`);

  const bus = formatDistance(distances.bus);
  if (bus) parts.push(`Bus Stand ${bus}`);

  return parts.length ? parts.join(" • ") : undefined;
}

function formatDistance(value?: number | string | null): string | undefined {
  const numeric = toNumber(value);
  if (numeric === undefined || numeric <= 0) {
    return undefined;
  }
  return `${numeric} km`;
}
