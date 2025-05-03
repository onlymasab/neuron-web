"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    { month: "January", Asia: 6, Europe: 6, Americas: 6 },
    { month: "February", Asia: 18, Europe: 18, Americas: 18 },
    { month: "March", Asia: 14, Europe: 14, Americas: 14 },
    { month: "April", Asia: 9, Europe: 9, Americas: 9 },
    { month: "May", Asia: 20, Europe: 20, Americas: 20 },
    { month: "Jun", Asia: 6, Europe: 6, Americas: 6 },
    { month: "Jul", Asia: 22, Europe: 22, Americas: 22 },
    { month: "Aug", Asia: 19, Europe: 19, Americas: 19 },
    { month: "Sep", Asia: 8, Europe: 8, Americas: 8 },
    { month: "Oct", Asia: 22, Europe: 22, Americas: 22 },
    { month: "Nov", Asia: 8, Europe: 8, Americas: 8 },
    { month: "Dec", Asia: 17, Europe: 17, Americas: 17 },
]

const chartConfig = {
    Asia: {
        label: "Asia",
        color: "#007867",
    },
    Europe: {
        label: "Europe",
        color: "#ffab00",
    },
    Americas: {
        label: "Americas",
        color: "#00b8d9",
    },
} satisfies ChartConfig

export function AreaBarChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Area Installed</CardTitle>
                <CardDescription>{"(+43%) than last year"}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-63">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[0, 80]}
                            ticks={[0, 20, 40, 60, 80]}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="Asia"
                            stackId="a"
                            fill="var(--color-Asia)"
                            radius={[0, 0, 4, 4]}
                            barSize={30}

                        />
                        <Bar
                            dataKey="Europe"
                            stackId="a"
                            fill="var(--color-Europe)"
                            radius={[0, 0, 0, 0]}
                            barSize={30}

                        />
                        <Bar
                            dataKey="Americas"
                            stackId="a"
                            fill="var(--color-Americas)"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
