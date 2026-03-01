import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TechnicalRound() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [count, setCount] = useState(3);

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    const res = await axios.get("http://127.0.0.1:8000/technical/domains");
    setDomains(res.data.domains);
  };

  // ==========================
  // Generate Questions
  // ==========================
  const generateQuestions = async () => {
    if (!selectedDomain) return alert("Please select domain");

    setLoading(true);
    setResult(null);

    const res = await axios.post(
      "http://127.0.0.1:8000/technical/generate",
      {
        domain: selectedDomain,
        count: count
      }
    );

    setQuestions(res.data.questions);
    setUserAnswers(new Array(res.data.questions.length).fill(""));
    setLoading(false);
  };

  // ==========================
  // Handle Answer Change
  // ==========================
  const handleAnswerChange = (index, value) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  // ==========================
  // Submit All Answers
  // ==========================
  const submitAnswers = async () => {
    if (userAnswers.includes(""))
      return alert("Please answer all questions");

    setLoading(true);

    const res = await axios.post(
      "http://127.0.0.1:8000/technical/submit",
      {
        questions: questions,
        user_answers: userAnswers
      }
    );

    setResult(res.data);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/10"
      >
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Technical Interview Round
        </h1>

        {/* Domain + Count */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-gray-700 px-6 py-3 rounded-xl"
          >
            <option value="">Select Domain</option>
            {domains.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-gray-700 px-6 py-3 rounded-xl"
          >
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
          </select>

          <button
            onClick={generateQuestions}
            className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            {loading ? "Generating..." : "Start Interview"}
          </button>
        </div>

        {/* Questions */}
        {questions.length > 0 && !result && (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">
                  Q{index + 1}. {q.question}
                </h2>

                {q.options.map((opt, i) => (
                  <label key={i} className="block mb-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                      checked={userAnswers[index] === opt}
                      onChange={() => handleAnswerChange(index, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <div className="text-center mt-6">
              <button
                onClick={submitAnswers}
                className="bg-green-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                {loading ? "Evaluating..." : "Submit Answers"}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Your Score: {result.score} / {result.total_questions}
            </h2>

            {result.results.map((r, i) => (
              <div key={i} className={`p-6 rounded-xl ${
                r.is_correct ? "bg-green-800/40" : "bg-red-800/40"
              }`}>
                <p className="font-semibold mb-2">
                  Q{i + 1}. {r.question}
                </p>

                <p>Your Answer: {r.your_answer}</p>

                {!r.is_correct && (
                  <>
                    <p className="text-green-400">
                      Correct Answer: {r.correct_answer}
                    </p>
                    <p className="text-gray-300 mt-2">
                      Explanation: {r.explanation}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
}