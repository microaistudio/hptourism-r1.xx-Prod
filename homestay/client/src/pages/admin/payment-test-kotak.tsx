
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentTestKotak() {
    const { toast } = useToast();
    const [location] = useLocation();
    const [testAmount, setTestAmount] = useState("1");
    const [orderId, setOrderId] = useState("");
    const [paymentResult, setPaymentResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Check for callback response in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const response = params.get("response");
        if (response) {
            try {
                const decoded = atob(response);
                // Parse query string response
                const result: Record<string, string> = {};
                decoded.split("&").forEach(pair => {
                    const [key, value] = pair.split("=");
                    if (key) result[key] = decodeURIComponent(value || "");
                });
                setPaymentResult(result);
                // Clean URL
                window.history.replaceState({}, "", window.location.pathname);
            } catch (e) {
                console.error("Failed to parse callback response", e);
            }
        }
    }, []);

    // Generate unique order ID
    useEffect(() => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setOrderId(`TEST-${timestamp}-${random}`);
    }, []);

    const initiatePayment = async () => {
        setIsProcessing(true);
        setPaymentResult(null);

        try {
            // Get credentials from environment (via API)
            const configRes = await fetch("/api/ccavenue/test/config");
            const config = await configRes.json();

            if (!config.merchantId || !config.accessCode || !config.workingKey) {
                throw new Error("CCAvenue credentials not configured. Please check .env file.");
            }

            // Prepare payment data
            const paymentData = {
                merchant_id: config.merchantId,
                order_id: orderId,
                currency: "INR",
                amount: testAmount,
                redirect_url: `${window.location.origin}/api/ccavenue/test/callback?workingKey=${encodeURIComponent(config.workingKey)}&frontendUrl=${encodeURIComponent("/admin/payment-test-kotak")}`,
                cancel_url: `${window.location.origin}/api/ccavenue/test/callback?workingKey=${encodeURIComponent(config.workingKey)}&frontendUrl=${encodeURIComponent("/admin/payment-test-kotak")}`,
                language: "EN",
                billing_name: "Test User",
                billing_email: "test@hptourism.gov.in",
                billing_tel: "9876543210",
                billing_address: "Test Address",
                billing_city: "Shimla",
                billing_state: "Himachal Pradesh",
                billing_zip: "171001",
                billing_country: "India",
            };

            // Encrypt the request
            const encryptRes = await apiRequest("POST", "/api/ccavenue/test/encrypt", {
                workingKey: config.workingKey,
                data: paymentData,
            });
            const encryptData = await encryptRes.json();

            if (!encryptData.encRequest) {
                throw new Error("Failed to encrypt payment request");
            }

            // Create and submit form to CCAvenue
            const form = document.createElement("form");
            form.method = "POST";
            form.action = config.gatewayUrl || "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
            form.target = "_self";

            const addField = (name: string, value: string) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            };

            addField("encRequest", encryptData.encRequest);
            addField("access_code", config.accessCode);

            document.body.appendChild(form);
            form.submit();
        } catch (error: any) {
            setIsProcessing(false);
            toast({
                title: "Payment Error",
                description: error.message || "Failed to initiate payment",
                variant: "destructive",
            });
        }
    };

    const isSuccess = paymentResult?.order_status === "Success";
    const isFailure = paymentResult && paymentResult.order_status !== "Success";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="container mx-auto max-w-2xl space-y-6">
                <div>
                    <Link href="/admin/console">
                        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Console
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Kotak Mahindra Test Payment</h1>
                            <p className="text-muted-foreground mt-1">
                                CCAvenue Gateway Integration Test
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Result */}
                {paymentResult && (
                    <Card className={isSuccess ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                {isSuccess ? (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-red-600" />
                                )}
                                <CardTitle className={isSuccess ? "text-green-700" : "text-red-700"}>
                                    {isSuccess ? "Payment Successful!" : "Payment Failed"}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="font-medium">Order ID:</div>
                                <div>{paymentResult.order_id}</div>
                                <div className="font-medium">Amount:</div>
                                <div>₹{paymentResult.amount || paymentResult.mer_amount}</div>
                                <div className="font-medium">Status:</div>
                                <div>{paymentResult.order_status}</div>
                                {paymentResult.tracking_id && (
                                    <>
                                        <div className="font-medium">Tracking ID:</div>
                                        <div>{paymentResult.tracking_id}</div>
                                    </>
                                )}
                                {paymentResult.bank_ref_no && (
                                    <>
                                        <div className="font-medium">Bank Ref:</div>
                                        <div>{paymentResult.bank_ref_no}</div>
                                    </>
                                )}
                                {paymentResult.payment_mode && (
                                    <>
                                        <div className="font-medium">Payment Mode:</div>
                                        <div>{paymentResult.payment_mode}</div>
                                    </>
                                )}
                                {paymentResult.status_message && (
                                    <>
                                        <div className="font-medium">Message:</div>
                                        <div className="col-span-1">{paymentResult.status_message}</div>
                                    </>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setPaymentResult(null);
                                    setOrderId(`TEST-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
                                }}
                            >
                                Start New Test
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Form */}
                {!paymentResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Payment</CardTitle>
                            <CardDescription>
                                Initiate a test payment through the CCAvenue (Kotak Mahindra) gateway.
                                Use the test card credentials provided by CCAvenue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Order ID</Label>
                                <Input value={orderId} readOnly className="font-mono bg-slate-100" />
                            </div>

                            <div className="space-y-3">
                                <Label>Test Amount</Label>
                                <RadioGroup
                                    value={testAmount}
                                    onValueChange={setTestAmount}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="amt-1" />
                                        <Label htmlFor="amt-1" className="cursor-pointer">₹1</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="10" id="amt-10" />
                                        <Label htmlFor="amt-10" className="cursor-pointer">₹10</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="100" id="amt-100" />
                                        <Label htmlFor="amt-100" className="cursor-pointer">₹100</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                                    CCAvenue Test Card Details
                                </h4>
                                <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1 font-mono">
                                    <div>Card Number: 4111 1111 1111 1111</div>
                                    <div>Expiry: Any future date</div>
                                    <div>CVV: 123</div>
                                </div>
                            </div>

                            <Button
                                onClick={initiatePayment}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Redirecting to CCAvenue...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Pay ₹{testAmount} via Kotak Mahindra
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Info Card */}
                <Card className="bg-slate-100 dark:bg-slate-900">
                    <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">How it works</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Select the test amount</li>
                            <li>Click "Pay" to redirect to CCAvenue payment page</li>
                            <li>Enter test card details on CCAvenue</li>
                            <li>Complete payment and return to see the result</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
