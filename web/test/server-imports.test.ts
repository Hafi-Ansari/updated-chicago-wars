import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Vercel runs api/judge-bar.ts as plain Node ESM, where a relative import needs its
 * extension ("./rhyme.js"). Vite and the tests don't care, so a missing one only breaks in
 * production. This walks the function's runtime imports and checks every relative one.
 */
const ROOT = join(__dirname, '..')

function runtimeImports(file: string): string[] {
  const source = readFileSync(file, 'utf8')
  const statements = source.match(/^\s*(?:import|export)\b[^;]*?from\s+['"][^'"]+['"]/gm) ?? []
  const sideEffects = source.match(/^\s*import\s+['"][^'"]+['"]/gm) ?? []
  return [...statements, ...sideEffects]
    .filter((s) => !/^\s*(import|export)\s+type\b/.test(s))
    .map((s) => /['"]([^'"]+)['"]\s*$/.exec(s)?.[1] ?? '')
    .filter((spec) => spec.startsWith('.'))
}

function walk(entry: string): { file: string; spec: string }[] {
  const seen = new Set<string>()
  const found: { file: string; spec: string }[] = []
  const visit = (file: string) => {
    if (seen.has(file)) return
    seen.add(file)
    for (const spec of runtimeImports(file)) {
      found.push({ file: relative(ROOT, file), spec })
      const target = join(dirname(file), spec.replace(/\.js$/, '.ts'))
      if (existsSync(target)) visit(target)
    }
  }
  visit(join(ROOT, entry))
  return found
}

describe('the judging function', () => {
  const imports = walk('api/judge-bar.ts')

  it('imports server code and a few self-contained game modules', () => {
    expect(imports.length).toBeGreaterThan(3)
  })

  it.each(walk('api/judge-bar.ts'))('$file imports $spec with a .js extension', ({ spec }) => {
    expect(spec).toMatch(/\.js$/)
  })
})
