import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Dumbbell, 
  Activity, 
  Calendar,
  Mail,
  Camera,
  Phone,
  Send,
  Cake,
  FileText
} from 'lucide-react'
import { useClients } from '../../hooks/useClients'
import { useClientStore } from '../../stores/clientStore'
import DeleteConfirmModal from '../../components/clients/DeleteConfirmModal'
import ClientFormModal from '../../components/clients/ClientFormModal'
import BottomNavigation from '../../components/layout/BottomNavigation'


const ClientDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedClient, setSelectedClient } = useClientStore()
  const { clients, deleteClient, updateClient } = useClients()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Загружаем клиента из store или из списка
  useEffect(() => {
    if (id) {
      const client = clients.find(c => c.id === id)
      if (client) {
        setSelectedClient(client)
      }
    }
  }, [id, clients, setSelectedClient])

  const handleDelete = async () => {
    if (!selectedClient) return
    setIsDeleting(true)
    await deleteClient(selectedClient.id)
    setIsDeleting(false)
    navigate('/clients')
  }

  const handleUpdate = async (data: any) => {
    if (!selectedClient) return
    await updateClient({ id: selectedClient.id, data })
    setShowEditModal(false)
  }

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-200/60">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Определяем аватар
  const getAvatar = () => {
    if (selectedClient.avatar) {
      return <span className="text-5xl">{selectedClient.avatar}</span>
    }
    return <span className="text-white text-5xl font-bold">{selectedClient.name.charAt(0).toUpperCase()}</span>
  }

  // Форматирование даты
  const formatDate = (date?: string) => {
    if (!date) return '—'
    const [year, month, day] = date.split('-')
    return `${day}.${month}.${year}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-purple-400" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Avatar and Name */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-xl shadow-purple-500/20 mb-4">
            {getAvatar()}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{selectedClient.name}</h1>
        </div>
      </div>

      {/* Info Cards */}
      <main className="px-6 max-w-2xl mx-auto space-y-4">
        {/* Contact Info */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
  <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Контакты</h3>
  
  {selectedClient.instagram && (
    <a
      href={`https://instagram.com/${selectedClient.instagram.replace('@', '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-colors group"
    >
      <Camera className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
      <span>{selectedClient.instagram}</span>
    </a>
  )}
  
  {selectedClient.telegram && (
    <a
      href={`https://t.me/${selectedClient.telegram.startsWith('@') ? selectedClient.telegram.slice(1) : selectedClient.telegram}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-colors group"
    >
      <Send className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
      <span>{selectedClient.telegram}</span>
    </a>
  )}
  
  {selectedClient.phone && (
    <a
      href={`tel:${selectedClient.phone.replace(/[^0-9+]/g, '')}`}
      className="flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-colors group"
    >
      <Phone className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
      <span>{selectedClient.phone}</span>
    </a>
  )}
  
  {!selectedClient.instagram && !selectedClient.telegram && !selectedClient.phone && (
    <p className="text-slate-500 text-sm">Нет контактных данных</p>
  )}
</div>

        {/* Personal Info */}
        {(selectedClient.birthDate || selectedClient.notes) && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">О клиенте</h3>
            
            {selectedClient.birthDate && (
              <div className="flex items-center gap-3 text-slate-300">
                <Cake className="w-5 h-5 text-purple-400" />
                <span>{formatDate(selectedClient.birthDate)}</span>
              </div>
            )}
            
            {selectedClient.notes && (
              <div className="flex items-start gap-3 text-slate-300">
                <FileText className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{selectedClient.notes}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/30 transition-all active:scale-[0.98]">
            <Dumbbell className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-medium text-white">Добавить тренировку</span>
          </button>
          
          <button className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/30 transition-all active:scale-[0.98]">
            <Activity className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-medium text-white">Замеры</span>
          </button>
          
          <button className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/30 transition-all active:scale-[0.98]">
            <Calendar className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-medium text-white">История тренировок</span>
          </button>
          
          <button className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/30 transition-all active:scale-[0.98]">
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-medium text-white">Заметки</span>
          </button>
        </div>
      </main>

      <BottomNavigation />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        clientName={selectedClient.name}
        isDeleting={isDeleting}
      />

      {/* Edit Form Modal */}
      <ClientFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        initialData={selectedClient}
        title="Редактировать клиента"
      />
    </div>
  )
}

export default ClientDetails