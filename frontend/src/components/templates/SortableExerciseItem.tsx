
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { ExerciseResponse } from '../../api/exerciseApi'
import { BODY_REGIONS, MUSCLE_GROUPS } from '../../constants/exerciseConstants'

interface SortableExerciseItemProps {
  id: string
  exercise: ExerciseResponse & { orderIndex: number }
  index: number
  onRemove: () => void
}

const SortableExerciseItem = ({ id, exercise, index, onRemove }: SortableExerciseItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
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
  
  const bodyRegionLabel = BODY_REGIONS.find(r => r.value === exercise.bodyRegion)?.label || exercise.bodyRegion
  const muscleGroupLabel = MUSCLE_GROUPS.find(m => m.value === exercise.muscleGroup)?.label || exercise.muscleGroup
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-purple-500/10"
    >
      {/* Drag handle - зажми эту область для перетаскивания */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-purple-400 transition-colors touch-none"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">{getBodyRegionEmoji(exercise.bodyRegion)}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-sm font-medium">#{index + 1}</span>
          <p className="text-white font-medium text-sm truncate">{exercise.name}</p>
        </div>
        <p className="text-slate-400 text-xs">
          {bodyRegionLabel} • {muscleGroupLabel}
        </p>
      </div>
      
      <button
        type="button"
        onClick={onRemove}
        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default SortableExerciseItem