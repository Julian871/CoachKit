import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '../api/authApi'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Email автоматически подставляется из state
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Состояния для показа/скрытия пароля
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    
    if (!formData.email) {
      setErrorMessage('Email не найден. Пожалуйста, начните сброс пароля заново')
      return
    }
    
    if (!formData.code || formData.code.length !== 6) {
      setErrorMessage('Введите 6-значный код из письма')
      return
    }
    
    if (formData.newPassword.length < 8) {
      setErrorMessage('Пароль должен содержать минимум 8 символов')
      return
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Пароли не совпадают')
      return
    }
    
    setIsLoading(true)
    
    try {
      await resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      })
      navigate('/reset-password-success')
    } catch (error: any) {
      console.error('Reset password error:', error)
      
      if (error.response?.status === 400) {
        setErrorMessage('Неверный код или email')
      } else if (error.response?.status === 429) {
        setErrorMessage('Слишком много попыток. Попробуйте позже')
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage('Ошибка сброса пароля. Попробуйте позже')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
            CoachKit
          </h1>
          <h2 className="text-2xl font-bold mb-2">Сброс пароля</h2>
          <p className="text-purple-200/60">
            Введите код из письма и новый пароль
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email поле — только для чтения, автоматически подставляется */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                className="input-field pl-12 bg-slate-900/30 text-slate-300 cursor-not-allowed"
                required
                value={formData.email}
                readOnly
                disabled
              />
            </div>
            {formData.email && (
              <p className="text-xs text-purple-300/60 mt-1 ml-1">
                Код отправлен на этот email
              </p>
            )}
          </div>

          {/* Код из письма */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">КОД ИЗ ПИСЬМА</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="123456"
                className="input-field pl-12"
                required
                maxLength={6}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">6-значный код из письма</p>
          </div>

          {/* Новый пароль с глазком */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">НОВЫЙ ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="минимум 8 символов"
                className="input-field pl-12 pr-12"
                required
                minLength={8}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Минимум 8 символов</p>
          </div>

          {/* Подтверждение пароля с глазком */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ПОДТВЕРДИТЕ ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="повторите пароль"
                className="input-field pl-12 pr-12"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сброс...
              </>
            ) : (
              <>
                Сбросить пароль
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Запросить код заново
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword