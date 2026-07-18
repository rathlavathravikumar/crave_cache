import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
