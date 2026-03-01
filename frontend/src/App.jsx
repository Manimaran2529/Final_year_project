import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/Mainlayout";

import Dashboard from "./pages/Dashboard";
import AnalyzeJob from "./pages/AnalyzeJob";
import InterviewPrep from "./pages/InterviewPrep";
import Aptitude from "./pages/Aptitude";
import Coding from "./pages/Coding";
import HRRound from "./pages/HRRound";
import Progress from "./pages/Progress";
import TechnicalRound from "./pages/TechnicalRound";
import HRReply from "./pages/HRReply";
import Register from "./pages/Register";
import GmailChecker from "./pages/GmailChecker";
import UrlChecker from "./pages/UrlChecker";
import OfferChecker from "./pages/OfferChecker";
import CertificateChecker from "./pages/CertificateChecker";

import Login from "./pages/login"; // ✅ fixed case

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Root Redirect */}
      <Route
        path="/"
        element={
          token
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze-job" element={<AnalyzeJob />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/hr-reply" element={<HRReply />} />
        <Route path="/register" element={<Register />} />

        <Route path="/interview-prep/aptitude" element={<Aptitude />} />
        <Route path="/interview-prep/coding" element={<Coding />} />
        <Route path="/interview-prep/hr" element={<HRRound />} />
        <Route path="/interview-prep/progress" element={<Progress />} />
        <Route path="/interview-prep/technical" element={<TechnicalRound />} />

        <Route path="/gmail-checker" element={<GmailChecker />} />
        <Route path="/url-checker" element={<UrlChecker />} />
        <Route path="/offer-checker" element={<OfferChecker />} />
        <Route path="/certificate-checker" element={<CertificateChecker />} />
      </Route>

    </Routes>
  );
}