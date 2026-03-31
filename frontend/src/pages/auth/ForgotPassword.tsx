import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react'
import { forgotPassword } from '../../api/authApi'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>('')
  const [touched, setTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validateEmail = (value: string) => {
    if (!value) return 'Введите email'
    if (!value.includes('@') || !value.includes('.')) return 'Введите корректный email адрес'
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched) {
      setError(validateEmail(value))
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setError(validateEmail(email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      setTouched(true)
      return
    }
    
    setIsLoading(true)
    
    try {
      await forgotPassword(email)
      navigate('/forgot-password-sent', { state: { email } })
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message
      
      if (status === 429) {
        setServerError('Слишком много попыток. Попробуйте позже')
      } else if (status === 400) {
        setError('Неверный формат email')
      } else if (message) {
        setServerError(message)
      } else {
        setServerError('Ошибка. Попробуйте позже')
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
          <h2 className="text-2xl font-bold mb-2">Забыли пароль?</h2>
          <p className="text-purple-200/60">
            Введите email, и мы отправим код для сброса пароля
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="example@coachkit.ru"
                className={`input-field pl-12 ${touched && error ? 'border-red-500 focus:border-red-500 ring-red-500/30' : ''}`}
                required
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {touched && error && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                Отправить код
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Вернуться к входу
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword