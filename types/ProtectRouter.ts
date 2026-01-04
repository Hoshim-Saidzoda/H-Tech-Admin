import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { isAuth } from '../store/auth.store';
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuth()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
