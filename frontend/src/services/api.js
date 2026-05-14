/**
 * Raksha AI — Central API Service
 * All backend calls go through this file.
 * Base URL: http://localhost:8000
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Axios instance ──────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('raksha_auth_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('raksha_auth_token')
      localStorage.removeItem('raksha_agent_data')
      window.location.href = '/login'
    }
    const message = error.response?.data?.detail || error.message || 'API Error'
    console.error(`[Raksha API Error] ${message}`, error)
    return Promise.reject(new Error(message))
  }
)

// ── Health ──────────────────────────────────────────────────
export const checkHealth = () => api.get('/health')

// ── Dashboard ───────────────────────────────────────────────

/**
 * GET /api/dashboard/live-stats
 * Returns: calls_last_1h, calls_last_24h, calls_last_7d,
 *          active_calls_count, emotion_distribution, avg_response_time
 */
export const getLiveStats = () => api.get('/api/dashboard/live-stats')

/**
 * GET /api/dashboard/heatmap
 * Returns: Array of { lat, lng, priority, case_id, intent }
 */
export const getHeatmapData = () => api.get('/api/dashboard/heatmap')
export const getUnits = () => api.get('/api/dashboard/units')

// ── Cases ────────────────────────────────────────────────────

/**
 * GET /api/cases
 * Filters: status, priority, emotion_level, intent_type, limit, offset
 */
export const getCases = (params = {}) => api.get('/api/cases', { params })

/**
 * GET /api/cases/stats/today
 * Returns: total_calls, by_emotion, by_intent, by_status, by_priority
 */
export const getTodayStats = () => api.get('/api/cases/stats/today')

/**
 * GET /api/cases/{case_id}
 */
export const getCase = (caseId) => api.get(`/api/cases/${caseId}`)

/**
 * PATCH /api/cases/{case_id}/status
 * Body: { status: string, notes?: string }
 */
export const updateCaseStatus = (caseId, status, notes) =>
  api.patch(`/api/cases/${caseId}/status`, { status, notes })

/**
 * PATCH /api/cases/{case_id}/resolve
 */
export const resolveCase = (caseId) => api.patch(`/api/cases/${caseId}/resolve`)

/**
 * PATCH /api/cases/{case_id}
 * Body: any fields to update (e.g., ai_summary, notes, priority)
 */
export const updateCase = (caseId, updates) => api.patch(`/api/cases/${caseId}`, updates)

export default api
