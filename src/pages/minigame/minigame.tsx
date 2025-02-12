import React, { useEffect, useRef, useState } from "react";
import styles from "./minigame.module.css";

const MiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    playerY: 0,
    velocity: 0,
    isJumping: false,
    obstacles: [] as { x: number; width: number; height: number }[],
    speed: 5,
    floorHeight: 300,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const FLOOR_HEIGHT = canvas.height - 50;
    gameState.current.floorHeight = FLOOR_HEIGHT;
    gameState.current.playerY = FLOOR_HEIGHT - 50;

    const backgroundImg = new Image();
    const playerImg = new Image();
    const enemyImg = new Image();

    backgroundImg.src = "/images/background.png";
    playerImg.src = "/images/character.png";
    enemyImg.src = "/images/enemy.png";

    let animationFrameId: number;
    let obstacleInterval: NodeJS.Timeout;

    const handleJump = () => {
      if (!gameOver && !gameState.current.isJumping) {
        gameState.current.isJumping = true;
        gameState.current.velocity = -12;
      }
    };

    const createObstacle = () => {
      gameState.current.obstacles.push({
        x: canvas.width,
        width: 40,
        height: 50,
      });
    };

    const checkCollision = () => {
      return gameState.current.obstacles.some((obstacle) => {
        const playerBox = { x: 100, y: gameState.current.playerY, width: 50, height: 50 };
        const obstacleBox = { x: obstacle.x, y: FLOOR_HEIGHT - obstacle.height, width: obstacle.width, height: obstacle.height };

        return (
          playerBox.x < obstacleBox.x + obstacleBox.width &&
          playerBox.x + playerBox.width > obstacleBox.x &&
          playerBox.y < obstacleBox.y + obstacleBox.height &&
          playerBox.y + playerBox.height > obstacleBox.y
        );
      });
    };

    const updateGame = () => {
      if (gameOver) return;

      if (gameState.current.isJumping) {
        gameState.current.velocity += 0.6;
        gameState.current.playerY += gameState.current.velocity;

        if (gameState.current.playerY >= FLOOR_HEIGHT - 50) {
          gameState.current.playerY = FLOOR_HEIGHT - 50;
          gameState.current.isJumping = false;
          gameState.current.velocity = 0;
        }
      }

      gameState.current.obstacles.forEach((obstacle) => {
        obstacle.x -= gameState.current.speed;
      });

      gameState.current.obstacles = gameState.current.obstacles.filter(
        (obstacle) => obstacle.x > -obstacle.width
      );

      if (checkCollision()) {
        setGameOver(true);
        return;
      }

      gameState.current.speed += 0.001;
      setScore((prev) => prev + 1);

      renderGame(ctx);
      animationFrameId = requestAnimationFrame(updateGame);
    };

    const renderGame = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(playerImg, 100, gameState.current.playerY, 50, 50);
      gameState.current.obstacles.forEach((obstacle) => {
        ctx.drawImage(enemyImg, obstacle.x, FLOOR_HEIGHT - obstacle.height, obstacle.width, obstacle.height);
      });
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${score}`, 20, 40);
    };

    backgroundImg.onload = () => {
      renderGame(ctx);
      animationFrameId = requestAnimationFrame(updateGame);
      obstacleInterval = setInterval(createObstacle, 2000);
    };

    canvas.addEventListener("click", handleJump);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(obstacleInterval);
      canvas.removeEventListener("click", handleJump);
    };
  }, [gameOver]);

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>클릭/터치로 점프하세요!</p>
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={() => window.location.reload()}>다시 시작</button>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.gameCanvas}></canvas>
    </div>
  );
};

export default MiniGame;