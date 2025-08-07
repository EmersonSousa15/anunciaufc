import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
