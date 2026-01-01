import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Role-based route protection component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const user = authService.getStoredUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;

