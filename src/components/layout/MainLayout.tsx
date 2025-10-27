import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-content">
          <h1 className="app-logo">🏋️ GetFit</h1>
          <nav className="desktop-nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/workouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Workouts
            </NavLink>
            <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Nutrition
            </NavLink>
            <NavLink to="/health" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Health
            </NavLink>
            <NavLink to="/activity" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Activity
            </NavLink>
            <NavLink to="/social" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Social
            </NavLink>
          </nav>
          <NavLink to="/settings" className="settings-btn">⚙️</NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </NavLink>
        <NavLink to="/workouts" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
          <span className="nav-icon">💪</span>
          <span className="nav-label">Workout</span>
        </NavLink>
        <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
          <span className="nav-icon">🍎</span>
          <span className="nav-label">Nutrition</span>
        </NavLink>
        <NavLink to="/social" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
          <span className="nav-icon">👥</span>
          <span className="nav-label">Social</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;

