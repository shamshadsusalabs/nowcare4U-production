"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

export default function ChildGrowthTest() {
  const [gender, setGender] = useState(10)
  const [dob, setDob] = useState<Date | null>(null)
  const [entryDate, setEntryDate] = useState<Date>(new Date())
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [showChart, setShowChart] = useState(false)
  const [chartType, setChartType] = useState("weight") // "weight" or "height"
  const [weightEntries, setWeightEntries] = useState<Array<{ date: Date; value: number; age: number }>>([])
  const [heightEntries, setHeightEntries] = useState<Array<{ date: Date; value: number; age: number }>>([])
  const [notification, setNotification] = useState(true)
  const [showVaccination, setShowVaccination] = useState(false)
  const [vaccinationChecks, setVaccinationChecks] = useState<boolean[]>(new Array(50).fill(false))

  const calculateAgeInMonths = (birthDate: Date, currentDate: Date) => {
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime())
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
    return diffMonths
  }

  const addEntry = () => {
    if (!dob || !weight || !height) return

    const ageInMonths = calculateAgeInMonths(dob, entryDate)

    const newWeightEntry = {
      date: entryDate,
      value: Number.parseFloat(weight),
      age: ageInMonths,
    }

    const newHeightEntry = {
      date: entryDate,
      value: Number.parseFloat(height),
      age: ageInMonths,
    }

    setWeightEntries([...weightEntries, newWeightEntry])
    setHeightEntries([...heightEntries, newHeightEntry])
    setWeight("")
    setHeight("")
    setShowChart(true)
  }

  const getGrowthStatus = (value: number, age: number, type: "weight" | "height", childGender: number) => {
    // Properly typed growth chart data (WHO standards)
    const weightStandards: Record<string, Record<number, { min: number; max: number }>> = {
      boy: {
        0: { min: 2.5, max: 4.3 },
        3: { min: 5.1, max: 7.9 },
        6: { min: 6.4, max: 9.7 },
        12: { min: 7.8, max: 11.8 },
      },
      girl: {
        0: { min: 2.4, max: 4.2 },
        3: { min: 4.6, max: 7.4 },
        6: { min: 5.8, max: 9.2 },
        12: { min: 7.1, max: 11.3 },
      },
    }

    const heightStandards: Record<string, Record<number, { min: number; max: number }>> = {
      boy: {
        0: { min: 46.3, max: 53.4 },
        3: { min: 57.6, max: 65.3 },
        6: { min: 63.6, max: 71.6 },
        12: { min: 71.3, max: 80.2 },
      },
      girl: {
        0: { min: 45.6, max: 52.7 },
        3: { min: 55.8, max: 63.8 },
        6: { min: 61.5, max: 70.0 },
        12: { min: 69.2, max: 78.9 },
      },
    }

    const standards = type === "weight" ? weightStandards : heightStandards
    const genderKey = childGender === 0 ? "boy" : "girl"

    // Find closest age bracket
    const ages = Object.keys(standards[genderKey])
      .map(Number)
      .sort((a, b) => a - b)
    const closestAge = ages.reduce((prev, curr) => (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev))

    const range = standards[genderKey][closestAge]

    if (value < range.min) return "below"
    if (value > range.max) return "above"
    return "normal"
  }

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  const toggleVaccination = (index: number) => {
    const newChecks = [...vaccinationChecks]
    newChecks[index] = !newChecks[index]
    setVaccinationChecks(newChecks)
  }

  return (
    <>
      <Helmet>
        <title>Child Growth Tracker | Pediatric Development Monitor | Growth Chart Calculator | Nowcare4U</title>
        <meta
          name="description"
          content="Professional child growth tracking tool with WHO standards. Monitor your baby's weight and height development with interactive growth charts and expert pediatric guidance."
        />
        <meta
          name="keywords"
          content="child growth tracker, baby growth chart, pediatric development, WHO growth standards, infant weight tracking, height monitoring, child development milestones, growth calculator, baby health tracker"
        />
        <meta name="author" content="Nowcare4U Pediatric Growth Division" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Child Growth Tracker | Professional Pediatric Development Monitor | Nowcare4U"
        />
        <meta
          property="og:description"
          content="Advanced child growth tracking with WHO standards and interactive charts. Monitor your baby's development with expert pediatric guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nowcare4u.com/child-growth-tracker" />
        <meta property="og:image" content="https://nowcare4u.com/child-growth-tracker-preview.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Child Growth Tracker - Pediatric Development Monitor" />
        <meta
          name="twitter:description"
          content="Professional child growth tracking with WHO standards and interactive development charts."
        />
        <meta name="twitter:image" content="https://nowcare4u.com/child-growth-tracker-twitter.jpg" />

        {/* Structured Data for Child Growth Tracker */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Child Growth Tracker - Pediatric Development Monitor",
            description: "Professional child growth tracking tool with WHO growth standards and development charts",
            url: "https://nowcare4u.com/child-growth-tracker",
            medicalAudience: "Patient",
            about: {
              "@type": "MedicalCondition",
              name: "Child Growth and Development",
              alternateName: ["Pediatric Growth", "Infant Development", "Child Health Monitoring"],
              associatedAnatomy: {
                "@type": "AnatomicalStructure",
                name: "Pediatric Development System",
              },
            },
            mainEntity: {
              "@type": "MedicalRiskCalculator",
              name: "WHO Growth Standards Calculator",
              description: "Interactive tool to track and monitor child growth according to WHO standards",
              medicalSpecialty: "Pediatrics",
            },
            provider: {
              "@type": "MedicalOrganization",
              name: "Nowcare4U Pediatric Growth Division",
              description: "Advanced pediatric growth monitoring and child development tracking tools",
              url: "https://nowcare4u.com/pediatric-growth",
              medicalSpecialty: ["Pediatrics", "Child Development", "Growth Monitoring"],
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Growth Tracking",
                  description: "Comprehensive monitoring of child weight and height development",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "WHO Standards Assessment",
                  description: "Professional evaluation using World Health Organization growth standards",
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
                <h1 className="text-lg font-bold">📈 Child Growth Tracker</h1>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Monitor your child's growth with WHO standards and interactive development charts
              </p>
            </div>

            {/* Initial Setup Card */}
            {!showChart && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4">
                  <h2 className="text-lg font-bold text-white text-center">👶 Child Information</h2>
                </div>

                <div className="p-4 space-y-6">
                  {/* Gender Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800">Choose your baby's gender</h3>
                    <div className="flex justify-center gap-6">
                      <button
                        onClick={() => setGender(0)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${gender === 0
                            ? "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg"
                            : "border-gray-300 bg-white hover:border-blue-300"
                          }`}
                      >
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">👦</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Boy</span>
                      </button>
                      <button
                        onClick={() => setGender(1)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${gender === 1
                            ? "border-pink-500 bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg"
                            : "border-gray-300 bg-white hover:border-pink-300"
                          }`}
                      >
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">👧</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Girl</span>
                      </button>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800">Select Date of Birth</h3>
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        if (e.target.value) {
                          setDob(new Date(e.target.value))
                        }
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl border border-purple-300 focus:border-purple-500 focus:outline-none text-center"
                      placeholder="Select birth date"
                    />
                  </div>

                  {/* Entry Date */}
                  {dob && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-800">Date of Entry</h3>
                      <input
                        type="date"
                        min={dob ? dob.toISOString().split("T")[0] : undefined}
                        max={new Date().toISOString().split("T")[0]}
                        value={entryDate.toISOString().split("T")[0]}
                        onChange={(e) => {
                          if (e.target.value) {
                            setEntryDate(new Date(e.target.value))
                          }
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl border border-indigo-300 focus:border-indigo-500 focus:outline-none text-center"
                      />
                    </div>
                  )}

                  {/* Weight and Height Input */}
                  {dob && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Notification Checkbox */}
                  {weight && height && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="notification"
                        checked={notification}
                        onChange={(e) => setNotification(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <label htmlFor="notification" className="text-sm text-gray-700">
                        Receive timely reminders twice a month to update the record
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  {weight && height && dob && (
                    <button
                      onClick={addEntry}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Show Growth Chart
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Growth Chart Display */}
            {showChart && (
              <div className="space-y-6">
                {/* Chart Container */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {chartType === "weight" ? "Monthly Weight Gain" : "Monthly Height Gain"}
                    </h2>
                    <p className="text-slate-300 text-sm">Baby Growth Chart</p>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6 mb-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-white">Lower Limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-white">Upper Limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-white">Your Entry</span>
                    </div>
                  </div>

                  {/* Simplified Chart Visualization */}
                  <div className="bg-slate-700 rounded-xl p-4 h-64 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                        <line
                          key={month}
                          x1={30 + month * 30}
                          y1={20}
                          x2={30 + month * 30}
                          y2={180}
                          stroke="#475569"
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                      ))}

                      {/* Data points */}
                      {(chartType === "weight" ? weightEntries : heightEntries).map((entry, index) => {
                        const x = 30 + entry.age * 2.5
                        const y = chartType === "weight" ? 180 - entry.value * 15 : 180 - (entry.value - 40) * 2

                        return <circle key={index} cx={x} cy={y} r="4" fill="#3b82f6" className="animate-pulse" />
                      })}

                      {/* Labels */}
                      <text x="200" y="15" textAnchor="middle" fill="white" fontSize="12">
                        {chartType === "weight" ? "Weight (kg)" : "Height (cm)"}
                      </text>
                      <text x="200" y="195" textAnchor="middle" fill="white" fontSize="10">
                        Age (months)
                      </text>
                    </svg>
                  </div>

                  {/* Chart Toggle Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => setChartType("weight")}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${chartType === "weight"
                          ? "bg-white text-slate-800 shadow-lg"
                          : "border border-slate-500 text-white hover:border-white"
                        }`}
                    >
                      Show Weight
                    </button>
                    <button
                      onClick={() => setChartType("height")}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${chartType === "height"
                          ? "bg-white text-slate-800 shadow-lg"
                          : "border border-slate-500 text-white hover:border-white"
                        }`}
                    >
                      Show Height
                    </button>
                  </div>
                </div>

                {/* Growth Entries Summary */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                    <h3 className="text-lg font-bold text-white text-center">📋 Growth Records</h3>
                  </div>
                  <div className="p-4">
                    {weightEntries.length > 0 ? (
                      <div className="space-y-3">
                        {weightEntries.map((entry, index) => {
                          const weightStatus = getGrowthStatus(entry.value, entry.age, "weight", gender)
                          const heightEntry = heightEntries[index]
                          const heightStatus = heightEntry
                            ? getGrowthStatus(heightEntry.value, heightEntry.age, "height", gender)
                            : "normal"

                          return (
                            <div key={index} className="bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">
                                  {formatDate(entry.date)} ({entry.age} months)
                                </span>
                                <div className="flex gap-2">
                                  <span
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${weightStatus === "normal"
                                        ? "bg-green-100 text-green-700"
                                        : weightStatus === "below"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                  >
                                    Weight: {weightStatus}
                                  </span>
                                  {heightEntry && (
                                    <span
                                      className={`px-2 py-1 rounded-lg text-xs font-medium ${heightStatus === "normal"
                                          ? "bg-green-100 text-green-700"
                                          : heightStatus === "below"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                      Height: {heightStatus}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Weight: </span>
                                  <span className="font-semibold">{entry.value} kg</span>
                                </div>
                                {heightEntry && (
                                  <div>
                                    <span className="text-gray-600">Height: </span>
                                    <span className="font-semibold">{heightEntry.value} cm</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-4">📝</div>
                        <p>No growth records yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Another Entry */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <h3 className="text-lg font-bold text-white text-center">➕ Add Another Entry</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Entry Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-800">Date of Entry</label>
                      <button
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "date"
                          input.min = dob?.toISOString().split("T")[0] || ""
                          input.max = new Date().toISOString().split("T")[0]
                          input.value = entryDate.toISOString().split("T")[0]
                          input.onchange = (e) => {
                            const target = e.target as HTMLInputElement
                            if (target.value) {
                              setEntryDate(new Date(target.value))
                            }
                          }
                          input.click()
                        }}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 hover:border-blue-500 transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">{formatDate(entryDate)}</div>
                          <div className="text-xs text-gray-500">Tap to change</div>
                        </div>
                      </button>
                    </div>

                    {/* Weight and Height Input */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="0.0"
                          className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                        />
                      </div>
                    </div>

                    {/* Add Record Button */}
                    {weight && height && (
                      <button
                        onClick={addEntry}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Add Record
                      </button>
                    )}
                  </div>
                </div>
                {/* Vaccination Tracker */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                    <h3 className="text-lg font-bold text-white text-center flex items-center justify-center gap-2">
                      <span>💉</span>
                      Vaccination Schedule
                    </h3>
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => setShowVaccination(!showVaccination)}
                      className="w-full py-3 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {showVaccination ? "Hide Vaccination Schedule" : "Show Vaccination Schedule"}
                    </button>

                    {showVaccination && (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {/* Birth Vaccines */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-bold text-green-700 mb-3">Birth</h4>
                          <div className="space-y-2">
                            {["BCG", "Hepatitis B₂", "OPV"].map((vaccine, index) => (
                              <label key={index} className="flex items-center justify-between">
                                <span className="text-sm">{vaccine}</span>
                                <input
                                  type="checkbox"
                                  checked={vaccinationChecks[index]}
                                  onChange={() => toggleVaccination(index)}
                                  className="w-5 h-5 text-green-600 rounded"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 6 Weeks Vaccines */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-bold text-blue-700 mb-3">After 6 Weeks</h4>
                          <div className="space-y-2">
                            {["Hepatitis B₂", "HIB₁", "DPT₁/DTaP₁", "IPV", "Rotavirus", "Pneumococcal₁"].map(
                              (vaccine, index) => (
                                <label key={index} className="flex items-center justify-between">
                                  <span className="text-sm">{vaccine}</span>
                                  <input
                                    type="checkbox"
                                    checked={vaccinationChecks[index + 3]}
                                    onChange={() => toggleVaccination(index + 3)}
                                    className="w-5 h-5 text-blue-600 rounded"
                                  />
                                </label>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Add more vaccination periods as needed */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
