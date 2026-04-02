
import React, { useState, useEffect } from 'react'
import { X, Plus, GripVertical, Trash2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TemplateResponse, TemplateRequest, TemplateExerciseRequest } from '../../api/templateApi'
import { ExerciseResponse } from '../../api/exerciseApi'
import ExerciseSelectorModal from './ExerciseSelectorModal'
import SortableExerciseItem from './SortableExerciseItem'

interface TemplateFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TemplateRequest) => void
  initialData?: TemplateResponse
  title: string
  isSubmitting?: boolean
}

const TemplateFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  isSubmitting = false,
}: TemplateFormModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<(ExerciseResponse & { orderIndex: number })[]>([])
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; exercises?: string }>({})
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      // Преобразуем exercises в нужный формат с orderIndex
      const exercisesWithOrder = (initialData.exercises || [])
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((te) => ({
          ...te.exercise,
          orderIndex: te.orderIndex,
        }))
      setSelectedExercises(exercisesWithOrder)
    } else {
      setName('')
      setDescription('')
      setSelectedExercises([])
    }
    setErrors({})
  }, [initialData, isOpen])
  
  const handleAddExercise = (exercise: ExerciseResponse) => {
    const newExercise = {
      ...exercise,
      orderIndex: selectedExercises.length,
    }
    setSelectedExercises([...selectedExercises, newExercise])
  }
  
  const handleRemoveExercise = (index: number) => {
    const newExercises = selectedExercises.filter((_, i) => i !== index)
    // Обновляем orderIndex
    newExercises.forEach((ex, idx) => {
      ex.orderIndex = idx
    })
    setSelectedExercises(newExercises)
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = selectedExercises.findIndex((_, i) => i.toString() === active.id)
      const newIndex = selectedExercises.findIndex((_, i) => i.toString() === over.id)
      
      const newExercises = arrayMove(selectedExercises, oldIndex, newIndex)
      // Обновляем orderIndex
      newExercises.forEach((ex, idx) => {
        ex.orderIndex = idx
      })
      setSelectedExercises(newExercises)
    }
  }
  
  const validate = (): boolean => {
    const newErrors: { name?: string; exercises?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Название обязательно'
    } else if (name.length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов'
    }
    
    if (selectedExercises.length === 0) {
      newErrors.exercises = 'Добавьте хотя бы одно упражнение'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    const exercises: TemplateExerciseRequest[] = selectedExercises.map((ex, idx) => ({
      exerciseId: ex.id,
      orderIndex: idx,
    }))
    
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      exercises,
    })
  }
  
  if (!isOpen) return null
  
  return (
    <>
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Тренировка груди"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>
              )}
            </div>
            
            {/* Описание */}
            <div>
              <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field w-full resize-none"
                rows={3}
                placeholder="Описание тренировки..."
              />
            </div>
            
            {/* Упражнения */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-purple-200 ml-1">
                  Упражнения <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowExerciseSelector(true)}
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
              </div>
              
              {errors.exercises && (
                <p className="text-red-400 text-xs mb-2 ml-1">{errors.exercises}</p>
              )}
              
              {selectedExercises.length === 0 ? (
                <div className="text-center py-8 rounded-xl bg-slate-800/30 border border-dashed border-purple-500/30">
                  <p className="text-slate-400 text-sm">Нет упражнений</p>
                  <button
                    type="button"
                    onClick={() => setShowExerciseSelector(true)}
                    className="mt-2 text-purple-300 text-sm hover:text-purple-200"
                  >
                    Добавить упражнение
                  </button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedExercises.map((_, i) => i.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {selectedExercises.map((exercise, index) => (
                        <SortableExerciseItem
                          key={index}
                          id={index.toString()}
                          exercise={exercise}
                          index={index}
                          onRemove={() => handleRemoveExercise(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
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
      
      <ExerciseSelectorModal
        isOpen={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelect={handleAddExercise}
        selectedExerciseIds={selectedExercises.map(e => e.id)}
      />
    </>
  )
}

export default TemplateFormModal