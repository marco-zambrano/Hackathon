import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Estudiantes",
      value: "1,234",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Profesores",
      value: "45",
      change: "+3.2%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cursos Activos",
      value: "128",
      change: "+8.1%",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Certificados Emitidos",
      value: "3,456",
      change: "+23.4%",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Nuevo certificado emitido",
      course: "Machine Learning Avanzado",
      student: "Ana López",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      action: "Curso creado",
      course: "Cloud Computing con AWS",
      professor: "Dr. Roberto Sánchez",
      time: "Hace 5 horas",
    },
    {
      id: 3,
      action: "Profesor asignado",
      professor: "Dra. Laura Méndez",
      user: "Admin",
      time: "Hace 1 día",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-2">
            Vista general del sistema de credenciales
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.course && `Curso: ${activity.course}`}
                      {activity.student && ` - ${activity.student}`}
                      {activity.professor && `Profesor: ${activity.professor}`}
                      {activity.user && ` por ${activity.user}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
