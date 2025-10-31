"use client";

import { useEffect, useState } from "react";

export default function GameConsole() {
  const [activeKey, setActiveKey] = useState({
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKey((prev) => {
        switch (e.key) {
          case "ArrowLeft":
            return { ...prev, left: true };
          case "ArrowRight":
            return { ...prev, right: true };
          case " ":
          case "Space":
            return { ...prev, jump: true };
          default:
            return prev;
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKey((prev) => {
        switch (e.key) {
          case "ArrowLeft":
            return { ...prev, left: false };
          case "ArrowRight":
            return { ...prev, right: false };
          case " ":
          case "Space":
            return { ...prev, jump: false };
          default:
            return prev;
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="w-[744px] h-[376px] bg-[#D9D9D9] flex justify-between items-center rounded-lg shadow-[inset_0_5px_10px_#95959555]">
      <div className="w-1/3 flex justify-center items-center gap-6">
        <button
          className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
            activeKey.left
              ? "translate-y-[3px] shadow-[0_1px_0_#1E1E1E]"
              : "shadow-[0_4px_0_#1E1E1E]"
          }`}
        >
          L
        </button>

        <button
          className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
            activeKey.right
              ? "translate-y-[3px] shadow-[0_1px_0_#1E1E1E]"
              : "shadow-[0_4px_0_#1E1E1E]"
          }`}
        >
          R
        </button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="absolute top-53 text-2xl">...</div>
        <div className="w-[417px] h-[292px] bg-[#6F6F6F] rounded-md"></div>
      </div>

      <div className="w-1/3 flex justify-center items-center">
        <button
          className={`w-[77px] h-[77px] rounded-full bg-[#810C46] text-white font-semibold select-none transition-all flex items-center justify-center ${
            activeKey.jump
              ? "translate-y-[3px] shadow-[0_1px_0_#5F0833]"
              : "shadow-[0_4px_0_#5F0833]"
          }`}
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
