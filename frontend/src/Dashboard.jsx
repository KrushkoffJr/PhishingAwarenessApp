// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard({ user }) {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [badges, setBadges] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/leaderboard")
//       .then((res) => setLeaderboard(res.data))
//       .catch((err) => console.error("LEADERBOARD ERROR:", err));

//     if (user) {
//       axios
//         .get("http://localhost:5000/api/badges", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         })
//         .then((res) => setBadges(res.data))
//         .catch((err) => console.error("BADGES ERROR:", err));
//     }
//   }, [user]);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-4">
//         <h2 className="text-2xl font-bold text-green-600 mb-6">Phishing App</h2>
//         <nav className="space-y-4">
//           <a href="/" className="block hover:text-green-600">
//             🏠 Home
//           </a>
//           <a href="/leaderboard" className="block hover:text-green-600">
//             🏆 Leaderboard
//           </a>
//           <a href="/dashboard" className="block hover:text-green-600">
//             📊 Dashboard
//           </a>
//           <a href="/badges" className="block hover:text-green-600">
//             🎖️ Badges
//           </a>
//           {user?.role === "ADMIN" && (
//             <a href="/admin" className="block hover:text-green-600">
//               ⚙️ Admin
//             </a>
//           )}
//         </nav>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//         <div className="grid grid-cols-2 gap-6">
//           {/* Score */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="font-semibold">Your Score</h2>
//             <p className="text-4xl font-bold text-green-600">
//               {user?.score || 0}
//             </p>
//           </div>

//           {/* Leaderboard */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="font-semibold mb-2">Leaderboard</h2>
//             <ul>
//               {leaderboard.map((u, i) => (
//                 <li key={u.username}>
//                   {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅"}{" "}
//                   {u.username} — {u.score}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Badges */}
//           <div className="bg-white rounded-lg shadow p-6 col-span-2">
//             <h2 className="font-semibold mb-2">Your Badges</h2>
//             <div className="flex gap-3 flex-wrap">
//               {badges.length === 0 ? (
//                 <p className="text-gray-500">No badges yet. Keep playing! 🎯</p>
//               ) : (
//                 badges.map((b, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-2 bg-green-100 rounded-lg shadow-sm"
//                   >
//                     {b}
//                   </span>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// frontend/src/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard({ user }) {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [badges, setBadges] = useState([]);

//   const badgeImages = {
//     "Baby Shark": "/baby-shark.png.png",
//     "Spam Samurai": "/spam-samurai.png.png",
//     "Phish Fingers": "/phish-fingers.png.png",
//     Unphishable: "/unphishable.png.png",
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/leaderboard")
//       .then((res) => setLeaderboard(res.data))
//       .catch((err) => console.error("Leaderboard error", err));

//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get("http://localhost:5000/api/badges", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => setBadges(res.data))
//         .catch((err) => console.error("Badges error", err));
//     }
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-green-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Score */}
//         <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
//           <h2 className="font-semibold text-lg">Your Score</h2>
//           <p className="text-5xl font-extrabold text-green-600 mt-4">
//             {user?.score ?? 0}
//           </p>
//         </div>

//         {/* Leaderboard */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="font-semibold text-lg mb-4">Leaderboard</h2>
//           <ul className="space-y-2">
//             {leaderboard.map((u, idx) => (
//               <li key={u.username} className="flex justify-between">
//                 <span>
//                   {idx + 1}. {u.username}
//                 </span>
//                 <span className="font-bold">{u.score}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Badges */}
//       <div className="bg-white shadow rounded-xl p-6 mt-10">
//         <h2 className="text-lg font-semibold mb-4">Your Badges</h2>
//         {badges.length > 0 ? (
//           <div className="flex gap-6 flex-wrap">
//             {badges.map((badge) => (
//               <div
//                 key={badge}
//                 className="flex items-center justify-center bg-gray-50 rounded-lg shadow p-4 w-40 h-40"
//               >
//                 <img
//                   src={badgeImages[badge]}
//                   alt={badge}
//                   className="w-28 h-28 object-contain"
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No badges yet. Keep playing! 🎯</p>
//         )}
//       </div>
//     </div>
//   );
// }
