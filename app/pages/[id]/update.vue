<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userDetails } from '~/composable/dataUser' 

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const role = ref('')
const avatar = ref('')
const avatarFile = ref<File | null>(null)

const showPassword = ref(false)
const password = ref('') 

onMounted(async () => {
  try {
    const user = await userDetails(id)
    if (user.name) {
      const parts = user.name.split(' ')
      firstName.value = parts[0] || ''
      lastName.value = parts.slice(1).join(' ') || ''
    }
    email.value = user.email
    avatar.value = user.avatar
    role.value = user.role
  } catch (error) {
    console.error('Failed to load user data', error)
  }
})

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

const updateProfile = async () => {
  let avatarUrl = avatar.value

  if (avatarFile.value) {
    const uploadedUrl = await uploadToCloudinary(avatarFile.value)
    if (uploadedUrl) {
      avatarUrl = uploadedUrl
    }
  }

  const fullName = `${firstName.value} ${lastName.value}`.trim()

  const mutation = `
    mutation UpdateUser($id: ID!, $changes: UpdateUserDto!) {
      updateUser(id: $id, changes: $changes) {
        id
        name
        email
        avatar
        role
      }
    }
  `
  const variables = {
    id,
    changes: {
      ...(fullName && { name: fullName }),
      ...(email.value && { email: email.value }),
      ...(avatarUrl && { avatar: avatarUrl }),
      ...(role.value && { role: role.value }),
    }
  }

  try {
    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation, variables })
    })

    const data = await res.json()

    if (data.errors) {
      alert('Error: ' + data.errors[0].message)
      return
    }

    alert('Profile updated successfully!')
    router.push(`/user/${id}`)
  } catch (error) {
    console.error('Update failed:', error)
    alert('Failed to update profile.')
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

const deleteUser = async () => {
  const confirmed = confirm('Are you sure you want to delete this user?')
  if (!confirmed) return

  const mutation = `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id) {
        id
      }
    }
  `

  const variables = { id }

  try {
    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation, variables })
    })

    const data = await res.json()

    if (data.errors) {
      alert('Error: ' + data.errors[0].message)
      return
    }

    alert('User deleted successfully!')
    router.push('/')
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Failed to delete user.')
  }
}
</script>

<template>
  <div class="max-w-4xl ml-84 p-5 bg-white rounded w-full">
    <h2 class="text-2xl font-bold mb-4">Add user account</h2>
    <p class="text-gray-500 mb-8">Add photo and personal details here</p>

    <form class="space-y-8" @submit.prevent="updateProfile">

      <div>
        <h3 class="font-bold text-lg mb-3">Account info</h3>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block mb-1 font-semibold">First name</label>
            <input v-model="firstName" type="text" class="w-full border border-gray-300 rounded p-2" >
          </div>
          <div>
            <label class="block mb-1 font-semibold">Last name</label>
            <input v-model="lastName" type="text" class="w-full border border-gray-300 rounded p-2" >
          </div>
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-semibold">Email address</label>
          <input v-model="email" type="email" class="w-full border border-gray-300 rounded p-2" >
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-semibold">Password</label>
          <input v-model="password" type="password" placeholder="---" class="w-full border border-gray-300 rounded p-2" >
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-semibold">Role</label>
          <input v-model="role" type="text" class="w-full border border-gray-300 rounded p-2" >
        </div>
      </div>

      <div>
        <label class="block mb-3 font-semibold">Photo</label>

        <div class="flex items-center space-x-4">
          <div v-if="avatar" class="relative">
            <img :src="avatar" alt="Avatar" class="w-16 h-16 rounded-full object-cover" >
            <button type="button" class="absolute -top-1 -right-1 bg-white border border-red-600 text-red-600 rounded-full p-1 hover:bg-red-600 hover:text-white transition" @click="removeAvatar">
              🗑️
            </button>
          </div>

          <label
            class="flex flex-col items-center justify-center w-64 h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-purple-700 text-sm font-semibold"
          >
            <input type="file" class="hidden" @change="handleFileUpload" >
            Click to upload or drag and drop
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 border rounded hover:bg-gray-100"
          @click="resetForm"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded hover:from-pink-600 hover:to-red-600"
        >
          Add
        </button>
      </div>

    </form>
  </div>
</template>
