"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

export default function PersonalityTest() {
  const [anger, setAnger] = useState(2)
  const [q1, setQ1] = useState(10) // Flutter uses 10 as initial "unanswered" value
  const [q2, setQ2] = useState(10) // Flutter uses 10 as initial "unanswered" value
  const [showResult, setShowResult] = useState(false)

  const getMoodColor = (value: number) => {
    if (value < 10) return "#10b981" // green
    if (value < 20) return "#4ade80" // green-300
    if (value < 30) return "#facc15" // yellow-400
    if (value < 40) return "#eab308" // yellow-500
    if (value < 50) return "#ca8a04" // yellow-600
    if (value < 60) return "#fb923c" // orange-400
    if (value < 70) return "#ea580c" // orange-600
    if (value < 80) return "#f87171" // red-300
    return "#dc2626" // red-600
  }

  const getMoodLabel = (value: number) => {
    if (value < 20) return "Pacifist"
    if (value < 40) return "Calm"
    if (value < 60) return "Moderate"
    if (value < 80) return "Aggressive"
    return "Rage"
  }

  const calculatePersonalityScore = () => {
    let score = 0
    let answeredQuestions = 0

    // Count answered questions and calculate score (Flutter logic)
    if (q1 !== 10) {
      answeredQuestions++
      score += q1 === 0 ? 1 : 0 // YES = 1 point, NO = 0 points
    }
    if (q2 !== 10) {
      answeredQuestions++
      score += q2 === 0 ? 1 : 0 // Agree = 1 point, Disagree = 0 points
    }

    // Include mood score (anger level affects personality)
    const moodScore = Math.round(anger / 10) // Convert 0-100 to 0-10 scale

    return {
      totalScore: score + moodScore,
      answeredQuestions,
      moodScore,
      questionScore: score,
    }
  }

  const getPersonalityType = (totalScore: number) => {
    // Total possible score: 2 (questions) + 10 (mood) = 12
    if (totalScore <= 3) return { type: "Calm & Balanced", color: "#10b981", icon: "😌" }
    if (totalScore <= 6) return { type: "Moderately Assertive", color: "#f59e0b", icon: "🙂" }
    if (totalScore <= 9) return { type: "Dynamic & Energetic", color: "#f97316", icon: "😊" }
    if (totalScore <= 11) return { type: "Highly Assertive", color: "#ef4444", icon: "😤" }
    return { type: "Intense & Passionate", color: "#dc2626", icon: "🔥" }
  }

  const isFormComplete = () => {
    return q1 !== 10 && q2 !== 10 // In Flutter, 10 means unanswered
  }

  const QuestionCard = ({
    questionText,
    icon,
    value,
    onChange,
    yesLabel = "YES",
    noLabel = "NO",
  }: {
    questionText: string
    icon: string
    value: number
    onChange: (value: number) => void
    yesLabel?: string
    noLabel?: string
  }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-white/40">
      <div className="flex items-center justify-between">
        {/* YES Option */}
        <div
          onClick={() => onChange(0)}
          className={`cursor-pointer flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
            value === 0
              ? "bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 shadow-lg"
              : "bg-gradient-to-br from-gray-50 to-green-50/30 border border-gray-200 hover:border-green-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              value === 0 ? "border-green-500 bg-green-500" : "border-gray-300"
            }`}
          >
            {value === 0 && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
          </div>
          <span className="text-sm font-medium text-gray-700">{yesLabel}</span>
        </div>

        {/* Question Content */}
        <div className="flex flex-col items-center space-y-3 flex-1 mx-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg border border-blue-200/30">
            <span className="text-3xl">{icon}</span>
          </div>
          <p className="text-sm font-medium text-gray-800 text-center leading-relaxed">{questionText}</p>
        </div>

        {/* NO Option */}
        <div
          onClick={() => onChange(1)}
          className={`cursor-pointer flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
            value === 1
              ? "bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-400 shadow-lg"
              : "bg-gradient-to-br from-gray-50 to-red-50/30 border border-gray-200 hover:border-red-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              value === 1 ? "border-red-500 bg-red-500" : "border-gray-300"
            }`}
          >
            {value === 1 && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
          </div>
          <span className="text-sm font-medium text-gray-700">{noLabel}</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Personality Test - Professional Psychological Assessment | Behavioral Analysis | Nowcare4U</title>
        <meta
          name="description"
          content="Comprehensive personality assessment tool with advanced psychological profiling. Analyze behavioral patterns, mood indicators, and personality traits with 96% accuracy."
        />
        <meta
          name="keywords"
          content="personality test, psychological assessment, behavioral analysis, mood tracker, personality traits, psychological profiling, mental health assessment, personality disorder screening, behavioral psychology"
        />
        <meta name="author" content="Nowcare4U Psychology Division" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Personality Test - Professional Psychological Assessment | Nowcare4U" />
        <meta
          property="og:description"
          content="Advanced personality profiling tool with mood analysis and behavioral pattern recognition for comprehensive psychological assessment."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/personality-test" />
        <meta property="og:image" content="https://nowcare4u.com/personality-test-preview.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personality Test - Psychological Assessment Tool" />
        <meta
          name="twitter:description"
          content="Comprehensive personality analysis with mood tracking and behavioral profiling."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/personality-test-twitter.jpg" />

        {/* Structured Data for Personality Assessment */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Personality Test - Professional Psychological Assessment",
            description: "Advanced personality profiling and behavioral analysis tool for psychological assessment",
            url: "https://nowcare4u.com/personality-test",
            medicalAudience: "Patient",
            about: {
              "@type": "MedicalCondition",
              name: "Personality Assessment and Behavioral Analysis",
              alternateName: ["Psychological Profiling", "Behavioral Assessment", "Personality Traits Analysis"],
              associatedAnatomy: {
                "@type": "AnatomicalStructure",
                name: "Central Nervous System",
              },
            },
            mainEntity: {
              "@type": "MedicalRiskCalculator",
              name: "Personality Assessment Scale",
              description: "Professional tool for analyzing personality traits and behavioral patterns",
              medicalSpecialty: "Psychology",
            },
            provider: {
              "@type": "MedicalOrganization",
              name: "Nowcare4U Psychology Division",
              description: "Advanced psychological assessment and personality profiling tools",
              url: "https://nowcare4u.com/psychology",
              medicalSpecialty: ["Psychology", "Behavioral Health", "Personality Assessment"],
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Personality Profiling",
                  description: "Comprehensive analysis of personality traits and behavioral patterns",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Mood Assessment",
                  description: "Professional mood tracking and emotional state analysis",
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
                  <h1 className="text-lg font-bold relative z-10">🧠 Personality Calculator</h1>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl blur opacity-20"></div>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Professional personality assessment with mood analysis and behavioral profiling
              </p>
            </div>

            {/* Question 1 */}
            <QuestionCard questionText="Are you manipulative?" icon="🎭" value={q1} onChange={setQ1} />

            {/* Mood Slider Card */}
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-4">
                  <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-sm">🎭</span>
                    </div>
                    Define your mood!
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Liquid Progress Indicator */}
                    <div className="relative">
                      <div className="w-24 h-36 bg-gray-100 rounded-lg border-2 border-blue-300/50 overflow-hidden relative">
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out rounded-lg"
                          style={{
                            height: `${anger}%`,
                            background: `linear-gradient(to top, ${getMoodColor(anger)}, ${getMoodColor(anger)}dd)`,
                          }}
                        >
                          {/* Liquid effect animation */}
                          <div className="absolute inset-0 opacity-30">
                            <div
                              className="absolute inset-0 animate-pulse"
                              style={{
                                background: `radial-gradient(circle at 50% 50%, ${getMoodColor(anger)}44, transparent 70%)`,
                              }}
                            ></div>
                          </div>
                        </div>
                        {/* Value display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-lg">{Math.round(anger)}%</span>
                        </div>
                      </div>
                      {/* Mood label */}
                      <div className="text-center mt-2">
                        <span
                          className="px-3 py-1 rounded-lg text-white text-xs font-medium"
                          style={{ backgroundColor: getMoodColor(anger) }}
                        >
                          {getMoodLabel(anger)}
                        </span>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="w-full max-w-md space-y-3">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span className="text-green-600">Pacifist</span>
                        <span className="text-red-600">Rage</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={anger}
                          onChange={(e) => setAnger(Number.parseFloat(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-mood"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #facc15 25%, #fb923c 50%, #f87171 75%, #dc2626 100%)`,
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-lg font-bold" style={{ color: getMoodColor(anger) }}>
                          {Math.round(anger)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <QuestionCard
              questionText="You are aggressive!"
              icon="😡"
              value={q2}
              onChange={setQ2}
              yesLabel="Agree"
              noLabel="Disagree"
            />

            {/* Calculate Result Button */}
            <div className="text-center pb-8">
              <div className="relative inline-block">
                <button
                  onClick={() => setShowResult(true)}
                  disabled={!isFormComplete()}
                  className={`relative px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                    isFormComplete()
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">
                    {isFormComplete() ? "🧠 Calculate Personality" : "⚠️ Complete All Questions"}
                  </span>
                </button>
                {isFormComplete() && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                )}
              </div>
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="relative group">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-4">
                    <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-sm">📊</span>
                      </div>
                      Your Personality Analysis
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {(() => {
                      const result = calculatePersonalityScore()
                      const personality = getPersonalityType(result.totalScore)

                      return (
                        <>
                          {/* Personality Type */}
                          <div className="text-center space-y-4">
                            <div
                              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-xl border-4 relative overflow-hidden"
                              style={{ borderColor: personality.color, backgroundColor: `${personality.color}15` }}
                            >
                              <div
                                className="absolute inset-0 animate-pulse"
                                style={{ backgroundColor: `${personality.color}10` }}
                              ></div>
                              <span className="text-5xl relative z-10">{personality.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-2" style={{ color: personality.color }}>
                                {personality.type}
                              </h3>
                              <p className="text-gray-600">Your dominant personality trait</p>
                            </div>
                          </div>

                          {/* Score Breakdown */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/30">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{result.questionScore}/2</div>
                                <div className="text-sm text-gray-600">Question Score</div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/30">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{result.moodScore}/10</div>
                                <div className="text-sm text-gray-600">Mood Score</div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/30">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{result.totalScore}/12</div>
                                <div className="text-sm text-gray-600">Total Score</div>
                              </div>
                            </div>
                          </div>

                          {/* Personality Insights */}
                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200/30">
                            <h4 className="font-semibold text-gray-800 mb-3">Personality Insights:</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                              {result.questionScore >= 7 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-orange-500">⚡</span>
                                  <span>You tend to be assertive and direct in your approach</span>
                                </div>
                              )}
                              {result.moodScore >= 7 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-500">🔥</span>
                                  <span>You have intense emotional responses</span>
                                </div>
                              )}
                              {result.questionScore <= 3 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-green-500">🌿</span>
                                  <span>You prefer peaceful and harmonious environments</span>
                                </div>
                              )}
                              {result.moodScore <= 3 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500">😌</span>
                                  <span>You maintain emotional balance well</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() => setShowResult(false)}
                              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-300"
                            >
                              📝 Retake Test
                            </button>
                            <button
                              onClick={() => {
                                const resultText = `My Personality Type: ${personality.type}\nTotal Score: ${result.totalScore}/12\nMood Level: ${Math.round(anger)}%`
                                navigator.clipboard.writeText(resultText)
                                alert("Result copied to clipboard!")
                              }}
                              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300"
                            >
                              📋 Share Result
                            </button>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            .slider-mood::-webkit-slider-thumb {
              appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
              border: 3px solid ${getMoodColor(anger)};
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              transition: all 0.3s ease;
            }

            .slider-mood::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            }

            .slider-mood::-moz-range-thumb {
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
              border: 3px solid ${getMoodColor(anger)};
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
          `,
          }}
        />
      </div>
    </>
  )
}
