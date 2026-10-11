import '@fontsource/silkscreen/400.css'
import '@fontsource/silkscreen/700.css'
import '@fontsource/pixelify-sans/400.css'
import '@fontsource/pixelify-sans/600.css'
import './ui/theme.css'
import './ui/game.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
