import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import "./styles.css";
import { backend_api } from "../../constant";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const history = useHistory();

  // Redirect to /statusOnline if already logged in
  useEffect(() => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      history.push("/statusOnline");
    }
  }, [history]);

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
      path: "/",
    });
    history.push("/statusOnline");
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
    const methods = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(backend_api+"/login/", methods);
      const data = await response.json();
      if (response.status === 200) {
        onSubmitSuccess(data.jwtToken);
      } else if (response.status === 400) {
        onSubmitFailure(data.error);
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
          <label className="label">Username: </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="input"
            type="text"
            placeholder="Enter Username"
          />
        </div>
        <div className="inputContainer">
          <label className="label">Password: </label>
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
