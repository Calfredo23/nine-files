"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getMusicSnapshot,
  getServerMusicSnapshot,
  subscribeMusic,
  writeMusic,
} from "@/lib/client-store";
import { sound } from "@/lib/sound";

export function useMusicPreference() {
  const on = useSyncExternalStore(
    subscribeMusic,
    getMusicSnapshot,
    getServerMusicSnapshot,
  );

  useEffect(() => {
    sound.setMusicOn(on);

    if (!on) {
      return;
    }

    const unlock = () => {
      sound.unlock();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [on]);

  const toggle = useCallback(() => {
    const next = !getMusicSnapshot();
    writeMusic(next);
    sound.setMusicOn(next);
    if (next) {
      sound.unlock();
    }
  }, []);

  return { on, toggle };
}
