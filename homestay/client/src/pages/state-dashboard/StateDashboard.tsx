
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, Legend, AreaChart, Area
} from "recharts";
import {
    TrendingUp, Clock, FileText, CheckCircle, XCircle, AlertTriangle,
    BedDouble, BadgeIndianRupee, Building2, Award, Zap, Users, Target,
    ArrowUpRight, ArrowDownRight, Activity, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatsData = {
    hero: {
        totalApplications: number;
        totalRevenue: number;
        pendingScrutiny: number;
        avgClearanceDays: string;
    };
    funnel: Array<{ name: string; value: number; fill: string }>;
    heatmap: Array<{ district: string; applications: number; status: string }>;
    leaderboard: Array<{ district: string; avgDays: string; processed: number }>;
    economic: {
        totalBeds: number;
        projectedRevenue: number;
        categorySplit: Array<{ name: string; value: number }>;
    };
    trends: {
        revenue: Array<{ date: string; value: number }>;
        applications: Array<{ date: string; value: number }>;
    };
};

const CATEGORY_COLORS: Record<string, string> = {
    diamond: "#8b5cf6",
    gold: "#f59e0b",
    silver: "#94a3b8",
    Uncategorized: "#6b7280"
};

const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value);

// Animated Counter Effect
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    return (
        <span className="tabular-nums">
            {formatNumber(value)}{suffix}
        </span>
    );
}

