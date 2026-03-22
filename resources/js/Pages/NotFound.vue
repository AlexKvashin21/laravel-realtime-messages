<template>
    <div class="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Ошибка
        </p>
        <h1 class="bg-gradient-to-br from-slate-800 to-brand-700 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">
            404
        </h1>
        <h2 class="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">
            Страница не найдена
        </h2>
        <p class="mt-3 max-w-md text-slate-600">
            Такой страницы не существует или ссылка устарела.
        </p>
        <router-link
            to="/"
            class="mt-8 inline-flex items-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-indigo-700"
        >
            На главную
        </router-link>
    </div>
</template>
<script setup>
</script>
