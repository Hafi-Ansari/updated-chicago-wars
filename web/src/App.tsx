import { useEffect, useState } from 'react'
import { synth } from './ui/audio/synth'
import { GameScreen } from './ui/screens/GameScreen'
import { TitleScreen } from './ui/screens/TitleScreen'
import { loadSettings, type Settings, writeSettings } from './ui/storage'
import { useGame } from './ui/useGame'

const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const

export default function App() {
  const controller = useGame()
  const [settings, setSettings] = useState(loadSettings)

  const updateSettings = (next: Settings) => {
    setSettings(next)
    writeSettings(next)
  }

  useEffect(() => synth.configure(settings.music, settings.sfx), [settings.music, settings.sfx])

  // Browsers only allow audio after a user gesture. iOS only counts a touch once the
  // finger lifts (touchend/click), not pointerdown, so listen for all of them.
  useEffect(() => {
    const unlock = () => synth.unlock()
    for (const event of GESTURES) window.addEventListener(event, unlock)
    return () => {
      for (const event of GESTURES) window.removeEventListener(event, unlock)
    }
  }, [])

  if (!controller.game) {
    return (
      <TitleScreen
        onStart={controller.start}
        onResume={controller.resume}
        settings={settings}
        onSettings={updateSettings}
      />
    )
  }

  return (
    <GameScreen
      key={controller.runId}
      controller={controller}
      settings={settings}
      onSettings={updateSettings}
    />
  )
}
