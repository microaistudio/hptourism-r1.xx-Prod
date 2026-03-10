import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Shield,
    AlertTriangle,
    CreditCard,
    Loader2,
    Lock,
    CheckCircle,
    XCircle,
    Clock,
    Timer,
    CalendarClock,
    Eye,
    EyeOff,
} from "lucide-react";

import {
    PAYMENT_PAUSE_PRESET_MESSAGES,
    type PaymentPauseMessageType,
    type PaymentPipelinePauseSetting,
    MAINTENANCE_MESSAGE_PRESETS,
    type MaintenanceMessageType,
    type MaintenanceModeSetting
} from "@shared/appSettings";
import { formatDateTimeIST } from "@/lib/dateUtils";

// ==================== Shared Helpers ====================

function formatElapsedTime(startedAt: string | null): string {
    if (!startedAt) return "—";
    const start = new Date(startedAt).getTime();
    if (isNaN(start)) return "—";
    const now = Date.now();
    const diffMs = now - start;
    if (diffMs < 0) return "Not started yet";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(" ");
}

function isEtaPast(eta: string | null): boolean {
    if (!eta) return false;
    return new Date(eta).getTime() < Date.now();
}

function toLocalDatetimeInputValue(isoString: string | null): string {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    // Adjust to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(d.getTime() + istOffset);
    return istDate.toISOString().slice(0, 16);
}

function fromLocalDatetimeInputValue(localValue: string): string | null {
    if (!localValue) return null;
    // Input value is in local (IST) time, convert to UTC ISO string
    // Browser datetime-local inputs are in local time, so we parse directly
    const d = new Date(localValue);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
}

