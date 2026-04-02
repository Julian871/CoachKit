// src/components/exercises/ExerciseCard.tsx
import React, { useMemo } from 'react'
import { Target, Activity, Dumbbell, Atom } from 'lucide-react'
import { ExerciseResponse } from '../../api/exerciseApi'
import { BODY_REGIONS, MUSCLE_GROUPS, MOVEMENT_PATTERNS } from '../../constants/exerciseConstants'

interface ExerciseCardProps {
  exercise: ExerciseResponse
  onClick: () => void
}

const ExerciseCard = ({ exercise, onClick }: ExerciseCardProps) => {
  // Используем useMemo для мемоизации вычислений
  const { bodyRegionEmoji, iconGradient, bodyRegionLabel, muscleGroupLabel, movementPatternLabel } = useMemo(() => {
    // Получаем эмодзи в зависимости от региона тела
    const getBodyRegionEmoji = (bodyRegion: string) => {
      switch (bodyRegion) {
        case 'UPPER': return '💪'
        case 'LOWER': return '🦵'
        case 'CORE': return '🧘'
        case 'FULL_BODY': return '🧍'
        default: return '💪'
      }
    }

    // Получаем градиент для иконки
    const getIconGradient = (bodyRegion: string) => {
      switch (bodyRegion) {
        case 'UPPER': return 'from-purple-600 to-pink-600'
        case 'LOWER': return 'from-green-600 to-emerald-600'
        case 'CORE': return 'from-orange-600 to-red-600'
        case 'FULL_BODY': return 'from-blue-600 to-cyan-600'
        default: return 'from-purple-600 to-purple-800'
      }
    }

    // Получаем русские названия с fallback
    const bodyRegionLabel = BODY_REGIONS.find(r => r.value === exercise.bodyRegion)?.label || exercise.bodyRegion || 'Не указано'
    const muscleGroupLabel = MUSCLE_GROUPS.find(m => m.value === exercise.muscleGroup)?.label || exercise.muscleGroup || 'Не указано'
    const movementPatternLabel = MOVEMENT_PATTERNS.find(m => m.value === exercise.movementPattern)?.label || exercise.movementPattern || 'Не указано'

    return {
      bodyRegionEmoji: getBodyRegionEmoji(exercise.bodyRegion),
      iconGradient: getIconGradient(exercise.bodyRegion),
      bodyRegionLabel,
      muscleGroupLabel,
      movementPatternLabel,
    }
  }, [exercise.bodyRegion, exercise.muscleGroup, exercise.movementPattern])

  // Если нет exercise или нет bodyRegion, показываем заглушку
  if (!exercise || !exercise.bodyRegion) {
    return (
      <div
        onClick={onClick}
        className="glass-card rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] hover:border-purple-500/30"
      >
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <Dumbbell className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-slate-700 rounded-lg w-3/4 mb-2 animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] hover:border-purple-500/30"
    >
      <div className="flex gap-4">
        

        {/* Информация */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg mb-2 truncate">
            {exercise.name || 'Без названия'}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-base">{bodyRegionEmoji}</span>
              <span className="truncate">{bodyRegionLabel}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Atom className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{muscleGroupLabel}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Activity className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{movementPatternLabel}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseCard