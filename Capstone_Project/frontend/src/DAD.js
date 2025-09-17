import React, { useState, useEffect } from 'react';
import cfg from './config';

export default function DAD() {
  const [summary, setSummary] = useState({ critical: 0, warning: 0, info: 0 });
  const [anomalies, setAnomalies] = useState([]);
  const [filter, setFilter] = useState('All');
  // UI state for confirm modal and undo snackbar
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingResolve, setPendingResolve] = useState(null);
  const [recentUndo, setRecentUndo] = useState(null);

  async function fetchAnomalies() {
    try {
      const storedRes = await fetch(`${cfg.API_BASE}/anomalies`);
      const stored = storedRes.ok ? await storedRes.json() : [];

      const res = await fetch(`${cfg.API_BASE}/anomalies/detect`);
      const data = res.ok ? await res.json() : [];

      const persistedMapped = (stored || []).map((s) => ({
        id: s.id,
        title: s.metric || 'Anomaly',
        source: (s.details && s.details.source) || 'db',
        description: (s.details && s.details.description) || '',
        status: s.score >= 3 ? 'Critical' : s.score >= 2 ? 'Warning' : 'Info',
        detected: s.detected_at ? new Date(s.detected_at).toLocaleString() : new Date().toLocaleString(),
        resolved_at: s.resolved_at || null,
      }));

      const mappedLive = (data || []).map((a, idx) => ({
        id: a.id || `live-${idx}`,
        title: a.title || a.metric || 'Anomaly',
        source: a.source || 'live',
        description: a.description || (a.details && JSON.stringify(a.details)) || '',
        status: a.severity || (a.score >= 3 ? 'Critical' : a.score >= 2 ? 'Warning' : 'Info'),
        detected: a.timestamp ? new Date(a.timestamp).toLocaleString() : new Date().toLocaleString(),
        resolved_at: a.resolved_at || null,
      }));

      const combined = [...persistedMapped, ...mappedLive];
      setAnomalies(combined);
      setSummary({
        critical: combined.filter((x) => x.status === 'Critical' && !x.resolved_at).length,
        warning: combined.filter((x) => x.status === 'Warning' && !x.resolved_at).length,
        info: combined.filter((x) => x.status === 'Info' && !x.resolved_at).length,
      });
    } catch (err) {
      console.error('fetch anomalies', err);
    }
  }

  async function runAndPersist(persist = false) {
    try {
      const url = `${cfg.API_BASE}/benchmark/run` + (persist ? '?persist=1' : '');
      await fetch(url);
      await fetchAnomalies();
    } catch (err) {
      console.error('run detect', err);
    }
  }

  useEffect(() => { fetchAnomalies(); }, []);

  async function resolveAnomaly(id) {
    try {
      await fetch(`${cfg.API_BASE}/anomalies/${id}/resolve`, { method: 'PUT' });
      // show undo affordance for a short time
      setRecentUndo({ id, ts: Date.now() });
      fetchAnomalies();
      // auto-hide undo after 8 seconds
      setTimeout(() => setRecentUndo((r) => (r && r.id === id ? null : r)), 8000);
    } catch (err) {
      console.error('resolve error', err);
    }
  }

  async function unresolveAnomaly(id) {
    try {
      await fetch(`${cfg.API_BASE}/anomalies/${id}/unresolve`, { method: 'PUT' });
      setRecentUndo(null);
      fetchAnomalies();
    } catch (err) {
      console.error('unresolve error', err);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-[90vw] mx-auto border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-1">📡 Dynamic Anomaly Detector</h2>
      <p className="text-sm text-gray-600 mb-6">Monitor and detect unusual patterns in your business operations</p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-300 rounded-md p-5 text-center">
          <div className="text-red-600 text-2xl mb-1">🚨</div>
          <h3 className="text-sm font-semibold text-red-700">Critical Anomalies</h3>
          <div className="text-4xl font-bold text-red-800">{summary.critical}</div>
          <p className="text-xs text-red-600 mt-1">Require immediate attention</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-300 rounded-md p-5 text-center">
          <div className="text-yellow-600 text-2xl mb-1">⚠️</div>
          <h3 className="text-sm font-semibold text-yellow-700">Warnings</h3>
          <div className="text-4xl font-bold text-yellow-800">{summary.warning}</div>
          <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
        </div>
        <div className="bg-teal-50 border border-teal-300 rounded-md p-5 text-center">
          <div className="text-teal-600 text-2xl mb-1">📈</div>
          <h3 className="text-sm font-semibold text-teal-700">Information</h3>
          <div className="text-4xl font-bold text-teal-800">{summary.info}</div>
          <p className="text-xs text-teal-600 mt-1">Informational alerts</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">🧠 Active Anomalies</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => runAndPersist(false)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Run Detect</button>
          <button onClick={() => runAndPersist(true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Run & Persist</button>
          <select className="border rounded-md px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Anomalies</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Info">Information</option>
          </select>
        </div>
      </div>

      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }} className="space-y-5">
        {anomalies.filter((a) => filter === 'All' || a.status === filter).map((a, i) => (
          <div key={a.id || i} className={`border rounded-lg p-5 flex justify-between items-start ${a.status === 'Critical' ? 'border-red-300 bg-red-50' : a.status === 'Warning' ? 'border-yellow-300 bg-yellow-50' : 'border-teal-300 bg-teal-50'}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{a.status === 'Critical' ? '🚨' : a.status === 'Warning' ? '⚠️' : '📈'}</span>
                <h4 className="text-md font-bold text-gray-800">{a.title}</h4>
              </div>
              <p className="text-sm text-gray-700 mb-1">{a.description}</p>
              <p className="text-xs text-gray-600">{a.source}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${a.status === 'Critical' ? 'bg-red-600 text-white' : a.status === 'Warning' ? 'bg-yellow-400 text-black' : 'bg-teal-500 text-white'}`}>{a.status}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 italic mb-2">{a.detected}</div>
              {!a.resolved_at ? (
                <button onClick={() => { setPendingResolve(a.id); setConfirmOpen(true); }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Resolve</button>
              ) : (
                <div className="text-xs text-green-600">Resolved</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h4 className="text-lg font-semibold mb-3">Confirm Resolve</h4>
            <p className="text-sm text-gray-700 mb-4">Are you sure you want to mark this anomaly as resolved? You can undo for a short time.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setConfirmOpen(false); setPendingResolve(null); }} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={async () => { setConfirmOpen(false); if (pendingResolve) { await resolveAnomaly(pendingResolve); setPendingResolve(null); } }} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Undo snackbar */}
      {recentUndo && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-3">
          <div className="text-sm">Anomaly resolved</div>
          <button onClick={() => unresolveAnomaly(recentUndo.id)} className="underline text-sm">Undo</button>
        </div>
      )}
    </div>
  );
}
