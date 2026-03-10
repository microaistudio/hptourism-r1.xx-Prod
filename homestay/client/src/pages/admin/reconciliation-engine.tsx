import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import {
    RefreshCw,
    ShieldAlert,
    Save,
    PlayCircle,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    Lock,
    Unlock,
    Loader2,
    Filter,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Interfaces
interface ReconciliationSettings {
    cronIntervalMinutes: number;
    staleThresholdMinutes: number;
    maxBatchSize: number;
    enabled: boolean;
    pageLoadEnabled: boolean;
}

interface HimkoshTransaction {
    id: string;
    applicationId: string;
    status: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    reconciledAt: string | null;
    applicationDistrict?: string;
}

interface ReconLogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    details?: any;
}

export default function ReconciliationEngine() {
    const { toast } = useToast();

    // Auth query for password gate bypass and validation
    const { data: authData } = useQuery<{ user: any }>({
        queryKey: ["/api/auth/me"],
    });

    const isPaymentOfficer = authData?.user?.role === "payment_officer";

    // Critical Control Password Gate
    // Allow payment_officer to bypass the password gate directly
    const [criticalUnlocked, setCriticalUnlocked] = useState(isPaymentOfficer);
    useEffect(() => {
        if (isPaymentOfficer) {
            setCriticalUnlocked(true);
        }
    }, [isPaymentOfficer]);

    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const verifyPasswordMutation = useMutation({
        mutationFn: async (password: string) => {
            const username = authData?.user?.username;
            const response = await apiRequest("POST", "/api/verify-critical-password", { password, username });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Invalid password");
            }
            return response.json();
        },
        onSuccess: () => {
            setCriticalUnlocked(true);
            setPasswordError("");
        },
        onError: (error: Error) => {
            setPasswordError(error.message);
        },
    });

    // Data fetching
    const {
        data: reconSettings,
        isLoading: reconSettingsLoading,
        refetch: refetchReconSettings,
    } = useQuery<ReconciliationSettings>({
        queryKey: ["/api/himkosh/reconciliation/settings"],
        queryFn: async () => {
            const response = await apiRequest("GET", "/api/himkosh/reconciliation/settings");
            return response.json();
        },
        enabled: criticalUnlocked,
    });

    const [reconForm, setReconForm] = useState<ReconciliationSettings>({
        cronIntervalMinutes: 15,
        staleThresholdMinutes: 30,
        maxBatchSize: 10,
        enabled: false,
        pageLoadEnabled: false,
    });
    const [reconFormDirty, setReconFormDirty] = useState(false);

    useEffect(() => {
        if (reconSettings) {
            setReconForm(reconSettings);
            setReconFormDirty(false);
        }
    }, [reconSettings]);

    const handleReconFormChange = (field: keyof ReconciliationSettings, value: number | boolean) => {
        setReconForm((prev) => ({ ...prev, [field]: value }));
        setReconFormDirty(true);
    };

    const updateReconSettingsMutation = useMutation({
        mutationFn: async (settings: ReconciliationSettings) => {
            const response = await apiRequest("PUT", "/api/himkosh/reconciliation/settings", settings);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update settings");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/himkosh/reconciliation/settings"] });
            setReconFormDirty(false);
            toast({
                title: "Reconciliation settings saved",
                description: "Auto-reconciliation configuration has been updated.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Update failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const runReconNowMutation = useMutation({
        mutationFn: async () => {
            const response = await apiRequest("POST", "/api/himkosh/reconciliation/run-now");
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Reconciliation cycle failed");
            }
            return response.json();
        },
        onSuccess: (data) => {
            toast({
                title: "Reconciliation complete",
                description: data.message || "Cron cycle ran successfully.",
            });
            refetchTransactions();
        },
        onError: (error: Error) => {
            toast({
                title: "Reconciliation failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Transaction Data
    const [txFilter, setTxFilter] = useState("initiated");

    const {
        data: txData,
        isLoading: txLoading,
        refetch: refetchTransactions
    } = useQuery<{
        transactions: (HimkoshTransaction)[];
        total: number;
        limit: number;
        offset: number;
    }>({
        queryKey: ["/api/himkosh/transactions", 50, "all", txFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("limit", "50");
            params.set("excludeTest", "true");
            if (txFilter !== "all" && txFilter !== "reconciled") {
                params.set("status", txFilter);
            }
            const response = await apiRequest(
                "GET",
                `/api/himkosh/transactions?${params.toString()}`,
            );
            return response.json();
        },
        enabled: criticalUnlocked,
    });

    // Show Reconciled filtering client side since we don't have a direct reconciled filter in backend
    const displayTransactions = (txData?.transactions || []).filter(tx => {
        if (txFilter === "reconciled") {
            return tx.reconciledAt !== null;
        }
        return true;
    });

    // Logs Data
    const { data: logsData, isLoading: logsLoading } = useQuery<ReconLogEntry[]>({
        queryKey: ["/api/himkosh/reconciliation/logs"],
        queryFn: async () => {
            const response = await apiRequest("GET", "/api/himkosh/reconciliation/logs");
            return response.json();
        },
        enabled: criticalUnlocked,
        refetchInterval: 5000, // Poll every 5s while looking at the page
    });

    // Password Gate Rendering
    if (!criticalUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
                <Lock className="w-16 h-16 text-slate-300 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Reconciliation Engine Locked</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    This area controls mission-critical background jobs and payment sync functionality.
                    Please unlock to proceed.
                </p>

                <div className="w-full max-w-sm space-y-4">
                    <Input
                        type="password"
                        placeholder="Critical Controls Password"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setPasswordError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && passwordInput) {
                                verifyPasswordMutation.mutate(passwordInput);
                            }
                        }}
                    />
                    {passwordError && (
                        <p className="text-sm text-red-600 text-left">{passwordError}</p>
                    )}
                    <Button
                        className="w-full"
                        onClick={() => verifyPasswordMutation.mutate(passwordInput)}
                        disabled={verifyPasswordMutation.isPending || !passwordInput}
                    >
                        {verifyPasswordMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Unlock className="w-4 h-4 mr-2" />}
                        Unlock Engine Data
                    </Button>
                    <div className="pt-4">
                        <Button variant="ghost" asChild className="w-full text-muted-foreground">
                            <Link href={authData?.user?.role === "super_admin" ? "/admin/super-dashboard" : "/admin/payment-reports"}>
                                Cancel & Return
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href={authData?.user?.role === "super_admin" ? "/admin/super-dashboard" : "/admin/payment-reports"}>
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reconciliation Engine</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage automated payment sync and investigate stranded transactions.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none px-0 bg-transparent h-auto pb-4 gap-6">
                    <TabsTrigger
                        value="transactions"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2"
                    >
                        Stuck Transactions
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2"
                    >
                        Engine Settings
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2"
                    >
                        System Log
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="mt-6">
                    <Card className="border-indigo-100 shadow-sm border-2">
                        <CardHeader className="bg-indigo-50/50 rounded-t-lg pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                                        <RefreshCw className="w-5 h-5" />
                                        Auto-Reconciliation Service
                                    </CardTitle>
                                    <CardDescription className="text-indigo-800/70">
                                        Configured on Layer 1 (Cron) and Layer 2 (Page Load).
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchReconSettings()}
                                        disabled={reconSettingsLoading}
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${reconSettingsLoading ? "animate-spin" : ""}`} />
                                        Refresh State
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                        onClick={() => runReconNowMutation.mutate()}
                                        disabled={runReconNowMutation.isPending}
                                    >
                                        {runReconNowMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Run Cycle Now
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {reconSettingsLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Layer 1 Setup */}
                                        <div className="space-y-4 border rounded-lg p-5 bg-slate-50/50">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Label className="text-base font-semibold text-slate-900">Layer 1: Cron Reconciliation</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">Runs strictly in background checking for stranded transactions regularly.</p>
                                                </div>
                                                <Switch
                                                    checked={reconForm.enabled}
                                                    onCheckedChange={(checked) => handleReconFormChange("enabled", checked)}
                                                    disabled={isPaymentOfficer}
                                                />
                                            </div>
                                            <div className="pt-2">
                                                <Label>Cron Interval (Minutes)</Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={1440}
                                                    className="mt-1"
                                                    value={reconForm.cronIntervalMinutes}
                                                    onChange={(e) => handleReconFormChange("cronIntervalMinutes", parseInt(e.target.value) || 15)}
                                                    disabled={isPaymentOfficer}
                                                />
                                            </div>
                                        </div>

                                        {/* Layer 2 Setup */}
                                        <div className="space-y-4 border rounded-lg p-5 bg-slate-50/50">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Label className="text-base font-semibold text-slate-900">Layer 2: Page-Load Reconciliation</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">Auto-syncs application status if an applicant views their tracked application.</p>
                                                </div>
                                                <Switch
                                                    checked={reconForm.pageLoadEnabled}
                                                    onCheckedChange={(checked) => handleReconFormChange("pageLoadEnabled", checked)}
                                                    disabled={isPaymentOfficer}
                                                />
                                            </div>
                                            <div className="pt-4">
                                                <Badge variant="outline" className={reconForm.pageLoadEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200 mt-2" : "bg-slate-100 text-slate-500 border-slate-200 mt-2"}>
                                                    {reconForm.pageLoadEnabled ? "Feature is Active" : "Feature is Disabled"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Engine Params */}
                                    <div className="border-t pt-6">
                                        <h3 className="font-semibold mb-4 text-slate-800">Global Engine Parameters</h3>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label>Stale Threshold (Minutes)</Label>
                                                    <p className="text-[13px] text-muted-foreground">Transactions must be older than this to be audited.</p>
                                                </div>
                                                <Input
                                                    type="number"
                                                    min={5}
                                                    max={1440}
                                                    value={reconForm.staleThresholdMinutes}
                                                    onChange={(e) => handleReconFormChange("staleThresholdMinutes", parseInt(e.target.value) || 30)}
                                                    disabled={isPaymentOfficer}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label>Max Batch Size</Label>
                                                    <p className="text-[13px] text-muted-foreground">Maximum transactions to process per cron execution.</p>
                                                </div>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={50}
                                                    value={reconForm.maxBatchSize}
                                                    onChange={(e) => handleReconFormChange("maxBatchSize", parseInt(e.target.value) || 10)}
                                                    disabled={isPaymentOfficer}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <div className="p-4 bg-slate-50 rounded-b-lg border-t flex flex-wrap gap-4 items-center justify-between">
                            <div className="text-sm text-amber-700 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                                <ShieldAlert className="w-4 h-4" />
                                Both layers require PROD firewall unblocking for Himkosh Gateway outbound calls.
                            </div>
                            <Button
                                onClick={() => updateReconSettingsMutation.mutate(reconForm)}
                                disabled={!reconFormDirty || updateReconSettingsMutation.isPending || isPaymentOfficer}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {updateReconSettingsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {isPaymentOfficer ? "Read-Only Mode" : "Save Configuration"}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions" className="mt-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl flex items-center gap-2 text-slate-800"><RefreshCw className="w-5 h-5" /> Transaction Monitor</CardTitle>
                                <div className="flex gap-4 items-center">
                                    <Select value={txFilter} onValueChange={setTxFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <Filter className="w-4 h-4 mr-2" />
                                            <SelectValue placeholder="Status Filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Transactions</SelectItem>
                                            <SelectItem value="initiated">Stuck: Initiated</SelectItem>
                                            <SelectItem value="redirected">Stuck: Redirected</SelectItem>
                                            <SelectItem value="success">Successful</SelectItem>
                                            <SelectItem value="failure">Failed</SelectItem>
                                            <SelectItem value="reconciled">Reconciled Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {txLoading ? (
                                <div className="h-40 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead>Target Application</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Reconciled</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {displayTransactions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                        {txFilter === "initiated" || txFilter === "redirected" ? "No stuck transactions found. The queue is clean." : "No transactions matching filter."}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                displayTransactions.map((tx) => (
                                                    <TableRow key={tx.id}>
                                                        <TableCell className="font-medium">
                                                            <Link href={`/admin/rc-applications/${tx.applicationId}`} className="text-primary hover:underline">
                                                                {tx.applicationId.slice(0, 8)}...
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>₹{tx.amount}</TableCell>
                                                        <TableCell>
                                                            {tx.status === "initiated" || tx.status === "redirected" ? (
                                                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    Stuck ({tx.status})
                                                                </Badge>
                                                            ) : tx.status === "success" ? (
                                                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                    Success
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                                                    <XCircle className="w-3 h-3 mr-1" />
                                                                    {tx.status}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-slate-500">
                                                            {format(new Date(tx.createdAt), "MMM d, HH:mm")}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-slate-500">
                                                            {tx.reconciledAt ? (
                                                                <span className="text-indigo-600 font-medium">
                                                                    ✓ {format(new Date(tx.reconciledAt), "MMM d, HH:mm")}
                                                                </span>
                                                            ) : "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                                    <Clock className="w-5 h-5" /> Backend Activity Log
                                </CardTitle>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal">
                                    Live auto-refresh
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {logsLoading ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : !logsData || logsData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-16 text-center">
                                    <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                                    <h3 className="text-lg font-medium text-slate-800">No Logs Yet</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The engine hasn't written any log entries to memory since the last server restart.
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[600px] overflow-y-auto bg-slate-950 p-4 font-mono text-sm leading-relaxed rounded-b-[inherit]">
                                    {logsData.map((log, i) => (
                                        <div key={i} className="mb-2 break-words">
                                            <span className="text-slate-500 text-xs mr-3">
                                                {format(new Date(log.timestamp), "HH:mm:ss")}
                                            </span>
                                            <span className={`mr-2 font-bold ${log.level === 'error' ? 'text-red-400' :
                                                log.level === 'warn' ? 'text-amber-400' :
                                                    log.level === 'debug' ? 'text-slate-400' :
                                                        'text-emerald-400'
                                                }`}>
                                                [{log.level.toUpperCase()}]
                                            </span>
                                            <span className="text-slate-300">{log.message}</span>
                                            {log.details && (
                                                <div className="pl-[84px] mt-1 mb-2">
                                                    <pre className="text-slate-400 text-xs bg-slate-900/50 p-2 rounded-sm whitespace-pre-wrap">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
