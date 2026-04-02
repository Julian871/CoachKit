
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
import ClientsList from './pages/clients/ClientsList'
import ClientDetails from './pages/clients/ClientDetails'
import ClientNew from './pages/clients/ClientNew'
import ExercisesList from './pages/exercises/ExercisesList'
import ExerciseDetails from './pages/exercises/ExerciseDetails'
import TemplatesList from './pages/templates/TemplatesList'
import TemplateDetails from './pages/templates/TemplateDetails'

const queryClient = new QueryClient()

function AppContent() {
  console.log('📱 AppContent mounted')
  useSessionRefresh()
  
  return (
    <Routes>
      {/* Публичные маршруты (без авторизации) */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-sent" element={<ForgotPasswordSent />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />

      {/* Защищенные маршруты (требуют авторизации) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/new" element={<ClientNew />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/exercises" element={<ExercisesList />} />
        <Route path="/exercises/:id" element={<ExerciseDetails />} />
        <Route path="/templates" element={<TemplatesList />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
      </Route>
      
      {/* Редирект по умолчанию */}
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