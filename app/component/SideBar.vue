<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useCookie } from '#app'
import { onMounted, ref } from 'vue'
import {
  faHouse,
  faUsers,
  faFileLines,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
}

const user = ref<User | null>(null)
const token = useCookie<string | null>('token')
const loading = ref(true)

const logout = () => {
  token.value = null
  navigateTo('/login')
}

onMounted(async () => {
  if (!token.value) {
    return navigateTo('/login')
  }

  try {
    const res = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!res.ok) {
      return navigateTo('/login')
    }

    const fetchedUser = await res.json()
    user.value = fetchedUser
  } catch (e) {
    console.error(e)
    navigateTo('/login')
  } finally {
    loading.value = false
  }
  if (user.value?.role !== 'admin') {
    alert("yor not admin")
    return navigateTo('/home')
  }
})
definePageMeta({
  middleware: 'admin'
})
</script>

<template>
  <div class="min-h-scroll flex bg-gray-100 fixed top-0 left-0 h-screen w-64 ">
    <div class="py-10 w-full">
      <aside class="flex flex-col justify-between h-full">
        <div class="flex flex-col mt-10">
          <NuxtLink
to="/home"
            class="flex items-center gap-2 focus:bg-gradient-to-l focus:from-pink-500 focus:to-red-500 focus:text-white focus:rounded-md duration-300 p-3">
            <FontAwesomeIcon :icon="faHouse" />
            <span>Home</span>
          </NuxtLink>
          <div
:to="user?.role === 'admin' ? '/' : '/home'" :class="[
          
            user?.role !== 'admin' ? 'pointer-events-none opacity-50' : ''
          ]">
            <NuxtLink
to="/"
              class="flex items-center gap-2 focus:bg-gradient-to-l focus:from-pink-500 focus:to-red-500 focus:text-white focus:rounded-md duration-300 p-3">
              <FontAwesomeIcon :icon="faUsers" />
              <span>Users</span>
            </NuxtLink>

        
            <NuxtLink
to="content"
              class="flex items-center gap-2 focus:bg-gradient-to-l focus:from-pink-500 focus:to-red-500 focus:text-white focus:rounded-md duration-300 p-3">
              <FontAwesomeIcon :icon="faFileLines" />
              <span>Content</span>
            </NuxtLink>

      
          </div>

        </div>

        <div v-if="loading" class="flex justify-center items-center p-4">
          <div class="w-10 h-10 border-x-2 border-black rounded-full animate-spin" />
        </div>

        <div v-else-if="user" class="flex items-center w-full justify-between p-4">
          <div class="flex items-center gap-3">
            <img :src="user.avatar || '/images/userimg.webp'" class="w-10 h-10 rounded-full">
            <div class="text-xs">
              <p>{{ user.name }}</p>
              <p class="text-gray-400">{{ user.role }}</p>
            </div>
          </div>
          <button class="l-16" @click="logout">
            <FontAwesomeIcon :icon="faArrowRightFromBracket" class="text-lg text-gray-400 focus:text-red-500" />
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
