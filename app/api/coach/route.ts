import { NextResponse } from "next/server";
import type { CoachingSummary } from "@/app/lib/gameAnalytics";

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되지 않았어요." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    summary?: CoachingSummary;
  } | null;

  if (!body?.summary || body.summary.runsAnalyzed === 0) {
    return NextResponse.json(
      { error: "코칭할 플레이 기록이 아직 없어요." },
      { status: 400 },
    );
  }

  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const prompt = [
    "너는 간단한 강아지 점프 게임의 한국어 코치야.",
    "반드시 한국어 한 문장으로만 답해.",
    "영어 단어, 로마자, 마크다운, 목록, 이모지, 인사말, 라벨은 절대 쓰지 마.",
    "문장은 구체적인 행동 조언이어야 하고 반드시 요. 로 끝나야 해.",
    "12자 이상 45자 이하로 답해.",
    "좋은 예: 장애물이 더 가까워진 뒤 점프해요. / 다음 판은 한 박자 먼저 점프해요.",
    "",
    "아래 플레이 요약을 보고 지금 바로 적용할 수 있는 코칭을 한 문장으로만 해줘.",
    JSON.stringify(body.summary),
  ].join("\n");
  let response: Response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        signal: AbortSignal.timeout(12000),
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 80,
          },
        }),
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Gemini 응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요." },
      { status: 504 },
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        error: getGeminiErrorMessage(data),
      },
      { status: response.status },
    );
  }

  const generatedCoaching =
    typeof data?.candidates?.[0]?.content?.parts?.[0]?.text === "string"
      ? data.candidates[0].content.parts[0].text
      : "코칭 응답을 읽지 못했어요.";
  const coaching = normalizeCoaching(generatedCoaching, body.summary);

  return NextResponse.json({ coaching });
}

function normalizeCoaching(coaching: string, summary: CoachingSummary) {
  const cleaned = coaching
    .replace(/[*#`>-]/g, "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  const normalized = cleaned?.endsWith("요") ? `${cleaned}.` : cleaned;

  if (
    !normalized ||
    normalized.length < 12 ||
    !normalized.endsWith("요.") ||
    !hasKorean(normalized) ||
    hasTooMuchEnglish(normalized)
  ) {
    return buildFallbackCoaching(summary);
  }

  return normalized.length > 48 ? `${normalized.slice(0, 45)}...` : normalized;
}

function buildFallbackCoaching(summary: CoachingSummary) {
  const latestRun = summary.recentRuns[0];
  const selector =
    ((latestRun?.score ?? 0) +
      (latestRun?.jumps ?? 0) +
      Math.round(summary.avgSurvivalTimeSeconds)) %
    3;

  if (summary.lateJumpRate > summary.earlyJumpRate + 0.1) {
    return pickFallback(
      [
        "장애물이 조금 더 멀 때 먼저 점프해요.",
        "상자에 붙기 전에 한 박자 먼저 뛰어요.",
        "충돌 직전보다 살짝 이르게 점프해요.",
      ],
      selector,
    );
  }

  if (summary.earlyJumpRate > summary.goodJumpRate) {
    return pickFallback(
      [
        "장애물에 조금 더 붙어서 점프해요.",
        "너무 빨리 뛰지 말고 반 박자 기다려요.",
        "상자가 가까워질 때까지 점프를 아껴요.",
      ],
      selector,
    );
  }

  if (summary.successRate < 0.5) {
    return pickFallback(
      [
        "점프 후 착지 리듬을 한 박자 늦춰요.",
        "연속 점프보다 착지 확인을 먼저 해요.",
        "다음 장애물 전에는 발을 먼저 붙여요.",
      ],
      selector,
    );
  }

  return pickFallback(
    [
      "지금 리듬을 유지하고 무리한 점프를 줄여요.",
      "좋은 타이밍이니 같은 간격으로 뛰어요.",
      "성공 리듬을 살리고 이동을 작게 가져가요.",
    ],
    selector,
  );
}

function pickFallback(messages: string[], index: number) {
  return messages[index % messages.length];
}

function getGeminiErrorMessage(data: unknown) {
  const message =
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error &&
    typeof data.error.message === "string"
      ? data.error.message
      : "";

  if (/quota|rate|limit|exceeded/i.test(message)) {
    return "잠시 후 다시 코칭을 받아보세요.";
  }

  return "코칭을 불러오지 못했어요.";
}

function hasKorean(value: string) {
  return /[가-힣]/.test(value);
}

function hasTooMuchEnglish(value: string) {
  const englishChars = value.match(/[A-Za-z]/g)?.length ?? 0;
  return englishChars > 0;
}
