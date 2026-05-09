import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Pages
import { LoginPage } from '@pages/LoginPage'
import { DashboardPage } from '@pages/DashboardPage'
import { SetupPage } from '@pages/SetupPage'
import { ScriptStudioPage } from '@pages/ScriptStudioPage'
import { VideoGenerationPage } from '@pages/VideoGenerationPage'
import { CaptionsPage } from '@pages/CaptionsPage'
import { TemplatesPage } from '@pages/TemplatesPage'

// Components
import { ProtectedRoute } from '@components/ProtectedRoute'
import { LoadingSpinner } from '@components/LoadingSpinner'
import { ErrorBoundary } from '@components/ErrorBoundary'

// Hooks
import { useAuth } from '@hooks/useAuth'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
          >
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/setup"
                element={
                  <ProtectedRoute>
                    <SetupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/script-studio"
                element={
                  <ProtectedRoute>
                    <ScriptStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video-generation"
                element={
                  <ProtectedRoute>
                    <VideoGenerationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/captions"
                element={
                  <ProtectedRoute>
                    <CaptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <TemplatesPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                      <p className="text-gray-300 mb-8">Page not found</p>
                      <a
                        href="/dashboard"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>

            {/* Global Toast */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </motion.div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
