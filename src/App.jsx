
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentUser, logout, authCheckComplete } from "../src/features/authSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateTask from "./components/CreateTask";
import TaskList from "./components/TaskList";
import ProtectedRoute from "./components/ProtectedRoute";


function Dashboard() {
  const [newTask, setNewTask] = useState(null);
  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };


  return (
    <div>
      <h2>Dashboard</h2>
      {isAuthenticated ? (
  <div>
    {user ? (
      <div>
        <p>Welcome, {user.name}!</p>
        <p>Email: {user.email}</p>
      </div>
    ) : (
      <p>Loading user details...</p>
    )}
  </div>
) : (
  <p>Please log in to continue.</p>
)}

      <CreateTask onTaskCreated={setNewTask}/>
      <hr />
      <TaskList newTask={newTask}/>
      <button type="button" onClick={handleLogout}>
            Logout
          </button>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  const { isAuthenticated, authChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(authCheckComplete());
    }
  }, [dispatch]);

  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div>
      <h1>MERN Task Manager</h1>

     
<Routes>
  <Route
    path="/"
    element={
      <Navigate
        to={isAuthenticated ? "/dashboard" : "/login"}
        replace
      />
    }
  />

  {/* Public routes */}
  <Route
    path="/login"
    element={
      isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
    }
  />

  <Route
    path="/register"
    element={
      isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
    }
  />

  {/* Protected route */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Routes>

    </div>
  );
}

export default App;
