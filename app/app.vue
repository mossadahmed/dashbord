<template>
  <div>
    <div v-if="loading" class="min-h-screen relative overflow-hidden bg-black">
      <div class="fixed inset-0 pointer-events-none z-0 transition-all duration-500" :style="{
        background: `radial-gradient(300px at ${x}px ${y}px, rgba(239, 62, 44, 1), transparent 80%), linear-gradient(to right, rgba(239, 62, 44, 1), rgba(231, 31, 99, 1))`
      }">
        <div class="absolute inset-0 flex items-center justify-center z-10">
          <div class="relative">
            <div class="w-32 h-32 rounded-full border-4 border-red-300 transparent animate-ping shadow-lg" />

            <div
              class="absolute inset-0 flex items-center justify-center font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              WELCOM...
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex">
        <div>
          <NuxtLayout />
        </div>
        <div class="w-[100%] ">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const x = ref(0)
const y = ref(0)
const loading = ref(true)
onMounted(() => {
  setTimeout(() => {
    loading.value = false

  }, 2000);
  window.addEventListener('mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })
})
</script>
