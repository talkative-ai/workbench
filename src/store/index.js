import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import dcopy from 'deep-copy';

import master from './modules/master';
import demo from './modules/demo';
import project from './modules/project';
import actors from './modules/actors';
import dialogs from './modules/dialogs';
import zones from './modules/zones';

Vue.use(Vuex);

let ready;
let cleanState = {};

export const initializer = new Promise((resolve, reject) => { ready = resolve; });

localforage.setDriver(localforage.LOCALSTORAGE);

const actions = {
  resetState({ state, commit }, { keepAuth = false, initial = false }) {
    if (initial) {
      cleanState = dcopy(state);
    }

    let freshState = dcopy(cleanState);
    if (keepAuth) {
      freshState.master.user = store.state.master.user;
      freshState.master.token = store.state.master.token;
      freshState.master.intercomHMAC = store.state.master.intercomHMAC;
    }

    store.replaceState(freshState);

    if (!initial) {
      for (let k in store.state) {
        if (k === 'initializing') continue;
        localforage.setItem(`talkative.state.v1.${k}`, store.state[k]);
      }
    }

    let p = localforage.iterate((v, k) => {
      let key = k.split('talkative.state.v1.');

      key = key.pop().split('.');

      let s = store.state;
      for (let i = 0; i < key.length - 1; i++) {
        s = s[key[i]];
      }
      Vue.set(s, key[key.length - 1], v);
    });

    if (initial) {
      return p.then(() => {
        commit('project/initializing', false, { root: true });
        ready(store.state);
        return initializer;
      });
    } else {
      return p.then(() => {
        commit('project/initializing', false, { root: true });
        return store.state;
      });
    }
  }
};

const store = new Vuex.Store({
  actions,
  modules: {
    master,
    demo,
    project,
    actors,
    dialogs,
    zones
  }
});

store.dispatch('resetState', { initial: true });

let writeStore = {};

for (let k in store.state) {
  if (k === 'initializing') continue;
  store.watch(state => state[k], (value) => {
    if (writeStore) {
      clearTimeout(writeStore);
    }
    writeStore[k] = setTimeout(() => localforage.setItem(`talkative.state.v1.${k}`, store.state[k]), 250);
  }, {
    immediate: true,
    deep: true
  });
}

export default store;
