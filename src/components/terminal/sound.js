// Web Audio API Synthesizer for Terminal Sound Effects

class SoundFX {
  constructor() {
    this.enabled = true
    this.audioCtx = null
  }

  getAudioContext() {
    if (!this.enabled) return null
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
          this.audioCtx = new AudioContext()
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {})
      }
      return this.audioCtx
    } catch {
      return null
    }
  }

  playTyping() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(450 + Math.random() * 150, ctx.currentTime)

      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // Ignore audio errors gracefully
    }
  }

  playEnter() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // Ignore
    }
  }

  playBoot() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const freqs = [261.63, 329.63, 392.0, 523.25] // C E G C
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09)

        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.09)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + idx * 0.09)
        osc.stop(ctx.currentTime + idx * 0.09 + 0.25)
      })
    } catch {
      // Ignore
    }
  }

  playNotification() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.07)

      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.18)
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundFX()
