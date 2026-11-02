import * as React from "react"
import {
  Add01Icon,
  AiMagicIcon as AiMagicData,
  ArrowRight02Icon,
  Attachment01Icon,
  Bookmark02Icon,
  BrainIcon as BrainData,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  FavouriteIcon,
  FlashIcon as FlashData,
  Github01Icon,
  Home01Icon,
  Idea01Icon,
  Link01Icon,
  Loading03Icon,
  Location01Icon,
  Mail01Icon,
  Menu01Icon,
  Mic01Icon,
  Moon02Icon,
  Notification03Icon,
  PauseIcon,
  PlayIcon,
  RefreshIcon as RefreshData,
  Rocket01Icon,
  Search01Icon,
  SentIcon,
  Settings02Icon,
  SparklesIcon as SparklesData,
  SquareLock02Icon,
  StarIcon as StarData,
  Sun03Icon,
  ThumbsUpIcon as ThumbsUpData,
  Tick02Icon,
  Upload04Icon,
  ViewIcon,
  VolumeHighIcon,
  Wifi01Icon,
  Activity01Icon,
  Analytics01Icon,
  Archive01Icon,
  ChartIncreaseIcon,
  CheckListIcon,
  Clock01Icon,
  CloudUploadIcon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Database01Icon,
  FilterHorizontalIcon,
  Folder01Icon,
  Globe02Icon,
  InboxIcon,
  Invoice01Icon,
  Layers01Icon,
  Logout03Icon,
  Message01Icon,
  PencilEdit02Icon,
  PieChartIcon,
  Share08Icon,
  ShoppingCart01Icon,
  Tag01Icon,
  UserAdd01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

/*
 * Animated icons, built on Hugeicons (MIT, https://hugeicons.com).
 *
 * `AnimatedIcon` animates ANY Hugeicon: pass its data and a preset, for the whole icon or for
 * single parts of it (a bell's clapper, a bin's lid). The named icons below are tuned that way.
 *
 * Triggers: "hover" (default) plays when the icon, or the button, link or label it sits in, is
 * hovered or focused; "loop" plays forever; "mount" plays once when it appears; "none" never.
 * Two-state icons (Copy, Menu, Theme, Mic, PlayPause, Heart) switch with `active`.
 * Keyframes ship with the component; reduced motion is respected.
 */

export type IconData = readonly (readonly [string, { readonly [key: string]: string | number }])[]

export type IconAnimation =
  | "swing" | "clapper" | "beat" | "pop" | "scan" | "spin" | "spin-once" | "spin-always" | "fly" | "drop" | "rise"
  | "lift" | "twinkle" | "twinkle-late" | "blink" | "nudge" | "wave" | "wave-late" | "shackle" | "quarter"
  | "draw" | "wiggle" | "float" | "shake" | "launch" | "tilt" | "flash" | "grow" | "nudge-back" | "slice"

export type IconTrigger = "hover" | "loop" | "mount" | "none"

export const ICON_ANIMATIONS: IconAnimation[] = [
  "swing", "beat", "pop", "spin-once", "spin", "wiggle", "tilt", "shake", "float", "nudge", "drop", "rise", "fly", "launch", "blink", "draw", "twinkle", "flash",
]

const css = `
[data-ai-icon]{overflow:visible;flex-shrink:0}
[data-ai-icon] *{transform-box:fill-box;transform-origin:center}
[data-ai-icon] [data-anim=swing]{--a:ai-swing .9s ease-in-out;transform-origin:50% 0}
[data-ai-icon] [data-anim=clapper]{--a:ai-clapper .9s ease-in-out}
[data-ai-icon] [data-anim=beat]{--a:ai-beat .9s ease-in-out}
[data-ai-icon] [data-anim=pop]{--a:ai-pop .45s cubic-bezier(.3,1.6,.5,1)}
[data-ai-icon] [data-anim=scan]{--a:ai-scan 1.1s ease-in-out}
[data-ai-icon] [data-anim=spin]{--a:ai-spin 1.4s cubic-bezier(.5,0,.5,1)}
[data-ai-icon] [data-anim=spin-once]{--a:ai-spin .7s cubic-bezier(.4,0,.2,1)}
[data-ai-icon] [data-anim=spin-always]{animation:ai-spin 1s linear infinite!important}
[data-ai-icon] [data-anim=fly]{--a:ai-fly .9s ease-in-out}
[data-ai-icon] [data-anim=drop]{--a:ai-drop .8s ease-in-out}
[data-ai-icon] [data-anim=rise]{--a:ai-rise .8s ease-in-out}
[data-ai-icon] [data-anim=lift]{--a:ai-lift .8s ease-in-out;transform-origin:0% 100%}
[data-ai-icon] [data-anim=twinkle]{--a:ai-twinkle 1s ease-in-out}
[data-ai-icon] [data-anim=twinkle-late]{--a:ai-twinkle 1s .2s ease-in-out}
[data-ai-icon] [data-anim=blink]{--a:ai-blink .9s ease-in-out}
[data-ai-icon] [data-anim=nudge]{--a:ai-nudge .7s ease-in-out}
[data-ai-icon] [data-anim=wave]{--a:ai-wave .9s ease-in-out}
[data-ai-icon] [data-anim=wave-late]{--a:ai-wave .9s .15s ease-in-out}
[data-ai-icon] [data-anim=shackle]{--a:ai-shackle .9s ease-in-out}
[data-ai-icon] [data-anim=quarter]{--a:ai-quarter .45s cubic-bezier(.3,1.4,.5,1)}
[data-ai-icon] [data-anim=draw]{--a:ai-draw .8s cubic-bezier(.6,0,.3,1);stroke-dasharray:1}
[data-ai-icon] [data-anim=wiggle]{--a:ai-wiggle .7s ease-in-out}
[data-ai-icon] [data-anim=float]{--a:ai-float 1.2s ease-in-out}
[data-ai-icon] [data-anim=shake]{--a:ai-shake .5s ease-in-out}
[data-ai-icon] [data-anim=launch]{--a:ai-launch 1.1s ease-in-out}
[data-ai-icon] [data-anim=tilt]{--a:ai-tilt .7s cubic-bezier(.3,1.4,.5,1);transform-origin:20% 90%}
[data-ai-icon] [data-anim=flash]{--a:ai-flash .8s ease-in-out}
[data-ai-icon] [data-anim=grow]{--a:ai-grow .7s cubic-bezier(.23,1,.32,1);transform-origin:50% 100%}
[data-ai-icon] [data-anim=nudge-back]{--a:ai-nudge-back .7s ease-in-out}
[data-ai-icon] [data-anim=slice]{--a:ai-slice .8s cubic-bezier(.3,1.4,.5,1)}
[data-ai-icon][data-trigger=loop] [data-anim]{animation:var(--a);animation-iteration-count:infinite}
[data-ai-icon][data-trigger=mount] [data-anim]{animation:var(--a)}
[data-ai-icon][data-trigger=hover]:hover [data-anim],
:is(button,a,label,summary,[role=button],[role=menuitem],[data-slot=button],[data-icon-trigger]):is(:hover,:focus-visible) [data-ai-icon][data-trigger=hover] [data-anim]{animation:var(--a)}
[data-ai-icon] [data-ring]{opacity:0}
[data-ai-icon][data-active] [data-ring]{animation:ai-ring 1.6s ease-out infinite}
[data-ai-icon] [data-swap]{transition:transform .35s cubic-bezier(.3,1.4,.5,1),opacity .2s ease}
[data-ai-icon] [data-swap=off]{opacity:1;transform:scale(1) rotate(0)}
[data-ai-icon] [data-swap=on]{opacity:0;transform:scale(.4) rotate(-60deg)}
[data-ai-icon][data-active] [data-swap=off]{opacity:0;transform:scale(.4) rotate(60deg)}
[data-ai-icon][data-active] [data-swap=on]{opacity:1;transform:scale(1) rotate(0)}
[data-ai-icon] [data-bar]{transition:transform .32s cubic-bezier(.3,1.3,.5,1),opacity .2s}
[data-ai-icon][data-active] [data-bar="0"]{transform:translateY(7px) rotate(45deg)}
[data-ai-icon][data-active] [data-bar="1"]{opacity:0;transform:scaleX(.2)}
[data-ai-icon][data-active] [data-bar="2"]{transform:translateY(-7px) rotate(-45deg)}
[data-ai-icon] [data-fill]{transition:fill .25s ease}
@keyframes ai-swing{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-11deg)}60%{transform:rotate(6deg)}80%{transform:rotate(-3deg)}}
@keyframes ai-clapper{0%,100%{transform:translateX(0)}20%{transform:translateX(2.5px)}40%{transform:translateX(-2px)}60%{transform:translateX(1px)}}
@keyframes ai-beat{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(.95)}45%{transform:scale(1.1)}}
@keyframes ai-pop{0%{transform:scale(1)}40%{transform:scale(.82)}100%{transform:scale(1)}}
@keyframes ai-scan{0%,100%{transform:translate(0,0)}25%{transform:translate(-1.5px,-1px)}50%{transform:translate(1px,-1.5px)}75%{transform:translate(1.5px,1px)}}
@keyframes ai-spin{to{transform:rotate(360deg)}}
@keyframes ai-fly{0%,100%{transform:translate(0,0);opacity:1}45%{transform:translate(6px,-6px);opacity:0}46%{transform:translate(-6px,6px);opacity:0}75%{transform:translate(0,0);opacity:1}}
@keyframes ai-drop{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
@keyframes ai-rise{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes ai-lift{0%,100%{transform:rotate(0) translateY(0)}35%,65%{transform:rotate(-16deg) translateY(-1.5px)}}
@keyframes ai-twinkle{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.7) rotate(25deg)}}
@keyframes ai-blink{0%,35%,65%,100%{transform:scaleY(1)}50%{transform:scaleY(.08)}}
@keyframes ai-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(3.5px)}}
@keyframes ai-wave{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes ai-shackle{0%,100%{transform:translateY(0)}35%,65%{transform:translateY(-2.5px)}}
@keyframes ai-quarter{to{transform:rotate(90deg)}}
@keyframes ai-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ai-wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(3deg)}}
@keyframes ai-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
@keyframes ai-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-2px)}40%,80%{transform:translateX(2px)}}
@keyframes ai-launch{0%,100%{transform:translate(0,0)}15%{transform:translate(-1px,1px)}45%{transform:translate(7px,-7px);opacity:0}46%{transform:translate(-5px,5px);opacity:0}75%{transform:translate(0,0);opacity:1}}
@keyframes ai-tilt{0%,100%{transform:rotate(0)}40%{transform:rotate(-14deg) scale(1.08)}}
@keyframes ai-grow{0%{transform:scaleY(1)}30%{transform:scaleY(.25)}100%{transform:scaleY(1)}}
@keyframes ai-nudge-back{0%,100%{transform:translateX(0)}50%{transform:translateX(-3.5px)}}
@keyframes ai-slice{0%,100%{transform:translate(0,0)}45%{transform:translate(1.8px,-1.8px)}}
@keyframes ai-flash{0%,100%{opacity:1;transform:scale(1)}30%{opacity:.25}60%{opacity:1;transform:scale(1.12)}}
@keyframes ai-ring{0%{opacity:.7;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@media (prefers-reduced-motion:reduce){[data-ai-icon] *{animation:none!important;transition-duration:.01ms!important}}
`

export type AnimatedIconProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  /** Edge length in pixels. */
  size?: number
  strokeWidth?: number
  /** When it plays. Default "hover". `animate` is the same as trigger="loop". */
  trigger?: IconTrigger
  animate?: boolean
  /** The second state of a two-state icon (copied, open, dark, recording, playing, liked). */
  active?: boolean
}

type Parts = Partial<Record<number, IconAnimation>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Frame({ size = 24, strokeWidth: _strokeWidth, trigger = "hover", animate, active, className, children, ...props }: AnimatedIconProps & { children: React.ReactNode }) {
  return (
    <>
      <style href="glaze-animated-icons" precedence="default">{css}</style>
      <svg
        data-ai-icon=""
        data-trigger={animate ? "loop" : trigger}
        data-active={active ? "" : undefined}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        color="currentColor"
        aria-hidden={props["aria-label"] ? undefined : true}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children}
      </svg>
    </>
  )
}

/** The elements of one Hugeicon, each with its own animation if it has one. */
function Elements({ icon, parts, whole, draw, strokeWidth, fill, delays }: { icon: IconData; parts?: Parts; whole?: IconAnimation; draw?: boolean; strokeWidth?: number; fill?: Partial<Record<number, string>>; delays?: Partial<Record<number, number>> }) {
  const nodes = icon.map(([tag, attrs], i) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key: _key, ...rest } = attrs as Record<string, string | number>
    const anim = draw && !whole ? "draw" : parts?.[i]
    return React.createElement(tag, {
      key: i,
      ...rest,
      ...(strokeWidth && "strokeWidth" in rest ? { strokeWidth } : null),
      ...(anim ? { "data-anim": anim } : null),
      ...(anim === "draw" ? { pathLength: 1 } : null),
      ...(fill?.[i] !== undefined ? { fill: fill[i], "data-fill": "" } : null),
      ...(delays?.[i] ? { style: { animationDelay: `${delays[i]}ms` } } : null),
    })
  })
  return whole ? <g data-anim={whole}>{nodes}</g> : <>{nodes}</>
}

