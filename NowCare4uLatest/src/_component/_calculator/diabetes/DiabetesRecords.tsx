import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../auth/UserContext';

interface RecordItem {
  _id: string;
  inputs: {
    gender: number;
    ageGroup: number;
    race: number;
    familyHistory: number;
    waist: number;
    activity: number;
    bp: number;
  };
  results: {
    dm: number;
    pdm: number;
  };
  createdAt: string;
}

export default function DiabetesRecords() {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/diabetes/records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load');
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`https://nowcare4-u-production-acbz.vercel.app/api/diabetes/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete');
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete');
    }
  };

  const clearAll = async () => {
    if (!token) return;
    if (!confirm('Delete all diabetes records?')) return;
    try {
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/diabetes/records', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to clear');
      setItems([]);
    } catch (e: any) {
      alert(e.message || 'Failed to clear');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Diabetes Records</h1>
        <div className="space-x-2">
          <button onClick={() => navigate('/diabetes')} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">New</button>
          <button onClick={load} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Refresh</button>
          <button onClick={clearAll} className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600">Clear All</button>
        </div>
      </div>

      {loading && <div className="py-10 text-center">Loading...</div>}
      {error && <div className="py-4 text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="py-10 text-center text-gray-500">No records yet</div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">DM: {it.results.dm}% • PDM: {it.results.pdm}%</div>
                <div className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Waist: {['<90', '90-100', '>100'][it.inputs.waist]} • Activity: {['Sedentary', 'Light', 'Moderate', 'High'][it.inputs.activity]}</div>
              </div>
              <button onClick={() => remove(it._id)} className="px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
