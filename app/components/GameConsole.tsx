"use client";

import { useEffect, useState } from "react";
import GameWindow from "./GameWindow";
import useIsMobile from "../hooks/useIsMobile";

export default function GameConsole() {
  const isMobile = useIsMobile();
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

  const handleDown = (e: React.TouchEvent | React.MouseEvent, key: string) => {
    e.preventDefault();
    setActiveKey((prev) => ({ ...prev, [key]: true }));
  };

  const handleUp = (e: React.TouchEvent | React.MouseEvent, key: string) => {
    e.preventDefault();
    setActiveKey((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <div className="max-sm:w-[357px] max-sm:h-[457px] w-[744px] h-[376px] bg-[#D9D9D9] flex max-sm:flex-col max-sm:justify-center justify-between items-center rounded-lg shadow-[inset_0_5px_10px_#95959555]">
      {!isMobile && (
        <div className="w-1/3 flex justify-center items-center gap-6">
          <button
            onMouseDown={(e) => handleDown(e, "left")}
            onMouseUp={(e) => handleUp(e, "left")}
            onMouseLeave={(e) => handleUp(e, "left")}
            className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
              activeKey.left
                ? "translate-y-[3px] shadow-[0_1px_0_#161616]"
                : "shadow-[0_4px_0_#1E1E1E]"
            }`}
          >
            L
          </button>

          <button
            onMouseDown={(e) => handleDown(e, "right")}
            onMouseUp={(e) => handleUp(e, "right")}
            onMouseLeave={(e) => handleUp(e, "right")}
            className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
              activeKey.right
                ? "translate-y-[3px] shadow-[0_1px_0_#161616]"
                : "shadow-[0_4px_0_#1E1E1E]"
            }`}
          >
            R
          </button>
        </div>
      )}

      <div className="flex flex-col justify-center items-center">
        <div className="absolute max-sm:top-41 top-53 text-2xl">...</div>

        <div className="max-sm:w-[257px] w-[417px] h-[292px] bg-[#6F6F6F] rounded-md relative">
          <GameWindow activeKey={activeKey} />
        </div>
      </div>

      {isMobile ? (
        <div className="w-full flex justify-between mt-5">
          <div className="w-full flex justify-center items-center gap-6 pl-5">
            <button
              onTouchStart={(e) => handleDown(e, "left")}
              onTouchEnd={(e) => handleUp(e, "left")}
              onTouchMove={(e) => handleUp(e, "left")}
              onMouseDown={(e) => handleDown(e, "left")}
              onMouseUp={(e) => handleUp(e, "left")}
              onMouseLeave={(e) => handleUp(e, "left")}
              className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
                activeKey.left
                  ? "translate-y-[3px] shadow-[0_1px_0_#161616]"
                  : "shadow-[0_4px_0_#1E1E1E]"
              }`}
            >
              L
            </button>

            <button
              onTouchStart={(e) => handleDown(e, "right")}
              onTouchEnd={(e) => handleUp(e, "right")}
              onTouchMove={(e) => handleUp(e, "right")}
              onMouseDown={(e) => handleDown(e, "right")}
              onMouseUp={(e) => handleUp(e, "right")}
              onMouseLeave={(e) => handleUp(e, "right")}
              className={`w-[45px] h-[45px] bg-[#2B2A2A] rounded-lg text-white font-semibold select-none transition-all flex items-center justify-center ${
                activeKey.right
                  ? "translate-y-[3px] shadow-[0_1px_0_#161616]"
                  : "shadow-[0_4px_0_#1E1E1E]"
              }`}
            >
              R
            </button>
          </div>

          <div className="w-full flex justify-center items-center">
            <button
              onTouchStart={(e) => handleDown(e, "jump")}
              onTouchEnd={(e) => handleUp(e, "jump")}
              onTouchMove={(e) => handleUp(e, "jump")}
              onMouseDown={(e) => handleDown(e, "jump")}
              onMouseUp={(e) => handleUp(e, "jump")}
              onMouseLeave={(e) => handleUp(e, "jump")}
              className={`w-[77px] h-[77px] rounded-full bg-[#810C46] text-white font-semibold select-none transition-all flex items-center justify-center ${
                activeKey.jump
                  ? "translate-y-[3px] shadow-[0_1px_0_#480627]"
                  : "shadow-[0_4px_0_#5F0833]"
              }`}
            >
              JUMP
            </button>
          </div>
        </div>
      ) : (
        <div className="w-1/3 flex justify-center items-center">
          <button
            onMouseDown={(e) => handleDown(e, "jump")}
            onMouseUp={(e) => handleUp(e, "jump")}
            onMouseLeave={(e) => handleUp(e, "jump")}
            className={`w-[77px] h-[77px] rounded-full bg-[#810C46] text-white font-semibold select-none transition-all flex items-center justify-center ${
              activeKey.jump
                ? "translate-y-[3px] shadow-[0_1px_0_#480627]"
                : "shadow-[0_4px_0_#5F0833]"
            }`}
          >
            JUMP
          </button>
        </div>
      )}
    </div>
  );
}
