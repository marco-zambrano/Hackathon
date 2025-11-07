import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Mail, Lock, AlertCircle, User } from "lucide-react";
import { supabase } from "@/backend/supabase-client";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Usuario registrado:", data);
      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, rgb(245, 248, 252), rgb(255, 255, 250))'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-2xl shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <GraduationCap className="h-12 w-12" style={{ color: 'rgb(66, 133, 244)' }} />
          </div>
        </div>

        <Card className="shadow-xl" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center" style={{ color: 'rgb(51, 51, 51)' }}>
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-center" style={{ color: 'rgb(102, 102, 102)' }}>
              Regístrate para comenzar a obtener certificados
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" style={{ color: 'rgb(51, 51, 51)', fontWeight: 'bold' }}>
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgb(153, 153, 153)' }} />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: 'rgb(221, 221, 221)',
                      backgroundColor: 'rgb(255, 255, 255)'
                    }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: 'rgb(51, 51, 51)', fontWeight: 'bold' }}>
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgb(153, 153, 153)' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: 'rgb(221, 221, 221)',
                      backgroundColor: 'rgb(255, 255, 255)'
                    }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'rgb(51, 51, 51)', fontWeight: 'bold' }}>
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgb(153, 153, 153)' }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: 'rgb(221, 221, 221)',
                      backgroundColor: 'rgb(255, 255, 255)'
                    }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: 'rgb(51, 51, 51)', fontWeight: 'bold' }}>
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgb(153, 153, 153)' }} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: 'rgb(221, 221, 221)',
                      backgroundColor: 'rgb(255, 255, 255)'
                    }}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <AlertDescription className="text-green-700">
                    ¡Registro exitoso! Redirigiendo al login...
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                style={{
                  backgroundColor: 'rgb(66, 133, 244)',
                  color: 'rgb(255, 255, 255)',
                  border: 'none'
                }}
              >
                Registrarse
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center" style={{ color: 'rgb(51, 51, 51)' }}>
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="hover:underline font-medium"
                style={{ color: 'rgb(66, 133, 244)' }}
              >
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
