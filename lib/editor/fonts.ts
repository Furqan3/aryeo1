// Curated list of fonts available in the editor.
// Mix of system fonts (always available) and Google Fonts (loaded via stylesheet
// link in app/layout.tsx). Grouped by category for the dropdown UI.

export type FontGroup = {
  label: string
  fonts: string[]
}

export const FONT_GROUPS: FontGroup[] = [
  {
    label: "System",
    fonts: [
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Georgia",
      "Verdana",
      "Courier New",
      "Comic Sans MS",
      "Impact",
      "Trebuchet MS",
      "Palatino",
    ],
  },
  {
    label: "Sans Serif",
    fonts: [
      "Inter",
      "Roboto",
      "Poppins",
      "Montserrat",
      "Open Sans",
      "Lato",
      "Raleway",
      "Nunito",
      "Work Sans",
      "Oswald",
      "Bebas Neue",
      "Barlow",
      "Mulish",
      "DM Sans",
      "Plus Jakarta Sans",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Playfair Display",
      "Merriweather",
      "Lora",
      "Cormorant Garamond",
      "EB Garamond",
      "Crimson Text",
      "Bitter",
      "PT Serif",
    ],
  },
  {
    label: "Display",
    fonts: ["Anton", "Archivo Black", "Righteous", "Fjalla One", "Abril Fatface"],
  },
  {
    label: "Handwriting",
    fonts: [
      "Pacifico",
      "Dancing Script",
      "Caveat",
      "Sacramento",
      "Great Vibes",
      "Satisfy",
      "Allura",
      "Kaushan Script",
    ],
  },
  {
    label: "Monospace",
    fonts: ["JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono"],
  },
]

export const ALL_FONTS: string[] = FONT_GROUPS.flatMap((g) => g.fonts)

const SYSTEM_FONTS = new Set(FONT_GROUPS[0].fonts)

// Build the Google Fonts CSS URL for all non-system fonts.
// Only produced once and consumed in app/layout.tsx.
export const GOOGLE_FONTS_URL = (() => {
  const families = ALL_FONTS.filter((f) => !SYSTEM_FONTS.has(f)).map((name) => {
    const family = name.replace(/ /g, "+")
    // Pull a useful weight range. Some display/handwriting fonts only ship 400.
    return `family=${family}:wght@300;400;500;600;700`
  })
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`
})()

// Force-load a font via the Font Loading API so the canvas can render it.
// Without this, fabric.js draws text before the font file is fetched and silently
// falls back to the previous font.
export async function loadFont(name: string, weight: number | string = 400): Promise<void> {
  if (typeof document === "undefined") return
  if (SYSTEM_FONTS.has(name)) return
  const fonts: any = (document as any).fonts
  if (!fonts || typeof fonts.load !== "function") return
  try {
    await fonts.load(`${weight} 16px "${name}"`)
  } catch {
    // Network or font name issues are non-fatal — let fabric fall back.
  }
}
