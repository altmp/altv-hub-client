<template>
    <div id="app">
        <navigation></navigation>
        <div class="container">
            <sidebar></sidebar>

            <router-view />
        </div>
        <div class="controls">
            <div class="postControls">
                <button @click="tutorialPost">How To Post?</button>
                <button @click="postResource">Post Resource</button>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Sidebar from '@/components/sidebar.vue';

import { postRequest } from '@/utility/fetch.js';

export default {
    name: 'app',
    components: {
        Navigation,
        Sidebar
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
        }
    }
};
</script>
