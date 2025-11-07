import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Search, Calendar, BookOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/backend/supabase-client";
import type { Course, Profile } from "@/types/database";

type CourseWithProfessor = Course & {
  professor?: Profile | null;
};

const StudentExplore = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const [availableCourses, setAvailableCourses] = useState<CourseWithProfessor[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleEnrollRequest = async (courseId: string) => {
    try {
      setLoading(prev => ({ ...prev, [courseId]: true }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      const { error } = await supabase
        .from('enrollments')
        .insert([
          { 
            student_id: user.id, 
            course_id: courseId,
            status: 'PENDING'
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud de inscripción ha sido enviada correctamente.',
        variant: 'default',
      });

      // Update the course to show it's pending
      setAvailableCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, status: 'PENDING' } 
            : course
        )
      );
      
    } catch (error) {
      console.error('Error al solicitar inscripción:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo enviar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

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
      const courses = availableCourses
      console.log(data);
      

    };

    fetchCourses();
  }, []);


  return (
    <DashboardLayout role={role}>
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
          {availableCourses.map((course) => {
            const professorName = course.professor
              ? `${course.professor.first_name ?? ""} ${course.professor.last_name ?? ""}`.trim()
              : "Profesor asignado";
            const enrolledLabel = "--";

            return (
            <Card
              key={course.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{course.status}</Badge>
                  <div className="text-xs text-muted-foreground">
                      {enrolledLabel}/{course.max_students ?? "--"}
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{professorName}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                {/* Course Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                      <span>Inicio: {course.start_date ?? "Por definir"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                      <span>Fin: {course.end_date ?? "Por definir"}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                    {(course.skills ?? []).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleEnrollRequest(course.id)}
                  disabled={loading[course.id] || course.status === 'PENDING'}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {loading[course.id] 
                    ? 'Enviando...' 
                    : course.status === 'PENDING'
                      ? 'Solicitud Enviada'
                      : 'Solicitar Inscripción'}
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentExplore;
