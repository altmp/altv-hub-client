<template>
    <div class="resource" @click="open(resource.url)">
        <div class="image cover" :style="`background-image: url('${resource.cover}');`" />
        <div class="info" v-if="resource && resource.title">
            <div class="titleBar">
                <div class="stack">
                    <div class="title">{{ trimTitle(resource.title) }}</div>
                    <div class="author">{{ resource.author }}</div>
                </div>
                <div class="starInfo">
                    <div class="stars">{{ resource.stars }}</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path
                            fill="#ffffff"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
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
        }
    },
    mounted() {
        this.trimAuthor();
    }
};
</script>
