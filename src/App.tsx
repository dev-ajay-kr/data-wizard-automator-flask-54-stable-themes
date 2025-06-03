
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FileProvider } from '@/contexts/FileContext';
import { VerticalNavigation } from '@/components/VerticalNavigation';
import { Home } from '@/pages/Home';
import { Index } from '@/pages/Index';
import { NotFound } from '@/pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FileProvider>
          <Router>
            <VerticalNavigation>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </VerticalNavigation>
            <Toaster />
          </Router>
        </FileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
