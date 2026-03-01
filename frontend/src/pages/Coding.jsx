import { useState, useEffect } from "react";
import axios from "axios";

export default function Coding() {

  const [language, setLanguage] = useState("python");
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  // ================= TIMER =================
  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft <= 0) {
      alert("⏱ Time's up!");
      submitCode();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, started, finished]);

  // ================= FETCH QUESTION =================
  const fetchQuestion = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/ai-coding-question/${language}/${difficulty}`
      );

      setQuestion(res.data);
      setUserCode("");
      setResult(null);
      setTimeLeft(180);
      setStarted(true);

    } catch (err) {
      alert("Error loading question");
      console.error(err);
    }
  };

  // ================= SUBMIT CODE =================
  const submitCode = async () => {

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai-evaluate-code",
        {
          question: question.problem_statement,
          expected_logic: question.problem_statement,
          user_code: userCode,
          language: language,
          correct_solution: question.correct_solution
        }
      );

      setResult(res.data);
      setFinished(true);

    } catch (err) {
      alert("Evaluation failed");
      console.error(err);
    }
  };

  // ================= START SCREEN =================
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">

        <div className="bg-gray-800 p-10 rounded-2xl w-[500px] shadow-xl">

          <h1 className="text-4xl font-bold mb-8 text-center">
            💻 Coding Round
          </h1>

          <div className="mb-6">
            <label className="block mb-2 text-gray-400">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-gray-400">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={fetchQuestion}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-lg font-semibold"
          >
            Start Coding Test
          </button>

        </div>
      </div>
    );
  }

  // ================= RESULT SCREEN =================
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">

        <div className="bg-gray-800 p-10 rounded-2xl w-[700px] shadow-xl">

          <h1 className="text-3xl font-bold mb-6">
            🎯 Evaluation Result
          </h1>

          <div className="mb-4">
            <span className="font-bold">Score:</span> {result?.score}/10
          </div>

          <div className="mb-4">
            <span className="font-bold">Status:</span>{" "}
            {result?.passed ? (
              <span className="text-green-400">Correct ✅</span>
            ) : (
              <span className="text-red-400">Incorrect ❌</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">AI Feedback:</h3>
            <p className="whitespace-pre-line text-gray-300">
              {result?.feedback}
            </p>
          </div>

          {!result?.passed && (
            <div>
              <h3 className="font-bold mb-2">Correct Solution:</h3>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                {result?.correct_solution}
              </pre>
            </div>
          )}

          <button
            onClick={() => {
              setStarted(false);
              setFinished(false);
              setQuestion(null);
              setResult(null);
            }}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
          >
            🔄 Try Another Question
          </button>

        </div>
      </div>
    );
  }

  // ================= QUESTION SCREEN =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-10">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {question?.title}
          </h2>
          <div className="text-red-400 text-xl font-bold">
            ⏱ {timeLeft}s
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE - QUESTION */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">

            <div className="mb-4">
              <h3 className="font-bold text-blue-400 mb-1">Problem Statement</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {question?.problem_statement}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-blue-400 mb-1">Input Format</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {question?.input_format}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-blue-400 mb-1">Output Format</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {question?.output_format}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-blue-400 mb-1">Constraints</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {question?.constraints}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-green-400 mb-1">Example Input</h3>
              <pre className="bg-black p-3 rounded text-sm">
                {question?.example_input}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-green-400 mb-1">Example Output</h3>
              <pre className="bg-black p-3 rounded text-sm">
                {question?.example_output}
              </pre>
            </div>

          </div>

          {/* RIGHT SIDE - CODE EDITOR */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">

            <h3 className="font-bold text-purple-400 mb-3">
              Write Your Code
            </h3>

            <textarea
              className="w-full h-96 p-4 rounded-lg text-black mb-4"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Write your solution here..."
            />

            <button
              onClick={submitCode}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl w-full"
            >
              Submit Code
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}