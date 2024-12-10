import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Summary",
};

export default function SummaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return <>{children}</>;
}
