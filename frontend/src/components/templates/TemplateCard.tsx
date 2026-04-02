
import { FileText, Dumbbell, Calendar } from 'lucide-react'
import { TemplateResponse } from '../../api/templateApi'

interface TemplateCardProps {
  template: TemplateResponse
  onClick: () => void
}

const TemplateCard = ({ template, onClick }: TemplateCardProps) => {
  const exercisesCount = template.exercises?.length || 0
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] hover:border-purple-500/30"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">
          {template.name}
        </h3>
        
        {template.description && (
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {template.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{exercisesCount} {exercisesCount === 1 ? 'упражнение' : exercisesCount === 2 || exercisesCount === 3 || exercisesCount === 4 ? 'упражнения' : 'упражнений'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(template.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateCard