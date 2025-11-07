import { useEffect, useState } from "react";
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
import { BookOpen, Users, Clock, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/backend/supabase-client";
import { Course } from "@/types/database";

interface CourseWithEnrollments extends Course {
  enrollmentCount?: number;
}

const ProfessorCourses = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<CourseWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        // Fetch courses created by this professor
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('*')
          .eq('professor_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // For each course, get enrollment count
        const coursesWithCounts = await Promise.all(
          (coursesData || []).map(async (course) => {
            const { count } = await supabase
              .from('enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('course_id', course.id);

            return {
              ...course,
              enrollmentCount: count || 0,
            };
          })
        );

        setCourses(coursesWithCounts);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [profile?.id]);

  if (loading) {
    return (
      <DashboardLayout role="professor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando cursos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant={course.status === "ACTIVE" ? "default" : "secondary"}>
                      {course.status === "ACTIVE" ? "Activo" : "Pendiente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollmentCount || 0} estudiantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(course.created_at || '').toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
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
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes cursos creados
            </h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer curso para comenzar
            </p>
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Crear Curso
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfessorCourses;
