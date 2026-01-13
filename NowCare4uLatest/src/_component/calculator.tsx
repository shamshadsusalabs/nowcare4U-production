"use client"

import { useNavigate } from "react-router-dom"
import type React from "react"
import { Helmet } from "react-helmet-async"
import {
  Heart,
  Baby,
  TrendingUp,
  Activity,
  Stethoscope,
  Brain,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
} from "lucide-react"

interface HealthCalculator {
  id: number
  title: string
  description: string
  color: string
  gradient: string
  icon: React.ReactNode
  category: string
  estimatedTime: string
  popularity: number
  route: string
}

const calculators: HealthCalculator[] = [
  {
    id: 1,
    title: "Ovulation Calculator",
    description: "Track your fertile window and optimize conception timing",
    color: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    icon: <Heart className="w-8 h-8 text-white" />,
    category: "Motherhood",
    estimatedTime: "2 min",
    popularity: 95,
    route: "/ovulation",
  },
  // {
  //   id: 2,
  //   title: "Pregnancy Calculator",
  //   description: "Calculate due date and track pregnancy milestones",
  //   color: "bg-amber-500",
  //   gradient: "from-amber-500 to-orange-600",
  //   icon: <Baby className="w-8 h-8 text-white" />,
  //   category: "Motherhood",
  //   estimatedTime: "1 min",
  //   popularity: 98,
  //   route: "/pregnancyCalculator",
  // },
  {
    id: 3,
    title: "Growth Tracker",
    description: "Monitor your baby's development and growth patterns",
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-green-600",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    category: "Motherhood",
    estimatedTime: "3 min",
    popularity: 87,
    route: "/childgrowthTest",
  },
  {
    id: 4,
    title: "Kick Counter",
    description: "Track fetal movements and baby's activity patterns",
    color: "bg-cyan-500",
    gradient: "from-cyan-500 to-blue-600",
    icon: <Activity className="w-8 h-8 text-white" />,
    category: "Motherhood",
    estimatedTime: "5 min",
    popularity: 82,
    route: "/kickCounter",
  },
  {
    id: 12,
    title: "Pregnancy Weight Gain",
    description: "Track recommended weight gain range and your weekly entries",
    color: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    icon: <Baby className="w-8 h-8 text-white" />,
    category: "Motherhood",
    estimatedTime: "2 min",
    popularity: 88,
    route: "/pregnancy-weight",
  },
  {
    id: 5,
    title: "BMI Calculator",
    description: "Calculate body mass index and health recommendations",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-indigo-600",
    icon: <Stethoscope className="w-8 h-8 text-white" />,
    category: "General Health",
    estimatedTime: "1 min",
    popularity: 92,
    route: "/bmi",
  },
  {
    id: 6,
    title: "Diabetes Risk",
    description: "Assess your risk factors for type 2 diabetes",
    color: "bg-red-500",
    gradient: "from-red-500 to-rose-600",
    icon: <Stethoscope className="w-8 h-8 text-white" />,
    category: "General Health",
    estimatedTime: "4 min",
    popularity: 78,
    route: "/diabetes",
  },
  {
    id: 7,
    title: "ADHD Test",
    description: "Screening tool for attention deficit hyperactivity disorder",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-indigo-600",
    icon: <Brain className="w-8 h-8 text-white" />,
    category: "Childcare",
    estimatedTime: "6 min",
    popularity: 73,
    route: "/adhdTest",
  },
  {
    id: 8,
    title: "Bed-wetting Calculator",
    description: "Assess bed-wetting patterns and potential causes",
    color: "bg-teal-500",
    gradient: "from-teal-500 to-cyan-600",
    icon: <Shield className="w-8 h-8 text-white" />,
    category: "Childcare",
    estimatedTime: "8 min",
    popularity: 69,
    route: "/bedwettingTest",
  },
  {
    id: 9,
    title: "Height Prediction",
    description: "Estimate your child's adult height based on current growth",
    color: "bg-indigo-500",
    gradient: "from-indigo-500 to-purple-600",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    category: "Childcare",
    estimatedTime: "3 min",
    popularity: 85,
    route: "/heightPredictionTest",
  },
  {
    id: 10,
    title: "Personality Test",
    description: "Discover your child's personality traits and tendencies",
    color: "bg-pink-500",
    gradient: "from-pink-500 to-rose-600",
    icon: <Brain className="w-8 h-8 text-white" />,
    category: "Childcare",
    estimatedTime: "10 min",
    popularity: 65,
    route: "/personalityTest",
  },
  // New Cognitive Test Card
  {
    id: 11, // Assign a new unique ID
    title: "Cognitive Test",
    description: "Assess your cognitive skills, attention, and memory",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-red-600",
    icon: <Brain className="w-8 h-8 text-white" />, // Using Brain icon for cognitive test
    category: "Childcare", // Or "General Health" depending on target audience
    estimatedTime: "15 min",
    popularity: 90,
    route: "/congnitiveTest", // This will redirect to your cognitive test page
  },
]

