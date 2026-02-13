
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import {
    TrendingUp, TrendingDown, Clock, FileText, XCircle,
    BedDouble, BadgeIndianRupee, Building2, Award,
    Activity, MapPin, Timer, Sparkles, Zap,
    CheckCircle2, PercentCircle, ArrowUpRight, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { formatDateIST } from "@/lib/dateUtils";

type StatsData = {
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
        existingRC: number;
    };
    trends: {
        revenue: Array<{ date: string; value: number }>;
        applications: Array<{ date: string; value: number }>;
    };
    funnel: Array<{ name: string; value: number; fill: string }>;
    heatmap: Array<{ district: string; applications: number; status: string }>;
    leaderboard: Array<{ district: string; avgDays: string; processed: number }>;
    economic: {
        totalBeds: number;
        projectedRevenue: number;
        categorySplit: Array<{ name: string; value: number }>;
    };
};

type TrendsData = {
    applications: { current: number; previous: number; change: number; trend: 'up' | 'down' };
    revenue: { current: number; previous: number; change: number; trend: 'up' | 'down' };
};

type ActivityItem = {
    id: string;
    applicationNumber: string;
    propertyName: string;
    action: string;
    district: string;
    ownerName: string;
    timestamp: string;
};

const CATEGORY_COLORS: Record<string, string> = {
    diamond: "#a855f7",
    gold: "#f59e0b",
    silver: "#94a3b8",
    uncategorized: "#6b7280"
};

const ACTION_COLORS: Record<string, string> = {
    "Approved": "text-emerald-600",
    "Rejected": "text-red-600",
    "Submitted": "text-blue-600",
    "Draft Created": "text-slate-400",
    "Inspection Scheduled": "text-purple-600",
    "Under Review": "text-amber-600",
    "Updated": "text-slate-500"
};

const ACTION_DOT_COLORS: Record<string, string> = {
    "Approved": "bg-emerald-500",
    "Rejected": "bg-red-500",
    "Submitted": "bg-blue-500",
    "Draft Created": "bg-slate-300",
    "Inspection Scheduled": "bg-purple-500",
    "Under Review": "bg-amber-500",
    "Updated": "bg-slate-400"
};

const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value);

const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "";
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Unknown time";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        if (diffMs < 0) return "Just now";

        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDateIST(date);
    } catch (e) {
        return "";
    }
};

// ─── KPI Card (Strategic Metric) ────────────────────────
function KpiCard({
    title, value, subtitle, icon: Icon, accentColor, onClick
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    accentColor: string;
    onClick?: () => void;
}) {
    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-200",
                onClick && "hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            )}
            onClick={onClick}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
                        <h3 className="text-3xl font-bold text-foreground mt-1.5">{value}</h3>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
                        )}
                    </div>
                    <div className={cn("p-2.5 rounded-xl", accentColor)}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className={cn("absolute bottom-0 left-0 h-1 w-full", accentColor)} />
            </CardContent>
        </Card>
    );
}

// ─── District Performance Table ────────────────────────
function DistrictTable({ heatmap, leaderboard }: {
    heatmap: StatsData['heatmap'];
    leaderboard: StatsData['leaderboard'];
}) {
    // Merge heatmap (total apps) with leaderboard (avg days, processed)
    const leaderboardMap = new Map(leaderboard.map(l => [l.district, l]));

    const districts = heatmap.map(d => ({
        name: d.district,
        total: d.applications,
        processed: leaderboardMap.get(d.district)?.processed || 0,
        avgDays: leaderboardMap.get(d.district)?.avgDays || "—",
    }));

    const maxTotal = Math.max(...districts.map(d => d.total), 1);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    District-wise Analysis
                </CardTitle>
                <CardDescription>Application distribution and processing speed by district</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {districts.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-5 text-right">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium truncate max-w-[180px]">{d.name}</span>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="font-semibold">{d.total} apps</span>
                                        <span className="text-muted-foreground">
                                            {d.processed > 0 ? (
                                                <span className="text-emerald-600 font-medium">{d.processed} approved · {d.avgDays}d avg</span>
                                            ) : (
                                                "No approvals yet"
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-700"
                                        style={{ width: `${(d.total / maxTotal) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Activity Feed ─────────────────────────────────────
function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Live Activity Feed
                    </CardTitle>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                        <Activity className="h-3 w-3 mr-1 animate-pulse text-emerald-500" />
                        Auto-refresh 30s
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-0 divide-y">
                    {activities.length > 0 ? (
                        activities.slice(0, 8).map(item => (
                            <div key={item.id} className="flex items-center gap-3 py-2.5">
                                <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                                    ACTION_DOT_COLORS[item.action] || "bg-slate-400"
                                )} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-xs font-semibold", ACTION_COLORS[item.action] || "text-slate-600")}>
                                            {item.action}
                                        </span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {item.propertyName || item.applicationNumber}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">
                                        {item.district} • {item.ownerName}
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                    {formatTimeAgo(item.timestamp)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No recent activity</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Application Trend Chart ───────────────────────────
function TrendChart({ data, title, color }: {
    data: Array<{ date: string; value: number }>;
    title: string;
    color: string;
}) {
    if (!data || data.length === 0) return null;

    // Format dates to short labels
    const chartData = data.map(d => ({
        ...d,
        label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {title}
                </CardTitle>
                <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#gradient-${color})`} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function StateDashboardV2() {
    const [, setLocation] = useLocation();

    const { data: stats, isLoading, error } = useQuery<StatsData>({
        queryKey: ["/api/stats/state"],
        refetchInterval: 60000,
    });

    const { data: trends } = useQuery<TrendsData>({
        queryKey: ["/api/stats/trends"],
        refetchInterval: 120000,
    });

    const { data: activities } = useQuery<ActivityItem[]>({
        queryKey: ["/api/stats/activity"],
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-56 rounded-xl" />
                    <Skeleton className="h-56 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="p-8 text-center">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Failed to load dashboard data</p>
                </Card>
            </div>
        );
    }

    // ── Derived Strategic Numbers ──
    const pc = stats.pipeline_counts;
    // Total submitted = everything except draft & superseded
    const totalSubmitted = pc.submitted + pc.scrutiny + pc.district + pc.inspection + pc.approved + pc.objection + pc.rejected;
    const approvalRate = totalSubmitted > 0 ? Math.round((pc.approved / totalSubmitted) * 100) : 0;
    const avgDays = parseFloat(stats.hero.avgClearanceDays) || 0;

    return (
        <div className="space-y-6 pt-2">
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Him-Darshan Command Center</h1>
                        <p className="text-sm text-muted-foreground">State-wide strategic overview of homestay registrations</p>
                    </div>
                </div>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" /> LIVE
                </Badge>
            </div>

            {/* ── Strategic KPIs ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Registered Homestays"
                    value={pc.approved}
                    subtitle={`Out of ${totalSubmitted} applications submitted`}
                    icon={CheckCircle2}
                    accentColor="bg-emerald-500"
                    onClick={() => setLocation("/workflow-monitoring?status=rc_issued")}
                />
                <KpiCard
                    title="Revenue Collected"
                    value={`₹${formatNumber(stats.hero.totalRevenue)}`}
                    subtitle={trends?.revenue.change !== undefined
                        ? (trends.revenue.change > 0 && trends.revenue.previous > 0
                            ? `+${trends.revenue.change}% vs previous period`
                            : "System launched recently")
                        : undefined}
                    icon={BadgeIndianRupee}
                    accentColor="bg-blue-500"
                />
                <KpiCard
                    title="Approval Rate"
                    value={`${approvalRate}%`}
                    subtitle={`${pc.approved} approved of ${totalSubmitted} submitted`}
                    icon={PercentCircle}
                    accentColor="bg-purple-500"
                />
                <KpiCard
                    title="Avg. Processing Time"
                    value={`${avgDays}`}
                    subtitle="Average days from submission to approval"
                    icon={Timer}
                    accentColor="bg-amber-500"
                />
            </div>

            {/* ── At A Glance: Status Breakdown ── */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        Status Breakdown
                    </CardTitle>
                    <CardDescription>Current distribution of all {totalSubmitted} submitted applications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: "Drafts", count: pc.draft, color: "bg-slate-100 text-slate-700 border-slate-200" },
                            { label: "Submitted", count: pc.submitted, color: "bg-sky-100 text-sky-700 border-sky-200" },
                            { label: "DA Scrutiny", count: pc.scrutiny, color: "bg-orange-100 text-orange-700 border-orange-200" },
                            { label: "District Review", count: pc.district, color: "bg-blue-100 text-blue-700 border-blue-200" },
                            { label: "Inspection", count: pc.inspection, color: "bg-purple-100 text-purple-700 border-purple-200" },
                            { label: "Objection / Corrections", count: pc.objection, color: "bg-amber-100 text-amber-700 border-amber-200" },
                            { label: "Approved", count: pc.approved, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                            { label: "Rejected", count: pc.rejected, color: "bg-red-100 text-red-700 border-red-200" },
                            { label: "Existing RC", count: pc.existingRC, color: "bg-gray-100 text-gray-700 border-gray-200" },
                        ].map(item => (
                            <div key={item.label}
                                className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium", item.color)}>
                                <span className="text-lg font-bold">{item.count}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    {/* visual bar */}
                    <div className="flex h-3 rounded-full overflow-hidden mt-4 bg-muted">
                        {[
                            { count: pc.draft, color: "bg-slate-500" },
                            { count: pc.submitted, color: "bg-sky-500" },
                            { count: pc.scrutiny, color: "bg-orange-500" },
                            { count: pc.district, color: "bg-blue-500" },
                            { count: pc.inspection, color: "bg-purple-500" },
                            { count: pc.objection, color: "bg-amber-500" },
                            { count: pc.approved, color: "bg-emerald-500" },
                            { count: pc.rejected, color: "bg-red-500" },
                        ].filter(s => s.count > 0).map((s, i) => (
                            <div
                                key={i}
                                className={cn("h-full transition-all duration-700", s.color)}
                                style={{ width: `${(s.count / Math.max(totalSubmitted, 1)) * 100}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ── Trends Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TrendChart
                    data={stats.trends?.applications || []}
                    title="Applications Over Time"
                    color="#3b82f6"
                />
                <TrendChart
                    data={stats.trends?.revenue || []}
                    title="Revenue Over Time"
                    color="#10b981"
                />
            </div>

            {/* ── District Analysis + Activity Feed ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3">
                    <DistrictTable heatmap={stats.heatmap} leaderboard={stats.leaderboard} />
                </div>
                <div className="lg:col-span-2">
                    <ActivityFeed activities={activities || []} />
                </div>
            </div>

            {/* ── Economic Impact Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <BedDouble className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Tourism Capacity</span>
                        </div>
                        <div className="text-3xl font-bold">{formatNumber(stats.economic.totalBeds)}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total beds in approved homestays</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-100">
                                <BadgeIndianRupee className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Est. Annual Revenue</span>
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(stats.economic.projectedRevenue)}</div>
                        <div className="text-xs text-muted-foreground mt-1">Based on 40% avg occupancy</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                                <Building2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Property Categories</span>
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            {stats.economic.categorySplit.length > 0 ? (
                                <>
                                    <div className="h-20 w-20 flex-shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={stats.economic.categorySplit} cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={3} dataKey="value">
                                                    {stats.economic.categorySplit.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name.toLowerCase()] || "#6b7280"} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {stats.economic.categorySplit.map(cat => (
                                            <div key={cat.name} className="flex items-center gap-2 text-xs">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name.toLowerCase()] || "#6b7280" }} />
                                                <span className="text-muted-foreground">{cat.name}:</span>
                                                <span className="font-semibold">{cat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">No approved properties yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
