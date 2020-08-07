<template>
    <div
        class="resources"
        v-if="paginatedResources.length >= 1"
        v-on:scroll.passive="onScroll"
        ref="resources"
    >
        <resource-card
            v-for="resource in paginatedResources"
            :key="resource.url"
            :resource="resource"
        />
    </div>
    <div v-else-if="searchQuery && !paginatedResources.length" style="margin: 0 auto;">
        <div style="margin: 40px auto;">No resources found for the specified query</div>
    </div>
    <div v-else style="margin: 0 auto;">
        <div class="lds-heart">
            <div></div>
        </div>
    </div>
</template>

<script>
import { postRequest, getRequest } from '@/utility/fetch.js';
import ResourceCard from '@/components/resource-card.vue';

export default {
    name: 'Resources',
    components: { ResourceCard },
    data() {
        return {
            searchQuery: '',
            sort: {
                by: 'stars',
                asc: false,
            },
            resources: [],
            currentPage: 0,
            perPage: 30,
            resourcesUrl: `https://raw.githubusercontent.com/altmp/altv-hub/master/dist/resources.json`,
        };
    },
    computed: {
        formattedResources() {
            let filteredResources = this.resources.filter((resource) => {
                const query = this.searchQuery.toLowerCase();
                const _resource = {
                    title: resource.title.toLowerCase(),
                    author: resource.author.toLowerCase(),
                    description: resource.description.toLowerCase(),
                };

                if (
                    _resource.title.includes(query) ||
                    _resource.author.includes(query) ||
                    _resource.description.includes(query) ||
                    resource.tags.includes(query)
                ) {
                    return resource;
                }
            });

            return filteredResources;
        },
        paginatedResources() {
            let chunkedResources = this.array_chunk(this.formattedResources, this.perPage);
            let resources = [];

            for (let page = 0; page <= this.currentPage; page++) {
                if (chunkedResources[page] == undefined) continue;
                resources = resources.concat(chunkedResources[page]);
            }

            return resources;
        },
    },
    methods: {
        array_chunk(array, items) {
            return Array.from(Array(Math.ceil(array.length / items)), (_, i) =>
                array.slice(i * items, i * items + items)
            );
        },
        async getResources() {
            const resources = await getRequest(this.resourcesUrl);
            const refreshTime = Date.now() + 60000 * 5;
            const storageObject = {
                refreshTime,
                resources,
            };

            this.resources = resources;
            this.$root.$emit('resources:Set', resources);
        },
        onScroll(e) {
            if (e.target.scrollTop >= e.target.scrollHeight - 1500) {
                this.currentPage = this.currentPage + 1;
                let chunkedResources = this.array_chunk(this.formattedResources, this.perPage);

                if (this.currentPage > chunkedResources.length - 1) {
                    this.currentPage = chunkedResources.length - 1;
                    if (this.currentPage < 0) this.currentPage = 0;
                }
            }
        },
        toTop() {
            if (!this.$refs.resources || !this.$refs.resources.scrollTop) {
                return;
            }

            const interval = setInterval(() => {
                if (this.$refs.resources.scrollTop !== 0) {
                    this.$refs.resources.scrollTop -= 200;
                }

                if (this.$refs.resources.scrollTop <= 0) {
                    this.$refs.resources.scrollTop = 0;
                    clearInterval(interval);
                }
            }, 20);
        },
    },
    mounted() {
        this.$root.$on('search', (query) => {
            this.searchQuery = query;
        });

        this.$root.$on('resources:ToTop', this.toTop);

        this.getResources();
    },
};
</script>
