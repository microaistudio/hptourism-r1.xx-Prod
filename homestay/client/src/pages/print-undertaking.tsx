import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintUndertaking() {
    return (
        <div className="min-h-screen bg-slate-100 p-4 print:p-0 print:bg-white">
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            {/* Print Button - Hidden when printing */}
            <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center print:hidden">
                <div className="text-sm text-slate-500">
                    Preview - Print or Save as PDF for official use
                </div>
                <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700">
                    <Printer className="w-4 h-4 mr-2" />
                    Print / Save PDF
                </Button>
            </div>

            {/* A4 Page Container */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none print:w-full print:max-w-none print:mx-0">

                {/* Decorative Border Container - Fixed height for print to push footer down */}
                <div className="border-[3px] border-slate-800 m-2 print:m-0 print:border-2 print:min-h-[275mm] flex flex-col">
                    <div className="border border-slate-400 m-1 flex-grow flex flex-col">

                        {/* Document Content - Flex container to space out footer */}
                        <div className="p-7 print:p-6 font-serif text-slate-900 text-[12.5px] leading-relaxed flex-grow flex flex-col justify-between">

                            <div>
                                {/* Header Section */}
                                <div className="text-center mb-4">
                                    {/* State Emblem */}
                                    <div className="flex justify-center mb-1.5">
                                        <div className="w-12 h-12 border-2 border-slate-300 rounded-full flex items-center justify-center bg-slate-50">
                                            <span className="text-lg">🏛️</span>
                                        </div>
                                    </div>

                                    {/* Department Name */}
                                    <p className="text-sm font-bold text-slate-700 tracking-wide uppercase mb-1">
                                        Government of Himachal Pradesh
                                    </p>
                                    <p className="text-xs text-slate-500 tracking-wider uppercase mb-2">
                                        Department of Tourism & Civil Aviation
                                    </p>

                                    {/* Divider */}
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <div className="w-14 h-px bg-slate-400"></div>
                                        <div className="w-2 h-2 rotate-45 border border-slate-400"></div>
                                        <div className="w-14 h-px bg-slate-400"></div>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-lg font-bold tracking-wide mb-1">
                                        <span className="border-b-2 border-slate-800 pb-1">FORM-C</span>
                                    </h1>
                                    <p className="text-[11px] text-slate-600 mb-0.5">[See ANNEXURE-I (13) and ANNEXURE-II (4)]</p>
                                    <p className="text-sm font-semibold text-slate-700">FORMAT FOR UNDERTAKING</p>
                                </div>

                                {/* Main Content */}
                                <div className="leading-relaxed text-justify">

                                    {/* Addressed To Section */}
                                    <div className="mb-3 text-[12.5px]">
                                        <p className="font-medium mb-1">To,</p>
                                        <div className="pl-5 leading-snug">
                                            <p>The Prescribed Authority,</p>
                                            <p>Office of the District Tourism Development Authority,</p>
                                            <p>District <span className="inline-block border-b border-slate-400 min-w-[100px] mx-1">&nbsp;</span>, Himachal Pradesh.</p>
                                        </div>
                                    </div>

                                    {/* Undertaking Title - Redundant but kept condensed */}
                                    <div className="text-center mb-3">
                                        <h2 className="text-base font-bold">
                                            <span className="border-b border-slate-800 pb-0.5">UNDERTAKING</span>
                                        </h2>
                                    </div>

                                    {/* Deponent Details */}
                                    <div className="mb-3 bg-slate-50 p-2.5 border border-slate-200 rounded text-[12.5px]">
                                        <p className="leading-7">
                                            I, <span className="inline-block border-b border-slate-400 min-w-[150px] mx-1 bg-white px-2">&nbsp;</span>,
                                            <span className="font-medium text-slate-700 mx-1">S/o / D/o / W/o</span>
                                            <span className="inline-block border-b border-slate-400 min-w-[150px] mx-1 bg-white px-2">&nbsp;</span>,
                                            Age <span className="inline-block border-b border-slate-400 w-10 mx-1 bg-white text-center">&nbsp;</span> years,
                                            R/o <span className="inline-block border-b border-slate-400 min-w-[280px] mx-1 bg-white px-2">&nbsp;</span>.
                                        </p>
                                    </div>

                                    {/* Undertaking Text */}
                                    <div className="space-y-3 mb-5 text-[12.5px] leading-relaxed">
                                        <p>
                                            I have read and understood all the terms and conditions mentioned in the
                                            <strong> Himachal Pradesh Home Stay Rules, 2025</strong> with respect to the
                                            approval and registration of the Home Stay Unit/Establishment and hereby
                                            agree to abide by them.
                                        </p>

                                        <p>
                                            The information and documents provided are correct and authentic to the
                                            best of my knowledge.
                                        </p>

                                        <p>
                                            I further declare that if there is any false statement or suppression of
                                            any material fact with the intention to mislead the prescribed authority
                                            at my end, I shall be liable for penal action as warranted by the
                                            <strong> Himachal Pradesh Tourism Development and Registration Act, 2002</strong>
                                            and the rules made thereunder.
                                        </p>
                                    </div>

                                    {/* Signature Section */}
                                    <div className="flex justify-end mt-6 mb-5">
                                        <div className="text-center w-56">
                                            <div className="border-b-2 border-slate-800 mb-2 h-10"></div>
                                            <p className="font-bold text-[11px] leading-tight">
                                                (Signature and Name of the Owner<br />in Block Letters)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Place and Date */}
                                    <div className="mt-4 grid grid-cols-2 gap-6 text-[12.5px]">
                                        <p>
                                            <span className="font-medium">Place:</span> <span className="inline-block border-b border-slate-400 w-36 ml-2">&nbsp;</span>
                                        </p>
                                        <p>
                                            <span className="font-medium">Date:</span> <span className="inline-block border-b border-slate-400 w-36 ml-2">&nbsp;</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Notes (Pushed to bottom via flex-col justify-between) */}
                            <div className="mt-4 pt-3 border-t border-dashed border-slate-300">
                                <p className="text-[11px] text-slate-500 font-semibold mb-1">IMPORTANT NOTES:</p>
                                <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-5">
                                    <li>This undertaking must be signed by the applicant/owner.</li>
                                    <li>Submit along with the Home Stay registration application (Form-A).</li>
                                    <li>Reference: HP Home Stay Rules, 2025 - ANNEXURE-I & ANNEXURE-II</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
