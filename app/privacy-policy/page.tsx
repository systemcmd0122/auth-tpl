"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="relative min-h-screen p-4">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="outline" className="bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 backdrop-blur-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>
        
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                プライバシーポリシー
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">1. 収集する情報</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    当サービスでは、アカウント作成時に以下の情報を収集いたします：
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>メールアドレス</li>
                    <li>表示名（ユーザー名）</li>
                    <li>プロフィール画像（OAuth認証の場合）</li>
                    <li>認証プロバイダー情報（Google、GitHub等）</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">2. 情報の利用目的</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    収集した個人情報は、以下の目的で利用いたします：
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>アカウントの管理及び認証</li>
                    <li>サービスの提供及び運営</li>
                    <li>ユーザーサポート及びお問い合わせ対応</li>
                    <li>サービスの改善及び新機能の開発</li>
                    <li>重要な通知及び連絡</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">3. 情報の保護</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    当サービスでは、収集した個人情報を適切に保護するため、以下の対策を講じています：
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Firebase Authentication及びFirestoreによるセキュアなデータ保存</li>
                    <li>SSL/TLS暗号化による通信の保護</li>
                    <li>アクセス制御による不正アクセスの防止</li>
                    <li>定期的なセキュリティ監査の実施</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">4. 第三者への提供</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    当サービスでは、以下の場合を除き、収集した個人情報を第三者に提供することはありません：
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>ユーザーの明示的な同意がある場合</li>
                    <li>法令に基づく場合</li>
                    <li>人の生命、身体又は財産の保護のために必要がある場合</li>
                    <li>公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">5. アカウントの削除</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    ユーザーはいつでもアカウントを削除することができます。アカウント削除時には、関連するすべての個人情報がシステムから完全に削除されます。
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">6. Cookieの使用</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    当サービスでは、ユーザーエクスペリエンスの向上のため、以下の目的でCookieを使用しています：
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>ログイン状態の維持</li>
                    <li>ユーザー設定の保存</li>
                    <li>サービスの利用状況の分析</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">7. プライバシーポリシーの変更</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    当プライバシーポリシーは、法令の改正やサービス内容の変更等により、予告なく変更する場合があります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
                  </p>ジ
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">8. お問い合わせ</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    プライバシーポリシーに関するお問い合わせは、サービス内のお問い合わせフォームからご連絡ください。
                  </p>
                </section>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-500 text-center">
                    最終更新日: {new Date().toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
