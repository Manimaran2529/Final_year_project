import ActivityHeatmap from "../components/ActivityHeatmap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/dashboard-summary/${userId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  if (!data) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  const isNewUser =
    data.total_jobs === 0 &&
    data.fake_jobs === 0 &&
    data.aptitude_accuracy === 0 &&
    data.coding_accuracy === 0 &&
    data.hr_attempts === 0;

  const pieData = isNewUser
    ? [
        { name: "Start", value: 1 },
        { name: "Practice", value: 1 },
      ]
    : [
        { name: "Real", value: data.total_jobs - data.fake_jobs },
        { name: "Fake", value: data.fake_jobs },
      ];

  const readinessData = [
    {
      name: "Readiness",
      value: isNewUser ? 20 : data.readiness,
      fill: "#3b82f6",
    },
  ];

  const COLORS = isNewUser
    ? ["#6366f1", "#a855f7"]
    : ["#3b82f6", "#ef4444"];

  return (
    <div className="space-y-12 text-white">

      {/* ================= WELCOME ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-white/10"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-gray-400">
          {isNewUser
            ? "Start your interview preparation journey today 🚀"
            : "Here’s your performance analytics overview"}
        </p>
      </motion.div>

      {/* ================= ACTION CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-8">

        <ActionCard
          title="Analyze Jobs"
          value={data.total_jobs}
          buttonText="Analyze Now"
          color="blue"
          onClick={() => navigate("/analyze-job")}
        />

        <ActionCard
          title="Aptitude Accuracy"
          value={`${data.aptitude_accuracy}%`}
          buttonText="Start Test"
          color="green"
          onClick={() => navigate("/interview-prep/aptitude")}
        />

        <ActionCard
          title="Coding Accuracy"
          value={`${data.coding_accuracy}%`}
          buttonText="Start Coding"
          color="purple"
          onClick={() => navigate("/interview-prep/coding")}
        />

        <ActionCard
          title="HR Practice"
          value={data.hr_attempts}
          buttonText="Start HR Round"
          color="pink"
          onClick={() => navigate("/interview-prep/hr")}
        />

      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* PIE */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 className="text-xl mb-6 text-center">
            Real vs Fake Jobs
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

          {isNewUser && (
            <p className="text-center text-gray-400 mt-4">
              Analyze jobs to see real insights here.
            </p>
          )}
        </div>

        {/* READINESS */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
          <h3 className="text-xl mb-6">
            Interview Readiness
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={readinessData}
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
            {isNewUser ? "20%" : `${data.readiness}%`}
          </p>
        </div>

      </div>

      {/* ================= HEATMAP ================= */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h3 className="text-xl mb-6">
          Weekly Activity
        </h3>

        {isNewUser ? (
          <p className="text-gray-400">
            Your activity heatmap will appear after you start practicing.
          </p>
        ) : (
          <ActivityHeatmap />
        )}
      </div>

    </div>
  );
}

/* ================= ACTION CARD ================= */

function ActionCard({ title, value, buttonText, color, onClick }) {
  const colorMap = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    pink: "from-pink-500 to-pink-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between"
    >
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>

      <button
        onClick={onClick}
        className={`mt-6 py-2 rounded-xl bg-gradient-to-r ${colorMap[color]} hover:opacity-90 transition`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}