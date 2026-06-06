import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gameService } from '../services/gameArcadeAPI';
import { Loading } from '../components/Common';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameService.getAllGames();
        setGames(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <Loading />;

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🎮 Game Arcade
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Play exciting games, compete on leaderboards, and unlock achievements
          </p>
          <Link to="/games" className="btn-primary text-lg px-8 py-3">
            Start Playing
          </Link>
        </div>
      </motion.div>

      {/* Featured Games */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Games</h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={item}>
              <Link to={`/game/${game.slug}`}>
                <div className="card hover:border hover:border-primary group cursor-pointer">
                  <div className="mb-4 text-4xl">🎯</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {game.difficulty}
                    </span>
                    <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                      {game.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link to="/games" className="btn-secondary text-lg px-8 py-3">
            View All Games
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16 bg-gray-900/50 rounded-lg my-8">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Join?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Compete', desc: 'Battle other players on global leaderboards' },
            { title: 'Achieve', desc: 'Unlock achievements and collect rewards' },
            { title: 'Play', desc: 'Multiple classic arcade games to enjoy' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
