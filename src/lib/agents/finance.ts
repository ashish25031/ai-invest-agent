import { AgentState, FinancialMetricsSchema } from "../../types";
import { getFinancialData } from "../services/finance";
import { logger } from "../logger";

export async function financialAnalysisAgent(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`Agent: Financial Analysis started for ${state.companyName}`);
  
  try {
    const ticker = state.companyInfo?.ticker || state.companyName;
    const rawFinance = await getFinancialData(ticker);
    
    // Validate with Zod before passing to state
    const financials = FinancialMetricsSchema.parse({
      marketCap: rawFinance.marketCap,
      revenue: rawFinance.revenue,
      revenueGrowth: rawFinance.revenueGrowth,
      profitMargin: rawFinance.profitMargin,
      debtToEquity: rawFinance.debtToEquity,
      peRatio: rawFinance.peRatio,
      currency: rawFinance.currency,
    });
    
    logger.info(`Agent: Financial Analysis completed`);
    
    return {
      status: "Analyzing News & Sentiment...",
      financials,
      sources: [...state.sources, { name: "Yahoo Finance", url: `https://finance.yahoo.com/quote/${ticker}` }]
    };
  } catch (error: any) {
    logger.error("Financial Analysis Agent failed", error);
    // Graceful degradation: we don't throw, we just don't populate financials if it fails
    // The Risk/Decision agents will handle the missing data
    return {
      status: "Analyzing News & Sentiment..."
    };
  }
}
