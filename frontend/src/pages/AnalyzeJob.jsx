import { useNavigate } from "react-router-dom";
import { Mail, Link as LinkIcon, FileText, ShieldCheck } from "lucide-react";

export default function AnalyzeJob() {
  const navigate = useNavigate();

  const securityChecks = [
    {
      title: "Gmail Checker",
      icon: <Mail size={24} />,
      path: "/gmail-checker",
      color: "from-red-500 to-red-700",
      description: "Detect phishing and suspicious job emails."
    },
    {
      title: "URL Checker",
      icon: <LinkIcon size={24} />,
      path: "/url-checker",
      color: "from-blue-500 to-blue-700",
      description: "Check job links for malware and fake domains."
    },
    {
      title: "Offer Letter Checker",
      icon: <FileText size={24} />,
      path: "/offer-checker",
      color: "from-green-500 to-green-700",
      description: "Verify authenticity of offer letters."
    },
    {
      title: "Certificate Checker",
      icon: <ShieldCheck size={24} />,
      path: "/certificate-checker",
      color: "from-purple-500 to-purple-700",
      description: "Validate company certificates & documents."
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-10 py-16">

      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">
          🔍 Analyze Job
        </h1>
        <p className="text-gray-400 mt-2">
          Protect yourself from fake job offers
        </p>
      </div>

      {/* Section Label */}
      <h2 className="text-lg text-gray-400 mb-8">
        Security Checks
      </h2>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {securityChecks.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`bg-gradient-to-r ${item.color} p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition`}
          >
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h2 className="text-xl font-semibold">
                {item.title}
              </h2>
            </div>
            <p className="opacity-90 text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}