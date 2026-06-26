export type JumpTiming = "early" | "good" | "late" | "unknown";

export interface JumpEvent {
  t: number;
  obstacleDistance: number | null;
  timing: JumpTiming;
  dogX: number;
  dogY: number;
}

export interface FailureEvent {
  t: number;
  dogX: number;
  dogY: number;
  obstacleDistance: number | null;
  reason: "hit_obstacle";
}

export interface RunSummary {
  id: string;
  createdAt: string;
  score: number;
  survivalTimeSeconds: number;
  jumps: number;
  successfulObstacles: number;
  successRate: number;
  bestStreak: number;
  avgJumpObstacleDistance: number | null;
  jumpTimingRates: {
    early: number;
    good: number;
    late: number;
    unknown: number;
  };
  failure: FailureEvent | null;
  jumpEvents: JumpEvent[];
}

export interface CoachingSummary {
  runsAnalyzed: number;
  avgScore: number;
  bestScore: number;
  avgSurvivalTimeSeconds: number;
  avgJumpObstacleDistance: number | null;
  earlyJumpRate: number;
  goodJumpRate: number;
  lateJumpRate: number;
  successRate: number;
  bestStreak: number;
  commonFailureZone: string;
  recentRuns: Array<{
    score: number;
    survivalTimeSeconds: number;
    jumps: number;
    successRate: number;
    avgJumpObstacleDistance: number | null;
    failureObstacleDistance: number | null;
  }>;
}

const STORAGE_KEY = "dog-jump-runs";
const COACHING_ENABLED_KEY = "dog-jump-auto-coaching";
const SESSION_RUN_COUNT_KEY = "dog-jump-session-run-count";
const MAX_RUNS = 20;

export function classifyJumpTiming(distance: number | null): JumpTiming {
  if (distance === null) return "unknown";
  if (distance > 120) return "early";
  if (distance < 45) return "late";
  return "good";
}

export function buildRunSummary({
  score,
  survivalTimeSeconds,
  jumpEvents,
  failure,
}: {
  score: number;
  survivalTimeSeconds: number;
  jumpEvents: JumpEvent[];
  failure: FailureEvent | null;
}): RunSummary {
  const timingCounts = jumpEvents.reduce(
    (counts, event) => {
      counts[event.timing] += 1;
      return counts;
    },
    { early: 0, good: 0, late: 0, unknown: 0 },
  );
  const jumpCount = jumpEvents.length;
  const knownDistances = jumpEvents
    .map((event) => event.obstacleDistance)
    .filter((distance): distance is number => distance !== null);
  const avgJumpObstacleDistance =
    knownDistances.length > 0
      ? Math.round(
          knownDistances.reduce((sum, distance) => sum + distance, 0) /
            knownDistances.length,
        )
      : null;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    score,
    survivalTimeSeconds,
    jumps: jumpCount,
    successfulObstacles: score,
    successRate: jumpCount > 0 ? round(score / jumpCount) : 0,
    bestStreak: score,
    avgJumpObstacleDistance,
    jumpTimingRates: {
      early: rate(timingCounts.early, jumpCount),
      good: rate(timingCounts.good, jumpCount),
      late: rate(timingCounts.late, jumpCount),
      unknown: rate(timingCounts.unknown, jumpCount),
    },
    failure,
    jumpEvents,
  };
}

export function saveRunSummary(run: RunSummary) {
  if (typeof window === "undefined") return;

  const runs = getRunSummaries();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([run, ...runs].slice(0, MAX_RUNS)),
  );
  incrementSessionRunCount();
}

export function getRunSummaries(): RunSummary[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildCoachingSummary(runs = getRunSummaries()): CoachingSummary {
  const targetRuns = runs.slice(0, 10);
  const runCount = targetRuns.length;

  if (runCount === 0) {
    return {
      runsAnalyzed: 0,
      avgScore: 0,
      bestScore: 0,
      avgSurvivalTimeSeconds: 0,
      avgJumpObstacleDistance: null,
      earlyJumpRate: 0,
      goodJumpRate: 0,
      lateJumpRate: 0,
      successRate: 0,
      bestStreak: 0,
      commonFailureZone: "unknown",
      recentRuns: [],
    };
  }

  const avgDistance = averageNullable(
    targetRuns.map((run) => run.avgJumpObstacleDistance),
  );
  const failureDistances = targetRuns
    .map((run) => run.failure?.obstacleDistance)
    .filter((distance): distance is number => typeof distance === "number");

  return {
    runsAnalyzed: runCount,
    avgScore: round(average(targetRuns.map((run) => run.score))),
    bestScore: Math.max(...targetRuns.map((run) => run.score)),
    avgSurvivalTimeSeconds: round(
      average(targetRuns.map((run) => run.survivalTimeSeconds)),
    ),
    avgJumpObstacleDistance: avgDistance,
    earlyJumpRate: round(average(targetRuns.map((run) => run.jumpTimingRates.early))),
    goodJumpRate: round(average(targetRuns.map((run) => run.jumpTimingRates.good))),
    lateJumpRate: round(average(targetRuns.map((run) => run.jumpTimingRates.late))),
    successRate: round(average(targetRuns.map((run) => run.successRate))),
    bestStreak: Math.max(...targetRuns.map((run) => run.bestStreak)),
    commonFailureZone: describeFailureZone(failureDistances),
    recentRuns: targetRuns.map((run) => ({
      score: run.score,
      survivalTimeSeconds: run.survivalTimeSeconds,
      jumps: run.jumps,
      successRate: run.successRate,
      avgJumpObstacleDistance: run.avgJumpObstacleDistance,
      failureObstacleDistance: run.failure?.obstacleDistance ?? null,
    })),
  };
}

export function getAutoCoachingEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(COACHING_ENABLED_KEY) !== "false";
}

export function setAutoCoachingEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COACHING_ENABLED_KEY, String(enabled));
}

export function getSessionRunCount() {
  if (typeof window === "undefined") return 0;
  return Number(window.sessionStorage.getItem(SESSION_RUN_COUNT_KEY) ?? "0");
}

function incrementSessionRunCount() {
  window.sessionStorage.setItem(
    SESSION_RUN_COUNT_KEY,
    String(getSessionRunCount() + 1),
  );
}

function describeFailureZone(distances: number[]) {
  if (distances.length === 0) return "unknown";

  const avgFailureDistance = average(distances);
  if (avgFailureDistance > 100) return "early approach";
  if (avgFailureDistance < 35) return "late jump or close collision";
  return "mid-range timing";
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function averageNullable(values: Array<number | null>) {
  const numbers = values.filter((value): value is number => value !== null);
  if (numbers.length === 0) return null;
  return Math.round(average(numbers));
}

function rate(count: number, total: number) {
  if (total === 0) return 0;
  return round(count / total);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
