import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { MaintenanceModeSetting, getMaintenanceMessage } from "@shared/appSettings";

export default function MaintenancePage({ config }: { config: MaintenanceModeSetting }) {
    const [bypassKey, setBypassKey] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    const message = getMaintenanceMessage(config);

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
                <CardContent className="space-y-6">
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

