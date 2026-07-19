/*
 * Copyright (c) 2026 Riadh MNASRI. All rights reserved.
 *
 * Seeds React state from a synchronous browser API (localStorage, media
 * queries, ...) without a hydration mismatch: SSR and the first client
 * render both use `fallback`, then a single render-time reset applies the
 * real value right after hydration commits. See "Storing information
 * from previous renders": https://react.dev/reference/react/useState#storing-information-from-previous-renders
 */

import { useState, useSyncExternalStore, type Dispatch, type SetStateAction } from "react";

function noopSubscribe(): () => void {
  return () => {};
}

export function useHydratedState<T>(
  getSnapshot: () => T,
  fallback: T
): [T, Dispatch<SetStateAction<T>>] {
  const persisted = useSyncExternalStore(noopSubscribe, getSnapshot, () => fallback);
  const [prevPersisted, setPrevPersisted] = useState(persisted);
  const [value, setValue] = useState(persisted);

  if (persisted !== prevPersisted) {
    setPrevPersisted(persisted);
    setValue(persisted);
  }

  return [value, setValue];
}
