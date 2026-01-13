import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';

export type KickEntry = {
  display: string;
  time: number;
  createdAt?: string;
  _id?: string;
};

type KickDataResponse = {
  name: string;
  count: KickEntry[];
  createdAt?: string;
  updatedAt?: string;
};

function format(d?: string | number) {
  if (!d) return '';
  const date = new Date(d);
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const KickRecords: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [items, setItems] = useState<KickEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/kick-counter/data`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data: KickDataResponse = await res.json();
      const list = Array.isArray(data.count) ? data.count : [];
      // Sort newest first by createdAt or fallback to time
      const sorted = [...list].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : (a.time || 0);
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : (b.time || 0);
        return tb - ta;
      });
      setItems(sorted);
    } catch (e) {
      console.error(e);
      alert('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    if (!confirm('Delete all kick records for this user?')) return;
    try {
      const res = await fetch(`/api/kick-counter/data`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete records');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent('/kick-records'));
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Kick Records</h1>
            <p className="text-gray-600">Saved kicks for {user?.phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white shadow" onClick={load} disabled={loading}>Refresh</button>
            <button className="px-3 py-2 rounded-lg bg-red-600 text-white shadow" onClick={clear}>Clear All</button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 text-left">Created</th>
                  <th className="border px-3 py-2 text-left">Kick Time</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it._id || idx} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-3 py-2">{format(it.createdAt || it.time)}</td>
                    <td className="border px-3 py-2">{it.display}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KickRecords;
