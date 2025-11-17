import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './public/sw.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/src/public/sw.js')
      .then(registration => {
        console.log('✅ SW registrado:', registration.scope);
      })
      .catch(error => {
        console.error('❌ Error registrando SW:', error);
      });
  });
}
