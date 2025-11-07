import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-card p-6 rounded-2xl shadow-lg border">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Credenciales Digitales
              <span className="block text-primary mt-2">
                Verificables y Seguras
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Plataforma de emisión, validación y gestión de microcredenciales
              académicas. Certificados digitales con firma verificable para
              cursos, talleres y certificaciones.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:border-primary transition-all"
              >
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Info Text */}
          <p className="text-sm text-muted-foreground/70 max-w-xl pt-4">
            Sistema de credenciales con firmas digitales verificables mediante
            QR. Emisión segura, validación instantánea y gestión integral de
            certificados académicos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-all">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Certificados Digitales
            </h3>
            <p className="text-sm text-muted-foreground">
              Emite y gestiona microcredenciales para cursos, talleres y
              certificaciones profesionales.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-all">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verificación Segura</h3>
            <p className="text-sm text-muted-foreground">
              Validación mediante firma digital y QR verificable. Sistema
              robusto contra falsificaciones.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-all">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">CV con IA</h3>
            <p className="text-sm text-muted-foreground">
              Genera CVs personalizados con IA basados en tus credenciales y
              perfil profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
