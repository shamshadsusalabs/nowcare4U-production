import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';

interface WeightEntry { week: number; weight: number }
interface Baseline { preWeightKg: number; heightCm: number; bmi: number; minGainKg: number; maxGainKg: number; e: number }

export default function PregnancyWeightRecords() {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [minVal, setMinVal] = useState<number[]>([]);
  const [maxVal, setMaxVal] = useState<number[]>([]);
  const [myVal, setMyVal] = useState<WeightEntry[]>([]);
  const [week, setWeek] = useState<number>(14);
  const [weight, setWeight] = useState<number>(0);

  useEffect(() => {
    if (!user || !token) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pregnancy-weight/record', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load');
      if (!data) {
        setBaseline(null);
        setMinVal([]);
        setMaxVal([]);
        setMyVal([]);
      } else {
        setBaseline(data.baseline);
        setMinVal(data.minVal || []);
        setMaxVal(data.maxVal || []);
        setMyVal(data.myVal || []);
        setWeight(Number((data.baseline?.preWeightKg || 0).toFixed(1)));
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/pregnancy-weight/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ week, weight }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to add entry');
      setMyVal(data.myVal || []);
      setWeek(week + 1);
    } catch (e: any) {
      alert(e.message || 'Failed to add entry');
    }
  };

  const resetAll = async () => {
    if (!token) return;
    if (!confirm('Delete your pregnancy weight record?')) return;
    try {
      const res = await fetch('/api/pregnancy-weight/record', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to delete');
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to delete');
    }
  };

  const weekLabels = Array.from({ length: 21 }, (_, i) => i * 2); // 0..40 step2

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pregnancy Weight Records</h1>
        <div className="space-x-2">
          <button onClick={() => navigate('/pregnancy-weight')} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Update Baseline</button>
          <button onClick={load} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Refresh</button>
          <button onClick={resetAll} className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600">Reset</button>
        </div>
      </div>

      {loading && <div className="py-10 text-center">Loading...</div>}
      {error && <div className="py-4 text-red-600">{error}</div>}

      {!loading && !baseline && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
          No baseline found. Please set your baseline to generate expected weight ranges.
          <div>
            <button onClick={() => navigate('/pregnancy-weight')} className="mt-3 px-3 py-2 rounded bg-blue-600 text-white">Set Baseline</button>
          </div>
        </div>
      )}

      {!loading && baseline && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-medium mb-2">Baseline</div>
            <div className="text-sm text-gray-600">Pre-weight: {baseline.preWeightKg} kg • Height: {baseline.heightCm} cm • BMI: {baseline.bmi}</div>
            <div className="text-sm text-gray-600">Expected gain: {baseline.minGainKg} - {baseline.maxGainKg} kg</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-medium mb-2">Expected Weight Range (every 2 weeks)</div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Week</th>
                    {weekLabels.map((w) => (
                      <th key={w} className="py-2 px-2">{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 text-gray-600">Min</td>
                    {minVal.map((v, idx) => (
                      <td key={idx} className="py-1 px-2 text-gray-800">{v?.toFixed(1)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-gray-600">Max</td>
                    {maxVal.map((v, idx) => (
                      <td key={idx} className="py-1 px-2 text-gray-800">{v?.toFixed(1)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-medium mb-2">Your Entries</div>
            {myVal.length === 0 && <div className="text-sm text-gray-500">No entries yet</div>}
            {myVal.length > 0 && (
              <div className="space-y-2">
                {myVal.map((e, i) => (
                  <div key={i} className="flex items-center justify-between border rounded px-3 py-2">
                    <div className="text-gray-700">Week {e.week}</div>
                    <div className="font-medium">{e.weight.toFixed(1)} kg</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-end gap-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Week</div>
                <input type="number" value={week} onChange={e => setWeek(parseInt(e.target.value || '0', 10))} className="border rounded px-3 py-2 w-28" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Weight (kg)</div>
                <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value || '0'))} className="border rounded px-3 py-2 w-40" />
              </div>
              <button onClick={addEntry} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
