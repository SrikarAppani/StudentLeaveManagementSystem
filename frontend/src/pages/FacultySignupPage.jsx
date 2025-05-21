import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FacultySignupPage.css';

const FacultySignupPage = () => {

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyID: '',
    name: '',
    emailID: '',
    password: '',
    department: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/sign-up`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/faculty/dashboard");
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error signing up');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="faculty-signup-container">
      <div className="faculty-signup-box">
        <h2 className="faculty-signup-title">Teacher Signup</h2>
        <form onSubmit={handleSubmit} className="faculty-signup-form">
          <input
            type="text"
            name="facultyID"
            placeholder="Teacher ID"
            value={formData.facultyID}
            onChange={handleChange}
            required
            className="faculty-signup-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="faculty-signup-input"
          />
          <input
            type="email"
            name="emailID"
            placeholder="Email"
            value={formData.emailID}
            onChange={handleChange}
            required
            className="faculty-signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="faculty-signup-input"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="faculty-signup-input"
          />
          <button type="submit" className="faculty-signup-button">Sign Up</button>
        </form>
        {message && <p className="faculty-signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default FacultySignupPage;