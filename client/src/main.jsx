

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './Context/AppContext.jsx';
import { CookiesProvider } from 'react-cookie';  // ✅ import CookiesProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>  {/* ✅ wrap with CookiesProvider */}
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>
);
