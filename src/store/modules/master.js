import router from '@/router';
import API from '@/api';
import { SelectedEntity } from '@/store/models';
import { titleCase } from '@/utilities';

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

const getters = {
  selectedEntity: state => state.selectedEntity.data,
  selectedEntityID: state => state.selectedEntity.data ? state.selectedEntity.data.ID : null
};

const actions = {

  generateID({ commit, state }) {
    commit('incrCreate');
    return `harihara-${state.createID}`;
  },

  createProject({ dispatch, state }, project) {
    return API.CreateProject(project)
      .then(res => dispatch('setProject', res));
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

  selectProject({ dispatch, commit, state }, p) {
    commit('initializing', true);
    return dispatch('resetState', { keepAuth: true }, { root: true })
      .then(newState => {
        return API.GetProject(p)
        .then(newState => dispatch('setProject', newState))
        .then(newState => {
          commit('initializing', false);
        });
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

  setProject({ state, commit }, project) {
    if (!project.Actors) project.Actors = [];
    if (!project.Zones) project.Zones = [];
    if (!project.ZoneActors) project.ZoneActors = [];
    if (!project.Dialogs) project.Dialogs = [];
    if (!project.DialogRelations) project.DialogRelations = [];

    commit('selectedProject', project);
    for (const a of project.Actors) {
      commit('actors/actorInMap', a, { root: true });
    }
    for (const z of project.Zones) {
      commit('zones/zoneInMap', z, { root: true });
    }
    for (const za of project.ZoneActors) {
      commit('zones/addActor', { ZoneID: za.ZoneID, ActorID: za.ActorID }, { root: true });
      commit('actors/addToZone', { ZoneID: za.ZoneID, ActorID: za.ActorID }, { root: true });
    }

    router.push({ name: 'ProjectHome' });
  },

  selectEntity({ state, commit }, entity) {
    let redirect = entity.redirect;
    delete entity.redirect;
    commit('selectedEntity', entity);
    if (redirect) {
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

  initializing(state, bool) {
    state.initializing = bool;
  },

  selectedProject(state, project) {
    state.selectedProject = project;
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
