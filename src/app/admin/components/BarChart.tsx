"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const chartData = [
    { date: "Jan", sale: 5 },
    { date: "Feb", sale: 8 },
    { date: "Mar", sale: 6 },
    { date: "Apr", sale: 13 },
    { date: "May", sale: 17 },
    { date: "Jun", sale: 4 },
    { date: "Jul", sale: 10 },
    { date: "Aug", sale: 9 },
]

interface BarChartMiniProps {
    color?: string
}

export function BarChartMini({color}: BarChartMiniProps) {
    return (
        <Card className="py-0 shadow-none border-0">
            <CardContent>
                <div className="h-18 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap={10}>
                            <Bar
                                dataKey="sale"
                                fill={color}
                                radius={[4, 4, 0, 0]}
                                barSize={8}
                            />
                            {/* Removed axis and grid lines for minimal look */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
