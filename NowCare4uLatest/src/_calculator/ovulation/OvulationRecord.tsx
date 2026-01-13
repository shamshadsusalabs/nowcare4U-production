import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';

type RecordItem = {
  _id: string;
  lastDate: string;
  cycleLength: number;
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
  dueDate: string;
  createdAt: string;
};

function format(d: string) {
  const date = new Date(d);
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const OvulationRecord: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [items, setItems] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ovulation/records?userId=${encodeURIComponent(user?.id || '')}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    if (!confirm('Delete all ovulation records for this user?')) return;
    try {
      const res = await fetch(`/api/ovulation/records?userId=${encodeURIComponent(user?.id || '')}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      await load();
    } catch (e) {
      alert('Failed to delete records');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
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
            <h1 className="text-3xl font-bold">Ovulation Records</h1>
            <p className="text-gray-600">Saved calculations for {user?.phone}</p>
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
                  <th className="border px-3 py-2 text-left">Last Period</th>
                  <th className="border px-3 py-2 text-left">Cycle</th>
                  <th className="border px-3 py-2 text-left">Ovulation</th>
                  <th className="border px-3 py-2 text-left">Fertile Window</th>
                  <th className="border px-3 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-3 py-2">{format(it.createdAt)}</td>
                    <td className="border px-3 py-2">{format(it.lastDate)}</td>
                    <td className="border px-3 py-2">{it.cycleLength}</td>
                    <td className="border px-3 py-2">{format(it.ovulationDate)}</td>
                    <td className="border px-3 py-2">{format(it.fertileStart)} - {format(it.fertileEnd)}</td>
                    <td className="border px-3 py-2">{format(it.dueDate)}</td>
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

export default OvulationRecord;
