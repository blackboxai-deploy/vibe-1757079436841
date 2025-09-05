'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Menu, User, ShoppingCart, Server, MessageSquare, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated] = useState(false) // TODO: подключить реальную авторизацию

  const navigation = [
    { name: 'Главная', href: '/', icon: Server },
    { name: 'Серверы', href: '/servers', icon: Server },
    { name: 'Магазин', href: '/shop', icon: ShoppingCart },
    { name: 'Поддержка', href: 'https://t.me/darkparadise_support', icon: MessageSquare, external: true }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                Dark Paradise
              </h1>
              <p className="text-xs text-slate-400 font-mono leading-none">SCP:SL NETWORK</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
                {item.external && (
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-xs px-1 py-0">
                    TG
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Auth Button */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
                onClick={() => {/* TODO: Открыть профиль */}}
              >
                <User className="w-4 h-4 mr-2" />
                Профиль
              </Button>
            ) : (
              <Button
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0"
                onClick={() => {/* TODO: Открыть Discord авторизацию */}}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-slate-900 border-orange-500/20">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 pb-4 border-b border-orange-500/20">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-sm">DP</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Dark Paradise</h2>
                      <p className="text-xs text-slate-400 font-mono">SCP:SL NETWORK</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-3 rounded-lg text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {item.external && (
                          <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-xs">
                            TG
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth */}
                  <div className="pt-4 border-t border-orange-500/20">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
                        onClick={() => {
                          setIsOpen(false)
                          // TODO: Открыть профиль
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Мой профиль
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0"
                        onClick={() => {
                          setIsOpen(false)
                          // TODO: Открыть Discord авторизацию
                        }}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Войти через Discord
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}