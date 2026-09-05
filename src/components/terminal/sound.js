// Web Audio API Synthesizer for Terminal Sound Effects

class SoundFX {
  constructor() {
    this.enabled = true
    this.audioCtx = null
    this.setupUnlockListeners()
  }

  setupUnlockListeners() {
    if (typeof window === 'undefined') return

    const unlock = () => {
      this.unlockAudio()
    }

    window.addEventListener('click', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('pointerdown', unlock, { passive: true })
  }

  unlockAudio() {
    try {
      const ctx = this.getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
    } catch {
      // Ignore
    }
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

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      return
    }

    try {
      const now = ctx.currentTime

      // 1. High-frequency tactile "click" transient
      const clickOsc = ctx.createOscillator()
      const clickGain = ctx.createGain()

      const freq = 1800 + Math.random() * 500
      clickOsc.type = 'triangle'
      clickOsc.frequency.setValueAtTime(freq, now)
      clickOsc.frequency.exponentialRampToValueAtTime(350, now + 0.02)

      clickGain.gain.setValueAtTime(0.2, now)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

      clickOsc.connect(clickGain)
      clickGain.connect(ctx.destination)

      clickOsc.start(now)
      clickOsc.stop(now + 0.03)

      // 2. Low-mid mechanical switch "thump"
      const thudOsc = ctx.createOscillator()
      const thudGain = ctx.createGain()

      thudOsc.type = 'sine'
      thudOsc.frequency.setValueAtTime(280 + Math.random() * 80, now)
      thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.035)

      thudGain.gain.setValueAtTime(0.12, now)
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      thudOsc.connect(thudGain)
      thudGain.connect(ctx.destination)

      thudOsc.start(now)
      thudOsc.stop(now + 0.045)
    } catch {
      // Ignore audio errors gracefully
    }
  }

  playEnter() {
    if (!this.enabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      return
    }

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
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
