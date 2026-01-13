"use client"
import { useState, useEffect, useCallback } from "react"
import { Helmet } from "react-helmet-async"
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Heart,
  TrendingUp,
  X,
  ArrowRight,
  Bookmark,
  Share2,
  RefreshCw,
} from "lucide-react"
import { useMediaQuery } from "react-responsive"
import { useBlogData } from "./useBlogData"
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

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [isBookmarked, setIsBookmarked] = useState<Record<string, boolean>>({})
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const postsPerPage = 6
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" })

  const { fetchBlogs, fetchFeaturedPosts, isLoading, error } = useBlogData()
  const { clearCache } = useBlogCache()

  const categories = [
    { id: "all", name: "All Posts", icon: <Heart className="w-4 h-4" /> },
    { id: "featured", name: "Featured", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "latest", name: "Latest", icon: <Clock className="w-4 h-4" /> },
  ]

  // Function to truncate text to exactly 30 words
  const truncateToWords = (text: string, wordCount = 30) => {
    const words = text.replace(/<[^>]*>/g, "").split(" ")
    if (words.length <= wordCount) return words.join(" ")
    return words.slice(0, wordCount).join(" ") + "..."
  }

  // Load blogs with caching
  const loadBlogs = useCallback(
    async (page = 1, category = "all", forceRefresh = false) => {
      const data = await fetchBlogs(page, category, postsPerPage, forceRefresh)
      if (data) {
        setBlogPosts(data.data)
        setTotalPages(data.pages)
        setTotalPosts(data.total)
        setCurrentPage(data.currentPage)
        setLastFetchTime(new Date())
      }
    },
    [fetchBlogs],
  )

  // Load featured posts with caching
  const loadFeaturedPosts = useCallback(
    async (forceRefresh = false) => {
      const data = await fetchFeaturedPosts(forceRefresh)
      setFeaturedPosts(data)
    },
    [fetchFeaturedPosts],
  )

  // Initial load
  useEffect(() => {
    loadBlogs(1, selectedCategory)
    if (selectedCategory === "all") {
      loadFeaturedPosts()
    }
  }, [selectedCategory, loadBlogs, loadFeaturedPosts])

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      loadBlogs(page, selectedCategory)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [selectedCategory, loadBlogs],
  )

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  // Force refresh data
  const handleRefresh = useCallback(() => {
    loadBlogs(currentPage, selectedCategory, true)
    if (selectedCategory === "all") {
      loadFeaturedPosts(true)
    }
  }, [currentPage, selectedCategory, loadBlogs, loadFeaturedPosts])

  // Clear all cache
  const handleClearCache = useCallback(() => {
    clearCache()
    loadBlogs(1, selectedCategory, true)
    if (selectedCategory === "all") {
      loadFeaturedPosts(true)
    }
    setCurrentPage(1)
  }, [clearCache, selectedCategory, loadBlogs, loadFeaturedPosts])

  // Filter posts based on search term (client-side filtering for current page)
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const sharePost = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: truncateToWords(post.description, 20),
        url: `${window.location.origin}/blog/${post._id}`,
      })
    } else {
      alert(`Share this post: ${post.title}\n${window.location.origin}/blog/${post._id}`)
    }
  }

  const toggleBookmark = (id: string) => {
    setIsBookmarked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (selectedBlog) {
    window.location.href = `/blog-details/${selectedBlog._id}`
    return null
  }

  return (
    <>
      <Helmet>
        <title>Healthcare Blog | Expert Insights & Research | Nowcare4U</title>
        <meta
          name="description"
          content="Stay informed with the latest healthcare insights, research findings, and expert advice on mental health, pregnancy care, preventive medicine, and medical innovations."
        />
        <link rel="canonical" href="https://nowcare4u.com/blog" />
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-4 border border-blue-200/50 shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Healthcare Insights
              {lastFetchTime && (
                <span className="ml-2 text-xs opacity-75">• Last updated: {lastFetchTime.toLocaleTimeString()}</span>
              )}
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Healthcare{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                Blog & Research
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest healthcare insights, research findings, and expert advice from leading
              medical professionals
            </p>
          </div>

          {/* Cache Controls */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleClearCache}
                className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700">
              <p>Error: {error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-10 space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 w-max md:w-full px-4 md:px-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white/80 text-gray-700 hover:bg-blue-50 border border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 rounded-2xl overflow-hidden shadow-lg border border-white/50 animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Latest Articles Section */}
          {!isLoading && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-4"></div>
                {selectedCategory === "all"
                  ? "Latest Articles"
                  : categories.find((c) => c.id === selectedCategory)?.name + " Articles"}
                <span className="ml-3 text-sm font-normal text-gray-500">({totalPosts} articles)</span>
              </h2>

              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                      <article
                        key={post._id}
                        className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50 hover:-translate-y-2 cursor-pointer"
                        onClick={() => setSelectedBlog(post)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.image.url || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {post.type === "featured" && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                              Featured
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBookmark(post._id)
                              }}
                              className={`p-2 rounded-full ${isBookmarked[post._id] ? "bg-yellow-400 text-yellow-800" : "bg-white/90 text-gray-700"} shadow-md hover:scale-110 transition-all`}
                            >
                              <Bookmark className="w-4 h-4" fill={isBookmarked[post._id] ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                sharePost(post)
                              }}
                              className="ml-2 p-2 rounded-full bg-white/90 text-gray-700 shadow-md hover:scale-110 transition-all"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                              <span className="truncate max-w-[100px]">{post.author}</span>
                            </div>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {truncateToWords(post.description, 30)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {isMobile && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    sharePost(post)
                                  }}
                                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                              )}
                              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                  : "border border-gray-200 hover:bg-gray-50"
                              } transition-colors`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}

                        <button
                          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center mx-auto"
                  >
                    Reset Filters
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Featured Posts Section */}
          {!isLoading && selectedCategory === "all" && featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post) => (
                  <article
                    key={post._id}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2 cursor-pointer"
                    onClick={() => setSelectedBlog(post)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image.url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Featured
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(post._id)
                          }}
                          className={`p-2 rounded-full ${isBookmarked[post._id] ? "bg-yellow-400 text-yellow-800" : "bg-white/90 text-gray-700"} shadow-md hover:scale-110 transition-all`}
                        >
                          <Bookmark className="w-5 h-5" fill={isBookmarked[post._id] ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            sharePost(post)
                          }}
                          className="ml-2 p-2 rounded-full bg-white/90 text-gray-700 shadow-md hover:scale-110 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">{post.author}</div>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{truncateToWords(post.description, 30)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS */}
        <style>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }
          .animate-float {
            animation: float 15s ease-in-out infinite;
          }
        `}</style>
      </section>
    </>
  )
}

export default Blogs
