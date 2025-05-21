import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/StudentLoginPage.css'

const StudentLoginPage = () => {

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/student/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ rollNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/student/dashboard");
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
        <p>Don't have an account?{" "}<button onClick={()=>navigate("/student/sign-up")} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>Sign-Up</button></p>
      </div>
    </div>
  );
};

export default StudentLoginPage;
