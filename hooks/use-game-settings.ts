"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSettingsSnapshot,
  getSettingsSnapshot,
  subscribeSettings,
} from "@/lib/client-store";

export function useGameSettings() {
  return useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot,
  );
}
