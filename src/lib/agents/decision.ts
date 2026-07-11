import { ChatOpenAI } from "@langchain/openai";
import { AgentState, FinalDecisionSchema } from "../../types";
import { DECISION_WEIGHTS } from "../../constants";
import { logger } from "../logger";

const llm = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b",
  temperature: 0,
  apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  }
});

function calculateScores(state: AgentState) {
  let financialScore = 50; // default medium score
  let sentimentScore = 50;

  // Simple heuristic for financial score
  if (state.financials) {
    const f = state.financials;
    let score = 50;
    if (f.profitMargin && f.profitMargin > 0.1) score += 10;
    if (f.profitMargin && f.profitMargin > 0.2) score += 10;
    if (f.profitMargin && f.profitMargin < 0) score -= 20;
    if (f.revenueGrowth && f.revenueGrowth > 0.1) score += 15;
    if (f.debtToEquity && f.debtToEquity < 1) score += 15;
    if (f.debtToEquity && f.debtToEquity > 2) score -= 15;
    financialScore = Math.min(Math.max(score, 0), 100);
  }

  // Simple heuristic for sentiment
  if (state.news && state.news.length > 0) {
    let bullishCount = 0;
    let bearishCount = 0;
    state.news.forEach(n => {
      if (n.sentiment === 'BULLISH') bullishCount++;
      if (n.sentiment === 'BEARISH') bearishCount++;
    });
    
    if (bullishCount > bearishCount) sentimentScore = 70;
    else if (bearishCount > bullishCount) sentimentScore = 30;
  }

  // Determine overall score based on weights (approximate base)
  // LLM will refine this, but we provide the baseline quantitative scores
  const baseScore = 
    (financialScore * DECISION_WEIGHTS.FINANCIAL_HEALTH) +
    (sentimentScore * DECISION_WEIGHTS.NEWS_SENTIMENT) + 
    (50 * (DECISION_WEIGHTS.GROWTH_POTENTIAL + DECISION_WEIGHTS.RISK_PROFILE + DECISION_WEIGHTS.COMPETITIVE_POSITION));
    
  return {
    financialScore,
    sentimentScore,
    baseScore: Math.round(baseScore)
  };
}

export async function decisionAgent(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`Agent: Investment Decision started for ${state.companyName}`);
  
  try {
    const scores = calculateScores(state);
    
    const structuredLlm = llm.withStructuredOutput(FinalDecisionSchema);
    
    const prompt = `
      You are the Lead Portfolio Manager. Make a final investment decision (INVEST or PASS) for ${state.companyName}.
      Base your decision primarily on the provided data and our internal quantitative base scores.
      
      Data:
      Company Info: ${JSON.stringify(state.companyInfo)}
      Financials: ${JSON.stringify(state.financials)}
      Risks & SWOT: ${JSON.stringify(state.risks)}
      
      Internal Quantitative Base Score: ${scores.baseScore}/100 
      Financial Health Score: ${scores.financialScore}/100
      Sentiment Score: ${scores.sentimentScore}/100
      
      Guidelines for your decision:
      1. Be objective and balanced. If the Financial Health Score is > 60 and the company has solid revenue/margins, lean towards INVEST.
      2. Do NOT default to HIGH risk. Reserve HIGH risk ONLY for companies with severe debt, negative profit margins, or catastrophic news.
      3. For established, large-cap companies with stable financials, the risk level should generally be LOW or MEDIUM.
      4. If you choose INVEST, the Risk Level MUST be LOW or MEDIUM.
      5. Ensure your 'confidence' score (0-100) reflects how strongly the data supports your recommendation.
      
      Output the final decision strictly matching the required schema. Ensure the reasons clearly justify the decision.
    `;

    const decision = await structuredLlm.invoke(prompt);
    
    // Ensure scores from LLM align roughly with our quant model for consistency
    decision.financialScore = scores.financialScore;
    decision.sentimentScore = scores.sentimentScore;
    
    logger.info(`Agent: Investment Decision completed - ${decision.recommendation}`);
    
    return {
      status: "Report Generation Complete",
      decision
    };
  } catch (error: any) {
    logger.error("Decision Agent failed", error);
    throw new Error(`Investment Decision Agent failed: ${error.message}`);
  }
}
