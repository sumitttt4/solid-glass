import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Animated icons: a small, hand-picked set, not a whole icon font. Each one moves the way the
 * thing it stands for moves — a bell swings, a heart beats, a gear turns.
 *
 * They play when the icon, or the button or link it sits in, is hovered or focused. `animate`
 * plays them on a loop; `active` switches the two-state ones (copy → check, menu → close,
 * sun → moon, play state of the mic). Reduced motion is respected.
 *
 * Path data is from Lucide (ISC, https://lucide.dev), so they sit beside lucide-react icons
 * without a change in weight. The keyframes ship with the component: no stylesheet to copy.
 */

const css = `
[data-animated-icon]{overflow:visible;flex-shrink:0}
[data-animated-icon] *{transform-box:fill-box;transform-origin:center}
[data-animated-icon] [data-part="bell"]{--ai:ai-swing .9s ease-in-out;transform-origin:50% 0}
[data-animated-icon] [data-part="clapper"]{--ai:ai-clapper .9s ease-in-out}
[data-animated-icon] [data-part="heart"]{--ai:ai-beat 1s ease-in-out}
[data-animated-icon] [data-part="lens"]{--ai:ai-scan 1.1s ease-in-out}
[data-animated-icon] [data-part="gear"]{--ai:ai-spin 1.6s cubic-bezier(.5,0,.5,1)}
[data-animated-icon] [data-part="plane"]{--ai:ai-fly 1s ease-in-out}
[data-animated-icon] [data-part="arrow-down"]{--ai:ai-drop .9s ease-in-out}
[data-animated-icon] [data-part="arrow-up"]{--ai:ai-rise .9s ease-in-out}
[data-animated-icon] [data-part="lid"]{--ai:ai-lid .9s ease-in-out;transform-origin:0% 100%}
[data-animated-icon] [data-part="refresh"]{--ai:ai-spin 1s ease-in-out}
[data-animated-icon] [data-part="star"]{--ai:ai-twinkle 1.2s ease-in-out}
[data-animated-icon] [data-part="star-small"]{--ai:ai-twinkle 1.2s .3s ease-in-out}
[data-animated-icon] [data-part="lashes"]{--ai:ai-blink 1.2s ease-in-out}
[data-animated-icon] [data-part="nudge"]{--ai:ai-nudge .8s ease-in-out}
[data-animated-icon] [data-part="wave"]{--ai:ai-wave 1s ease-in-out}
[data-animated-icon] [data-part="wave-2"]{--ai:ai-wave 1s .15s ease-in-out}
[data-animated-icon] [data-part="shackle"]{--ai:ai-shackle 1s ease-in-out}
[data-animated-icon] [data-part="plus"]{--ai:ai-quarter .5s ease-out}
[data-animated-icon] [data-part="draw"]{--ai:ai-draw .7s ease-out;stroke-dasharray:24;stroke-dashoffset:0}
:is(button,a,label,[role="button"],[data-slot="button"],[data-icon-trigger]):is(:hover,:focus-visible) [data-animated-icon] [data-part],
[data-animated-icon]:hover [data-part]{animation:var(--ai)}
[data-animated-icon][data-animate] [data-part]{animation:var(--ai);animation-iteration-count:infinite}
[data-animated-icon] [data-part="spinner"]{animation:ai-spin .9s linear infinite}
[data-animated-icon] [data-part="mic-ring"]{opacity:0}
[data-animated-icon][data-active] [data-part="mic-ring"]{animation:ai-ring 1.6s ease-out infinite}
[data-animated-icon] [data-swap]{transition:transform .35s cubic-bezier(.3,1.4,.5,1),opacity .2s ease}
[data-animated-icon] [data-swap="off"]{opacity:1;transform:scale(1) rotate(0)}
[data-animated-icon] [data-swap="on"]{opacity:0;transform:scale(.4) rotate(-45deg)}
[data-animated-icon][data-active] [data-swap="off"]{opacity:0;transform:scale(.4) rotate(45deg)}
[data-animated-icon][data-active] [data-swap="on"]{opacity:1;transform:scale(1) rotate(0)}
[data-animated-icon] [data-bar]{transition:transform .3s cubic-bezier(.3,1.3,.5,1),opacity .2s}
[data-animated-icon][data-active] [data-bar="1"]{transform:translateY(7px) rotate(45deg)}
[data-animated-icon][data-active] [data-bar="2"]{opacity:0;transform:scaleX(.2)}
[data-animated-icon][data-active] [data-bar="3"]{transform:translateY(-7px) rotate(-45deg)}
@keyframes ai-swing{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(7deg)}80%{transform:rotate(-4deg)}}
@keyframes ai-clapper{0%,100%{transform:translateX(0)}20%{transform:translateX(2.4px)}40%{transform:translateX(-2px)}60%{transform:translateX(1.2px)}80%{transform:translateX(-.6px)}}
@keyframes ai-beat{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(.96)}45%{transform:scale(1.1)}}
@keyframes ai-scan{0%,100%{transform:translate(0,0)}25%{transform:translate(-1.5px,-1px)}50%{transform:translate(1px,-1.5px)}75%{transform:translate(1.5px,1px)}}
@keyframes ai-spin{to{transform:rotate(360deg)}}
@keyframes ai-fly{0%,100%{transform:translate(0,0)}45%{transform:translate(5px,-5px);opacity:0}46%{transform:translate(-5px,5px);opacity:0}70%{transform:translate(0,0);opacity:1}}
@keyframes ai-drop{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
@keyframes ai-rise{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes ai-lid{0%,100%{transform:rotate(0) translateY(0)}40%,60%{transform:rotate(-18deg) translateY(-1px)}}
@keyframes ai-twinkle{0%,100%{transform:scale(1) rotate(0);opacity:1}50%{transform:scale(.7) rotate(20deg);opacity:.6}}
@keyframes ai-blink{0%,40%,60%,100%{transform:scaleY(1)}50%{transform:scaleY(.1)}}
@keyframes ai-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
@keyframes ai-wave{0%,100%{opacity:1;transform:translateX(0)}50%{opacity:.3;transform:translateX(1px)}}
@keyframes ai-shackle{0%,100%{transform:translateY(0)}40%,60%{transform:translateY(-2.5px)}}
@keyframes ai-quarter{to{transform:rotate(90deg)}}
@keyframes ai-ring{0%{opacity:.7;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes ai-draw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){[data-animated-icon] *{animation:none!important;transition-duration:.01ms!important}}
`

export type AnimatedIconProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  /** Edge length in pixels. */
  size?: number
  /** Keep playing on a loop, not just on hover. */
  animate?: boolean
  /** The second state of a two-state icon (copied, open, dark, recording). */
  active?: boolean
  strokeWidth?: number
}

