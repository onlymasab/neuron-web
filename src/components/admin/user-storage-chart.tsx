

"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
import { UserModel } from "@/types/UserModel"
import { toast } from "sonner"

export const description = "A radial chart with stacked sections"



const chartConfig = {
  paid: {
    label: "paid",
    color: "var(--chart-1)",
  },
  free: {
    label: "free",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function UserStorageChart({ data }: { data: UserModel[] }) {

    

    const chartData = [{ 
        month: "June", paid: Array.isArray(data) ? data.filter(d => d.current_package !== "free").reduce((total, user) => total + user.storage_limit_gb, 0) : 0 , 
        free: Array.isArray(data) ? data.filter(d => d.current_package === "free").reduce((total, user) => total + user.storage_limit_gb, 0) : 0 }]
  const totalVisitors = chartData[0].paid + chartData[0].free

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Storage</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Storage
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="free"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-free)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="paid"
              fill="var(--color-paid)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 0.0001% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total users for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
