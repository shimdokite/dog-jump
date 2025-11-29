import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gemini } from "@/app/apis/gemini";

export default function useGemini() {
    const [advice, setAdvice] = useState("");

    const { mutateAsync: runGemini } = useMutation({
      mutationFn: gemini,
      onSuccess: (data: { text: string }) => {
        setAdvice(data.text);
      },
      onError: () => {
        setAdvice("");
      }
    });

    const generateAdvice = (content: string) => {
      return runGemini(content);
    };

    return { generateAdvice, advice };
}