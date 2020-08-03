<template>
    <div class="navigation" ref="navbar">
        <a class="logo" href="https://altv.mp/" target="_blank">
            <img src="../assets/logo.svg" />
        </a>
        <div class="buttons">
            <a @click="tutorialPost" alt="How to Post">How to Post?</a>
            <a @click="postResource" alt="Post Resource">Post Resource</a>
        </div>
        <div class="kek"></div>
    </div>
</template>

<script>
    export default {
        name: 'Navigation',
        props: ['auth'],
        data() {
            return {
                activePath: 'home',
                currentSort: {
                    by: 'stars',
                    asc: false,
                },
                postResourceUrl: `https://github.com/altmp/altv-hub/pulls`,
                postTutorialUrl: `https://www.youtube.com/watch?v=g2HTRdir6qo`,
            };
        },
        methods: {
            isActive(name) {
                return this.activePath === name ? {
                    active: true
                } : {};
            },
            setLink(e) {
                const id = e.target.id;
                this.activePath = id;
            },
            postResource() {
                window.open(this.postResourceUrl);
            },
            tutorialPost() {
                window.open(this.postTutorialUrl);
            },
            setSearch(value) {
                this.$root.$emit('search', value);
            }
        }
    };
</script>