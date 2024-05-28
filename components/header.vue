<template>
  <header class="flex justify-between items-center">
    <nuxt-link to="/" class="text-2xl font-bold">Finance Tracker</nuxt-link>
    <div class="flex justify-end gap-4 items-center">
      <UToggle class="bg-gray-200  dark:bg-gray-500" v-model="selected" @click="handleToggle" />
      <UAvatar     src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
    </div>

  </header>
</template>

<script setup>
const selected = ref(false)


const handleToggle = ()=>{
    colorMode.preference = 
    selected.value = !selected.value;
    selected.value ? colorMode.preference = 'dark' : colorMode.preference='light'
 
}

const colorMode = useColorMode()
</script>


