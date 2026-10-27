import { useState } from "react";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, loginUser, logout } from "../features/authSlice";
import TaskList from "./TaskList";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );

console.log("user",user)


const handleLogin = async (e) => {
  e.preventDefault();

  try {
    await dispatch(loginUser({ email, password })).unwrap();
    await dispatch(fetchCurrentUser()).unwrap();
  } catch (error) {
    console.error("Login or profile fetch failed:", error);
  }
};
  const getProfile = async () => {
    try {
      const response = await api.get("/auth/me");
  
      console.log("Logged-in user:", response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
  
      console.log("My tasks:", response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setPassword("");
    navigate("/login", { replace: true });
  };

  const registerUser =()=>{
    navigate("/register", { replace: true });
  }


  return (
    <div>
        <div>
      <h2>Login</h2>
      

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {error && <p role="alert">{error}</p>}

          <button onClick={registerUser}>
  Register
</button>
        </form>
  
    </div>

      {/* <button onClick={getProfile}>
  Get My Profile
</button>

<button onClick={getTasks}>
  Get My Tasks
</button> */}



    </div>
  );
}

export default Login;