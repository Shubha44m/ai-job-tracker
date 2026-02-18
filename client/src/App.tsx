import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import JobFeed from './pages/JobFeed';
import Dashboard from './pages/Dashboard';
import AIChat from './components/AIChat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobFeed />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
