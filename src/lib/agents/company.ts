import { ChatOpenAI } from "@langchain/openai";
import { AgentState, CompanyInfoSchema } from "../../types";
import { searchCompanyInfo } from "../services/search";
import { logger } from "../logger";

const llm = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b",
  temperature: 0,
  apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  }
});

export async function companyResearchAgent(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`Agent: Company Research started for ${state.companyName}`);
  
  try {
    // 1. Gather raw data using our search service
    const rawData = await searchCompanyInfo(state.companyName);
    
    // 2. Use LLM to structure the raw data strictly against our Zod schema
    const structuredLlm = llm.withStructuredOutput(CompanyInfoSchema);
    
    const prompt = `
      You are an expert financial analyst. Based on the following raw information about a company, 
      extract the structured details required.
      
      Company Name Requested: ${state.companyName}
      
      Raw Information:
      ${rawData}
    `;

    const companyInfo = await structuredLlm.invoke(prompt);
    
    logger.info(`Agent: Company Research completed for ${companyInfo.name}`);
    
    if (companyInfo.isInvestableCompany === false) {
      return {
        status: "Aborted",
        error: `The entity "${state.companyName}" does not appear to be a recognized or investable corporate entity. Please enter a valid public or notable private company.`
      };
    }
    
    return {
      status: "Analyzing Financials...",
      companyInfo,
      sources: [{ name: "Company Research", url: "https://duckduckgo.com" }]
    };
  } catch (error: any) {
    logger.error("Company Research Agent failed", error);
    throw new Error(`Company Research Agent failed: ${error.message}`);
  }
}
