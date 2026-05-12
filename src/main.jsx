/**
 * NOTE: The "SES Removing unpermitted intrinsics" warning appearing in the console
 * is typically caused by browser extensions (like Metamask) that use the SES
 * (Secure EcmaScript) library to sandbox the execution environment.
 * This is not an error in the application code itself and does not affect functionality.
 */
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { NotificationsProvider } from './context/NotificationsContext.jsx';

createRoot(document.getElementById('root')).render(
  <NotificationsProvider>
    <App />
  </NotificationsProvider>
);
