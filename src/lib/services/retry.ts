import { logger } from "../logger";
import { APP_CONSTANTS } from "../../constants";

export async function withRetry<T>(
  operation: () => Promise<T>,
  context: string,
  maxRetries = APP_CONSTANTS.MAX_RETRIES,
  delayMs = APP_CONSTANTS.RETRY_DELAY_MS
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        logger.info(`Retry attempt ${attempt} for ${context}`);
      }
      return await operation();
    } catch (error: any) {
      lastError = error;
      logger.warn(`Operation failed: ${context} (Attempt ${attempt}/${maxRetries})`, { error: error.message });
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const backoffTime = delayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  logger.error(`All retry attempts failed for ${context}`, lastError);
  throw lastError;
}
