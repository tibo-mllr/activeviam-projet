import { Header, Providers } from "@/components";
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
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
