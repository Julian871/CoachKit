
import { useEffect, useCallback, useRef } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExercises, createExercise, updateExercise, deleteExercise, ExerciseFilter, ExerciseRequest } from '../api/exerciseApi'
import { useExerciseStore } from '../stores/exerciseStore'

export const useExercises = () => {
  const queryClient = useQueryClient()
  const { filters, setFilters, appendExercises, setExercisesPage, setIsLoading, addExercise, updateExercise: updateExerciseStore, removeExercise } = useExerciseStore()
  
  // Используем infinite query для бесконечного скролла
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['exercises', filters],
    queryFn: ({ pageParam = 0 }) => {
      console.log(`📡 Запрос страницы ${pageParam}`, filters)
      return getExercises({ ...filters, page: pageParam })
    },
    getNextPageParam: (lastPage, allPages) => {
  console.log('📄 getNextPageParam вызван:', { 
    page: lastPage.page, 
    hasNext: lastPage.hasNext, 
    totalElements: lastPage.totalElements,
    loadedPages: allPages.length
  })
  return lastPage.hasNext ? lastPage.page + 1 : undefined
},
    initialPageParam: 0,
    staleTime: 1000 * 60, // Данные считаются свежими 1 минуту
    gcTime: 1000 * 60 * 5, // Кеш живет 5 минут
    refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
  })
  
  // Обновляем стор при получении данных
  useEffect(() => {
    if (data) {
      // Объединяем все страницы
      const allExercises = data.pages.flatMap(page => page.content)
      const lastPage = data.pages[data.pages.length - 1]
      
      console.log(`📦 Всего загружено упражнений: ${allExercises.length}, последняя страница: ${lastPage.page}`)
      
      appendExercises(allExercises)
      setExercisesPage(allExercises, {
        page: lastPage.page,
        totalElements: lastPage.totalElements,
        totalPages: lastPage.totalPages,
      })
    }
  }, [data, appendExercises, setExercisesPage])
  
  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])
  
  // Обновление фильтров (сбрасывает все данные)
  const updateFilters = useCallback((newFilters: Partial<ExerciseFilter>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 }
    console.log('🔄 Обновление фильтров:', updatedFilters)
    setFilters(updatedFilters)
    // Инвалидируем запрос, чтобы загрузить заново
    queryClient.invalidateQueries({ queryKey: ['exercises'] })
  }, [filters, setFilters, queryClient])
  
  // Создание упражнения
  const createMutation = useMutation({
    mutationFn: createExercise,
    onSuccess: (newExercise) => {
      console.log('✅ Упражнение создано:', newExercise.name)
      addExercise(newExercise)
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
  
  // Обновление упражнения
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExerciseRequest }) =>
      updateExercise(id, data),
    onSuccess: (updatedExercise) => {
      console.log('✅ Упражнение обновлено:', updatedExercise.name)
      updateExerciseStore(updatedExercise.id, updatedExercise)
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
  
  // Удаление упражнения
  const deleteMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: (_, id) => {
      console.log('✅ Упражнение удалено:', id)
      removeExercise(id)
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
  
  return {
    exercises: useExerciseStore((state) => state.exercises),
    totalElements: useExerciseStore((state) => state.totalElements),
    totalPages: useExerciseStore((state) => state.totalPages),
    currentPage: useExerciseStore((state) => state.currentPage),
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    fetchNextPage,
    refetch,
    createExercise: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateExercise: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteExercise: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}