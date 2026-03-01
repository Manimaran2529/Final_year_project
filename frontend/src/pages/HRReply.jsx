import { useState } from "react";
import axios from "axios";

export default function HRReply() {
  const [hrEmail, setHrEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [query, setQuery] = useState("");

  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");

  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 1️⃣ Generate Email
  // =========================
  const generateEmail = async () => {
    if (!candidateName || !query) {
      setStatus("Please enter your name and query ❌");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post(
        "http://127.0.0.1:8000/generate-mail",
        {
          candidate_name: candidateName,
          query: query
        }
      );

      setGeneratedSubject(res.data.subject);
      setGeneratedBody(res.data.body);
      setPreviewMode(true);

    } catch (error) {
      console.error(error);
      setStatus("Error generating email ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 2️⃣ Open Gmail
  // =========================
  const sendEmail = () => {
    if (!hrEmail) {
      setStatus("Please enter HR email ❌");
      return;
    }

    const subject = encodeURIComponent(generatedSubject);
    const body = encodeURIComponent(generatedBody);
    const to = encodeURIComponent(hrEmail);

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");

    setStatus("Opening Gmail... 📧");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] text-white">
      <div className="w-full max-w-3xl bg-gray-800 p-10 rounded-3xl shadow-xl">

        <h1 className="text-3xl mb-6 text-center text-blue-400">
          HR Email Generator
        </h1>

        {/* HR Email */}
        <input
          type="email"
          placeholder="Enter HR Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={hrEmail}
          onChange={(e) => setHrEmail(e.target.value)}
        />

        {/* Candidate Name */}
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        {/* Query */}
        <textarea
          placeholder="Write your query"
          className="w-full p-3 mb-6 rounded bg-gray-700 text-white"
          rows="4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {!previewMode ? (
          <button
            onClick={generateEmail}
            disabled={loading}
            className="bg-blue-600 px-6 py-3 rounded w-full hover:bg-blue-700 transition"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>
        ) : (
          <button
            onClick={sendEmail}
            className="bg-green-600 px-6 py-3 rounded w-full hover:bg-green-700 transition"
          >
            Send via Gmail
          </button>
        )}

        {status && (
          <div className="mt-4 text-center font-semibold text-green-400">
            {status}
          </div>
        )}

        {previewMode && (
          <div className="mt-6 bg-gray-900 p-4 rounded text-gray-300">
            <h2 className="text-lg text-blue-400 mb-3">
              Edit Email Before Sending
            </h2>

            <input
              type="text"
              className="w-full p-3 mb-4 rounded bg-gray-700"
              value={generatedSubject}
              onChange={(e) => setGeneratedSubject(e.target.value)}
            />

            <textarea
              rows="10"
              className="w-full p-3 rounded bg-gray-700"
              value={generatedBody}
              onChange={(e) => setGeneratedBody(e.target.value)}
            />
          </div>
        )}

      </div>
    </div>
  );
}