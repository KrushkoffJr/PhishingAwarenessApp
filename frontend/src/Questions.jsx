import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false); // NEW

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error loading questions", err));
  }, []);

  async function submitAnswer(questionId, chosen) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/answers",
        { questionId, chosen },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const { correct, explanation } = res.data;
      setMessage(
        correct ? "✅ Richtig! " + explanation : "❌ Falsch - " + explanation
      );
      setAnswered(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error submitting answer");
    }
  }

  function nextQuestion() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setMessage("");
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  if (questions.length === 0) {
    return <p className="p-6">Loading questions...</p>;
  }

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Geschafft!</h2>
        <p className="mb-6">Du hast alle Fragen beantwortet.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Zurück zum Übersicht
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Frage {index + 1} / {questions.length}
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="mb-4 font-medium">{q.text}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => submitAnswer(q.id, "A")}
            disabled={answered}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            A: {q.optiona || q.optionA}
          </button>
          <button
            onClick={() => submitAnswer(q.id, "B")}
            disabled={answered}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            B: {q.optionb || q.optionB}
          </button>
          <button
            onClick={() => submitAnswer(q.id, "C")}
            disabled={answered}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            C: {q.optionc || q.optionC}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 border rounded bg-gray-50">{message}</div>
        )}

        {answered && (
          <div className="flex justify-end mt-6">
            <button
              onClick={nextQuestion}
              className="px-5 py-2 bg-[#78B428] text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              Nächste Frage →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
