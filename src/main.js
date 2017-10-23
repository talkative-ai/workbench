// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import GSignInButton from 'vue-google-signin-button';

import Vue from 'vue';
import App from './App';
import * as svgicon from 'vue-svgicon';
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/search';

import DialogNode from './components/DialogNode';
import WButton from './components/elements/Button';
import IconButton from './components/elements/IconButton';

Vue.component('DialogNode', DialogNode);
Vue.component('WButton', WButton);
Vue.component('IconButton', IconButton);

import router from './router';
import store, { initializer } from './store';

Vue.config.productionTip = false;

Vue.use(svgicon, {
  tagName: 'icon'
});

Vue.use(GSignInButton);

Vue.component('fa-icon', Icon);

initializer.then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
      App
    }
  });
});
