import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

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

  const studentNav: NavItem[] = [
    { title: "Mis Cursos", href: "/student/courses", icon: BookOpen },
    { title: "Explorar Cursos", href: "/student/explore", icon: Search },
    { title: "Mis Certificados", href: "/student/certificates", icon: Award },
    { title: "Perfil", href: "/student/profile", icon: User },
  ];

  const professorNav: NavItem[] = [
    { title: "Mis Cursos", href: "/professor/courses", icon: BookOpen },
    { title: "Explorar Cursos", href: "/professor/explore", icon: Search },
    { title: "Mis Certificados", href: "/professor/certificates", icon: Award },
    { title: "Solicitudes", href: "/professor/requests", icon: UserCheck },
    { title: "Perfil", href: "/professor/profile", icon: User },
  ];

  const adminNav: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Usuarios", href: "/admin/users", icon: Users },
    { title: "Cursos", href: "/admin/courses", icon: BookMarked },
  ];

  const navItems =
    role === "admin"
      ? adminNav
      : role === "professor"
      ? professorNav
      : studentNav;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/30">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Usuario
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                usuario@ejemplo.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
