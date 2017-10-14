import Vue from 'vue';

import store from './store';

export default {
  GetAuthGoogle({ token, givenName, familyName }) {
    return aumFetch('GET', `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`);
  },

  GetProjects() {
    return aumFetch('GET', 'projects');
  },

  GetProject({ ID }) {
    return aumFetch('GET', `project/${ID}`);
  },

  GetActor({ ID }) {
    return aumFetch('GET', `actor/${ID}`)
    .then(result => result.json());
  },

  GetZone({ ID }) {
    return aumFetch('GET', `zone/${ID}`)
    .then(result => result.json());
  },

  PutActor(actor) {
    return aumFetch('PUT', `actor/${actor.ID}`, actor);
  },

  CreateZone({ CreateID, Title }) {
    return aumFetch('PATCH', `project/${store.state.selectedProject.ID}`, {
      Zones: [{
        CreateID,
        Title
      }]
    })
    .then(idMap => idMap.json())
    .then(idMap => ({
      ID: idMap[CreateID],
      Title
    }));
  },

  CreateActor(actor) {
    return aumFetch('PATCH', `project/${store.state.selectedProject.ID}`, {
      Actors: [actor]
    })
    .then(idMap => idMap.json())
    .then(idMap => {
      actor.ID = idMap[actor.CreateID];
      delete actor.CreateID;
      return actor;
    });
  },

  CreateProject(project) {
    return aumFetch('POST', `project`, project)
    .then(result => result.json());
  },

  Publish() {
    return aumFetch('POST', `publish/${store.state.selectedProject.ID}`);
  }
};

function generateHeaders() {
  var myHeaders = new Headers();
  myHeaders.append('content-type', 'application/json');
  if (store.state.token) {
    myHeaders.append('x-token', store.state.token);
  }
  return myHeaders;
}

function aumFetch(method, path, payload) {
  const config = {
    method,
    headers: generateHeaders(),
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };

  let req = new Request(`${process.env.API_URL}${path}`, config);
  return fetch(req).then(result => {
    if (result.status === 401) {
      store.dispatch('unauthorized');
      throw new Error('Unauthorized');
    }
    if (result.status === 404) {
      store.dispatch('NotFound');
    }
    return result;
  }).then(result => {
    Vue.set(store.state, 'token', result.headers.get('x-token'));
    return result;
  });
}
