import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, UserCheck, Mail } from "lucide-react";

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      name: "Ana María López",
      email: "ana.lopez@universidad.edu",
      role: "Estudiante",
      courses: 3,
      certificates: 2,
    },
    {
      id: 2,
      name: "Dr. Carlos Ruiz",
      email: "carlos.ruiz@universidad.edu",
      role: "Profesor",
      courses: 5,
      certificates: 0,
    },
    {
      id: 3,
      name: "Pedro Ramírez",
      email: "pedro.ramirez@universidad.edu",
      role: "Estudiante",
      courses: 2,
      certificates: 1,
    },
  ];

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
          />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
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
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge
                          variant={
                            user.role === "Profesor" ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{user.courses} cursos</span>
                        <span>•</span>
                        <span>{user.certificates} certificados</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {user.role === "Estudiante" && (
                      <Button size="sm" variant="outline">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Promover a Profesor
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
