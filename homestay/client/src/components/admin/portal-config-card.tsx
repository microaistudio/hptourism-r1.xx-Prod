import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, ClipboardCheck, Loader2, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PortalSettings {
    visibility: Record<string, boolean>;
    inspection: {
        optionalKinds: string[];
    };
}

const SERVICE_LABELS: Record<string, string> = {
    homestay: "Homestays",
    hotels: "Hotels",
    guest_houses: "Guest Houses",
    travel_agencies: "Travel Agencies",
    adventure_tourism: "Adventure Tourism",
    transport: "Transport Operators",
    restaurants: "Restaurants & Cafes",
    winter_sports: "Skiing & Winter Sports",
};

const APPLICATION_KINDS = [
    { id: "new_registration", label: "New Registration", defaultOptional: false },
    { id: "existing_rc_onboarding", label: "Existing RC Onboarding", defaultOptional: false },
    { id: "add_rooms", label: "Add Additional Rooms", defaultOptional: false },
    { id: "delete_rooms", label: "Delete Rooms", defaultOptional: true },
    { id: "change_category", label: "Change Category", defaultOptional: false },
    { id: "cancel_certificate", label: "Surrender Certificate", defaultOptional: true },
];

export function PortalConfigCard() {
    const { toast } = useToast();
    const [thresholdInput, setThresholdInput] = useState<string>("");

    const { data: settings, isLoading } = useQuery<PortalSettings>({
        queryKey: ["/api/admin/settings/portal/services"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/settings/portal/services");
            return res.json();
        }
    });

    const { data: daSetting, isLoading: daLoading } = useQuery({
        queryKey: ["/api/admin/settings/da_send_back_enabled"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/settings/da_send_back_enabled");
            const data = await res.json();
            const val = data?.settingValue;
            if (val && typeof val === 'object' && 'enabled' in val) return val.enabled;
            return val === true || val === "true";
        }
    });

    const { data: incompleteAppsSetting, isLoading: incompleteAppsLoading } = useQuery({
        queryKey: ["/api/admin/settings/show_incomplete_applications"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/settings/show_incomplete_applications");
            const data = await res.json();
            const val = data?.settingValue;
            if (val && typeof val === 'object' && 'enabled' in val) return val.enabled;
            return val === true || val === "true";
        }
    });

    const toggleServiceMutation = useMutation({
        mutationFn: async ({ serviceId, enabled }: { serviceId: string; enabled: boolean }) => {
            const res = await apiRequest("POST", "/api/admin/settings/portal/services/toggle", {
                serviceId,
                enabled
            });
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["/api/admin/settings/portal/services"], (old: PortalSettings | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    visibility: { ...old.visibility, [variables.serviceId]: variables.enabled }
                };
            });
            toast({ title: "Service visibility updated" });
        },
        onError: () => toast({ title: "Failed to update setting", variant: "destructive" })
    });

    const toggleInspectionMutation = useMutation({
        mutationFn: async ({ applicationKind, optional }: { applicationKind: string; optional: boolean }) => {
            const res = await apiRequest("POST", "/api/admin/settings/inspection/toggle", {
                applicationKind,
                optional
            });
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/portal/services"] });
            toast({ title: "Inspection workflow updated" });
        },
        onError: () => toast({ title: "Failed to update setting", variant: "destructive" })
    });

    const toggleDaRevertMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            // Using the generic settings endpoint
            const res = await apiRequest("PUT", "/api/admin/settings/da_send_back_enabled", {
                value: { enabled }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/da_send_back_enabled"] });
            toast({ title: "DA workflow updated" });
        },
        onError: () => toast({ title: "Failed to update setting", variant: "destructive" })
    });

    const toggleIncompleteAppsMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            const res = await apiRequest("PUT", "/api/admin/settings/show_incomplete_applications", {
                value: { enabled }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/show_incomplete_applications"] });
            toast({ title: "Incomplete Applications visibility updated" });
        },
        onError: () => toast({ title: "Failed to update setting", variant: "destructive" })
    });

    // Form time threshold setting
    const { data: formThresholdSetting, isLoading: thresholdLoading } = useQuery({
        queryKey: ["/api/admin/settings/form_time_threshold_minutes"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/admin/settings/form_time_threshold_minutes");
            const data = await res.json();
            const raw = data?.settingValue;
            let minutes = 25; // default
            if (typeof raw === 'number' && raw > 0) minutes = raw;
            else if (typeof raw === 'object' && raw !== null && 'minutes' in (raw as any)) {
                const m = (raw as any).minutes;
                if (typeof m === 'number' && m > 0) minutes = m;
            }
            else if (typeof raw === 'string') {
                const parsed = parseInt(raw, 10);
                if (!isNaN(parsed) && parsed > 0) minutes = parsed;
            }
            // Initialize the input field
            if (!thresholdInput) setThresholdInput(String(minutes));
            return minutes;
        }
    });

    const updateThresholdMutation = useMutation({
        mutationFn: async (minutes: number) => {
            const res = await apiRequest("PUT", "/api/admin/settings/form_time_threshold_minutes", {
                value: minutes
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/form_time_threshold_minutes"] });
            queryClient.invalidateQueries({ queryKey: ["/api/settings/public-threshold"] });
            toast({ title: "Form time threshold updated" });
        },
        onError: () => toast({ title: "Failed to update threshold", variant: "destructive" })
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Portal Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center p-6"><Loader2 className="animate-spin" /></div>
                </CardContent>
            </Card>
        );
    }

    const visibility = settings?.visibility || {};
    const optionalKinds = new Set(settings?.inspection.optionalKinds || []);

    return (
        <Card id="portal-config">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" />
                    Portal Configuration
                </CardTitle>
                <CardDescription>
                    Manage service visibility and workflow requirements
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Service Visibility Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Service Visibility
                        <Badge variant="outline">Portal</Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-card/50">
                                <Label htmlFor={`service-${key}`} className="flex flex-col space-y-1">
                                    <span className="font-medium">{label}</span>
                                    <span className="text-xs text-muted-foreground font-normal">
                                        {key === 'homestay' ? 'Core service (Required)' : 'Additional service'}
                                    </span>
                                </Label>
                                <Switch
                                    id={`service-${key}`}
                                    checked={key === 'homestay' ? true : !!visibility[key]}
                                    disabled={key === 'homestay' || toggleServiceMutation.isPending}
                                    onCheckedChange={(checked) => toggleServiceMutation.mutate({ serviceId: key, enabled: checked })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inspection Configuration Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        Inspection Requirements
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Workflows marked as "Optional" allow DTDOs to approve applications without scheduling a physical inspection.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {APPLICATION_KINDS.map((kind) => {
                            const isOptional = optionalKinds.has(kind.id);
                            return (
                                <div key={kind.id} className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-card/50">
                                    <Label htmlFor={`inspection-${kind.id}`} className="flex flex-col space-y-1">
                                        <span className="font-medium">{kind.label}</span>
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs ${isOptional ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                                            {isOptional ? 'Optional' : 'Mandatory'}
                                        </span>
                                        <Switch
                                            id={`inspection-${kind.id}`}
                                            checked={isOptional}
                                            disabled={toggleInspectionMutation.isPending}
                                            onCheckedChange={(checked) => toggleInspectionMutation.mutate({ applicationKind: kind.id, optional: checked })}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Workflow Controls Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Workflow Controls
                    </h3>
                    <div className="border p-4 rounded-lg bg-card/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="da-revert" className="text-base font-medium">
                                    Allow DA to Send Back Applications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    If enabled, dealing assistants can return applications for corrections.
                                    <br />
                                    <span className="text-amber-600 font-medium text-xs">
                                        ⚠️ Requires DTDO Authorization (OTP) for every action.
                                    </span>
                                </p>
                            </div>
                            <Switch
                                id="da-revert"
                                checked={!!daSetting}
                                disabled={daLoading || toggleDaRevertMutation.isPending}
                                onCheckedChange={(checked) => toggleDaRevertMutation.mutate(checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="incomplete-apps" className="text-base font-medium">
                                    Show Incomplete Applications Button
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    If enabled, DA/DTDO dashboards show an "Incomplete Applications" button
                                    that lists draft (unsubmitted) applications in the district.
                                    <br />
                                    <span className="text-amber-600 font-medium text-xs">
                                        ⚠️ Can cause confusion — disable to keep dashboards focused on submitted work only.
                                    </span>
                                </p>
                            </div>
                            <Switch
                                id="incomplete-apps"
                                checked={!!incompleteAppsSetting}
                                disabled={incompleteAppsLoading || toggleIncompleteAppsMutation.isPending}
                                onCheckedChange={(checked) => toggleIncompleteAppsMutation.mutate(checked)}
                            />
                        </div>

                        {/* Form Time Threshold */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="form-threshold" className="text-base font-medium flex items-center gap-2">
                                    <Timer className="h-4 w-4 text-blue-500" />
                                    Form Completion Time Threshold
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Default outlier cap (in minutes) for average form time metrics.
                                    Forms taking longer than this are excluded from averages.
                                    <br />
                                    <span className="text-blue-600 font-medium text-xs">
                                        Current: {formThresholdSetting ?? 25} min — Affects Operations &amp; District Performance tabs.
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="form-threshold"
                                    type="number"
                                    min={1}
                                    max={1440}
                                    className="w-20 h-9"
                                    value={thresholdInput}
                                    onChange={(e) => setThresholdInput(e.target.value)}
                                />
                                <span className="text-sm text-muted-foreground">min</span>
                                <Button
                                    size="sm"
                                    variant={thresholdInput !== String(formThresholdSetting ?? 25) ? "default" : "outline"}
                                    disabled={
                                        thresholdInput === String(formThresholdSetting ?? 25) ||
                                        !thresholdInput ||
                                        parseInt(thresholdInput) < 1 ||
                                        updateThresholdMutation.isPending
                                    }
                                    onClick={() => updateThresholdMutation.mutate(parseInt(thresholdInput))}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
