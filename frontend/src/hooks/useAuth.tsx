import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authStore } from '@store/authStore'
import { authService } from '@services/authService'

interface UseAuthReturn {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
  refreshToken: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const user = authStore((state) => state.user)
  const isAuthenticated = authStore((state) => state.isAuthenticated)
  const setUser = authStore((state) => state.setUser)
  const setTokens = authStore((state) => state.setTokens)
  const clearAuth = authStore((state) => state.clearAuth)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (token && refreshToken) {
        try {
          setIsLoading(true)
          const user = await authService.verifyToken(token)
          setUser(user)
          setTokens(token, refreshToken)
        } catch (error) {
          // Token invalid, try refresh
          try {
            await refreshToken()
          } catch (refreshError) {
            clearAuth()
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authService.login(email, password)
      
      setUser(response.user)
      setTokens(response.access_token, response.refresh_token)
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      toast.success('Login successful!')
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [navigate, location.state, setUser, setTokens])

  const logout = useCallback(() => {
    clearAuth()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }, [navigate, clearAuth])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      const response = await authService.register(email, password, name)
      
      setUser(response.user)
      setTokens(response.access_token, response.refresh_token)
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      toast.success('Registration successful!')
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [navigate, setUser, setTokens])

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      
      setUser(response.user)
      setTokens(response.access_token, response.refresh_token)
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
    } catch (error) {
      clearAuth()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      throw error
    }
  }, [setUser, setTokens, clearAuth])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshToken,
  }
}
