import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'

// Import the generated _auth tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import {Toaster} from "@/components/ui/sonner.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { authClient } from './lib/auth-client.ts'
import { LoaderCircle } from './components/animate-ui/icons/loader-circle'

export interface contextRouter {
  auth: typeof authClient.$Infer.Session | null
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  context: {
    auth: null
  }
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

function App() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="flex h-screen items-center justify-center"><LoaderCircle animate /></div>
  }

  return (
    <RouterProvider 
      router={router} 
      context={{ auth: session }} 
    />
  )
}

const rootElement = document.getElementById('app') 
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App /> 
        <Toaster />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
