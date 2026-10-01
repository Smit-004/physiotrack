// Ye file sirf calculation karti hai (database ya express yahan nahi hai),
// isliye isse akele test karna aasan hai.

const DAY = 86400000;

// Date ko "YYYY-MM-DD" text me badalta hai
export const toKey = (d) => new Date(d).toISOString().slice(0, 10);

// "2026-10-02" me n din jodta/ghatata hai
export const addDays = (key, n) => toKey(new Date(key + "T00:00:00Z").getTime() + n * DAY);

const avg = (nums) => nums.reduce((s, x) => s + x, 0) / nums.length;
const round1 = (x) => Math.round(x * 10) / 10;

// Ek din me kai logs ho sakte hain, to har din ka average pain nikalte hain
function dailyAverages(logs) {
  const byDay = new Map();
  for (const l of logs) {
    const key = toKey(l.date);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(l.pain);
  }
  return [...byDay.entries()]
    .map(([date, pains]) => ({ date, avgPain: round1(avg(pains)), count: pains.length }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function computeStats(logs, today) {
  const daily = dailyAverages(logs);
  const loggedDays = new Set(daily.map((d) => d.date));

  // 1) STREAK: aaj se peeche lagatar kitne din log hua.
  // Aaj abhi log nahi kiya to streak toot-ti nahi, kal se ginte hain.
  let cursor = loggedDays.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (loggedDays.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  // 2) Pichle 7 din aur uske pehle ke 7 din
  const last7Start = addDays(today, -6);
  const prev7Start = addDays(today, -13);
  const prev7End = addDays(today, -7);
  const inRange = (from, to) => daily.filter((d) => d.date >= from && d.date <= to);

  const last7 = inRange(last7Start, today);
  const prev7 = inRange(prev7Start, prev7End);
  const lastAvg = last7.length ? avg(last7.map((d) => d.avgPain)) : null;
  const prevAvg = prev7.length ? avg(prev7.map((d) => d.avgPain)) : null;

  // 3) RECOVERY SCORE (0 se 100): consistency 40 + current pain 30 + improvement 30
  let recoveryScore = 0;
  if (lastAvg !== null) {
    const consistency = (last7.length / 7) * 40;
    const painPart = ((10 - lastAvg) / 9) * 30;
    let improvement = 15; // pichla data nahi hai to neutral
    if (prevAvg !== null) {
      const change = Math.max(-1, Math.min(1, (prevAvg - lastAvg) / 5));
      improvement = 30 * (0.5 + 0.5 * change);
    }
    recoveryScore = Math.round(Math.max(0, Math.min(100, consistency + painPart + improvement)));
  }

  // 4) RED FLAG: simple rules (medical diagnosis nahi hai)
  let redFlag = null;
  const lastThree = daily.slice(-3);
  const latest = daily[daily.length - 1];
  if (
    lastThree.length === 3 &&
    lastThree[0].avgPain < lastThree[1].avgPain &&
    lastThree[1].avgPain < lastThree[2].avgPain
  ) {
    redFlag = "Your pain has increased for 3 logged days in a row. Consider consulting your physiotherapist.";
  } else if (latest && latest.avgPain >= 8) {
    redFlag = "Your latest pain level is very high (8 or more). Consider consulting your physiotherapist.";
  }

  return {
    streak,
    recoveryScore,
    redFlag,
    avgPainLast7: lastAvg === null ? null : round1(lastAvg),
    daysLoggedLast7: last7.length,
    trend: daily, // chart ke liye: [{ date, avgPain, count }]
  };
}