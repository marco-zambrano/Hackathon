import { useState, useEffect } from "react";
import { supabase } from "@/backend/supabase-client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
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
  issue_date: string | Date | null;
  status: "pending" | "approved" | "rejected";
  readable_code: string;
};

// Simplified the DatabaseCertificate type since we're now using a more direct approach

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    console.log('Código copiado:', code);
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      // First, let's get all columns to see what we're working with
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'certificates');
      
      console.log('Available columns in certificates table:', tableInfo?.map(col => col.column_name));
      
      // Try to fetch all columns to see the actual data structure
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1); // Just get one record to see the structure

      console.log('Sample certificate data:', data);
      
      if (error) throw error;
      if (!data || data.length === 0) {
        console.log('No certificates found');
        setCertificates([]);
        return;
      }

      // Now fetch the actual data we need with the correct column names
      const { data: certsData, error: fetchError } = await supabase
        .from('certificates')
        .select(`
          *,
          student_id (first_name, last_name),
          course_id (title)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedCertificates = certsData?.map((cert: any) => {
        console.log('Processing certificate:', cert);
        
        // Get the readable_code from the certificate data
        const verificationCode = cert.readable_code || 'N/A';
        
        const student = cert.student_id || { first_name: null, last_name: null };
        const course = cert.course_id || { title: null };

        return {
          id: cert.id,
          student_name: student.first_name || "N/A",
          student_last_name: student.last_name || "N/A",
          course_title: course.title || "Curso no disponible",
          issue_date: cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A",
          status: cert.status || "pending",
          readable_code: verificationCode
        } as Certificate;
      }) || [];

      setCertificates(formattedCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.readable_code.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
                        {cert.readable_code}
                      </TableCell>
                      <TableCell>{
                        cert.issue_date 
                          ? new Date(cert.issue_date + 'T00:00:00').toLocaleDateString('es-ES')
                          : 'N/A'
                      }</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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
