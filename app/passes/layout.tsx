import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Longest passes",
};

export default function QueryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return <>{children}</>;
}
