"use client";

import { DecisionState } from "../../types";
import { z } from "zod";
import { motion } from "framer-motion";
import { Target, Activity } from "lucide-react";

interface RecommendationCardProps {
  decision: z.infer<typeof DecisionState>;
}

export function RecommendationCard({ decision }: RecommendationCardProps) {
  const isInvest = decision.recommendation === "INVEST";
  
  // Calculate SVG stroke dasharray for the circular gauge (circumference of r=28 is ~176)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (decision.confidence / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden h-full"
    >
      <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] -z-10 rounded-full opacity-50 ${isInvest ? 'bg-success' : 'bg-danger'}`} />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Final Verdict</h3>
          <div className={`text-4xl font-heading font-black tracking-tight ${isInvest ? 'text-success drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}>
            {decision.recommendation}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r={radius} fill="none" stroke="#1F2937" strokeWidth="6" />
              {/* Progress Circle */}
              <circle 
                cx="32" cy="32" r={radius} 
                fill="none" 
                stroke={isInvest ? '#10B981' : decision.confidence > 70 ? '#F59E0B' : '#EF4444'} 
                strokeWidth="6" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-lg font-bold text-white">{decision.confidence}</span>
              <span className="text-[9px] text-zinc-400 -mt-1">%</span>
            </div>
          </div>
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-2">Confidence</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
            <Activity className="w-3.5 h-3.5" /> Risk
          </div>
          <div className={`font-bold text-sm ${decision.riskLevel === 'LOW' ? 'text-success' : decision.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-danger'}`}>
            {decision.riskLevel}
          </div>
        </div>
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
            <Target className="w-3.5 h-3.5" /> Horizon
          </div>
          <div className="font-bold text-sm text-white">
            {decision.investmentHorizon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
