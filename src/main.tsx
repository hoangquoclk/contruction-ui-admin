import * as React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./global.css"

import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={0}>
          <App />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
)
