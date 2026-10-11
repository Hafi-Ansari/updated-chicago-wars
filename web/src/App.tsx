import { useState } from 'react'
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
