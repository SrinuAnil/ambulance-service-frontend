import { useState } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { backend_api } from "../../constant";

const SignupContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #28a745;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  text-align: left;
`;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    gender: "Male",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("customer_jwt_token", jwtToken, { expires: 30 });
    <Redirect to="/dashboard"/>
  };

  const onSubmitFailure = (errorMsg) => {
    setErrors({ general: errorMsg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userDetails = formData;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      };

      try {
        const response = await fetch(backend_api+"/register", options);
        const data = await response.json();
        if (response.status === 201) {
          alert("Signup Successful!");
          onSubmitSuccess(data.jwtToken);
        } else {
          onSubmitFailure(data.message || "Registration failed!");
        }
      } catch (error) {
        setErrors({ general: "Network error, please try again." });
      }
    }
  };

  return (
    <SignupContainer>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <Error>{errors.name}</Error>}

        <Input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {errors.phone && <Error>{errors.phone}</Error>}

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <Error>{errors.email}</Error>}

        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && <Error>{errors.password}</Error>}

        <Select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Select>

        {errors.general && <Error>{errors.general}</Error>}

        <Button type="submit">Signup</Button>
      </form>
    </SignupContainer>
  );
};

export default SignupPage;
