import { useState } from "react";
import axios from "axios";

export default function Coding() {
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(1);
  const [language, setLanguage] = useState("python");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [result, setResult] = useState(null);
  const [customInput, setCustomInput] = useState("");

  // ---------------------------------
  // Fetch Questions
  // ---------------------------------
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/coding-questions/${difficulty}/${count}`
      );

      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      setResult(null);

      if (res.data.questions.length > 0) {
        const firstQuestion = res.data.questions[0];

        setUserCode(
          language === "python"
            ? firstQuestion.python_starter
            : firstQuestion.java_starter
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------
  // Submit Code (NO AUTO NEXT)
  // ---------------------------------
  const submitCode = async () => {
    const currentQuestion = questions[currentIndex];

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/submit-code",
        {
          code: userCode,
          question_id: currentQuestion.id,
          custom_input: customInput,
          language: language,
        }
      );

      setResult(res.data);

      if (res.data.passed === res.data.total) {
        setScore((prev) => prev + 1);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------
  // Go To Next Question (Manual)
  // ---------------------------------
  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setResult(null);
      setCustomInput("");

      const nextQ = questions[nextIndex];
      setUserCode(
        language === "python"
          ? nextQ.python_starter
          : nextQ.java_starter
      );
    } else {
      setFinished(true);
    }
  };

  // ---------------------------------
  // Final Result
  // ---------------------------------
  if (finished) {
  const percentage = Math.round((score / questions.length) * 100);

  let color = "text-red-400";
  if (percentage >= 80) color = "text-green-400";
  else if (percentage >= 50) color = "text-yellow-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg text-center w-[400px]">

        <h1 className="text-3xl font-bold mb-6">
          🎯 Coding Round Completed
        </h1>

        <div className={`text-6xl font-bold ${color}`}>
          {percentage}%
        </div>

        <p className="mt-4 text-lg">
          Score: {score} / {questions.length}
        </p>

        <div className="mt-6 flex justify-center gap-4">

          <button
            onClick={() => {
              setQuestions([]);
              setFinished(false);
              setScore(0);
              setCurrentIndex(0);
            }}
            className="bg-blue-600 px-5 py-2 rounded-lg"
          >
            🔄 Try Again
          </button>

        </div>
      </div>
    </div>
  );
}

  // ---------------------------------
  // Start Screen
  // ---------------------------------
if (questions.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg w-[450px]">

        <h1 className="text-3xl font-bold text-center mb-8">
          🚀 Coding Round
        </h1>

        {/* Difficulty */}
        <div className="mb-5">
          <label className="block mb-2 text-sm text-gray-400">
            Select Difficulty
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

        {/* Question Count */}
        <div className="mb-5">
          <label className="block mb-2 text-sm text-gray-400">
            Number of Questions
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full p-3 rounded-lg text-black"
          >
            <option value={1}>1 Question</option>
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
          </select>
        </div>

        {/* Language */}
        <div className="mb-8">
          <label className="block mb-2 text-sm text-gray-400">
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

        <button
          onClick={fetchQuestions}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
        >
          Start Test
        </button>

      </div>
    </div>
  );
}

// ---------------------------------
// Question Screen
// ---------------------------------
const currentQuestion = questions[currentIndex];

return (
  <div className="min-h-screen bg-gray-900 text-white p-8">

    <div className="max-w-4xl mx-auto">

      <h2 className="text-xl mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h2>

      <div className="bg-gray-800 p-6 rounded-xl shadow">

        <h3 className="text-2xl font-bold mb-3">
          {currentQuestion.title}
        </h3>

        <p className="text-gray-300 whitespace-pre-line mb-6">
          {currentQuestion.description}
        </p>

        {/* Code Editor */}
        <textarea
          className="w-full h-64 p-4 rounded-lg text-black mb-4"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />

        {/* Custom Input */}
        <input
          type="text"
          placeholder="Optional: Custom Input"
          className="w-full p-3 rounded-lg text-black mb-4"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={submitCode}
            className="bg-green-600 px-6 py-2 rounded-lg"
          >
            Submit Code
          </button>

          {result && (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 px-6 py-2 rounded-lg"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            <p>
              Passed: {result.passed} / {result.total}
            </p>

            {result.failed_cases &&
              result.failed_cases.map((f, index) => (
                <div key={index} className="mt-3 text-sm">
                  <p>Input: {JSON.stringify(f.input)}</p>
                  <p>Expected: {JSON.stringify(f.expected)}</p>
                  <p>Your Output: {JSON.stringify(f.your_output)}</p>
                </div>
              ))}

            {result.correct_solution && (
              <div className="mt-4">
                <h4 className="font-bold">Correct Solution:</h4>
                <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                  {result.correct_solution}
                </pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  </div>
);
}