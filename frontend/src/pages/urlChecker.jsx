import { useState } from "react";
import { motion } from "framer-motion";

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [reasons, setReasons] = useState([]);

  const handleCheck = async () => {
    if (!url) return;

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await fetch("http://127.0.0.1:8000/check-url", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.safe) {
        setResult({
          message: "✅ URL appears legitimate",
          color: "text-green-400",
        });
      } else {
        setResult({
          message: "⚠️ URL appears unsafe",
          color: "text-red-400",
        });
      }

      setReasons(data.reasons);

    } catch (error) {
      console.error(error);
      setResult({
        message: "❌ Error checking URL",
        color: "text-red-400",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white pt-40 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
      >
        <h2 className="text-2xl font-semibold mb-6">URL Checker</h2>

        <input
          type="text"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm focus:outline-none focus:border-blue-500"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Verify URL
        </motion.button>

        {result && (
          <div className={`mt-6 text-sm ${result.color}`}>
            {result.message}
          </div>
        )}

        {reasons.length > 0 && (
          <div className="mt-4 text-xs text-gray-400">
            <ul className="list-disc pl-5">
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}