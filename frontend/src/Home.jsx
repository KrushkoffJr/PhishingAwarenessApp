// frontend/src/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Map badge names → image paths
const BADGE_ICONS = {
  "Baby Shark": "/baby-shark.png.png",
  "Spam Samurai": "/spam-samurai.png.png",
  "Phish Fingers": "/phish-fingers.png.png",
  Unphishable: "/unphishable.png.png",
};

export default function Home({ user }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leaderboard")
      .then((res) => setLeaderboard(res.data.slice(0, 3))) // only show top 3
      .catch(() => setLeaderboard([]));

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/badges", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBadges(res.data.slice(0, 3))) // only preview 3 badges
        .catch(() => setBadges([]));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-100">
        <h2 className="text-2xl font-semibold mb-2">
          {user ? `Welcome back, ${user.username}!` : "Welcome"}
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Train your eye to spot phishing attempts. Earn badges, climb the
          leaderboard, and become{" "}
          <span className="font-medium">Unphishable</span>.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="/questions"
            className="inline-block px-5 py-2 rounded-lg bg-[#78B428] text-white hover:bg-green-700"
          >
            Start Training
          </a>
        </div>
      </div>

      {/* Quick stats PREVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Score card */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Your Score</p>
          <p className="text-3xl font-bold text-green-600">
            {user?.score ?? 0}
          </p>
        </div>

        {/* Leaderboard preview */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Leaderboard (Top 3)</p>
          <ul className="space-y-1">
            {leaderboard.map((u, idx) => (
              <li key={u.username} className="flex justify-between">
                <span>
                  {idx + 1}. {u.username}
                </span>
                <span className="font-bold">{u.score}</span>
              </li>
            ))}
          </ul>
          <a
            href="/leaderboard"
            className="text-green-600 text-sm font-medium mt-2 inline-block hover:underline"
          >
            View full leaderboard →
          </a>
        </div>
      </div>

      {/* Badges preview */}
      <div className="bg-white rounded-xl border p-6 shadow-sm mt-8">
        <p className="text-gray-500 text-sm mb-3">Your Badges</p>
        {user ? (
          badges.length > 0 ? (
            <div className="flex gap-6">
              {badges.map((b) => (
                <div
                  key={b}
                  className="w-28 h-32 bg-gray-50 rounded-lg border flex flex-col items-center justify-center shadow-sm"
                >
                  <img
                    src={BADGE_ICONS[b] || "/ancudit-logo.png"}
                    alt={b}
                    className="h-20 object-contain"
                  />
                  <p className="mt-2 text-xs text-gray-700">{b}</p>
                </div>
              ))}
              <a
                href="/badges"
                className="flex items-center justify-center w-28 h-32 rounded-lg border border-dashed text-green-600 font-medium hover:bg-gray-50"
              >
                View All
              </a>
            </div>
          ) : (
            <p className="text-gray-600">No badges yet. Start training!</p>
          )
        ) : (
          <p className="text-gray-600">
            <a className="underline text-green-700" href="/login">
              Log in
            </a>{" "}
            to start collecting badges.
          </p>
        )}
      </div>
    </div>
  );
}
