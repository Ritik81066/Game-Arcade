import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const BrickBreakerGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const gameState = {
      paddle: { x: canvas.width / 2 - 40, y: canvas.height - 20, width: 80, height: 10 },
      ball: { x: canvas.width / 2, y: canvas.height - 40, radius: 5, dx: 5, dy: -5 },
      bricks: [],
      score: 0,
      gameOver: false,
      mouseX: canvas.width / 2,
    };

    const brickRows = 4;
    const brickCols = 5;
    const brickWidth = (canvas.width - 20) / brickCols;
    const brickHeight = 15;

    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        gameState.bricks.push({
          x: col * brickWidth + 10,
          y: row * brickHeight + 30,
          width: brickWidth - 2,
          height: brickHeight - 2,
          hit: false,
        });
      }
    }

    const drawPaddle = () => {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height);
    };

    const drawBall = () => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBricks = () => {
      gameState.bricks.forEach((brick) => {
        if (!brick.hit) {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
      });
    };

    const gameLoop = () => {
      if (gameState.gameOver) {
        setGameOver(true);
        onGameEnd?.({ score: gameState.score, duration: 0 });
        return;
      }

      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;

      if (gameState.ball.x - gameState.ball.radius < 0 || gameState.ball.x + gameState.ball.radius > canvas.width) {
        gameState.ball.dx *= -1;
      }

      if (gameState.ball.y - gameState.ball.radius < 0) {
        gameState.ball.dy *= -1;
      }

      if (gameState.ball.y + gameState.ball.radius > canvas.height) {
        gameState.gameOver = true;
      }

      if (
        gameState.ball.x > gameState.paddle.x &&
        gameState.ball.x < gameState.paddle.x + gameState.paddle.width &&
        gameState.ball.y + gameState.ball.radius > gameState.paddle.y
      ) {
        gameState.ball.dy *= -1;
        gameState.ball.y = gameState.paddle.y - gameState.ball.radius;
      }

      gameState.bricks.forEach((brick) => {
        if (!brick.hit) {
          if (
            gameState.ball.x > brick.x &&
            gameState.ball.x < brick.x + brick.width &&
            gameState.ball.y > brick.y &&
            gameState.ball.y < brick.y + brick.height
          ) {
            brick.hit = true;
            gameState.ball.dy *= -1;
            gameState.score += 10;
            setScore(gameState.score);
          }
        }
      });

      gameState.paddle.x = gameState.mouseX - gameState.paddle.width / 2;
      if (gameState.paddle.x < 0) gameState.paddle.x = 0;
      if (gameState.paddle.x + gameState.paddle.width > canvas.width) {
        gameState.paddle.x = canvas.width - gameState.paddle.width;
      }

      drawBricks();
      drawPaddle();
      drawBall();

      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 20, 30);

      requestAnimationFrame(gameLoop);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      gameState.mouseX = e.clientX - rect.left;
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      gameState.mouseX = e.touches[0].clientX - rect.left;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    gameLoop();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onGameEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="border-4 border-primary rounded-lg bg-gray-900"
      />
      <p className="text-gray-400">Move your paddle to break the bricks!</p>

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
