import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import dcopy from 'deep-copy';

import router from '@/router';
import API from '@/api';

Vue.use(Vuex);

const defaultDialog = {
  'IsRoot': true,
  'EntryInput': [''],
  'AlwaysExec': {
    'SetGlobalVariables': null,
    'PlaySounds': [{
      SoundType: 0,
      Val: ''
    }],
    'InitializeActorDialog': 0,
    'SetZone': 0,
    'ResetGame': false
  },
  'ChildDialogIDs': [],
  'ParentDialogIDs': []
};

const initialState = {
  initializing: true,

  user: null,
  token: null,

  path: '',

  projectsList: null,
  selectedProject: null,
  selectedEntity: {},

  dialogMap: {},
  rootDialogs: [],
  newDialog: null,

  actorsMapped: {},
  zonesMapped: {},
  zoneActors: {},

  actorZones: {},

  // Map a selected DialogID to the ActorID
  actorSelectedDialogID: {},

  dialogSiblings: [],

  dialogChain: {},

  createID: 0,

  // Tracking dialogs being edited
  dialogIsEditing: null,
  dialogEditingCopy: {},
  dialogEditError: {}
};

let ready;
export const initializer = new Promise((resolve, reject) => { ready = resolve; });

localforage.setDriver(localforage.LOCALSTORAGE);

function setProject(state) {
  return project => {
    if (!project.Actors) project.Actors = [];
    if (!project.Zones) project.Zones = [];
    if (!project.ZoneActors) project.ZoneActors = [];
    if (!project.Dialogs) project.Dialogs = [];
    if (!project.DialogRelations) project.DialogRelations = [];

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
    return p.then(() => {
      Vue.set(store.state, 'initializing', false);
      return store.state;
    });
  }
}

