# Launch video

The Glaze launch film: 28 seconds, 1920×1080, 30 fps, with an original soundtrack.

- `src/pages/dev-launch.tsx` draws the film. Every pixel is a function of the frame number, so
  any frame renders the same every time (open `/dev/launch?f=300` in `npm run dev` to see one).
- `music.py` synthesizes the soundtrack from scratch: 120 BPM, C major, cuts on bar lines.
  Nothing is sampled, so there is nothing to license.
- `render.mjs` steps the page through every frame with Playwright, pipes the screenshots into
  ffmpeg, and muxes in the music.

```bash
npm run dev                                  # serves /dev/launch
python3 video/music.py music.wav             # needs numpy and scipy
node video/render.mjs glaze-launch.mp4 music.wav
```

| Time | Scene |
| --- | --- |
| 0:00 | The mark lands, light runs across it, the wordmark slides out |
| 0:02 | Beautiful components, Solid or Glass |
| 0:06 | Buttons that feel right: a press, then a toast |
| 0:08 | AI that listens: voice orb, waveform, live transcript |
| 0:12 | Chats that stream |
| 0:16 | Icons that move |
| 0:18 | Four finishes, one attribute |
| 0:22 | `npx shadcn add glaze`, free and open source |
| 0:24 | End card: glazeui.xyz |
