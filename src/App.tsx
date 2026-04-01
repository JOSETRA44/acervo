import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { Layout } from '@/components/layout/Layout'
import { ToastContainer } from '@/components/ui/Toast'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { InternalDocsPage } from '@/pages/InternalDocsPage'
import { ExternalDocsPage } from '@/pages/ExternalDocsPage'
import { ThreadsPage } from '@/pages/ThreadsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AdminPage } from '@/pages/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppRoutes() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/proyectos" element={<ProjectsPage />} />
        <Route path="/proyectos/:id" element={<ProjectDetailPage />} />
        <Route path="/documentos/internos" element={<InternalDocsPage />} />
        <Route path="/documentos/externos" element={<ExternalDocsPage />} />
        <Route path="/hilos" element={<ThreadsPage />} />
        <Route path="/analitica" element={<AnalyticsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  // useAuthInit vive en el nivel raíz — se ejecuta UNA sola vez
  // y nunca se desmonta al navegar entre rutas
  useAuthInit()

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppRoutes />
        <ToastContainer />
      </HashRouter>
    </QueryClientProvider>
  )
}
