import React, { useNavigate } from 'react-router-dom';
import '../styles/RoleSelectionPage.css';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="role-selection-box">
        <h1 className="role-selection-title">Select Your Role</h1>
        <div className="role-buttons">
          <button onClick={() => navigate("/faculty")} className="role-button teacher">
            Faculty
          </button>
          <button onClick={() => navigate("/student")} className="role-button student">
            Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;