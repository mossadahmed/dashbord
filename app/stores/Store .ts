// stores/user.ts
import { defineStore } from 'pinia'
import { useCookie, navigateTo } from '#app'
import { logInData } from '~/composable/login'
export const useUserStore = defineStore('user', () => {
  const token = useCookie('token')
  const logIn = async (email: string, password: string) => {
    try {
      const userData = await logInData(email, password)

      if (userData) {
        token.value = userData.token

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('erorr', error)
      return false
    }
  }

  const logout = () => {
    token.value = ''

    navigateTo('/')
  }

  return {
    logIn,
    logout,
    token,

  }
})
