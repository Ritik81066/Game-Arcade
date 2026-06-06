import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const TetrisGame = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rows = 20;
    const cols = 10;
    const tileSize = canvas.width / cols;

    const tetrominoes = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 1, 0], [0, 1, 1]],
      [[1, 0], [1, 0], [1, 1]],
      [[0, 1], [0, 1], [1, 1]],
      [[0, 1, 0], [1, 1, 1]],
    ];

    const gameState = {
      board: Array(rows).fill(null).map(() => Array(cols).fill(0)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      gameOver: false,
      dropCounter: 0,
      dropInterval: 1000,
    };

    const createPiece = () => {
      const tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
      return {
        shape: tetromino,
        x: Math.floor(cols / 2) - 1,
        y: 0,
      };
    };

    const spawnPiece = () => {
      gameState.currentPiece = gameState.nextPiece || createPiece();
      gameState.nextPiece = createPiece();

      if (collides(gameState.currentPiece)) {
        gameState.gameOver = true;
      }
    };

    const collides = (piece) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardX = piece.x + x;
            const boardY = piece.y + y;

            if (boardX < 0 || boardX >= cols || boardY >= rows) return true;
            if (boardY >= 0 && gameState.board[boardY][boardX]) return true;
          }
        }
      }
      return false;
    };

    const merge = () => {
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardY = gameState.currentPiece.y + y;
            const boardX = gameState.currentPiece.x + x;

            if (boardY >= 0) {
              gameState.board[boardY][boardX] = 1;
            }
          }
        }
      }
    };

    const clearLines = () => {
      let linesCleared = 0;

      for (let y = rows - 1; y >= 0; y--) {
        if (gameState.board[y].every(cell => cell)) {
          gameState.board.splice(y, 1);
          gameState.board.unshift(Array(cols).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        gameState.score += linesCleared * 100;
        setScore(gameState.score);
      }
    };

    const update = () => {
      gameState.currentPiece.y++;

      if (collides(gameState.currentPiece)) {
        gameState.currentPiece.y--;
        merge();
        clearLines();
        spawnPiece();
      }
    };

    const draw = () => {
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#374151';
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
        ctx.stroke();
      }

      ctx.fillStyle = '#6366f1';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (gameState.board[y][x]) {
            ctx.fillRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2);
          }
        }
      }

      if (gameState.currentPiece) {
        ctx.fillStyle = '#ec4899';
        for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
          for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
            if (gameState.currentPiece.shape[y][x]) {
              const drawX = (gameState.currentPiece.x + x) * tileSize;
              const drawY = (gameState.currentPiece.y + y) * tileSize;
              ctx.fillRect(drawX + 1, drawY + 1, tileSize - 2, tileSize - 2);
            }
          }
        }
      }

      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    };

    const gameLoop = (time) => {
      if (!gameState.currentPiece) {
        spawnPiece();
      }

      gameState.dropCounter += 16;

      if (gameState.dropCounter > gameState.dropInterval) {
        update();
        gameState.dropCounter = 0;
      }

      draw();

      if (!gameState.gameOver) {
        requestAnimationFrame(gameLoop);
      } else {
        setGameOver(true);
        onGameEnd?.({ score: gameState.score, duration: 0 });
      }
    };

    const movePiece = (dx) => {
      gameState.currentPiece.x += dx;
      if (collides(gameState.currentPiece)) {
        gameState.currentPiece.x -= dx;
      }
    };

    const rotatePiece = () => {
      const original = gameState.currentPiece.shape;
      gameState.currentPiece.shape = gameState.currentPiece.shape[0].map((_, i) =>
        gameState.currentPiece.shape.map(row => row[i]).reverse()
      );

      if (collides(gameState.currentPiece)) {
        gameState.currentPiece.shape = original;
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePiece(-1);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePiece(1);
          e.preventDefault();
          break;
        case ' ':
          rotatePiece();
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          gameState.dropInterval = 100;
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        gameState.dropInterval = 1000;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);

    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onGameEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        className="border-4 border-primary rounded-lg bg-gray-900"
      />
      <p className="text-gray-400 text-center">
        Arrow Left/Right to move • Space to rotate • Arrow Down to drop
      </p>

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
