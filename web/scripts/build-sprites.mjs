/**
 * Builds the cast's battle sprites from the Universal LPC Spritesheet Generator.
 *
 *   npm run sprites
 *
 * For each character recipe below it downloads the needed layers (cached in
 * scripts/.lpc-cache), recolors them with the LPC palettes, composites them in
 * z-order, and writes public/sprites/<id>.png as an 8-frame strip:
 *
 *   [front, back, faint×6]   (64×64 each)
 *
 * It also writes the attribution the licenses require (CC-BY-SA 3.0 / GPL 3 /
 * OGA-BY 3.0): public/CREDITS.md.
 */

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = join(ROOT, 'scripts', '.lpc-cache')
const COMMIT = '58ce1aa479e4df32845a73a5d0afc221c3a893c2'
const REPO = `https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/${COMMIT}`
const FRAME = 64

/**
 * Character recipes. `def` is a path under sheet_definitions/; `color` picks a
 * palette color (recolorable items) or a variant (items with fixed variants).
 */
const CAST = {
  hero: {
    skin: 'olive',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'white' },
      { def: 'legs/pants/legs_pants.json', color: 'charcoal' },
      { def: 'torso/shirts/longsleeve/torso_clothes_longsleeve.json', color: 'purple' },
      { def: 'hair/afro/hair_flat_top_fade.json', color: 'black' },
    ],
  },
  goon: {
    skin: 'light',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'gray' },
      { def: 'legs/shorts/legs_shorts.json', color: 'blue' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'gray' },
      { def: 'hair/short/hair_bedhead.json', color: 'light_brown' },
    ],
  },
  thug: {
    skin: 'brown',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'black' },
      { def: 'legs/pants/legs_pants.json', color: 'navy' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'black' },
      { def: 'hair/afro/hair_cornrows.json', color: 'black' },
      { def: 'headwear/coverings/bandana/hat_bandana.json', color: 'red' },
    ],
  },
  biker: {
    skin: 'taupe',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'black' },
      { def: 'legs/pants/legs_pants.json', color: 'black' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'white' },
      { def: 'torso/jacket/torso_jacket_collared.json', color: 'leather' },
      { def: 'hair/short/hair_unkempt.json', color: 'dark_gray' },
    ],
  },
  gangLeader: {
    skin: 'bronze',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'black' },
      { def: 'legs/pants/legs_formal.json', color: 'charcoal' },
      { def: 'torso/shirts/longsleeve/torso_clothes_longsleeve.json', color: 'maroon' },
      { def: 'torso/jacket/torso_jacket_trench.json', color: 'dark gray' },
      { def: 'headwear/hats/formal/hat_formal_bowler.json', color: 'black' },
    ],
  },
  gangRapper: {
    skin: 'black',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'white' },
      { def: 'legs/pants/legs_pants.json', color: 'sky' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'white' },
      { def: 'hair/afro/hair_twists_fade.json', color: 'black' },
      { def: 'headwear/neck/neck_necklace_chain.json', color: 'gold' },
    ],
  },
  boss: {
    skin: 'amber',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'black' },
      { def: 'legs/pants/legs_formal.json', color: 'black' },
      { def: 'torso/shirts/longsleeve/torso_clothes_longsleeve.json', color: 'black' },
      { def: 'torso/jacket/torso_jacket_collared.json', color: 'purple' },
      { def: 'hair/afro/hair_dreadlocks_short.json', color: 'black' },
      { def: 'headwear/neck/neck_necklace_chain.json', color: 'gold' },
      { def: 'headwear/hats/formal/hat_formal_crown.json', color: 'gold' },
    ],
  },
  gangsta: {
    skin: 'bronze',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'white' },
      { def: 'legs/pants/legs_pants.json', color: 'black' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'red' },
      { def: 'hair/afro/hair_dreadlocks_long.json', color: 'black' },
      { def: 'headwear/neck/neck_necklace_chain.json', color: 'silver' },
    ],
  },
  plug: {
    skin: 'light',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'black' },
      { def: 'legs/pants/legs_pants.json', color: 'charcoal' },
      { def: 'torso/shirts/longsleeve/torso_clothes_longsleeve.json', color: 'teal' },
      { def: 'torso/jacket/torso_jacket_trench.json', color: 'gray' },
      { def: 'hair/short/hair_parted.json', color: 'platinum' },
    ],
  },
  hotDogVendor: {
    skin: 'light',
    layers: [
      { def: 'feet/shoes/feet_shoes_basic.json', color: 'brown' },
      { def: 'legs/pants/legs_pants.json', color: 'blue' },
      { def: 'torso/shirts/shortsleeve/torso_clothes_tshirt.json', color: 'white' },
      { def: 'torso/aprons/torso_aprons_apron.json', color: 'red' },
      { def: 'hair/short/hair_plain.json', color: 'dark_brown' },
    ],
  },
}

