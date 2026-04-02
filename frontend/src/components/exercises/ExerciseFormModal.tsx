
import React, { useState, useEffect } from 'react'
import { X, Dumbbell, Target, Activity, Info, Video, Image, FileText } from 'lucide-react'
import { ExerciseRequest, ExerciseResponse } from '../../api/exerciseApi'
import { BODY_REGIONS, MUSCLE_GROUPS, MOVEMENT_PATTERNS } from '../../constants/exerciseConstants'

interface ExerciseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExerciseRequest) => void
  initialData?: ExerciseResponse
  title: string
  isSubmitting?: boolean
}

const ExerciseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  isSubmitting = false,
}: ExerciseFormModalProps) => {
  const [formData, setFormData] = useState<ExerciseRequest>({
    name: '',
    bodyRegion: '',
    muscleGroup: '',
    targetMuscle: '',
    movementPattern: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        bodyRegion: initialData.bodyRegion || '',
        muscleGroup: initialData.muscleGroup || '',
        targetMuscle: initialData.targetMuscle || '',
        movementPattern: initialData.movementPattern || '',
        description: initialData.description || '',
        videoUrl: initialData.videoUrl || '',
        imageUrl: initialData.imageUrl || '',
      })
    } else {
      setFormData({
        name: '',
        bodyRegion: '',
        muscleGroup: '',
        targetMuscle: '',
        movementPattern: '',
        description: '',
        videoUrl: '',
        imageUrl: '',
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов'
    }

    if (!formData.bodyRegion) {
      newErrors.bodyRegion = 'Выберите регион тела'
    }

    if (!formData.muscleGroup) {
      newErrors.muscleGroup = 'Выберите группу мышц'
    }

    if (!formData.movementPattern) {
      newErrors.movementPattern = 'Выберите паттерн движения'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов'
    }

    if (formData.videoUrl && formData.videoUrl.length > 255) {
      newErrors.videoUrl = 'URL видео не должен превышать 255 символов'
    }

    if (formData.imageUrl && formData.imageUrl.length > 255) {
      newErrors.imageUrl = 'URL изображения не должен превышать 255 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof ExerciseRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Название */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
              Название <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Dumbbell className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field pl-12 w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Жим штанги лёжа"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Основные параметры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                Регион тела <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.bodyRegion}
                onChange={(e) => handleChange('bodyRegion', e.target.value)}
                className={`input-field w-full ${errors.bodyRegion ? 'border-red-500' : ''}`}
              >
                <option value="">Выберите регион</option>
                {BODY_REGIONS.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              {errors.bodyRegion && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.bodyRegion}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                Группа мышц <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.muscleGroup}
                onChange={(e) => handleChange('muscleGroup', e.target.value)}
                className={`input-field w-full ${errors.muscleGroup ? 'border-red-500' : ''}`}
              >
                <option value="">Выберите группу</option>
                {MUSCLE_GROUPS.map(muscle => (
                  <option key={muscle.value} value={muscle.value}>
                    {muscle.label}
                  </option>
                ))}
              </select>
              {errors.muscleGroup && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.muscleGroup}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                Паттерн движения <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.movementPattern}
                onChange={(e) => handleChange('movementPattern', e.target.value)}
                className={`input-field w-full ${errors.movementPattern ? 'border-red-500' : ''}`}
              >
                <option value="">Выберите паттерн</option>
                {MOVEMENT_PATTERNS.map(pattern => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
              {errors.movementPattern && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.movementPattern}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                Целевая мышца
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.targetMuscle}
                  onChange={(e) => handleChange('targetMuscle', e.target.value)}
                  className="input-field pl-12 w-full"
                  placeholder="Большая грудная"
                />
              </div>
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
              Описание
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="input-field pl-12 w-full resize-none"
                rows={3}
                placeholder="Техника выполнения, рекомендации..."
              />
            </div>
            {errors.description && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.description}</p>
            )}
          </div>

          {/* URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                URL изображения
              </label>
              <div className="relative">
                <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="input-field pl-12 w-full"
                  placeholder="https://example.com/image.png"
                />
              </div>
              {errors.imageUrl && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.imageUrl}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                URL видео
              </label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleChange('videoUrl', e.target.value)}
                  className="input-field pl-12 w-full"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              {errors.videoUrl && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.videoUrl}</p>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Отмена
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary">
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExerciseFormModal