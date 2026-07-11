import YahooFinance from 'yahoo-finance2';
import { cache } from '../cache';
import { CACHE_TTL } from '../../constants';
import { withRetry } from './retry';
import { logger } from '../logger';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function getFinancialData(ticker: string) {
  const cacheKey = `finance_${ticker}`;
  const cachedData = cache.get<any>(cacheKey);
  
  if (cachedData) {
    logger.info(`Cache hit for financial data: ${ticker}`);
    return cachedData;
  }

  return withRetry(
    async () => {
      logger.info(`Fetching financial data for ${ticker} from Yahoo Finance`);
      
      // Resolve the best ticker symbol by searching
      let searchTicker = ticker;
      try {
        const searchResults = await yahooFinance.search(ticker);
        if (searchResults.quotes && searchResults.quotes.length > 0) {
          // Grab the most relevant equity ticker
          const bestMatch = searchResults.quotes.find(q => q.quoteType === 'EQUITY') || searchResults.quotes[0];
          if (bestMatch && bestMatch.symbol) {
            searchTicker = bestMatch.symbol;
            logger.info(`Resolved query "${ticker}" to ticker symbol: ${searchTicker}`);
          }
        }
      } catch (e) {
        logger.warn(`Ticker search failed for ${ticker}, proceeding with original string.`);
      }

      // We suppress yahoo finance notices for cleaner logs
      const quote = await yahooFinance.quote(searchTicker) as any;
      
      if (!quote) {
        throw new Error(`Yahoo Finance returned no data for ticker: ${searchTicker}`);
      }
      
      const metrics: any = {
        marketCap: quote.marketCap,
        revenue: quote.totalRevenue, // might not always be available on quote, might need quoteSummary
        peRatio: quote.trailingPE || quote.forwardPE,
        currency: quote.currency || 'USD',
        regularMarketPrice: quote.regularMarketPrice,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      };

      // Let's also fetch quoteSummary for more detailed financials if needed
      try {
        const summary = await yahooFinance.quoteSummary(searchTicker, { modules: ['financialData', 'defaultKeyStatistics'] }) as any;
        
        if (summary.financialData) {
          metrics.revenue = summary.financialData.totalRevenue;
          metrics.revenueGrowth = summary.financialData.revenueGrowth;
          metrics.profitMargin = summary.financialData.profitMargins;
          metrics.debtToEquity = summary.financialData.debtToEquity;
        }
      } catch (e) {
        logger.warn(`Could not fetch detailed summary for ${ticker}, using basic quote data.`);
      }

      cache.set(cacheKey, metrics, CACHE_TTL.FINANCIALS);
      return metrics;
    },
    `fetchFinance_${ticker}`
  );
}
