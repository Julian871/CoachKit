
import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  exerciseName: string
  isDeleting: boolean
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, exerciseName, isDeleting }: DeleteConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Удалить упражнение</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-slate-300 mb-6">
          Вы уверены, что хотите удалить <span className="text-white font-semibold">{exerciseName}</span>? 
          Это действие нельзя отменить.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
            disabled={isDeleting}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal