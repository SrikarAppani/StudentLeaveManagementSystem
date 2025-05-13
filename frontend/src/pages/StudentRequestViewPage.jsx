import '../styles/StudentRequestViewPage.css';
import LeaveProgressBar from '../components/LeaveProgressBar';
import StudentLogoutButton from "../components/StudentLogoutButton"
import { useLocation } from 'react-router-dom';

const StudentRequestViewPage = () => {

    const location = useLocation();
    const request = location.state?.requestData;

    if (!request) {
        return <p>Loading student leave details...</p>;
    }

    return (
        <div className="request-viewing-container">
            <StudentLogoutButton/>
            <div className="request-viewing-box">
                <h2 className="request-viewing-title">Leave Request Details</h2>
                <div className="request-detail"><span className="request-label">Leave Type   :</span> {request.numberOfDays ? request.numberOfDays ===1 ? "Full-Day" : "Multiple Days" : "Half-Day"}</div>
                <div className="request-detail"><span className="request-label">{request.fromDate ? "From Date" : "Date          "}    :</span> {new Date(request.fromDate || request.date).toLocaleDateString("en-GB")}</div>
                {request.toDate && <div className="request-detail"><span className="request-label">To Date         :</span> {new Date(request.toDate).toLocaleDateString("en-GB")}</div>}
                {request.numberOfDays && <div className="request-detail"><span className="request-label">No. of Days  :</span> {request.numberOfDays}</div>}
                <div className="request-detail"><span className="request-label">Reason         :</span> {request.reason}</div>
                <div className="request-detail"><span className="request-label">Explanation :</span> {request.explanation}</div>
                <LeaveProgressBar facultyApprovalStatus={request.facultyApprovalStatus} placementApprovalStatus={request.placementApprovalStatus} status={request.status} isPartOfPlacementTraining = {request.placementFacultyID !== undefined}></LeaveProgressBar>
            </div>
        </div>
    );
};  

export default StudentRequestViewPage;