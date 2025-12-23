"use server";

import { prisma as prismadb } from "@/lib/prisma";
import { formatCurrency } from "@/utils/format";
import { startOfYear, endOfMonth, eachMonthOfInterval, format } from "date-fns";

export async function getDashboardStats() {
  // 1. KPIs
  const totalRevenueResult = await prismadb.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentStatus: "PAID",
    },
  });
  const totalRevenue = Number(totalRevenueResult._sum.totalAmount || 0);

  const totalOrders = await prismadb.order.count();

  const totalStockResult = await prismadb.productVariant.aggregate({
    _sum: {
      stock: true,
    },
    where: {
      isArchived: false,
    },
  });
  const totalStock = Number(totalStockResult._sum.stock || 0);

  const totalUsers = await prismadb.user.count({
    where: {
      role: "USER",
    },
  });

  // 2. Sales Chart (Monthly Revenue for Current Year)
  const currentYearStart = startOfYear(new Date());

  const monthlyRevenue = await prismadb.order.groupBy({
    by: ["createdAt"],
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentStatus: "PAID",
      createdAt: {
        gte: currentYearStart,
      },
    },
  });

  // Normalize data for all months
  const monthsInYear = eachMonthOfInterval({
    start: currentYearStart,
    end: new Date(),
  });

  const graphData = monthsInYear.map((month) => {
    const monthKey = format(month, "MMM"); // Jan, Feb...

    // Aggregate revenue for this month from the groupBy results
    // Prisma group by createdAt is precise to the timestamp, so we sum broadly
    let revenueForMonth = 0;

    for (const entry of monthlyRevenue) {
      if (
        entry.createdAt.getMonth() === month.getMonth() &&
        entry.createdAt.getFullYear() === month.getFullYear()
      ) {
        revenueForMonth += Number(entry._sum.totalAmount || 0);
      }
    }

    return {
      name: monthKey,
      total: revenueForMonth,
    };
  });

  // 3. Top Products (Best Sellers by Quantity)
  const topProductsGrouped = await prismadb.orderItem.groupBy({
    by: ["variantId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const topProducts = await Promise.all(
    topProductsGrouped.map(async (item) => {
      const variant = await prismadb.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      return {
        id: item.variantId,
        name: variant?.product.name || "Unknown Product",
        variantName: variant?.name || "",
        image: variant?.image || variant?.product.images?.[0] || "",
        unitsSold: item._sum.quantity || 0,
      };
    })
  );

  // 4. Top Customers (Ace Pilots)
  const topCustomersGrouped = await prismadb.order.groupBy({
    by: ["userId"],
    _sum: {
      totalAmount: true,
    },
    where: {
      userId: { not: null }, // Only registered users
      paymentStatus: "PAID",
    },
    orderBy: {
      _sum: {
        totalAmount: "desc",
      },
    },
    take: 5,
  });

  const topCustomers = await Promise.all(
    topCustomersGrouped.map(async (item) => {
      if (!item.userId) return null;
      const user = await prismadb.user.findUnique({
        where: { id: item.userId },
      });

      if (!user) return null;

      return {
        id: item.userId,
        name: user.name || "Unknown Pilot",
        email: user.email,
        avatar: user.avatar,
        totalSpent: Number(item._sum.totalAmount || 0),
        formattedSpent: formatCurrency(Number(item._sum.totalAmount || 0)),
      };
    })
  );

  // Calculate Revenue Growth (Month over Month)
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthRevenueResult = await prismadb.order.aggregate({
    _sum: { totalAmount: true },
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: thisMonthStart },
    },
  });
  const thisMonthRevenue = Number(thisMonthRevenueResult._sum.totalAmount || 0);

  const lastMonthRevenueResult = await prismadb.order.aggregate({
    _sum: { totalAmount: true },
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
  });
  const lastMonthRevenue = Number(lastMonthRevenueResult._sum.totalAmount || 0);

  let revenueGrowth = 0;
  if (lastMonthRevenue > 0) {
    revenueGrowth =
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  } else if (thisMonthRevenue > 0) {
    revenueGrowth = 100; // If last month was 0 and this month > 0, treat as 100% growth
  }

  return {
    kpi: {
      totalRevenue,
      totalOrders,
      totalStock,
      totalUsers,
      revenueGrowth,
    },
    graphData,
    topProducts,
    topCustomers: topCustomers.filter(
      (item): item is NonNullable<typeof item> => item !== null
    ),
  };
}
