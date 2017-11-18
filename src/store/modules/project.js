import router from '@/router';
import API from '@/api';

const state = {
  initializing: true,
  selectedProject: null
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

  createProject({ dispatch, state }, project) {
    return API.CreateProject(project)
      .then(res => dispatch('setProject', res));
  }
};

const mutations = {
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
      state.selectedProject.Actors[id] = actor;
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
