// Cache Time To Live (in seconds)
export const CACHE_TTL = {
  COMPANY_INFO: 60 * 60 * 24, // 24 hours
  FINANCIALS: 60 * 60,        // 1 hour
  NEWS: 60 * 60 * 4,          // 4 hours
};

// Decision Model Weights
export const DECISION_WEIGHTS = {
  FINANCIAL_HEALTH: 0.30,
  GROWTH_POTENTIAL: 0.20,
  RISK_PROFILE: 0.20,
  COMPETITIVE_POSITION: 0.15,
  NEWS_SENTIMENT: 0.15,
};

// Application Constants
export const APP_CONSTANTS = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  DEFAULT_MODEL: "nvidia/nemotron-3-ultra-550b-a55b",
};
