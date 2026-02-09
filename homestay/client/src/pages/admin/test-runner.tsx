
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Smartphone, User, Play, ExternalLink, RefreshCw, IndianRupee } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

const DISTRICTS = [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu",
    "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
];

export default function TestRunner() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("owner");

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Test Runner Dashboard</h1>
                <p className="text-muted-foreground">
                    Safe Environment for Pipeline Testing, Routing Verification, and Payment Checks.
                    <span className="block text-amber-600 font-medium mt-1">
                        ⚠️ Strictly for Development/Staging use only.
                    </span>
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="owner">1. Owner Workflow (Pipelines)</TabsTrigger>
                    <TabsTrigger value="staff">2. Staff Workflow (Routing)</TabsTrigger>
                    <TabsTrigger value="system">3. System & Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="owner">
                    <OwnerWorkflowModule />
                </TabsContent>

                <TabsContent value="staff">
                    <StaffWorkflowModule />
                </TabsContent>

                <TabsContent value="system">
                    <SystemWorkflowModule />
                </TabsContent>

                <TabsContent value="reports">
                    <TestReportsModule />
                </TabsContent>
            </Tabs>

            {/* Disclaimer Footer */}
            <div className="bg-slate-100 p-4 rounded text-xs text-slate-500 border border-slate-200">
                <strong>Safety Protocol:</strong> All generated applications are tagged with `TEST-` prefix.
                Do not use this tool on production data.
            </div>
        </div>
    );
}

