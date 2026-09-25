import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Programs from './pages/Programs';
import Courses from './pages/Courses';
import AcademicTerms from './pages/AcademicTerms';
import CourseOfferings from './pages/CourseOfferings';
import Enrollments from './pages/Enrollments';
import Grades from './pages/Grades';
import MyProfile from './pages/MyProfile';
import MyEnrollments from './pages/MyEnrollments';
import MyGrades from './pages/MyGrades';
import MyAcademicRecord from './pages/MyAcademicRecord';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forbidden" element={<Forbidden />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar', 'instructor']}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programs"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                  <Programs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academic-terms"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                  <AcademicTerms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course-offerings"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar', 'instructor']}>
                  <CourseOfferings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollments"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                  <Enrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grades"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'registrar', 'instructor']}>
                  <Grades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-enrollments"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-grades"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyGrades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-academic-record"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyAcademicRecord />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;