function Svg({ size = 24, animate, active, strokeWidth = 2, className, children, ...props }: AnimatedIconProps & { children: React.ReactNode }) {
  return (
    <>
      <style href="animated-icons" precedence="default">{css}</style>
      <svg
        data-animated-icon=""
        data-animate={animate ? "" : undefined}
        data-active={active ? "" : undefined}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props["aria-label"] ? undefined : true}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children}
      </svg>
    </>
  )
}

export const BellIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="bell"><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></g>
    <path data-part="clapper" d="M10.268 21a2 2 0 0 0 3.464 0" />
  </Svg>
)

export const HeartIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path data-part="heart" fill={p.active ? "currentColor" : "none"} d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  </Svg>
)

export const SearchIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="lens"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></g>
  </Svg>
)

export const SettingsIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="gear">
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </g>
  </Svg>
)

export const SendIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="plane">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </g>
  </Svg>
)

export const DownloadIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="arrow-down"><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /></g>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </Svg>
)

export const UploadIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="arrow-up"><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /></g>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </Svg>
)

export const TrashIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="lid"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></g>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </Svg>
)

export const RefreshIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="refresh">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
    </g>
  </Svg>
)

export const SparklesIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path data-part="star" d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    <g data-part="star-small"><path d="M20 2v4" /><path d="M22 4h-4" /></g>
    <circle data-part="star-small" cx="4" cy="20" r="2" />
  </Svg>
)

export const EyeIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="lashes">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </g>
  </Svg>
)

export const ArrowRightIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="nudge"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></g>
  </Svg>
)

export const VolumeIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
    <path data-part="wave" d="M16 9a5 5 0 0 1 0 6" />
    <path data-part="wave-2" d="M19.364 18.364a9 9 0 0 0 0-12.728" />
  </Svg>
)

export const LockIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path data-part="shackle" d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
)

export const PlusIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-part="plus"><path d="M5 12h14" /><path d="M12 5v14" /></g>
  </Svg>
)

export const CheckIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path data-part="draw" d="M20 6 9 17l-5-5" />
  </Svg>
)

export const LoaderIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path data-part="spinner" d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Svg>
)

/** Two states: set `active` once the text is on the clipboard. */
export const CopyIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-swap="off">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </g>
    <g data-swap="on"><path d="M20 6 9 17l-5-5" /></g>
  </Svg>
)

/** Two states: set `active` while the menu is open. The three bars fold into a cross. */
export const MenuIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <path data-bar="1" d="M4 5h16" />
    <path data-bar="2" d="M4 12h16" />
    <path data-bar="3" d="M4 19h16" />
  </Svg>
)

/** Two states: `active` is dark. */
export const ThemeIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <g data-swap="off">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </g>
    <g data-swap="on"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></g>
  </Svg>
)

/** Two states: `active` while recording, with rings going out from it. */
export const MicIcon = (p: AnimatedIconProps) => (
  <Svg {...p}>
    <circle data-part="mic-ring" cx="12" cy="9" r="9" strokeWidth={1} />
    <circle data-part="mic-ring" cx="12" cy="9" r="9" strokeWidth={1} style={{ animationDelay: ".8s" }} />
    <path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <rect x="9" y="2" width="6" height="13" rx="3" fill={p.active ? "currentColor" : "none"} />
  </Svg>
)

/** Every icon in the set, by name, for pickers and galleries. */
export const animatedIcons = {
  Bell: BellIcon,
  Heart: HeartIcon,
  Search: SearchIcon,
  Settings: SettingsIcon,
  Send: SendIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Trash: TrashIcon,
  Refresh: RefreshIcon,
  Sparkles: SparklesIcon,
  Eye: EyeIcon,
  ArrowRight: ArrowRightIcon,
  Volume: VolumeIcon,
  Lock: LockIcon,
  Plus: PlusIcon,
  Check: CheckIcon,
  Loader: LoaderIcon,
  Copy: CopyIcon,
  Menu: MenuIcon,
  Theme: ThemeIcon,
  Mic: MicIcon,
} as const

export type AnimatedIconName = keyof typeof animatedIcons
