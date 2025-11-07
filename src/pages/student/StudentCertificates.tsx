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
import { Award, Download, Share2, QrCode } from "lucide-react";
import { useLocation } from "react-router-dom";

const StudentCertificates = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";
  const certificates = [
    {
      id: 1,
      courseName: "Machine Learning Avanzado",
      professor: "Dr. Carlos Ruiz",
      issuedDate: "15 Feb 2024",
      skills: ["Python", "TensorFlow", "Data Science"],
      certificateCode: "CERT-2024-ML-001",
    },
    {
      id: 2,
      courseName: "Desarrollo Web Full Stack",
      professor: "Dr. María González",
      issuedDate: "10 Ene 2024",
      skills: ["React", "Node.js", "PostgreSQL"],
      certificateCode: "CERT-2024-WD-045",
    },
  ];

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
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="group hover:shadow-xl transition-all border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {cert.courseName}
                      </CardTitle>
                      <CardDescription>{cert.professor}</CardDescription>
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
                        {cert.certificateCode}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Emitido:</span>
                      <span className="ml-2 font-medium">
                        {cert.issuedDate}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

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
            ))}
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