const BODY_DEF = 'body/body.json'
const HEAD_DEF = 'head/heads/human/heads_human_male.json'
const BODY_TYPE = 'male'
const EYE_COLOR = 'brown'

// ── Fetching with a local cache ──────────────────────────────────────────────

async function fetchCached(path, kind) {
  const file = join(CACHE, path)
  if (existsSync(file)) return readFile(file)
  const res = await fetch(`${REPO}/${path}`)
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, buf)
  if (kind === 'png') process.stdout.write('.')
  return buf
}

async function fetchJson(path) {
  const buf = await fetchCached(path, 'json')
  if (!buf) throw new Error(`Missing ${path}`)
  return JSON.parse(buf.toString('utf8'))
}

async function fetchPng(candidates) {
  for (const path of candidates) {
    const buf = await fetchCached(`spritesheets/${path}`, 'png')
    if (buf) return { png: PNG.sync.read(buf), path }
  }
  return null
}

// ── Palettes ─────────────────────────────────────────────────────────────────

const hexToRgb = (hex) => {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Builds [fromRgb, toRgb] pairs mapping the material's base palette to `color`. */
async function paletteMap(material, color) {
  const meta = await fetchJson(`palette_definitions/${material}/meta_${material}.json`)
  const palettes = await fetchJson(`palette_definitions/${material}/${material}_ulpc.json`)
  const from = palettes[meta.base]
  const to = palettes[color]
  if (!to) {
    throw new Error(`No ${material} color "${color}". Options: ${Object.keys(palettes).join(', ')}`)
  }
  return from.map((hex, i) => [hexToRgb(hex), hexToRgb(to[i] ?? hex)])
}

function recolor(png, maps) {
  const { data } = png
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    for (const [from, to] of maps) {
      if (
        Math.abs(data[i] - from[0]) <= 1 &&
        Math.abs(data[i + 1] - from[1]) <= 1 &&
        Math.abs(data[i + 2] - from[2]) <= 1
      ) {
        ;[data[i], data[i + 1], data[i + 2]] = to
        break
      }
    }
  }
}

// ── Layers ───────────────────────────────────────────────────────────────────

const credits = new Map()

function recordCredits(def, usedPath) {
  for (const credit of def.credits ?? []) {
    const prefix = credit.file.replace(/\/$/, '')
    if (usedPath.startsWith(prefix)) credits.set(credit.file, credit)
  }
}

/** Recolor slots from a sheet definition: [{ slot, material }]. */
function recolorSlots(def) {
  const r = def.recolors
  if (!r) return []
  if (r.material) return [{ slot: 'color_1', material: r.material }]
  return Object.entries(r)
    .filter(([key]) => key.startsWith('color_'))
    .map(([slot, value]) => ({ slot, material: value.material }))
}

