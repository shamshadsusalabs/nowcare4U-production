import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../../auth/UserContext';

interface Progress {
  correctC: number;
  wrongC: number;
  correctionC: number;
  round: number;
  updatedAt?: string;
  createdAt?: string;
}

export default function CognitiveRecords() {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`);
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/test/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load progress');
      setProgress(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = async () => {
    if (!token) return;
    if (!confirm('Clear cognitive test progress?')) return;
    try {
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/test/progress', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to reset');
      setProgress(data);
      alert('Progress reset');
    } catch (e: any) {
      alert(e.message || 'Failed to reset');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cognitive Records</h1>
        <div className="space-x-2">
          <button onClick={loadData} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Refresh</button>
          <button onClick={resetAll} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Clear</button>
        </div>
      </div>

      {loading && <div className="py-10 text-center">Loading...</div>}
      {error && <div className="py-4 text-red-600">{error}</div>}

      {!loading && progress && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500">Correct</div>
              <div className="text-xl font-semibold">{progress.correctC}</div>
            </div>
            <div>
              <div className="text-gray-500">Wrong</div>
              <div className="text-xl font-semibold">{progress.wrongC}</div>
            </div>
            <div>
              <div className="text-gray-500">Correction</div>
              <div className="text-xl font-semibold">{progress.correctionC}</div>
            </div>
            <div>
              <div className="text-gray-500">Round</div>
              <div className="text-xl font-semibold">{progress.round}</div>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <div>Updated: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleString() : '-'}</div>
            <div>Created: {progress.createdAt ? new Date(progress.createdAt).toLocaleString() : '-'}</div>
          </div>
        </div>
      )}

      {!loading && !progress && (
        <div className="py-10 text-center text-gray-500">No progress found</div>
      )}
    </div>
  );
}
