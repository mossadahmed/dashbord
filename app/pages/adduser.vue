<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { useCookie } from 'nuxt/app'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const token = useCookie('token')
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const role = ref('')
const avatar = ref('')
const avatarFile = ref<File | null>(null)
const password = ref('')
const showPassword = ref(false)

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files ? target.files[0] : null
  if (file) {
    avatarFile.value = file
    avatar.value = URL.createObjectURL(file)
  }
}

const removeAvatar = () => {
  avatar.value = ''
  avatarFile.value = null
}

const uploadToCloudinary = async (file: File) => {
  const CLOUD_NAME = 'your_cloud_name'
  const UPLOAD_PRESET = 'your_unsigned_preset'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    return data.secure_url as string
  } catch (error) {
    console.error('Upload failed:', error)
    return null
  }
}

const createProfile = async () => {
  let avatarUrl = avatar.value

  if (avatarFile.value) {
    const uploadedUrl = await uploadToCloudinary(avatarFile.value)
    if (uploadedUrl) {
      avatarUrl = uploadedUrl
    }
  }

  const fullName = `${firstName.value} ${lastName.value}`.trim()

  const mutation = `
    mutation addUser($data: CreateUserDto!) {
      addUser(data: $data) {
        id
        name
        email
        role
        avatar
      }
    }
  `

  const variables = {
    data: {
      name: fullName,
      email: email.value,
      password: password.value,
      role: role.value,
      avatar: avatarUrl || "https://i.imgur.com/U4iGx1j.jpg"
    }
  }

  try {
    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query: mutation, variables })
    })

    const data = await res.json()

    if (data.errors) {
      alert('Error: ' + data.errors[0].message)
      return
    }

    alert('User created successfully!')
    router.push(`/`)
  } catch (error) {
    console.error('Create failed:', error)
    alert('Failed to create user.')
  }
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  role.value = ''
  avatar.value = ''
  avatarFile.value = null
  password.value = ''
}
</script>

<template>
  <div class="max-w-4xl ml-84 p-5 bg-white rounded w-full">
    <h2 class="text-2xl font-bold mb-4">Add user account</h2>
    <p class="text-gray-500 mb-8">Add photo and personal details here</p>

    <form class="space-y-8" @submit.prevent="createProfile">
      <div>
        <h3 class="font-bold text-lg mb-3">Account info</h3>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block mb-1 font-semibold">First name</label>
            <input v-model="firstName" type="text" class="w-full border border-gray-300 rounded p-2">
          </div>
          <div>
            <label class="block mb-1 font-semibold">Last name</label>
            <input v-model="lastName" type="text" class="w-full border border-gray-300 rounded p-2">
          </div>
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-semibold">Email address</label>
          <input v-model="email" type="email" class="w-full border border-gray-300 rounded p-2">
        </div>

        <div class="mb-6 relative">
          <label class="block mb-1 font-semibold">Password</label>
          <input v-model="password"  :type="showPassword ? 'text' : 'password'" placeholder="---" class="w-full border border-gray-300 rounded p-2">
        <div
class="absolute right-3 top-[50px] transform -translate-y-1/2 cursor-pointer text-gray-400"
              @click="showPassword = !showPassword">
              <FontAwesomeIcon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </div>
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-semibold">Role</label>
          <input v-model="role" type="text" class="w-full border border-gray-300 rounded p-2">
        </div>
      </div>

      <div>
        <label class="block mb-3 font-semibold">Photo</label>
        <div class="flex items-center space-x-4">
          <div v-if="avatar" class="relative">
            <img :src="avatar" alt="Avatar" class="w-16 h-16 rounded-full object-cover">
            <button
type="button"
              class="absolute -top-1 -right-1 bg-white border border-red-600 text-red-600 rounded-full p-1 hover:bg-red-600 hover:text-white transition"
              @click="removeAvatar">
              🗑️
            </button>
          </div>

          <label
            class="flex flex-col items-center justify-center w-64 h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-purple-700 text-sm font-semibold">
            <input type="file" class="hidden" @change="handleFileUpload">
            Click to upload or drag and drop
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button type="button" class="px-4 py-2 border rounded hover:bg-gray-100" @click="resetForm">
          Reset
        </button>
        <button
type="submit"
          class="px-6 py-2 bg-gradient-to-r  from-pink-500 to-red-500 text-white rounded">
          Add
        </button>
      </div>
    </form>
  </div>
</template>
