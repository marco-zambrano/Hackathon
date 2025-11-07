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
import { Search, Plus, BookOpen, Users, Clock, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Course, Profile } from "@/types/database";
import { supabase } from "@/backend/supabase-client";

type CourseWithProfessor = Course & {
  professor?: Profile | null;
};

const ProfessorExplore = () => {
  const location = useLocation();
  // const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const [availableCourses, setAvailableCourses] = useState<CourseWithProfessor[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          professor:profiles (
            id,
            first_name,
            last_name,
            email,
            role,
            avatar_url
          )
        `);

      if (error) {
        console.error("Error fetching courses", error);
        return;
      }

      setAvailableCourses((data ?? []) as CourseWithProfessor[]);
      console.log(data);
    };

    fetchCourses();
  }, []);

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
          {availableCourses.map((course) => {
            const professorName = course.professor
              ? `${course.professor.first_name ?? ""} ${course.professor.last_name ?? ""}`.trim()
              : "Profesor no asignado";

            const startDate = course.start_date
              ? new Date(course.start_date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Por definir";

            const endDate = course.end_date
              ? new Date(course.end_date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Por definir";

            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{course.status}</Badge>
                    <div className="text-xs text-muted-foreground">
                      <Users className="inline-block h-4 w-4 mr-1" />
                      {course.max_students ?? "--"}
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-32 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg mb-4">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{professorName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Inicio: {startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Fin: {endDate}</span>
                    </div>
                  </div>

                  {course.skills && course.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessorExplore;
