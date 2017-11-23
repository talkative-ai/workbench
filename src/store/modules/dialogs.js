import Vue from 'vue';
import dcopy from 'deep-copy';

import API from '@/api';
import { defaultDialog } from '@/store/models';

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

function determineDeleteCandidates(nodeIDToDelete, map) {
  let deletionCandidates = {};

  function edgesFromRoot(nodeID, track) {
    deletionCandidates[nodeID] = !(function() {
      if (deletionCandidates[nodeID] != null) {
        return !deletionCandidates[nodeID];
      }
      if (track[nodeID]) {
        return false;
      }

      track[nodeID] = true;

      if (map[nodeID].IsRoot) {
        return true;
      }
      for (let id of map[nodeID].ParentDialogIDs) {
        if (edgesFromRoot(id, Object.assign({}, track))) {
          return true;
        }
      }
      return false;
    })();

    return !deletionCandidates[nodeID];
  }

  for (let id of map[nodeIDToDelete].ChildDialogIDs) {
    if (!edgesFromRoot(id, { [nodeIDToDelete]: true })) {
      deletionCandidates[id] = true;
    }
  }

  function recurseChildren(dialog, fn, track = {}) {
    track[dialog] = true;
    for (let child of map[dialog].ChildDialogIDs) {
      if (track[child]) continue;
      fn(child);
      recurseChildren(child, fn, track);
    }
  }

  for (let id of Object.keys(deletionCandidates)) {
    recurseChildren(id, childID => edgesFromRoot(childID, { [id]: true }));
  }

  return deletionCandidates;
}

const state = {

  actorSelectedDialogID: {},

  dialogMap: {},
  rootDialogs: [],
  newDialog: null,

  dialogSiblings: [],
  dialogChain: {},

  // Tracking dialogs being edited
  dialogEditingID: null,
  dialogEditingCopy: {},
  dialogEditError: {},

  // Connecting dialog
  connectingFromDialogID: false,
  connectingToDialogID: false,
  isConversationCycle: false,

  stagedForDeletion: null,
  hasEdgeFromRoot: {},
  poppedValue: null
};

const getters = {
  rootDialogs: (state) => {
    if (state.stagedForDeletion) {
      return [ state.stagedForDeletion ];
    } else {
      return state.rootDialogs;
    }
  },
  selectedEntityID: (state, getters, rootState) => {
    if (state.stagedForDeletion) {
      return `deletion-${state.stagedForDeletion}`;
    } else {
      return rootState.master.selectedEntity.data ? rootState.master.selectedEntity.data.ID : null;
    }
  },
  currentDialogChain: (state, getters, rootState) => {
    return state.dialogChain[getters.selectedEntityID] || [];
  }
};

