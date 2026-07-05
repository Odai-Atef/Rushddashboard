/**
 * Notification Sound Utility
 *
 * Plays audio alerts for high-priority notifications.
 * Uses the Web Audio API for better control and to avoid
 * autoplay restrictions.
 */

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create audio context on first user interaction
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch {
      console.warn('[NotificationSound] Web Audio API not supported');
    }
  }

  /**
   * Play a short beep sound using Web Audio API
   * This avoids autoplay restrictions since it's synthesized
   */
  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch {
      // Silently fail if audio can't play
    }
  }

  /**
   * Play sound for URGENT priority (double beep, high pitch)
   */
  async playUrgent(): Promise<void> {
    await this.ensureInitialized();
    if (!this.audioContext) return;

    await this.playTone(880, 0.15, 'square');
    setTimeout(() => this.playTone(880, 0.15, 'square'), 200);
    setTimeout(() => this.playTone(1100, 0.3, 'square'), 400);
  }

  /**
   * Play sound for HIGH priority (single beep)
   */
  async playHigh(): Promise<void> {
    await this.ensureInitialized();
    if (!this.audioContext) return;

    await this.playTone(660, 0.2, 'sine');
  }

  /**
   * Play sound for MEDIUM priority (soft beep)
   */
  async playMedium(): Promise<void> {
    await this.ensureInitialized();
    if (!this.audioContext) return;

    await this.playTone(440, 0.15, 'sine');
  }

  /**
   * Play sound for LOW priority (no sound)
   */
  async playLow(): Promise<void> {
    // No sound for low priority
  }

  /**
   * Play sound based on priority level
   */
  async play(priority: string): Promise<void> {
    switch (priority) {
      case 'URGENT':
        return this.playUrgent();
      case 'HIGH':
        return this.playHigh();
      case 'MEDIUM':
        return this.playMedium();
      case 'LOW':
      default:
        return this.playLow();
    }
  }
}

export const notificationSound = new NotificationSound();
