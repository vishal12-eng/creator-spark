import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="thumbnail" element={<ThumbnailGenerator />} />
                <Route path="ideas" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="branding" element={<Dashboard />} />
                <Route path="chat" element={<Dashboard />} />
                <Route path="history" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
