"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TopProductsProps {
  data: {
    id: string;
    name: string;
    variantName: string;
    image: string;
    unitsSold: number;
  }[];
}

export function TopProducts({ data }: TopProductsProps) {
  return (
    <Card className="col-span-1 md:col-span-2 border-yellow-800/30 bg-slate-950/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-yellow-500 font-mono uppercase tracking-widest text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          Top Performing Units
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground font-mono text-xs opacity-50">
              [NO DATA DETECTED]
            </div>
          ) : (
            data.map((item, index) => (
              <div key={item.id} className="flex items-center group">
                <div className="mr-4 font-mono text-muted-foreground w-4 text-center">
                  {index + 1}
                </div>
                <Avatar className="h-12 w-12 rounded-sm border border-slate-800 group-hover:border-yellow-500/50 transition-colors">
                  <AvatarImage
                    src={item.image}
                    alt={item.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-sm bg-slate-900 text-xs">
                    IMG
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none text-slate-200 group-hover:text-yellow-400 transition-colors truncate max-w-[180px]">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.variantName}
                  </p>
                </div>
                <div className="ml-auto font-medium font-mono text-slate-200">
                  <Badge
                    variant="outline"
                    className="border-yellow-900/50 text-yellow-500 bg-yellow-950/20"
                  >
                    {item.unitsSold} Units
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
