

 import { useEffect, useState } from "react";
import api from "../api/api";

function TaskList({ newTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (!newTask) return;
  
    setTasks((prevTasks) => {
      const alreadyExists = prevTasks.some(
        (task) => task._id === newTask._id
      );
  
      if (alreadyExists) return prevTasks;
  
      return [...prevTasks, newTask];
    });
  }, [newTask]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  const toggleTask = async (task) => {
    try {
      const response = await api.patch(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
  
      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === task._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
  
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };


  return (
    <div>

 
      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
  <li key={task._id}>
    {task.title} -{" "}
    {task.completed ? "Completed" : "Pending"}

    <button onClick={() => toggleTask(task)}>
      {task.completed ? "Mark Pending" : "Mark Complete"}
    </button>
    <button onClick={() => deleteTask(task._id)}>
  Delete
</button>
  </li>
))}
        </ul>
      )}
    </div>
  );
}
export default TaskList;