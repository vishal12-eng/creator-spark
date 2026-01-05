import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import VideoIdeas from "./pages/VideoIdeas";
import Analytics from "./pages/Analytics";
import Branding from "./pages/Branding";
import AIChat from "./pages/AIChat";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NicheAnalyzer from "./pages/NicheAnalyzer";
import ContentCalendar from "./pages/ContentCalendar";
import BatchGeneration from "./pages/BatchGeneration";
import AdvancedScripting from "./pages/AdvancedScripting";
import TokenHistory from "./pages/TokenHistory";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import BlogEditor from "./pages/BlogEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/blog/new" element={<BlogEditor />} />
                <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="thumbnail" element={<ThumbnailGenerator />} />
                  <Route path="ideas" element={<VideoIdeas />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="branding" element={<Branding />} />
                  <Route path="niche" element={<NicheAnalyzer />} />
                  <Route path="chat" element={<AIChat />} />
                  <Route path="calendar" element={<ContentCalendar />} />
                  <Route path="batch" element={<BatchGeneration />} />
                  <Route path="scripting" element={<AdvancedScripting />} />
                  <Route path="token-history" element={<TokenHistory />} />
                  <Route path="history" element={<History />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
