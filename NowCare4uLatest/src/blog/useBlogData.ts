"use client"

import { useState, useEffect, useCallback } from "react"
import { useBlogCache } from "./useBlogCache"

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

export const useBlogData = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getCachedData, setCachedData, clearExpiredCache } = useBlogCache()

  // Clear expired cache on mount
  useEffect(() => {
    clearExpiredCache()
  }, [clearExpiredCache])

  // Fetch blogs with caching
  const fetchBlogs = useCallback(
    async (page = 1, category = "all", limit = 6, forceRefresh = false): Promise<BlogResponse | null> => {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData(page, category)
        if (cachedData) {

          return cachedData
        }
      }

      setIsLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(category !== "all" && { type: category }),
        })


        const response = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/blogs/getAll?${queryParams}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: BlogResponse = await response.json()

        if (data.success) {
          // Cache the data
          setCachedData(page, category, data)

          return data
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setError(errorMessage)
        console.error("Error fetching blogs:", error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [getCachedData, setCachedData],
  )

  // Fetch featured posts with caching
  const fetchFeaturedPosts = useCallback(
    async (forceRefresh = false): Promise<BlogPost[]> => {
      const cachedData = getCachedData(1, "featured")
      if (!forceRefresh && cachedData) {

        return cachedData.data
      }

      try {

        const response = await fetch("https://nowcare4-u-production-acbz.vercel.app/api/blogs/getAll?type=featured&limit=4")
        const data: BlogResponse = await response.json()

        if (data.success) {
          setCachedData(1, "featured", data)

          return data.data
        }
        return []
      } catch (error) {
        console.error("Error fetching featured blogs:", error)
        return []
      }
    },
    [getCachedData, setCachedData],
  )

  return {
    fetchBlogs,
    fetchFeaturedPosts,
    isLoading,
    error,
  }
}
