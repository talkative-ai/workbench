import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import dcopy from 'deep-copy';

import master from './modules/master';
import actors from './modules/actors';
import dialogs from './modules/dialogs';
import zones from './modules/zones';

Vue.use(Vuex);

let ready;
let cleanState = {};

export const initializer = new Promise((resolve, reject) => { ready = resolve; });

localforage.setDriver(localforage.LOCALSTORAGE);

const actions = {
  resetState({ state }, { keepAuth = false, initial = false }) {
    if (initial) {
      cleanState = dcopy(state);
    }

    let freshState = dcopy(cleanState);
    if (keepAuth) {
      freshState.master.user = store.state.master.user;
      freshState.master.token = store.state.master.token;
    }

    store.replaceState(freshState);

    if (!initial) {
      for (let k in store.state) {
        if (k === 'initializing') continue;
        localforage.setItem(`aum.state.v1.${k}`, store.state[k]);
      }
    }

    let p = localforage.iterate((v, k) => {
      let key = k.split('aum.state.v1.');

      key = key.pop().split('.');

      let s = store.state;
      for (let i = 0; i < key.length - 1; i++) {
        s = s[key[i]];
      }
      Vue.set(s, key[key.length - 1], v);
    });

    if (initial) {
      return p.then(() => {
        Vue.set(store.state, 'initializing', false);
        ready(store.state);
        return initializer;
      });
    } else {
      return p.then(() => {
        Vue.set(store.state, 'initializing', false);
        return store.state;
      });
    }
  }
};

const store = new Vuex.Store({
  actions,
  modules: {
    master,
    actors,
    dialogs,
    zones
  }
});

store.dispatch('resetState', { initial: true });

for (let k in store.state) {
  if (k === 'initializing') continue;
  store.watch(state => state[k], (value) => {
    localforage.setItem(`aum.state.v1.${k}`, store.state[k]);
  }, {
    immediate: true,
    deep: true
  });
}

export default store;
