<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen overflow-hidden">
    <div class="relative flex items-center justify-center">
      <div class="absolute inset-0 pointer-events-none z-0 transition-all duration-200" :style="{
        background: `radial-gradient(300px at ${x}px ${y}px, rgba(239, 62, 44, 0.4), transparent 80%), linear-gradient(to right, rgba(239, 62, 44, 1), rgba(231, 31, 99, 1))`
      }" />
      <div
        class="relative z-10 text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse">
        SING . IN
      </div>
    </div>

    <div class="flex items-center justify-center bg-white px-8 py-12">
      <div class="w-full max-w-md space-y-6">
        <h2 class="text-3xl font-bold text-gray-800 text-start">Sign In to your Account </h2>
        <p class="text-gray-400 text-start w-full ">
          Welcome back! please enter your detail
        </p>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <div class="relative">
              <input v-model="email" type="email"
                class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Email">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon="envelope" />
              </div>
            </div>
          </div>
          <div v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</div>

          <div>
            <div class="relative">
              <input v-model="password" :type="ShowPassword ? 'text' : 'password'"
                class="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Password">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon="lock" />
              </div>
              <div class="absolute right-3 top-1/2 transform text-gray-400 -translate-y-1/2 cursor-pointer"
                @click="ShowPassword = !ShowPassword">
                <FontAwesomeIcon :icon="ShowPassword ? 'eye-slash' : 'eye'" />
              </div>

            </div>
            <div v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</div>

            <div class=" flex items-center justify-between p-3">
              <div class="flex items-center gap-3 mb-2">
                <input id="checkbox" v-model="checkbox" type="checkbox" class="scale-125" name="">
                <label for="checkbox">Remember me</label>
              </div>
              <p class="text-pink-500">
                Forgot Password?
              </p>
            </div>
            <div v-if="checkboxError" class="text-red-500 text-sm mb-5">{{ checkboxError }}</div>


            <input type="submit" placeholder="Sign In"
              class="w-full py-2 px-4 bg-gradient-to-l from-pink-500 to-red-500 text-white rounded-md hover:bg-pink-600 transition">

            <p class="text-center text-gray-500 mt-5">
              Don't have an account? <NuxtLink to='/signup' class="text-pink-500">Sign Up</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'

const x = ref(0)
const y = ref(0)
const ShowPassword = ref(false)
const useStore = useUserStore()

const schema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').notRequired(['1234567890'], 'Password is too common').required('Password is required'),
  checkbox: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('You must accept the terms and conditions')
})
const { handleSubmit } = useForm({
  validationSchema: schema
})
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: checkbox, errorMessage: checkboxError } = useField('checkbox')
const onSubmit = handleSubmit(async (values) => {
  const success = await useStore.logIn(email.value, password.value)
  console.log(values)
  if (success && useStore.token) {
    navigateTo('/')
  } else {
    alert('Login failed. Please check your credentials.')
  }
})
onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })

})
definePageMeta({
  middleware: 'auth',
  layout:false

})
</script>
