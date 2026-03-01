import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Aptitude() {

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const [category, setCategory] = useState("Quantitative Aptitude");
  const [level, setLevel] = useState("easy");
  const [count, setCount] = useState(5);

  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  /* =========================
     FETCH QUESTIONS
  ========================== */
  const fetchQuestions = async () => {
    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/aptitude/generate",
        {
          category,
          count,
          difficulty: level
        }
      );

      setQuestions(res.data.questions || []);
      setAnswers(new Array(res.data.questions.length).fill(null));
      setScore(0);
      setCurrentQuestion(0);
      setTimeLeft(30);
      setFinished(false);
      setStarted(true);

    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     TIMER
  ========================== */
  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft === 0) {
      nextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, started, finished]);

  /* =========================
     SELECT ANSWER
  ========================== */
  const selectAnswer = (option) => {
    let updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);
  };

  /* =========================
     NEXT QUESTION
  ========================== */
  const nextQuestion = () => {

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
    } else {
      finishTest();
    }
  };

  /* =========================
     FINISH TEST
  ========================== */
  const finishTest = async () => {

    let finalScore = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setFinished(true);

    // Save result
    try {
      const userId = localStorage.getItem("user_id");

      await axios.post("http://localhost:8000/save-aptitude", {
        user_id: parseInt(userId),
        total_questions: questions.length,
        correct_answers: finalScore
      });

    } catch (error) {
      console.error(error);
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-gray-900 p-10 rounded-3xl w-[450px]">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Aptitude Test
          </h1>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800"
          >
            <option>Quantitative Aptitude</option>
            <option>Logical Reasoning</option>
            <option>Verbal Ability</option>
          </select>

          {/* LEVEL */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* COUNT */}
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full p-3 mb-6 rounded bg-gray-800"
          >
            <option value="5">5 Questions</option>
            <option value="10">10 Questions</option>
            <option value="15">15 Questions</option>
          </select>

          <button
            onClick={fetchQuestions}
            className="w-full bg-blue-600 py-3 rounded-xl"
          >
            Start Test
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
      <div className="min-h-screen bg-black text-white p-10">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Test Result
        </h2>

        <p className="text-xl text-center mb-6">
          Score: {score} / {questions.length} ({percentage}%)
        </p>

        {/* Detailed Review */}
        {questions.map((q, index) => (
          <div key={index} className="bg-gray-900 p-6 rounded-xl mb-4">
            <p className="font-semibold">{q.question}</p>

            <p className="mt-2">
              Your Answer:{" "}
              <span className={
                answers[index] === q.answer
                  ? "text-green-400"
                  : "text-red-400"
              }>
                {answers[index] || "Not Answered"}
              </span>
            </p>

            <p>
              Correct Answer:{" "}
              <span className="text-green-400">
                {q.answer}
              </span>
            </p>

            <p className="mt-2 text-blue-300">
              Solution: {q.solution}
            </p>
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            onClick={restart}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  /* =======================
      QUIZ SCREEN
  ======================== */

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-gray-900 p-10 rounded-3xl w-[650px]">

        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mb-4">
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
              onClick={() => selectAnswer(option)}
              className={`p-3 rounded-xl border 
              ${answers[currentQuestion] === option
                ? "bg-blue-600"
                : "bg-gray-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={nextQuestion}
            className="bg-blue-600 px-6 py-2 rounded-xl"
          >
            {currentQuestion === questions.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}