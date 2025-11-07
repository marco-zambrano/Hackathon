import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentCourses from "./pages/student/StudentCourses";
import StudentExplore from "./pages/student/StudentExplore";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProfile from "./pages/student/StudentProfile";
// import ProfessorRequests from "./pages/professor/ProfessorRequests";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminCourses from "./pages/admin/AdminCourses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/explore" element={<StudentExplore />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          
          {/* Professor Routes (reuse student pages + requests) */}
          {/* <Route path="/professor/courses" element={<StudentCourses />} />
          <Route path="/professor/explore" element={<StudentExplore />} />
          <Route path="/professor/certificates" element={<StudentCertificates />} />
          <Route path="/professor/profile" element={<StudentProfile />} />
          <Route path="/professor/requests" element={<ProfessorRequests />} /> */}
          
          {/* Admin Routes */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} /> */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
