#!/usr/bin/env python3
import subprocess
import sys
import os

def install_python_deps():
    """Установка Python зависимостей"""
    print("🔧 Установка Python зависимостей...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Python зависимости установлены!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка установки зависимостей: {e}")
        return False

def start_fastapi_server():
    """Запуск FastAPI сервера"""
    print("🚀 Запуск FastAPI сервера...")
    try:
        # Переходим в директорию с backend
        os.chdir("backend")
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен пользователем")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска сервера: {e}")

if __name__ == "__main__":
    print("🌟 Dark Paradise Backend Launcher")
    print("=" * 40)
    
    # Проверяем наличие файлов
    if not os.path.exists("backend/requirements.txt"):
        print("❌ Файл backend/requirements.txt не найден!")
        sys.exit(1)
    
    if not os.path.exists("backend/main.py"):
        print("❌ Файл backend/main.py не найден!")
        sys.exit(1)
    
    # Устанавливаем зависимости
    if not install_python_deps():
        sys.exit(1)
    
    # Запускаем сервер
    start_fastapi_server()