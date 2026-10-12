import { useEffect, useState } from 'react'
import { synth } from './ui/audio/synth'
import { GameScreen } from './ui/screens/GameScreen'
import { TitleScreen } from './ui/screens/TitleScreen'
import { loadSettings, type Settings, writeSettings } from './ui/storage'
import { useGame } from './ui/useGame'

export default function App() {
  const controller = useGame()
  const [settings, setSettings] = useState(loadSettings)

  const updateSettings = (next: Settings) => {
    setSettings(next)
    writeSettings(next)
  }

  useEffect(() => synth.configure(settings.music, settings.sfx), [settings.music, settings.sfx])

  // Browsers only allow audio after a user gesture: unlock on the first tap or key.
  useEffect(() => {
    const unlock = () => synth.unlock()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
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
