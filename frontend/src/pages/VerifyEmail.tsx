import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { verifyEmail } from '../api/authApi'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Используем useRef для защиты от повторных вызовов
  const hasVerified = useRef(false)

  useEffect(() => {
    // Если уже верифицировали, не делаем повторно
    if (hasVerified.current) return

    const email = searchParams.get('email')
    const code = searchParams.get('code')

    if (!email || !code) {
      setStatus('error')
      setErrorMessage('Неверная ссылка для подтверждения')
      return
    }

    const handleVerify = async () => {
      try {
        // Сразу помечаем, что начали верификацию
        hasVerified.current = true
        
        const data = await verifyEmail(email, code)
        
        // Сохраняем пользователя
        setAuth(data.accessToken, {
          id: data.userId,
          email: data.email,
          name: data.name,
          emailVerified: true,
        })
        
        setStatus('success')
        
        // Переходим на дашборд через 2 секунды
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)
        
      } catch (error: any) {
        console.error('Verification error:', error)
        
        // Если ошибка 400 и мы уже успешно верифицировали, игнорируем
        if (error.response?.status === 400 && hasVerified.current) {
          console.log('Already verified, ignoring duplicate error')
          return
        }
        
        setStatus('error')
        setErrorMessage('Ссылка недействительна или истекла')
      }
    }

    handleVerify()
  }, [searchParams, setAuth, navigate])

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Email подтверждён!</h1>
          <p className="text-purple-200/60">Перенаправляем на главную...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-8 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Ошибка подтверждения</h1>
          <p className="text-purple-200/60 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full"
          >
            Вернуться на страницу входа
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Подтверждение email</h1>
        <p className="text-purple-200/60">Пожалуйста, подождите...</p>
      </div>
    </div>
  )
}

export default VerifyEmail