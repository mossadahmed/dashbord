import { userDetails } from "~/composable/dataUser"
import { defineStore } from "pinia"
import { ref } from "vue"

interface UserData {
  id: string
  name: string
  avatar: string
  email: string
  role: string
  blocked?: boolean
}

export const useUserData = defineStore('userdata', () => {
  const singleUser = ref<UserData | null>(null)

  const getUser = async (id: string) => {
    try {
      const user = await userDetails(id)
      singleUser.value = { ...user, blocked: false }
    } catch (error) {
      console.error("Error fetching user:", error)
      singleUser.value = null
    }
  }

  const toggleBlock = () => {
    if (singleUser.value) {
      singleUser.value.blocked = !singleUser.value.blocked
    }
  }

  return { singleUser, getUser, toggleBlock }
})
