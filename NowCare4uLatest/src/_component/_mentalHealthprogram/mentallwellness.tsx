"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, ChevronUp, Target, Brain, Heart, Lightbulb } from "lucide-react"
import heartImg from "../assets/nowCareLogo.png"

const MentalWellnessApproach = () => {
  const [showMore, setShowMore] = useState(false)

  const approaches = [
    {
      title: "Knowing",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      content:
        "Identifying your own personality, knowing your positive and negative, inner peace, inner strength & weakness, personality traits, skills and most of the influencing things which work to make your decisions.",
    },
    {
      title: "Correction",
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      content:
        "No one is born perfect in this universe, so one needs to work and practice constantly on weakness and strength both. We help people to know both and then NowCare4u programs help them with techniques of corrections for eliminating errors and sharpen their strength and skills.",
    },
    {
      title: "Setting up Goals",
      icon: <Lightbulb className="w-6 h-6 text-purple-600" />,
      content:
        "As we all talk about clarity in life. Every buddy talks about how one should have clarity in thoughts. To set up goals, to set up plans, to set up milestones. So we must say clarity is something important and mandatory. NowCare4u helps every individual with scientific theories and maths calculations to generate clarity and discipline.",
    },
    {
      title: "Mastering Emotions",
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      content:
        "Our Emotions are our strengths and the weaknesses too. And this is one of the hottest topics in psychology. We help our people to understand emotions correctly and make decisions in life wisely. We work on data, research and facts. We also have one recommendation system which enables you to make the right choice at the right time to have a happy and healthy life.",
    },
  ]

  const visibleApproaches = showMore ? approaches : approaches.slice(0, 2)

  return (
    <>
      <Helmet>
        <title>Mental Wellness Approach | Self-Awareness & Emotional Mastery | Nowcare4U</title>
        <meta
          name="description"
          content="Comprehensive mental wellness approach: self-awareness, personality correction, goal setting, and emotional mastery. Scientific methods for personal growth and mental health."
        />
        <meta
          name="keywords"
          content="mental wellness, self awareness, personality development, goal setting, emotional intelligence, personal growth, psychology, mental health approach"
        />
        <meta name="author" content="Nowcare4U Mental Wellness Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Mental Wellness Approach | Nowcare4U" />
        <meta
          property="og:description"
          content="Scientific approach to mental wellness through self-awareness, correction, goal setting, and emotional mastery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/mental-wellness-approach" />
        <meta property="og:image" content="https://nowcare4u.com/mental-wellness-og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Comprehensive Mental Wellness Approach",
            description: "Four-step approach to mental wellness and personal development",
            author: {
              "@type": "Organization",
              name: "Nowcare4U",
            },
            publisher: {
              "@type": "Organization",
              name: "Nowcare4U",
              logo: {
                "@type": "ImageObject",
                url: "https://nowcare4u.com/logo.png",
              },
            },
          })}
        </script>
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 px-6 md:px-20 overflow-hidden">
        {/* Advanced background patterns - matching other sections */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:48px_48px] opacity-50"></div>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 left-1/3 w-28 h-28 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-700"></div>

        {/* Enhanced geometric shapes */}
        <div className="absolute top-20 left-1/4 w-8 h-8 border-2 border-blue-200/30 rotate-45 animate-spin"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-purple-200/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/4 right-1/2 w-4 h-4 bg-emerald-200/30 rotate-45 animate-pulse delay-300"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Image Section - Left Side */}
          <div className="flex-1 flex justify-center order-2 md:order-1">
            <div className="relative group">
              {/* Enhanced glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-200 to-purple-200 bg-white/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img
                  src={heartImg || "/placeholder.svg"}
                  alt="Mental wellness approach - Nowcare4U comprehensive care"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-xl border border-white/20">
                <span className="text-sm font-bold flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
                  Holistic Care
                </span>
              </div>
            </div>
          </div>

          {/* Text Section - Right Side */}
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-6 text-center md:text-left text-gray-900">
             Key benefits this solution bring in your life
            </h2>
            <hr className="border-gray-300 mb-6 w-1/2 md:w-3/4 mx-auto md:mx-0" />

            <div className="space-y-6 text-base leading-relaxed tracking-wide text-gray-700">
              {visibleApproaches.map((approach, index) => (
                <div
                  key={index}
                  className="transform transition-all duration-500 ease-in-out bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    opacity: showMore || index < 2 ? 1 : 0,
                    transform: showMore || index < 2 ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-blue-200/50">
                      {approach.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{approach.title}:</h3>
                      <p className="text-gray-700 leading-relaxed">{approach.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            <div className="mt-8 text-center md:text-left">
              <button
                onClick={() => setShowMore(!showMore)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>{showMore ? "Read Less" : "Show More"}</span>
                {showMore ? (
                  <ChevronUp className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
      <style>{`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 8s linear infinite;
  }
`}</style>
      </section>
    </>
  )
}

export default MentalWellnessApproach
