import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import GameStart from "./GameStart";
import GameOver from "./GameOver";
import useIsMobile from "../hooks/useIsMobile";
import useGemini from "../hooks/mutations/useGemini";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

interface GameWindow {
  activeKey: {
    left: boolean;
    right: boolean;
    jump: boolean;
  };
}

export default function GameWindow({ activeKey }: GameWindow) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secondsRef = useRef(0);
  const keyRef = useRef(activeKey);
  const isMobile = useIsMobile();
  const { generateAdvice, advice } = useGemini();
  // TODO: advice를 게임을 restart 할 때 스르륵 3초 정도 보여줬다가 사라지게 하기
  const [displayTime, setDisplayTime] = useState("00:00");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [count, setCount] = useState(1);
  const [isAdvice, setIsAdvice] = useState(false);
  const [playLog, setPlayLog] = useState({
    collisionTime: 0,
    lastJumpTime: 0,
  });

  dayjs.extend(duration);

  useEffect(() => {
    keyRef.current = activeKey;
  }, [activeKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dog = {
      x: 100,
      y: 300,
      width: isMobile ? 55 : 50,
      height: isMobile ? 55 : 50,
      velocityY: 0,
      velocityX: 0,
      isJumping: false,
      direction: 1,
      frame: 0,
      frameCounter: 1,
    };

    const gravity = 0.5;
    const jumpStrength = -12;
    const moveSpeed = 5;
    const groundY = 220;

    let obstacles: Obstacle[] = [];
    let obstacleSpeed = 3;
    let frameCount = 0;
    let localScore = 0;
    let animationId = 0;

    // 강아지
    const frames: HTMLImageElement[] = [];

    for (let i = 0; i < 4; i++) {
      const img = new Image();
      img.src = `/images/run_${i + 1}.webp`;
      frames.push(img);
    }

    const drawDog = () => {
      const frameImg = frames[dog.frame % frames.length];

      ctx.save();
      ctx.translate(dog.x + dog.width / 2, dog.y + dog.height / 2);

      if (dog.direction === -1) ctx.scale(-1, 1);

      ctx.drawImage(
        frameImg,
        -dog.width / 2,
        -dog.height / 2,
        dog.width,
        dog.height
      );

      ctx.restore();

      dog.frameCounter++;
      if (dog.frameCounter % 4 === 0) dog.frame++;
    };

    // 시간 표시
    let timer = null;

    const drawTime = () => {
      const time = dayjs
        .duration(secondsRef.current, "seconds")
        .format("mm:ss");

      ctx.fillStyle = "#000";
      ctx.font = `18px 'Bitcount'`;
      ctx.fillText(time, 20, 30);
    };

    if (gameStarted && !gameOver) {
      secondsRef.current = 0;
      setDisplayTime("00:00");

      timer = window.setInterval(() => {
        secondsRef.current++;

        const time = dayjs
          .duration(secondsRef.current, "seconds")
          .format("mm:ss");
        setDisplayTime(time);
      }, 1000);
    }

    // 방해물 생성
    const createObstacle = () => {
      const width = 30 + Math.random() * (isMobile ? 50 : 30);
      const height = 30 + Math.random() * (isMobile ? 35 : 40);

      obstacles.push({
        x: canvas.width,
        y: groundY - height,
        width: width,
        height: height,
        passed: false,
      });
    };

    // 초기 장애물 생성
    createObstacle();

    const drawObstacles = () => {
      ctx.fillStyle = "#8B4513";
      obstacles.forEach((obstacle) => {
        // 상자 그리기
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // 상자 테두리
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // 상자 디테일
        ctx.strokeStyle = "#A0826D";
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
        ctx.lineTo(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2);
        ctx.lineTo(
          obstacle.x + obstacle.width,
          obstacle.y + obstacle.height / 2
        );
        ctx.stroke();
      });
    };

    // 난이도 증가
    if (frameCount % 500 === 0) {
      obstacleSpeed += 0.5;
    }

    // 충돌 감지
    const checkCollision = () => {
      for (const obstacle of obstacles) {
        if (
          dog.x < obstacle.x + obstacle.width &&
          dog.x + dog.width > obstacle.x &&
          dog.y < obstacle.y + obstacle.height &&
          dog.y + dog.height > obstacle.y
        ) {
          setPlayLog((prev) => ({
            ...prev,
            collisionTime: Date.now(),
            speed: obstacleSpeed,
          }));

          return true;
        }
      }

      return false;
    };

    // 게임 루프
    const gameLoop = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경
      ctx.fillStyle = "#7CAABB";
      ctx.fillRect(0, 0, canvas.width, groundY);

      // 바닥
      ctx.fillStyle = "#75AB71";
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      // 바닥 디테일
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, groundY, 10, 3);
      }

      const keys = keyRef.current;

      // 좌우 이동
      if (keys.left) {
        dog.velocityX = -moveSpeed;
        dog.direction = -1;
      } else if (keys.right) {
        dog.velocityX = moveSpeed;
        dog.direction = 1;
      } else {
        dog.velocityX = 0;
      }

      // 점프
      if (keys.jump && !dog.isJumping) {
        dog.velocityY = jumpStrength;
        dog.isJumping = true;

        setPlayLog((prev) => ({
          ...prev,
          lastJumpTime: Date.now(),
        }));
      }

      // 중력 적용
      dog.velocityY += gravity;
      dog.y += dog.velocityY;
      dog.x += dog.velocityX;

      // 땅에 닿으면
      if (dog.y >= groundY - dog.height) {
        dog.y = groundY - dog.height;
        dog.velocityY = 0;
        dog.isJumping = false;
      }

      // 화면 밖으로 나가지 않게
      if (dog.x < 0) dog.x = 0;
      if (dog.x > canvas.width - dog.width) dog.x = canvas.width - dog.width;

      // 장애물 이동
      obstacles.forEach((obstacle) => {
        obstacle.x -= obstacleSpeed;
      });

      // 점수 계산
      obstacles.forEach((obstacle) => {
        obstacle.x -= obstacleSpeed;

        // 강아지가 장애물을 완전히 지난 경우
        if (!obstacle.passed && dog.x > obstacle.x + obstacle.width) {
          obstacle.passed = true;
          localScore++;
          setScore(localScore);
        }
      });

      // 화면 밖 장애물 제거
      obstacles = obstacles.filter(
        (obstacle) => obstacle.x + obstacle.width > 0
      );

      // 새 장애물 생성
      frameCount++;
      if (frameCount % 100 === 0) {
        createObstacle();
      }

      // 충돌 체크
      if (checkCollision()) {
        setGameOver(true);
        setGameStarted(false);
        setCount(count + 1);

        // TODO: 추후 서버로 로그 보내기
        console.log("playLog\n", playLog);
        return;
      }

      // 그리기
      drawObstacles();
      drawDog();
      drawTime();

      // 점수 표시
      ctx.fillStyle = "#000";
      ctx.font = `18px 'Bitcount'`;

      const scoreLength = `${localScore}`.length;
      let area = 375;

      if (scoreLength > 3) area -= (scoreLength - 3) * 10;

      ctx.fillText(`${localScore}`, area, 30);

      animationId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) gameLoop();

    return () => {
      if (timer) clearInterval(timer);
      if (animationId) cancelAnimationFrame(animationId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, gameStarted, isMobile, count]);

  const startGame = async () => {
    // TODO: 서버 로그가 5개인지도 확인 필요
    console.log("isAdvice", isAdvice);
    console.log("count", count);

    // if (count >= 5 && isAdvice) {
    //   // TODO: 테스트 데이터
    //   const content = `
    //   아래는 최근 5게임 플레이의 요약 데이터야

    //   - 평균 점프 타이밍 오차: +94ms
    //   - 게임 오버 이유:
    //       늦은 점프: 3회
    //       빠른 점프: 1회
    //       점프 안함: 1회

    //   이 데이터를 바탕으로 유저에게 전달할 코칭을 35자 미만으로 간단하게 부탁해.
    //   `;

    //   await generateAdvice(content);
    // }

    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  // 로그 확인용
  useEffect(() => {
    console.log("playLog updated:", playLog);
  }, [playLog]);

  return (
    <div className={`flex justify-center items-center h-full font-bitcount`}>
      <div className="max-sm:w-[257px] w-[410px] h-full absolute top-[0.2px] mx-3">
        {!gameStarted && !gameOver && <GameStart start={startGame} />}
        {gameOver && (
          <GameOver
            time={displayTime}
            score={score}
            count={count}
            gameOver={gameOver}
            isAdvice={isAdvice}
            start={startGame}
            setIsAdvice={setIsAdvice}
          />
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={408}
        height={284}
        className="rounded-sm my-1 w-full max-w-[408px] max-sm:h-[292px]"
      />
    </div>
  );
}
