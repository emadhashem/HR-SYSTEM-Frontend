import { Navigate, Outlet } from "react-router-dom";
import { authenticatedUser } from "../services/auth/authenticated-user";
const PublicAuth = () => {
  return !authenticatedUser.isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default PublicAuth;
