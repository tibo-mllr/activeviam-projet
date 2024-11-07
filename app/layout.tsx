import type { Metadata } from "next";
import "./globals.css";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Find a title",
  description: "Find a description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return (
    <html lang="en">
      <body> {children} </body>
    </html>
  );
}
