import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Users, BookOpen } from "lucide-react";

const StudentExplore = () => {
  const availableCourses = [
    {
      id: 1,
      title: "Ciberseguridad Básica",
      professor: "Dr. Ana Torres",
      description: "Fundamentos de seguridad informática y protección de datos",
      startDate: "15 Mar 2024",
      endDate: "30 Abr 2024",
      maxStudents: 50,
      currentStudents: 28,
      skills: ["Seguridad", "Networking", "Ethical Hacking"],
      status: "Abierto",
    },
    {
      id: 2,
      title: "Cloud Computing con AWS",
      professor: "Ing. Roberto Sánchez",
      description:
        "Arquitectura y servicios en la nube con Amazon Web Services",
      startDate: "20 Mar 2024",
      endDate: "15 May 2024",
      maxStudents: 40,
      currentStudents: 35,
      skills: ["AWS", "DevOps", "Cloud"],
      status: "Abierto",
    },
    {
      id: 3,
      title: "UX/UI Design Fundamentals",
      professor: "Dra. Laura Méndez",
      description: "Principios de diseño centrado en el usuario",
      startDate: "10 Abr 2024",
      endDate: "25 May 2024",
      maxStudents: 35,
      currentStudents: 15,
      skills: ["Figma", "User Research", "Prototyping"],
      status: "Abierto",
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explorar Cursos</h1>
          <p className="text-muted-foreground mt-2">
            Descubre y aplica a nuevos cursos disponibles
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos por nombre, profesor o habilidades..."
            className="pl-10 h-12"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{course.status}</Badge>
                  <div className="text-xs text-muted-foreground">
                    {course.currentStudents}/{course.maxStudents}
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.professor}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                {/* Course Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Inicio: {course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Fin: {course.endDate}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Solicitar Inscripción
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentExplore;
