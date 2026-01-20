import { useState } from 'react'
import './App.css'
import { useAuth } from './components/AuthContext.jsx'
import { Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
function App() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/signin" />
  }
  return <Home />
}

export default App
