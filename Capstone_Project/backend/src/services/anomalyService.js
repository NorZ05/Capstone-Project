const alerts = [];
const store = {}; // key -> array of recent values

function detectAnomaly(evt) {
  const key = `${evt.source || 'global'}::${evt.metric || 'unknown'}`;
  store[key] = store[key] || [];
  const arr = store[key];
  const v = Number(evt.value);
  arr.push(v);
  if (arr.length > 100) arr.shift();

  // require at least a few samples before considering z-score
  if (arr.length < 4) {
    return {
      id: alerts.length + 1,
      timestamp: evt.timestamp || new Date().toISOString(),
      source: evt.source || null,
      metric: evt.metric || null,
      value: v,
      score: 0,
      isAnomaly: false,
      details: 'warming up'
    };
  }

  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const variance = arr.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / arr.length;
  const std = Math.sqrt(variance || 0.000001);
  const z = (v - mean) / std;

  const threshold = 3; // can be tuned
  const isAnomaly = Math.abs(z) >= threshold;

  const alert = {
    id: alerts.length + 1,
    timestamp: evt.timestamp || new Date().toISOString(),
    source: evt.source || null,
    metric: evt.metric || null,
    value: v,
    score: Math.abs(z),
    isAnomaly,
    details: isAnomaly ? `z=${z.toFixed(2)} mean=${mean.toFixed(2)} std=${std.toFixed(2)}` : null
  };
  if (isAnomaly) alerts.push(alert);
  return alert;
}

function listAlerts() {
  return alerts.slice().reverse();
}

module.exports = { detectAnomaly, listAlerts };
