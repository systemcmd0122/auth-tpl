"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, ExternalLink } from "lucide-react"
import Link from "next/link"

interface PrivacyConsentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  loading?: boolean
}

export function PrivacyConsentDialog({
  open,
  onOpenChange,
  onAccept,
  loading = false,
}: PrivacyConsentDialogProps) {
  const [agreed, setAgreed] = useState(false)

  const handleAccept = () => {
    if (agreed) {
      onAccept()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl animate-pulse"></div>
              <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            プライバシーポリシーへの同意
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
            アカウント作成には、プライバシーポリシーへの同意が必要です
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] w-full border rounded-md p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">収集する情報</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                当サービスでは、アカウント作成時にメールアドレス、表示名、プロフィール画像（OAuth認証の場合）、認証プロバイダー情報を収集いたします。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">利用目的</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                収集した情報は、アカウントの管理・認証、サービスの提供・運営、ユーザーサポート、サービス改善、重要な通知のために利用いたします。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">情報の保護</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Firebase Authentication及びFirestoreによるセキュアなデータ保存、SSL/TLS暗号化、アクセス制御、定期的なセキュリティ監査により情報を保護します。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">第三者への提供</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ユーザーの明示的な同意、法令に基づく場合、生命・身体・財産の保護、公衆衛生・児童の健全育成に必要な場合を除き、個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">アカウントの削除</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ユーザーはいつでもアカウントを削除でき、削除時には関連するすべての個人情報がシステムから完全に削除されます。
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="privacy-consent"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
          />
          <label
            htmlFor="privacy-consent"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300"
          >
            <Link
              href="/privacy-policy"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
            >
              プライバシーポリシー
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
            に同意します
          </label>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!agreed || loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? "処理中..." : "同意してアカウント作成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
