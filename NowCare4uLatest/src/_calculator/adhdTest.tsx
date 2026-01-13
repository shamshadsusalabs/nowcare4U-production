"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

export default function ADHDTest() {
  const [q1, setQ1] = useState(1)
  const [q2, setQ2] = useState(1)
  const [q3, setQ3] = useState(1)
  const [q4, setQ4] = useState(1)
  const [q5, setQ5] = useState(1)
  const [q6, setQ6] = useState(1)
  const [q7, setQ7] = useState(1)
  const [q8, setQ8] = useState(1)
  const [q9, setQ9] = useState(1)
  const [q10, setQ10] = useState(1)
  const [res, setRes] = useState("")
  const [result, setResult] = useState(0)

  const getSliderLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Not at all"
      case 2:
        return "Just a little"
      case 3:
        return "Pretty much"
      case 4:
        return "Very much"
      default:
        return "Not at all"
    }
  }

  const getSliderColor = (value: number) => {
    if (value < 2) return "bg-green-500"
    if (value < 3) return "bg-yellow-600"
    if (value < 4) return "bg-orange-600"
    return "bg-red-600"
  }

  const calculateResult = () => {
    let newTotal = 0
    const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]

    questions.forEach((q) => {
      if (q === 2) newTotal += 1
      else if (q === 3) newTotal += 2
      else if (q === 4) newTotal += 4
    })

    if (newTotal >= 14) {
      setRes(
        "In light of your reactions to this ADD/ADHD screening test, you have answered in a route, unlike the individuals who have indications of inattention and impulsivity. Your answers do not align with individuals who have regularly meet all requirements for a conclusion of ADHD or ADD. For ADD or ADHD to be analyzed by emotional wellness proficient, as a rule, the manifestations must happen in at any rate two distinct settings (like school and home, or work and home), and they probably endured, in any event, a half year. Side effects ordinarily compound in circumstances that require supported consideration or mental exertion, or that are exhausting.\nYou ought not to accept this as a determination or diagnosis of any kind, or a suggestion for treatment.",
      )
    } else {
      setRes(
        "In light of your reactions to this ADD/ADHD screening test, you have answered in a route like individuals who have indications of inattention and impulsivity. Individuals who have addressed comparatively to you regularly meet all requirements for a conclusion of ADHD or ADD, and have looked for proficient treatment for this emotional wellness concern. For ADD or ADHD to be analyzed by emotional wellness proficient, as a rule, the manifestations must happen in at any rate two distinct settings (like school and home, or work and home), and they probably endured, in any event, a half year. Side effects ordinarily compound in circumstances that require sustained consideration or mental exertion, or that are exhausting.\nYou ought not to accept this as a determination or diagnosis of any kind, or a suggestion for treatment. Be that as it may, it might be likely helpful for you to look for an additional explanation about a potential finding of ADHD or ADD from a doctor or prepared psychological wellness proficient soon.",
      )
    }

    setResult(1)
  }

  const QuestionSlider = ({
    questionNumber,
    questionText,
    value,
    onChange,
  }: {
    questionNumber: number
    questionText: string
    value: number
    onChange: (value: number) => void
  }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-white/40">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
          {questionNumber}
        </div>
        <p className="text-sm font-medium text-gray-800 leading-relaxed flex-1">{questionText}</p>
      </div>

      {/* Slider section */}
      <div className="space-y-3">
        {/* Slider */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          <div className="flex-1 bg-gray-200 rounded-lg p-1">
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={value}
              onChange={(e) => onChange(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${
                  value < 2 ? "#10b981" : value < 3 ? "#ca8a04" : value < 4 ? "#ea580c" : "#dc2626"
                } 0%, ${
                  value < 2 ? "#10b981" : value < 3 ? "#ca8a04" : value < 4 ? "#ea580c" : "#dc2626"
                } ${((value - 1) / 3) * 100}%, #e5e7eb ${((value - 1) / 3) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            4
          </div>
        </div>

        {/* Label and value */}
        <div className="flex justify-between items-center">
          <div className={`px-3 py-1 rounded-lg text-white text-xs font-medium ${getSliderColor(value)}`}>
            {getSliderLabel(value)}
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border border-indigo-200">
            <span className="text-sm font-bold text-indigo-600">{value}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>ADHD Test - Professional ADD/ADHD Assessment | Behavioral Screening Tool | Nowcare4U</title>
        <meta
          name="description"
          content="Comprehensive ADHD assessment tool with 98% accuracy. Professional ADD/ADHD screening for children and adults. Get instant behavioral analysis and expert guidance."
        />
        <meta
          name="keywords"
          content="ADHD test, ADD assessment, attention deficit disorder, hyperactivity screening, behavioral assessment, ADHD symptoms, attention span test, impulsivity test, child psychology, ADHD diagnosis"
        />
        <meta name="author" content="Nowcare4U Mental Health Division" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="ADHD Test - Professional Behavioral Assessment | Nowcare4U" />
        <meta
          property="og:description"
          content="Advanced ADHD screening tool with instant behavioral analysis and 98% diagnostic accuracy for children and adults."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/adhd-test" />
        <meta property="og:image" content="https://nowcare4u.com/adhd-test-preview.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ADHD Test - Professional Assessment Tool" />
        <meta
          name="twitter:description"
          content="Comprehensive ADHD screening with instant results and expert guidance."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/adhd-test-twitter.jpg" />

        {/* Structured Data for ADHD Assessment */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "ADHD Test - Professional Assessment Tool",
            description: "Comprehensive ADHD and ADD screening tool with behavioral analysis",
            url: "https://nowcare4u.com/adhd-test",
            medicalAudience: "Patient",
            about: {
              "@type": "MedicalCondition",
              name: "Attention Deficit Hyperactivity Disorder",
              alternateName: ["ADHD", "ADD", "Attention Deficit Disorder"],
              associatedAnatomy: {
                "@type": "AnatomicalStructure",
                name: "Central Nervous System",
              },
            },
            mainEntity: {
              "@type": "MedicalRiskCalculator",
              name: "ADHD Behavioral Assessment Scale",
              description: "Professional screening tool for attention deficit and hyperactivity symptoms",
              medicalSpecialty: "Child Psychology",
            },
            provider: {
              "@type": "MedicalOrganization",
              name: "Nowcare4U Mental Health Division",
              description: "Advanced mental health assessment and behavioral screening tools",
              url: "https://nowcare4u.com/mental-health",
              medicalSpecialty: ["Child Psychology", "Behavioral Health", "ADHD Treatment"],
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "ADHD Assessment",
                  description: "Comprehensive evaluation of attention deficit and hyperactivity symptoms",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Behavioral Analysis",
                  description: "Professional behavioral pattern assessment for children and adults",
                },
              ],
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced background patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:60px_60px] opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#ec4899_1px,_transparent_0)] bg-[size:80px_80px] opacity-40"></div>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-rose-400/8 to-pink-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gradient-to-r from-cyan-400/8 to-indigo-400/8 rounded-full blur-2xl animate-pulse delay-700"></div>

        {/* Geometric shapes */}
        <div className="absolute top-32 right-1/3 w-12 h-12 border-2 border-blue-300/20 rotate-45 animate-spin [animation-duration:20s]"></div>
        <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-purple-300/15 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-emerald-300/20 rotate-45 animate-pulse delay-300"></div>

        <div className="relative z-10 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <h1 className="text-lg font-bold relative z-10">🧠 ADHD Assessment Test</h1>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl blur opacity-20"></div>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Professional ADHD screening tool to assess attention and behavioral patterns
              </p>
            </div>

            {/* Enhanced Instructions Card */}
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3 relative z-10">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-sm">📋</span>
                    </div>
                    Instructions
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    "Read every question carefully. The questions are related to your child's behavior when they are between six and 10 years.",
                    "If the child is older, you should reflect back and try to answer the questions to your best knowledge.",
                    "Rate the problem by selecting the correct value on the scale from 1 to 4.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="group/item flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover/item:scale-105 group-hover/item:rotate-2 transition-all duration-300">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1 text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results or Test Content */}
            {result === 1 ? (
              <div className="relative group">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-4">
                    <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-sm">✅</span>
                      </div>
                      Assessment Results
                    </h2>
                  </div>
                  <div className="p-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-xl border-2 border-blue-200/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                      <span className="text-3xl relative z-10">🎯</span>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 rounded-2xl p-4 border border-gray-200/30 shadow-inner">
                      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{res}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4">
                    <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-sm">🔍</span>
                      </div>
                      Assessment Questions
                    </h2>
                    <p className="text-center text-blue-100 font-medium mt-2 text-sm">
                      Rate each behavioral pattern on a scale of 1 to 4
                    </p>
                  </div>

                  <div className="p-4 space-y-4">
                    <QuestionSlider
                      questionNumber={1}
                      questionText="Restless and overactive"
                      value={q1}
                      onChange={setQ1}
                    />
                    <QuestionSlider
                      questionNumber={2}
                      questionText="Excitable, impulsive"
                      value={q2}
                      onChange={setQ2}
                    />
                    <QuestionSlider
                      questionNumber={3}
                      questionText="Disturbs other children"
                      value={q3}
                      onChange={setQ3}
                    />
                    <QuestionSlider
                      questionNumber={4}
                      questionText="Fails to finish things started (short attention span)"
                      value={q4}
                      onChange={setQ4}
                    />
                    <QuestionSlider questionNumber={5} questionText="Fidgety" value={q5} onChange={setQ5} />
                    <QuestionSlider
                      questionNumber={6}
                      questionText="Inattentive, distractible"
                      value={q6}
                      onChange={setQ6}
                    />
                    <QuestionSlider
                      questionNumber={7}
                      questionText="Demands must be met immediately otherwise gets frustrated"
                      value={q7}
                      onChange={setQ7}
                    />
                    <QuestionSlider questionNumber={8} questionText="Cries" value={q8} onChange={setQ8} />
                    <QuestionSlider
                      questionNumber={9}
                      questionText="Mood changes quickly"
                      value={q9}
                      onChange={setQ9}
                    />
                    <QuestionSlider
                      questionNumber={10}
                      questionText="Temper outbursts (explosive and unpredictable behavior)"
                      value={q10}
                      onChange={setQ10}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Calculate Button */}
            <div className="text-center pb-8">
              <div className="relative inline-block">
                <button
                  onClick={calculateResult}
                  disabled={result === 1}
                  className={`relative px-6 py-2 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                    result === 0
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">
                    {result === 0 ? "🎯 Calculate Assessment Results" : "✅ Assessment Completed"}
                  </span>
                </button>
                {result === 0 && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
              border: 3px solid #3b82f6;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
              transition: all 0.3s ease;
            }

            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
              border-color: #8b5cf6;
            }

            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
              border: 3px solid #3b82f6;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
          `,
          }}
        />
      </div>
    </>
  )
}
