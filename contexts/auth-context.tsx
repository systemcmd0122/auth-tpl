"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile as updateFirestoreProfile,
  deleteAllUserData,
  verifyUserDataDeletion,
  type UserProfile,
} from "@/lib/profile-service"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  initialLoading: boolean // 初期ローディング用
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteUserAccount: (
    currentPassword?: string,
    confirmationCode?: string,
  ) => Promise<{ success: boolean; deletedRecords?: any }>
  isEmailProvider: () => boolean
  isSocialProvider: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false) // 通常のローディング
  const [initialLoading, setInitialLoading] = useState(true) // 初期ローディング

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        setLoading(true)
        try {
          // Firestoreからプロフィール情報を取得
          const profile = await getUserProfile(user.uid)

          if (!profile) {
            // プロフィールが存在しない場合は作成
            const newProfile = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              bio: "",
              location: "",
              website: "",
              phoneNumber: user.phoneNumber || "",
              provider: user.providerData[0]?.providerId || "email",
            }
            await createUserProfile(user.uid, newProfile)
            setUserProfile(newProfile as UserProfile)
          } else {
            setUserProfile(profile)
          }
        } catch (error) {
          console.error("Error loading user profile:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setUserProfile(null)
        setLoading(false)
      }

      setInitialLoading(false)
    })

    return unsubscribe
  }, [])

  const isEmailProvider = () => {
    return (
      user?.providerData[0]?.providerId === "password" ||
      user?.providerData.some((provider) => provider.providerId === "password")
    )
  }

  const isSocialProvider = () => {
    return user?.providerData.some(
      (provider) => provider.providerId === "google.com" || provider.providerId === "github.com",
    )
  }

  // 強化された再認証関数
  const performReauthentication = async (currentPassword?: string, confirmationCode?: string) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    console.log("Starting reauthentication process...")

    try {
      if (isEmailProvider() && currentPassword) {
        // メール認証ユーザーの場合
        if (!user.email) throw new Error("メールアドレスが見つかりません")

        console.log("Attempting email/password reauthentication...")
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(user, credential)
        console.log("Email/password reauthentication successful")
      } else if (isSocialProvider()) {
        // ソーシャルログインユーザーの場合
        if (confirmationCode) {
          const expectedCode = user.uid.substring(0, 6).toUpperCase()
          if (confirmationCode !== expectedCode) {
            throw new Error("確認コードが正しくありません")
          }
          console.log("Confirmation code verified")
        }

        // プロバイダーに応じて再認証
        const providerId = user.providerData[0]?.providerId
        console.log(`Attempting social reauthentication with provider: ${providerId}`)

        if (providerId === "google.com") {
          await reauthenticateWithPopup(user, googleProvider)
          console.log("Google reauthentication successful")
        } else if (providerId === "github.com") {
          await reauthenticateWithPopup(user, githubProvider)
          console.log("GitHub reauthentication successful")
        } else {
          throw new Error("サポートされていない認証プロバイダーです")
        }
      } else {
        throw new Error("認証情報が不足しています")
      }

      return true
    } catch (error: any) {
      console.error("Reauthentication failed:", error)

      // エラーメッセージを日本語化
      if (error.code === "auth/wrong-password") {
        throw new Error("パスワードが正しくありません")
      } else if (error.code === "auth/user-mismatch") {
        throw new Error("認証情報が一致しません")
      } else if (error.code === "auth/user-not-found") {
        throw new Error("ユーザーが見つかりません")
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("認証情報が無効です")
      } else if (error.code === "auth/popup-closed-by-user") {
        throw new Error("認証がキャンセルされました")
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("ポップアップがブロックされました。ポップアップを許可してください")
      } else if (error.code === "auth/cancelled-popup-request") {
        throw new Error("認証リクエストがキャンセルされました")
      }

      throw error
    }
  }

  const updateUserProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    setLoading(true)
    try {
      // Firestoreを更新
      await updateFirestoreProfile(user.uid, updates)

      // Firebase Authのプロフィールも更新（displayNameとphotoURLのみ）
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL,
        })
      }

      // ローカル状態を更新
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null))
    } finally {
      setLoading(false)
    }
  }

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!user || !user.email) throw new Error("ユーザーがログインしていません")
    if (!isEmailProvider()) throw new Error("ソーシャルログインユーザーはメールアドレスを変更できません")

    setLoading(true)
    try {
      // 再認証
      await performReauthentication(currentPassword)

      // メールアドレス更新
      await updateEmail(user, newEmail)

      // Firestoreも更新
      await updateFirestoreProfile(user.uid, { email: newEmail })
    } finally {
      setLoading(false)
    }
  }

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error("ユーザーがログインしていません")
    if (!isEmailProvider()) throw new Error("ソーシャルログインユーザーはパスワードを変更できません")

    setLoading(true)
    try {
      // 再認証
      await performReauthentication(currentPassword)

      // パスワード更新
      await updatePassword(user, newPassword)
    } finally {
      setLoading(false)
    }
  }

  const deleteUserAccount = async (currentPassword?: string, confirmationCode?: string) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    const uid = user.uid
    console.log(`Starting account deletion process for user: ${uid}`)

    try {
      // 1. 再認証（強化版）
      console.log("Performing reauthentication...")
      await performReauthentication(currentPassword, confirmationCode)

      // 2. Firestoreからすべてのユーザーデータを完全削除
      console.log("Starting Firestore data deletion...")
      const deletionResult = await deleteAllUserData(uid)
      console.log("Firestore data deletion completed:", deletionResult)

      // 3. Firebase Authからユーザーを削除
      console.log("Deleting user from Firebase Auth...")
      await deleteUser(user)
      console.log("User deleted from Firebase Auth successfully")

      // 4. 削除確認（オプション - エラーが発生しても処理は続行）
      try {
        console.log("Verifying complete data deletion...")
        const verificationResult = await verifyUserDataDeletion(uid)
        console.log("Deletion verification result:", verificationResult)

        if (!verificationResult.isCompletelyDeleted) {
          console.warn("Some data may still remain:", verificationResult.remainingData)
        }
      } catch (verificationError) {
        console.warn("Verification failed, but deletion process completed:", verificationError)
      }

      return {
        success: true,
        deletedRecords: deletionResult.deletedRecords,
      }
    } catch (error: any) {
      console.error("Account deletion failed:", error)

      // エラーメッセージを日本語化
      if (error.code === "auth/requires-recent-login") {
        throw new Error("セキュリティのため、再度ログインしてからアカウントを削除してください")
      }

      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGithub = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, githubProvider)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await firebaseSignOut(auth)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    initialLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
    updateUserProfile: updateUserProfileData,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    isEmailProvider,
    isSocialProvider,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