/**
 * Animate any Hugeicon. `animation` moves the whole icon; `parts` moves single elements by
 * their index in the icon's data (look at the icon's source to find them).
 *
 *   <AnimatedIcon icon={Notification03Icon} animation="swing" />
 *   <AnimatedIcon icon={Delete02Icon} parts={{ 1: "lift" }} trigger="loop" />
 *   <AnimatedIcon icon={Tick02Icon} animation="draw" trigger="mount" />
 */
export function AnimatedIcon({ icon, animation, parts, strokeWidth, ...props }: AnimatedIconProps & { icon: IconData; animation?: IconAnimation; parts?: Parts }) {
  const draw = animation === "draw"
  return (
    <Frame strokeWidth={strokeWidth} {...props}>
      <Elements icon={icon} parts={parts} whole={draw ? undefined : animation} draw={draw} strokeWidth={strokeWidth} />
    </Frame>
  )
}

/** A tuned icon: the data and how each part of it moves. */
function tuned(icon: IconData, config: { whole?: IconAnimation; parts?: Parts; delays?: Partial<Record<number, number>> }) {
  const Icon = ({ strokeWidth, ...props }: AnimatedIconProps) => (
    <Frame strokeWidth={strokeWidth} {...props}>
      <Elements icon={icon} parts={config.parts} whole={config.whole} draw={config.whole === "draw"} strokeWidth={strokeWidth} delays={config.delays} />
    </Frame>
  )
  return Icon
}

