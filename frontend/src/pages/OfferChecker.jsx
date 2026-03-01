import { useState } from "react";
import { motion } from "framer-motion";

export default function OfferChecker() {
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    setResult("Offer letter verified ✅");
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white pt-40 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
      >
        <h2 className="text-2xl font-semibold mb-6">Offer Letter Checker</h2>

        <input
          type="file"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-6 text-sm file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Verify Offer
        </motion.button>

        {result && (
          <div className="mt-6 text-green-400 text-sm">{result}</div>
        )}
      </motion.div>
    </div>
  );
}