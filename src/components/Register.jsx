
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerLoading, registerError, registerSuccess } = useSelector(
    (state) => state.auth
  );


  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      await dispatch(
        registerUser({ name, email, password })
      ).unwrap(); // The promise resolves to a rejected Redux action; it doesn't automatically throw. Without .unwrap(), you can inspect the returned action's type and payload. With .unwrap(), a rejected thunk causes a promise rejection that you can handle with catch.
  
      console.log("Registration successful!");
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };

  const loginHandler = ()=>{
    navigate("/login", { replace: true });
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={registerLoading}>
          {registerLoading ? "Registering..." : "Register"}
        </button>

        {registerError && (
          <p role="alert">{registerError}</p>
        )}
        {registerSuccess && (
            <>
             <p role="status">
    Registration successful! You can now log in. 
  </p> 
 
  <button onClick={loginHandler}>
  Login
</button>
            </>
 
)}
      </form>
    </div>
  );
}

export default Register;
