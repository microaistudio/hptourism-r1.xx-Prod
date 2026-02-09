
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";
import {
    TrendingUp, TrendingDown, Clock, FileText, XCircle,
    BedDouble, BadgeIndianRupee, Building2, Award,
    ArrowRight, Activity, MapPin, Timer, Sparkles, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

type StatsData = {
    hero: {
        totalApplications: number;
        totalRevenue: number;
        pendingScrutiny: number;
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
    "Approved": "text-emerald-400",
    "Rejected": "text-red-400",
    "Submitted": "text-blue-400",
    "Draft Created": "text-slate-400",
    "Inspection Scheduled": "text-purple-400",
    "Under Review": "text-amber-400",
    "Updated": "text-slate-300"
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
        // Validate date
        if (isNaN(date.getTime())) return "Unknown time";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        // Handle future dates or clock skew
        if (diffMs < 0) return "Just now";

        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
        return "";
    }
};

// Hero Metric Card with real trends
function HeroCard({
    title, value, icon: Icon, gradient, onClick, trendValue, trendDirection, valuePrefix = ""
}: {
    title: string;
    value: number;
    icon: any;
    gradient: string;
    onClick?: () => void;
    trendValue?: number;
    trendDirection?: 'up' | 'down';
    valuePrefix?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-2xl cursor-pointer",
                "border border-white/10 backdrop-blur-sm",
                gradient
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/70">{title}</p>
                    <h3 className="text-4xl font-bold text-white mt-1">
                        {valuePrefix}{formatNumber(value)}
                    </h3>
                    {trendValue !== undefined && (
                        <p className={cn(
                            "text-xs mt-2 flex items-center gap-1",
                            trendDirection === 'up' ? "text-emerald-300" : "text-rose-300"
                        )}>
                            {trendDirection === 'up'
                                ? <TrendingUp className="h-3 w-3" />
                                : <TrendingDown className="h-3 w-3" />
                            }
                            {trendDirection === 'up' ? '+' : ''}{trendValue}% vs last 30 days
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-white/10">
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10">
                <Icon className="h-24 w-24 text-white" />
            </div>
        </button>
    );
}

// Pipeline Stage Card
function PipelineStage({
    stage, index, total, totalApps
}: {
    stage: { name: string; value: number; fill: string };
    index: number;
    total: number;
    totalApps: number;
}) {
    const percentage = totalApps > 0 ? Math.round((stage.value / totalApps) * 100) : 0;

    return (
        <div className="flex items-center gap-1 flex-1">
            <div
                className="flex-1 rounded-xl p-3 text-center h-[100px] flex flex-col items-center justify-center"
                style={{ backgroundColor: stage.fill }}
            >
                <div className="text-2xl font-bold text-white">{stage.value}</div>
                <div className="text-[10px] font-medium text-white/80 mt-1 leading-tight px-1">
                    {stage.name}
                </div>
                <div className="text-[9px] mt-1 px-2 py-0.5 bg-white/20 rounded-full text-white">
                    {percentage > 0 ? `${percentage}%` : "—"}
                </div>
            </div>
            {index < total - 1 && (
                <ArrowRight className="h-4 w-4 text-white/30 flex-shrink-0" />
            )}
        </div>
    );
}

// District Bar
function DistrictBar({ district, count, maxCount, rank }: {
    district: string; count: number; maxCount: number; rank: number;
}) {
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/40 w-4">{rank}</span>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/90 truncate max-w-[150px]">{district}</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

// Leaderboard Entry
function LeaderboardEntry({ entry, rank }: {
    entry: { district: string; avgDays: string; processed: number }; rank: number;
}) {
    const medals = ["🥇", "🥈", "🥉"];
    return (
        <div className={cn("flex items-center gap-3 p-3 rounded-lg transition-all", rank <= 3 ? "bg-white/5" : "bg-transparent")}>
            <span className="text-xl w-8 text-center">
                {rank <= 3 ? medals[rank - 1] : <span className="text-white/40 text-sm">{rank}</span>}
            </span>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{entry.district}</div>
                <div className="text-xs text-white/50">{entry.processed} processed</div>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">{entry.avgDays}</div>
                <div className="text-[10px] text-white/50">avg days</div>
            </div>
        </div>
    );
}

// Activity Feed Item
function ActivityFeedItem({ item }: { item: ActivityItem }) {
    return (
        <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                item.action === "Approved" ? "bg-emerald-400" :
                    item.action === "Rejected" ? "bg-red-400" :
                        item.action === "Submitted" ? "bg-blue-400" : "bg-slate-400"
            )} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", ACTION_COLORS[item.action] || "text-white")}>
                        {item.action}
                    </span>
                    <span className="text-xs text-white/40">•</span>
                    <span className="text-xs text-white/60 truncate">{item.propertyName || item.applicationNumber}</span>
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                    {item.district} • {item.ownerName}
                </div>
            </div>
            <div className="text-[10px] text-white/40 flex-shrink-0">
                {formatTimeAgo(item.timestamp)}
            </div>
        </div>
    );
}

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
                        ))}
                    </div>
                    <Skeleton className="h-40 rounded-2xl bg-white/5" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
                <Card className="bg-white/5 border-white/10 p-8 text-center">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-white/70">Failed to load dashboard data</p>
                </Card>
            </div>
        );
    }

    const totalApps = stats.funnel.reduce((sum, s) => sum + s.value, 0);
    const maxDistrictCount = Math.max(...stats.heatmap.map(d => d.applications), 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Him-Darshan Command Center</h1>
                        <p className="text-sm text-white/50">Real-time state-wide tourism intelligence</p>
                    </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" /> LIVE
                </Badge>
            </div>

            {/* Hero Metrics with Real Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <HeroCard
                    title="Total Applications"
                    value={stats.hero.totalApplications}
                    icon={FileText}
                    gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                    onClick={() => setLocation("/workflow-monitoring")}
                    trendValue={trends?.applications.change}
                    trendDirection={trends?.applications.trend}
                />
                <HeroCard
                    title="Revenue Collected"
                    value={stats.hero.totalRevenue}
                    icon={BadgeIndianRupee}
                    gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
                    trendValue={trends?.revenue.change}
                    trendDirection={trends?.revenue.trend}
                    valuePrefix="₹"
                />
                <HeroCard
                    title="Pending Scrutiny"
                    value={stats.hero.pendingScrutiny}
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-600 to-orange-700"
                    onClick={() => setLocation("/workflow-monitoring?status=under_scrutiny")}
                />
                <HeroCard
                    title="Avg Clearance Days"
                    value={parseFloat(stats.hero.avgClearanceDays) || 0}
                    icon={Timer}
                    gradient="bg-gradient-to-br from-purple-600 to-purple-800"
                />
            </div>

            {/* Pipeline Funnel */}
            <Card className="bg-white/5 border-white/10 backdrop-blur mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        Application Pipeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-1 my-4 px-2">
                        {[
                            { id: "da_review", label: "Scrutiny", count: stats?.pipeline_counts?.scrutiny || 0, color: "text-orange-400", border: "border-orange-500/50", bg: "bg-orange-500/10" },
                            { id: "forwarded_dtdo", label: "District", count: stats?.pipeline_counts?.district || 0, color: "text-blue-400", border: "border-blue-500/50", bg: "bg-blue-500/10" },
                            { id: "inspection_scheduled", label: "Inspection", count: stats?.pipeline_counts?.inspection || 0, color: "text-purple-400", border: "border-purple-500/50", bg: "bg-purple-500/10" },
                            { id: "payment_pending", label: "Payment", count: stats?.pipeline_counts?.payment || 0, color: "text-indigo-400", border: "border-indigo-500/50", bg: "bg-indigo-500/10" },
                            { id: "certificate", label: "Approved", count: stats?.pipeline_counts?.approved || 0, color: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-500/10" },
                        ].map((milestone, idx, arr) => {
                            const isLast = idx === arr.length - 1;
                            return (
                                <div key={milestone.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center z-10">
                                        <div
                                            className={cn(
                                                "flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all shrink-0 backdrop-blur-md",
                                                milestone.bg, milestone.border, milestone.color
                                            )}
                                        >
                                            {milestone.count}
                                        </div>
                                        <span className={cn("text-[10px] uppercase tracking-wider font-semibold mt-2", milestone.color)}>
                                            {milestone.label}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div className="h-[2px] flex-1 bg-white/10 mx-2 -mt-6 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Middle Row - District Heatmap + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-400" />
                            Top Districts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.heatmap.slice(0, 6).map((d, i) => (
                                <DistrictBar key={d.district} district={d.district} count={d.applications} maxCount={maxDistrictCount} rank={i + 1} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            Performance Leaderboard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.leaderboard.slice(0, 5).map((entry, i) => (
                                <LeaderboardEntry key={entry.district} entry={entry} rank={i + 1} />
                            ))}
                            {stats.leaderboard.length === 0 && (
                                <p className="text-center text-white/50 py-8">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row - Economic + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Beds */}
                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20 backdrop-blur">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <BedDouble className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-white/70">Tourism Capacity</span>
                        </div>
                        <div className="text-4xl font-bold text-white">{formatNumber(stats.economic.totalBeds)}</div>
                        <div className="text-sm text-white/50 mt-1">Total approved beds</div>
                    </CardContent>
                </Card>

                {/* Revenue */}
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-500/20 backdrop-blur">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <BadgeIndianRupee className="h-5 w-5 text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-white/70">Est. Annual Revenue</span>
                        </div>
                        <div className="text-4xl font-bold text-white">{formatCurrency(stats.economic.projectedRevenue)}</div>
                        <div className="text-sm text-white/50 mt-1">Based on 40% occupancy</div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20 backdrop-blur">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Building2 className="h-5 w-5 text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-white/70">Inventory Quality</span>
                        </div>
                        <div className="h-24">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.economic.categorySplit} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={3} dataKey="value">
                                        {stats.economic.categorySplit.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name.toLowerCase()] || "#6b7280"} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            {stats.economic.categorySplit.slice(0, 3).map((cat) => (
                                <div key={cat.name} className="flex items-center gap-1 text-xs text-white/60">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name.toLowerCase()] || "#6b7280" }} />
                                    {cat.name}: {cat.value}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card className="bg-white/5 border-white/10 backdrop-blur mt-6">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-400" />
                            Recent Activity
                        </CardTitle>
                        <Badge variant="outline" className="text-white/50 border-white/20 text-xs">
                            Auto-refresh 30s
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-white/5">
                        {activities && activities.length > 0 ? (
                            activities.slice(0, 10).map((item) => (
                                <ActivityFeedItem key={item.id} item={item} />
                            ))
                        ) : (
                            <p className="text-center text-white/50 py-8">No recent activity</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
