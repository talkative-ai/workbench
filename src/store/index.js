import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

import API from '@/api'

Vue.use(Vuex)

const state = {
  initializing: true,

  user: null,
  token: null,

  path: '',

  projectsList: null,
  selectedProject: null,
  selectedEntity: null
}

let ready
export const initializer = new Promise((resolve, reject) => { ready = resolve })

localforage.iterate((v, k) => {
  let statek = k.split('aum.state.v1.')
  if (statek.length <= 1) return

  statek = statek.pop()

  store.commit('set', { key: statek, value: v })
})
.then(() => {
  ready()
  return initializer
})
.then(() => {
  store.commit('initialized')
})

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
      commit('set', { key: 'token', value: result.headers.get('x-token') })
      return result.json()
    })
    .then(user => {
      commit('set', { key: 'user', value: user })
    })
  }
}

const mutations = {
  set (state, {key, value}) {
    state[key] = value
  },

  initialized (state) {
    state.initializing = false
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations
})

for (let k in state) {
  if (k === 'initializing') continue
  store.watch(state => state[k], (value) => {
    localforage.setItem(`aum.state.v1.${k}`, state[k])
  }, {
    immediate: true,
    deep: true
  })
}

export default store
