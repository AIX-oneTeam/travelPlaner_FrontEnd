import React, { useEffect, useRef, useState } from "react";
import styles from "./MiniGame.module.css";

// 장애물(Obstacle) 인터페이스: 장애물의 월드 좌표 및 크기를 정의
interface Obstacle {
  x: number;       // 월드 좌표
  width: number;
  height: number;
}

// 게임 상태(GameState) 인터페이스: 게임 진행에 필요한 전역 상태 정보
interface GameState {
  playerX: number;    // 플레이어의 월드 X 좌표 (게임 내에서 계속 증가)
  playerY: number;    // 플레이어의 Y 좌표 (점프 시 변동)
  velocity: number;   // 점프 시 속도(중력 및 초기 점프 가속도)
  isJumping: boolean; // 점프 중 여부
  obstacles: Obstacle[];  // 생성된 장애물 배열
  speed: number;      // 플레이어가 앞으로 이동하는 속도 (월드 좌표 증가)
  floorHeight: number;// 바닥 높이 (캔버스 높이 - 50)
  score: number;      // 현재 점수
  gameOver: boolean;  // 게임 오버 여부
}

const MiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // 게임의 핵심 상태를 저장하는 ref
  const gameState = useRef<GameState>({
    playerX: 100,
    playerY: 0,
    velocity: 0,
    isJumping: false,
    obstacles: [],
    speed: 4,
    floorHeight: 300,
    score: 0,
    gameOver: false,
  });

  // 캔버스 높이에 따라 게임 상태 초기화 (재시작 시 호출)
  const resetGameState = (canvasHeight: number) => {
    const FLOOR_HEIGHT = canvasHeight - 50;
    gameState.current = {
      playerX: 100,
      playerY: FLOOR_HEIGHT - 50,
      velocity: 0,
      isJumping: false,
      obstacles: [],
      speed: 5, // 재시작 시 기본 속도
      floorHeight: FLOOR_HEIGHT,
      score: 0,
      gameOver: false,
    };
    setScore(0);
  };

  // "다시 시작" 버튼 클릭 시 호출하여 게임 상태 재설정 및 재시작 처리
  const handleRestart = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      resetGameState(canvas.height);
      // gameOver 상태를 false로 변경하면 useEffect가 재실행되어 게임 루프가 다시 시작됩니다.
      setGameOver(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = 800;
    canvas.height = 400;
    // 게임 재시작 시마다 상태를 초기화
    if (!gameOver) {
      resetGameState(canvas.height);
    }
    const FLOOR_HEIGHT = gameState.current.floorHeight;

    // 이미지 로드: 배경, 플레이어, 장애물 이미지
    const backgroundImg = new Image();
    const playerImg = new Image();
    const enemyImg = new Image();

    backgroundImg.src = "/images/background.png";
    playerImg.src = "/images/character.png";
    enemyImg.src = "/images/enemy.png";

    // 플레이어 스프라이트 크기 및 고정 위치
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 50;
    const FIXED_PLAYER_X = 100;

    let animationFrameId: number;
    let obstacleInterval: NodeJS.Timeout;

    // 클릭이나 키 입력 시 점프 처리
    const handleJump = () => {
      if (!gameState.current.gameOver && !gameState.current.isJumping) {
        gameState.current.isJumping = true;
        gameState.current.velocity = -17;
      }
    };

    // 플레이어 월드 좌표 기준 장애물 생성 (화면 앞으로 일정 거리)
    const createObstacle = () => {
      gameState.current.obstacles.push({
        x: gameState.current.playerX + canvas.width - FIXED_PLAYER_X,
        width: 40,
        height: 50,
      });
    };

    // 플레이어와 장애물 간 충돌 판정 (월드 좌표 기준)
    const checkCollision = (): boolean => {
      const playerBox = {
        x: gameState.current.playerX,
        y: gameState.current.playerY,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      };
      return gameState.current.obstacles.some((obstacle) => {
        const obstacleBox = {
          x: obstacle.x,
          y: FLOOR_HEIGHT - obstacle.height,
          width: obstacle.width,
          height: obstacle.height,
        };
        return (
          playerBox.x < obstacleBox.x + obstacleBox.width &&
          playerBox.x + PLAYER_WIDTH > obstacleBox.x &&
          playerBox.y < obstacleBox.y + obstacleBox.height &&
          playerBox.y + PLAYER_HEIGHT > obstacleBox.y
        );
      });
    };

    // 캔버스에 배경, 플레이어, 장애물, 점수를 그리는 함수
    const renderGame = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 카메라 오프셋: 플레이어의 월드 좌표와 화면상의 고정 플레이어 좌표 차이
      const cameraOffset = gameState.current.playerX - FIXED_PLAYER_X;
      // 배경 스크롤 효과 (배경 이미지 반복)
      const bgOffset = -(cameraOffset % canvas.width);
      ctx.drawImage(backgroundImg, bgOffset, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImg, bgOffset + canvas.width, 0, canvas.width, canvas.height);
      // 플레이어: 화면상의 고정 위치에서 렌더링 (Y 좌표는 게임 상태에 따라 변동)
      ctx.drawImage(playerImg, FIXED_PLAYER_X, gameState.current.playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
      // 장애물: 월드 좌표에서 화면상의 위치 계산 후 렌더링
      gameState.current.obstacles.forEach((obstacle) => {
        const screenX = obstacle.x - cameraOffset;
        ctx.drawImage(enemyImg, screenX, FLOOR_HEIGHT - obstacle.height, obstacle.width, obstacle.height);
      });
      // 점수 표시
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${gameState.current.score}`, 20, 40);
    };

    // 매 프레임마다 게임 상태 업데이트 (점프, 이동, 충돌 등 처리)
    const updateGame = () => {
      if (gameState.current.gameOver) return;

      // 점프 및 중력 처리
      if (gameState.current.isJumping) {
        gameState.current.velocity += 1.2; // 중력 가속도
        gameState.current.playerY += gameState.current.velocity;
        if (gameState.current.playerY >= FLOOR_HEIGHT - PLAYER_HEIGHT) {
          gameState.current.playerY = FLOOR_HEIGHT - PLAYER_HEIGHT;
          gameState.current.isJumping = false;
          gameState.current.velocity = 0;
        }
      }

      // 플레이어 이동: 월드 좌표 갱신
      gameState.current.playerX += gameState.current.speed;

      // 화면 밖으로 벗어난 장애물 제거
      gameState.current.obstacles = gameState.current.obstacles.filter(
        (obstacle) => obstacle.x > gameState.current.playerX - 100
      );

      // 충돌 판정: 충돌 시 게임 오버 처리
      if (checkCollision()) {
        gameState.current.gameOver = true;
        setGameOver(true);
        return;
      }

      // 점수 증가 및 속도 증가 (점수가 올라갈수록 게임 속도가 빨라짐)
      gameState.current.speed += 0.002;
      gameState.current.score += 1;
      setScore(gameState.current.score);

      renderGame(ctx);
      animationFrameId = requestAnimationFrame(updateGame);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        handleJump();
      }
    };

    canvas.addEventListener("click", handleJump);
    document.addEventListener("keydown", keyDownHandler);

    // 게임 루프 시작: 배경 이미지가 로드되었거나 이미 로드된 경우 바로 시작
    if (!gameOver) {
      if (backgroundImg.complete) {
        renderGame(ctx);
        animationFrameId = requestAnimationFrame(updateGame);
        obstacleInterval = setInterval(createObstacle, 2000);
      } else {
        backgroundImg.onload = () => {
          renderGame(ctx);
          animationFrameId = requestAnimationFrame(updateGame);
          obstacleInterval = setInterval(createObstacle, 2000);
        };
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(obstacleInterval);
      canvas.removeEventListener("click", handleJump);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [gameOver]); // gameOver가 변경될 때마다 게임 루프를 재시작

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>점프를 해서 장애물을 피하세요 !!</p>
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>점수: {score}</p>
          <button onClick={handleRestart}>다시 시작</button>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.gameCanvas}></canvas>
    </div>
  );
};

export default MiniGame;
