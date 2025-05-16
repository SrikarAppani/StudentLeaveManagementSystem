import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateToken } from "../notifications/firebase";
import { getUserFromToken } from "../utils/getUserFromToken";
import StudentLogoutButton from "../components/StudentLogoutButton";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const token = sessionStorage.getItem("token");
  const [rollNumber, setRollNumber] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setRollNumber(user.rollNumber);
    }
  }, []);

  useEffect(() => {
    async function fetchToken() {
      if (!rollNumber) return;
      const deviceToken = await generateToken();
      fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/student/update-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rollNumber, deviceToken }),
      });
    }
    fetchToken();
  }, [rollNumber]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);  

  useEffect(() => {
    const fetchData = async () => {
      if (!rollNumber) return;
      try {
        const pendingRes = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER}/api/student/pending?rollNumber=${rollNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const historyRes = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER}/api/student/history?rollNumber=${rollNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pendingData = await pendingRes.json();
        const historyData = await historyRes.json();

        setPendingRequests(pendingData);
        setHistoryRequests(historyData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [rollNumber]);

  const handleLeaveNavigate = (e) => {
    const value = e.target.value;
    if (value === "half") navigate("/half-day-leave");
    else if (value === "full") navigate("/full-day-leave");
  };

  const viewDetails = async (request) => {
    navigate("/student-view-details", {
      state: { requestData: request },
    });
  };

  const getGatePassUrl = async (requestID) => {
    try {
      const urlResponse = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/student/gate-pass-url?rollNumber=${rollNumber}&requestID=${requestID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if(urlResponse.ok) {
        const data = await urlResponse.json();
        console.log(data.message);
        return data.message;
      } else {
        alert("Error getting gate pass");
      }
    } catch (err) {
      console.error("Error getting gate pass: ", err);
    }
  }

  const filteredHistory = historyRequests.filter((req) => {
    if (filter === "half") return req.date;
    if (filter === "full") return !req.date;
    return true;
  });

  if (loading) return <div className="loading">Loading data...</div>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="student-dashboard">
      <StudentLogoutButton />
      <h1 className="student-dashboard-title">Student Leave Dashboard</h1>

      <section className="student-pending-requests">
        <div className="student-pending-header">
          <h2>Pending Requests</h2>
          <select
            className="apply-dropdown"
            onChange={handleLeaveNavigate}
            defaultValue=""
          >
            <option value="" disabled>
              Apply Leave
            </option>
            <option value="half">Half Day Leave</option>
            <option value="full">Full/Multiple Day Leave</option>
          </select>
        </div>
        <div className="student-scrollable-card-container">
          {pendingRequests.map((request) => (
            <div key={request._id} className="student-request-card">
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {request.date
                  ? new Date(request.date).toLocaleDateString("en-GB")
                  : `${new Date(request.fromDate).toLocaleDateString(
                      "en-GB"
                    )} to ${new Date(request.toDate).toLocaleDateString(
                      "en-GB"
                    )}`}
              </p>
              <button
                className="student-view-button"
                onClick={() => viewDetails(request)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="student-past-requests">
        <h2>Past Requests</h2>
        <div className="filter-buttons">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("half")}
            className={filter === "half" ? "active" : ""}
          >
            Half Day
          </button>
          <button
            onClick={() => setFilter("full")}
            className={filter === "full" ? "active" : ""}
          >
            Full Day
          </button>
        </div>

        <table className="student-requests-table">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Type</th>
              <th>Date</th>
              <th>No. of Days</th>
              <th>Status</th>
              <th>Gate Pass</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No past requests found
                </td>
              </tr>
            ) : (
              currentItems.map((req) => (
                <tr key={req._id} onClick={() => viewDetails(req)}>
                  <td>{req.reason}</td>
                  <td>{req.date ? "Half-Day" : "Full-Day"}</td>
                  <td>
                    {req.date
                      ? new Date(req.date).toLocaleDateString("en-GB")
                      : new Date(req.fromDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>{req.date ? "-" : req.days}</td>
                  <td>{req.status}</td>
                  <td>
                    {req.status === "Approved" ? (
                      <a
                        href="#"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const url = await getGatePassUrl(req);
                          window.open(url, "_blank", "noopener, noreferer");
                        }}
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="student-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
