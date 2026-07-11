"use client";

import { RiskAnalysisSchema } from "../../types";
import { z } from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ArrowUpRight, AlertTriangle } from "lucide-react";

interface SwotMatrixProps {
  risks: z.infer<typeof RiskAnalysisSchema> | undefined;
}

export function SwotMatrix({ risks }: SwotMatrixProps) {
  if (!risks) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const swotConfig = [
    { 
      id: 'strengths', title: 'Strengths', data: risks.strengths, 
      icon: ShieldCheck, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' 
    },
    { 
      id: 'weaknesses', title: 'Weaknesses', data: risks.weaknesses, 
      icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' 
    },
    { 
      id: 'opportunities', title: 'Opportunities', data: risks.opportunities, 
      icon: ArrowUpRight, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' 
    },
    { 
      id: 'threats', title: 'Threats', data: risks.threats, 
      icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' 
    },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {swotConfig.map((config) => (
        <motion.div key={config.id} variants={item} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
              <config.icon className="w-5 h-5" />
            </div>
            <h3 className={`font-heading font-semibold text-lg ${config.color}`}>
              {config.title}
            </h3>
          </div>
          <ul className="space-y-3">
            {config.data.map((point, idx) => (
              <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.bg.replace('/10', '')}`} />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
