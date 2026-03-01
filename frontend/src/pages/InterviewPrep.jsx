import { Link } from "react-router-dom";

export default function InterviewPrep() {
  return (
    <div className="flex flex-col items-center gap-6 mt-20">

      <h1 className="text-4xl font-bold mb-10">Interview Preparation</h1>

      <Link
        to="/interview-prep/technical"
        className="bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-700"
      >
        Technical Round
      </Link>

      <Link
        to="/interview-prep/hr"
        className="bg-green-600 px-8 py-4 rounded-xl hover:bg-green-700"
      >
        HR Round
      </Link>

      <Link
        to="/interview-prep/aptitude"
        className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700"
      >
        Aptitude Round
      </Link>

      <Link
        to="/interview-prep/coding"
        className="bg-orange-600 px-8 py-4 rounded-xl hover:bg-orange-700"
      >
        Coding Round
      </Link>

    </div>
  );
}