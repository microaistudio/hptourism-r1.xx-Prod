import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Lock, ArrowRight, Clock, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { MaintenanceModeSetting, getMaintenanceMessage } from "@shared/appSettings";
import { formatDateTimeIST } from "@/lib/dateUtils";

// Accept extended config from public settings (may include timing fields)
type MaintenancePageConfig = MaintenanceModeSetting & {
    message?: string;
    startedAt?: string | null;
    estimatedRestoreAt?: string | null;
};

function formatElapsedTime(startedAt: string | null | undefined): string {
    if (!startedAt) return "";
    const start = new Date(startedAt).getTime();
    if (isNaN(start)) return "";
    const now = Date.now();
    const diffMs = now - start;
    if (diffMs < 0) return "";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (parts.length === 0) parts.push("less than a minute");
    return parts.join(", ");
}

function formatRemainingTime(restoreAt: string | null | undefined): string {
    if (!restoreAt) return "";
    const restoreTime = new Date(restoreAt).getTime();
    if (isNaN(restoreTime)) return "";
    const now = Date.now();
    const diffMs = restoreTime - now;
    if (diffMs <= 0) return "moments away";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
    if (parts.length === 0) return "less than a minute";
    return parts.join(", ");
}

function LiveDowntime({ startedAt, estimatedRestoreAt }: { startedAt?: string | null, estimatedRestoreAt?: string | null }) {
    const [elapsed, setElapsed] = useState(formatElapsedTime(startedAt));
    const [remaining, setRemaining] = useState(formatRemainingTime(estimatedRestoreAt));

    useEffect(() => {
        if (!startedAt && !estimatedRestoreAt) return;
        const interval = setInterval(() => {
            if (startedAt) setElapsed(formatElapsedTime(startedAt));
            if (estimatedRestoreAt) setRemaining(formatRemainingTime(estimatedRestoreAt));
        }, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [startedAt, estimatedRestoreAt]);

    if (!startedAt && !estimatedRestoreAt) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            {startedAt && elapsed && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Timer className="h-4 w-4" />
                    <span>Down for: {elapsed}</span>
                </div>
            )}
            
            {estimatedRestoreAt && remaining && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-md text-emerald-800 font-bold text-base shadow-sm shrink-0 w-max">
                    <Clock className="h-5 w-5 fill-emerald-200" />
                    <span>Will be back in: {remaining}</span>
                </div>
            )}
        </div>
    );
}

export default function MaintenancePage({ config }: { config: MaintenancePageConfig }) {
    const [bypassKey, setBypassKey] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    // Use the pre-resolved message from public settings, or fall back to computing it
    const message = config.message || getMaintenanceMessage(config);
    const hasTimingInfo = config.startedAt || config.estimatedRestoreAt;

    const handleBypass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bypassKey.trim()) return;
        // Reload with access key to trigger MaintenanceWrapper logic
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("access_key", bypassKey.trim());
        window.location.href = currentUrl.toString();
    };

    return (
        <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-2xl border-t-4 border-t-orange-500">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Site Maintenance
                    </CardTitle>
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-slate-700">
                            {message}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            We apologize for the inconvenience. Please check back later.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Timing Information (only shown if admin enabled showTimingToPublic) */}
                    {hasTimingInfo && (
                        <div className="space-y-4 p-5 bg-blue-50/70 border border-blue-200 rounded-lg flex flex-col items-center">
                            {config.estimatedRestoreAt && (
                                <div className="flex items-center justify-center gap-2 text-sm text-blue-700 font-medium border-b border-blue-200 pb-3 w-full">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Expected back by: {formatDateTimeIST(config.estimatedRestoreAt)}
                                    </span>
                                </div>
                            )}
                            <LiveDowntime startedAt={config.startedAt} estimatedRestoreAt={config.estimatedRestoreAt} />
                        </div>
                    )}

                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-center text-slate-600">
                        Department of Tourism & Civil Aviation<br />
                        Government of Himachal Pradesh
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 bg-slate-50 pt-6 rounded-b-xl border-t">
                    {!showLogin ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-slate-400 hover:text-slate-600 w-full"
                            onClick={() => setShowLogin(true)}
                        >
                            <Lock className="w-3 h-3 mr-1.5" />
                            Administrator Access
                        </Button>
                    ) : (
                        <form onSubmit={handleBypass} className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 ml-1">Access Key</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={bypassKey}
                                        onChange={(e) => setBypassKey(e.target.value)}
                                        placeholder="Enter key..."
                                        className="h-9"
                                    />
                                    <Button type="submit" size="sm" className="h-9">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => setShowLogin(false)}
                            >
                                Cancel
                            </Button>
                        </form>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
