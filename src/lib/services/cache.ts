interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory request/data cache across server actions and page renders
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Retrieve cached data if not expired.
 */
export function getCachedData<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Store data with a short TTL (defaults to 15 seconds).
 */
export function setCachedData<T>(key: string, data: T, ttlSeconds = 15): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Invalidate all cache keys matching a prefix (e.g., when a user mutates data).
 */
export function invalidateCache(prefix: string): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}
