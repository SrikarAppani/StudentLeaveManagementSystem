import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentSignupPage.css";

const StudentSignupPage = () => {

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    emailID: "",
    password: "",
    department: "",
    year: "",
    section: "",
    isEnrolledInPlacementTraining: false,
  });

  const [message, setMessage] = useState("");

  const departments = ["CSE", "CSM", "CSD", "IT"];
  const years = [1, 2, 3, 4];
  const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "radio" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/student/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/student/dashboard");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Error signing up");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="student-signup-container">
      <div className="student-signup-box">
        <h2 className="student-signup-title">Student Signup</h2>
        <form onSubmit={handleSubmit} className="student-signup-form">
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            className="student-signup-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="student-signup-input"
          />
          <input
            type="email"
            name="emailID"
            placeholder="Email"
            value={formData.emailID}
            onChange={handleChange}
            required
            className="student-signup-input"
          />

          <div className="phone-input-wrapper">
            <span className="phone-prefix">+91</span>
            <input
              type="tel"
              className="student-signup-input"
              placeholder="Enter phone number"
              maxlength="10"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="student-signup-input"
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="student-signup-input"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="student-signup-input"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            className="student-signup-input"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          <div className="radio-group">
            <label>Enrolled in Placement Training?</label>
            <label>
              <input
                type="radio"
                name="isEnrolledInPlacementTraining"
                value={true}
                checked={formData.isEnrolledInPlacementTraining === true}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="isEnrolledInPlacementTraining"
                value={false}
                checked={formData.isEnrolledInPlacementTraining === false}
                onChange={handleChange}
              />
              No
            </label>
          </div>
          <button type="submit" className="student-signup-button">
            Sign Up
          </button>
        </form>
        {message && <p className="student-signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default StudentSignupPage;
