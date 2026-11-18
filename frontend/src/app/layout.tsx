import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product launch | Kanban",
  description: "A simple product launch kanban board",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
