<template>
  <div class="flex items-center justify-center p-4  bg-gray-50">
    <form class="w-full max-w-2xl rounded-lg  p-10 space-y-6" @submit.prevent="updateProfile">
      <h2 class="text-2xl font-semibold text-gray-800">Add user account</h2>
      <p class="text-sm text-gray-500">Add photo and personal details here</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="name" type="text" class="mt-1 w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full border rounded p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" class="mt-1 w-full border rounded p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Avatar</label>
        <div class="flex items-center space-x-4 mt-2">
          <div v-if="avatar" class="relative">
            <img :src="avatar" class="w-16 h-16 rounded-full object-cover" />
            <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs" @click="removeAvatar">
              ✕
            </button>
          </div>

          <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
            <input type="file" class="hidden" @change="handleFileUpload" />
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l8-8m0 0l8 8m-8-8v12" />
            </svg>
            <span class="text-sm text-gray-500 mt-1">Click to upload or drag and drop</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <button type="button" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50" @click="resetForm">
          Reset
        </button>
        <button type="submit" class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const avatar = ref('')
const avatarFile = ref(null)

const userId = ref('1') 
const token = ref('token') 
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    avatarFile.value = file
    avatar.value = URL.createObjectURL(file) 
  }
}

const removeAvatar = () => {
  avatar.value = ''
  avatarFile.value = null
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  avatar.value = ''
  avatarFile.value = null
}

const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = 'unsigned_preset';
  const UPLOAD_PRESET = 'unsigned_preset'      

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    return data.secure_url
  } catch (err) {
    console.error('Upload failed:', err)
    alert('Upload to Cloudinary failed')
    return null
  }
}

const updateProfile = async () => {
  let avatarUrl = avatar.value

  if (avatarFile.value) {
    avatarUrl = await uploadToCloudinary(avatarFile.value)
  }

  const mutation = `
    mutation UpdateUser($id: ID!, $changes: UpdateUserDto!) {
      updateUser(id: $id, changes: $changes) {
        id
        name
        email
        avatar
      }
    }
  `

  const variables = {
    id: userId.value,
    changes: {
      ...(name.value && { name: name.value }),
      ...(email.value && { email: email.value }),
      ...(avatarUrl && { avatar: avatarUrl }),
    }
  }

  try {
    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ query: mutation, variables })
    })

    const data = await res.json()

    if (data.errors) {
      alert('GraphQL error: ' + data.errors[0].message)
      return
    }

    alert('Profile updated successfully!')
  } catch (err) {
    alert('Error updating profile.')
    console.error(err)
  }
}
</script>
