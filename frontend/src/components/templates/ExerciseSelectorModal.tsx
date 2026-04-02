
import React, { useState, useEffect, useCallback } from 'react'
import { X, Search, Check, Loader2 } from 'lucide-react'
import { useExercises } from '../../hooks/useExercises'
import { ExerciseResponse } from '../../api/exerciseApi'
import { BODY_REGIONS, MUSCLE_GROUPS } from '../../constants/exerciseConstants'

interface ExerciseSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (exercise: ExerciseResponse) => void
  selectedExerciseIds: string[]
}

const ExerciseSelectorModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedExerciseIds 
}: ExerciseSelectorModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { exercises, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useExercises()
  
  // Фильтруем упражнения по поиску и исключаем уже выбранные
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = searchQuery === '' || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const notSelected = !selectedExerciseIds.includes(exercise.id)
    return matchesSearch && notSelected
  })
  
  // Бесконечный скролл в модалке
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])
  
  if (!isOpen) return null
  
  const getBodyRegionEmoji = (bodyRegion: string) => {
    switch (bodyRegion) {
      case 'UPPER': return '💪'
      case 'LOWER': return '🦵'
      case 'CORE': return '🧘'
      case 'FULL_BODY': return '🧍'
      default: return '📍'
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-purple-500/10">
          <h3 className="text-lg font-bold text-white">Выбрать упражнение</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-purple-500/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск упражнений..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-full"
            />
          </div>
        </div>
        
        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
          {isLoading && exercises.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">
                {searchQuery ? 'Ничего не найдено' : 'Нет доступных упражнений'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    onSelect(exercise)
                    onClose()
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <span className="text-xl">{getBodyRegionEmoji(exercise.bodyRegion)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{exercise.name}</p>
                    <p className="text-slate-400 text-xs">
                      {BODY_REGIONS.find(r => r.value === exercise.bodyRegion)?.label} • 
                      {MUSCLE_GROUPS.find(m => m.value === exercise.muscleGroup)?.label}
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              
              {isFetchingNextPage && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExerciseSelectorModal