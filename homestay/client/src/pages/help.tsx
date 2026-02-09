import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Help & Resources</h1>
                    <p className="text-muted-foreground mt-2">
                        Guides and tutorials to help you manage your homestay application.
                    </p>
                </div>
            </div>

            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="h-6 w-6 text-primary" />
                        Portal Walkthrough
                    </CardTitle>
                    <CardDescription>
                        A step-by-step interactive guide on how to register and manage your property.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-sm bg-gray-100">
                        <iframe
                            src="https://app.supademo.com/embed/cml3z5eu42mzmzsadcv81sk5y?embed_v=2"
                            loading="lazy"
                            title="Portal Walkthrough"
                            allow="clipboard-write"
                            className="absolute top-0 left-0 w-full h-full border-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <a
                                href="https://app.supademo.com/demo/cml3z5eu42mzmzsadcv81sk5y?utm_source=link&step=94"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in Full Screen
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Placeholder for future FAQs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Registration Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Learn about the documents required and steps to register a new homestay.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg"> Fees & Charges</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Understand the fee structure for silver, gold, and diamond categories.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Renewals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            How to renew your certificate after 1 or 3 years validity.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
