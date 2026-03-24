import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, LogIn, RefreshCw, AlertCircle } from 'lucide-react'
import { resendVerification } from '../api/authApi'

const VerifyEmailSent = () => {
  const location = useLocation()
  const email = location.state?.email || 'ваш email'
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage('')
    setErrorMessage('')
    
    try {
      // Передаём email в функцию
      await resendVerification(email)
      setResendMessage('Письмо отправлено повторно! Проверьте почту')
    } catch (error: any) {
      console.error('Resend error:', error)
      
      if (error.response?.status === 429) {
        setErrorMessage('Слишком много попыток. Попробуйте позже')
      } else if (error.response?.status === 400) {
        setErrorMessage('Неверный email. Пожалуйста, проверьте адрес')
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage('Ошибка при отправке. Попробуйте позже')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Mail className="w-10 h-10 text-purple-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Проверьте почту</h1>
        <p className="text-purple-200/60 mb-6">
          Мы отправили письмо с подтверждением на <br />
          <span className="text-white font-medium">{email}</span>
        </p>

        {/* Сообщение об ошибке */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Сообщение об успехе */}
        {resendMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 text-sm">{resendMessage}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            Войти
          </Link>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Отправка...' : 'Отправить ссылку ещё раз'}
          </button>
        </div>

        {/* Подсказка про спам */}
        <p className="text-xs text-slate-500 mt-6">
          Не нашли письмо? Проверьте папку "Спам" или нажмите кнопку выше
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailSent