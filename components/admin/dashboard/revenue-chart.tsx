"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-4 border-cyan-800/30 bg-slate-950/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-cyan-500 font-mono uppercase tracking-widest text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          Mission Analysis // Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(6,182,212,0.1)" }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #164e63",
                color: "#22d3ee",
                fontFamily: "monospace",
              }}
            />
            <Bar
              dataKey="total"
              fill="#06b6d4" // Cyan-500
              radius={[4, 4, 0, 0]}
              className="fill-cyan-500 hover:fill-cyan-400 transition-colors"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
