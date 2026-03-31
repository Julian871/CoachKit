import React, { useState, useEffect } from 'react'
import { Camera, Phone, Send, Cake, FileText, Smile, User, X } from 'lucide-react'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
  title: string
}

const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData, title }: ClientFormModalProps) => {
  const [formData, setFormData] = useState({
  name: '',
  instagram: '',
  phone: '',
  telegram: '',
  avatar: '',
  birthDate: '',
  notes: '',
})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        instagram: initialData.instagram || '',
        phone: initialData.phone || '',
        telegram: initialData.telegram || '',
        avatar: initialData.avatar || '',
        birthDate: initialData.birthDate || '',
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
              Имя <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              placeholder="Иван Петров"
            />
          </div>

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

          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field w-full"
              placeholder="+375 33 123-45-67"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Telegram</label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className="input-field w-full"
              placeholder="@coack_kit"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Аватар (эмодзи)</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="input-field w-full"
              placeholder="💪"
              maxLength={2}
            />
            <p className="text-xs text-slate-500 mt-1 ml-1">Например: 💪 🏃 🧘</p>
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Дата рождения</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">Заметки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Дополнительная информация о клиенте..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Отмена
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientFormModal