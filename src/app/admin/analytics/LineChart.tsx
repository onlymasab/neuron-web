"use client"

import { CartesianGrid, Line, LineChart } from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart"
const chartData = [
    { month: "January", sale: 22 },
    { month: "February", sale: 8 },
    { month: "March", sale: 35 },
    { month: "April", sale: 50 },
    { month: "May", sale: 82 },
    { month: "June", sale: 84 },
    { month: "July", sale: 77 },
    { month: "August", sale: 12 },
]

const chartConfig = {
    sale: {
        label: "Sale",
        color: "#027968",
    },
} satisfies ChartConfig

// Custom Tooltip Component
function CustomTooltip({ payload }: { payload?: { payload: { month: string; sale: number } }[] }) {
    if (payload && payload.length && payload[0]?.payload) {
        const { month, sale } = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white p-2 rounded-md shadow-lg border">
                <p className="label font-medium text-gray-400">{month}</p> {/* Replaces "Sale" with month name */}
                <p className="value mt-2">{sale}</p>  {/* Shows sale value */}
            </div>
        );
    }
    return null;
}

interface CardLineChartProps {
    color?: string;
}

export function CardLineChart({color}: CardLineChartProps) {
    return (
        <Card className="w-full h-full bg-transparent border-none shadow-none">
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 2,
                            right: 2,
                        }}
                    >
                        <CartesianGrid vertical={false} horizontal={false}/>
                        
                        <ChartTooltip
                            cursor={false}
                            content={<CustomTooltip />} // Use custom tooltip
                        />

                        <Line
                            dataKey="sale"
                            type="linear"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
