type Range = { lower: number; upper: number };
type Log = { userId: string; speed: number; delta: number };
type LogWithReason = Log & { deathReason: string | null };

export function calculateDeathReasons(logs: Log[]): LogWithReason[] {
  const groups: Record<string, number[]> = {};

  // 그룹별 delta 수집
  for (const log of logs) {
    const key = `${log.speed}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(log.delta);
  }

  // 그룹별 직관적 범위 계산
  const ranges: Record<string, Range> = {};
  for (const key in groups) {
    const arr = groups[key].sort((a, b) => a - b);
    const lower = arr[0] + (arr[arr.length - 1] - arr[0]) * 0.1;
    const upper = arr[arr.length - 1] - (arr[arr.length - 1] - arr[0]) * 0.1;
    ranges[key] = { lower, upper };
  }

  // 각 로그별 deathReason 계산
  const logsWithReason: LogWithReason[] = logs.map((log) => {
    const range = ranges[`${log.speed}`];
    let deathReason: string | null = null;

    if (log.delta < range.lower) deathReason = "early";
    else if (log.delta > range.upper) deathReason = "late";

    return { ...log, deathReason };
  });

  return logsWithReason;
}
