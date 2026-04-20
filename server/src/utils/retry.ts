export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 2000,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, shouldRetry } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const isRetryable = shouldRetry ? shouldRetry(err) : true;
      const isLastAttempt = attempt === maxAttempts;

      if (!isRetryable || isLastAttempt) {
        console.error(
          `[retry] Attempt ${attempt}/${maxAttempts} failed — giving up.`,
          err
        );
        break;
      }

      const exponential = baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * baseDelayMs;
      const delay = Math.min(exponential + jitter, maxDelayMs);

      console.warn(
        `[retry] Attempt ${attempt}/${maxAttempts} failed — retrying in ${Math.round(delay)}ms.`,
        err instanceof Error ? err.message : err
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
