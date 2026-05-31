import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/reducers/userSlice";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #cbd5e1;
  text-align: center;
  font-size: 14px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: rgba(71, 85, 105, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #f1f5f9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(6, 182, 212, 0.5);
    background: rgba(71, 85, 105, 0.3);
    box-shadow: 0 0 8px rgba(6, 182, 212, 0.2);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    setError("");
    
    if (validateInputs()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        
        dispatch(loginSuccess(res.data));
        sessionStorage.setItem("vidhyalaya-app-token", res.data.token);
        window.localStorage.setItem("vidhyalaya-app-token", res.data.token);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        
        navigate("/"); 
        
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to sign in";
        setError(errorMsg);
        console.error("SignIn Error:", err);
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      setLoading(false);
      setButtonDisabled(false);
    }
  };
  
  return (
    <FormContainer>
      <Title>Welcome Back</Title>
      <Subtitle>Sign in to your Chiranjivi account</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormGroup>
        <Label>Email Address</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => { if (e.key === "Enter") handleSignIn(); }}
        />
      </FormGroup>
      
      <Button onClick={handleSignIn} disabled={buttonDisabled}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </FormContainer>
  );
};

export default SignIn;
