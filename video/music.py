"""
Glaze launch video soundtrack: an original track, synthesized from scratch.

120 BPM, C major (C - G - Am - F), 28 seconds. Cut points in the video sit on bar lines:
0:00 sting, 0:02 groove drops, 0:24 the end card's final chord. Nothing is sampled.

    python3 video/music.py out.wav
"""
import sys

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48_000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 28.0
N = int(SR * LENGTH)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
send = np.zeros((2, N))  # reverb bus
duck = np.ones(N)  # sidechain from the kick


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


def pluck(f, dur=0.45, bright=1.0):
    t = env_t(dur)
    out = np.zeros_like(t)
    for k in range(1, 14):
        if f * k > 16_000:
            break
        out += (1 / k ** 1.4) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (6 + 4.5 * k / bright))
    attack = np.minimum(1, t / 0.002)
    return out * attack * 0.5


def bell(f, dur=1.6):
    t = env_t(dur)
    parts = [(1, 1.0, 2.2), (2.0, 0.45, 3.5), (2.76, 0.35, 4.5), (5.4, 0.18, 7), (8.93, 0.08, 10)]
    out = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in parts)
    return out * np.minimum(1, t / 0.003) * 0.32


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "low", fs=SR, output="sos"), x)


def highpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def pad(freqs, dur):
    t = env_t(dur)
    out = np.zeros_like(t)
    for f in freqs:
        for d in (-0.11, -0.04, 0.0, 0.05, 0.12):
            ph = rng.random()
            ff = f * 2 ** (d / 12)
            out += 2 * ((ff * t + ph) % 1) - 1  # saw
    out = lowpass(out, 1800, 2) / (len(freqs) * 5)
    env = np.minimum(1, t / 0.35) * np.minimum(1, (dur - t) / 0.4)
    return out * env


def kick():
    t = env_t(0.42)
    f = 46 + 90 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = bandpass(rng.standard_normal(len(t)), 2000, 6000) * np.exp(-t * 300) * 0.15
    return np.tanh((body + click) * 1.6) * 0.9


def clap():
    t = env_t(0.3)
    noise = rng.standard_normal(len(t))
    env = np.zeros_like(t)
    for off in (0.0, 0.011, 0.022):
        tt = np.clip(t - off, 0, None)
        env += (t >= off) * np.exp(-tt * (90 if off < 0.02 else 18))
    return bandpass(noise, 900, 3600) * env * 0.5


def hat(open_=False):
    t = env_t(0.25 if open_ else 0.06)
    return lowpass(highpass(rng.standard_normal(len(t)), 7000, 4), 12_000, 2) * np.exp(-t * (16 if open_ else 80)) * 0.11


def sub(f, dur):
    t = env_t(dur)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return np.tanh(s * 1.4) * np.minimum(1, t / 0.005) * np.minimum(1, (dur - t) / 0.03) * 0.38


def riser(dur):
    t = env_t(dur)
    noise = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    seg = int(0.05 * SR)
    for i in range(0, len(t), seg):  # stepped sweep of a band of noise
        c = 600 + (9000 - 600) * (i / len(t)) ** 2
        out[i : i + seg] = bandpass(noise[i : i + seg + 1000], c * 0.8, min(c * 1.25, 20_000))[: len(out[i : i + seg])]
    return out * (t / dur) ** 2 * 0.2


def crash():
    t = env_t(1.8)
    return lowpass(highpass(rng.standard_normal(len(t)), 4500, 2), 11_000, 2) * np.exp(-t * 2.4) * 0.07


CHORDS = [  # one bar each
    ("C", ["C4", "E4", "G4"], ["C5", "E5", "G5", "C6"], "C2"),
    ("G", ["B3", "D4", "G4"], ["B4", "D5", "G5", "B5"], "G1"),
    ("Am", ["C4", "E4", "A4"], ["A4", "C5", "E5", "A5"], "A1"),
    ("F", ["C4", "F4", "A4"], ["A4", "C5", "F5", "A5"], "F1"),
]
ARP = [0, 2, 1, 3, 2, 1, 0, 2, 1, 3, 2, 3, 1, 2, 0, 1]

# ---- 0:00 sting: a rising bell motif, a breath, then a riser into the drop ----------------
for t, n in [(0.0, "E5"), (0.12, "G5"), (0.24, "C6")]:
    place(bell(hz(n)), t, 0.9, pan=-0.2 + 0.2 * (n == "C6"), rev=0.6)
