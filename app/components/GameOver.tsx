import { useEffect, useState } from "react";
import {
  getAutoCoachingEnabled,
  setAutoCoachingEnabled,
} from "../lib/gameAnalytics";

interface GameOver {
  time: string;
  score: number;
  gameOver: boolean;
  start: () => void;
}

export default function GameOver({ time, score, gameOver, start }: GameOver) {
  const [showStart, setShowStart] = useState(false);
  const [autoCoaching, setAutoCoaching] = useState(getAutoCoachingEnabled);

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

  const handleAutoCoachingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const enabled = event.target.checked;
    setAutoCoaching(enabled);
    setAutoCoachingEnabled(enabled);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 px-4 text-white bg-[#42464830]">
      <h1 className="text-center text-3xl">Game Over!</h1>

      <div className="flex flex-col justify-center items-center text-xl">
        <div>Time: {time}</div>
        <div className="w-full mr-4">Score: {score}</div>
      </div>

      <label className="flex items-center gap-2 rounded bg-[#2B2A2A] px-3 py-2 text-sm text-white">
        <input
          type="checkbox"
          checked={autoCoaching}
          onChange={handleAutoCoachingChange}
          className="h-4 w-4 accent-[#75AB71]"
        />
        <span>Get AI Coaching</span>
      </label>

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
