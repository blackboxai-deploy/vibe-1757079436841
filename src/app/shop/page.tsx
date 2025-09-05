'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NavigationHeader from '@/components/NavigationHeader'
import { ShoppingCart, Star, Shield, Crown, Gem, Zap } from 'lucide-react'

interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  currency: string
  category: string
  image_url: string | null
}

interface ShopResponse {
  items: ShopItem[]
}

export default function ShopPage() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fetchShopItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/shop/items')
      if (!response.ok) {
        throw new Error('Не удалось получить товары')
      }
      const data: ShopResponse = await response.json()
      setShopItems(data.items)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      console.error('Ошибка загрузки магазина:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShopItems()
  }, [])

  const categories = [
    { key: 'all', name: 'Все товары', icon: ShoppingCart },
    { key: 'vip', name: 'VIP статусы', icon: Crown },
    { key: 'items', name: 'Предметы', icon: Gem },
    { key: 'access', name: 'Доступы', icon: Shield },
    { key: 'cosmetic', name: 'Косметика', icon: Star },
    { key: 'events', name: 'События', icon: Zap }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vip':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50'
      case 'items':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/50'
      case 'access':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/50'
      case 'cosmetic':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/50'
      case 'events':
        return 'bg-green-500/10 text-green-400 border-green-500/50'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vip':
        return Crown
      case 'items':
        return Gem
      case 'access':
        return Shield
      case 'cosmetic':
        return Star
      case 'events':
        return Zap
      default:
        return ShoppingCart
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory)

  const handlePurchase = (item: ShopItem) => {
    // TODO: Реализовать создание платежа через ЮKassa
    alert(`Покупка товара "${item.name}" за ${item.price} ${item.currency}.\nФункционал в разработке!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavigationHeader />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-b border-orange-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">МАГАЗИН</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Поддержи проект и получи эксклюзивные возможности в игре
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Категории</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.key
              
              return (
                <Button
                  key={category.key}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.key)}
                  className={
                    isActive
                      ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0"
                      : "border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-orange-500/20 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-slate-700 rounded mb-4"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-red-400 text-lg font-semibold mb-4">
              <ShoppingCart className="w-6 h-6" />
              Ошибка загрузки магазина
            </div>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button 
              onClick={fetchShopItems}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Повторить попытку
            </Button>
          </div>
        )}

        {/* Shop Items */}
        {!loading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Товаров не найдено
                </h3>
                <p className="text-slate-500">
                  В выбранной категории пока нет товаров
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const Icon = getCategoryIcon(item.category)
                  
                  return (
                    <Card 
                      key={item.id} 
                      className="bg-slate-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] group"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                              <Icon className="w-5 h-5 text-orange-400" />
                              {item.name}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`${getCategoryColor(item.category)} text-xs font-semibold`}
                            >
                              {item.category?.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-400">
                              {item.price}
                            </div>
                            <div className="text-sm text-slate-400">{item.currency}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="h-20 flex items-center justify-center bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                          <Icon className="w-12 h-12 text-orange-400" />
                        </div>
                        
                        <p className="text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 font-semibold"
                          onClick={() => handlePurchase(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Купить за {item.price} {item.currency}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}