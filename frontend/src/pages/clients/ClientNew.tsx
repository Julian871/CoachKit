import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Send, Cake, FileText, Smile, Camera } from 'lucide-react'
import { useClients } from '../../hooks/useClients'
import BottomNavigation from '../../components/layout/BottomNavigation'

const ClientNew = () => {
  const navigate = useNavigate()
  const { createClient, isCreating } = useClients()
  const [formData, setFormData] = useState({
  name: '',
  instagram: '',
  phone: '',
  telegram: '',
  avatar: '',
  birthDate: '',
  notes: '',
})
  const [errors, setErrors] = useState<{ name?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setErrors({ name: 'Имя обязательно' })
      return
    }
    
    setErrors({})
    
    await createClient(formData)
    navigate('/clients')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
        
        <h1 className="text-3xl font-bold text-white">Новый клиент</h1>
        <p className="text-slate-400 text-sm mt-1">Заполните информацию о клиенте</p>
      </div>

      {/* Form */}
      <main className="px-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
              Имя <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-field pl-12 w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Иван Петров"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Instagram */}
<div>
  <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Instagram</label>
  <div className="relative">
    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
    <input
      type="text"
      value={formData.instagram}
      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
      className="input-field pl-12 w-full"
      placeholder="@johndoe"
    />
  </div>
</div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Телефон</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field pl-12 w-full"
                placeholder="+7 999 123-45-67"
              />
            </div>
          </div>

          {/* Telegram */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Telegram</label>
            <div className="relative">
              <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="input-field pl-12 w-full"
                placeholder="@johndoe"
              />
            </div>
          </div>

          {/* Avatar Emoji */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Аватар (эмодзи)</label>
            <div className="relative">
              <Smile className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="input-field pl-12 w-full"
                placeholder="💪"
                maxLength={2}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Например: 💪 🏃 🧘</p>
          </div>

          {/* Birth Date */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Дата рождения</label>
            <div className="relative">
              <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="input-field pl-12 w-full"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Заметки</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field pl-12 w-full resize-none"
                rows={3}
                placeholder="Дополнительная информация о клиенте..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 pb-12">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 btn-primary"
            >
              {isCreating ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default ClientNew