import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Calendar, FileCheck, Loader2, FileText } from "lucide-react";
import { supabase } from "@/backend/supabase-client";

interface Course {
  id: number;
  title: string;
  description: string;
  status: string;
  max_students: number;
  start_date: string;
  end_date: string;
  created_at: string;
  professor_id: {
    first_name: string;
    last_name: string;
  };
  students_count?: number;
  certificates_count?: number;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // First, get the count of students for each course
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select('course_id, count')
        .eq('status', 'active');

      // Then, get the count of certificates for each course
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('course_id, count')
        .eq('status', 'approved');

      // Now get all courses with professor information
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          professor_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine the data
      const coursesWithCounts = coursesData?.map(course => {
        const studentCount = enrollmentsData
          ?.find(e => e.course_id === course.id)?.count || 0;
          
        const certificateCount = certificatesData
          ?.find(c => c.course_id === course.id)?.count || 0;

        return {
          ...course,
          students_count: studentCount,
          certificates_count: certificateCount
        };
      }) || [];

      setCourses(coursesWithCounts);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor_id.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor_id.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="bg-linear-to-r from-primary/5 to-primary/10 p-6 rounded-lg border border-border">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Administra y visualiza todos los cursos del sistema
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por título o profesor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow duration-200 border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {course.title}
                        </CardTitle>
                        <Badge
                          variant={course.status === "active" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {course.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Profesor: {course.professor_id.first_name} {course.professor_id.last_name}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Estudiantes</p>
                            <p className="font-medium">
                              {course.students_count} / {course.max_students}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                          <div className="p-2 rounded-full bg-accent/10 text-accent mr-3">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Inicio</p>
                            <p className="font-medium">
                              {new Date(course.start_date + 'T00:00:00').toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                          <div className="p-2 rounded-full bg-green-500/10 text-green-500 mr-3">
                            <FileCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Certificados</p>
                            <p className="font-medium">{course.certificates_count} emitidos</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium text-foreground">No se encontraron cursos</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay cursos disponibles en este momento'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
