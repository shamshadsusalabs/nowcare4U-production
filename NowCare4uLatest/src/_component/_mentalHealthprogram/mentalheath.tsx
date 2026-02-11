"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import {
  Brain,
  Heart,
  Users,
 
  CheckCircle,
  Sparkles,
  Star,

  FileText,
  Globe,
 
  TrendingUp,
  Microscope,
  Target,
  Zap,
  Activity,
 
  MessageCircle,
  BookOpen,
  Clock,
  ArrowRight,
} from "lucide-react"
import heartImg from "../../assets/nowCareLogo.png"

export default function MentalHealthProgram() {
  const [activeTab, setActiveTab] = useState<"overview" | "programs" | "therapy" | "research">("overview")
  


  // Advanced Mental Health Programs
  const mentalHealthPrograms = [
    {
      title: "AI-Powered Cognitive Behavioral Therapy",
      description:
        "Revolutionary CBT platform using machine learning to personalize treatment plans with 94% success rate",
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      stats: "94% Success Rate",
      color: "from-blue-500 to-purple-600",
      bgColor: "from-blue-50 to-purple-50",
      patients: "15,000+",
      duration: "8-12 weeks",
    },
    {
      title: "Virtual Reality Exposure Therapy",
      description:
        "Immersive VR environments for treating phobias, PTSD, and anxiety disorders with controlled exposure",
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      stats: "89% Improvement",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      patients: "8,500+",
      duration: "6-10 weeks",
    },
    {
      title: "Neurofeedback Brain Training",
      description:
        "Real-time brain activity monitoring and training to improve focus, reduce anxiety, and enhance mood",
      icon: <Activity className="w-8 h-8 text-purple-600" />,
      stats: "92% Satisfaction",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      patients: "12,000+",
      duration: "10-16 weeks",
    },
    {
      title: "Digital Therapeutic Interventions",
      description: "FDA-approved digital therapeutics delivering evidence-based interventions through mobile platforms",
      icon: <Zap className="w-8 h-8 text-cyan-600" />,
      stats: "96% Engagement",
      color: "from-cyan-500 to-blue-600",
      bgColor: "from-cyan-50 to-blue-50",
      patients: "25,000+",
      duration: "Ongoing",
    },
  ]

  const therapyModalities = [
    {
      title: "Precision Psychotherapy",
      description: "AI-guided therapy matching patients with optimal treatment approaches based on genetic markers",
      icon: "🧬",
      effectiveness: "97%",
      sessions: "12-16",
      specialties: "Depression, Anxiety, Bipolar Disorder",
    },
    {
      title: "Mindfulness-Based Interventions",
      description: "Evidence-based mindfulness programs with real-time biometric feedback and progress tracking",
      icon: "🧘",
      effectiveness: "91%",
      sessions: "8-12",
      specialties: "Stress, PTSD, Chronic Pain",
    },
    {
      title: "Group Therapy Dynamics",
      description: "Virtual and in-person group sessions with AI-powered matching for optimal peer support",
      icon: "👥",
      effectiveness: "88%",
      sessions: "16-24",
      specialties: "Social Anxiety, Addiction, Grief",
    },
    {
      title: "Family Systems Therapy",
      description: "Comprehensive family therapy programs addressing relationship dynamics and communication",
      icon: "👨‍👩‍👧‍👦",
      effectiveness: "85%",
      sessions: "10-20",
      specialties: "Family Conflict, Teen Issues, Trauma",
    },
  ]

  const mentalHealthServices = [
    {
      title: "Crisis Intervention & Support",
      examples: [
        "24/7 crisis hotline with trained counselors",
        "Emergency mental health assessments",
        "Suicide prevention and safety planning",
        "Immediate psychiatric consultation",
      ],
      icon: "🚨",
      impact: "Life-saving",
      availability: "24/7",
    },
    {
      title: "Preventive Mental Wellness",
      examples: [
        "Mental health screening and early detection",
        "Stress management and resilience training",
        "Workplace mental health programs",
        "Community wellness initiatives",
      ],
      icon: "🛡️",
      impact: "Preventive",
      availability: "Daily",
    },
    {
      title: "Specialized Treatment Programs",
      examples: [
        "Eating disorder recovery programs",
        "Addiction and substance abuse treatment",
        "Trauma-informed care protocols",
        "Autism spectrum support services",
      ],
      icon: "🎯",
      impact: "Specialized",
      availability: "Scheduled",
    },
  ]

  const researchBreakthroughs = [
    {
      title: "Biomarker-Guided Mental Health",
      description: "Revolutionary blood tests predicting treatment response with 95% accuracy before therapy begins",
      status: "Clinical Implementation",
      patients: "5,000+",
      successRate: "95%",
      icon: <Microscope className="w-6 h-6 text-blue-600" />,
      timeline: "2024",
    },
    {
      title: "Psychedelic-Assisted Therapy",
      description: "FDA-approved psilocybin and MDMA therapy protocols for treatment-resistant depression and PTSD",
      status: "Phase III Trials",
      patients: "1,200+",
      successRate: "89%",
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      timeline: "2024-2025",
    },
    {
      title: "Digital Mental Health Twins",
      description: "AI-powered digital replicas of patient mental states enabling personalized treatment simulation",
      status: "Research Phase",
      patients: "800+",
      successRate: "92%",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      timeline: "2025-2026",
    },
  ]

  const clinicalOutcomes = [
    {
      principle: "Evidence-Based Treatment",
      description: "All programs backed by rigorous clinical research and peer-reviewed studies",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      metric: "100%",
      unit: "Evidence-Based",
    },
    {
      principle: "Personalized Care",
      description: "AI-driven treatment matching ensuring optimal therapy selection for each individual",
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      metric: "97%",
      unit: "Match Rate",
    },
    {
      principle: "Rapid Response",
      description: "Crisis intervention and urgent care available within minutes, not hours",
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      metric: "<5min",
      unit: "Response Time",
    },
    {
      principle: "Long-term Success",
      description: "Sustained improvement rates maintained 2+ years post-treatment completion",
      icon: <TrendingUp className="w-6 h-6 text-cyan-600" />,
      metric: "85%",
      unit: "Sustained",
    },
  ]

  const treatmentStats = [
    { condition: "Depression", patients: 18500, successRate: 91, status: "Active Program" },
    { condition: "Anxiety Disorders", patients: 22000, successRate: 88, status: "Active Program" },
    { condition: "PTSD", patients: 6500, successRate: 85, status: "Specialized Care" },
    { condition: "Bipolar Disorder", patients: 4200, successRate: 89, status: "Ongoing Support" },
  ]

  return (
    <>
      <Helmet>
        <title>Advanced Mental Health Programs | AI-Powered Therapy & Wellness | Nowcare4U</title>
        <meta
          name="description"
          content="Revolutionary mental health programs with 94% success rate. AI-powered therapy, VR treatment, neurofeedback, and 24/7 crisis support. Transform your mental wellness journey."
        />
        <meta
          name="keywords"
          content="mental health, therapy, depression treatment, anxiety therapy, PTSD treatment, AI therapy, virtual reality therapy, neurofeedback, crisis intervention, mental wellness"
        />
        <meta name="author" content="Nowcare4U Mental Health Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Advanced Mental Health Programs | Nowcare4U" />
        <meta
          property="og:description"
          content="Revolutionary mental health care with AI-powered therapy, VR treatment, and 94% success rates."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/mental-health" />
        <meta property="og:image" content="https://nowcare4u.com/mental-health-og-image.jpg" />

        {/* Structured Data for Mental Health Services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "Nowcare4U Mental Health Program",
            description: "Advanced mental health and therapy services",
            url: "https://nowcare4u.com/mental-health",
            medicalSpecialty: "Psychiatry",
            availableService: [
              {
                "@type": "MedicalTherapy",
                name: "Cognitive Behavioral Therapy",
              },
              {
                "@type": "MedicalTherapy",
                name: "Virtual Reality Therapy",
              },
            ],
          })}
        </script>
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

        {/* Top Navigation */}
        <div className="relative z-10 flex justify-end mb-8 space-x-8 text-sm font-semibold">
          <a href="/" className="text-gray-600 hover:text-blue-600 transition-all duration-200 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </a>
          <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-all duration-200">
            Contact Us
          </a>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="bg-white p-4 rounded-full w-32 h-32 flex items-center justify-center shadow-xl mx-auto border-4 border-blue-200/50 hover:scale-110 transition-transform duration-300">
                <img src={heartImg || "/placeholder.svg"} alt="Nowcare4U Logo" className="w-24 h-24 object-contain" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-wide">Nowcare4U</h1>
              <p className="text-lg text-blue-600 font-semibold mt-2">Young & Healthy Forever</p>
            </div>

            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 border border-blue-200/50 shadow-lg">
              <Heart className="w-5 h-5 mr-2" />
              Advanced Mental Health & Wellness Programs
            </div>

            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-600 to-emerald-600">
                Mental Health Revolution
              </span>
            </h2>

            <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 mx-auto mb-8" />

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering you to stay <span className="text-emerald-600 font-semibold">Young & Healthy Forever</span>{" "}
              with AI-powered therapy, breakthrough treatments, and personalized mental wellness programs
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-blue-600 mb-1">94%</div>
                <div className="text-sm text-blue-700">Success Rate</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-emerald-600 mb-1">50K+</div>
                <div className="text-sm text-emerald-700">Lives Transformed</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                <div className="text-sm text-purple-700">Crisis Support</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-600 mb-1">100+</div>
                <div className="text-sm text-cyan-700">Expert Therapists</div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
              {[
                { id: "overview", label: "Overview", icon: <Globe className="w-4 h-4" /> },
                { id: "programs", label: "Programs", icon: <BookOpen className="w-4 h-4" /> },
                { id: "therapy", label: "Therapy", icon: <MessageCircle className="w-4 h-4" /> },
                { id: "research", label: "Research", icon: <FileText className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Mental Health Programs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {mentalHealthPrograms.map((program, i) => (
                    <div
                      key={i}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                    >
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${program.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                      ></div>

                      <div className="relative z-10">
                        <div className="flex items-start space-x-4 mb-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                          >
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">{program.icon}</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                              {program.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {program.stats}
                              </div>
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                                <Users className="w-3 h-3 mr-1" />
                                {program.patients}
                              </div>
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                                <Clock className="w-3 h-3 mr-1" />
                                {program.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{program.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Wellness Score Monitor */}
               
              </div>
            )}

            {activeTab === "programs" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {mentalHealthServices.map((service, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <div className="flex justify-center space-x-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs font-semibold">
                          <Star className="w-3 h-3 mr-1" />
                          {service.impact}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.availability}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {service.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm leading-relaxed">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "therapy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {therapyModalities.map((therapy, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{therapy.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {therapy.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{therapy.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                        <span className="text-sm text-emerald-700">Effectiveness:</span>
                        <span className="font-bold text-emerald-600">{therapy.effectiveness}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                        <span className="text-sm text-blue-700">Sessions:</span>
                        <span className="font-bold text-blue-600">{therapy.sessions}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50">
                        <span className="text-sm text-purple-700 block mb-1">Specialties:</span>
                        <span className="text-xs text-purple-600">{therapy.specialties}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "research" && (
              <div className="space-y-12">
                {/* Research Breakthroughs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {researchBreakthroughs.map((research, i) => (
                    <div
                      key={i}
                      className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-blue-200/50">
                          {research.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {research.title}
                          </h3>
                          <div className="text-xs text-emerald-600 font-semibold">{research.status}</div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{research.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                          <div className="text-lg font-bold text-blue-600">{research.patients}</div>
                          <div className="text-xs text-blue-700">Participants</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                          <div className="text-lg font-bold text-emerald-600">{research.successRate}</div>
                          <div className="text-xs text-emerald-700">Success Rate</div>
                        </div>
                      </div>

                      <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="text-xs text-purple-600 font-medium">Timeline: {research.timeline}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Treatment Statistics */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Treatment Outcomes by Condition</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {treatmentStats.map((stat, i) => (
                      <div
                        key={i}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{stat.condition}</h4>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-blue-600">{stat.patients.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Patients Treated</div>
                          <div className="text-lg font-bold text-emerald-600">{stat.successRate}%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                          <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {stat.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Clinical Outcomes Section */}
          <div className="mt-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl p-12 border border-blue-200/50 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Clinical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Excellence
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
              <p className="text-gray-600 max-w-3xl mx-auto">
                Why our mental health programs achieve industry-leading outcomes and patient satisfaction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {clinicalOutcomes.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.principle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{item.metric}</div>
                    <div className="text-xs text-gray-500">{item.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </section>
    </>
  )
}
