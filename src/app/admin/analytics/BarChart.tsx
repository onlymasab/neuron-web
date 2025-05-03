"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "Jan", teamA: 43, teamB: 51 },
    { month: "Feb", teamA: 33, teamB: 70 },
    { month: "Mar", teamA: 22, teamB: 47 },
    { month: "Apr", teamA: 37, teamB: 67 },
    { month: "May", teamA: 67, teamB: 40 },
    { month: "Jun", teamA: 68, teamB: 37 },
    { month: "Jul", teamA: 37, teamB: 24 },
    { month: "Aug", teamA: 24, teamB: 70 },
    { month: "Sep", teamA: 55, teamB: 24 },
]

const chartConfig = {
    teamA: {
        label: "Team A",
        color: "#339385",
    },
    teamB: {
        label: "Team B",
        color: "#ffbc33",
    },
} satisfies ChartConfig

export function AnalyticsBarChart() {
    return (
        <Card className="max-h-[370px]">
            <CardHeader>
                <CardTitle>Website visits</CardTitle>
                <CardDescription>{"(+43%) than last year"}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}  className="h-[270px] w-full">
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
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="teamA" fill="#339385" radius={4} barSize={20} />
                        <Bar dataKey="teamB" fill="#ffbc33" radius={4} barSize={20} />
                    </BarChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
