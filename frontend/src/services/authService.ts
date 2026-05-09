import { apiClient } from './apiClient'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
}

interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    role: string
    created_at: string
    updated_at: string
  }
  access_token: string
  refresh_token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async verifyToken(token: string): Promise<AuthResponse['user']> {
    const response = await apiClient.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      password
    })
  }
}
