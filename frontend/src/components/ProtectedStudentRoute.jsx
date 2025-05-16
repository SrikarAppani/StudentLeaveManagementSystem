import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedStudentRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/student" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      sessionStorage.removeItem("token");
      return <Navigate to="/student" replace />;
    }
  } catch (e) {
    console.log(e);
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default ProtectedStudentRoute;
