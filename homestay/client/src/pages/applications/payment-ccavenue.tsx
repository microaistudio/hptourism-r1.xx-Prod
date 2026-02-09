import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    CreditCard,
    ArrowLeft,
    ShieldCheck,
    Building2,
    Clock3,
    ExternalLink,
    Loader2,
} from "lucide-react";
import type { HomestayApplication } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CCAvenuePaymentResponse = {
    success: boolean;
    paymentUrl: string;
    accessCode: string;
    encRequest: string;
    orderId: string;
    isTestMode: boolean;
};

type CCAvenueTransaction = {
    id: string;
    orderId: string;
    trackingId: string | null;
    orderStatus: string | null; // Initiated, Success, Failure, Aborted, Invalid
    amount: string;
    failureMessage: string | null;
    paymentMode: string | null;
    transDate: string | null;
    createdAt: string;
};

const PAYMENT_ALLOWED_STATUSES = new Set(["draft", "payment_pending", "verified_for_payment"]);

const formatDateTime = (iso?: string | null) => {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const getStatusMeta = (transaction: CCAvenueTransaction | null) => {
    const status = transaction?.orderStatus ?? null;

    switch (status) {
        case "Success":
            return {
                label: "Payment Successful",
                description: "Payment confirmed. You may proceed.",
                badgeVariant: "default" as const,
            };
        case "Failure":
        case "Aborted":
        case "Invalid":
            return {
                label: `Payment ${status}`,
                description: transaction?.failureMessage || "Transaction failed.",
                badgeVariant: "destructive" as const,
            };
        case "Initiated":
            return {
                label: "Awaiting Confirmation",
                description: "Transaction initiated. Waiting for response.",
                badgeVariant: "secondary" as const,
            };
        case null:
            return {
                label: "No payment recorded",
                description: "Click “Proceed to Payment” to initiate.",
                badgeVariant: "outline" as const,
            };
        default:
            return {
                label: status || "Unknown",
                description: "Status unknown.",
                badgeVariant: "secondary" as const,
            };
    }
};

export default function CCAvenuePaymentPage() {
    const { id } = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [paymentInitiated, setPaymentInitiated] = useState<CCAvenuePaymentResponse | null>(null);

    const { data: applicationData, isLoading: appLoading } = useQuery<{
        application: HomestayApplication;
    }>({
        queryKey: ["/api/applications", id],
        enabled: !!id,
    });
    const application = applicationData?.application;

    const {
        data: transactionData,
        isFetching: transactionsFetching,
    } = useQuery<{ transactions: CCAvenueTransaction[] }>({
        queryKey: ["/api/ccavenue/application", id, "transactions"],
        enabled: !!id,
        refetchInterval: (query) => {
            // Poll every 5s if latest transaction is 'Initiated'
            const latest = query.state.data?.transactions?.[0];
            return latest?.orderStatus === 'Initiated' ? 5000 : false;
        }
    });

    const transactions = transactionData?.transactions ?? [];
    const latestTransaction = transactions[0] ?? null;

    const applicationStatus = (application?.status ?? "").toLowerCase().trim();
    const isPaidPendingSubmit = applicationStatus === "paid_pending_submit";
    const applicationAllowsPayment = PAYMENT_ALLOWED_STATUSES.has(applicationStatus);

    const transactionStatus = latestTransaction?.orderStatus ?? null;
    const paymentInProgress = transactionStatus === 'Initiated';

    const paymentSucceeded =
        transactionStatus === "Success" &&
        applicationStatus !== "draft";

    const paymentFailed = ["Failure", "Aborted", "Invalid"].includes(transactionStatus || "");

    const totalFee = Number.parseFloat(application?.totalFee ?? "0") || 0;

    const statusMeta = useMemo(
        () => getStatusMeta(latestTransaction),
        [latestTransaction],
    );

    const lastUpdate = formatDateTime(latestTransaction?.transDate || latestTransaction?.createdAt);

    const initiateMutation = useMutation({
        mutationFn: async () => {
            const response = await apiRequest("POST", "/api/ccavenue/initiate", {
                applicationId: id,
            });
            return response.json();
        },
        onSuccess: (data: CCAvenuePaymentResponse) => {
            setPaymentInitiated(data);
            queryClient.invalidateQueries({
                queryKey: ["/api/ccavenue/application", id, "transactions"],
            });

            if (data.isTestMode) {
                toast({
                    title: "Test Mode Active",
                    description: "Processing a test transaction of ₹1.",
                });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to initiate payment",
                variant: "destructive",
            });
        },
    });

    const manualSubmitMutation = useMutation({
        mutationFn: async () => {
            const response = await apiRequest("POST", `/api/applications/${id}/submit`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/applications", id] });
            toast({
                title: "Application Submitted",
                description: "Your application has been successfully submitted.",
            });
            setLocation("/dashboard");
        },
        onError: (error: any) => {
            toast({
                title: "Submission failed",
                description: error.message || "Failed to submit application",
                variant: "destructive",
            });
        },
    });

    // Auto-submit form when payment data is ready
    useEffect(() => {
        if (paymentInitiated && formRef.current) {
            formRef.current.submit();
        }
    }, [paymentInitiated]);

    if (appLoading) {
        return (
            <div className="container mx-auto p-6 flex justify-center h-96 items-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertDescription>Application not found.</AlertDescription>
                </Alert>
                <Button onClick={() => setLocation("/dashboard")} className="mt-4">Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="bg-background">
            <div className="container mx-auto p-6 max-w-5xl space-y-6">
                <div>
                    <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold">Complete Payment via Kotak Mahindra</h1>
                    <p className="text-muted-foreground mt-2">
                        Application #{application.applicationNumber} — {application.propertyName}
                    </p>
                </div>

                {paymentSucceeded && (
                    isPaidPendingSubmit ? (
                        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                <div className="flex flex-col gap-3">
                                    <p>Payment Successful (Ref: <span className="font-semibold">{latestTransaction?.trackingId}</span>).</p>
                                    <p className="font-medium">Please submit your application now.</p>
                                    <div className="mt-2">
                                        <Button
                                            onClick={() => manualSubmitMutation.mutate()}
                                            disabled={manualSubmitMutation.isPending}
                                        >
                                            {manualSubmitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Submit Application Now
                                        </Button>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-green-200 bg-green-50 text-green-900">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                Payment Confirmed. Transaction Ref: <span className="font-semibold">{latestTransaction?.trackingId}</span>.
                            </AlertDescription>
                        </Alert>
                    )
                )}

                {paymentFailed && (
                    <Alert className="border-red-200 bg-red-50 text-red-900">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Payment Failed: {latestTransaction?.failureMessage || "Transaction not completed."} Please retry.
                        </AlertDescription>
                    </Alert>
                )}

                {paymentInProgress && (
                    <Alert className="bg-amber-50 border-amber-200 text-amber-900">
                        <Clock3 className="h-4 w-4" />
                        <AlertDescription>
                            Payment initiated. Please complete the transaction in the new tab.
                            This page will update automatically.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Fee Breakdown Card - Can reuse same layout as HimKosh */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Fee Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total Amount</span>
                                <span>₹{totalFee.toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/40 bg-primary/5 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Kotak Mahindra Gateway
                            </CardTitle>
                            <CardDescription>Secure payment via CCAvenue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="rounded-lg border border-primary/30 bg-background p-4 text-sm text-muted-foreground">
                                Cards, Net Banking, UPI accepted.
                            </div>

                            {!paymentSucceeded && (
                                <Button
                                    onClick={() => initiateMutation.mutate()}
                                    disabled={initiateMutation.isPending || paymentInProgress}
                                    className="w-full"
                                    size="lg"
                                >
                                    {initiateMutation.isPending ? "Initiating..." : "Pay Now"}
                                </Button>
                            )}

                            {paymentInitiated && (
                                <form ref={formRef} method="POST" action={paymentInitiated.paymentUrl} className="hidden">
                                    <input type="hidden" name="encRequest" value={paymentInitiated.encRequest} />
                                    <input type="hidden" name="access_code" value={paymentInitiated.accessCode} />
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
