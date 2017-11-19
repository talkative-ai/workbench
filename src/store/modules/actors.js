import API from '@/api';
import router from '@/router';
import { PATCH_ACTION } from '@/const';

const state = {
  actorMap: {},
  actorSelectedDialogID: {}
};

const getters = {
  currentActor: (state, getters, rootState) => {
    if (!rootState.master.selectedEntity) {
      return {};
    }
    return state.actorMap[rootState.master.selectedEntity.data.ID];
  }
};

const actions = {

  async createActor({ commit, state, dispatch }, Actor) {
    Actor.CreateID = await dispatch('generateID');
    let ZoneActors = [];
    let zoneActor;
    if (Actor.ZoneID) {
      zoneActor = {
        ZoneID: Actor.ZoneID,
        ActorID: Actor.CreateID,
        PatchAction: PATCH_ACTION.CREATE
      };
      ZoneActors.push(zoneActor);
    }
    return API.CreateActor({ Actor, ZoneActors })
    .then(idMap => {
      Actor.ID = idMap[Actor.CreateID];
      delete Actor.CreateID;

      Actor.Dialogs = Actor.Dialogs || [];
      Actor.DialogRelations = Actor.DialogRelations || [];
      commit('dialogs/initializeChain', Actor.ID, { root: true });
      commit('project/addActor', Actor, { root: true });
      commit('actorInMap', Actor);
      if (Actor.zoneIDs) {
        for (let ZoneID of Actor.zoneIDs) {
          commit('zones/addActor', { ZoneID, ActorID: Actor.ID }, { root: true });
        }
      }
      commit('newActor', Actor);
      dispatch('master/selectEntity', { kind: 'actor', data: Actor, navigate: true }, { root: true });
      return Actor;
    });
  },

  selectActor({ commit, dispatch, state, rootState }, ActorID) {
    if (rootState.master.selectedEntity.data &&
      rootState.master.selectedEntity.kind === 'actor' &&
      rootState.master.selectedEntity.data.ID === ActorID) return;
    const actor = state.actorMap[ActorID];
    if (!actor) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetActor(actor)
    .then(actor => {
      commit('dialogs/clearView', ActorID, { root: true });

      // Set default values because the API may return nil
      actor.Dialogs = actor.Dialogs || [];
      actor.DialogRelations = actor.DialogRelations || [];

      commit('project/setActor', actor, { root: true });

      let rdialogs = new Set();

      // Prepare the dialog map and root dialogs
      for (const d of actor.Dialogs) {
        d.ID = d.ID.toString();
        d.ParentDialogIDs = d.ParentDialogIDs || [];
        d.ChildDialogIDs = d.ChildDialogIDs || [];
        commit('dialogs/dialogInMap', d, { root: true });
        if (d.IsRoot) {
          rdialogs.add(d.ID);
        }
      }

      // Build dialog graph
      // In other words, construct dialog relations
      for (const r of actor.DialogRelations) {
        commit('dialogs/relation', { parentID: r.ParentNodeID, childID: r.ChildNodeID }, { root: true });
      }

      commit('dialogs/rootDialogs', [...rdialogs], { root: true });
      dispatch('master/selectEntity', { kind: 'actor', data: actor }, { root: true });
    });
  }

};

const mutations = {

  actorInMap(state, actor) {
    state.actorMap[actor.ID] = actor;
  },

  addToZone(state, { ZoneID, ActorID }) {
    if (!state.actorMap[ActorID].zoneIDs) {
      state.actorMap[ActorID].zoneIDs = {};
    }
    state.actorMap[ActorID].zoneIDs[ZoneID] = true;
  },

  removeFromZone(state, { ZoneID, ActorID }) {
    if (!state.actorMap[ActorID].zoneIDs) {
      state.actorMap[ActorID].zoneIDs = {};
    }
    if (state.actorMap[ActorID].zoneIDs[ZoneID]) {
      state.actorMap[ActorID].zoneIDs[ZoneID] = false;
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
