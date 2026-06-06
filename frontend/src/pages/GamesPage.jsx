import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gameService } from '../services/gameArcadeAPI';
import { Loading } from '../components/Common';
import { Link } from 'react-router-dom';

export const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameService.getAllGames();
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <Loading />;

  const categories = ['all', ...new Set(games.map((g) => g.category))];
  const filtered =
    filter === 'all' ? games : games.filter((g) => g.category === filter);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center">Game Library</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Games Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((game) => (
            <motion.div key={game.id} variants={item}>
              <Link to={`/game/${game.slug}`}>
                <div className="card h-full hover:border hover:border-primary group cursor-pointer">
                  <div className="mb-4 text-5xl">🎮</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  {game.instructions && (
                    <p className="text-gray-500 text-xs mb-4">{game.instructions}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {game.difficulty}
                    </span>
                    <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                      {game.category}
                    </span>
                  </div>
                  <button className="w-full mt-4 btn-primary text-sm">
                    Play Game
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
