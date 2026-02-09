import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintAffidavit() {
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
                        <div className="p-8 print:p-6 font-serif text-slate-900 text-[12.5px] leading-relaxed flex-grow flex flex-col justify-between">

                            <div>
                                {/* Header Section */}
                                <div className="text-center mb-5">
                                    {/* State Emblem */}
                                    <div className="flex justify-center mb-2">
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
                                        <span className="border-b-2 border-slate-800 pb-1">FORMAT OF AFFIDAVIT</span>
                                    </h1>
                                    <p className="text-sm font-semibold text-slate-700">Under Section 29</p>
                                    <p className="text-[11px] text-slate-600">Himachal Pradesh Tourism Development & Registration Act, 2002</p>
                                </div>

                                {/* Main Content */}
                                <div className="leading-relaxed text-justify">

                                    {/* Deponent Details */}
                                    <div className="mb-4 bg-slate-50 p-3 border border-slate-200 rounded text-[12.5px]">
                                        <p className="leading-7">
                                            I, <span className="inline-block border-b border-slate-400 min-w-[150px] mx-1 bg-white px-2">&nbsp;</span>,
                                            <span className="font-medium text-slate-700 mx-1">S/o / D/o / W/o</span>
                                            <span className="inline-block border-b border-slate-400 min-w-[150px] mx-1 bg-white px-2">&nbsp;</span>,
                                            Age <span className="inline-block border-b border-slate-400 w-10 mx-1 bg-white text-center">&nbsp;</span> years,
                                            R/o <span className="inline-block border-b border-slate-400 min-w-[260px] mx-1 bg-white px-2">&nbsp;</span>
                                        </p>
                                    </div>

                                    <p className="mb-3 font-medium text-[13px]">do hereby solemnly affirm and declare as under:</p>

                                    {/* Declaration Points */}
                                    <ol className="list-none space-y-3 mb-5 text-[12.5px]">
                                        <li className="flex gap-3">
                                            <span className="font-bold text-slate-700 shrink-0">1.</span>
                                            <span>That I have not been convicted of any offence under Chapters XIV and XVI of the Indian Penal Code, 1860, or under any of the provisions of this Act, or of any offence punishable under any law providing for the prevention of hoarding, smuggling, or profiteering, or adulteration of food or drugs, or corruption.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold text-slate-700 shrink-0">2.</span>
                                            <span>That I have not been declared an insolvent by a court of competent jurisdiction.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold text-slate-700 shrink-0">3.</span>
                                            <span>That my name has not been removed from the register on the grounds mentioned in Section 29 of the <strong>Himachal Pradesh Tourism Development and Registration Act, 2002</strong>.</span>
                                        </li>
                                    </ol>

                                    {/* First Signature */}
                                    <div className="flex justify-end mb-4">
                                        <div className="text-center w-44">
                                            <div className="border-b-2 border-slate-800 mb-1 h-8"></div>
                                            <p className="font-bold text-[11px]">DEPONENT</p>
                                        </div>
                                    </div>

                                    {/* Verification Section */}
                                    <div className="border-t border-slate-300 pt-4 mt-3">
                                        <h2 className="font-bold text-sm mb-2">
                                            <span className="border-b border-slate-600 pb-1">VERIFICATION</span>
                                        </h2>
                                        <p className="mb-2 leading-relaxed text-[12.5px]">
                                            Verified that the contents of the above affidavit of mine are true and correct to the best of my knowledge and belief. Nothing has been concealed therein.
                                        </p>
                                        <p className="leading-relaxed text-[12.5px]">
                                            Signed and verified at <span className="inline-block border-b border-slate-400 w-28 mx-1">&nbsp;</span>
                                            on dated <span className="inline-block border-b border-slate-400 w-28 mx-1">&nbsp;</span>.
                                        </p>
                                    </div>

                                    {/* Final Signature */}
                                    <div className="flex justify-end mt-6">
                                        <div className="text-center w-44">
                                            <div className="border-b-2 border-slate-800 mb-1 h-8"></div>
                                            <p className="font-bold text-[11px]">DEPONENT</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Notes (Pushed to bottom via flex-col justify-between) */}
                            <div className="mt-5 pt-3 border-t border-dashed border-slate-300">
                                <p className="text-[11px] text-slate-500 font-semibold mb-1">IMPORTANT NOTES:</p>
                                <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-5">
                                    <li>This affidavit should be executed on non-judicial stamp paper of appropriate value as applicable in Himachal Pradesh.</li>
                                    <li>The affidavit should be attested by a Notary Public or First Class Magistrate.</li>
                                    <li>Reference: Section 29 of HP Tourism Development & Registration Act, 2002</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
