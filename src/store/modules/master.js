import router from '@/router';
import API from '@/api';
import { SelectedEntity } from '@/store/models';
import { titleCase } from '@/utilities';
import { PATCH_ACTION } from '@/const';

const state = {
  user: null,
  token: null,

  path: '',

  projectsList: null,
  selectedEntity: new SelectedEntity(),

  createID: 0
};

const getters = {
  selectedEntity: state => state.selectedEntity.data,
  selectedEntityID: state => state.selectedEntity.data ? state.selectedEntity.data.ID : null
};

const actions = {

  generateID({ commit, state }) {
    commit('incrCreate');
    return `harihara-${state.createID}`;
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
        commit('user', user);
        router.push({ name: 'ProjectSelect' });
      });
  },

  publish({ commit, state }) {
    API.Publish();
  },

  unauthorized({ dispatch, state }) {
    return dispatch('resetState', {}, { root: true }).then(() => {
      router.push({ name: 'SignIn' });
    });
  },

  NotFound() {
    router.push({ name: 'NotFound' });
  },

  reset({ dispatch }) {
    return dispatch('resetState', { keepAuth: true }, { root: true });
  },

  selectEntity({ state, commit }, entity) {
    let navigate = entity.navigate;
    delete entity.navigate;
    commit('selectedEntity', entity);
    if (navigate) {
      if (entity.kind === 'dialog') {
        router.push({ name: 'DialogHome', params: { id: entity.data.ActorID, dialog_id: entity.data.ID } });
      } else {
        router.push({ name: `${titleCase(entity.kind)}Home`, params: { id: entity.data.ID } });
      }
    }
  }
};

const mutations = {

  token(state, value) {
    state.token = value;
  },

  incrCreate(state) {
    state.createID++;
  },

  clearSelectedEntity(state) {
    state.selectedEntity = new SelectedEntity();
  },

  selectedEntity(state, entity) {
    state.selectedEntity = new SelectedEntity(entity);
  },

  user(state, user) {
    state.user = user;
  },

  path(state, path) {
    state.path = path;
  },

  projectsList(state, list) {
    state.projectsList = list;
  },

  addZone(state, zone) {
    state.selectedProject.Zones.push(zone);
  },

  replaceNewDialog(state, dialog) {
    // Replace the dialog in the actor entity
    state.selectedEntity.data.Dialogs.pop();
    state.selectedEntity.data.Dialogs.push(dialog);

    if (!dialog.IsRoot) {
      state.selectedEntity.data.DialogRelations.pop();
      state.selectedEntity.data.DialogRelations.push({
        ChildNodeID: dialog.ID,
        ParentNodeID: dialog.ParentDialogIDs[0]
      });
    }
  },

  stageCreateNewDialog(state, dialog) {
    state.selectedEntity.data.Dialogs.push(dialog);
    if (!dialog.IsRoot) {
      state.selectedEntity.data.DialogRelations.push({
        ChildNodeID: dialog.CreateID,
        ParentNodeID: dialog.ParentDialogIDs[0],
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
    for (let i = 0; i < state.selectedEntity.data.Dialogs.length; i++) {
      if (state.selectedEntity.data.Dialogs[i].ID === dialog.ID) {
        state.selectedEntity.data.Dialogs.splice(i, 1, dialog);
        return;
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
