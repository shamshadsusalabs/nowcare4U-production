import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  image: string;
  views?: number;
  comments?: number;
  featured?: boolean;
}

const BlogDetail = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { _id: blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        const response = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/blogs/getById/${blogId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const fetchedPost: BlogPost = {
            id: result.data._id,
            title: result.data.title,
            excerpt: result.data.description.slice(0, 150) + "...",
            content: result.data.description,
            author: result.data.author,
            authorImage:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            date: result.data.createdAt,
            readTime: "10 min read",
            category: result.data.type || "general",
            tags: ["Health", "Nutrition", "Motherhood"],
            image:
              result.data.image?.url ||
              "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            views: 1000,
            comments: 10,
            featured: result.data.type === "latest",
          };
          setBlogPost(fetchedPost);
        } else {
          setError("Blog post not found.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [blogId]);

  const relatedPosts = [
    {
      id: "2",
      title: "Essential Pregnancy Care: A Comprehensive Guide for Expecting Mothers",
      image:
        "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      readTime: "12 min read",
    },
    {
      id: "3",
      title: "The Power of Preventive Healthcare: Investing in Your Future Well-being",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      readTime: "10 min read",
    },
  ];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost?.title || "Blog Post";

    if (navigator.share && isMobile) {
      navigator.share({
        title,
        text: blogPost?.excerpt || "Check out this blog post!",
        url,
      });
    } else {
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
          );
          break;
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
          break;
        case "copy":
          navigator.clipboard.writeText(url);
          alert("Link copied to clipboard!");
          break;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">{error || "Blog post not found."}</p>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{blogPost.title} | Nowcare4U Healthcare Blog</title>
        <meta name="description" content={blogPost.excerpt || "Read more about healthcare insights."} />
        <link rel="canonical" href={`https://nowcare4u.com/blog/${blogPost.id}`} />
      </head>

      <article className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                animation: `float ${Math.random() * 10 + 10}s infinite ${Math.random() * 5}s ease-in-out`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Blog</span>
          </button>

          <header className="mb-12">
            <div className="mb-6 relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                <img
                  src={blogPost.authorImage}
                  alt={blogPost.author}
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                />
                {blogPost.author}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blogPost.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {blogPost.readTime && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {blogPost.readTime}
                </span>
              )}
              {blogPost.views && (
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {blogPost.views.toLocaleString()} views
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* {blogPost.excerpt && <p className="text-xl text-gray-600 mb-8">{blogPost.excerpt}</p>} */}

            {blogPost.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium hover:bg-blue-200 transition-colors"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-b border-gray-200 py-6 gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isLiked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isBookmarked
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 mr-2 hidden sm:inline">Share:</span>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                  aria-label="Copy link"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none mb-16">
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="relative h-40 mb-4 overflow-hidden rounded-xl shadow-md">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;