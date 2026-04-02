
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Dumbbell,
  FileText,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { useTemplates } from '../../hooks/useTemplates'
import { useTemplateStore } from '../../stores/templateStore'
import TemplateFormModal from '../../components/templates/TemplateFormModal'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { BODY_REGIONS, MUSCLE_GROUPS } from '../../constants/exerciseConstants'

const TemplateDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedTemplate, setSelectedTemplate } = useTemplateStore()
  const { templates, deleteTemplate, updateTemplate, isDeleting, isUpdating } = useTemplates()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Загружаем шаблон из store или из списка
  useEffect(() => {
    if (id) {
      const template = templates.find(t => t.id === id)
      if (template) {
        setSelectedTemplate(template)
      }
    }
  }, [id, templates, setSelectedTemplate])

  const handleDelete = async () => {
    if (!selectedTemplate) return
    await deleteTemplate(selectedTemplate.id)
    navigate('/templates', { replace: true })
  }

  const handleUpdate = async (data: any) => {
    if (!selectedTemplate) return
    await updateTemplate({ id: selectedTemplate.id, data })
    setShowEditModal(false)
  }

  // Форматирование даты
  const formatDate = (date?: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getBodyRegionEmoji = (bodyRegion: string) => {
    switch (bodyRegion) {
      case 'UPPER': return '💪'
      case 'LOWER': return '🦵'
      case 'CORE': return '🧘'
      case 'FULL_BODY': return '🧍'
      default: return '📍'
    }
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-200/60">Загрузка...</p>
        </div>
      </div>
    )
  }

  const exercisesCount = selectedTemplate.exercises?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/templates')}
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

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{selectedTemplate.name}</h1>
          {selectedTemplate.description && (
            <p className="text-slate-400 text-sm">{selectedTemplate.description}</p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <main className="px-6 max-w-2xl mx-auto space-y-4">
        {/* Статистика */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-300">
              <Dumbbell className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-500">Упражнений</p>
                <p className="text-lg font-semibold text-white">{exercisesCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-500">Обновлён</p>
                <p className="text-sm text-white">{formatDate(selectedTemplate.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Список упражнений */}
        {selectedTemplate.exercises && selectedTemplate.exercises.length > 0 && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
              Упражнения
            </h3>
            
            <div className="space-y-3">
              {selectedTemplate.exercises
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((te, idx) => {
                  const exercise = te.exercise
                  const bodyRegionLabel = BODY_REGIONS.find(r => r.value === exercise.bodyRegion)?.label || exercise.bodyRegion
                  const muscleGroupLabel = MUSCLE_GROUPS.find(m => m.value === exercise.muscleGroup)?.label || exercise.muscleGroup
                  
                  return (
                    <div
                      key={te.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/exercises/${exercise.id}`)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{getBodyRegionEmoji(exercise.bodyRegion)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 text-sm font-medium">#{idx + 1}</span>
                          <p className="text-white font-medium text-sm truncate">{exercise.name}</p>
                        </div>
                        <p className="text-slate-400 text-xs">
                          {bodyRegionLabel} • {muscleGroupLabel}
                        </p>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Мета-информация */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Информация
          </h3>
          
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Создано: {formatDate(selectedTemplate.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Обновлено: {formatDate(selectedTemplate.updatedAt)}</span>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Удалить шаблон"
        itemName={selectedTemplate.name}
        isDeleting={isDeleting}
      />

      {/* Edit Form Modal */}
      <TemplateFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        initialData={selectedTemplate}
        title="Редактировать шаблон"
        isSubmitting={isUpdating}
      />
    </div>
  )
}

export default TemplateDetails