<script>
import celexIDJson from "../assets/eurlex/32023D0068.json"
console.log(celexIDJson)

export default {
    data() {
        return {
            celexDocument: celexIDJson,
        };
    },
};
</script>

<template>
    <div v-if="celexDocument && celexDocument.meta && celexDocument.body">
        <!-- META -->
        <section>
            <h1>{{ celexDocument.meta.title }}</h1>
            <ul>
                <li v-for="(tag, tagIndex) in celexDocument.meta.tags">{{ tag }}</li>
            </ul>
        </section>
        <!-- META -->
        <!-- BODY -->
        <section>
            <div v-for="(bodyElement, bodyElementIndex) in celexDocument.body">
                <h2 v-if="bodyElement.isAnchor">{{ bodyElement.text }}</h2>
                <h4 v-else-if="bodyElement.classNameChange">{{ bodyElement.text }}</h4>
                <p v-else>{{ bodyElement.text }}</p>
            </div>
        </section>

        <!-- BODY -->
    </div>
    <div v-else>invalid celexID</div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
