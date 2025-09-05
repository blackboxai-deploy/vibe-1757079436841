'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NavigationHeader from '@/components/NavigationHeader'

export default function DashboardPage() {
  const [isAuthenticated] = useState(false) // TODO: подключить реальную авторизацию

  // Mock данные пользователя - в реальности будут загружаться с API
  const mockUser = {
    id: 1,
    discord_id: "123456789012345678",
    username: "PlayerName#1234",
    avatar: null,
    steam_id: "76561198000000000",
    created_at: "2024-01-15T12:00:00Z"
  }

  const mockPurchases = [
    {
      id: 1,
      item_name: "VIP Status (30 дней)",
      price: 299.00,
      currency: "RUB",
      status: "completed",
      created_at: "2024-01-20T10:30:00Z"
    },
    {
      id: 2,
      item_name: "Premium Kit",
      price: 199.00,
      currency: "RUB", 
      status: "completed",
      created_at: "2024-01-18T15:45:00Z"
    },
    {
      id: 3,
      item_name: "Server Priority",
      price: 99.00,
      currency: "RUB",
      status: "pending",
      created_at: "2024-01-22T09:15:00Z"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/50'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/50'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено'
      case 'pending':
        return 'В обработке'
      case 'failed':
        return 'Ошибка'
      default:
        return 'Неизвестно'
    }
  }

  // Если пользователь не авторизован
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <NavigationHeader />
        
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">DP</span>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать!</h1>
                <p className="text-slate-400">
                  Войдите через Discord, чтобы получить доступ к личному кабинету
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 font-semibold"
                onClick={() => {/* TODO: Discord OAuth */}}
              >
                Войти через Discord
              </Button>
              
              <p className="text-xs text-slate-500">
                Авторизуясь, вы соглашаетесь с правилами проекта
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Авторизованный пользователь
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavigationHeader />

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-b border-orange-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {mockUser.username.charAt(0)}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Личный кабинет
              </h1>
              <p className="text-slate-300 text-lg">
                Добро пожаловать, <span className="text-orange-400 font-semibold">{mockUser.username}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 border border-orange-500/20">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              Профиль
            </TabsTrigger>
            <TabsTrigger 
              value="purchases"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              История покупок
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Информация профиля</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Discord Username</label>
                    <div className="text-white font-semibold">{mockUser.username}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Discord ID</label>
                    <div className="text-white font-mono text-sm">{mockUser.discord_id}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Steam ID</label>
                    <div className="text-white font-mono text-sm">
                      {mockUser.steam_id || 'Не привязан'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Дата регистрации</label>
                    <div className="text-white">
                      {new Date(mockUser.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {mockPurchases.filter(p => p.status === 'completed').length}
                      </div>
                      <div className="text-sm text-slate-400">Покупок</div>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {mockPurchases
                          .filter(p => p.status === 'completed')
                          .reduce((sum, p) => sum + p.price, 0)} ₽
                      </div>
                      <div className="text-sm text-slate-400">Потрачено</div>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg col-span-2">
                      <div className="text-2xl font-bold text-blue-400">VIP</div>
                      <div className="text-sm text-slate-400">Статус активен</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">История покупок</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPurchases.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">У вас пока нет покупок</p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        onClick={() => window.location.href = '/shop'}
                      >
                        Перейти в магазин
                      </Button>
                    </div>
                  ) : (
                    mockPurchases.map((purchase) => (
                      <div 
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{purchase.item_name}</h3>
                          <p className="text-sm text-slate-400">
                            {new Date(purchase.created_at).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">
                              {purchase.price} {purchase.currency}
                            </div>
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(purchase.status)} font-semibold`}
                          >
                            {getStatusText(purchase.status)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Настройки аккаунта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Привязка Steam</h3>
                  <p className="text-slate-400 mb-4">
                    Привяжите ваш Steam аккаунт для получения внутриигровых предметов
                  </p>
                  <Button 
                    variant="outline"
                    className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
                  >
                    {mockUser.steam_id ? 'Изменить Steam ID' : 'Привязать Steam'}
                  </Button>
                </div>
                
                <hr className="border-slate-600" />
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Уведомления</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded bg-slate-700 border-slate-600" defaultChecked />
                      <span className="text-slate-300">Уведомления о покупках</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded bg-slate-700 border-slate-600" defaultChecked />
                      <span className="text-slate-300">Новости проекта</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded bg-slate-700 border-slate-600" />
                      <span className="text-slate-300">Эвенты и турниры</span>
                    </label>
                  </div>
                </div>
                
                <hr className="border-slate-600" />
                
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4">Опасная зона</h3>
                  <p className="text-slate-400 mb-4">
                    Удаление аккаунта необратимо и удалит все ваши данные
                  </p>
                  <Button 
                    variant="outline"
                    className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                  >
                    Удалить аккаунт
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}