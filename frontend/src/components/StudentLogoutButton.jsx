import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css"

const StudentLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/student");
  };

  return (
    <button className="student-logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default StudentLogoutButton;
