
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Standard list of districts to ensure all are represented
const HP_DISTRICTS = [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu",
    "Lahaul-Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
];

interface BaselineStat {
    id: string;
    district: string;
    totalCount: number;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    description?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export default function BaselineStatsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [editingStat, setEditingStat] = useState<Partial<BaselineStat> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: stats, isLoading } = useQuery<BaselineStat[]>({
        queryKey: ["/api/admin/baseline-stats"],
    });

    const mutation = useMutation({
        mutationFn: async (data: Partial<BaselineStat>) => {
            const res = await apiRequest("POST", "/api/admin/baseline-stats", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/baseline-stats"] });
            toast({
                title: "Success",
                description: "Baseline stats updated successfully.",
            });
            setIsDialogOpen(false);
            setEditingStat(null);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update stats. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleEdit = (district: string, existingData?: BaselineStat) => {
        setEditingStat(existingData || {
            district,
            totalCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            pendingCount: 0
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!editingStat?.district) return;

        // Validate counts sum
        const total = editingStat.totalCount || 0;
        const approved = editingStat.approvedCount || 0;
        const rejected = editingStat.rejectedCount || 0;
        const pending = editingStat.pendingCount || 0;

        // Optional: Warn if sum doesn't match total, or just auto-update total? 
        // For now, allow flexibility but maybe show a warning in console.

        mutation.mutate({
            district: editingStat.district,
            totalCount: approved + rejected + pending,
            approvedCount: approved,
            rejectedCount: rejected,
            pendingCount: pending,
            description: editingStat.description || "Manual Processing (June 2025 - Jan 2026)"
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Merge DB stats with static district list to show all rows
    const mergedData = HP_DISTRICTS.map(district => {
        const found = stats?.find(s => s.district.toLowerCase() === district.toLowerCase());
        return found || {
            id: `virtual-${district}`,
            district,
            totalCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            pendingCount: 0
        };
    });

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Production Baseline Configuration</h1>
                    <p className="text-muted-foreground mt-2">
                        Configure "Pre-Portal" application counts for the transition period (June 2025 - Jan 2026).
                        These numbers are added to the live system totals.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>District-wise Baseline Stats</CardTitle>
                    <CardDescription>
                        Enter the manual processing counts for each district.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>District</TableHead>
                                <TableHead>Total Applications</TableHead>
                                <TableHead>Approved</TableHead>
                                <TableHead>Rejected</TableHead>
                                <TableHead>Pending</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mergedData.map((row) => (
                                <TableRow key={row.district}>
                                    <TableCell className="font-medium">{row.district}</TableCell>
                                    <TableCell>
                                        {row.totalCount > 0 ? (
                                            <Badge variant="outline" className="text-base">
                                                {row.totalCount}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">0</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-green-600">{row.approvedCount > 0 ? row.approvedCount : '-'}</TableCell>
                                    <TableCell className="text-red-600">{row.rejectedCount > 0 ? row.rejectedCount : '-'}</TableCell>
                                    <TableCell className="text-orange-600">{row.pendingCount > 0 ? row.pendingCount : '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(row.district, row.id.startsWith('virtual') ? undefined : row)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            {row.id.startsWith('virtual') ? "Set" : "Edit"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Stats: {editingStat?.district}</DialogTitle>
                        <DialogDescription>
                            Update baseline counts for the transition period.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="approved" className="text-right text-green-600">
                                Approved
                            </Label>
                            <Input
                                id="approved"
                                type="number"
                                value={editingStat?.approvedCount || 0}
                                onChange={(e) => setEditingStat(prev => ({ ...prev, approvedCount: parseInt(e.target.value) || 0 }))}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rejected" className="text-right text-red-600">
                                Rejected
                            </Label>
                            <Input
                                id="rejected"
                                type="number"
                                value={editingStat?.rejectedCount || 0}
                                onChange={(e) => setEditingStat(prev => ({ ...prev, rejectedCount: parseInt(e.target.value) || 0 }))}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pending" className="text-right text-orange-600">
                                Pending
                            </Label>
                            <Input
                                id="pending"
                                type="number"
                                value={editingStat?.pendingCount || 0}
                                onChange={(e) => setEditingStat(prev => ({ ...prev, pendingCount: parseInt(e.target.value) || 0 }))}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4 pt-4 border-t">
                            <Label className="text-right font-bold">
                                Total
                            </Label>
                            <div className="col-span-3 font-bold text-lg pl-3">
                                {(editingStat?.approvedCount || 0) + (editingStat?.rejectedCount || 0) + (editingStat?.pendingCount || 0)}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={mutation.isPending}>
                            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
