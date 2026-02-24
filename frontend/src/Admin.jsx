import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    id: null,
    campaign: "",
    text: "",
    optiona: "",
    optionb: "",
    optionc: "",
    correctoption: "A",
    explanation: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // load all questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("LOAD QUESTIONS ERROR:", err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (form.id) {
        // update
        await axios.put(
          `http://localhost:5000/api/questions/${form.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // create
        await axios.post("http://localhost:5000/api/questions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        id: null,
        campaign: "",
        text: "",
        optiona: "",
        optionb: "",
        optionc: "",
        correctoption: "A",
        explanation: "",
      });
      fetchQuestions();
    } catch (err) {
      console.error("SAVE QUESTION ERROR:", err);
      setError("DB error");
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setError("Error deleting question");
    }
  }

  function handleEdit(q) {
    setForm(q);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h1>

      {/* Create abd  Edit  */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {form.id ? "✏️ Edit Question" : "➕ Create New Question"}
        </h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="campaign"
            placeholder="Campaign"
            value={form.campaign}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="text"
            placeholder="Question text"
            value={form.text}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              name="optiona"
              placeholder="Option A"
              value={form.optiona}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="optionb"
              placeholder="Option B"
              value={form.optionb}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="optionc"
              placeholder="Option C"
              value={form.optionc}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="correctoption"
              value={form.correctoption}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="A">Correct = A</option>
              <option value="B">Correct = B</option>
              <option value="C">Correct = C</option>
            </select>
            <input
              name="explanation"
              placeholder="Explanation"
              value={form.explanation}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {form.id ? "💾 Update" : "✅ Create"}
          </button>
        </form>
      </div>

      {/* Existing questions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📋 Existing Questions</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Question</th>
              <th className="p-2 text-left">Correct</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="p-2">{q.id}</td>
                <td className="p-2">{q.text}</td>
                <td className="p-2">{q.correctoption}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(q)}
                    className="px-3 py-1 bg-yellow-400 rounded text-white"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="px-3 py-1 bg-red-500 rounded text-white"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
