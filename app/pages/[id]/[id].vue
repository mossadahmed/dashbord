<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserData } from '~/stores/userdata'

import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id ?? ''

const userStore = useUserData()

onMounted(() => {
  if (id) {
    userStore.getUser(id)
  } else {
    console.error('No ID found in route params')
  }
})

const toggleBlockUser = () => {
  userStore.toggleBlock()
}
</script>

<template>
  <div class="container w-[84%] ml-60">
    <div v-if="userStore.singleUser" class="bg-gray-50 pl-7 h-fit">
      <div class="p-3">
        <h1 class="text-2xl font-bold">Users</h1>
        <div class="text-gray-500 p-3">
          <NuxtLink to="/">User ></NuxtLink>
          <span>Home</span>
        </div>

        <div class="p-3 flex items-center gap-4 relative">
          <img :src="userStore.singleUser.avatar" width="100" alt="" class="rounded-full" >

          <button
            class="absolute top-5 left-24 text-xl text-red-600 hover:text-red-800 focus:outline-none"
            :title="userStore.singleUser.blocked ? 'Unblock User' : 'Block User'"
            aria-label="Toggle block user"
            @click="toggleBlockUser"
          >
            <FontAwesomeIcon :icon="userStore.singleUser.blocked ? faLock : faLockOpen " />
          </button>

          <div class="ml-28">
            <p>{{ userStore.singleUser.role }}</p>
            <p>{{ userStore.singleUser.email }}</p>
          </div>
        </div>
      </div>

      <div class="border-b-2 p-3 text-red-400 w-fit cursor-pointer">
        <h3>My Account</h3>
      </div>
    </div>

    <div v-if="userStore.singleUser" class="p-10">
      <h1 class="font-black text-xl">Account info</h1>

      <div class="p3 mt-5">
        <h3 class="font-bold text-gray-700">Name</h3>
        <p class="text-gray-400">{{ userStore.singleUser.name }}</p>
      </div>
      <hr class="text-gray-300 mt-3" >

      <div class="p3 mt-5">
        <h3 class="font-bold text-gray-700">Email address</h3>
        <p class="text-gray-400">{{ userStore.singleUser.email }}</p>
      </div>
      <hr class="text-gray-300 mt-3" >

      <div class="p3 mt-5">
        <h3 class="font-bold text-gray-700">Role</h3>
        <p class="text-gray-400">{{ userStore.singleUser.role }}</p>
      </div>
    </div>

    <div
      class="w-fit px-10 ml-5 border-2 rounded-xl border-gray-300 shadow hover:bg-gradient-to-l from-pink-500 to-red-500 hover:text-white p-2 duration-500"
    >
      <NuxtLink :to="`/${userStore.singleUser?.id}/update`">Update My Profile</NuxtLink>
    </div>
  </div>
</template>
