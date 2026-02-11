"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, ChevronUp } from "lucide-react"
import heartImg from "../../assets/nowCareLogo.png"

const ReasonsSection = () => {
  const [showMore, setShowMore] = useState(false)

  const reasons = [
    {
      title: "Social stigma",
      content:
        "What will people think? What society & my own family will think? People are not ready to accept mental health is sickness and they must treat it similar to any other clinical disease.",
    },
    {
      title: "Lack of self awareness",
      content:
        "Most of the people don't understand themselves and neglect their psychological changes over the time. This is the biggest cause due to which mental disorders are growing at a whirlwind rate.",
    },
    {
      title: "Un-organised healthcare system",
      content:
        "We have little public-awareness of mental health in the entire healthcare ecosystem. Hence on the solutions side also we don't have any structured system to fix the problems/ disorders on preventive bases.",
    },
    {
      title: "Affordability",
      content:
        "India is a large country and there is lots of diversity in terms of culture, languages, environment, geography and financial capacities. A fact which we can't deny is that the majority of people in India can't afford expensive healthcare solutions.",
    },
  ]

  const visibleReasons = showMore ? reasons : reasons.slice(0, 2)

  return (
    <>
      <Helmet>
        <title>Mental Health Barriers & Stigma | Why People Don't Seek Help | Nowcare4U</title>
        <meta
          name="description"
          content="Understanding the main barriers to mental health care in India: social stigma, lack of awareness, healthcare system gaps, and affordability issues. Breaking mental health stigma."
        />
        <meta
          name="keywords"
          content="mental health stigma, barriers to mental healthcare, mental health awareness India, affordable mental health, healthcare system India, psychological help"
        />
        <meta name="author" content="Nowcare4U Mental Health Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Breaking Mental Health Barriers | Nowcare4U" />
        <meta
          property="og:description"
          content="Understanding and addressing the key barriers that prevent people from seeking mental health support in India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/mental-health-barriers" />
        <meta property="og:image" content="https://nowcare4u.com/mental-health-barriers-og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Reasons Why People Don't Seek Mental Health Help",
            description: "Understanding barriers to mental healthcare access in India",
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
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-700"></div>

        {/* Enhanced geometric shapes */}
        <div className="absolute top-20 right-1/4 w-8 h-8 border-2 border-blue-200/30 rotate-45 animate-spin"></div>
        <div className="absolute bottom-20 left-1/3 w-6 h-6 bg-purple-200/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-emerald-200/30 rotate-45 animate-pulse delay-300"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Section */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-6 text-center md:text-left text-gray-900">
              Reasons Why People Don't Seek Help
            </h2>
            <hr className="border-gray-300 mb-6 w-1/2 md:w-3/4 mx-auto md:mx-0" />

            <div className="space-y-6 text-base leading-relaxed tracking-wide text-gray-700">
              {visibleReasons.map((reason, index) => (
                <div
                  key={index}
                  className="transform transition-all duration-500 ease-in-out"
                  style={{
                    opacity: showMore || index < 2 ? 1 : 0,
                    transform: showMore || index < 2 ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <p>
                    <strong className="text-gray-900">{reason.title}</strong> – {reason.content}
                  </p>
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

          {/* Image Section */}
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              {/* Enhanced glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-200 to-purple-200 bg-white/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img
                  src={heartImg || "/placeholder.svg"}
                  alt="Mental health stigma awareness - Nowcare4U logo"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl border border-white/20">
                <span className="text-sm font-bold flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
                  Breaking Stigma
                </span>
              </div>
            </div>
          </div>
        </div>


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

export default ReasonsSection
