import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateInputs = () => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      setSuccess('Registration successful!'); // Indicate success
      onRegister(); // Callback to inform parent of successful registration
    } catch (err) {
      if(err.status === 400){
        setError('User already taken');
      }else{
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='start-page'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className='error'>{error}</p>}
      {success && <p className='success'>{success}</p>}
      <p>Already have an account <a href="/login">login</a></p>
    </div>
  );
};

export default Register;
