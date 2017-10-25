import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import dcopy from 'deep-copy';

import router from '@/router';
import API from '@/api';

Vue.use(Vuex);

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
};

const initialState = {
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

  actorZones: {},

  // Map a selected DialogID to the ActorID
  actorSelectedDialogID: {},

  dialogSiblings: [],

  dialogChain: [],

  createID: 0,

  // Tracking dialogs being edited
  dialogEditMap: {},
  dialogEditCount: 0,
  dialogEditingCopy: {}
};

const getters = {
  dialogEditMap: state => state.dialogEditMap,
  dialogsMapped: state => state.dialogsMapped
};

let ready;
export const initializer = new Promise((resolve, reject) => { ready = resolve; });

localforage.setDriver(localforage.LOCALSTORAGE);

function setProject(state) {
  return project => {
    if (!project.Actors) project.Actors = [];
    if (!project.Zones) project.Zones = [];
    if (!project.ZoneActors) project.ZoneActors = [];

    Vue.set(state, 'selectedProject', project);
    for (const a of project.Actors) {
      Vue.set(state.actorsMapped, a.ID, a);
    }
    for (const z of project.Zones) {
      Vue.set(state.zonesMapped, z.ID, z);
    }
    for (const za of project.ZoneActors) {
      if (!state.zoneActors[za.ZoneID]) {
        Vue.set(state.zoneActors, za.ZoneID, []);
      }
      if (!state.actorZones[za.ActorID]) {
        Vue.set(state.actorZones, za.ActorID, []);
      }
      state.zoneActors[za.ZoneID].push(za.ActorID);
      state.actorZones[za.ActorID].push(za.ZoneID);
    }

    router.push({ name: 'ProjectHome' });

    return state;
  };
}

function resetState({ keepAuth = false, initial = false }) {
  let freshState = dcopy(initialState);
  if (keepAuth) {
    freshState.user = store.state.user;
    freshState.token = store.state.token;
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
    return p.then(() => store.state);
  }
}

