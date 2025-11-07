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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, User, Mail, Calendar } from "lucide-react";

const ProfessorRequests = () => {
  const enrollmentRequests = [
    {
      id: 1,
      studentName: "Ana María López",
      studentEmail: "ana.lopez@universidad.edu",
      courseName: "Desarrollo Web Full Stack",
      requestDate: "18 Feb 2024",
      status: "Pendiente",
    },
    {
      id: 2,
      studentName: "Pedro Ramírez",
      studentEmail: "pedro.ramirez@universidad.edu",
      courseName: "Desarrollo Web Full Stack",
      requestDate: "17 Feb 2024",
      status: "Pendiente",
    },
    {
      id: 3,
      studentName: "Laura Martínez",
      studentEmail: "laura.martinez@universidad.edu",
      courseName: "Ciberseguridad Avanzada",
      requestDate: "16 Feb 2024",
      status: "Pendiente",
    },
  ];

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Inscripción</h1>
          <p className="text-muted-foreground mt-2">
            Revisa y aprueba solicitudes de estudiantes a tus cursos
          </p>
        </div>

        {enrollmentRequests.length > 0 ? (
          <div className="space-y-4">
            {enrollmentRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
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
                          <h3 className="font-semibold text-lg">
                            {request.studentName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            <span>{request.studentEmail}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {request.courseName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Solicitado: {request.requestDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-muted-foreground">
              Las nuevas solicitudes de inscripción aparecerán aquí
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfessorRequests;