// ==================== Live Downtime Badge ====================
function LiveDowntimeBadge({ startedAt, label = "Downtime" }: { startedAt: string | null; label?: string }) {
    const [elapsed, setElapsed] = useState(formatElapsedTime(startedAt));

    useEffect(() => {
        if (!startedAt) return;
        const interval = setInterval(() => {
            setElapsed(formatElapsedTime(startedAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    if (!startedAt) return null;

    return (
        <div className="flex items-center gap-2 text-sm p-3 bg-slate-100 dark:bg-slate-800 rounded">
            <Timer className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">{elapsed}</span>
        </div>
    );
}

// ==================== ETA + Timing Controls ====================
function TimingControls({
    startedAt,
    estimatedRestoreAt,
    showEtaToPublic,
    showDowntimeToPublic,
    enabled,
    onEstimatedRestoreAtChange,
    onShowEtaToPublicChange,
    onShowDowntimeToPublicChange,
}: {
    startedAt: string | null;
    estimatedRestoreAt: string | null;
    showEtaToPublic: boolean;
    showDowntimeToPublic: boolean;
    enabled: boolean;
    onEstimatedRestoreAtChange: (value: string | null) => void;
    onShowEtaToPublicChange: (value: boolean) => void;
    onShowDowntimeToPublicChange: (value: boolean) => void;
}) {
    if (!enabled) return null;

    const etaPast = isEtaPast(estimatedRestoreAt);

    return (
        <div className="space-y-4 p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="h-4 w-4 text-blue-600" />
                <Label className="font-semibold text-blue-700 dark:text-blue-300">Timing & ETA</Label>
            </div>

            {/* Started At (read-only) */}
            {startedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Started at: <span className="font-medium">{formatDateTimeIST(startedAt)}</span>
                </div>
            )}

            {/* Live Downtime */}
            <LiveDowntimeBadge startedAt={startedAt} />

            {/* ETA Input */}
            <div className="space-y-2">
                <Label className="text-sm">Estimated Restore Time (IST)</Label>
                <Input
                    type="datetime-local"
                    value={toLocalDatetimeInputValue(estimatedRestoreAt)}
                    onChange={(e) => onEstimatedRestoreAtChange(fromLocalDatetimeInputValue(e.target.value))}
                    className="max-w-xs"
                />
                {estimatedRestoreAt && (
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            ETA: {formatDateTimeIST(estimatedRestoreAt)}
                        </p>
                        {etaPast && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-medium animate-pulse">
                                ⚠ Past estimated restore time
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-muted-foreground"
                            onClick={() => onEstimatedRestoreAtChange(null)}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            {/* Show to Public Checkboxes */}
            <div className="grid gap-3 sm:grid-cols-2">
                {/* Show ETA Checkbox */}
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-white dark:bg-slate-950">
                    <Checkbox
                        id="showEtaToPublic"
                        checked={showEtaToPublic}
                        onCheckedChange={(checked) => onShowEtaToPublicChange(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="showEtaToPublic"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                            {showEtaToPublic ? (
                                <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-slate-400" />
                            )}
                            Display ETA to public
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Users will see the estimated restore time.
                        </p>
                    </div>
                </div>

                {/* Show Downtime Checkbox */}
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-white dark:bg-slate-950">
                    <Checkbox
                        id="showDowntimeToPublic"
                        checked={showDowntimeToPublic}
                        onCheckedChange={(checked) => onShowDowntimeToPublicChange(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="showDowntimeToPublic"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                            {showDowntimeToPublic ? (
                                <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-slate-400" />
                            )}
                            Display downtime to public
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Users will see how long the site has been down.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== Main Page ====================
export default function SystemControlsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Confirmation Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        action: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        open: false,
        action: "",
        confirmText: "",
        onConfirm: () => { },
    });
    const [userConfirmInput, setUserConfirmInput] = useState("");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="container mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div>
                    <Link href="/admin/console">
                        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Console
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <Shield className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">System Controls</h1>
                            <p className="text-muted-foreground mt-1">
                                Critical system operations requiring confirmation
                            </p>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-700 dark:text-red-400">
                                    Critical Operations Area
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-300">
                                    Changes here affect all users immediately. Each action requires
                                    typing a confirmation phrase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Pipeline Pause Card */}
                <PaymentPipelinePauseCard
                    onConfirmRequired={(action, confirmText, onConfirm) => {
                        setConfirmDialog({ open: true, action, confirmText, onConfirm });
                        setUserConfirmInput("");
                    }}
                />

                {/* Maintenance Mode Card */}
                <MaintenanceModeCard
                    onConfirmRequired={(action, confirmText, onConfirm) => {
                        setConfirmDialog({ open: true, action, confirmText, onConfirm });
                        setUserConfirmInput("");
                    }}
                />

                {/* Confirmation Dialog */}
                <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-orange-500" />
                                Confirm Critical Action
                            </DialogTitle>
                            <DialogDescription>
                                You are about to: <strong>{confirmDialog.action}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">
                                To confirm, type <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-red-600">{confirmDialog.confirmText}</code> below:
                            </p>
                            <Input
                                value={userConfirmInput}
                                onChange={(e) => setUserConfirmInput(e.target.value)}
                                placeholder="Type confirmation text..."
                                className="font-mono"
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={userConfirmInput !== confirmDialog.confirmText}
                                onClick={() => {
                                    confirmDialog.onConfirm();
                                    setConfirmDialog(prev => ({ ...prev, open: false }));
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

// ==================== Payment Pipeline Pause Card ====================
function PaymentPipelinePauseCard({
    onConfirmRequired,
}: {
    onConfirmRequired: (action: string, confirmText: string, onConfirm: () => void) => void;
}) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [messageType, setMessageType] = useState<PaymentPauseMessageType>("Payment process is being updated");
    const [customMessage, setCustomMessage] = useState("");
    const [estimatedRestoreAt, setEstimatedRestoreAt] = useState<string | null>(null);
    const [showEtaToPublic, setShowEtaToPublic] = useState(false);
    const [showDowntimeToPublic, setShowDowntimeToPublic] = useState(false);

    const { data: config, isLoading } = useQuery<PaymentPipelinePauseSetting>({
        queryKey: ["/api/settings/payment-pipeline-pause"],
    });

    useEffect(() => {
        if (config) {
            setMessageType(config.messageType);
            setCustomMessage(config.customMessage || "");
            setEstimatedRestoreAt(config.estimatedRestoreAt || null);
            setShowEtaToPublic(config.showEtaToPublic ?? false);
            setShowDowntimeToPublic(config.showDowntimeToPublic ?? false);
        }
    }, [config]);

    const mutation = useMutation({
        mutationFn: async (data: {
            enabled: boolean;
            messageType: PaymentPauseMessageType;
            customMessage: string;
            estimatedRestoreAt?: string | null;
            showEtaToPublic?: boolean;
            showDowntimeToPublic?: boolean;
        }) => {
            await apiRequest("POST", "/api/settings/payment-pipeline-pause", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/settings/payment-pipeline-pause"] });
            queryClient.invalidateQueries({ queryKey: ["/api/settings/public"] });
            toast({
                title: "Payment Pipeline Updated",
                description: config?.enabled ? "Payments are now ENABLED." : "Payments are now PAUSED.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update payment pipeline settings.",
                variant: "destructive",
            });
        },
    });

    const handleToggle = (newEnabled: boolean) => {
        const action = newEnabled ? "PAUSE PAYMENT PIPELINE" : "ENABLE PAYMENT PIPELINE";
        const confirmText = newEnabled ? "PAUSE PAYMENTS" : "ENABLE PAYMENTS";

        onConfirmRequired(action, confirmText, () => {
            mutation.mutate({
                enabled: newEnabled,
                messageType,
                customMessage,
                estimatedRestoreAt: newEnabled ? estimatedRestoreAt : null,
                showEtaToPublic: newEnabled ? showEtaToPublic : false,
                showDowntimeToPublic: newEnabled ? showDowntimeToPublic : false,
            });
        });
    };

    const handleSaveSettings = () => {
        if (config?.enabled) {
            mutation.mutate({
                enabled: true,
                messageType,
                customMessage,
                estimatedRestoreAt,
                showEtaToPublic,
                showDowntimeToPublic,
            });
        }
    };

    const enabled = config?.enabled || false;

    return (
        <Card className={`border-2 ${enabled ? "border-red-500 bg-red-50/50 dark:bg-red-950/20" : "border-green-500"}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className={`h-5 w-5 ${enabled ? "text-red-500" : "text-green-500"}`} />
                        <CardTitle>Payment Pipeline</CardTitle>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${enabled
                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        }`}>
                        {enabled ? (
                            <>
                                <XCircle className="h-4 w-4" /> PAUSED
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" /> ACTIVE
                            </>
                        )}
                    </div>
                </div>
                <CardDescription>
                    Control whether users can make payments. When paused, users can still fill applications but cannot submit payment.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                ) : (
                    <>
                        {/* Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-slate-950">
                            <div>
                                <Label className="font-semibold">
                                    {enabled ? "Payment Pipeline is PAUSED" : "Payment Pipeline is ACTIVE"}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {enabled
                                        ? "Users cannot make payments. Click to resume."
                                        : "Users can make payments normally. Click to pause."}
                                </p>
                            </div>
                            <Switch
                                checked={enabled}
                                onCheckedChange={handleToggle}
                                disabled={mutation.isPending}
                                className={enabled ? "data-[state=checked]:bg-red-500" : ""}
                            />
                        </div>

                        {/* Pause Timestamp */}
                        {enabled && config?.pausedAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-slate-100 dark:bg-slate-800 rounded">
                                <Clock className="h-4 w-4" />
                                Paused at: {formatDateTimeIST(config.pausedAt)}
                            </div>
                        )}

                        {/* Timing & ETA Controls */}
                        <TimingControls
                            startedAt={config?.pausedAt || null}
                            estimatedRestoreAt={estimatedRestoreAt}
                            showEtaToPublic={showEtaToPublic}
                            showDowntimeToPublic={showDowntimeToPublic}
                            enabled={enabled}
                            onEstimatedRestoreAtChange={setEstimatedRestoreAt}
                            onShowEtaToPublicChange={setShowEtaToPublic}
                            onShowDowntimeToPublicChange={setShowDowntimeToPublic}
                        />

                        {/* Message Selection */}
                        <div className="space-y-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                            <Label className="font-semibold">Pause Message (shown to users)</Label>
                            <RadioGroup
                                value={messageType}
                                onValueChange={(val) => setMessageType(val as PaymentPauseMessageType)}
                                className="space-y-2"
                            >
                                {PAYMENT_PAUSE_PRESET_MESSAGES.map((preset) => (
                                    <div key={preset} className="flex items-center space-x-2">
                                        <RadioGroupItem value={preset} id={`payment-${preset}`} />
                                        <Label htmlFor={`payment-${preset}`} className="cursor-pointer font-normal">
                                            {preset}
                                        </Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="custom" id="payment-custom" />
                                    <Label htmlFor="payment-custom" className="cursor-pointer font-normal">
                                        Custom message
                                    </Label>
                                </div>
                            </RadioGroup>

                            {messageType === "custom" && (
                                <Textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Enter custom pause message..."
                                    className="mt-2"
                                />
                            )}

                            {enabled && (
                                <Button
                                    onClick={handleSaveSettings}
                                    disabled={mutation.isPending}
                                    variant="outline"
                                    size="sm"
                                >
                                    {mutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                    Update Settings
                                </Button>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-xs text-muted-foreground mb-2">Preview (what users will see):</p>
                            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded text-center">
                                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                <p className="font-medium text-orange-700 dark:text-orange-300">
                                    {messageType === "custom" && customMessage.trim()
                                        ? customMessage
                                        : messageType !== "custom"
                                            ? messageType
                                            : PAYMENT_PAUSE_PRESET_MESSAGES[0]}
                                </p>
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                    Please save your application and try again later.
                                </p>
                                {showEtaToPublic && estimatedRestoreAt && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                                        ⏰ Expected back by: {formatDateTimeIST(estimatedRestoreAt)}
                                    </p>
                                )}
                                {showDowntimeToPublic && config?.pausedAt && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">
                                        ⏳ Down for: {formatElapsedTime(config.pausedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// ==================== Maintenance Mode Card ====================
function MaintenanceModeCard({
    onConfirmRequired,
}: {
    onConfirmRequired: (action: string, confirmText: string, onConfirm: () => void) => void;
}) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [accessKey, setAccessKey] = useState("");
    const [messageType, setMessageType] = useState<MaintenanceMessageType>("System Upgrade in Progress");
    const [customMessage, setCustomMessage] = useState("");
    const [estimatedRestoreAt, setEstimatedRestoreAt] = useState<string | null>(null);
    const [showEtaToPublic, setShowEtaToPublic] = useState(false);
    const [showDowntimeToPublic, setShowDowntimeToPublic] = useState(false);

    const { data: config, isLoading } = useQuery<MaintenanceModeSetting>({
        queryKey: ["/api/settings/maintenance-mode"],
    });

    useEffect(() => {
        if (config) {
            setAccessKey(config.accessKey || "launch2026");
            setMessageType(config.messageType || "System Upgrade in Progress");
            setCustomMessage(config.customMessage || "");
            setEstimatedRestoreAt(config.estimatedRestoreAt || null);
            setShowEtaToPublic(config.showEtaToPublic ?? false);
            setShowDowntimeToPublic(config.showDowntimeToPublic ?? false);
        }
    }, [config]);

    const mutation = useMutation({
        mutationFn: async (data: {
            enabled: boolean;
            accessKey: string;
            messageType: MaintenanceMessageType;
            customMessage: string;
            startedAt?: string | null;
            estimatedRestoreAt?: string | null;
            showEtaToPublic?: boolean;
            showDowntimeToPublic?: boolean;
        }) => {
            await apiRequest("POST", "/api/settings/maintenance-mode", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/settings/maintenance-mode"] });
            queryClient.invalidateQueries({ queryKey: ["/api/settings/public"] });
            toast({
                title: "Maintenance Mode Updated",
                description: "Settings have been saved.",
            });
        },
        onError: () => {
            toast({
                title: "Update Failed",
                description: "Could not update maintenance mode.",
                variant: "destructive",
            });
        },
    });

    const handleToggle = (newEnabled: boolean) => {
        const action = newEnabled ? "ENABLE MAINTENANCE MODE (Block All Users)" : "DISABLE MAINTENANCE MODE";
        const confirmText = newEnabled ? "LOCKDOWN" : "UNLOCK";

        onConfirmRequired(action, confirmText, () => {
            mutation.mutate({
                enabled: newEnabled,
                accessKey,
                messageType,
                customMessage,
                // Preserve existing startedAt if already enabled, otherwise auto-set
                startedAt: newEnabled ? (config?.startedAt || new Date().toISOString()) : null,
                estimatedRestoreAt: newEnabled ? estimatedRestoreAt : null,
                showEtaToPublic: newEnabled ? showEtaToPublic : false,
                showDowntimeToPublic: newEnabled ? showDowntimeToPublic : false,
            });
        });
    };

    const handleUpdateSettings = () => {
        mutation.mutate({
            enabled: config?.enabled || false,
            accessKey,
            messageType,
            customMessage,
            startedAt: config?.startedAt || null,
            estimatedRestoreAt,
            showEtaToPublic,
            showDowntimeToPublic,
        });
    };

    const enabled = config?.enabled || false;

    return (
        <Card className={`border-2 ${enabled ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20" : "border-slate-200"}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${enabled ? "text-orange-500" : "text-slate-400"}`} />
                        <CardTitle>Maintenance Mode (Full Lockdown)</CardTitle>
                    </div>
                    {enabled && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                            <Lock className="h-4 w-4" /> LOCKED
                        </div>
                    )}
                </div>
                <CardDescription>
                    When enabled, ALL users are blocked from accessing the site. Only those with the bypass key can enter.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                ) : (
                    <>
                        {/* Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-slate-950">
                            <div>
                                <Label className="font-semibold">
                                    {enabled ? "Site is LOCKED" : "Site is OPEN"}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {enabled
                                        ? "All public access is blocked."
                                        : "Site is accessible to everyone."}
                                </p>
                            </div>
                            <Switch
                                checked={enabled}
                                onCheckedChange={handleToggle}
                                disabled={mutation.isPending}
                                className={enabled ? "data-[state=checked]:bg-orange-500" : ""}
                            />
                        </div>

                        {/* Timing & ETA Controls */}
                        <TimingControls
                            startedAt={config?.startedAt || null}
                            estimatedRestoreAt={estimatedRestoreAt}
                            showEtaToPublic={showEtaToPublic}
                            showDowntimeToPublic={showDowntimeToPublic}
                            enabled={enabled}
                            onEstimatedRestoreAtChange={setEstimatedRestoreAt}
                            onShowEtaToPublicChange={setShowEtaToPublic}
                            onShowDowntimeToPublicChange={setShowDowntimeToPublic}
                        />

                        {/* Bypass Key */}
                        <div className="space-y-3 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                            <Label className="font-semibold">Bypass Key (Secret)</Label>
                            <p className="text-xs text-muted-foreground">
                                Users can bypass maintenance mode by visiting:{" "}
                                <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                                    ?access_key=YOUR_KEY
                                </code>
                            </p>
                            <Input
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                placeholder="Enter secret bypass key..."
                                className="max-w-md font-mono"
                            />
                        </div>

                        {/* Message Selection */}
                        <div className="space-y-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                            <Label className="font-semibold">Maintenance Message</Label>
                            <RadioGroup
                                value={messageType}
                                onValueChange={(val) => setMessageType(val as MaintenanceMessageType)}
                                className="space-y-2"
                            >
                                {MAINTENANCE_MESSAGE_PRESETS.map((preset) => (
                                    <div key={preset} className="flex items-center space-x-2">
                                        <RadioGroupItem value={preset} id={`maint-${preset}`} />
                                        <Label htmlFor={`maint-${preset}`} className="cursor-pointer font-normal">
                                            {preset}
                                        </Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="custom" id="maint-custom" />
                                    <Label htmlFor="maint-custom" className="cursor-pointer font-normal">
                                        Custom message
                                    </Label>
                                </div>
                            </RadioGroup>

                            {messageType === "custom" && (
                                <Textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Enter custom maintenance message..."
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <Button
                            onClick={handleUpdateSettings}
                            disabled={mutation.isPending}
                            variant="outline"
                            size="sm"
                        >
                            {mutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Update Settings
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
