import { useEffect, useState } from "react";

interface GameOver {
  time: string;
  score: number;
  gameOver: boolean;
  start: () => void;
}

export default function GameOver({ time, score, gameOver, start }: GameOver) {
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowStart(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setShowStart(false);
      };
    }
  }, [gameOver]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 text-white bg-[#42464830] rounded-md">
      <h1 className="text-center text-3xl">Game Over!</h1>

      <div className="flex flex-col justify-center items-center text-xl">
        <div>Time: {time}</div>
        <div className="w-full mr-4">Score: {score}</div>
      </div>

      <button
        onClick={start}
        className={`text-xl text-[#F23D3D] transition-all duration-500 ${
          showStart
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        restart
      </button>
    </div>
  );
}
