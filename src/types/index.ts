import { z } from "zod";

// --- Agent State Schemas ---

export const CompanyInfoSchema = z.object({
  name: z.string(),
  ticker: z.string().optional(),
  summary: z.string(),
  industry: z.string(),
  businessModel: z.string(),
  competitors: z.array(z.string()),
  isInvestableCompany: z.boolean().describe("Set to false if this is a generic local shop, fake name, or not a notable corporate entity."),
});

export const FinancialMetricsSchema = z.object({
  marketCap: z.number().nullish(),
  revenue: z.number().nullish(),
  revenueGrowth: z.number().nullish(),
  profitMargin: z.number().nullish(),
  debtToEquity: z.number().nullish(),
  peRatio: z.number().nullish(),
  currency: z.string().default("USD"),
});

export const NewsArticleSchema = z.object({
  title: z.string(),
  url: z.string(),
  source: z.string(),
  publishedAt: z.string(),
  sentiment: z.enum(["BULLISH", "BEARISH", "NEUTRAL"]),
});

export const RiskAnalysisSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
  systemicRisks: z.array(z.string()),
  companySpecificRisks: z.array(z.string()),
});

export const FinalDecisionSchema = z.object({
  recommendation: z.enum(["INVEST", "PASS"]),
  confidence: z.number().min(0).max(100),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  investmentHorizon: z.enum(["SHORT", "MEDIUM", "LONG"]),
  summary: z.string(),
  reasons: z.array(z.string()),
  concerns: z.array(z.string()),
  financialScore: z.number().min(0).max(100),
  sentimentScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
});

// --- LangGraph State ---
// This interface defines the object that is passed between agents

export interface AgentState {
  companyName: string;
  status: string; // Current executing agent/step
  error?: string;
  
  companyInfo?: z.infer<typeof CompanyInfoSchema>;
  financials?: z.infer<typeof FinancialMetricsSchema>;
  news?: z.infer<typeof NewsArticleSchema>[];
  risks?: z.infer<typeof RiskAnalysisSchema>;
  decision?: z.infer<typeof FinalDecisionSchema>;
  sources: { name: string; url: string }[];
}
