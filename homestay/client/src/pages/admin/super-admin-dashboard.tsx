/**
 * Super Admin Hub - Clean Dashboard
 * 
 * A hub-style dashboard replacing the crowded super-console.
 * Links to dedicated pages for each major function.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import {
    Database,
    CreditCard,
    Shield,
    Users,
    HardDrive,
    Bell,
    Activity,
    Settings,
    FileText,
    Server,
    TestTube,
    Upload,
    BarChart3,
    CheckCircle,
    AlertTriangle,
    Clock,
    ArrowRight,
    Lock,
    Unlock,
    Loader2,
    ShieldAlert
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

interface SystemStats {
    database: {
        size: string;
        tables: number;
    };
    applications: {
        total: number;
        byStatus: Record<string, number>;
    };
    users: {
        total: number;
        byRole: Record<string, number>;
    };
    files: {
        total: number;
        totalSize: string;
    };
    environment: string;
}

interface QuickAction {
    title: string;
    description: string;
    href: string;
    icon: typeof Database;
    badge?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const operationalActions: QuickAction[] = [
    {
        title: "User Management",
        description: "Create, edit, or disable staff and admin accounts",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Workflow & Portal Config",
        description: "DA Send Back, OTP login, category enforcement, upload policies",
        href: "/admin/super-console#portal-config",
        icon: Settings,
    },
    {
        title: "Communications",
        description: "SMS/Email gateways and notification templates",
        href: "/admin/super-console#communications",
        icon: Bell,
    },
    {
        title: "Audit Log",
        description: "Track all system actions and exports",
        href: "/admin/audit-log",
        icon: FileText,
    },
    {
        title: "Staff Import",
        description: "Bulk import DA/DTDO accounts from CSV",
        href: "/admin/super-console#staff-tools",
        icon: Upload,
    },
    {
        title: "Backup Manager",
        description: "Scheduled backups and restore utilities",
        href: "/admin/backup",
        icon: HardDrive,
    },
    {
        title: "Export / Import",
        description: "System migration - export and import full system data",
        href: "/admin/export-import",
        icon: Server,
    },
];

const criticalActions: QuickAction[] = [
    {
        title: "System Controls",
        description: "Maintenance Mode, Payment Pausing, & Critical Switches",
        href: "/admin/system-controls",
        icon: Shield,
        badge: "Mission Critical",
        badgeVariant: "destructive",
    },
    {
        title: "Payment Gateway",
        description: "HimKosh credentials, DDO routing, and test modes",
        href: "/admin/super-console#payment-settings",
        icon: CreditCard,
        badge: "Sensitive",
        badgeVariant: "secondary",
    },
    {
        title: "Security Settings",
        description: "Captcha, OTP policy, and antivirus scanning",
        href: "/admin/super-console#security",
        icon: Shield,
    },
    {
        title: "Database Tools",
        description: "Configuration, reset utilities, and seed data",
        href: "/admin/super-console#database",
        icon: Database,
        badge: "Danger Zone",
        badgeVariant: "destructive",
    },
];

export default function SuperAdminDashboard() {
    const [criticalUnlocked, setCriticalUnlocked] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState<{
        open: boolean;
        password: string;
        error: string;
    }>({ open: false, password: "", error: "" });

    const { data: stats, isLoading } = useQuery<SystemStats>({
        queryKey: ["/api/admin/stats"],
    });

    // Fetch current user so we can pass username for validation (bypass split-routing session issues)
    const { data: authData } = useQuery<{ user: any }>({
        queryKey: ["/api/auth/me"],
    });

    // Password verification mutation
    const verifyPasswordMutation = useMutation({
        mutationFn: async (password: string) => {
            const username = authData?.user?.username;
            // Pass username to allow backend to validate even if session cookie is from legacy server
            const response = await apiRequest("POST", "/api/verify-critical-password", { password, username });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Invalid password");
            }
            return response.json();
        },
        onSuccess: () => {
            setCriticalUnlocked(true);
            setPasswordDialog({ open: false, password: "", error: "" });
        },
        onError: (error: Error) => {
            setPasswordDialog((prev) => ({ ...prev, error: error.message }));
        },
    });

    const handleUnlockClick = () => {
        if (criticalUnlocked) {
            setCriticalUnlocked(false);
        } else {
            setPasswordDialog({ open: true, password: "", error: "" });
        }
    };

    const pendingCount = stats?.applications?.byStatus?.["submitted"] || 0;
    const approvedCount = stats?.applications?.byStatus?.["approved"] || 0;
    const totalUsers = stats?.users?.total || 0;
    const environment = stats?.environment || "unknown";

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="container mx-auto max-w-7xl p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Settings className="h-6 w-6 text-primary" />
                                </div>
                                <Badge variant={environment === "production" ? "default" : "secondary"}>
                                    {environment}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Super Admin Console</h1>
                            <p className="text-muted-foreground mt-1">
                                Platform configuration and monitoring
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/admin/super-console">
                                <Server className="mr-2 h-4 w-4" />
                                Legacy Console
                            </Link>
                        </Button>
                    </div>

                    {/* Status Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Applications
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.applications?.total ?? "—"}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {approvedCount} approved
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pending Review
                                </CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Awaiting processing
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    System Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalUsers}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats?.users?.byRole?.["property_owner"] ?? 0} owners
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Database
                                </CardTitle>
                                <Database className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.database?.size ?? "—"}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats?.database?.tables ?? 0} tables
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Operational Actions */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Operations Console</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {operationalActions.map((action) => (
                                <Link key={action.title} href={action.href}>
                                    <Card className="h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                                    <action.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                {action.badge && (
                                                    <Badge variant={action.badgeVariant || "outline"} className="text-xs">
                                                        {action.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-base mt-3">{action.title}</CardTitle>
                                            <CardDescription className="text-sm line-clamp-2">
                                                {action.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                Open <ArrowRight className="ml-1 h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Critical Actions - Gated */}
                    <div className="border-t pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600" />
                                <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">System Internals & Critical Controls</h2>
                            </div>
                            <Button
                                variant={criticalUnlocked ? "outline" : "destructive"}
                                size="sm"
                                onClick={handleUnlockClick}
                            >
                                {criticalUnlocked ? (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        Lock Controls
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-4 h-4 mr-2" />
                                        Unlock Critical Controls
                                    </>
                                )}
                            </Button>
                        </div>

                        {criticalUnlocked ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                {criticalActions.map((action) => (
                                    <Link key={action.title} href={action.href}>
                                        <Card className="h-full border-red-200 bg-red-50/50 hover:bg-red-50 hover:shadow-md hover:border-red-400 transition-all cursor-pointer group dark:border-red-900 dark:bg-red-950/10">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:bg-red-200 transition-colors">
                                                        <action.icon className="h-5 w-5" />
                                                    </div>
                                                    {action.badge && (
                                                        <Badge variant={action.badgeVariant || "outline"} className="text-xs">
                                                            {action.badge}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-base mt-3 text-red-900 dark:text-red-100">{action.title}</CardTitle>
                                                <CardDescription className="text-sm line-clamp-2 text-red-800/80 dark:text-red-200/70">
                                                    {action.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center text-sm text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                                    Access <ArrowRight className="ml-1 h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-red-200 bg-red-50/30 p-12 text-center dark:border-red-900/50">
                                <Lock className="w-12 h-12 text-red-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-red-900 dark:text-red-200">Critical Controls Locked</h3>
                                <p className="text-sm text-red-600/80 dark:text-red-400 mt-1 max-w-md mx-auto">
                                    These settings affect core system functionality, payments, and data integrity.
                                    Please unlock to proceed with caution.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                    onClick={handleUnlockClick}
                                >
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Reveal Controls
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* System Health */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                System Health
                            </CardTitle>
                            <CardDescription>Current platform status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-medium text-sm">Database</p>
                                        <p className="text-xs text-muted-foreground">Connected, {stats?.database?.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-medium text-sm">File Storage</p>
                                        <p className="text-xs text-muted-foreground">{stats?.files?.total ?? 0} files, {stats?.files?.totalSize}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-medium text-sm">API Server</p>
                                        <p className="text-xs text-muted-foreground">Healthy</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer note */}
                    <div className="text-center text-sm text-muted-foreground pt-4">
                        <p>
                            For advanced configuration, use the{" "}
                            <Link href="/admin/super-console" className="text-primary hover:underline">
                                Legacy Console
                            </Link>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-muted-foreground">v{import.meta.env.APP_VERSION}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Critical Access Password Dialog */}
            <Dialog
                open={passwordDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setPasswordDialog({ open: false, password: "", error: "" });
                    }
                }}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="w-5 h-5" />
                            Unlock Critical Controls
                        </DialogTitle>
                        <DialogDescription>
                            Enter your password to access critical system controls.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="dashboard-critical-password">Your Password</Label>
                            <Input
                                id="dashboard-critical-password"
                                type="password"
                                value={passwordDialog.password}
                                onChange={(e) => setPasswordDialog((prev) => ({ ...prev, password: e.target.value, error: "" }))}
                                placeholder="Enter your password"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && passwordDialog.password.length >= 1) {
                                        verifyPasswordMutation.mutate(passwordDialog.password);
                                    }
                                }}
                            />
                            {passwordDialog.error && (
                                <p className="text-sm text-red-600">{passwordDialog.error}</p>
                            )}
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs text-red-700">
                                <strong>Warning:</strong> These controls can modify payment settings, reset data, and change security configurations.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPasswordDialog({ open: false, password: "", error: "" })}
                            disabled={verifyPasswordMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => verifyPasswordMutation.mutate(passwordDialog.password)}
                            disabled={verifyPasswordMutation.isPending || passwordDialog.password.length < 1}
                        >
                            {verifyPasswordMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Unlock"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
