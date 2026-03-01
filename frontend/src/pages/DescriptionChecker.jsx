import { useState } from "react";
import { motion } from "framer-motion";

export default function DescriptionChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    if (!text) return;
    setResult("Description analysis complete ✅");
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white pt-40 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
      >
        <h2 className="text-2xl font-semibold mb-6">Description Checker</h2>

        <textarea
          rows={4}
          placeholder="Paste job description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm focus:outline-none focus:border-blue-500"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Analyze Description
        </motion.button>

        {result && (
          <div className="mt-6 text-green-400 text-sm">{result}</div>
        )}
      </motion.div>
    </div>
  );
}