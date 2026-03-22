<script setup>
import {ref, computed, onMounted, useTemplateRef} from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
});

const showMore = ref(false);
const isTruncate = ref(true);

const containerRef = useTemplateRef(`container`)
const textRef = useTemplateRef(`text`)

const textClass = computed(() => (!showMore.value && isTruncate.value ? 'break-words line-clamp-3' : 'break-words'));

const toggleText = () => {
    showMore.value = !showMore.value;
};

onMounted(() => {
    isTruncate.value = textRef.value.scrollHeight > containerRef.value.scrollHeight;
});

</script>

<template>
    <div ref="container" class="overflow-hidden">
        <p ref="text" :class="textClass" class="leading-relaxed">
            {{ text }}
        </p>
        <button
            v-if="!showMore && isTruncate"
            type="button"
            @click="toggleText"
            class="mt-1 text-sm font-medium text-brand-600 transition hover:text-brand-800 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 rounded"
        >
            Читать далее…
        </button>
    </div>
</template>
