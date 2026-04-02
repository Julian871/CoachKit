
import { useEffect, useCallback } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, TemplateFilter, TemplateRequest } from '../api/templateApi'
import { useTemplateStore } from '../stores/templateStore'

export const useTemplates = () => {
  const queryClient = useQueryClient()
  const { filters, setFilters, appendTemplates, setTemplatesPage, setIsLoading, addTemplate, updateTemplate: updateTemplateStore, removeTemplate } = useTemplateStore()
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['templates', filters],
    queryFn: ({ pageParam = 0 }) => {
      return getTemplates({ ...filters, page: pageParam })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined
    },
    initialPageParam: 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  
  useEffect(() => {
    if (data) {
      const allTemplates = data.pages.flatMap(page => page.content)
      const lastPage = data.pages[data.pages.length - 1]
      
      appendTemplates(allTemplates)
      setTemplatesPage(allTemplates, {
        page: lastPage.page,
        totalElements: lastPage.totalElements,
        totalPages: lastPage.totalPages,
      })
    }
  }, [data, appendTemplates, setTemplatesPage])
  
  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])
  
  const updateFilters = useCallback((newFilters: Partial<TemplateFilter>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 }
    setFilters(updatedFilters)
    queryClient.invalidateQueries({ queryKey: ['templates'] })
  }, [filters, setFilters, queryClient])
  
  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: (newTemplate) => {
      addTemplate(newTemplate)
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplateRequest }) =>
      updateTemplate(id, data),
    onSuccess: (updatedTemplate) => {
      updateTemplateStore(updatedTemplate.id, updatedTemplate)
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: (_, id) => {
      removeTemplate(id)
    },
  })
  
  return {
    templates: useTemplateStore((state) => state.templates),
    totalElements: useTemplateStore((state) => state.totalElements),
    totalPages: useTemplateStore((state) => state.totalPages),
    currentPage: useTemplateStore((state) => state.currentPage),
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    fetchNextPage,
    refetch,
    createTemplate: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTemplate: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTemplate: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}