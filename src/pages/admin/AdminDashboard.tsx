import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Award, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/backend/supabase-client";
import { Course, Certificate, Enrollment, Profile } from "@/types/database";

interface Stats {
  totalStudents: number;
  totalProfessors: number;
  activeCourses: number;
  totalCertificates: number;
}

interface RecentActivity {
  id: string;
  action: string;
  details: string;
  time: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalProfessors: 0,
    activeCourses: 0,
    totalCertificates: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch counts in parallel
        const [studentsRes, professorsRes, coursesRes, certificatesRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'STUDENT'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'PROFESSOR'),
          supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
          supabase.from('certificates').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalStudents: studentsRes.count || 0,
          totalProfessors: professorsRes.count || 0,
          activeCourses: coursesRes.count || 0,
          totalCertificates: certificatesRes.count || 0,
        });

        // Fetch recent certificates
        const { data: recentCerts } = await supabase
          .from('certificates')
          .select(`
            id,
            created_at,
            courses (title),
            profiles:student_id (name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        // Fetch recent courses
        const { data: recentCourses } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            created_at,
            profiles:professor_id (name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(2);

        // Combine and format activity
        const activities: RecentActivity[] = [];

        if (recentCerts) {
          recentCerts.forEach((cert: any) => {
            const student = cert.profiles;
            const course = cert.courses;
            activities.push({
              id: cert.id,
              action: 'Nuevo certificado emitido',
              details: `${course?.title || 'Curso'} - ${student?.name || ''} ${student?.last_name || ''}`,
              time: getRelativeTime(cert.created_at),
            });
          });
        }

        if (recentCourses) {
          recentCourses.forEach((course: any) => {
            const professor = course.profiles;
            activities.push({
              id: course.id,
              action: 'Curso creado',
              details: `${course.title} - ${professor?.name || ''} ${professor?.last_name || ''}`,
              time: getRelativeTime(course.created_at),
            });
          });
        }

        // Sort by most recent
        activities.sort((a, b) => {
          const timeA = parseRelativeTime(a.time);
          const timeB = parseRelativeTime(b.time);
          return timeA - timeB;
        });

        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  };

  const parseRelativeTime = (timeStr: string): number => {
    const match = timeStr.match(/\d+/);
    if (!match) return 0;
    const num = parseInt(match[0]);
    if (timeStr.includes('minutos')) return num;
    if (timeStr.includes('horas')) return num * 60;
    if (timeStr.includes('días')) return num * 60 * 24;
    return 0;
  };

  const statsData = [
    {
      title: "Total Estudiantes",
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Profesores",
      value: stats.totalProfessors.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cursos Activos",
      value: stats.activeCourses.toString(),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Certificados Emitidos",
      value: stats.totalCertificates.toString(),
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          {statsData.map((stat) => (
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
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
