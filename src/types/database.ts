// Database types for Supabase tables

export type UserRole = 'STUDENT' | 'PROFESSOR' | 'ADMIN';

export type CourseStatus = 'PENDING' | 'ACTIVE';

export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  birth_date?: string;
  high_school?: string;
  soft_skills?: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  skills?: string[];
  start_date?: string;
  end_date?: string;
  max_students?: number;
  professor_id: string;
  status: CourseStatus;
  created_at?: string;
  updated_at?: string;
  // Relations
  professor?: Profile;
}

export interface Enrollment {
  id: string;
  course_id: string;
  student_id: string;
  status: EnrollmentStatus;
  created_at?: string;
  updated_at?: string;
  // Relations
  course?: Course;
  student?: Profile;
}

export interface Certificate {
  id: string;
  readable_code: string;
  student_id: string;
  professor_id: string;
  course_id: string;
  digital_signature: string;
  issued_date?: string;
  expiration_date?: string;
  revoked: boolean;
  revoked_at?: string;
  revocation_reason?: string;
  pdf_url?: string;
  created_at?: string;
  // Relations
  course?: Course;
  student?: Profile;
  professor?: Profile;
}


