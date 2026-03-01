import { useNavigate } from "react-router-dom";

export default function AnalyzeJob() {
  const navigate = useNavigate();

  const securityChecks = [
    { title: "Gmail Checker", path: "/gmail-checker" },
    { title: "URL Checker", path: "/url-checker" },
    { title: "Offer Letter Checker", path: "/offer-checker" },
    { title: "Certificate Checker", path: "/certificate-checker" },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <h1 className="text-5xl font-bold mb-20 text-center">
        Analyze Job
      </h1>

      <h2 className="text-xl mb-6 text-gray-400">Security Checks</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {securityChecks.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white/5 p-6 rounded-2xl cursor-pointer hover:bg-blue-600/20 transition"
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}