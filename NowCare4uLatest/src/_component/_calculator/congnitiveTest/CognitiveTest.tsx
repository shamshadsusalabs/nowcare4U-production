import { useState } from 'react';
import { useUser } from '../../auth/UserContext';
import RealTest from './RealTest';

export default function CognitiveTest() {
  const { user, token } = useUser();
  const [age, setAge] = useState('');
  const [showTest, setShowTest] = useState(false);

  if (!user || !token) {
    return <div className="text-center py-10">Please login to take the test</div>;
  }

  if (showTest) {
    return <RealTest age={parseInt(age)} userId={user.id} token={token} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Cognitive Test Instructions</h2>
          <ul className="space-y-4 list-disc pl-5">
            <li>The cognitive test is of 90 seconds per round.</li>
            <li>Tap on correct numbers present in the grid shown after test begins.</li>
            <li>The two numbers shown at top of the grid are correct numbers to tap.</li>
            <li>Take the test 5 times for accurate results.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
        <h3 className="text-xl font-semibold mb-4">Sample Test Sheet</h3>
        <div className="flex justify-center space-x-8 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg font-medium">5</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg font-medium">8</span>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1 mb-6">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer"
            >
              {Math.floor(Math.random() * 10)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Enter the child's age to continue</label>
          <div className="flex items-center">
            <input
              type="number"
              className="border rounded-lg px-3 py-2 w-20 mr-2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="120"
            />
            <span>years</span>
          </div>
        </div>
        <button
          className={`w-full py-3 rounded-lg font-medium ${age ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={!age}
          onClick={() => setShowTest(true)}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}