
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ClipboardList, Search, FileText, Users,
    ArrowRight, Bell, Calendar, CheckCircle, Clock, ClipboardCheck, Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { type User } from "@shared/schema";

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
        payment: number;
        approved: number;
    };
}

export default function StateOperationalDashboard({ user }: StateOperationalDashboardProps) {
    const [, setLocation] = useLocation();

    // Fetch pending count for "My Tasks" context
    const { data: stats } = useQuery<StateStats>({
        queryKey: ["/api/stats/state"],
        refetchInterval: 60000,
    });

    const pendingScrutiny = stats?.hero?.pendingScrutiny || 0;

    return (
        <div className="space-y-6 pt-2">
            {/* Welcome Section */}
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-100/50 shadow-sm px-8 py-10 mb-8">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl" />

                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-white/80 backdrop-blur border-blue-200 text-blue-700 px-3 py-1 shadow-sm">
                                <Sparkles className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
                                Operational Command
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            Good Morning, {user.fullName.split(' ')[0]}
                        </h1>
                        <p className="text-lg text-slate-500 mt-2 max-w-xl">
                            You have <span className="font-bold text-slate-800">{pendingScrutiny} applications</span> requiring attention today.
                            System performance is optimal.
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-white/50 shadow-sm text-center min-w-[100px]">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Date</div>
                            <div className="font-bold text-slate-700 mt-1">
                                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-white/50 shadow-sm text-center min-w-[100px]">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Time</div>
                            <div className="font-bold text-slate-700 mt-1">
                                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority Action Area */}
            {/* Priority Action Area */}
            <h3 className="text-lg font-semibold">Your Action Queue</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Scrutiny Card - Primary Action */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-orange-200">
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
                            {pendingScrutiny}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Applications waiting for review</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 justify-between group-hover:pr-2 transition-all"
                            onClick={() => setLocation("/workflow-monitoring?status=under_scrutiny")}
                        >
                            Review Now <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </CardContent>
                </Card>

                {/* District Review - Monitor */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-blue-200">
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
                            {stats?.hero?.pendingDistrict || 0}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">With District Officers</p>
                    </CardContent>
                </Card>

                {/* Inspections - Monitor */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-purple-200">
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
                            {stats?.hero?.pendingInspection || 0}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Site inspections scheduled</p>
                    </CardContent>
                </Card>

                {/* Approved - Success */}
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:border-emerald-200">
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
                            {stats?.hero?.totalApproved || 0}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Total approved applications</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Grid - Premium */}
            <h3 className="text-lg font-semibold mt-6 mb-4 text-slate-800">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-blue-50/50 border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
                    onClick={() => setLocation("/analytics")}
                >
                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Search className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Search Portal</div>
                        <div className="text-xs text-muted-foreground font-normal mt-1">Find applications</div>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group"
                    onClick={() => setLocation("/workflow-monitoring")}
                >
                    <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Generate Reports</div>
                        <div className="text-xs text-muted-foreground font-normal mt-1">Export data</div>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-purple-50/50 border-slate-200 hover:border-purple-200 hover:shadow-md transition-all group"
                    onClick={() => setLocation("/admin/users")}
                >
                    <div className="p-3 rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Users className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">Manage Users</div>
                        <div className="text-xs text-muted-foreground font-normal mt-1">Staff directory</div>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-amber-50/50 border-slate-200 hover:border-amber-200 hover:shadow-md transition-all group"
                >
                    <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Bell className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">Notifications</div>
                        <div className="text-xs text-muted-foreground font-normal mt-1">View alerts</div>
                    </div>
                </Button>
            </div>

            {/* Application Pipeline Tracker (Standardized Format) */}
            <Card className="mt-8 border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                        Application Pipeline Status
                        <Badge variant="outline" className="font-normal text-muted-foreground">Live Application Counts</Badge>
                    </CardTitle>
                    <CardDescription>Real-time distribution of applications across the standard approval workflow</CardDescription>
                </CardHeader>
                <CardContent className="pb-8 pt-6">
                    {/* Living Pipeline Logic */}
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mx-4">
                            {[
                                { id: "da_review", label: "Scrutiny", count: stats?.pipeline_counts?.scrutiny || 0, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-500" },
                                { id: "forwarded_dtdo", label: "District Review", count: stats?.pipeline_counts?.district || 0, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-500" },
                                { id: "inspection_scheduled", label: "Inspection", count: stats?.pipeline_counts?.inspection || 0, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-500" },
                                { id: "payment_pending", label: "Payment", count: stats?.pipeline_counts?.payment || 0, color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-500" },
                                { id: "certificate", label: "Approved", count: stats?.pipeline_counts?.approved || 0, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-500" },
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
                </CardContent>
            </Card>
        </div>
    );
}

