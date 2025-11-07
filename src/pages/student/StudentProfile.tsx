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
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Completa tu información para generar CVs personalizados con IA
          </p>
        </div>

        {/* Profile Completion */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Completitud del Perfil</CardTitle>
            <CardDescription>
              Completa todos los campos para desbloquear la generación de CV con
              IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                Gen erar CV con IA
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Esta información será utilizada para generar tu CV personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Subir Foto
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" placeholder="Juan Carlos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" placeholder="Pérez García" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.perez@universidad.edu"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nacimiento">Fecha de Nacimiento</Label>
                <Input id="nacimiento" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highschool">Universidad/Institución</Label>
                <Input id="highschool" placeholder="Universidad Nacional" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="softskills">Habilidades Blandas</Label>
              <Textarea
                id="softskills"
                placeholder="Trabajo en equipo, liderazgo, comunicación efectiva..."
                className="min-h-[100px]"
              />
            </div>

            <Button className="w-full" size="lg">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
