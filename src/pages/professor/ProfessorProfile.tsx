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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProfessorProfile = () => {
  const profileCompletion = 70;

  return (
    <DashboardLayout role="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu información personal y académica
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completitud del Perfil</CardTitle>
            <CardDescription>
              Completa tu perfil para generar tu CV con IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} />
            </div>
            {profileCompletion >= 100 && (
              <Button className="w-full" size="lg">
                <Sparkles className="h-5 w-5 mr-2" />
                Generar CV con IA
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Ej: Dr. Juan Pérez" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@universidad.edu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="+593 99 999 9999" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Ciudad, País" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título Profesional</Label>
                <Input
                  id="title"
                  placeholder="Ej: PhD en Ciencias de la Computación"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institución</Label>
                <Input
                  id="institution"
                  placeholder="Universidad o Institución"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Especialización</Label>
                <Input
                  id="specialization"
                  placeholder="Área de especialización"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Años de Experiencia</Label>
                <Input id="experience" type="number" placeholder="10" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía Profesional</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe tu experiencia y logros académicos..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Áreas de Conocimiento</Label>
                <Input
                  id="skills"
                  placeholder="Ej: Machine Learning, Bases de Datos"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="lg">
            Cancelar
          </Button>
          <Button size="lg">Guardar Cambios</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessorProfile;
