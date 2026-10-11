import { MOVES } from '../../content/moves'
import { SKILL_ORDER, SKILLS } from '../../content/skills'
import type { Hero } from '../../engine'
import { Modal } from './Modal'

export function StatsCard({ hero, onClose }: { hero: Hero; onClose: () => void }) {
  const rows = [
    ['Level', hero.level],
    ['HP', `${hero.hp}/${hero.stats.maxHp}`],
    ['Attack', hero.stats.atk],
    ['Defense', hero.stats.def],
    ['Speed', hero.stats.spd],
    ['Crit', `${Math.round(hero.stats.crit * 100)}%`],
    ['Clout', hero.clout],
  ] as const
  const skills = SKILL_ORDER.filter((s) => hero.skills.includes(s))

  return (
    <Modal title={hero.name} onClose={onClose}>
      <dl className="stats-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className="pixel">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="pixel modal__subhead">Moves</h3>
      <ul className="skill-list">
        {hero.moves.map((slot) => {
          const def = MOVES[slot.id]
          return (
            <li key={slot.id}>
              <span className="pixel">
                {def.name}{' '}
                <span className="muted-text">{def.pp === null ? 'PP ∞' : `PP ${def.pp}`}</span>
              </span>
              <span>{def.description}</span>
            </li>
          )
        })}
      </ul>

      <h3 className="pixel modal__subhead">Gear</h3>
      {skills.length === 0 ? (
        <p className="muted-text">None yet. The Plug sells hidden skills for clout.</p>
      ) : (
        <ul className="skill-list">
          {skills.map((s) => (
            <li key={s}>
              <span className="pixel">{SKILLS[s].item}</span>
              <span>{SKILLS[s].description}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
