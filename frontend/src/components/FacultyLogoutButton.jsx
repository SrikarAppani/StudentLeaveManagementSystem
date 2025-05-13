import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyDashboard.css"; // Ensure this line is present

const FacultyLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty");
  };

  return (
    <button className="faculty-logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default FacultyLogoutButton;
