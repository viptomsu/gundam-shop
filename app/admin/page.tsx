import { getDashboardStats } from "@/actions/dashboard";
import { KPIStatCard } from "@/components/admin/dashboard/kpi-card";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { TopCustomers } from "@/components/admin/dashboard/top-customers";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { formatCurrency, formatCompactNumber } from "@/utils/format";
import {
  CreditCard,
  Package,
  ShoppingCart,
  Users,
  Activity,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-mono uppercase text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
            Command Center // Cockpit
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            System Status: <span className="text-emerald-500">ONLINE</span> |
            Monitoring Business Metrics
          </p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* KPI GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPIStatCard
          title="Total Revenue"
          value={formatCurrency(stats.kpi.totalRevenue)}
          icon={<CreditCard className="h-4 w-4 opacity-70" />}
          description={`${
            stats.kpi.revenueGrowth >= 0 ? "+" : ""
          }${stats.kpi.revenueGrowth.toFixed(1)}% from last month`}
          color="cyan"
        />
        <KPIStatCard
          title="Total Orders"
          value={stats.kpi.totalOrders}
          icon={<ShoppingCart className="h-4 w-4 opacity-70" />}
          description="Processed orders"
          color="yellow"
        />
        <KPIStatCard
          title="Active Stock"
          value={formatCompactNumber(stats.kpi.totalStock)}
          icon={<Package className="h-4 w-4 opacity-70" />}
          description="Across all variants"
          color="emerald"
        />
        <KPIStatCard
          title="Total Pilots"
          value={stats.kpi.totalUsers}
          icon={<Users className="h-4 w-4 opacity-70" />}
          description="Registered users"
          color="purple"
        />
      </div>

      {/* CHART ROW */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <RevenueChart data={stats.graphData} />
      </div>

      {/* RANKINGS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TopProducts data={stats.topProducts} />
        <TopCustomers data={stats.topCustomers} />
      </div>

      <div className="text-center py-6 text-xs text-slate-700 font-mono">
        Gundam Shop Admin System v2.0 // UI: Sci-Fi Industrial
      </div>
    </div>
  );
}
