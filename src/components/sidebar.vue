<template>
    <div class="sidebar">
        <a
            :href="'/?q=' + tag"
            v-for="[tag, count] in Object.entries(tagList)"
            :key="tag"
        >{{ `${tag} (${count})` }}</a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            resources: []
        };
    },
    mounted() {
        this.resources = JSON.parse(localStorage.getItem('resources')).resources;
    },
    computed: {
        tagList() {
            const _tagList = {};
            this.resources.forEach(_resource => {
                _resource.tags.forEach(_tag => {
                    if (_tag in _tagList) _tagList[_tag]++;
                    else _tagList[_tag] = 1;
                });
            });

            return _tagList;
        }
    }
};
</script>

<style>
</style>