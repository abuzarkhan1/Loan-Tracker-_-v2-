import { logger } from "../config/logger";

type CacheEntry = {
  expiresAt: number;
  value: string;
};

const memoryCache = new Map<string, CacheEntry>();

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    logger.warn("cache_parse_failed", { error });
    return null;
  }
};

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = memoryCache.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        memoryCache.delete(key);
        return null;
      }
      return safeJsonParse<T>(entry.value);
    } catch (error) {
      logger.warn("cache_get_failed", { key, error });
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds: number) {
    try {
      memoryCache.set(key, {
        expiresAt: Date.now() + ttlSeconds * 1000,
        value: JSON.stringify(value),
      });
      return true;
    } catch (error) {
      logger.warn("cache_set_failed", { key, error });
      return false;
    }
  },

  async del(key: string) {
    try {
      return memoryCache.delete(key) ? 1 : 0;
    } catch (error) {
      logger.warn("cache_del_failed", { key, error });
      return 0;
    }
  },

  async delByPattern(pattern: string) {
    try {
      const regex = new RegExp(`^${pattern.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`);
      let deleted = 0;
      for (const key of memoryCache.keys()) {
        if (regex.test(key)) {
          memoryCache.delete(key);
          deleted += 1;
        }
      }
      return deleted;
    } catch (error) {
      logger.warn("cache_del_pattern_failed", { pattern, error });
      return 0;
    }
  },
};
