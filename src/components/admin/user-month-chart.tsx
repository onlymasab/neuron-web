"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
 import { format } from "date-fns";

export const description = "A radar chart with a grid and circle"



const chartConfig = {
  user: {
    label: "User",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function UserMonthChart({ data }: { data: UserModel[] })  {
   

const chartData =
  Array.isArray(data) && data.length > 0
    ? Object.values(
        data.reduce((acc, user) => {
          const month = format(new Date(user.created_at), "MMMM");

          if (!acc[month]) {
            acc[month] = { month, paid: 0, free: 0, pending: 0 };
          }

          if (user.current_package === "paid") {
            acc[month].paid += 1;
          } else if (user.current_package === "unpaid") {
            acc[month].free += 1;
          } else {
            acc[month].pending += 1;
          }

          return acc;
        }, {} as Record<string, { month: string; paid: number; free: number; pending: number }>)
      )
    : [];

const totalVisitors =
  chartData.length > 0 ? chartData[0].free + chartData[0].paid : 0;
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Monthly</CardTitle>
        <CardDescription>
          Showing total user for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="paid"
              fill="var(--color-paid)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 0.0001% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground hidden flex items-center gap-2 leading-none">
          January - June 2025
        </div>
      </CardFooter>
    </Card>
  )
}
