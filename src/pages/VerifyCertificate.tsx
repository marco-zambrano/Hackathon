import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, CheckCircle, XCircle, Loader2, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/backend/supabase-client";

interface CertificateData {
  id?: string;
  readable_code?: string;
  student_id?: string;
  course_id?: string;
  student_name?: string;
  course_name?: string;
  issued_date?: string;
  expiration_date?: string | null;
  revoked?: boolean;
  revoked_at?: string | null;
  revocation_reason?: string | null;
  pdf_url?: string | null;
  created_at?: string;
}

interface VerificationResult {
  valid: boolean;
  message?: string;
  certificate?: CertificateData;
}

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [readableCode, setReadableCode] = useState("");
  const [activeTab, setActiveTab] = useState("code");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      let uuid = "";

      if (activeTab === "code") {
        const verificationId = verificationCode.trim();
        if (!verificationId) {
          setVerificationResult({ valid: false, message: "Por favor ingresa un código de verificación" });
          setIsVerifying(false);
          return;
        }
        uuid = verificationId;
      } else {
        // Para código legible: primero obtener el certificado de la tabla certificates
        const readableId = readableCode.trim();
        if (!readableId) {
          setVerificationResult({ valid: false, message: "Por favor ingresa un código legible" });
          setIsVerifying(false);
          return;
        }

        // Obtener el certificado de la tabla certificates usando readable_code
        const { data: certificateData, error: certError } = await supabase
          .from("certificates")
          .select("id")
          .eq("readable_code", readableId)
          .single();

        if (certError || !certificateData) {
          throw new Error("Certificado no encontrado con el código legible proporcionado");
        }

        // Extraer el UUID del certificado
        uuid = certificateData.id;
        if (!uuid) {
          throw new Error("No se pudo obtener el UUID del certificado");
        }
      }

      // Ejecutar la función usando solo el UUID
      const { data, error } = await supabase.functions.invoke(`Verify-Certificate?id=${uuid}`);

      if (error) throw error;

      setVerificationResult(data);
      console.log('Verification result:', data);
    } catch (error: any) {
      console.error('Error verifying certificate:', error.message);
      setVerificationResult({ valid: false, message: error.message || "Error al verificar el certificado" });
    } finally {
      setIsVerifying(false);
    }
  };

  // Verificar automáticamente si hay un parámetro id en la URL
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    
    if (idFromUrl) {
      // Establecer el código y tab inmediatamente
      setVerificationCode(idFromUrl);
      setActiveTab("code");
      
      // Verificar automáticamente de inmediato
      setIsVerifying(true);
      setVerificationResult(null);

      const verifyFromUrl = async () => {
        try {
          const { data, error } = await supabase.functions.invoke(`Verify-Certificate?id=${idFromUrl}`);

          if (error) throw error;

          setVerificationResult(data);
          console.log('Verification result from URL:', data);
        } catch (error: any) {
          console.error('Error verifying certificate from URL:', error.message);
          setVerificationResult({ valid: false, message: error.message || "Error al verificar el certificado" });
        } finally {
          setIsVerifying(false);
        }
      };

      // Ejecutar inmediatamente
      verifyFromUrl();
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verificar Certificado</h1>
          <p className="text-muted-foreground">
            Verifica la autenticidad de un certificado
          </p>
        </div>

        {/* Mostrar resultado de verificación arriba */}
        {isVerifying && !verificationResult && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">Verificando certificado...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationResult && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              {verificationResult.valid ? (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong className="font-semibold text-lg">Certificado Válido</strong>
                    {verificationResult.message && (
                      <p className="mt-2">{verificationResult.message}</p>
                    )}
                    {verificationResult.certificate && (
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {verificationResult.certificate.readable_code && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Código de Certificado</p>
                              <p className="font-mono font-semibold">{verificationResult.certificate.readable_code}</p>
                            </div>
                          )}
                          {verificationResult.certificate.student_name && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Estudiante</p>
                              <p className="font-medium">{verificationResult.certificate.student_name}</p>
                            </div>
                          )}
                          {verificationResult.certificate.course_name && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Curso</p>
                              <p className="font-medium">{verificationResult.certificate.course_name}</p>
                            </div>
                          )}
                          {verificationResult.certificate.issued_date && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Fecha de Emisión</p>
                              <p className="font-medium">{new Date(verificationResult.certificate.issued_date).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                            </div>
                          )}
                          {verificationResult.certificate.expiration_date && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Fecha de Expiración</p>
                              <p className="font-medium">{new Date(verificationResult.certificate.expiration_date).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                            </div>
                          )}
                          {verificationResult.certificate.revoked !== undefined && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Estado</p>
                              <p className={`font-medium ${verificationResult.certificate.revoked ? 'text-red-600' : 'text-green-600'}`}>
                                {verificationResult.certificate.revoked ? 'Revocado' : 'Válido'}
                              </p>
                            </div>
                          )}
                          {verificationResult.certificate.revoked_at && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Fecha de Revocación</p>
                              <p className="font-medium text-red-600">
                                {new Date(verificationResult.certificate.revoked_at).toLocaleDateString('es-ES', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                        {verificationResult.certificate.revocation_reason && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Razón de Revocación</p>
                            <p className="text-sm text-red-800 dark:text-red-200">{verificationResult.certificate.revocation_reason}</p>
                          </div>
                        )}
                        {verificationResult.certificate.pdf_url && (
                          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                            <a
                              href={verificationResult.certificate.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium"
                            >
                              <FileText className="h-4 w-4" />
                              Ver Certificado PDF
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong className="font-semibold text-lg">Certificado Inválido</strong>
                    {verificationResult.message && (
                      <p className="mt-2">{verificationResult.message}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Método de Verificación</CardTitle>
            <CardDescription>
              Selecciona cómo deseas verificar el certificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Por Código</TabsTrigger>
                <TabsTrigger value="readable">Por código legible</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="verificationCode"
                      className="block text-sm font-medium mb-2"
                    >
                      Código de Verificación
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="Ingresa el código del certificado"
                        className="pl-10"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      El código se encuentra en la parte inferior del
                      certificado
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="readable" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="readableCode"
                      className="block text-sm font-medium mb-2"
                    >
                      Código Legible
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="readableCode"
                        type="text"
                        placeholder="Ingresa el código legible del certificado"
                        className="pl-10"
                        value={readableCode}
                        onChange={(e) => setReadableCode(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      El código legible se encuentra en el certificado
                    </p>
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleVerify}
                  disabled={isVerifying || (activeTab === "code" && !verificationCode.trim()) || (activeTab === "readable" && !readableCode.trim())}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Certificado"
                  )}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>¿Problemas para verificar? Contacta al soporte técnico</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
