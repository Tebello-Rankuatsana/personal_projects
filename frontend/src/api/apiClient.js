import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120_000, // 2 min — LLM calls can be slow
})

// Request interceptor — log in dev
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[api] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'
    console.error('[api] Error:', message)
    return Promise.reject(new Error(message))
  }
)

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const documentsAPI = {
  list: () => apiClient.get('/documents'),
  upload: (formData) => apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => apiClient.delete(`/documents/${id}`),
}

export const chatAPI = {
  send: (message, subject, mode, sessionId) =>
    apiClient.post('/chat', { message, subject, mode, session_id: sessionId }),
  history: (sessionId, limit = 50) =>
    apiClient.get('/chat/history', { params: { session_id: sessionId, limit } }),
  clearHistory: (sessionId) =>
    apiClient.delete('/chat/history', { params: { session_id: sessionId } }),
}

export const quizzesAPI = {
  list: (subject) => apiClient.get('/quizzes', { params: { subject } }),
  get: (id) => apiClient.get(`/quizzes/${id}`),
  generate: (payload) => apiClient.post('/quizzes/generate', payload),
  submitAttempt: (id, answers) => apiClient.post(`/quizzes/${id}/attempt`, { answers }),
}

export const flashcardsAPI = {
  list: (subject, difficulty) =>
    apiClient.get('/flashcards', { params: { subject, difficulty } }),
  generate: (payload) => apiClient.post('/flashcards/generate', payload),
  updateDifficulty: (id, difficulty) =>
    apiClient.patch(`/flashcards/${id}/difficulty`, { difficulty }),
  delete: (id) => apiClient.delete(`/flashcards/${id}`),
}

export const gamesAPI = {
  list: (subject, type) => apiClient.get('/games', { params: { subject, type } }),
  get: (id) => apiClient.get(`/games/${id}`),
  generate: (payload) => apiClient.post('/games/generate', payload),
}

export default apiClient
