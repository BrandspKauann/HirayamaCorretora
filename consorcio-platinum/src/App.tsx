import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Consorcio from "./pages/Consorcio";
import NotFound from "./pages/NotFound";
import Content from "./pages/Content";
import ContentDetail from "./pages/ContentDetail";
import SalaryFits from "./pages/SalaryFits";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="hirayama-seguros-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/consorcio">
              <RouteScrollToTop />
              <Routes>
                <Route path="/" element={<Consorcio />} />
                <Route path="/conteudo" element={<Content />} />
                <Route path="/conteudo/:slug" element={<ContentDetail />} />
                <Route path="/salaryfits" element={<SalaryFits />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppButton />
              <ExitIntentModal />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
