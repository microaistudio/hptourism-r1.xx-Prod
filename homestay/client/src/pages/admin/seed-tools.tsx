import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Users, UserPlus, Shield, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

type SeedResult = {
    username: string;
    status: "created" | "exists" | "error";
    message?: string;
};

type SeedResponse = {
    success: boolean;
    created: number;
    exists: number;
    errors: number;
    results: SeedResult[];
    defaultPassword: string;
};

export default function SeedToolsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [lastResults, setLastResults] = useState<{ type: string; data: SeedResponse } | null>(null);

    type SeedStatus = {
        da?: { total: number; seeded: number; accounts: { username: string; district: string }[] };
        dtdo?: { total: number; seeded: number; accounts: { username: string; district: string }[] };
        systemAccounts?: { username: string; role: string }[];
    };

    const { data: seedStatus, isLoading } = useQuery<SeedStatus>({
        queryKey: ["/api/admin/seed/status"],
    });

    const seedDaMutation = useMutation({
        mutationFn: async (): Promise<SeedResponse> => {
            const res = await apiRequest("POST", "/api/admin/seed/da-accounts");
            return res.json();
        },
        onSuccess: (data: SeedResponse) => {
            setLastResults({ type: "DA", data });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/seed/status"] });
            toast({
                title: "DA Accounts Seeded",
                description: `Created: ${data.created}, Existing: ${data.exists}, Errors: ${data.errors}`,
            });
        },
        onError: () => {
            toast({ title: "Failed to seed DA accounts", variant: "destructive" });
        },
    });

    const seedDtdoMutation = useMutation({
        mutationFn: async (): Promise<SeedResponse> => {
            const res = await apiRequest("POST", "/api/admin/seed/dtdo-accounts");
            return res.json();
        },
        onSuccess: (data: SeedResponse) => {
            setLastResults({ type: "DTDO", data });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/seed/status"] });
            toast({
                title: "DTDO Accounts Seeded",
                description: `Created: ${data.created}, Existing: ${data.exists}, Errors: ${data.errors}`,
            });
        },
        onError: () => {
            toast({ title: "Failed to seed DTDO accounts", variant: "destructive" });
        },
    });

    const seedSystemMutation = useMutation({
        mutationFn: async (): Promise<SeedResponse> => {
            const res = await apiRequest("POST", "/api/admin/seed/system-accounts");
            return res.json();
        },
        onSuccess: (data: SeedResponse) => {
            setLastResults({ type: "System", data });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/seed/status"] });
            toast({
                title: "System Accounts Seeded",
                description: `Created: ${data.created}, Existing: ${data.exists}, Errors: ${data.errors}`,
            });
        },
        onError: () => {
            toast({ title: "Failed to seed system accounts", variant: "destructive" });
        },
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="container mx-auto max-w-4xl space-y-8">
                <div>
                    <Link href="/admin/console">
                        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Console
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Seed Tools</h1>
                            <p className="text-muted-foreground mt-1">
                                Deploy staff accounts and system configuration
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Seed Status</CardTitle>
                        <CardDescription>Overview of seeded accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading status...
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {seedStatus?.da?.seeded ?? 0}/{seedStatus?.da?.total ?? 12}
                                    </div>
                                    <div className="text-sm text-muted-foreground">DA Accounts</div>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {seedStatus?.dtdo?.seeded ?? 0}/{seedStatus?.dtdo?.total ?? 12}
                                    </div>
                                    <div className="text-sm text-muted-foreground">DTDO Accounts</div>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {seedStatus?.systemAccounts?.length ?? 0}/3
                                    </div>
                                    <div className="text-sm text-muted-foreground">System Accounts</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Seed Actions */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Seed DA */}
                    <Card className="border-blue-200 dark:border-blue-900">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">Dealing Assistants</CardTitle>
                            </div>
                            <CardDescription>
                                Creates 12 DA accounts (one per district)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => seedDaMutation.mutate()}
                                disabled={seedDaMutation.isPending}
                                className="w-full"
                                variant="outline"
                            >
                                {seedDaMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" /> Seed DA Accounts
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Seed DTDO */}
                    <Card className="border-green-200 dark:border-green-900">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <CardTitle className="text-lg">District Tourism Officers</CardTitle>
                            </div>
                            <CardDescription>
                                Creates 12 DTDO accounts (one per district)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => seedDtdoMutation.mutate()}
                                disabled={seedDtdoMutation.isPending}
                                className="w-full"
                                variant="outline"
                            >
                                {seedDtdoMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" /> Seed DTDO Accounts
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Seed System Accounts */}
                    <Card className="border-purple-200 dark:border-purple-900">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                <CardTitle className="text-lg">System Accounts</CardTitle>
                            </div>
                            <CardDescription>
                                Creates superadmin, sysadmin, supervisor_hq
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => seedSystemMutation.mutate()}
                                disabled={seedSystemMutation.isPending}
                                className="w-full"
                                variant="outline"
                            >
                                {seedSystemMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" /> Seed System Accounts
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Last Results */}
                {lastResults && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Last Seed Results: {lastResults.type}</CardTitle>
                            <CardDescription>
                                Default password for created accounts: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">{lastResults.data.defaultPassword}</code>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {lastResults.data.results.map((result) => (
                                    <div
                                        key={result.username}
                                        className="flex items-center justify-between p-2 rounded border"
                                    >
                                        <span className="font-mono text-sm">{result.username}</span>
                                        {result.status === "created" && (
                                            <Badge className="bg-green-100 text-green-700">
                                                <Check className="mr-1 h-3 w-3" /> Created
                                            </Badge>
                                        )}
                                        {result.status === "exists" && (
                                            <Badge variant="secondary">
                                                <AlertCircle className="mr-1 h-3 w-3" /> Already Exists
                                            </Badge>
                                        )}
                                        {result.status === "error" && (
                                            <Badge variant="destructive">
                                                <X className="mr-1 h-3 w-3" /> Error
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
