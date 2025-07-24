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
import { 
  ArrowLeft, User, Mail, Lock, Trash2, Save, CheckCircle, Info, 
  Shield, Camera, Edit3, MapPin, Globe, Phone, Calendar, 
  AlertTriangle, Eye, EyeOff, Copy, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageLoading } from "@/components/loading"
import { Separator } from "@/components/ui/separator"

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
  const [showPassword, setShowPassword] = useState(false)

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
      setMessage("プロフィールが正常に更新されました")
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
      setMessage("メールアドレスが正常に更新されました")
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
      setMessage("パスワードが正常に更新されました")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage("クリップボードにコピーされました")
  }

  if (accountDeleted) {
    return <AccountDeletedScreen />
  }

  if (!user || !userProfile) {
    return <PageLoading message="プロフィールを読み込み中..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">ダッシュボードに戻る</span>
              <span className="sm:hidden">戻る</span>
            </Button>
          </Link>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              プロフィール設定
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">アカウント管理</p>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* メッセージ表示 */}
        {message && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 animate-fade-in">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* プロフィールヒーロー */}
        <section className="animate-slide-up">
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl hover-lift">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* プロフィール画像 */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-white/50 dark:ring-slate-700/50 hover-scale">
                    <AvatarImage src={photoURL || userProfile.photoURL} alt={displayName || "User"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl">
                      {displayName?.charAt(0) || userProfile.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white animate-bounce-in" />
                  </div>
                </div>

                {/* プロフィール情報 */}
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                      {userProfile.displayName || "ユーザー"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center justify-center lg:justify-start space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{userProfile.email}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userProfile.email)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </p>
                  </div>

                  {userProfile.bio && (
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto lg:mx-0 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                      {userProfile.bio}
                    </p>
                  )}

                  {/* バッジ */}
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 animate-fade-in">
                      <Shield className="w-3 h-3 mr-1" />
                      認証済み
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 animate-fade-in animate-delay-100">
                      {userProfile.provider === "google.com" ? "Google" : 
                       userProfile.provider === "github.com" ? "GitHub" : "Email"}
                    </Badge>
                    <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 animate-fade-in animate-delay-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      アクティブ
                    </Badge>
                  </div>

                  {/* 追加情報 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {userProfile.location && (
                      <div className="flex items-center justify-center lg:justify-start space-x-2 animate-fade-in animate-delay-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                    {userProfile.website && (
                      <div className="flex items-center justify-center lg:justify-start space-x-2 animate-fade-in animate-delay-400">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <a href={userProfile.website} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                          ウェブサイト
                        </a>
                      </div>
                    )}
                    {userProfile.createdAt && (
                      <div className="flex items-center justify-center lg:justify-start space-x-2 animate-fade-in animate-delay-500">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('ja-JP')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 設定タブ */}
        <section className="animate-fade-in animate-delay-200">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto mb-8">
                  <TabsTrigger value="profile" className="flex-col py-3 space-y-2 group">
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs">プロフィール</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" disabled={!isEmailProvider()} className="flex-col py-3 space-y-2 group">
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs">メール</span>
                  </TabsTrigger>
                  <TabsTrigger value="password" disabled={!isEmailProvider()} className="flex-col py-3 space-y-2 group">
                    <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs">パスワード</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex-col py-3 space-y-2 group">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs">アカウント</span>
                  </TabsTrigger>
                  <TabsTrigger value="delete" className="flex-col py-3 space-y-2 text-red-600 group">
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs">削除</span>
                  </TabsTrigger>
                </TabsList>

                {/* プロフィールタブ */}
                <TabsContent value="profile" className="space-y-8 animate-fade-in">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">プロフィール編集</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">あなたの情報を更新してください</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-sm font-medium">
                            表示名
                          </Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="表示名を入力"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-sm font-medium">
                            電話番号
                          </Label>
                          <Input
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+81 90-0000-0000"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photoURL" className="text-sm font-medium">
                          プロフィール画像URL
                        </Label>
                        <Input
                          id="photoURL"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">
                          自己紹介
                        </Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="あなたについて教えてください..."
                          rows={4}
                          className="resize-none bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium">
                            所在地
                          </Label>
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="東京, 日本"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-sm font-medium">
                            ウェブサイト
                          </Label>
                          <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-11 group ripple"
                      >
                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        {loading ? "更新中..." : "プロフィールを更新"}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* メールタブ */}
                <TabsContent value="email" className="space-y-8 animate-fade-in">
                  {!isEmailProvider() ? (
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        ソーシャルログインユーザーはメールアドレスを変更できません。
                        メールアドレスを変更するには、認証プロバイダーの設定を確認してください。
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">メールアドレス変更</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">ログインに使用するメールアドレスを変更</p>
                        </div>
                      </div>

                      <Card className="border border-slate-200 dark:border-slate-700 mb-6">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">現在のメールアドレス</p>
                              <p className="font-medium">{userProfile.email}</p>
                            </div>
                            <Badge variant="secondary">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              認証済み
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <form onSubmit={handleEmailUpdate} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="newEmail" className="text-sm font-medium">
                            新しいメールアドレス
                          </Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="new@example.com"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailPassword" className="text-sm font-medium">
                            現在のパスワード
                          </Label>
                          <Input
                            id="emailPassword"
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            placeholder="現在のパスワードを入力"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 h-11 group ripple"
                        >
                          <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          {loading ? "更新中..." : "メールアドレスを更新"}
                        </Button>
                      </form>
                    </div>
                  )}
                </TabsContent>

                {/* パスワードタブ */}
                <TabsContent value="password" className="space-y-8 animate-fade-in">
                  {!isEmailProvider() ? (
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        ソーシャルログインユーザーはパスワードを変更できません。
                        パスワードを変更するには、認証プロバイダーの設定を確認してください。
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                          <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">パスワード変更</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">アカウントのセキュリティを強化</p>
                        </div>
                      </div>

                      <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-sm font-medium">
                            現在のパスワード
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="現在のパスワード"
                              className="h-11 bg-white/50 dark:bg-slate-800/50 pr-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-11 px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-medium">
                            新しいパスワード
                          </Label>
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="新しいパスワード（6文字以上）"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            パスワード確認
                          </Label>
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="新しいパスワードを再入力"
                            className="h-11 bg-white/50 dark:bg-slate-800/50 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full lg:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-11 group ripple"
                        >
                          <Lock className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          {loading ? "更新中..." : "パスワードを更新"}
                        </Button>
                      </form>
                    </div>
                  )}
                </TabsContent>

                {/* アカウントタブ */}
                <TabsContent value="account" className="space-y-8 animate-fade-in">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">アカウント情報</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">アカウントの詳細情報</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card className="border border-slate-200 dark:border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg">基本情報</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">ユーザーID</p>
                              <p className="text-xs text-slate-500 font-mono">{user.uid.substring(0, 16)}...</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(user.uid)} className="hover-lift">
                              <Copy className="w-3 h-3 mr-1" />
                              コピー
                            </Button>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-lg font-bold text-green-600">安全</p>
                              <p className="text-xs text-slate-500">セキュリティ状態</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-blue-600">
                                {userProfile.provider === "google.com" ? "Google" : 
                                 userProfile.provider === "github.com" ? "GitHub" : "Email"}
                              </p>
                              <p className="text-xs text-slate-500">認証プロバイダー</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-purple-600">
                                {userProfile.createdAt ? 
                                  Math.floor((Date.now() - userProfile.createdAt.seconds * 1000) / (1000 * 60 * 60 * 24))
                                  : "N/A"} 日
                              </p>
                              <p className="text-xs text-slate-500">利用期間</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* 削除タブ */}
                <TabsContent value="delete" className="space-y-8 animate-fade-in">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">危険な操作</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">アカウントの完全削除</p>
                      </div>
                    </div>

                    <Alert variant="destructive" className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>警告:</strong> アカウントを削除すると、すべてのデータが完全に削除され、復旧することはできません。
                        この操作は取り消すことができませんので、慎重に検討してください。
                      </AlertDescription>
                    </Alert>

                    {isSocialProvider() && (
                      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
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
        </section>
      </main>
    </div>
  )
}
