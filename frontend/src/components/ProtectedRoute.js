import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/reducers/userSlice'; // adjust according to your setup
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/user/login', { email, password });
      dispatch(loginSuccess(res.data)); // assuming this stores user info in Redux
      alert('Login Successful');
      navigate('/'); // Redirect to home after login
    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="login-container">
      {/* Login form code */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Authentication;
