import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Webhooks from './pages/Webhooks';
import TriggerEvent from './pages/TriggerEvent';
import DeliveryLogs from './pages/DeliveryLogs';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="startup-nav">
          <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#f8fafc' : '', background: isActive ? '#334155' : '' })}>Webhooks</NavLink>
          <NavLink to="/trigger"  style={({ isActive }) => ({ color: isActive ? '#f8fafc' : '', background: isActive ? '#334155' : '' })}>Trigger Event</NavLink>
          <NavLink to="/logs"  style={({ isActive }) => ({ color: isActive ? '#f8fafc' : '', background: isActive ? '#334155' : '' })}>Delivery Logs</NavLink>
        </nav>
        
        <div className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Webhooks />} />
            <Route path="/trigger" element={<TriggerEvent />} />
            <Route path="/logs" element={<DeliveryLogs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
