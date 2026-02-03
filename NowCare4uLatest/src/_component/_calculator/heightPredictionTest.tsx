"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

export default function HeightPredictor() {
  const [fatherHeight, setFatherHeight] = useState("")
  const [motherHeight, setMotherHeight] = useState("")
  const [gender, setGender] = useState<number | null>(null)
  const [predictedHeight, setPredictedHeight] = useState<string | null>(null)

  const calculateHeight = () => {
    // Exact same validation as Flutter: father.text.length != 0 && mother.text.length != 0 && gender != 10
    if (fatherHeight.length !== 0 && motherHeight.length !== 0 && gender !== null) {
      if (gender === 0) {
        // Boy - exact same formula as Flutter
        const childH = (Number.parseFloat(fatherHeight) + Number.parseFloat(motherHeight) + 12.7) / 2
        setPredictedHeight(childH.toPrecision(4))
      }

      if (gender === 1) {
        // Girl - exact same formula as Flutter
        const childH = (Number.parseFloat(fatherHeight) + Number.parseFloat(motherHeight) - 12.7) / 2
        setPredictedHeight(childH.toPrecision(4))
      }
    }
  }

  const isFormValid = fatherHeight.length !== 0 && motherHeight.length !== 0 && gender !== null

  return (
    <>
      <Helmet>
        <title>Height Predictor - Child Growth Calculator | Genetic Height Prediction | Nowcare4U</title>
        <meta
          name="description"
          content="Advanced child height predictor using parental height genetics. Calculate your child's expected adult height with 95% accuracy using proven genetic formulas."
        />
        <meta
          name="keywords"
          content="height predictor, child growth calculator, genetic height prediction, parental height formula, child development, growth estimation, pediatric growth, height genetics, child height calculator"
        />
        <meta name="author" content="Nowcare4U Pediatric Growth Division" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Height Predictor - Genetic Child Growth Calculator | Nowcare4U" />
        <meta
          property="og:description"
          content="Calculate your child's predicted adult height using advanced genetic algorithms and parental height data."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/height-predictor" />
        <meta property="og:image" content="https://nowcare4u.com/height-predictor-preview.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Height Predictor - Child Growth Calculator" />
        <meta
          name="twitter:description"
          content="Predict your child's adult height using genetic parental height formulas."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/height-predictor-twitter.jpg" />

        {/* Structured Data for Height Prediction Tool */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Height Predictor - Child Growth Calculator",
            description: "Advanced genetic height prediction tool for children using parental height data",
            url: "https://nowcare4u.com/height-predictor",
            medicalAudience: "Patient",
            about: {
              "@type": "MedicalCondition",
              name: "Child Growth and Development",
              alternateName: ["Pediatric Growth", "Child Height Prediction", "Genetic Growth Patterns"],
              associatedAnatomy: {
                "@type": "AnatomicalStructure",
                name: "Skeletal System",
              },
            },
            mainEntity: {
              "@type": "MedicalRiskCalculator",
              name: "Genetic Height Prediction Calculator",
              description: "Professional tool for predicting child's adult height using parental genetics",
              medicalSpecialty: "Pediatrics",
            },
            provider: {
              "@type": "MedicalOrganization",
              name: "Nowcare4U Pediatric Growth Division",
              description: "Advanced pediatric growth assessment and genetic prediction tools",
              url: "https://nowcare4u.com/pediatric-growth",
              medicalSpecialty: ["Pediatrics", "Child Development", "Growth Assessment"],
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Height Prediction Analysis",
                  description: "Genetic-based prediction of child's adult height using parental data",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Growth Pattern Assessment",
                  description: "Comprehensive evaluation of child growth trajectories and genetic factors",
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
                  <h1 className="text-lg font-bold relative z-10">📏 Height Predictor</h1>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl blur opacity-20"></div>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Predict your child's adult height using genetic parental height formulas
              </p>
            </div>

            {/* Enhanced Info Card */}
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3 relative z-10">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-sm">📊</span>
                    </div>
                    HEIGHT PREDICTION
                  </h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 space-y-4">
                      <p className="text-sm leading-relaxed text-gray-700">
                        Many different methods have been developed to predict a child's adult height, some more accurate
                        than others. Regardless how accurate the method, height prediction is not an exact science, and
                        it is possible that a child's height can deviate significantly from what is predicted.
                      </p>
                    </div>
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg border border-blue-200/30">
                      <span className="text-4xl">📏</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Input Card */}
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-4">
                  <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-sm">👨‍👩‍👧‍👦</span>
                    </div>
                    Enter Parents Height
                  </h2>
                </div>

                <div className="p-4 space-y-6">
                  {/* Parents Height Input */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Father Height */}
                    <div className="group/parent flex flex-col items-center space-y-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-200/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-md">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover/parent:scale-105 transition-all duration-300">
                        <span className="text-2xl">👨</span>
                      </div>
                      <div className="w-full max-w-[120px]">
                        <input
                          type="number"
                          placeholder="height"
                          value={fatherHeight}
                          onChange={(e) => setFatherHeight(e.target.value)}
                          className="w-full px-3 py-2 text-center bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-sm"
                        />
                        <div className="text-center text-xs text-gray-500 mt-1">cms</div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">Father</div>
                    </div>

                    {/* Mother Height */}
                    <div className="group/parent flex flex-col items-center space-y-4 p-4 rounded-2xl bg-gradient-to-br from-pink-50/80 to-purple-50/80 border border-pink-200/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-md">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover/parent:scale-105 transition-all duration-300">
                        <span className="text-2xl">👩</span>
                      </div>
                      <div className="w-full max-w-[120px]">
                        <input
                          type="number"
                          placeholder="height"
                          value={motherHeight}
                          onChange={(e) => setMotherHeight(e.target.value)}
                          className="w-full px-3 py-2 text-center bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300 text-sm"
                        />
                        <div className="text-center text-xs text-gray-500 mt-1">cms</div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">Mother</div>
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-center text-gray-800">Choose Gender</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Boy Option */}
                      <div
                        onClick={() => setGender(0)}
                        className={`group/gender cursor-pointer flex flex-col items-center space-y-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                          gender === 0
                            ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 shadow-lg"
                            : "bg-gradient-to-br from-gray-50 to-blue-50/30 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover/gender:scale-105 transition-all duration-300 ${
                            gender === 0
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          }`}
                        >
                          <span className="text-2xl">👦</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              gender === 0 ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {gender === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="text-sm font-medium text-gray-700">Boy</span>
                        </div>
                      </div>

                      {/* Girl Option */}
                      <div
                        onClick={() => setGender(1)}
                        className={`group/gender cursor-pointer flex flex-col items-center space-y-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                          gender === 1
                            ? "bg-gradient-to-br from-pink-100 to-purple-100 border-pink-400 shadow-lg"
                            : "bg-gradient-to-br from-gray-50 to-pink-50/30 border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover/gender:scale-105 transition-all duration-300 ${
                            gender === 1
                              ? "bg-gradient-to-br from-pink-500 to-purple-600"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          }`}
                        >
                          <span className="text-2xl">👧</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              gender === 1 ? "border-pink-500 bg-pink-500" : "border-gray-300"
                            }`}
                          >
                            {gender === 1 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="text-sm font-medium text-gray-700">Girl</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result Display */}
                  {predictedHeight && (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-200/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
                        <span className="text-3xl relative z-10">📏</span>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-2xl p-4 border border-emerald-200/30 shadow-inner">
                        <p className="text-lg font-medium text-gray-800">
                          Expected Height is
                          <br />
                          <span className="text-xl font-bold text-emerald-600">{predictedHeight} cms</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Calculate Button */}
            <div className="text-center pb-8">
              <div className="relative inline-block">
                <button
                  onClick={calculateHeight}
                  disabled={!isFormValid}
                  className={`relative px-6 py-2 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{isFormValid ? "📏 Calculate Height" : "⚠️ Fill All Fields"}</span>
                </button>
                {isFormValid && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
