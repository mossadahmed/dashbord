<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen overflow-hidden">
    <div class="relative flex items-center justify-center">
      <div class="absolute inset-0 pointer-events-none z-0 transition-all duration-200" :style="{
        background: `radial-gradient(300px at ${x}px ${y}px, rgba(239, 62, 44, 0.4), transparent 80%), linear-gradient(to right, rgba(239, 62, 44, 1), rgba(231, 31, 99, 1))`
      }" />
      <div
        class="relative z-10 text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse">
        SIGN UP
      </div>
    </div>

    <div class="flex items-center justify-center bg-white px-8 py-12">
      <div class="w-full max-w-md space-y-6">
        <h2 class="text-3xl font-bold text-gray-800 text-start">Sign In to your Account</h2>
        <p class="text-gray-400 text-start w-full">
          Join us today! Please fill in your details
        </p>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="relative">
            <input v-model="name" type="text" placeholder="Name"
              class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-pink-400 focus:ring-2">
            <div class="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon="user" />
            </div>
          </div>
          <div v-if="nameError" class="text-red-400">{{ nameError }}</div>

          <div class="relative">
            <input v-model="email" type="email" placeholder="Email"
              class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon="envelope" />
            </div>
          </div>
          <div v-if="emailError" class="text-red-400">{{ emailError }}</div>

          <div class="relative">
            <input v-model="password" :type="ShowPassword ? 'text' : 'password'" placeholder="Password"
              class="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon="lock" />
            </div>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
              @click="ShowPassword = !ShowPassword">
              <FontAwesomeIcon :icon="ShowPassword ? 'eye-slash' : 'eye'" />
            </div>
          </div>
          <div v-if="passwordError" class="text-red-400">{{ passwordError }}</div>

          <div class="flex items-center gap-3 mb-2">
            <input v-model="checkboxValue" type="checkbox" class="scale-125">
            <label for="checkbox">Remember me</label>
          </div>
          <div v-if="checkboxError" class="text-red-400">{{ checkboxError }}</div>

          <input type="submit" value="Sign Up"
            class="w-full py-2 px-4 bg-gradient-to-l from-pink-500 to-red-500 text-white rounded-md hover:bg-pink-600 transition">
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const ShowPassword = ref(false)
const x = ref(0)
const y = ref(0)

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })
})

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  checkbox: yup.boolean().oneOf([true], 'You must accept the terms')
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: checkboxValue, errorMessage: checkboxError } = useField('checkbox')

const onSubmit = handleSubmit(async () => {
  try {
    const query = `
      mutation {
        addUser(data: {
          name: "${name.value}",
          email: "${email.value}",
          password: "${password.value}",
          avatar: "https://i.pravatar.cc/150?img=3"
        }) {
          id
          name
          email
        }
      }
    `

    const res = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })

    const result = await res.json()

    if (result.errors) {
      console.error('GraphQL Error:', result.errors)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
  navigateTo('/login')
})
definePageMeta({
  layout: false
})

</script>
