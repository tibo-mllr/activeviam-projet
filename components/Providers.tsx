"use client";

import { makeStore, AppStore } from "@/lib/redux";
import { createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { ReactElement, useRef } from "react";
import { Provider } from "react-redux";

const theme = createTheme({
  colorSchemes: {
    dark: { palette: { secondary: { main: "#FFB84D", dark: "#FFA85D" } } },
    light: { palette: { secondary: { main: "#FFB84D", dark: "#FFA04D" } } },
  },
});

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Provider store={storeRef.current}>{children}</Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
