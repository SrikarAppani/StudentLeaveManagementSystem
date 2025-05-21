import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/getUserFromToken";
import '../styles/LeaveForm.css';

const FullDayLeaveForm = () => {
  const token = sessionStorage.getItem("token");
  const [rollNumber, setRollNumber] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numberOfDays: "",
    fromDate: "",
    toDate: "",
    reason: "",
    explanation: "",
  });

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setRollNumber(user.rollNumber);
    }
  }, []);

  const reasons = [
    "Medical Reason",
    "Family Emergency",
    "Vacation",
    "Personal Work",
    "Other",
  ];

  // Automatically calculate 'toDate' whenever 'fromDate' or 'numberOfDays' changes
  useEffect(() => {
    if (formData.fromDate && formData.numberOfDays) {
      const fromDate = new Date(formData.fromDate);
      const days = parseInt(formData.numberOfDays, 10);
      const toDate = new Date(fromDate);
      toDate.setDate(fromDate.getDate() + days - 1);
      const toDateString = toDate.toISOString().split("T")[0];
      setFormData((prevData) => ({ ...prevData, toDate: toDateString }));
    }
  }, [formData.fromDate, formData.numberOfDays]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaveData = {
      rollNumber,
      ...formData
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/student/full-day-leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData),
      });
      
      if (!response.ok) {
        alert("Failed to submit leave form");
      } else {
        alert("Form submitted successfully!");
        console.log("Form successfully submitted:", await response.json());
        navigate("/student/dashboard");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="leave-form-container">
      <div className="leave-form-box">
        <h2 className="leave-form-title">FULL DAY LEAVE</h2>
        <form onSubmit={handleSubmit}>
          <div className="leave-form-group">
            <label>NUMBER OF DAYS</label>
            <input
              type="number"
              name="numberOfDays"
              value={formData.numberOfDays}
              min='1'
              onChange={handleChange}
              required
            />
          </div>
          <div className="leave-form-group">
            <label>FROM</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="leave-form-group">
            <label>TO</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              readOnly
              disabled
            />
          </div>
          <div className="leave-form-group">
            <label>REASON</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Select a reason</option>
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
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
            ></textarea>
          </div>
          <button type="submit" className="leave-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullDayLeaveForm;
