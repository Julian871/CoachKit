import { create } from 'zustand'
import { ClientResponse } from '../api/clientApi'

interface ClientState {
  clients: ClientResponse[]
  selectedClient: ClientResponse | null
  isLoading: boolean
  searchQuery: string
  setClients: (clients: ClientResponse[]) => void
  setSelectedClient: (client: ClientResponse | null) => void
  addClient: (client: ClientResponse) => void
  updateClient: (id: string, client: ClientResponse) => void
  removeClient: (id: string) => void
  setIsLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  searchQuery: '',
  
  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  addClient: (client) => set((state) => ({ 
    clients: [client, ...state.clients] 
  })),
  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map((c) => c.id === id ? updatedClient : c),
    selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient
  })),
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
    selectedClient: state.selectedClient?.id === id ? null : state.selectedClient
  })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))

// Селектор для отфильтрованных клиентов (поиск только по имени)
export const useFilteredClients = () => {
  const clients = useClientStore((state) => state.clients)
  const searchQuery = useClientStore((state) => state.searchQuery)
  
  if (!searchQuery.trim()) return clients
  
  const lowerQuery = searchQuery.toLowerCase()
  return clients.filter((client) => 
    client.name.toLowerCase().includes(lowerQuery)
  )
}