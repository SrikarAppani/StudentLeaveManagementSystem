import React, { useState, useEffect } from "react";
import '../styles/LeaveForm.css';
import { getUserFromToken } from "../utils/getUserFromToken";
import { useNavigate } from "react-router-dom";

const HalfDayLeaveForm = () => {
  const token = sessionStorage.getItem("token");
  const [rollNumber, setRollNumber] = useState("");
  const [formData, setFormData] = useState({
    date: new Date(),
    reason: "",
    explanation: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setRollNumber(user.rollNumber);
    }
  }, []);
  
  const reasons = [
    "Medical Appointment",
    "Family Emergency",
    "Personal Work",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaveData = {
      rollNumber,
      ...formData,
      date: formData.date.toISOString()
    };

    try {
      console.log(leaveData)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/student/half-day-leave`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData)
      });

      if (!response.ok) {
        alert("Failed to submit leave form");
      } else {
        alert("Form submitted successfully!");
        console.log("Form successfully submitted:", await response.json());
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Something went wrong while submitting leave.");
    }
  };

  return (
    <div className="leave-form-container">
      <div className="leave-form-box">
        <h2 className="leave-form-title">HALF DAY LEAVE</h2>
        <form onSubmit={handleSubmit}>
          <div className="leave-form-group">
            <label>REASON</label>
            <select name="reason" value={formData.reason} onChange={handleChange} required>
              <option value="">Select a reason</option>
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
          <div className="leave-form-group">
            <label>EXPLANATION</label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="leave-submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default HalfDayLeaveForm;
