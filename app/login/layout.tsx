import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ログイン",
  description: "auth-tplにログイン",
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
