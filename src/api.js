import store from './store'

export const API_URL = 'http://localhost:8000/v1'

export default {
  GetAuthGoogle ({ token, givenName, familyName }) {
    return aumFetch('GET', `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`)
  },

  GetProjects () {
    return aumFetch('GET', 'projects')
  },

  GetProject ({ ID }) {
    return aumFetch('GET', `project/${ID}`)
  },

  CreateZone ({ CreateID, Title }) {
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
    }))
  }
}

function generateHeaders () {
  var myHeaders = new Headers()
  myHeaders.append('content-type', 'application/json')
  if (store.state.token) {
    myHeaders.append('x-token', store.state.token)
  }
  return myHeaders
}

function aumFetch (method, path, payload) {
  const config = {
    method,
    headers: generateHeaders(),
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  }

  let req = new Request(`${API_URL}/${path}`, config)
  return fetch(req)
}
