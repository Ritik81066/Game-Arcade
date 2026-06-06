import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leaderboardService, gameService } from '../services/gameArcadeAPI';
import { Loading } from '../components/Common';
import { motion } from 'framer-motion';

export const GameDetailPage = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameResponse = await gameService.getGameBySlug(slug);
        setGame(gameResponse.data);

        const lbResponse = await leaderboardService.getGameLeaderboard(slug, 10);
        setLeaderboard(lbResponse.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const navigate = useNavigate();

  if (loading) return <Loading />;
  if (!game) return <div className="text-center py-16">Game not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-12"
        >
          <div className="flex items-center gap-8 mb-6">
            <div className="text-6xl">🎮</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{game.name}</h1>
              <p className="text-gray-400 mb-4">{game.description}</p>
              <div className="flex gap-3">
                <span className="bg-primary/20 text-primary px-4 py-2 rounded-lg">
                  {game.difficulty}
                </span>
                <span className="bg-secondary/20 text-secondary px-4 py-2 rounded-lg">
                  {game.category}
                </span>
              </div>
            </div>
          </div>

          {game.instructions && (
            <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Instructions:</h3>
              <p className="text-gray-300">{game.instructions}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/play/${slug}`)}
            className="btn-primary text-lg px-8 py-4 w-full"
          >
            Play {game.name}
          </motion.button>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">Top 10 Scores</h2>
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary w-12">{entry.rank}</span>
                  <div>
                    <p className="font-medium">{entry.username}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-secondary">{entry.points}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