const actions = {
  updateDialog({ commit, rootState }) {
    if (rootState.master.selectedEntity.kind !== 'actor') return;
    API.PutActor(rootState.master.selectedEntity.data);
  },

  selectDialogPreviewConnect({ state, rootState, dispatch, commit }, { dialogID, isChild = false, relativeParent }) {
    let isChildOfConnecting = state.dialogMap[state.connectingFromDialogID].ChildDialogIDs.includes(dialogID);
    if (state.connectingToDialogID !== dialogID) {
      dispatch('cancelPreviewConnectDialog');
    }

    if (state.connectingFromDialogID &&
        !isChildOfConnecting &&
        state.connectingFromDialogID !== dialogID) {
      commit('connectingToDialogID', dialogID);
    }

    // A specific dialog is being selected
    // If it's a child
    if (isChild) {
      relativeParent = relativeParent || state.dialogMap[state.actorSelectedDialogID[rootState.master.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildDialogIDs);
      commit('updateDialogChain', state.dialogChain);

      // Otherwise it's a sibling
    } else {
      commit('updateDialogChain', state.dialogChain);
    }

    if (!isChildOfConnecting && state.connectingFromDialogID !== dialogID) {
      dispatch('addDialogChain', dialogID);
    }

    dispatch('setSelectedDialog', dialogID);
  },

  selectChainPreviewConnect({ state, rootState, dispatch, commit, getters }, index) {
    dispatch('cancelPreviewConnectDialog');
    // If linking a dialog, then the chain doesn't navigate
    // But rather previews a conversation cycle
    if (state.connectingFromDialogID && state.connectingFromDialogID !== getters.currentDialogChain[index]) {
      commit('connectingToDialogID', getters.currentDialogChain[index]);
      commit('isConversationCycle', true);
    }

    if (index === 0) {
      commit('setDialogSiblings', state.rootDialogs);
    }

    dispatch('selectDialogPreviewConnect', {
      dialogID: getters.currentDialogChain[index],
      isChild: index > 0,
      relativeParent: state.dialogMap[getters.currentDialogChain[index - 1]]
    });
  },

  // selectDialog manages the state of the currently selected dialog
  // and all previously selected parent dialogs within the dialogChain
  selectDialog({ state, rootState, dispatch, commit, getters }, { dialogID, isChild = false, relativeParent } = {}) {
    // If no dialog is specified
    // and there is no default selected dialog
    // and there exist root dialogs
    if (!dialogID &&
        !state.actorSelectedDialogID[getters.selectedEntityID] &&
        getters.rootDialogs.length > 0) {
      commit('setDialogSiblings', getters.rootDialogs);
      dispatch('setSelectedDialog', getters.rootDialogs[0]);
      dispatch('addDialogChain', getters.rootDialogs[0]);
      commit('updateDialogChain', state.dialogChain);
      return;
      // Otherwise if no dialog is specified
      // and there is a default selected node
    } else if (!dialogID && state.actorSelectedDialogID[getters.selectedEntityID]) {
      // If the dialogChain length is one, then this is a root dialog selected by default
      // Set the sibling dialogs accordingly
      if (getters.currentDialogChain.length === 1) {
        commit('setDialogSiblings', getters.rootDialogs);
      } else {
        // Otherwise this isn't a root dialog selected
        // Therefore we get the siblings of the current dialog relative to the currently selected parent in the chain
        // The reason it's important to get siblings from the relative parent is because a single dialog can have
        // multiple parents, and each parent can have different children.
        // In other words, a signle dialog can have multiple sibling sets depending on the selected dialog.
        commit('setDialogSiblings', state.dialogMap[getters.currentDialogChain.slice(-2, -1).pop()].ChildDialogIDs);
      }
      dispatch('setSelectedDialog', state.actorSelectedDialogID[getters.selectedEntityID]);
      return;
    } else if (!dialogID) {
      // Otherwise this is a no-op
      return;
    }

    // A specific dialog is being selected
    // If it's a child
    if (isChild) {
      relativeParent = relativeParent || state.dialogMap[state.actorSelectedDialogID[rootState.master.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildDialogIDs);
      dispatch('addDialogChain', dialogID);
      commit('updateDialogChain', state.dialogChain);

      // Otherwise it's a sibling
    } else {
      commit('popDialogChain', getters.selectedEntityID);
      dispatch('addDialogChain', dialogID);
      commit('updateDialogChain', state.dialogChain);
    }

    dispatch('setSelectedDialog', dialogID);
  },

  // selectChain is similar to selectDialog except that it's always going to be a parent dialog
  selectChain({ state, rootState, dispatch, commit, getters }, index) {
    if (!getters.currentDialogChain) {
      return;
    }

    if (index < 0) {
      index = getters.currentDialogChain.length + index;
    }

    if (index === 0) {
      dispatch('sliceChain', 1);
      commit('setDialogSiblings', getters.rootDialogs);
      dispatch('setSelectedDialog', getters.currentDialogChain[0]);
      return;
    }
    dispatch('selectDialog', {
      dialogID: getters.currentDialogChain[index],
      isChild: true,
      relativeParent: state.dialogMap[getters.currentDialogChain[index - 1]]
    });
    dispatch('sliceChain', index + 1);
  },

  editDialog({ state, commit, dispatch }, dialogID) {
    dispatch('cancelEditDialog');
    commit('editDialog', dialogID);
  },

  saveEditDialog({ state, rootState, commit, dispatch, getters }, dialogID) {
    if (state.dialogEditingID === dialogID) {
      let error = validateDialog(state.dialogEditingCopy[dialogID]);
      if (error) {
        commit('saveEditDialogError', { dialogID, error });
        return;
      }
      if (state.newDialog && state.newDialog.ID === dialogID) {
        commit('newDialog', dcopy(state.dialogEditingCopy[dialogID]));
        delete state.newDialog.ID;
        commit('master/stageCreateNewDialog', state.newDialog, { root: true });
      } else {
        commit('master/overwriteDialog', state.dialogEditingCopy[dialogID], { root: true });
      }
      commit('saveEditDialog', dialogID);
      let p = API.PutActor(rootState.master.selectedEntity.data);
      if (state.newDialog) {
        p.then(result => {
          const newID = result[state.newDialog.CreateID].toString();
          commit('popDialogChain', getters.selectedEntityID);
          commit('updateDialogChain', state.dialogChain);
          commit('replaceNewDialog', result);
          commit('master/replaceNewDialog', state.dialogMap[newID], { root: true });
          dispatch('selectDialog', { dialogID: newID, isChild: !state.dialogMap[newID].IsRoot });
        });
      }
      return p;
    }
  },

  cancelEditDialog({ state, commit, dispatch, getters }) {
    if (state.newDialog && state.newDialog.ID === state.dialogEditingID) {
      if (state.newDialog.IsRoot) {
        dispatch('setSelectedDialog', null);
        if (state.rootDialogs.length > 1) {
          dispatch('sliceChain', 0);
          dispatch('selectDialog');
        } else {
          commit('popDialogChain', getters.selectedEntityID);
          commit('updateDialogChain', state.dialogChain);
        }
      } else {
        dispatch('selectChain', -2);
      }
    }
    commit('cancelEditDialog');
  },

  async startNewConversation({ state, getters, commit, dispatch }, parentDialogID) {
    let newDialog = dcopy(defaultDialog);
    let newID = await dispatch('master/generateID', {}, { root: true });
    newDialog.ID = newID;
    newDialog.CreateID = newID;
    if (!parentDialogID) {
      commit('newRootDialog', newDialog);
      if (state.rootDialogs.length === 1) {
        dispatch('addDialogChain', newDialog.ID);
      }
      dispatch('selectChain', 0);
    } else {
      commit('newChildDialog', { newDialog: newDialog, parentID: parentDialogID });
      if (getters.currentDialogChain.slice(-1).pop() === parentDialogID) {
        dispatch('addDialogChain', newDialog.ID);
        commit('updateDialogChain', state.dialogChain);
      }
    }
    commit('editDialog', newDialog.ID);
  },

  beginConnectDialog({ commit }, dialogID) {
    commit('connectingFromDialogID', dialogID);
  },

  saveConnectDialog({ state, rootState, commit, dispatch }, dialogID) {
    commit('master/stageCreateDialogRelation', {
      ChildNodeID: state.connectingToDialogID,
      ParentNodeID: state.connectingFromDialogID
    }, { root: true });
    API.PutActor(rootState.master.selectedEntity.data);
    dispatch('cancelConnectDialog', true);
  },

  cancelConnectDialog({ state, commit, dispatch }, keepConnection) {
    let oldID = state.connectingFromDialogID;
    commit('connectingFromDialogID', false);
    if (state.connectingToDialogID) {
      commit('connectingToDialogID', false);
      commit('isConversationCycle', false);
      if (!keepConnection) {
        state.dialogMap[oldID].ChildDialogIDs.pop();
        dispatch('selectChain', -2);
      }
    } else if (state.connectingFromDialogID) {
      if (!keepConnection) {
        dispatch('selectChain', -1);
      }
    }
  },

  cancelPreviewConnectDialog({ state, getters, commit, dispatch }) {
    if (state.connectingToDialogID) {
      commit('connectingToDialogID', false);
      state.dialogMap[state.connectingFromDialogID].ChildDialogIDs.pop();
      if (getters.currentDialogChain.slice(-1).pop() !== state.connectingFromDialogID) {
        commit('popDialogChain', getters.selectedEntityID);
      }
      commit('isConversationCycle', false);
    }
  },

  addDialogChain({ getters, commit }, dialogID) {
    commit('addDialogChain', { actorID: getters.selectedEntityID, dialogID });
  },

  setSelectedDialog({ rootState, commit }, dialogID) {
    commit('setSelectedDialog', { actorID: rootState.master.selectedEntity.data.ID, dialogID });
  },

  sliceChain({ rootState, commit }, index) {
    commit('sliceChain', { actorID: rootState.master.selectedEntity.data.ID, index });
  },

  stageDeletion({ state, commit, dispatch, getters }, dialogID) {
    let deletionCandidates = determineDeleteCandidates(dialogID, state.dialogMap);
    deletionCandidates[dialogID] = true;
    commit('setDialogSiblings', [ dialogID ]);
    commit('stageDelete', {
      dialogID,
      deletionCandidates
    });
    dispatch('selectDialog', { dialogID, isChild: false });
  },

  confirmDeletion({ state, commit }) {
    // Execute delete in API
    // Delete from state
  },

  cancelDeletion({ state, commit }) {
    commit('cancelStageDelete');
  }

};

const mutations = {

  dialogInMap(state, dialog) {
    Vue.set(state.dialogMap, dialog.ID, dialog);
  },

  relation(state, { parentID, childID }) {
    Vue.set(state.dialogMap[parentID], 'ChildDialogIDs', state.dialogMap[parentID]['ChildDialogIDs'] || []);
    Vue.set(state.dialogMap[childID], 'ParentDialogIDs', state.dialogMap[childID]['ParentDialogIDs'] || []);
    state.dialogMap[parentID]['ChildDialogIDs'].push(childID.toString());
    state.dialogMap[childID]['ParentDialogIDs'].push(parentID.toString());
  },

  setDialogAction(state, { dialogID, action }) {
    Vue.set(state.dialogEditingCopy[dialogID], 'action', action);
  },

  setDialogZone(state, { dialogID, zoneID }) {
    Vue.set(state.dialogEditingCopy[dialogID].AlwaysExec.SetZone, Number(zoneID));
  },

  updateDialogChain(state, value) {
    Vue.set(state, 'dialogChain', value);
  },

  editDialog(state, dialogID) {
    Vue.set(state.dialogEditError, dialogID, null);
    Vue.set(state, 'dialogEditingID', dialogID);
    Vue.set(state.dialogEditingCopy, dialogID, dcopy(state.dialogMap[dialogID]));
  },

  saveEditDialog(state, dialogID) {
    Vue.set(state.dialogEditError, dialogID, null);
    Vue.set(state, 'dialogEditingID', false);
    Vue.set(state.dialogMap[dialogID], dcopy(state.dialogEditingCopy[dialogID]));
  },

  replaceNewDialog(state, newIDMap) {
    const dialog = dcopy(state.newDialog);

    // Update the dialog with the backend generated ID
    Vue.set(dialog, 'ID', newIDMap[state.newDialog.CreateID].toString());
    Vue.set(dialog, 'CreateID', null);

    // Add the official dialog to the map
    Vue.set(state.dialogMap, dialog.ID, dialog);

    if (!dialog.IsRoot) {
      state.dialogMap[dialog.ParentDialogIDs[0]].ChildDialogIDs.pop();
      state.dialogMap[dialog.ParentDialogIDs[0]].ChildDialogIDs.push(dialog.ID);
    } else {
      state.rootDialogs.pop();
      state.rootDialogs.push(dialog.ID);
    }

    // Remove the old dialog from the map
    Vue.delete(state.dialogMap, state.newDialog.CreateID);
    Vue.delete(state, 'newDialog');
  },

  cancelEditDialog(state) {
    if (state.newDialog && state.newDialog.ID === state.dialogEditingID) {
      if (state.newDialog.IsRoot) {
        state.rootDialogs.pop();
      } else {
        state.dialogMap[state.newDialog.ParentDialogIDs[0]].ChildDialogIDs.pop();
      }
      Vue.delete(state.dialogMap, state.dialogEditingID);
      Vue.delete(state, 'newDialog');
    }
    Vue.set(state, 'dialogEditingID', false);
  },

  sliceChain(state, { actorID, index }) {
    Vue.set(state.dialogChain, actorID, state.dialogChain[actorID] ? state.dialogChain[actorID].slice(0, index) : []);
  },

  setDialogSiblings(state, dialogs) {
    Vue.set(state, 'dialogSiblings', dialogs);
  },

  setSelectedDialog(state, { dialogID, actorID }) {
    Vue.set(state.actorSelectedDialogID, actorID, dialogID);
  },

  newDialog(state, options = {}) {
    state.newDialog = { ...defaultDialog, ...options };
  },

  newRootDialog(state, newDialog) {
    Vue.set(state.dialogMap, newDialog.ID, newDialog);
    state.rootDialogs.push(newDialog.ID);
    Vue.set(state, 'newDialog', newDialog);
  },

  newChildDialog(state, { newDialog, parentID }) {
    Vue.set(newDialog, 'IsRoot', false);
    Vue.set(state.dialogMap, newDialog.ID, newDialog);
    Vue.set(state.dialogMap[parentID], 'ChildDialogIDs', state.dialogMap[parentID].ChildDialogIDs || []);
    state.dialogMap[parentID].ChildDialogIDs.push(newDialog.ID);
    state.dialogMap[newDialog.ID].ParentDialogIDs.push(parentID);
    Vue.set(state, 'newDialog', newDialog);
  },

  saveEditDialogError(state, { dialogID, error }) {
    Vue.set(state.dialogEditError, dialogID, error);
  },

  initializeChain(state, ActorID) {
    Vue.set(state.dialogChain, ActorID, []);
  },

  clearView(state, ActorID) {
    Vue.set(state, 'rootDialogs', []);
    Vue.set(state, 'dialogMap', {});
    Vue.set(state, 'dialogSiblings', []);
  },

  connectingToDialogID(state, dialogID) {
    Vue.set(state, 'connectingToDialogID', dialogID);
    if (dialogID) {
      state.dialogMap[state.connectingFromDialogID].ChildDialogIDs.push(dialogID);
    }
  },

  connectingFromDialogID(state, dialogID) {
    Vue.set(state, 'connectingFromDialogID', dialogID);
  },

  isConversationCycle(state, bool) {
    Vue.set(state, 'isConversationCycle', bool);
  },

  addDialogChain(state, { actorID, dialogID }) {
    if (!state.dialogChain[actorID]) {
      Vue.set(state.dialogChain, actorID, []);
    }
    state.dialogChain[actorID].push(dialogID);
  },

  popDialogChain(state, actorID) {
    state.poppedValue = state.dialogChain[actorID].pop();
  },

  rootDialogs(state, rootDialogs) {
    Vue.set(state, 'rootDialogs', rootDialogs);
  },

  stageDelete(state, { dialogID, deletionCandidates }) {
    Vue.set(state, 'stagedForDeletion', dialogID);
    Vue.set(state, 'deletionCandidates', deletionCandidates);
  },

  cancelStageDelete(state) {
    Vue.set(state.dialogChain, `deletion-${state.stagedForDeletion}`, []);
    Vue.set(state, 'deletionCandidates', {});
    Vue.delete(state, 'stagedForDeletion');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
