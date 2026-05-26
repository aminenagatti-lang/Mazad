// Rate limiting — Upstash Redis
// Install: npm install @upstash/ratelimit @upstash/redis
// Uncomment when env vars are configured

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// export const bidRateLimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(5, "10 s"),
//   prefix: "mazad:bid",
//   analytics: true,
// });

// export const authRateLimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(5, "1 m"),
//   prefix: "mazad:auth",
//   analytics: true,
// });

// export const uploadRateLimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(10, "1 m"),
//   prefix: "mazad:upload",
//   analytics: true,
// });

// export const registrationRateLimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(3, "1 h"),
//   prefix: "mazad:register",
//   analytics: true,
// });

// Placeholder — returns success until Upstash is configured
export async function checkRateLimit(
  _key: string,
  _prefix: "bid" | "auth" | "upload" | "register"
): Promise<{ success: boolean; remaining: number; reset: number }> {
  return { success: true, remaining: 999, reset: Date.now() + 60000 };
}
