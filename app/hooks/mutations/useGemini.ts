import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gemini } from "@/app/apis/gemini";

export default function useGemini() {
    const [speed, setSpeed] = useState('');

    const { mutateAsync: runGemini } = useMutation({
      mutationFn: gemini,
      onSuccess: (data: { text: string }) => {
        console.log('query success data > ', data.text);
        setSpeed(data.text);
      },
      onError: () => {
        setSpeed('');
      }
    });

    const generateObstacles = (content:string) => {
        return runGemini(content);
    };

    return { generateObstacles, speed };
}