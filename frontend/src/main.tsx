import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './index.css'
import './styles/reset.css'
import './styles/design-tokens.css'
import './styles/design-system.css'
import './styles/globals.css'
import './styles/pages.css'
import App from './App.tsx'

const themeKey = 'cravecache-theme'

try {
  const storedTheme = window.localStorage.getItem(themeKey)
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : preferredTheme

  document.documentElement.dataset.theme = initialTheme
  document.documentElement.style.colorScheme = initialTheme
} catch {
  document.documentElement.dataset.theme = 'light'
  document.documentElement.style.colorScheme = 'light'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
