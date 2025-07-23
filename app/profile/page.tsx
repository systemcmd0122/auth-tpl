"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { AccountDeletedScreen } from "@/components/account-deleted-screen"
import { ArrowLeft, User, Mail, Lock, Trash2, Save, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageLoading } from "@/components/loading"

export default function ProfilePage() {
  const {
    user,
    userProfile,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    isEmailProvider,
    isSocialProvider,
  } = useAuth()
  const router = useRouter()

  // Profile update states
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Email update states
  const [newEmail, setNewEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")

  // Password update states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI states
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [accountDeleted, setAccountDeleted] = useState(false)

  // プロフィールデータを初期化
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setPhotoURL(userProfile.photoURL || "")
      setBio(userProfile.bio || "")
      setLocation(userProfile.location || "")
      setWebsite(userProfile.website || "")
      setPhoneNumber(userProfile.phoneNumber || "")
    }
  }, [userProfile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updateUserProfile({
        displayName,
        photoURL,
        bio,
        location,
        website,
        phoneNumber,
      })
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

  const handleAccountDelete = async (password?: string, confirmationCode?: string) => {
    setError("")
    setLoading(true)

    try {
      const result = await deleteUserAccount(password, confirmationCode)
      if (result.success) {
        setAccountDeleted(true)
      }
    } catch (error: any) {
      setError("アカウントの削除に失敗しました: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (accountDeleted) {
    return <AccountDeletedScreen />
  }

  if (!user || !userProfile) {
    return <PageLoading message="プロフィールを読み込み中..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">戻る</span>
            </Button>
          </Link>
          <h1 className="text-base sm:text-lg font-semibold">アカウント設定</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Messages */}
          {message && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">プロフィール概要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  <AvatarImage src={photoURL || userProfile.photoURL} alt={displayName || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl sm:text-2xl">
                    {displayName?.charAt(0) || userProfile.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-2 flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold">{userProfile.displayName || "ユーザー"}</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">{userProfile.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {userProfile.provider === "google.com"
                        ? "Google"
                        : userProfile.provider === "github.com"
                          ? "GitHub"
                          : "Email"}
                    </Badge>
                    {userProfile.bio && (
                      <Badge variant="secondary" className="text-xs">
                        プロフィール設定済み
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="profile" className="text-xs sm:text-sm p-2 sm:p-3">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">プロフィール</span>
                    <span className="sm:hidden">プロフ</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" disabled={!isEmailProvider()} className="text-xs sm:text-sm p-2 sm:p-3">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">メール</span>
                    <span className="sm:hidden">メール</span>
                  </TabsTrigger>
                  <TabsTrigger value="password" disabled={!isEmailProvider()} className="text-xs sm:text-sm p-2 sm:p-3">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">パスワード</span>
                    <span className="sm:hidden">パス</span>
                  </TabsTrigger>
                  <TabsTrigger value="delete" className="text-xs sm:text-sm p-2 sm:p-3">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">削除</span>
                    <span className="sm:hidden">削除</span>
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-4">プロフィール情報</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-sm">
                            表示名
                          </Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="表示名を入力"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-sm">
                            電話番号
                          </Label>
                          <Input
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="電話番号を入力"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photoURL" className="text-sm">
                          プロフィール画像URL
                        </Label>
                        <Input
                          id="photoURL"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          placeholder="画像URLを入力"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm">
                          自己紹介
                        </Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="自己紹介を入力"
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm">
                            所在地
                          </Label>
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="所在地を入力"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-sm">
                            ウェブサイト
                          </Label>
                          <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "更新中..." : "プロフィールを更新"}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-6 mt-6">
                  {!isEmailProvider() ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        ソーシャルログインユーザーはメールアドレスを変更できません。
                        メールアドレスを変更するには、認証プロバイダーの設定を確認してください。
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-4">メールアドレス変更</h3>
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs sm:text-sm text-muted-foreground">現在のメールアドレス</p>
                        <p className="font-medium text-sm sm:text-base break-all">{userProfile.email}</p>
                      </div>
                      <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newEmail" className="text-sm">
                            新しいメールアドレス
                          </Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="新しいメールアドレス"
                            className="text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailPassword" className="text-sm">
                            現在のパスワード
                          </Label>
                          <Input
                            id="emailPassword"
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            placeholder="現在のパスワード"
                            className="text-sm"
                            required
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                          <Mail className="w-4 h-4 mr-2" />
                          {loading ? "更新中..." : "メールアドレスを更新"}
                        </Button>
                      </form>
                    </div>
                  )}
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password" className="space-y-6 mt-6">
                  {!isEmailProvider() ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        ソーシャルログインユーザーはパスワードを変更できません。
                        パスワードを変更するには、認証プロバイダーの設定を確認してください。
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-4">パスワード変更</h3>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-sm">
                            現在のパスワード
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="現在のパスワード"
                            className="text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm">
                            新しいパスワード
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="新しいパスワード（6文字以上）"
                            className="text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm">
                            パスワード確認
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="新しいパスワードを再入力"
                            className="text-sm"
                            required
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                          <Lock className="w-4 h-4 mr-2" />
                          {loading ? "更新中..." : "パスワードを更新"}
                        </Button>
                      </form>
                    </div>
                  )}
                </TabsContent>

                {/* Delete Tab */}
                <TabsContent value="delete" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-4 text-red-700 dark:text-red-300">
                      アカウント削除
                    </h3>
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription className="text-sm">
                        アカウントを削除すると、すべてのデータが完全に削除され、復旧することはできません。
                        この操作は取り消すことができませんので、慎重に検討してください。
                      </AlertDescription>
                    </Alert>

                    {isSocialProvider() && (
                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          ソーシャルログインユーザーの場合、パスワードの代わりに確認コードが必要です。
                        </AlertDescription>
                      </Alert>
                    )}

                    <DeleteAccountDialog onDelete={handleAccountDelete} loading={loading} error={error} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
