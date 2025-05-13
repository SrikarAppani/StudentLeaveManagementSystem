import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyLoginPage.css";

const FacultyLoginPage = () => {

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  const [formData, setFormData] = useState({ facultyID: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/faculty/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/faculty/dashboard");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Error logging in");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="faculty-login-container">
      <div className="faculty-login-box">
        <h2 className="faculty-login-title">Faculty Login</h2>
        <form onSubmit={handleSubmit} className="faculty-login-form">
          <input
            type="text"
            name="facultyID"
            placeholder="Teacher ID"
            value={formData.facultyID}
            onChange={handleChange}
            required
            className="faculty-login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="faculty-login-input"
          />
          <button type="submit" className="faculty-login-button">
            Login
          </button>
        </form>
        {message && <p className="faculty-login-message">{message}</p>}
      </div>
    </div>
  );
};

export default FacultyLoginPage;
