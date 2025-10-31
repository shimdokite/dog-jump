interface GameOver {
  time: string;
  score: number;
  start: () => void;
}

export default function GameOver({ time, score, start }: GameOver) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 text-white bg-[#42464830] rounded-md">
      <h1 className="text-3xl">Game Over!</h1>

      <div className="flex flex-col justify-center items-center text-xl">
        <div className="">Time: {time}</div>
        <div className="w-full mr-4">Score: {score}</div>
      </div>

      <button onClick={start} className="text-lg">
        restart
      </button>
    </div>
  );
}
