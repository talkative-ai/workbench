import Vue from 'vue';
import dcopy from 'deep-copy';

import API from '@/api';
import { PATCH_ACTION } from '@/const';
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

const state = {
  dialogMap: {},
  rootDialogs: [],
  newDialog: null,

  dialogSiblings: [],
  dialogChain: {},

  // Tracking dialogs being edited
  dialogIsEditing: null,
  dialogEditingCopy: {},
  dialogEditError: {},

  // Connecting dialog
  connectingDialogID: false,
  previewConnect: false,
  conversationCycle: false
};

const actions = {
  updateDialog({ commit, state }) {
    if (state.selectedEntity.kind !== 'actor') return;
    API.PutActor(state.selectedEntity.data);
  },

  selectDialogPreviewConnect({ state, dispatch, commit }, { dialogID, isChild = false, relativeParent }) {
    let isChildOfConnecting = state.dialogMap[state.connectingDialogID].ChildDialogIDs.includes(dialogID);
    if (state.previewConnect !== dialogID) {
      dispatch('cancelPreviewConnectDialog');
    }

    if (state.connectingDialogID &&
        !isChildOfConnecting &&
        state.connectingDialogID !== dialogID) {
      Vue.set(state, 'previewConnect', dialogID);
      state.dialogMap[state.connectingDialogID].ChildDialogIDs.push(dialogID);
    }

    // A specific dialog is being selected
    // If it's a child
    if (isChild) {
      relativeParent = relativeParent || state.dialogMap[state.actorSelectedDialogID[state.selectedEntity.data.ID]];
      commit('setDialogSiblings', relativeParent.ChildDialogIDs);
      commit('updateDialogChain', state.dialogChain);

      // Otherwise it's a sibling
    } else {
      commit('updateDialogChain', state.dialogChain);
    }

    if (!isChildOfConnecting && state.connectingDialogID !== dialogID) {
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
    }

    commit('setSelectedDialog', dialogID);
  },

  selectChainPreviewConnect({ state, dispatch, commit }, index) {
    dispatch('cancelPreviewConnectDialog');
    // If linking a dialog, then the chain doesn't navigate
    // But rather previews a conversation cycle
    if (state.connectingDialogID && state.connectingDialogID !== state.dialogChain[state.selectedEntity.data.ID][index]) {
      Vue.set(state, 'previewConnect', state.dialogChain[state.selectedEntity.data.ID][index]);
      Vue.set(state, 'conversationCycle', true);
    }

    if (index === 0) {
      commit('setDialogSiblings', state.rootDialogs);
    }

    dispatch('selectDialogPreviewConnect', {
      dialogID: state.dialogChain[state.selectedEntity.data.ID][index],
      isChild: index > 0,
      relativeParent: state.dialogMap[state.dialogChain[state.selectedEntity.data.ID][index - 1]]
    });
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
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);

      // Otherwise it's a sibling
    } else {
      state.dialogChain[state.selectedEntity.data.ID].pop();
      state.dialogChain[state.selectedEntity.data.ID].push(dialogID);
      commit('updateDialogChain', state.dialogChain);
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
            PatchAction: PATCH_ACTION.CREATE
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

  saveConnectDialog({ state, dispatch }, dialogID) {
    state.selectedEntity.data.DialogRelations.push({
      ChildNodeID: state.previewConnect,
      ParentNodeID: state.connectingDialogID,
      PatchAction: PATCH_ACTION.CREATE
    });
    API.PutActor(state.selectedEntity.data);
    dispatch('cancelConnectDialog', true);
  },

  cancelConnectDialog({ state, dispatch }, keep) {
    let oldID = state.connectingDialogID;
    Vue.set(state, 'connectingDialogID', false);
    if (state.previewConnect) {
      Vue.set(state, 'previewConnect', false);
      Vue.set(state, 'conversationCycle', false);
      if (!keep) {
        state.dialogMap[oldID].ChildDialogIDs.pop();
        dispatch('selectChain', -2);
      }
    }
  },

  cancelPreviewConnectDialog({ state, dispatch }) {
    if (state.previewConnect) {
      Vue.set(state, 'previewConnect', false);
      state.dialogMap[state.connectingDialogID].ChildDialogIDs.pop();
      if (state.dialogChain[state.selectedEntity.data.ID].slice(-1).pop() !== state.connectingDialogID) {
        state.dialogChain[state.selectedEntity.data.ID].pop();
      }
      Vue.set(state, 'conversationCycle', false);
    }
  }

};

const mutations = {
  setDialogAction(state, { dialogID, action }) {
    Vue.set(state.dialogEditingCopy[dialogID], 'action', action);
  },

  setDialogZone(state, { dialogID, zoneID }) {
    Vue.set(state.dialogEditingCopy[dialogID].AlwaysExec, 'SetZone', Number(zoneID));
  },

  updateDialogChain(state, value) {
    state.dialogChain = value;
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
  },

  saveEditDialogError(state, { dialogID, error }) {
    Vue.set(state.dialogEditError, dialogID, error);
  }

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
