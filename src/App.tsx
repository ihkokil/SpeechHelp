
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import Pricing from '@/pages/Pricing';
import { Toaster } from "sonner";
import { CheckoutSuccess } from '@/components/pricing/CheckoutSuccess';
import Index from '@/pages/Index';
import MySpeeches from '@/pages/MySpeeches';
import SpeechLab from '@/pages/SpeechLab';
import NotFound from '@/pages/NotFound';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for dark mode preference
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      setIsDarkMode(true);
    }

    // Apply dark mode class to body if enabled
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/my-speeches" element={<MySpeeches />} />
        <Route path="/speech-lab" element={<SpeechLab />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthProvider>
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
