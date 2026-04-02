// src/pages/exercises/ExerciseDetails.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Target, 
  Activity,
  FileText,
  Video,
  Calendar,
  Camera
} from 'lucide-react'
import { useExercises } from '../../hooks/useExercises'
import { useExerciseStore } from '../../stores/exerciseStore'
import ExerciseFormModal from '../../components/exercises/ExerciseFormModal'
import DeleteConfirmModal from '../../components/exercises/DeleteConfirmModal'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { BODY_REGIONS, MUSCLE_GROUPS, MOVEMENT_PATTERNS } from '../../constants/exerciseConstants'

const ExerciseDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedExercise, setSelectedExercise } = useExerciseStore()
  const { exercises, deleteExercise, updateExercise, isDeleting, isUpdating } = useExercises()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Загружаем упражнение из store или из списка
  useEffect(() => {
    if (id) {
      const exercise = exercises.find(e => e.id === id)
      if (exercise) {
        setSelectedExercise(exercise)
      }
    }
  }, [id, exercises, setSelectedExercise])

  const handleDelete = async () => {
    if (!selectedExercise) return
    await deleteExercise(selectedExercise.id)
    navigate('/exercises', { replace: true })
  }

  const handleUpdate = async (data: any) => {
    if (!selectedExercise) return
    await updateExercise({ id: selectedExercise.id, data })
    setShowEditModal(false)
  }

  // Получаем эмодзи в зависимости от региона тела
  const getBodyRegionEmoji = (bodyRegion: string) => {
    switch (bodyRegion) {
      case 'UPPER':
        return '💪'
      case 'LOWER':
        return '🦵'
      case 'CORE':
        return '🧘'
      case 'FULL_BODY':
        return '🧍'
      default:
        return '📍'
    }
  }

  // Получаем фоновый градиент в зависимости от региона тела
  const getBodyRegionGradient = (bodyRegion: string) => {
    switch (bodyRegion) {
      case 'UPPER':
        return 'from-purple-600 to-pink-600'
      case 'LOWER':
        return 'from-green-600 to-emerald-600'
      case 'CORE':
        return 'from-orange-600 to-red-600'
      case 'FULL_BODY':
        return 'from-blue-600 to-cyan-600'
      default:
        return 'from-purple-600 to-purple-800'
    }
  }

  if (!selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-200/60">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Получаем русские названия
  const bodyRegionLabel = BODY_REGIONS.find(r => r.value === selectedExercise.bodyRegion)?.label || selectedExercise.bodyRegion
  const muscleGroupLabel = MUSCLE_GROUPS.find(m => m.value === selectedExercise.muscleGroup)?.label || selectedExercise.muscleGroup
  const movementPatternLabel = MOVEMENT_PATTERNS.find(m => m.value === selectedExercise.movementPattern)?.label || selectedExercise.movementPattern

  // Форматирование даты
  const formatDate = (date?: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const bodyRegionEmoji = getBodyRegionEmoji(selectedExercise.bodyRegion)
  const gradientClass = getBodyRegionGradient(selectedExercise.bodyRegion)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/exercises')}
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

        {/* Image and Name - с динамической иконкой */}
        <div className="flex flex-col items-center text-center">
          
          <h1 className="text-2xl font-bold text-white mb-2">{selectedExercise.name}</h1>
          
          {/* Бейдж с регионом тела */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 mb-2">
            <span className="text-lg">{bodyRegionEmoji}</span>
            <span className="text-purple-300 text-sm font-medium">{bodyRegionLabel}</span>
          </div>
          
          {selectedExercise.targetMuscle && (
            <p className="text-slate-400 text-sm">
              Целевая мышца: <span className="text-white">{selectedExercise.targetMuscle}</span>
            </p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <main className="px-6 max-w-2xl mx-auto space-y-4">
        {/* Основная информация */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Характеристики
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-lg">{bodyRegionEmoji}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Регион тела</p>
                <p className="text-sm">{bodyRegionLabel}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Группа мышц</p>
                <p className="text-sm">{muscleGroupLabel}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Паттерн движения</p>
                <p className="text-sm">{movementPatternLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Описание */}
        {selectedExercise.description && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
              Описание
            </h3>
            <div className="flex items-start gap-3 text-slate-300">
              <FileText className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {selectedExercise.description}
              </p>
            </div>
          </div>
        )}

        {/* Видео */}
        {selectedExercise.videoUrl && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
              Демонстрация
            </h3>
            <a
              href={selectedExercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <Video className="w-5 h-5 group-hover:text-purple-300" />
              <span className="text-sm truncate">Смотреть видео</span>
            </a>

            <a
              href={selectedExercise.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <Camera className="w-5 h-5 group-hover:text-purple-300" />
              <span className="text-sm truncate">Смотреть фото</span>
            </a>
          </div>
        )}

        {/* Мета-информация */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Информация
          </h3>
          
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Создано: {formatDate(selectedExercise.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Обновлено: {formatDate(selectedExercise.updatedAt)}</span>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        exerciseName={selectedExercise.name}
        isDeleting={isDeleting}
      />

      {/* Edit Form Modal */}
      <ExerciseFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        initialData={selectedExercise}
        title="Редактировать упражнение"
        isSubmitting={isUpdating}
      />
    </div>
  )
}

export default ExerciseDetails