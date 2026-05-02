import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role restriction (optional)
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}