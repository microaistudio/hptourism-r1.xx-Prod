
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings, ArrowLeft, Loader2, Save, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function PolicySettings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: setting, isLoading } = useQuery({
        queryKey: ['/api/settings/woman-discount-mode'],
    });

    const { data: singleSessionSetting, isLoading: singleSessionLoading } = useQuery({
        queryKey: ['/api/settings/enforce-single-session'],
    });

    const { data: legacyRegistrationSetting, isLoading: legacyRegistrationLoading } = useQuery({
        queryKey: ['/api/settings/enable-legacy-registrations'],
    });

    const mutation = useMutation({
        mutationFn: async (mode: string) => {
            await apiRequest('POST', '/api/settings/woman-discount-mode', { mode });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/settings/woman-discount-mode'] });
            toast({
                title: "Settings Updated",
                description: "Woman owner discount policy has been updated.",
            });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: "Could not update settings. Please try again.",
                variant: "destructive",
            });
        }
    });

    const singleSessionMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            await apiRequest('POST', '/api/settings/enforce-single-session', { enabled });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/settings/enforce-single-session'] });
            toast({
                title: "Settings Updated",
                description: "Single session policy has been updated.",
            });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: "Could not update settings. Please try again.",
                variant: "destructive",
            });
        }
    });

    const legacyRegistrationMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            await apiRequest('POST', '/api/settings/enable-legacy-registrations', { enabled });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/settings/enable-legacy-registrations'] });
            toast({
                title: "Settings Updated",
                description: "Existing RC registration flow has been updated.",
            });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: "Could not update settings. Please try again.",
                variant: "destructive",
            });
        }
    });

    const currentMode = setting?.mode || 'SEQUENTIAL';
    const singleSessionEnabled = singleSessionSetting?.enabled || false;
    const legacyRegistrationEnabled = legacyRegistrationSetting?.enabled !== false; // Default true

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="container mx-auto max-w-3xl space-y-8">
                <div>
                    <Link href="/admin/console">
                        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Console
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Policy Settings</h1>
                            <p className="text-muted-foreground mt-1">
                                Configure global application policies and calculation rules
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-orange-500" />
                            <CardTitle>Security Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Configure login and session security policies
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {singleSessionLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading settings...
                            </div>
                        ) : (
                            <div className="flex items-center justify-between rounded-md border p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="single-session" className="font-semibold">
                                        Enforce Single Session Login
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        When enabled, new logins will log out all other devices for that user
                                    </p>
                                </div>
                                <Switch
                                    id="single-session"
                                    checked={singleSessionEnabled}
                                    onCheckedChange={(checked) => singleSessionMutation.mutate(checked)}
                                    disabled={singleSessionMutation.isPending}
                                />
                            </div>
                        )}
                        {singleSessionMutation.isPending && (
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
                            </div>
                        )}

                        {/* Legacy Registration Toggle */}
                        {legacyRegistrationLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground mt-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                            </div>
                        ) : (
                            <div className="flex items-center justify-between rounded-md border p-4 mt-4">
                                <div className="space-y-1">
                                    <Label htmlFor="legacy-registration" className="font-semibold flex items-center gap-2">
                                        Allow Existing RC Registration
                                        {!legacyRegistrationEnabled && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Disabled</span>}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        When disabled, the "Existing Owner" intake form will show a maintenance message.
                                    </p>
                                </div>
                                <Switch
                                    id="legacy-registration"
                                    checked={legacyRegistrationEnabled}
                                    onCheckedChange={(checked) => legacyRegistrationMutation.mutate(checked)}
                                    disabled={legacyRegistrationMutation.isPending}
                                />
                            </div>
                        )}
                        {legacyRegistrationMutation.isPending && (
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Woman Owner Discount</CardTitle>
                        <CardDescription>
                            Determine how the 5% Woman Owner discount is applied when combined with the 3-Year Validity discount (10%).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading settings...
                            </div>
                        ) : (
                            <RadioGroup
                                defaultValue={currentMode}
                                onValueChange={(val) => mutation.mutate(val)}
                                className="space-y-4"
                            >
                                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    <RadioGroupItem value="SEQUENTIAL" id="seq" className="mt-1" />
                                    <div className="space-y-1">
                                        <Label htmlFor="seq" className="font-semibold cursor-pointer">
                                            Sequential (Default)
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Apply 3-Year discount (10%) first, then apply 5% Woman Owner discount on the <strong>reduced amount</strong>.
                                        </p>
                                        <div className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-mono">
                                            Total Discount ≈ 14.5%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    <RadioGroupItem value="ADDITIVE" id="add" className="mt-1" />
                                    <div className="space-y-1">
                                        <Label htmlFor="add" className="font-semibold cursor-pointer">
                                            Additive (Flat 15%)
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Apply both discounts on the <strong>base amount</strong>. Warning: This contradicts the official PRD but aligns with "in addition to" text.
                                        </p>
                                        <div className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-mono">
                                            Total Discount = 15.0%
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        )}

                        {mutation.isPending && (
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Gateway Settings */}
                <PaymentGatewayCard />

                {/* Portal Statistics (Legacy + Live) */}
                <PortalStatsCard />

                {/* Rate Limit Settings */}
                <RateLimitSettingsCard />

                {/* Max Correction Attempts Settings */}
                <MaxCorrectionCard />

                {/* Maintenance Mode Settings */}
                <MaintenanceSettingsCard />
            </div>
        </div>
    );
}

function MaxCorrectionCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [maxReverts, setMaxReverts] = useState<number>(1);

    const { data: setting, isLoading } = useQuery({
        queryKey: ['/api/admin/settings/workflow/max-reverts'],
    });

    useEffect(() => {
        if (setting?.maxReverts) {
            setMaxReverts(Number(setting.maxReverts));
        }
    }, [setting]);

    const mutation = useMutation({
        mutationFn: async (val: number) => {
            await apiRequest('POST', '/api/admin/settings/workflow/max-reverts', { maxReverts: val });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/settings/workflow/max-reverts'] });
            toast({
                title: "Settings Updated",
                description: "Max correction attempts limit has been updated.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update settings. Please try again.",
                variant: "destructive",
            });
        }
    });

    const handleSave = () => {
        mutation.mutate(maxReverts);
    };

    return (
        <Card className="border-indigo-200 dark:border-indigo-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-indigo-100 dark:bg-indigo-900/30">
                        <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle>Application Corrections Policy</CardTitle>
                </div>
                <CardDescription>
                    Configure how many times an application can be sent back to the applicant for corrections.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="max-reverts" className="font-semibold">
                                    Maximum Correction Attempts
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="max-reverts"
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={maxReverts}
                                        onChange={(e) => setMaxReverts(parseInt(e.target.value) || 1)}
                                        className="max-w-[100px]"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        times per application
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    If an officer sends back an application more than this limit, it will be <strong>automatically rejected</strong>.
                                    Currently set to: <strong>{maxReverts} attempt(s)</strong>.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={mutation.isPending || maxReverts === setting?.maxReverts}
                            className="w-full sm:w-auto"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Policy
                                </>
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function PaymentGatewayCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedGateway, setSelectedGateway] = useState<string | null>(null);

    const { data: gatewaySetting, isLoading } = useQuery({
        queryKey: ['/api/admin/settings/payment/gateway'],
    });

    const currentGateway = gatewaySetting?.gateway || 'himkosh';
    const activeGateway = selectedGateway ?? currentGateway;

    const mutation = useMutation({
        mutationFn: async (gateway: string) => {
            await apiRequest('POST', '/api/admin/settings/payment/gateway', { gateway });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/settings/payment/gateway'] });
            queryClient.invalidateQueries({ queryKey: ['/api/public/settings/payment-gateway'] }); // Invalidate public cache too
            toast({
                title: "Payment Gateway Updated",
                description: "Default payment gateway has been changed.",
            });
            setSelectedGateway(null); // Reset local state
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update payment gateway. Please try again.",
                variant: "destructive",
            });
        }
    });

    const handleSave = () => {
        if (activeGateway) {
            mutation.mutate(activeGateway);
        }
    };

    return (
        <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <CardTitle>Payment Gateway</CardTitle>
                </div>
                <CardDescription>
                    Select the default payment gateway for processing application fees.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <RadioGroup
                        value={activeGateway}
                        onValueChange={setSelectedGateway}
                        className="space-y-4"
                    >
                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <RadioGroupItem value="himkosh" id="gw-himkosh" className="mt-1" />
                            <div className="space-y-1">
                                <Label htmlFor="gw-himkosh" className="font-semibold cursor-pointer">
                                    HimKosh (Government Treasury)
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Official Himachal Pradesh government treasury e-challan system.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <RadioGroupItem value="ccavenue" id="gw-ccavenue" className="mt-1" />
                            <div className="space-y-1">
                                <Label htmlFor="gw-ccavenue" className="font-semibold cursor-pointer flex items-center gap-2">
                                    Kotak Mahindra (CCAvenue)
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">New</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    CCAvenue payment gateway via Kotak Mahindra Bank. Supports cards, UPI, net banking.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>
                )}

                <div className="mt-6 flex items-center gap-4">
                    <Button
                        onClick={handleSave}
                        disabled={mutation.isPending || activeGateway === currentGateway}
                        className="w-full sm:w-auto"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Update Settings
                            </>
                        )}
                    </Button>

                    <Link href="/admin/payment-test-kotak">
                        <Button variant="outline" className="w-full sm:w-auto">
                            Test Kotak/CCAvenue Payment →
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function MaintenanceSettingsCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [accessKey, setAccessKey] = useState("");

    const { data: maintenanceSetting, isLoading } = useQuery({
        queryKey: ['/api/settings/maintenance-mode'],
    });

    useEffect(() => {
        if (maintenanceSetting?.accessKey) {
            setAccessKey(maintenanceSetting.accessKey);
        }
    }, [maintenanceSetting]);

    const mutation = useMutation({
        mutationFn: async (data: { enabled: boolean, accessKey: string }) => {
            await apiRequest('POST', '/api/settings/maintenance-mode', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/settings/maintenance-mode'] });
            toast({
                title: "Maintenance Mode Updated",
                description: "Settings have been saved successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update maintenance settings.",
                variant: "destructive",
            });
        }
    });

    const enabled = maintenanceSetting?.enabled || false;

    return (
        <Card className="border-orange-200 dark:border-orange-900 overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-950/30 p-1"></div>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <CardTitle>Maintenance Mode (Lockdown)</CardTitle>
                </div>
                <CardDescription>
                    Restrict public access to the application. Only users with the bypass key can access the site.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between rounded-md border p-4 bg-white dark:bg-slate-950">
                            <div className="space-y-1">
                                <Label htmlFor="maintenance-mode" className="font-semibold flex items-center gap-2">
                                    Enable Maintenance Mode
                                    {enabled && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Active</span>}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, all public routes will redirect to the "Coming Soon" page.
                                </p>
                            </div>
                            <Switch
                                id="maintenance-mode"
                                checked={enabled}
                                onCheckedChange={(checked) => mutation.mutate({ enabled: checked, accessKey })}
                                disabled={mutation.isPending}
                            />
                        </div>

                        <div className="grid gap-3 p-4 rounded-md border bg-slate-50 dark:bg-slate-900/50">
                            <div className="space-y-1">
                                <Label htmlFor="access-key" className="font-medium">Bypass Key (Secret)</Label>
                                <p className="text-xs text-muted-foreground">
                                    Users can bypass maintenance mode by visiting: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">?access_key=YOUR_KEY</code>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id="access-key"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    placeholder="Enter secret bypass key..."
                                    className="max-w-md font-mono"
                                />
                                <Button
                                    onClick={() => mutation.mutate({ enabled, accessKey })}
                                    disabled={mutation.isPending || accessKey === maintenanceSetting?.accessKey}
                                    size="sm"
                                >
                                    {mutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                    Update Key
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function RateLimitSettingsCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [config, setConfig] = useState({
        enabled: true,
        global: { maxRequests: 1000, windowMinutes: 15 },
        auth: { maxRequests: 20, windowMinutes: 10 },
        upload: { maxRequests: 100, windowMinutes: 10 }
    });

    const { data: rateLimitSetting, isLoading } = useQuery({
        queryKey: ['/api/admin/settings/security/rate-limits'],
    });

    useEffect(() => {
        if (rateLimitSetting) {
            setConfig({
                enabled: rateLimitSetting.enabled ?? true,
                global: rateLimitSetting.global ?? { maxRequests: 1000, windowMinutes: 15 },
                auth: rateLimitSetting.auth ?? { maxRequests: 20, windowMinutes: 10 },
                upload: rateLimitSetting.upload ?? { maxRequests: 100, windowMinutes: 10 }
            });
        }
    }, [rateLimitSetting]);

    const mutation = useMutation({
        mutationFn: async (data: typeof config) => {
            await apiRequest('POST', '/api/admin/settings/security/rate-limits', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/settings/security/rate-limits'] });
            toast({
                title: "Rate Limits Updated",
                description: "Rate limit settings have been saved. Changes will take effect within 60 seconds.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update rate limit settings.",
                variant: "destructive",
            });
        }
    });

    const handleSave = () => {
        mutation.mutate(config);
    };

    return (
        <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <CardTitle>Rate Limiting</CardTitle>
                </div>
                <CardDescription>
                    Configure request rate limits to protect against abuse. Changes take effect within 60 seconds.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between rounded-md border p-4">
                            <div className="space-y-1">
                                <Label htmlFor="rate-limit-enabled" className="font-semibold">
                                    Enable Rate Limiting
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    When disabled, all rate limits are bypassed (not recommended)
                                </p>
                            </div>
                            <Switch
                                id="rate-limit-enabled"
                                checked={config.enabled}
                                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                            />
                        </div>

                        <div className="grid gap-4 p-4 rounded-md border bg-slate-50 dark:bg-slate-900/50">
                            <div className="font-medium text-sm">Global Rate Limit</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Max Requests</Label>
                                    <Input
                                        type="number"
                                        value={config.global.maxRequests}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            global: { ...config.global, maxRequests: parseInt(e.target.value) || 1000 }
                                        })}
                                        min={1}
                                        max={10000}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Window (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={config.global.windowMinutes}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            global: { ...config.global, windowMinutes: parseInt(e.target.value) || 15 }
                                        })}
                                        min={1}
                                        max={60}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 p-4 rounded-md border bg-slate-50 dark:bg-slate-900/50">
                            <div className="font-medium text-sm">Authentication Rate Limit</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Max Login Attempts</Label>
                                    <Input
                                        type="number"
                                        value={config.auth.maxRequests}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            auth: { ...config.auth, maxRequests: parseInt(e.target.value) || 20 }
                                        })}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Window (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={config.auth.windowMinutes}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            auth: { ...config.auth, windowMinutes: parseInt(e.target.value) || 10 }
                                        })}
                                        min={1}
                                        max={60}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 p-4 rounded-md border bg-slate-50 dark:bg-slate-900/50">
                            <div className="font-medium text-sm">Upload Rate Limit</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Max Uploads</Label>
                                    <Input
                                        type="number"
                                        value={config.upload.maxRequests}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            upload: { ...config.upload, maxRequests: parseInt(e.target.value) || 100 }
                                        })}
                                        min={1}
                                        max={500}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Window (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={config.upload.windowMinutes}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            upload: { ...config.upload, windowMinutes: parseInt(e.target.value) || 10 }
                                        })}
                                        min={1}
                                        max={60}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={mutation.isPending}
                            className="w-full"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Rate Limit Settings
                                </>
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}


function PortalStatsCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Local state for form inputs
    const [stats, setStats] = useState({
        total: "0",
        approved: "0",
        rejected: "0",
        pending: "0"
    });

    const { data: legacySetting, isLoading } = useQuery({
        queryKey: ['/api/admin/settings/admin_legacy_stats'],
    });

    // Populate form when data loads
    useEffect(() => {
        if (legacySetting?.settingValue) {
            const val = legacySetting.settingValue as any;
            setStats({
                total: String(val.total || 0),
                approved: String(val.approved || 0),
                rejected: String(val.rejected || 0),
                pending: String(val.pending || 0)
            });
        }
    }, [legacySetting]);

    const mutation = useMutation({
        mutationFn: async (data: typeof stats) => {
            await apiRequest('PUT', '/api/admin/settings/admin_legacy_stats', {
                value: {
                    total: parseInt(data.total) || 0,
                    approved: parseInt(data.approved) || 0,
                    rejected: parseInt(data.rejected) || 0,
                    pending: parseInt(data.pending) || 0
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/settings/admin_legacy_stats'] });
            // Invalidate public stats too so dashboard updates immediately
            queryClient.invalidateQueries({ queryKey: ['/api/public/stats'] });
            toast({
                title: "Statistics Updated",
                description: "Legacy statistics have been saved and will reflect on the home page.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update statistics. Please try again.",
                variant: "destructive",
            });
        }
    });

    const handleSave = () => {
        mutation.mutate(stats);
    };

    const handleChange = (field: keyof typeof stats, value: string) => {
        setStats(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-green-100 dark:bg-green-900/30">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Portal Statistics</CardTitle>
                </div>
                <CardDescription>
                    Configure legacy statistics to be added to live system counts on the landing page.
                    Formula: Displayed Count = Legacy Count + Real-time System Count.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="stat-total">Total Applications (Base)</Label>
                                <Input
                                    id="stat-total"
                                    type="number"
                                    value={stats.total}
                                    onChange={(e) => handleChange('total', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Historical applications from previous system</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stat-approved">Approved (Base)</Label>
                                <Input
                                    id="stat-approved"
                                    type="number"
                                    value={stats.approved}
                                    onChange={(e) => handleChange('approved', e.target.value)}
                                    className="border-green-200 focus-visible:ring-green-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stat-rejected">Rejected (Base)</Label>
                                <Input
                                    id="stat-rejected"
                                    type="number"
                                    value={stats.rejected}
                                    onChange={(e) => handleChange('rejected', e.target.value)}
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stat-pending">Pending (Base)</Label>
                                <Input
                                    id="stat-pending"
                                    type="number"
                                    value={stats.pending}
                                    onChange={(e) => handleChange('pending', e.target.value)}
                                    className="border-orange-200 focus-visible:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-semibold mb-2">Preview (Home Page Example)</h4>
                            <div className="flex gap-8 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="ml-2 font-mono font-bold">
                                        {(parseInt(stats.total) || 0) + 124}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-1">(Legacy + 124 live)</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={mutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Statistics
                                </>
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
