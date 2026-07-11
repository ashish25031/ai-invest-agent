"use client";

import { CompanyInfoSchema } from "../../types";
import { z } from "zod";
import { Info, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyOverviewProps {
  companyInfo: z.infer<typeof CompanyInfoSchema> | undefined;
}

export function CompanyOverview({ companyInfo }: CompanyOverviewProps) {
  if (!companyInfo) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Company Summary
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              {companyInfo.summary}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Business Model
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              {companyInfo.businessModel}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Key Competitors
          </h3>
          <ul className="flex flex-wrap gap-2">
            {companyInfo.competitors.map((competitor, idx) => (
              <li 
                key={idx} 
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {competitor}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </motion.div>
  );
}
