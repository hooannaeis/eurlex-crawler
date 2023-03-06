<template>
    <div>
        <h1>test component</h1>
        <div>---</div>
        <div>type: {{ type }}</div>
        <div>id: {{ id }}</div>
        <div>date: {{ date }}</div>

        <section>
            <PillList :pills="docTags"></PillList>
        </section>
        <section>
            <PillList :pills="referencesRaw"></PillList>
        </section>
        <div>---</div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    type?: String,
    id?: String,
    date?: String,
    docTags?: Array<String>,
    referencesTokenized?: Array<String>,
    referencesRaw?: Array<String>
}>()
</script>
