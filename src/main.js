import Vue from 'vue';
import router from './router';
import App from './App.vue';
import './registerServiceWorker';
import './assets/style.less'

Vue.config.productionTip = false;

new Vue({
    router,
    render: function(h) {
        return h(App);
    }
}).$mount('#app');
