import { useState, useEffect, useMemo } from "react";
import { startOfMonth, subDays, startOfDay, endOfDay, format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Download,
    TrendingUp,
    IndianRupee,
    Building2,
    AlertTriangle,
    FileSpreadsheet,
    Filter,
    CheckSquare,
    RotateCcw,
    Clock,
    BarChart3,
    RefreshCcw,
    Timer,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Settings,
    FileText,
} from "lucide-react";
import { getDistricts } from "@shared/regions";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPaymentDateIST, formatDateIST, formatDateInputIST, formatDateTimeIST, formatDbTimestamp } from "@/lib/dateUtils";

type CollectionRow = {
    ddo: string | null;
    district: string | null;
    ddoDescription: string | null;
    treasuryCode: string | null;
    totalTransactions: number;
    successfulTransactions: number;
    totalAmount: number;
};

type PaymentRow = {
    id: string;
    appRefNo: string;
    deptRefNo: string;
    ddo: string;
    head1: string;
    totalAmount: number;
    echTxnId: string;
    bankCIN: string;
    bankName: string;
    tenderBy: string;
    createdAt: string;
    applicationId: string;
};

type RefundableRow = {
    transactionId: string;
    appRefNo: string;
    deptRefNo: string;
    ddo: string;
    totalAmount: number;
    echTxnId: string;
    bankCIN: string;
    tenderBy: string;
    paymentDate: string;
    applicationId: string;
    applicationNumber: string;
    applicationStatus: string;
    propertyName: string;
    ownerName: string;
    district: string;
};

type SummaryStats = {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalCollected: number;
    district: string | null;
};

type DistrictPerformanceRow = {
    district: string;
    totalApplications: number;
    avgTimeSeconds: number | null;
    approved: number;
    rejected: number;
    pending: number;
};

type OperationsData = {
    processingTime: {
        totalApproved: number;
        avgDays: string;
        minDays: string;
        maxDays: string;
    };
    formCompletionTime: {
        totalTracked: number;
        avgSeconds: number;
        minSeconds: number;
        maxSeconds: number;
    };
    corrections: {
        totalApplications: number;
        totalWithCorrections: number;
        correctionRate: string;
        avgReversions: string;
        maxReversions: number;
        rejectionRate: string;
        totalRejected: number;
    };
    categoryBreakdown: Array<{ category: string | null; count: number; avgProcessingDays: string }>;
    statusBreakdown: Array<{ status: string | null; count: number }>;
    filters: { district: string | null; from: string | null; to: string | null };
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};