const actions = {

  generateID({ commit, state }) {
    commit('incrCreate');
    return `harihara-${state.createID}`;
  },

  async createZone({ commit, state, dispatch }, zone) {
    zone.CreateID = await dispatch('generateID');
    return API.CreateZone(zone)
    .then(newZone => {
      commit('addZone', newZone);
      commit('selectEntity', { type: 'zone', data: newZone, redirect: true });
      return newZone;
    });
  },

  async createActor({ commit, state, dispatch }, actor) {
    actor.CreateID = await dispatch('generateID');
    return API.CreateActor(actor)
    .then(newActor => {
      commit('addActor', newActor);
      commit('selectEntity', { type: 'actor', data: newActor, redirect: true });
      return newActor;
    });
  },

  createProject({ commit, state }, project) {
    return API.CreateProject(project)
    .then(res => {
      if (res.status !== 201) {
        throw res.message;
      }
      setProject(state);
    });
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

  selectDialog({ state, commit }, { dialogID, isChild = false, relativeParent } = {}) {
    if (!dialogID &&
        !state.actorSelectedDialogID[state.selectedEntity.data.ID] &&
        state.rootDialogs.length > 0) {
      commit('setDialogSiblings', state.rootDialogs);
      commit('setSelectedDialog', state.rootDialogs[0]);
      Vue.set(state.dialogChain, state.selectedEntity.data.ID, []);
      state.dialogChain[state.selectedEntity.data.ID].push(state.rootDialogs[0]);
      commit('updateDialogChain', state.dialogChain);
      return;
    } else if (!dialogID && state.actorSelectedDialogID[state.selectedEntity.data.ID]) {
      // TODO: dialogChain should be actor specific to fetch sibling nodes of relative parent
      if (state.dialogChain[state.selectedEntity.data.ID].length === 1) {
        commit('setDialogSiblings', state.rootDialogs);
      } else {
        commit('setDialogSiblings', state.dialogMap[state.dialogChain[state.selectedEntity.data.ID].slice(-2, -1).pop()].ChildDialogIDs);
      }
      commit('setSelectedDialog', state.actorSelectedDialogID[state.selectedEntity.data.ID]);
      return;
    } else if (!dialogID) {
      return;
    }

    if (isChild) {
      relativeParent = relativeParent || state.dialogMap[state.actorSelectedDialogID[state.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildDialogIDs);
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);
    } else {
      state.dialogChain[state.selectedEntity.data.ID].pop();
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);
    }

    commit('setSelectedDialog', dialogID);
  },

  selectChain({ state, dispatch, commit }, index) {
    if (index === state.dialogChain[state.selectedEntity.data.ID].length - 1) {
      return;
    }
    if (index === 0) {
      commit('setSelectedDialog', null);
      commit('sliceChain', 0);
      dispatch('selectDialog');
      return;
    }
    dispatch('selectDialog', {
      dialogID: state.dialogChain[state.selectedEntity.data.ID][index],
      isChild: true,
      relativeParent: state.dialogMap[state.dialogChain[state.selectedEntity.data.ID][index - 1]]
    });
    commit('sliceChain', index + 1);
  },

  editDialog({ state, commit, dispatch }, dialogID) {
    dispatch('cancelEditDialog');
    commit('editDialog', dialogID);
  },

  saveEditDialog({ state, commit, dispatch }, dialogID) {
    if (state.dialogIsEditing === dialogID) {
      let error = validateDialog(state.dialogEditingCopy[dialogID]);
      if (error) {
        commit('saveEditDialogError', { dialogID, error });
        return;
      }
      if (state.newDialog && state.newDialog.ID === dialogID) {
        state.newDialog = dcopy(state.dialogEditingCopy[dialogID]);
        delete state.newDialog.ID;
        state.selectedEntity.data.Dialogs.push(state.newDialog);
        if (!state.newDialog.IsRoot) {
          state.selectedEntity.data.DialogRelations.push({
            ChildNodeID: state.newDialog.CreateID,
            ParentNodeID: state.newDialog.ParentDialogIDs[0],
            PatchAction: 0
          });
        }
      } else {
        for (let i = 0; i < state.selectedEntity.data.Dialogs.length; i++) {
          if (state.selectedEntity.data.Dialogs[i].ID === dialogID) {
            state.selectedEntity.data.Dialogs.splice(i, 1, state.dialogEditingCopy[dialogID]);
            break;
          }
        }
      }
      commit('saveEditDialog', dialogID);
      let p = API.PutActor(state.selectedEntity.data);
      if (state.newDialog) {
        p.then(result => {
          const newID = result[state.newDialog.CreateID];
          state.dialogChain[state.selectedEntity.data.ID].pop();
          commit('updateDialogChain', state.dialogChain);
          commit('replaceNewDialog', result);
          dispatch('selectDialog', { dialogID: newID, isChild: !state.dialogMap[newID].IsRoot });
        });
      }
      return p;
    }
  },

  cancelEditDialog({ state, commit, dispatch }) {
    if (state.newDialog && state.newDialog.ID === state.dialogIsEditing) {
      if (state.newDialog.IsRoot) {
        commit('setSelectedDialog', null);
        if (state.rootDialogs.length > 1) {
          commit('sliceChain', 0);
          dispatch('selectDialog');
        } else {
          state.dialogChain[state.selectedEntity.data.ID].pop();
          commit('updateDialogChain', state.dialogChain);
        }
      } else {
        dispatch('selectChain', state.dialogChain[state.selectedEntity.data.ID].length - 2);
      }
    }
    commit('cancelEditDialog');
    Vue.set(state, 'newDialog', false);
  },

  async startNewConversation({ state, commit, dispatch }, dialogID) {
    let newDialog = dcopy(defaultDialog);
    let newID = await dispatch('generateID');
    newDialog.ID = newID;
    newDialog.CreateID = newID;
    if (!dialogID) {
      commit('newRootDialog', newDialog);
      dispatch('selectChain', 0);
    } else {
      commit('newChildDialog', { newDialog: newDialog, parentID: dialogID });
      if (state.dialogChain[state.selectedEntity.data.ID].slice(-1).pop() === dialogID) {
        state.dialogChain[state.selectedEntity.data.ID].push(newDialog.ID);
        commit('updateDialogChain', state.dialogChain);
      }
    }
    commit('editDialog', newDialog.ID);
  }
};

function validateDialog(dialog) {
  if (dialog.EntryInput.length <= 0) {
    return 'You need at least one entry into the dialog.';
  }
  if (dialog.AlwaysExec.PlaySounds.length <= 0) {
    return 'You must play at least one sound.';
  }
  for (let s of dialog.EntryInput) {
    if (!s) {
      // TODO: Better validation handling here
      return 'Dialog entry cannot be blank.';
    }
  }
  for (let s of dialog.AlwaysExec.PlaySounds) {
    if (!s.Val) {
      // TODO: Better validation handling here
      return 'No empty speech allowed.';
    }
  }
}

