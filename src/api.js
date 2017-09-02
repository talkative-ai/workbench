import store from './store'

export const API_URL = 'http://localhost:8000/v1'

export default {
  GetAuthGoogle ({ token, givenName, familyName }) {
    return aumFetch('GET', `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`)
  },

  GetProjects () {
    return aumFetch('GET', 'projects')
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

function aumFetch (method, path) {
  const config = {
    method,
    headers: generateHeaders(),
    mode: 'cors',
    cache: 'default'
  }

  let req = new Request(`${API_URL}/${path}`, config)
  return fetch(req)
}
