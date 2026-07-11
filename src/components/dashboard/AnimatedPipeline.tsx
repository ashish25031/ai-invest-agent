"use client";

import { motion } from "framer-motion";
import { Check, Loader2, CircleDashed } from "lucide-react";

interface AnimatedPipelineProps {
  status: string;
}

const steps = [
  { id: "idle", label: "Initialization" },
  { id: "researching_company", label: "Company Research" },
  { id: "analyzing_financials", label: "Financial Analysis" },
  { id: "analyzing_news", label: "News Analysis" },
  { id: "analyzing_risks", label: "Risk Assessment" },
  { id: "making_decision", label: "Finalizing Decision" },
  { id: "complete", label: "Complete" },
];

export function AnimatedPipeline({ status }: AnimatedPipelineProps) {
  const currentIndex = steps.findIndex(s => s.id === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-800 -z-10" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${isCompleted ? 'bg-primary border-primary text-white' : 
                    isActive ? 'bg-zinc-900 border-primary text-primary' : 
                    'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? "var(--color-primary)" : isActive ? "#18181b" : "#09090b"
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : 
                 isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                 <CircleDashed className="w-5 h-5" />}
              </motion.div>
              <div className={`absolute top-14 w-32 text-center text-xs font-medium
                ${isActive ? 'text-white' : 'text-zinc-500'}`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
