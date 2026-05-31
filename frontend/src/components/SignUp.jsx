import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  p-8 rounded-16px;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  background: rgba(71, 85, 105, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #f1f5f9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    border-color: rgba(6, 182, 212, 0.5);
    background: rgba(71, 85, 105, 0.3);
  }
  
  option {
    background: #0f172a;
    color: #f1f5f9;
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

const GeneratedUsername = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #86efac;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [error, setError] = useState("");

  const generateDoctorUsername = (fullName) => {
    const baseUsername = `dr.${fullName.toLowerCase().replace(/\s+/g, '_')}`;
    setGeneratedUsername(baseUsername);
  };

  const validateInputs = () => {
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (role === "doctor" && !generatedUsername) {
      setError("Doctor username must be generated");
      return false;
    }
    return true;
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (role === "doctor" && newName.trim()) {
      generateDoctorUsername(newName);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole === "doctor" && name.trim()) {
      generateDoctorUsername(name);
    } else {
      setGeneratedUsername("");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    setError("");
    
    if (validateInputs()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name, 
          email,
          password,
          role,
          doctorUsername: role === "doctor" ? generatedUsername : undefined
        });
        
        alert("Account Created Successfully");
        
        dispatch(loginSuccess(res.data));
        sessionStorage.setItem("vidhyalaya-app-token", res.data.token);
        window.localStorage.setItem("vidhyalaya-app-token", res.data.token);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        
        navigate("/"); 

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to sign up";
        setError(errorMsg);
        console.error("SignUp Error:", err);
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
      <Title>Create Account</Title>
      <Subtitle>Join Chiranjivi today</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGroup>
        <Label>Full Name</Label>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={handleNameChange}
        />
      </FormGroup>

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
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Register As</Label>
        <Select value={role} onChange={handleRoleChange}>
          <option value="user">Patient</option>
          <option value="doctor">Doctor</option>
        </Select>
      </FormGroup>

      {role === "doctor" && generatedUsername && (
        <FormGroup>
          <Label>Your Doctor ID</Label>
          <GeneratedUsername>
            <span>?</span>
            {generatedUsername}
          </GeneratedUsername>
          <Subtitle style={{ marginTop: "8px", fontSize: "12px" }}>
            Patients will find you using this ID
          </Subtitle>
        </FormGroup>
      )}
      
      <Button onClick={handleSignUp} disabled={buttonDisabled}>
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </FormContainer>
  );
};

export default SignUp;
