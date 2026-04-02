
import React, { useState } from 'react'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import { ExerciseFilter } from '../../api/exerciseApi'
import { BODY_REGIONS, MUSCLE_GROUPS, MOVEMENT_PATTERNS } from '../../constants/exerciseConstants'

interface ExerciseFiltersProps {
  filters: ExerciseFilter
  onFilterChange: (filters: Partial<ExerciseFilter>) => void
}

const ExerciseFilters = ({ filters, onFilterChange }: ExerciseFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false)
  
  const hasActiveFilters = filters.bodyRegion || filters.muscleGroup || filters.movementPattern

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ name: e.target.value || undefined })
  }

  const handleBodyRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ bodyRegion: e.target.value || undefined })
  }

  const handleMuscleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ muscleGroup: e.target.value || undefined })
  }

  const handleMovementPatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ movementPattern: e.target.value || undefined })
  }

  const clearFilters = () => {
    onFilterChange({
      bodyRegion: undefined,
      muscleGroup: undefined,
      movementPattern: undefined,
    })
  }

  const clearAll = () => {
    onFilterChange({
      name: undefined,
      bodyRegion: undefined,
      muscleGroup: undefined,
      movementPattern: undefined,
    })
  }

  // Получаем текущие значения для отображения
  const getBodyRegionEmoji = () => {
    const region = BODY_REGIONS.find(r => r.value === filters.bodyRegion)
    if (!region) return '📍'
    switch (region.value) {
      case 'UPPER': return '💪'
      case 'LOWER': return '🦵'
      case 'CORE': return '🧘'
      case 'FULL_BODY': return '🧍'
      default: return '📍'
    }
  }

  const getMuscleGroupEmoji = () => {
    const muscle = MUSCLE_GROUPS.find(m => m.value === filters.muscleGroup)
    if (!muscle) return '🎯'
    // Можно добавить больше эмодзи для разных групп
    switch (muscle.value) {
      case 'CHEST': return '📌'
      case 'BACK': return '🔙'
      case 'SHOULDERS': return '🎯'
      case 'BICEPS': return '💪'
      case 'TRICEPS': return '💪'
      case 'ABS': return '🔥'
      default: return '🎯'
    }
  }

  const getMovementPatternEmoji = () => {
    const pattern = MOVEMENT_PATTERNS.find(p => p.value === filters.movementPattern)
    if (!pattern) return '🔄'
    switch (pattern.value) {
      case 'PUSH': return '👐'
      case 'PULL': return '🤲'
      case 'SQUAT': return '🏋️'
      case 'HINGE': return '📐'
      case 'LUNGE': return '🚶'
      case 'ROTATION': return '🔄'
      case 'CARRY': return '🏃'
      case 'EXPLOSIVE': return '⚡'
      default: return '🔄'
    }
  }

  return (
    <div className="space-y-3">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.name || ''}
          onChange={handleNameChange}
          className="input-field pl-12 pr-10 w-full"
        />
        {filters.name && (
          <button
            onClick={() => onFilterChange({ name: undefined })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Компактные фильтры */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
              {Object.values({ bodyRegion: filters.bodyRegion, muscleGroup: filters.muscleGroup, movementPattern: filters.movementPattern }).filter(Boolean).length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-purple-300 transition-colors px-2 py-1"
          >
            Очистить
          </button>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1"
          >
            Сбросить всё
          </button>
        )}
      </div>

      {/* Выпадающая панель фильтров */}
      {showFilters && (
        <div className="glass-card rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Регион тела */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">📍 Регион тела</label>
              <div className="relative">
                <select
                  value={filters.bodyRegion || ''}
                  onChange={handleBodyRegionChange}
                  className="input-field w-full text-sm pr-8"
                >
                  <option value="">Все регионы</option>
                  {BODY_REGIONS.map(region => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  {getBodyRegionEmoji()}
                </span>
              </div>
            </div>

            {/* Группа мышц */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">🎯 Группа мышц</label>
              <div className="relative">
                <select
                  value={filters.muscleGroup || ''}
                  onChange={handleMuscleGroupChange}
                  className="input-field w-full text-sm pr-8"
                >
                  <option value="">Все группы</option>
                  {MUSCLE_GROUPS.map(muscle => (
                    <option key={muscle.value} value={muscle.value}>
                      {muscle.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  {getMuscleGroupEmoji()}
                </span>
              </div>
            </div>

            {/* Паттерн движения */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">🔄 Паттерн движения</label>
              <div className="relative">
                <select
                  value={filters.movementPattern || ''}
                  onChange={handleMovementPatternChange}
                  className="input-field w-full text-sm pr-8"
                >
                  <option value="">Все паттерны</option>
                  {MOVEMENT_PATTERNS.map(pattern => (
                    <option key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  {getMovementPatternEmoji()}
                </span>
              </div>
            </div>
          </div>

          {/* Активные фильтры (чипы) */}
          {(filters.bodyRegion || filters.muscleGroup || filters.movementPattern) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-500/10">
              {filters.bodyRegion && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs">
                  <span>{getBodyRegionEmoji()}</span>
                  <span>{BODY_REGIONS.find(r => r.value === filters.bodyRegion)?.label}</span>
                  <button
                    onClick={() => onFilterChange({ bodyRegion: undefined })}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.muscleGroup && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs">
                  <span>{getMuscleGroupEmoji()}</span>
                  <span>{MUSCLE_GROUPS.find(m => m.value === filters.muscleGroup)?.label}</span>
                  <button
                    onClick={() => onFilterChange({ muscleGroup: undefined })}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.movementPattern && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs">
                  <span>{getMovementPatternEmoji()}</span>
                  <span>{MOVEMENT_PATTERNS.find(p => p.value === filters.movementPattern)?.label}</span>
                  <button
                    onClick={() => onFilterChange({ movementPattern: undefined })}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExerciseFilters