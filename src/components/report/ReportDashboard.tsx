"use client";

import { AgentState } from "../../types";
import { CompanyOverview } from "./CompanyOverview";
import { KpiCards } from "./KpiCards";
import { FinancialTable } from "./FinancialTable";
import { Charts } from "./Charts";
import { SwotMatrix } from "./SwotMatrix";
import { NewsTimeline } from "./NewsTimeline";
import { motion } from "framer-motion";
import { FileText, Target, ExternalLink } from "lucide-react";

interface ReportDashboardProps {
  state: Partial<AgentState>;
}

export function ReportDashboard({ state }: ReportDashboardProps) {
  const { companyInfo, financials, news, risks, decision, sources } = state;

  if (!decision) return null;

  return (
    <div className="space-y-12 pb-24 mt-8">
      
      {/* 0. Company Overview */}
      <CompanyOverview companyInfo={companyInfo} />

      {/* 1. Financials (KPIs & Table) */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Financial Metrics
        </h2>
        <KpiCards financials={financials} />
      </section>

      {/* 2. Charts (Radar & Donut) */}
      <section>
        <Charts decision={decision} />
      </section>

      {/* 3. SWOT Matrix */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> SWOT Analysis
        </h2>
        <SwotMatrix risks={risks} />
      </section>

      {/* 4. News Timeline */}
      <section>
        <NewsTimeline news={news} />
      </section>

      {/* 5. Investment Thesis & Sources */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Investment Thesis</h3>
          <p className="text-zinc-300 leading-relaxed text-sm">{decision.summary}</p>
          
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-success mb-2">Key Drivers</h4>
              <ul className="space-y-1">
                {decision.reasons.map((r, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex gap-2"><span className="text-success">•</span> {r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-danger mb-2">Primary Concerns</h4>
              <ul className="space-y-1">
                {decision.concerns.map((c, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex gap-2"><span className="text-danger">•</span> {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
             <h3 className="text-lg font-heading font-semibold text-white mb-4">Risk Profile</h3>
             {risks?.systemicRisks && (
               <div className="mb-4">
                 <h4 className="text-sm font-medium text-zinc-400 mb-2">Systemic Risks</h4>
                 <ul className="space-y-1 list-disc pl-4 text-xs text-zinc-500">
                   {risks.systemicRisks.map((r, i) => <li key={i}>{r}</li>)}
                 </ul>
               </div>
             )}
             {risks?.companySpecificRisks && (
               <div>
                 <h4 className="text-sm font-medium text-zinc-400 mb-2">Company Specific Risks</h4>
                 <ul className="space-y-1 list-disc pl-4 text-xs text-zinc-500">
                   {risks.companySpecificRisks.map((r, i) => <li key={i}>{r}</li>)}
                 </ul>
               </div>
             )}
          </div>
          
          {sources && sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1">
                    {s.name} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>

    </div>
  );
}
