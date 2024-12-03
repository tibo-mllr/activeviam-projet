"use client";

import { makeStore, AppStore } from "@/lib/redux";
import { ReactElement, useRef } from "react";
import { Provider } from "react-redux";

export function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
