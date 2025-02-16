import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { backend_api } from "../../constant";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = Cookies.get("admin_jwt_token");
        if (jwtToken) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const onSubmitSuccess = (jwtToken) => {
        setIsLoading(false)
        toast.success("Logged in successfully!");
        Cookies.set("admin_jwt_token", jwtToken, { expires: 30, path: "/" });
        navigate("/dashboard");
    };

    const onSubmitFailure = (errorMsg) => {
        setIsLoading(false)
        toast.error(errorMsg || "Invalid credentials.");
        setUsername("");
        setPassword("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("All fields are required.");
            return;
        }

        setIsLoading(true)
        const userDetails = { username, password };
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userDetails),
        };

        try {
            const url = `${backend_api}/adminLogin/`;
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                onSubmitSuccess(data.jwtToken);
            } else {
                onSubmitFailure(data.error);
            }
        } catch (error) {
            onSubmitFailure("Network error, please try again.");
        }
    };

    return (
        <>
        <div className="loginPage">
            <div className="cardContainer">
                <h2 className="loginTitle">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="inputContainer">
                        <label className="label">Username: </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                            placeholder="Enter Username"
                        />
                    </div>
                    <div className="inputContainer">
                        <label className="label">Password: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="Enter Password"
                        />
                    </div>
                    <button className="loginButton" type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Login"}
                </button>
                </form>
            </div>
        </div>
        <ToastContainer />
        </>
    );
}

export default AdminLogin;
