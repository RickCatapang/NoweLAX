"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartLine, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import AllScorePerSubjectGraph from "../standing-overview/per-subject-overview";
import { ResponsiveOverlay } from "../ui/responsive-overlay";

const winrateChartData = [{ month: "january", correct: 1260, incorrect: 570 }];
const winrateChartConfig = {
  correct: {
    label: "Corrects",
    color: "var(--chart-3)",
  },
  incorrect: {
    label: "Mistakes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
export default function StandingOverview() {
  const passingRate = Math.floor(
    (winrateChartData[0].correct /
      (winrateChartData[0].correct + winrateChartData[0].incorrect)) *
      100,
  );

  return (
    <Card className="bg-primary/30 shadow-lg gap-0 md:pb-2 pb-0">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-1">
          <ChartLine className="w-4" />
          Standing Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Latest Statitics and Progress
        </CardDescription>
        <CardAction>
          <ResponsiveOverlay breakpoint={768}>
            <ResponsiveOverlay.Trigger>
              <Button variant="outline" className="">
                Type <ChevronDown className="w-4" />
              </Button>
            </ResponsiveOverlay.Trigger>

            <ResponsiveOverlay.Content
              side="bottom"
              className="md:w-64 w-full p-4 flex-center"
            >
              <div className="w-full flex flex-col">
                <p>This is Drawer on mobile, Popover on desktop.</p>
                <div>sdsadas</div>
                <div>sdsadas</div>
              </div>
            </ResponsiveOverlay.Content>
          </ResponsiveOverlay>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-1">
          <div className="w-full flex-center md:px-5 px-15">
            <AllScorePerSubjectGraph />
          </div>
          <div className="w-full h-36 relative">
            <ChartContainer
              config={winrateChartConfig}
              className="mx-auto w-full max-w-96 absolute left-1/2 -translate-x-1/2 min-w-100"
            >
              <RadialBarChart
                data={winrateChartData}
                endAngle={180}
                innerRadius={90}
                outerRadius={140}
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
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-primary-foreground text-shadow-xs text-5xl font-bold font-mono"
                            >
                              {passingRate.toLocaleString()}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-primary-foreground font-mono text-xs text-shadow-xs"
                            >
                              Accuracy
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>

                <RadialBar
                  dataKey="incorrect"
                  fill="var(--color-incorrect)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-foreground stroke-0"
                />
                <RadialBar
                  dataKey="correct"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-correct)"
                  className="stroke-foreground stroke-1"
                />
              </RadialBarChart>
            </ChartContainer>
          </div>

          <div className="w-full sm:flex hidden items-center justify-center  h-40 px-2 pt-2 ">
            <div className="h-full w-full bg-linear-to-br from-secondary/60 from-10% via-accent/60 via-30% to-primary/60 to-90% rounded-2xl p-3">
              <div className="w-full h-full border border-dashed rounded-xs p-2">
                <h4 className="text-xs font-mono">But always remember...</h4>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
