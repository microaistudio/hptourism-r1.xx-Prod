import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  MapPin,
  Globe,
  Repeat,
} from "lucide-react";
import { formatDateTimeIST, formatDateLongIST } from "@/lib/dateUtils";

const WORKFLOW_STATUS_CONFIG = [
  { key: "submitted", label: "New Applications", color: "#3b82f6" },
  { key: "under_scrutiny", label: "Under Scrutiny", color: "#f97316" },
  { key: "forwarded_to_dtdo", label: "Forwarded to DTDO", color: "#0ea5e9" },
  { key: "dtdo_review", label: "DTDO Review", color: "#6366f1" },
  { key: "inspection_scheduled", label: "Inspection Scheduled", color: "#8b5cf6" },
  { key: "inspection_under_review", label: "Inspection Review", color: "#a855f7" },
  { key: "reverted_to_applicant", label: "Sent Back", color: "#facc15" },
  { key: "approved", label: "Approved", color: "#10b981" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "draft", label: "Draft", color: "#94a3b8" },
] as const;

type WorkflowStatusKey = typeof WORKFLOW_STATUS_CONFIG[number]["key"];

interface AnalyticsData {
  overview: {
    total: number;
    newApplications: number;
    byStatus: Record<string, number>;
    byCategory: {
      diamond: number;
      gold: number;
      silver: number;
    };
    avgProcessingTime: number;
    avgFormTimeSeconds?: number;
    totalOwners: number;
  };
  districts: Record<string, number>;
  recentApplications: any[];
}

interface ProductionStats {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  scrapedAt: Date;
  realtime?: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  legacy?: {
    total: any;
    approved: any;
    rejected: any;
    pending: any;
  };
}

const STATUS_COLORS = {
  pending: "#f59e0b",
  district_review: "#3b82f6",
  state_review: "#8b5cf6",
  approved: "#10b981",
  rejected: "#ef4444",
};

const CATEGORY_COLORS = {
  diamond: "hsl(var(--primary))",
  gold: "hsl(var(--secondary))",
  silver: "#94a3b8",
};

const PRODUCTION_STATS_FALLBACK: ProductionStats = {
  totalApplications: 19705,
  approvedApplications: 16301,
  rejectedApplications: 1142,
  pendingApplications: 2262,
  scrapedAt: new Date(),
};

import { useLocation } from "wouter";

