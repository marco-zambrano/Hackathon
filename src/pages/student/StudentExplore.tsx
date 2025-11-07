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
import { Search, Calendar, BookOpen, Users, Loader2 } from "lucide-react";
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
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get courses where the student is already enrolled
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);

        const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];

        // Get all courses that the student is not enrolled in
        let query = supabase
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
          `)
          .not('id', 'in', `(${enrolledCourseIds.join(',')})`);

        // If no enrolled courses, just fetch all
        if (enrolledCourseIds.length === 0) {
          query = query.not('id', 'in', '(\'\')'); // Empty NOT IN clause
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching courses", error);
          return;
        }

        setAvailableCourses((data ?? []) as CourseWithProfessor[]);
      } catch (error) {
        console.error("Error in fetchCourses:", error);
      }
    };

    fetchCourses();
  }, []);


  return (
    <DashboardLayout role={role}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Explorar Cursos</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Descubre y aplica a nuevos cursos disponibles
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos por nombre, profesor o habilidades..."
            className="pl-9 h-10 md:h-12 text-sm md:text-base"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {availableCourses.map((course) => {
            const professorName = course.professor
              ? `${course.professor.first_name ?? ""} ${course.professor.last_name ?? ""}`.trim()
              : "Profesor asignado";
            const enrolledLabel = "--";
            const startDate = course.start_date 
              ? new Date(course.start_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Por definir';
            const endDate = course.end_date 
              ? new Date(course.end_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Por definir';

            return (
              <Card
                key={course.id}
                className="flex flex-col hover:shadow-lg transition-shadow h-full flex-1 min-w-0"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant={course.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {course.status?.toLowerCase() === 'active' ? 'Disponible' : course.status?.toLowerCase()}
                    </Badge>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {enrolledLabel}/{course.max_students ?? "--"}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{professorName}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {course.description || 'Sin descripción disponible'}
                  </p>

                  {/* Course Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Inicio</p>
                        <p className="font-medium">{startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Fin</p>
                        <p className="font-medium">{endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {(course.skills?.length ?? 0) > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Habilidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {(course.skills ?? []).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="text-xs font-normal"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  onClick={() => handleEnrollRequest(course.id)}
                  disabled={course.status === 'PENDING' || loading[course.id]}
                  size={window.innerWidth < 640 ? 'sm' : 'default'}
                >
                  {loading[course.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Procesando</span>
                    </>
                  ) : course.status === 'PENDING' ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      <span className="hidden sm:inline">Solicitud Enviada</span>
                      <span className="sm:hidden">Enviada</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">Solicitar Inscripción</span>
                      <span className="sm:hidden">Inscribirse</span>
                    </span>
                  )}
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
