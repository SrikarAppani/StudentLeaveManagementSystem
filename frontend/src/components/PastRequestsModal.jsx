import "../styles/PastRequestsModal.css";

const PastRequestsModal = ({ pastRequests, onClose }) => {
  if(pastRequests.length === 0) {
    return (
      <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Past Requests</h3>
        <p className="no-data">No past requests found</p>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
    );
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Past Requests</h3>
        <table className="past-requests-table">
          <thead>
            <tr>
              <th>Type of Leave</th>
              <th>No. of Days</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Explanation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pastRequests.map((req, index) => {
              const from = new Date(req.fromDate || req.date);
              const numberOfDays = req.numberOfDays;
              
              const to = new Date(from);
              to.setDate(from.getDate() + numberOfDays || 0 - 1);              

              return (
                <tr key={index}>
                  <td>{req.numberOfDays ? req.numberOfDays === 1 ? "Full-Day" : "Multiple days" : "Half-Day"}</td>
                  <td>{req.numberOfDays || "-"}</td>
                  <td>{from.toLocaleDateString("en-GB")}</td>
                  <td>{req.numberOfDays ? to.toLocaleDateString("en-GB") : "-"}</td>
                  <td>{req.reason}</td>
                  <td>{req.explanation}</td>
                  <td>{req.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PastRequestsModal;
