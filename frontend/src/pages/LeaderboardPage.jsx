import { useEffect, useState } from 'react';
import { leaderboardService } from '../services/gameArcadeAPI';
import { Loading } from '../components/Common';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lbResponse = await leaderboardService.getGlobalLeaderboard(50);
        setLeaderboard(lbResponse.data);

        if (user) {
          const rankResponse = await leaderboardService.getUserRank();
          setUserRank(rankResponse.data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center">Global Leaderboard</h1>

        {/* User's Current Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Your Rank</p>
                <h3 className="text-2xl font-bold">{userRank.username}</h3>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-primary">#{userRank.rank}</p>
                <p className="text-2xl text-secondary font-bold">{userRank.totalScore} pts</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="card"
        >
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-center justify-between p-4 rounded-lg transition ${
                  userRank && entry.id === user?.id
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 text-center">
                    <span className="text-2xl font-bold text-primary">#{entry.rank}</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-lg">{entry.username}</p>
                    <p className="text-sm text-gray-400">{entry.gamesPlayed} games played</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-secondary">{entry.totalScore}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
