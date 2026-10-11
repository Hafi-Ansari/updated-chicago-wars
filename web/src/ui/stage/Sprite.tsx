import type { CSSProperties } from 'react'
import { FRAME_SIZE, FRAMES, type SpriteId, STRIP_FRAMES, spriteUrl } from '../../content/sprites'

interface SpriteProps {
  id: SpriteId
  facing: 'front' | 'back'
  /** Integer pixel scale. */
  scale: number
  fainting?: boolean
  className?: string
}

/** One character frame from a sprite strip, scaled crisply. */
export function Sprite({ id, facing, scale, fainting = false, className = '' }: SpriteProps) {
  const size = FRAME_SIZE * scale
  const style = {
    '--size': `${size}px`,
    '--faint-from': `${-FRAMES.faintStart * size}px`,
    '--faint-to': `${-FRAMES.faintEnd * size}px`,
    width: size,
    height: size,
    backgroundImage: `url(${spriteUrl(id)})`,
    backgroundSize: `${STRIP_FRAMES * size}px ${size}px`,
    backgroundPosition: `${-FRAMES[facing] * size}px 0`,
  } as CSSProperties

  return (
    <div
      className={`sprite ${fainting ? 'sprite--faint' : ''} ${className}`}
      style={style}
      role="img"
    />
  )
}
