import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState()
  
  useEffect(() => {
    const jwtToken = Cookies.get("customerjwtToken");
    if (jwtToken) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backend_api}/customerLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        toast.error(data.error || "Invalid credentials, please try again.");
        return;
      }else{
        toast.success("Login Successfully")
        localStorage.setItem("customer", JSON.stringify(data.user));
        Cookies.set("customerjwtToken", data.jwtToken, { expires: 1 });
        navigate("/home");
      }

      
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const completeSignup = async () => {
    try {
        const response = await fetch(`${backend_api}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Signup successful! You can now login.");
            setIsLogin(true);
        } else {
            toast.error(data.error || "Signup failed.");
        }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
    }
};


  const handleVerifyOtp = async () => {
    setIsLoading(true);

    try {
        const response = await fetch(`${backend_api}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: formData.phoneNumber, otp }),
        });

        const data = await response.json();
        if (response.ok) {
            toast.success("OTP verified! Signing up...");
            await completeSignup(); // Proceed with signup
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    } catch (error) {
        toast.error("Something went wrong.");
    }
    setIsLoading(false);
};


  // Separate method for signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await fetch(`${backend_api}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
        });

        const data = await response.json();
        if (response.ok) {
            toast.success("OTP sent to your phone number");
            setShowOtpInput(true); // Show OTP input field
        } else {
            toast.error(data.error || "Failed to send OTP");
        }
    } catch (error) {
        setIsLoading(false);
        toast.error("Something went wrong. Please try again.");
    }
};


  return (
    <>
    <Container>
      <FormWrapper>
        <h2>{isLogin ? "Customer Login" : "Customer Signup"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
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
          {showOtpInput && (
  <>
    <Input
      type="text"
      name="otp"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      required
    />
    <Button onClick={handleVerifyOtp}>
      {isLoading ? "Verifying..." : "Verify OTP"}
    </Button>
  </>
)}
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
    <ToastContainer />
    </>
  );
};

export default CustomerLoginForm;
