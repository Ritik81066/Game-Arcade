import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              🎮 Game Arcade
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            {user && (
              <>
                <Link
                  to="/games"
                  className={`transition ${isActive('/games') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
                >
                  Games
                </Link>
                <Link
                  to="/leaderboard"
                  className={`transition ${isActive('/leaderboard') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/achievements"
                  className={`transition ${isActive('/achievements') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
                >
                  Achievements
                </Link>
                <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-700">
                  <div className="text-sm">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-gray-400 text-xs">{user.totalScore} pts</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
