import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Landing from "./pages/Landing"
import ProtectedRoute from "./routes/ProtectedRoute"
import FamilyLayout from "./pages/family/FamilyLayout"
import FamilyDashboard from "./pages/family/FamilyDashboard"
import MyPatients from "./pages/family/MyPatients"
import BrowseCaregivers from "./pages/family/BrowseCaregivers"
import BookService from "./pages/family/BookService"
import MyBookings from "./pages/family/MyBookings"
import CareNotes from "./pages/family/CareNotes"
import CaregiverLayout from "./pages/caregiver/CaregiverLayout"
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard"
import CaregiverProfile from "./pages/caregiver/CaregiverProfile"
import BookingRequests from "./pages/caregiver/BookingRequests"
import MySchedule from "./pages/caregiver/MySchedule"
import CaregiverNotes from "./pages/caregiver/CaregiverNotes"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import VerifyCaregivers from "./pages/admin/VerifyCaregivers"
import UserManagement from "./pages/admin/UserManagement"
import AdminBookings from "./pages/admin/AdminBookings"
import AdminServices from "./pages/admin/AdminServices"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"

function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Family Routes */}
      <Route path="/family" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <FamilyDashboard />
          </FamilyLayout>
        </ProtectedRoute>
      } />
      <Route path="/family/patients" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <MyPatients />
          </FamilyLayout>
        </ProtectedRoute>
      } />
      <Route path="/family/caregivers" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <BrowseCaregivers />
          </FamilyLayout>
        </ProtectedRoute>
      } />
      <Route path="/family/book/:caregiverId" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <BookService />
          </FamilyLayout>
        </ProtectedRoute>
      } />
      <Route path="/family/bookings" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <MyBookings />
          </FamilyLayout>
        </ProtectedRoute>
      } />
      <Route path="/family/care-notes" element={
        <ProtectedRoute allowedRole="user">
          <FamilyLayout>
            <CareNotes />
          </FamilyLayout>
        </ProtectedRoute>
      } />

      {/* Caregiver Routes */}
      <Route path="/caregiver" element={
        <ProtectedRoute allowedRole="caregiver">
          <CaregiverLayout>
            <CaregiverDashboard />
          </CaregiverLayout>
        </ProtectedRoute>
      } />
      <Route path="/caregiver/profile" element={
        <ProtectedRoute allowedRole="caregiver">
          <CaregiverLayout>
            <CaregiverProfile />
          </CaregiverLayout>
        </ProtectedRoute>
      } />
      <Route path="/caregiver/requests" element={
        <ProtectedRoute allowedRole="caregiver">
          <CaregiverLayout>
            <BookingRequests />
          </CaregiverLayout>
        </ProtectedRoute>
      } />
      <Route path="/caregiver/schedule" element={
        <ProtectedRoute allowedRole="caregiver">
          <CaregiverLayout>
            <MySchedule />
          </CaregiverLayout>
        </ProtectedRoute>
      } />
      <Route path="/caregiver/notes" element={
        <ProtectedRoute allowedRole="caregiver">
          <CaregiverLayout>
            <CaregiverNotes />
          </CaregiverLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/verify" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <VerifyCaregivers />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <AdminBookings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <AdminServices />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App