async function loadLayers(defPath, colors) {
  const def = await fetchJson(`sheet_definitions/${defPath}`)
  const layers = []

  for (const [key, layer] of Object.entries(def)) {
    if (!/^layer_\d+$/.test(key)) continue
    const base = layer[BODY_TYPE] ?? layer.male
    if (!base) throw new Error(`${defPath} has no ${BODY_TYPE} layer`)

    const sheets = {}
    for (const anim of ['walk', 'hurt']) {
      const variant = colors.color_1
      const candidates = def.variants
        ? [`${base}${anim}/${variant}.png`, `${base}${anim}/${variant.replaceAll(' ', '_')}.png`]
        : [`${base}${anim}.png`]
      const found = await fetchPng(candidates)
      if (!found) throw new Error(`${defPath}: none of ${candidates.join(', ')} exist`)
      recordCredits(def, found.path)
      sheets[anim] = found.png
    }

    if (!def.variants) {
      const maps = []
      for (const { slot, material } of recolorSlots(def)) {
        const color = colors[slot]
        if (color) maps.push(...(await paletteMap(material, color)))
      }
      for (const png of Object.values(sheets)) recolor(png, maps)
    }
    layers.push({ z: layer.zPos ?? 0, sheets })
  }
  return layers
}

// ── Compositing ──────────────────────────────────────────────────────────────

function blit(dst, src, sx, sy, dx, dy) {
  for (let y = 0; y < FRAME; y++) {
    for (let x = 0; x < FRAME; x++) {
      const si = ((sy + y) * src.width + (sx + x)) * 4
      const di = ((dy + y) * dst.width + (dx + x)) * 4
      const a = src.data[si + 3] / 255
      if (a === 0) continue
      for (let c = 0; c < 3; c++) {
        dst.data[di + c] = Math.round(src.data[si + c] * a + dst.data[di + c] * (1 - a))
      }
      dst.data[di + 3] = Math.max(dst.data[di + 3], src.data[si + 3])
    }
  }
}

/** Strip layout: front, back, then the six hurt frames. */
const STRIP = [
  { anim: 'walk', col: 0, row: 2 },
  { anim: 'walk', col: 0, row: 0 },
  ...Array.from({ length: 6 }, (_, col) => ({ anim: 'hurt', col, row: 0 })),
]

async function buildCharacter(id, recipe) {
  const layers = [
    ...(await loadLayers(BODY_DEF, { color_1: recipe.skin })),
    ...(await loadLayers(HEAD_DEF, { color_1: recipe.skin, color_2: EYE_COLOR })),
  ]
  for (const { def, color } of recipe.layers)
    layers.push(...(await loadLayers(def, { color_1: color })))
  layers.sort((a, b) => a.z - b.z)

  const out = new PNG({ width: FRAME * STRIP.length, height: FRAME })
  STRIP.forEach((frame, i) => {
    for (const layer of layers) {
      const sheet = layer.sheets[frame.anim]
      // Some sheets have fewer rows (hurt is a single row); skip what isn't there.
      if ((frame.row + 1) * FRAME > sheet.height || (frame.col + 1) * FRAME > sheet.width) continue
      blit(out, sheet, frame.col * FRAME, frame.row * FRAME, i * FRAME, 0)
    }
  })

  const file = join(ROOT, 'public', 'sprites', `${id}.png`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, PNG.sync.write(out))
  console.log(`\n  ✓ ${id}`)
}

// ── Credits ──────────────────────────────────────────────────────────────────

async function writeCredits() {
  const list = [...credits.values()].sort((a, b) => a.file.localeCompare(b.file))
  const md = [
    '# Art credits',
    '',
    'Character sprites are composited from the',
    '[Universal LPC Spritesheet Character Generator](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator)',
    `(commit \`${COMMIT.slice(0, 7)}\`) by \`scripts/build-sprites.mjs\`.`,
    'Each layer is used under one of the licenses listed for it.',
    '',
    ...list.flatMap((c) => [
      `## ${c.file}`,
      '',
      `- **Authors:** ${c.authors.join(', ')}`,
      `- **Licenses:** ${c.licenses.join(', ')}`,
      ...(c.notes ? [`- **Notes:** ${c.notes}`] : []),
      ...c.urls.map((u) => `- ${u}`),
      '',
    ]),
  ].join('\n')
  await writeFile(join(ROOT, 'public', 'CREDITS.md'), md)
  console.log(`  ✓ credits (${list.length} layers)`)
}

for (const [id, recipe] of Object.entries(CAST)) {
  try {
    await buildCharacter(id, recipe)
  } catch (error) {
    console.error(`\n  ✗ ${id}: ${error.message}`)
    process.exitCode = 1
  }
}
await writeCredits()
