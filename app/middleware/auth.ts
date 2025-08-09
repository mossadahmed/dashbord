
export default defineNuxtRouteMiddleware(async () => {
  const useStor = useUserStore()
  const tokendata = useStor.token
  if (!tokendata) {
    navigateTo('/login')
  }
})
