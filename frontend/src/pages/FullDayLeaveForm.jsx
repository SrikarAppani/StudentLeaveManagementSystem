import React, { useState } from "react";
import '../styles/LeaveForm.css'

const FullDayLeaveForm = () => {
  const [formData, setFormData] = useState({
    numberOfDays: "",
    fromDate: "",
    toDate: "",
    reason: "",
    explanation: "",
  });

  const reasons = [
    "Medical Reason",
    "Family Emergency",
    "Vacation",
    "Personal Work",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="leave-form-container">
      <div className="leave-form-box">
        <h2 className="leave-form-title">FULL DAY LEAVE</h2>
        <form onSubmit={handleSubmit}>
          <div className="leave-form-group">
            <label>NUMBER OF DAYS</label>
            <input type="number" name="numberOfDays" value={formData.numberOfDays} onChange={handleChange} required />
          </div>
          <div className="leave-form-group">
            <label>FROM</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
          </div>
          <div className="leave-form-group">
            <label>TO</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
          </div>
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
            <textarea name="explanation" value={formData.explanation} onChange={handleChange} rows="3"></textarea>
          </div>
          <button type="submit" className="leave-submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FullDayLeaveForm;
