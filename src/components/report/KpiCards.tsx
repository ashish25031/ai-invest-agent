"use client";

import { FinancialMetricsSchema } from "../../types";
import { z } from "zod";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Percent, ArrowUpRight } from "lucide-react";

interface KpiCardsProps {
  financials: z.infer<typeof FinancialMetricsSchema> | undefined;
}

const formatCurrency = (val: number | null | undefined) => {
  if (!val) return "N/A";
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toLocaleString()}`;
};

export function KpiCards({ financials }: KpiCardsProps) {
  const kpis = [
    { label: "Market Cap", value: formatCurrency(financials?.marketCap), icon: DollarSign },
    { label: "Revenue", value: formatCurrency(financials?.revenue), icon: TrendingUp },
    { label: "Profit Margin", value: financials?.profitMargin ? `${(financials.profitMargin * 100).toFixed(2)}%` : "N/A", icon: Percent },
    { label: "P/E Ratio", value: financials?.peRatio ? financials.peRatio.toFixed(2) : "N/A", icon: ArrowUpRight },
    { label: "Rev Growth", value: financials?.revenueGrowth ? `${(financials.revenueGrowth * 100).toFixed(2)}%` : "N/A", icon: TrendingUp },
    { label: "Debt/Equity", value: financials?.debtToEquity ? financials.debtToEquity.toFixed(2) : "N/A", icon: Percent },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-medium text-zinc-400">{kpi.label}</span>
            <div className="p-1.5 bg-zinc-900 rounded-md text-primary">
              <kpi.icon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-heading font-semibold text-white tracking-tight">
            {kpi.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
