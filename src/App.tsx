import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardLibrary from "./pages/DashboardLibrary";
import DashboardAnalytics from "./pages/DashboardAnalytics";
import NovelDetails from "./pages/NovelDetails";
import ReadingInterface from "./pages/ReadingInterface";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="library" element={<DashboardLibrary />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="history" element={<div className="p-6"><h1 className="text-2xl font-bold">Reading History</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="goals" element={<div className="p-6"><h1 className="text-2xl font-bold">Goals</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="achievements" element={<div className="p-6"><h1 className="text-2xl font-bold">Achievements</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="stats" element={<div className="p-6"><h1 className="text-2xl font-bold">Statistics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="schedule" element={<div className="p-6"><h1 className="text-2xl font-bold">Schedule</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
          </Route>
          <Route path="/novel/:id" element={<NovelDetails />} />
          <Route path="/reading/:novelId/:chapterId" element={<ReadingInterface />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
