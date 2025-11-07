import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import { useLocation } from "react-router-dom";

const StudentCourses = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const enrolledCourses = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack",
      professor: "Dr. María González",
      status: "En progreso",
      progress: 65,
      students: 45,
      startDate: "15 Feb 2024",
      skills: ["React", "Node.js", "PostgreSQL"],
    },
    {
      id: 2,
      title: "Machine Learning Avanzado",
      professor: "Dr. Carlos Ruiz",
      status: "Completado",
      progress: 100,
      students: 32,
      startDate: "10 Ene 2024",
      skills: ["Python", "TensorFlow", "Data Science"],
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Cursos</h1>
          <p className="text-muted-foreground mt-2">
            Cursos en los que estás inscrito y has completado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.professor}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      course.status === "Completado" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} estudiantes</span>
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
            </Card>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay cursos inscritos
            </h3>
            <p className="text-muted-foreground">
              Explora cursos disponibles para comenzar tu aprendizaje
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