const csvEscape = (value: string | number | null | undefined) => {
    const str = String(value ?? "");
    const sanitized = str.replace(/"/g, '""');
    return `"${sanitized}"`;
};

export default function PaymentReportsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("operations");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const allDistricts = getDistricts();
    const [selectedRefunds, setSelectedRefunds] = useState<Set<string>>(new Set());

    // Form UX Metric State — persisted in localStorage
    const [formMetric, setFormMetric] = useState<"average" | "median">(() => {
        const saved = localStorage.getItem("formMetric");
        return saved === "average" ? "average" : "median";
    });
    const [formThreshold, setFormThreshold] = useState<string>(() => {
        return localStorage.getItem("formThreshold") || "240";
    });
    const [formThresholdInput, setFormThresholdInput] = useState<string>(() => {
        return localStorage.getItem("formThreshold") || "240";
    });

    // Persist form UX settings to localStorage
    useEffect(() => { localStorage.setItem("formMetric", formMetric); }, [formMetric]);
    useEffect(() => { localStorage.setItem("formThreshold", formThreshold); }, [formThreshold]);

    // Sorting state
    type SortField = "date" | "amount" | null;
    type SortDirection = "asc" | "desc";
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc"); // latest first by default

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Performance Sorting state
    type PerfSortField = "totalApps" | "avgTime" | null;
    const [perfSortField, setPerfSortField] = useState<PerfSortField>("totalApps");
    const [perfSortDirection, setPerfSortDirection] = useState<SortDirection>("desc");

    // Get user info to determine district restrictions
    const { data: userData } = useQuery<{ user: { role: string; district?: string } }>({
        queryKey: ["/api/auth/me"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/auth/me");
            return res.json();
        },
    });

    const user = userData?.user;
    const isDTDO = user?.role === "district_tourism_officer" || user?.role === "district_officer";
    const userDistrict = user?.district;

    // For DTDOs, lock to their district; for admins, show all
    const effectiveDistrict = isDTDO && userDistrict ? userDistrict : selectedDistrict;
    const canSelectDistrict = !isDTDO; // Only admins can select districts
    const districts = isDTDO && userDistrict ? [userDistrict] : allDistricts;

    // Set district automatically for DTDOs
    useEffect(() => {
        if (isDTDO && userDistrict && selectedDistrict === "all") {
            setSelectedDistrict(userDistrict);
        }
    }, [isDTDO, userDistrict, selectedDistrict]);

    // Summary stats
    const { data: summary, isLoading: summaryLoading } = useQuery<SummaryStats>({
        queryKey: ["reports-summary", selectedDistrict],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
            const res = await apiRequest("GET", `/api/admin/reports/summary?${params.toString()}`);
            return res.json();
        },
    });

    // Collection report
    const {
        data: collectionsData,
        isLoading: collectionsLoading,
    } = useQuery<{ collections: CollectionRow[]; totals: { totalTransactions: number; successfulTransactions: number; totalAmount: number } }>({
        queryKey: ["reports-collections", fromDate, toDate, selectedDistrict],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (fromDate) params.set("from", fromDate);
            if (toDate) params.set("to", toDate);
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
            const res = await apiRequest("GET", `/api/admin/reports/collections?${params.toString()}`);
            return res.json();
        },
    });

    // Payments report
    const {
        data: paymentsData,
        isLoading: paymentsLoading,
    } = useQuery<{ payments: PaymentRow[]; pagination: { page: number; totalCount: number } }>({
        queryKey: ["reports-payments", fromDate, toDate, selectedDistrict],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (fromDate) params.set("from", fromDate);
            if (toDate) params.set("to", toDate);
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
            params.set("limit", "5000");
            const res = await apiRequest("GET", `/api/admin/reports/payments?${params.toString()}`);
            return res.json();
        },
    });

    // Refundable report
    const {
        data: refundableData,
        isLoading: refundableLoading,
    } = useQuery<{ refundable: RefundableRow[]; summary: { count: number; totalAmount: number } }>({
        queryKey: ["reports-refundable", selectedDistrict],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
            const res = await apiRequest("GET", `/api/admin/reports/refundable?${params.toString()}`);
            return res.json();
        },
    });

    // Mark as Refunded Mutation
    const { mutate: markAsRefunded } = useMutation({
        mutationFn: async (transactionId: string) => {
            const res = await apiRequest("POST", `/api/admin/transactions/${transactionId}/mark-refunded`);
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Transaction marked as refunded." });
            queryClient.invalidateQueries({ queryKey: ["reports-refundable"] });
            queryClient.invalidateQueries({ queryKey: ["reports-summary"] });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message || "Failed to mark as refunded", variant: "destructive" });
        },
    });

    const handleConfirmRefund = (transactionId: string) => {
        if (window.confirm("Are you sure you want to mark this payment as refunded? This will remove it from the pending list and deduct the amount from Total Collected.")) {
            markAsRefunded(transactionId);
        }
    };

    // Operations report
    const {
        data: operationsData,
        isLoading: operationsLoading,
    } = useQuery<OperationsData>({
        queryKey: ["reports-operations", fromDate, toDate, selectedDistrict, formMetric, formThreshold],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (fromDate) params.set("from", fromDate);
            if (toDate) params.set("to", toDate);
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
            // Add Form UX params
            params.set("formMetric", formMetric);
            params.set("formThreshold", formThreshold);

            const res = await apiRequest("GET", `/api/admin/reports/operations?${params.toString()}`);
            return res.json();
        },
    });

    // District Performance Report (New)
    const {
        data: districtPerformance,
        isLoading: performanceLoading,
    } = useQuery<DistrictPerformanceRow[]>({
        queryKey: ["reports-district-performance"],
        queryFn: async () => {
            const res = await apiRequest("GET", `/api/admin/reports/district-performance`);
            return res.json();
        },
        enabled: activeTab === "performance",
    });

    // Helper to format seconds to human readable
    const formatDuration = (seconds: number) => {
        if (!seconds) return "N/A";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    const exportCollectionsCsv = () => {
        if (!collectionsData?.collections.length) return;
        const header = ["DDO Code", "District", "Description", "Treasury", "Total Txns", "Successful", "Total Amount"];
        const rows = collectionsData.collections.map((row) => [
            row.ddo,
            row.district,
            row.ddoDescription,
            row.treasuryCode,
            row.totalTransactions,
            row.successfulTransactions,
            row.totalAmount,
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => csvEscape(cell)).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `collections-report-${formatDateInputIST(new Date())}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Collections report downloaded." });
    };

    const exportPaymentsCsv = () => {
        if (!paymentsData?.payments.length) return;
        const header = ["App Ref", "Dept Ref", "DDO", "Amount", "GRN", "Bank CIN", "Bank", "Payee", "Date"];
        const rows = paymentsData.payments.map((row) => [
            row.appRefNo,
            row.deptRefNo,
            row.ddo,
            row.totalAmount,
            row.echTxnId,
            row.bankCIN,
            row.bankName,
            row.tenderBy,
            row.createdAt ? formatDbTimestamp(new Date(row.createdAt)) : "",
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => csvEscape(cell)).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payments-report-${formatDateInputIST(new Date())}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Payments report downloaded." });
    };

    const toggleRefundSelection = (id: string) => {
        const next = new Set(selectedRefunds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedRefunds(next);
    };

    const toggleAllRefunds = () => {
        if (!refundableData?.refundable) return;
        if (selectedRefunds.size === refundableData.refundable.length) {
            setSelectedRefunds(new Set());
        } else {
            setSelectedRefunds(new Set(refundableData.refundable.map(r => r.transactionId)));
        }
    };

    const exportRefundCsv = () => {
        if (!refundableData?.refundable.length || selectedRefunds.size === 0) {
            toast({ title: "No Selection", description: "Please select at least one record to export.", variant: "destructive" });
            return;
        }

        const selectedRecords = refundableData.refundable.filter(r => selectedRefunds.has(r.transactionId));
        const header = ["App Ref", "Dept Ref", "DDO", "Amount", "GRN", "Bank CIN", "Payee", "Payment Date", "District", "Status"];
        const rows = selectedRecords.map((row) => [
            row.appRefNo,
            row.deptRefNo,
            row.ddo,
            row.totalAmount,
            row.echTxnId,
            row.bankCIN,
            row.tenderBy,
            row.paymentDate ? formatDbTimestamp(new Date(row.paymentDate)) : "",
            row.district,
            "Refund Pending" // Default status for MIS
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => csvEscape(cell)).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `refund-mis-report-${formatDateInputIST(new Date())}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Exported", description: `Exported ${selectedRecords.length} records for MIS.` });
    };

    // Quick filter handlers
    const applyFilter = (type: "today" | "thisMonth" | "last7" | "last30") => {
        const today = new Date();
        let start: Date;

        if (type === "today") {
            start = startOfDay(today);
        } else if (type === "thisMonth") {
            start = startOfMonth(today);
        } else if (type === "last7") {
            start = subDays(today, 7);
        } else {
            start = subDays(today, 30);
        }

        setFromDate(formatDateInputIST(start));
        setToDate(formatDateInputIST(today));
        setCurrentPage(1);
    };

    // Toggle sort on column click
    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "desc" ? "asc" : "desc");
        } else {
            setSortField(field);
            setSortDirection(field === "amount" ? "desc" : "desc");
        }
        setCurrentPage(1);
    };

    // Sort icon helper
    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
        return sortDirection === "desc"
            ? <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-600" />
            : <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-600" />;
    };

    // Performance Sort Helper
    const togglePerfSort = (field: PerfSortField) => {
        if (perfSortField === field) {
            setPerfSortDirection(prev => prev === "desc" ? "asc" : "desc");
        } else {
            setPerfSortField(field);
            setPerfSortDirection("desc");
        }
    };

    const PerfSortIcon = ({ field }: { field: PerfSortField }) => {
        if (perfSortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
        return perfSortDirection === "desc"
            ? <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-600" />
            : <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-600" />;
    };

    // Memoized sorted + filtered performance data
    const processedPerformance = useMemo(() => {
        if (!districtPerformance) return [];

        let filtered = districtPerformance;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(row => row.district?.toLowerCase().includes(q));
        }

        return [...filtered].sort((a, b) => {
            const dir = perfSortDirection === "desc" ? -1 : 1;
            if (perfSortField === "totalApps") {
                return ((a.totalApplications || 0) - (b.totalApplications || 0)) * dir;
            }
            if (perfSortField === "avgTime") {
                return ((a.avgTimeSeconds || 0) - (b.avgTimeSeconds || 0)) * dir;
            }
            return 0;
        });
    }, [districtPerformance, searchQuery, perfSortField, perfSortDirection]);

    // Memoized sorted + filtered + paginated payments
    const processedPayments = useMemo(() => {
        if (!paymentsData?.payments) return { rows: [], totalFiltered: 0, totalPages: 0 };

        // 1. Filter
        let filtered = paymentsData.payments;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(row =>
                row.deptRefNo?.toLowerCase().includes(q) ||
                row.ddo?.toLowerCase().includes(q) ||
                row.tenderBy?.toLowerCase().includes(q) ||
                row.echTxnId?.toLowerCase().includes(q) ||
                row.bankName?.toLowerCase().includes(q)
            );
        }

        // 2. Sort
        const sorted = [...filtered].sort((a, b) => {
            const dir = sortDirection === "desc" ? -1 : 1;
            if (sortField === "date") {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return (dateA - dateB) * dir;
            }
            if (sortField === "amount") {
                return ((a.totalAmount || 0) - (b.totalAmount || 0)) * dir;
            }
            // Default: latest first
            return (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        });

        // 3. Paginate
        const totalFiltered = sorted.length;
        const totalPages = Math.ceil(totalFiltered / pageSize);
        const startIdx = (currentPage - 1) * pageSize;
        const rows = sorted.slice(startIdx, startIdx + pageSize);

        return { rows, totalFiltered, totalPages };
    }, [paymentsData?.payments, searchQuery, sortField, sortDirection, currentPage, pageSize]);

    return (
        <div className="container mx-auto max-w-7xl py-8 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
                        <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Insights</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            {summary?.district ? (
                                <>
                                    <span className="font-medium text-indigo-600">{summary.district}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                </>
                            ) : null}
                            Operational metrics and payment analytics
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Stats - Hero Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Collected */}
                <Card className="relative overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <IndianRupee className="w-16 h-16 text-blue-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {summaryLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(summary?.totalCollected || 0)}
                            </span>
                        </div>
                        <div className="h-1 w-12 bg-blue-500 rounded-full mt-3" />
                    </CardContent>
                </Card>

                {/* Successful Transactions */}
                <Card className="relative overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Successful</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {summaryLoading ? <Skeleton className="h-8 w-16" /> : (summary?.successfulTransactions || 0)}
                            </span>
                            <span className="text-sm text-emerald-600 font-medium">Verified</span>
                        </div>
                        <div className="h-1 w-12 bg-emerald-500 rounded-full mt-3" />
                    </CardContent>
                </Card>

                {/* Failed Transactions */}
                <Card className="relative overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-16 h-16 text-orange-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {summaryLoading ? <Skeleton className="h-8 w-16" /> : (summary?.failedTransactions || 0)}
                            </span>
                            <span className="text-sm text-orange-600 font-medium"> interruptions</span>
                        </div>
                        <div className="h-1 w-12 bg-orange-500 rounded-full mt-3" />
                    </CardContent>
                </Card>

                {/* Total Transactions */}
                <Card className="relative overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 className="w-16 h-16 text-purple-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Txns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {summaryLoading ? <Skeleton className="h-8 w-16" /> : (summary?.totalTransactions || 0)}
                            </span>
                            <span className="text-sm text-purple-600 font-medium">Attempts</span>
                        </div>
                        <div className="h-1 w-12 bg-purple-500 rounded-full mt-3" />
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-slate-200 bg-slate-50/50">
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-end">
                        {/* Search Filter */}
                        <div className="w-full lg:w-56">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by ID, Name, DDO..."
                                    className="pl-9 bg-white border-slate-200 h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* District Filter */}
                        <div className="w-full lg:w-48">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                                District {isDTDO && <span className="text-muted-foreground font-normal normal-case ml-1">(Locked)</span>}
                            </label>
                            <Select
                                value={selectedDistrict}
                                onValueChange={setSelectedDistrict}
                                disabled={isDTDO}
                            >
                                <SelectTrigger className="bg-white border-slate-200 h-10">
                                    <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent>
                                    {canSelectDistrict && <SelectItem value="all">All Districts</SelectItem>}
                                    {districts.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {d}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 min-w-[280px]">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">From Date</label>
                                <Input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    // @ts-ignore - showPicker is modern API
                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                    className="bg-white border-slate-200 h-10"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">To Date</label>
                                <Input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    // @ts-ignore - showPicker is modern API
                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                    className="bg-white border-slate-200 h-10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => applyFilter("today")} className="bg-white hover:bg-slate-50 border-slate-200">
                                Today
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => applyFilter("thisMonth")} className="bg-white hover:bg-slate-50 border-slate-200">
                                This Month
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => applyFilter("last7")} className="bg-white hover:bg-slate-50 border-slate-200">
                                Last 7 Days
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => applyFilter("last30")} className="bg-white hover:bg-slate-50 border-slate-200">
                                Last 30 Days
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setFromDate("");
                                    setToDate("");
                                    setCurrentPage(1);
                                    if (canSelectDistrict) setSelectedDistrict("all");
                                }}
                                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent p-0 h-auto gap-2 rounded-none">
                    <TabsTrigger
                        value="operations"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Operations
                        {operationsData?.pipeline?.submitted !== undefined && <Badge variant="secondary" className="ml-2">{operationsData.pipeline.submitted}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger
                        value="drafts"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Draft Applications
                        {operationsData?.pipeline?.drafts !== undefined && <Badge variant="secondary" className="ml-2">{operationsData.pipeline.drafts}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger
                        value="collections"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Collection by DDO
                        {summary?.totalTransactions !== undefined && <Badge variant="secondary" className="ml-2">{summary.totalTransactions}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger
                        value="payments"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Approved Payments
                        {summary?.successfulTransactions !== undefined && <Badge variant="secondary" className="ml-2">{summary.successfulTransactions}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending-txns"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Pending Txns
                        {(summary?.pendingTransactions ?? 0) > 0 && <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">{summary?.pendingTransactions}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger
                        value="refundable"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        Refundable
                        {refundableData?.summary?.count !== undefined && refundableData.summary.count > 0 && <Badge variant="secondary" className="ml-2">{refundableData.summary.count}</Badge>}
                    </TabsTrigger>
                    {!isDTDO && <TabsTrigger
                        value="performance"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 px-3 py-3 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                    >
                        District Performance
                    </TabsTrigger>}
                </TabsList>

                {/* Operations Tab */}
                <TabsContent value="operations" className="mt-6">
                    <div className="space-y-6">
                        {operationsLoading ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                            </div>
                        ) : operationsData ? (
                            <>
                                {/* Top-Level Metrics */}
                                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                    {/* Application Pipeline */}
                                    <Card className="hover:shadow-lg transition-all border-slate-200 group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                                    <BarChart3 className="w-6 h-6" />
                                                </div>
                                                <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">Pipeline</Badge>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {operationsData?.pipeline?.submitted ?? operationsData?.corrections?.totalApplications ?? 0}
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium">Total Submitted</p>
                                            </div>

                                            <div className="space-y-2 text-sm pt-4 border-t border-slate-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Approved</span>
                                                    <span className="font-semibold text-emerald-600">{operationsData?.pipeline?.approved ?? operationsData?.processingTime?.totalApproved ?? 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Rejected</span>
                                                    <span className="font-semibold text-rose-600">{operationsData?.pipeline?.rejected ?? operationsData?.corrections?.totalRejected ?? 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Pending</span>
                                                    <span className="font-semibold text-orange-600">
                                                        {operationsData?.pipeline?.pending ?? Math.max(0, (operationsData?.corrections?.totalApplications || 0) - (operationsData?.processingTime?.totalApproved || 0) - (operationsData?.corrections?.totalRejected || 0))}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Processing Time Card */}
                                    <Card className="hover:shadow-lg transition-all border-slate-200 group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">SLA Tracking</Badge>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {operationsData?.processingTime?.avgDays || "0.0"} <span className="text-lg text-muted-foreground font-normal">days</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium">Avg Processing Time</p>
                                            </div>

                                            <div className="space-y-1 text-xs text-muted-foreground pt-4 border-t border-slate-100">
                                                <div className="flex justify-between">
                                                    <span>Range:</span>
                                                    <span className="font-medium text-slate-700">{operationsData?.processingTime?.minDays || 0} - {operationsData?.processingTime?.maxDays || 0} days</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Sample Size:</span>
                                                    <span className="font-medium text-slate-700">{operationsData?.processingTime?.totalApproved || 0} approved</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Form Completion Time Card */}
                                    <Card className="hover:shadow-lg transition-all border-slate-200 group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                    <Timer className="w-6 h-6" />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Form UX</Badge>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 p-4" align="end">
                                                            <div className="space-y-4">
                                                                <h4 className="font-medium text-sm border-b pb-2">Metric Settings</h4>

                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-slate-500">Metric Type</label>
                                                                    <Select value={formMetric} onValueChange={(v: any) => setFormMetric(v)}>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="average">Average (Mean)</SelectItem>
                                                                            <SelectItem value="median">Median (Typical)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-semibold text-slate-500">Ignore Duration Over (minutes)</label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            type="number"
                                                                            value={formThresholdInput}
                                                                            onChange={(e) => setFormThresholdInput(e.target.value)}
                                                                            min="1"
                                                                            className="flex-1"
                                                                        />
                                                                        <Button
                                                                            size="sm"
                                                                            variant={formThresholdInput !== formThreshold ? "default" : "outline"}
                                                                            onClick={() => setFormThreshold(formThresholdInput)}
                                                                            disabled={formThresholdInput === formThreshold || !formThresholdInput}
                                                                        >
                                                                            Apply
                                                                        </Button>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400">
                                                                        Excludes any form taking longer than this time (e.g., left open overnight).
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {formatDuration(operationsData?.formCompletionTime?.avgSeconds || 0)}
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    {formMetric === 'median' ? 'Median Fill Time' : 'Avg Fill Time'}
                                                </p>
                                            </div>

                                            <div className="space-y-1 text-xs text-muted-foreground pt-4 border-t border-slate-100">
                                                <div className="flex justify-between">
                                                    <span>Range:</span>
                                                    <span className="font-medium text-slate-700">
                                                        {formatDuration(operationsData?.formCompletionTime?.minSeconds || 0)} - {formatDuration(operationsData?.formCompletionTime?.maxSeconds || 0)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tracked:</span>
                                                    <span className="font-medium text-slate-700">{operationsData?.formCompletionTime?.totalTracked || 0} apps</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Correction/Reversion Card */}
                                    <Card className="hover:shadow-lg transition-all border-slate-200 group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                    <RefreshCcw className="w-6 h-6" />
                                                </div>
                                                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">Quality</Badge>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {operationsData?.corrections?.correctionRate || "0.0"}%
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium">Correction Rate</p>
                                            </div>

                                            <div className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-slate-100">
                                                <div className="flex justify-between">
                                                    <span>Sent Back:</span>
                                                    <span className="font-medium text-slate-700">{operationsData?.corrections?.totalWithCorrections || 0} apps</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Avg Revisions:</span>
                                                    <span className="font-medium text-slate-700">{operationsData?.corrections?.avgReversions || "0.0"}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Category Breakdown */}
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                                <BarChart3 className="w-4 h-4" />
                                            </div>
                                            Processing by Category
                                        </CardTitle>
                                        <CardDescription>
                                            Average processing time and count per category
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="font-semibold text-slate-900">Category</TableHead>
                                                        <TableHead className="text-right font-semibold text-slate-900">Applications</TableHead>
                                                        <TableHead className="text-right font-semibold text-slate-900">Avg Processing</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {operationsData?.categoryBreakdown?.map((cat, idx) => (
                                                        <TableRow key={idx} className="hover:bg-slate-50/50">
                                                            <TableCell className="font-medium capitalize">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        cat.category === "diamond"
                                                                            ? "border-purple-200 bg-purple-50 text-purple-700"
                                                                            : cat.category === "gold"
                                                                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                                                                : "border-slate-200 bg-white text-slate-700"
                                                                    }
                                                                >
                                                                    {cat.category || "Uncategorized"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right font-mono">{cat.count}</TableCell>
                                                            <TableCell className="text-right text-muted-foreground">{cat.avgProcessingDays} days</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {!operationsData?.categoryBreakdown?.length && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No category data available</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <FileSpreadsheet className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">No Operations Data</h3>
                                <p className="text-muted-foreground">Could not retrieve operational metrics for the selected period.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Collections Tab */}
                <TabsContent value="collections" className="mt-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                        <IndianRupee className="w-4 h-4" />
                                    </div>
                                    Collection by District/DDO
                                </CardTitle>
                                <CardDescription>
                                    Revenue collected per treasury DDO code
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportCollectionsCsv}
                                disabled={!collectionsData?.collections.length}
                                className="gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {collectionsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : collectionsData?.collections.length ? (
                                <>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="font-semibold text-slate-900">DDO Code</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">District</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Description</TableHead>
                                                    <TableHead className="text-right font-semibold text-slate-900">Transactions</TableHead>
                                                    <TableHead className="text-right font-semibold text-slate-900">Successful</TableHead>
                                                    <TableHead className="text-right font-semibold text-slate-900">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {collectionsData.collections
                                                    .filter((row) => {
                                                        if (!searchQuery) return true;
                                                        const q = searchQuery.toLowerCase();
                                                        return (
                                                            row.ddo?.toLowerCase().includes(q) ||
                                                            row.district?.toLowerCase().includes(q) ||
                                                            row.ddoDescription?.toLowerCase().includes(q)
                                                        );
                                                    })
                                                    .map((row, idx) => (
                                                        <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <TableCell className="font-mono text-slate-600">
                                                                {row.ddo || "—"}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-slate-900">{row.district || "—"}</TableCell>
                                                            <TableCell className="max-w-xs truncate text-muted-foreground">
                                                                {row.ddoDescription || "—"}
                                                            </TableCell>
                                                            <TableCell className="text-right font-mono text-slate-600">
                                                                {row.totalTransactions}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                    {row.successfulTransactions}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-slate-900">
                                                                {formatCurrency(row.totalAmount)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center shadow-sm">
                                        <span className="font-medium text-slate-700">Grand Total Collected</span>
                                        <span className="text-xl font-bold text-blue-700">
                                            {formatCurrency(collectionsData.totals.totalAmount)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <IndianRupee className="w-12 h-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900">No Collections Data</h3>
                                    <p className="text-muted-foreground">No revenue records found for the selected criteria.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="mt-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                        <CheckSquare className="w-4 h-4" />
                                    </div>
                                    Approved Payments
                                </CardTitle>
                                <CardDescription>
                                    All successful HimKosh transactions
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportPaymentsCsv}
                                disabled={!paymentsData?.payments.length}
                                className="gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {paymentsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : paymentsData?.payments.length ? (
                                <>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead
                                                        className="font-semibold text-slate-900 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                                                        onClick={() => toggleSort("date")}
                                                    >
                                                        <span className="flex items-center">
                                                            Date
                                                            <SortIcon field="date" />
                                                        </span>
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Application</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">DDO</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Payee</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">GRN</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Bank</TableHead>
                                                    <TableHead
                                                        className="text-right font-semibold text-slate-900 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                                                        onClick={() => toggleSort("amount")}
                                                    >
                                                        <span className="flex items-center justify-end">
                                                            Amount
                                                            <SortIcon field="amount" />
                                                        </span>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {processedPayments.rows.map((row) => (
                                                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="whitespace-nowrap text-slate-600">
                                                            {row.createdAt
                                                                ? formatPaymentDateIST(row.createdAt)
                                                                : "—"}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-xs text-slate-600">
                                                            {row.deptRefNo}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-slate-600">{row.ddo}</TableCell>
                                                        <TableCell className="font-medium text-slate-900">{row.tenderBy}</TableCell>
                                                        <TableCell className="font-mono text-xs text-slate-500">{row.echTxnId}</TableCell>
                                                        <TableCell className="text-slate-600">{row.bankName}</TableCell>
                                                        <TableCell className="text-right font-semibold text-slate-900">
                                                            {formatCurrency(row.totalAmount)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {processedPayments.rows.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                                                            No records match your search.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span>Showing</span>
                                            <Select
                                                value={String(pageSize)}
                                                onValueChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}
                                            >
                                                <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                    <SelectItem value="100">100</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <span>of {processedPayments.totalFiltered} records</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-white border-slate-200"
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage <= 1}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-white border-slate-200"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage <= 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <span className="text-sm font-medium text-slate-700 px-3">
                                                Page {currentPage} of {processedPayments.totalPages || 1}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-white border-slate-200"
                                                onClick={() => setCurrentPage(p => Math.min(processedPayments.totalPages, p + 1))}
                                                disabled={currentPage >= processedPayments.totalPages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-white border-slate-200"
                                                onClick={() => setCurrentPage(processedPayments.totalPages)}
                                                disabled={currentPage >= processedPayments.totalPages}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <CheckSquare className="w-12 h-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900">No Payment Records</h3>
                                    <p className="text-muted-foreground">No approved payment transactions found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Refundable Tab */}
                {/* Pending Transactions Tab */}
                <TabsContent value="pending-txns" className="mt-6">
                    <PendingTransactionsTable />
                </TabsContent>

                <TabsContent value="refundable" className="mt-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    Refundable Payments
                                </CardTitle>
                                <CardDescription>
                                    Payments for rejected applications that may require refund
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {selectedRefunds.size > 0 && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={exportRefundCsv}
                                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export MIS Report ({selectedRefunds.size})
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {refundableLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : refundableData?.refundable.length ? (
                                <>
                                    <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-full shadow-sm">
                                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-orange-900">
                                                    {refundableData.summary.count} payments pending refund
                                                </span>
                                                <p className="text-sm text-orange-700">
                                                    Select records to generate MIS report for DTDO
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-lg border border-orange-100 shadow-sm">
                                            <span className="text-sm text-orange-600 font-medium mr-2">Total Value:</span>
                                            <span className="text-xl font-bold text-orange-700">
                                                {formatCurrency(refundableData.summary.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="w-[50px]">
                                                        <Checkbox
                                                            checked={
                                                                refundableData.refundable.length > 0 &&
                                                                selectedRefunds.size === refundableData.refundable.length
                                                            }
                                                            onCheckedChange={toggleAllRefunds}
                                                        />
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Application</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Owner</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">District</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">GRN</TableHead>
                                                    <TableHead className="font-semibold text-slate-900">Payment Date</TableHead>
                                                    <TableHead className="text-right font-semibold text-slate-900">Amount</TableHead>
                                                    <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {refundableData.refundable
                                                    .filter((row) => {
                                                        if (!searchQuery) return true;
                                                        const q = searchQuery.toLowerCase();
                                                        return (
                                                            row.applicationNumber?.toLowerCase().includes(q) ||
                                                            row.ownerName?.toLowerCase().includes(q) ||
                                                            row.district?.toLowerCase().includes(q) ||
                                                            row.echTxnId?.toLowerCase().includes(q)
                                                        );
                                                    })
                                                    .map((row) => (
                                                        <TableRow key={row.transactionId} className="hover:bg-slate-50/50 transition-colors">
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedRefunds.has(row.transactionId)}
                                                                    onCheckedChange={() => toggleRefundSelection(row.transactionId)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-semibold text-slate-900">
                                                                    {row.applicationNumber}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {row.propertyName}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>{row.ownerName}</TableCell>
                                                            <TableCell>{row.district}</TableCell>
                                                            <TableCell className="font-mono text-xs text-slate-500">{row.echTxnId}</TableCell>
                                                            <TableCell>
                                                                {row.paymentDate
                                                                    ? format(new Date(row.paymentDate), "dd MMM yyyy")
                                                                    : "—"}
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-orange-600">
                                                                {formatCurrency(row.totalAmount)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                                    onClick={() => handleConfirmRefund(row.transactionId)}
                                                                >
                                                                    Mark Refunded
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <CheckSquare className="w-12 h-12 text-emerald-300 mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold text-slate-900">No Refundable Payments</h3>
                                    <p className="text-muted-foreground">This is good! No applications were rejected after payment.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* District Performance Tab - Only for HQ/Admins */}
                {!isDTDO && (
                    <TabsContent value="performance" className="mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                            <BarChart3 className="w-4 h-4" />
                                        </div>
                                        District-wise Performance
                                    </CardTitle>
                                    <CardDescription>
                                        Overview of application status and processing efficiency across all districts.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {performanceLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="font-semibold text-slate-900">District</TableHead>
                                                    <TableHead
                                                        className="text-right font-semibold text-slate-900 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                                                        onClick={() => togglePerfSort("totalApps")}
                                                    >
                                                        <span className="flex items-center justify-end">
                                                            Total Apps
                                                            <PerfSortIcon field="totalApps" />
                                                        </span>
                                                    </TableHead>
                                                    <TableHead className="text-right font-semibold text-orange-600">Pending</TableHead>
                                                    <TableHead className="text-right font-semibold text-emerald-600">Approved</TableHead>
                                                    <TableHead className="text-right font-semibold text-rose-600">Rejected</TableHead>
                                                    <TableHead
                                                        className="text-right font-semibold text-slate-900 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                                                        onClick={() => togglePerfSort("avgTime")}
                                                    >
                                                        <span className="flex items-center justify-end">
                                                            Avg Form Time
                                                            <PerfSortIcon field="avgTime" />
                                                        </span>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {processedPerformance.map((row) => (
                                                    <TableRow key={row.district} className="hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="font-medium text-slate-900">{row.district}</TableCell>
                                                        <TableCell className="text-right font-bold text-slate-900">{row.totalApplications}</TableCell>
                                                        <TableCell className="text-right text-orange-600">{row.pending}</TableCell>
                                                        <TableCell className="text-right text-emerald-600">{row.approved}</TableCell>
                                                        <TableCell className="text-right text-rose-600">{row.rejected}</TableCell>
                                                        <TableCell className="text-right font-mono text-muted-foreground">
                                                            {formatDuration(row.avgTimeSeconds || 0)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {!districtPerformance?.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                            No data available.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="drafts" className="mt-6">
                    <DraftApplicationsTable
                        district={selectedDistrict}
                        fromDate={fromDate}
                        toDate={toDate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function DraftApplicationsTable({
    district,
    fromDate,
    toDate
}: {
    district: string;
    fromDate: string;
    toDate: string;
}) {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ["admin-applications", "draft", district, fromDate, toDate, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                status: "draft",
                page: page.toString(),
                limit: limit.toString(),
            });
            if (district && district !== "all") params.append("district", district);
            if (fromDate) params.append("from", fromDate);
            if (toDate) params.append("to", toDate);

            // Use apiRequest helper if available, or fetch
            const res = await fetch(`/api/admin/reports/applications?${params}`);
            if (!res.ok) throw new Error("Failed to fetch drafts");
            return res.json();
        },
        // Reset page if filters change
    });

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [district, fromDate, toDate]);

    const apps = data?.applications || [];
    const totalPages = data?.pagination?.totalPages || 0;
    const totalCount = data?.pagination?.totalCount || 0;

    if (isLoading) {
        return <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>;
    }

    if (apps.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <div className="p-3 bg-white rounded-full inline-block shadow-sm mb-4">
                    <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No Draft Applications</h3>
                <p className="text-muted-foreground">There are no draft applications matching your filters.</p>
            </div>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    Draft Applications
                    <Badge variant="secondary">{totalCount} Found</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-slate-200">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Application ID</TableHead>
                                <TableHead>Property / Owner</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Mobile</TableHead>
                                <TableHead>Started On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apps.map((app: any) => (
                                <TableRow key={app.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                        {app.applicationNumber || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{app.propertyName}</div>
                                        <div className="text-sm text-muted-foreground">{app.ownerName}</div>
                                    </TableCell>
                                    <TableCell>{app.district}</TableCell>
                                    <TableCell>{app.mobile}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {app.createdAt ? format(new Date(app.createdAt), "dd MMM yyyy, HH:mm") : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Simple Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PendingTransactionsTable() {
    const { data, isLoading } = useQuery<{
        transactions: any[];
        total: number;
    }>({
        queryKey: ["/api/himkosh/transactions", "pending-tab"],
        queryFn: async () => {
            // Fetch initiated transactions
            const initiatedRes = await apiRequest("GET", "/api/himkosh/transactions?limit=100&excludeTest=true&status=initiated");
            const initiated = await initiatedRes.json();
            // Fetch redirected transactions  
            const redirectedRes = await apiRequest("GET", "/api/himkosh/transactions?limit=100&excludeTest=true&status=redirected");
            const redirected = await redirectedRes.json();

            const allTxns = [
                ...(initiated.transactions || []),
                ...(redirected.transactions || []),
            ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return {
                transactions: allTxns,
                total: (initiated.total || 0) + (redirected.total || 0),
            };
        },
    });

    const transactions = data?.transactions || [];

    if (isLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        Pending / Incomplete Transactions
                        {data?.total !== undefined && data.total > 0 && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">{data.total}</Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Payments initiated or redirected to HimKosh but never completed (user abandoned or gateway timeout)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No pending transactions</p>
                        <p className="text-sm">All payment attempts have been resolved.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>DDO Code</TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>App Ref</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((txn: any) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="whitespace-nowrap text-xs">
                                            {formatDbTimestamp(txn.createdAt)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {txn.applicationDistrict || "—"}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {txn.ddo || "—"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {txn.tenderBy || "—"}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(txn.totalAmount || 0)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                txn.transactionStatus === 'initiated'
                                                    ? 'border-slate-300 text-slate-600 bg-slate-50'
                                                    : 'border-amber-300 text-amber-700 bg-amber-50'
                                            }>
                                                {txn.transactionStatus === 'initiated' ? 'Initiated' : 'Redirected'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs max-w-[120px] truncate">
                                            {txn.appRefNo || "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
