import { ChatOpenAI } from "@langchain/openai";
import { AgentState, RiskAnalysisSchema } from "../../types";
import { logger } from "../logger";

const llm = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b",
  temperature: 0.1, // Slight creativity for risk identification
  apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  }
});

export async function riskAgent(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`Agent: Risk Assessment started for ${state.companyName}`);
  
  try {
    const structuredLlm = llm.withStructuredOutput(RiskAnalysisSchema);
    
    const prompt = `
      You are a Chief Risk Officer evaluating an investment in ${state.companyName}.
      Review the following data and perform a comprehensive SWOT analysis and risk assessment.
      Identify both systemic (macro) and company-specific (micro) risks.
      
      Company Info:
      ${JSON.stringify(state.companyInfo, null, 2)}
      
      Financials:
      ${JSON.stringify(state.financials, null, 2)}
      
      Recent News:
      ${JSON.stringify(state.news, null, 2)}
    `;

    const risks = await structuredLlm.invoke(prompt);
    
    logger.info(`Agent: Risk Assessment completed`);
    
    return {
      status: "Finalizing Investment Decision...",
      risks
    };
  } catch (error: any) {
    logger.error("Risk Agent failed", error);
    throw new Error(`Risk Assessment Agent failed: ${error.message}`);
  }
}
