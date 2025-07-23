"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Lock, Trash2, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateUserProfile, updateUserEmail, updateUserPassword, deleteUserAccount } = useAuth()
  const router = useRouter()

  // Profile update states
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "")

  // Email update states
  const [newEmail, setNewEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")

  // Password update states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // UI states
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updateUserProfile(displayName, photoURL)
      setMessage("プロフィールが更新されました")
    } catch (error: any) {
      setError("プロフィールの更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updateUserEmail(newEmail, emailPassword)
      setMessage("メールアドレスが更新されました")
      setNewEmail("")
      setEmailPassword("")
    } catch (error: any) {
      setError("メールアドレスの更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません")
      return
    }

    if (newPassword.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      return
    }

    setLoading(true)

    try {
      await updateUserPassword(currentPassword, newPassword)
      setMessage("パスワードが更新されました")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setError("パスワードの更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (deleteConfirmation !== "DELETE") {
      setError("確認のため「DELETE」と入力してください")
      return
    }

    setLoading(true)

    try {
      await deleteUserAccount(deletePassword)
      router.push("/")
    } catch (error: any) {
      setError("アカウントの削除に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="mb-4 border-purple-500/20 text-purple-300 hover:bg-purple-500/10 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ダッシュボードに戻る
              </Button>
            </Link>
            <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">アカウント設定</CardTitle>
                <CardDescription className="text-purple-300">プロフィール情報とセキュリティ設定を管理</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Messages */}
          {message && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-300">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Settings Tabs */}
          <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20">
                    <User className="w-4 h-4 mr-2" />
                    プロフィール
                  </TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-purple-500/20">
                    <Mail className="w-4 h-4 mr-2" />
                    メール
                  </TabsTrigger>
                  <TabsTrigger value="password" className="data-[state=active]:bg-purple-500/20">
                    <Lock className="w-4 h-4 mr-2" />
                    パスワード
                  </TabsTrigger>
                  <TabsTrigger value="delete" className="data-[state=active]:bg-red-500/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20 border-2 border-purple-500/20">
                      <AvatarImage src={photoURL || user.photoURL || ""} alt={displayName || "User"} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xl">
                        {displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.displayName || "ユーザー"}</h3>
                      <p className="text-purple-300">{user.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-purple-300">
                        表示名
                      </Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="表示名を入力"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoURL" className="text-purple-300">
                        プロフィール画像URL
                      </Label>
                      <Input
                        id="photoURL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="画像URLを入力"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "更新中..." : "プロフィールを更新"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">現在のメールアドレス</h3>
                    <p className="text-purple-300">{user.email}</p>
                  </div>

                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail" className="text-purple-300">
                        新しいメールアドレス
                      </Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="新しいメールアドレス"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailPassword" className="text-purple-300">
                        現在のパスワード
                      </Label>
                      <Input
                        id="emailPassword"
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        placeholder="現在のパスワード"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {loading ? "更新中..." : "メールアドレスを更新"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password" className="space-y-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-purple-300">
                        現在のパスワード
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="現在のパスワード"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-purple-300">
                        新しいパスワード
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="新しいパスワード（6文字以上）"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-purple-300">
                        パスワード確認
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="新しいパスワードを再入力"
                        className="bg-slate-800/50 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? "更新中..." : "パスワードを更新"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Delete Tab */}
                <TabsContent value="delete" className="space-y-6">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      この操作は取り消すことができません。アカウントとすべてのデータが完全に削除されます。
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={handleAccountDelete} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deletePassword" className="text-red-300">
                        現在のパスワード
                      </Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="現在のパスワード"
                        className="bg-slate-800/50 border-red-500/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirmation" className="text-red-300">
                        確認のため「DELETE」と入力してください
                      </Label>
                      <Input
                        id="deleteConfirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="DELETE"
                        className="bg-slate-800/50 border-red-500/20 text-white"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {loading ? "削除中..." : "アカウントを完全に削除"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
