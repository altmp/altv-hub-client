<template>
    <div id="app">
        <navigation></navigation>
        <div class="container">
            <sidebar></sidebar>
            <router-view />
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
        Sidebar,
    },
    data() {
        return {
            postResourceUrl: `https://github.com/altmp/altv-hub/pulls`,
            postTutorialUrl: `https://www.youtube.com/watch?v=g2HTRdir6qo`,
        };
    },
};
</script>
