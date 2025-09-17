import React, { useState } from 'react';
import config from './config';

export default function SimulatedBenchmark() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function runBenchmark() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch(`${config.backendUrl}/api/benchmark/run`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Simulated Benchmark</h2>
      <p className="mb-4 text-sm text-gray-600">Generate a synthetic 2023–2024 dataset and run anomaly detection rules. Results are saved to the backend data folder.</p>
      <button className="btn btn-primary mb-4" onClick={runBenchmark} disabled={running}>{running ? 'Running…' : 'Run Benchmark'}</button>
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      {result && (
        <div>
          <div className="mb-4">
            <strong>Total records:</strong> {result.metrics.totalRecords} — <strong>Anomalies:</strong> {result.metrics.anomaliesFound} — <strong>Duration ms:</strong> {result.metrics.durationMs}
          </div>
          <div className="overflow-auto max-h-96 border p-2">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th className="px-2">Source</th>
                  <th className="px-2">Severity</th>
                  <th className="px-2">Description</th>
                  <th className="px-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {result.anomalies.map((a, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{a.source}</td>
                    <td className="px-2 py-1">{a.severity}</td>
                    <td className="px-2 py-1">{a.description}</td>
                    <td className="px-2 py-1">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
