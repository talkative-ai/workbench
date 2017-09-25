import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

import router from '@/router'
import API from '@/api'

Vue.use(Vuex)

const defaultDialog = {
  'IsRoot': true,
  'EntryInput': [],
  'AlwaysExec': {
    'SetGlobalVariables': null,
    'PlaySounds': [],
    'InitializeActorDialog': 0,
    'SetZone': 0,
    'ResetGame': false
  }
}

const state = {
  initializing: true,

  user: null,
  token: null,

  path: '',

  projectsList: null,
  selectedProject: null,
  selectedEntity: {},

  dialogsMapped: {},
  rootNodes: [],
  newDialog: null,

  actorsMapped: {},
  zonesMapped: {},
  zoneActors: {},

  createID: 0
}

let ready
export const initializer = new Promise((resolve, reject) => { ready = resolve })

localforage.setDriver(localforage.LOCALSTORAGE)
localforage.iterate((v, k) => {
  let key = k.split('aum.state.v1.')

  key = key.pop().split('.')

  let s = state
  for (let i = 0; i < key.length - 1; i++) {
    s = s[key[i]]
  }
  Vue.set(s, key[key.length - 1], v)
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
      commit('selectEntity', { type: 'zone', data: newZone, redirect: true })
      return newZone
    })
  },

  createActor ({ commit, state }, actor) {
    commit('incrCreate')
    actor.CreateID = store.state.createID
    return API.CreateActor(actor)
    .then(newActor => {
      commit('addActor', newActor)
      commit('selectEntity', { type: 'actor', data: newActor, redirect: true })
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
      return result.json()
    })
    .then(user => {
      Vue.set(state, 'user', user)
    })
  },

  selectProject ({ commit, state }, p) {
    return API.GetProject(p)
    .then(result => result.json())
    .then(project => {
      Vue.set(state, 'selectedProject', project)
      for (const a of project.Actors) {
        Vue.set(state.actorsMapped, a.ID, a)
      }
      for (const z of project.Zones) {
        Vue.set(state.zonesMapped, z.ID, z)
      }
      for (const za of project.ZoneActors) {
        if (!state.zoneActors[za.ZoneID]) {
          Vue.set(state.zoneActors, za.ZoneID, [])
        }
        state.zoneActors[za.ZoneID].push(za.ActorID)
      }
      return project
    })
  },

  selectZone ({ commit, state }, zoneID) {
    if (state.selectedEntity.data && state.selectedEntity.data.ID === zoneID) return
    const zone = state.zonesMapped[zoneID]
    return API.GetZone(zone)
    .then(zone => {
      commit('updateZone', zone)
      commit('selectEntity', { type: 'zone', data: zone })
    })
  },

  selectActor ({ commit, state }, actorID) {
    if (state.selectedEntity.data && state.selectedEntity.type === 'actor' && state.selectedEntity.data.ID === actorID) return
    const actor = state.actorsMapped[actorID]
    return API.GetActor(actor)
    .then(actor => {
      commit('updateActor', { actor })
      commit('selectEntity', { type: 'actor', data: actor })
    })
  },

  updateDialog ({ commit, state }) {
    if (state.selectedEntity.type !== 'actor') return
    API.PutActor(state.selectedEntity.data)
  },

  publish ({ commit, state }) {
    API.Publish()
  },

  createNewDialog ({ commit, state }, dialog) {
    commit('incrCreate')
    dialog.CreateID = store.state.createID
    state.selectedEntity.data.Dialogs.push(dialog)
    API.PutActor(state.selectedEntity.data)
  }
}

const mutations = {

  initialized (state) {
    state.initializing = false
  },

  incrCreate () {
    state.createID++
  },

  addZone (state, zone) {
    state.selectedProject.Zones.push(zone)
    Vue.set(state.zonesMapped, zone.ID, zone)
  },

  addActor (state, actor) {
    state.selectedProject.Actors.push(actor)
    Vue.set(state.actorsMapped, actor.ID, actor)
    if (actor.ZoneID) {
      if (!state.zoneActors[actor.ZoneID]) {
        Vue.set(state.zoneActors, actor.ZoneID, [])
      }
      state.zoneActors[actor.ZoneID].push(actor.ID)
    }
  },

  updateActor (state, payload) {
    payload.actor.Dialogs = payload.actor.Dialogs || []
    payload.actor.DialogRelations = payload.actor.DialogRelations || []
    let id = 0
    for (let idx in state.selectedProject.Actors) {
      if (state.selectedProject.Actors[idx].ID === payload.actor.ID) id = state.selectedProject.Actors[idx].ID
    }
    Vue.set(state.selectedProject.Actors, id, payload.actor)
    state.rootNodes = []
    let rnodes = new Set()

    for (const d of payload.actor.Dialogs) {
      Vue.set(state.dialogsMapped, d.ID, d)
      rnodes.add(d.ID.toString())
    }

    // Build dialog graph
    for (const r of payload.actor.DialogRelations) {
      let prepend = state.dialogsMapped[r.ParentNodeID].ChildNodes || []
      Vue.set(state.dialogsMapped[r.ParentNodeID], 'ChildNodes', [...prepend, r.ChildNodeID])
      rnodes.delete(r.ChildNodeID.toString())
    }

    Vue.set(state, 'rootNodes', [...rnodes])
  },

  updateZone (state, zone) {
    Vue.set(state.zonesMapped, zone.ID, zone)
  },

  selectEntity (state, entity) {
    let redirect = entity.redirect
    delete entity.redirect
    state.selectedEntity = { ...state.selectedEntity, ...entity }
    if (redirect) {
      if (entity.type === 'dialog') {
        router.push({ name: 'DialogHome', params: { id: entity.data.ActorID, dialog_id: entity.data.ID } })
      } else {
        router.push({ name: `${titlecase(entity.type)}Home`, params: { id: entity.data.ID } })
      }
    }
  },

  clearSelectedEntity (state, entity) {
    state.selectedEntity = {}
  },

  newDialog (state, options = {}) {
    state.newDialog = { ...defaultDialog, ...options }
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

function titlecase (str) {
  return `${str[0].toUpperCase()}${str.substr(1)}`
}

export default store
