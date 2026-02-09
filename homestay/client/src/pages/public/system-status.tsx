import { NavigationHeader } from "@/components/navigation-header";
import { CheckCircle2, AlertCircle, RefreshCw, Server, CreditCard, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemStatus() {
    const services = [
        { name: "Registration Portal", status: "operational", icon: Server, description: "Homestay & B&B Registration Services" },
        { name: "HimKosh Payment Gateway", status: "operational", icon: CreditCard, description: "Online fee payment processing" },
        { name: "SMS Notification Service", status: "operational", icon: MessageSquare, description: "OTP and status alerts" },
        { name: "Helpline Support (1077)", status: "operational", icon: Phone, description: "24/7 Citizen Support" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <NavigationHeader title="HP Tourism Portal" subtitle="System Status" showHome showBack />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">System Operational Status</h1>
                    <p className="text-slate-600">Real-time status of portal services and dependencies.</p>
                </div>

                <div className="grid gap-6">
                    {/* Overall Status */}
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-900">All Systems Operational</h3>
                                <p className="text-green-700 text-sm">Last updated: Just now</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {services.map((service) => (
                            <Card key={service.name} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <service.icon className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <CardTitle className="text-base font-semibold text-slate-800">
                                            {service.name}
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Operational
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">{service.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Maintenance Notice (Static) */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800">
                        <RefreshCw className="w-5 h-5 flex-shrink-0" />
                        <p>
                            <strong>Scheduled Maintenance:</strong> No maintenance is currently scheduled for the next 7 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
