import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area, Cell
} from "recharts";
import {
    IndianRupee, TrendingUp, HeartHandshake,
    CalendarClock, Layers, Info, XCircle, Wallet, CheckCircle2,
    Users, ArrowUpRight, BarChart3
} from "lucide-react";

type TreasuryData = {
    renewals: Array<{ month: string; projectedRevenue: number; propertiesCount: number }>;
    pipeline: { expectedRevenue: number; applicationsCount: number; avgFeePerApplication: number };
    collected: { totalCollected: number; transactionCount: number };
    approved: { count: number; totalFees: number };
    subsidies: { femaleOwner: number; pangi: number; validity: number; total: number; beneficiaryCount: number };
    historical: Array<{ month: string; actualRevenue: number; transactionCount: number }>;
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
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
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

    // Safe defaults for all nested objects to prevent crashes
    // Handle both missing objects AND objects with undefined values inside
    const safeStats = {
        renewals: stats.renewals || [],
        pipeline: {
            expectedRevenue: stats.pipeline?.expectedRevenue ?? 0,
            applicationsCount: stats.pipeline?.applicationsCount ?? 0,
            avgFeePerApplication: stats.pipeline?.avgFeePerApplication ?? 0,
        },
        collected: {
            totalCollected: stats.collected?.totalCollected ?? 0,
            transactionCount: stats.collected?.transactionCount ?? 0,
        },
        approved: {
            count: stats.approved?.count ?? 0,
            totalFees: stats.approved?.totalFees ?? 0,
        },
        subsidies: {
            femaleOwner: stats.subsidies?.femaleOwner ?? 0,
            pangi: stats.subsidies?.pangi ?? 0,
            validity: stats.subsidies?.validity ?? 0,
            total: stats.subsidies?.total ?? 0,
            beneficiaryCount: stats.subsidies?.beneficiaryCount ?? 0,
        },
        historical: stats.historical || [],
    };

    // Format dates for charts
    const renewalsChart = safeStats.renewals.map(r => {
        const [year, month] = r.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
            ...r,
            label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
    });

    const historicalChart = safeStats.historical.map(r => {
        const [year, month] = r.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
            ...r,
            label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
    });

    // Collection efficiency: collected / (collected + pipeline expected)
    const totalExpectedRevenue = safeStats.pipeline.expectedRevenue + safeStats.approved.totalFees;
    const collectionRate = totalExpectedRevenue > 0
        ? Math.round((safeStats.collected.totalCollected / totalExpectedRevenue) * 100)
        : 0;

    // Renewal projection total
    const renewalTotal = safeStats.renewals.reduce((sum, r) => sum + r.projectedRevenue, 0);
    const renewalPropertyCount = safeStats.renewals.reduce((sum, r) => sum + r.propertiesCount, 0);

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-7xl pt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Treasury Forecast</h1>
                    <p className="text-muted-foreground mt-1">Revenue projections, pipeline value, and collection tracking</p>
                </div>
                <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" /> Financial Planning
                </Badge>
            </div>

            {/* ── Hero Cards Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Pipeline Revenue (Active Applications) */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Layers className="w-20 h-20 text-blue-600" />
                    </div>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1.5 uppercase tracking-wider">
                            <Layers className="h-3.5 w-3.5" /> Pipeline Revenue
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">
                            {formatCurrency(safeStats.pipeline.expectedRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Expected from {formatNumber(safeStats.pipeline.applicationsCount)} active applications
                            (avg ₹{formatNumber(safeStats.pipeline.avgFeePerApplication)}/app)
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Revenue Collected (Himkosh Payments) */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-20 h-20 text-emerald-600" />
                    </div>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1.5 uppercase tracking-wider">
                            <Wallet className="h-3.5 w-3.5" /> Revenue Collected
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">
                            {formatCurrency(safeStats.collected.totalCollected)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {formatNumber(safeStats.collected.transactionCount)} verified Himkosh transactions
                            {collectionRate > 0 && (
                                <span className="ml-1 text-emerald-600 font-medium">
                                    ({collectionRate}% collected)
                                </span>
                            )}
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Renewal Forecast */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CalendarClock className="w-20 h-20 text-amber-600" />
                    </div>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1.5 uppercase tracking-wider">
                            <CalendarClock className="h-3.5 w-3.5" /> 12M Renewal Forecast
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">
                            {formatCurrency(renewalTotal)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {renewalPropertyCount > 0
                                ? `${formatNumber(renewalPropertyCount)} certificates expiring — full fee renewal`
                                : "No certificates expiring in next 12 months"
                            }
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Subsidies Provided */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <HeartHandshake className="w-20 h-20 text-violet-600" />
                    </div>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 mb-1.5 uppercase tracking-wider">
                            <HeartHandshake className="h-3.5 w-3.5" /> Subsidies Given
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">
                            {formatCurrency(safeStats.subsidies.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {safeStats.subsidies.beneficiaryCount > 0
                                ? `${formatNumber(safeStats.subsidies.beneficiaryCount)} beneficiaries — Female (${formatCurrency(safeStats.subsidies.femaleOwner)}), Pangi (${formatCurrency(safeStats.subsidies.pangi)})`
                                : "No subsidies applied yet"
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Summary Insight Bar ── */}
            <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-slate-50 to-white">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm"><strong>{formatNumber(safeStats.approved.count)}</strong> RCs Issued</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">Avg Fee: <strong>₹{formatNumber(safeStats.pipeline.avgFeePerApplication)}</strong></span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <IndianRupee className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">Total Assessed: <strong>{formatCurrency(totalExpectedRevenue)}</strong></span>
                            </div>
                        </div>
                        {safeStats.subsidies.validity > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Multi-year validity discounts: {formatCurrency(safeStats.subsidies.validity)}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Renewals Forecast Chart */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-amber-500" />
                            Upcoming Renewals Forecast
                        </CardTitle>
                        <CardDescription>Expected revenue from certificate renewals (Next 12 Months)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {safeStats.renewals.length > 0 ? (
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
                                            tickFormatter={(val) => formatCurrency(val)}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={70}
                                        />
                                        <RechartsTooltip
                                            formatter={(value: number, name: string) => [
                                                formatCurrency(value),
                                                "Projected Revenue"
                                            ]}
                                            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="projectedRevenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                                <Info className="h-8 w-8 mb-2 opacity-50" />
                                <p className="font-medium">No renewals due in the next 12 months</p>
                                <p className="text-xs mt-1">Certificates have not reached expiry period yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Historical Revenue Chart */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Revenue Collections (Himkosh)
                        </CardTitle>
                        <CardDescription>Verified transaction amounts collected (Last 12 Months)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {safeStats.historical.length > 0 ? (
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
                                            tickFormatter={(val) => formatCurrency(val)}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={70}
                                        />
                                        <RechartsTooltip
                                            formatter={(value: number, name: string) => {
                                                if (name === "transactionCount") return [value, "Transactions"];
                                                return [formatCurrency(value), "Revenue"];
                                            }}
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
                                <p className="font-medium">No Himkosh transactions in the last 12 months</p>
                                <p className="text-xs mt-1">Historical data will appear as payments are processed</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
