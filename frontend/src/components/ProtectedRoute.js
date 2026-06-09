import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return <>{children}</>;
}
//# sourceMappingURL=ProtectedRoute.js.map