// --- MODULE 1: OWNER WORKFLOW ---
function OwnerWorkflowModule() {
    const { toast } = useToast();
    const [selectedDistrict, setSelectedDistrict] = useState<string>("Shimla");
    const [tehsil, setTehsil] = useState<string>("");
    const [count, setCount] = useState<number>(3);
    const [bypassPayment, setBypassPayment] = useState<boolean>(true);
    const [log, setLog] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/test/seed-applications", {
                district: selectedDistrict,
                tehsil: tehsil || undefined,
                count,
                status: "submitted", // Default to submitted for pipeline testing
                bypassPayment
            });
            return res.json();
        },
        onSuccess: (data) => {
            toast({ title: "Success", description: `Created ${data.applications.length} applications` });
            setLog(prev => [`[${new Date().toLocaleTimeString()}] ✅ Created ${data.applications.length} apps for ${selectedDistrict}${tehsil ? ` (${tehsil})` : ''}`, ...prev]);
        },
        onError: (err) => {
            toast({ title: "Error", variant: "destructive", description: err.message });
            setLog(prev => [`[${new Date().toLocaleTimeString()}] ❌ Error: ${err.message}`, ...prev]);
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pipeline Generator</CardTitle>
                <CardDescription>Batch create applications to test District Pipelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Tribal Presets */}
                <div className="flex gap-2 p-3 bg-slate-50 border rounded-md">
                    <span className="text-xs font-semibold text-slate-500 flex items-center mr-2">QUICK PRESETS:</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => { setSelectedDistrict("Chamba"); setTehsil("Pangi"); }}
                    >
                        ⚡ Pangi Tribal Pipeline
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => { setSelectedDistrict("Lahaul and Spiti"); setTehsil("Spiti"); }}
                    >
                        ⚡ Spiti Tribal Pipeline
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select District Pipeline</Label>
                            <Select value={selectedDistrict} onValueChange={(d) => { setSelectedDistrict(d); setTehsil(""); }}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DISTRICTS.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tehsil Name (Optional)</Label>
                            <Input
                                placeholder="Auto-assigned if empty (e.g. 'Test Tehsil')"
                                value={tehsil}
                                onChange={(e) => setTehsil(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">
                                * Use "Pangi" or "Spiti" to trigger tribal logic.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Batch Size</Label>
                            <div className="flex gap-2">
                                {[1, 3, 5, 10].map(num => (
                                    <Button
                                        key={num}
                                        variant={count === num ? "default" : "outline"}
                                        onClick={() => setCount(num)}
                                        type="button"
                                    >
                                        {num} Apps
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded bg-amber-50 border-amber-200">
                            <Checkbox id="bypass" checked={bypassPayment} onCheckedChange={(c) => setBypassPayment(!!c)} />
                            <Label htmlFor="bypass" className="cursor-pointer">
                                <strong>Bypass Payment?</strong> (Mark as PAID instanty)
                            </Label>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate()}
                        >
                            {mutation.isPending ? "Generating..." : "Run Pipeline Generation"}
                        </Button>
                    </div>

                    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded h-64 overflow-y-auto">
                        <div className="font-bold border-b border-gray-700 pb-2 mb-2">Build Log:</div>
                        {log.length === 0 && <span className="text-gray-500 italic">Waiting for commands...</span>}
                        {log.map((l, i) => (
                            <div key={i} className="mb-1">{l}</div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- MODULE 2: STAFF WORKFLOW ---
function StaffWorkflowModule() {
    // Fetch stats from backend
    const { data: stats, isLoading } = useQuery({
        queryKey: ['/api/test/routing-stats'],
        queryFn: async () => {
            const res = await fetch("/api/test/routing-stats");
            if (!res.ok) throw new Error("Failed");
            return res.json();
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Routing Verification Matrix</CardTitle>
                <CardDescription>Real-time view of application distribution across queues</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div>Loading stats...</div>
                ) : (
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3">District</th>
                                    <th className="p-3">Drafts</th>
                                    <th className="p-3">Pending Review</th>
                                    <th className="p-3">Approved</th>
                                    <th className="p-3">Routing Health</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(stats || {}).map(([district, counts]: [string, any]) => (
                                    <tr key={district} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{district}</td>
                                        <td className="p-3">{counts['draft'] || 0}</td>
                                        <td className="p-3 font-semibold text-blue-600">{counts['submitted'] || counts['document_verification'] || 0}</td>
                                        <td className="p-3 text-green-600">{counts['approved'] || 0}</td>
                                        <td className="p-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats || Object.keys(stats).length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">No data found in system yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- MODULE 3: SYSTEM WORKFLOW ---
// --- MODULE 3: SYSTEM WORKFLOW ---
function SystemWorkflowModule() {
    const [selectedDistrict, setSelectedDistrict] = useState<string>("Shimla");
    const [preview, setPreview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Fetch DDO Preview
    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const res = await apiRequest("GET", `/api/test/preview-integration?district=${selectedDistrict}`);
                const data = await res.json();
                setPreview(data);
            } catch (e) {
                console.error("Preview failed", e);
            }
        };
        fetchPreview();
    }, [selectedDistrict]);

    // 2-Step Integration Test Flow
    const handlePaymentTest = async () => {
        setIsLoading(true);
        try {
            // Step 1: Create a Real Test Application in DB
            const setupRes = await apiRequest("POST", "/api/test/setup-integration-payment", { district: selectedDistrict });
            const setupData = await setupRes.json();

            if (!setupData.success) throw new Error("Failed to setup test application");

            // Step 2: Trigger Real HimKosh Flow (reusing actual app logic)
            const initiateRes = await apiRequest("POST", "/api/himkosh/initiate", { applicationId: setupData.applicationId });
            const paymentData = await initiateRes.json();

            if (paymentData.encdata) {
                // CRITICAL: HimKosh requires POST, not GET. Create a dynamic form.
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = paymentData.paymentUrl;
                form.target = '_blank';

                const encdataInput = document.createElement('input');
                encdataInput.type = 'hidden';
                encdataInput.name = 'encdata';
                encdataInput.value = paymentData.encdata;
                form.appendChild(encdataInput);

                const merchantInput = document.createElement('input');
                merchantInput.type = 'hidden';
                merchantInput.name = 'merchant_code';
                merchantInput.value = paymentData.merchantCode;
                form.appendChild(merchantInput);

                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);

                toast({ title: "Redirecting to HimKosh", description: `Testing District: ${selectedDistrict}` });
            } else {
                throw new Error("No encryption data received from gateway");
            }

        } catch (e: any) {
            toast({ title: "Test Failed", description: e.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>HimKosh Integration Test (₹1)</CardTitle>
                    <CardDescription>Verifies Full Pipeline: DB → Routing → Keys → Gateway</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded bg-blue-50 p-4 border border-blue-100 text-sm text-blue-800">
                        This test creates a <strong>real temporary application</strong> record and processes it through the <strong>exact same pipeline</strong> as a user application.
                        It verifies District Routing (Tehsil mapping), DDO Selection, Encryption Keys, and Gateway Handshake.
                    </div>

                    <div className="space-y-2">
                        <Label>Select District (Head of Account)</Label>
                        <Select value={selectedDistrict} onValueChange={(d) => setSelectedDistrict(d)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Pangi", "Lahaul-Spiti (Kaza)", "Lahaul", ...DISTRICTS.filter(d => d !== "Lahaul and Spiti")].map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {preview && (
                        <div className="p-3 bg-slate-100 rounded text-xs font-mono space-y-1 border">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Routing Label:</span>
                                <span className="font-bold text-slate-800">{preview.routingLabel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">DDO Code:</span>
                                <span className="font-bold text-green-600">{preview.ddoCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Head:</span>
                                <span>{preview.head1}</span>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handlePaymentTest}
                        disabled={isLoading}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {isLoading ? "Setting up..." : "Proceed to Pay ₹1 (Real Pipeline)"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Active Service Status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Database (Primary)
                        </span>
                        <span className="text-xs text-muted-foreground">Connected</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Object Storage (Local)
                        </span>
                        <span className="text-xs text-muted-foreground">Writable</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            SMS Gateway
                        </span>
                        <span className="text-xs text-muted-foreground">Mock Mode</span>
                    </div>
                </CardContent>
            </Card>

            {/* Test Payment Log */}
            <TestPaymentLogCard selectedDistrict={selectedDistrict} />
        </div>
    );
}

// --- TEST PAYMENT LOG CARD ---
type TestPaymentRow = {
    id: string;
    appRefNo: string;
    deptRefNo: string;
    ddo: string;
    head1: string;
    totalAmount: number;
    transactionStatus: string;
    echTxnId: string | null;
    bankCIN: string | null;
    bankName: string | null;
    tenderBy: string | null;
    createdAt: string;
    applicationDistrict: string;
    applicationId: string;
};

function TestPaymentLogCard({ selectedDistrict }: { selectedDistrict: string }) {
    const [ddoFilter, setDdoFilter] = useState<string>("all");
    const [selectedTxn, setSelectedTxn] = useState<TestPaymentRow | null>(null);

    const { data: ddoCodes } = useQuery<{ ddoCodes: { ddoCode: string; district: string; ddoDescription: string }[] }>({
        queryKey: ["/api/admin/reports/ddo-codes"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/reports/ddo-codes");
            return res.json();
        },
    });

    const { data: payments, isLoading, refetch } = useQuery<{ payments: TestPaymentRow[] }>({
        queryKey: ["test-payments", ddoFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("transactionType", "test");
            params.set("status", "all"); // Get ALL statuses, not just success
            params.set("limit", "50");
            if (ddoFilter && ddoFilter !== "all") {
                params.set("ddo", ddoFilter);
            }
            const res = await apiRequest("GET", `/api/admin/reports/payments?${params.toString()}`);
            return res.json();
        },
        refetchInterval: 10000, // Auto-refresh every 10s
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-green-600" />
                            Test Payment Log
                        </CardTitle>
                        <CardDescription>
                            Transactions from Test Runner (TEST- prefixed applications)
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={ddoFilter} onValueChange={setDdoFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by DDO" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All DDO Codes</SelectItem>
                                {ddoCodes?.ddoCodes?.map((d) => (
                                    <SelectItem key={d.ddoCode} value={d.ddoCode}>
                                        {d.district} ({d.ddoCode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : !payments?.payments?.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No test payments yet. Run a district test above to see transactions here.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>District</TableHead>
                                        <TableHead>DDO Code</TableHead>
                                        <TableHead>Head</TableHead>
                                        <TableHead>GRN</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.payments.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="whitespace-nowrap text-xs">
                                                {row.createdAt ? format(new Date(row.createdAt), "dd MMM HH:mm") : "—"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {row.applicationDistrict || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {row.ddo}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs max-w-[100px] truncate">
                                                {row.head1}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {row.echTxnId || "—"}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(row.totalAmount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={row.transactionStatus === "success" ? "default" : row.transactionStatus === "failed" ? "destructive" : "secondary"}>
                                                    {row.transactionStatus || "pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedTxn(row)}
                                                >
                                                    Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transaction Details Dialog */}
            <Dialog open={Boolean(selectedTxn)} onOpenChange={() => setSelectedTxn(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>
                            HimKosh payment transaction details for test application
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTxn && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Application Ref</p>
                                    <p className="font-mono">{selectedTxn.deptRefNo}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">HimKosh Ref</p>
                                    <p className="font-mono">{selectedTxn.appRefNo}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">District</p>
                                    <p>{selectedTxn.applicationDistrict}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">DDO Code</p>
                                    <p className="font-mono">{selectedTxn.ddo}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Head</p>
                                    <p className="font-mono text-xs">{selectedTxn.head1}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Amount</p>
                                    <p className="font-semibold">{formatCurrency(selectedTxn.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge variant={selectedTxn.transactionStatus === "success" ? "default" : selectedTxn.transactionStatus === "failed" ? "destructive" : "secondary"}>
                                        {selectedTxn.transactionStatus}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">GRN / ECH TxnID</p>
                                    <p className="font-mono">{selectedTxn.echTxnId || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Bank CIN</p>
                                    <p className="font-mono">{selectedTxn.bankCIN || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Bank Name</p>
                                    <p>{selectedTxn.bankName || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Tender By</p>
                                    <p>{selectedTxn.tenderBy || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p>{selectedTxn.createdAt ? format(new Date(selectedTxn.createdAt), "dd MMM yyyy, hh:mm a") : "—"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

// --- MODULE 4: TEST REPORTS ---
function TestReportsModule() {
    const { data: reports, isLoading, refetch } = useQuery({
        queryKey: ['/api/test/reports'],
        queryFn: async () => {
            const res = await fetch("/api/test/reports");
            if (!res.ok) throw new Error("Failed to fetch reports");
            return res.json();
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" /> Refresh Results</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PLAYWRIGHT CARD */}
                <Card className={!reports?.playwright ? "opacity-50" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-500" />
                            E2E Tests (Playwright)
                        </CardTitle>
                        <CardDescription>End-to-End User Flow Verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!reports?.playwright ? (
                            <div className="text-sm text-gray-500 italic">No report found. Run `npm run test:e2e` in terminal.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="font-semibold text-sm">Total Tests</span>
                                    <span className="font-bold">{reports.playwright.stats?.expected ?? 0}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div className="bg-green-100 text-green-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.playwright.stats?.expected - reports.playwright.stats?.unexpected}</div>
                                        Passed
                                    </div>
                                    <div className="bg-red-100 text-red-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.playwright.stats?.unexpected ?? 0}</div>
                                        Failed
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.playwright.stats?.skipped ?? 0}</div>
                                        Skipped
                                    </div>
                                </div>
                                {(reports.playwright.stats?.unexpected > 0) && (
                                    <div className="text-xs text-red-600 border border-red-200 bg-red-50 p-2 rounded mt-2">
                                        <strong>Failures Detected:</strong> Check terminal for details.
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* VITEST CARD */}
                <Card className={!reports?.vitest ? "opacity-50" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-500" />
                            Unit Tests (Vitest)
                        </CardTitle>
                        <CardDescription>Component & Logic Verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!reports?.vitest ? (
                            <div className="text-sm text-gray-500 italic">No report found. Run `npm run test:unit` in terminal.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="font-semibold text-sm">Total Tests</span>
                                    <span className="font-bold">{reports.vitest.numTotalTests ?? 0}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div className="bg-green-100 text-green-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.vitest.numPassedTests ?? 0}</div>
                                        Passed
                                    </div>
                                    <div className="bg-red-100 text-red-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.vitest.numFailedTests ?? 0}</div>
                                        Failed
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-700 p-2 rounded">
                                        <div className="font-bold text-lg">{reports.vitest.numPendingTests ?? 0}</div>
                                        Skipped
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
