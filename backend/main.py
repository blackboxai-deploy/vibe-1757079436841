from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import sqlite3
import json
import os
from datetime import datetime, timedelta
import jwt
from typing import Optional, List
import asyncio
from contextlib import asynccontextmanager
import uvicorn

# Создаем директорию для базы данных если её нет
os.makedirs("backend", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_database()
    print("🚀 Dark Paradise API запущен!")
    yield
    # Shutdown
    print("🛑 Dark Paradise API остановлен!")

app = FastAPI(
    title="Dark Paradise SCP:SL API",
    description="API для сети серверов Dark Paradise",
    version="1.0.0",
    lifespan=lifespan
)

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Конфигурация
JWT_SECRET = "dark_paradise_secret_key_2024"
JWT_ALGORITHM = "HS256"

DISCORD_CLIENT_ID = "YOUR_DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "YOUR_DISCORD_CLIENT_SECRET"
DISCORD_REDIRECT_URI = "http://localhost:3000/api/auth/discord/callback"

YOOKASSA_SHOP_ID = "YOUR_YOOKASSA_SHOP_ID"
YOOKASSA_SECRET_KEY = "YOUR_YOOKASSA_SECRET_KEY"

STEAM_API_KEY = "AEE99372C058CCF76EFD4D71C028FBBD"

# Данные серверов
SERVERS_CONFIG = {
    "server1": {
        "name": "Dark Paradise | Vanilla",
        "description": "Классический режим SCP:SL без модификаций. Полное погружение в атмосферу Фонда SCP.",
        "api_url": "https://api.scplist.kr/api/servers/79084",
        "max_players": 25,
        "server_type": "vanilla"
    },
    "server2": {
        "name": "Dark Paradise | Only Events", 
        "description": "Специальные события и уникальные режимы игры. Еженедельные тематические эвенты.",
        "api_url": "https://api.scplist.kr/api/servers/80810",
        "max_players": 30,
        "server_type": "events"
    }
}

def init_database():
    """Инициализация SQLite базы данных"""
    conn = sqlite3.connect('backend/dark_paradise.db')
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            discord_id VARCHAR(50) UNIQUE NOT NULL,
            username VARCHAR(100) NOT NULL,
            discriminator VARCHAR(10),
            avatar VARCHAR(200),
            steam_id VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица покупок
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_name VARCHAR(100) NOT NULL,
            item_description TEXT,
            price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'RUB',
            status VARCHAR(20) DEFAULT 'pending',
            payment_id VARCHAR(100),
            yookassa_payment_id VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Таблица товаров магазина
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shop_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'RUB',
            category VARCHAR(50),
            image_url VARCHAR(200),
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица статистики серверов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS server_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_key VARCHAR(20) NOT NULL,
            players_count INTEGER NOT NULL,
            is_online BOOLEAN NOT NULL,
            recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Добавляем базовые товары в магазин если их нет
    cursor.execute('SELECT COUNT(*) FROM shop_items')
    if cursor.fetchone()[0] == 0:
        default_items = [
            ("VIP Status (30 дней)", "Привилегированный статус с особыми возможностями в игре", 299.00, "RUB", "vip", None),
            ("Premium Kit", "Эксклюзивный набор предметов для игры", 199.00, "RUB", "items", None),
            ("Server Priority", "Приоритетное подключение к серверам", 99.00, "RUB", "access", None),
            ("Custom Badge", "Персонализированная плашка в игре", 149.00, "RUB", "cosmetic", None),
            ("Event Access", "Доступ ко всем эвентам на месяц", 249.00, "RUB", "events", None)
        ]
        cursor.executemany('''
            INSERT INTO shop_items (name, description, price, currency, category, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', default_items)
    
    conn.commit()
    conn.close()
    print("✅ База данных инициализирована!")

async def get_players_count(api_url: str) -> dict:
    """Получение количества игроков с API"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(api_url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "players": data.get("players", 0),
                    "max_players": data.get("maxPlayers", 0),
                    "is_online": True,
                    "last_updated": datetime.now().isoformat()
                }
            else:
                return {"players": 0, "max_players": 0, "is_online": False, "error": "API недоступно"}
    except Exception as e:
        print(f"Ошибка получения данных сервера {api_url}: {e}")
        return {"players": 0, "max_players": 0, "is_online": False, "error": str(e)}

@app.get("/")
async def root():
    return {
        "message": "Dark Paradise SCP:SL API", 
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/servers")
async def get_all_servers():
    """Получение статуса всех серверов"""
    servers_data = {}
    
    for server_key, config in SERVERS_CONFIG.items():
        server_stats = await get_players_count(config["api_url"])
        servers_data[server_key] = {
            "name": config["name"],
            "description": config["description"],
            "server_type": config["server_type"],
            "max_players": config["max_players"],
            **server_stats
        }
        
        # Сохраняем статистику в БД
        try:
            conn = sqlite3.connect('backend/dark_paradise.db')
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO server_stats (server_key, players_count, is_online)
                VALUES (?, ?, ?)
            ''', (server_key, server_stats["players"], server_stats["is_online"]))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Ошибка сохранения статистики: {e}")
    
    return {"servers": servers_data}

@app.get("/api/server/{server_key}")
async def get_server_info(server_key: str):
    """Получение информации о конкретном сервере"""
    if server_key not in SERVERS_CONFIG:
        raise HTTPException(status_code=404, detail="Сервер не найден")
    
    config = SERVERS_CONFIG[server_key]
    server_stats = await get_players_count(config["api_url"])
    
    return {
        "name": config["name"],
        "description": config["description"],
        "server_type": config["server_type"],
        "max_players": config["max_players"],
        **server_stats
    }

@app.get("/api/steam-nickname/{steam_id}")
async def get_steam_nickname(steam_id: str):
    """Получение никнейма Steam по Steam ID"""
    try:
        url = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key={STEAM_API_KEY}&steamids={steam_id}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            data = response.json()
            
            if data.get("response", {}).get("players"):
                player = data["response"]["players"][0]
                return {"nickname": player.get("personaname", "Unknown")}
            else:
                raise HTTPException(status_code=404, detail="Профиль Steam не найден")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка Steam API: {str(e)}")

@app.get("/api/shop/items")
async def get_shop_items():
    """Получение товаров магазина"""
    try:
        conn = sqlite3.connect('backend/dark_paradise.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, name, description, price, currency, category, image_url 
            FROM shop_items 
            WHERE is_active = 1
            ORDER BY category, price
        ''')
        items = cursor.fetchall()
        conn.close()
        
        return {
            "items": [
                {
                    "id": item[0],
                    "name": item[1],
                    "description": item[2],
                    "price": float(item[3]),
                    "currency": item[4],
                    "category": item[5],
                    "image_url": item[6]
                }
                for item in items
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения товаров: {str(e)}")

@app.post("/api/auth/discord")
async def discord_auth(request: Request):
    """Discord OAuth аутентификация (заглушка)"""
    # TODO: Реализовать Discord OAuth
    return {
        "message": "Discord auth endpoint",
        "note": "Требует настройки Discord OAuth credentials"
    }

@app.post("/api/payment/create")
async def create_payment(request: Request):
    """Создание платежа через ЮKassa (заглушка)"""
    # TODO: Реализовать интеграцию с ЮKassa
    return {
        "message": "Payment creation endpoint", 
        "note": "Требует настройки ЮKassa credentials"
    }

@app.get("/health")
async def health_check():
    """Проверка здоровья API"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "servers": list(SERVERS_CONFIG.keys())
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)