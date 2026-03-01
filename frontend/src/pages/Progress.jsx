import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Progress() {

  const [weeklyData, setWeeklyData] = useState([]);
  const [summary, setSummary] = useState({
    total_jobs: 0,
    fake_jobs: 0,
    accuracy: 0
  });

  const [loading, setLoading] = useState(true);

  const COLORS = ["#4F46E5", "#22C55E"];

  useEffect(() => {

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.log("No user_id found");
      setLoading(false);
      return;
    }

    // ======================
    // Load Summary
    // ======================
    axios
      .get(`http://localhost:8000/user-progress/${userId}`)
      .then((res) => {
        if (res.data) {
          setSummary(res.data);
        }
      })
      .catch((err) => console.error("Summary error:", err));

    // ======================
    // Load Weekly Data
    // ======================
    axios
      .get(`http://localhost:8000/weekly-progress/${userId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {

          const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

          const formatted = res.data.map((item) => ({
            name: days[item[0]] || "Sun",
            hours: item[1] || 0,
          }));

          setWeeklyData(formatted);
        }
      })
      .catch((err) => console.error("Weekly error:", err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading Progress...
      </div>
    );
  }

  const interviewData = [
    {
      name: "Real Jobs",
      value: (summary.total_jobs || 0) - (summary.fake_jobs || 0),
    },
    {
      name: "Fake Jobs",
      value: summary.fake_jobs || 0,
    },
  ];

  return (
    <div className="text-white p-10 space-y-10">

      <h1 className="text-4xl font-bold">
        Interview Preparation Analytics
      </h1>

      {/* ======================
           Stats Cards
      ====================== */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">Total Jobs Analyzed</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.total_jobs}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">Fake Jobs</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.fake_jobs}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">Accuracy</h3>
          <p className="text-2xl font-bold mt-2 text-green-400">
            {summary.accuracy}%
          </p>
        </div>
      </div>

      {/* ======================
           Weekly Chart
      ====================== */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">
          Weekly Interview Practice
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="hours" fill="#4F46E5" radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================
           Job Distribution
      ====================== */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Job Distribution</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={interviewData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {interviewData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}