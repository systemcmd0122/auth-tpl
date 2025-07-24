import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プロフィール設定",
  description: "アカウント情報の管理とセキュリティ設定。プロフィール編集、パスワード変更、アカウント削除などが行えます。",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
