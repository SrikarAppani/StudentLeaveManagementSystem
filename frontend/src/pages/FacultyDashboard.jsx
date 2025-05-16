import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateToken } from "../notifications/firebase";
import { getUserFromToken } from "../utils/getUserFromToken";
import FacultyLogoutButton from "../components/FacultyLogoutButton";
import "../styles/FacultyDashboard.css";

const FacultyDashboard = () => {
  const token = sessionStorage.getItem("token");
  const [facultyID, setFacultyID] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setFacultyID(user.facultyID);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if(!facultyID) return;
      try {
        setLoading(true);
        const pendingResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/pending?facultyID=${facultyID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const pendingData = await pendingResponse.json();
        setPendingRequests(pendingData);

        const historyResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/history?facultyID=${facultyID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }
        );
        const historyData = historyResponse.ok
          ? await historyResponse.json()
          : historyRequests;
        setHistoryRequests(historyData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [facultyID]);

  useEffect(() => {
    async function fetchToken() {
      if(!facultyID) return;
      const deviceToken = await generateToken();
      fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/faculty/update-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ facultyID, deviceToken }),
      });
    }
    fetchToken();
  }, [facultyID]);

  const filteredHistory = historyRequests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewDetails = async (request) => {
    navigate("/faculty-view-details", {
      state: { requestData: request },
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div className="faculty-dashboard">
      <FacultyLogoutButton/>
      <h1 className="dashboard-title">Faculty Leave Dashboard</h1>

      <section className="pending-requests">
        <h2>Pending Requests</h2>
        <div className="scrollable-card-container">
          {pendingRequests.map((request) => (
            <div key={request._id} className="request-card">
              <p>
                <strong>Name:</strong> {request.name}
              </p>
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
              <p>
                <strong>Date{request.date ? "" : "s"}:</strong>{" "}
                {request.date
                  ? new Date(request.date).toLocaleDateString("en-GB")
                  : `${new Date(request.fromDate).toLocaleDateString(
                      "en-GB"
                    )} to ${new Date(request.toDate).toLocaleDateString(
                      "en-GB"
                    )}`}
              </p>
              <button
                className="view-button"
                onClick={() => viewDetails(request)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="past-requests">
        <h2>Past Requests</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <table className="requests-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Reason</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No history data available
                </td>
              </tr>
            ) : (
              currentItems.map((request) => (
                <tr key={request._id}>
                  <td>{request.name}</td>
                  <td>{request.reason}</td>
                  <td>{request.date ? "Half-Day" : "Full-Day"}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
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

export default FacultyDashboard;
