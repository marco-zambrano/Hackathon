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
import { Award, Download, Share2, QrCode, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/backend/supabase-client";
import { Certificate, Course, Profile } from "@/types/database";

interface CertificateWithDetails extends Certificate {
  courses: Course & {
    professor?: Profile | null;
  };
}

const StudentCertificates = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<CertificateWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
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

        setCertificates((data ?? []) as CertificateWithDetails[]);
        console.log(data);
        

      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [profile?.id]);

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando certificados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Certificados</h1>
          <p className="text-muted-foreground mt-2">
            Certificados obtenidos y verificables mediante QR
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => {
              const course = cert.courses;
              const professor = course.professor;
              const professorName = professor 
                ? `${professor.first_name} ${professor.last_name}` 
                : 'Profesor';

              return (
                <Card
                  key={cert.id}
                  className="group hover:shadow-xl transition-all border-2 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          {course.title}
                        </CardTitle>
                        <CardDescription>{professorName}</CardDescription>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <QrCode className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Certificate Info */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="ml-2 font-mono font-medium">
                          {cert.readable_code}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Emitido:</span>
                        <span className="ml-2 font-medium">
                          {new Date(cert.created_at || '').toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {/* <div className="text-sm">
                        <span className="text-muted-foreground">Hash:</span>
                        <span className="ml-2 font-mono text-xs break-all">
                          {cert.hash.substring(0, 20)}...
                        </span>
                      </div> */}
                    </div>

                    {/* Course Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay certificados</h3>
            <p className="text-muted-foreground">
              Completa cursos para obtener tus primeros certificados
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
