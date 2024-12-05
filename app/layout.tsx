import { Header, Providers } from "@/components";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import "./globals.css";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Query plan visualizer",
    default: "Query plan visualizer",
  },
  description: "Send and visualize MDX query plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
              }}
            >
              {children}
            </Box>
          </main>
        </Providers>
      </body>
    </html>
  );
}
