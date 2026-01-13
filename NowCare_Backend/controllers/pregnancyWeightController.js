const PregnancyWeightRecord = require('../models/PregnancyWeightRecord');

// Helper to compute BMI and min/max gain based on BMI
function computeRanges(preWeightKg, heightCm) {
  const hMeters = heightCm / 100;
  const bmi = preWeightKg / (hMeters * hMeters);
  let minGainKg, maxGainKg;
  if (bmi <= 18.5) {
    minGainKg = 12.5;
    maxGainKg = 18;
  } else if (bmi > 18.5 && bmi <= 25) {
    minGainKg = 11.5;
    maxGainKg = 16;
  } else if (bmi > 25 && bmi <= 30) {
    minGainKg = 7;
    maxGainKg = 11.5;
  } else {
    minGainKg = 5;
    maxGainKg = 9;
  }
  return { bmi, minGainKg, maxGainKg };
}

// Generate min/max arrays for weeks 0..40 step 2 using Flutter logic
function generateCurves(preWeightKg, minGainKg, maxGainKg, e = 0.15) {
  const minVal = [];
  const maxVal = [];
  for (let i = 0; i <= 40; i += 2) {
    if (i <= 13) {
      const o = i / 13;
      minVal.push(Number((preWeightKg + (minGainKg * e) * o).toFixed(4)));
      maxVal.push(Number((preWeightKg + (maxGainKg * e) * o).toFixed(4)));
    } else if (i > 13) {
      const o = (i - 13) / 27;
      const minTerm = (minGainKg / e) - minGainKg;
      const maxTerm = (maxGainKg / e) - maxGainKg;
      minVal.push(Number((preWeightKg + (minTerm * o) + minGainKg).toFixed(4)));
      maxVal.push(Number((preWeightKg + (maxTerm * o) + maxGainKg).toFixed(4)));
    }
  }
  // Ensure week 0 exists
  if (minVal.length === 0 || maxVal.length === 0) {
    minVal.unshift(Number(preWeightKg.toFixed(4)));
    maxVal.unshift(Number(preWeightKg.toFixed(4)));
  }
  return { minVal, maxVal };
}

exports.getRecord = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rec = await PregnancyWeightRecord.findOne({ userId });
    if (!rec) return res.json(null);
    res.json(rec);
  } catch (err) {
    next(err);
  }
};

exports.initializeBaseline = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { preWeightKg, heightCm } = req.body;
    if (typeof preWeightKg !== 'number' || typeof heightCm !== 'number') {
      return res.status(400).json({ message: 'preWeightKg and heightCm must be numbers' });
    }
    const { bmi, minGainKg, maxGainKg } = computeRanges(preWeightKg, heightCm);
    const e = 0.15;
    const curves = generateCurves(preWeightKg, minGainKg, maxGainKg, e);

    const doc = await PregnancyWeightRecord.findOneAndUpdate(
      { userId },
      {
        userId,
        baseline: {
          preWeightKg,
          heightCm,
          bmi: Number(bmi.toFixed(2)),
          minGainKg,
          maxGainKg,
          e,
        },
        minVal: curves.minVal,
        maxVal: curves.maxVal,
        myVal: [{ week: 0, weight: Number(preWeightKg.toFixed(2)) }],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.addEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { week, weight } = req.body;
    if (typeof week !== 'number' || typeof weight !== 'number') {
      return res.status(400).json({ message: 'week and weight must be numbers' });
    }
    const rec = await PregnancyWeightRecord.findOne({ userId });
    if (!rec) return res.status(404).json({ message: 'Record not found. Initialize baseline first.' });

    rec.myVal.push({ week, weight });
    await rec.save();
    res.json(rec);
  } catch (err) {
    next(err);
  }
};

exports.resetAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await PregnancyWeightRecord.deleteOne({ userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
