import { Navigate, Outlet } from "react-router-dom";
import { authenticatedUser } from "../services/auth/authenticated-user";
const RequireAuth = () => {
  return authenticatedUser.isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default RequireAuth;
