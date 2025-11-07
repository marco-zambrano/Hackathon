import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, User, Upload } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const StudentProfile = () => {
  const [profileProgress, setProfileProgress] = useState(100);
  const { profile } = useAuth();
  const location = useLocation();
  const role = location.pathname.startsWith("/professor") ? "professor" : "student";

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Completa tu información para generar CVs personalizados con IA
          </p>
        </div>

        {/* Profile Completion */}
        <Card className="border-primary/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Completitud del Perfil</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Completa todos los campos para desbloquear la generación de CV con IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{profileProgress}%</span>
              </div>
              <Progress value={profileProgress} className="h-2" />
            </div>
            {profileProgress === 100 && (
              <Button className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Generar CV con IA</span>
                <span className="sm:hidden">Generar CV</span>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Información Personal</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Esta información será utilizada para generar tu CV personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name} />
                  <AvatarFallback>
                    {profile?.first_name?.[0]}{profile?.last_name?.[0] || <User className="h-6 w-6 sm:h-8 sm:w-8" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Subir Foto</span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formato JPG o PNG. Tamaño máximo 2MB
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres" className="text-sm sm:text-base">Nombres</Label>
                  <Input 
                    id="nombres" 
                    placeholder="Juan Carlos" 
                    value={profile?.first_name || ''}
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos" className="text-sm sm:text-base">Apellidos</Label>
                  <Input 
                    id="apellidos" 
                    placeholder="Pérez García" 
                    value={profile?.last_name || ''}
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@universidad.edu"
                  value={profile?.email || ''}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nacimiento" className="text-sm sm:text-base">
                    Fecha de Nacimiento
                  </Label>
                  <Input 
                    id="nacimiento" 
                    type="date" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highschool" className="text-sm sm:text-base">
                    Universidad/Institución
                  </Label>
                  <Input 
                    id="highschool" 
                    placeholder="Universidad Nacional" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="softskills" className="text-sm sm:text-base">
                  Habilidades Blandas
                </Label>
                <Textarea
                  id="softskills"
                  placeholder="Trabajo en equipo, liderazgo, comunicación efectiva..."
                  className="min-h-[100px] text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Separa cada habilidad con una coma
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                className="w-full sm:w-auto sm:px-8" 
                size="lg"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button 
                className="w-full sm:w-auto sm:px-8 flex-1" 
                size="lg"
              >
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
