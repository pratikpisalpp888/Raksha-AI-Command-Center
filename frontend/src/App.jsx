import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
} from 'react-router-dom'
import CinematicIntro from './components/intro/CinematicIntro'
import { AuthProvider, useAuth } from './context/AuthContext'

// ─── Route Guards ──────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { agent, isAuthenticated, isLoading } = useAuth()
  console.log('[ProtectedRoute] state:', { isAuthenticated, isLoading })
  
  if (isLoading) return <div className="min-h-screen bg-[#030810]" />
  
  if (!isAuthenticated || !agent) {
    return <Navigate to="/login" replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  console.log('[PublicRoute] state:', { isAuthenticated, isLoading })
  
  if (isLoading) return <div className="min-h-screen bg-[#030810]" />
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// ─── Main Content Wrapper ──────────────────────────────────
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CaseDetailPage from './pages/CaseDetailPage'
import LiveCallPage from './pages/LiveCallPage'
import ReportsPage from './pages/ReportsPage'

function AppContent() {
  // SET TO FALSE TO BYPASS BLANK INTRO FOR DEBUGGING
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/case/:caseId" element={
          <ProtectedRoute>
            <CaseDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/calls" element={
          <ProtectedRoute>
            <LiveCallPage />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
