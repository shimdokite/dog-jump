import { ChangeEvent, useEffect, useState } from "react";

interface GameOver {
  time: string;
  score: number;
  count: number;
  gameOver: boolean;
  isAdvice: boolean;
  start: () => void;
  setIsAdvice: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GameOver({
  time,
  score,
  count,
  gameOver,
  isAdvice,
  start,
  setIsAdvice,
}: GameOver) {
  const [showStart, setShowStart] = useState(false);

  const handleAdviceType = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsAdvice(true);
    } else {
      setIsAdvice(false);
    }
  };

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

      {count >= 5 && (
        <div className="flex flex-col justify-center items-center">
          <h2 className="">Do you want advice?</h2>

          <div className="flex justify-center items-center gap-2">
            <input
              name="is_advice"
              type="checkbox"
              onChange={handleAdviceType}
              className="mr-2 size-5 cursor-pointer appearance-none rounded-[4px] border border-[#292d32] outline-none checked:relative checked:border-[#33cccc] checked:bg-[#33cccc] checked:before:absolute checked:before:left-[3.1px] checked:before:text-sm checked:before:text-white checked:before:content-['✔'] checked:shadow-[0_0_20px_#33cccc]"
            />
            {isAdvice ? "YES" : "NO"}
          </div>
        </div>
      )}

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
