import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Users } from "lucide-react";

const AdminCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack",
      professor: "Dr. María González",
      status: "Activo",
      students: 45,
      maxStudents: 50,
      startDate: "15 Feb 2024",
      certificates: 12,
    },
    {
      id: 2,
      title: "Machine Learning Avanzado",
      professor: "Dr. Carlos Ruiz",
      status: "Activo",
      students: 32,
      maxStudents: 40,
      startDate: "10 Ene 2024",
      certificates: 28,
    },
    {
      id: 3,
      title: "Cloud Computing Básico",
      professor: "Ing. Roberto Sánchez",
      status: "Finalizado",
      students: 38,
      maxStudents: 40,
      startDate: "05 Dic 2023",
      certificates: 35,
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
          <p className="text-muted-foreground mt-2">
            Administra y supervisa todos los cursos de la plataforma
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos por nombre o profesor..."
            className="pl-10 h-12"
          />
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <Badge
                        variant={
                          course.status === "Activo" ? "default" : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription>{course.professor}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Estudiantes
                      </p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {course.students}/{course.maxStudents}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Inicio</p>
                      <p className="font-medium">{course.startDate}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Certificados
                      </p>
                      <p className="font-medium">
                        {course.certificates} emitidos
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
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

export default AdminCourses;
