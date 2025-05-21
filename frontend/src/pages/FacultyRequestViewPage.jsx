import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/FacultyRequestViewPage.css";
import { getUserFromToken } from "../utils/getUserFromToken";
import FacultyLogoutButton from "../components/FacultyLogoutButton";
import PastRequestsModal from "../components/PastRequestsModal";

const FacultyRequestViewPage = () => {
  const token = sessionStorage.getItem("token");
  const [facultyID, setFacultyID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pastRequests, setPastRequests] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state?.requestData;

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setFacultyID(user.facultyID);
    }
  }, []);

  if (!request) {
    return <p>Invalid or missing request data</p>;
  }

  const handleAction = async (action) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/handle-approval?requestId=${request._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: action,
            requestType: request.numberOfDays ? "Full-Day" : "Half-Day",
            facultyID: facultyID,
          }),
        }
      );

      if (response.ok) {
        alert(`Request has been ${action}ed`);
        navigate("/faculty/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const viewPastRequests = async (rollNumber) => {
    console.log(rollNumber);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/view-student-past-requests?rollNumber=${rollNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setPastRequests(response.ok ? await response.json() : pastRequests);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching past requests:", error);
      alert(error.response?.data?.message || "Failed to fetch past requests.");
    }
  };

  function callParent(phoneNumber) {
    const canCall = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    if (canCall) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("This device doesn't support phone calls.");
    }
  }

  return (
    <div className="faculty-request-viewing-container">
      <FacultyLogoutButton/>
      <div className="faculty-request-viewing-box">
        <h2 className="faculty-request-viewing-title">Leave Request Details</h2>

        <div className="faculty-request-detail">
          <span className="faculty-request-label">Name :</span> {request.name}
        </div>
        <div className="faculty-request-detail">
          <span className="faculty-request-label">Roll Number :</span>{" "}
          {request.studentRollNumber}
        </div>
        <div className="faculty-request-detail">
          <span className="faculty-request-label">Leave Type :</span>{" "}
          {request.numberOfDays
            ? request.numberOfDays === 1
              ? "Full-Day"
              : "Multiple days"
            : "Half-Day"}
        </div>
        <div className="faculty-request-detail">
          <span className="faculty-request-label">
            {request.fromDate ? "From Date" : "Date          "} :
          </span>{" "}
          {new Date(request.fromDate || request.date).toLocaleDateString(
            "en-GB"
          )}
        </div>
        {request.toDate && (
          <div className="faculty-request-detail">
            <span className="faculty-request-label">To Date :</span>{" "}
            {new Date(request.toDate).toLocaleDateString("en-GB")}
          </div>
        )}
        {request.numberOfDays && (
          <div className="faculty-request-detail">
            <span className="faculty-request-label">No.of Days :</span>{" "}
            {request.numberOfDays}
          </div>
        )}
        <div className="faculty-request-detail">
          <span className="faculty-request-label">Reason :</span>{" "}
          {request.reason}
        </div>
        <div className="faculty-request-detail">
          <span className="faculty-request-label">Explanation :</span>{" "}
          {request.explanation}
        </div>

        <div className="faculty-request-buttons">
          <button
            className="faculty-request-button"
            onClick={() => callParent(request.parentPhoneNumber)}
          >
            Call Parent
          </button>

          <button
            className="faculty-view-past-button"
            onClick={() => viewPastRequests(request.studentRollNumber)}
          >
            View Past Requests
          </button>

          <button
            className="faculty-accept-button"
            onClick={() => handleAction("approve")}
          >
            Approve
          </button>

          <button
            className="faculty-reject-button"
            onClick={() => handleAction("reject")}
          >
            Reject
          </button>
        </div>
      </div>

      {showModal && (
        <PastRequestsModal
          pastRequests={pastRequests}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FacultyRequestViewPage;
