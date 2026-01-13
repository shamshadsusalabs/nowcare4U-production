import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RealTestProps {
  age: number;
  userId: string;
  token: string;
}

export default function RealTest({ age, userId, token }: RealTestProps) {
  const navigate = useNavigate();
  const [time, setTime] = useState(90);
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [correction, setCorrection] = useState(0);
  const [correctNumA, setCorrectNumA] = useState(0);
  const [correctNumB, setCorrectNumB] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [colors, setColors] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize test
    const numA = Math.floor(Math.random() * 4);
    const numB = 4 + Math.floor(Math.random() * 5);
    setCorrectNumA(numA);
    setCorrectNumB(numB);

    // Generate numbers grid
    const nums: number[] = [];
    for (let i = 0; i < 128; i++) {
      if (i % 13 === 0) {
        nums.push(numB);
      }
      nums.push(Math.floor(Math.random() * 10));
    }
    setNumbers(nums);
    setColors(Array(128).fill(10));

    // Load user progress
    const loadProgress = async () => {
      try {
        const response = await fetch(`/api/test/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCorrect((data.correctC as number) || 0);
          setWrong((data.wrongC as number) || 0);
          setCorrection((data.correctionC as number) || 0);
          setRound((data.round as number) || 1);
        }
      } catch (err) {
        console.error('Failed to load progress', err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId, token]);

  useEffect(() => {
    if (loading || round > 5) return;

    const timer = time > 0 && setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    if (time === 0) {
      saveProgress();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time, loading, round]);

  const saveProgress = async () => {
    try {
      await fetch(`/api/test/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          correctC: correct,
          wrongC: wrong,
          correctionC: correction,
          round: round + 1,
        }),
      });
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  const resetProgress = async () => {
    try {
      await fetch(`/api/test/progress`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCorrect(0);
      setWrong(0);
      setCorrection(0);
      setRound(1);
      setTime(90);
    } catch (err) {
      console.error('Failed to reset progress', err);
    }
  };

  const handleNumberClick = (index: number) => {
    if (time === 0 || round > 5) return;

    const newColors = [...colors];
    if (newColors[index] === 0) {
      newColors[index] = 10;
      setWrong(prev => prev - 1);
      setCorrection(prev => prev + 1);
    } else if (newColors[index] === 10) {
      if (numbers[index] === correctNumA || numbers[index] === correctNumB) {
        newColors[index] = 1;
        setCorrect(prev => prev + 1);
      } else {
        newColors[index] = 0;
        setWrong(prev => prev + 1);
      }
    }
    setColors(newColors);
  };

  const startNextRound = () => {
    setRound(prev => prev + 1);
    setTime(90);
    // Reinitialize numbers for new round
    const numA = Math.floor(Math.random() * 4);
    const numB = 4 + Math.floor(Math.random() * 5);
    setCorrectNumA(numA);
    setCorrectNumB(numB);

    const nums: number[] = [];
    for (let i = 0; i < 128; i++) {
      if (i % 13 === 0) {
        nums.push(numB);
      }
      nums.push(Math.floor(Math.random() * 10));
    }
    setNumbers(nums);
    setColors(Array(128).fill(10));
  };

  const calculateResult = () => {
    const averageScore = (correct - wrong - (correction / 2)) / 5;
    let result = '';

    if (age < 8) {
      if (averageScore > 20) {
        result = 'Above-average cognitive functioning...';
      } else if (averageScore > 15) {
        result = 'Average cognitive functioning...';
      } else {
        result = 'Below average cognitive functioning...';
      }
    } else {
      if (averageScore > 22) {
        result = 'Above-average cognitive functioning...';
      } else if (averageScore > 17) {
        result = 'Average cognitive functioning...';
      } else {
        result = 'Below average cognitive functioning...';
      }
    }

    return result;
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Cognitive Test</h2>
          <div className="text-lg font-medium">
            {round > 5 ? 'Completed' : `Round ${round}`}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cognitive-records')}
              className="text-gray-700 hover:text-gray-900"
            >
              Records
            </button>
            <button
              onClick={resetProgress}
              className="text-blue-500 hover:text-blue-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">{time}</span>
          </div>
          <div className="flex space-x-4 mb-6">
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              Correct: {correct}
            </div>
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              Correction: {correction}
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              Wrong: {wrong}
            </div>
          </div>
        </div>

        {time === 0 || round > 5 ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">
              {round > 5 ? 'Test Completed' : 'Round Completed'}
            </h3>
            {round > 5 ? (
              <>
                <p className="mb-6">{calculateResult()}</p>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    // Navigate to results page or show modal
                  }}
                >
                  View Detailed Results
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                onClick={startNextRound}
              >
                Next Round
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Correct Numbers</h3>
              <div className="flex justify-center space-x-8">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-medium">{correctNumA}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-medium">{correctNumB}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1 mb-6">
              {numbers.map((num, index) => (
                <div
                  key={index}
                  className={`aspect-square border flex items-center justify-center cursor-pointer ${
                    colors[index] === 10
                      ? 'bg-white'
                      : colors[index] === 0
                      ? 'bg-red-100'
                      : 'bg-green-100'
                  }`}
                  onClick={() => handleNumberClick(index)}
                >
                  {num}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}