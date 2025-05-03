"use client"

import { LabelList, Pie, PieChart } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { continent: "africa", visitors: 500, fill: "#ff5630", percentage: "6.3%" },
    { continent: "europe", visitors: 1500, fill: "#006c9c", percentage: "18.8%" },
    { continent: "asia", visitors: 2500, fill: "#ffd666", percentage: "31.3%" },
    { continent: "america", visitors: 3500, fill: "#00a76f", percentage: "43.8%" },
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
        <Card className="flex flex-col gap-0">
            <CardHeader className="items-left pb-0">
                <CardTitle>Current visits</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="visitors" >
                        <LabelList
                            dataKey="percentage"
                            className="fill-background"
                            stroke="none"
                            fontSize={12}
                        />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="continent" />}
                            className="-translate-y-2  gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