interface ExtendedProductionStats extends ProductionStats {
  baseline?: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

export default function AnalyticsPage() {
  const [, setLocation] = useLocation();
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard"],
    retry: false,
  });

  const { data: productionStatsData } = useQuery<{ stats: ExtendedProductionStats | null }>({
    queryKey: ["/api/analytics/production-stats"],
  });

  const liveProductionStats = productionStatsData?.stats || PRODUCTION_STATS_FALLBACK;

  if (isLoading) {
    return (
      <div className="bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-muted rounded w-64 animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded w-96 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background flex items-center justify-center px-4 py-16">
        <Card className="max-w-lg w-full shadow-lg border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Unable to load analytics
            </CardTitle>
            <CardDescription>
              {error instanceof Error
                ? error.message.replace(/^\d+:\s*/, "")
                : "Please refresh the page or log in again."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
            <Button variant="default" onClick={() => (window.location.href = "/dashboard")}>
              Go to dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { overview, districts, recentApplications } = data;

  const rawStatusCounts = overview.byStatus || {};
  const getStatusValue = (key: WorkflowStatusKey, fallbacks: string[] = []) => {
    const direct = rawStatusCounts[key];
    if (typeof direct === "number") {
      return direct;
    }
    for (const alt of fallbacks) {
      const fallbackValue = rawStatusCounts[alt];
      if (typeof fallbackValue === "number") {
        return fallbackValue;
      }
    }
    return 0;
  };

  const normalizedStatusCounts: Record<WorkflowStatusKey, number> = {
    submitted: getStatusValue("submitted", ["pending"]),
    under_scrutiny: getStatusValue("under_scrutiny", ["district_review"]),
    forwarded_to_dtdo: getStatusValue("forwarded_to_dtdo"),
    dtdo_review: getStatusValue("dtdo_review", ["state_review"]),
    inspection_scheduled: getStatusValue("inspection_scheduled"),
    inspection_under_review: getStatusValue("inspection_under_review"),
    reverted_to_applicant: getStatusValue("reverted_to_applicant"),
    approved: getStatusValue("approved", ["approved"]),
    rejected: getStatusValue("rejected", ["rejected"]),
    draft: getStatusValue("draft", ["draft"]),
  };

  const submittedCount = normalizedStatusCounts.submitted;
  const scrutinyCount = normalizedStatusCounts.under_scrutiny;
  const forwardedCount = normalizedStatusCounts.forwarded_to_dtdo;
  const dtdoReviewCount = normalizedStatusCounts.dtdo_review;
  const inspectionQueueCount =
    normalizedStatusCounts.inspection_scheduled + normalizedStatusCounts.inspection_under_review;
  const approvedCount = normalizedStatusCounts.approved;
  const rejectedCount = normalizedStatusCounts.rejected;

  // Prepare data for charts
  const statusData = WORKFLOW_STATUS_CONFIG.map(({ key, label, color }) => ({
    key,
    name: label,
    value: normalizedStatusCounts[key],
    color,
  }));
  const activeStatusData = statusData.filter((item) => item.value > 0);

  const categoryData = [
    { name: "Diamond", value: overview.byCategory.diamond, color: CATEGORY_COLORS.diamond },
    { name: "Gold", value: overview.byCategory.gold, color: CATEGORY_COLORS.gold },
    { name: "Silver", value: overview.byCategory.silver, color: CATEGORY_COLORS.silver },
  ];

  const districtData = Object.entries(districts)
    .filter(([name]) => name && name !== '0' && name !== 'null' && name !== 'undefined' && name.trim() !== '')
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const getStatusBadge = (status: string | null | undefined) => {
    const key = normalizeWorkflowStatus(status);
    const highlightStatuses: Record<WorkflowStatusKey, "default" | "secondary" | "destructive" | "outline"> = {
      submitted: "secondary",
      under_scrutiny: "default",
      forwarded_to_dtdo: "default",
      dtdo_review: "default",
      inspection_scheduled: "default",
      inspection_under_review: "default",
      reverted_to_applicant: "outline",
      approved: "default",
      rejected: "destructive",
      draft: "outline",
    };
    return highlightStatuses[key] || "secondary";
  };

  const formatStatusLabel = (status: string | null | undefined) => {
    const key = normalizeWorkflowStatus(status);
    const match = WORKFLOW_STATUS_CONFIG.find((item) => item.key === key);
    if (match) return match.label;
    return (status ?? "Unknown").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const normalizeWorkflowStatus = (status: string | null | undefined): WorkflowStatusKey => {
    const normalized = (status ?? "").trim().toLowerCase();
    const aliasMap: Record<string, WorkflowStatusKey> = {
      pending: "submitted",
      district_review: "under_scrutiny",
      state_review: "dtdo_review",
    };

    if (aliasMap[normalized]) {
      return aliasMap[normalized];
    }

    const keys = new Set(WORKFLOW_STATUS_CONFIG.map((item) => item.key));
    return keys.has(normalized as WorkflowStatusKey) ? (normalized as WorkflowStatusKey) : "draft";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Tourism Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time insights and production data analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-white border-slate-200 py-1.5 px-3">
              <Globe className="w-3 h-3 mr-1.5 text-blue-500" />
              Live Production Data
            </Badge>
          </div>
        </div>

        {/* Production Portal Statistics (Live) - Hero Grid */}
        {liveProductionStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Stats */}
            <Card className="relative overflow-hidden border-blue-200 bg-blue-50/50">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Globe className="w-24 h-24 text-blue-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {liveProductionStats.totalApplications.toLocaleString('en-IN')}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(liveProductionStats.legacy?.total || '0') > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] px-1.5">
                      {parseInt(liveProductionStats.legacy?.total || '0').toLocaleString('en-IN')} Legacy
                    </Badge>
                  )}
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] px-1.5">
                    {liveProductionStats.realtime?.total || 0} New
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Approved Stats */}
            <Card className="relative overflow-hidden border-emerald-200 bg-emerald-50/50">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <CheckCircle className="w-24 h-24 text-emerald-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-700 mb-1">
                  {liveProductionStats.approvedApplications.toLocaleString('en-IN')}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(liveProductionStats.legacy?.approved || '0') > 0 && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] px-1.5">
                      {parseInt(liveProductionStats.legacy?.approved || '0').toLocaleString('en-IN')} Legacy
                    </Badge>
                  )}
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-[10px] px-1.5">
                    {liveProductionStats.realtime?.approved || 0} New
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pending Stats */}
            <Card className="relative overflow-hidden border-amber-200 bg-amber-50/50">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Clock className="w-24 h-24 text-amber-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-700">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {liveProductionStats.pendingApplications.toLocaleString('en-IN')}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(liveProductionStats.legacy?.pending || '0') > 0 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5">
                      {parseInt(liveProductionStats.legacy?.pending || '0').toLocaleString('en-IN')} Legacy
                    </Badge>
                  )}
                  <Badge className="bg-amber-600 hover:bg-amber-700 text-[10px] px-1.5">
                    {liveProductionStats.realtime?.pending || 0} New
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rejected Stats */}
            <Card className="relative overflow-hidden border-rose-200 bg-rose-50/50">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <AlertCircle className="w-24 h-24 text-rose-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-rose-700">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-700 mb-1">
                  {liveProductionStats.rejectedApplications.toLocaleString('en-IN')}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(liveProductionStats.legacy?.rejected || '0') > 0 && (
                    <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-rose-200 text-[10px] px-1.5">
                      {parseInt(liveProductionStats.legacy?.rejected || '0').toLocaleString('en-IN')} Legacy
                    </Badge>
                  )}
                  <Badge className="bg-rose-600 hover:bg-rose-700 text-[10px] px-1.5">
                    {liveProductionStats.realtime?.rejected || 0} New
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Workflow Snapshot */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 rounded-full bg-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Processing Pipeline</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=submitted&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{submittedCount}</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">New Applications</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=under_scrutiny&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{scrutinyCount}</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Under Scrutiny</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=forwarded_to_dtdo&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{forwardedCount}</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Forwarded to DTDO</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=site_inspection_scheduled&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{dtdoReviewCount + inspectionQueueCount}</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Inspection / Review</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Operational Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4 mt-8">
            <div className="h-6 w-1 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-semibold text-slate-800">Operational Performance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=rc_issued&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{approvedCount}</div>
                  <p className="text-xs text-emerald-600 font-medium tracking-wide">
                    {overview.total > 0
                      ? `${Math.round((approvedCount / overview.total) * 100)}% APPROVAL RATE`
                      : "NO DATA"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{overview.avgProcessingTime} days</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {overview.avgProcessingTime <= 15 ? "Within SLA (15 Days)" : "Exceeds SLA"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(() => {
                      const s = overview.avgFormTimeSeconds || 0;
                      if (!s) return "N/A";
                      const h = Math.floor(s / 3600);
                      const m = Math.floor((s % 3600) / 60);
                      const sec = s % 60;
                      if (h > 0) return `${h}h ${m}m`;
                      return `${m}m ${sec}s`;
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Avg Form Fill Time</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 group"
              onClick={() => setLocation("/workflow-monitoring?status=rc_issued&tab=pipeline")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{overview.totalOwners}</div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Registered Owners</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                Application Status Distribution
              </CardTitle>
              <CardDescription>Current workflow stage breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {activeStatusData.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12">
                  No applications in the workflow yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activeStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : null
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activeStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                Category Distribution
              </CardTitle>
              <CardDescription>Diamond, Gold, Silver breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* District Coverage */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <MapPin className="w-4 h-4" />
              </div>
              Top Districts by Applications
            </CardTitle>
            <CardDescription>Geographic distribution across Himachal Pradesh</CardDescription>
          </CardHeader>
          <CardContent>
            {districtData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No district data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => [`${value} applications`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest 10 submissions to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No applications yet</p>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4"
                    data-testid={`recent-app-${app.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{app.propertyName}</span>
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-white">
                          {app.id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {app.district}
                        <span className="text-slate-300">|</span>
                        <Users className="w-3 h-3" />
                        {app.ownerName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {app.submittedAt && (
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-medium text-slate-700">Submitted</div>
                          <div className="text-[10px] text-muted-foreground">{formatDateLongIST(app.submittedAt)}</div>
                        </div>
                      )}
                      <Badge variant={getStatusBadge(app.status)} className="h-7 px-3">
                        {formatStatusLabel(app.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
