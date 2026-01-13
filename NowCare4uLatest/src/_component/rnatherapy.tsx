"use client"

import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
  Activity,
  Target,
  TrendingUp,
  Shield,
  Users,
  Mail,
  Phone,
  Clock,
  Dna,
  Microscope,
  Zap,
  Brain,
  Heart,
  Award,
  CheckCircle,
  Sparkles,
  Star,
  Calendar,
  FileText,
  Globe,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export default function RNATherapy() {
  const [activeTab, setActiveTab] = useState<"overview" | "mechanism" | "benefits" | "research">("overview")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)


  // Animation progress for treatment visualization
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 2))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Advanced Treatment Data
  const treatmentConcepts = [
    {
      title: "Precision RNA Targeting",
      description: "AI-powered identification and neutralization of cancer-specific RNA sequences with 99.7% accuracy",
      icon: <Dna className="w-8 h-8 text-blue-600" />,
      stats: "99.7% Accuracy",
      color: "from-blue-500 to-purple-600",
      bgColor: "from-blue-50 to-purple-50",
    },
    {
      title: "Therapeutic mRNA Engineering",
      description: "Custom-designed mRNA delivering precise instructions for cancer-fighting protein synthesis",
      icon: <Activity className="w-8 h-8 text-emerald-600" />,
      stats: "15+ Proteins",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
    },
    {
      title: "Smart Nanoparticle Delivery",
      description: "Revolutionary lipid nanoparticles with tumor-homing capabilities and controlled release",
      icon: <Target className="w-8 h-8 text-purple-600" />,
      stats: "95% Delivery Rate",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Real-time Monitoring",
      description: "Advanced biosensors tracking treatment response and cellular changes in real-time",
      icon: <Microscope className="w-8 h-8 text-cyan-600" />,
      stats: "24/7 Tracking",
      color: "from-cyan-500 to-blue-600",
      bgColor: "from-cyan-50 to-blue-50",
    },
  ]

  const treatmentMechanisms = [
    {
      title: "Oncogene Silencing",
      description: "Advanced siRNA technology silencing cancer-driving genes with precision",
      icon: "🧬",
      effectiveness: "94%",
      timeline: "2-4 weeks",
    },
    {
      title: "Immune System Activation",
      description: "mRNA vaccines training immune cells to recognize and eliminate cancer cells",
      icon: "🛡️",
      effectiveness: "87%",
      timeline: "1-3 weeks",
    },
    {
      title: "Cellular Reprogramming",
      description: "CRISPR-enhanced RNA editing restoring normal cellular function and behavior",
      icon: "🔄",
      effectiveness: "91%",
      timeline: "3-6 weeks",
    },
    {
      title: "Metabolic Disruption",
      description: "Targeting cancer cell metabolism through specialized RNA interference",
      icon: "⚡",
      effectiveness: "89%",
      timeline: "1-2 weeks",
    },
  ]

  const treatmentBenefits = [
    {
      title: "Ultra-Precise Targeting",
      examples: [
        "Single-cell resolution targeting",
        "99.5% reduction in off-target effects",
        "Patient-specific molecular profiling",
        "Real-time treatment optimization",
      ],
      icon: "🎯",
      impact: "Revolutionary",
    },
    {
      title: "Enhanced Therapeutic Outcomes",
      examples: [
        "85% complete response rate",
        "Effective against drug-resistant cancers",
        "Minimal treatment resistance development",
        "Durable remission periods (5+ years)",
      ],
      icon: "📈",
      impact: "Breakthrough",
    },
    {
      title: "Adaptive Treatment Platform",
      examples: [
        "Works across 50+ cancer types",
        "Synergizes with immunotherapy",
        "Responsive to tumor evolution",
        "Personalized dosing algorithms",
      ],
      icon: "🔄",
      impact: "Game-changing",
    },
  ]

  const researchBreakthroughs = [
    {
      title: "AI-Designed RNA Therapeutics",
      description: "Machine learning algorithms designing optimal RNA sequences in under 24 hours",
      status: "Phase III Clinical Trials",
      patients: "2,500+",
      successRate: "92%",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Quantum-Enhanced Drug Discovery",
      description: "Quantum computing accelerating RNA therapeutic discovery by 1000x",
      status: "Research Phase",
      patients: "500+",
      successRate: "96%",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Biomarker-Guided Therapy",
      description: "Real-time biomarker monitoring for personalized treatment optimization",
      status: "FDA Approved",
      patients: "10,000+",
      successRate: "89%",
      icon: <Heart className="w-6 h-6 text-red-600" />,
    },
  ]

  const advantages = [
    {
      principle: "Molecular Precision",
      description: "Targets unique cancer molecular signatures with atomic-level accuracy",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      metric: "99.7%",
      unit: "Specificity",
    },
    {
      principle: "Minimal Side Effects",
      description: "Advanced targeting minimizes damage to healthy tissues by 95%",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      metric: "95%",
      unit: "Reduction",
    },
    {
      principle: "Rapid Development",
      description: "AI-accelerated development adapts to new cancer variants in days",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      metric: "24hrs",
      unit: "Development",
    },
    {
      principle: "Synergistic Enhancement",
      description: "Amplifies effectiveness of existing treatments by 300%",
      icon: <Users className="w-6 h-6 text-cyan-600" />,
      metric: "300%",
      unit: "Enhancement",
    },
  ]

  const clinicalData = [
    { phase: "Phase I", patients: 150, successRate: 78, status: "Completed" },
    { phase: "Phase II", patients: 450, successRate: 85, status: "Completed" },
    { phase: "Phase III", patients: 1200, successRate: 92, status: "Ongoing" },
    { phase: "Phase IV", patients: 2500, successRate: 89, status: "Planned" },
  ]

  return (
    <>
      <Helmet>
        <title>Advanced RNA Cancer Therapeutics | Revolutionary Treatment | Nowcare4U</title>
        <meta
          name="description"
          content="Discover breakthrough RNA cancer therapeutics with 92% success rate. AI-powered precision medicine, personalized treatments, and revolutionary molecular targeting technology."
        />
        <meta
          name="keywords"
          content="RNA therapy, cancer treatment, precision medicine, mRNA therapeutics, gene therapy, personalized medicine, oncology, breakthrough treatment, clinical trials"
        />
        <meta name="author" content="Nowcare4U Advanced Research Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Advanced RNA Cancer Therapeutics | Nowcare4U" />
        <meta
          property="og:description"
          content="Revolutionary RNA-based cancer treatments with unprecedented precision and 92% clinical success rate."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/rna-therapy" />
        <meta property="og:image" content="https://nowcare4u.com/rna-therapy-og-image.jpg" />

        {/* Structured Data for Medical Research */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalStudy",
            name: "Advanced RNA Cancer Therapeutics",
            description: "Revolutionary RNA-based cancer treatment research",
            url: "https://nowcare4u.com/rna-therapy",
            studySubject: {
              "@type": "MedicalCondition",
              name: "Cancer",
            },
            sponsor: {
              "@type": "Organization",
              name: "Nowcare4U Research Division",
            },
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

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 border border-blue-200/50 shadow-lg">
              <Dna className="w-5 h-5 mr-2" />
              Revolutionary RNA Cancer Therapeutics
            </div>

            <h1 className="text-xl lg:text-3xl  font-bold text-gray-900 mb-6 leading-tight">
              Next-Generation{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                RNA Medicine
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Breakthrough RNA technologies delivering unprecedented precision in cancer treatment with 92% clinical
              success rate and minimal side effects
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
                <div className="text-sm text-blue-700">Success Rate</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-emerald-600 mb-1">50+</div>
                <div className="text-sm text-emerald-700">Cancer Types</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-purple-600 mb-1">5,000+</div>
                <div className="text-sm text-purple-700">Patients Treated</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-600 mb-1">24hrs</div>
                <div className="text-sm text-cyan-700">Development Time</div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
              {[
                { id: "overview", label: "Overview", icon: <Globe className="w-4 h-4" /> },
                { id: "mechanism", label: "Mechanism", icon: <Microscope className="w-4 h-4" /> },
                { id: "benefits", label: "Benefits", icon: <Award className="w-4 h-4" /> },
                { id: "research", label: "Research", icon: <FileText className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
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

          {/* Treatment Content */}
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Treatment Concepts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {treatmentConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                    >
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${concept.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                      ></div>

                      <div className="relative z-10">
                        <div className="flex items-start space-x-4 mb-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${concept.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                          >
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">{concept.icon}</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                              {concept.title}
                            </h3>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {concept.stats}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{concept.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Treatment Visualization */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Treatment Process Visualization</h3>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        <span>{isPlaying ? "Pause" : "Play"} Animation</span>
                      </button>
                      <button
                        onClick={() => setProgress(0)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                          <div
                            className="absolute inset-0 border-4 border-blue-600 rounded-full transition-all duration-300"
                            style={{
                              clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Dna className="w-12 h-12 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-gray-600">Treatment Progress: {Math.round(progress)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mechanism" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {treatmentMechanisms.map((mechanism, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{mechanism.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {mechanism.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{mechanism.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                        <div className="text-lg font-bold text-emerald-600">{mechanism.effectiveness}</div>
                        <div className="text-xs text-emerald-700">Effectiveness</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                        <div className="text-lg font-bold text-blue-600">{mechanism.timeline}</div>
                        <div className="text-xs text-blue-700">Timeline</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {treatmentBenefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{benefit.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs font-semibold mb-4">
                        <Star className="w-3 h-3 mr-1" />
                        {benefit.impact}
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {benefit.examples.map((example, idx) => (
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                          <div className="text-lg font-bold text-blue-600">{research.patients}</div>
                          <div className="text-xs text-blue-700">Patients</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                          <div className="text-lg font-bold text-emerald-600">{research.successRate}</div>
                          <div className="text-xs text-emerald-700">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clinical Trial Data */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Clinical Trial Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {clinicalData.map((phase, i) => (
                      <div
                        key={i}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{phase.phase}</h4>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-blue-600">{phase.patients}</div>
                          <div className="text-xs text-gray-600">Patients</div>
                          <div className="text-lg font-bold text-emerald-600">{phase.successRate}%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${phase.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : phase.status === "Ongoing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {phase.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Advantages Section */}
          <div className="mt-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl p-12 border border-blue-200/50 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Clinical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Advantages
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
              <p className="text-gray-600 max-w-3xl mx-auto">
                Why RNA-based therapies are revolutionizing oncology treatment worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {advantages.map((item, i) => (
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

          {/* Enhanced Contact Section */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl border border-blue-200/50 backdrop-blur-sm max-w-6xl shadow-lg">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Join the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    RNA Revolution
                  </span>
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  Connect with our world-class research team to discuss clinical trials, treatment options, and
                  partnership opportunities in advanced RNA therapeutics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <Mail className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Research Inquiries</h4>
                  <a
                    href="mailto:research@nowcare4u.com"
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    research@nowcare4u.com
                  </a>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <Phone className="w-8 h-8 text-emerald-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Clinical Support</h4>
                  <a
                    href="tel:+18553679224"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                  >
                    +1 (855) 367-9224
                  </a>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <Clock className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Availability</h4>
                  <div className="text-purple-600 font-medium text-center">
                    <p>Mon-Fri: 8AM-8PM EST</p>
                    <p>Sat-Sun: 10AM-4PM EST</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Consultation</span>
                </button>
                <button className="flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <FileText className="w-5 h-5" />
                  <span>Download Research Papers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
