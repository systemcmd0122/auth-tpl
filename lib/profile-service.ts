import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  bio: string
  location: string
  website: string
  phoneNumber: string
  provider: string
  privacyPolicyAccepted: boolean
  privacyPolicyAcceptedAt: any
  createdAt: any
  updatedAt: any
}

export const createUserProfile = async (uid: string, userData: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid)
  await setDoc(userRef, {
    ...userData,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile
  }
  return null
}

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export const deleteUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid)
  await deleteDoc(userRef)
}

// ユーザーに関連するすべてのデータを完全削除する関数
export const deleteAllUserData = async (uid: string) => {
  const batch = writeBatch(db)

  try {
    console.log(`Starting complete data deletion for user: ${uid}`)

    // 1. ユーザープロフィールを削除
    const userRef = doc(db, "users", uid)
    batch.delete(userRef)
    console.log("Marked user profile for deletion")

    // 2. ユーザーセッション情報を削除
    const sessionsQuery = query(collection(db, "sessions"), where("userId", "==", uid))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    sessionsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${sessionsSnapshot.size} sessions for deletion`)

    // 3. ユーザーの設定情報を削除
    const settingsQuery = query(collection(db, "userSettings"), where("userId", "==", uid))
    const settingsSnapshot = await getDocs(settingsQuery)
    settingsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${settingsSnapshot.size} user settings for deletion`)

    // 4. ユーザーのログ情報を削除
    const logsQuery = query(collection(db, "userLogs"), where("userId", "==", uid))
    const logsSnapshot = await getDocs(logsQuery)
    logsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${logsSnapshot.size} user logs for deletion`)

    // 5. ユーザーの通知設定を削除
    const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", uid))
    const notificationsSnapshot = await getDocs(notificationsQuery)
    notificationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${notificationsSnapshot.size} notifications for deletion`)

    // 6. ユーザーのアクティビティ履歴を削除
    const activitiesQuery = query(collection(db, "activities"), where("userId", "==", uid))
    const activitiesSnapshot = await getDocs(activitiesQuery)
    activitiesSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${activitiesSnapshot.size} activities for deletion`)

    // 7. ユーザーのファイル/画像メタデータを削除
    const filesQuery = query(collection(db, "userFiles"), where("userId", "==", uid))
    const filesSnapshot = await getDocs(filesQuery)
    filesSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${filesSnapshot.size} file metadata for deletion`)

    // 8. ユーザーのデバイス情報を削除
    const devicesQuery = query(collection(db, "userDevices"), where("userId", "==", uid))
    const devicesSnapshot = await getDocs(devicesQuery)
    devicesSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${devicesSnapshot.size} device records for deletion`)

    // 9. ユーザーのプリファレンスを削除
    const preferencesQuery = query(collection(db, "userPreferences"), where("userId", "==", uid))
    const preferencesSnapshot = await getDocs(preferencesQuery)
    preferencesSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${preferencesSnapshot.size} preferences for deletion`)

    // 10. ユーザーのキャッシュデータを削除
    const cacheQuery = query(collection(db, "userCache"), where("userId", "==", uid))
    const cacheSnapshot = await getDocs(cacheQuery)
    cacheSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    console.log(`Marked ${cacheSnapshot.size} cache entries for deletion`)

    // バッチ処理を実行
    await batch.commit()
    console.log("Successfully deleted all user data from Firestore")

    // 削除ログを記録（匿名化）
    const deletionLogRef = doc(collection(db, "deletionLogs"))
    await setDoc(deletionLogRef, {
      deletedUserId: uid.substring(0, 8) + "****", // 部分的に匿名化
      deletionTimestamp: serverTimestamp(),
      deletionReason: "user_requested",
      dataTypesDeleted: [
        "profile",
        "sessions",
        "settings",
        "logs",
        "notifications",
        "activities",
        "files",
        "devices",
        "preferences",
        "cache",
      ],
      totalRecordsDeleted:
        1 + // profile
        sessionsSnapshot.size +
        settingsSnapshot.size +
        logsSnapshot.size +
        notificationsSnapshot.size +
        activitiesSnapshot.size +
        filesSnapshot.size +
        devicesSnapshot.size +
        preferencesSnapshot.size +
        cacheSnapshot.size,
    })

    return {
      success: true,
      deletedRecords: {
        profile: 1,
        sessions: sessionsSnapshot.size,
        settings: settingsSnapshot.size,
        logs: logsSnapshot.size,
        notifications: notificationsSnapshot.size,
        activities: activitiesSnapshot.size,
        files: filesSnapshot.size,
        devices: devicesSnapshot.size,
        preferences: preferencesSnapshot.size,
        cache: cacheSnapshot.size,
      },
    }
  } catch (error) {
    console.error("Error during complete user data deletion:", error)
    throw new Error("完全なデータ削除に失敗しました")
  }
}

// ユーザーデータの削除状況を確認する関数
export const verifyUserDataDeletion = async (uid: string) => {
  try {
    const collections = [
      "users",
      "sessions",
      "userSettings",
      "userLogs",
      "notifications",
      "activities",
      "userFiles",
      "userDevices",
      "userPreferences",
      "userCache",
    ]

    const remainingData: { [key: string]: number } = {}

    for (const collectionName of collections) {
      if (collectionName === "users") {
        const userRef = doc(db, collectionName, uid)
        const userSnap = await getDoc(userRef)
        remainingData[collectionName] = userSnap.exists() ? 1 : 0
      } else {
        const q = query(collection(db, collectionName), where("userId", "==", uid))
        const snapshot = await getDocs(q)
        remainingData[collectionName] = snapshot.size
      }
    }

    const totalRemaining = Object.values(remainingData).reduce((sum, count) => sum + count, 0)

    return {
      isCompletelyDeleted: totalRemaining === 0,
      remainingData,
      totalRemaining,
    }
  } catch (error) {
    console.error("Error verifying user data deletion:", error)
    throw new Error("削除確認に失敗しました")
  }
}
