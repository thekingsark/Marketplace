"use client"

import { initializeApp, getApps, type FirebaseOptions, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  type Auth,
  signInWithPhoneNumber,
} from "firebase/auth"

// Store Firebase instances
let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null

// Hardcoded default config for development/testing
// IMPORTANT: Replace these with your actual Firebase config in production
const DEFAULT_FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: "AIzaSyDOCAbC123dEf456GhI789jKl01-MnO",
  authDomain: "dev-project.firebaseapp.com",
  projectId: "dev-project",
  storageBucket: "dev-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1",
}

// Get Firebase config from environment variables or use defaults
const getFirebaseConfig = (): FirebaseOptions => {
  // For production, use environment variables
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
  }

  // For development/testing, use default config
  console.warn("Using default Firebase configuration. This should only be used for development.")
  return DEFAULT_FIREBASE_CONFIG
}

export const AuthService = {
  // Initialize Firebase auth
  initializeAuth: async () => {
    try {
      // Check if Firebase is already initialized
      if (getApps().length === 0) {
        // Initialize Firebase with config
        const config = getFirebaseConfig()
        firebaseApp = initializeApp(config)
        console.log("Firebase initialized successfully")
      } else {
        // Firebase already initialized
        firebaseApp = getApps()[0]
      }

      // Initialize Auth
      auth = getAuth(firebaseApp)
      return true
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      return false
    }
  },

  signUp: async (email, password) => {
    if (!auth) return "auth/not-initialized"

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCredential.user)
      return true
    } catch (error: any) {
      return error.code || false
    }
  },

  signInWithEmailAndPassword: async (email, password) => {
    if (!auth) throw new Error("Auth not initialized")
    await signInWithEmailAndPassword(auth, email, password)
  },

  logout: async () => {
    if (!auth) return false

    try {
      await signOut(auth)
      return true
    } catch (error) {
      console.error("Error signing out:", error)
      return false
    }
  },

  getAuthUser: (callback) => {
    if (!auth) {
      callback(null)
      return () => {}
    }

    return onAuthStateChanged(auth, (user) => {
      callback(user)
    })
  },

  unsubAuthUser: () => {
    // This is just a placeholder, the actual unsubscribe function is returned by onAuthStateChanged
  },

  signInWithGoogle: async () => {
    if (!auth) throw new Error("Auth not initialized")

    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  },

  signInWithFacebook: async () => {
    if (!auth) throw new Error("Auth not initialized")

    const provider = new FacebookAuthProvider()
    await signInWithPopup(auth, provider)
  },

  sendPasswordResetEmail: async (email) => {
    if (!auth) return false

    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (error) {
      console.error("Error sending password reset email:", error)
      return false
    }
  },

  userHasEmailVerified: async (settings) => {
    if (!auth || !auth.currentUser) return false

    if (settings.emailValidationEnabled) {
      return auth.currentUser.emailVerified || false
    }
    return true
  },

  resendEmailVerification: async () => {
    if (!auth || !auth.currentUser) return false

    try {
      await sendEmailVerification(auth.currentUser)
      return true
    } catch (error) {
      console.error("Error resending verification email:", error)
      return false
    }
  },

  userHasPhoneNumber: () => {
    return !!auth?.currentUser?.phoneNumber
  },

  validatePhoneNumber: async (phoneNumber, recaptchaContainer) => {
    if (!auth) throw new Error("Auth not initialized")

    try {
      // @ts-ignore - RecaptchaVerifier is available in browser environments
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      })

      // @ts-ignore
      const appVerifier = window.recaptchaVerifier
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      return confirmationResult.verificationId
    } catch (error) {
      console.error("Error validating phone number:", error)
      throw error
    }
  },

  submitPhoneNumberOtp: async (verificationId, code) => {
    if (!auth) throw new Error("Auth not initialized")

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      return await signInWithCredential(auth, credential)
    } catch (error) {
      console.error("Error submitting OTP:", error)
      throw error
    }
  },
}

