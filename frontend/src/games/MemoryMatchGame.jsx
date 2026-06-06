import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const MemoryMatchGame = ({ onGameEnd }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const symbols = ['🍎', '🍌', '🍒', '🍓', '🥝', '🍊', '🍋', '🍉'];
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  const handleCardClick = (index) => {
    if (!flipped.includes(index) && !matched.includes(index) && flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const isGameComplete = matched.length === cards.length;

  useEffect(() => {
    if (isGameComplete && cards.length > 0) {
      setTimeout(() => {
        onGameEnd?.({ score: (16 - moves) * 50, duration: 0 });
      }, 500);
    }
  }, [isGameComplete, moves, cards.length, onGameEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <p className="text-gray-400">Moves: <span className="text-primary text-xl font-bold">{moves}</span></p>
        <p className="text-gray-400">Matched: <span className="text-secondary text-xl font-bold">{matched.length / 2} / 8</span></p>
      </div>

      <div className="grid grid-cols-4 gap-3 p-6 bg-gray-800/50 rounded-lg">
        {cards.map((card, index) => (
          <motion.button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 text-4xl font-bold rounded-lg transition-all ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-primary text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </motion.button>
        ))}
      </div>

      {isGameComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="card text-center">
            <h2 className="text-3xl font-bold mb-4">You Won!</h2>
            <p className="text-xl text-gray-400 mb-4">Completed in {moves} moves</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
