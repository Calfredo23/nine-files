"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerSoundSnapshot,
  getSoundSnapshot,
  subscribeSound,
  writeSound,
} from "@/lib/client-store";
import { sound } from "@/lib/sound";

export function useSoundPreference() {
  const on = useSyncExternalStore(
    subscribeSound,
    getSoundSnapshot,
    getServerSoundSnapshot,
  );

  const toggle = useCallback(() => {
    const next = !getSoundSnapshot();
    writeSound(next);
    sound.setMuted(!next);
    if (next) {
      sound.play("click");
    }
  }, []);

  return { on, toggle };
}