place(pad([hz("C4"), hz("E4"), hz("G4")], 1.1), 0.0, 0.5, rev=0.4)
place(riser(1.0), 1.0, 0.8, rev=0.2)

# ---- 0:02 - 0:24 groove ----------------------------------------------------------------
for bar in range(1, 12):  # bars 2..12 (0:02 to 0:24)
    t0 = bar * BAR
    name, padv, arpv, root = CHORDS[(bar - 1) % 4]
    full = bar >= 3
    place(pad([hz(n) for n in padv], BAR + 0.1), t0, 0.55 if full else 0.42, rev=0.5)
    for s in range(16):  # sixteenth-note arpeggio
        t = t0 + s * BEAT / 4
        n = arpv[ARP[s]]
        vel = 0.9 if s % 4 == 0 else 0.62
        place(pluck(hz(n), 0.38, 1.2), t, vel * (0.7 if full else 0.55), pan=-0.35 if s % 2 else 0.35, rev=0.35)
    for b in range(4):  # kick, bass, sidechain
        t = t0 + b * BEAT
        place(kick(), t, 0.95 if full else 0.75)
        i = int(t * SR)
        k = int(0.22 * SR)
        duck[i : i + k] = np.minimum(duck[i : i + k], 0.35 + 0.65 * (np.arange(k) / k) ** 0.6)
        for e in (0, 0.5):
            place(sub(hz(root), BEAT / 2 - 0.02), t + e * BEAT, 0.9 if e else 0.75)
    if full:
        for b in (1, 3):
            place(clap(), t0 + b * BEAT, 0.8, pan=0.05, rev=0.25)
    for h in range(16):
        t = t0 + h * BEAT / 4
        open_ = h % 4 == 2
        place(hat(open_), t, (0.9 if open_ else 0.55) * (1 if full else 0.6), pan=0.25)
    if bar in (5, 9):  # counter-melody bells on the second pass
        for k_, n in enumerate(["G5", "E5", "D5", "E5", "C6", "B5", "G5", "A5"]):
            place(bell(hz(n), 1.0), t0 + k_ * BEAT / 2, 0.45, pan=-0.4, rev=0.6)

place(crash(), 2.0, 1.0, pan=0.1, rev=0.3)
place(riser(1.0), 23.0, 0.7, rev=0.2)

# ---- 0:24 end card: one held chord, the motif again, a long tail ------------------------
place(crash(), 24.0, 1.2, rev=0.4)
place(kick(), 24.0, 1.0)
place(sub(hz("C2"), 2.5), 24.0, 1.0)
place(pad([hz("C4"), hz("E4"), hz("G4"), hz("C5")], 3.9), 24.0, 0.75, rev=0.7)
for t, n in [(24.0, "C5"), (24.12, "E5"), (24.24, "G5"), (24.5, "C6")]:
    place(bell(hz(n), 2.6), t, 0.85, pan=0.15 if n == "C6" else -0.1, rev=0.8)

# ---- mix --------------------------------------------------------------------------------
L *= duck
R *= duck


def impulse(seed):
    r = np.random.default_rng(seed)
    t = env_t(1.6)
    return r.standard_normal(len(t)) * np.exp(-t * 3.2) * 0.04


wetL = fftconvolve(lowpass(send[0], 7000), impulse(1))[:N]
wetR = fftconvolve(lowpass(send[1], 7000), impulse(2))[:N]
L += wetL
R += wetR

mix = np.stack([L, R])
mix = lowpass(highpass(mix, 28), 15_000, 2)
fade = np.ones(N)
tail = int(0.6 * SR)
fade[-tail:] = np.linspace(1, 0, tail) ** 2
mix *= fade
# Level to about -16 dBFS RMS, then catch the peaks softly below -1 dBFS.
mix *= 10 ** (-16 / 20) / np.sqrt(np.mean(mix ** 2))
ceiling = 10 ** (-1.0 / 20)
mix = ceiling * np.tanh(mix / ceiling)

out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
pcm = (mix.T * 32767).astype(np.int16)
import wave

with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
rms = 20 * np.log10(np.sqrt(np.mean(mix ** 2)))
print(f"wrote {out}: {LENGTH}s, RMS {rms:.1f} dBFS")
