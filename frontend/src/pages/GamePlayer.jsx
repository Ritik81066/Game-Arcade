import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scoreService, gameService } from '../services/gameArcadeAPI';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { FlappyBirdGame } from '../games/FlappyBirdGame';
import { SnakeGame } from '../games/SnakeGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { BrickBreakerGame } from '../games/BrickBreakerGame';
import { TetrisGame } from '../games/TetrisGame';
import { motion } from 'framer-motion';

const GamePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [playing, setPlaying] = useState(true);

  const gameComponents = {
    'flappy-bird': FlappyBirdGame,
    'snake-master': SnakeGame,
    'memory-match': MemoryMatchGame,
    'brick-breaker': BrickBreakerGame,
    'tetris-clone': TetrisGame,
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await gameService.getGameBySlug(slug);
        setGameData(response.data);
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    };
    fetchGame();
  }, [slug]);

  const handleGameEnd = async (result) => {
    setPlaying(false);
    try {
      await scoreService.submitScoreBySlug(slug, result.score, result.duration);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const GameComponent = gameComponents[slug];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/games')}
            className="mb-6 text-primary hover:text-primary/80 transition"
          >
            ← Back to Games
          </button>

          {playing && GameComponent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex flex-col items-center justify-center py-8"
            >
              <h1 className="text-3xl font-bold mb-8">Play Game</h1>
              <GameComponent onGameEnd={handleGameEnd} />
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GamePlayer;
