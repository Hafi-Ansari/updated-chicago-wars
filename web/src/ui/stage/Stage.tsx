/**
 * The battle stage: a 480×320 scene (the GBA's 240×160 at 2×) scaled to fit.
 * Gen-3 layout: foe top-right on a platform, the hero's back bottom-left,
 * an HP box for each. Animations are driven by the event currently playing.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ENEMIES } from '../../content/enemies'
import { NPCS } from '../../content/npcs'
import type { SpriteId } from '../../content/sprites'
import type { GameState, Side } from '../../engine'
import type { Display, PlayingEvent } from '../useGame'
import { HpBox } from './HpBox'
import Skyline from './Skyline'
import { Sprite } from './Sprite'

const STAGE_W = 480
const STAGE_H = 320

interface StageProps {
  state: GameState
  current: PlayingEvent | null
  display: Display
  /** Hide the foe until its introduction plays. */
  foeHidden: boolean
}

interface Foe {
  sprite: SpriteId
  name: string
  subtitle: string
}

function foeOf(state: GameState): Foe | null {
  const { phase } = state
  switch (phase.kind) {
    case 'battle': {
      const { enemy } = phase.battle
      return { sprite: enemy.kind, name: enemy.name, subtitle: ENEMIES[enemy.kind].title }
    }
    case 'dialogue':
    case 'shop':
      return { sprite: phase.npc.id, name: phase.npc.name, subtitle: NPCS[phase.npc.id].title }
    case 'learnMove':
      // The Gangsta stays on stage while teaching from the playbook.
      return phase.npc
        ? { sprite: phase.npc.id, name: phase.npc.name, subtitle: NPCS[phase.npc.id].title }
        : null
    default:
      return null
  }
}

/** CSS animation class for each side, given the event playing right now. */
function animationsFor(
  current: PlayingEvent | null,
): Partial<Record<Side, string>> & { shake?: boolean } {
  const e = current?.event
  if (!e) return {}
  switch (e.type) {
    case 'hit':
      return { [e.target]: 'anim-hit', [e.attacker]: 'anim-lunge', shake: e.crit }
    case 'miss':
      return { [e.target]: 'anim-dodge', [e.attacker]: 'anim-lunge' }
    case 'tick':
    case 'selfHit':
    case 'recoil':
    case 'reflect':
      return { [e.target]: 'anim-hit' }
    case 'heal':
      return { [e.target]: 'anim-heal' }
    case 'status':
      return e.change === 'applied' ? { [e.target]: `anim-status anim-status--${e.status}` } : {}
    case 'appear':
      return { enemy: 'anim-enter' }
    case 'fled':
      return { [e.target]: e.target === 'hero' ? 'anim-flee' : 'anim-flee-foe' }
    case 'locked':
      return { hero: 'anim-locked', enemy: 'anim-lunge' }
    default:
      return {}
  }
}

/** Floating damage/heal number for the event playing right now, if any. */
function floatFor(
  current: PlayingEvent | null,
): { target: Side; text: string; variant: string } | null {
  const e = current?.event
  if (!e) return null
  switch (e.type) {
    case 'hit':
      return { target: e.target, text: `-${e.damage}`, variant: e.crit ? 'float-num--crit' : '' }
    case 'tick':
    case 'selfHit':
    case 'recoil':
    case 'reflect':
      return { target: e.target, text: `-${e.damage}`, variant: '' }
    case 'heal':
      return e.amount > 0
        ? { target: e.target, text: `+${e.amount}`, variant: 'float-num--heal' }
        : null
    default:
      return null
  }
}

function useStageScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / STAGE_W)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return scale
}

export function Stage({ state, current, display, foeHidden }: StageProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const scale = useStageScale(frameRef)
  const foe = foeHidden ? null : foeOf(state)
  const anim = animationsFor(current)

  // A fainted foe stays down (and one that ran stays gone) until a different foe
  // shows up; a fainted hero stays down for the rest of the run (the screen
  // remounts for a new run).
  const foeKey = foe ? `${foe.sprite}:${foe.name}` : 'none'
  const [faintedFoe, setFaintedFoe] = useState<string | null>(null)
  const [goneFoe, setGoneFoe] = useState<string | null>(null)
  const [heroDown, setHeroDown] = useState(false)
  useEffect(() => {
    const e = current?.event
    if (e?.type === 'fled' && e.target === 'enemy') setGoneFoe(foeKey)
    if (e?.type !== 'faint') return
    if (e.target === 'hero') setHeroDown(true)
    else setFaintedFoe(foeKey)
  }, [current, foeKey])
  const fainted: Record<Side, boolean> = { hero: heroDown, enemy: faintedFoe === foeKey }
  const foeGone = goneFoe === foeKey && anim.enemy === undefined

  const location = current?.event.type === 'location' ? current.event : null
  const battle = state.phase.kind === 'battle' ? state.phase.battle : null
  const { hero } = state
  const effectKey = current?.id ?? 'idle'
  const float = floatFor(current)

  return (
    <div className="stage-frame panel" ref={frameRef} style={{ height: STAGE_H * scale }}>
      <div
        className={`stage ${anim.shake ? 'anim-shake' : ''}`}
        key={anim.shake ? effectKey : 'stage'}
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        <div className="stage__bg">
          <Skyline />
        </div>

        {foe && (
          <>
            <div className="platform platform--foe" />
            <div
              className={`actor actor--foe ${foeGone ? 'actor--gone' : ''}`}
              key={`${foeKey}-${anim.enemy ? effectKey : ''}`}
            >
              <div className={anim.enemy ?? ''}>
                <Sprite id={foe.sprite} facing="front" scale={2} fainting={fainted.enemy} />
              </div>
            </div>
            {battle ? (
              <HpBox
                side="enemy"
                name={foe.name}
                subtitle={foe.subtitle}
                hp={display.enemyHp}
                maxHp={battle.enemy.stats.maxHp}
                showNumbers={hero.skills.includes('airpods')}
                statuses={battle.enemy.statuses}
                stats={battle.revealed ? battle.enemy.stats : undefined}
              />
            ) : (
              <div className="nameplate panel">
                <span className="pixel">{foe.name}</span>{' '}
                <span className="hpbox__sub">{foe.subtitle}</span>
              </div>
            )}
          </>
        )}

        <div className="platform platform--hero" />
        <div className="actor actor--hero" key={`hero-${anim.hero ? effectKey : ''}`}>
          <div className={anim.hero ?? ''}>
            <Sprite id="hero" facing="back" scale={3} fainting={fainted.hero} />
          </div>
        </div>
        <HpBox
          side="hero"
          name={hero.name}
          subtitle={`Lv ${hero.level}`}
          hp={display.heroHp}
          maxHp={hero.stats.maxHp}
          showNumbers
          statuses={hero.statuses}
        />

        {float && (
          <div
            key={current?.id}
            className={`float-num float-num--${float.target} ${float.variant}`}
          >
            {float.text}
          </div>
        )}

        {location && (
          <div className="location-banner pixel" key={current?.id}>
            <span className="location-banner__block">Block {location.block}</span>
            {location.neighborhood}
          </div>
        )}
      </div>
    </div>
  )
}
