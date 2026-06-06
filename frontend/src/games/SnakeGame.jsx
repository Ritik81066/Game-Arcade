import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const SnakeGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tileCount = 20;
    const tileSize = canvas.width / tileCount;

    const gameState = {
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      food: { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
    };

    const gameLoop = () => {
      if (gameState.gameOver) {
        setGameOver(true);
        onGameEnd?.({ score: gameState.score, duration: 0 });
        return;
      }

      gameState.direction = gameState.nextDirection;

      const head = gameState.snake[0];
      const newHead = {
        x: (head.x + gameState.direction.x + tileCount) % tileCount,
        y: (head.y + gameState.direction.y + tileCount) % tileCount,
      };

      if (gameState.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameState.gameOver = true;
      }

      gameState.snake.unshift(newHead);

      if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
        gameState.score += 10;
        setScore(gameState.score);
        gameState.food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
      } else {
        gameState.snake.pop();
      }

      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22c55e';
      gameState.snake.forEach((segment) => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2);
      });

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(gameState.food.x * tileSize, gameState.food.y * tileSize, tileSize - 2, tileSize - 2);

      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);

      if (!gameState.gameOver) {
        setTimeout(gameLoop, 100);
      } else {
        setGameOver(true);
        onGameEnd?.({ score: gameState.score, duration: 0 });
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (gameState.direction.y === 0) gameState.nextDirection = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (gameState.direction.y === 0) gameState.nextDirection = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (gameState.direction.x === 0) gameState.nextDirection = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (gameState.direction.x === 0) gameState.nextDirection = { x: 1, y: 0 };
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onGameEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-primary rounded-lg bg-gray-900"
      />
      <p className="text-gray-400">Use arrow keys or WASD to move</p>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="card text-center">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-4xl font-bold text-secondary mb-4">{score}</p>
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
