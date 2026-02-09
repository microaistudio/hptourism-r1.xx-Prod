import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Shield, Calendar, Server, CheckCircle } from "lucide-react";
import { APP_VERSION } from "@/config/version";

interface AboutDialogProps {
    userRole?: "owner" | "officer" | "admin" | "superadmin";
    trigger?: React.ReactNode;
}

export function AboutDialog({ userRole = "owner", trigger }: AboutDialogProps) {
    const [open, setOpen] = useState(false);
    const isAdmin = userRole === "admin" || userRole === "superadmin";
    const isOfficer = userRole === "officer" || isAdmin;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Info className="h-4 w-4" />
                        About
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
                        HP Tourism Portal
                    </DialogTitle>
                    <DialogDescription>
                        Homestay & B&B Registration Portal
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Version Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Version</span>
                        <Badge variant="secondary" className="font-mono">
                            v{APP_VERSION}
                        </Badge>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                        © 2025 Himachal Pradesh Tourism Development Corporation
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AboutDialog;
