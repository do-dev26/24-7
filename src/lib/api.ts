import axios from 'axios'
import { API_URL } from './config'

const api = axios.create({ baseURL: API_URL })

// Auto-attach JWT
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auto-refresh on 401
api.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { token: refresh })
          localStorage.setItem('access_token', data.data.access)
          localStorage.setItem('refresh_token', data.data.refresh)
          err.config.headers.Authorization = `Bearer ${data.data.access}`
          return api(err.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Typed API helpers ──────────────────────────────────────────────────────
export const authAPI = {
  loginWithToken: (idToken: string) =>
    api.post('/auth/login-with-token', { idToken }).then(r => r.data.data),
  register: (email: string, password: string, displayName: string) =>
    api.post('/auth/register', { email, password, displayName }).then(r => r.data.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data.data),
}

export const widgetAPI = {
  list:          ()           => api.get('/widgets').then(r => r.data.data),
  create:        (d: any)    => api.post('/widgets', d).then(r => r.data.data),
  get:           (id: string) => api.get(`/widgets/${id}`).then(r => r.data.data),
  update:        (id: string, d: any) => api.put(`/widgets/${id}`, d).then(r => r.data.data),
  delete:        (id: string) => api.delete(`/widgets/${id}`).then(r => r.data),
  snippet:       (id: string) => api.get(`/widgets/${id}/snippet`).then(r => r.data.data),
  brainOptions:  ()           => api.get('/widgets/meta/brain-options').then(r => r.data.data),
}

export const businessAPI = {
  get:      (wid: string)        => api.get(`/business/${wid}`).then(r => r.data.data),
  save:     (wid: string, d: any) => api.post(`/business/${wid}`, d).then(r => r.data.data),
  rescrape: (wid: string)        => api.post(`/business/${wid}/rescrape`).then(r => r.data.data),
  preview:  (wid: string)        => api.get(`/business/${wid}/preview`).then(r => r.data.data),
}

export const leadAPI = {
  list:    (params?: any) => api.get('/leads', { params }).then(r => r.data.data),
  get:     (id: string)   => api.get(`/leads/${id}`).then(r => r.data.data),
  update:  (id: string, d: any) => api.put(`/leads/${id}`, d).then(r => r.data.data),
  delete:  (id: string)   => api.delete(`/leads/${id}`).then(r => r.data),
  export:  ()             => api.get('/leads/export', { responseType: 'blob' }),
}

export const analyticsAPI = {
  summary:       ()                         => api.get('/analytics/summary').then(r => r.data.data),
  widget:        (id: string, days = 30)    => api.get(`/analytics/widgets/${id}?days=${days}`).then(r => r.data.data),
  leads:         ()                         => api.get('/analytics/leads').then(r => r.data.data),
  conversations: (days = 30)               => api.get(`/analytics/conversations?days=${days}`).then(r => r.data.data),
}

export const billingAPI = {
  plans:       ()           => api.get('/billing/plans').then(r => r.data.data),
  subscription:()           => api.get('/billing/subscription').then(r => r.data.data),
  checkout:    (planId: string) => api.post('/billing/checkout', { planId }).then(r => r.data.data),
  portal:      ()           => api.post('/billing/portal').then(r => r.data.data),
  cancel:      ()           => api.post('/billing/subscription/cancel').then(r => r.data),
}

export const chatAPI = {
  // GET sessions list for a widget (grouped by sessionId)
  sessions: (widgetId: string) =>
    api.get(`/analytics/sessions?widgetId=${widgetId}&days=90`).then(r => r.data.data?.sessions || []),
  // GET full turn-by-turn history for one session
  history:  (widgetId: string, sessionId: string) =>
    api.get(`/chat/${widgetId}/history/${sessionId}`).then(r => r.data.data),
}

export const userAPI = {
  me:         ()        => api.get('/users/me').then(r => r.data.data),
  update:     (d: any)  => api.put('/users/me', d).then(r => r.data.data),
  usage:      ()        => api.get('/users/me/usage').then(r => r.data.data),
  deleteMe:   ()        => api.delete('/users/me').then(r => r.data),
}
