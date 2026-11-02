"""
Glaze launch video soundtrack: an original cinematic cue, synthesized from scratch.

Trailer grammar, 120 BPM in A minor (Am - F - C - G, a bar each), 28 seconds. The hits sit on
the video's cuts:

  0:00  a low drone breathes in, a clock ticks, two piano notes, a reverse swell
  0:02  BRAAM: a distorted low brass stack and a sub boom; a staccato string ostinato starts
  0:06  0:08  small impacts on the cuts; taiko on the downbeats
  0:12  an impact, and the ostinato doubles to sixteenths an octave up; strings climb
  0:16  a second braam; the taiko pattern fills in
  0:22  a tom roll and a riser ... then a moment of silence
  0:24  the last braam on the logo, a held chord, piano, a long tail

Nothing is sampled.

    python3 video/music.py out.wav
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48_000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 28.0
N = int(SR * LENGTH)
rng = np.random.default_rng(11)

L = np.zeros(N)
R = np.zeros(N)
send = np.zeros((2, N))  # reverb bus


def hz(note: str) -> float:
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    name, octave = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[name] + 12 * (octave + 1) - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0, rev=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i : i + len(sig)] += sig * lg
    R[i : i + len(sig)] += sig * rg
    if rev:
        send[0, i : i + len(sig)] += sig * lg * rev
        send[1, i : i + len(sig)] += sig * rg * rev


def env_t(dur):
    return np.arange(int(dur * SR)) / SR


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "low", fs=SR, output="sos"), x)


def highpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def saw(f, t, ph=0.0):
    return 2 * ((f * t + ph) % 1) - 1


def swept_lowpass(x, cut):
    """Lowpass whose cutoff follows the curve `cut` (Hz, one value a sample), in short blocks."""
    out = np.zeros_like(x)
    seg = 512
    for i in range(0, len(x), seg):
        c = float(np.clip(cut[i], 40, 20_000))
        lo = max(0, i - 4096)
        out[i : i + seg] = lowpass(x[lo : i + seg], c)[-len(out[i : i + seg]) :]
    return out


# ---- instruments -----------------------------------------------------------------------------

def strings(freqs, dur, attack=0.6, bright=2600):
    """A string section held: detuned saws, a slow bow in, a slow release, a little vibrato."""
    t = env_t(dur)
    out = np.zeros_like(t)
    for f in freqs:
        for d in (-0.09, -0.03, 0.02, 0.08):
            vib = 1 + 0.003 * np.sin(2 * np.pi * (4.8 + rng.random()) * t + rng.random() * 6)
            ph = np.cumsum(f * 2 ** (d / 12) * vib) / SR + rng.random()
            out += 2 * (ph % 1) - 1
    out = lowpass(out, bright, 2) / (len(freqs) * 4)
    env = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / 0.8)
    return out * env


def staccato(f, dur=0.16):
    """One short bowed note of the ostinato."""
    t = env_t(dur)
    out = sum(saw(f * 2 ** (d / 12), t, rng.random()) for d in (-0.07, 0.0, 0.06)) / 3
    out = lowpass(out, 2400, 2) + 0.3 * np.sin(2 * np.pi * f * t)
    return out * np.minimum(1, t / 0.006) * np.exp(-t * 16) * 0.5


def braam(freqs, dur=3.6):
    """The trailer horn: a low saw stack driven hard, its filter blooming open then closing."""
    t = env_t(dur)
    raw = np.zeros_like(t)
    for f in freqs:
        for d in (-0.12, -0.05, 0.0, 0.06, 0.13):
            raw += saw(f * 2 ** (d / 12), t, rng.random())
    raw /= len(freqs) * 5
    cut = 180 + 1700 * (1 - np.exp(-t * 14)) * np.exp(-t * 1.1)
    out = np.tanh(swept_lowpass(raw, cut) * 4.5)
    env = np.minimum(1, t / 0.035) * np.exp(-t * 0.75) * np.minimum(1, (dur - t) / 0.5)
    return out * env * 0.55


def boom(dur=2.4):
    """A sub drop: a sine falling from 110 Hz to 34, with a felt thump at the front."""
    t = env_t(dur)
    f = 34 + 76 * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.7)
    thump = lowpass(rng.standard_normal(len(t)), 260, 2) * np.exp(-t * 28) * 0.9
    return np.tanh((body + thump) * 1.8) * 0.9


def taiko(pitch=1.0, dur=1.1):
    t = env_t(dur)
    f = (62 + 70 * np.exp(-t * 24)) * pitch
    skin = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5)
    slap = bandpass(rng.standard_normal(len(t)), 200, 1800) * np.exp(-t * 45) * 0.6
    return np.tanh((skin + slap) * 1.6) * 0.75


def tick(dur=0.04):
    t = env_t(dur)
    return bandpass(rng.standard_normal(len(t)), 3500, 9000) * np.exp(-t * 160) * 0.22


def piano(f, dur=3.0):
    """A soft felt piano: slightly stretched partials, the higher ones dying first."""
    t = env_t(dur)
    out = np.zeros_like(t)
    for k in range(1, 9):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > 15_000:
            break
        out += (0.7 ** k) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.1 + 0.9 * k))
    hammer = lowpass(rng.standard_normal(len(t)), 2200) * np.exp(-t * 90) * 0.04
    return (out + hammer) * np.minimum(1, t / 0.004) * 0.42


def drone(freqs, dur):
    t = env_t(dur)
    out = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) + 0.4 * saw(f * 1.003, t) for f in freqs)
    out = lowpass(out, 420, 2) / len(freqs)
    breath = 0.75 + 0.25 * np.sin(2 * np.pi * 0.35 * t - np.pi / 2)
    return out * breath * np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 0.6) * 0.5


def swell(dur, lo=300, hi=7000):
    """A reverse-cymbal swell: noise brightening and growing, cut dead at the end."""
    t = env_t(dur)
    noise = rng.standard_normal(len(t))
    cut = lo + (hi - lo) * (t / dur) ** 2
    out = swept_lowpass(highpass(noise, 150), cut)
    return out * (t / dur) ** 3 * 0.35


def riser(dur):
    """A rising tone and noise together, stuttering in its last half like a trailer riser."""
    t = env_t(dur)
    f = 180 * 2 ** (3.2 * t / dur)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    noise = swept_lowpass(rng.standard_normal(len(t)), 400 + 9000 * (t / dur) ** 2)
    gate = np.where((t > dur / 2) & ((t * 16) % 1 > 0.55), 0.35, 1.0)
    return (tone * 0.25 + noise * 0.4) * (t / dur) ** 2.2 * gate * 0.5


def hit(dur=2.2):
    """An impact for a cut: a boom, a taiko, and a burst of bright noise with a long tail."""
    t = env_t(dur)
    out = highpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 7) * 0.12
    b = boom(dur) * 0.8
    k = taiko(0.85, min(dur, 1.1))
    out[: len(b)] += b
    out[: len(k)] += k * 0.8
    return out


# ---- the score -------------------------------------------------------------------------------

CHORDS = [  # a bar each: string voicing, ostinato notes
    (["A3", "C4", "E4"], ["A2", "A2", "E3", "A2", "C3", "A2", "E3", "G3"]),
    (["A3", "C4", "F4"], ["F2", "F2", "C3", "F2", "A2", "F2", "C3", "E3"]),
    (["G3", "C4", "E4"], ["C3", "C3", "G3", "C3", "E3", "C3", "G3", "B3"]),
    (["G3", "B3", "D4"], ["G2", "G2", "D3", "G2", "B2", "G2", "D3", "F3"]),
]
LINE = [["E5", "C5", "D5", "E5"], ["F5", "E5", "C5", "A4"], ["G5", "E5", "D5", "C5"], ["B4", "D5", "G5", "B5"]]
BRAAM = [hz("A1"), hz("E2"), hz("A2"), hz("C3")]

# 0:00 - 0:02  breath in
place(drone([hz("A1"), hz("E2")], 3.0), 0.0, 0.9, rev=0.3)
for i in range(8):
    place(tick(), i * BEAT / 2, 0.5 + 0.06 * i, pan=0.3, rev=0.25)
place(piano(hz("A4"), 3.0), 0.05, 0.7, pan=-0.15, rev=0.7)
place(piano(hz("E5"), 3.0), 1.0, 0.6, pan=0.15, rev=0.7)
place(swell(1.0), 1.0, 1.2, rev=0.1)

# 0:02 - 0:24  the cue
for bar in range(1, 12):  # bars 2..12 (0:02 to 0:24), two seconds each
    t0 = bar * BAR
    voicing, ost = CHORDS[(bar - 1) % 4]
    act2 = bar >= 6  # from 0:12
    climb = 2 if bar >= 8 else 1  # strings move up an octave from 0:16
    place(strings([hz(n) * climb for n in voicing], BAR + 0.9, attack=0.5 if act2 else 0.9), t0, 0.55 if act2 else 0.42, rev=0.55)
    place(strings([hz(ost[0]) / 2, hz(ost[0])], BAR + 0.6, attack=0.2, bright=900), t0, 0.5, rev=0.3)  # celli and basses

    # the ostinato: eighths first, sixteenths an octave up from 0:12
    steps = 16 if act2 else 8
    for s in range(steps):
        n = hz(ost[s % 8]) * (2 if act2 else 1)
        accent = 1.0 if s % (4 if act2 else 2) == 0 else 0.7
        place(staccato(n), t0 + s * BAR / steps, accent * (0.75 if act2 else 0.65), pan=-0.25 if s % 2 else 0.25, rev=0.2)

    # taiko: the downbeat, then the pattern fills in
    place(taiko(), t0, 0.9, rev=0.35)
    if bar >= 3:
        place(taiko(1.25), t0 + 2.5 * BEAT, 0.55, pan=0.2, rev=0.3)
    if act2:
        for b in (1, 1.5, 3, 3.5, 3.75):
            place(taiko(1.4 if b % 1 else 1.15), t0 + b * BEAT, 0.5, pan=-0.2 if b % 1 else 0.15, rev=0.3)
        for h in range(16):
            place(tick(), t0 + h * BEAT / 4, 0.45 if h % 2 else 0.7, pan=0.35)

    # a piano line on top, a note a beat, from 0:06 to 0:22
    if 3 <= bar <= 10:
        for b, n in enumerate(LINE[(bar - 1) % 4]):
            place(piano(hz(n), 2.0), t0 + b * BEAT, 0.42, pan=0.1, rev=0.7)

# the hits on the cuts
place(braam(BRAAM, 3.8), 2.0, 1.0, rev=0.35)
place(boom(), 2.0, 1.0, rev=0.2)
place(swell(0.5), 5.5, 0.9)
place(hit(), 6.0, 0.7, rev=0.4)
place(hit(), 8.0, 0.75, rev=0.4)
place(swell(1.0), 11.0, 1.2)
place(hit(), 12.0, 1.0, rev=0.45)
place(swell(1.0), 15.0, 1.2)
place(braam([hz("F1"), hz("C2"), hz("F2"), hz("A2")], 3.0), 16.0, 0.85, rev=0.35)
place(boom(), 16.0, 0.9)
place(hit(), 18.0, 0.8, rev=0.4)

# 0:22 - 0:24  roll, rise, and a held breath
for i in range(12):
    place(taiko(1.1 + 0.03 * i, 0.5), 22.0 + i * BEAT / 4, 0.45 + 0.04 * i, pan=(-0.3, 0.3)[i % 2], rev=0.3)
place(riser(1.75), 21.75, 1.4, rev=0.2)

# Silence just before the logo lands: the dry sound stops for the last quarter second (the hall rings on).
gap = slice(int(23.72 * SR), int(24.0 * SR))
for ch in (L, R):
    ch[gap] *= np.linspace(1, 0, gap.stop - gap.start) ** 3

# 0:24 end card: the last braam, a held A minor (add9), piano, the tail
place(braam(BRAAM, 4.0), 24.0, 1.1, rev=0.45)
place(boom(3.5), 24.0, 1.1, rev=0.3)
place(taiko(0.8), 24.0, 1.0, rev=0.5)
place(strings([hz("A3"), hz("C4"), hz("E4"), hz("B4"), hz("A4")], 4.0, attack=0.08), 24.0, 0.65, rev=0.8)
for t, n in [(24.0, "A5"), (24.5, "E5"), (25.0, "B5"), (25.5, "C6")]:
    place(piano(hz(n), 2.6), t, 0.55, pan=0.1, rev=0.85)

# ---- mix --------------------------------------------------------------------------------------


def impulse(seed, dur=3.6):
    """A large hall: dense noise, a slow decay, darker as it goes."""
    r = np.random.default_rng(seed)
    t = env_t(dur)
    ir = r.standard_normal(len(t)) * np.exp(-t * 1.9)
    return swept_lowpass(ir, 9000 * np.exp(-t * 1.2) + 600) * 0.03


wetL = fftconvolve(highpass(send[0], 180), impulse(1))[:N]
wetR = fftconvolve(highpass(send[1], 180), impulse(2))[:N]
L += wetL
R += wetR

mix = np.stack([L, R])
mix = lowpass(highpass(mix, 25), 17_000, 2)
fade = np.ones(N)
tail = int(1.2 * SR)
fade[-tail:] = np.linspace(1, 0, tail) ** 2
mix *= fade
# Level to about -14 dBFS RMS (a cinema cue breathes more than pop), then catch peaks below -1 dBFS.
mix *= 10 ** (-14 / 20) / np.sqrt(np.mean(mix ** 2))
ceiling = 10 ** (-1.0 / 20)
mix = ceiling * np.tanh(mix / ceiling)

out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
pcm = (mix.T * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
rms = 20 * np.log10(np.sqrt(np.mean(mix ** 2)))
print(f"wrote {out}: {LENGTH}s, RMS {rms:.1f} dBFS")
