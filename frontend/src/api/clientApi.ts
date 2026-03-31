import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: '/api/v1/clients',
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

export interface ClientRequest {
  name: string
  instagram?: string
  phone?: string
  telegram?: string
  avatar?: string
  birthDate?: string
  notes?: string
}

export interface ClientResponse {
  id: string
  name: string
  instagram?: string
  phone?: string
  telegram?: string
  avatar?: string
  birthDate?: string
  notes?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// Получить всех клиентов
export const getClients = async (): Promise<ClientResponse[]> => {
  const response = await api.get('')
  return response.data
}

// Получить одного клиента
export const getClient = async (id: string): Promise<ClientResponse> => {
  const response = await api.get(`/${id}`)
  return response.data
}

// Создать клиента
export const createClient = async (data: ClientRequest): Promise<ClientResponse> => {
  const response = await api.post('', data)
  return response.data
}

// Обновить клиента
export const updateClient = async (id: string, data: ClientRequest): Promise<ClientResponse> => {
  const response = await api.put(`/${id}`, data)
  return response.data
}

// Удалить клиента (soft delete)
export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/${id}`)
}