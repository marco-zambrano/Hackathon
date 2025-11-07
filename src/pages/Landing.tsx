import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, rgb(245, 248, 252), rgb(255, 255, 250))'
      }}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl rounded-full" style={{ backgroundColor: 'rgba(66, 133, 244, 0.2)' }}></div>
            <div className="relative p-6 rounded-2xl shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
              <GraduationCap className="h-16 w-16" style={{ color: 'rgb(66, 133, 244)' }} />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ color: 'rgb(51, 51, 51)' }}>
              Credenciales Digitales
              <span className="block mt-2" style={{ color: 'rgb(66, 133, 244)' }}>
                Verificables y Seguras
              </span>
            </h1>

            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgb(102, 102, 102)' }}>
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
                style={{ 
                  backgroundColor: 'rgb(66, 133, 244)', 
                  color: 'rgb(255, 255, 255)',
                  border: 'none'
                }}
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 transition-all hover:bg-[#FFCC00]"
                style={{ 
                  backgroundColor: 'rgb(255, 255, 255)', 
                  color: 'rgb(51, 51, 51)',
                  borderColor: 'rgb(221, 221, 221)'
                }}
              >
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Info Text */}
          <p className="text-sm max-w-xl pt-4" style={{ color: 'rgb(153, 153, 153)' }}>
            Sistema de credenciales con firmas digitales verificables mediante
            QR. Emisión segura, validación instantánea y gestión integral de
            certificados académicos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(66, 133, 244, 0.1)' }}>
              <Award className="h-6 w-6" style={{ color: 'rgb(66, 133, 244)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(51, 51, 51)' }}>
              Certificados Digitales
            </h3>
            <p className="text-sm" style={{ color: 'rgb(102, 102, 102)' }}>
              Emite y gestiona microcredenciales para cursos, talleres y
              certificaciones profesionales.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255, 204, 0, 0.1)' }}>
              <Shield className="h-6 w-6" style={{ color: 'rgb(255, 204, 0)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(51, 51, 51)' }}>Verificación Segura</h3>
            <p className="text-sm" style={{ color: 'rgb(102, 102, 102)' }}>
              Validación mediante firma digital y QR verificable. Sistema
              robusto contra falsificaciones.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(66, 133, 244, 0.1)' }}>
              <Sparkles className="h-6 w-6" style={{ color: 'rgb(66, 133, 244)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(51, 51, 51)' }}>CV con IA</h3>
            <p className="text-sm" style={{ color: 'rgb(102, 102, 102)' }}>
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
