import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "../../types";
import { companyResearchAgent } from "../agents/company";
import { financialAnalysisAgent } from "../agents/finance";
import { newsAgent } from "../agents/news";
import { riskAgent } from "../agents/risk";
import { decisionAgent } from "../agents/decision";
import { logger } from "../logger";

// Define the State structure for the graph
const agentStateChannels = {
  companyName: null,
  status: null,
  error: null,
  companyInfo: null,
  financials: null,
  news: null,
  risks: null,
  decision: null,
  sources: null,
};

// Create the graph
const workflow = new StateGraph<AgentState>({ channels: agentStateChannels as any })
  .addNode("companyResearch", companyResearchAgent as any)
  .addNode("financialAnalysis", financialAnalysisAgent as any)
  .addNode("newsAnalysis", newsAgent as any)
  .addNode("riskAssessment", riskAgent as any)
  .addNode("investmentDecision", decisionAgent as any)
  
  // Define the edges
  .addEdge(START, "companyResearch")
  .addEdge("companyResearch", "financialAnalysis")
  .addEdge("financialAnalysis", "newsAnalysis")
  .addEdge("newsAnalysis", "riskAssessment")
  .addEdge("riskAssessment", "investmentDecision")
  .addEdge("investmentDecision", END);

// Compile the graph
export const researchGraph = workflow.compile();

export async function runResearchWorkflow(companyName: string, onUpdate?: (state: Partial<AgentState>) => void) {
  logger.info(`Starting research workflow for ${companyName}`);
  
  const initialState: AgentState = {
    companyName,
    status: "Initializing Research...",
    sources: []
  };

  try {
    const config = { configurable: { thread_id: `research_${Date.now()}` } };
    
    // Using stream to get updates as each node completes
    const stream = await researchGraph.stream(initialState as any, config);
    
    let finalState: Partial<AgentState> = {};
    
    for await (const chunk of stream) {
      // Chunk contains the output of the node that just finished
      const nodeName = Object.keys(chunk)[0];
      const stateUpdate = (chunk as any)[nodeName];
      
      finalState = { ...finalState, ...stateUpdate };
      
      if (onUpdate) {
        onUpdate(finalState);
      }
    }
    
    logger.info(`Research workflow completed successfully for ${companyName}`);
    return finalState as AgentState;
  } catch (error: any) {
    logger.error("Workflow execution failed", error);
    throw error;
  }
}
