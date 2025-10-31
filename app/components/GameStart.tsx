interface GameStart {
  start: () => void;
}

export default function GameStart({ start }: GameStart) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 text-white bg-[#A0C39C] rounded-md">
      <button onClick={start} className="text-3xl">
        Start
      </button>
    </div>
  );
}
