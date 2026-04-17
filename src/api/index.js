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
  patchPatient: (patientId, data) => patch(URLS.patient.patchPatient.replace('{patient_id}', patientId), data),
  deletePatient: bind(remove, URLS.patient.deletePatient),
}

export const recipe = {
  getAllRecipe: bind(get, URLS.recipe.getAllRecipe),
  postSearchRecipe: bind(post, URLS.recipe.postSearchRecipe),
  patchRecipe: (recipeId, data) => patch(URLS.recipe.patchRecipe.replace('{recipe_id}', recipeId), data),
}

function bind(f, arg) {
  return (...args) => f(arg, ...args)
}
