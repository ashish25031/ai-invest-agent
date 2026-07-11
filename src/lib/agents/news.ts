import { ChatOpenAI } from "@langchain/openai";
import { AgentState, NewsArticleSchema } from "../../types";
import { searchNews } from "../services/search";
import { logger } from "../logger";
import { z } from "zod";

const llm = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b",
  temperature: 0,
  apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  }
});

export async function newsAgent(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`Agent: News & Sentiment started for ${state.companyName}`);
  
  try {
    const rawNews = await searchNews(state.companyName);
    
    if (!rawNews || rawNews.length === 0) {
       return { status: "Assessing Risks...", news: [] };
    }

    // Process sentiment for each article
    const NewsListSchema = z.object({
        articles: z.array(NewsArticleSchema)
    });

    const structuredLlm = llm.withStructuredOutput(NewsListSchema);
    
    const prompt = `
      You are a financial sentiment analyst. Read the following news articles about ${state.companyName}.
      Format the articles and determine the sentiment (BULLISH, BEARISH, NEUTRAL) for each article.
      
      Raw Articles:
      ${JSON.stringify(rawNews, null, 2)}
    `;

    const result = await structuredLlm.invoke(prompt);
    
    logger.info(`Agent: News & Sentiment completed (${result.articles.length} articles)`);
    
    return {
      status: "Assessing Risks...",
      news: result.articles,
      sources: [...state.sources, { name: "News Search", url: "https://gnews.io" }]
    };
  } catch (error: any) {
    logger.error("News Agent failed", error);
    return { status: "Assessing Risks..." }; // Graceful degradation
  }
}
