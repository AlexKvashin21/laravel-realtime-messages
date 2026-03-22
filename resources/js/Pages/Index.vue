<script setup>

import MainLayout from "@/Layouts/MainLayout.vue";
import {onBeforeMount, reactive, ref} from "vue";
import axios from "axios";
import {createToaster} from "@meforma/vue-toaster";
import {format} from "date-fns";
import {ru} from 'date-fns/locale';
import MoreText from "@/Components/MoreText.vue";
import Spinner from "@/Components/Spinner.vue";

const toaster = createToaster({
    position: 'top-right'
});

const categories = ref([])
const tweets = ref({})

const isLoadingSendMessage = ref(false)
const isLoadingTweets = ref(false)
const isLoadingCategories = ref(false)
const isLoadingMoreTweets = ref(false)

const page = ref(1)
const perPage = ref(10)

const form = reactive({
    category_id: 0,
    username: null,
    content: null,
});

const sendMessage = () => {
    if (form.category_id === 0) {
        return toaster.error('Выберете категорию!')
    }

    if (form.category_id && form.username && form.content && !isLoadingSendMessage.value) {
        isLoadingSendMessage.value = true

        axios.post(`/api/tweet`, form).then(res => {
            if (res) {
                toaster.success('Сообщение отправлено')
            }

            form.category_id = 0
            form.username = null
            form.content = null
        }).catch(err => {
            console.error(err)

            toaster.error('Произошла ошибка')
        }).finally(() => {
            isLoadingSendMessage.value = false;
        })
    }
}

const showMoreMessages = () => {
    page.value += 1

    isLoadingMoreTweets.value = true

    axios.get(`/api/tweet?per_page=${perPage.value}&page=${page.value}`).then(res => {
        tweets.value.data.push(...res.data.data)
        tweets.value.last_page = res.data.last_page
    }).catch(err => {
        console.error(err)
        page.value -= 1
    }).finally(() => {
        isLoadingMoreTweets.value = false;
    })
}

const formattedDate = (createdAt) => {
    return format(new Date(createdAt), 'd MMMM yyyy, HH:mm', {locale: ru});
}

const authorInitials = (name) => {
    if (!name || typeof name !== 'string') return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
}

const getAllCategories = async () => {
    isLoadingCategories.value = true

    axios.get('api/category/all').then(res => {
        categories.value = res.data
    }).catch(err => {
        console.error(err)
    }).finally(() => {
        isLoadingCategories.value = false;
    })
}

const getTweets = async () => {
    isLoadingTweets.value = true

    await axios.get('api/tweet').then(res => {
        tweets.value = res.data
    }).catch(err => {
        console.error(err)
    }).finally(() => {
        isLoadingTweets.value = false;
    })
}

onBeforeMount(async () => {
    await getAllCategories()
    await getTweets()

    Echo.channel('tweet')
        .listen('.store.tweet', (res) => {
            tweets.value.data.unshift(res.tweet);
        });
})

</script>

