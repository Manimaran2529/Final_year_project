import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [data, setData] = useState(null);

  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8000/dashboard-summary/${userId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

  }, [userId]);

  if (!data) {
    return (
      <div className="text-white p-10">
        Loading dashboard...
      </div>
    );
  }

  const pieData = [
    { name: "Real", value: data.total_jobs - data.fake_jobs },
    { name: "Fake", value: data.fake_jobs },
  ];

  const radialData = [
    {
      name: "Readiness",
      value: data.readiness,
      fill: "#3b82f6",
    },
  ];

  const COLORS = ["#3b82f6", "#ef4444"];

  return (
    <div className="space-y-12">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-white/10"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-gray-400">
          Live performance overview
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-8">

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm">Jobs Analyzed</p>
          <h2 className="text-4xl font-bold">{data.total_jobs}</h2>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm">Fake Jobs</p>
          <h2 className="text-4xl font-bold">{data.fake_jobs}</h2>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm">Interviews</p>
          <h2 className="text-4xl font-bold">{data.interviews}</h2>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm">Accuracy</p>
          <h2 className="text-4xl font-bold text-green-400">
            {data.accuracy}%
          </h2>
        </div>

      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-12">

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 className="text-xl mb-6 text-center">
            Fake vs Real Jobs
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
          <h3 className="text-xl mb-6">
            Interview Readiness
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={radialData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                clockWise
                dataKey="value"
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <p className="text-2xl font-bold mt-4">
            {data.readiness}%
          </p>
        </div>

      </div>

    </div>
  );
}