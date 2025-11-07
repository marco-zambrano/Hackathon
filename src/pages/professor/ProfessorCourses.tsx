import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Plus } from "lucide-react";

const ProfessorCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack",
      description: "Curso completo de desarrollo web con React y Node.js",
      students: 24,
      duration: "12 semanas",
      status: "Activo",
    },
    {
      id: 2,
      title: "Ciberseguridad Avanzada",
      description: "Técnicas avanzadas de seguridad informática",
      students: 18,
      duration: "8 semanas",
      status: "Activo",
    },
  ];

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus cursos y estudiantes
            </p>
          </div>
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Crear Curso
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  <Badge variant="default">{course.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.students} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Gestionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessorCourses;
