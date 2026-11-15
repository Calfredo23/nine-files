"use client";

import { useSyncExternalStore } from "react";
import {
  getDetectiveNameSnapshot,
  getServerDetectiveNameSnapshot,
  subscribeDetectiveName,
} from "@/lib/client-store";

export function useDetectiveName(): string {
  return useSyncExternalStore(
    subscribeDetectiveName,
    getDetectiveNameSnapshot,
    getServerDetectiveNameSnapshot,
  );
}
