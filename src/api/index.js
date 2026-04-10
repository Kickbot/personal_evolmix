import { post, get } from './client'
import URLS from './urls.json'

export const auth = {
  login: (data) => post(URLS.auth.login, data, { skipAuthRedirect: true }),
  register: bind(post, URLS.register.createUser),
}

export const user = {
  getCurrent: () => get(URLS.user.getCurrentUser, {}, { skipAuthRedirect: true }),
  getAll: bind(get, URLS.user.getAllUser),
  search: bind(get, URLS.user.getSearchUser),
}

function bind(f, arg) {
  return (...args) => f(arg, ...args)
}
