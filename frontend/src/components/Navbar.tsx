import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-64 bg-gray-800 border-r border-gray-700 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SentinelAI</h1>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 space-y-2">
        <NavLink
          icon={<PhoneIcon className="w-5 h-5" />}
          label="Live Assist"
          path="/"
          isActive={isActive("/")}
          onClick={() => navigate("/")}
        />
        <NavLink
          icon={<UserGroupIcon className="w-5 h-5" />}
          label="Team Leader"
          path="/team-leader"
          isActive={isActive("/team-leader")}
          onClick={() => navigate("/team-leader")}
        />
        <NavLink
          icon={<ChartBarIcon className="w-5 h-5" />}
          label="Analytics"
          path="/analytics"
          isActive={isActive("/analytics")}
          onClick={() => navigate("/analytics")}
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-900">
        <div className="text-xs text-gray-500 space-y-1">
          <p>🟢 Backend: Connected</p>
          <p>📊 Real-time: Active</p>
          <p className="text-gray-600 mt-4">© 2024 SentinelAI</p>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, path, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Navbar;
