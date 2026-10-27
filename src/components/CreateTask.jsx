import { useState } from "react";
import api from "../api/api";
import AiAssistant from "./AiAssistant";

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/tasks", {
        title,
      });
      console.log("Task API response:", response.data);
      console.log("onTaskCreated:", onTaskCreated);
      setTitle("");
      setMessage("Task created successfully");

      // Tell parent component about the new task
      if (onTaskCreated) {
        onTaskCreated(response.data);
      }
      
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>

    <div>
  <AiAssistant/>
</div>

        <div>

<h2>Create Task</h2>

<form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Enter task title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <button type="submit" disabled={loading}>
    {loading ? "Creating..." : "Create Task"}
  </button>
</form>

{message && <p>{message}</p>}
</div>
    </div>


    </>

  );
}

export default CreateTask;