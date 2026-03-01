import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TechnicalRound() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    const res = await axios.get("http://127.0.0.1:8000/technical/domains");
    setDomains(res.data.domains);
  };

  const getQuestion = async () => {
    if (!selectedDomain) return alert("Please select domain");
    setLoading(true);
    setResult("");
    setAnswer("");

    const res = await axios.get(
      `http://127.0.0.1:8000/technical/question/${selectedDomain}`
    );

    setQuestion(res.data.question);
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer) return alert("Please enter your answer");

    setLoading(true);

    const res = await axios.post(
      "http://127.0.0.1:8000/technical/evaluate",
      {
        domain: selectedDomain,
        question: question,
        user_answer: answer
      }
    );

    setResult(res.data.evaluation);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/10"
      >
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Technical Interview Round
        </h1>

        {/* Domain Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-gray-700 text-white px-6 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          >
            <option value="">Select Domain</option>
            {domains.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={getQuestion}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
          >
            {loading ? "Loading..." : "Get Question"}
          </button>
        </div>

        {/* Question Section */}
        {question && (
          <div className="mt-6">

            <div className="bg-gray-800 p-6 rounded-xl border border-white/10 mb-6">
              <h2 className="text-xl font-semibold text-blue-400 mb-2">
                Interview Question
              </h2>
              <p className="text-gray-300">{question}</p>
            </div>

            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="5"
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="flex justify-center mt-6">
              <button
                onClick={submitAnswer}
                className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>

          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-purple-500 whitespace-pre-line">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              AI Evaluation
            </h3>
            <p className="text-gray-300">{result}</p>
          </div>
        )}

      </motion.div>

    </div>
  );
}