"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, ChevronUp, Shield, Database, Users, Cpu, Video, Phone } from "lucide-react"
import heartImg from "../../assets/nowCareLogo.png"

const SystematicProcedure = () => {
  const [showMore, setShowMore] = useState(false)

  const procedures = [
    {
      title: "Preventive Mental Healthcare",
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      content:
        "NowCare4u works like a protective layer for you and provides mental immunization. That's the reason we call ourselves preventive healthcare. Our Platform gives access to our digital knowledge base where students/ teachers and any other staff can practice and train their brain.",
    },
    {
      title: "Smart Content Delivery",
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      content:
        "We deliver specific content to every individual and the content is scientific and developed by the experts. In today's era you can find content anywhere over the internet but we have smart algorithms that work for you smartly and give the feed as per your requirements very specific and precise.",
    },
    {
      title: "Continuous Engagement",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      content:
        "NowCare4u also focuses on continuous engagement and regular discussion with users for which there are some motivational programs available on the platform for the users. Our therapist and specialist will address queries of individuals and also perform diagnosis in a defined environment. We have an on call support eco-system to help people.",
    },
    {
      title: "AI-Powered Solutions",
      icon: <Cpu className="w-6 h-6 text-rose-600" />,
      content:
        "NowCare4u believes in technology and sees the future in systems and that's the reason we use immense data power and spin Ml & AI with our solution for diagnosis, feedback and for analytics. These programmes also have some kind of special conferences/ webinars where our experts address & discuss the challenges on mental health and solutions along with success stories.",
    },
  ]

  const visibleProcedures = showMore ? procedures : procedures.slice(0, 2)

  return (
    <>
      <Helmet>
        <title>Systematic Mental Health Procedure | AI-Powered Preventive Care | Nowcare4U</title>
        <meta
          name="description"
          content="Systematic approach to mental health: preventive care, smart content delivery, continuous engagement, and AI-powered solutions. Digital mental health platform with expert support."
        />
        <meta
          name="keywords"
          content="preventive mental healthcare, AI mental health, digital mental health platform, smart algorithms, mental health technology, continuous engagement, expert support"
        />
        <meta name="author" content="Nowcare4U Technology Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Systematic Mental Health Procedure | Nowcare4U" />
        <meta
          property="og:description"
          content="Revolutionary systematic approach to mental healthcare using AI, smart algorithms, and continuous engagement."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/systematic-procedure" />
        <meta property="og:image" content="https://nowcare4u.com/systematic-procedure-og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "A Systematic Procedure to Touch Lives",
            description: "Comprehensive systematic approach to mental healthcare delivery",
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
          {/* Text Section - Left Side */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-6 text-center md:text-left text-gray-900">
              A Systematic procedure to touch the lives
            </h2>
            <hr className="border-gray-300 mb-6 w-1/2 md:w-3/4 mx-auto md:mx-0" />

            <div className="space-y-6 text-base leading-relaxed tracking-wide text-gray-700">
              {visibleProcedures.map((procedure, index) => (
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
                      {procedure.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{procedure.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{procedure.content}</p>
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

          {/* Image Section - Right Side */}
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              {/* Enhanced glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-200 to-purple-200 bg-white/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img
                  src={heartImg || "/placeholder.svg"}
                  alt="Systematic mental health procedure - Nowcare4U comprehensive approach"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/20">
                <span className="text-xs font-bold flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Preventive Care
                </span>
              </div>

              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/20">
                <span className="text-xs font-bold flex items-center">
                  <Cpu className="w-3 h-3 mr-1" />
                  AI Powered
                </span>
              </div>

              {/* Additional floating elements */}
              <div className="absolute top-1/4 -right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full shadow-lg">
                <Video className="w-4 h-4" />
              </div>

              <div className="absolute bottom-1/4 -left-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white p-2 rounded-full shadow-lg">
                <Phone className="w-4 h-4" />
              </div>
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

export default SystematicProcedure
