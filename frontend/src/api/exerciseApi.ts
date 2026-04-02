
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: '/api/v1/exercises',
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

// Типы для фильтров
export interface ExerciseFilter {
  page?: number
  size?: number
  name?: string
  bodyRegion?: string
  muscleGroup?: string
  movementPattern?: string
}

// Тип для упражнения
export interface ExerciseResponse {
  id: string
  name: string
  bodyRegion: string
  muscleGroup: string
  targetMuscle?: string
  movementPattern: string
  description?: string
  videoUrl?: string
  imageUrl?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// Тип для запроса на создание/обновление
export interface ExerciseRequest {
  name: string
  bodyRegion: string
  muscleGroup: string
  targetMuscle?: string
  movementPattern: string
  description?: string
  videoUrl?: string
  imageUrl?: string
}

// Тип для пагинированного ответа
export interface ExercisePageResponse {
  content: ExerciseResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// API функции
export const getExercises = async (filter?: ExerciseFilter): Promise<ExercisePageResponse> => {
  const response = await api.get('', { params: filter })
  return response.data
}

export const getExercise = async (id: string): Promise<ExerciseResponse> => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const createExercise = async (data: ExerciseRequest): Promise<ExerciseResponse> => {
  const response = await api.post('', data)
  return response.data
}

export const updateExercise = async (id: string, data: ExerciseRequest): Promise<ExerciseResponse> => {
  const response = await api.put(`/${id}`, data)
  return response.data
}

export const deleteExercise = async (id: string): Promise<void> => {
  await api.delete(`/${id}`)
}