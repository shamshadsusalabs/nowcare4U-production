"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
  Search,
  Baby,
  Heart,
  Stethoscope,
  Users,
  Building,
  X,
  ChevronRight,
  Calendar,
  Sparkles,
  Leaf,
  Utensils,
  User,
  Dna,
  Syringe,
  Brain,
  FileText,
  Activity,
  Briefcase,
  Shield,
} from "lucide-react"

interface Service {
  id: number
  name: string
  category: string
  isNew: boolean
  icon: React.ReactNode
  description?: string
}

const OurServices = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  const categories = [
    { id: "all", name: "All Services", icon: <Heart className="w-4 h-4" /> },
    { id: "pregnancy", name: "Pregnancy & Birth", icon: <Baby className="w-4 h-4" /> },
    { id: "parenting", name: "Parenting & Child Care", icon: <Users className="w-4 h-4" /> },
    { id: "medical", name: "Medical Services", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "wellness", name: "Wellness & Support", icon: <Leaf className="w-4 h-4" /> },
    { id: "corporate", name: "Corporate Services", icon: <Building className="w-4 h-4" /> },
  ]

  const services: Service[] = [
    // Pregnancy & Birth
    {
      id: 1,
      name: "Family Planning / Pre & Post Natal Classes",
      category: "pregnancy",
      isNew: false,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      description: "Comprehensive classes for family planning and pre/post-natal care",
    },
    {
      id: 2,
      name: "Pre & Post Natal Massage/Yoga/Exercises",
      category: "pregnancy",
      isNew: false,
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
      description: "Specialized physical wellness programs for expectant and new mothers",
    },
    {
      id: 3,
      name: "Doula/Hypnobirthing/Lamaze/Labour Programs",
      category: "pregnancy",
      isNew: false,
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      description: "Various birthing support methods and techniques",
    },
    {
      id: 4,
      name: "Birth Preparation/Parenting Classes",
      category: "pregnancy",
      isNew: false,
      icon: <Baby className="w-6 h-6 text-pink-600" />,
      description: "Educational sessions to prepare for childbirth and early parenting",
    },
    {
      id: 5,
      name: "Lactation or Breastfeeding Classes/Counselling",
      category: "pregnancy",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-red-600" />,
      description: "Expert guidance on breastfeeding techniques and challenges",
    },
    {
      id: 6,
      name: "Diet & Nutrition Consultation",
      category: "wellness",
      isNew: false,
      icon: <Utensils className="w-6 h-6 text-amber-600" />,
      description: "Personalized nutrition plans for optimal health during pregnancy",
    },

    // Parenting & Child Care
    {
      id: 7,
      name: "Nanny Services",
      category: "parenting",
      isNew: false,
      icon: <User className="w-6 h-6 text-blue-600" />,
      description: "Professional childcare support in your home",
    },
    {
      id: 8,
      name: "Pregnancy Food Services",
      category: "pregnancy",
      isNew: false,
      icon: <Utensils className="w-6 h-6 text-green-600" />,
      description: "Nutritious meal preparation for expectant mothers",
    },
    {
      id: 9,
      name: "Working Women Child Support Services",
      category: "parenting",
      isNew: false,
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      description: "Flexible childcare solutions for working professionals",
    },
    {
      id: 10,
      name: "Cord Blood Banking",
      category: "medical",
      isNew: false,
      icon: <Dna className="w-6 h-6 text-purple-600" />,
      description: "Storage of umbilical cord blood for future medical use",
    },
    {
      id: 11,
      name: "Child Vaccination Service Provider",
      category: "medical",
      isNew: false,
      icon: <Syringe className="w-6 h-6 text-blue-600" />,
      description: "Complete vaccination programs following medical guidelines",
    },
    {
      id: 12,
      name: "Special Children Support",
      category: "parenting",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-red-600" />,
      description: "Speech therapy, autism support, and specialized care",
    },

    // Medical Services
    {
      id: 13,
      name: "Gynecologists",
      category: "medical",
      isNew: false,
      icon: <Stethoscope className="w-6 h-6 text-pink-600" />,
      description: "Expert women's health specialists",
    },
    {
      id: 14,
      name: "Pre & Post Abortion/Miscarriage Support",
      category: "medical",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-purple-600" />,
      description: "Compassionate care during difficult times",
    },
    {
      id: 15,
      name: "Post-partum Depression Support",
      category: "wellness",
      isNew: false,
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      description: "Mental health support for new mothers",
    },
    {
      id: 16,
      name: "Egg/Sperm Freezing Services",
      category: "medical",
      isNew: false,
      icon: <Dna className="w-6 h-6 text-cyan-600" />,
      description: "Fertility preservation options",
    },
    {
      id: 17,
      name: "Foetus Diagnostic Services",
      category: "medical",
      isNew: false,
      icon: <Stethoscope className="w-6 h-6 text-emerald-600" />,
      description: "Chromosomal screening and prenatal diagnostics",
    },
    {
      id: 18,
      name: "Aesthetics Services",
      category: "wellness",
      isNew: false,
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      description: "Laser and non-laser cosmetic procedures",
    },

    // More Medical & Wellness
    {
      id: 19,
      name: "Pediatricians",
      category: "medical",
      isNew: false,
      icon: <Baby className="w-6 h-6 text-blue-600" />,
      description: "Specialized healthcare for infants and children",
    },
    {
      id: 20,
      name: "Online Training Modules",
      category: "wellness",
      isNew: false,
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      description: "Digital education resources for parents and caregivers",
    },
    {
      id: 21,
      name: "Dieticians",
      category: "wellness",
      isNew: false,
      icon: <Utensils className="w-6 h-6 text-green-600" />,
      description: "Expert nutritional guidance for all stages",
    },
    {
      id: 22,
      name: "Psychologists",
      category: "wellness",
      isNew: false,
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      description: "Mental health support throughout pregnancy and parenting",
    },
    {
      id: 23,
      name: "Home Pregnancy Test",
      category: "medical",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      description: "Convenient testing options with follow-up support",
    },
    {
      id: 24,
      name: "Screening of CA Cervix and Breast",
      category: "medical",
      isNew: false,
      icon: <Stethoscope className="w-6 h-6 text-red-600" />,
      description: "Early detection and preventive screenings",
    },

    // Additional Services
    {
      id: 25,
      name: "Bone Density Scan",
      category: "medical",
      isNew: false,
      icon: <Activity className="w-6 h-6 text-amber-600" />,
      description: "Comprehensive bone health assessment",
    },
    {
      id: 26,
      name: "Assistance During Pregnancy",
      category: "pregnancy",
      isNew: false,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      description: "Complete support throughout your pregnancy journey",
    },
    {
      id: 27,
      name: "Diet Plans & Specialist Visits",
      category: "wellness",
      isNew: false,
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      description: "Coordinated care with OB/GYN, dieticians, and psychologists",
    },
    {
      id: 28,
      name: "Delivery Support and Planning",
      category: "pregnancy",
      isNew: false,
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      description: "Comprehensive birth planning and support services",
    },
    {
      id: 29,
      name: "Electronic Health Records & Management",
      category: "medical",
      isNew: false,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      description: "Secure digital health record system",
    },
    {
      id: 30,
      name: "Corporate Package Offering Plan",
      category: "corporate",
      isNew: true,
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      description: "Customized healthcare packages for organizations",
    },

    // Final Services
    {
      id: 31,
      name: "Infertility Assistance",
      category: "medical",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      description: "Comprehensive fertility support and treatments",
    },
    {
      id: 32,
      name: "Postpartum Visits",
      category: "pregnancy",
      isNew: false,
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      description: "Follow-up care after childbirth",
    },
    {
      id: 33,
      name: "Through Delivery and After Care",
      category: "pregnancy",
      isNew: false,
      icon: <Heart className="w-6 h-6 text-purple-600" />,
      description: "Continuous support from delivery through postpartum",
    },
    {
      id: 34,
      name: "Corporate Preventive Healthcare Services",
      category: "corporate",
      isNew: true,
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      description: "Wellness programs designed for workplace implementation",
    },
    {
      id: 35,
      name: "Custom Design Services for Insurance Companies",
      category: "corporate",
      isNew: true,
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      description: "Tailored healthcare solutions for insurance providers",
    },
    {
      id: 36,
      name: "Virtual Consultation Services",
      category: "wellness",
      isNew: true,
      icon: <Stethoscope className="w-6 h-6 text-indigo-600" />,
      description: "Remote healthcare access with qualified professionals",
    },
    {
      id: 37,
      name: "Mental Health Support Programs",
      category: "wellness",
      isNew: true,
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      description: "Comprehensive mental wellness services for families",
    },
    {
      id: 38,
      name: "Genetic Counseling",
      category: "medical",
      isNew: true,
      icon: <Dna className="w-6 h-6 text-blue-600" />,
      description: "Expert guidance on genetic health concerns",
    },
  ]

  useEffect(() => {
    // Filter services based on search term and category
    const results = services.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredServices(results)
  }, [searchTerm, selectedCategory])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <>
      <Helmet>
        <title>Comprehensive Healthcare Services | Pregnancy, Parenting & Wellness | Nowcare4U</title>
        <meta
          name="description"
          content="Explore Nowcare4U's complete range of healthcare services: pregnancy support, parenting assistance, medical care, wellness programs, and corporate healthcare solutions."
        />
        <meta
          name="keywords"
          content="pregnancy services, parenting support, prenatal care, postnatal care, family planning, child healthcare, women's health, corporate healthcare, wellness programs, medical services"
        />
        <meta name="author" content="Nowcare4U Healthcare Services" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Comprehensive Healthcare Services | Nowcare4U" />
        <meta
          property="og:description"
          content="Complete range of healthcare services for pregnancy, parenting, medical care, and corporate wellness."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/services" />
        <meta property="og:image" content="https://nowcare4u.com/services-og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "Nowcare4U Healthcare Services",
            description: "Comprehensive healthcare services provider",
            url: "https://nowcare4u.com/services",
            medicalSpecialty: ["Gynecology", "Pediatrics", "Nutrition", "Mental Health"],
            availableService: services.map((service) => ({
              "@type": "MedicalService",
              name: service.name,
              serviceType: service.category,
            })),
          })}
        </script>
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-4 border border-blue-200/50 shadow-sm">
              <Heart className="w-4 h-4 mr-2" />
              Comprehensive Care
            </div>

            <h1 className="text-xl lg:text-3xl  font-bold text-gray-900 mb-4 leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                Healthcare Services
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our complete range of healthcare services designed to support you through every stage of your
              journey
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-10 space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 text-gray-700 hover:bg-blue-50 border border-gray-200 shadow-sm"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Service Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-blue-200/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  {/* Service Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {service.name}
                  </h3>

                  {/* Service Description */}
                  {service.description && <p className="text-gray-600 text-sm mb-4">{service.description}</p>}

                  {/* NEW Badge */}
                  {service.isNew && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                      NEW
                    </div>
                  )}

                  {/* Learn More Link */}
                  <div className="mt-auto">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                    >
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>

                  {/* Category Indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Service?</h3>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                We understand that every individual has unique needs. Contact our team to discuss customized healthcare
                solutions tailored specifically for you.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                Contact Our Specialists
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

export default OurServices
