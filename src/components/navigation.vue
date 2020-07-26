<template>
    <div class="navigation" ref="navbar">
        <a class="logo" href="https://altv.mp/" target="_blank">
            <img src="../assets/logo.svg" />
        </a>
        <input type="text" placeholder="Search for resources..." v-model="searchInput" />
        <div class="buttons">
            <button class="button">
                <a @click="setSearch('')" alt="Reset">Reset</a>
            </button>
            <button class="button">
                <a @click="tutorialPost" alt="How to Post">How to Post?</a>
            </button>
            <button class="button">
                <a @click="postResource" alt="Post Resource">Post Resource</a>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: ['auth'],
    data() {
        return {
            searchInput: '',
            activePath: 'home',
            currentSort: {
                by: 'stars',
                asc: false,
            },
        };
    },
    methods: {
        isActive(name) {
            return this.activePath === name ? { active: true } : {};
        },
        setLink(e) {
            const id = e.target.id;
            this.activePath = id;
        },
        setSearch(tag) {
            this.searchInput = tag;
        },
        search() {
            this.$root.$emit('search', this.searchInput);
        },
        postResource() {
            window.open(this.postResourceUrl);
        },
        tutorialPost() {
            window.open(this.postTutorialUrl);
        },
    },
    mounted() {
        this.searchInput = this.$route.query.q || '';

        this.$on('router:SetLink', (linkName) => {
            this.setLink({ id: linkName });
        });

        this.$root.$on('search', this.setSearch);
    },
    watch: {
        searchInput() {
            this.search();

            // we clear the query if input is clean too
            const query =
                this.searchInput.length !== 0
                    ? Object.assign({}, this.$route.query, { q: this.searchInput })
                    : Object.assign({}, {});

            // it gives navigation duplication error when routing to the same query twice at initial load with search string included in the url
            if (this.$route.query.q !== query.q) this.$router.push({ query });
        },
    },
};
</script>
