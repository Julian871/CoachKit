import React from 'react'
import { Camera, Phone, Send } from 'lucide-react'
import { ClientResponse } from '../../api/clientApi'

interface ClientCardProps {
  client: ClientResponse
  onClick: () => void
}

const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const getAvatar = () => {
    if (client.avatar) {
      return <span className="text-2xl">{client.avatar}</span>
    }
    return <span className="text-white text-xl font-bold">{client.name.charAt(0).toUpperCase()}</span>
  }

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-2xl p-5 cursor-pointer transition-all active:scale-[0.98] hover:border-purple-500/30"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
          {getAvatar()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg mb-1 truncate">
            {client.name}
          </h3>
          
          <div className="space-y-1">
            {client.instagram && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Camera className="w-3.5 h-3.5" />
                <span className="truncate">{client.instagram}</span>
              </div>
            )}
            
            {client.telegram && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Send className="w-3.5 h-3.5" />
                <span className="truncate">{client.telegram}</span>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientCard