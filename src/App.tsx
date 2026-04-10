import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Guides from "./pages/Guides.tsx";
import Vehicles from "./pages/Vehicles.tsx";
import Permits from "./pages/Permits.tsx";
import MyListings from "./pages/MyListings.tsx";
import SupplierDashboard from "./pages/SupplierDashboard.tsx";
import SupplierGuides from "./pages/SupplierGuides.tsx";
import SupplierVehicles from "./pages/SupplierVehicles.tsx";
import SupplierBookings from "./pages/SupplierBookings.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useAuth } from "./hooks/useAuth.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      {/* Operator routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/permits" element={<Permits />} />
      <Route path="/my-listings" element={<MyListings />} />
      {/* Supplier routes */}
      <Route path="/supplier" element={<SupplierDashboard />} />
      <Route path="/supplier/guides" element={<SupplierGuides />} />
      <Route path="/supplier/vehicles" element={<SupplierVehicles />} />
      <Route path="/supplier/bookings" element={<SupplierBookings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