const actions = {

  createZone({ commit, state }, zone) {
    commit('incrCreate');
    zone.CreateID = store.state.createID;
    return API.CreateZone(zone)
    .then(newZone => {
      commit('addZone', newZone);
      commit('selectEntity', { type: 'zone', data: newZone, redirect: true });
      return newZone;
    });
  },

  createActor({ commit, state }, actor) {
    commit('incrCreate');
    actor.CreateID = store.state.createID;
    return API.CreateActor(actor)
    .then(newActor => {
      commit('addActor', newActor);
      commit('selectEntity', { type: 'actor', data: newActor, redirect: true });
      return newActor;
    });
  },

  createProject({ commit, state }, project) {
    return API.CreateProject(project)
    .then(setProject(state));
  },

  authGoogle({ commit, state }, googleUser) {
    const profile = googleUser.getBasicProfile();
    API.GetAuthGoogle({
      token: googleUser.getAuthResponse().id_token,
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName()
    })
    .then(result => {
      return result.json();
    })
    .then(user => {
      Vue.set(state, 'user', user);
    });
  },

  selectProject({ commit, state }, p) {
    Vue.set(state, 'initializing', true);
    return resetState({ keepAuth: true })
    .then(newState => {
      return API.GetProject(p)
      .then(setProject(newState))
      .then(newState => {
        Vue.set(newState, 'initializing', false);
      });
    });
  },

  selectZone({ commit, state }, zoneID) {
    if (state.selectedEntity.data && state.selectedEntity.data.ID === zoneID) return;
    const zone = state.zonesMapped[zoneID];
    if (!zone) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetZone(zone)
    .then(zone => {
      commit('updateZone', zone);
      commit('selectEntity', { type: 'zone', data: zone });
    });
  },

  selectActor({ commit, state }, actorID) {
    if (state.selectedEntity.data && state.selectedEntity.type === 'actor' && state.selectedEntity.data.ID === actorID) return;
    const actor = state.actorsMapped[actorID];
    if (!actor) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetActor(actor)
    .then(actor => {
      commit('updateActor', { actor });
      commit('selectEntity', { type: 'actor', data: actor });
    });
  },

  updateDialog({ commit, state }) {
    if (state.selectedEntity.type !== 'actor') return;
    API.PutActor(state.selectedEntity.data);
  },

  publish({ commit, state }) {
    API.Publish();
  },

  createNewDialog({ commit, state }, dialog) {
    commit('incrCreate');
    dialog.CreateID = store.state.createID;
    state.selectedEntity.data.Dialogs.push(dialog);
    API.PutActor(state.selectedEntity.data);
  },

  unauthorized({ commit, state }) {
    return resetState().then(() => {
      router.push({ name: 'SignIn' });
    });
  },

  NotFound() {
    router.push({ name: 'NotFound' });
  },

  reset() {
    return resetState({ keepAuth: true });
  },

  selectNode({ state, commit }, { nodeID, isChild = false, relativeParent } = {}) {
    if (!nodeID && !state.actorSelectedDialogID[state.selectedEntity.data.ID]) {
      commit('setDialogSiblings', state.rootNodes);
      commit('setSelectedDialog', state.rootNodes[0]);
      Vue.set(state, 'dialogChain', []);
      state.dialogChain.push(state.dialogsMapped[state.rootNodes[0]]);
      return;
    } else if (!nodeID) {
      return;
    }

    if (isChild) {
      relativeParent = relativeParent || state.dialogsMapped[state.actorSelectedDialogID[state.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildNodes);
      state.dialogChain.push(state.dialogsMapped[nodeID]);
    } else {
      state.dialogChain.pop();
      state.dialogChain.push(state.dialogsMapped[nodeID]);
    }

    commit('setSelectedDialog', nodeID);
  },

  selectChain({ state, dispatch, commit }, index) {
    if (index === state.dialogChain.length - 1) {
      return;
    }
    if (index === 0) {
      commit('setSelectedDialog', null);
      commit('sliceChain', 0);
      dispatch('selectNode');
      return;
    }
    dispatch('selectNode', { nodeID: state.dialogChain[index].ID, isChild: true, relativeParent: state.dialogChain[index - 1] });
    commit('sliceChain', index + 1);
  },

  editDialog({ state, commit }, nodeID) {
    if (!state.dialogEditMap[nodeID]) {
      commit('editDialog', nodeID);
    }
  },

  saveEditDialog({ state, commit }, nodeID) {
    if (state.dialogEditMap[nodeID]) {
      commit('saveEditDialog', nodeID);
    }
  },

  cancelEditDialog({ state, commit }, nodeID) {
    if (state.dialogEditMap[nodeID]) {
      commit('cancelEditDialog', nodeID);
    }
  }
};

const mutations = {

  incrCreate(state) {
    state.createID++;
  },

  editDialog(state, nodeID) {
    Vue.set(state.dialogEditMap, nodeID, true);
    state.dialogEditCount++;
    Vue.set(state.dialogEditingCopy, nodeID, dcopy(state.dialogsMapped[nodeID]));
  },

  saveEditDialog(state, nodeID) {
    Vue.set(state.dialogEditMap, nodeID, false);
    state.dialogEditCount--;
    Vue.set(state.dialogsMapped, nodeID, dcopy(state.dialogEditingCopy[nodeID]));
  },

  cancelEditDialog(state, nodeID) {
    Vue.set(state.dialogEditMap, nodeID, false);
    state.dialogEditCount--;
  },

  sliceChain(state, index) {
    state.dialogChain = state.dialogChain.slice(0, index);
  },

  setDialogSiblings(state, nodes) {
    Vue.set(state, 'dialogSiblings', nodes);
  },

  setSelectedDialog(state, nodeID) {
    Vue.set(state.actorSelectedDialogID, state.selectedEntity.data.ID, nodeID);
  },

  addZone(state, zone) {
    state.selectedProject.Zones.push(zone);
    Vue.set(state.zonesMapped, zone.ID, zone);
  },

  addActor(state, actor) {
    state.selectedProject.Actors.push(actor);
    Vue.set(state.actorsMapped, actor.ID, actor);
    if (actor.ZoneID) {
      if (!state.zoneActors[actor.ZoneID]) {
        Vue.set(state.zoneActors, actor.ZoneID, []);
      }
      state.zoneActors[actor.ZoneID].push(actor.ID);
      if (!state.actorZones[actor.ID]) {
        Vue.set(state.actorZones, actor.ID, []);
      }
      state.actorZones[actor.ID].push(actor.ZoneID);
    }
  },

  updateActor(state, payload) {
    payload.actor.Dialogs = payload.actor.Dialogs || [];
    payload.actor.DialogRelations = payload.actor.DialogRelations || [];
    let id = 0;
    for (let idx in state.selectedProject.Actors) {
      if (state.selectedProject.Actors[idx].ID === payload.actor.ID) {
        id = idx;
        break;
      }
    }
    Vue.set(state.selectedProject.Actors, id, payload.actor);
    state.rootNodes = [];
    let rnodes = new Set();

    for (const d of payload.actor.Dialogs) {
      Vue.set(state.dialogsMapped, d.ID, d);
      if (d.IsRoot) {
        rnodes.add(d.ID.toString());
      }
    }

    // Build dialog graph
    for (const r of payload.actor.DialogRelations) {
      let prepend = state.dialogsMapped[r.ParentNodeID].ChildNodes || [];
      Vue.set(state.dialogsMapped[r.ParentNodeID], 'ChildNodes', [...prepend, r.ChildNodeID]);

      prepend = state.dialogsMapped[r.ChildNodeID].ParentNodes || [];
      Vue.set(state.dialogsMapped[r.ChildNodeID], 'ParentNodes', [...prepend, r.ParentNodeID]);
    }

    Vue.set(state, 'rootNodes', [...rnodes]);
  },

  updateZone(state, zone) {
    Vue.set(state.zonesMapped, zone.ID, zone);
  },

  // TODO: Add comments
  selectEntity(state, entity) {
    let redirect = entity.redirect;
    delete entity.redirect;
    state.selectedEntity = { ...state.selectedEntity, ...entity };
    if (redirect) {
      if (entity.type === 'dialog') {
        router.push({ name: 'DialogHome', params: { id: entity.data.ActorID, dialog_id: entity.data.ID } });
      } else {
        router.push({ name: `${titlecase(entity.type)}Home`, params: { id: entity.data.ID } });
      }
    }
  },

  clearSelectedEntity(state, entity) {
    state.selectedEntity = {};
  },

  newDialog(state, options = {}) {
    state.newDialog = { ...defaultDialog, ...options };
  }
};

const store = new Vuex.Store({
  state: dcopy(initialState),
  actions,
  mutations,
  getters
});

resetState({ initial: true });

for (let k in store.state) {
  if (k === 'initializing') continue;
  store.watch(state => state[k], (value) => {
    localforage.setItem(`aum.state.v1.${k}`, store.state[k]);
  }, {
    immediate: true,
    deep: true
  });
}

function titlecase(str) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

export default store;
