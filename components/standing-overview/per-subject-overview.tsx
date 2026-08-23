"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bug,
  DollarSign,
  Fish,
  Leaf,
  MessageSquare,
  Sprout,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Map subjects -> icons
const subjectIcons: Record<string, React.ElementType> = {
  "Crop Science": Leaf,
  "Soil Science": Sprout,
  "Crop Protection": Bug,
  "Animal Science": Fish,
  "Agricultural Economics & Marketing": DollarSign,
  "Agricultural Extension & Communication": MessageSquare,
};

const chartData = [
  { subject: "Crop Science", correct: 186, mistakes: 80 },
  { subject: "Soil Science", correct: 305, mistakes: 200 },
  { subject: "Crop Protection", correct: 237, mistakes: 120 },
  { subject: "Animal Science", correct: 73, mistakes: 190 },
  {
    subject: "Agricultural Economics & Marketing",
    correct: 209,
    mistakes: 130,
  },
  {
    subject: "Agricultural Extension & Communication",
    correct: 214,
    mistakes: 140,
  },
];

const chartConfig = {
  correct: {
    label: "Correct",
    color: "var(--accent)",
  },
  mistakes: {
    label: "Mistakes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Custom tick renderer
const CustomTick = ({ x, y, payload }: any) => {
  const Icon = subjectIcons[payload.value] || Leaf;

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-12} y={-1} width={28} height={28}>
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    className="size-5 shadow-sm bg-primary rounded-full cursor-default"
                  >
                    <Icon className="h-3 w-3 text-primary-foreground" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent className="md:flex hidden" side="bottom">
                <p>{payload.value}</p>
              </TooltipContent>
              <PopoverContent className="w-fit p-1 text-xs md:hidden flex">
                <p>{payload.value}</p>
              </PopoverContent>
            </Popover>
          </Tooltip>
        </TooltipProvider>
      </foreignObject>
    </g>
  );
};

export default function AllScorePerSubjectGraph() {
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="min-h-32">
        <BarChart
          accessibilityLayer
          data={chartData}
          className="[&>svg>path]:fill-transparent"
        >
          <XAxis
            dataKey="subject"
            tickLine={false}
            axisLine={false}
            interval={0} // ✅ force all ticks to show
            tick={<CustomTick />}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend
            content={<ChartLegendContent />}
            className="text-xs mt-2 font-mono text-primary-foreground text-shadow-md"
          />
          <Bar
            dataKey="correct"
            stackId="a"
            fill="var(--color-correct)"
            radius={[0, 0, 7, 7]}
            barSize={30}
            className="stroke-foreground stroke-1"
          />
          <Bar
            dataKey="mistakes"
            stackId="a"
            fill="var(--color-mistakes)"
            barSize={30}
            radius={[7, 7, 0, 0]}
            className="stroke-foreground stroke-1"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
