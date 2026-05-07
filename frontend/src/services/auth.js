import { DEMO_CREDENTIALS, STORAGE_KEYS } from '../utils/constants'

export const authService = {
  
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const agent = DEMO_CREDENTIALS.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && 
              cred.password === password
    )
    
    if (!agent) {
      throw new Error('Invalid email or password')
    }
    
    const token = `raksha_token_${Date.now()}`
    const agentData = {
      name: agent.name,
      role: agent.role,
      id: agent.id,
      email: agent.email,
      avatar: agent.avatar,
      loginTime: new Date().toISOString(),
    }
    
    localStorage.setItem(STORAGE_KEYS.auth, token)
    localStorage.setItem(STORAGE_KEYS.agent, JSON.stringify(agentData))
    
    return { success: true, token, agent: agentData }
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.auth)
    localStorage.removeItem(STORAGE_KEYS.agent)
    window.location.href = '/login'
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.auth)
    return !!token && token !== 'null' && token !== 'undefined'
  },
  
  getCurrentAgent: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.agent)
      if (!data || data === 'undefined' || data === 'null') return null
      return JSON.parse(data)
    } catch (e) {
      console.warn('[AuthService] Failed to parse agent data:', e)
      return null
    }
  },
  
  hasSeenIntro: () => {
    return !!localStorage.getItem(STORAGE_KEYS.introSeen)
  },
  
  markIntroSeen: () => {
    localStorage.setItem(STORAGE_KEYS.introSeen, 'true')
  },
  
  clearIntroSeen: () => {
    localStorage.removeItem(STORAGE_KEYS.introSeen)
  }
}

export default authService
