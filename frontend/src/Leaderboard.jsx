import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch((err) => console.error("Leaderboard error", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🏆 Leaderboard
        </h1>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, idx) => (
                <tr
                  key={u.username}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-green-50`}
                >
                  <td className="p-4 font-bold text-gray-700">
                    {idx === 0 && "🥇"}
                    {idx === 1 && "🥈"}
                    {idx === 2 && "🥉"}
                    {idx > 2 && idx + 1}
                  </td>
                  <td className="p-4 text-gray-800">{u.username}</td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {u.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight current top 3 */}
        {leaderboard.length >= 3 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-amber-300 p-6 rounded-xl shadow">
              <p className="text-2xl">🥇</p>
              <p className="font-bold">{leaderboard[0].username}</p>
              <p className="text-green-700">{leaderboard[0].score} pts</p>
            </div>
            <div className="bg-gray-200 p-6 rounded-xl shadow">
              <p className="text-2xl">🥈</p>
              <p className="font-bold">{leaderboard[1].username}</p>
              <p className="text-green-700">{leaderboard[1].score} pts</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-xl shadow">
              <p className="text-2xl">🥉</p>
              <p className="font-bold">{leaderboard[2].username}</p>
              <p className="text-green-700">{leaderboard[2].score} pts</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
