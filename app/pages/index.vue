<script setup lang="ts">
import { faDownload, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed, watch, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  selected?: boolean
  // blocked?: boolean  <-- شلتها
}

const searche = ref('')
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = 5
const selectedRole = ref('')
// const showBlocked = ref(false)  <-- شلتها
const users = ref<User[]>([])

const fetchUsers = async () => {
  const query = `
    query {
      users {
        id
        name
        email
        role
        avatar
      }
    }
  `
  try {
    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const result = await res.json()
    // users بدون blocked
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users.value = result.data.users.map((user: any) => ({ ...user, selected: false }))
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // شلت شرط الحظر
    const matchRole = selectedRole.value ? user.role === selectedRole.value : true
    const matchSearch = searche.value ? user.name.toLowerCase().includes(searche.value.toLowerCase()) : true
    return matchRole && matchSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() =>
  filteredUsers.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

function toggleSelectAll() {
  paginatedUsers.value.forEach(user => {
    user.selected = selectAll.value
  })
}

watch(currentPage, () => {
  selectAll.value = false
})

// شلت دالة toggleBlockUser
// شلت دالة showActiveUsers و showBlockedUsers
</script>

<template>
  <div class="bg-gray-50 py-10 ml-64">
    <div class="flex justify-between">
      <div class="ml-10 text-start px-14 mb-5">
        <h1 class="font-bold text-black text-3xl">Users</h1>
        <p class="text-gray-500 text-xl">user</p>
      </div>
      <div class="flex w-full justify-end mr-10 gap-6 items-center px-10">
        <button
          class="border border-gray-300 shadow w-24 rounded-xl h-fit p-2 focus:bg-gradient-to-l from-pink-500 to-red-500 focus:text-white">
          <FontAwesomeIcon :icon="faDownload" />
          Export
        </button>
        <button
          class="border border-gray-300 rounded-xl shadow w-34 h-fit p-2 focus:bg-gradient-to-l from-pink-500 to-red-500 focus:text-white">
          <FontAwesomeIcon :icon="faPlus" />
          Add user
        </button>
      </div>
    </div>

    <div class="px-24 mb-5">
      <!-- شلت أزرار التبديل بين blocked و active -->
    </div>

    <div class="flex justify-between items-center px-18 w-full">
      <div class="relative p-5 w-[50%]">
        <div>
          <input
            v-model="searche" type="search"
            class="rounded-xl p-2 border-2 border-gray-300 placeholder:text-start w-full px-6 focus:border-pink-100 focus:border-2"
            placeholder=": Search"
          >
          <div class="absolute top-7.5 left-6 text-gray-400">
            <FontAwesomeIcon :icon="faSearch" />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 pr-10">
        <select v-model="selectedRole" class="border-2 border-gray-300 p-2 rounded-xl">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <input type="date" class="border-2 border-gray-300 p-2 rounded-xl" >
      </div>
    </div>

    <div class="flex items-center justify-center w-full">
      <div class="w-full px-20">
        <div class="overflow-x-auto border border-gray-400 rounded-xl">
          <h3 class="p-5">Users</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input v-model="selectAll" type="checkbox" @change="toggleSelectAll" >
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input v-model="user.selected" type="checkbox" >
                </td>

                <td class="px-6 py-4 whitespace-nowrap flex items-center gap-2 cursor-pointer">
                  <img v-if="user.avatar" :src="user.avatar" class="w-10 rounded-full object-cover" >
                  <div
                    v-else
                    class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <NuxtLink :to="`/${user.id}/${user.id}`" class="text-sm font-medium text-gray-900 hover:underline">
                    {{ user.name }}
                  </NuxtLink>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <!-- شلت زر الحظر -->
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex items-center justify-between border-t px-6 py-4">
            <button
              class="text-gray-600 px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === 1" @click="currentPage--"
            >
              ← Previous
            </button>
            <div class="flex gap-2">
              <button
                v-for="page in totalPages" :key="page"
                :class="['px-3 py-1 border rounded', currentPage === page ? 'bg-gray-200' : 'hover:bg-gray-100']"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="text-gray-600 px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === totalPages" @click="currentPage++"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
