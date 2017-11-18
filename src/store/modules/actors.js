import Vue from 'vue';

import API from '@/api';
import router from '@/router';
import { PATCH_ACTION } from '@/const';

const state = {
  actorMap: {},
  actorSelectedDialogID: {}
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
      zoneActor.ActorID = idMap[Actor.CreateID];
      delete Actor.CreateID;

      Vue.set(state.dialogChain, Actor.ID, []);
      Actor.Dialogs = Actor.Dialogs || [];
      Actor.DialogRelations = Actor.DialogRelations || [];
      commit('addActor', Actor);
      commit('selectEntity', { kind: 'actor', data: Actor, redirect: true });
      return Actor;
    });
  },

  selectActor({ commit, state }, actorID) {
    if (state.selectedEntity.data && state.selectedEntity.kind === 'actor' && state.selectedEntity.data.ID === actorID) return;
    const actor = state.actorMap[actorID];
    if (!actor) {
      router.push({ name: 'NotFound' });
      return;
    }
    return API.GetActor(actor)
    .then(actor => {
      commit('updateActor', { actor });
      commit('selectEntity', { kind: 'actor', data: actor });
    });
  }

};

const mutations = {

  addActor(state, actor) {
    state.selectedProject.Actors.push(actor);
    Vue.set(state.actorMap, actor.ID, actor);
    if (actor.zoneIDs) {
      for (let zoneID of actor.zoneIDs) {
        if (!state.zoneActors[zoneID]) {
          Vue.set(state.zoneActors, zoneID, {});
        }
        Vue.set(state.zoneActors[zoneID], actor.ID, true);
      }
    }
  },

  actorInMap(state, actor) {
    state.actorMap[actor.ID] = actor;
  },

  updateActor(state, payload) {
    payload.actor.Dialogs = payload.actor.Dialogs || [];
    payload.actor.DialogRelations = payload.actor.DialogRelations || [];
    if (!state.dialogChain[payload.actor.ID]) {
      Vue.set(state.dialogChain, payload.actor.ID, []);
    }
    Vue.set(state, 'rootDialogs', []);
    Vue.set(state, 'dialogMap', {});
    Vue.set(state, 'dialogSiblings', []);

    let id = 0;
    for (let idx in state.selectedProject.Actors) {
      if (state.selectedProject.Actors[idx].ID === payload.actor.ID) {
        id = idx;
        break;
      }
    }
    Vue.set(state.selectedProject.Actors, id, payload.actor);
    let rdialogs = new Set();

    // Prepare the dialog map and root dialogs
    for (const d of payload.actor.Dialogs) {
      d.ID = d.ID.toString();
      d.ParentDialogIDs = d.ParentDialogIDs || [];
      d.ChildDialogIDs = d.ChildDialogIDs || [];
      Vue.set(state.dialogMap, d.ID, d);
      if (d.IsRoot) {
        rdialogs.add(d.ID);
      }
    }

    // Build dialog graph
    // In other words, construct dialog relations
    for (const r of payload.actor.DialogRelations) {
      let prepend = state.dialogMap[r.ParentNodeID].ChildDialogIDs || [];
      Vue.set(state.dialogMap[r.ParentNodeID], 'ChildDialogIDs', [...prepend, r.ChildNodeID.toString()]);

      prepend = state.dialogMap[r.ChildNodeID].ParentDialogIDs || [];
      Vue.set(state.dialogMap[r.ChildNodeID], 'ParentDialogIDs', [...prepend, r.ParentNodeID.toString()]);
    }

    state.rootDialogs = [...rdialogs];
  },

  addToZone(state, { zoneID, actorID }) {
    if (!state.actorMap[actorID].zoneIDs) {
      state.actorMap[actorID].zoneIDs = {};
    }
    state.actorMap[actorID].zoneIDs[zoneID] = true;
  },

  removeFromZone(state, { zoneID, actorID }) {
    if (!state.actorMap[actorID].zoneIDs) {
      state.actorMap[actorID].zoneIDs = {};
    }
    if (state.actorMap[actorID].zoneIDs[zoneID]) {
      state.actorMap[actorID].zoneIDs[zoneID] = false;
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
