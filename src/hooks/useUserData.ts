import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/backend/supabase-client';

/**
 * Custom hook to check if current user has a specific role
 */
export const useRole = () => {
  const { profile } = useAuth();
  
  return {
    isStudent: profile?.role === 'STUDENT',
    isProfessor: profile?.role === 'PROFESSOR',
    isAdmin: profile?.role === 'ADMIN',
    role: profile?.role,
  };
};

/**
 * Custom hook to fetch student's enrollments
 */
export const useStudentEnrollments = () => {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!profile?.id || profile.role !== 'STUDENT') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses (
              *,
              profiles:professor_id (name, last_name)
            )
          `)
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [profile?.id, profile?.role]);

  return { enrollments, loading, error };
};

/**
 * Custom hook to fetch professor's courses
 */
export const useProfessorCourses = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!profile?.id || profile.role !== 'PROFESSOR') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('professor_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [profile?.id, profile?.role]);

  return { courses, loading, error };
};

/**
 * Custom hook to fetch user's certificates
 */
export const useCertificates = () => {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
          .select(`
            *,
            courses (
              *,
              profiles:professor_id (name, last_name)
            )
          `)
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCertificates(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [profile?.id]);

  return { certificates, loading, error };
};


