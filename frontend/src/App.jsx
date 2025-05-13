import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import "./App.css";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import ProtectedFacultyRoute from "./components/ProtectedFacultyRoute";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import HalfDayLeaveForm from "./pages/HalfDayLeaveForm";
import FullDayLeaveForm from "./pages/FullDayLeaveForm";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import FacultyLoginPage from "./pages/FacultyLoginPage";
import FacultySignupPage from "./pages/FacultySignupPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyRequestViewPage from "./pages/FacultyRequestViewPage";
import StudentRequestViewPage from "./pages/StudentRequestViewPage";
import StudentDashboard from "./pages/StudentDashboard";

function AppContent() {
  
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route
          path="/student"
          element={<StudentLoginPage/>}
        />
        <Route
          path="/student/sign-up"
          element={<StudentSignupPage/>}
        />
        <Route
          path="/faculty"
          element={<FacultyLoginPage/>}
        />
        <Route
          path="/faculty/sign-up"
          element={<FacultySignupPage/>}
        />
        <Route
          path="/home"
          element={
            <ProtectedStudentRoute>
              <StudentDashboard/>
            </ProtectedStudentRoute>
          }
        />
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedFacultyRoute>
              <FacultyDashboard/>
            </ProtectedFacultyRoute>
          }
        />
        <Route
          path="/faculty-view-details"
          element={
            <ProtectedFacultyRoute>
              <FacultyRequestViewPage/>
            </ProtectedFacultyRoute>
          }
        />
        <Route
          path="/student-view-details"
          element={
            <ProtectedFacultyRoute>
              <StudentRequestViewPage/>
            </ProtectedFacultyRoute>
          }
        />
        <Route
          path="/half-day-leave"
          element={
            <ProtectedStudentRoute>
              <HalfDayLeaveForm/>
            </ProtectedStudentRoute>
          }
        />
        <Route
          path="/full-day-leave"
          element={
            <ProtectedStudentRoute>
              <FullDayLeaveForm/>
            </ProtectedStudentRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
