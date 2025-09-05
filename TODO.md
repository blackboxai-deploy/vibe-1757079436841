# Dark Paradise SCP:SL - План разработки

## ✅ Выполнено
- [x] Создание sandbox и изучение структуры
- [x] Планирование архитектуры

## 🔄 В процессе

### 1. Backend (FastAPI) - Основная структура
- [ ] Создать основной FastAPI сервер
- [ ] Настроить SQLite базу данных и модели
- [ ] Реализовать Discord OAuth аутентификацию
- [ ] Создать API эндпоинты для серверов
- [ ] Интегрировать с ЮKassa для платежей

### 2. Frontend (Next.js) - Компоненты
- [ ] Главная страница с серверами
- [ ] Система навигации и хедер
- [ ] Компоненты серверов с live статистикой
- [ ] Личный кабинет пользователя
- [ ] Система авторизации через Discord
- [ ] Магазин и история покупок

### 3. Интеграции
- [ ] scplist.kr API для мониторинга серверов
- [ ] Discord OAuth 2.0
- [ ] ЮKassa платёжная система
- [ ] Steam API для никнеймов

### 4. Стилизация и UX
- [ ] SCP Foundation тематический дизайн
- [ ] Анимации и переходы
- [ ] Адаптивная вёрстка
- [ ] Тёмная тема с оранжево-красными акцентами

### 5. Тестирование и оптимизация
- [ ] **AUTOMATIC**: Process placeholder images (placehold.co URLs) → AI-generated images
  - This step executes automatically when placeholders are detected
  - No manual action required - system triggers automatically
  - Ensures all images are ready before testing
- [ ] API тестирование с curl
- [ ] Тестирование авторизации
- [ ] Тестирование платежей
- [ ] Проверка мониторинга серверов
- [ ] Финальная оптимизация

## 🎯 Ключевые особенности
- Real-time мониторинг 2 серверов (Vanilla, Only Events)
- Discord OAuth авторизация
- Интеграция с ЮKassa
- Тёмный дизайн в стиле SCP
- Мобильная адаптивность
- Telegram бот поддержка