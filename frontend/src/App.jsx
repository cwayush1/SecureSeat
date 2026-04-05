import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPortal from './pages/UserPortal';
import Checkout from './pages/Checkout'; 
import Login from './pages/Login';
import MyTickets from './pages/MyTickets';
import SecurityScan from './pages/SecurityScan';
import AdminDashboard from './pages/AdminDashboard';
import  './index.css';

function App() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  // Basic token decoding to check role (in production use a proper jwt-decode library)
  let userRole = 'User';
  if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userRole = payload.role;
    } catch (e) {}
  }

  const handleLogout = () => {
      localStorage.removeItem('token');
      window.location.href = '/login';
  };

  return (
    <Router>
      <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '20px' }}>
        
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: 'white', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>🎟️ SecureSeat</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <a href="/" style={{ textDecoration: 'none', color: '#34495e', fontWeight: 'bold' }}>Matches</a>
                
                {isLoggedIn ? (
                    <>
                        <a href="/my-tickets" style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold' }}>My Tickets</a>
                        {userRole === 'Security' && <a href="/security" style={{ textDecoration: 'none', color: '#e74c3c', fontWeight: 'bold' }}>Security Scanner</a>}
                        {userRole === 'Admin' && <a href="/admin" style={{ textDecoration: 'none', color: '#f39c12', fontWeight: 'bold' }}>Admin Panel</a>}
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '5px 10px', borderRadius: '4px' }}>Logout</button>
                    </>
                ) : (
                    <a href="/login" style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold' }}>Login</a>
                )}
            </div>
        </nav>

        <Routes>
          <Route path="/" element={<UserPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/:matchId/:seatId/:tierName" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/my-tickets" element={isLoggedIn ? <MyTickets /> : <Navigate to="/login" />} />
          <Route path="/security" element={<SecurityScan />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;