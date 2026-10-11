import { type FormEvent, useState } from 'react'
import { ART_CREDITS } from '../../content/sprites'
import { Modal } from '../components/Modal'
import { SettingsMenu } from '../components/SettingsMenu'
import Skyline from '../stage/Skyline'
import { Sprite } from '../stage/Sprite'
import { loadBest, loadSave, type Settings } from '../storage'

interface TitleScreenProps {
  onStart: (name: string) => void
  onResume: () => void
  settings: Settings
  onSettings: (settings: Settings) => void
}

export function TitleScreen({ onStart, onResume, settings, onSettings }: TitleScreenProps) {
  const [name, setName] = useState('')
  const [panel, setPanel] = useState<'credits' | 'settings' | null>(null)
  const [save] = useState(loadSave)
  const [best] = useState(loadBest)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onStart(name)
  }

  return (
    <main className="title">
      <div className="title__scene panel" aria-hidden="true">
        <Skyline />
        <div className="title__cast">
          <Sprite id="thug" facing="front" scale={2} />
          <Sprite id="boss" facing="front" scale={2} />
          <Sprite id="gangRapper" facing="front" scale={2} />
        </div>
      </div>

      <h1 className="title__logo pixel">
        Chicago <span>Wars</span>
      </h1>
      <p className="title__tag">A turn-based street RPG. Twelve blocks. One crown.</p>

      <form className="title__form panel" onSubmit={submit}>
        <label htmlFor="hero-name" className="pixel">
          Enter your name
        </label>
        <input
          id="hero-name"
          className="title__input"
          value={name}
          maxLength={18}
          placeholder="Lil Debug"
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <div className="title__buttons">
          <button type="submit" className="btn btn--primary">
            New game
          </button>
          {save && (
            <button type="button" className="btn" onClick={onResume}>
              Continue{' '}
              <span className="sub">
                {save.hero.name} · block {save.block}
              </span>
            </button>
          )}
        </div>
      </form>

      <footer className="title__footer">
        {best > 0 && <span className="pixel">Best score {best}</span>}
        <button type="button" className="linkish" onClick={() => setPanel('settings')}>
          Settings
        </button>
        <button type="button" className="linkish" onClick={() => setPanel('credits')}>
          Credits
        </button>
      </footer>

      {panel === 'settings' && (
        <SettingsMenu settings={settings} onChange={onSettings} onClose={() => setPanel(null)} />
      )}
      {panel === 'credits' && (
        <Modal title="Credits" onClose={() => setPanel(null)}>
          <p>
            <strong>Chicago Wars</strong> by Hafi Ansari. Originally a Java console game for AP
            Computer Science (2020), rebuilt for the web.
          </p>
          <p>
            Fonts: Silkscreen by Jason Kottke and Pixelify Sans by Stefie Justprince (SIL Open Font
            License). Color palette: Dracula.
          </p>
          <h3 className="pixel modal__subhead">Character art</h3>
          <p>
            Sprites composited from the Universal LPC Spritesheet Character Generator. Each layer is
            used under one of the licenses listed for it.
          </p>
          <ul className="credits-list">
            {ART_CREDITS.map((c) => (
              <li key={c.file}>
                <span className="pixel">{c.file}</span>
                <span>{c.authors.join(', ')}</span>
                <span className="muted-text">{c.licenses.join(' / ')}</span>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </main>
  )
}
