import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import JobFeed from './pages/JobFeed';
import Dashboard from './pages/Dashboard';
import AIChat from './components/AIChat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthStore } from './store/authStore';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const token = useAuthStore((state) => state.token);
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        <Route path="/" element={
          <RequireAuth>
            <JobFeed />
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="/chat" element={
          <RequireAuth>
            <AIChat />
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
