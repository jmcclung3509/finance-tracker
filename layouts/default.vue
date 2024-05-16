<template>
    <div class="container mx-auto max-w-4xl">
        <Header></Header>
        <main class="my-10">
            <slot />

        </main>
    </div>
</template>

<script setup>
useHead({
    link:[
        { rel: 'preconnect', href: "https://fonts.googleapis.com"},
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
            crossorigin: "",
        }
    ]
})
</script>

<style>
body{
    font-family: 'Inter', sans-serif;
    margin-top: 2rem;
    margin-bottom: 2rem;
}
body{
    @apply bg-bg-color text-default-text;
}

</style>