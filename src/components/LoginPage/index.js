import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./styles.css";
import { backend_api } from "../../constant";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Redirect to /statusOnline if already logged in
  useEffect(() => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      navigate("/statusOnline");
    }
  }, [navigate]);

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30, path: "/" });
    navigate("/statusOnline");
  };

  const onSubmitFailure = (errorMsg) => {
    setIsError(true);
    setError(errorMsg);
    setUsername("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("All fields are required.");
      setIsError(true);
      return;
    }

    const userDetails = { username, password };

    try {
      const response = await fetch(`${backend_api}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.ok) {
        onSubmitSuccess(data.jwtToken);
      } else {
        onSubmitFailure(data.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error, please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="loginPage">
      <div className="cardContainer">
        <h2 className="loginTitle">Login</h2>
        <div className="inputContainer">
          <label className="label">Username:</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="input"
            type="text"
            placeholder="Enter Username"
          />
        </div>
        <div className="inputContainer">
          <label className="label">Password:</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="input"
            type="password"
            placeholder="Enter Password"
          />
        </div>
        {isError && <p className="errorMessage">{error}</p>}
        <button type="submit" onClick={handleLogin} className="loginButton">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
