// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import Leaderboard from "./Leaderboard";
import Login from "./Login";
import Register from "./Register";
import Admin from "./Admin";
import Badges from "./Badges";
import Questions from "./Questions";
import Home from "./Home";
// map badge names -> images in /public
const BADGE_ICONS = {
  "Baby Shark": "/baby-shark.png.png",
  "Spam Samurai": "/spam-samurai.png.png",
  "Phish Fingers": "/phish-fingers.png.png",
  Unphishable: "/unphishable.png.png",
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [homeBadges, setHomeBadges] = useState([]);

  const path = window.location.pathname;

  // Ensure Authorization header survives refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  // Fetch leaderboard + badges for HOME
  useEffect(() => {
    if (path === "/") {
      axios
        .get("http://localhost:5000/api/leaderboard")
        .then((res) => setLeaderboard(res.data))
        .catch(() => setLeaderboard([]));

      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("http://localhost:5000/api/badges")
          .then((r) => setHomeBadges(r.data || []))
          .catch(() => setHomeBadges([]));
      }
    }
  }, [path]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/";
  }

  // -----------------------
  // Header
  // -----------------------
  function Header() {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/ancudit-logo.png"
              alt="AncudIT Logo"
              className="h-10 w-auto object-contain"
            />
            <h1 className="text-lg font-bold text-gray-800">
              Phishing Simulator
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 text-gray-700">
            <a href="/" className="hover:text-green-600">
              Home
            </a>
            <a href="/questions" className="hover:text-green-600">
              Questions
            </a>
            <a href="/leaderboard" className="hover:text-green-600">
              Leaderboard
            </a>
            <a href="/badges" className="hover:text-green-600">
              Badges
            </a>
            {user?.role === "ADMIN" && (
              <a href="/admin" className="hover:text-green-600">
                Admin
              </a>
            )}
            {user ? (
              <>
                <span className="ml-2 font-medium">
                  Hi, {user.username} ({user.score ?? 0})
                </span>
                <button
                  onClick={logout}
                  className="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-green-600">
                  Login
                </a>
                <a href="/register" className="hover:text-green-600">
                  Register
                </a>
              </>
            )}
          </nav>
        </div>
      </header>
    );
  }

  // -----------------------
  // Home (dashboard-style)
  // -----------------------
  function Home() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="rounded-2xl p-8 bg-gradient-to-r from-emerald-100 to-green-50 shadow">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {user ? `Welcome back, ${user.username}!` : "Welcome"}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Train your eye to spot phishing attempts. Earn badges, climb the
              leaderboard, and become{" "}
              <span className="font-bold text-green-700">Unphishable</span>.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="/questions"
                className="inline-block px-6 py-3 rounded-lg bg-[#78B428] text-white font-medium shadow hover:bg-green-700"
              >
                Start Training🏋️
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Score */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500 text-sm">Your Score</p>
              <p className="text-5xl font-extrabold text-green-600 mt-2">
                {user?.score ?? 0}
              </p>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500 text-sm mb-3">Leaderboard</p>
              <ul className="space-y-2">
                {leaderboard.slice(0, 5).map((u, idx) => (
                  <li key={u.username} className="flex justify-between">
                    <span>
                      {idx + 1}. {u.username}
                    </span>
                    <span className="font-bold">{u.score}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-right">
                <a
                  href="/leaderboard"
                  className="text-sm text-green-700 hover:underline"
                >
                  View full leaderboard →
                </a>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-10">
            <p className="text-gray-500 text-sm mb-3">Your Badges</p>
            {!user ? (
              <p className="text-gray-600">
                <a className="underline text-green-700" href="/login">
                  Log in
                </a>{" "}
                to start collecting badges.
              </p>
            ) : homeBadges.length === 0 ? (
              <p className="text-gray-600">
                No badges yet. Click{" "}
                <span className="font-medium">Start Training</span> to earn your
                first one.
              </p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {homeBadges.map((b) => (
                  <div
                    key={b}
                    className="w-36 h-44 bg-gray-50 rounded-xl border shadow-sm flex flex-col items-center justify-center"
                  >
                    <img
                      src={BADGE_ICONS[b] || "/ancudit-logo.png"}
                      alt={b}
                      className="h-28 w-auto object-contain"
                    />
                    <p className="mt-2 text-xs text-gray-700">{b}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------
  // Router rendering
  // -----------------------
  return (
    <div className="font-sans">
      <Header />

      {path === "/" && <Home />}
      {path === "/questions" && <Questions />}
      {path === "/leaderboard" && <Leaderboard />}
      {path === "/login" && <Login onLogin={setUser} />}
      {path === "/register" && <Register onRegistered={setUser} />}
      {path === "/admin" && user?.role === "ADMIN" && <Admin />}

      {path === "/admin" && user && user.role !== "ADMIN" && (
        <main className="max-w-4xl mx-auto p-6">
          <p className="text-red-600">❌ Forbidden: Admin only</p>
        </main>
      )}
      {path === "/admin" && !user && (
        <main className="max-w-4xl mx-auto p-6">
          <p>Please login as admin.</p>
        </main>
      )}
      {path === "/badges" && <Badges />}

      <footer className="mt-12 border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {2025} Ivaylo Krushkov. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
