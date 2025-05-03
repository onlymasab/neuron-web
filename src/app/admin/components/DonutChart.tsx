"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { device: "Window", downloads: 53345, fill: "var(--color-window)" },
    { device: "iOS", downloads: 44313, fill: "var(--color-ios)" },
    { device: "Android", downloads: 78343, fill: "var(--color-android)" },
    { device: "Mac", downloads: 12244, fill: "var(--color-mac)" },
]

const chartConfig = {
    downloads: {
        label: "Downloads",
    },
    window: {
        label: "window",
        color: "#58dd96",
    },
    ios: {
        label: "iOS",
        color: "#007867",
    },
    android: {
        label: "Android",
        color: "#004b50",
    },
    mac: {
        label: "Mac",
        color: "#c8fad6",
    },
} satisfies ChartConfig

export function DonutChart() {
    const totalDownloads = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.downloads, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-left pb-0">
                <CardTitle>Current download</CardTitle>
                <CardDescription>Downloaded by operating system</CardDescription>
            </CardHeader>
            <CardContent className="h-fit pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[300px] -mb-17"
                >
                    <PieChart 
                            className="-mt-10">
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="downloads"
                            nameKey="device"
                            innerRadius={80}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalDownloads.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Downloads
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                
            </CardFooter>
        </Card>
    )
}
