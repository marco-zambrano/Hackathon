import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("ADMIN" | "STUDENT" | "PROFESSOR")[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Show loader if still loading (includes session and profile fetch)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirect if no user or no profile (after loading completes)
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirigir al dashboard correcto según el rol
    switch (profile.role) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "STUDENT":
        return <Navigate to="/student/explore" replace />;
      case "PROFESSOR":
        return <Navigate to="/professor/explore" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};