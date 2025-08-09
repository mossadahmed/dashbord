<template>
  <div class=" mx-auto pl-45 mt-12 bg-white rounded-xl shadow-lg ring-1 ring-gray-200">
    <h1 class="text-5xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
      Welcome to Our Content Page
    </h1>
    <p class="text-gray-700 text-lg leading-relaxed mb-8 max-w-prose mx-auto text-center">
      Here you can showcase your content, whether it’s articles, educational texts, or illustrative images.
      This page is designed to be simple and flexible to suit your project needs with a great user experience.
    </p>

    <div class="overflow-hidden rounded-lg shadow-md mb-10 max-w-3xl mx-auto">
      <img 
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" 
        alt="Illustration" 
        class="w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

    <button 
      class="block mx-auto px-8 py-4   bg-gradient-to-l from-pink-500 to-red-500 text-white  hover:text-black  rounded transition"
      @click="handleClick"
      aria-label="Click me button"
    >
      Click Me
    </button>
  </div>
</template>

<script setup>
const handleClick = () => {
  alert('Button clicked!')
}
</script>
