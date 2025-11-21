import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import App from './App';
import { AuthProvider } from './auth-context';
import { ThemeProvider } from './contexts/theme-context';
import { LanguageProvider } from './contexts/language-context';
import { Toaster } from './components/ui/toaster';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster/>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
