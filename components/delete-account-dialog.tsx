"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trash2, AlertTriangle, Copy, Check, Database, Shield, FileText, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface DeleteAccountDialogProps {
  onDelete: (password?: string, confirmationCode?: string) => Promise<{ success: boolean; deletedRecords?: any }>
  loading: boolean
  error: string
}

export function DeleteAccountDialog({ onDelete, loading, error }: DeleteAccountDialogProps) {
  const { user, isEmailProvider, isSocialProvider } = useAuth()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [copied, setCopied] = useState(false)
  const [deletionProgress, setDeletionProgress] = useState(0)
  const [deletionStatus, setDeletionStatus] = useState("")
  const [deletionResult, setDeletionResult] = useState<any>(null)
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false,
    noRecover: false,
  })

  // ソーシャルログインユーザー用の確認コード（ユーザーIDの最初の6文字）
  const expectedCode = user?.uid.substring(0, 6).toUpperCase() || ""

  const canDelete =
    confirmText === "DELETE" &&
    confirmations.understand &&
    confirmations.permanent &&
    confirmations.noRecover &&
    (isEmailProvider() ? password.length > 0 : confirmationCode === expectedCode)

  const handleDelete = async () => {
    if (!canDelete) return

    try {
      setDeletionProgress(10)
      setDeletionStatus("認証を確認中...")

      const result = await onDelete(
        isEmailProvider() ? password : undefined,
        isSocialProvider() ? confirmationCode : undefined,
      )

      setDeletionProgress(100)
      setDeletionStatus("削除完了")
      setDeletionResult(result)

      if (result.success && !error) {
        // 成功時は少し待ってからダイアログを閉じる
        setTimeout(() => {
          setOpen(false)
        }, 2000)
      }
    } catch (err) {
      setDeletionProgress(0)
      setDeletionStatus("")
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(expectedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setPassword("")
    setConfirmationCode("")
    setConfirmText("")
    setCopied(false)
    setDeletionProgress(0)
    setDeletionStatus("")
    setDeletionResult(null)
    setConfirmations({
      understand: false,
      permanent: false,
      noRecover: false,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          アカウントを削除
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-700 dark:text-red-300">
            <AlertTriangle className="w-5 h-5 mr-2" />
            アカウントの完全削除
          </DialogTitle>
          <DialogDescription>
            この操作により、あなたのアカウントとすべての関連データが完全に削除されます。この操作は取り消すことができません。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 削除進行状況 */}
          {loading && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">データ削除中...</span>
              </div>
              <Progress value={deletionProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{deletionStatus}</p>
            </div>
          )}

          {/* 削除結果 */}
          {deletionResult && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="space-y-2">
                  <p className="font-medium">削除が完了しました</p>
                  <div className="text-xs space-y-1">
                    <p>削除されたデータ:</p>
                    <ul className="list-disc list-inside ml-2 space-y-0.5">
                      <li>プロフィール: {deletionResult.deletedRecords?.profile || 0}件</li>
                      <li>セッション: {deletionResult.deletedRecords?.sessions || 0}件</li>
                      <li>設定: {deletionResult.deletedRecords?.settings || 0}件</li>
                      <li>ログ: {deletionResult.deletedRecords?.logs || 0}件</li>
                      <li>通知: {deletionResult.deletedRecords?.notifications || 0}件</li>
                      <li>アクティビティ: {deletionResult.deletedRecords?.activities || 0}件</li>
                      <li>ファイル: {deletionResult.deletedRecords?.files || 0}件</li>
                      <li>デバイス: {deletionResult.deletedRecords?.devices || 0}件</li>
                      <li>設定: {deletionResult.deletedRecords?.preferences || 0}件</li>
                      <li>キャッシュ: {deletionResult.deletedRecords?.cache || 0}件</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !deletionResult && (
            <>
              {/* 認証プロバイダー表示 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">認証方法:</span>
                <Badge variant="outline">
                  {user?.providerData[0]?.providerId === "google.com"
                    ? "Google"
                    : user?.providerData[0]?.providerId === "github.com"
                      ? "GitHub"
                      : "Email"}
                </Badge>
              </div>

              {/* ソーシャルログイン用の特別な注意事項 */}
              {isSocialProvider() && (
                <Alert>
                  <RefreshCw className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>ソーシャルログインユーザーの方へ:</strong>
                    <br />
                    削除処理中に認証ポップアップが表示される場合があります。セキュリティのため、再度ログインが必要になることがあります。
                  </AlertDescription>
                </Alert>
              )}

              {/* 削除されるデータの詳細 */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong className="text-red-800 dark:text-red-200">完全削除される情報:</strong>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>アカウント情報</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>プロフィールデータ</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>セッション履歴</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>設定情報</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>アクティビティログ</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>通知設定</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>ファイルメタデータ</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>デバイス情報</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>キャッシュデータ</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>すべての関連データ</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="understand"
                    checked={confirmations.understand}
                    onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, understand: !!checked }))}
                    className="mt-0.5"
                  />
                  <Label htmlFor="understand" className="text-sm leading-5">
                    すべてのデータが完全に削除されることを理解しています
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="permanent"
                    checked={confirmations.permanent}
                    onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, permanent: !!checked }))}
                    className="mt-0.5"
                  />
                  <Label htmlFor="permanent" className="text-sm leading-5">
                    この削除は永続的で取り消しできないことを理解しています
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="noRecover"
                    checked={confirmations.noRecover}
                    onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, noRecover: !!checked }))}
                    className="mt-0.5"
                  />
                  <Label htmlFor="noRecover" className="text-sm leading-5">
                    データを復旧する方法がないことを理解しています
                  </Label>
                </div>
              </div>

              {/* 認証方法に応じた確認フィールド */}
              {isEmailProvider() && (
                <div className="space-y-2">
                  <Label htmlFor="password">現在のパスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="現在のパスワードを入力"
                  />
                  <p className="text-xs text-muted-foreground">
                    セキュリティのため、現在のパスワードで再認証を行います。
                  </p>
                </div>
              )}

              {isSocialProvider() && (
                <div className="space-y-2">
                  <Label htmlFor="confirmationCode">確認コード</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">あなたの確認コード:</span>
                      <code className="font-mono font-bold text-lg">{expectedCode}</code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="ml-auto bg-transparent"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Input
                      id="confirmationCode"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                      placeholder="上記の確認コードを入力"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      セキュリティのため、上記の確認コードを入力してください。削除処理中に{" "}
                      {user?.providerData[0]?.providerId === "google.com" ? "Google" : "GitHub"}{" "}
                      の認証ポップアップが表示される場合があります。
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmText">
                  確認のため <strong>DELETE</strong> と入力してください
                </Label>
                <Input
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="w-full sm:w-auto">
            キャンセル
          </Button>
          {!deletionResult && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!canDelete || loading}
              className="w-full sm:w-auto"
            >
              {loading ? "完全削除中..." : "完全に削除"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