<template>
    <MainLayout>
        <header class="mb-10 text-center sm:mb-12">
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Лента
            </p>
            <h1 class="bg-gradient-to-r from-slate-900 via-brand-800 to-indigo-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                Сообщения и твиты
            </h1>
            <p class="mx-auto mt-3 max-w-md text-sm text-slate-600">
                Выберите категорию, представьтесь и отправьте сообщение — оно появится в ленте в реальном времени.
            </p>
        </header>

        <section
            class="overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-card backdrop-blur-sm"
            aria-labelledby="form-heading"
        >
            <div class="border-b border-slate-100/80 bg-gradient-to-r from-brand-50/80 to-indigo-50/50 px-6 py-4">
                <h2 id="form-heading" class="text-lg font-semibold text-slate-900">
                    Новое сообщение
                </h2>
                <p class="mt-0.5 text-sm text-slate-500">
                    Все поля обязательны для отправки
                </p>
            </div>

            <div class="p-6 sm:p-8">
                <form @submit.prevent="sendMessage" class="flex flex-col gap-5">
                    <div>
                        <label for="category" class="mb-1.5 block text-sm font-medium text-slate-700">
                            Категория
                        </label>
                        <div class="relative">
                            <select
                                v-model="form.category_id"
                                name="category"
                                id="category"
                                class="block w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-800 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                :disabled="categories.length < 1"
                            >
                                <option v-if="categories.length < 1" :value="0" disabled selected hidden>
                                    Загрузка...
                                </option>
                                <option v-else :value="0" disabled selected hidden>
                                    Выберите категорию
                                </option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.title }}
                                </option>
                            </select>
                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <label
                        for="username"
                        class="relative block rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
                    >
                        <input
                            v-model="form.username"
                            type="text"
                            id="username"
                            autocomplete="name"
                            class="peer w-full rounded-xl border-none bg-transparent px-4 pb-2.5 pt-6 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:ring-0"
                            placeholder="Имя"
                            required
                        />
                        <span
                            class="pointer-events-none absolute start-4 top-3 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-600"
                        >
                            Имя
                        </span>
                    </label>

                    <label
                        for="message"
                        class="relative block rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
                    >
                        <input
                            v-model="form.content"
                            type="text"
                            id="message"
                            class="peer w-full rounded-xl border-none bg-transparent px-4 pb-2.5 pt-6 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:ring-0"
                            placeholder="Сообщение"
                            required
                        />
                        <span
                            class="pointer-events-none absolute start-4 top-3 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-600"
                        >
                            Сообщение
                        </span>
                    </label>

                    <div class="pt-1 mx-auto">
                        <button
                            type="submit"
                            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-brand-600/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
                            :disabled="isLoadingSendMessage"
                        >
                            <span v-if="isLoadingSendMessage" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                            {{ isLoadingSendMessage ? 'Отправка…' : 'Отправить' }}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <div class="my-10 flex items-center gap-4 sm:my-12">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-200" />
            <h2 class="shrink-0 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Лента твитов
            </h2>
            <div class="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-200" />
        </div>

        <div v-if="isLoadingTweets" class="flex justify-center py-16">
            <Spinner class="w-[52px]" />
        </div>

        <div v-else-if="tweets?.data?.length > 0" class="flex flex-col gap-4">
            <article
                v-for="tweet in tweets.data"
                :key="`tweet-${tweet.id}`"
                class="group relative overflow-hidden rounded-2xl border border-slate-100/90 bg-white/95 p-5 shadow-soft transition hover:border-brand-100 hover:shadow-card sm:p-6"
            >
                <div class="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-brand-500 to-indigo-600 opacity-90" aria-hidden="true" />

                <div class="flex gap-4 pl-2">
                    <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-brand-600/30"
                        :title="tweet.username"
                    >
                        {{ authorInitials(tweet.username) }}
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <p class="text-base font-semibold text-slate-900">
                                {{ tweet.username }}
                            </p>
                            <time
                                :datetime="tweet.created_at"
                                class="text-xs text-slate-500"
                            >
                                {{ formattedDate(tweet.created_at) }}
                            </time>
                        </div>

                        <div class="mt-2 text-slate-700">
                            <MoreText :text="tweet.content" />
                        </div>

                        <div class="mt-4">
                            <span
                                class="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/10"
                            >
                                {{ tweet.category }}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </div>

        <div
            v-else
            class="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center"
        >
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <p class="text-lg font-medium text-slate-800">
                Пока нет твитов
            </p>
            <p class="mt-1 text-sm text-slate-500">
                Станьте первым — отправьте сообщение выше.
            </p>
        </div>

        <div v-if="tweets.last_page > page" class="mt-8 flex justify-center">
            <button
                type="button"
                @click.prevent="showMoreMessages"
                :disabled="isLoadingMoreTweets"
                class="inline-flex min-w-[180px] items-center justify-center rounded-xl border-2 border-brand-200 bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span
                    v-if="isLoadingMoreTweets"
                    class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent"
                    aria-hidden="true"
                />
                {{ isLoadingMoreTweets ? 'Загрузка…' : 'Показать ещё' }}
            </button>
        </div>

    </MainLayout>
</template>
