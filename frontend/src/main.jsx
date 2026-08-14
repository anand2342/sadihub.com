import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { resetStoreToDefault, getStore, saveStore } from './lib/dataStore.js';
// Expose reset function globally so admin can call window.resetPortalData() from browser console if needed
window.resetPortalData = () => {
    resetStoreToDefault();
    console.log('✅ Portal data reset to defaults. Refreshing...');
    window.location.reload();
};
// On startup: if localStorage is nearly full (>4.5MB), auto-strip base64 photos to free space
try {
    const store = getStore();
    if (store.photos && store.photos.length > 0) {
        const raw = JSON.stringify(store);
        // 5MB limit — warn at 4MB
        if (raw.length > 4 * 1024 * 1024) {
            console.warn('Storage nearly full — auto-removing oldest photos to free space.');
            store.photos = store.photos.slice(0, 5); // Keep only 5 most recent
            saveStore(store);
        }
    }
}
catch {
    // Ignore startup check errors
}
createRoot(document.getElementById('root')).render(<StrictMode>
    <App />
  </StrictMode>);
