// src/pages/exercises/ExercisesList.tsx
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Dumbbell, Loader2 } from 'lucide-react'
import { useExercises } from '../../hooks/useExercises'
import { useExerciseStore } from '../../stores/exerciseStore'
import ExerciseCard from '../../components/exercises/ExerciseCard'
import ExerciseFilters from '../../components/exercises/ExerciseFilters'
import ExerciseFormModal from '../../components/exercises/ExerciseFormModal'
import BottomNavigation from '../../components/layout/BottomNavigation'

const ExercisesList = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  
  const {
    exercises,
    totalElements,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    fetchNextPage,
    createExercise,
    isCreating,
  } = useExercises()
  
  const { reset } = useExerciseStore()

  // Синхронизация фильтров с URL
  useEffect(() => {
    const urlFilters: any = {}
    searchParams.forEach((value, key) => {
      if (value) {
        urlFilters[key] = value
      }
    })
    
    // Синхронизируем только если фильтры из URL отличаются от текущих
    const currentFilters: any = {}
    if (filters.name) currentFilters.name = filters.name
    if (filters.bodyRegion) currentFilters.bodyRegion = filters.bodyRegion
    if (filters.muscleGroup) currentFilters.muscleGroup = filters.muscleGroup
    if (filters.movementPattern) currentFilters.movementPattern = filters.movementPattern
    
    const hasChanges = JSON.stringify(urlFilters) !== JSON.stringify(currentFilters)
    if (hasChanges && Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters)
    }
  }, [searchParams])

  // Обновление URL при изменении фильтров
  useEffect(() => {
    const newParams: Record<string, string> = {}
    if (filters.name) newParams.name = filters.name
    if (filters.bodyRegion) newParams.bodyRegion = filters.bodyRegion
    if (filters.muscleGroup) newParams.muscleGroup = filters.muscleGroup
    if (filters.movementPattern) newParams.movementPattern = filters.movementPattern
    
    setSearchParams(newParams, { replace: true })
  }, [filters, setSearchParams])

  // Бесконечный скролл
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    updateFilters(newFilters)
  }

  const handleCreateExercise = async (data: any) => {
    await createExercise(data)
    setShowCreateModal(false)
  }

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-4 sticky top-0 bg-gradient-to-b from-slate-900 via-purple-950/95 to-transparent backdrop-blur-sm z-10">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h1 className="text-3xl font-bold text-white mb-1">Упражнения</h1>
      <p className="text-slate-400 text-sm">
        {totalElements} {totalElements === 1 ? 'упражнение' : totalElements === 2 || totalElements === 3 || totalElements === 4 ? 'упражнения' : 'упражнений'}
      </p>
    </div>
    <button
      onClick={() => setShowCreateModal(true)}
      className="btn-primary py-3 px-5 flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">Добавить</span>
    </button>
  </div>

  {/* Компактные фильтры */}
  <ExerciseFilters
    filters={filters}
    onFilterChange={handleFilterChange}
  />
</div>

      {/* Exercises List */}
      <main className="px-6 max-w-5xl mx-auto space-y-4">
        {isLoading && exercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-200/60">Загрузка упражнений...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Dumbbell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Нет упражнений</h3>
            <p className="text-slate-400 mb-6">
              {filters.name || filters.bodyRegion || filters.muscleGroup || filters.movementPattern
                ? 'Ничего не найдено'
                : 'Добавьте первое упражнение'}
            </p>
            {!(filters.name || filters.bodyRegion || filters.muscleGroup || filters.movementPattern) && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary py-3 px-5 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Добавить упражнение
              </button>
            )}
          </div>
        ) : (
          <>
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => navigate(`/exercises/${exercise.id}`)}
              />
            ))}
            
            {/* Loader для бесконечного скролла */}
            {hasNextPage && (
              <div ref={loaderRef} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                )}
              </div>
            )}
            
            {/* Индикатор конца списка */}
            {!hasNextPage && exercises.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">
                  Показаны все {totalElements} {totalElements === 1 ? 'упражнение' : totalElements === 2 || totalElements === 3 || totalElements === 4 ? 'упражнения' : 'упражнений'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation />

      {/* Create Exercise Modal */}
      <ExerciseFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateExercise}
        title="Новое упражнение"
        isSubmitting={isCreating}
      />
    </div>
  )
}

export default ExercisesList