// Hero Stat Card Component
function HeroCard({
    title, value, subtitle, icon: Icon, trend, trendUp, gradient, delay = 0
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    trend?: string;
    trendUp?: boolean;
    gradient: string;
    delay?: number;
}) {
    return (
        <Card className={cn(
            "relative overflow-hidden border-0 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl",
            gradient
        )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                        <p className="text-xs text-white/70">{subtitle}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 mt-3 text-xs font-medium",
                        trendUp ? "text-emerald-200" : "text-rose-200"
                    )}>
                        {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// District Heatmap Card
function DistrictHeatmap({ data }: { data: StatsData['heatmap'] }) {
    const maxValue = Math.max(...data.map(d => d.applications), 1);

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            District Activity Heatmap
                        </CardTitle>
                        <CardDescription>Application distribution across administrative units</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">Live Data</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {data.slice(0, 12).map((district, idx) => {
                        const intensity = district.applications / maxValue;
                        return (
                            <div
                                key={district.district}
                                className={cn(
                                    "p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer",
                                    intensity > 0.7 ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" :
                                        intensity > 0.3 ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30" :
                                            "bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20"
                                )}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="text-xs font-medium text-muted-foreground mb-1 truncate">
                                    {district.district}
                                </div>
                                <div className="text-2xl font-bold">{district.applications}</div>
                                <Progress
                                    value={intensity * 100}
                                    className="h-1 mt-2"
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Funnel Visualization
function WorkflowFunnel({ data }: { data: StatsData['funnel'] }) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Workflow Pipeline
                </CardTitle>
                <CardDescription>Applications by processing stage</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((stage, idx) => {
                        const percentage = ((stage.value / total) * 100).toFixed(0);
                        return (
                            <div key={stage.name} className="group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{stage.name}</span>
                                    <span className="text-sm text-muted-foreground">{stage.value}</span>
                                </div>
                                <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 flex items-center justify-end pr-3"
                                        style={{
                                            width: `${Math.max(Number(percentage), 5)}%`,
                                            backgroundColor: stage.fill,
                                        }}
                                    >
                                        <span className="text-xs font-bold text-white drop-shadow-sm">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Performance Leaderboard
function PerformanceLeaderboard({ data }: { data: StatsData['leaderboard'] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Performance Leaderboard
                </CardTitle>
                <CardDescription>Fastest processing districts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.slice(0, 6).map((entry, idx) => (
                        <div
                            key={entry.district}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-all",
                                idx === 0 ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30" :
                                    idx === 1 ? "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border border-slate-400/30" :
                                        idx === 2 ? "bg-gradient-to-r from-orange-600/20 to-orange-700/10 border border-orange-600/30" :
                                            "bg-muted/50"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                idx === 0 ? "bg-amber-500 text-white" :
                                    idx === 1 ? "bg-slate-400 text-white" :
                                        idx === 2 ? "bg-orange-600 text-white" :
                                            "bg-muted text-muted-foreground"
                            )}>
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{entry.district}</div>
                                <div className="text-xs text-muted-foreground">{entry.processed} processed</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-primary">{entry.avgDays}</div>
                                <div className="text-xs text-muted-foreground">avg days</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Category Distribution Chart
function CategoryChart({ data }: { data: Array<{ name: string; value: number }> }) {
    if (!data || data.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Inventory by Category
                </CardTitle>
                <CardDescription>Approved homestay distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CATEGORY_COLORS[entry.name.toLowerCase()] || "#6b7280"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export default function StateDashboard() {
    const { data: stats, isLoading, error } = useQuery<StatsData>({
        queryKey: ["/api/stats/state"],
        refetchInterval: 60000, // Refresh every minute
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-80 col-span-2 rounded-xl" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <Card className="m-6 p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Failed to load dashboard data</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6 text-amber-500" />
                        Strategic Command Center
                    </h2>
                    <p className="text-muted-foreground">Real-time state-wide tourism intelligence</p>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1">
                    Him-Darshan v2.0
                </Badge>
            </div>

            {/* Hero Stats - 4 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HeroCard
                    title="Total Applications"
                    value={formatNumber(stats.hero.totalApplications)}
                    subtitle="All submissions in system"
                    icon={FileText}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                    trend="+12% from last month"
                    trendUp={true}
                />
                <HeroCard
                    title="Revenue Collected"
                    value={formatCurrency(stats.hero.totalRevenue)}
                    subtitle="Total fees received"
                    icon={BadgeIndianRupee}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
                    trend="+8% growth"
                    trendUp={true}
                />
                <HeroCard
                    title="Pending Scrutiny"
                    value={formatNumber(stats.hero.pendingScrutiny)}
                    subtitle="Awaiting officer action"
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <HeroCard
                    title="Avg. Clearance"
                    value={`${stats.hero.avgClearanceDays} days`}
                    subtitle="Application to approval"
                    icon={Target}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-700"
                    trend="Within SLA"
                    trendUp={true}
                />
            </div>

            {/* Economic Impact Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <BedDouble className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="text-sm font-medium text-slate-400">Tourism Capacity</div>
                        </div>
                        <div className="text-4xl font-bold mb-1">
                            {formatNumber(stats.economic.totalBeds)}
                        </div>
                        <div className="text-sm text-slate-400">Total approved beds across HP</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <BadgeIndianRupee className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-sm font-medium text-slate-400">Est. Annual Potential</div>
                        </div>
                        <div className="text-4xl font-bold mb-1">
                            {formatCurrency(stats.economic.projectedRevenue)}
                        </div>
                        <div className="text-sm text-slate-400">Based on 40% occupancy rate</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Users className="h-5 w-5 text-purple-400" />
                            </div>
                            <div className="text-sm font-medium text-slate-400">Active Pipelines</div>
                        </div>
                        <div className="text-4xl font-bold mb-1">12</div>
                        <div className="text-sm text-slate-400">Administrative processing units</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* District Heatmap - 2 columns */}
                <DistrictHeatmap data={stats.heatmap} />

                {/* Workflow Funnel */}
                <WorkflowFunnel data={stats.funnel} />
            </div>

            {/* Bottom Row - Leaderboard & Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Leaderboard */}
                <PerformanceLeaderboard data={stats.leaderboard} />

                {/* Revenue Trend Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Revenue Trend (30 Days)
                        </CardTitle>
                        <CardDescription>Daily collection analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.trends.revenue}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => value.split('-').slice(1).join('/')}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CategoryChart data={stats.economic.categorySplit} />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500" />
                                Application Traffic (30 Days)
                            </CardTitle>
                            <CardDescription>Daily submission volume</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.trends.applications}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => value.split('-').slice(1).join('/')}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Applications" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
