import Vue from 'vue';

import { PUBLISH_STATUS } from '@/const';
import API from '@/api';

const state = {
  initialized: false,
  state: null,
  session: null,
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
      commit('state', result.State);
      commit('session', result.Session);
      commit('pushDialog', {
        type: 'ai',
        key: state.dialogs.length,
        text: result.Text
      });
    });
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
      commit('session', result.Session);
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
