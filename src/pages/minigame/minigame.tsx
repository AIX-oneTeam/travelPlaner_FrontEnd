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
  playerX: number;   // 플레이어의 월드 X 좌표 (게임 내에서 계속 증가)
  playerY: number;   // 플레이어의 Y 좌표 (점프 시 변동)
  velocity: number;  // 점프 시 속도(중력 및 초기 점프 가속도)
  isJumping: boolean;// 점프 중 여부
  obstacles: Obstacle[]; // 생성된 장애물 배열
  speed: number;     // 플레이어가 앞으로 이동하는 속도(월드 좌표 증가)
  floorHeight: number; // 바닥 높이 (캔버스 높이 - 50)
  score: number;     // 현재 점수
}

const MiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // 초기 상태: 플레이어는 월드 좌표 100에서 시작 (화면상 고정 위치는 100)
  const gameState = useRef<GameState>({
    playerX: 100,
    playerY: 0,
    velocity: 0,
    isJumping: false,
    obstacles: [],
    speed: 4, // 초기 속도
    floorHeight: 300,
    score: 0,
  });

  // resetGameState: 캔버스 높이에 따라 게임 상태를 초기화 (재시작 시 호출)
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
    };
    setScore(0);
  };

  // handleRestart: "다시 시작" 버튼 클릭 시 게임 상태를 초기화하여 게임을 다시 시작
  const handleRestart = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      resetGameState(canvas.height);
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
    resetGameState(canvas.height);
    const FLOOR_HEIGHT = gameState.current.floorHeight;

    // 이미지 로드: 배경, 플레이어, 장애물 이미지
    const backgroundImg = new Image();
    const playerImg = new Image();
    const enemyImg = new Image();

    backgroundImg.src = "/images/background.png";
    playerImg.src = "/images/character.png";
    enemyImg.src = "/images/enemy.png";

    // 플레이어 스프라이트 사이즈 (단순 50x50 사용)
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 50;
    // 화면상 플레이어 고정 위치 (카메라 기준)
    const FIXED_PLAYER_X = 100;

    let animationFrameId: number;
    let obstacleInterval: NodeJS.Timeout;

    // handleJump: 클릭 또는 키 입력 시 플레이어 점프 처리
    const handleJump = () => {
      if (!gameOver && !gameState.current.isJumping) {
        gameState.current.isJumping = true;
        gameState.current.velocity = -17;
      }
    };

    // createObstacle: 플레이어 월드 좌표 기준으로 장애물을 생성 (화면 앞으로 일정 거리)
    const createObstacle = () => {
      gameState.current.obstacles.push({
        x: gameState.current.playerX + canvas.width - FIXED_PLAYER_X,
        width: 40,
        height: 50,
      });
    };

    // checkCollision: 플레이어와 장애물 간 충돌 판정 (월드 좌표 기준)
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
          playerBox.x + playerBox.width > obstacleBox.x &&
          playerBox.y < obstacleBox.y + obstacleBox.height &&
          playerBox.y + playerBox.height > obstacleBox.y
        );
      });
    };

    // updateGame: 매 프레임마다 게임 상태 업데이트 (점프, 이동, 충돌 등 처리)
    const updateGame = () => {
      if (gameOver) return;

      // 점프 및 중력 처리
      if (gameState.current.isJumping) {
        gameState.current.velocity += 1; // 중력 가속도
        gameState.current.playerY += gameState.current.velocity;
        if (gameState.current.playerY >= FLOOR_HEIGHT - PLAYER_HEIGHT) {
          gameState.current.playerY = FLOOR_HEIGHT - PLAYER_HEIGHT;
          gameState.current.isJumping = false;
          gameState.current.velocity = 0;
        }
      }

      // 플레이어가 앞으로 달려 월드 좌표 갱신
      gameState.current.playerX += gameState.current.speed;

      // 플레이어보다 뒤에 있는 장애물 제거
      gameState.current.obstacles = gameState.current.obstacles.filter(
        (obstacle) => obstacle.x > gameState.current.playerX - 100
      );

      // 충돌 판정: 충돌 시 게임 오버 처리
      if (checkCollision()) {
        setGameOver(true);
        return;
      }

      // 속도와 점수 증가
      gameState.current.speed += 0.00001;
      gameState.current.score += 1;
      setScore(gameState.current.score);

      renderGame(ctx);
      animationFrameId = requestAnimationFrame(updateGame);
    };

    // renderGame: 캔버스에 배경, 플레이어, 장애물, 점수 표시
    const renderGame = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 카메라 오프셋: 플레이어의 월드 좌표와 화면상의 고정 플레이어 좌표 차이
      const cameraOffset = gameState.current.playerX - FIXED_PLAYER_X;
      // 배경 스크롤: 카메라 오프셋의 나머지를 이용해 배경 이미지를 반복해서 그림
      const bgOffset = -(cameraOffset % canvas.width);
      ctx.drawImage(backgroundImg, bgOffset, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImg, bgOffset + canvas.width, 0, canvas.width, canvas.height);

      // 플레이어: 화면상 고정된 위치에서, Y 좌표는 게임 상태에서 관리
      ctx.drawImage(playerImg, FIXED_PLAYER_X, gameState.current.playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

      // 장애물: 월드 좌표에서 카메라 오프셋을 빼서 화면상의 위치 계산
      gameState.current.obstacles.forEach((obstacle) => {
        const screenX = obstacle.x - cameraOffset;
        ctx.drawImage(enemyImg, screenX, FLOOR_HEIGHT - obstacle.height, obstacle.width, obstacle.height);
      });

      // 점수 표시
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${gameState.current.score}`, 20, 40);
    };

    backgroundImg.onload = () => {
      renderGame(ctx);
      animationFrameId = requestAnimationFrame(updateGame);
      obstacleInterval = setInterval(createObstacle, 2000);
    };

    // 클릭 및 키보드 이벤트로 handleJump 호출하여 점프 실행
    canvas.addEventListener("click", handleJump);
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        handleJump();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    // 컴포넌트 언마운트 시 이벤트와 타이머 정리
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(obstacleInterval);
      canvas.removeEventListener("click", handleJump);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [gameOver]);

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>
        클릭/터치 또는 스페이스/위 화살표로 점프하세요!
      </p>
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          {/* 다시 시작 버튼 클릭 시 handleRestart 함수 호출 */}
          <button onClick={handleRestart}>다시 시작</button>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.gameCanvas}></canvas>
    </div>
  );
};

export default MiniGame;
