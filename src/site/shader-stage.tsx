import * as React from "react"

import { cn } from "@/lib/utils"
import type { Material } from "@/components/ui/material-picker"
import { useTheme } from "@/site/theme"

/*
 * A stage for components: the material on the box, and behind it a Paper Shaders mesh gradient
 * in cobalt, celadon and porcelain. Glass needs something behind it to read as glass; this is
 * it. The shader loads lazily, mounts only while the stage is on screen, holds still for
 * reduced motion, and sits on a CSS gradient of the same colours so there is never a blank box.
 */

const MeshGradient = React.lazy(() => import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient })))

type Palette = "hero" | Material
const PALETTES: Record<"light" | "dark", Record<Palette, string[]>> = {
  light: {
    hero: ["#2445e6", "#8fd3bf", "#eef1f6", "#a9b8ff"],
    solid: ["#dfe5ee", "#eef1f6", "#c9d3e6", "#f3f5f7"],
    glass: ["#24348f", "#7c88a6", "#d5dbe7", "#6f84ff"],
    frost: ["#2445e6", "#9fd8c6", "#f3f5f7", "#b8c4ff"],
    aurora: ["#2445e6", "#76cfb4", "#c4b8ff", "#eef1f6"],
  },
  dark: {
    hero: ["#1431c4", "#14614f", "#000000", "#3b2fb0"],
    solid: ["#0a0a0a", "#111111", "#050505", "#141414"],
    glass: ["#070b22", "#18257a", "#161616", "#000000"],
    frost: ["#0c1866", "#2445e6", "#1d6b59", "#000000"],
    aurora: ["#1530c9", "#17705d", "#4a32c4", "#000000"],
  },
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = React.useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  React.useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduce(q.matches)
    q.addEventListener("change", on)
    return () => q.removeEventListener("change", on)
  }, [])
  return reduce
}

function useInView<T extends Element>(margin = "200px") {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return setInView(true)
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView] as const
}

const fallback = (c: string[]) =>
  `radial-gradient(60% 80% at 15% 20%, ${c[0]}, transparent 70%), radial-gradient(55% 70% at 85% 25%, ${c[1]}, transparent 70%), radial-gradient(70% 80% at 60% 100%, ${c[3]}, transparent 70%), ${c[2]}`

export function ShaderStage({
  material,
  palette,
  animate,
  shader = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The finish of the components on the stage. */
  material: Material
  /** Which colours to draw behind them; defaults to the material's own. */
  palette?: Palette
  /** Keep the light moving. Aurora always does. */
  animate?: boolean
  /** Draw the shader at all (Normal previews don't need one). */
  shader?: boolean
}) {
  const { theme } = useTheme()
  const reduce = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const colors = PALETTES[theme === "dark" ? "dark" : "light"][palette ?? material]
  const moving = !reduce && (animate || material === "aurora")
  return (
    <div ref={ref} data-material={material} className={cn("mat-stage shader-stage", className)} {...props}>
      {shader && (
        <div aria-hidden className="shader-stage-light" style={{ background: fallback(colors) }}>
          {inView && (
            <React.Suspense fallback={null}>
              <MeshGradient
                colors={colors}
                distortion={0.85}
                swirl={0.25}
                grainMixer={0.04}
                grainOverlay={0.06}
                speed={moving ? 0.28 : 0}
                frame={4200}
                maxPixelCount={1600 * 1000}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            </React.Suspense>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
