import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, User, Mail, Calendar } from "lucide-react";
import { supabase } from "@/backend/supabase-client";
import { useAuth } from "@/contexts/AuthContext";
import type { Enrollment, Course, Profile } from "@/types/database";

interface EnrollmentRequest extends Enrollment {
  course: Course & {
    professor?: Profile | null;
  };
  student: Profile | null;
}

const ProfessorRequests = () => {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            *,
            course:courses!inner (
              *,
              professor:profiles!courses_professor_id_fkey (
                id,
                first_name,
                last_name,
                email,
                avatar_url
              )
            ),
            student:profiles!enrollments_student_id_fkey (
              id,
              first_name,
              last_name,
              email,
              avatar_url
            )
          `)
          .eq("course.professor_id", profile.id)
          .eq("status", "PENDING")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setRequests((data ?? []) as EnrollmentRequest[]);
      } catch (err) {
        console.error("Error fetching enrollment requests", err);
        setError("No se pudieron cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [profile?.id]);

  const handleDecision = async (requestId: string, nextStatus: "APPROVED" | "REJECTED") => {
    try {
      setProcessingId(requestId);
      const { error } = await supabase
        .from("enrollments")
        .update({ status: nextStatus })
        .eq("id", requestId);

      if (error) throw error;

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error(`Error updating enrollment ${requestId}`, err);
      setError("No se pudo actualizar la solicitud. Intenta de nuevo.");
    } finally {
      setProcessingId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Card className="p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Cargando solicitudes...</h3>
          <p className="text-muted-foreground">Esto puede tardar unos segundos.</p>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="p-12 text-center border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold mb-2 text-red-700">Ocurrió un error</h3>
          <p className="text-red-600">{error}</p>
        </Card>
      );
    }

    if (requests.length === 0) {
      return (
        <Card className="p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay solicitudes pendientes</h3>
          <p className="text-muted-foreground">
            Las nuevas solicitudes de inscripción aparecerán aquí
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {requests.map((request) => {
          const studentName = request.student
            ? `${request.student.first_name} ${request.student.last_name}`
            : "Estudiante";
          const studentEmail = request.student?.email ?? "Sin correo";
          const courseTitle = request.course?.title ?? "Curso";
          const requestedAt = request.created_at
            ? new Date(request.created_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "--";

          return (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">{studentName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{studentEmail}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{courseTitle}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Solicitado: {requestedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      disabled={processingId === request.id}
                      onClick={() => handleDecision(request.id, "APPROVED")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {processingId === request.id ? "Aprobando..." : "Aprobar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingId === request.id}
                      onClick={() => handleDecision(request.id, "REJECTED")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {processingId === request.id ? "Procesando..." : "Rechazar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Inscripción</h1>
          <p className="text-muted-foreground mt-2">
            Revisa y aprueba solicitudes de estudiantes a tus cursos
          </p>
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default ProfessorRequests;
