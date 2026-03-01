import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_email", res.data.email);
      localStorage.setItem("user_name", res.data.name);

      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/google-login",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_email", res.data.email);
      localStorage.setItem("user_name", res.data.name);

      navigate("/dashboard");

    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-white/5 p-10 rounded-3xl w-96 space-y-6 shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          JobTrust AI Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-black border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-black border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Login
        </button>

        <div className="text-center text-gray-400">OR</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Google Login Failed")}
        />

        {/* ✅ SIGN UP LINK */}
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}