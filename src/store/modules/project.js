import Vue from 'vue';

import API from '@/api';
import { PUBLISH_STATUS, PROJECT_CATEGORIES } from '@/const';

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
        return API.GetProject({ ID: p.ID })
        .then(newState => dispatch('setProject', newState))
        .then(newState => {
          commit('initializing', false);
        });
      });
  },

  refreshProject({ dispatch, commit, state }) {
    return API.GetProject({ ID: state.selectedProject.ID })
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
    let newProject;
    return API.CreateProject({ project })
      .then(res => {
        newProject = res;
        return dispatch('setProject', res);
      })
      .then(() => newProject);
  },

  publish({ commit, state, dispatch }) {
    commit('metadataSetPublishing');
    API.Publish()
    .then(() => {
      dispatch('beginCheckStatus');
    })
    .catch(() => {
      commit('metadataSetProblem');
    });
  },

  getMetadata({ commit, state, dispatch }) {
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
  },

  startZone({ state, dispatch, commit }, StartZoneID) {
    API.PatchProject({
      project: {
        StartZoneID
      }
    }).then(() => {
      commit('startZone', StartZoneID);
    });
  },

  updateCategory({ state, commit }, Category = PROJECT_CATEGORIES[0]) {
    if (state.selectedProject.Category === Category) return;
    API.PatchProject({
      project: {
        Category
      }
    }).then(() => {
      commit('category', Category);
    });
  },

  updateTags({ state, commit }, Tags = []) {
    let hasNewTag = Tags.length !== (state.selectedProject.Tags || []).length;
    if (!hasNewTag) {
      for (let projectTag of state.selectedProject.Tags) {
        if (!Tags.includes(projectTag)) {
          hasNewTag = true;
          break;
        }
      }
    }
    if (!hasNewTag) return;
    API.PatchProject({
      project: {
        Tags
      }
    }).then(() => {
      commit('tags', Tags);
    });
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

  category(state, category) {
    Vue.set(state.selectedProject, 'Category', category);
  },

  tags(state, tags) {
    Vue.set(state.selectedProject, 'Tags', tags);
  },

  metadataSetPublishing(state) {
    Vue.set(state.metadata, 'Status', PUBLISH_STATUS.Publishing);
  },

  metadataSetProblem(state) {
    Vue.set(state.metadata, 'Status', PUBLISH_STATUS.Problem);
  },

  updateCheckStatus(state, timeout) {
    Vue.set(state, 'checkingStatus', true);
    Vue.set(state, 'checkStatusTimeout', timeout);
  },

  cancelCheckStatus(state) {
    Vue.set(state, 'checkingStatus', false);
    clearTimeout(state.checkStatusTimeout);
    Vue.set(state, 'checkStatusTimeout', null);
  },

  startZone(state, zoneID) {
    Vue.set(state.selectedProject, 'StartZoneID', zoneID);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
