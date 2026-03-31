import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Users } from 'lucide-react'
import { useClients } from '../../hooks/useClients'
import { useClientStore, useFilteredClients } from '../../stores/clientStore'
import ClientCard from '../../components/clients/ClientCard'
import BottomNavigation from '../../components/layout/BottomNavigation'

const ClientsList = () => {
  const navigate = useNavigate()
  const { isLoading } = useClients()
  const { searchQuery, setSearchQuery } = useClientStore()
  const filteredClients = useFilteredClients()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Клиенты</h1>
            <p className="text-slate-400 text-sm">
              {filteredClients.length} {filteredClients.length === 1 ? 'клиент' : 'клиентов'}
            </p>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="btn-primary py-3 px-5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 w-full"
          />
        </div>
      </div>

      {/* Clients List */}
      <main className="px-6 max-w-5xl mx-auto space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-200/60">Загрузка клиентов...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Нет клиентов</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? 'Ничего не найдено' : 'Добавьте первого клиента'}
            </p>
            {!searchQuery && (
              <button
              onClick={() => navigate('/clients/new')}
              className="btn-primary py-3 px-5 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Добавить</span>
                </button>
            )}
          </div>
        ) : (
          filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => navigate(`/clients/${client.id}`)}
            />
          ))
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}

export default ClientsList