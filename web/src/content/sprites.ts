/**
 * Sprite manifest. Every character sprite is an 8-frame horizontal strip of
 * 64×64 frames built by scripts/build-sprites.mjs: [front, back, faint×6].
 * Swapping the art for hand-drawn sprites only means replacing the PNGs.
 * Attribution for the LPC layers lives in public/CREDITS.md.
 */

import type { EnemyKind, NpcId } from '../engine/types'

export type SpriteId = 'hero' | EnemyKind | NpcId

export const FRAME_SIZE = 64
export const STRIP_FRAMES = 8
export const FRAMES = { front: 0, back: 1, faintStart: 2, faintEnd: 7 } as const

export const spriteUrl = (id: SpriteId): string => `${import.meta.env.BASE_URL}sprites/${id}.png`
