/**
 * Tidying a typed Battle Rap bar. Shared with the judging server (server/judgeBar.ts),
 * which runs as plain Node ESM on Vercel, so this module must not import anything at
 * runtime (test/server-imports.test.ts checks).
 */

/** A typed bar is at most two lines of this many characters. */
export const MAX_BAR_LINE_LENGTH = 90

/** At most two non-empty lines, each trimmed and cut to MAX_BAR_LINE_LENGTH. */
export function cleanBar(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim().slice(0, MAX_BAR_LINE_LENGTH))
    .filter(Boolean)
    .slice(0, 2)
    .join('\n')
}
