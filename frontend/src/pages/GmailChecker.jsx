import { useState } from "react";
import { motion } from "framer-motion";

export default function GmailChecker() {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);

  const analyzeEmail = () => {
    if (!emailContent) return;

    const lowerText = emailContent.toLowerCase();

    let score = 100;
    let reasons = [];

    // Rule 1: Suspicious Gmail usage
    if (lowerText.includes("@gmail.com")) {
      score -= 25;
      reasons.push("Company using Gmail instead of official domain.");
    }

    // Rule 2: Generic greeting
    if (lowerText.includes("dear intern")) {
      score -= 15;
      reasons.push("Generic greeting detected.");
    }

    // Rule 3: Urgency language
    if (lowerText.includes("urgent") || lowerText.includes("immediately")) {
      score -= 20;
      reasons.push("Urgent language detected.");
    }

    // Rule 4: No official signature
    if (!lowerText.includes("codveda.com")) {
      score -= 20;
      reasons.push("Official domain not clearly verified.");
    }

    if (score >= 70) {
      setResult({
        status: "Likely Legitimate",
        color: "text-green-400",
        score,
        reasons: reasons.length
          ? reasons
          : ["No major red flags detected."],
      });
    } else {
      setResult({
        status: "Potential Risk",
        color: "text-red-400",
        score,
        reasons,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white pt-40 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Gmail / HR Email Analyzer
        </h2>

        <textarea
          rows={8}
          placeholder="Paste full email received from HR..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm focus:outline-none focus:border-blue-500"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={analyzeEmail}
          className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Analyze Email
        </motion.button>

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className={`text-xl font-semibold ${result.color}`}>
              {result.status} ({result.score}%)
            </div>

            <ul className="mt-4 text-sm text-gray-300 list-disc pl-6 space-y-2">
              {result.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}