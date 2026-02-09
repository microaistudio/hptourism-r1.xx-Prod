
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BedDouble, BadgeIndianRupee, TrendingUp, Hotel } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

type EconomicData = {
    totalBeds: number;
    projectedRevenue: number;
    categorySplit: Array<{ name: string; value: number }>;
};

// Formatter for Indian Currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

// Formatter for Numbers
const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function EconomicImpactCards({ data }: { data: EconomicData }) {
    if (!data) return null;

    // Calculate generic stats for category
    const totalProperties = data.categorySplit.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Capacity Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-blue-600" />
                        Tourism Capacity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-700">
                        {formatNumber(data.totalBeds)}
                        <span className="text-base font-normal text-muted-foreground ml-1">Beds</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total approved accommodation capacity across the state.
                    </p>
                </CardContent>
            </Card>

            {/* Economic Value Card */}
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BadgeIndianRupee className="h-4 w-4 text-emerald-600" />
                        Est. Annual Revenue Potential
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-emerald-700">
                        {formatCurrency(data.projectedRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Projected based on 40% occupancy at avg. room rates.
                    </p>
                </CardContent>
            </Card>

            {/* Category Distribution Chart */}
            <Card className="lg:row-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Hotel className="h-4 w-4" />
                        Inventory Quality
                    </CardTitle>
                    <CardDescription>Distribution by Homestay Category</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.categorySplit}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.categorySplit.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip formatter={(value: number) => [value, 'Properties']} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-xs text-muted-foreground mt-2">
                        Total: {totalProperties} Registered Properties
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
