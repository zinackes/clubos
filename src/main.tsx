import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Importation de l'intégration Router-Query
// Note: Si tu n'es pas en SSR, l'import peut varier, mais voici la forme standard
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { routeTree } from './routeTree.gen'
import { authClient } from './lib/auth-client.ts'
import { LoaderCircle } from './components/animate-ui/icons/loader-circle'
import { Toaster } from "@/components/ui/sonner.tsx"
import './styles.css'

const queryClient = new QueryClient()

export interface RouterContext {
  queryClient: QueryClient
  auth: typeof authClient.$Infer.Session | null
}

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: null, 
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

setupRouterSsrQueryIntegration({
  router,
  queryClient,
})

// 5. Enregistrement des types du Route
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle animate />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider 
        router={router} 
        context={{ 
          auth: session,
          queryClient: queryClient 
        }} 
      />
      <Toaster />
    </QueryClientProvider>
  )
}

// 7. Rendu de l'application
const rootElement = document.getElementById('app') 
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}