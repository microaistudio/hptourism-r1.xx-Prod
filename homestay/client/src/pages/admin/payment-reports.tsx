import { useState, useEffect } from "react";
import { format, startOfMonth, subDays, startOfDay, endOfDay } from "date-fns";
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
} from "lucide-react";
import { getDistricts } from "@shared/regions";
import { Checkbox } from "@/components/ui/checkbox";

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
    const allDistricts = getDistricts();
    const [selectedRefunds, setSelectedRefunds] = useState<Set<string>>(new Set());

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
            params.set("limit", "50");
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
        queryKey: ["reports-operations", fromDate, toDate, selectedDistrict],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (fromDate) params.set("from", fromDate);
            if (toDate) params.set("to", toDate);
            if (selectedDistrict && selectedDistrict !== "all") {
                params.set("district", selectedDistrict);
            }
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
        link.download = `collections-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
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
            row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd HH:mm") : "",
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => csvEscape(cell)).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payments-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
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
            row.paymentDate ? format(new Date(row.paymentDate), "yyyy-MM-dd HH:mm") : "",
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
        link.download = `refund-mis-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Exported", description: `Exported ${selectedRecords.length} records for MIS.` });
    };

    // Quick filter handlers
    const applyFilter = (type: "thisMonth" | "last7" | "last30") => {
        const today = new Date();
        let start: Date;

        if (type === "thisMonth") {
            start = startOfMonth(today);
        } else if (type === "last7") {
            start = subDays(today, 7);
        } else {
            start = subDays(today, 30);
        }

        setFromDate(format(start, "yyyy-MM-dd"));
        setToDate(format(today, "yyyy-MM-dd"));
    };

    return (
        <div className="container mx-auto max-w-7xl py-6 space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                        Reports & Insights
                    </h1>
                    <p className="text-muted-foreground">
                        {summary?.district
                            ? `Showing data for ${summary.district} district`
                            : "Operational metrics and payment analytics"}
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Total Collected</p>
                                <p className="text-2xl font-bold">
                                    {summaryLoading ? (
                                        <Skeleton className="h-8 w-24 bg-white/20" />
                                    ) : (
                                        formatCurrency(summary?.totalCollected || 0)
                                    )}
                                </p>
                            </div>
                            <IndianRupee className="h-10 w-10 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Successful</p>
                                <p className="text-2xl font-bold">
                                    {summaryLoading ? (
                                        <Skeleton className="h-8 w-16 bg-white/20" />
                                    ) : (
                                        summary?.successfulTransactions || 0
                                    )}
                                </p>
                            </div>
                            <TrendingUp className="h-10 w-10 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Failed</p>
                                <p className="text-2xl font-bold">
                                    {summaryLoading ? (
                                        <Skeleton className="h-8 w-16 bg-white/20" />
                                    ) : (
                                        summary?.failedTransactions || 0
                                    )}
                                </p>
                            </div>
                            <AlertTriangle className="h-10 w-10 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Total Transactions</p>
                                <p className="text-2xl font-bold">
                                    {summaryLoading ? (
                                        <Skeleton className="h-8 w-16 bg-white/20" />
                                    ) : (
                                        summary?.totalTransactions || 0
                                    )}
                                </p>
                            </div>
                            <Building2 className="h-10 w-10 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* District Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-1 block">
                                District {isDTDO && <span className="text-muted-foreground text-xs">(Your district)</span>}
                            </label>
                            <Select
                                value={selectedDistrict}
                                onValueChange={setSelectedDistrict}
                                disabled={isDTDO}
                            >
                                <SelectTrigger className={isDTDO ? "bg-muted" : ""}>
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

                        <div className="flex-1 min-w-[150px]">
                            <label className="text-sm font-medium mb-1 block">From Date</label>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-sm font-medium mb-1 block">To Date</label>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                            <Button variant="outline" size="sm" onClick={() => applyFilter("thisMonth")}>
                                This Month
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => applyFilter("last7")}>
                                Last 7 Days
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => applyFilter("last30")}>
                                Last 30 Days
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFromDate("");
                                setToDate("");
                                // Only reset district for admins, not for DTDOs
                                if (canSelectDistrict) {
                                    setSelectedDistrict("all");
                                }
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Report Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="operations">Operations</TabsTrigger>
                    <TabsTrigger value="collections">Collection by DDO</TabsTrigger>
                    <TabsTrigger value="payments">Approved Payments</TabsTrigger>
                    <TabsTrigger value="refundable">Refundable</TabsTrigger>
                    {!isDTDO && <TabsTrigger value="performance">District Performance</TabsTrigger>}
                </TabsList>

                {/* Operations Tab */}
                <TabsContent value="operations">
                    <div className="space-y-6">
                        {operationsLoading ? (
                            <div className="grid gap-4 md:grid-cols-3">
                                <Skeleton className="h-32" />
                                <Skeleton className="h-32" />
                                <Skeleton className="h-32" />
                            </div>
                        ) : operationsData ? (
                            <>
                                {/* Top-Level Metrics */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Total Applications Card */}
                                    <Card className="border-l-4 border-l-purple-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-purple-500" />
                                                Application Pipeline
                                            </CardTitle>
                                            <CardDescription>Status breakdown</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold text-purple-600">
                                                {operationsData.corrections.totalApplications}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-3">Total Submitted</p>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between items-center bg-green-50 p-1.5 rounded text-green-700">
                                                    <span>Approved</span>
                                                    <span className="font-bold">{operationsData.processingTime.totalApproved}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-red-50 p-1.5 rounded text-red-700">
                                                    <span>Rejected</span>
                                                    <div className="text-right">
                                                        <span className="font-bold block">{operationsData.corrections.totalRejected}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-orange-50 p-1.5 rounded text-orange-700">
                                                    <span>Pending</span>
                                                    <span className="font-bold">
                                                        {Math.max(0, operationsData.corrections.totalApplications - operationsData.processingTime.totalApproved - operationsData.corrections.totalRejected)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Processing Time Card */}
                                    <Card className="border-l-4 border-l-blue-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                                Processing Time
                                            </CardTitle>
                                            <CardDescription>Submitted → Approved</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold text-blue-600">
                                                {operationsData.processingTime.avgDays} days
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Min:</span>
                                                    <span>{operationsData.processingTime.minDays} days</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Max:</span>
                                                    <span>{operationsData.processingTime.maxDays} days</span>
                                                </div>
                                                <div className="flex justify-between font-medium pt-1 border-t">
                                                    <span>Based on:</span>
                                                    <span>{operationsData.processingTime.totalApproved} approved</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Form Completion Time Card */}
                                    <Card className="border-l-4 border-l-emerald-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Timer className="h-4 w-4 text-emerald-500" />
                                                Avg Form Fill Time
                                            </CardTitle>
                                            <CardDescription>User time on application form</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold text-emerald-600">
                                                {formatDuration(operationsData.formCompletionTime.avgSeconds)}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Min:</span>
                                                    <span>{formatDuration(operationsData.formCompletionTime.minSeconds)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Max:</span>
                                                    <span>{formatDuration(operationsData.formCompletionTime.maxSeconds)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium pt-1 border-t">
                                                    <span>Tracked:</span>
                                                    <span>{operationsData.formCompletionTime.totalTracked} apps</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Correction/Reversion Card */}
                                    <Card className="border-l-4 border-l-orange-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <RefreshCcw className="h-4 w-4 text-orange-500" />
                                                Quality & Corrections
                                            </CardTitle>
                                            <CardDescription>Sent back for rework</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold text-orange-600">
                                                {operationsData.corrections.correctionRate}%
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-3">Correction Rate</p>

                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex justify-between border-b pb-1">
                                                    <span>Sent Back:</span>
                                                    <span className="font-medium text-foreground">{operationsData.corrections.totalWithCorrections} apps</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span>Avg Revisions:</span>
                                                    <span className="font-medium text-foreground">{operationsData.corrections.avgReversions}</span>
                                                </div>

                                                <div className="pt-2 text-xs bg-slate-50 p-2 rounded mt-2">
                                                    <span className="block text-slate-500 mb-1">Interpretation:</span>
                                                    Lower rate indicates better application quality from owners.
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Category Breakdown */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5" />
                                            Processing by Category
                                        </CardTitle>
                                        <CardDescription>
                                            Average processing time and count per category
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead className="text-right">Applications</TableHead>
                                                    <TableHead className="text-right">Avg Processing</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {operationsData.categoryBreakdown.map((cat, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium capitalize">
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    cat.category === "diamond"
                                                                        ? "border-purple-300 bg-purple-50 text-purple-700"
                                                                        : cat.category === "gold"
                                                                            ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                                                            : "border-slate-300 bg-slate-50 text-slate-700"
                                                                }
                                                            >
                                                                {cat.category || "Uncategorized"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">{cat.count}</TableCell>
                                                        <TableCell className="text-right">{cat.avgProcessingDays} days</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Status Breakdown */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Status Distribution</CardTitle>
                                        <CardDescription>Current application status counts</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {operationsData.statusBreakdown.map((s, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="text-sm py-1 px-3"
                                                >
                                                    {(s.status || "unknown").replace(/_/g, " ")}: {s.count}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No operations data available
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Collections Tab */}
                <TabsContent value="collections">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Collection by District/DDO</CardTitle>
                                <CardDescription>
                                    Revenue collected per treasury DDO code
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportCollectionsCsv}
                                disabled={!collectionsData?.collections.length}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {collectionsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : collectionsData?.collections.length ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>DDO Code</TableHead>
                                                    <TableHead>District</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead className="text-right">Transactions</TableHead>
                                                    <TableHead className="text-right">Successful</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {collectionsData.collections.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-mono">
                                                            {row.ddo || "—"}
                                                        </TableCell>
                                                        <TableCell>{row.district || "—"}</TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {row.ddoDescription || "—"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {row.totalTransactions}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                                                {row.successfulTransactions}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {formatCurrency(row.totalAmount)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-4 p-4 bg-muted rounded-lg flex justify-between items-center">
                                        <span className="font-medium">Grand Total</span>
                                        <span className="text-xl font-bold text-primary">
                                            {formatCurrency(collectionsData.totals.totalAmount)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No collection data available
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Approved Payments</CardTitle>
                                <CardDescription>
                                    All successful HimKosh transactions
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportPaymentsCsv}
                                disabled={!paymentsData?.payments.length}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {paymentsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : paymentsData?.payments.length ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Application</TableHead>
                                                <TableHead>DDO</TableHead>
                                                <TableHead>Payee</TableHead>
                                                <TableHead>GRN</TableHead>
                                                <TableHead>Bank</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentsData.payments.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        {row.createdAt
                                                            ? format(new Date(row.createdAt), "dd MMM yyyy")
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs">
                                                        {row.deptRefNo}
                                                    </TableCell>
                                                    <TableCell className="font-mono">{row.ddo}</TableCell>
                                                    <TableCell>{row.tenderBy}</TableCell>
                                                    <TableCell className="font-mono">{row.echTxnId}</TableCell>
                                                    <TableCell>{row.bankName}</TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {formatCurrency(row.totalAmount)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No payment data available
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Refundable Tab */}
                <TabsContent value="refundable">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
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
                                        className="gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export MIS Report ({selectedRefunds.size})
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {refundableLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : refundableData?.refundable.length ? (
                                <>
                                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center">
                                        <div>
                                            <span className="font-medium text-orange-800">
                                                {refundableData.summary.count} payments pending refund
                                            </span>
                                            <p className="text-sm text-orange-600">
                                                Select records to generate MIS report for DTDO
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-orange-700">
                                            {formatCurrency(refundableData.summary.totalAmount)}
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
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
                                                    <TableHead>Application</TableHead>
                                                    <TableHead>Owner</TableHead>
                                                    <TableHead>District</TableHead>
                                                    <TableHead>GRN</TableHead>
                                                    <TableHead>Payment Date</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {refundableData.refundable.map((row) => (
                                                    <TableRow key={row.transactionId}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedRefunds.has(row.transactionId)}
                                                                onCheckedChange={() => toggleRefundSelection(row.transactionId)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-semibold">
                                                                {row.applicationNumber}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {row.propertyName}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>{row.ownerName}</TableCell>
                                                        <TableCell>{row.district}</TableCell>
                                                        <TableCell className="font-mono">{row.echTxnId}</TableCell>
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
                                <div className="text-center py-8">
                                    <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <p className="text-muted-foreground">
                                        No refundable payments found
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This is good! No applications were rejected after payment.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* District Performance Tab - Only for HQ/Admins */}
                {!isDTDO && (
                    <TabsContent value="performance">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    District-wise Performance
                                </CardTitle>
                                <CardDescription>
                                    Overview of application status and processing efficiency across all districts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {performanceLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>District</TableHead>
                                                    <TableHead className="text-right">Total Apps</TableHead>
                                                    <TableHead className="text-right text-orange-600">Pending</TableHead>
                                                    <TableHead className="text-right text-green-600">Approved</TableHead>
                                                    <TableHead className="text-right text-red-600">Rejected</TableHead>
                                                    <TableHead className="text-right">Avg Form Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {districtPerformance?.map((row) => (
                                                    <TableRow key={row.district}>
                                                        <TableCell className="font-medium">{row.district}</TableCell>
                                                        <TableCell className="text-right font-bold">{row.totalApplications}</TableCell>
                                                        <TableCell className="text-right">{row.pending}</TableCell>
                                                        <TableCell className="text-right">{row.approved}</TableCell>
                                                        <TableCell className="text-right">{row.rejected}</TableCell>
                                                        <TableCell className="text-right font-mono text-muted-foreground">
                                                            {formatDuration(row.avgTimeSeconds || 0)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {!districtPerformance?.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-24 text-center">
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
            </Tabs>
        </div>
    );
}
