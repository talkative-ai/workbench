import Vue from 'vue';

import { PUBLISH_STATUS } from '@/const';
import API from '@/api';

const state = {
  initialized: false,
  state: null,
  error: false,
  initialState: null,
  dialogs: []
};

const actions = {

  async initialize({ commit }) {
    commit('resetDialogs');
    commit('initialized', false);
    await API.DemoInitialize();
    return new Promise((resolve, reject) => {
      function getStatus() {
        let status = API.GetDemoStatus();
        if (status === PUBLISH_STATUS.NotPublished || status === PUBLISH_STATUS.Publishing) {
          setTimeout(() => getStatus(), 250);
        } else {
          resolve();
        }
      }
      getStatus();
    }).then(() => {
      return API.DemoMessage('', true);
    }).then(result => {
      commit('initialized', true);
      commit('error', false);
      commit('state', result.State);
      commit('initialState', result.State);
      commit('pushDialog', {
        type: 'ai',
        key: state.dialogs.length,
        text: result.Text
      });
    }).catch(() => {
      commit('error', true);
    });
  },

  restart({ state, commit }) {
    let startDialog = state.dialogs.shift();
    commit('resetDialogs');
    commit('pushDialog', startDialog);
    commit('state', state.initialState);
  },

  sendMessage({ state, commit }, message) {
    commit('pushDialog', {
      type: 'user',
      key: state.dialogs.length,
      text: message
    });
    return API.DemoMessage(message)
    .then(result => {
      commit('state', result.State);
      commit('pushDialog', {
        type: 'ai',
        key: state.dialogs.length,
        text: result.Text
      });
    });
  }

};

const mutations = {
  initialized(state, value) {
    Vue.set(state, 'initialized', value);
  },

  resetDialogs(state) {
    Vue.set(state, 'dialogs', []);
  },

  pushDialog(state, value) {
    state.dialogs.push(value);
  },

  session(state, value) {
    Vue.set(state, 'session', value);
  },

  state(state, value) {
    Vue.set(state, 'state', value);
  },

  initialSession(state, value) {
    Vue.set(state, 'initialSession', value);
  },

  initialState(state, value) {
    Vue.set(state, 'initialState', value);
  },

  error(state, value) {
    Vue.set(state, 'error', value);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
