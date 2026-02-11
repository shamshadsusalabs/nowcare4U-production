import { useState } from 'react';
import { useUser } from '../../../auth/UserContext';
import { useNavigate } from 'react-router-dom';

interface Inputs {
  gender: number; // 0 male, 1 female
  ageGroup: number; // 0 <35, 1 35-49, 2 >=50
  race: number; // 0 Asian,1 African,2 Caucasian,3 Hispanic,4 Other
  familyHistory: number; // 0 none,1 one parent,2 both
  waist: number; // 0 <90cm, 1 90-100, 2 >100
  activity: number; // 0 sedentary,1 lightly,2 moderate,3 high
  bp: number; // 0 yes, 1 no (not used in formula yet)
}

export default function DiabetesCalc() {
  const { token } = useUser();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState<Inputs>({
    gender: 0,
    ageGroup: 0,
    race: 0,
    familyHistory: 0,
    waist: 0,
    activity: 0,
    bp: 1,
  });
  const [dm, setDm] = useState<number | null>(null);
  const [pdm, setPdm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (k: keyof Inputs, v: number) => setInputs(prev => ({ ...prev, [k]: v }));

  const calculate = () => {
    const { ageGroup: age, waist, familyHistory: family, race, activity: work } = inputs;
    let dmV = 0;
    let pdmV = 0;
    if (age === 0) {
      if (waist === 2) {
        dmV = 26.4;
        pdmV = 9.7;
      } else {
        pdmV = 11.9;
        dmV = 0.2;
      }
    } else {
      if (waist === 2) {
        dmV = 15.6;
        pdmV = 47.8;
      } else {
        if (age === 2) {
          if (family === 1 || family === 2) {
            if (race === 2) {
              dmV = 9.6;
              pdmV = 54.2;
            } else {
              dmV = 9.1;
              pdmV = 36.9;
            }
          } else {
            dmV = 0.6;
            pdmV = 28;
          }
        } else {
          if (waist === 2) {
            if (family === 1 || family === 2) {
              dmV = 11.8;
              pdmV = 39.3;
            } else {
              if (work === 2 || work === 3) {
                dmV = 0.2;
                pdmV = 42.9;
              } else {
                dmV = 8.2;
                pdmV = 45.3;
              }
            }
          } else {
            dmV = 0.3;
            pdmV = 52.7;
          }
        }
      }
    }
    setDm(dmV);
    setPdm(pdmV);
    return { dmV, pdmV };
  };

  const save = async () => {
    if (!token) return;
    const { dmV, pdmV } = calculate();
    setSaving(true);
    try {
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/diabetes/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputs, results: { dm: dmV, pdm: pdmV } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save');
      navigate('/diabetes-records');
    } catch (e: any) {
      alert(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Diabetes Risk Calculator</h1>
        <button onClick={() => navigate('/diabetes-records')} className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200">Records</button>
      </div>

      <div className="space-y-6 bg-white rounded-xl shadow p-6">
        <SelectRow label="Gender" value={inputs.gender} onChange={v => setField('gender', v)} options={[
          { v: 0, t: 'Male' },
          { v: 1, t: 'Female' },
        ]} />
        <SelectRow label="Age" value={inputs.ageGroup} onChange={v => setField('ageGroup', v)} options={[
          { v: 0, t: '< 35 years' },
          { v: 1, t: '35 - 49 years' },
          { v: 2, t: '≥ 50 years' },
        ]} />
        <SelectRow label="Ethnicity" value={inputs.race} onChange={v => setField('race', v)} options={[
          { v: 0, t: 'Asian' },
          { v: 1, t: 'African' },
          { v: 2, t: 'Caucasian' },
          { v: 3, t: 'Hispanic' },
          { v: 4, t: 'Other' },
        ]} />
        <SelectRow label="Family History" value={inputs.familyHistory} onChange={v => setField('familyHistory', v)} options={[
          { v: 0, t: 'No family history' },
          { v: 1, t: 'One parent has diabetes' },
          { v: 2, t: 'Both parents have diabetes' },
        ]} />
        <SelectRow label="Waist Size" value={inputs.waist} onChange={v => setField('waist', v)} options={[
          { v: 0, t: '< 90 cm / 35 in' },
          { v: 1, t: '90 - 100 cm / 35 - 39 in' },
          { v: 2, t: '> 100 cm / 39 in' },
        ]} />
        <SelectRow label="Daily Routine" value={inputs.activity} onChange={v => setField('activity', v)} options={[
          { v: 0, t: 'Sedentary' },
          { v: 1, t: 'Lightly Active' },
          { v: 2, t: 'Moderately Active' },
          { v: 3, t: 'Highly Active' },
        ]} />
        <SelectRow label="Hypertension" value={inputs.bp} onChange={v => setField('bp', v)} options={[
          { v: 0, t: 'Yes' },
          { v: 1, t: 'No' },
        ]} />
        <div className="flex gap-3">
          <button onClick={calculate} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Calculate</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save & View Records'}</button>
        </div>

        {(dm !== null && pdm !== null) && (
          <div className="mt-4 p-4 rounded border bg-gray-50">
            <div className="font-medium">Results</div>
            <div className="mt-1 text-gray-700">Diabetes risk: {dm}%</div>
            <div className="text-gray-700">Pre-diabetes risk: {pdm}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }: { label: string; value: number; onChange: (v: number) => void; options: { v: number; t: string }[] }) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)} className={`px-3 py-2 rounded border ${value === o.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 hover:bg-gray-50'}`}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}
