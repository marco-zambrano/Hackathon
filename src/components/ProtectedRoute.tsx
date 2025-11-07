import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/backend/supabase-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("ADMIN" | "STUDENT" | "PROFESSOR")[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Obtener el rol del usuario
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          console.error("Error al obtener el perfil:", error);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setUserRole(profile.role);
        setLoading(false);
      } catch (error) {
        console.error("Error en verificación de autenticación:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole as any)) {
    // Redirigir al dashboard correcto según el rol
    switch (userRole) {
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