const mutations = {

  updateDialogChain(state, value) {
    state.dialogChain = value;
  },

  incrCreate(state) {
    state.createID++;
  },

  saveEditDialogError(state, { dialogID, error }) {
    Vue.set(state.dialogEditError, dialogID, error);
  },

  editDialog(state, dialogID) {
    Vue.delete(state.dialogEditError, dialogID, false);
    Vue.set(state, 'dialogIsEditing', dialogID);
    Vue.delete(state.dialogEditingCopy, dialogID);
    Vue.set(state.dialogEditingCopy, dialogID, dcopy(state.dialogMap[dialogID]));
  },

  saveEditDialog(state, dialogID) {
    Vue.set(state.dialogEditError, dialogID, false);
    Vue.set(state, 'dialogIsEditing', false);
    Vue.set(state.dialogMap, dialogID, dcopy(state.dialogEditingCopy[dialogID]));
  },

  replaceNewDialog(state, newIDMap) {
    const dialog = dcopy(state.newDialog);

    // Update the dialog with the backend generated ID
    dialog.ID = newIDMap[state.newDialog.CreateID];

    // Add the official dialog to the map
    Vue.set(state.dialogMap, dialog.ID, dialog);

    // Replace the dialog in the actor entity
    state.selectedEntity.data.Dialogs.pop();
    state.selectedEntity.data.Dialogs.push(dialog);

    if (!dialog.IsRoot) {
      state.selectedEntity.data.DialogRelations.pop();
      state.selectedEntity.data.DialogRelations.push({
        ChildNodeID: dialog.ID,
        ParentNodeID: dialog.ParentDialogIDs[0]
      });

      state.dialogMap[dialog.ParentDialogIDs[0]].ChildDialogIDs.pop();
      state.dialogMap[dialog.ParentDialogIDs[0]].ChildDialogIDs.push(dialog.ID);
    } else {
      state.rootDialogs.pop();
      state.rootDialogs.push(dialog.ID);
    }

    // Remove the old dialog from the map
    Vue.delete(state.dialogMap, state.newDialog.CreateID);

    Vue.delete(state, 'newDialog');

    delete dialog.CreateID;
  },

  cancelEditDialog(state) {
    if (state.newDialog && state.newDialog.ID === state.dialogIsEditing) {
      if (state.newDialog.IsRoot) {
        state.rootDialogs.pop();
      } else {
        state.dialogMap[state.newDialog.ParentDialogIDs[0]].ChildDialogIDs.pop();
      }
      Vue.delete(state.dialogMap, state.dialogIsEditing);
      Vue.delete(state, 'newDialog');
    }
    Vue.set(state, 'dialogIsEditing', false);
  },

  sliceChain(state, index) {
    state.dialogChain[state.selectedEntity.data.ID] = state.dialogChain[state.selectedEntity.data.ID].slice(0, index);
  },

  setDialogSiblings(state, dialogs) {
    Vue.set(state, 'dialogSiblings', dialogs);
  },

  setSelectedDialog(state, dialogID) {
    Vue.set(state.actorSelectedDialogID, state.selectedEntity.data.ID, dialogID);
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
    if (!state.dialogChain[payload.actor.ID]) {
      Vue.set(state.dialogChain, payload.actor.ID, []);
    }
    Vue.set(state, 'rootDialogs', []);
    Vue.set(state, 'dialogMap', {});
    Vue.set(state, 'dialogSiblings', {});

    let id = 0;
    for (let idx in state.selectedProject.Actors) {
      if (state.selectedProject.Actors[idx].ID === payload.actor.ID) {
        id = idx;
        break;
      }
    }
    Vue.set(state.selectedProject.Actors, id, payload.actor);
    let rdialogs = new Set();

    // Prepare the dialog map and root dialogs
    for (const d of payload.actor.Dialogs) {
      Vue.set(state.dialogMap, d.ID, d);
      if (d.IsRoot) {
        rdialogs.add(d.ID.toString());
      }
    }

    // Build dialog graph
    // In other words, construct dialog relations
    for (const r of payload.actor.DialogRelations) {
      let prepend = state.dialogMap[r.ParentNodeID].ChildDialogIDs || [];
      Vue.set(state.dialogMap[r.ParentNodeID], 'ChildDialogIDs', [...prepend, r.ChildNodeID]);

      prepend = state.dialogMap[r.ChildNodeID].ParentDialogIDs || [];
      Vue.set(state.dialogMap[r.ChildNodeID], 'ParentDialogIDs', [...prepend, r.ParentNodeID]);
    }

    state.rootDialogs = [...rdialogs];
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
  },

  newRootDialog(state, newDialog) {
    state.dialogMap[newDialog.ID] = newDialog;
    state.rootDialogs.push(newDialog.ID);
    state.newDialog = newDialog;
  },

  newChildDialog(state, { newDialog, parentID }) {
    // Vue converts integers to strings unfortunately.
    // The server requires integer IDs for existing parents.
    if (!isNaN(parentID)) {
      parentID = parentID * 1;
    }
    newDialog.IsRoot = false;
    state.dialogMap[newDialog.ID] = newDialog;
    state.dialogMap[parentID].ChildDialogIDs = state.dialogMap[parentID].ChildDialogIDs || [];
    state.dialogMap[parentID].ChildDialogIDs.push(newDialog.ID);
    state.dialogMap[newDialog.ID].ParentDialogIDs.push(parentID);
    state.newDialog = newDialog;
  }
};

const store = new Vuex.Store({
  state: dcopy(initialState),
  actions,
  mutations
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
