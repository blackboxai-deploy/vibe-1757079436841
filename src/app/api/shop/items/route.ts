import { NextResponse } from 'next/server'

// Мок данные товаров магазина
const MOCK_SHOP_ITEMS = {
  items: [
    {
      id: 1,
      name: "VIP Status (30 дней)",
      description: "Привилегированный статус с особыми возможностями в игре: приоритет в очереди, эксклюзивные предметы и доступ к VIP зонам.",
      price: 299.00,
      currency: "RUB",
      category: "vip",
      image_url: null
    },
    {
      id: 2,
      name: "Premium Kit",
      description: "Эксклюзивный набор предметов для игры: улучшенное снаряжение, медикаменты и особые инструменты.",
      price: 199.00,
      currency: "RUB",
      category: "items",
      image_url: null
    },
    {
      id: 3,
      name: "Server Priority",
      description: "Приоритетное подключение к серверам и резервирование места в очереди.",
      price: 99.00,
      currency: "RUB",
      category: "access",
      image_url: null
    },
    {
      id: 4,
      name: "Custom Badge",
      description: "Персонализированная плашка в игре с вашим никнеймом и особыми эффектами.",
      price: 149.00,
      currency: "RUB",
      category: "cosmetic",
      image_url: null
    },
    {
      id: 5,
      name: "Event Access",
      description: "Доступ ко всем эвентам на месяц: турниры, специальные режимы и эксклюзивные мероприятия.",
      price: 249.00,
      currency: "RUB",
      category: "events",
      image_url: null
    },
    {
      id: 6,
      name: "Lifetime VIP",
      description: "Пожизненный VIP статус с максимальными привилегиями и эксклюзивным контентом.",
      price: 1999.00,
      currency: "RUB",
      category: "vip",
      image_url: null
    }
  ]
}

export async function GET() {
  try {
    // Добавляем небольшую задержку для имитации реального API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json(MOCK_SHOP_ITEMS, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Ошибка API магазина:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}