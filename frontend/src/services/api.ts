import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  register: (email: string, password: string, full_name: string) =>
    api.post('/auth/register', { email, password, full_name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },
  getCurrentUser: () => api.get('/users/me'),
}

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
  getSkills: () => api.get('/users/me/skills'),
  addSkill: (skill_name: string, current_level: number, proficiency?: number) =>
    api.post('/users/me/skills', { skill_name, current_level, proficiency }),
  deleteSkill: (skillId: string) => api.delete(`/users/me/skills/${skillId}`),
}

// Resume endpoints
export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  analyze: () => api.post('/resume/analyze', {}),
}

// Analysis endpoints
export const analysisAPI = {
  create: (target_role: string) => api.post('/analysis/create', { target_role }),
  getLatest: () => api.get('/analysis/latest'),
  getHistory: () => api.get('/analysis/history'),
  getById: (id: string) => api.get(`/analysis/${id}`),
  whatIf: (target_role: string, skills: string[]) =>
    api.post('/analysis/what-if', { target_role, skills }),
}

// Career endpoints
export const careerAPI = {
  getAllRoles: () => api.get('/careers'),
  getRoleById: (id: string) => api.get(`/careers/${id}`),
  getRoleSkills: (id: string) => api.get(`/careers/${id}/skills`),
}

// Roadmap endpoints
export const roadmapAPI = {
  generate: (data: any) => api.post('/roadmap/generate', data),
  get: () => api.get('/roadmap'),
  getById: (id: string) => api.get(`/roadmap/${id}`),
  updateItem: (roadmapId: string, itemId: string, status: string) =>
    api.patch(`/roadmap/${roadmapId}/items/${itemId}`, { status }),
}

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getReadinessScore: () => api.get('/dashboard/readiness'),
}

// Progress endpoint
export const progressAPI = {
  get: () => api.get('/progress'),
}

export default api
