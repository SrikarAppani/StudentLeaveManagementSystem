import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentHomePage.css";



const StudentHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Leave Request</h1>
      <div className="button-container">
        <button className="home-button" onClick={() => navigate("/full-day-leave")}>
          Full Day Leave
        </button>
        <button className="home-button" onClick={() => navigate("/half-day-leave")}>
          Half Day Leave
        </button>
      </div>
    </div>
  );
};

export default StudentHomePage;