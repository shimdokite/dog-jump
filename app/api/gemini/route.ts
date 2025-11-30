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

        let result = '';

         if (response?.candidates?.length) {
           for (const part of response.candidates[0].content?.parts ?? []) {
             if (!part.text) {
               continue;
             } else if (part.thought) {
               result = part.text;
             } else {
                console.log("Answer:");
                console.log(part.text);
               result = part.text;
             }
           }
         }

        if (result) {
          return NextResponse.json({ text: result }, { status: 200 });
        } else {
          return NextResponse.json(
            { success: false, message: "검색 결과가 없습니다." },
            { status: 404 }
          );
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "서버 에러가 발생했습니다.", error}, { status: 500 });
    }
}