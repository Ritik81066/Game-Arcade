import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const FlappyBirdGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gameState = {
      bird: { x: 50, y: 100, radius: 10, velocityY: 0 },
      pipes: [],
      score: 0,
      gameOver: false,
      frameCount: 0,
    };

    const gravity = 0.6;
    const pipeSpacing = 140;
    const pipeWidth = 60;

    const drawBird = () => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(gameState.bird.x, gameState.bird.y, gameState.bird.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = () => {
      ctx.fillStyle = '#2d8a2d';
      gameState.pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipeSpacing, pipeWidth, canvas.height);
      });
    };

    const updateBird = () => {
      gameState.bird.velocityY += gravity;
      gameState.bird.y += gameState.bird.velocityY;

      if (gameState.bird.y + gameState.bird.radius > canvas.height) {
        gameState.gameOver = true;
      }
      if (gameState.bird.y - gameState.bird.radius < 0) {
        gameState.gameOver = true;
      }
    };

    const updatePipes = () => {
      gameState.frameCount++;

      if (gameState.frameCount % 90 === 0) {
        const topHeight = Math.random() * (canvas.height - pipeSpacing - 100) + 50;
        gameState.pipes.push({ x: canvas.width, topHeight });
      }

      gameState.pipes.forEach((pipe, index) => {
        pipe.x -= 5;

        if (pipe.x + pipeWidth < gameState.bird.x && !pipe.scored) {
          pipe.scored = true;
          gameState.score++;
          setScore(gameState.score);
        }

        if (pipe.x < -pipeWidth) {
          gameState.pipes.splice(index, 1);
        }
      });
    };

    const checkCollision = () => {
      gameState.pipes.forEach((pipe) => {
        if (
          gameState.bird.x + gameState.bird.radius > pipe.x &&
          gameState.bird.x - gameState.bird.radius < pipe.x + pipeWidth
        ) {
          if (
            gameState.bird.y - gameState.bird.radius < pipe.topHeight ||
            gameState.bird.y + gameState.bird.radius > pipe.topHeight + pipeSpacing
          ) {
            gameState.gameOver = true;
          }
        }
      });
    };

    const gameLoop = () => {
      if (gameState.gameOver) {
        setGameOver(true);
        onGameEnd?.({ score: gameState.score, duration: gameState.frameCount / 60 });
        return;
      }

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateBird();
      updatePipes();
      checkCollision();
      drawPipes();
      drawBird();

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 20, 40);

      requestAnimationFrame(gameLoop);
    };

    const handleKeyPress = () => {
      gameState.bird.velocityY = -12;
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('click', handleKeyPress);
    canvas.addEventListener('touchstart', handleKeyPress);

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', handleKeyPress);
      canvas.removeEventListener('touchstart', handleKeyPress);
    };
  }, [onGameEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="border-4 border-primary rounded-lg bg-sky-400"
      />
      <p className="text-gray-400">Click or tap to flap!</p>

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
