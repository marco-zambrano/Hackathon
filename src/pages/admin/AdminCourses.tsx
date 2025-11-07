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
import { Search, Trash2, Eye, Users, Calendar, FileCheck, Plus, Loader2 } from "lucide-react";
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
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
          <p className="text-muted-foreground mt-2">
            Administra y visualiza todos los cursos disponibles
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Curso
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {course.title}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Profesor: {course.professor_id.first_name} {course.professor_id.last_name}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {course.students_count} / {course.max_students} estudiantes
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          Inicia: {new Date(course.start_date + 'T00:00:00').toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileCheck className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {course.certificates_count} certificados emitidos
                        </span>
                      </div>
                      <div>
                        <Badge
                          variant={course.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {course.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron cursos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
