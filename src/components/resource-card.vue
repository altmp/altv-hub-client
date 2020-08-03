<template>
    <div class="resource" @click="open(resource.url)">
        <div class="image cover" :style="`background-image: url('${resource.cover}');`" />
        <div class="info" v-if="resource && resource.title">
            <div class="titleBar">
                <div class="stack">
                    <div class="title">{{ trimTitle(resource.title) }}</div>
                    <div class="author">{{ resource.author }}</div>
                    <div class="tags">{{ formatTags(resource.tags) }}</div>
                </div>
            </div>
            <p>{{ trimDescription(resource.description) }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['resource'],
    methods: {
        open(url) {
            window.open(url);
        },
        trimDescription(description) {
            if (description.length <= 512) {
                return description;
            }

            return description.slice(0, 512) + '...';
        },
        trimAuthor() {
            this.resource.author = this.resource.author.replace('resources/', '');
        },
        trimTitle(title) {
            if (title.length <= 35) {
                return title;
            }

            return title.slice(0, 35) + '...';
        },
        getDecorator(title) {
            let decorator = title.match(/\[.*]/g);
            let decor = 'Data';

            if (Array.isArray(decorator)) {
                decor = decorator[0].replace(/["]/g, '');
            }

            return decor;
        },
        formatTags(tags) {
            // show only 6? tags
            return tags
                .slice(0, 6)
                .map((_tag) => `#${_tag}`)
                .join(' ');
        },
    },
    mounted() {
        this.trimAuthor();
    },
};
</script>
