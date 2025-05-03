"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
const chartData = [
    { continent: "africa", visitors: 500, fill: "#ff5630" },
    { continent: "europe", visitors: 1500, fill: "#006c9c" },
    { continent: "asia", visitors: 2500, fill: "#ffd666" },
    { continent: "america", visitors: 3500, fill: "#00a76f" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    america: {
        label: "America",
        color: "#00a76f",
    },
    asia: {
        label: "Asia",
        color: "#ffd666",
    },
    europe: {
        label: "Europe",
        color: "#006c9c",
    },
    africa: {
        label: "Africa",
        color: "#ff5630",
    },
} satisfies ChartConfig

export function AnalyticsPieChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-left pb-0">
                <CardTitle>Current visits</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <Pie data={chartData} dataKey="visitors" />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="continent" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
