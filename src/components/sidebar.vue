<template>
    <div v-show="resources.length > 0" class="sidebar">
        <div class="search">
            <input type="text" placeholder="Search for resources..." v-model="searchInput" />
            <button @click="setSearch('')" alt="Reset">
                <img src="@/assets/reset-button.svg" />
            </button>
        </div>

        <div class="totalContainer">
            <div class="label">Total Resources:</div>
            <div class="label">{{ resources.length }}</div>
        </div>
        <a @click="setSearch(tag)" v-for="[tag, count] in Object.entries(tagList)" :key="tag" class="tagContainer">
            <div class="tagName">{{ tag }}</div>
            <div class="tagCount">{{ count }}</div>
        </a>
        <button class="toTop" @click="toTheTop()">Scroll to Top</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                resources: [],
                searchInput: '',
            };
        },
        mounted() {
            this.$root.$on('resources:Set', this.setResources);
            this.searchInput = this.$route.query.q || '';

            this.$on('router:SetLink', (linkName) => {
                this.setLink({
                    id: linkName
                });
            });

            this.$root.$on('search', this.setSearch);
        },
        destroyed() {
            this.$root.off('resources:Set', this.setResources);
        },
        methods: {
            setResources(resources) {
                this.resources = resources;
            },
            toTheTop() {
                this.$root.$emit('resources:ToTop');
            },
            setSearch(tag) {
                this.searchInput = tag;
            },
            search() {
                this.$root.$emit('search', this.searchInput);
            }
        },
        computed: {
            tagList() {
                let _tagList = {};
                this.resources.forEach((_resource) => {
                    _resource.tags.forEach((_tag) => {
                        if (_tag in _tagList) {
                            _tagList[_tag]++;
                        } else {
                            _tagList[_tag] = 1;
                        }
                    });
                });

                const _tagListSorted = {};

                let tags = Object.keys(_tagList);
                tags = tags.sort();

                tags.forEach((tag) => {
                    _tagListSorted[tag] = _tagList[tag];
                });

                return _tagListSorted;
            },
        },
        watch: {
            searchInput() {
                this.search();

                // we clear the query if input is clean too
                const query =
                    this.searchInput.length !== 0 ?
                    Object.assign({}, this.$route.query, {
                        q: this.searchInput
                    }) :
                    Object.assign({}, {});

                // it gives navigation duplication error when routing to the same query twice at initial load with search string included in the url
                if (this.$route.query.q !== query.q) this.$router.push({
                    query
                });
            },
        }
    };
</script>