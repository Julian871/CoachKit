
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { ExerciseResponse } from './exerciseApi'

const api = axios.create({
  baseURL: '/api/v1/templates',
  withCredentials: true,
})

// Добавляем access token к каждому запросу
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Тип для упражнения в шаблоне (запрос)
export interface TemplateExerciseRequest {
  exerciseId: string
  orderIndex: number
}

// Тип для упражнения в шаблоне (ответ)
export interface TemplateExerciseResponse {
  id: string
  orderIndex: number
  exercise: ExerciseResponse
}

// Тип для шаблона (ответ)
export interface TemplateResponse {
  id: string
  name: string
  description?: string
  exercises: TemplateExerciseResponse[]
  active: boolean
  createdAt: string
  updatedAt: string
}

// Тип для запроса на создание/обновление
export interface TemplateRequest {
  name: string
  description?: string
  exercises: TemplateExerciseRequest[]
}

// Тип для фильтров
export interface TemplateFilter {
  page?: number
  size?: number
  name?: string
}

// Тип для пагинированного ответа
export interface TemplatePageResponse {
  content: TemplateResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// API функции
export const getTemplates = async (filter?: TemplateFilter): Promise<TemplatePageResponse> => {
  const response = await api.get('', { params: filter })
  return response.data
}

export const getTemplate = async (id: string): Promise<TemplateResponse> => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const createTemplate = async (data: TemplateRequest): Promise<TemplateResponse> => {
  const response = await api.post('', data)
  return response.data
}

export const updateTemplate = async (id: string, data: TemplateRequest): Promise<TemplateResponse> => {
  const response = await api.put(`/${id}`, data)
  return response.data
}

export const deleteTemplate = async (id: string): Promise<void> => {
  await api.delete(`/${id}`)
}