import { firebaseConfig } from '@/firebase'
import { initializeApp, getApps, FirebaseOptions } from 'firebase/app'
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  User,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import { BiddoSettings } from '../domain/settings'

class AuthService {
  private googleProvider = new GoogleAuthProvider()
  private facebookProvider = new FacebookAuthProvider()
  private firebaseUnsub!: () => void

  private verificationId: string | null = null
  private usedPhoneNumber: string | null = null

  constructor() {
    if (!getApps().length) {
      initializeApp(firebaseConfig as FirebaseOptions)
    }
  }

  public signInWithGoogle = async () => {
    await signInWithPopup(getAuth(), this.googleProvider)
  }

  public signInWithFacebook = async () => {
    await signInWithPopup(getAuth(), this.facebookProvider)
  }

  public signInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(getAuth(), email, password)
  }

  validatePhoneNumber = async (phoneNumber: string, captchaId: string) => {
    const auth = getAuth()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.recaptchaVerifier = new RecaptchaVerifier(auth, captchaId, {
      size: 'invisible',
    })

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.recaptchaVerifier as RecaptchaVerifier
    )
    this.verificationId = confirmationResult.verificationId
    return confirmationResult.verificationId
  }

  userHasPhoneNumber = () => {
    const currentUser = getAuth().currentUser
    return currentUser?.phoneNumber !== null
  }

  userHasEmailVerified = async (settings: BiddoSettings) => {
    if (!settings.emailValidationEnabled) {
      return true
    }

    const currentUser = getAuth().currentUser
    if (!currentUser) {
      return false
    }
    return currentUser.emailVerified
  }

  submitPhoneNumberOtp = (code: string) => {
    if (!this.verificationId || !code) {
      return
    }

    return this.signInWithPhoneNumber(this.verificationId, code)
  }

  signInWithPhoneNumber = async (verificationId: string, code: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      const result = await signInWithCredential(getAuth(), credential)
      return result.user
    } catch (e) {
      console.error('Error signing in with phone number:', e)
      throw e
    }
  }

  public async logout() {
    await signOut(getAuth())
    return true
  }

  public unsubAuthUser(): void {
    if (this.firebaseUnsub) {
      this.firebaseUnsub()
    }
  }

  public getAuthUser = async (callback: (authUser: User | null) => void) => {
    this.firebaseUnsub = onAuthStateChanged(getAuth(), callback)
  }

  public getAuthUserAsync(): Promise<User | null> {
    return new Promise((resolve) => {
      this.getAuthUser(resolve)
    })
  }

  public signUp = async (email: string, password: string) => {
    try {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, email, password)

      try {
        await sendEmailVerification(result.user)
      } catch (error) {
        console.error('Error sending email verification', error)
      }

      return true
    } catch (error) {
      if ((error as Error).message.indexOf('auth/email-already-in-use') !== -1) {
        return 'auth/email-already-in-use'
      }

      return false
    }
  }

  public reloadAuthUser() {
    try {
      return getAuth().currentUser?.reload()
    } catch (error) {
      console.error('Error reloading user', error)
      return null
    }
  }

  // Not used in the app, but it might be useful for you
  public async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(getAuth(), email)
      return true
    } catch (error) {
      console.error('Error sending password reset email', error)
      return false
    }
  }

  // Not used in the app, but it might be useful for you
  public async resendEmailVerification() {
    try {
      const currentUser = getAuth().currentUser
      if (!currentUser) {
        return false
      }

      await sendEmailVerification(currentUser)
      return true
    } catch (error) {
      console.error('Error resending email verification', error)
      return false
    }
  }
}

const authService = new AuthService()
export { authService as AuthService }
