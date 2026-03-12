import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ReportIncidentPage from "./pages/ReportIncidentPage";
import IncidentListPage from "./pages/IncidentListPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoginGate() {
  const { currentUser } = useApp();
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return <LoginPage />;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginGate />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<AuthGate><DashboardPage /></AuthGate>} />
    <Route path="/report" element={<AuthGate><ReportIncidentPage /></AuthGate>} />
    <Route path="/incidents" element={<AuthGate><IncidentListPage /></AuthGate>} />
    <Route path="/incidents/:id" element={<AuthGate><IncidentDetailPage /></AuthGate>} />
    <Route path="/admin" element={<AuthGate><AdminDashboardPage /></AuthGate>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
