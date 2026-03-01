import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Result() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div className="pt-32 text-white text-center">No Result Found</div>;
  }

  const checks = [
    { title: "Gmail Checker", value: data.gmail_score },
    { title: "Description Checker", value: data.description_score },
    { title: "URL Checker", value: data.url_score },
    { title: "Offer Letter Checker", value: data.offer_score },
    { title: "Certificate Checker", value: data.certificate_score },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white pt-40 px-6">

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-semibold tracking-tight">
          Security Analysis
        </h1>

        <p className="text-gray-400 mt-3">
          Detailed trust verification results
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {checks.map((check, index) => {
          const safe = check.value >= 70;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl 
                         border border-white/10
                         rounded-2xl p-8 
                         hover:border-blue-500/40
                         hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                         transition duration-300"
            >
              <h3 className="text-lg font-medium mb-6">
                {check.title}
              </h3>

              <div
                className={`text-5xl font-bold ${
                  safe ? "text-green-400" : "text-red-400"
                }`}
              >
                {check.value}%
              </div>

              <div
                className={`mt-4 text-sm ${
                  safe ? "text-green-400" : "text-red-400"
                }`}
              >
                {safe ? "Secure" : "Risk Detected"}
              </div>
            </motion.div>
          );
        })}

      </div>

      {/* Overall Score Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-20"
      >
        <h2 className="text-2xl text-gray-400 mb-4">
          Overall Trust Score
        </h2>

        <div className="text-6xl font-bold text-blue-400">
          {data.score}%
        </div>
      </motion.div>

    </div>
  );
}