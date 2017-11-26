import Vue from 'vue';

import API from '@/api';
import { PUBLISH_STATUS } from '@/const';

const state = {
  initializing: true,
  selectedProject: null,
  metadata: {},
  checkingStatus: false,
  checkStatusTimeout: null
};

const getters = {
  selectedProjectTitle(state) {
    return state.selectedProject ? state.selectedProject.Title : '';
  }
};

const actions = {

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

  refreshProject({ dispatch, commit, state }) {
    return API.GetProject(state.selectedProject)
      .then(newState => dispatch('setProject', newState))
      .then(newState => {
        commit('initializing', false);
      });
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
  },

  createProject({ dispatch, state }, project) {
    return API.CreateProject(project)
      .then(res => dispatch('setProject', res));
  },

  publish({ commit, state, dispatch }) {
    API.Publish();
    commit('metadataSetPublishing');
    dispatch('beginCheckStatus');
  },

  getMetadata({ commit, state }) {
    return API.GetProjectMetadata({ ID: state.selectedProject.ID })
    .then(metadata => {
      commit('metadata', metadata);
    });
  },

  beginCheckStatus({ state, commit, dispatch }) {
    let timeout = setTimeout(() => {
      return API.GetProjectMetadata({ ID: state.selectedProject.ID })
      .then(metadata => {
        if (metadata.ProjectStatus === PUBLISH_STATUS.Publishing && state.checkingStatus) {
          dispatch('beginCheckStatus');
        } else {
          commit('metadata', metadata);
        }
      });
    }, 1000);
    commit('updateCheckStatus', timeout);
  },

  cancelCheckStatus({ status, commit }) {
    commit('cancelCheckStatus');
  }

};

const mutations = {
  addActor(state, actor) {
    state.selectedProject.Actors.push(actor);
  },

  selectedProject(state, project) {
    state.selectedProject = project;
  },

  initializing(state, bool) {
    state.initializing = bool;
  },

  setActor(state, actor) {
    let id = -1;
    for (let idx in state.selectedProject.Actors) {
      if (state.selectedProject.Actors[idx].ID === actor.ID) {
        id = idx;
        break;
      }
    }
    if (id > -1) {
      Vue.set(state.selectedProject.Actors, id, actor);
    }
  },

  addZone(state, zone) {
    state.selectedProject.Zones.push(zone);
  },

  metadata(state, metadata) {
    Vue.set(state, 'metadata', metadata);
  },

  metadataSetPublishing(state) {
    Vue.set(state.metadata, 'Status', PUBLISH_STATUS.Publishing);
  },

  updateCheckStatus(state, timeout) {
    Vue.set(state, 'checkingStatus', true);
    Vue.set(state, 'checkStatusTimeout', timeout);
  },

  cancelCheckStatus(state) {
    Vue.set(state, 'checkingStatus', false);
    clearTimeout(state.checkStatusTimeout);
    Vue.set(state, 'checkStatusTimeout', null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
