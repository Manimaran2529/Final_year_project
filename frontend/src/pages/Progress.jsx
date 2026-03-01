import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Progress() {

  const [summary, setSummary] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setLoading(false);
      return;
    }

    // ======================
    // Dashboard Summary
    // ======================
    axios
      .get(`http://localhost:8000/dashboard-summary/${userId}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));

    // ======================
    // Weekly Progress
    // ======================
    axios
      .get(`http://localhost:8000/weekly-detailed-progress/${userId}`)
      .then((res) => {

        if (!res.data || res.data.length === 0) {
          setWeeklyData([]);
          return;
        }

        const formatted = res.data.map((item) => ({
          day: item.day,
          aptitude: item.aptitude_score,
          coding: item.coding_score,
          accuracy:
            item.aptitude_total > 0
              ? Math.round((item.aptitude_score / item.aptitude_total) * 100)
              : 0,
        }));

        setWeeklyData(formatted);
      })
      .catch((err) => console.error(err));

    // ======================
    // Monthly Progress
    // ======================
    axios
      .get(`http://localhost:8000/monthly-progress/${userId}`)
      .then((res) => {

        if (!res.data || res.data.length === 0) {
          setMonthlyData([]);
          return;
        }

        const formatted = res.data.map((item) => ({
          week: `Week ${item.week}`,
          aptitude: item.aptitude_score,
          coding: item.coding_score,
        }));

        setMonthlyData(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="text-white p-10 space-y-12">

      <h1 className="text-4xl font-bold">
        📊 Interview Performance Analytics
      </h1>

      {/* ======================
           SUMMARY CARDS
      ====================== */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Aptitude Accuracy" value={`${summary.aptitude_accuracy || 0}%`} />
        <StatCard title="Coding Accuracy" value={`${summary.coding_accuracy || 0}%`} />
        <StatCard title="HR Attempts" value={summary.hr_attempts || 0} />
        <StatCard title="Readiness Score" value={summary.readiness || 0} />
      </div>

      {/* ======================
           WEEKLY SECTION
      ====================== */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Weekly Performance</h2>

        {weeklyData.length === 0 ? (
          <p className="text-gray-400">
            No weekly practice data available.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="aptitude" fill="#4F46E5" radius={[8,8,0,0]} />
                <Bar dataKey="coding" fill="#22C55E" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ======================
           WEEKLY ACCURACY TREND
      ====================== */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Weekly Accuracy Trend</h2>

        {weeklyData.length === 0 ? (
          <p className="text-gray-400">
            No accuracy data available.
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22C55E"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ======================
           MONTHLY SECTION
      ====================== */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Monthly Progress</h2>

        {monthlyData.length === 0 ? (
          <p className="text-gray-400">
            No monthly data available.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="week" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="aptitude" fill="#4F46E5" />
                <Bar dataKey="coding" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}

/* ======================
   CARD COMPONENT
====================== */
function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-blue-400">
        {value}
      </p>
    </div>
  );
}