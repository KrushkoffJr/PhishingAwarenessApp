// frontend/src/Badges.jsx
import React from "react";

export default function Badges() {
  const badges = [
    {
      name: "Baby Shark",
      img: "/baby-shark.png.png",
      rule: "🏅 Earned by getting 5 correct answers",
    },
    {
      name: "Phish Fingers",
      img: "/phish-fingers.png.png",
      rule: "⚠️ Earned if you get 10 wrong answers",
    },
    {
      name: "Spam Samurai",
      img: "/spam-samurai.png.png",
      rule: "⚔️ Earned by reporting/answering 10 correctly",
    },
    {
      name: "Unphishable",
      img: "/unphishable.png.png",
      rule: "🛡️ Earned by reaching 20 correct answers — Ultimate Master!",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Available Badges</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {badges.map((badge) => (
          <div
            key={badge.name}
            className="flex flex-col items-center bg-white shadow rounded-lg p-6"
          >
            <img
              src={badge.img}
              alt={badge.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{badge.name}</h2>
            <p className="text-sm text-gray-600 text-center">{badge.rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
