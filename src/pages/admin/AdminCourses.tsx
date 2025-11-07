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
import { Search, Trash2, Eye, Users, Calendar, FileCheck } from "lucide-react";

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
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Cursos</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Administra y supervisa todos los cursos de la plataforma
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos por nombre o profesor..."
            className="pl-9 h-10 md:h-12 text-sm md:text-base"
          />
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <CardTitle className="text-lg sm:text-xl line-clamp-2">{course.title}</CardTitle>
                      <Badge
                        variant={course.status === "Activo" ? "default" : "secondary"}
                        className="w-fit"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription>{course.professor}</CardDescription>
                  </div>
                  
                  <div className="flex gap-2 sm:ml-4">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Eye className="h-4 w-4 mr-1.5 sm:mr-2" />
                      <span className="sr-only sm:not-sr-only">Ver</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Trash2 className="h-4 w-4 mr-1.5 sm:mr-2" />
                      <span className="sr-only sm:not-sr-only">Eliminar</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Estudiantes</p>
                      <p className="font-medium">{course.students}/{course.maxStudents}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Inicio</p>
                      <p className="font-medium">{course.startDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <FileCheck className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Certificados</p>
                      <p className="font-medium">{course.certificates} emitidos</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="w-full">
                      <p className="text-muted-foreground text-xs">Progreso</p>
                      <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(course.students / course.maxStudents) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((course.students / course.maxStudents) * 100)}% de capacidad
                      </p>
                    </div>
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
