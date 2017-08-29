import Vue from 'vue'
import Vuex from 'vuex'

import API from '@/api'

Vue.use(Vuex)

const state = {
  user: null,
  token: null,

  projectID: null,
  projectTitle: null,

  currentZone: null,
  zoneActors: {},

  currentActor: null,
  actorDialogs: {}
}

const actions = {
  createProject ({ commit, state }) {
    return state
  },

  authGoogle ({ commit, state }, googleUser) {
    const profile = googleUser.getBasicProfile()
    API.GetAuthGoogle({
      token: googleUser.getAuthResponse().id_token,
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName()
    })
    .then(result => {
      commit('token', result.headers.get('x-token'))
      return result.json()
    })
    .then(user => {
      commit('user', user)
    })
  }
}

const mutations = {
  token (state, tkn) {
    state.token = tkn
  },

  user (state, user) {
    state.user = user
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
