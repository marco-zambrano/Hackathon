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
import { Award, Download, Calendar } from "lucide-react";

const ProfessorCertificates = () => {
  const certificates = [
    {
      id: 1,
      courseName: "Metodologías Ágiles",
      issuer: "Instituto Superior de TI",
      issueDate: "15 Ene 2024",
      skills: ["Scrum", "Kanban", "Gestión de Proyectos"],
    },
    {
      id: 2,
      courseName: "Liderazgo Educativo",
      issuer: "Universidad Nacional",
      issueDate: "20 Nov 2023",
      skills: ["Liderazgo", "Pedagogía", "Gestión Académica"],
    },
  ];

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
            {certificates.map((cert) => (
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
                            {cert.courseName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Emitido: {cert.issueDate}</span>
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
            ))}
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
