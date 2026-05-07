import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fail-safe timeout to prevent indefinite blank screen
    const failSafe = setTimeout(() => {
      if (isLoading) setIsLoading(false)
    }, 2000)

    console.log('[AuthContext] Initializing...')
    try {
      const authenticated = authService.isAuthenticated()
      const currentAgent = authService.getCurrentAgent()
      console.log('[AuthContext] Auth state:', { authenticated, agent: currentAgent?.name })
      
      setIsAuthenticated(authenticated)
      setAgent(currentAgent)
    } catch (err) {
      console.error('[AuthContext] Init error:', err)
    } finally {
      console.log('[AuthContext] Setting isLoading to false')
      setIsLoading(false)
      clearTimeout(failSafe)
    }
  }, [])

  const login = async (email, password) => {
    const result = await authService.login(email, password)
    setAgent(result.agent)
    setIsAuthenticated(true)
    return result
  }

  const logout = () => {
    authService.logout()
    setAgent(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      agent,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
