// MusicToggle.jsx
import { Howl } from "howler";
import musicFile from "/snow.wav"; // adjust the path

// Keep everything inside this module (singleton pattern)
let sound;
let isPlaying = false;

export default function toggleMusic() {
    // Clear existing Howl instance (forces reload of settings)
    if (sound) {
        sound.stop();
        sound.unload();
        sound = null;
  }
  // Create Howl instance once
    if (!sound) {
        sound = new Howl({
        src: [musicFile],
        loop: true,
        volume: 0.2, // initial
  });
    } else {
        sound.volume(0.2); // ensure current instance uses new volume
    }

  if (isPlaying) {
    // Optional: smooth fade-out
    sound.fade(1, 0, 800); // from 1 → 0 volume over 0.8s
    setTimeout(() => sound.pause(), 800);
  } else {
    sound.play();
    // Optional: smooth fade-in
    sound.volume(0);
    sound.fade(0, 1, 800);
  }

  isPlaying = !isPlaying;
  console.log(isPlaying ? "🎵 music on" : "🔇 music off");
}
