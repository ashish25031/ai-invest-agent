"use client";

import { Building2 } from "lucide-react";
import { CompanyInfoSchema } from "../../types";
import { z } from "zod";

interface CompanyHeaderProps {
  companyInfo: z.infer<typeof CompanyInfoSchema> | undefined;
  fallbackName: string;
}

export function CompanyHeader({ companyInfo, fallbackName }: CompanyHeaderProps) {
  const name = companyInfo?.name || fallbackName;
  const ticker = companyInfo?.ticker;
  const industry = companyInfo?.industry;

  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
        <Building2 className="text-zinc-400 w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">{name}</h1>
          {ticker && (
            <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
              {ticker}
            </span>
          )}
        </div>
        {industry && <p className="text-sm text-zinc-400 mt-1">{industry}</p>}
      </div>
    </div>
  );
}
