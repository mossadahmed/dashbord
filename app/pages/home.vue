<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="container w-full  ml-60">
        <div v-if="myAcount" class="bg-gray-50 pl-7 h-fit">
            <div class="p-3">
                <div>
                    <h1 class="text-2xl font-bold">Users</h1>
                    <div class=" text-gray-500 p-3 ">
                        <NuxtLink to="/">
                            User >
                        </NuxtLink>
                        <span>
                            Home
                        </span>
                    </div>
                </div>
                <div class="p-3 flex items-center gap-4">
                    <img :src="myAcount.avatar" width="100" alt="" class="rounded-full">
                    <div>
                        <p>
                            {{ myAcount.role }}
                        </p>
                        <p>
                            {{ myAcount.email }}
                        </p>
                    </div>
                </div>

            </div>
            <div class=" border-b-2 p-3 text-red-400 w-fit cursor-pointer">
                <h3>My Account</h3>
            </div>
        </div>
        <div class="p-10">
            <h1 class="font-black text-xl">Account info </h1>
            <div class="p3 mt-5">
                <h3 class="font-bold text-gray-700">
                    Name
                </h3>
                <p class="text-gray-400">{{ myAcount.name }}</p>
            </div>
            <hr class="text-gray-300 mt-3">
            <div class="p3 mt-5">
                <h3 class="font-bold text-gray-700">
                    Email address
                </h3>
                <p class="text-gray-400">{{ myAcount.email }}</p>
            </div>
            <hr class="text-gray-300 mt-3">
            <div class="p3 mt-5">
                <h3 class="font-bold text-gray-700">
                    Role
                </h3>
                <p class="text-gray-400">{{ myAcount.role }}</p>
            </div>
        </div>
        <div
            class=" w-fit px-10 ml-5 border-2 rounded-xl border-gray-300 shadow hover:bg-gradient-to-l from-pink-500 to-red-500 hover:text-white p-2 duration-500">
            <NuxtLink to="/updat-my-profile"> Updat My Profile </NuxtLink>

        </div>
    </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { ref } from 'vue';
import { getuserdata } from '~/composable/getUser';
const myAcount = ref("");

onMounted(async () => {
    myAcount.value = await getuserdata()
})
console.log(myAcount.value);

definePageMeta({
    middleware: 'auth',
})
</script>
