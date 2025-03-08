import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/LoginPage.css'

const StudentLoginPage = ({ updateRollNumber }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        updateRollNumber(rollNumber);
        navigate("/home");
      } else {
        alert("Invalid roll number or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-box">
        <h2 className="student-login-title">Student Login</h2>
        <form onSubmit={handleLogin} className="student-login-form">
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="student-login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="student-login-input"
            required
          />
          <button type="submit" className="student-login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StudentLoginPage;
