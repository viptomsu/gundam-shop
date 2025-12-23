"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  color?: "cyan" | "yellow" | "purple" | "emerald";
}

export function KPIStatCard({
  title,
  value,
  icon,
  description,
  color = "cyan",
}: KPIStatCardProps) {
  const colorStyles = {
    cyan: "border-cyan-500/50 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
    yellow:
      "border-yellow-500/50 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.15)]",
    purple:
      "border-purple-500/50 text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
    emerald:
      "border-emerald-500/50 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  };

  const bgStyles = {
    cyan: "bg-cyan-950/10",
    yellow: "bg-yellow-950/10",
    purple: "bg-purple-950/10",
    emerald: "bg-emerald-950/10",
  };

  return (
    <Card
      className={cn(
        "border-l-4 backdrop-blur-sm relative overflow-hidden transition-all hover:scale-[1.02]",
        colorStyles[color],
        bgStyles[color]
      )}
    >
      {/* Decorative corner markers */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider opacity-80 font-mono">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
