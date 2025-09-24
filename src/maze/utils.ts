export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) throw new Error("Assert failed!", { cause: message ?? "Condition was false" })
}