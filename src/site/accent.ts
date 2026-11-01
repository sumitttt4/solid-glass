export const ACCENT_KEY = "glaze:accent:v1"
export function applyAccent(value: string) {
  const root = document.documentElement
  if (!/^#[\da-f]{6}$/i.test(value)) {
    delete root.dataset.accent
    root.style.removeProperty("--accent-solid")
    root.style.removeProperty("--accent-on")
    return
  }
  const rgb = value.match(/[\da-f]{2}/gi)!.map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v / 12.92 : ((v+.055)/1.055)**2.4)
  const luminance = rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722
  root.dataset.accent = "custom"
  root.style.setProperty("--accent-solid", value)
  root.style.setProperty("--accent-on", (luminance+.05)/.05 >= 1.05/(luminance+.05) ? "#000000" : "#ffffff")
}
