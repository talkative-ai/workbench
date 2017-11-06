import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import dcopy from 'deep-copy';

import router from '@/router';
import API from '@/api';

Vue.use(Vuex);

class SelectedEntity {
  constructor({ kind, data } = {}) {
    this.kind = kind;
    this._data = data;
  }

  get data() {
    return this._data;
  }
}

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
  selectedEntity: new SelectedEntity(),

  dialogMap: {},
  rootDialogs: [],
  newDialog: null,

  actorMap: {},
  zoneMap: {},
  zoneActors: {},

  // Map a selected DialogID to the ActorID
  actorSelectedDialogID: {},

  dialogSiblings: [],

  dialogChain: {},

  createID: 0,

  // Tracking dialogs being edited
  dialogIsEditing: null,
  dialogEditingCopy: {},
  dialogEditError: {},

  // Connecting dialog
  connectingDialogID: false,
  previewConnect: false,
  conversationCycle: false
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
      Vue.set(state.actorMap, a.ID, a);
    }
    for (const z of project.Zones) {
      Vue.set(state.zoneMap, z.ID, z);
    }
    for (const za of project.ZoneActors) {
      if (!state.zoneActors[za.ZoneID]) {
        Vue.set(state.zoneActors, za.ZoneID, {});
      }
      if (!state.actorMap[za.ActorID].ZoneIDs) {
        Vue.set(state.actorMap[za.ActorID], 'ZoneIDs', []);
      }
      Vue.set(state.zoneActors[za.ZoneID], za.ActorID.toString(), true);
      state.actorMap[za.ActorID].ZoneIDs.push(za.ZoneID.toString());
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
      commit('selectEntity', { kind: 'zone', data: newZone, redirect: true });
      return newZone;
    });
  },

  async createActor({ commit, state, dispatch }, actor) {
    actor.CreateID = await dispatch('generateID');
    return API.CreateActor(actor)
    .then(newActor => {
      Vue.set(state.dialogChain, newActor.ID, []);
      newActor.Dialogs = newActor.Dialogs || [];
      newActor.DialogRelations = newActor.DialogRelations || [];
      commit('addActor', newActor);
      commit('selectEntity', { kind: 'actor', data: newActor, redirect: true });
      return newActor;
    });
  },

  createProject({ commit, state }, project) {
    return API.CreateProject(project)
    .then(res => {
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
    const zone = state.zoneMap[zoneID];
    if (!zone) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetZone(zone)
    .then(zone => {
      commit('updateZone', zone);
      commit('selectEntity', { kind: 'zone', data: zone });
    });
  },

  selectActor({ commit, state }, actorID) {
    if (state.selectedEntity.data && state.selectedEntity.kind === 'actor' && state.selectedEntity.data.ID === actorID) return;
    const actor = state.actorMap[actorID];
    if (!actor) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetActor(actor)
    .then(actor => {
      commit('updateActor', { actor });
      commit('selectEntity', { kind: 'actor', data: actor });
    });
  },

  updateDialog({ commit, state }) {
    if (state.selectedEntity.kind !== 'actor') return;
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

  // selectDialog manages the state of the currently selected dialog
  // and all previously selected parent dialogs within the dialogChain
  selectDialog({ state, dispatch, commit }, { dialogID, isChild = false, relativeParent } = {}) {
    // If no dialog is specified
    // and there is no default selected dialog
    // and there exist root dialogs
    if (!dialogID &&
        !state.actorSelectedDialogID[state.selectedEntity.data.ID] &&
        state.rootDialogs.length > 0) {
      commit('setDialogSiblings', state.rootDialogs);
      commit('setSelectedDialog', state.rootDialogs[0]);
      Vue.set(state.dialogChain, state.selectedEntity.data.ID, []);
      state.dialogChain[state.selectedEntity.data.ID].push(state.rootDialogs[0]);
      commit('updateDialogChain', state.dialogChain);
      return;
      // Otherwise if no dialog is specified
      // and there is a default selected node
    } else if (!dialogID && state.actorSelectedDialogID[state.selectedEntity.data.ID]) {
      // If the dialogChain length is one, then this is a root dialog selected by default
      // Set the sibling dialogs accordingly
      if (state.dialogChain[state.selectedEntity.data.ID].length === 1) {
        commit('setDialogSiblings', state.rootDialogs);
      } else {
        // Otherwise this isn't a root dialog selected
        // Therefore we get the siblings of the current dialog relative to the currently selected parent in the chain
        // The reason it's important to get siblings from the relative parent is because a single dialog can have
        // multiple parents, and each parent can have different children.
        // In other words, a signle dialog can have multiple sibling sets depending on the selected dialog.
        commit('setDialogSiblings', state.dialogMap[state.dialogChain[state.selectedEntity.data.ID].slice(-2, -1).pop()].ChildDialogIDs);
      }
      commit('setSelectedDialog', state.actorSelectedDialogID[state.selectedEntity.data.ID]);
      return;
    } else if (!dialogID) {
      // Otherwise this is a no-op
      return;
    }

    // A specific dialog is being selected
    // If it's a child
    if (isChild) {
      relativeParent = relativeParent || state.dialogMap[state.actorSelectedDialogID[state.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildDialogIDs);
      if (state.previewConnect) {
        state.dialogChain[state.selectedEntity.data.ID].pop();
      }
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);

      // Otherwise it's a sibling
    } else {
      // If we're not previewing a dialog connection and we're not connecting a dialog
      // Or we are previewing an existing connection and we are connecting a dialog
      if ((!state.previewConnect && !state.connectingDialogID) || (state.previewConnect && state.connectingDialogID)) {
        state.dialogChain[state.selectedEntity.data.ID].pop();
      }
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);
    }

    if (state.previewConnect) {
      state.dialogMap[state.connectingDialogID].ChildDialogIDs.pop();
    }

    if (state.connectingDialogID && dialogID !== state.connectingDialogID) {
      Vue.set(state, 'previewConnect', dialogID);
      Vue.set(state, 'conversationCycle', true);
      state.dialogMap[state.connectingDialogID].ChildDialogIDs.push(dialogID);
    }

    commit('setSelectedDialog', dialogID);
  },

  // selectChain is similar to selectDialog except that it's always going to be a parent dialog
  selectChain({ state, dispatch, commit }, index) {
    if (index < 0) {
      index = state.dialogChain[state.selectedEntity.data.ID].length + index;
    }
    if (index === state.dialogChain[state.selectedEntity.data.ID].length - 1) {
      return;
    }

    // If linking a dialog, then the chain doesn't navigate
    // But rather previews a conversation cycle
    if (state.connectingDialogID) {
      if (state.previewConnect) {
        state.dialogMap[state.connectingDialogID].ChildDialogIDs.pop();
      }
      if (!state.conversationCycle) {
        state.dialogChain[state.selectedEntity.data.ID];
      }
      Vue.set(state, 'previewConnect', state.dialogChain[state.selectedEntity.data.ID][index]);
      Vue.set(state, 'conversationCycle', true);
      state.dialogMap[state.connectingDialogID].ChildDialogIDs.push(state.dialogChain[state.selectedEntity.data.ID][index]);
      return;
    }

    if (index === 0) {
      commit('sliceChain', 1);
      commit('setDialogSiblings', state.rootDialogs);
      commit('setSelectedDialog', state.dialogChain[state.selectedEntity.data.ID][0]);
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
          const newID = result[state.newDialog.CreateID].toString();
          state.dialogChain[state.selectedEntity.data.ID].pop();
          commit('updateDialogChain', state.dialogChain);
          commit('replaceNewDialog', result);
          if (!state.dialogSiblings.length) {
            state.dialogSiblings.push(newID);
          }
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
        dispatch('selectChain', -2);
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
      if (state.rootDialogs.length === 1) {
        state.dialogChain[state.selectedEntity.data.ID].push(newDialog.ID);
      }
      dispatch('selectChain', 0);
    } else {
      commit('newChildDialog', { newDialog: newDialog, parentID: dialogID });
      if (state.dialogChain[state.selectedEntity.data.ID].slice(-1).pop() === dialogID) {
        state.dialogChain[state.selectedEntity.data.ID].push(newDialog.ID);
        commit('updateDialogChain', state.dialogChain);
      }
    }
    commit('editDialog', newDialog.ID);
  },

  beginConnectDialog({ state }, dialogID) {
    Vue.set(state, 'connectingDialogID', dialogID);
  },

  saveConnectDialog({ state }, dialogID) {

  },

  cancelConnectDialog({ state, dispatch }) {
    let oldID = state.connectingDialogID;
    Vue.set(state, 'connectingDialogID', false);
    if (state.previewConnect) {
      Vue.set(state, 'previewConnect', false);
      state.dialogMap[oldID].ChildDialogIDs.pop();
      if (!state.conversationCycle) {
        dispatch('selectChain', -2);
      } else {
        Vue.set(state, 'conversationCycle', false);
      }
    }
  },

  removeActorFromZone({ state }, { actorID, zoneID }) {
    Vue.set(state.zoneActors[zoneID], actorID, false);
    for (let z of state.actorMap[actorID].ZoneIDs) {
      if (z.toString() === zoneID.toString()) {
        state.actorMap[actorID].ZoneIDs.splice(z, 1);
        break;
      }
    }
    API.PutActor(state.actorMap[actorID]);
  },

  addActorToZone({ state }, { actorID, zoneID }) {
    Vue.set(state.zoneActors[zoneID], actorID, true);
    state.actorMap[actorID].ZoneIDs.push(zoneID);
    API.PutActor(state.actorMap[actorID]);
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
    dialog.ID = newIDMap[state.newDialog.CreateID].toString();

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
    Vue.set(state.zoneMap, zone.ID, zone);
    Vue.set(state.zoneActors, zone.ID, {});
  },

  addActor(state, actor) {
    state.selectedProject.Actors.push(actor);
    Vue.set(state.actorMap, actor.ID, actor);
    if (actor.ZoneIDs) {
      for (let zoneID of actor.ZoneIDs) {
        if (!state.zoneActors[zoneID]) {
          Vue.set(state.zoneActors, zoneID, {});
        }
        Vue.set(state.zoneActors[zoneID], actor.ID, true);
      }
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
    Vue.set(state, 'dialogSiblings', []);

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
      d.ID = d.ID.toString();
      d.ParentDialogIDs = d.ParentDialogIDs || [];
      d.ChildDialogIDs = d.ChildDialogIDs || [];
      Vue.set(state.dialogMap, d.ID, d);
      if (d.IsRoot) {
        rdialogs.add(d.ID);
      }
    }

    // Build dialog graph
    // In other words, construct dialog relations
    for (const r of payload.actor.DialogRelations) {
      let prepend = state.dialogMap[r.ParentNodeID].ChildDialogIDs || [];
      Vue.set(state.dialogMap[r.ParentNodeID], 'ChildDialogIDs', [...prepend, r.ChildNodeID.toString()]);

      prepend = state.dialogMap[r.ChildNodeID].ParentDialogIDs || [];
      Vue.set(state.dialogMap[r.ChildNodeID], 'ParentDialogIDs', [...prepend, r.ParentNodeID.toString()]);
    }

    state.rootDialogs = [...rdialogs];
  },

  updateZone(state, zone) {
    Vue.set(state.zoneMap, zone.ID, zone);
    if (!state.zoneActors[zone.ID]) {
      Vue.set(state.zoneActors, zone.ID, {});
    }
  },

  // TODO: Add comments
  selectEntity(state, entity) {
    let redirect = entity.redirect;
    delete entity.redirect;
    state.selectedEntity = new SelectedEntity(entity);
    if (redirect) {
      if (entity.kind === 'dialog') {
        router.push({ name: 'DialogHome', params: { id: entity.data.ActorID, dialog_id: entity.data.ID } });
      } else {
        router.push({ name: `${titlecase(entity.kind)}Home`, params: { id: entity.data.ID } });
      }
    }
  },

  clearSelectedEntity(state, entity) {
    state.selectedEntity = new SelectedEntity();
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
