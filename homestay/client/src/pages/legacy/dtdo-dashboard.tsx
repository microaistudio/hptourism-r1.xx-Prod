import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CheckCircle, Loader2, RefreshCw, AlertCircle, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import type { HomestayApplication } from "@shared/schema";
import { isLegacyApplication } from "@shared/legacy";
import { ApplicationPipelineRow, type PipelineApplication } from "@/components/application/application-pipeline-row";

type ApplicationWithOwner = PipelineApplication;
type SortOrder = "newest" | "oldest";

interface StageConfig {
    key: string;
    title: string;
    description: string;
    icon: LucideIcon;
    totalCount?: number;
    pills: StagePillConfig[];
}

interface StagePillConfig {
    value: string;
    label: string;
    count: number;
    description: string;
    applications: ApplicationWithOwner[];
    actionLabel?: string;
    emptyTitle: string;
    emptyDescription: string;
}

const isInCurrentMonth = (value?: string | Date | null) => {
    if (!value) return false;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const getSortTimestamp = (app: HomestayApplication) => {
    const candidate = app.updatedAt ?? app.submittedAt ?? app.createdAt;
    return candidate ? new Date(candidate).getTime() : 0;
};

const sortApplications = (apps: ApplicationWithOwner[], order: SortOrder) =>
    [...apps].sort((a, b) => {
        const diff = getSortTimestamp(a) - getSortTimestamp(b);
        return order === "newest" ? -diff : diff;
    });

export default function DTDOLegacyDashboard() {
    const [activeStage, setActiveStage] = useState("incoming-queue");
    const [activePill, setActivePill] = useState("da-forwards");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
    const queryClient = useQueryClient();

    const handleRefresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/dtdo/applications"] });
    }, [queryClient]);

    const { data: applications, isLoading } = useQuery<ApplicationWithOwner[]>({
        queryKey: ["/api/dtdo/applications"],
    });

    const { data: user } = useQuery<{ user: { district?: string } }>({
        queryKey: ["/api/auth/me"],
    });

    const legacyApplications = useMemo(
        () => (applications ?? []).filter((app) => isLegacyApplication(app)),
        [applications],
    );

    const sortedLegacy = useMemo(() => sortApplications(legacyApplications, sortOrder), [legacyApplications, sortOrder]);

    // Stage 1: Incoming Queue (From DA)
    const incomingQueue = useMemo(
        () => sortedLegacy.filter((app) => app.status === "forwarded_to_dtdo"),
        [sortedLegacy],
    );

    // Stage 1.5: Corrections (Returned to DA)
    const returnedToDA = useMemo(
        () => sortedLegacy.filter((app) => app.status === "reverted_by_dtdo"),
        [sortedLegacy],
    );

    // Stage 2: Completed (Approved/Rejected)
    const approvedThisMonth = useMemo(
        () =>
            sortedLegacy.filter(
                (app) => app.status === "approved" && isInCurrentMonth(app.approvedAt ?? app.updatedAt ?? app.createdAt),
            ),
        [sortedLegacy],
    );

    const rejectedThisMonth = useMemo(
        () => sortedLegacy.filter((app) => app.status === "rejected" && isInCurrentMonth(app.updatedAt ?? app.createdAt)),
        [sortedLegacy],
    );

    const stageConfigs = useMemo(() => {
        const base: StageConfig[] = [
            {
                key: "incoming-queue",
                title: "Incoming Queue",
                description: "Applications escalated by Dealing Assistants for final decision.",
                icon: FileText,
                pills: [
                    {
                        value: "da-forwards",
                        label: "DA Forwards",
                        count: incomingQueue.length,
                        description: "Ready for your review and decision.",
                        applications: incomingQueue,
                        actionLabel: "Start review",
                        emptyTitle: "No incoming applications",
                        emptyDescription: "Dealing Assistants haven't forwarded any existing RC cases recently.",
                    },
                ],
            },
            {
                key: "corrections",
                title: "Returned / Corrections",
                description: "Applications sent back for correction.",
                icon: AlertCircle,
                pills: [
                    {
                        value: "returned-da",
                        label: "Returned to DA",
                        count: returnedToDA.length,
                        description: "Sent back to Dealing Assistant.",
                        applications: returnedToDA,
                        actionLabel: "View details",
                        emptyTitle: "No returned applications",
                        emptyDescription: "You haven't sent any applications back recently.",
                    },
                ],
            },
            {
                key: "completed",
                title: "Decisions (This Month)",
                description: "History of approved and rejected applications.",
                icon: CheckCircle,
                pills: [
                    {
                        value: "approved",
                        label: "Approved",
                        count: approvedThisMonth.length,
                        description: "Certificates issued or renewed.",
                        applications: approvedThisMonth,
                        actionLabel: "View details",
                        emptyTitle: "No approvals yet",
                        emptyDescription: "Approved applications this month will appear here.",
                    },
                    {
                        value: "rejected",
                        label: "Rejected",
                        count: rejectedThisMonth.length,
                        description: "Applications permanently rejected.",
                        applications: rejectedThisMonth,
                        actionLabel: "View details",
                        emptyTitle: "No rejections",
                        emptyDescription: "Rejected applications this month will appear here.",
                    },
                ],
            },
        ];

        return base;
    }, [
        incomingQueue,
        returnedToDA,
        approvedThisMonth,
        rejectedThisMonth,
    ]);

    useEffect(() => {
        if (!stageConfigs.length) return;
        const resolvedStage = stageConfigs.find((stage) => stage.key === activeStage) ?? stageConfigs[0];
        if (resolvedStage.key !== activeStage) {
            setActiveStage(resolvedStage.key);
            setActivePill(resolvedStage.pills[0]?.value ?? "");
            return;
        }
        const resolvedPill =
            resolvedStage.pills.find((pill) => pill.value === activePill) ?? resolvedStage.pills[0];
        if (resolvedPill.value !== activePill) {
            setActivePill(resolvedPill.value);
        }
    }, [stageConfigs, activeStage, activePill]);

    const activeStageConfig = stageConfigs.find((stage) => stage.key === activeStage) ?? stageConfigs[0];
    const activePillConfig =
        activeStageConfig?.pills.find((pill) => pill.value === activePill) ?? activeStageConfig?.pills[0];

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Existing RC Registration Desk</h1>
                    <p className="text-muted-foreground">
                        {user?.user?.district || "District"} – Final Decision Workflow
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="inline-flex items-center rounded-full border bg-muted/40 text-xs font-semibold">
                        <Link
                            href="/dtdo/dashboard"
                            className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors"
                        >
                            Go to New Applications
                        </Link>
                        <span className="px-3 py-1.5 rounded-full bg-background shadow-sm text-foreground">
                            Existing RC
                        </span>
                    </div>
                    <Button variant="outline" onClick={handleRefresh} className="w-full sm:w-fit">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stageConfigs.map((stage) => {
                    const Icon = stage.icon;
                    const totalCount = stage.totalCount ?? stage.pills.reduce((sum, pill) => sum + pill.count, 0);
                    const isActiveStage = stage.key === activeStageConfig?.key;
                    return (
                        <Card
                            key={stage.key}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                if (stage.key !== activeStage) {
                                    setActiveStage(stage.key);
                                    setActivePill(stage.pills[0]?.value ?? "");
                                }
                            }}
                            className={`p-5 flex flex-col gap-3 cursor-pointer transition-all border border-border rounded-2xl ${isActiveStage ? "ring-2 ring-primary" : ""}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stage.title}</p>
                                    <p className="text-3xl font-semibold mt-1">{totalCount}</p>
                                </div>
                                <div className="p-2 rounded-full bg-muted/40">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                        </Card>
                    );
                })}
            </div>

            {activeStageConfig && activePillConfig && (
                <>
                    <div className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-3xl">
                        {activeStageConfig.pills.map((pill) => {
                            const isActive = pill.value === activePillConfig.value;
                            return (
                                <button
                                    key={pill.value}
                                    className={`flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium ${isActive ? "bg-background shadow" : "text-muted-foreground"}`}
                                    onClick={() => setActivePill(pill.value)}
                                >
                                    <span>{pill.label}</span>
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{pill.count}</span>
                                </button>
                            );
                        })}
                    </div>
                    <Card>
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>{activePillConfig.label}</CardTitle>
                                <CardDescription>{activePillConfig.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Sort</span>
                                <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Sort order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest first</SelectItem>
                                        <SelectItem value="oldest">Oldest first</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {activePillConfig.applications.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="font-medium">{activePillConfig.emptyTitle}</p>
                                    <p className="text-sm mt-1">{activePillConfig.emptyDescription}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {activePillConfig.applications.map((application) => (
                                        <ApplicationPipelineRow
                                            key={application.id}
                                            application={application}
                                            actionLabel={activePillConfig.actionLabel ?? "Open application"}
                                            applicationIds={activePillConfig.applications.map((a) => a.id)}
                                            baseUrl="/dtdo/applications"
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
