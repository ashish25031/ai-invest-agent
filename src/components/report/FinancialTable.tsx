"use client";

import { FinancialMetricsSchema } from "../../types";
import { z } from "zod";
import { motion } from "framer-motion";

interface FinancialTableProps {
  financials: z.infer<typeof FinancialMetricsSchema> | undefined;
}

const formatCurrency = (val: number | null | undefined, currency: string = "USD") => {
  if (!val) return "N/A";
  if (val >= 1e9) return `${currency} ${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${currency} ${(val / 1e6).toFixed(2)}M`;
  return `${currency} ${val.toLocaleString()}`;
};

export function FinancialTable({ financials }: FinancialTableProps) {
  const data = [
    { metric: "Market Capitalization", value: formatCurrency(financials?.marketCap, financials?.currency) },
    { metric: "Total Revenue", value: formatCurrency(financials?.revenue, financials?.currency) },
    { metric: "Revenue Growth", value: financials?.revenueGrowth ? `${(financials.revenueGrowth * 100).toFixed(2)}%` : "N/A" },
    { metric: "Profit Margin", value: financials?.profitMargin ? `${(financials.profitMargin * 100).toFixed(2)}%` : "N/A" },
    { metric: "Price-to-Earnings (P/E)", value: financials?.peRatio ? financials.peRatio.toFixed(2) : "N/A" },
    { metric: "Debt-to-Equity Ratio", value: financials?.debtToEquity ? financials.debtToEquity.toFixed(2) : "N/A" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900/50 text-zinc-400 font-medium">
            <tr>
              <th className="px-6 py-4 border-b border-border">Financial Metric</th>
              <th className="px-6 py-4 border-b border-border text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-300">{row.metric}</td>
                <td className="px-6 py-4 text-right text-white font-mono">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
