import { Sun, Moon, Palette, Zap } from 'lucide-react'

const themeIcons = {
  cyberpunk: Zap,
  minimal: Palette,
  dark: Moon,
  light: Sun,
}

const themeLabels = {
  cyberpunk: 'Cyberpunk',
  minimal: 'Minimal',
  dark: 'Dark',
  light: 'Light',
}

const themeDescriptions = {
  cyberpunk: 'Neon red, scanlines, high contrast',
  minimal: 'Clean, spacious, distraction-free',
  dark: 'Easy on eyes, low light friendly',
  light: 'Bright, clear, print-friendly',
}

export default function LinkTreeThemeToggle({ theme, onChange, compact = false }) {
  const themes = Object.keys(themeLabels)

  return (
    <div className={`lt-theme-toggle ${compact ? 'lt-compact' : ''}`} role="radiogroup" aria-label="Select theme">
      {themes.map((t) => {
        const Icon = themeIcons[t]
        const isActive = theme === t
        return (
          <button
            key={t}
            role="radio"
            aria-checked={isActive}
            className={`lt-theme-btn ${isActive ? 'lt-active' : ''}`}
            onClick={() => onChange(t)}
            title={`${themeLabels[t]}: ${themeDescriptions[t]}`}
          >
            <Icon size={compact ? 16 : 20} className="lt-theme-icon" />
            {!compact && (
              <span className="lt-theme-label">{themeLabels[t]}</span>
            )}
            {isActive && <span className="lt-theme-check" aria-hidden="true">✓</span>}
          </button>
        )
      })}
    </div>
  )
}