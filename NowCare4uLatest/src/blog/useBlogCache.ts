"use client"

import { useState, useEffect, useCallback } from "react"

interface BlogPost {
  _id: string
  title: string
  description: string
  type: string
  image: {
    url: string
  }
  author: string
  createdAt: string
  updatedAt: string
}

interface BlogResponse {
  success: boolean
  count: number
  total: number
  pages: number
  currentPage: number
  data: BlogPost[]
}

interface CacheData {
  data: BlogResponse
  timestamp: number
  searchTerm?: string
}

interface CacheStore {
  [key: string]: CacheData
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY = "blog_cache"

export const useBlogCache = () => {
  const [cache, setCache] = useState<CacheStore>({})

  // Load cache from sessionStorage on mount
  useEffect(() => {
    try {
      const savedCache = sessionStorage.getItem(CACHE_KEY)
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache)
        setCache(parsedCache)
      }
    } catch (error) {
      console.error("Error loading cache:", error)
    }
  }, [])

  // Save cache to sessionStorage whenever cache changes
  useEffect(() => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error("Error saving cache:", error)
    }
  }, [cache])

  // Generate cache key
  const generateCacheKey = useCallback((page: number, category: string, searchTerm = "") => {
    return `${category}_page_${page}_search_${searchTerm}`
  }, [])

  // Check if cache is valid
  const isCacheValid = useCallback((cacheData: CacheData) => {
    return Date.now() - cacheData.timestamp < CACHE_DURATION
  }, [])

  // Get data from cache
  const getCachedData = useCallback(
    (page: number, category: string, searchTerm = "") => {
      const key = generateCacheKey(page, category, searchTerm)
      const cachedData = cache[key]

      if (cachedData && isCacheValid(cachedData)) {
        return cachedData.data
      }
      return null
    },
    [cache, generateCacheKey, isCacheValid],
  )

  // Set data in cache
  const setCachedData = useCallback(
    (page: number, category: string, data: BlogResponse, searchTerm = "") => {
      const key = generateCacheKey(page, category, searchTerm)
      setCache((prev) => ({
        ...prev,
        [key]: {
          data,
          timestamp: Date.now(),
          searchTerm,
        },
      }))
    },
    [generateCacheKey],
  )

  // Clear specific cache
  const clearCache = useCallback(
    (page?: number, category?: string) => {
      if (page && category) {
        const key = generateCacheKey(page, category)
        setCache((prev) => {
          const newCache = { ...prev }
          delete newCache[key]
          return newCache
        })
      } else {
        // Clear all cache
        setCache({})
        sessionStorage.removeItem(CACHE_KEY)
      }
    },
    [generateCacheKey],
  )

  // Clear expired cache
  const clearExpiredCache = useCallback(() => {
    setCache((prev) => {
      const newCache: CacheStore = {}
      Object.entries(prev).forEach(([key, value]) => {
        if (isCacheValid(value)) {
          newCache[key] = value
        }
      })
      return newCache
    })
  }, [isCacheValid])

  return {
    getCachedData,
    setCachedData,
    clearCache,
    clearExpiredCache,
  }
}
