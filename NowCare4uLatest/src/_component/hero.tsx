import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { FaFileMedical, FaBlog, FaInfoCircle, FaPhoneAlt, FaArrowRight, FaTimes } from "react-icons/fa"
import heartImg from "../assets/dash.jpeg"

interface HeroCardProps {
  icon: React.ReactNode
  title: string
  description: string
  bgColor: string
  textColor: string
  hoverEffect: string
  ctaText?: string
}

const HeroCard = ({
  icon,
  title,
  description,
  bgColor,
  textColor,
  hoverEffect,
  ctaText = "Explore",
}: HeroCardProps) => (
  <div
    className={`${bgColor} ${hoverEffect} relative overflow-hidden rounded-2xl p-3 cursor-pointer transition-all duration-300 group h-full flex flex-col min-h-[100px]`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10 flex flex-col h-full">
      <div
        className={`w-10 h-10 ${textColor === "text-white" ? "bg-white/20" : "bg-blue-50"} rounded-xl flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <h3 className={`text-base font-bold ${textColor} mb-2`}>{title}</h3>
      <p
        className={`${textColor === "text-white" ? "text-white/90" : "text-gray-600"} text-xs font-bold mb-3 flex-grow leading-relaxed`}
      >
        {description}
      </p>
      <div className="flex items-center mt-auto">
        <span className={`${textColor} text-xs font-medium`}>{ctaText}</span>
        <FaArrowRight
          className={`ml-2 ${textColor} transition-transform duration-300 group-hover:translate-x-1 text-xs`}
        />
      </div>
    </div>
  </div>
)

const Hero = () => {
  const cards: HeroCardProps[] = [
    {
      icon: <FaFileMedical size={14} className="text-blue-600" />,
      title: "Smart EHR",
      description: "AI-powered digital health records with real-time analytics",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-800",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 hover:scale-105",
    },
    {
      icon: <FaBlog size={14} className="text-emerald-600" />,
      title: "Health Insights",
      description: "Personalized wellness content and medical breakthroughs",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      textColor: "text-emerald-800",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 hover:scale-105",
    },
    {
      icon: <FaInfoCircle size={14} className="text-purple-600" />,
      title: "Innovation Hub",
      description: "Leading healthcare transformation with cutting-edge technology",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-800",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 hover:scale-105",
    },
    {
      icon: <FaPhoneAlt size={14} className="text-white" />,
      title: "Instant Care",
      description: "Round-the-clock medical support and emergency response",
      bgColor: "bg-gradient-to-br from-rose-500 to-pink-500",
      textColor: "text-white",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 hover:scale-105",
      ctaText: "Get Help",
    },
  ]

  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [chatFormData, setChatFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setChatFormData({ ...chatFormData, [name]: value })
    if (error) setError("")
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    console.group("💬 Chat Form Submission Started")
    console.log("📋 Chat Data:", chatFormData)

    try {
      const response = await fetch("https://susaweb-418006.el.r.appspot.com/ChatForm/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatFormData),
      })

      console.log("📨 Response Status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to send message" }))
        console.error("❌ Error Response:", errorData)
        throw new Error(errorData.message || "Failed to send message")
      }

      const result = await response.json()
      console.log("✅ SUCCESS! Response Data:", result)
      console.groupEnd()

      setIsSubmitted(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setIsChatModalOpen(false)
        setChatFormData({ name: "", email: "", phone: "", message: "" })
      }, 3000)
    } catch (err: any) {
      console.error("❌ ERROR:", err)
      console.groupEnd()
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Nowcare4U | Next-Generation Healthcare Platform | AI-Powered Medical Solutions</title>
        <meta
          name="description"
          content="Revolutionary healthcare platform featuring AI-powered EHR systems, telemedicine, personalized wellness insights, and 24/7 medical support. Transform your healthcare experience with cutting-edge technology."
        />
        <meta
          name="keywords"
          content="healthcare, telemedicine, EHR, AI medical, digital health, wellness, medical consultation, health records, healthcare technology, medical innovation"
        />
        <meta name="author" content="Nowcare4U Healthcare Solutions" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Nowcare4U | Next-Generation Healthcare Platform" />
        <meta
          property="og:description"
          content="Experience the future of healthcare with AI-powered medical solutions, smart EHR systems, and 24/7 professional support."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com" />
        <meta property="og:image" content="https://nowcare4u.com/og-image.jpg" />
        <meta property="og:site_name" content="Nowcare4U" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nowcare4U | AI-Powered Healthcare Solutions" />
        <meta
          name="twitter:description"
          content="Revolutionary healthcare platform with smart EHR, telemedicine, and instant medical support."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/twitter-image.jpg" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="canonical" href="https://nowcare4u.com" />
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4 lg:py-6 px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Modern background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:24px_24px]"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            {/* Image section */}
            <div className="lg:w-1/2 w-full">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={heartImg || "/placeholder.svg"}
                  alt="Advanced Healthcare Technology Dashboard"
                  className="relative w-full max-w-sm mx-auto rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1"
                  loading="eager"
                  width={400}
                  height={400}
                />
                <div
                  onClick={() => setIsChatModalOpen(true)}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-4 py-2 rounded-xl shadow-xl border border-white/20 cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <span className="text-white font-bold text-sm flex items-center">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
                    chat support
                  </span>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="lg:w-1/2 w-full">
              <div className="mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-4 border border-blue-200/50 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 animate-pulse"></div>
                  Next-Gen Healthcare
                </div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Intelligent Healthcare
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 animate-gradient">
                    Solutions
                  </span>
                </h1>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed font-medium">
                  Experience revolutionary medical care powered by AI, featuring smart diagnostics, personalized
                  treatment plans, and seamless digital health management.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {cards.map((card, index) => (
                  <HeroCard key={index} {...card} />
                ))}
              </div>

              {/* Stats section */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-bold text-blue-600">50K+</div>
                  <div className="text-xs text-gray-500">Patients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-bold text-emerald-600">99.9%</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => setIsChatModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {isSubmitted ? (
              // Success state
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Message!</h3>
                <p className="text-gray-600">Our team will contact you soon.</p>
              </div>
            ) : (
              // Form state
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chat with Team</h3>
                <p className="text-gray-600 mb-6 text-sm">Send us a message and we'll get back to you soon.</p>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleChatSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={chatFormData.name}
                      onChange={handleChatInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={chatFormData.email}
                      onChange={handleChatInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={chatFormData.phone}
                      onChange={handleChatInputChange}
                      placeholder="+1 6766555"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={chatFormData.message}
                      onChange={handleChatInputChange}
                      placeholder="How can we help you?"
                      rows={4}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Hero
