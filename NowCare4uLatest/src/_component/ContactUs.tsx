import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        console.group("📧 Contact Form Submission Started")
        console.log("📋 Contact Data:", formData)

        try {
            const response = await fetch("https://susaweb-418006.el.r.appspot.com/ContactForm/contactform", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
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
                setFormData({ name: "", email: "", subject: "", message: "" })
            }, 3000)
        } catch (err: any) {
            console.error("❌ ERROR:", err)
            console.groupEnd()
            setError(err.message || "Failed to send message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const contactInfo = [
        {
            icon: <FaPhone className="text-blue-600" size={20} />,
            title: "Phone",
            details: "+1 (555) 123-4567",
            subDetails: "Mon-Fri, 9AM-6PM",
        },
        {
            icon: <FaEnvelope className="text-emerald-600" size={20} />,
            title: "Email",
            details: "support@nowcare4u.com",
            subDetails: "24/7 Support",
        },
        {
            icon: <FaMapMarkerAlt className="text-purple-600" size={20} />,
            title: "Address",
            details: "123 Healthcare Ave",
            subDetails: "New York, NY 10001",
        },
        {
            icon: <FaClock className="text-rose-600" size={20} />,
            title: "Working Hours",
            details: "Mon - Fri: 9AM - 6PM",
            subDetails: "Sat - Sun: Closed",
        },
    ]

    const socialLinks = [
        { icon: <FaFacebookF />, label: "Facebook", href: "#", color: "hover:bg-blue-600" },
        { icon: <FaTwitter />, label: "Twitter", href: "#", color: "hover:bg-sky-500" },
        { icon: <FaLinkedinIn />, label: "LinkedIn", href: "#", color: "hover:bg-blue-700" },
        { icon: <FaInstagram />, label: "Instagram", href: "#", color: "hover:bg-pink-600" },
    ]

    return (
        <>
            <Helmet>
                <title>Contact Us | Nowcare4U - Get in Touch with Healthcare Experts</title>
                <meta
                    name="description"
                    content="Contact Nowcare4U for healthcare support, inquiries, or partnership opportunities. We're here 24/7 to assist you with your medical needs."
                />
                <meta name="keywords" content="contact healthcare, medical support, nowcare4u contact, healthcare consultation" />
                <link rel="canonical" href="https://nowcare4u.com/contact" />
            </Helmet>

            <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background patterns */}
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:48px_48px] opacity-50"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-4 border border-blue-200/50 shadow-sm">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 animate-pulse"></div>
                            We're Here to Help
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">Touch</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions about our healthcare services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-4">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                                            <p className="text-gray-700 font-medium">{info.details}</p>
                                            <p className="text-sm text-gray-500">{info.subDetails}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Social Media */}
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex space-x-3">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            className={`w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color} hover:text-white hover:shadow-lg hover:-translate-y-1`}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/50">
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                                        <p className="text-gray-600 text-lg">
                                            Thank you for reaching out. Our team will contact you soon.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                            <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                                        </div>

                                        {error && (
                                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Name */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="John Doe"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                        required
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="john@example.com"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    placeholder="Subject"
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                    required
                                                />
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    placeholder="Tell us how we can help you..."
                                                    rows={6}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                                                    required
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaEnvelope />
                                                        <span>Send Message</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold mb-2">24/7</div>
                                <div className="text-blue-100">Available Support</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">&lt;2 hrs</div>
                                <div className="text-blue-100">Response Time</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">50K+</div>
                                <div className="text-blue-100">Happy Patients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ContactUs
