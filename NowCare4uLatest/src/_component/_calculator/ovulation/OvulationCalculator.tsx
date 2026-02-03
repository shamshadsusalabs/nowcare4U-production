import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';

function addDays(date: Date, days: number) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function format(d?: Date) {
  if (!d) return '';
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const isLeap = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

function daysInMonth(year: number, monthIndex0: number) {
  if (monthIndex0 === 1) return isLeap(year) ? 29 : 28;
  return [3, 5, 8, 10].includes(monthIndex0) ? 30 : 31;
}

const Calendar: React.FC<{ start?: Date; end?: Date }> = ({ start, end }) => {
  const base = start ?? new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const count = daysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();

  const isInRange = (day: number) => {
    if (!start || !end) return false;
    const d = new Date(year, month, day);
    return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
      d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
  };

  const cells = [] as React.JSX.Element[];
  const totalCells = Math.ceil((firstWeekday + count) / 7) * 7;
  for (let i = 0; i < totalCells; i++) {
    const day = i - firstWeekday + 1;
    const inMonth = day >= 1 && day <= count;
    cells.push(
      <div key={i} className={`border text-center py-2 ${inMonth ? '' : 'bg-gray-100'} ${inMonth && isInRange(day) ? 'bg-green-200 font-semibold' : ''}`}>
        {inMonth ? day : ''}
      </div>
    );
  }

  const monthName = base.toLocaleString('default', { month: 'long' });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-blue-600 text-white rounded-t px-4 py-2 text-center font-medium">{monthName} {year}</div>
      <div className="grid grid-cols-7">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="border py-1 text-center text-sm font-medium bg-gray-50">{d}</div>
        ))}
        {cells}
      </div>
    </div>
  );
};

const OvulationCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [lastDate, setLastDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<string>('');
  const [result, setResult] = useState<{ fertileStart: Date; fertileEnd: Date; ovulationDate: Date; dueDate: Date } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const computed = useMemo(() => {
    const c = parseInt(cycleLength, 10);
    const d = lastDate ? new Date(lastDate) : null;
    if (!d || Number.isNaN(c) || c < 21 || c > 35) return null;
    const ovulation = addDays(d, c - 14);
    return {
      fertileStart: addDays(ovulation, -2),
      fertileEnd: addDays(ovulation, 2),
      ovulationDate: ovulation,
      dueDate: addDays(d, c),
    };
  }, [lastDate, cycleLength]);

  const submit = async () => {
    if (!computed) return;
    try {
      setSaving(true);
      const res = await fetch('/api/ovulation/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: user?.id,
          lastDate,
          cycleLength: parseInt(cycleLength, 10),
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setResult({
        fertileStart: new Date(data.fertileStart),
        fertileEnd: new Date(data.fertileEnd),
        ovulationDate: new Date(data.ovulationDate),
        dueDate: new Date(data.dueDate),
      });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-2">Ovulation Calculator</h1>
        <p className="text-gray-600 mb-6">Enter your last period date and cycle length to find your fertile window. Your results will be saved to your account.</p>

        <div className="grid gap-4 max-w-xl">
          <label className="grid gap-2">
            <span className="text-sm">Last period date</span>
            <input type="date" className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">Average cycle length (days, 21-35)</span>
            <input type="number" min={21} max={35} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
          </label>

          <button
            className={`px-4 py-2 rounded-lg text-white shadow ${computed ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95' : 'bg-gray-400'} disabled:opacity-60`}
            onClick={submit}
            disabled={!computed || saving}
          >
            {saving ? 'Saving...' : (result ? 'Recalculate & Save' : 'Calculate & Save')}
          </button>
        </div>

        {computed && (
          <div className="mt-8 space-y-4">
            <div className="text-blue-700 font-medium">
              Your best days to conceive are from {format(computed.fertileStart)} to {format(computed.fertileEnd)}
            </div>
            <div className="text-sm">
              Estimated ovulation: <b>{format(computed.ovulationDate)}</b> — Due date: <b>{format(computed.dueDate)}</b>
            </div>
            <Calendar start={computed.fertileStart} end={computed.fertileEnd} />
          </div>
        )}

        {result && (
          <div className="mt-6 text-green-700">Saved to records. See <a className="underline" href="/ovulation-records">your ovulation records</a>.</div>
        )}
      </div>
    </div>
  );
};

export default OvulationCalculator;
