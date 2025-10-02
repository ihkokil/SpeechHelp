
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeScaling } from './utils/screenScaling'

// Initialize dynamic scaling system
initializeScaling();

createRoot(document.getElementById("root")!).render(<App />);
