<template>
    <div v-show="resources.length > 0" class="sidebar">
        <div class="totalContainer">
            <div class="label">Total Resources:</div>
            <div class="label">{{ resources.length }}</div>
        </div>
        <a
            @click="setSearch(tag)"
            v-for="[tag, count] in Object.entries(tagList)"
            :key="tag"
            class="tagContainer"
        >
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
        };
    },
    mounted() {
        this.$root.$on('resources:Set', this.setResources);
    },
    destroyed() {
        this.$root.off('resources:Set', this.setResources);
    },
    methods: {
        setResources(resources) {
            this.resources = resources;
        },
        setSearch(tag) {
            this.$root.$emit('search', tag);
        },
        toTheTop() {
            this.$root.$emit('resources:ToTop');
        },
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
};
</script>