export const BellIcon = tuned(Notification03Icon, { parts: { 0: "swing", 1: "swing", 2: "clapper" } })
export const SearchIcon = tuned(Search01Icon, { whole: "scan" })
export const SettingsIcon = tuned(Settings02Icon, { whole: "spin" })
export const SendIcon = tuned(SentIcon, { whole: "fly" })
export const DownloadIcon = tuned(Download04Icon, { parts: { 0: "drop" } })
export const UploadIcon = tuned(Upload04Icon, { parts: { 1: "rise" } })
export const TrashIcon = tuned(Delete02Icon, { parts: { 1: "lift" } })
export const RefreshIcon = tuned(RefreshData, { whole: "spin-once" })
export const SparklesIcon = tuned(SparklesData, { parts: { 0: "twinkle", 1: "twinkle-late" } })
export const AiMagicIcon = tuned(AiMagicData, { parts: { 0: "pop", 1: "twinkle" } })
export const EyeIcon = tuned(ViewIcon, { whole: "blink" })
export const ArrowRightIcon = tuned(ArrowRight02Icon, { whole: "nudge" })
export const VolumeIcon = tuned(VolumeHighIcon, { parts: { 1: "wave", 2: "wave-late" } })
export const LockIcon = tuned(SquareLock02Icon, { parts: { 1: "shackle" } })
export const PlusIcon = tuned(Add01Icon, { whole: "quarter" })
export const CheckIcon = tuned(Tick02Icon, { whole: "draw" })
export const CheckCircleIcon = tuned(CheckmarkCircle02Icon, { parts: { 0: "pop", 1: "draw" } })
export const LoaderIcon = tuned(Loading03Icon, { whole: "spin-always" })
export const RocketIcon = tuned(Rocket01Icon, { whole: "launch" })
export const MailIcon = tuned(Mail01Icon, { whole: "wiggle" })
export const AttachmentIcon = tuned(Attachment01Icon, { whole: "wiggle" })
export const HomeIcon = tuned(Home01Icon, { whole: "pop" })
export const CalendarIcon = tuned(Calendar03Icon, { parts: { 0: "float", 3: "flash" } })
export const GithubIcon = tuned(Github01Icon, { whole: "wiggle" })
export const ThumbsUpIcon = tuned(ThumbsUpData, { whole: "tilt" })
export const BookmarkIcon = tuned(Bookmark02Icon, { whole: "drop" })
export const LocationIcon = tuned(Location01Icon, { whole: "float" })
export const WifiIcon = tuned(Wifi01Icon, { whole: "flash" })
export const BrainIcon = tuned(BrainData, { whole: "beat" })
export const FlashIcon = tuned(FlashData, { whole: "flash" })
export const IdeaIcon = tuned(Idea01Icon, { whole: "flash" })
export const StarIcon = tuned(StarData, { whole: "spin-once" })
export const LinkIcon = tuned(Link01Icon, { whole: "wiggle" })

