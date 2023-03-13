<template>
    <ul v-if="pills && pills.length" class="grid gap-2 grid-cols-3 text-sm grid-rows-auto">
        <li v-for="(pill, pillIndex) in pills" :key="pill + String(pillIndex)"
            class="flex shrink items-center gap-2 bg-gray-500 text-gray-50 rounded-full p-2">
            <TagIcon class="w-4 h-4" />
            {{ pill }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { TagIcon } from '@heroicons/vue/24/solid'

defineProps<{
    pills?: Array<String>
}>()
</script>
 