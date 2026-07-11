import { cache } from '../cache';
import { CACHE_TTL } from '../../constants';
import { withRetry } from './retry';
import { logger } from '../logger';
import { ChatOpenAI } from "@langchain/openai";

export async function searchCompanyInfo(companyName: string) {
  const cacheKey = `search_${companyName}`;
  const cachedData = cache.get<string>(cacheKey);
  
  if (cachedData) {
    logger.info(`Cache hit for company search: ${companyName}`);
    return cachedData;
  }

  return withRetry(
    async () => {
      logger.info(`Searching info for ${companyName}`);
      
      const tavilyKey = process.env.TAVILY_API_KEY;
      
      if (tavilyKey) {
        // Implement Tavily search
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: `Comprehensive business overview, industry, competitors, and business model for ${companyName}`,
            search_depth: "basic",
            include_answer: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.answer || data.results.map((r: any) => r.content).join('\n');
          cache.set(cacheKey, result, CACHE_TTL.COMPANY_INFO);
          return result;
        }
        logger.warn(`Tavily search failed for ${companyName}. Falling back to LLM knowledge.`);
      }

      // Fallback: Ask Gemini directly if no search API is available
      logger.info(`Using LLM fallback for ${companyName} search (No Tavily API key)`);
      const llm = new ChatOpenAI({
        model: "nvidia/nemotron-3-ultra-550b-a55b",
        temperature: 0,
        apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
        configuration: {
          baseURL: "https://integrate.api.nvidia.com/v1",
        }
      });
      
      const response = await llm.invoke(`Provide a comprehensive business overview, industry classification, competitors, and business model for the company: ${companyName}. Be factual and detailed.`);
      const result = response.content.toString();
      cache.set(cacheKey, result, CACHE_TTL.COMPANY_INFO);
      return result;
    },
    `search_${companyName}`
  );
}

export async function searchNews(companyName: string) {
  const cacheKey = `news_${companyName}`;
  const cachedData = cache.get<any[]>(cacheKey);
  
  if (cachedData) {
    logger.info(`Cache hit for news search: ${companyName}`);
    return cachedData;
  }

  return withRetry(
    async () => {
      logger.info(`Fetching news for ${companyName}`);
      
      const newsApiKey = process.env.NEWS_API_KEY; // Optional GNews or NewsAPI key
      
      if (newsApiKey) {
        // Implement GNews search
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(companyName)}&lang=en&max=5&apikey=${newsApiKey}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const articles = data.articles.map((a: any) => ({
            title: a.title,
            url: a.url,
            source: a.source.name,
            publishedAt: a.publishedAt,
            description: a.description
          }));
          cache.set(cacheKey, articles, CACHE_TTL.NEWS);
          return articles;
        }
        logger.warn(`News API failed for ${companyName}. Falling back to simulated news.`);
      }

      // Fallback: Ask Gemini to simulate recent news or provide general knowledge
      logger.info(`Using LLM fallback for ${companyName} news (No News API key)`);
      const llm = new ChatOpenAI({
        model: "nvidia/nemotron-3-ultra-550b-a55b",
        temperature: 0.2,
        apiKey: process.env.NVIDIA_API_KEY || "dummy_key",
        configuration: {
          baseURL: "https://integrate.api.nvidia.com/v1",
        }
      });
      
      const response = await llm.invoke(`Generate 3 realistic, fact-based recent news headlines and short descriptions for the company: ${companyName}. Format exactly as JSON array of objects with keys: title, url (make one up), source, publishedAt (ISO date), description.`);
      try {
        // Strip markdown if present
        let text = response.content.toString();
        if (text.startsWith("```json")) {
           text = text.replace(/```json\n?/, '').replace(/```\n?$/, '');
        }
        const articles = JSON.parse(text);
        cache.set(cacheKey, articles, CACHE_TTL.NEWS);
        return articles;
      } catch (e) {
        return [];
      }
    },
    `news_${companyName}`
  );
}
