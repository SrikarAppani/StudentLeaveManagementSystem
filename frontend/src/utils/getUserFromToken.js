import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const user = jwtDecode(token);
    return user;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
