import { Link } from "react-router-dom";
import { Brain, Users, BookOpen, Code } from "lucide-react";

export default function InterviewPrep() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-10 py-16">

      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold flex justify-center items-center gap-3">
          🚀 Interview Preparation
        </h1>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* Technical */}
        <Link
          to="/interview-prep/technical"
          className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Brain size={26} />
            <h2 className="text-2xl font-semibold">
              Technical Round
            </h2>
          </div>
          <p className="opacity-90">
            AI-generated technical questions to test your core knowledge.
          </p>
        </Link>

        {/* HR */}
        <Link
          to="/interview-prep/hr"
          className="bg-gradient-to-r from-green-500 to-green-700 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users size={26} />
            <h2 className="text-2xl font-semibold">
              HR Round
            </h2>
          </div>
          <p className="opacity-90">
            Practice behavioral and real corporate HR questions.
          </p>
        </Link>

        {/* Aptitude */}
        <Link
          to="/interview-prep/aptitude"
          className="bg-gradient-to-r from-purple-500 to-purple-700 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={26} />
            <h2 className="text-2xl font-semibold">
              Aptitude Round
            </h2>
          </div>
          <p className="opacity-90">
            Logical, verbal and quantitative aptitude practice.
          </p>
        </Link>

        {/* Coding */}
        <Link
          to="/interview-prep/coding"
          className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Code size={26} />
            <h2 className="text-2xl font-semibold">
              Coding Round
            </h2>
          </div>
          <p className="opacity-90">
            Solve coding problems with AI evaluation system.
          </p>
        </Link>

      </div>
    </div>
  );
}