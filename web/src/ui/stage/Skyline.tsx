/**
 * Chicago at night, as 240×160 pixel art in SVG: banded sky, moon, the Willis
 * and Hancock towers, lit windows, the elevated L, and a neon sign.
 * Generated from a fixed seed so the skyline never changes between renders.
 */

import { memo } from 'react'
import { createRng } from '../../engine'

const W = 240
const HORIZON = 116

const SKY_BANDS = [
  { y: 0, h: 46, fill: '#191a21' },
  { y: 46, h: 26, fill: '#1c1d26' },
  { y: 72, h: 20, fill: '#20212b' },
  { y: 92, h: 12, fill: '#262735' },
  { y: 104, h: 7, fill: '#2f2c45' },
  { y: 111, h: 5, fill: '#3b3358' },
]

const WINDOW_COLORS = ['#f1fa8c', '#f1fa8c', '#ffb86c', '#8be9fd']

interface Building {
  x: number
  w: number
  h: number
  windows: { x: number; y: number; fill: string; flicker: boolean }[]
}

function buildSkyline(): {
  far: Building[]
  near: Building[]
  stars: { x: number; y: number; o: number; tw: boolean }[]
} {
  const rng = createRng(312) // Chicago's area code.
  const row = (minH: number, maxH: number, minW: number, maxW: number, density: number) => {
    const buildings: Building[] = []
    for (let x = -4; x < W; ) {
      const w = rng.int(minW, maxW)
      const h = rng.int(minH, maxH)
      const windows: Building['windows'] = []
      for (let wy = HORIZON - h + 3; wy < HORIZON - 2; wy += 3) {
        for (let wx = x + 2; wx < x + w - 1; wx += 2) {
          if (rng.chance(density)) {
            windows.push({ x: wx, y: wy, fill: rng.pick(WINDOW_COLORS), flicker: rng.chance(0.06) })
          }
        }
      }
      buildings.push({ x, w, h, windows })
      x += w + rng.int(0, 2)
    }
    return buildings
  }
  const stars = Array.from({ length: 34 }, () => ({
    x: rng.int(0, W - 1),
    y: rng.int(2, 70),
    o: 0.3 + rng.float() * 0.6,
    tw: rng.chance(0.25),
  }))
  return { far: row(26, 52, 8, 16, 0), near: row(12, 34, 10, 20, 0.22), stars }
}

const SKYLINE = buildSkyline()
const PILLARS = Array.from({ length: 13 }, (_, i) => i * 20 + 4)
const LANE_DASHES = Array.from({ length: 12 }, (_, i) => i * 22 + 6)

function Skyline() {
  const { far, near, stars } = SKYLINE
  return (
    <svg
      className="skyline"
      viewBox={`0 0 ${W} 160`}
      width={W}
      height={160}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {SKY_BANDS.map((b) => (
        <rect key={b.y} x={0} y={b.y} width={W} height={b.h} fill={b.fill} />
      ))}

      {stars.map((s) => (
        <rect
          key={`${s.x}-${s.y}`}
          className={s.tw ? 'twinkle' : undefined}
          x={s.x}
          y={s.y}
          width={1}
          height={1}
          fill="#f8f8f2"
          opacity={s.o}
          style={s.tw ? { animationDelay: `${(s.x % 7) * 0.4}s` } : undefined}
        />
      ))}

      {/* Moon */}
      <rect x={30} y={14} width={14} height={14} fill="#bd93f9" opacity={0.12} />
      <rect x={33} y={16} width={8} height={10} fill="#f8f8f2" />
      <rect x={32} y={17} width={10} height={8} fill="#f8f8f2" />
      <rect x={35} y={19} width={2} height={2} fill="#dcdcd4" />
      <rect x={38} y={22} width={2} height={1} fill="#dcdcd4" />

      {/* Far skyline */}
      <g fill="#2a2b3b">
        {far.map((b) => (
          <rect key={b.x} x={b.x} y={HORIZON - b.h} width={b.w} height={b.h} />
        ))}
        {/* Willis Tower: stepped setbacks and twin antennas */}
        <rect x={150} y={44} width={18} height={72} />
        <rect x={153} y={36} width={12} height={10} />
        <rect x={155} y={30} width={8} height={8} />
        <rect x={156} y={14} width={1} height={16} />
        <rect x={161} y={16} width={1} height={14} />
        {/* John Hancock: tapered with antennas */}
        <rect x={200} y={52} width={12} height={64} />
        <rect x={201} y={46} width={10} height={8} />
        <rect x={203} y={42} width={6} height={6} />
        <rect x={204} y={28} width={1} height={14} />
        <rect x={207} y={30} width={1} height={12} />
      </g>
      <rect className="blink" x={156} y={13} width={1} height={1} fill="#ff5555" />
      <rect className="blink blink--late" x={161} y={15} width={1} height={1} fill="#ff5555" />
      <rect className="blink" x={204} y={27} width={1} height={1} fill="#ff5555" />

      {/* Near skyline with lit windows */}
      {near.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={HORIZON - b.h} width={b.w} height={b.h} fill="#1e1f2a" />
          {b.windows.map((win) => (
            <rect
              key={`${win.x}-${win.y}`}
              className={win.flicker ? 'flicker' : undefined}
              x={win.x}
              y={win.y}
              width={1}
              height={1}
              fill={win.fill}
              opacity={0.8}
            />
          ))}
        </g>
      ))}

      {/* Neon sign */}
      <g className="neon">
        <rect x={84} y={93} width={22} height={9} fill="none" stroke="#ff79c6" strokeWidth={1} />
        <rect x={87} y={96} width={3} height={3} fill="#ff79c6" />
        <rect x={92} y={96} width={3} height={3} fill="#8be9fd" />
        <rect x={97} y={96} width={6} height={3} fill="#ff79c6" />
      </g>

      {/* Elevated L tracks */}
      <rect x={0} y={HORIZON + 2} width={W} height={3} fill="#15161c" />
      {PILLARS.map((x) => (
        <rect key={x} x={x} y={HORIZON + 5} width={2} height={10} fill="#15161c" />
      ))}
      <g className="train">
        {[0, 1, 2].map((car) => (
          <g key={car} transform={`translate(${car * 25} 0)`}>
            <rect x={0} y={HORIZON - 5} width={23} height={7} fill="#6272a4" />
            <rect x={0} y={HORIZON - 5} width={23} height={1} fill="#8be9fd" opacity={0.5} />
            {[2, 7, 12, 17].map((wx) => (
              <rect key={wx} x={wx} y={HORIZON - 3} width={3} height={2} fill="#f1fa8c" />
            ))}
          </g>
        ))}
      </g>

      {/* Street */}
      <rect x={0} y={HORIZON + 15} width={W} height={160 - HORIZON - 15} fill="#1a1b23" />
      <rect x={0} y={HORIZON + 15} width={W} height={1} fill="#2a2b3b" />
      {LANE_DASHES.map((x) => (
        <rect key={x} x={x} y={146} width={10} height={1} fill="#44475a" />
      ))}
    </svg>
  )
}

export default memo(Skyline)
