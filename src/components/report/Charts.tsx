"use client";

import { z } from "zod";
import { FinalDecisionSchema } from "../../types";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";
import { motion } from "framer-motion";

interface ChartsProps {
  decision: z.infer<typeof FinalDecisionSchema>;
}

export function Charts({ decision }: ChartsProps) {
  
  // Radar Data
  const riskScore = decision.riskLevel === "LOW" ? 90 : decision.riskLevel === "MEDIUM" ? 50 : 20;
  
  const radarData = [
    { subject: 'Financial Health', A: decision.financialScore, fullMark: 100 },
    { subject: 'News Sentiment', A: decision.sentimentScore, fullMark: 100 },
    { subject: 'Confidence', A: decision.confidence, fullMark: 100 },
    { subject: 'Safety Score', A: riskScore, fullMark: 100 },
    { subject: 'Overall', A: decision.overallScore, fullMark: 100 },
  ];

  // Donut Data (mock weighted distribution based on scores)
  const donutData = [
    { name: 'Financials', value: decision.financialScore * 0.4 },
    { name: 'Sentiment', value: decision.sentimentScore * 0.3 },
    { name: 'Safety', value: riskScore * 0.3 },
  ];
  const COLORS = ['#6366F1', '#10B981', '#F59E0B'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Radar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-xl"
      >
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-white mb-1">AI Evaluation Matrix</h3>
          <p className="text-xs text-zinc-400">A visual representation of how the AI scored the company across multiple dimensions. A larger area means a better overall profile.</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#1F2937" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-xl"
      >
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-white mb-1">Decision Weights</h3>
          <p className="text-xs text-zinc-400">The relative contribution of Financial Health, News Sentiment, and Safety/Risk towards the final Overall Score.</p>
        </div>
        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => [`${Number(value).toFixed(1)} pts`, 'Weighted Score']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
            <span className="text-4xl font-heading font-bold text-white">{decision.overallScore}</span>
            <span className="text-xs text-zinc-400">Total Score</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
