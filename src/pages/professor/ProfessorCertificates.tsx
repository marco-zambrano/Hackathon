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
import { Award, Download, Calendar, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Certificate, Course, Profile } from "@/types/database";
import { supabase } from "@/backend/supabase-client";

interface CertificateWithDetails extends Certificate {
  courses: Course & {
    professor?: Profile | null;
  };
  student?: Profile | null;
}

const ProfessorCertificates = () => {
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
          .from("certificates")
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
            ),
            student:profiles!certificates_student_id_fkey (
              id,
              first_name,
              last_name,
              email,
              avatar_url
            )
          `)
          .eq("professor_id", profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setCertificates((data ?? []) as CertificateWithDetails[]);

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
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Certificados</h1>
          <p className="text-muted-foreground mt-2">
            Certificados obtenidos en tu formación profesional
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => {
              const course = cert.courses;
              const student = cert.student;
              const studentName = student
                ? `${student.first_name} ${student.last_name}`
                : "Estudiante";
              const issuedDate = cert.issued_date
                ? new Date(cert.issued_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "--";

              return (
              <Card
                key={cert.id}
                className="hover:shadow-lg transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {studentName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Emitido: {issuedDate}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Código: <span className="font-mono">{cert.readable_code}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="h-4 w-4" />
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
            <h3 className="text-lg font-semibold mb-2">
              No tienes certificados aún
            </h3>
            <p className="text-muted-foreground">
              Completa cursos para obtener tus certificados
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfessorCertificates;
