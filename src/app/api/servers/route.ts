import { NextRequest, NextResponse } from 'next/server'

// Мок данные серверов для демонстрации
const MOCK_SERVERS = {
  servers: {
    server1: {
      name: "Dark Paradise | Vanilla",
      description: "Классический режим SCP:SL без модификаций. Полное погружение в атмосферу Фонда SCP.",
      server_type: "vanilla",
      max_players: 25,
      players: 18,
      is_online: true,
      last_updated: new Date().toISOString()
    },
    server2: {
      name: "Dark Paradise | Only Events",
      description: "Специальные события и уникальные режимы игры. Еженедельные тематические эвенты.",
      server_type: "events",
      max_players: 30,
      players: 23,
      is_online: true,
      last_updated: new Date().toISOString()
    }
  }
}

export async function GET() {
  try {
    // Добавляем небольшую задержку для имитации реального API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Симулируем изменение количества игроков
    const randomVariation1 = Math.floor(Math.random() * 5) - 2
    const randomVariation2 = Math.floor(Math.random() * 5) - 2
    
    MOCK_SERVERS.servers.server1.players = Math.max(0, Math.min(25, 18 + randomVariation1))
    MOCK_SERVERS.servers.server2.players = Math.max(0, Math.min(30, 23 + randomVariation2))
    
    // Обновляем timestamp
    MOCK_SERVERS.servers.server1.last_updated = new Date().toISOString()
    MOCK_SERVERS.servers.server2.last_updated = new Date().toISOString()

    return NextResponse.json(MOCK_SERVERS, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Ошибка API серверов:', error)
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