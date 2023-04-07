import { Navigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

export const ProtectedRoute = ({ children, isLogin }) => {
  // eslint-disable-next-line no-unused-vars
  const [admin, setAdmin] = useLocalStorage(null);
  const isAuthenticated = admin === process.env.REACT_APP_ADMIN_TOKEN

  if (admin === undefined && !isLogin) {
    return <Navigate to="/admin" />;
  }
  if (admin !== undefined && !isAuthenticated && !isLogin) {
    return <Navigate to="/" />;
  }  
  if (admin !== undefined && isAuthenticated && isLogin) {
    return <Navigate to="/admin-panel" />;
  }
  return children;
};