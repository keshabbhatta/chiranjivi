import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const SignUp = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    
    if (validateInputs()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name, 
          email,
          password
        });
        
        alert("Account Created Successfully");
        localStorage.setItem("user", JSON.stringify(res.data)); 
        navigate("/"); 

      } catch (err) {
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Account 👋</h2>
        <p className="text-gray-500 mt-2 text-sm">Please enter your details below</p>
      </div>
      
      <div className="space-y-5">
        <div>
          <input
            type="text"
            // Explicitly setting bg-white, text-gray-900, and border-gray-300
            className="w-full p-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            className="w-full p-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            className="w-full p-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleSignUp}
          disabled={buttonDisabled}
          className={`w-full p-3 mt-2 font-semibold text-white bg-blue-600 rounded-lg focus:outline-none transition-colors duration-200 ${
            buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignUp;