import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Synth } from '../src/ui/audio/synth'

/**
 * Mobile audio recovery, against a fake AudioContext that can misbehave the way
 * iOS does after an app switch: stay "interrupted", ignore resume(), or claim
 * "running" while its output is dead and its clock frozen.
 */
class FakeContext {
  static all: FakeContext[] = []
  state: string = 'suspended'
  /** False = the output died: the context may say "running" but its clock won't move. */
  outputAlive = true
  /** Whether resume() works (iOS refuses outside gestures or while interrupted). */
  acceptsResume = true
  /** Whether a suspend/resume cycle revives a dead output, like switching tabs does. */
  kickRevives = true
  destination = {}
  private base = 0
  private since = performance.now()

  constructor() {
    FakeContext.all.push(this)
  }

  get currentTime(): number {
    const ticking = this.state === 'running' && this.outputAlive
    return ticking ? this.base + (performance.now() - this.since) / 1000 : this.base
  }

  /** Changes state or output without losing the clock's position. */
  set(change: () => void): void {
    this.base = this.currentTime
    this.since = performance.now()
    change()
  }

  createGain() {
    return { gain: { value: 0, setTargetAtTime() {} }, connect: (n: unknown) => n }
  }

  resume(): Promise<void> {
    if (this.acceptsResume) this.set(() => (this.state = 'running'))
    return Promise.resolve()
  }

  suspend(): Promise<void> {
    this.set(() => {
      this.state = 'suspended'
      if (this.kickRevives) this.outputAlive = true
    })
    return Promise.resolve()
  }

  close(): Promise<void> {
    this.set(() => (this.state = 'closed'))
    return Promise.resolve()
  }
}

function fakeTarget() {
  const listeners = new Map<string, (() => void)[]>()
  return {
    addEventListener: (type: string, fn: () => void) =>
      listeners.set(type, [...(listeners.get(type) ?? []), fn]),
    dispatch: (type: string) => {
      for (const fn of listeners.get(type) ?? []) fn()
    },
  }
}

let doc: ReturnType<typeof fakeTarget> & { hidden: boolean }

const gesture = (type: string) => ({ type }) as Event
const tick = (ms: number) => vi.advanceTimersByTimeAsync(ms)
const latest = () => FakeContext.all.at(-1) as FakeContext

function switchAway(whileAway: (ctx: FakeContext) => void = () => {}) {
  doc.hidden = true
  doc.dispatch('visibilitychange')
  whileAway(latest())
  doc.hidden = false
  doc.dispatch('visibilitychange')
}

/** A synth that's been playing for a second. */
async function playing(): Promise<{ synth: Synth; ctx: FakeContext; rebuilds: () => number }> {
  const synth = new Synth()
  let rebuilds = 0
  synth.onRebuild(() => rebuilds++)
  synth.unlock(gesture('click'))
  await tick(1000)
  return { synth, ctx: latest(), rebuilds: () => rebuilds }
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'performance'] })
  FakeContext.all = []
  doc = Object.assign(fakeTarget(), { hidden: false })
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', {
    ...fakeTarget(),
    AudioContext: FakeContext,
    setInterval: (fn: () => void, ms: number) => setInterval(fn, ms),
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('audio recovery', () => {
  it('pauses while hidden and resumes on return (tab switch)', async () => {
    const { ctx } = await playing()
    doc.hidden = true
    doc.dispatch('visibilitychange')
    expect(ctx.state).toBe('suspended')
    doc.hidden = false
    doc.dispatch('visibilitychange')
    expect(ctx.state).toBe('running')
  })

  it('leaves a healthy context alone, so taps never restart the music', async () => {
    const { synth, rebuilds } = await playing()
    switchAway()
    await tick(2000)
    synth.unlock(gesture('click'))
    synth.unlock(gesture('touchend'))
    expect(rebuilds()).toBe(0)
    expect(FakeContext.all).toHaveLength(1)
  })

  it('revives a context that says "running" but went silent during an app switch', async () => {
    const { ctx, rebuilds } = await playing()
    switchAway((c) => c.set(() => (c.outputAlive = false)))
    expect(ctx.state).toBe('running')

    const frozenAt = ctx.currentTime
    await tick(500)
    expect(ctx.currentTime).toBe(frozenAt)
    await tick(1000)
    expect(ctx.currentTime).toBeGreaterThan(frozenAt)
    expect(rebuilds()).toBe(0)
  })

  it('rebuilds on the next real tap when kicking the output does not help', async () => {
    const { synth, ctx, rebuilds } = await playing()
    ctx.kickRevives = false
    switchAway((c) => c.set(() => (c.outputAlive = false)))
    await tick(3000)

    // A tap before used to do nothing here, because the context said "running".
    synth.unlock(gesture('pointerdown'))
    expect(rebuilds()).toBe(0)
    synth.unlock(gesture('touchend'))
    expect(rebuilds()).toBe(1)
    expect(ctx.state).toBe('closed')
    expect(latest().state).toBe('running')
  })

  it('rebuilds an "interrupted" context only on a gesture iOS accepts', async () => {
    const { synth, rebuilds } = await playing()
    switchAway((c) => {
      c.acceptsResume = false
      c.set(() => (c.state = 'interrupted'))
    })
    synth.unlock(gesture('pointerdown'))
    expect(rebuilds()).toBe(0)
    synth.unlock(gesture('touchend'))
    expect(rebuilds()).toBe(1)
    expect(latest().state).toBe('running')
  })

  it('rebuilds when resume() keeps getting ignored, without waiting on a timer', async () => {
    const { synth, rebuilds } = await playing()
    switchAway((c) => (c.acceptsResume = false))
    expect(latest().state).toBe('suspended')

    // A quick tap first just retries resume(); it's too early to give up on it.
    synth.unlock(gesture('touchend'))
    expect(rebuilds()).toBe(0)
    await tick(1000)
    expect(rebuilds()).toBe(0)
    synth.unlock(gesture('touchend'))
    expect(rebuilds()).toBe(1)
    expect(latest().state).toBe('running')
  })

  it("doesn't rebuild over and over on a device whose audio never starts", async () => {
    const { synth, rebuilds } = await playing()
    switchAway((c) => (c.acceptsResume = false))
    await tick(1000)
    synth.unlock(gesture('click'))
    latest().acceptsResume = false
    latest().set(() => (latest().state = 'suspended'))
    await tick(600)
    synth.unlock(gesture('click'))
    expect(rebuilds()).toBe(1)
  })
})
