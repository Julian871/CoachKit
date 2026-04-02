
import React, { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, ScrollText, Loader2, Search, X } from 'lucide-react'
import { useTemplates } from '../../hooks/useTemplates'
import { useTemplateStore } from '../../stores/templateStore'
import TemplateCard from '../../components/templates/TemplateCard'
import TemplateFormModal from '../../components/templates/TemplateFormModal'
import BottomNavigation from '../../components/layout/BottomNavigation'

const MemoizedTemplateCard = memo(TemplateCard)

const TemplatesList = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const loaderRef = useRef<HTMLDivElement>(null)
  
  const {
    templates,
    totalElements,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    fetchNextPage,
    createTemplate,
    isCreating,
  } = useTemplates()
  
  const { reset } = useTemplateStore()

  // Синхронизация поиска с URL
  useEffect(() => {
    const nameParam = searchParams.get('name')
    if (nameParam) {
      setSearchQuery(nameParam)
      if (filters.name !== nameParam) {
        updateFilters({ name: nameParam })
      }
    }
  }, [searchParams])

  // Обновление URL при изменении поиска
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('name', value)
    } else {
      newParams.delete('name')
    }
    setSearchParams(newParams, { replace: true })
    updateFilters({ name: value || undefined })
  }, [searchParams, setSearchParams, updateFilters])

  const clearSearch = useCallback(() => {
    handleSearchChange('')
  }, [handleSearchChange])

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

  const handleCreateTemplate = useCallback(async (data: any) => {
    await createTemplate(data)
    setShowCreateModal(false)
  }, [createTemplate])

  const handleTemplateClick = useCallback((id: string) => {
    navigate(`/templates/${id}`)
  }, [navigate])

  const renderTemplates = useCallback(() => {
    return templates.map((template) => (
      <MemoizedTemplateCard
        key={template.id}
        template={template}
        onClick={() => handleTemplateClick(template.id)}
      />
    ))
  }, [templates, handleTemplateClick])

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
            <h1 className="text-3xl font-bold text-white mb-1">Шаблоны тренировок</h1>
            <p className="text-slate-400 text-sm">
              {totalElements} {totalElements === 1 ? 'шаблон' : totalElements === 2 || totalElements === 3 || totalElements === 4 ? 'шаблона' : 'шаблонов'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary py-3 px-5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Создать</span>
          </button>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field pl-12 pr-10 w-full"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Templates List */}
      <main className="px-6 max-w-5xl mx-auto space-y-4">
        {isLoading && templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-200/60">Загрузка шаблонов...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ScrollText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Нет шаблонов</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? 'Ничего не найдено' : 'Создайте первый шаблон тренировки'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary py-3 px-5 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Создать шаблон
              </button>
            )}
          </div>
        ) : (
          <>
            {renderTemplates()}
            
            {/* Loader для бесконечного скролла */}
            {hasNextPage && (
              <div ref={loaderRef} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                )}
              </div>
            )}
            
            {/* Индикатор конца списка */}
            {!hasNextPage && templates.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">
                  Показаны все {totalElements} {totalElements === 1 ? 'шаблон' : totalElements === 2 || totalElements === 3 || totalElements === 4 ? 'шаблона' : 'шаблонов'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation />

      {/* Create Template Modal */}
      <TemplateFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTemplate}
        title="Новый шаблон"
        isSubmitting={isCreating}
      />
    </div>
  )
}

export default TemplatesList