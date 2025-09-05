'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NavigationHeader from '@/components/NavigationHeader'
import ServerCard from '@/components/ServerCard'

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

export default function ServersPage() {
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
    const interval = setInterval(fetchServersData, 30000)
    return () => clearInterval(interval)
  }, [])

  const serverConnectInstructions = [
    {
      step: 1,
      title: "Запустите SCP: Secret Laboratory",
      description: "Откройте игру через Steam"
    },
    {
      step: 2, 
      title: "Откройте список серверов",
      description: "Нажмите 'Server List' в главном меню"
    },
    {
      step: 3,
      title: "Найдите Dark Paradise",
      description: "Введите 'Dark Paradise' в поиск или найдите по IP"
    },
    {
      step: 4,
      title: "Подключайтесь!",
      description: "Дважды кликните на сервер для подключения"
    }
  ]

  const totalPlayers = serversData ? 
    Object.values(serversData.servers).reduce((sum, server: ServerData) => sum + server.players, 0) : 0
    
  const onlineServers = serversData ? 
    Object.values(serversData.servers).filter((server: ServerData) => server.is_online).length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavigationHeader />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-b border-orange-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            НАШИ <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">СЕРВЕРЫ</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Выберите подходящий сервер и присоединяйтесь к увлекательному миру SCP Foundation
          </p>
          
          {/* Live Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {loading ? '...' : totalPlayers}
              </div>
              <div className="text-slate-400">Игроков онлайн</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {loading ? '...' : `${onlineServers}/2`}
              </div>
              <div className="text-slate-400">Серверов активно</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Servers List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Список серверов</h2>
          
          {error && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-center">
              <div className="text-red-400 font-semibold text-lg mb-2">Ошибка загрузки данных</div>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={fetchServersData}
                variant="outline"
                className="border-red-500/50 text-red-300 hover:bg-red-500/10"
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
                <ServerCard key={key} server={server} />
              ))
            ) : null}
          </div>
        </section>

        {/* Connection Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Как подключиться</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Следуйте простым шагам, чтобы присоединиться к нашим серверам
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serverConnectInstructions.map((instruction) => (
              <Card key={instruction.step} className="bg-slate-800/50 border-orange-500/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{instruction.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{instruction.title}</h3>
                  <p className="text-slate-400 text-sm">{instruction.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Server Info */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Информация о серверах</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/50">Vanilla</Badge>
                  Dark Paradise | Vanilla
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Классический режим SCP:SL без модификаций. Полное погружение в оригинальную атмосферу Фонда SCP.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Максимум игроков:</span>
                    <span className="text-white font-semibold">25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Режим игры:</span>
                    <span className="text-white font-semibold">Classic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Модификации:</span>
                    <span className="text-white font-semibold">Нет</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/50">Events</Badge>
                  Dark Paradise | Only Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Специальные события и уникальные режимы игры. Еженедельные тематические эвенты и турниры.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Максимум игроков:</span>
                    <span className="text-white font-semibold">30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Режим игры:</span>
                    <span className="text-white font-semibold">Events</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Обновления:</span>
                    <span className="text-white font-semibold">Еженедельно</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}