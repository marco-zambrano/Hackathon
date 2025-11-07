import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentCourses from "./pages/student/StudentCourses";
import StudentExplore from "./pages/student/StudentExplore";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProfile from "./pages/student/StudentProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import NotFound from "./pages/NotFound";
import ProfessorRequests from "./pages/professor/ProfessorRequests";
import ProfessorCourses from "./pages/professor/ProfessorCourses";
import ProfessorCertificates from "./pages/professor/ProfessorCertificates";
import ProfessorProfile from "./pages/professor/ProfessorProfile";
import ProfessorExplore from "./pages/professor/ProfessorExplore";
import VerifyCertificate from "./pages/VerifyCertificate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Landing - Accesible para todos */}
          <Route path="/" element={<Landing />} />
          
          {/* Públicas - Accesibles para todos */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          
          {/* Student Routes - Solo STUDENT */}
          <Route 
            path="/student/courses" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/explore" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentExplore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/certificates" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentCertificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Professor Routes - Solo PROFESSOR */}
          <Route 
            path="/professor/courses" 
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <ProfessorCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/explore" 
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <ProfessorExplore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/certificates" 
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <ProfessorCertificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/profile" 
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <ProfessorProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/requests" 
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <ProfessorRequests />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes - Solo ADMIN */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCourses />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
