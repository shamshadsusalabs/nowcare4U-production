"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Mail, User, Phone, Send, Briefcase, CheckCircle, FileText, Building, Users, Award } from "lucide-react"

interface FormData {
  email: string
  name: string
  phone: string
  resume: File | null
}

const CareerForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    phone: "",
    resume: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "resume" && files) {
      setFormData({ ...formData, resume: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(formData)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        email: "",
        name: "",
        phone: "",
        resume: null,
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Application Submitted Successfully | Nowcare4U Careers</title>
          <meta
            name="description"
            content="Your job application has been submitted successfully. We'll review your application and get back to you soon."
          />
        </Helmet>

        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen flex items-center justify-center p-4 overflow-hidden">
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
          </div>

          <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/50">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in joining our team. We'll review your application and get back to you within
              2-3 business days.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Join Our Team | Healthcare Careers at Nowcare4U | Apply Now</title>
        <meta
          name="description"
          content="Join Nowcare4U's innovative healthcare team. We're hiring talented professionals including developers, designers, healthcare specialists, and medical consultants. Apply now for exciting career opportunities."
        />
        <meta
          name="keywords"
          content="healthcare careers, medical jobs, developer jobs, healthcare technology careers, remote healthcare jobs, medical consultant jobs, healthcare startup careers, nowcare4u jobs"
        />
        <meta name="author" content="Nowcare4U Healthcare Platform" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Join Our Healthcare Innovation Team | Nowcare4U Careers" />
        <meta
          property="og:description"
          content="Be part of the future of healthcare technology. Join our team of passionate professionals working to transform healthcare delivery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/careers" />
        <meta property="og:image" content="https://nowcare4u.com/careers-og-image.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Healthcare Careers | Nowcare4U" />
        <meta
          name="twitter:description"
          content="Join our innovative healthcare technology team. Multiple positions available."
        />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: "Healthcare Technology Careers",
            description: "Join Nowcare4U's innovative healthcare team",
            hiringOrganization: {
              "@type": "Organization",
              name: "Nowcare4U",
              sameAs: "https://nowcare4u.com",
            },
            jobLocation: {
              "@type": "Place",
              addressLocality: "Remote",
              addressCountry: "IN",
            },
            employmentType: "FULL_TIME",
            datePosted: new Date().toISOString(),
          })}
        </script>
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-[80vh] py-4 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
        {/* Advanced background patterns - matching other sections */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:48px_48px] opacity-50"></div>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-1/4 w-8 h-8 border-2 border-blue-200/30 rotate-45 animate-spin"></div>
        <div className="absolute bottom-20 left-1/3 w-6 h-6 bg-purple-200/20 rounded-full animate-bounce delay-700"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left side - Company info */}
            <div className="lg:w-1/2 w-full">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-4 border border-blue-200/50 shadow-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                Join Our Healthcare Revolution
              </div>

              <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                Build the Future of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                  Healthcare
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Join our passionate team of innovators, developers, and healthcare professionals who are transforming
                the way people access and experience healthcare.
              </p>

              {/* Company stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                  <Building className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600">5+</div>
                  <div className="text-xs text-blue-700">Years</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                  <Users className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-emerald-600">100+</div>
                  <div className="text-xs text-emerald-700">Team Members</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-purple-600">50K+</div>
                  <div className="text-xs text-purple-700">Patients Served</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Why Join Us?</h3>
                {[
                  "Competitive salary & equity options",
                  "Flexible remote work environment",
                  "Comprehensive health benefits",
                  "Professional development opportunities",
                  "Make a real impact on healthcare",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Application form */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 border border-white/50 hover:shadow-3xl transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply Now</h2>
                  <p className="text-gray-600">Join our innovative healthcare team</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Resume</label>
                    <div className="relative">
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-white file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 hover:file:from-blue-700 hover:file:to-purple-700 file:transition-all file:duration-300 file:shadow-lg border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm p-2.5"
                        required
                      />
                      <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By submitting this form, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CareerForm
