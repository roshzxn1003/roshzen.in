/**
 * Portfolio Theme Synchronization Engine
 * Maps terminal themes to the entire portfolio UI:
 * - Injects Tailwind red scale variables (--color-red-50 to --color-red-950) so all text-red-*, bg-red-*, border-red-* update dynamically
 * - Injects CSS variables for glows, backdrops, cursors, scrollbars, and panels
 * - Dispatches 'portfolio-theme-change' custom event for React components needing color props
 */

export const THEME_PALETTES = {
  default: {
    accent: '#ef4444',
    accentRgb: '239, 68, 68',
    glowRgb: '220, 38, 38',
    lightRgb: '248, 113, 113',
    bgSolid: '#07080c',
    shades: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    menuColors: ['#1c0404', '#450a0a', '#991b1b'],
  },
  red: {
    accent: '#ff3b3b',
    accentRgb: '255, 59, 59',
    glowRgb: '220, 38, 38',
    lightRgb: '255, 107, 107',
    bgSolid: '#100508',
    shades: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#ff6b6b',
      500: '#ff3b3b',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
    menuColors: ['#200408', '#500814', '#b0102a'],
  },
  green: {
    accent: '#22c55e',
    accentRgb: '34, 197, 94',
    glowRgb: '22, 163, 74',
    lightRgb: '74, 222, 128',
    bgSolid: '#030c08',
    shades: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    menuColors: ['#02180c', '#06381e', '#166534'],
  },
  blue: {
    accent: '#38bdf8',
    accentRgb: '56, 189, 248',
    glowRgb: '14, 165, 233',
    lightRgb: '125, 211, 252',
    bgSolid: '#040a14',
    shades: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    menuColors: ['#021224', '#06294d', '#075985'],
  },
  cyber: {
    accent: '#f0ff00',
    accentRgb: '240, 255, 0',
    glowRgb: '234, 179, 8',
    lightRgb: '253, 224, 71',
    bgSolid: '#080312',
    shades: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
    menuColors: ['#1c1800', '#4a4002', '#854d0e'],
  },
  matrix: {
    accent: '#00ff66',
    accentRgb: '0, 255, 102',
    glowRgb: '16, 185, 129',
    lightRgb: '52, 211, 153',
    bgSolid: '#020f06',
    shades: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    menuColors: ['#011a08', '#033d15', '#065f46'],
  },
  dracula: {
    accent: '#ff79c6',
    accentRgb: '255, 121, 198',
    glowRgb: '217, 70, 239',
    lightRgb: '240, 171, 252',
    bgSolid: '#181024',
    shades: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    menuColors: ['#220626', '#4a0854', '#86198f'],
  },
  github: {
    accent: '#58a6ff',
    accentRgb: '88, 166, 255',
    glowRgb: '59, 130, 246',
    lightRgb: '147, 197, 253',
    bgSolid: '#0d1117',
    shades: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    menuColors: ['#07193b', '#0f3575', '#1e40af'],
  },
  vscode: {
    accent: '#007acc',
    accentRgb: '0, 122, 204',
    glowRgb: '2, 132, 199',
    lightRgb: '56, 189, 248',
    bgSolid: '#0a1016',
    shades: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0284c7',
      600: '#0369a1',
      700: '#075985',
      800: '#0c4a6e',
      900: '#082f49',
      950: '#052033',
    },
    menuColors: ['#041728', '#083359', '#0c4a6e'],
  },
  nord: {
    accent: '#88c0d0',
    accentRgb: '136, 192, 208',
    glowRgb: '6, 182, 212',
    lightRgb: '103, 232, 249',
    bgSolid: '#10161f',
    shades: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#88c0d0',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
    menuColors: ['#0a1f28', '#113b4c', '#155e75'],
  },
  synthwave: {
    accent: '#ff7edb',
    accentRgb: '255, 126, 219',
    glowRgb: '244, 63, 94',
    lightRgb: '251, 113, 133',
    bgSolid: '#1a1024',
    shades: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
    menuColors: ['#280922', '#57134a', '#9f1239'],
  },
  tokyo: {
    accent: '#7aa2f7',
    accentRgb: '122, 162, 247',
    glowRgb: '99, 102, 241',
    lightRgb: '129, 140, 248',
    bgSolid: '#101221',
    shades: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    menuColors: ['#101538', '#1e2666', '#3730a3'],
  },
}

export function getStoredTheme() {
  if (typeof window === 'undefined') return 'default'
  try {
    return localStorage.getItem('roshzen_term_theme') || 'default'
  } catch {
    return 'default'
  }
}

export function applyPortfolioTheme(themeName) {
  if (typeof document === 'undefined') return

  const palette = THEME_PALETTES[themeName] || THEME_PALETTES.default
  const root = document.documentElement

  // Set top-level dataset
  root.dataset.portfolioTheme = themeName

  // Set primary portfolio CSS variables
  root.style.setProperty('--portfolio-accent', palette.accent)
  root.style.setProperty('--portfolio-accent-rgb', palette.accentRgb)
  root.style.setProperty('--portfolio-accent-glow-rgb', palette.glowRgb)
  root.style.setProperty('--portfolio-accent-light-rgb', palette.lightRgb)
  root.style.setProperty('--portfolio-accent-soft', `rgba(${palette.accentRgb}, 0.18)`)
  root.style.setProperty('--portfolio-accent-glow', `rgba(${palette.accentRgb}, 0.35)`)
  root.style.setProperty('--portfolio-bg-solid', palette.bgSolid)

  // Override Tailwind red color scale directly on :root so all text-red-*, bg-red-*, border-red-* dynamically update
  Object.entries(palette.shades).forEach(([step, color]) => {
    root.style.setProperty(`--color-red-${step}`, color)
  })

  // Emit event so React components that accept explicit color props (like StaggeredMenu) can update immediately
  try {
    window.dispatchEvent(
      new CustomEvent('portfolio-theme-change', {
        detail: { theme: themeName, palette },
      })
    )
  } catch {
    // Ignore in non-browser environments
  }
}
