import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Refresh par /auth/me ka jawab aane tak ruko, warna logged-in user bhi login par chala jata
  if (loading) return <p className="p-4">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // login hai toh andar ke routes dikhao
}