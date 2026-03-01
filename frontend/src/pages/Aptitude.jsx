import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Aptitude() {
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState({});
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("easy");
  const [count, setCount] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/ai-daily-math/${level}/${count}`
      );
      setQuestions(res.data.questions || []);
      setResults({});
      setScore(0);
      setCurrentQuestion(0);
      setTimeLeft(30);
      setFinished(false);
      setStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, started, finished]);

  const checkAnswer = (selectedOption) => {
    const correct = questions[currentQuestion].answer;
    if (results[currentQuestion]) return;

    let updated = { ...results };

    if (selectedOption === correct) {
      updated[currentQuestion] = { correct: true };
      setScore((prev) => prev + 1);
    } else {
      updated[currentQuestion] = {
        correct: false,
        explanation: questions[currentQuestion].explanation,
      };
    }

    setResults(updated);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
  };

  /* =======================
      START SCREEN
  ======================== */
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="bg-white/5 p-10 rounded-3xl shadow-xl w-[400px]">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Daily Aptitude Practice
          </h1>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">
              Difficulty
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-gray-700"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-300">
              Number of Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-black border border-gray-700"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>

          <button
            onClick={fetchQuestions}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  /* =======================
      RESULT SCREEN
  ======================== */
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white/5 p-10 rounded-3xl shadow-xl w-[450px] text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            🎉 Test Completed!
          </h2>

          <p className="text-xl mb-4">
            Score: <span className="text-green-400">{score}</span> /{" "}
            {questions.length}
          </p>

          <p className="text-lg mb-6">
            Percentage:{" "}
            <span className="text-blue-400">{percentage}%</span>
          </p>

          <button
            onClick={restart}
            className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Restart Test
          </button>
        </motion.div>
      </div>
    );
  }

  /* =======================
      QUIZ SCREEN
  ======================== */
  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/5 p-10 rounded-3xl shadow-xl w-[600px]">

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <span>
            Question {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-red-400">
            ⏱ {timeLeft}s
          </span>
        </div>

        <h3 className="mb-6 text-lg font-semibold">
          {q.question}
        </h3>

        <div className="grid gap-4">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => checkAnswer(option)}
              className="bg-black border border-gray-700 p-3 rounded-xl hover:bg-blue-600/30 transition"
            >
              {option}
            </button>
          ))}
        </div>

        {results[currentQuestion] && (
          <div className="mt-6">
            {!results[currentQuestion].correct && (
              <p className="text-red-400 mb-2">
                Explanation: {results[currentQuestion].explanation}
              </p>
            )}
            <button
              onClick={nextQuestion}
              className="mt-3 bg-blue-600 px-5 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}