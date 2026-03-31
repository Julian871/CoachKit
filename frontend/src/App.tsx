
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSessionRefresh } from './hooks/useSessionRefresh'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import VerifyEmail from './pages/auth/VerifyEmail'
import VerifyEmailSent from './pages/auth/VerifyEmailSent'
import ForgotPassword from './pages/auth/ForgotPassword'
import ForgotPasswordSent from './pages/auth/ForgotPasswordSent'
import ResetPassword from './pages/auth/ResetPassword'
import ResetPasswordSuccess from './pages/auth/ResetPasswordSuccess'
import ProtectedRoute from './components/auth/ProtectedRoute'

const queryClient = new QueryClient()

function AppContent() {
  console.log('📱 AppContent mounted')
  useSessionRefresh()
  
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-sent" element={<ForgotPasswordSent />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  )
}

export default App