import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      <div className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full -bottom-40 -right-40 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full -top-40 -left-40 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl px-6"
      >
        <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          JobTrust AI
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-12">
          Intelligent AI-powered platform to detect fake job offers,
          phishing emails, scam URLs, and fraudulent recruitment
          processes instantly.
        </p>

        <motion.button
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 40px rgba(139,92,246,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/analyze-job")}
          className="px-10 py-4 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl transition"
        >
          🚀 Start Secure Analysis
        </motion.button>

      </motion.div>
    </div>
  );
}