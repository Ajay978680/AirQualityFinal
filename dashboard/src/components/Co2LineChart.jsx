import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Co2LineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const filtered = [];
        let lastTime = null;
        sorted.forEach(row => {
          const currTime = new Date(row.timestamp).getTime();
          if (!lastTime || currTime - lastTime >= 60 * 1000) {
            filtered.push(row);
            lastTime = currTime;
          }
        });
        setData(filtered.slice(-50));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-4">CO₂ Over Time</h3>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={270}>
          <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="timestamp" stroke="#22c55e" tick={{ fontSize: 13 }} />
            <YAxis stroke="#22c55e" tick={{ fontSize: 13 }} label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft', fill: '#22c55e', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', border: '1px solid #bae6fd' }}
              labelStyle={{ color: '#22c55e', fontWeight: '500' }}
            />
            <Line
              type="monotone"
              dataKey="co2"
              name="CO₂ (ppm)"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: '#22c55e' }}
              activeDot={{ r: 7 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
