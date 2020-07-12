<template>
    <div class="resources" v-if="resources.length >= 1">
        <resource-card v-for="resource in paginatedResources" :key="resource.url" :resource="resource" />
    </div>
    <div v-else class="lds-heart">
        <div></div>
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
                asc: false
            },
            repository: 'altmp/altv-hub/contents',
            resources: [],
            currentPage: 0,
            perPage: 12
        };
    },
    computed: {
        formattedResources() {
            let filteredResources = this.resources.filter(resource => {
                const query = this.searchQuery.toLowerCase();
                const _resource = {
                    title: resource.title.toLowerCase(),
                    author: resource.author.toLowerCase(),
                    description: resource.description.toLowerCase()
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

            let sortedResources = filteredResources.sort((a, b) => {
                if (this.sort.asc) {
                    if (this.sort.by == 'updated') {
                        return new Date(a[this.sort.by]) - new Date(b[this.sort.by]);
                    } else {
                        return a[this.sort.by] - b[this.sort.by];
                    }
                } else {
                    if (this.sort.by == 'updated') {
                        return new Date(b[this.sort.by]) - new Date(a[this.sort.by]);
                    } else {
                        return b[this.sort.by] - a[this.sort.by];
                    }
                }
            });

            return sortedResources;
        },
        paginatedResources() {
            let chunkedResources = this.array_chunk(this.formattedResources, this.perPage);
            let resources = [];

            for (let page = 0; page <= this.currentPage; page++) {
                resources = resources.concat(chunkedResources[page]);
            }

            return resources;
        }
    },
    methods: {
        array_chunk(array, items) {
            return Array.from(Array(Math.ceil(array.length / items)), (_, i) =>
                array.slice(i * items, i * items + items)
            );
        },

        async getResourceList() {
            const data = await getRequest(
                `https://raw.githubusercontent.com/altmp/altv-hub/master/dist/resources.json`
            );
            return data;
        },
        async getResources() {
            let resourcesData;

            try {
                resourcesData = JSON.parse(localStorage.getItem('resources'));
            } catch (err) {
                console.log(`No resources found... pulling data.`);
            }

            if (resourcesData && resourcesData.refreshTime && Date.now() < resourcesData.refreshTime) {
                this.resources = resourcesData.resources;
                return;
            }

            const resources = await this.getResourceList();
            const sortedResources = resources.sort((a, b) => {
                return b.stars - a.stars;
            });

            const refreshTime = Date.now() + 60000 * 5;
            const storageObject = {
                refreshTime,
                resources: sortedResources
            };

            this.resources = sortedResources;
            localStorage.setItem('resources', JSON.stringify(storageObject));
        },
        onScroll() {
            let bottomOfWindow =
                Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) +
                    window.innerHeight ===
                document.documentElement.offsetHeight;

            if (bottomOfWindow) {
                this.currentPage = this.currentPage + 1;
                let chunkedResources = this.array_chunk(this.formattedResources, this.perPage);

                if (this.currentPage > chunkedResources.length - 1) {
                    this.currentPage = chunkedResources.length - 1;
                }
            }
        }
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll);

        this.$root.$on('search', query => {
            this.searchQuery = query;
        });

        this.$root.$on('sort', sort => {
            this.sort = sort;
        });

        this.getResources();
    }
};
</script>
