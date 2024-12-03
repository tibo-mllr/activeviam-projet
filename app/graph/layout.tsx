import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Query graph",
};

export default function GraphLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return <>{children}</>;
}
