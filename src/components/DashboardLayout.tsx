import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  Search,
  Award,
  User,
  UserCheck,
  LayoutDashboard,
  Users,
  BookMarked,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "professor" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (sidebarOpen && !target.closest('aside') && !target.closest('button[aria-label="Toggle menu"]')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const handleLogout = async () => {
    console.log("[DashboardLayout] Logout clicked", {
      currentPath: location.pathname,
      profileId: profile?.id,
    });

    try {
      console.log("[DashboardLayout] Calling signOut()");
      await signOut();
      console.log("[DashboardLayout] signOut() resolved, navigating to /login");
      navigate("/login");
      console.log();
      
    } catch (error) {
      console.error("[DashboardLayout] signOut() failed", error);
    }
  };

  const studentNav: NavItem[] = [
    { title: "Mis Cursos", href: "/student/courses", icon: BookOpen },
    { title: "Explorar Cursos", href: "/student/explore", icon: Search },
    { title: "Mis Certificados", href: "/student/certificates", icon: Award },
    { title: "Verificar Certificado", href: "/verify-certificate", icon: Award },
    { title: "Perfil", href: "/student/profile", icon: User },
  ];

  const professorNav: NavItem[] = [
    { title: "Mis Cursos", href: "/professor/courses", icon: BookOpen },
    { title: "Explorar Cursos", href: "/professor/explore", icon: Search },
    { title: "Mis Certificados", href: "/professor/certificates", icon: Award },
    { title: "Verificar Certificado", href: "/verify-certificate", icon: Award },
    { title: "Solicitudes", href: "/professor/requests", icon: UserCheck },
    { title: "Perfil", href: "/professor/profile", icon: User },
  ];

  const adminNav: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Usuarios", href: "/admin/users", icon: Users },
    { title: "Cursos", href: "/admin/courses", icon: BookMarked },
    { title: "Certificados", href: "/admin/certificates", icon: Award },
    { title: "Verificar Certificado", href: "/verify-certificate", icon: Award },
  ];

  const navItems =
    role === "admin"
      ? adminNav
      : role === "professor"
      ? professorNav
      : studentNav;

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Mobile menu button with overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-md md:hidden bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors shadow-lg"
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ease-in-out shadow-lg md:shadow-none sidebar-transition",
          isMobile 
            ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
            : 'translate-x-0',
          "md:translate-x-0" // Always show on desktop
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-lg">
                Credenciales
              </h1>
              <p className="text-sidebar-foreground/60 text-xs capitalize">
                {role}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/30">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {profile?.email || 'usuario@ejemplo.com'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
        
        {/* Mobile navigation for bottom bar */}
        {isMobile && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center p-2 z-30">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg w-full mx-1 transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
