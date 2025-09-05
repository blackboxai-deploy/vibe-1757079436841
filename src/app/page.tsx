'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import NavigationHeader from '@/components/NavigationHeader'
import ServerCard from '@/components/ServerCard'
import { AlertCircle, Users, Server, ShoppingCart, MessageSquare } from 'lucide-react'

interface ServerData {
  name: string
  description: string
  server_type: string
  max_players: number
  players: number
  is_online: boolean
  last_updated: string
}

interface ServersResponse {
  servers: {
    [key: string]: ServerData
  }
}

export default function HomePage() {
  const [serversData, setServersData] = useState<ServersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServersData = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/servers')
      if (!response.ok) {
        throw new Error('Не удалось получить данные серверов')
      }
      const data = await response.json()
      setServersData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      console.error('Ошибка загрузки серверов:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServersData()
    
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(fetchServersData, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalPlayers = serversData ? 
    Object.values(serversData.servers).reduce((sum, server) => sum + server.players, 0) : 0
    
  const totalMaxPlayers = serversData ?
    Object.values(serversData.servers).reduce((sum, server) => sum + server.max_players, 0) : 0

  const onlineServers = serversData ? 
    Object.values(serversData.servers).filter(server => server.is_online).length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-900/20 to-red-900/20 border-b border-orange-500/20">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 font-mono text-sm">SCP FOUNDATION NETWORK</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              DARK <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">PARADISE</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Официальная сеть серверов SCP: Secret Laboratory
              <br />
              <span className="text-orange-400 font-semibold">Погрузись в мир аномалий</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Подключиться к игре
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Telegram поддержка
              </Button>
            </div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Игроков онлайн</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {loading ? '...' : `${totalPlayers}/${totalMaxPlayers}`}
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                  <Server className="w-5 h-5" />
                  <span className="font-semibold">Серверов активно</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {loading ? '...' : `${onlineServers}/2`}
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">Магазин</span>
                </div>
                <div className="text-3xl font-bold text-white">Открыт</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Наши <span className="text-orange-400">Серверы</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Выберите подходящий сервер и присоединяйтесь к игровому сообществу Dark Paradise
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Ошибка загрузки данных</span>
              </div>
              <p className="text-red-300 mt-1">{error}</p>
              <Button 
                onClick={fetchServersData}
                variant="outline"
                size="sm"
                className="mt-3 border-red-500/50 text-red-300 hover:bg-red-500/10"
              >
                Повторить попытку
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              <>
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-slate-800/50 border-orange-500/20 animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="h-6 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-slate-700 rounded mb-4"></div>
                      <div className="h-10 bg-slate-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : serversData ? (
              Object.entries(serversData.servers).map(([key, server]) => (
                <ServerCard key={key} serverKey={key} server={server} />
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Почему <span className="text-orange-400">Dark Paradise</span>?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Стабильные серверы",
                description: "99.9% аптайм и высокая производительность",
                icon: Server
              },
              {
                title: "Активное сообщество", 
                description: "Дружелюбные игроки и модераторы",
                icon: Users
              },
              {
                title: "Уникальные события",
                description: "Регулярные эвенты и турниры",
                icon: AlertCircle
              },
              {
                title: "Discord интеграция",
                description: "Полная синхронизация с Discord сервером",
                icon: MessageSquare
              },
              {
                title: "Система донатов",
                description: "Прозрачная система поддержки проекта",
                icon: ShoppingCart
              },
              {
                title: "Техподдержка 24/7",
                description: "Быстрая помощь через Telegram бота",
                icon: AlertCircle
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-orange-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            &copy; 2024 Dark Paradise SCP:SL. Все права защищены.
            <br />
            <span className="text-orange-400 font-mono text-sm">
              SECURE • CONTAIN • PROTECT
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}