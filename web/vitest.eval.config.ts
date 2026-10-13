import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

/** The live judge evaluation (eval/*.eval.ts), kept out of `npm test`: it calls Jev. */
export default defineConfig(({ mode }) => ({
  test: {
    include: ['eval/**/*.eval.ts'],
    // TYPESAFE_API_KEY from the environment or .env.local.
    env: loadEnv(mode, process.cwd(), 'TYPESAFE_'),
  },
}))
