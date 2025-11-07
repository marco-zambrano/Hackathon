import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { BookOpen, Users, Clock, Plus, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Course, CourseStatus } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/backend/supabase-client";

// Form validation schema
const courseFormSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  skills: z.string().optional(),
  max_students: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "El número de estudiantes debe ser mayor a 0").optional()
  ),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE"]).default("PENDING")
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseWithEnrollments extends Course {
  enrollmentCount?: number;
}

const ProfessorCourses = () => {
  const { user, profile } = useAuth();
  
  // Log user token if needed
  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.id);
    }
  }, [user]);

  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: "",
      max_students: undefined,
      start_date: "",
      end_date: "",
      status: "PENDING"
    },
  });

  const handleManageCourse = async (courseId: string) => {
    setCurrentCourseId(courseId);
    setIsManageDialogOpen(true);
    await fetchEnrollments(courseId);
  };

  const fetchEnrollments = async (courseId: string) => {
    try {
      setIsLoadingEnrollments(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          created_at,
          profiles:student_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('course_id', courseId);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los estudiantes inscritos.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  const handleGenerateCertificate = async (enrollmentId: string, studentId: string) => {
    if (!currentCourseId) return;
    
    // 2. Update the enrollment status to COMPLETED
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({ status: 'COMPLETED' })
      .eq('id', enrollmentId);
      
    if (updateError) throw updateError;
  
    try {
      setIsGeneratingCertificate(enrollmentId);
      
      // 1. Generate the certificate
      const { data, error } = await supabase.functions.invoke('Certificate-Issuance', {
        body: {
          student_id: studentId,
          course_id: currentCourseId,
        },
      });
      
      if (error) throw error;
    
      
      // 3. Remove the student from the local state
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      
      toast({
        title: '¡Certificado generado!',
        description: 'El estudiante ha sido certificado exitosamente.',
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el certificado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCertificate(null);
    }
  };

  const onSubmit = async (data: CourseFormValues) => {
    if (!profile?.id) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('courses').insert([{
        ...data,
        professor_id: profile.id,
        skills: data.skills ? data.skills.split(',').map(skill => skill.trim()) : [],
        start_date: data.start_date || null,
        end_date: data.end_date || null,
      }]);

      if (error) throw error;

      toast({
        title: "¡Curso creado!",
        description: "El curso ha sido creado exitosamente.",
      });
      
      // Refresh courses list
      fetchCourses();
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el curso. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCourses = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('professor_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar los cursos.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <Button size="lg" onClick={() => setIsCreateDialogOpen(true)}>
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
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleManageCourse(course.id)}
                    >
                      Gestionar Estudiantes
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Crear Curso
            </Button>
          </Card>
        )}

        {/* Manage Enrollments Dialog */}
        <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Gestionar Estudiantes</DialogTitle>
              <DialogDescription>
                Lista de estudiantes inscritos en este curso
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingEnrollments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay estudiantes inscritos en este curso.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.profiles ? `${enrollment.profiles.first_name} ${enrollment.profiles.last_name}` : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.profiles?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={enrollment.status === 'APPROVED' ? 'default' : 'secondary'}>
                              {enrollment.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              size="sm" 
                              onClick={() => handleGenerateCertificate(enrollment.id, enrollment.profiles?.id)}
                              disabled={isGeneratingCertificate === enrollment.id}
                            >
                              {isGeneratingCertificate === enrollment.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generando...
                                </>
                              ) : (
                                'Generar Certificado'
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Course Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
              <DialogDescription>
                Completa la información del curso. Los campos con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del curso *</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduce el título del curso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe el contenido y objetivos del curso" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de inicio</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de finalización</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="max_students"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Límite de estudiantes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="Ilimitado si se deja vacío"
                              {...field}
                              value={field.value === undefined ? '' : String(field.value)}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="ACTIVE">Activo</option>
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habilidades (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: React, Node.js, Diseño UX"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Separa las habilidades con comas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : 'Crear Curso'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProfessorCourses;
