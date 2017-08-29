export const API_URL = 'http://localhost:8000/v1/'

export default {
  GetAuthGoogle ({ token, givenName, familyName }) {
    return fetch(API_URL + `auth/google?token=${token}&gn=${givenName}&fn=${familyName}`)
  }
}
