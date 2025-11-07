# Global State & Role-Based Dashboards Implementation Guide

## Overview

This implementation provides a global state management system using React Context for user authentication and profile data, along with role-specific dashboards that query Supabase tables based on the authenticated user's ID and role.

## Architecture

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

The AuthContext provides global access to:
- **user**: Authenticated user from Supabase Auth
- **profile**: User profile from the `profiles` table (id, email, name, last_name, role)
- **loading**: Loading state for initial authentication
- **refreshProfile()**: Method to manually refresh profile data
- **signOut()**: Method to sign out the user

### 2. Database Types (`src/types/database.ts`)

Type definitions for all Supabase tables:
- `Profile`: User profile with role (STUDENT, PROFESSOR, ADMIN)
- `Course`: Course information
- `Enrollment`: Student-course relationships
- `Certificate`: Issued certificates

### 3. Updated Components

#### ProtectedRoute
Now uses AuthContext instead of fetching auth data on every route, improving performance.

#### DashboardLayout
Displays the current user's name, email, and provides a logout button using AuthContext.

## Usage Examples

### Using AuthContext in a Component

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {profile?.name}!</h1>
      <p>Role: {profile?.role}</p>
      <p>Email: {profile?.email}</p>
    </div>
  );
}
```

### Querying Data Based on Current User

#### Example: Fetch Student's Enrollments

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/backend/supabase-client';

function StudentEnrollments() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!profile?.id) return;

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            *,
            profiles:professor_id (name, last_name)
          )
        `)
        .eq('student_id', profile.id);

      if (!error) setEnrollments(data || []);
    };

    fetchEnrollments();
  }, [profile?.id]);

  return <div>{/* Render enrollments */}</div>;
}
```

#### Example: Fetch Professor's Courses

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/backend/supabase-client';

function ProfessorCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!profile?.id) return;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('professor_id', profile.id);

      if (!error) setCourses(data || []);
    };

    fetchCourses();
  }, [profile?.id]);

  return <div>{/* Render courses */}</div>;
}
```

#### Example: Admin Dashboard Statistics

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/backend/supabase-client';

function AdminStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    activeCourses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [studentsRes, professorsRes, coursesRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'STUDENT'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'PROFESSOR'),
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        totalProfessors: professorsRes.count || 0,
        activeCourses: coursesRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return <div>{/* Render stats */}</div>;
}
```

## Updated Dashboard Pages

### Student Dashboard (`src/pages/student/StudentCourses.tsx`)
- Fetches enrollments for the current student using `profile.id`
- Displays enrolled courses with progress and details
- Respects RLS policies (students only see their own enrollments)

### Professor Dashboard (`src/pages/professor/ProfessorCourses.tsx`)
- Fetches courses created by the current professor using `profile.id`
- Shows enrollment counts for each course
- Respects RLS policies (professors only see their own courses)

### Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`)
- Fetches system-wide statistics
- Shows recent activity (certificates, courses)
- Admins can see all data based on RLS policies

### Student Certificates (`src/pages/student/StudentCertificates.tsx`)
- Fetches certificates for the current student
- Displays certificate details with course and professor information

## RLS Policy Compliance

All queries automatically respect Supabase Row Level Security (RLS) policies:

- **Students**: Can only query their own enrollments and certificates
- **Professors**: Can only query their own courses and related data
- **Admins**: Have broader access based on configured policies

The queries use the authenticated user's session, which Supabase uses to enforce RLS policies automatically.

## Key Benefits

1. **Centralized State**: User and profile data are fetched once and shared across the app
2. **Performance**: No redundant auth/profile fetches on every route
3. **Type Safety**: Full TypeScript support with database types
4. **Security**: All queries respect RLS policies automatically
5. **Maintainability**: Easy to extend with new features or roles

## Adding New Queries

To add a new query for user-specific data:

1. Import `useAuth` from `@/contexts/AuthContext`
2. Get the `profile` object
3. Use `profile.id` or `profile.role` to filter your Supabase queries
4. The query will automatically respect RLS policies

```typescript
const { profile } = useAuth();

const { data } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', profile.id); // Filter by current user
```

## Notes

- The AuthContext automatically listens for auth state changes
- Profile data is refreshed when the user signs in/out
- Use `refreshProfile()` if you need to manually update profile data
- All dashboard pages include loading states and error handling


