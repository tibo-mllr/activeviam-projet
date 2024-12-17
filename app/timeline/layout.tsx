import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Query Plan timeline",
};

export default function TimelineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return <>{children}</>;
}
