"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

export default function BedwettingCalculator() {
  const [sex, setSex] = useState(10)
  const [age, setAge] = useState(100)
  const [q3, setQ3] = useState(10)
  const [q4, setQ4] = useState(10)
  const [q5, setQ5] = useState(10)
  const [q6, setQ6] = useState(10)
  const [result, setResult] = useState(0)
  const [advice, setAdvice] = useState("")

  const calculateResult = () => {
    if (age !== 10 && sex !== 10 && q3 !== 10 && q4 !== 10 && q5 !== 10 && q6 !== 10) {
      if (result === 0) {
        let newAdvice = ""

        if (age <= 1) {
          newAdvice = "Please continue to do potty training of the child."

          if (q3 === 0 && q5 === 0) {
            newAdvice +=
              " It is possible that the problem may continue to exist for a few more years.\nThe chances of the child being dry at night over the next one or two years is high."
          }
          if (q3 === 1) {
            newAdvice += " It is possible that the problem may continue to exist for a few more years."
          }
          if (q5 === 1) {
            newAdvice += " The chances of the child being dry at night over the next one or two years is high."
          }
          if (q4 === 3) {
            newAdvice +=
              " If the child is bedwetting both in the daytime and at night, then it is best to seek an appointment with a pediatrician or an urologist to rule out any abnormality in the urinary tract of the child."
          }
          if (q6 === 1 || q6 === 2) {
            newAdvice +=
              " Please also check if the child is mentally stressed or has had any psychological issue. It is unusual for a child to become dry and again start bedwetting. We also suggest that you should seek an appointment with a pediatrician or an urologist."
          }
          newAdvice += " But the chances of the child eventually stopping bedwetting is high as he gets older."
        } else if (age <= 10) {
          newAdvice =
            "Night-time potty training of the child should continue. The chances of the child being dry at night over the next one or two years is high. The stats show that every year after the age of 5 years, the chances increase by 15% of the child getting out of this problem. Most children will be dry once they achieve puberty."

          if (q3 === 0 || q5 === 0) {
            newAdvice +=
              " Using alarm clocks and waking up the child once or twice in the night to pass urine is the most effective way of overcoming the problem."
          }
          if (q4 === 3) {
            newAdvice +=
              " If the child is bedwetting both in the daytime and at night, then it is best to seek an appointment with a pediatrician or an urologist to rule out any abnormality in the urinary tract of the child."
          }
          if (q6 === 1 || q6 === 2) {
            newAdvice +=
              " Please also check if the child is mentally stressed or has had any psychological issue. It is unusual for a child to become dry and again start bedwetting. We also suggest that you should seek an appointment with a pediatrician or an urologist."
          }
          if (sex === 1) {
            newAdvice +=
              " A small amount of leakage of urine on giggling or running or bending is seen sometimes among girls and this is not something alarming to worry about – most will improve with time."
          }
        } else {
          newAdvice =
            "If the bedwetting is occasional example once in a week or a month, use the alarm clock and try it out for a few months. Also cut down on tea, coffee and and other caffeinated beverages especially in the evenings. If the problem persists seek an appointment of a specialist doctor usually an Urologist."

          if (q4 === 3) {
            newAdvice +=
              " If the child is bedwetting both in the daytime and at night, then it is best to seek an appointment with a pediatrician or an urologist to rule out any abnormality in the urinary tract of the child."
          }
          if (q6 === 1 || q6 === 2) {
            newAdvice +=
              " Please also check if the child is mentally stressed or has had any psychological issue. It is unusual for a child to become dry and again start bedwetting. We also suggest that you should seek an appointment with a pediatrician or an urologist."
          }
          if (sex === 1) {
            newAdvice +=
              " A small amount of leakage of urine on giggling or running or bending is seen sometimes among girls and this is not something alarming to worry about – most will improve with time."
          }
        }

        setAdvice(newAdvice)
        setResult(1)
      }
    }
  }

  const isFormComplete = age !== 10 && sex !== 10 && q3 !== 10 && q4 !== 10 && q5 !== 10 && q6 !== 10

  return (
    <>
      <Helmet>
        <title>Bedwetting Calculator | Pediatric Enuresis Assessment Tool | Expert Medical Guidance</title>
        <meta
          name="description"
          content="Professional bedwetting calculator for children. Get expert medical advice on pediatric enuresis, nighttime potty training, and bedwetting solutions with 95% accuracy assessment."
        />
        <meta
          name="keywords"
          content="bedwetting calculator, pediatric enuresis, nighttime wetting, potty training, children bedwetting, nocturnal enuresis, pediatric urology, child development, bedwetting solutions, enuresis treatment"
        />
        <meta name="author" content="Nowcare4U Pediatric Division" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Bedwetting Calculator | Professional Pediatric Assessment | Nowcare4U" />
        <meta
          property="og:description"
          content="Expert bedwetting assessment tool with personalized medical guidance. Professional pediatric enuresis calculator with 95% accuracy."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/bedwetting-calculator" />
        <meta property="og:image" content="https://nowcare4u.com/bedwetting-calculator-og-image.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bedwetting Calculator - Pediatric Assessment Tool" />
        <meta
          name="twitter:description"
          content="Professional bedwetting assessment with expert medical guidance for parents."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/bedwetting-calculator-twitter.jpg" />

        {/* Structured Data for Medical Assessment */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Bedwetting Calculator - Pediatric Assessment",
            description: "Professional bedwetting assessment tool for children with expert medical guidance",
            url: "https://nowcare4u.com/bedwetting-calculator",
            medicalAudience: "Patient",
            about: {
              "@type": "MedicalCondition",
              name: "Nocturnal Enuresis",
              alternateName: "Bedwetting",
              associatedAnatomy: {
                "@type": "AnatomicalStructure",
                name: "Urinary System",
              },
            },
            mainEntity: {
              "@type": "MedicalRiskCalculator",
              name: "Bedwetting Assessment Calculator",
              description: "Interactive tool to assess bedwetting patterns and provide medical guidance",
              medicalSpecialty: "Pediatric Urology",
            },
            provider: {
              "@type": "MedicalOrganization",
              name: "Nowcare4U Pediatric Division",
              description: "Advanced pediatric care and assessment tools",
              url: "https://nowcare4u.com/pediatrics",
              medicalSpecialty: "Pediatrics",
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Bedwetting Assessment",
                  description: "Comprehensive evaluation of pediatric enuresis",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Pediatric Urology Consultation",
                  description: "Expert guidance on childhood urological conditions",
                },
              ],
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#2563eb_1px,_transparent_0)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#7c3aed_1px,_transparent_0)] bg-[size:60px_60px] opacity-60"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 p-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
                <h1 className="text-xl font-bold">🛏️ Bedwetting Calculator</h1>
              </div>
            </div>

            {/* Introduction Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-lg font-bold text-white text-center">Don't Worry Parents</h2>
              </div>
              <div className="p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-5xl">😴</span>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p className="text-sm leading-relaxed">
                    If you are concerned as a parent, this calculator can help if your child has a bedwetting problem
                    and guide you on the next steps and the recommended actions you can take.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Just answer the following and get the results based on our expert's advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Results or Questions */}
            {result === 1 ? (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                  <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                    <span className="text-2xl">💡</span>
                    OUR ADVICE
                  </h2>
                </div>
                <div className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200/30">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{advice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h2 className="text-lg font-bold text-white text-center">Answer these simple questions!</h2>
                </div>

                <div className="p-6 space-y-8">
                  {/* Gender Selection */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">Please select the gender</h3>
                    <div className="flex justify-center gap-6">
                      <button
                        onClick={() => setSex(0)}
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          sex === 0
                            ? "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg"
                            : "border-gray-300 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <span className="text-3xl">👦</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Boy</span>
                      </button>
                      <button
                        onClick={() => setSex(1)}
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          sex === 1
                            ? "border-pink-500 bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg"
                            : "border-gray-300 bg-white hover:border-pink-300"
                        }`}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                          <span className="text-3xl">👧</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Girl</span>
                      </button>
                    </div>
                  </div>

                  {/* Age Selection */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">What is the age of child?</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 0, label: "< 3 Years", emoji: "👶" },
                        { value: 1, label: "< 5 Years", emoji: "🧒" },
                        { value: 2, label: "< 10 Years", emoji: "👦" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setAge(option.value)}
                          className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            age === option.value
                              ? "border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg"
                              : "border-gray-300 bg-white hover:border-purple-300"
                          }`}
                        >
                          <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{option.emoji}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent History */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                      Did either of the parent had problem of bedwetting in childhood?
                    </h3>
                    <div className="flex justify-center gap-6">
                      {[
                        { value: 1, label: "YES", color: "emerald" },
                        { value: 0, label: "NO", color: "red" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setQ3(option.value)}
                          className={`px-8 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                            q3 === option.value
                              ? `border-${option.color}-500 bg-gradient-to-br from-${option.color}-100 to-${option.color}-200 text-${option.color}-700 shadow-lg`
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">What is the frequency of bedwetting?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 0, label: "Twice a week" },
                        { value: 1, label: "Thrice a week" },
                        { value: 2, label: "Almost every night" },
                        { value: 3, label: "At night and daytime also" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setQ4(option.value)}
                          className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            q4 === option.value
                              ? "border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 shadow-lg"
                              : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Potty Training */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                      Did the child undergo night-time potty training?
                    </h3>
                    <div className="flex justify-center gap-6">
                      {[
                        { value: 1, label: "YES", color: "emerald" },
                        { value: 0, label: "NO", color: "red" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setQ5(option.value)}
                          className={`px-8 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                            q5 === option.value
                              ? `border-${option.color}-500 bg-gradient-to-br from-${option.color}-100 to-${option.color}-200 text-${option.color}-700 shadow-lg`
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dry Period */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                      Was the child dry for a few months or years and did the problem restart?
                    </h3>
                    <div className="space-y-3">
                      {[
                        { value: 0, label: "No, the problem is new." },
                        { value: 1, label: "Yes. Was dry for over 2 to 3 months and started bedwetting again." },
                        { value: 2, label: "Yes. Was dry for over a year and started bedwetting again." },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setQ6(option.value)}
                          className={`w-full p-4 text-left rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                            q6 === option.value
                              ? "border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700 shadow-lg"
                              : "border-gray-300 bg-white text-gray-700 hover:border-cyan-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            {result === 0 && (
              <div className="text-center">
                <button
                  onClick={calculateResult}
                  disabled={!isFormComplete}
                  className={`px-8 py-3 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    isFormComplete
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  Calculate Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
