"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopCustomersProps {
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    totalSpent: number;
    formattedSpent: string;
  }[];
}

export function TopCustomers({ data }: TopCustomersProps) {
  return (
    <Card className="col-span-1 md:col-span-2 border-purple-800/30 bg-slate-950/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-purple-500 font-mono uppercase tracking-widest text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Ace Pilot Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground font-mono text-xs opacity-50">
              [NO PILOT DATA]
            </div>
          ) : (
            data.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      className={`h-10 w-10 border ${
                        index === 0
                          ? "border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                          : "border-slate-800"
                      }`}
                    >
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-slate-900 text-xs text-purple-400">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] font-bold px-1 rounded-sm">
                        ACE
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-200 group-hover:text-purple-400 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-mono font-bold text-slate-200">
                  {user.formattedSpent}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
