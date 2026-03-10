import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area
} from "recharts";
import {
    IndianRupee, TrendingUp, AlertCircle, HeartHandshake,
    CalendarClock, Layers, Info, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type TreasuryData = {
    renewals: Array<{ month: string; projectedRevenue: number; propertiesCount: number }>;
    pipeline: { stuckRevenue: number; applicationsCount: number };
    subsidies: { femaleOwner: number; pangi: number; validity: number; total: number };
    historical: Array<{ month: string; actualRevenue: number }>;
};

const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value);

export default function TreasuryForecast() {
    const { data: stats, isLoading, error } = useQuery<TreasuryData>({
        queryKey: ["/api/stats/treasury-forecast"],
        refetchInterval: 300000,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-[400px] rounded-xl" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="p-8 text-center">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Failed to load forecast data</p>
                </Card>
            </div>
        );
    }

    // Format dates for charts
    const renewalsChart = stats.renewals.map(r => {
        const [year, month] = r.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
            ...r,
            label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
    });

    const historicalChart = stats.historical.map(r => {
        const [year, month] = r.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
            ...r,
            label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
    });

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-7xl pt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Treasury Forecast</h1>
                    <p className="text-muted-foreground mt-1">Department revenue projections, renewal forecasting, and pipeline value</p>
                </div>
                <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" /> Financial Planning
                </Badge>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Expected Renewals (Next 12m) */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CalendarClock className="w-24 h-24 text-blue-600" />
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                            <CalendarClock className="h-4 w-4" /> Next 12m Renewals
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">
                            {formatCurrency(stats.renewals.reduce((sum, r) => sum + r.projectedRevenue, 0))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Base fee projection across {stats.renewals.reduce((sum, r) => sum + r.propertiesCount, 0)} expiring properties in the next 12 months.
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Pipeline Revenue */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Layers className="w-24 h-24 text-amber-600" />
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 mb-2 uppercase tracking-wider">
                            <Layers className="h-4 w-4" /> Pipeline Revenue
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">
                            {formatCurrency(stats.pipeline.stuckRevenue)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Potential revenue from {formatNumber(stats.pipeline.applicationsCount)} applications currently undergoing scrutiny and inspection.
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Subsidies */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <HeartHandshake className="w-24 h-24 text-emerald-600" />
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
                            <HeartHandshake className="h-4 w-4" /> Total Subsidies Provided
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">
                            {formatCurrency(stats.subsidies.total)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Includes female owner ({formatCurrency(stats.subsidies.femaleOwner)}), Pangi ({formatCurrency(stats.subsidies.pangi)}), and multi-year validity discounts.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Renewals Forecast Chart */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-indigo-500" />
                            Upcoming Renewals Forecast
                        </CardTitle>
                        <CardDescription>Expected department revenue from certificate renewals (Next 12 Months)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.renewals.length > 0 ? (
                            <div className="h-[300px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={renewalsChart} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="label"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={(val) => `₹${val / 1000}k`}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={60}
                                        />
                                        <RechartsTooltip
                                            formatter={(value: number) => [formatCurrency(value), "Projected Revenue"]}
                                            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="projectedRevenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                                <Info className="h-8 w-8 mb-2 opacity-50" />
                                <p>No renewals forecasted in the next 12 months</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Historical Actuals Chart */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Historical Revenue Collections
                        </CardTitle>
                        <CardDescription>Actual verified transaction amounts collected via Himkosh (Last 6 Months)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.historical.length > 0 ? (
                            <div className="h-[300px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historicalChart} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="label"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={(val) => `₹${val / 1000}k`}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={60}
                                        />
                                        <RechartsTooltip
                                            formatter={(value: number) => [formatCurrency(value), "Actual Revenue"]}
                                            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="actualRevenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                                <Info className="h-8 w-8 mb-2 opacity-50" />
                                <p>Not enough historical data available yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
