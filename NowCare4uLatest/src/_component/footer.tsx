"use client"
import { Helmet } from "react-helmet-async"
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"
import { FaGooglePlay, FaApple } from "react-icons/fa6"
import {
  Heart,
  Phone,
  MapPin,
  ExternalLink,
  Mail,
  Shield,
  Award,
  Users,

  ArrowRight,

} from "lucide-react"

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "Our Blogs", href: "#" },
    { name: "Our Services", href: "#" },
  ]

  const services = [
    { name: "EHR", href: "#" },
    { name: "Experts", href: "#" },
    { name: "Calculator", href: "#" },
    { name: "Covid Testing", href: "#" },
  ]

  const socialLinks = [
    { icon: FaFacebookF, href: "#", color: "hover:text-blue-500", bg: "hover:bg-blue-50" },
    { icon: FaTwitter, href: "#", color: "hover:text-sky-500", bg: "hover:bg-sky-50" },
    { icon: FaLinkedinIn, href: "#", color: "hover:text-blue-600", bg: "hover:bg-blue-50" },
    { icon: FaInstagram, href: "#", color: "hover:text-pink-500", bg: "hover:bg-pink-50" },
  ]

  const footerLinks = [
    "Terms And Condition",
    "Privacy Policy",
    "Return And Refund Policy",
    "Cancellation Policy"
  ]

  const popularSearches = [
    "Anxiety",
    "ADHD",
    "Autism",
    "Bipolar Disorder",
    "Child Psychiatrist",
    "Child Psychologist",
    "Clinical Social Worker",
    "Conduct Disorder",
    "Depression",
    "Developmental Disabilities",
    "Eating Disorder",
    "Mental Illness",
    "Post Traumatic Stress Disorder (PSTD)",
    "Psychotherapy",
    "Reactive Attachment Disorder (RAD)",
    "Sexual Abuse",
    "Substance Abuse / Dependence",
    "Genetic Disorder",
    "Diet",
    "Weight Loss",
    "Fitness",
  ]

  return (
    <>
      <Helmet>
        <title>Nowcare4U - Leading Healthcare Platform | Contact & Support</title>
        <meta
          name="description"
          content="Contact Nowcare4U for healthcare services, expert consultations, and medical support. Download our mobile app for iOS and Android."
        />
        <meta
          name="keywords"
          content="healthcare contact, medical support, nowcare4u app, healthcare services, medical consultation"
        />
      </Helmet>

      <footer className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 pt-16 pb-8 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Nowcare4U
              </span> - Your Trusted Healthcare Partner
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting you with the best healthcare services and professionals
            </p>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-200/50 pb-12 mb-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">Nowcare</span>
                  <span className="text-2xl font-bold text-red-500">4U</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Our mission is to reduce the widespread presence of avoidable appealing diseases and improve health care to simple personal and affordable one.
              </p>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-blue-600">50K+ Patients</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-purple-600">500+ Experts</div>
                </div>
              </div>
            </div>

            {/* Know More */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <div className="w-2 h-6 bg-blue-500 rounded-full mr-2"></div>
                Know More
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-200 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Sections */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <div className="w-2 h-6 bg-purple-500 rounded-full mr-2"></div>
                Other Sections
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.href}
                      className="text-gray-600 hover:text-purple-600 transition-all duration-200 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <div className="w-2 h-6 bg-emerald-500 rounded-full mr-2"></div>
                Contact Us
              </h4>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-gray-200">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Corporate address: Magnum Tower 1, 8th Floor, Golf Course Ext Rd, Sector 58, Gurugram, Haryana 122011
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">+91 8595591496</p>
                  </div>
                </div>

                <a
                  href="mailto:contact@susalabs.com"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">contact@susalabs.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* App Download & Social Media */}
          <div className="flex flex-col lg:flex-row justify-between items-center py-8 border-b border-gray-200/50 gap-8">
            <div className="text-center lg:text-left">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Experience Our App</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl transition-colors duration-200 shadow-md">
                  <FaGooglePlay size={20} />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl transition-colors duration-200 shadow-md">
                  <FaApple size={20} />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Follow us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 ${social.color} ${social.bg} transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                      <IconComponent size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="py-8 border-b border-gray-200/50">
            <h4 className="font-bold text-gray-900 text-lg mb-5 text-center">Popular Searches</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((search, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 cursor-pointer"
                >
                  {search}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="py-8 border-b border-gray-200/50">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-amber-800 mb-2">Disclaimer</h5>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    NowCare4u.com or SusaKGjyo Bussiness Pvt.Ltd. does not provide medical advice and does not cater to any medical/Pregnancy or psychiatric emergencies. If you are in a life threatening situation, please do NOT use this site. If you are feeling suicidal we recommend you call a suicide prevention helpline or go to your nearest hospital.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-gray-600">Copyright © 2024 Nowcare4U. All Right Reserved</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center text-xs">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer