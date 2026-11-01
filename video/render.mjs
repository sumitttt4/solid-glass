/**
 * Render the Glaze launch video.
 *
 *   npm run dev                         # serves /dev/launch on :5191
 *   python3 video/music.py music.wav    # the soundtrack
 *   node video/render.mjs out.mp4 music.wav [from] [to]
 *
 * Steps the page through every frame (window.__setFrame), screenshots it, and pipes the frames
 * straight into ffmpeg: nothing is written to disk but the video. Needs Playwright's Chromium
 * and ffmpeg on the PATH.
 */
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
const { chromium } = createRequire(import.meta.url)("playwright")

const [out = "glaze-launch.mp4", music, fromArg, toArg] = process.argv.slice(2)
const FPS = 30
const from = Number(fromArg ?? 0)
const to = Number(toArg ?? 28 * FPS)
const url = process.env.LAUNCH_URL ?? "http://localhost:5191/dev/launch?theme=light&material=solid"

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--force-color-profile=srgb"] })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: "load" })
await page.waitForFunction(() => window.__launchReady === true && typeof window.__setFrame === "function", null, { timeout: 60_000 })
await page.waitForTimeout(1500) // shaders compile

const args = ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-"]
if (music) args.push("-ss", String(from / FPS), "-i", music)
args.push("-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart")
if (music) args.push("-c:a", "aac", "-b:a", "256k", "-shortest")
args.push(out)
const ffmpeg = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] })

const started = Date.now()
for (let f = from; f < to; f++) {
  await page.evaluate((n) => window.__setFrame(n), f)
  const frame = await page.screenshot({ type: "jpeg", quality: 96 })
  if (!ffmpeg.stdin.write(frame)) await new Promise((r) => ffmpeg.stdin.once("drain", r))
  if (f % 60 === 0) console.log(`frame ${f}/${to} · ${((Date.now() - started) / 1000).toFixed(0)}s`)
}
ffmpeg.stdin.end()
await new Promise((r) => ffmpeg.on("close", r))
await browser.close()
console.log(`wrote ${out}`)
