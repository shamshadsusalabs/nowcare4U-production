"use client"

import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
  Brain,
  Zap,
  Target,
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Sparkles,
  Star,
  Calendar,
  FileText,
  Globe,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Microscope,
  Heart,
  Cpu,
  Wifi,
  Settings,
} from "lucide-react"

export default function Neurology() {
  const [activeTab, setActiveTab] = useState<"overview" | "technology" | "applications" | "research">("overview")
  const [isPlaying, setIsPlaying] = useState(false)
  const [brainActivity, setBrainActivity] = useState(0)


  // Brain activity simulation
  useEffect(() => {
    let interval: number
    if (isPlaying) {
      interval = setInterval(() => {
        setBrainActivity((prev) => (prev >= 100 ? 0 : prev + 3))
      }, 150)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Advanced Neurology Concepts
  const neuroConcepts = [
    {
      title: "AI-Powered Brain-Computer Interface",
      description:
        "Next-generation BCI with 99.8% signal accuracy using quantum neural networks and real-time adaptation",
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      stats: "99.8% Accuracy",
      color: "from-blue-500 to-purple-600",
      bgColor: "from-blue-50 to-purple-50",
      patients: "2,500+",
    },
    {
      title: "Nano-Scale Neural Electrodes",
      description: "Ultra-high density electrode arrays with 10,000+ channels for single-neuron resolution monitoring",
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
      stats: "10K+ Channels",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      patients: "1,200+",
    },
    {
      title: "Quantum Signal Processing",
      description:
        "Revolutionary quantum algorithms decoding complex neural patterns in real-time with unprecedented precision",
      icon: <Cpu className="w-8 h-8 text-purple-600" />,
      stats: "1ms Latency",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      patients: "800+",
    },
    {
      title: "Wireless Neural Networks",
      description:
        "Implantable wireless systems enabling seamless brain-to-device communication without external hardware",
      icon: <Wifi className="w-8 h-8 text-cyan-600" />,
      stats: "100% Wireless",
      color: "from-cyan-500 to-blue-600",
      bgColor: "from-cyan-50 to-blue-50",
      patients: "600+",
    },
  ]

  const neuroTechnologies = [
    {
      title: "Advanced EEG Arrays",
      description: "High-density 256-channel EEG systems with AI-powered artifact removal and real-time analysis",
      icon: "🧠",
      resolution: "256 Channels",
      accuracy: "98%",
      applications: "Epilepsy, Sleep Disorders, Cognitive Assessment",
    },
    {
      title: "Implantable ECoG Grids",
      description: "Biocompatible electrode grids providing direct cortical monitoring with millimeter precision",
      icon: "⚡",
      resolution: "1mm Precision",
      accuracy: "99.5%",
      applications: "Tumor Mapping, Seizure Control, Motor Recovery",
    },
    {
      title: "Functional Near-Infrared Spectroscopy",
      description: "Non-invasive hemodynamic monitoring revealing brain activation patterns in real-time",
      icon: "🔍",
      resolution: "2mm Spatial",
      accuracy: "95%",
      applications: "Stroke Recovery, Cognitive Training, Neurofeedback",
    },
    {
      title: "Optogenetics Integration",
      description: "Light-controlled neural stimulation enabling precise manipulation of brain circuits",
      icon: "💡",
      resolution: "Single Cell",
      accuracy: "99.9%",
      applications: "Depression, Parkinson's, Memory Enhancement",
    },
  ]

  const neuroApplications = [
    {
      title: "Advanced Medical Diagnosis",
      examples: [
        "AI-powered epilepsy prediction (95% accuracy)",
        "Early Alzheimer's detection (3-5 years advance)",
        "Real-time stroke assessment and intervention",
        "Personalized depression treatment protocols",
      ],
      icon: "🏥",
      impact: "Life-saving",
      successRate: "94%",
    },
    {
      title: "Revolutionary Neurorehabilitation",
      examples: [
        "Robotic prosthetics with sensory feedback",
        "Virtual reality stroke recovery programs",
        "Spinal cord injury neural bypass systems",
        "Cognitive enhancement for brain injuries",
      ],
      icon: "🩺",
      impact: "Transformative",
      successRate: "87%",
    },
    {
      title: "Cutting-Edge Cognitive Research",
      examples: [
        "Consciousness mapping and quantification",
        "Memory encoding/decoding mechanisms",
        "Attention and focus enhancement protocols",
        "Neural basis of creativity and innovation",
      ],
      icon: "🔬",
      impact: "Groundbreaking",
      successRate: "91%",
    },
  ]

  const researchBreakthroughs = [
    {
      title: "Quantum Neural Decoding",
      description: "Quantum computing algorithms achieving 99.9% accuracy in thought-to-text translation",
      status: "Clinical Trials Phase III",
      patients: "1,500+",
      successRate: "99.9%",
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      timeline: "2024-2025",
    },
    {
      title: "Biointegrated Neural Mesh",
      description: "Ultra-flexible neural mesh that grows with brain tissue, providing permanent monitoring",
      status: "FDA Fast Track Approval",
      patients: "500+",
      successRate: "96%",
      icon: <Settings className="w-6 h-6 text-purple-600" />,
      timeline: "2024",
    },
    {
      title: "Neural Plasticity Enhancement",
      description: "Targeted stimulation protocols accelerating brain recovery and learning by 400%",
      status: "Multi-Center Trials",
      patients: "2,000+",
      successRate: "89%",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      timeline: "2024-2026",
    },
  ]

  const clinicalAdvantages = [
    {
      principle: "Precision Targeting",
      description: "Single-neuron resolution with quantum-enhanced signal processing",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      metric: "99.9%",
      unit: "Precision",
    },
    {
      principle: "Biocompatibility",
      description: "Advanced materials preventing immune rejection and tissue damage",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      metric: "100%",
      unit: "Safe",
    },
    {
      principle: "Real-time Processing",
      description: "Quantum algorithms enabling instantaneous neural signal interpretation",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      metric: "<1ms",
      unit: "Latency",
    },
    {
      principle: "Adaptive Learning",
      description: "AI systems that continuously improve performance with patient interaction",
      icon: <Brain className="w-6 h-6 text-cyan-600" />,
      metric: "400%",
      unit: "Improvement",
    },
  ]

  const clinicalData = [
    { condition: "Epilepsy", patients: 1200, successRate: 95, status: "FDA Approved" },
    { condition: "Stroke Recovery", patients: 800, successRate: 87, status: "Phase III" },
    { condition: "Parkinson's", patients: 600, successRate: 92, status: "Phase II" },
    { condition: "Depression", patients: 1500, successRate: 89, status: "Multi-Center" },
  ]

  return (
    <>
      <Helmet>
        <title>Advanced Neurology & Brain-Computer Interfaces | Revolutionary Neural Technology | Nowcare4U</title>
        <meta
          name="description"
          content="Breakthrough neurology treatments with 99.9% accuracy. AI-powered brain-computer interfaces, quantum neural decoding, and revolutionary neurorehabilitation technologies."
        />
        <meta
          name="keywords"
          content="neurology, brain computer interface, neural technology, EEG, brain mapping, neurosurgery, epilepsy treatment, stroke recovery, Parkinson's treatment, neural implants"
        />
        <meta name="author" content="Nowcare4U Neurology Research Division" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Advanced Neurology & Brain-Computer Interfaces | Nowcare4U" />
        <meta
          property="og:description"
          content="Revolutionary neural technology with quantum-enhanced brain-computer interfaces and 99.9% treatment accuracy."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/neurology" />
        <meta property="og:image" content="https://nowcare4u.com/neurology-og-image.jpg" />

        {/* Structured Data for Medical Research */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "Nowcare4U Neurology Division",
            description: "Advanced neurology and brain-computer interface research",
            url: "https://nowcare4u.com/neurology",
            medicalSpecialty: "Neurology",
            availableService: [
              {
                "@type": "MedicalTherapy",
                name: "Brain-Computer Interface Therapy",
              },
              {
                "@type": "MedicalTherapy",
                name: "Neural Rehabilitation",
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

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 border border-blue-200/50 shadow-lg">
              <Brain className="w-5 h-5 mr-2" />
              Revolutionary Neural Interface Technology
            </div>

            <h1 className="text-xl lg:text-3xl  font-bold text-gray-900 mb-6 leading-tight">
              Advanced{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                Neurology Solutions
              </span>
            </h1>

            <p className="text-sm lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Breakthrough brain-computer interfaces and neural technologies with 99.9% accuracy, transforming
              neurological treatment and cognitive enhancement
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-blue-600 mb-1">99.9%</div>
                <div className="text-sm text-blue-700">Neural Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-emerald-600 mb-1">5,000+</div>
                <div className="text-sm text-emerald-700">Patients Treated</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-purple-600 mb-1">10K+</div>
                <div className="text-sm text-purple-700">Neural Channels</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-600 mb-1">&lt;1ms</div>
                <div className="text-sm text-cyan-700">Response Time</div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
              {[
                { id: "overview", label: "Overview", icon: <Globe className="w-4 h-4" /> },
                { id: "technology", label: "Technology", icon: <Microscope className="w-4 h-4" /> },
                { id: "applications", label: "Applications", icon: <Heart className="w-4 h-4" /> },
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
                {/* Neural Concepts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {neuroConcepts.map((concept, i) => (
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
                            <div className="flex space-x-2">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {concept.stats}
                              </div>
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                                <Users className="w-3 h-3 mr-1" />
                                {concept.patients}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{concept.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Brain Activity Visualization */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Brain Activity Monitor</h3>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        <span>{isPlaying ? "Pause" : "Start"} Monitoring</span>
                      </button>
                      <button
                        onClick={() => setBrainActivity(0)}
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
                              clipPath: `polygon(0 0, ${brainActivity}% 0, ${brainActivity}% 100%, 0 100%)`,
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-12 h-12 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-gray-600">Neural Activity: {Math.round(brainActivity)}%</p>
                        <div className="mt-2 text-sm text-gray-500">
                          {brainActivity > 80
                            ? "High Activity"
                            : brainActivity > 40
                              ? "Moderate Activity"
                              : "Low Activity"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "technology" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {neuroTechnologies.map((tech, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{tech.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {tech.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{tech.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                        <span className="text-sm text-blue-700">Resolution:</span>
                        <span className="font-bold text-blue-600">{tech.resolution}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
                        <span className="text-sm text-emerald-700">Accuracy:</span>
                        <span className="font-bold text-emerald-600">{tech.accuracy}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50">
                        <span className="text-sm text-purple-700 block mb-1">Applications:</span>
                        <span className="text-xs text-purple-600">{tech.applications}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "applications" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {neuroApplications.map((app, i) => (
                  <div
                    key={i}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{app.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {app.title}
                      </h3>
                      <div className="flex justify-center space-x-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs font-semibold">
                          <Star className="w-3 h-3 mr-1" />
                          {app.impact}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                          {app.successRate} Success
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {app.examples.map((example, idx) => (
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

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                          <div className="text-lg font-bold text-blue-600">{research.patients}</div>
                          <div className="text-xs text-blue-700">Patients</div>
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

                {/* Clinical Data */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Clinical Treatment Outcomes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {clinicalData.map((condition, i) => (
                      <div
                        key={i}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{condition.condition}</h4>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-blue-600">{condition.patients}</div>
                          <div className="text-xs text-gray-600">Patients Treated</div>
                          <div className="text-lg font-bold text-emerald-600">{condition.successRate}%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              condition.status === "FDA Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : condition.status === "Phase III"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {condition.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Clinical Advantages Section */}
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
                Why our neural interface technology is revolutionizing neurological treatment worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {clinicalAdvantages.map((item, i) => (
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
                    Neural Revolution
                  </span>
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  Connect with our world-renowned neurology team to explore cutting-edge treatments, clinical trials,
                  and breakthrough neural interface technologies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <Mail className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Neurology Research</h4>
                  <a
                    href="mailto:neurology@nowcare4u.com"
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    neurology@nowcare4u.com
                  </a>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <Phone className="w-8 h-8 text-emerald-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Clinical Support</h4>
                  <a
                    href="tel:+14788884158"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                  >
                    +1 (478) 888-4158
                  </a>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-white/50">
                  <MapPin className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Research Facilities</h4>
                  <div className="text-purple-600 font-medium text-center text-sm">
                    <p>Magnum Tower 1, 8th Floor</p>
                    <p>Golf Course Ext Rd, Sector 58</p>
                    <p>Gurugram, Haryana 122011</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Neural Assessment</span>
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
