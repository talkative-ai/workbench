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
  selectedEntity: {},

  createID: 0
}

let ready
export const initializer = new Promise((resolve, reject) => { ready = resolve })

localforage.setDriver(localforage.LOCALSTORAGE)
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

  createZone ({ commit, state }, zone) {
    commit('incrCreate')
    zone.CreateID = store.state.createID
    return API.CreateZone(zone)
    .then(newZone => {
      commit('addZone', newZone)
      commit('selectEntity', { type: 'zone', entity: newZone })
      return newZone
    })
  },

  createActor ({ commit, state }, zone) {
    commit('incrCreate')
    zone.CreateID = store.state.createID
    return API.CreateActor(zone)
    .then(newActor => {
      commit('addActor', newActor)
      commit('selectEntity', { type: 'actor', entity: newActor })
      return newActor
    })
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
  },

  selectProject ({ commit, state }, p) {
    return API.GetProject(p)
    .then(result => result.json())
    .then(project => {
      commit('set', { key: 'selectedProject', value: project })
      return project
    })
  },

  selectZone ({ commit, state }, zoneID) {
    for (let zone of state.selectedProject.Zones) {
      if (zone.ID.toString() !== zoneID) continue
      commit('selectEntity', { type: 'zone', entity: zone })
    }
  },

  selectActor ({ commit, state }, actorID) {
    for (let actor of state.selectedProject.Actors) {
      if (actor.ID !== actorID) continue
      return commit('selectEntity', { type: 'actor', entity: actor })
    }
  }
}

const mutations = {
  set (state, {key, value}) {
    state[key] = value
  },

  initialized (state) {
    state.initializing = false
  },

  incrCreate () {
    state.createID++
  },

  addZone (state, zone) {
    state.selectedProject.Zones.push(zone)
  },

  addActor (state, actor) {
    state.selectedProject.Actors.push(actor)
  },

  selectEntity (state, entity) {
    state.selectedEntity = entity
  },

  clearSelectedEntity (state, entity) {
    state.selectedEntity = {}
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
