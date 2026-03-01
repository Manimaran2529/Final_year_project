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

export default function Progress() {
  const practiceData = [
    { name: "Mon", hours: 1 },
    { name: "Tue", hours: 2 },
    { name: "Wed", hours: 3 },
    { name: "Thu", hours: 1 },
    { name: "Fri", hours: 2 },
  ];

  const interviewData = [
    { name: "Aptitude", value: 5 },
    { name: "Coding", value: 8 },
    { name: "HR", value: 3 },
  ];

  const COLORS = ["#4F46E5", "#22C55E", "#F97316"];

  return (
    <div className="text-white p-10 space-y-10">

      {/* Title */}
      <h1 className="text-4xl font-bold">
        Interview Preparation Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">Aptitude Attempts</h3>
          <p className="text-2xl font-bold mt-2">5</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">Coding Hours</h3>
          <p className="text-2xl font-bold mt-2">12 hrs</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-gray-400">HR Confidence</h3>
          <p className="text-2xl font-bold mt-2 text-green-400">85%</p>
        </div>
      </div>

      {/* Weekly Practice Chart */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Weekly Practice Hours</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={practiceData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="hours" fill="#4F46E5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Practice Distribution Chart */}
      <div className="bg-white/5 p-8 rounded-3xl">
        <h2 className="text-xl mb-6">Practice Distribution</h2>

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