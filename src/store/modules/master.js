import Vue from 'vue';

import router from '@/router';
import API from '@/api';
import { SelectedEntity } from '@/store/models';
import { titleCase } from '@/utilities';
import { PATCH_ACTION } from '@/const';

const state = {
  user: null,
  intercomHMAC: null,
  token: null,

  path: '',

  projectsList: null,
  selectedEntity: new SelectedEntity(),

  createID: 0,

  isLoading: false
};

const getters = {
  selectedEntity: state => state.selectedEntity.data,
  selectedEntityID: state => state.selectedEntity.data ? state.selectedEntity.data.ID : null
};

const actions = {

  generateID({ commit, state }) {
    commit('incrCreate');
    return `create-${state.createID}`;
  },

  getProjects({ dispatch }) {
    return API.GetProjects();
  },

  authGoogle({ commit, dispatch, state }, googleUser) {
    const profile = googleUser.getBasicProfile();
    return new Promise((resolve, reject) => {
      API.PostAuthGoogle({
        Token: googleUser.getAuthResponse().id_token,
        GivenName: profile.getGivenName(),
        FamilyName: profile.getFamilyName()
      })
      .then(result => {
        return result.json();
      })
      .then(response => {
        if (response.code) {
          reject(response);
          return;
        }
        commit('user', response.User);
        commit('intercomHMAC', response.IntercomHMAC);
        dispatch('bootIntercom');
        router.push({ name: 'ProjectSelect' });
        resolve(response);
        return;
      })
      .catch(err => {
        return err.json();
      })
      .then(err => {
        reject(err);
      });
    });
  },

  bootIntercom({ state }) {
    if (!state.intercomHMAC) {
      return;
    }
    window.Intercom('boot', {
      app_id: 'n7g235n3',
      email: state.user.Email, // Email address
      user_hash: state.intercomHMAC,
      name: `${state.user.GivenName} ${state.user.FamilyName}`
    });
  },

  unauthorized({ dispatch, state }) {
    return dispatch('resetState', {}, { root: true }).then(() => {
      router.push({ name: 'SignIn' });
    });
  },

  NotFound() {
    router.push({ name: 'NotFound' });
  },

  selectEntity({ state, commit }, entity) {
    let navigate = entity.navigate;
    delete entity.navigate;
    commit('selectedEntity', entity);
    if (navigate) {
      router.push({ name: `${titleCase(entity.kind)}Home`, params: { id: entity.data.ID } });
    }
  },

  token({ commit }, token) {
    commit('token', token);
  },

  isLoading({ commit }, isLoading) {
    commit('isLoading', isLoading);
  }
};

const mutations = {

  isLoading(state, value) {
    state.isLoading = value;
  },

  token(state, value) {
    Vue.set(state, 'token', value);
  },

  intercomHMAC(state, value) {
    Vue.set(state, 'intercomHMAC', value);
  },

  incrCreate(state) {
    state.createID++;
  },

  clearSelectedEntity(state) {
    Vue.set(state, 'selectedEntity', new SelectedEntity());
  },

  selectedEntity(state, entity) {
    Vue.set(state, 'selectedEntity', new SelectedEntity(entity));
  },

  user(state, user) {
    Vue.set(state, 'user', user);
  },

  path(state, path) {
    Vue.set(state, 'path', path);
  },

  projectsList(state, list) {
    Vue.set(state, 'projectsList', list);
  },

  replaceNewDialog(state, dialog) {
    // Replace the dialog in the actor entity
    state.selectedEntity.data.Dialogs.pop();
    state.selectedEntity.data.Dialogs.push(dialog);

    if (!dialog.IsRoot) {
      state.selectedEntity.data.DialogRelations.pop();
      state.selectedEntity.data.DialogRelations.push({
        ChildNodeID: dialog.ID,
        ParentNodeID: dialog.parentDialogIDs[0]
      });
    }
  },

  stageCreateNewDialog(state, dialog) {
    state.selectedEntity.data.Dialogs.push(dialog);
    if (!dialog.IsRoot) {
      state.selectedEntity.data.DialogRelations.push({
        ChildNodeID: dialog.CreateID,
        ParentNodeID: dialog.parentDialogIDs[0],
        PatchAction: PATCH_ACTION.CREATE
      });
    }
  },

  stageCreateDialogRelation(state, { ChildNodeID, ParentNodeID }) {
    state.selectedEntity.data.DialogRelations.push({
      ChildNodeID,
      ParentNodeID,
      PatchAction: PATCH_ACTION.CREATE
    });
  },

  overwriteDialog(state, dialog) {
    Vue.set(dialog, 'PatchAction', PATCH_ACTION.UPDATE);
    for (let i = 0; i < state.selectedEntity.data.Dialogs.length; i++) {
      if (state.selectedEntity.data.Dialogs[i].ID === dialog.ID) {
        state.selectedEntity.data.Dialogs.splice(i, 1, dialog);
        return;
      }
    }
  },

  stageDeleteDialog(state, dialogID) {
    let index = state.selectedEntity.data.Dialogs.findIndex(dialog => {
      return dialog.ID === dialogID;
    });
    Vue.set(state.selectedEntity.data.Dialogs[index], 'PatchAction', PATCH_ACTION.DELETE);
  },

  stageDeleteDialogRelation(state, { childID, parentID }) {
    let index = state.selectedEntity.data.DialogRelations.findIndex(rel => {
      return rel.ChildNodeID === childID && rel.ParentNodeID === parentID;
    });
    Vue.set(state.selectedEntity.data.DialogRelations[index], 'PatchAction', PATCH_ACTION.DELETE);
  },

  deleteDialog(state, dialogID) {
    let index = state.selectedEntity.data.Dialogs.findIndex(dialog => {
      return dialog.ID === dialogID;
    });
    Vue.delete(state.selectedEntity.data.Dialogs, index);
  },

  deleteDialogRelation(state, { childID, parentID }) {
    let index = state.selectedEntity.data.DialogRelations.findIndex(rel => {
      return rel.ChildNodeID === childID && rel.ParentNodeID === parentID;
    });
    Vue.delete(state.selectedEntity.data.DialogRelations, index);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
