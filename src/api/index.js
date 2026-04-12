import { post, get, patch, remove } from './client'
import URLS from './urls.json'

export const auth = {
  login: (data) => post(URLS.auth.login, data, { skipAuthRedirect: true }),
  register: bind(post, URLS.register.createUser),
}

export const user = {
  getCurrent: () => get(URLS.user.getCurrentUser, {}, { skipAuthRedirect: true }),
  getAll: bind(get, URLS.user.getAllUser),
  search: bind(get, URLS.user.getSearchUser),
  patchUser: (userId, data) => patch(URLS.user.patchUser.replace('{user_id}', userId), data),
}

export const patient = {
  getAllPatient: bind(get, URLS.patient.getAllPatient),
  getSearchPatient: bind(get, URLS.patient.getSearchPatient),
  getPatientById: bind(get, URLS.patient.getPatientById),
  createPatient: bind(post, URLS.patient.postCreatePatient),
  patchPatient: bind(patch, URLS.patient.patchPatient),
  deletePatient: bind(remove, URLS.patient.deletePatient),
}

function bind(f, arg) {
  return (...args) => f(arg, ...args)
}
