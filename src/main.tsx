import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { seedDatabase } from './utils/seedData'

// Initialize database with sample data
seedDatabase();

createRoot(document.getElementById("root")!).render(<App />);
