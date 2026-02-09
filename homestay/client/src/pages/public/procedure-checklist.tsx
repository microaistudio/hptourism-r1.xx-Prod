import { useState } from "react";
import { useLocation } from "wouter";
import { NavigationHeader } from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText, CheckCircle2, Clock, IndianRupee,
    Download, HelpCircle, ArrowRight, ShieldCheck, MapPin
} from "lucide-react";
import heroBg from "@/assets/scenic_places/Marhi_view_from_on_the_way_to_Rohtang-.jpg";

export default function ProcedureChecklistPage() {
    const [, setLocation] = useLocation();
    const [checkedItems, setCheckedItems] = useState({
        revenuePapers: false,
        idProof: false,
        affidavit: false,
        undertaking: false
    });

    const allChecked = Object.values(checkedItems).every(Boolean);

    const handleCheckboxChange = (key: keyof typeof checkedItems) => {
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNextAction = () => {
        if (allChecked) {
            setLocation("/register");
        } else {
            document.querySelector('[value="process"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <NavigationHeader title="HP Tourism Portal" subtitle="Registration Guide" showHome showBack />

            {/* Hero Section with Image */}
            <div
                className="relative py-32 px-4 text-center"
                style={{
                    // UPDATED: Much lighter overlay (20-30%) so image pops
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.35)), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                        Start Your Homestay Business
                    </h1>
                    <p className="text-slate-100 max-w-2xl mx-auto text-lg font-semibold drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        A complete guide to registering your property under the H.P. Tourism Development & Registration Act, 2002.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20 relative z-20">

                {/* Quick Stats Grid - Practical Info at a Glance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="shadow-lg border-slate-200">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Processing Time</p>
                                <h3 className="text-lg font-bold text-slate-900">30-60 Days</h3>
                                <p className="text-xs text-slate-400">After document submission</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-slate-200">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Registration Fee</p>
                                <h3 className="text-lg font-bold text-slate-900">₹ 3,000 - ₹ 18,000</h3>
                                <p className="text-xs text-slate-400">Depending on category & location</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-slate-200">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Validity</p>
                                <h3 className="text-lg font-bold text-slate-900">1 or 3 Years</h3>
                                <p className="text-xs text-slate-400">With renewal discounts</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="checklist" className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-200 p-1 rounded-full">
                            <TabsTrigger value="checklist" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">✅ Requirement Checklist</TabsTrigger>
                            <TabsTrigger value="process" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">🚀 Step-by-Step Process</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: PREPARATION & CHECKLIST */}
                    <TabsContent value="checklist" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left: Interactive Checklist */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">1. Gather Documents</h2>
                                    <p className="text-slate-600">Ensure you have digital copies (PDF/JPG) of the following before starting.</p>
                                </div>

                                <div className={`p-6 rounded-xl border transition-all duration-300 shadow-sm space-y-4 ${checkedItems.revenuePapers && checkedItems.idProof ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <MapPin className={`w-4 h-4 ${checkedItems.revenuePapers && checkedItems.idProof ? 'text-green-600' : 'text-slate-500'}`} /> Property Proof
                                    </h3>
                                    <div className="space-y-3 pl-6">
                                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems.revenuePapers}
                                                onChange={() => handleCheckboxChange('revenuePapers')}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-sm text-slate-700 group-hover:text-slate-900">
                                                <span className="font-medium">Revenue Papers</span> (Tatima/Jamabandi)
                                                <p className="text-xs text-slate-500 mt-1">Must be issued within last 6 months.</p>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems.idProof}
                                                onChange={() => handleCheckboxChange('idProof')}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-sm text-slate-700 group-hover:text-slate-900">
                                                <span className="font-medium">Owner ID Proof</span>
                                                <p className="text-xs text-slate-500 mt-1">Aadhaar / Voter ID / Driving License</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl border transition-all duration-300 shadow-sm space-y-4 ${checkedItems.affidavit && checkedItems.undertaking ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <FileText className={`w-4 h-4 ${checkedItems.affidavit && checkedItems.undertaking ? 'text-green-600' : 'text-slate-500'}`} /> Mandatory Legal Docs
                                    </h3>
                                    <div className="space-y-3 pl-6">
                                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems.affidavit}
                                                onChange={() => handleCheckboxChange('affidavit')}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-sm text-slate-700 group-hover:text-slate-900">
                                                <span className="font-medium">Notarized Affidavit</span>
                                                <p className="text-xs text-slate-500 mt-1">On non-judicial stamp paper (₹10 or above).</p>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems.undertaking}
                                                onChange={() => handleCheckboxChange('undertaking')}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-sm text-slate-700 group-hover:text-slate-900">
                                                <span className="font-medium">Form-C Undertaking</span>
                                                <p className="text-xs text-slate-500 mt-1">Self-declared and signed by owner.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Downloads & Templates */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">2. Templates Required</h2>
                                    <p className="text-slate-600">Download, print, and sign these formats.</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-6">
                                    {/* Download Card 1 */}
                                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Affidavit Format</h4>
                                                <p className="text-xs text-slate-500">PDF • Printable</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50" asChild>
                                            <a href="/print/affidavit" target="_blank">
                                                <Download className="w-4 h-4" /> Download
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Download Card 2 */}
                                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Undertaking (Form-C)</h4>
                                                <p className="text-xs text-slate-500">PDF • Printable</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50" asChild>
                                            <a href="/print/undertaking" target="_blank">
                                                <Download className="w-4 h-4" /> Download
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="text-xs text-blue-600 flex items-start gap-2 bg-blue-100/50 p-3 rounded">
                                        <HelpCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>Tip: You can use e-Stamping for the affidavit if physical stamp papers are unavailable in your tehsil.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-slate-500 mb-4">
                                {allChecked ? "You have all the documents ready!" : "Check off items above to verify your readiness"}
                            </p>
                            <Button
                                onClick={handleNextAction}
                                className={`gap-2 px-8 h-12 text-base transition-all duration-300 ${allChecked ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20' : 'bg-slate-900 hover:bg-slate-800'}`}
                            >
                                {allChecked ? (
                                    <>Proceed to Registration <ArrowRight className="w-5 h-5" /></>
                                ) : (
                                    <>Next: View Process <ArrowRight className="w-4 h-4" /></>
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* TAB 2: PROCESS & FEES */}
                    <TabsContent value="process" className="space-y-8">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Registration Steps</h3>

                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                                {/* Step 1 */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                                    <h4 className="text-lg font-bold text-slate-900">1. Online Application</h4>
                                    <p className="text-slate-600 mt-1 text-sm max-w-xl">
                                        Create an account and fill Form-A. You will need to upload the documents gathered in the previous step.
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                                    <h4 className="text-lg font-bold text-slate-900">2. Fee Payment (HimKosh)</h4>
                                    <p className="text-slate-600 mt-1 text-sm max-w-xl mb-4">
                                        Pay the registration fee online based on your unit count.
                                    </p>
                                    {/* Fee Matrix - 2025 Policy */}
                                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                        <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5 text-green-600" /> Registration Fees (Annual)
                                        </h5>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                                    <tr>
                                                        <th className="p-3 text-left">Category</th>
                                                        <th className="p-3 text-right">Gram Panchayat</th>
                                                        <th className="p-3 text-right">TCP / NP / SDA</th>
                                                        <th className="p-3 text-right">Municipal Corp</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    <tr className="hover:bg-slate-100/50">
                                                        <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Silver
                                                        </td>
                                                        <td className="p-3 text-right">₹ 3,000</td>
                                                        <td className="p-3 text-right">₹ 5,000</td>
                                                        <td className="p-3 text-right">₹ 8,000</td>
                                                    </tr>
                                                    <tr className="hover:bg-yellow-50/50">
                                                        <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Gold
                                                        </td>
                                                        <td className="p-3 text-right">₹ 6,000</td>
                                                        <td className="p-3 text-right">₹ 8,000</td>
                                                        <td className="p-3 text-right">₹ 12,000</td>
                                                    </tr>
                                                    <tr className="hover:bg-cyan-50/50">
                                                        <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Diamond
                                                        </td>
                                                        <td className="p-3 text-right">₹ 10,000</td>
                                                        <td className="p-3 text-right">₹ 12,000</td>
                                                        <td className="p-3 text-right">₹ 18,000</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-4 grid md:grid-cols-2 gap-4 text-xs text-slate-600">
                                            <div className="flex items-start gap-2 bg-white p-3 rounded border border-slate-100">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                                <span><strong>10% Discount</strong> if you pay for 3 years upfront.</span>
                                            </div>
                                            <div className="flex items-start gap-2 bg-white p-3 rounded border border-slate-100">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                                <span><strong>5% Discount</strong> for women entrepreneurs (sole owner).</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                                    <h4 className="text-lg font-bold text-slate-900">3. Inspection & Approval</h4>
                                    <p className="text-slate-600 mt-1 text-sm max-w-xl">
                                        District Tourism Development Officer (DTDO) will verify your documents. An inspection may be scheduled. Once approved, you can download your certificate instantly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <Button variant="outline" size="lg">Review Requirements</Button>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 px-8 py-6 h-auto text-lg gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Start Registration Now
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
