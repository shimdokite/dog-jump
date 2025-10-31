import { useEffect, useRef } from "react";

interface GameStart {
  start: () => void;
}

export default function GameStart({ start }: GameStart) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 text-white bg-[#A0C39C] rounded-md">
      <button
        ref={ref}
        type="button"
        onClick={start}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            start();
          }
        }}
        className="text-3xl"
      >
        Start
      </button>
    </div>
  );
}
