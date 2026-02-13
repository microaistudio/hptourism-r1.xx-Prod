
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ClipboardList, Search, FileText, Users,
    ArrowRight, CheckCircle, ClipboardCheck, Sparkles,
    BarChart3, AlertTriangle, XCircle, Send, Zap
} from "lucide-react";
import { useLocation } from "wouter";
import { type User } from "@shared/schema";
import { formatDateIST, formatTimeIST } from "@/lib/dateUtils";

interface StateOperationalDashboardProps {
    user: User;
}

interface StateStats {
    hero: {
        totalApplications: number;
        totalRevenue: number;
        pendingScrutiny: number;
        pendingDistrict: number;
        pendingInspection: number;
        totalApproved: number;
        avgClearanceDays: string;
    };
    pipeline_counts: {
        draft: number;
        submitted: number;
        scrutiny: number;
        district: number;
        inspection: number;
        approved: number;
        objection: number;
        rejected: number;
    };
}

/** Returns IST-aware greeting based on hour of day */
function getGreeting(): string {
    const now = new Date();
    // Convert to IST: UTC + 5:30
    const istHour = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24;
    if (istHour < 12) return "Good Morning";
    if (istHour < 17) return "Good Afternoon";
    return "Good Evening";
}

export default function StateOperationalDashboard({ user }: StateOperationalDashboardProps) {
    const [, setLocation] = useLocation();

    // Fetch pending count for "My Tasks" context
    const { data: stats, isLoading } = useQuery<StateStats>({
        queryKey: ["/api/stats/state"],
        refetchInterval: 60000,
    });

    const pendingScrutiny = stats?.hero?.pendingScrutiny || 0;
    const pendingDistrict = stats?.hero?.pendingDistrict || 0;
    const pendingInspection = stats?.hero?.pendingInspection || 0;
    const totalApproved = stats?.hero?.totalApproved || 0;

    // Total active items needing attention
    const totalPending = pendingScrutiny + pendingDistrict + pendingInspection;

    return (
        <div className="space-y-6 pt-2">
            {/* Premium Hero Section */}
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            {getGreeting()}, {user.fullName.split(' ')[0]}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-normal">
                                Operational Command
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {totalPending > 0 ? (
                                    <>You have <span className="font-semibold text-foreground">{totalPending} applications</span> pending today.</>
                                ) : (
                                    "All tasks completed for now."
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-right hidden md:block">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Current Time</div>
                        <div className="text-sm font-bold text-foreground font-mono">
                            {formatTimeIST(new Date())} <span className="text-slate-400 font-normal">| {formatDateIST(new Date())}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority Action Area */}
            <div className="flex items-center gap-3 mt-4">
                <div className="p-2 rounded-xl bg-orange-50 border border-orange-100">
                    <ClipboardList className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Your Action Queue</h3>
                    <p className="text-xs text-muted-foreground">Items requiring your attention today</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Scrutiny Card - Primary Action */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-orange-200 cursor-pointer"
                    onClick={() => setLocation("/workflow-monitoring?status=under_scrutiny")}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                            Pending Scrutiny
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <ClipboardList className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 tracking-tight my-1 group-hover:text-orange-600 transition-colors">
                            {isLoading ? <Skeleton className="h-10 w-16" /> : pendingScrutiny}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Submitted & under DA review</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 justify-between group-hover:pr-2 transition-all"
                            onClick={(e) => { e.stopPropagation(); setLocation("/workflow-monitoring?status=under_scrutiny"); }}
                        >
                            Review Now <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </CardContent>
                </Card>

                {/* District Review */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-blue-200 cursor-pointer"
                    onClick={() => setLocation("/workflow-monitoring?status=forwarded_to_dtdo")}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                            Pending District
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Users className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 tracking-tight my-1 group-hover:text-blue-600 transition-colors">
                            {isLoading ? <Skeleton className="h-10 w-16" /> : pendingDistrict}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">With DTDO for review & decision</p>
                    </CardContent>
                </Card>

                {/* Inspections */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-purple-200 cursor-pointer"
                    onClick={() => setLocation("/workflow-monitoring?status=inspection_scheduled")}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-fuchsia-500" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                            Pending Inspection
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <ClipboardCheck className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 tracking-tight my-1 group-hover:text-purple-600 transition-colors">
                            {isLoading ? <Skeleton className="h-10 w-16" /> : pendingInspection}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Site inspections in progress</p>
                    </CardContent>
                </Card>

                {/* Approved - Certificates */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-emerald-200 cursor-pointer"
                    onClick={() => setLocation("/workflow-monitoring?status=approved")}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 flex items-center justify-between uppercase tracking-wider">
                            Certificates
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 tracking-tight my-1 group-hover:text-emerald-600 transition-colors">
                            {isLoading ? <Skeleton className="h-10 w-16" /> : totalApproved}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Total approved applications</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex items-center gap-3 mt-8 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                    <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                    <p className="text-xs text-muted-foreground">Shortcuts to common operations</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                    className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-blue-200"
                    onClick={() => setLocation("/workflow-monitoring")}
                >
                    <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                        <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Search className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Search Portal</div>
                            <div className="text-xs text-muted-foreground mt-1">Find applications</div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>

                <Card
                    className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-emerald-200"
                    onClick={() => setLocation("/admin/payment-reports")}
                >
                    <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Generate Reports</div>
                            <div className="text-xs text-muted-foreground mt-1">Export data</div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>

                <Card
                    className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-purple-200"
                    onClick={() => setLocation("/state-dashboard")}
                >
                    <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                        <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">Him-Darshan</div>
                            <div className="text-xs text-muted-foreground mt-1">State overview</div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>

                <Card
                    className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-amber-200"
                    onClick={() => setLocation("/analytics")}
                >
                    <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                        <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">Analytics</div>
                            <div className="text-xs text-muted-foreground mt-1">Trends & insights</div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
            </div>

            {/* Application Pipeline Tracker */}
            <Card className="mt-6 border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-sky-500" />
                            Application Pipeline Status
                        </div>
                        <Badge variant="outline" className="font-normal border-sky-200 bg-sky-50/50 text-sky-600">Live Counts</Badge>
                    </CardTitle>
                    <CardDescription>Real-time distribution of applications across the approval workflow</CardDescription>
                </CardHeader>
                <CardContent className="pb-8 pt-6">
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mx-2">
                            {[
                                { id: "submitted", label: "Submitted", count: stats?.pipeline_counts?.submitted || 0, color: "text-sky-600", bg: "bg-sky-100", border: "border-sky-500", icon: Send },
                                { id: "scrutiny", label: "Scrutiny", count: stats?.pipeline_counts?.scrutiny || 0, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-500", icon: ClipboardList },
                                { id: "district", label: "District", count: stats?.pipeline_counts?.district || 0, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-500", icon: Users },
                                { id: "inspection", label: "Inspection", count: stats?.pipeline_counts?.inspection || 0, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-500", icon: ClipboardCheck },
                                { id: "approved", label: "Approved", count: stats?.pipeline_counts?.approved || 0, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-500", icon: CheckCircle },
                            ].map((milestone, idx, arr) => {
                                const isLast = idx === arr.length - 1;
                                const isActive = milestone.count > 0;

                                return (
                                    <div key={milestone.id} className="flex items-center flex-1 relative group">
                                        <div className="flex flex-col items-center z-10 w-full">
                                            <div
                                                className={`
                                                    relative flex h-14 w-14 items-center justify-center rounded-full border-4 text-lg font-bold shadow-md shrink-0 transition-all duration-300
                                                    ${milestone.bg} ${milestone.border} ${milestone.color}
                                                    ${isActive ? 'scale-110 shadow-lg' : 'grayscale-[0.3] opacity-80 group-hover:grayscale-0 group-hover:opacity-100'}
                                                `}
                                            >
                                                {isActive && (
                                                    <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
                                                )}
                                                {milestone.count}
                                            </div>
                                            <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${milestone.color}`}>{milestone.label}</span>
                                        </div>
                                        {!isLast && (
                                            <div className="absolute top-7 left-1/2 w-full h-[3px] bg-slate-100 -z-10 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent w-1/2 animate-[shimmer_2s_infinite]" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Secondary row: Objections & Rejected/Refund */}
                    {((stats?.pipeline_counts?.objection || 0) > 0 || (stats?.pipeline_counts?.rejected || 0) > 0) && (
                        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
                            <div className="flex items-center gap-4 justify-center">
                                {(stats?.pipeline_counts?.objection || 0) > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-semibold text-amber-700">{stats?.pipeline_counts?.objection}</span>
                                        <span className="text-xs text-amber-600 font-medium">Objections / Corrections</span>
                                    </div>
                                )}
                                {(stats?.pipeline_counts?.rejected || 0) > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                                        onClick={() => setLocation("/admin/payment-reports")}>
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-semibold text-red-700">{stats?.pipeline_counts?.rejected}</span>
                                        <span className="text-xs text-red-600 font-medium">Rejected / Refund</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

