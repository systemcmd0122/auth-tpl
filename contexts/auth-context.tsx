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
  EmailAuthProvider,
} from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteUserAccount: (currentPassword: string) => Promise<void>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) throw new Error("ユーザーがログインしていません")
    await updateProfile(auth.currentUser, { displayName, photoURL })
  }

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error("ユーザーがログインしていません")

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updateEmail(auth.currentUser, newEmail)
  }

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error("ユーザーがログインしていません")

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, newPassword)
  }

  const deleteUserAccount = async (currentPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error("ユーザーがログインしていません")

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await deleteUser(auth.currentUser)
  }

  const updateProfile = async (displayName: string, photoURL?: string) => {
    if (auth.currentUser) {
      const { updateProfile: firebaseUpdateProfile } = await import("firebase/auth")
      await firebaseUpdateProfile(auth.currentUser, {
        displayName,
        ...(photoURL && { photoURL }),
      })
    }
  }

  const updateEmail = async (newEmail: string) => {
    if (auth.currentUser) {
      const { updateEmail: firebaseUpdateEmail } = await import("firebase/auth")
      await firebaseUpdateEmail(auth.currentUser, newEmail)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (auth.currentUser) {
      const { updatePassword: firebaseUpdatePassword } = await import("firebase/auth")
      await firebaseUpdatePassword(auth.currentUser, newPassword)
    }
  }

  const deleteAccount = async () => {
    if (auth.currentUser) {
      const { deleteUser } = await import("firebase/auth")
      await deleteUser(auth.currentUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const signInWithGithub = async () => {
    await signInWithPopup(auth, githubProvider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
