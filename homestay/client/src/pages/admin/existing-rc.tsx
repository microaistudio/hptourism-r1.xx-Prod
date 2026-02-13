import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { formatDbTimestamp } from "@/lib/dateUtils";

interface ExistingRCApp {
    id: number;
    applicationNumber: string;
    applicantName: string | null;
    district: string | null;
    category: string | null;
    status: string | null;
    submittedAt: string | null;
    createdAt: string | null;
    ownerName: string | null;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    legacy_rc_review: { label: "Under Review", className: "border-blue-300 text-blue-700 bg-blue-50" },
    under_scrutiny: { label: "Scrutiny", className: "border-amber-300 text-amber-700 bg-amber-50" },
    submitted: { label: "Submitted", className: "border-slate-300 text-slate-600 bg-slate-50" },
    forwarded_to_dtdo: { label: "Forwarded to DTDO", className: "border-indigo-300 text-indigo-700 bg-indigo-50" },
    dtdo_review: { label: "DTDO Review", className: "border-purple-300 text-purple-700 bg-purple-50" },
    approved: { label: "Approved", className: "border-emerald-300 text-emerald-700 bg-emerald-50" },
    rejected: { label: "Rejected", className: "border-red-300 text-red-700 bg-red-50" },
    superseded: { label: "Superseded", className: "border-gray-300 text-gray-600 bg-gray-50" },
};

export default function ExistingRCDashboard() {
    const { data, isLoading, error } = useQuery<{ applications: ExistingRCApp[] }>({
        queryKey: ["/api/admin/reports/existing-rc"],
    });

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error loading data: </strong>
                    <span className="block sm:inline">{(error as Error).message}</span>
                </div>
            </div>
        );
    }

    const legacyApps = data?.applications || [];

    // Summary counts
    const total = legacyApps.length;
    const pendingReview = legacyApps.filter((a) =>
        ["legacy_rc_review", "under_scrutiny", "submitted"].includes(a.status ?? "")
    ).length;
    const approved = legacyApps.filter((a) => a.status === "approved").length;
    const forwarded = legacyApps.filter((a) =>
        ["forwarded_to_dtdo", "dtdo_review"].includes(a.status ?? "")
    ).length;

    return (
        <div className="container mx-auto w-full p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Separate Pipeline</p>
                <h1 className="text-2xl font-bold">Existing RC Registrations</h1>
                <p className="text-muted-foreground text-sm">
                    Legacy Registration Certificates being onboarded into the digital system. These follow a separate pipeline from new online applications.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            Total Onboarded
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {isLoading ? <Skeleton className="h-8 w-12" /> : total}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            Pending Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {isLoading ? <Skeleton className="h-8 w-12" /> : pendingReview}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            With DTDO
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {isLoading ? <Skeleton className="h-8 w-12" /> : forwarded}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {isLoading ? <Skeleton className="h-8 w-12" /> : approved}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">All Existing RC Applications</CardTitle>
                    <CardDescription>
                        Onboarded registrations identified by LG-HS-* prefix — separate from the main payment pipeline
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : legacyApps.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No Existing RC applications found</p>
                            <p className="text-sm">Legacy onboarding has not started, or all RCs have been processed.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Application #</TableHead>
                                        <TableHead>District</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {legacyApps.map((app) => {
                                        const statusMeta = STATUS_LABELS[app.status ?? ""] || {
                                            label: app.status || "Unknown",
                                            className: "border-gray-300 text-gray-600 bg-gray-50",
                                        };
                                        return (
                                            <TableRow key={app.id}>
                                                <TableCell className="font-mono text-xs">{app.applicationNumber}</TableCell>
                                                <TableCell className="font-medium text-sm">{app.district || "—"}</TableCell>
                                                <TableCell className="text-sm">{app.ownerName || app.applicantName || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize text-xs">
                                                        {app.category || "—"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusMeta.className}>
                                                        {statusMeta.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs whitespace-nowrap">
                                                    {app.submittedAt ? formatDbTimestamp(app.submittedAt) : app.createdAt ? formatDbTimestamp(app.createdAt) : "—"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
