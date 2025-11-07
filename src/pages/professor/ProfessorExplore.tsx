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
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen, Users, Clock } from "lucide-react";

const ProfessorExplore = () => {
  const availableCourses = [
    {
      id: 1,
      title: "Machine Learning Avanzado",
      description: "Técnicas avanzadas de aprendizaje automático",
      professor: "Dr. Carlos Mendoza",
      students: 32,
      duration: "16 semanas",
    },
    {
      id: 2,
      title: "Arquitectura de Software",
      description: "Patrones y principios de diseño de software",
      professor: "Ing. María Torres",
      students: 28,
      duration: "10 semanas",
    },
    {
      id: 3,
      title: "DevOps y Cloud Computing",
      description: "Prácticas modernas de desarrollo y despliegue",
      professor: "Lic. Pedro Ramírez",
      students: 25,
      duration: "12 semanas",
    },
  ];

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Explorar Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Descubre y crea nuevos cursos
            </p>
          </div>
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Crear Curso
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Buscar cursos..." className="pl-10 h-12" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center h-32 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg mb-4">
                  <BookOpen className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Profesor: {course.professor}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessorExplore;
