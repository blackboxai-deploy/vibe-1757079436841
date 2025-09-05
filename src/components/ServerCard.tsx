'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ServerData {
  name: string
  description: string
  server_type: string
  max_players: number
  players: number
  is_online: boolean
  last_updated: string
}

interface ServerCardProps {
  serverKey: string
  server: ServerData
}

export default function ServerCard({ server }: ServerCardProps) {
  const playerPercentage = server.max_players > 0 ? (server.players / server.max_players) * 100 : 0
  
  const getStatusColor = () => {
    if (!server.is_online) return 'bg-red-500'
    if (playerPercentage >= 80) return 'bg-orange-500'
    if (playerPercentage >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!server.is_online) return 'Офлайн'
    if (playerPercentage >= 90) return 'Почти полный'
    if (playerPercentage >= 70) return 'Много игроков'
    if (playerPercentage >= 30) return 'Умеренно'
    return 'Мало игроков'
  }

  const getServerTypeInfo = () => {
    switch (server.server_type) {
      case 'vanilla':
        return {
          badge: 'Vanilla',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/50',
          description: 'Классический режим без модификаций'
        }
      case 'events':
        return {
          badge: 'Events',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/50',
          description: 'Специальные события и уникальные режимы'
        }
      default:
        return {
          badge: 'Custom',
          color: 'bg-gray-500/10 text-gray-400 border-gray-500/50',
          description: 'Пользовательский режим игры'
        }
    }
  }

  const typeInfo = getServerTypeInfo()
  const lastUpdate = new Date(server.last_updated).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <Card className="bg-slate-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
              {server.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${typeInfo.color} text-xs font-semibold`}
              >
                {typeInfo.badge}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${
                  server.is_online 
                    ? 'bg-green-500/10 text-green-400 border-green-500/50' 
                    : 'bg-red-500/10 text-red-400 border-red-500/50'
                } text-xs`}
              >
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          {server.description}
        </p>
        
        {/* Статистика игроков */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-400">
              Игроков онлайн
            </span>
            <span className="text-sm font-bold text-white">
              {server.players}/{server.max_players}
            </span>
          </div>
          
          <Progress 
            value={playerPercentage} 
            className="h-2 bg-slate-700"
          />
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>Заполнено на {Math.round(playerPercentage)}%</span>
            <span>Обновлено: {lastUpdate}</span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 font-semibold"
            disabled={!server.is_online}
          >
            {server.is_online ? 'Подключиться' : 'Недоступен'}
          </Button>
          
          <Button 
            variant="outline" 
            className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
          >
            Подробнее
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="pt-3 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400">Режим</div>
              <div className="text-white font-semibold capitalize">{server.server_type}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Статус</div>
              <div className={`font-semibold ${server.is_online ? 'text-green-400' : 'text-red-400'}`}>
                {server.is_online ? 'Онлайн' : 'Офлайн'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}