import { AuthService } from '@/core/services/auth'
import { LocalStorageService, STORAGE_DATA } from '@/core/services/local-storage'
import { RequestMaker } from '@/core/services/request-maker'
import { AccountsRepository } from '../repositories/account'
import { AppStore } from '../store'
import { AccountController } from './account'
import { createSession, removeSession } from '@/app/actions/auth-actions'
import { runInAction } from 'mobx'
import { SocketController } from './socket'

class AuthController {
  loginWithGoogle = async () => {
    try {
      await AuthService.signInWithGoogle()
      await this.loadAuthToken()

      window.location.href = '/'
      return true
    } catch (error) {
      console.log('could not login with google', error)
      return false
    }
  }

  signUp = async (email: string, password: string, acceptedTerms: boolean) => {
    const result = await AuthService.signUp(email, password)
    if (result && result !== 'auth/email-already-in-use') {
      localStorage.setItem(STORAGE_DATA.ACCEPTED_TERMS, acceptedTerms.toString())
      localStorage.setItem(STORAGE_DATA.COMMITED_ACCEPTED_TERMS, 'false')
      window.location.href = '/'
    }

    return result
  }

  sendPasswordResetEmail = async (email: string) => {
    return AuthService.sendPasswordResetEmail(email)
  }

  loginWithPhoneNumber = async (phoneNumber: string, captchaId: string) => {
    try {
      return await AuthService.validatePhoneNumber(phoneNumber, captchaId)
    } catch (error) {
      console.error('Could not login with phone number', error)
      return false
    }
  }

  submitPhoneNumberOtp = async (otp: string) => {
    try {
      return await AuthService.submitPhoneNumberOtp(otp)
    } catch (error) {
      console.error('Could not submit phone number otp', error)
      return false
    }
  }

  loginWithFacebook = async () => {
    try {
      await AuthService.signInWithFacebook()
      await this.loadAuthToken()
      window.location.href = '/'
      return true
    } catch (error) {
      console.log('could not login with facebook', error)
      return false
    }
  }

  loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await AuthService.signInWithEmailAndPassword(email, password)
      await this.loadAuthToken()

      window.location.href = '/'
      return true
    } catch (error) {
      console.error('Could not login using email and password.', error)
      return false
    }
  }

  unsubUser() {
    AuthService.unsubAuthUser()
  }

  async loadAuthToken() {
    const loggedUser = await AuthService.getAuthUserAsync()
    if (!loggedUser) {
      return null
    }

    const authToken = await loggedUser.getIdToken(true)
    RequestMaker.setAuthToken(authToken)
    createSession(authToken)

    return authToken
  }

  async loadUserData() {
    try {
      runInAction(() => {
        AppStore.loadingStates.currentAccount = true
      })
      const userDetails = await AccountsRepository.loadLoggedIn()
      runInAction(() => {
        AppStore.loadingStates.currentAccount = false
      })

      if (!userDetails) {
        window.location.href = '/auth/login'
        return
      }

      AppStore.setAccountDetails(userDetails)
      const commitedAcceptedTerms = localStorage.getItem(STORAGE_DATA.COMMITED_ACCEPTED_TERMS)

      const acceptedTerms = localStorage.getItem(STORAGE_DATA.ACCEPTED_TERMS)
      if (commitedAcceptedTerms === 'false') {
        try {
          await AccountController.acceptTerms(acceptedTerms ? acceptedTerms === 'true' : false)

          AppStore.acceptTerms(acceptedTerms === 'true')
          localStorage.setItem(STORAGE_DATA.COMMITED_ACCEPTED_TERMS, 'true')
        } catch (error) {
          console.error(`Could not update account data: ${error}`)
        }
      }
    } catch (error) {
      console.error('Could not load user data', error)
      await AuthService.logout()
      window.location.href = '/auth/login'
    }
  }

  async getAuthUser() {
    return AuthService.getAuthUserAsync()
  }

  resendEmailVerification = async () => {
    return AuthService.resendEmailVerification()
  }

  getAuthUserAsync = async () => {
    return AuthService.getAuthUserAsync()
  }

  logout = async () => {
    RequestMaker.setAuthToken('')
    LocalStorageService.set(STORAGE_DATA.ACCESS_TOKEN, undefined)
    removeSession()

    AppStore.cleanupAllData()
    SocketController.disconnect()
    await AuthService.logout()
  }
}

const authControllerInstance = new AuthController()
Object.freeze(authControllerInstance)
export { authControllerInstance as AuthController }
