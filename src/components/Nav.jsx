import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, X, LogOut, LayoutDashboard, PlusCircle, User } from 'lucide-react'
import { useApp } from '../store'

export default function Nav() {
  const { user, logout } = useApp()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const initials = user?.name
    ?.split(' ')
    .filter(w => w.startsWith('Dr') === false && w.length > 0)
    .slice(0, 2)
    .map(w => w[0])
    .join('') || 'RS'

  const links = [
    { to: '/dashboard', label: 'Board', icon: LayoutDashboard },
    { to: '/post', label: 'Post Swap', icon: PlusCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  const active = (to) => location.pathname === to

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-nhs-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white" strokeWidth="2.5">
              <path d="M4 12 L12 4 L20 12 L12 20 Z" />
              <circle cx="12" cy="12" r="2.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <span className="font-heading font-700 text-gray-900 text-lg leading-none">
            Resident<span className="text-nhs-blue">Swaps</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active(to)
                  ? 'bg-blue-50 text-nhs-blue'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          <Link to="/profile" className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-nhs-blue text-white text-sm font-semibold hover:bg-nhs-dark transition-colors font-heading">
            {initials}
          </Link>

          <button
            onClick={logout}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active(to) ? 'bg-blue-50 text-nhs-blue' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button
            onClick={() => { setOpen(false); logout() }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