/* Daily use: the icons a dashboard reaches for. */
export const DashboardIcon = tuned(DashboardSquare01Icon, { parts: { 0: "pop", 1: "pop", 2: "pop", 3: "pop" }, delays: { 1: 60, 2: 120, 3: 180 } })
export const AnalyticsIcon = tuned(Analytics01Icon, { parts: { 0: "grow", 1: "grow", 2: "grow" }, delays: { 1: 80, 2: 160 } })
export const ChartIcon = tuned(ChartIncreaseIcon, { parts: { 1: "draw" } })
export const PieIcon = tuned(PieChartIcon, { parts: { 1: "slice" } })
export const ActivityIcon = tuned(Activity01Icon, { parts: { 1: "draw" } })
export const UsersIcon = tuned(UserGroupIcon, { parts: { 0: "float", 1: "float", 2: "float", 3: "float", 4: "float", 5: "float" }, delays: { 2: 120, 3: 120, 4: 120, 5: 120 } })
export const UserAddIcon = tuned(UserAdd01Icon, { parts: { 1: "quarter" } })
export const FolderIcon = tuned(Folder01Icon, { whole: "tilt" })
export const InboxIcon2 = tuned(InboxIcon, { parts: { 1: "drop" } })
export const FilterIcon = tuned(FilterHorizontalIcon, { parts: { 4: "nudge", 5: "nudge-back" } })
export const WalletIcon = tuned(Wallet01Icon, { parts: { 2: "nudge" } })
export const CardIcon = tuned(CreditCardIcon, { whole: "tilt" })
export const CartIcon = tuned(ShoppingCart01Icon, { whole: "nudge" })
export const LogoutIcon = tuned(Logout03Icon, { parts: { 1: "nudge" } })
export const ClockIcon = tuned(Clock01Icon, { parts: { 1: "spin" } })
export const EditIcon = tuned(PencilEdit02Icon, { parts: { 0: "wiggle" } })
export const InvoiceIcon = tuned(Invoice01Icon, { parts: { 1: "draw", 2: "draw" } })
export const ChecklistIcon = tuned(CheckListIcon, { parts: { 3: "draw", 4: "draw" } })
export const MessageIcon = tuned(Message01Icon, { whole: "pop" })
export const ShareIcon = tuned(Share08Icon, { whole: "pop" })
export const ArchiveIcon = tuned(Archive01Icon, { whole: "drop" })
export const CloudUploadIcon2 = tuned(CloudUploadIcon, { parts: { 1: "rise" } })
export const DatabaseIcon = tuned(Database01Icon, { parts: { 2: "flash", 4: "flash" }, delays: { 4: 150 } })
export const LayersIcon = tuned(Layers01Icon, { parts: { 0: "rise", 2: "drop" } })
export const GlobeIcon = tuned(Globe02Icon, { whole: "wiggle" })
export const TagIcon = tuned(Tag01Icon, { whole: "swing" })

/** Two states: `active` fills it. */
export const HeartIcon = ({ active, strokeWidth, ...props }: AnimatedIconProps) => (
  <Frame active={active} strokeWidth={strokeWidth} {...props}>
    <Elements icon={FavouriteIcon} whole="beat" strokeWidth={strokeWidth} fill={{ 0: active ? "currentColor" : "transparent" }} />
  </Frame>
)

/** Two states: set `active` once the text is on the clipboard. */
export const CopyIcon = ({ strokeWidth, ...props }: AnimatedIconProps) => (
  <Frame strokeWidth={strokeWidth} {...props}>
    <g data-swap="off"><Elements icon={Copy01Icon} whole="pop" strokeWidth={strokeWidth} /></g>
    <g data-swap="on"><Elements icon={Tick02Icon} strokeWidth={strokeWidth} /></g>
  </Frame>
)

/** Two states: set `active` while the menu is open. The bars fold into a cross. */
export const MenuIcon = ({ strokeWidth = 1.5, ...props }: AnimatedIconProps) => (
  <Frame strokeWidth={strokeWidth} {...props}>
    {Menu01Icon.map(([, attrs], i) => (
      <path key={i} data-bar={i} d={String(attrs.d)} stroke="currentColor" strokeLinecap="round" strokeWidth={strokeWidth} />
    ))}
  </Frame>
)

