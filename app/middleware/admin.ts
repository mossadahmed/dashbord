import { useCookie, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie<string | null>('token')
  const userRole = useCookie<string | null>('role') 

  if (!token.value) {
    return navigateTo('/login')
  }

  if (userRole.value !== 'admin') {
    alert('yor not admin')
    return navigateTo('/home')
  }
})
