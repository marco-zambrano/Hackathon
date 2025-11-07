import { useState } from "react";
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
import { Search } from "lucide-react";

const VerifyCertificate = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [textToVerify, setTextToVerify] = useState("");
  const [activeTab, setActiveTab] = useState("code");

  const handleVerify = () => {
    // Verification logic will go here
    console.log("Verifying...", { verificationCode, textToVerify });
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
                <TabsTrigger value="text">Por Texto</TabsTrigger>
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

              <TabsContent value="text" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="textToVerify"
                      className="block text-sm font-medium mb-2"
                    >
                      Texto a Verificar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <textarea
                        id="textToVerify"
                        placeholder="Pega el texto del certificado que deseas verificar"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                        value={textToVerify}
                        onChange={(e) => setTextToVerify(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6">
                <Button className="w-full" size="lg" onClick={handleVerify}>
                  Verificar Certificado
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
