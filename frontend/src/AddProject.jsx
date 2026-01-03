import axios from "axios";
import { useState } from "react";

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const submit = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    await axios.post(`${API_URL}/projects`, {
      title,
      description,
      budget,
    });
    alert("Project added!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add Project</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Project Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Project Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Budget"
        type="number"
        onChange={(e) => setBudget(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={submit}
      >
        Add Project
      </button>
    </div>
  );
}
