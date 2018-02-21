// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import GSignInButton from 'vue-google-signin-button';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import Vue from 'vue';
import App from './App';
import VueAutosize from 'vue-autosize';
import * as svgicon from 'vue-svgicon';
import Icon from 'vue-awesome/components/Icon';
import VeeValidate from 'vee-validate';
import Multiselect from 'vue-multiselect';
import VueCookie from 'vue-cookie';

import Dialogue from './components/Dialogue/index';
import Sidebar from './components/Sidebar';
import Paper from './components/Paper';

import WButton from './components/elements/Button';
import WToggle from './components/elements/Toggle';
import IconButton from './components/elements/IconButton';
import Grid from './components/elements/Grid';
import PaperText from './components/elements/PaperText';
import Column from './components/elements/Column';

Vue.component('Dialogue', Dialogue);
Vue.component('IconButton', IconButton);
Vue.component('WButton', WButton);
Vue.component('WToggle', WToggle);
Vue.component('Grid', Grid);
Vue.component('Sidebar', Sidebar);
Vue.component('Paper', Paper);
Vue.component('PaperText', PaperText);
Vue.component('Column', Column);
Vue.component('multiselect', Multiselect);

import router from './router';
import store, { initializer } from './store';

Vue.config.productionTip = false;

Vue.use(svgicon, {
  tagName: 'icon'
});

Vue.use(GSignInButton);
Vue.use(VueAutosize);
Vue.use(VeeValidate);
Vue.use(VueCookie);

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
