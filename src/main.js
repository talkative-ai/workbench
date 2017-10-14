// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import GSignInButton from 'vue-google-signin-button';

import Vue from 'vue';
import App from './App';
import * as svgicon from 'vue-svgicon';
import router from './router';
import store, { initializer } from './store';

Vue.config.productionTip = false;

Vue.use(svgicon, {
  tagName: 'icon'
});

Vue.use(GSignInButton);

initializer.then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
});
