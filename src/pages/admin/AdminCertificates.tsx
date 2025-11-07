import { useState, useEffect } from "react";
import { supabase } from "@/backend/supabase-client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Certificate = {
  id: string;
  student_name: string;
  student_last_name: string;
  course_title: string;
  issue_date: string;
  status: "pending" | "approved" | "rejected";
  verification_code: string;
};

type DatabaseCertificate = {
  id: any;
  verification_code: any;
  status: any;
  issue_date: any;
  profiles: {
    first_name: any;
    last_name: any;
  }[];
  courses: {
    title: any;
  }[];
  created_at: string;
};

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          id,
          verification_code,
          status,
          issue_date,
          profiles:student_id (first_name, last_name),
          courses (title)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedCertificates = data.map((cert: DatabaseCertificate) => {
        const profile = cert.profiles?.[0] || {
          first_name: null,
          last_name: null,
        };
        const course = cert.courses?.[0] || { title: null };

        return {
          id: cert.id,
          student_name: profile.first_name || "N/A",
          student_last_name: profile.last_name || "N/A",
          course_title: course.title || "Curso no disponible",
          issue_date: new Date(cert.issue_date).toLocaleDateString(),
          status: cert.status || "pending",
          verification_code: cert.verification_code,
        };
      });

      setCertificates(formattedCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCertificate = async (
    certificateId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setVerifying((prev) => ({ ...prev, [certificateId]: true }));

      const { error } = await supabase
        .from("certificates")
        .update({ status })
        .eq("id", certificateId);

      if (error) throw error;

      // Update local state
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === certificateId ? { ...cert, status } : cert
        )
      );
    } catch (error) {
      console.error("Error updating certificate status:", error);
    } finally {
      setVerifying((prev) => ({ ...prev, [certificateId]: false }));
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.student_name.toLowerCase().includes(searchLower) ||
      cert.student_last_name.toLowerCase().includes(searchLower) ||
      cert.course_title.toLowerCase().includes(searchLower) ||
      cert.verification_code.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const baseStyles = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return (
          <span className={`${baseStyles} bg-green-100 text-green-800`}>
            Aprobado
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseStyles} bg-red-100 text-red-800`}>
            Rechazado
          </span>
        );
      default:
        return (
          <span className={`${baseStyles} bg-yellow-100 text-yellow-800`}>
            Pendiente
          </span>
        );
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Verificación de Certificados</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona y verifica los certificados emitidos
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido, curso o código de verificación..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Código de Verificación</TableHead>
                  <TableHead>Fecha de Emisión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">
                        {`${cert.student_name} ${cert.student_last_name}`}
                      </TableCell>
                      <TableCell>{cert.course_title}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {cert.verification_code}
                      </TableCell>
                      <TableCell>{cert.issue_date}</TableCell>
                      <TableCell>{getStatusBadge(cert.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {cert.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              handleVerifyCertificate(cert.id, "approved")
                            }
                            disabled={verifying[cert.id]}
                          >
                            {verifying[cert.id] ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                            )}
                            Aprobar
                          </Button>
                        )}
                        {cert.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-red-700 border-red-200 hover:bg-red-50"
                            onClick={() =>
                              handleVerifyCertificate(cert.id, "rejected")
                            }
                            disabled={verifying[cert.id]}
                          >
                            {verifying[cert.id] ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Rechazar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron certificados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCertificates;
