<template>
    <div class="resources" v-if="resources.length >= 1">
        <div
            v-for="(resource, index) in paginatedResources[currentPage]"
            :key="index"
            class="resource"
            v-on:click="open(resource.url)"
        >
            <div class="info">
                <div class="title">{{ resource.title }}</div>
                <div class="author">{{ resource.author }}</div>
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
                            fill="#191919"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                </div>
            </div>

            <div class="description">{{ trimDescription(resource.description) }}</div>
            <div class="image cover" :style="`background-image: url('${resource.cover}');`" />
        </div>
    </div>
    <div v-else>
        <div class="lds-heart">
            <div></div>
        </div>
    </div>
</template>

<script>
import { postRequest, getRequest } from '@/utility/fetch.js';

export default {
    name: 'Resources',
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
            perPage: 20
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
            return this.array_chunk(this.formattedResources, this.perPage);
        }
    },
    methods: {
        open(url) {
            window.open(url);
        },
        array_chunk(array, items) {
            return Array.from(Array(Math.ceil(array.length / items)), (_, i) =>
                array.slice(i * items, i * items + items)
            );
        },
        trimDescription(description) {
            if (description.length <= 128) {
                return description;
            }

            return description.slice(0, 128) + '...';
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

            localStorage.setItem('resources', JSON.stringify(storageObject));
        }
    },
    mounted() {
        this.$root.$on('search', query => {
            this.searchQuery = query;
        });

        this.$root.$on('sort', sort => {
            this.sort = sort;
        });

        this.$root.$on('page:Next', () => {
            this.currentPage = this.currentPage + 1;

            if (this.currentPage > this.paginatedResources.length - 1) {
                this.currentPage = this.paginatedResources.length - 1;
            }
        });

        this.$root.$on('page:Prev', () => {
            this.currentPage = this.currentPage - 1;

            if (this.currentPage < 0) {
                this.currentPage = 0;
            }
        });

        this.getResources();
    }
};
</script>
