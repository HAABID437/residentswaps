import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './store'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import PostSwap from './pages/PostSwap'
import Profile from './pages/Profile'
import Nav from './components/Nav'

function Protected({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { user } = useApp()

  return (
    <>
      {user && <Nav />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/post" element={<Protected><PostSwap /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
