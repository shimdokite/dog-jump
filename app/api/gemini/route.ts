import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json(); 
    if (!body && body.content) return;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: body.content,
          config: {
            thinkingConfig: {
              thinkingBudget: 0,
              includeThoughts: true,
            },
          },
        });



        if (response?.candidates?.length) {
          for (const part of response.candidates[0].content?.parts ?? []) {
            if (!part.text) {
              continue;
            } else if (part.thought) {
              console.log("Thoughts summary:");
              console.log(part.text);
            } else {
              console.log("Answer:");
              console.log(part.text);
            }
          }
        }

        // TODO: 하루 할당량 다 쓸 때까지 테스트 > 얼마나 빨리 혹은 늦게 소진되는지 파악
        // TODO: 원하는 답변으로 오는지 체크 + 같은 질문으로 했을 때도 똑같은 답변으로 오는지 파악

        if (response) {
            return NextResponse.json({ text: response.text }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "검색 결과가 없습니다." }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "서버 에러가 발생했습니다.", error}, { status: 500 });
    }
}