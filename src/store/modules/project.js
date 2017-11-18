import Vue from 'vue';

import router from '@/router';
import API from '@/api';
import { SelectedEntity } from '@/store/models';
import { titleCase } from '@/utilities';

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
      if (!state.actorMap[za.ActorID].zoneIDs) {
        Vue.set(state.actorMap[za.ActorID], 'zoneIDs', []);
      }
      Vue.set(state.zoneActors[za.ZoneID], za.ActorID.toString(), true);
      state.actorMap[za.ActorID].zoneIDs.push(za.ZoneID.toString());
    }
    console.log('The state', state);

    router.push({ name: 'ProjectHome' });

    return state;
  };
}

const state = {
  initializing: true,

  user: null,
  token: null,

  path: '',

  projectsList: null,
  selectedProject: null,
  selectedEntity: new SelectedEntity(),

  createID: 0
};

const actions = {

  generateID({ commit, state }) {
    commit('incrCreate');
    return `harihara-${state.createID}`;
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

  selectProject({ dispatch, state }, p) {
    Vue.set(state, 'initializing', true);
    return dispatch('resetState', { keepAuth: true })
      .then(newState => {
        return API.GetProject(p)
        .then(setProject(newState))
        .then(newState => {
          Vue.set(newState, 'initializing', false);
        });
      });
  },

  publish({ commit, state }) {
    API.Publish();
  },

  unauthorized({ dispatch, state }) {
    return dispatch('resetState').then(() => {
      router.push({ name: 'SignIn' });
    });
  },

  NotFound() {
    router.push({ name: 'NotFound' });
  },

  reset({ dispatch }) {
    return dispatch('resetState', { keepAuth: true });
  }
};

const mutations = {

  updateToken(state, value) {
    state.token = value;
  },

  incrCreate(state) {
    state.createID++;
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
        router.push({ name: `${titleCase(entity.kind)}Home`, params: { id: entity.data.ID } });
      }
    }
  },

  clearSelectedEntity(state, entity) {
    state.selectedEntity = new SelectedEntity();
  }
};

export default {
  state,
  actions,
  mutations
};
