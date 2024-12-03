import type { Metadata } from "next";
import type { ReactElement } from "react";
import StoreProvider from "../StoreProvider";

export const metadata: Metadata = {
  title: "Submit query",
};

export default function QueryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return <StoreProvider>{children}</StoreProvider>;
}
