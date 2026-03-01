import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { motion } from "framer-motion";

export default function Dashboard() {

  const userName = localStorage.getItem("user_name");
  const userEmail = localStorage.getItem("user_email");

  const stats = [
    { label: "Jobs Analyzed", value: 12 },
    { label: "Fake Jobs", value: 3 },
    { label: "Interviews", value: 8 },
    { label: "Accuracy", value: "92%" },
  ];

  const lineData = [
    { name: "Mon", jobs: 2 },
    { name: "Tue", jobs: 3 },
    { name: "Wed", jobs: 4 },
    { name: "Thu", jobs: 1 },
    { name: "Fri", jobs: 2 },
    { name: "Sat", jobs: 0 },
    { name: "Sun", jobs: 3 },
  ];

  const pieData = [
    { name: "Real", value: 9 },
    { name: "Fake", value: 3 },
  ];

  const COLORS = ["#3b82f6", "#ef4444"];

  return (
    <div className="space-y-10">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName || userEmail} 👋
        </h1>
        <p className="text-gray-400">
          Here’s your job trust performance overview for this week.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-8">

        {stats.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-4xl font-bold mt-4 text-white">
              {item.value}
            </h2>
          </motion.div>
        ))}

      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* Line Chart Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6">
            Weekly Job Activity
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">
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
        </motion.div>

      </div>

    </div>
  );
}