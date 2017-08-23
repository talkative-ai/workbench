import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: null,

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
  }
}

export default new Vuex.Store({
  state,
  actions
})
