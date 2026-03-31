import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClients, createClient, updateClient, deleteClient, ClientRequest, ClientResponse } from '../api/clientApi'
import { useClientStore } from '../stores/clientStore'

export const useClients = () => {
  const queryClient = useQueryClient()
  const { setClients, addClient, updateClient: updateClientStore, removeClient, setIsLoading } = useClientStore()

  // Загрузка всех клиентов
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  // Когда данные загрузились — сохраняем в store
  useEffect(() => {
    if (data) {
      setClients(data)
    }
  }, [data, setClients])

  // Создание клиента
  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (newClient) => {
      addClient(newClient)
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  // Обновление клиента
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientRequest }) =>
      updateClient(id, data),
    onSuccess: (updatedClient) => {
      updateClientStore(updatedClient.id, updatedClient)
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  // Удаление клиента
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: (_, id) => {
      removeClient(id)
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  return {
    clients: useClientStore((state) => state.clients),
    isLoading,
    error,
    refetch,
    createClient: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateClient: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteClient: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}