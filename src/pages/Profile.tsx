import { User as UserIcon, LogOut, Settings, Bell, Shield, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <UserIcon size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="text-blue-500" size={28} />
        <h1 className="text-3xl font-black text-white tracking-tight">My Profile</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-blue-500/20 relative z-10 shrink-0">
            {user.email.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center sm:text-left relative z-10">
            <h2 className="text-2xl font-bold text-white mb-1">{user.email}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 uppercase font-semibold text-xs border border-gray-700">Account ID: {user.id.substring(0, 8)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <Link to="/my-bets" className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors group">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Betting History</h3>
              <p className="text-xs text-gray-400">View your past and active bets</p>
            </div>
          </Link>
          
          <Link to="/settings" className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors group">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-white group-hover:scale-110 transition-all">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Account Settings</h3>
              <p className="text-xs text-gray-400">Password, personal details</p>
            </div>
          </Link>

          <Link to="/settings/responsible" className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors group">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Responsible Gambling</h3>
              <p className="text-xs text-gray-400">Manage limits and time-outs</p>
            </div>
          </Link>

          <Link to="/notifications" className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors group">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Notifications</h3>
              <p className="text-xs text-gray-400">Alerts and promotions</p>
            </div>
          </Link>
        </div>
        
        <div className="p-6 pt-0 border-t border-gray-800 mt-2">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-red-500 font-bold hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
