import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/backend/supabase-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Certificate = {
  id: string;
  student_name: string;
  student_last_name: string;
  course_title: string;
  issue_date: string;
  status: 'pending' | 'approved' | 'rejected';
  verification_code: string;
};

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState(
    searchParams.get('code') || ''
  );
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError('Por favor ingresa un código de verificación');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('certificates')
        .select(`
          id,
          verification_code,
          status,
          issue_date,
          profiles:student_id (first_name, last_name),
          courses (title)
        `)
        .eq('verification_code', verificationCode.trim())
        .single();

      if (fetchError) throw fetchError;
      if (!data) {
        throw new Error('No se encontró ningún certificado con este código');
      }

      const profile = data.profiles?.[0] || { first_name: null, last_name: null };
      const course = data.courses?.[0] || { title: null };

      setCertificate({
        id: data.id,
        student_name: profile.first_name || 'N/A',
        student_last_name: profile.last_name || 'N/A',
        course_title: course.title || 'Curso no disponible',
        issue_date: new Date(data.issue_date).toLocaleDateString(),
        status: data.status || 'pending',
        verification_code: data.verification_code,
      });
    } catch (err: any) {
      setError(err.message || 'Error al verificar el certificado');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verificar Certificado</h1>
          <p className="text-muted-foreground">
            Verifica la autenticidad de un certificado
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Verificar por Código</CardTitle>
            <CardDescription>
              Ingresa el código de verificación del certificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Código de verificación"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <Button 
                  onClick={handleVerify}
                  disabled={loading || !verificationCode.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verificar
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-sm text-red-500 flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              {certificate && (
                <Card className="mt-6 border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-800">
                        Certificado Válido
                      </CardTitle>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardDescription>
                      Los detalles del certificado se muestran a continuación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estudiante</p>
                        <p className="font-medium">
                          {certificate.student_name} {certificate.student_last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Curso</p>
                        <p className="font-medium">{certificate.course_title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                        <p className="font-medium">{certificate.issue_date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estado</p>
                        <p className="font-medium">
                          {certificate.status === 'approved' ? (
                            <span className="text-green-600">Aprobado</span>
                          ) : certificate.status === 'rejected' ? (
                            <span className="text-red-600">Rechazado</span>
                          ) : (
                            <span className="text-amber-600">Pendiente</span>
                          )}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Código de Verificación</p>
                        <p className="font-mono font-medium bg-gray-100 p-2 rounded-md">
                          {certificate.verification_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Problemas para verificar? Contacta al soporte técnico
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCertificate;
