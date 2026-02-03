import { useState, useEffect } from 'react';
import { useUser } from '../../auth/UserContext';
import { useNavigate } from 'react-router-dom';

export default function PregnancyWeightCalc() {
  const { token } = useUser();
  const navigate = useNavigate();

  const [preWeightKg, setPreWeightKg] = useState<number>(60);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [loading, setLoading] = useState<boolean>(false);
  const [existing, setExisting] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/pregnancy-weight/record', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data) setExisting(true);
        }
      } catch {}
    };
    load();
  }, [token]);

  const initialize = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pregnancy-weight/baseline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preWeightKg, heightCm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to initialize');
      navigate('/pregnancy-weight-records');
    } catch (e: any) {
      alert(e.message || 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pregnancy Weight Gain</h1>
        <button onClick={() => navigate('/pregnancy-weight-records')} className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200">Records</button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <div className="text-sm text-gray-600 mb-2">Pre-pregnancy weight (kg)</div>
          <input type="number" value={preWeightKg} onChange={e => setPreWeightKg(parseFloat(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-2">Height (cm)</div>
          <input type="number" value={heightCm} onChange={e => setHeightCm(parseFloat(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="text-sm text-gray-500">
          We'll compute your BMI and expected weight gain range based on clinical guidelines.
        </div>
        <div className="flex gap-3">
          <button onClick={initialize} disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            {existing ? (loading ? 'Updating...' : 'Update Baseline & Continue') : (loading ? 'Saving...' : 'Save Baseline & Continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
