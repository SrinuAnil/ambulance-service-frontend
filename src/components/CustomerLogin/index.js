import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";
import { backend_api } from "../../constant";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background:rgb(140, 143, 146);
    cursor: not-allowed;
  }
`;

const SwitchButton = styled.p`
  color: #007bff;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const CustomerLoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    gender: "Male",
    date: new Date().toISOString()
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const jwtToken = Cookies.get("customerjwtToken");
    if (jwtToken) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true)

    try {
      const url = isLogin ? `${backend_api}/customerLogin` : `${backend_api}/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false)
        setError(data.error || "An error occurred. Please try again.");
        return;
      }

      localStorage.setItem("customer", JSON.stringify(data.user));
      Cookies.set("customerjwtToken", data.jwtToken, { expires: 1 });
      navigate("/home");
    } catch (error) {
      setIsLoading(false)
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <h2>{isLogin ? "Customer Login" : "Customer Signup"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <Input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          )}
          <Button disabled={isLoading} type="submit">{isLogin ? `${isLoading ? "Processing..." : "Login"}` : `${isLoading ? "Processing" : "Signup"}`}</Button>
        </form>
        <SwitchButton onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </SwitchButton>
      </FormWrapper>
    </Container>
  );
};

export default CustomerLoginForm;