/** Two states: `active` is dark. */
export const ThemeIcon = ({ strokeWidth, ...props }: AnimatedIconProps) => (
  <Frame strokeWidth={strokeWidth} {...props}>
    <g data-swap="off"><Elements icon={Sun03Icon} parts={{ 1: "spin-once" }} strokeWidth={strokeWidth} /></g>
    <g data-swap="on"><Elements icon={Moon02Icon} whole="wiggle" strokeWidth={strokeWidth} /></g>
  </Frame>
)

/** Two states: `active` is playing (shows pause). */
export const PlayPauseIcon = ({ strokeWidth, ...props }: AnimatedIconProps) => (
  <Frame strokeWidth={strokeWidth} {...props}>
    <g data-swap="off"><Elements icon={PlayIcon} whole="pop" strokeWidth={strokeWidth} /></g>
    <g data-swap="on"><Elements icon={PauseIcon} whole="pop" strokeWidth={strokeWidth} /></g>
  </Frame>
)

/** Two states: `active` while recording, with rings going out from it. */
export const MicIcon = ({ strokeWidth, active, ...props }: AnimatedIconProps) => (
  <Frame active={active} strokeWidth={strokeWidth} {...props}>
    <circle data-ring="" cx="11.5" cy="9" r="9" stroke="currentColor" strokeWidth={1} />
    <circle data-ring="" cx="11.5" cy="9" r="9" stroke="currentColor" strokeWidth={1} style={{ animationDelay: ".8s" }} />
    <Elements icon={Mic01Icon} whole="pop" strokeWidth={strokeWidth} fill={{ 0: active ? "currentColor" : "transparent" }} />
  </Frame>
)

/** Every named icon, for pickers and galleries. */
export const dashboardIcons = {
  Dashboard: DashboardIcon,
  Analytics: AnalyticsIcon,
  Chart: ChartIcon,
  Pie: PieIcon,
  Activity: ActivityIcon,
  Users: UsersIcon,
  UserAdd: UserAddIcon,
  Folder: FolderIcon,
  Inbox: InboxIcon2,
  Filter: FilterIcon,
  Wallet: WalletIcon,
  Card: CardIcon,
  Cart: CartIcon,
  Logout: LogoutIcon,
  Clock: ClockIcon,
  Edit: EditIcon,
  Invoice: InvoiceIcon,
  Checklist: ChecklistIcon,
  Message: MessageIcon,
  Share: ShareIcon,
  Archive: ArchiveIcon,
  CloudUpload: CloudUploadIcon2,
  Database: DatabaseIcon,
  Layers: LayersIcon,
  Globe: GlobeIcon,
  Tag: TagIcon,
} as const

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
  AiMagic: AiMagicIcon,
  Brain: BrainIcon,
  Idea: IdeaIcon,
  Flash: FlashIcon,
  Eye: EyeIcon,
  ArrowRight: ArrowRightIcon,
  Volume: VolumeIcon,
  Lock: LockIcon,
  Plus: PlusIcon,
  Check: CheckIcon,
  CheckCircle: CheckCircleIcon,
  Loader: LoaderIcon,
  Rocket: RocketIcon,
  Mail: MailIcon,
  Attachment: AttachmentIcon,
  Home: HomeIcon,
  Calendar: CalendarIcon,
  Github: GithubIcon,
  ThumbsUp: ThumbsUpIcon,
  Bookmark: BookmarkIcon,
  Location: LocationIcon,
  Wifi: WifiIcon,
  Star: StarIcon,
  Link: LinkIcon,
  Copy: CopyIcon,
  Menu: MenuIcon,
  Theme: ThemeIcon,
  PlayPause: PlayPauseIcon,
  Mic: MicIcon,
} as const

/** The whole set in groups, for galleries: what a dashboard uses daily, then everything else. */
export const ICON_GROUPS = [
  { name: "Dashboard", icons: dashboardIcons },
  { name: "Actions and feedback", icons: animatedIcons },
] as const

export type AnimatedIconName = keyof typeof animatedIcons
export const TWO_STATE_ICONS: AnimatedIconName[] = ["Heart", "Copy", "Menu", "Theme", "PlayPause", "Mic"]
