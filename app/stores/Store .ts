// stores/user.ts
import { defineStore } from 'pinia'
import { useCookie, navigateTo } from '#app'
import { logInData } from '~/composable/login'

export const useUserStore = defineStore('user', () => {
  const token = useCookie<string | null>('token')

  const isAuthenticated = computed(() => !!token.value) 

  const logIn = async (email: string, password: string) => {
    try {
      const userData = await logInData(email, password)

      if (userData?.token) {
        token.value = userData.token
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    navigateTo('/')
  }

  return {
    logIn,
    logout,
    token,
    isAuthenticated
  }
})
