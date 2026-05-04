import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- Imported useNavigate
import { loginSuccess } from "../redux/reducers/userSlice";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Initialized navigate
  
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        
        // Save to Redux store
        dispatch(loginSuccess(res.data));
        
        // Optional: Save token/user to localStorage if you want them to stay logged in after a refresh
        localStorage.setItem("token", res.data.token);
        
        // Redirect to homepage/dashboard
        navigate("/"); 
        
      } catch (err) {
        console.log(err.response?.data); 
        alert(err.response?.data?.message || err.message);
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mt-24">Welcome to CHIRANJIVI 🩵</h2>
        <p className="text-gray-600">Please login with your details here</p>
      </div>
      <div className="space-y-4">
        <input
          type="email"
          // Added bg-white to ensure it matches the sign up page exactly
          className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignIn}
          disabled={buttonDisabled}
          className={`w-full p-3 mt-4 font-semibold text-white bg-blue-600 rounded-md focus:outline-none transition-colors duration-200 ${
            buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;