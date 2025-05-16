import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedFacultyRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/faculty" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      sessionStorage.removeItem("token");
      return <Navigate to="/faculty" replace />;
    }
  } catch (e) {
    return <Navigate to="/faculty" replace />;
  }

  return children;
};

export default ProtectedFacultyRoute;
