import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

import API from '@/api'

Vue.use(Vuex)

let ready
export default new Promise((resolve, reject) => { ready = resolve })

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

localforage.iterate((v, k) => {
  let statek = k.split('aum.state.')
  if (statek.length <= 1) return

  statek = statek.pop()

  state[statek] = v
}).then(ready)

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

const store = new Vuex.Store({
  state,
  actions,
  mutations
})

for (let k in state) {
  store.watch(state => state[k], (value) => {
    localforage.setItem(`aum.state.${k}`, state[k])
  }, {
    immediate: true,
    deep: true
  })
}

export { store }
