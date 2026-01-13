import { useState } from 'react';

// BMI calculation using WHO guidelines
function calcBMI(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (!m || m <= 0) return NaN;
  return +(weightKg / (m * m)).toFixed(1);
}

function bmiCategoryWHO(bmi: number): { category: string; color: string; description: string } {
  if (isNaN(bmi)) return { category: 'Invalid', color: 'text-gray-500', description: 'Please enter valid measurements' };
  if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', description: 'Below normal weight range' };
  if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600', description: 'Healthy weight range' };
  if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', description: 'Above normal weight range' };
  if (bmi < 35) return { category: 'Obesity Class I', color: 'text-orange-600', description: 'Moderate obesity' };
  if (bmi < 40) return { category: 'Obesity Class II', color: 'text-red-600', description: 'Severe obesity' };
  return { category: 'Obesity Class III', color: 'text-red-800', description: 'Very severe obesity' };
}

function getHealthTips(bmi: number): string[] {
  if (isNaN(bmi)) return [];
  if (bmi < 18.5) return [
    'Consider consulting a healthcare provider about healthy weight gain',
    'Focus on nutrient-dense foods and regular meals',
    'Include strength training exercises to build muscle mass'
  ];
  if (bmi < 25) return [
    'Maintain your healthy weight with balanced nutrition',
    'Continue regular physical activity (150 min/week)',
    'Monitor your weight regularly'
  ];
  if (bmi < 30) return [
    'Aim for gradual weight loss (1-2 lbs per week)',
    'Increase physical activity and reduce caloric intake',
    'Focus on whole foods and portion control'
  ];
  return [
    'Consult a healthcare provider for a comprehensive weight management plan',
    'Consider supervised diet and exercise programs',
    'Focus on sustainable lifestyle changes'
  ];
}

export default function BMICalc() {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(7);

  const getMetricValues = () => {
    if (unit === 'metric') {
      return { weightKg: weight, heightCm: height };
    } else {
      const weightKg = weightLbs * 0.453592;
      const heightCm = (heightFt * 12 + heightIn) * 2.54;
      return { weightKg, heightCm };
    }
  };

  const { weightKg, heightCm } = getMetricValues();
  const bmi = calcBMI(weightKg, heightCm);
  const result = bmiCategoryWHO(bmi);
  const tips = getHealthTips(bmi);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">BMI Calculator</h1>
        <div className="text-sm text-gray-500">WHO Guidelines</div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Unit Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setUnit('metric')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                unit === 'metric' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                unit === 'imperial' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Imperial (lbs/ft)
            </button>
          </div>
        </div>

        {/* Inputs */}
        {unit === 'metric' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter weight in kg"
                min="1"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter height in cm"
                min="50"
                max="300"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Weight in lbs"
                min="1"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (ft)</label>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Feet"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (in)</label>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Inches"
                min="0"
                max="11"
              />
            </div>
          </div>
        )}

        {/* Results */}
        {!isNaN(bmi) && bmi > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">{bmi}</div>
              <div className="text-sm text-gray-600">BMI (kg/m²)</div>
            </div>
            
            <div className="text-center mb-4">
              <div className={`text-xl font-semibold ${result.color} mb-1`}>{result.category}</div>
              <div className="text-sm text-gray-600">{result.description}</div>
            </div>

            {/* BMI Scale Visual */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">BMI Scale</div>
              <div className="relative h-6 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-600 rounded-full">
                <div 
                  className="absolute top-0 w-3 h-6 bg-gray-800 rounded-full transform -translate-x-1/2"
                  style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40+</span>
              </div>
            </div>

            {/* Health Tips */}
            {tips.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Health Recommendations</div>
                <ul className="space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* WHO Categories Reference */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">WHO BMI Categories</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
              <span>Underweight: &lt;18.5</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
              <span>Normal: 18.5-24.9</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
              <span>Overweight: 25-29.9</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
              <span>Obesity I: 30-34.9</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
              <span>Obesity II: 35-39.9</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
              <span>Obesity III: ≥40</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          * BMI is a screening tool and may not reflect body fat distribution. Consult healthcare providers for comprehensive assessment.
        </div>
      </div>
    </div>
  );
}
