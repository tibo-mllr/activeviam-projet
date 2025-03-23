import { MIN_GREEN, MIN_RED, MAX_GREEN, MAX_RED } from "@/lib/types";

export * from "./aggregation";
export * from "./buildTimeline";
export * from "./passesTimings";
export * from "./postRequest";
export * from "./slowestNodes";
export * from "./summary";

export function getColor(
  duration: number,
  minDuration: number,
  maxDuration: number,
  hover?: boolean,
): string {
  const percentage = (duration - minDuration) / (maxDuration - minDuration);

  const red = MIN_RED + Math.floor((MAX_RED - MIN_RED) * percentage);
  const green = MAX_GREEN - Math.floor((MAX_GREEN - MIN_GREEN) * percentage);

  return `rgba(${red}, ${green}, 0, ${hover ? 0.5 : 0.8})`;
}