const categories = [
  {
    name: "Motherhood",
    description: "Pregnancy weight gain calculator, Baby Growth Tracker, Kick Counter, Ovulation Calculator",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    name: "General Health",
    description: "Child Height Predictor, Diabetes Risk Calculator, BMI Calculator, Health Assessments",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    name: "Childcare",
    description: "Bed-wetting Calculator, ADHD Test, Cognitive Test, Developmental Assessments",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
]

const CalculatorCard = ({ calculator }: { calculator: HealthCalculator }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(calculator.route)
  }
  return (
    <div
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          {calculator.popularity}%
        </div>
      </div>
      <div className="relative z-10 p-6">
        <div className="mb-6 flex justify-center">
          <div
            className={`w-24 h-24 bg-gradient-to-br ${calculator.gradient} rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">{calculator.icon}</div>
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {calculator.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{calculator.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {calculator.estimatedTime}
            </div>
            <div className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              {calculator.category}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group-hover:scale-105"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            <span>Start Calculator</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

const Calculators = () => {
  const navigate = useNavigate()
  return (
    <>
      <Helmet>
        <title>Health Calculators & Medical Tools | Pregnancy, BMI, Diabetes Risk | Nowcare4U</title>
        <meta
          name="description"
          content="Free online health calculators including pregnancy calculator, ovulation tracker, BMI calculator, diabetes risk assessment, ADHD test, and more. Accurate medical tools for better health management."
        />
        <meta
          name="keywords"
          content="health calculators, pregnancy calculator, ovulation calculator, BMI calculator, diabetes risk calculator, ADHD test, medical tools, health assessment, fertility tracker, growth tracker"
        />
        <meta name="author" content="Nowcare4U Healthcare Platform" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Health Calculators & Medical Tools | Nowcare4U" />
        <meta
          property="og:description"
          content="Access free online health calculators for pregnancy, fertility, BMI, diabetes risk, and child development assessments."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/calculators" />
        <meta property="og:image" content="https://nowcare4u.com/calculators-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Health Calculators & Medical Tools | Nowcare4U" />
        <meta
          name="twitter:description"
          content="Free online health calculators for pregnancy, BMI, diabetes risk, and more medical assessments."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Nowcare4U Health Calculators",
            description: "Comprehensive health calculators and medical assessment tools",
            url: "https://nowcare4u.com/calculators",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Pregnancy Calculator",
              "Ovulation Calculator",
              "BMI Calculator",
              "Diabetes Risk Assessment",
              "ADHD Test",
              "Growth Tracker",
              "Cognitive Test", // Added to schema
            ],
          })}
        </script>
      </Helmet>
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:48px_48px] opacity-50"></div>
        </div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-1/4 w-8 h-8 border-2 border-blue-200/30 rotate-45 animate-spin"></div>
        <div className="absolute bottom-20 left-1/3 w-6 h-6 bg-purple-200/20 rounded-full animate-bounce delay-700"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 border border-blue-200/50 shadow-sm">
              <Stethoscope className="w-4 h-4 mr-2" />
              Advanced Health Assessment Tools
            </div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Smart Health{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                Calculators
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover Nowcare4U's comprehensive suite of medical calculators and assessment tools designed to help you
              track your health, pregnancy progress, and wellness journey with precision and ease.
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-500">Health Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">100K+</div>
                <div className="text-sm text-gray-500">Calculations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </div>
          </div>
          <div className="mb-12">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
              Explore by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Category
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`${category.bgColor} ${category.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
                >
                  <h3
                    className={`${category.color} font-bold text-lg mb-3 group-hover:scale-105 transition-transform duration-300`}
                  >
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
                    <span>Explore tools</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-12">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Calculators
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {calculators.map((calculator) => (
                <CalculatorCard key={calculator.id} calculator={calculator} />
              ))}
            </div>
          </div>
          <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Personalized Health Guidance?</h3>
            <p className="text-lg mb-6 opacity-90">
              Connect with our medical experts for detailed consultations and personalized health recommendations.
            </p>
            <button
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/experts")}
            >
              Consult with Experts
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Calculators
