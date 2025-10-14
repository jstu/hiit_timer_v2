export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private volume = 0.7;
  private enabled = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      endSound1: '/audio/end-sound1.mp3',
      endSound2: '/audio/end-sound2.mp3', 
      endSound3: '/audio/end-sound3.mp3',
      anticipation: '/audio/select_denied.mp3',
      halfway: '/audio/ding_arcade.mp3',
      thirtySecond: '/audio/fog_horn.mp3',
      jump: '/audio/mario.mp3'
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(key, audio);
    });
  }

  playSound(soundName: string, customVolume?: number) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume = customVolume ?? this.volume;
      sound.currentTime = 0;
      sound.play().catch(e => console.warn('Audio play failed:', e));
    }
  }

  getEndSound(round: number): string {
    if (round % 3 === 0) return 'endSound3';
    if (round % 2 === 0) return 'endSound2';
    return 'endSound1';
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}