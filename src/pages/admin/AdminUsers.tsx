import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, UserCheck, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/backend/supabase-client";
import type { Profile, Course, Enrollment, Certificate } from "@/types/database";

type ProfileWithRelations = Profile & {
  taught_courses?: Pick<Course, "id">[];
  student_enrollments?: Pick<Enrollment, "id">[];
  student_certificates?: Pick<Certificate, "id">[];
  issued_certificates?: Pick<Certificate, "id">[];
};

const AdminUsers = () => {
  const [users, setUsers] = useState<ProfileWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("profiles")
          .select('*')
          .order("created_at", { ascending: true });

        if (error) throw error;

        setUsers((data ?? []) as ProfileWithRelations[]);
      } catch (err) {
        console.error("Error fetching users", err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.toLowerCase();
      const email = user.email?.toLowerCase() ?? "";
      return fullName.includes(term) || email.includes(term);
    });
  }, [searchTerm, users]);

  const handlePromote = async (userId: string) => {
    try {
      setPromotingId(userId);
      const { error } = await supabase
        .from("profiles")
        .update({ role: "PROFESSOR" })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: "PROFESSOR",
              }
            : user
        )
      );
    } catch (err) {
      console.error(`Error promoting user ${userId}`, err);
      setError("No se pudo actualizar el rol del usuario");
    } finally {
      setPromotingId(null);
    }
  };

  const renderUsers = () => {
    if (loading) {
      return (
        <Card className="p-12 text-center">
          <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="p-12 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <Card className="p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
          <p className="text-muted-foreground">
            Ajusta tu búsqueda o verifica que existan perfiles registrados.
          </p>
        </Card>
      );
    }

    return filteredUsers.map((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Sin nombre";
      const email = user.email ?? "Sin correo";
      const isProfessor = user.role === "PROFESSOR";
      const coursesCount = isProfessor
        ? user.taught_courses?.length ?? 0
        : user.student_enrollments?.length ?? 0;
      const certificatesCount = isProfessor
        ? user.issued_certificates?.length ?? 0
        : user.student_certificates?.length ?? 0;

      return (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{fullName}</h3>
                    <Badge variant={isProfessor ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{email}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{coursesCount} cursos</span>
                    <span>•</span>
                    <span>{certificatesCount} certificados</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!isProfessor && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={promotingId === user.id}
                    onClick={() => handlePromote(user.id)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {promotingId === user.id ? "Promoviendo..." : "Promover a Profesor"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            Administra estudiantes y asigna roles de profesor
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios por nombre o email..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {/* Users List */}
        <div className="space-y-4">{renderUsers()}</div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
