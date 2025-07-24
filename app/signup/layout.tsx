import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "アカウント作成",
  description: "auth-tplのアカウントを作成",
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
