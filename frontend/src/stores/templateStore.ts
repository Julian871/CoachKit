
import { create } from 'zustand'
import { TemplateResponse, TemplateFilter } from '../api/templateApi'

interface TemplateState {
  templates: TemplateResponse[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  filters: TemplateFilter
  isLoading: boolean
  selectedTemplate: TemplateResponse | null
  
  setTemplatesPage: (templates: TemplateResponse[], pageData: { page: number; totalElements: number; totalPages: number }) => void
  appendTemplates: (newTemplates: TemplateResponse[]) => void
  setFilters: (filters: TemplateFilter) => void
  setSelectedTemplate: (template: TemplateResponse | null) => void
  addTemplate: (template: TemplateResponse) => void
  updateTemplate: (id: string, template: TemplateResponse) => void
  removeTemplate: (id: string) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  templates: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,
  filters: { page: 0, size: 20 },
  isLoading: false,
  selectedTemplate: null,
}

export const useTemplateStore = create<TemplateState>((set) => ({
  ...initialState,
  
  setTemplatesPage: (templates, pageData) => set({
    templates,
    currentPage: pageData.page,
    totalElements: pageData.totalElements,
    totalPages: pageData.totalPages,
  }),
  
  appendTemplates: (newTemplates) => set((state) => ({
    templates: [...state.templates, ...newTemplates],
  })),
  
  setFilters: (filters) => set({ filters }),
  
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
  addTemplate: (template) => set((state) => ({
    templates: [template, ...state.templates],
    totalElements: state.totalElements + 1,
  })),
  
  updateTemplate: (id, updatedTemplate) => set((state) => ({
    templates: state.templates.map((t) => t.id === id ? updatedTemplate : t),
    selectedTemplate: state.selectedTemplate?.id === id ? updatedTemplate : state.selectedTemplate,
  })),
  
  removeTemplate: (id) => set((state) => ({
    templates: state.templates.filter((t) => t.id !== id),
    selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
    totalElements: state.totalElements - 1,
  })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  reset: () => set(initialState),
}))