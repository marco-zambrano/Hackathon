import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/backend/supabase-client";
import { Enrollment, Course, Profile } from "@/types/database";

interface EnrollmentWithCourse extends Enrollment {
  courses: Course & {
    professor?: Profile | null;
  };
}

const StudentCourses = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const { profile } = useAuth();
  
  const [enrolledCourses, setEnrolledCourses] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            *,
            courses (
              *,
              professor:profiles!courses_professor_id_fkey (
                id,
                first_name,
                last_name,
                email,
                avatar_url
              )
            )
          `)
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setEnrolledCourses((data ?? []) as EnrollmentWithCourse[]);
        console.log(data);

      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [profile?.id]);

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando cursos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role={role}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Mis Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Cursos en los que estás inscrito y has completado
            </p>
          </div>
          <Card className="p-12 text-center border-red-200 bg-red-50">
            <p className="text-red-600">{error}</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Cursos</h1>
          <p className="text-muted-foreground mt-2">
            Cursos en los que estás inscrito y has completado
          </p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses.map((enrollment) => {
              const course = enrollment.courses;
              const professor = course.professor;
              const professorName = professor 
                ? `${professor.first_name} ${professor.last_name}` 
                : 'Profesor no asignado';
              const progress = enrollment.status === 'COMPLETED' ? 100 : 50;

              return (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription>{professorName}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          enrollment.status === "COMPLETED" ? "default" : "secondary"
                        }
                      >
                        {enrollment.status === "COMPLETED" ? "Completado" : "En progreso"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(enrollment.created_at || '').toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {course.status === "ACTIVE" ? "Activo" : "Pendiente"}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
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
