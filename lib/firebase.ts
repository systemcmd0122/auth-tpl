import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyAnh_ofMWjWooVtkL2I2i9T84PMCXsyigc",
  authDomain: "auth-3828c.firebaseapp.com",
  projectId: "auth-3828c",
  storageBucket: "auth-3828c.firebasestorage.app",
  messagingSenderId: "974071126620",
  appId: "1:974071126620:web:f2eb38c13a09721e8f6499",
  measurementId: "G-02Y7S8XJJB",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// Analytics (ブラウザ環境でのみ初期化)
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }
export default app
