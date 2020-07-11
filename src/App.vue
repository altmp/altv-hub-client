<template>
    <div id="app">
        <navigation></navigation>
        <div class="container">
            <router-view />
        </div>
        <div class="controls">
            <div class="pageControls">
                <button @click="prevPage">Prev</button>
                <button @click="nextPage">Next</button>
            </div>
            <div class="postControls">
                <button @click="tutorialPost">How To Post?</button>
                <button @click="postResource">Post Resource</button>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/navigation.vue';
import { postRequest } from '@/utility/fetch.js';

export default {
    name: 'app',
    components: {
        Navigation
    },
    data() {
        return {
            postResourceUrl: `https://github.com/altmp/altv-hub/pulls`,
            postTutorialUrl: `https://www.youtube.com/watch?v=g2HTRdir6qo`
        };
    },
    methods: {
        postResource() {
            window.open(this.postResourceUrl);
        },
        tutorialPost() {
            window.open(this.postTutorialUrl);
        },
        nextPage() {
            this.$root.$emit('page:Next');
        },
        prevPage() {
            this.$root.$emit('page:Prev');
        }
    }
};
</script>
