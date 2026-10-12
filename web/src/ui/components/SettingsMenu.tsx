import type { Settings, TextSpeed } from '../storage'
import { Modal } from './Modal'

interface SettingsMenuProps {
  settings: Settings
  onChange: (settings: Settings) => void
  onClose: () => void
  onQuit?: (() => void) | undefined
}

const SPEEDS: TextSpeed[] = ['slow', 'normal', 'fast', 'instant']

export function SettingsMenu({ settings, onChange, onClose, onQuit }: SettingsMenuProps) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <fieldset className="setting">
        <legend className="pixel">Text speed</legend>
        <div className="segmented">
          {SPEEDS.map((speed) => (
            <label key={speed} className={settings.textSpeed === speed ? 'is-active' : ''}>
              <input
                type="radio"
                name="speed"
                className="sr-only"
                checked={settings.textSpeed === speed}
                onChange={() => onChange({ ...settings, textSpeed: speed })}
              />
              {speed}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="setting setting--toggle">
        <input
          type="checkbox"
          checked={settings.autoAdvance}
          onChange={(e) => onChange({ ...settings, autoAdvance: e.target.checked })}
        />
        <span>Auto-advance text</span>
      </label>
      <label className="setting setting--toggle">
        <input
          type="checkbox"
          checked={settings.music}
          onChange={(e) => onChange({ ...settings, music: e.target.checked })}
        />
        <span>Music</span>
      </label>
      <label className="setting setting--toggle">
        <input
          type="checkbox"
          checked={settings.sfx}
          onChange={(e) => onChange({ ...settings, sfx: e.target.checked })}
        />
        <span>Sound effects</span>
      </label>
      <label className="setting setting--toggle">
        <input
          type="checkbox"
          checked={settings.scanlines}
          onChange={(e) => onChange({ ...settings, scanlines: e.target.checked })}
        />
        <span>CRT scanlines (old-TV stripes over the stage)</span>
      </label>
      {onQuit && (
        <button type="button" className="btn setting__quit" onClick={onQuit}>
          Save &amp; quit to title
        </button>
      )}
    </Modal>
  )
}
