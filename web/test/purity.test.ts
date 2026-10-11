import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/** The engine must stay pure and deterministic: no hidden randomness, clocks, or React. */
const FORBIDDEN = [
  { pattern: /Math\.random/, why: 'use the seeded Rng from engine/rng.ts' },
  { pattern: /new Date\b|Date\.now/, why: 'game logic must not depend on the clock' },
  { pattern: /from ['"]react/, why: 'engine and content stay framework-free' },
]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) ? [path] : []
  })
}

describe('engine purity', () => {
  const root = join(__dirname, '..', 'src')
  const files = [...sourceFiles(join(root, 'engine')), ...sourceFiles(join(root, 'content'))]

  it.each(files)('%s has no impure dependencies', (file) => {
    const source = readFileSync(file, 'utf8')
    for (const { pattern, why } of FORBIDDEN) {
      expect(pattern.test(source), `${pattern} found: ${why}`).toBe(false)
    }
  })
})
