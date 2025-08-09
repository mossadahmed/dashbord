<script setup lang="ts">
import SideBar from '~/component/SideBar.vue';

</script>

<template>
  <div class="flex relative">
    <SideBar />
    <main class="p-6 absolute">
      <slot />
    </main>
  </div>
</template>