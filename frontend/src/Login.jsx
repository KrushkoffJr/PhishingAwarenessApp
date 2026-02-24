import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      onLogin?.(user);
      window.location.href = "/";
    } catch (error) {
      setErr(error.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔑 Login to Phishing App
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#78B428] text-white font-medium hover:bg-green-700 transition"
          >
            🚀 Login
          </button>
        </form>
        {err && <p className="text-red-600 mt-4 text-center">{err}</p>}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Noch kein Konto?{" "}
          <a href="/register" className="text-green-700 hover:underline">
            Jetzt registrieren
          </a>
        </p>
      </div>
    </div>
  );
}
